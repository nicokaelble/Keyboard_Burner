import functools

from flask import (
    Blueprint, flash, g, redirect, render_template, request, session, url_for
)
from werkzeug.security import check_password_hash, generate_password_hash

from flaskr.db import get_db

# create blueprint named 'auth'
bp = Blueprint('typingtest', __name__, url_prefix='/typingtest')

@bp.route('/settings', methods=('GET', 'POST'))
def settings():
    if request.method == 'POST':
        return redirect(url_for('typingtest.test'))
    
    secs = []
    for i in range(30,301,30):
        secs.append(i)

    return render_template('typingtest/settings.html', secs=secs)

@bp.route('', methods=('GET', 'POST'))
@bp.route('/', methods=('GET', 'POST'))
@bp.route('/test', methods=('GET', 'POST'))
def test():
    typingtests = get_db().execute(
        'SELECT *'
        'FROM testresult t JOIN user u ON t.userId = u.id'
        #'ORDER BY testdate'
    ).fetchall()

    if request.method == 'POST':
        timerStartigValue = request.form.get('timerSecs')
        return render_template('/typingtest/test.html', timerStartigValue=timerStartigValue, typingtests=typingtests)
    
    return render_template('/typingtest/test.html', typingtests=typingtests)

@bp.route('/result' , methods=('GET', 'POST'))
def result():
    if request.method == 'POST':
        speed = int(request.form['speed'])
        correctCharacters = int(request.form['correctCharacters'])
        backspaceCount = int(request.form['backspaceCount'])
        testDuration = int(request.form['testDuration'])
        accuracy = float(request.form['accuracy'])
        round(accuracy, 2)

        db = get_db()
# CREATE TABLE testresult(
#   testdate TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
#   userId INTEGER NOT NULL,
#   characters INTEGER NOT NULL,
#   mistakes INTEGER NOT NULL,
#   duration INTEGER NOT NULL,
#   speed INTEGER NOT NULL,
#   accuracy DOUBLE NOT NULL,
#   FOREIGN KEY (userId) REFERENCES user (id)
# );

        db.execute(
            'INSERT INTO testresult (userId, characters, mistakes, duration, speed, accuracy)'
            'VALUES (?, ?, ?, ?, ?, ?)',
            (g.user['id'], correctCharacters, backspaceCount, testDuration, speed, accuracy)
        )
        db.commit()
        
        return render_template('/typingtest/result.html', speed=speed, correctCharacters=correctCharacters, 
        backspaceCount=backspaceCount, testDuration=testDuration, accuracy=accuracy)

    return render_template('/typingtest/result.html')

@bp.before_app_request
def load_logged_in_user():
    user_id = session.get('user_id')

    # check if a user is logged in in the current session
    if user_id is None:
        g.user = None
    else:
        g.user = get_db().execute(
            'SELECT * FROM user WHERE id = ?', (user_id,)
        ).fetchone()

# function to manage views for which a login is required
def login_required(view):
    @functools.wraps(view)
    def wrapped_view(**kwargs):
        if g.user is None:
            return redirect(url_for('auth.login'))

        return view(**kwargs)

    return wrapped_view
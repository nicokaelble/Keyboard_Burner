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
        ' FROM testresult t LEFT JOIN user u ON t.userId = u.id'
        ' ORDER BY t.speed DESC'
    ).fetchall()

    if request.method == 'POST':

        if request.form.get('timerSecs'):
            #POST came from settings
            timerStartigValue = request.form.get('timerSecs')

            return render_template('/typingtest/test.html', timerStartigValue=timerStartigValue, typingtests=typingtests)
        else:
            # POST came from test itself and offers form inputs with speed, correct Characters, accuracy...
            # that should be saved to the database
            speed = int(request.form['speed'])
            correctCharacters = int(request.form['correctCharacters'])
            backspaceCount = int(request.form['backspaceCount'])
            testDuration = int(request.form['testDuration'])
            accuracy = float(request.form['accuracy'])
            round(accuracy, 2)

            db = get_db()
            # CREATE TABLE testresult(
            #   testdate TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            #   userId INTEGER,
            #   characters INTEGER NOT NULL,
            #   mistakes INTEGER NOT NULL,
            #   duration INTEGER NOT NULL,
            #   speed INTEGER NOT NULL,
            #   accuracy DOUBLE NOT NULL,
            #   FOREIGN KEY (userId) REFERENCES user (id)
            # );    
            if g.user is not None:
                #user is logged in
                userId = g.user['id']

                #insert test result with userId
                db.execute(
                'INSERT INTO testresult (userId, characters, mistakes, duration, speed, accuracy)'
                'VALUES (?, ?, ?, ?, ?, ?)',
                (userId, correctCharacters, backspaceCount, testDuration, speed, accuracy)
                )
                db.commit()
            else:
                #no user is logged in
                print("No user loggid in... write to db")
                #insert test result without id
                db.execute(
                'INSERT INTO testresult (characters, mistakes, duration, speed, accuracy)'
                'VALUES ( ?, ?, ?, ?, ?)',
                (correctCharacters, backspaceCount, testDuration, speed, accuracy)
                )
                db.commit()
                print(backspaceCount)
            return render_template('/typingtest/test.html', typingtests=typingtests, speed=speed, correctCharacters=correctCharacters, 
                backspaceCount=backspaceCount, testDuration=testDuration, accuracy=accuracy)  
    
    # Just Get
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
#   userId INTEGER,
#   characters INTEGER NOT NULL,
#   mistakes INTEGER NOT NULL,
#   duration INTEGER NOT NULL,
#   speed INTEGER NOT NULL,
#   accuracy DOUBLE NOT NULL,
#   FOREIGN KEY (userId) REFERENCES user (id)
# );    
        if g.user is not None:
            #user is logged in
            userId = g.user['id']

            #insert test result with userId
            db.execute(
            'INSERT INTO testresult (userId, characters, mistakes, duration, speed, accuracy)'
            'VALUES (?, ?, ?, ?, ?, ?)',
            (userId, correctCharacters, backspaceCount, testDuration, speed, accuracy)
            )
            db.commit()
        else:
            #no user is logged in
            print("No user loggid in... write to db")
            #insert test result without id
            db.execute(
            'INSERT INTO testresult (characters, mistakes, duration, speed, accuracy)'
            'VALUES ( ?, ?, ?, ?, ?)',
            (correctCharacters, backspaceCount, testDuration, speed, accuracy)
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
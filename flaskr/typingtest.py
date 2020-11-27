import functools

from flask import (
    Blueprint, flash, g, redirect, render_template, request, session, url_for
)
from werkzeug.security import check_password_hash, generate_password_hash

from datetime import datetime

from flaskr.db import get_db

# create blueprint named 'auth'
bp = Blueprint('typingtest', __name__, url_prefix='/typingtest')

@bp.route('/result', methods=('GET', 'POST'))
def result():
    if request.method == 'POST':
        speed = int(request.form['speed'])
        correctCharacters = int(request.form['correctCharacters'])
        mistakes = int(request.form['mistakes'])
        testDuration = int(request.form['testDuration'])
        accuracy = float(request.form['accuracy'])
        date = request.form['date']


    return render_template('typingtest/result.html', speed=speed, correctCharacters=correctCharacters, 
                mistakes=mistakes, testDuration=testDuration, accuracy=accuracy, date=date)

@bp.route('/settings', methods=('GET', 'POST'))
def settings():
    if request.method == 'POST':
        return redirect(url_for('typingtest.test'))
    
    secs = [15,    ]
    for i in range(30,301,30):
        secs.append(i)

    return render_template('typingtest/settings.html', secs=secs)

@bp.route('', methods=('GET', 'POST'))
@bp.route('/', methods=('GET', 'POST'))
@bp.route('/test', methods=('GET', 'POST'))
def test():
    # get the top speeds of each user ordered by speed descendent
    typingtests = get_db().execute(
        'SELECT username,  speed, duration, mistakes, characters, accuracy, testdate, Max(t.speed)' 
        ' FROM testresult t LEFT JOIN user u ON t.userId = u.id'
        ' WHERE username != "unknown"'
        ' GROUP BY username'
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
            mistakes = int(request.form['mistakes'])
            testDuration = int(request.form['testDuration'])
            accuracy = float(request.form['accuracy'])
            accuracy = round(accuracy, 2)

            dateString = getCurrentDatetimeAsString()
            # print("[POST] from /typingtest/test to typingtest/tes" +
            #     "\nAccuracy: " + str(accuracy) +
            #     "\nSpeed:" + str(speed) +
            #     "\nChorrectCharacters: " + str(correctCharacters) +
            #     "\nmistakes: " + str(mistakes) +
            #     "\ntestDuration: " + str(testDuration))
            
            
            db = get_db()
 
            if g.user is not None:
                #user is logged in
                userId = g.user['id']

                #insert test result WITH userId
                db.execute(
                'INSERT INTO testresult (testdate, userId, characters, mistakes, duration, speed, accuracy)'
                'VALUES (?, ?, ?, ?, ?, ?, ?)',
                (dateString, userId, correctCharacters, mistakes, testDuration, speed, accuracy)
                )
                db.commit()
            else:
                #no user is logged in
                # print("No user loggid in... write to db")

                #insert test result WITHOUT id
                db.execute(
                'INSERT INTO testresult (testdate, characters, mistakes, duration, speed, accuracy)'
                'VALUES (?, ?, ?, ?, ?, ?)',
                (dateString, correctCharacters, mistakes, testDuration, speed, accuracy)
                )
                db.commit()
                # print(mistakes)

            return render_template('/typingtest/test.html', typingtests=typingtests, speed=speed, correctCharacters=correctCharacters, 
                mistakes=mistakes, testDuration=testDuration, accuracy=accuracy)  
    
    # Just Get
    return render_template('/typingtest/test.html', typingtests=typingtests)

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

def getCurrentDatetimeAsString():

    now = datetime.now() # current date and time

    year = now.strftime("%Y")
    month = now.strftime("%B")
    day = now.strftime("%d")
    hour = now.strftime("%H")
    min = now.strftime("%M")

    date = hour + ":" + min + " " + day + "th " + month + " " + year

    print(date)

    return date

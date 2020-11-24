import functools

from flask import (
    Blueprint, flash, g, redirect, render_template, request, session, url_for
)
from werkzeug.security import check_password_hash, generate_password_hash

from flaskr.db import get_db

# create blueprint named 'auth'
bp = Blueprint('auth', __name__, url_prefix='/auth')

#page that manages the registration of a user
@bp.route('/register', methods=('GET', 'POST'))
def register():
    username=""
    # if POST: validate registration data (if necessary show error message), add new user to database and redirect to login page
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        password_confirmation = request.form['password_confirmation']
        db = get_db()
        error = False

        # check if a username is entered
        if (username == ""):
            flash('Username is required','error')
            error = True

        # check if a password is entered
        if not password:
            flash('Password is required','error')
            error = True
        elif(len(password) < 8):
                flash("Password should be minimum 8 digits long",'error')
                error = True
        
        # check if password confirmation was entered
        if not password_confirmation:
            flash('Password confirmation is required','error')
            error = True
        
        # check if passwords are matching
        if(len(password) > 0 and len(password_confirmation) > 0 and password != password_confirmation):
            flash('Passwords do not match','error')
            error  = True

        # check if user is already existing
        if db.execute(
            'SELECT id FROM user WHERE username = ?', (username,)
        ).fetchone() is not None:
            flash('User {} is already registered'.format(username),'error')
            error = True

        # if there where no errors add new user to database with a hashed password
        if error== False:
            db.execute(
                'INSERT INTO user (username, password) VALUES (?, ?)',
                (username, generate_password_hash(password))
            )
            db.commit()

             # get user by username
            user = db.execute(
            'SELECT * FROM user WHERE username = ?', (username,)
            ).fetchone()

            session.clear()
            session['user_id'] = user['id']

            flash('You have successfully registered and were automatically logged in ;)','success')

            return redirect(url_for('home'))


    # if GET: render registration page
    return render_template('auth/register.html',username=username)

# page that manages the user login
@bp.route('/login', methods=('GET', 'POST'))
def login():
    username = ""
    # if POST: validate login data (if necessary show error message), create new session and redirect to index html
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        db = get_db()
        error = False

        # get user by username
        user = db.execute(
            'SELECT * FROM user WHERE username = ?', (username,)
        ).fetchone()
        # handle: user doesn't exist
        if user is None:
            flash("Username doesn't exist",'error')
            error = True
        # handle: passwort incorrect
        elif not check_password_hash(user['password'], password):
            flash("Incorrect Password")
            error = True

        # write user to session if loggin was successful
        if (error == False):
            # flash message using category = 'success'
            
            session.clear()
            session['user_id'] = user['id']
            flash('You logged in successfully!', 'success')
            return redirect(url_for('home'))

    # if GET: reder login page
    return render_template('auth/login.html', username=username)

# page to logout and redirect to index page
@bp.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('home'))

# function that is called at the beginning of a request and makes the information about the logged in user available to other views
@bp.before_app_request
def load_logged_in_user():
    # get user_id from session
    user_id = session.get('user_id')

    # check if a user registered in session
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

import sqlite3

import click
from flask import current_app, g
from flask.cli import with_appcontext

# initialize database
def init_db():
    db = get_db()

    # open schema.sql relative to flaskr package 
    with current_app.open_resource('schema.sql') as f:
        db.executescript(f.read().decode('utf8'))

# close database
def close_db(e=None):
    # remove datebase from g object 
    db = g.pop('db', None)

    if db is not None:
        db.close()

# register function close_db() and init_db_command() with the passed application instance 
def init_app(app):
    app.teardown_appcontext(close_db)
    app.cli.add_command(init_db_command)

# return database
def get_db():
    if 'db' not in g:
        # add datebase to g object
        g.db = sqlite3.connect(
            current_app.config['DATABASE'],
            detect_types=sqlite3.PARSE_DECLTYPES
        )
        g.db.row_factory = sqlite3.Row

    return g.db

# command to reset/initialize the database (via commandline: flask init-db)
@click.command('init-db')
@with_appcontext
def init_db_command():
    """Clear the existing data and create new tables."""
    init_db()
    click.echo('Initialized the database.')
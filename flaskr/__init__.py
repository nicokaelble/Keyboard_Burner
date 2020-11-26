import os

from flask import Flask, render_template, request 


def create_app(test_config=None):
    # create and configure the app
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_mapping(
        SECRET_KEY=b"\x01^\xac\x90,\x1cQ\xf8'\xc6\xf2wiOX\xb9",
        DATABASE=os.path.join(app.instance_path, 'flaskr.sqlite'),
    )

    if test_config is None:
        # load the instance config, if it exists, when not testing
        app.config.from_pyfile('config.py', silent=True)
    else:
        # load the test config if passed in
        app.config.from_mapping(test_config)

    # ensure the instance folder exists
    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass

    @app.route('/')
    @app.route('/home')
    def home():
        return render_template('/home.html')

    @app.route('/about')
    def about():
        return render_template('/about.html')



    # import and inizialize the database
    from . import db
    db.init_app(app)

    # register blueprint for athentification
    from . import auth
    app.register_blueprint(auth.bp)

    # register blueprint for typing test
    from . import typingtest
    app.register_blueprint(typingtest.bp)

    return app
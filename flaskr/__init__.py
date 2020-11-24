import os

from flask import Flask, render_template, request 


def create_app(test_config=None):
    # create and configure the app
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_mapping(
        SECRET_KEY='dev',
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

    # a simple page that says hello
    @app.route('/hello')
    def hello():
        return 'Hello, World!'

    @app.route('/base')
    def base():
        return render_template('/base.html')

    @app.route('/home')
    def home():
        return render_template('/home.html')

    @app.route('/about')
    def about():
        return render_template('/about.html')

    @app.route('/profile')
    def profile():
        return render_template('/profile.html')

    # @app.route("/test" , methods=['GET', 'POST'])
    # def test():
    #     select = request.form.get('comp_select')
    #     print(select)
    #     return render_template('/typingtest/test.html', select=select) # just to see what select is

    @app.route('/')
    def index():
        secs = []
        for i in range(30,301,30):
            secs.append(i)
        return render_template('/index.html',secs=secs)

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
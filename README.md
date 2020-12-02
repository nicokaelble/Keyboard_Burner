# Keyboard_Burner

Keyboard Burner is a website project that was made to improve the users typing speed by typing funny and famous quotes.

The website was developed as part of a coursework for the module Advanced Web Technology at the Edinburgh Napier University.

According to the coursework specifications this website was developed under the topic "Online Education Technologies" and with the use of the micro web framework flask.

It also is my first website project, so if you dicover any bugs or you have any suggestions for improvement please send me a mail at nicokaelble@gmail.com :)

To setup the project on a virtual linux machine simply follow the itroduction below.

1.	Log into your virtual machine (I used PuTTY) and use the following command to clone Keyboard Burner from GitHub in the directory you want
    >> git clone https://github.com/nicokaelble/Keyboard_Burner.git
2.	Navigate into the created Keyboard_Burner folder using
    >> cd Keyboard_Burner
3.	Create a virtual environment (named “env” in this case) using
    >> virtualenv env
4.	Activate the environment
    >> source env/bin/activate
5.	Install Flask using Pip
    >> pip3 install flask
6.	Install Waitress using Pip
    >> pip3 install waitress
7.	Install Screen to later open a screen session which will host the application using Waitress
    >> sudo apt install screen
8.	Start a Screen session and call it something descriptive (in this case “Hosting_Keyboard_Burner”)
    >> screen -S Hosting_Keyboard_Burner
9.	Tell your terminal the application to work with by exporting the FLASK_APP environment variable
    >> export FLASK_APP=flaskr
10.	Initialize the Database
    >> flask init-db
11.	Tell Waitress to import and call the application factory to get an application object (the app should now run on “0.0.0.0:8080” per default)
    >> waitress-serve --call 'flaskr:create_app'
12.	Press crtl+a d to detach from your screen session (now you could close your PuTTY-window and the server will continue running) 
13.	To stop the server simply reattach to your screen session using
    >> screen -r





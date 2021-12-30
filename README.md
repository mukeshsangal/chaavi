# chaavi

Brief description of project
The project is a lighter App for Moodle, compared to the Moodle official App.
It is build on the Ionic-Angular-Capacitor framework. It connects to a Moodle server (currently on Google Cloud) and enables the following functionality
a. Attending Video classes (using BigBlueButton, called BBB henceforth, which is currently on a Test Sever provided by Blindside Networks)
b. Viewing Course details like Activities of the Course
c. Submitting Files for Assignment activities
d. Viewing other course content: Files and H5P
e. H5P is to be used as a prominent mechanism for putting up Interactive Content

The App expects a Student to login using a username/pwd which is the same as the username/pwd for the Student on Moodle server.
Currently Users and Courses are setup on the Moodle server using the Browser interface. Moodle server is at: https://chaavi.in/moodle/
Reach out to Sreekanth for username/pwd on the server and for the App.

Moodle Server enables the following using the Standard Moodle installation (no changes as of Dec 2021):
a. User creation
b. Course creation
c. Course content upload: Files, H5P, Assignments, BBB sessions etc
d. Tutor has to login to BBB session using Moodle server login and only then Student can join BBB video session. (else student get's a message saying "Class not started".




Broad requirements
Installation
Running the app

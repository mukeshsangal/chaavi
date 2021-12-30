# NLightN App (currently called Chaavi, name needs to change)

**Brief description of project**
This code project is nothing but a lighter App for Moodle (lighter in functionality compared to the Moodle official App).
It is build on the Ionic-Angular-Capacitor framework. It connects to a Moodle server (currently on Google Cloud) and enables the following functionality
a. Attending Video classes (using BigBlueButton, called BBB henceforth, which is currently on a Test Sever provided by Blindside Networks)
b. Viewing Course details like Activities of the Course
c. Submitting Files for Assignment activities
d. Viewing other course content: Files and H5P
e. H5P is to be used as a prominent mechanism for putting up Interactive Content

The App expects a Student to login using a username/pwd which is the same as the username/pwd for the Student on Moodle server.
Users and Courses are setup on the Moodle server using the Browser interface. Moodle server is at: https://chaavi.in/moodle/
Reach out to Sreekanth for username/pwd on the server and for the App.

Moodle Server enables the following using the Standard Moodle installation (no changes as of Dec 2021):
a. User creation
b. Course creation
c. Course content upload: Files, H5P, Assignments, BBB sessions etc
d. Tutor has to login to BBB session using Moodle server login and only then Student can join BBB video session. (else student get's a message saying "Class not started".


**Broad requirements**
1. Ionic framework with Capacitor
2. Access to the GitHub project
3. Android Studio
4. Emulator for Android mobile or better a Mobile device with 
**Installation**
1. Install Ionic: https://ionicframework.com/docs/v1/guide/installation.html (Capacitor documentation says Capacitor now comes by default with Ionic, if so Capacitor need not be separately installed)
2. Clone this project from GitHub as an Ionic app

Running the app

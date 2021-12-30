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

1. Ionic framework with Capacitor (Ionic version: 6.18.0)

2. Access to the GitHub chaavi project

3. Android Studio (Arctic Fox | 2020.3.1 Patch 2)

4. Gradle version 7.0; Android Gradle Plugin 4.2.1

5. Android SDK 10.0 - API level 29

6. Emulator for Android mobile (API 28; Example of model Pixel 2)or even better an Android Mobile device (I have only used it with Android 10)


**Installation**

1. Install Ionic: https://ionicframework.com/docs/v1/guide/installation.html (Capacitor documentation says Capacitor now comes by default with Ionic, if so Capacitor need not be separately installed)

2. Clone this project from GitHub as an Ionic app

3. To view on Web Browser (native functions have been used for Files and Video call which don't work on Web as of now)
    Command for Ionic CLI: ionic serve

4. To install on Mobile:

    on Ionic CLI: ionic capacitor sync

    Then in Android Studio:
    
    Open the project
    
    Select the desired Target Device from the Available Devices dropdown: either Mobile or Emulator
    
    Run 'app' to Build and Install and Launch on target device
    

**Running the app**

1. Once the App launches use the username/pwd to Login (Reach out to Sreekanth for the credentials)

2. Tab 1: Action items are listed here

    a. If it shows Submit Assignment, try submitting a File
    
    b. It it says Join Class
    
        go to https://chaavi.in/moodle/ and login as Tutor (Reach out to Sreekanth for the credentials)
        
        then Join Class as Tutor at Server end using a laptop
        
        Then Click Join Class on the App and join as student. Checkout if Audio and Video are working fine from both ends.

4. Tab 2: Has Activities of all Courses listed

    a. Choose a Course: Choose Foundational learning course as it has more activities added
    
    b. View the Activities
    
        Try opening a File activity
        
        Try submitting an Assignment file (same as from Tab 1)
        
        Try joining a Video class (BBB Activity) (same as from Tab 1)
        
        Try opening an H5P activity

5. Tab 3: Currently has few features listed but not implemented

      Try Logout from here

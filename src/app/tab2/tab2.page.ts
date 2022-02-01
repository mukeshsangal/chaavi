import { Component } from '@angular/core';
import { CallMoodleWsService } from '../services/call-moodle-ws.service';

import { Courses } from '../models/courses';
import { CourseDetails } from '../models/course-details';
import { CourseModules } from '../models/course-modules';
import { H5pActivities } from '../models/h5p-activities';

import { FileOpener } from '@ionic-native/file-opener/ngx';
import { File, IWriteOptions } from '@ionic-native/file/ngx';
import { HTTP } from '@ionic-native/http/ngx';

import { Zip } from '@ionic-native/zip/ngx';

import { NavController } from '@ionic/angular';
import { NavigationExtras, Router } from '@angular/router';

import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { Http, HttpResponse } from '@capacitor-community/http';
import { Platform } from '@ionic/angular';
import { retry, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

import { Diagnostic } from '@ionic-native/diagnostic/ngx';

import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { EnvService } from '../services/env.service';
import { param } from 'jquery';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
})

//As of now the most important Tab Page which displays all Course details
export class Tab2Page {
  coursesData: Courses[];
  chosenCourseSummary: String = '';
  chosenCourseFullName: String = '';
  chosenCourseId;
  detailsData: [];
  courseDetailsData: CourseDetails[];
  h5pActivities: H5pActivities[];
  currentLevel: String = '';

  constructor(
    private callMoodleWs: CallMoodleWsService,
    private file: File,
    private fileOpener: FileOpener,
    private http: HTTP,
    private zip: Zip,
    private navCtrl: NavController,
    private platform: Platform,
    private httpClient: HttpClient,
    private iab: InAppBrowser,
    private diagnostic: Diagnostic,
    private androidPermissions: AndroidPermissions,
    private router: Router,
    public envService: EnvService
  ) {}

  ionViewWillEnter() {
    // Used ionViewWillEnter as ngOnInit is not
    // called due to view persistence in Ionic
    this.getAllCourses();
  }

  //Get list of Courses enrolled by User and list in a Dropdown
  getAllCourses() {
    //Get list of courses for the user
    const paramString = '&userid=' + this.envService.MOODLE_USER_ID;
    this.callMoodleWs
      .callWS('core_enrol_get_users_courses', paramString)
      .subscribe((response) => {
        console.log(response);
        this.coursesData = response;
      });
  }

  // Filter modules
  filterModules(modules, levelId) {
    let currentModule = null;

    return modules.filter((x) => {
      if (currentModule) {
        return false;
      }

      if (
        !currentModule &&
        x.modname === 'h5pactivity' &&
        x.completiondata.state == 0
      ) {
        this.currentLevel = levelId;
        console.log(this.currentLevel, 'CurrentLevel');
        currentModule = x.id;
        return true;
      }

      return false; //x.modname === 'h5pactivity' && x.completiondata.state == 0;
    });
  }
  //Function executes when a Course is selected. Displays Course details.
  onCourseChange(event) {
    //Id, Summary and Name of chosen course is stored for use at various points
    this.chosenCourseId = this.coursesData.filter(
      (x) => x.id == event.detail.value
    )[0].id;
    this.chosenCourseSummary = this.coursesData
      .filter((x) => x.id == event.detail.value)[0]
      .summary.replace(/<\/?[^>]+(>|$)/g, '');
    this.chosenCourseFullName = this.coursesData.filter(
      (x) => x.id == event.detail.value
    )[0].fullname;
    this.currentLevel = null;
    //Call Moodle WS to get details fo Chosen Course
    const paramString =
      '&courseid=' +
      this.coursesData.filter((x) => x.id == event.detail.value)[0].id;
    this.callMoodleWs
      .callWS('core_course_get_contents', paramString)
      .subscribe((response) => {
        const courseDetailsData = response.splice(1);
        // console.log(JSON.stringify(courseDetailsData));
        this.courseDetailsData = courseDetailsData
          .map((element) => {
            // Check for Current Level If exist then return empty array else return modules.
            const modules = this.currentLevel ? [] : element.modules;
            const filteredModules = this.filterModules(modules, element.id);
            console.log(filteredModules, 'Filtered Nodules');
            return {
              ...element,
              modules: filteredModules,
            };
          })
          .filter((element) => {
            return element.modules.length;
          });

        for (let i = 0; i < this.courseDetailsData.length; i++) {
          this.courseDetailsData[0].summary =
            this.courseDetailsData[0].summary.replace(/<\/?[^>]+(>|$)/g, '');
        }

        //console.log(this.courseDetailsData);
      });
  }

  toArray(courseModules: object) {
    return Object.keys(courseModules).map((key) => courseModules[key]);
  }

  //Function executed when User clicks on an Activity/Module within the Course
  onModuleClick(i, j) {
    var filepath = '';
    //If the Course->Activity is a File Activity
    //then download the File and
    //send to Appropriate app like Google Drive App
    if (this.courseDetailsData[i].modules[j].modname == 'resource') {
      const url =
        this.courseDetailsData[i].modules[j].contents[0].fileurl +
        '&token=' +
        this.envService.MOODLE_USER_TOKEN;
      console.log('url: ', url);
      filepath = this.file.dataDirectory + 'test.pdf';
      console.log('filepath: ', filepath);

      this.http
        .downloadFile(url, {}, {}, filepath)
        .then((response) => {
          console.log('file downloaded: ', response);

          this.fileOpener
            .open(filepath, 'application/pdf')
            .then(() => console.log('File opened'))
            .catch((e) => console.log(e));
        })
        .catch((err) => {
          console.log('error: ', err.status);
          console.log('error: ', err.error);
        });

      //If the Course->Activity is an H5P Activity
      //then download the H5P File and
      //Play the file
    } else if (this.courseDetailsData[i].modules[j].modname == 'h5pactivity') {
      //Get H5P file URLs
      console.log('implementing h5p');
      // let details = navigator.userAgent;

      // /* Creating a regular expression
      //   containing some mobile devices keywords
      //   to search it in details string*/
      // let regexp = /android|iphone|kindle|ipad/i;

      // /* Using test() method to search regexp in details
      //   it returns boolean value*/
      // let isMobileDevice = regexp.test(details);

      // if (isMobileDevice) {
      //   console.log('You are using a Mobile Device');
      // } else {
      //   console.log('You are using Desktop');
      // }
      const paramString = '&courseids[0]=' + this.chosenCourseId;
      this.callMoodleWs
        .callWS('mod_h5pactivity_get_h5pactivities_by_courses', paramString)
        .subscribe((response) => {
          console.log(response, 'files responses');
          this.h5pActivities = response.h5pactivities;
          const chosenH5PActivity = this.h5pActivities.filter(
            (x) => x.coursemodule == this.courseDetailsData[i].modules[j].id
          );
          console.log(
            'chosen h5p filename: ' + chosenH5PActivity[0].package[0].filename
          );
          filepath = '';

          //Download H5P file that is clicked
          const url =
            chosenH5PActivity[0].package[0].fileurl +
            '?token=' +
            this.envService.MOODLE_USER_TOKEN;
          console.log('h5p file url: ', url);
          filepath =
            this.file.dataDirectory + chosenH5PActivity[0].package[0].filename;
          console.log('full filepath: ', filepath);

          this.http
            .downloadFile(url, {}, {}, filepath)
            .then((response) => {
              console.log('h5p file downloaded: ', response);
              //H5P files are Zip files. So Unzip the file first
              this.zip
                .unzip(filepath, this.file.dataDirectory + 'h5p', (progress) =>
                  console.log(
                    'Unzipping, ' +
                      Math.round((progress.loaded / progress.total) * 100) +
                      '%'
                  )
                )
                .then((result) => {
                  if (result === 0) {
                    console.log('Unzip SUCCESS');

                    //Call the  h5p-standalone plugin to play H5P
                    //after setting options like pointing to H5P file folder
                    let navigationExtras: NavigationExtras = {
                      queryParams: {
                        h5pFolderPath: JSON.stringify(
                          this.file.dataDirectory + 'h5p'
                        ),
                        activityName: this.courseDetailsData[i].modules[j].name,
                      },
                    };
                    console.log(
                      'activity name: ',
                      this.courseDetailsData[i].modules[j].name
                    );
                    this.navCtrl.navigateForward(
                      ['/tabs/tab2/h5p-display'],
                      navigationExtras
                    );
                  }
                  if (result === -1) {
                    console.log('FAILED');
                  }
                });
            })
            .catch((err) => {
              console.log('error: ', err.status);
              console.log('error: ', err.error);
            });
        });

      ////If the Course->Activity is a BigBlueButton Activity
      //then...
    } else if (
      this.courseDetailsData[i].modules[j].modname == 'bigbluebuttonbn'
    ) {
      console.log('implement BBB');

      //Call the BigBlueButton page to Join Session
      let navigationExtras: NavigationExtras = {
        queryParams: {
          cmid: this.courseDetailsData[i].modules[j].id,
          courseid: this.courseDetailsData[i].id,
        },
      };
      console.log('activity name: ', this.courseDetailsData[i].modules[j].name);
      this.navCtrl.navigateForward(
        ['/tabs/tab2/bigbluebutton'],
        navigationExtras
      );
    } else if (this.courseDetailsData[i].modules[j].modname == 'assign') {
      console.log('implement Assignment');

      //Call the Assignment page
      let navigationExtras: NavigationExtras = {
        state: {
          courseModule: this.courseDetailsData[i].modules[j],
          chosenCourseId: this.chosenCourseId,
        },
      };
      console.log('activity name: ', this.courseDetailsData[i].modules[j].name);
      this.router.navigate(['/tabs/tab2/assignment'], navigationExtras);
    }
  }

  //Function which changes the completion status of the Activity from Mark Done to Done and vice-versa
  completionClicked(i, j) {
    const newstate = this.courseDetailsData[i].modules[j].completiondata.state
      ? 0
      : 1;

    //Call Moodle WS function to change Activity's completion status
    const paramString =
      '&cmid=' +
      this.courseDetailsData[i].modules[j].id +
      '&completed=' +
      newstate;
    this.callMoodleWs
      .callWS(
        'core_completion_update_activity_completion_status_manually',
        paramString
      )
      .subscribe((response) => {
        console.log(response);
        this.courseDetailsData[i].modules[j].completiondata.state = newstate;
      });
  }

  // Handle API errors
  handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` + `body was: ${error.error}`
      );
    }
    // return an observable with a user-facing error message
    return throwError('Something bad happened; please try again later.');
  }

  //This was an attempt to open BBB video call within App using InAppBrowser. It didnt work.
  //This code was to set Camera and Microphone permissions
  //Get Microphone and Camera permission at runtime before opening InAppBrowser
  /* var cameraPermission=0;
var microphonePermission=0;
let permissionStatus = this.diagnostic.permissionStatus;
this.diagnostic.getCameraAuthorizationStatus()
  .then((state) => {
    switch(state){
      case permissionStatus.NOT_REQUESTED:
        console.log("Permission not requested to use the camera");
        cameraPermission=0;
        break;
      case permissionStatus.GRANTED:
        console.log("Permission granted to use the camera");
        cameraPermission=1;
        break;
      case permissionStatus.DENIED:
        //Here should I now call the PermissionRequest function
        console.log("Permission denied to use the camera - ask again?");
        cameraPermission=0;
        break;
      case permissionStatus.DENIED_ALWAYS:
        console.log("Permission permanently denied to use the camera - guess we won't be using it then!");
        cameraPermission=2;
        break;
    }
}).catch(e => console.error(e));

this.diagnostic.getMicrophoneAuthorizationStatus()
  .then((state) => {
    switch(state){
      case permissionStatus.NOT_REQUESTED:
        console.log("Permission not requested to use microphone");
        microphonePermission=0;
        break;                      
      case permissionStatus.GRANTED:
        console.log("Permission granted to use microphone");
        microphonePermission=1;
        break;
      case permissionStatus.DENIED:
        //Here should I now call the PermissionRequest function
        console.log("Permission denied to use the microphone- ask again?");
        microphonePermission=0;
        break;
      case permissionStatus.DENIED_ALWAYS:
        console.log("Permission permanently denied to use the microphone - guess we won't be using it then!");
        microphonePermission=2;
        break;
    }
}).catch(e => console.error(e));

if (microphonePermission == 0 && cameraPermission == 0) {
  let permission = this.diagnostic.permission;
  this.diagnostic.requestRuntimePermissions([permission.CAMERA,permission.RECORD_AUDIO, permission.USE_SIP]).then(
    success => {
      console.log('Camera, Mike permission: success', success);
    },
    error => {
      console.log('Camera, Mike permission: error', error);
    },
  );
} */

  //another inappbrowser attempt
  //var permissions = this.androidPermissions.PERMISSION;
  /*                   var permList = [
                    this.androidPermissions.PERMISSION.RECORD_AUDIO,
                    this.androidPermissions.PERMISSION.MODIFY_AUDIO_SETTINGS,
                    this.androidPermissions.PERMISSION.CAPTURE_AUDIO_OUTPUT,
                    this.androidPermissions.PERMISSION.MICROPHONE
                  ];
                  await this.androidPermissions.requestPermissions(permList);
                  const browser = this.iab.create(result.url[0],'_self', "location=no");
                    //, this.permCallBackSuccess(result.url[0]), this.permCallBackError); */
}

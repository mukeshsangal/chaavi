import { Component } from '@angular/core';
import { GetUserCoursesService } from '../services/get-user-courses.service';
import { GetCourseDetailsService } from '../services/get-course-details.service';
import { GetModuleDetailsService } from '../services/get-module-details.service';
import { GetFileService } from '../services/get-file.service';
import { SetModuleStatusService } from '../services/set-module-status.service';
import { GetH5pFileUrlsService } from '../services/get-h5p-file-urls.service';

import { Courses } from '../models/courses';
import { CourseDetails } from '../models/course-details';
import { CourseModules } from '../models/course-modules';
import { H5pActivities } from '../modules/h5p-activities';


import { FileOpener } from '@ionic-native/file-opener/ngx';
import { File, IWriteOptions } from '@ionic-native/file/ngx';
import { HTTP } from '@ionic-native/http/ngx';

import { Zip } from '@ionic-native/zip/ngx';

import { NavController  } from '@ionic/angular';
import { NavigationExtras, Router } from '@angular/router';

import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Http, HttpResponse } from '@capacitor-community/http';
import { Platform } from '@ionic/angular';
import { retry, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

import { Diagnostic } from '@ionic-native/diagnostic/ngx';

import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { EnvService } from '../services/env.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})



export class Tab2Page {

  coursesData : Courses[];
  chosenCourseSummary: String = "";
  chosenCourseFullName: String = "";
  chosenCourseId;
  courseDetailsData : CourseDetails[];
  h5pActivities: H5pActivities[];

  constructor(
    private getUserCourseService: GetUserCoursesService,
    private getCourseDetailsService: GetCourseDetailsService,
    private getModuleDetailsService: GetModuleDetailsService,
    private getFile: GetFileService,
    private setModuleStatus: SetModuleStatusService,
    private getH5pFileUrlsService: GetH5pFileUrlsService,
    private file: File,
    private fileOpener: FileOpener,
    private http: HTTP,
    private zip:Zip,
    private navCtrl: NavController,
    private platform: Platform,
    private httpClient: HttpClient,
    private iab: InAppBrowser,
    private diagnostic: Diagnostic,
    private androidPermissions: AndroidPermissions,
    private router: Router,
    public envService: EnvService
    ) {
  }

  ionViewWillEnter() {
    // Used ionViewWillEnter as ngOnInit is not 
    // called due to view persistence in Ionic
    this.getAllCourses();
  }

  getAllCourses() {
    //Get saved list of courses
    this.getUserCourseService.getList().subscribe(response => {
      console.log(response);
      this.coursesData=response;
    })
    
  }

  onCourseChange(event){
    //alert('inside ionChange' + this.coursesData.filter(x => x.id == event.detail.value)[0].fullname);
    this.chosenCourseId=this.coursesData.filter(x => x.id == event.detail.value)[0].id;
    this.chosenCourseSummary = this.coursesData.filter(x => x.id == event.detail.value)[0].summary.replace(/<\/?[^>]+(>|$)/g, "");
    this.chosenCourseFullName = this.coursesData.filter(x => x.id == event.detail.value)[0].fullname;
    this.getCourseDetailsService.getDetail(this.coursesData.filter(x => x.id == event.detail.value)[0].id).subscribe(response => {
      console.log(response);
      this.courseDetailsData=response;
      for (let i=0; i<this.courseDetailsData.length;i++){
          this.courseDetailsData[i].summary=this.courseDetailsData[i].summary.replace(/<\/?[^>]+(>|$)/g, "");
      }
      //console.log(this.courseDetailsData);
  })
  }

  toArray(courseModules: object) {
    return Object.keys(courseModules).map(key => courseModules[key])
  }

  onModuleClick(i,j) {
    var filepath = "";
    //If the Course->Activity is a File Activity 
    //then download the File and 
    //send to Appropriate app like Google Drive App
    if (this.courseDetailsData[i].modules[j].modname == "resource")
    {
      const url = this.courseDetailsData[i].modules[j].contents[0].fileurl + '&token='+this.envService.MOODLE_USER_TOKEN;
      console.log("url: ", url);
      filepath = this.file.dataDirectory + "test.pdf";
      console.log("filepath: ", filepath);

      this.http.downloadFile(url,{},{},filepath).then(response => {
        console.log("file downloaded: ", response);

        this.fileOpener.open(filepath, 'application/pdf')
        .then(() => console.log('File opened'))
        .catch(e => console.log(e));

      }).catch(err => {
        console.log("error: ", err.status);
        console.log("error: ", err.error);
      });

    //If the Course->Activity is an H5P Activity 
    //then download the H5P File and
    //Play the file
      } else if(this.courseDetailsData[i].modules[j].modname=="h5pactivity") {
        //Get H5P file URLs
        console.log("implementing h5p");
        this.getH5pFileUrlsService.getURLs(this.chosenCourseId).subscribe(response => {
          console.log(response);
          this.h5pActivities=response.h5pactivities;
          const chosenH5PActivity=this.h5pActivities.filter(x => x.coursemodule == this.courseDetailsData[i].modules[j].id);
          console.log("chosen h5p filename: "+chosenH5PActivity[0].package[0].filename);
          filepath="";

          //Download H5P file that is clicked
          const url = chosenH5PActivity[0].package[0].fileurl + '?token='+this.envService.MOODLE_USER_TOKEN;
          console.log("h5p file url: ", url);
          filepath = this.file.dataDirectory + chosenH5PActivity[0].package[0].filename;
          console.log("full filepath: ", filepath);
          
          this.http.downloadFile(url,{},{},filepath).then(response => {
            console.log("h5p file downloaded: ", response);
            //H5P files are Zip files. So Unzip the file first
            this.zip.unzip(filepath, this.file.dataDirectory+"h5p", (progress) => console.log('Unzipping, ' + Math.round((progress.loaded / progress.total) * 100) + '%'))
            .then( (result) => {
              if(result === 0) {
                console.log('Unzip SUCCESS');

                //Call the  h5p-standalone plugin to play H5P 
                //after setting options like pointing to H5P file folder
                let navigationExtras: NavigationExtras = {
                  queryParams: {
                    h5pFolderPath: JSON.stringify(this.file.dataDirectory+"h5p"),
                    activityName: this.courseDetailsData[i].modules[j].name
                  }
                };
                console.log("activity name: ", this.courseDetailsData[i].modules[j].name);
                this.navCtrl.navigateForward(['/tabs/tab2/h5p-display'], navigationExtras);
              }
              if(result === -1) { console.log('FAILED');}
            })
          }).catch(err => {
            console.log("error: ", err.status);
            console.log("error: ", err.error);
          });
          })

      ////If the Course->Activity is a BigBlueButton Activity 
      //then...
      }  else if(this.courseDetailsData[i].modules[j].modname=="bigbluebuttonbn") {
          console.log("implement BBB");

          //Call the BigBlueButton page to Join Session
          let navigationExtras: NavigationExtras = {
            queryParams: {
              cmid: this.courseDetailsData[i].modules[j].id,
              courseid: this.courseDetailsData[i].id
              //modulename: this.courseDetailsData[i].modules[j].name
            }
          };
          console.log("activity name: ", this.courseDetailsData[i].modules[j].name);
          this.navCtrl.navigateForward(['/tabs/tab2/bigbluebutton'], navigationExtras);

      } else if(this.courseDetailsData[i].modules[j].modname=="assign") {
        console.log("implement Assignment");
        
          //Call the Assignment page
           let navigationExtras: NavigationExtras = {
            state: {
              courseModule: this.courseDetailsData[i].modules[j],
              chosenCourseId: this.chosenCourseId
            }
          };
          console.log("activity name: ", this.courseDetailsData[i].modules[j].name);
          //this.navCtrl.navigateForward(['/tabs/tab2/assignment'], navigationExtras);
           this.router.navigate(['/tabs/tab2/assignment'],navigationExtras);
      } 
    }

    completionClicked(i,j){
      const newstate = (this.courseDetailsData[i].modules[j].completiondata.state? 0:1);
      this.setModuleStatus.setStatus("6",this.courseDetailsData[i].modules[j].id,newstate).subscribe(response => {
        console.log(response);
        this.courseDetailsData[i].modules[j].completiondata.state=newstate;
        //console.log(this.courseDetailsData);
    })
    }
 



/*     permCallBackSuccess(url: string) {
      const browser = this.iab.create(url,'_self');
    }

    permCallBackError(){
      console.log("Mike Permission request didnt work")
    } */



    // Handle API errors
handleError(error: HttpErrorResponse) {
  if (error.error instanceof ErrorEvent) {
    // A client-side or network error occurred. Handle it accordingly.
    console.error('An error occurred:', error.error.message);
  } else {
    // The backend returned an unsuccessful response code.
    // The response body may contain clues as to what went wrong,
    console.error(
      `Backend returned code ${error.status}, ` +
      `body was: ${error.error}`);
  }
  // return an observable with a user-facing error message
  return throwError(
    'Something bad happened; please try again later.');
}



//old code to set Camera and Microphone permissions
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
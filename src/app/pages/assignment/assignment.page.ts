import { Injectable } from '@angular/core';

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { CourseModules } from 'src/app/models/course-modules';
import { Assignments } from 'src/app/models/assignments';
import { CallMoodleWsService } from 'src/app/services/call-moodle-ws.service';
import { ToastController } from '@ionic/angular';

import { FileChooser } from '@ionic-native/file-chooser/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { EnvService } from 'src/app/services/env.service';

@Component({
  selector: 'app-assignment',
  templateUrl: './assignment.page.html',
  styleUrls: ['./assignment.page.scss'],
})

//This Class is to display the page for uploading Assignment submission file
export class AssignmentPage {

  courseModule: CourseModules;
  dueDate;
  chosenCourseId: number;
  assignment: Assignments;
  file2:any
  chosenFileName:string = "";  
  uploadFilePath: string;
  submittedSuccessfully: boolean = false;

  constructor(
    private route: ActivatedRoute, 
    private router: Router,
    private callMoodleWsService: CallMoodleWsService,
    private toast: ToastController,
    private fileChooser: FileChooser,
    private filePath: FilePath,
    private transfer: FileTransfer,
    private httpClient: HttpClient,
    public envService: EnvService
    ) 
    {
      //Loading the Assignment related details needs Course Module and Course Id
      //These are received here as parameters 
      this.route.queryParams.subscribe(params => {
      this.courseModule= this.router.getCurrentNavigation().extras.state.courseModule;
      this.chosenCourseId = this.router.getCurrentNavigation().extras.state.chosenCourseId;
      console.log(this.courseModule);
      const timestamp = this.courseModule.dates[1].timestamp*1000
      var todate=new Date(timestamp).getDate();
      var tomonth=new Date(timestamp).getMonth()+1;
      var toyear=new Date(timestamp).getFullYear();
      this.dueDate=todate+'/'+tomonth+'/'+toyear;

      //Call Moodle WS mod_assign_get_assignments to get Assignment details
      var wsfunction = 'mod_assign_get_assignments';
      var paramString = '&courseids[0]='+this.chosenCourseId;
      this.callMoodleWsService.callWS(wsfunction, paramString).subscribe( response => {
        console.log(response);
        //since Moodle WS returns all assignments, filter as below 
        //to choose particular assignment module matching the one clicked
        this.assignment = response.courses[0].assignments.filter(x => x.cmid == this.courseModule.id)[0];
        console.log(this.assignment);
        wsfunction="";
        paramString="";
      })
    });
  }

  //For selecting a File to upload from the Mobile file system
  chooseFile(){
     this.openFileChooser().then(response => {
      console.log(response);
      this.uploadFilePath = response;
      this.chosenFileName=this.uploadFilePath.substring(this.uploadFilePath.lastIndexOf('/') + 1);
      this.submittedSuccessfully=false;
  });
}

  //After lot of iteration following is the way Android returned File Path in the required format
  openFileChooser(): Promise<any> {

     return this.fileChooser.open().then((fileuri)  => {
      return this.filePath.resolveNativePath(fileuri)
    }); 
  }

  //File uploaded to Moodle using 2 steps:
  //1. Upload file using FileTransferObject and Url pointing to Moodle web service upload.php . This returns an item id
  //2. Use the usual Moodle WS function via server.php & function name mod_assign_save_submission using item id above
  //Possibly step 2 can use call-moodle-ws-service. Can be explored...
  uploadFile(){
  
    const url = this.envService.MOODLE_FILE_UPLOAD_URL+"?token="+this.envService.MOODLE_USER_TOKEN;  
    //After 2-3 days of trying different ways, only FileTransferObject was working to upload to Moodle
    const fileTransfer: FileTransferObject = this.transfer.create();
    
    let options: FileUploadOptions = {
      fileKey: 'filecontent',
      fileName: this.chosenFileName,
      headers: {}
   }

   fileTransfer.upload(this.uploadFilePath, url, options)
    .then((data) => {
      //the itemid returned by Moodle is used in the next step to refer to the file that was uploaded
      const itemid = JSON.parse(data.response)[0].itemid;

      //Call Moodle WS mod_assign_get_assignments
      var base_path = 'https://chaavi.in/moodle/webservice/rest/server.php?moodlewsrestformat=json&wstoken='+this.envService.MOODLE_USER_TOKEN; 
      const wsfunction = 'mod_assign_save_submission';
      const paramString = '&assignmentid=1&plugindata[onlinetext_editor][itemid]='+ 
        itemid +'&plugindata[files_filemanager]='+ itemid +
        '&plugindata[onlinetext_editor][text]=aaa&plugindata[onlinetext_editor][format]=1';

      base_path = base_path + '&wsfunction='+ wsfunction + paramString;
  
      this.httpClient
      .get<any>(base_path)
      .pipe(
        retry(2),
        catchError(this.handleError)
      ).subscribe( response3 => {
        console.log(response3);
        this.submittedSuccessfully=true;
      });

    }, (err) => {
      // error
    })
  }

  showToast(msg: string) {
    this.toast.create({
      message: msg,
      duration: 4000
    }).then((toastData) => {
      console.log(toastData);
      toastData.present();
    });
  }

  ionViewWillEnter() {
    // Used ionViewWillEnter as ngOnInit is not 
    // called due to view persistence in Ionic   
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
      `Backend returned code ${error.status}, ` +
      `body was: ${error.error}`);
  }
  // return an observable with a user-facing error message
  return throwError(
    'Something bad happened; please try again later.');
};
}
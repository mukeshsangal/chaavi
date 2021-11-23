import { Injectable } from '@angular/core';

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { CourseModules } from 'src/app/models/course-modules';
import { Assignments } from 'src/app/models/assignments';
import { CallMoodleWsService } from 'src/app/services/call-moodle-ws.service';
import { ToastController } from '@ionic/angular';

import { FileChooser } from '@ionic-native/file-chooser/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { File, FileEntry } from '@ionic-native/file/ngx';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import {HTTP} from "@ionic-native/http/ngx";
import { Base64 } from '@ionic-native/base64/ngx';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-assignment',
  templateUrl: './assignment.page.html',
  styleUrls: ['./assignment.page.scss'],
})

export class AssignmentPage {

  courseModule: CourseModules;
  dueDate;
  chosenCourseId: number;
  assignment: Assignments;
  file2:any
  chosenFileName:string = "";  
  uploadFilePath: string;

  constructor(
    private route: ActivatedRoute, 
    private router: Router,
    private callMoodleWsService: CallMoodleWsService,
    private toast: ToastController,
    private fileChooser: FileChooser,
    private filePath: FilePath,
    private transfer: FileTransfer,
    private http: HTTP,
    private httpClient: HttpClient,
    private base64: Base64,
    private file: File
    ) 
    { 
      this.route.queryParams.subscribe(params => {
      this.courseModule= this.router.getCurrentNavigation().extras.state.courseModule;
      this.chosenCourseId = this.router.getCurrentNavigation().extras.state.chosenCourseId;
      //this.assignmentName=this.courseModule.name;
      console.log(this.courseModule);
      const timestamp = this.courseModule.dates[1].timestamp*1000
      var todate=new Date(timestamp).getDate();
      var tomonth=new Date(timestamp).getMonth()+1;
      var toyear=new Date(timestamp).getFullYear();
      this.dueDate=todate+'/'+tomonth+'/'+toyear;

      //Call Moodle WS mod_assign_get_assignments
      var wsfunction = 'mod_assign_get_assignments';
      var paramString = '&courseids[0]='+this.chosenCourseId;
      this.callMoodleWsService.callWS(wsfunction, paramString).subscribe( response => {
        console.log(response);
        this.assignment = response.courses[0].assignments.filter(x => x.cmid == this.courseModule.id)[0];
        console.log(this.assignment);
        wsfunction="";
        paramString="";
      })
    });
  }

  chooseFile(){
     this.openFileChooser().then(response => {
      console.log(response);
      this.uploadFilePath = response;
      this.chosenFileName=this.uploadFilePath.substring(this.uploadFilePath.lastIndexOf('/') + 1);
  });
}

  openFileChooser(): Promise<any> {

     return this.fileChooser.open().then((fileuri)  => {
      return this.filePath.resolveNativePath(fileuri)/*.then(resolvedNativePath => {
        return this.file.resolveLocalFilesystemUrl(resolvedNativePath);
      });*/
    }); 
  }

  uploadFile(){
    const url = "https://chaavi.in/moodle/webservice/upload.php?token=53a766eaf4a8d9bb7a3b3263fc935b08";
    
    const fileTransfer: FileTransferObject = this.transfer.create();
    
    let options: FileUploadOptions = {
      fileKey: 'filecontent',
      fileName: this.chosenFileName,
      headers: {}
   }

   fileTransfer.upload(this.uploadFilePath, url, options)
    .then((data) => {
      // success
      //console.log('full data: ',data,' data.response: ',data.response);
      //,' data.response[0]: ',data.response[0],' JSON.parse(data.response[0]): ',JSON.parse(data.response[0]));
      const itemid = JSON.parse(data.response)[0].itemid;
      //console.log(itemid);
      //Call Moodle WS mod_assign_get_assignments
      var base_path = 'https://chaavi.in/moodle/webservice/rest/server.php?moodlewsrestformat=json&wstoken=53a766eaf4a8d9bb7a3b3263fc935b08'; 
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
     // this.callMoodleWsService.callWS(wsfunction, paramString).subscribe( response3 => {
        console.log(response3);
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
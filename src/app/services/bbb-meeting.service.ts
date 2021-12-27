import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import CryptoJS from 'crypto-js';
import { HTTP } from '@ionic-native/http/ngx';
import { Http, HttpResponse } from '@capacitor-community/http';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})

//Service created to send meeting id to BBB server and get Session Token as return
//But this was not working and so this has been performed from within bigbluebutton.page.ts itself
//If this file is used later, better to update it to match how it is done in above file as the approach here maybe outdated
export class BbbMeetingService {


constructor(private platform: Platform, private http: HttpClient/* , private httpNative: HTTP */) { }

// Http Options
httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
  })
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

// Create BBB meeting. This is outdated. If this is used, then 
//ensure that Meeting Id has course id etc padded. Refer implementation in the bigbluebutton.page.ts
//Another difference is that in that implementation I am using GetMeetingInfo and then Join meeting.
//However BBB API documentation says that Create and Join meeting is the better approach. Issue with Create and Join is that 
//even if Tutor has not logged in, Students get into the meeting and that is not desirable
createMeeting(meetingid): Observable<any> {
  // API path
  const base_path = 'https://test-install.blindsidenetworks.com/bigbluebutton/api/create?allowStartStopRecording=true&attendeePW=ap&autoStartRecording=false&meetingID=52a7815e00c6fd6fe2e645756d29d87488d46192&moderatorPW=mp&name=random-5840789&record=false&welcome=%3Cbr%3EWelcome+to+%3Cb%3E%25%25CONFNAME%25%25%3C%2Fb%3E%21';
  const secretSalt = "8cd8ef52e8e101574e400365b55e11a6";
  const checksum = CryptoJS.SHA1("createallowStartStopRecording=true&attendeePW=ap&autoStartRecording=false&meetingID="+meetingid+"&moderatorPW=mp&name=random-5840789&record=false&welcome=%3Cbr%3EWelcome+to+%3Cb%3E%25%25CONFNAME%25%25%3C%2Fb%3E%21"+secretSalt);
  const base_path2= base_path+'&checksum='+ checksum;

  return this.http
  .get<any>(base_path2)
  .pipe(
    retry(2),
    catchError(this.handleError)
  )
}

// Join BBB meeting
joinMeeting(meetingid) {
  // API path

 }
 
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

import { CourseDetails } from '../models/course-details';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { EnvService } from './env.service';

@Injectable({
  providedIn: 'root'
})

export class SetModuleStatusService {

   // API path
base_path = 'https://chaavi.in/moodle/webservice/rest/server.php?moodlewsrestformat=json&wsfunction=core_completion_update_activity_completion_status_manually&wstoken='+this.envService.MOODLE_USER_TOKEN;

constructor(
  private http: HttpClient,
  public envService: EnvService) { }

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

// Get students data
setStatus(userid, cmid, newstate): Observable<any> {
  //var base_path2 = this.base_path+'&userid='+userid+'&cmid='+cmid+'&newstate='+newstate;
  var base_path2 = this.base_path+'&cmid='+cmid+'&completed='+newstate;
  //alert(base_path2);
   return this.http
  .get<any>(base_path2)
  .pipe(
    retry(2),
    catchError(this.handleError)
  )  
}
}
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { EnvService } from './env.service';

@Injectable({
  providedIn: 'root'
})

export class GetBigbluebuttonModulesService {

 // API path
base_path = 'https://chaavi.in/moodle/webservice/rest/server.php?moodlewsrestformat=json&wstoken='+this.envService.MOODLE_USER_TOKEN;

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

// Get BBB modules/actvities
getModules(courseid): Observable<any> {
  //console.log("courseid: "+courseid);
  //const base_path2 = this.base_path+"&wsfunction=mod_bigbluebuttonbn_can_join&cmid="+cmid;
  const base_path2 = this.base_path+"&wsfunction=mod_bigbluebuttonbn_get_bigbluebuttonbns_by_courses&courseids[0]="+courseid;
  
   return this.http
  .get<any>(base_path2)
  .pipe(
    retry(2),
    catchError(this.handleError)
  )
}

}
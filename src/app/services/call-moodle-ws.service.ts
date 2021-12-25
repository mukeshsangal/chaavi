import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { EnvService } from './env.service';


@Injectable({
  providedIn: 'root'
})

export class CallMoodleWsService {

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

// Call Moodle WS
callWS(wsfunction, paramString): Observable<any> {
  this.base_path = this.base_path + '&wsfunction='+ wsfunction + paramString;
  
  return this.http
  .get<any>(this.base_path)
  .pipe(
    retry(2),
    catchError(this.handleError)
  )  
}
}
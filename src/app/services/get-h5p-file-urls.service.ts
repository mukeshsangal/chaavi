import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})

export class GetH5pFileUrlsService {

 // API path
base_path = 'https://chaavi.in/moodle/webservice/rest/server.php?moodlewsrestformat=json&wstoken=53a766eaf4a8d9bb7a3b3263fc935b08';

constructor(private http: HttpClient) { }

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

// Get H5P file URLs
getURLs(courseid): Observable<any> {
  //console.log("courseid: "+courseid);
  const base_path2 = this.base_path+"&wsfunction=mod_h5pactivity_get_h5pactivities_by_courses&courseids[0]="+courseid;
   return this.http
  .get<any>(base_path2)
  .pipe(
    retry(2),
    catchError(this.handleError)
  )
}

// Get H5P file URLs
/* getURLs(url): Observable<any> {
  const base_path2 = this.base_path+"&wsfunction=core_h5p_get_trusted_h5p_file&url="+url+"&frame=0&export=0&embed=0&copyright=0";
   return this.http
  .get<any>(base_path2)
  .pipe(
    retry(2),
    catchError(this.handleError)
  )  
} */ 
}
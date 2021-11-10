import { Injectable } from '@angular/core';
import { HTTP } from '@ionic-native/http/ngx';
import { File, IWriteOptions } from '@ionic-native/file/ngx';
//import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})

export class GetFileService {

   // API path
//base_path = 'https://chaavi.in/moodle/webservice/rest/server.php?moodlewsrestformat=json&wsfunction=core_course_get_contents&wstoken=53a766eaf4a8d9bb7a3b3263fc935b08'; 

constructor(private http: HTTP, private file: File) { }


// Get file from url
get(url){
  const filepath = this.file.externalRootDirectory + "/Download/test.pdf";
  //const filepath = "file:///data/user/0/io.ionic.starter/files/test.pdf";
  url = url + '&token=53a766eaf4a8d9bb7a3b3263fc935b08';

  console.log(url);

 this.http.downloadFile(url,{},{},filepath).then(response => {
    console.log("file downloaded: ", response);
    return filepath;
  }).catch(err => {
    console.log("error: ", err.status);
    console.log("error: ", err.error);
    return "";
  });
   return "";
}
}
import { Injectable } from '@angular/core';
import { HTTP } from '@ionic-native/http/ngx';
import { File, IWriteOptions } from '@ionic-native/file/ngx';
//import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { EnvService } from './env.service';

@Injectable({
  providedIn: 'root'
})

export class GetFileService {

  //For some unknown reason this Service file didnt work and 
  //so the GetFile code was run directly from the tab2.page.ts itself
  //So as such this code file is not used. Kept it here in case this is needed later.

constructor(
  private http: HTTP,
  private file: File,
  public envService: EnvService) { }


// Get file from url
get(url){
  const filepath = this.file.externalRootDirectory + "/Download/test.pdf";
  //this is the format of the filepath "file:///data/user/0/io.ionic.starter/files/test.pdf";
  url = url + '&token='+this.envService.MOODLE_USER_TOKEN;
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
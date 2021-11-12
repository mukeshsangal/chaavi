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

import { NavController } from '@ionic/angular';
import { NavigationExtras } from '@angular/router';

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
    private navCtrl: NavController
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
      const url = this.courseDetailsData[i].modules[j].contents[0].fileurl + '&token=53a766eaf4a8d9bb7a3b3263fc935b08';
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
          const url = chosenH5PActivity[0].package[0].fileurl + '?token=53a766eaf4a8d9bb7a3b3263fc935b08';
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
 
}
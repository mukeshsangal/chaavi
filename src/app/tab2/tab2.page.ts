import { Component } from '@angular/core';
import { GetUserCoursesService } from '../services/get-user-courses.service';
import { GetCourseDetailsService } from '../services/get-course-details.service';
import { GetModuleDetailsService } from '../services/get-module-details.service';
import { GetFileService } from '../services/get-file.service';
import { SetModuleStatusService } from '../services/set-module-status.service';
import { Courses } from '../models/courses';
import { CourseDetails } from '../models/course-details';
import { CourseModules } from '../models/course-modules';
//import { NavController } from '@ionic/angular';
//import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { fileURLToPath } from 'url';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { File, IWriteOptions } from '@ionic-native/file/ngx';
import { HTTP } from '@ionic-native/http/ngx';


@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  coursesData : Courses[];
  chosenCourseSummary: String = "";
  chosenCourseFullName: String = "";
  courseDetailsData : CourseDetails[];
  chosenCourseId;
  constructor(
    private getUserCourseService: GetUserCoursesService,
    private getCourseDetailsService: GetCourseDetailsService,
    private getModuleDetailsService: GetModuleDetailsService,
    private getFile: GetFileService,
    private setModuleStatus: SetModuleStatusService,
    private file: File,
    private fileOpener: FileOpener,
    private http: HTTP
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
    this.getCourseDetailsService.getDetail(this.coursesData.filter(x => x.id == event.detail.value)[0].id).subscribe(response2 => {
      console.log(response2);
      this.courseDetailsData=response2;
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
    if (this.courseDetailsData[i].modules[j].modname == "resource")
    {
      const url = this.courseDetailsData[i].modules[j].contents[0].fileurl + '&token=53a766eaf4a8d9bb7a3b3263fc935b08';
      console.log("url: ", url);
      const filepath = this.file.dataDirectory + "test.pdf";
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
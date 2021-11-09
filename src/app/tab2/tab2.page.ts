import { Component } from '@angular/core';
import { GetUserCoursesService } from '../services/get-user-courses.service';
import { GetCourseDetailsService } from '../services/get-course-details.service';
import { GetModuleDetailsService } from '../services/get-module-details.service';
import { Courses } from '../models/courses';
import { CourseDetails } from '../models/course-details';
import { CourseModules } from '../models/course-modules';
import { NavController } from '@ionic/angular';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';


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
    public navCtrl: NavController,
    private iab: InAppBrowser
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

    if (this.courseDetailsData[i].modules[j].modname == "resource")
    {

    }
    
  /* const browser = this.iab.create(this.courseDetailsData[i].modules[j].url.toString());

  browser.close(); */
}
}
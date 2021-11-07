import { Component } from '@angular/core';
import { GetUserCoursesService } from '../services/get-user-courses.service';
import { GetCourseDetailsService } from '../services/get-course-details.service';
import { Courses } from '../models/courses';
import { CourseDetails } from '../models/course-details';

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
  constructor(
    private getUserCourseService: GetUserCoursesService,
    private getCourseDetailsService: GetCourseDetailsService
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
    this.chosenCourseSummary = this.coursesData.filter(x => x.id == event.detail.value)[0].summary.replace(/<\/?[^>]+(>|$)/g, "");
    this.chosenCourseFullName = this.coursesData.filter(x => x.id == event.detail.value)[0].fullname;
    this.getCourseDetailsService.getDetail(this.coursesData.filter(x => x.id == event.detail.value)[0].id).subscribe(response2 => {
      console.log(response2);
      this.courseDetailsData=response2;
      for (let i=0; i<this.courseDetailsData.length;i++){
        this.courseDetailsData[i].summary=this.courseDetailsData[i].summary.replace(/<\/?[^>]+(>|$)/g, "");
      }
  })
  }
}
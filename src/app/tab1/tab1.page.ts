import { Component } from '@angular/core';
import { Courses } from '../models/courses';
import { GetActionEventsByCoursesService } from '../services/get-action-events-by-courses.service';
import { GetUserCoursesService } from '../services/get-user-courses.service';
import {ActionEvent} from '../models/event';
import { NavController  } from '@ionic/angular';
import { NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  
  coursesData: Courses[];
  events: ActionEvent[];

  constructor(
    private getActionEventsByCourses: GetActionEventsByCoursesService,
    private getUserCourseService: GetUserCoursesService,
    private navCtrl: NavController
    ) {}

  ionViewWillEnter() {
    // Used ionViewWillEnter as ngOnInit is not 
    // called due to view persistence in Ionic
    //this.getAllCourses();
    this.getActionEvents();
  }

  /* getAllCourses() {
    //Get saved list of courses
    this.getUserCourseService.getList().subscribe(response => {
      console.log(response);
      this.coursesData = response;
      this.getActionEvents();
    }) 
    
  }*/

  getActionEvents(){
    /* const arrayCourseIds = (arr, n) => arr.map(x => 'courseids[]='+x[n]);
    const courseIds = arrayCourseIds(this.coursesData, 'id').toString().replace(",","&");
    console.log(courseIds); */
    this.getActionEventsByCourses.getActionEvents("6").subscribe(response => {
      console.log(response);
      this.events=response.events;
      console.log(this.events);    
  })
  }

  eventActionButtonClicked(i){
     if (this.events[i].modulename == 'bigbluebuttonbn') {
        //Call the BigBlueButton page to Join Session
        let navigationExtras: NavigationExtras = {
          queryParams: {
            cmid: this.events[i].instance,
            courseid: this.events[i].course.id
            //modulename: this.courseDetailsData[i].modules[j].name
          }
        };
        this.navCtrl.navigateForward(['/tabs/tab2/bigbluebutton'], navigationExtras);
    } 
  }

}

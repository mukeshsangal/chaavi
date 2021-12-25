import { Component } from '@angular/core';
import { Courses } from '../models/courses';
import { GetActionEventsByCoursesService } from '../services/get-action-events-by-courses.service';
import { GetUserCoursesService } from '../services/get-user-courses.service';
import {ActionEvent} from '../models/event';
import { NavController  } from '@ionic/angular';
import { NavigationExtras, Router } from '@angular/router';

// import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/models/user';
import { EnvService } from '../services/env.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  coursesData: Courses[];
  events: ActionEvent[];
  //private user: User;
  numNotifications: number;

  constructor(
    private getActionEventsByCourses: GetActionEventsByCoursesService,
    private getUserCourseService: GetUserCoursesService,
    private navCtrl: NavController,
    private router: Router,
    //private authService: AuthService,
    public envService: EnvService
    ) {}

  ionViewWillEnter() {
    // Used ionViewWillEnter as ngOnInit is not 
    // called due to view persistence in Ionic
    //this.getAllCourses();
    //this.user.id = this.envService.MOODLE_USER_ID;
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
    this.getActionEventsByCourses.getActionEvents(this.envService.MOODLE_USER_ID).subscribe(response => {
      console.log(response);
      this.events=response.events;
      this.numNotifications = this.events.length;
      console.log(this.events);    
  })
  }

  eventActionButtonClicked(i){
     if (this.events[i].modulename == 'bigbluebuttonbn') {
        //Navigate to the BigBlueButton page to Join Session
        let navigationExtras: NavigationExtras = {
          queryParams: {
            cmid: this.events[i].instance,
            courseid: this.events[i].course.id
            //modulename: this.courseDetailsData[i].modules[j].name
          }
        };
        this.navCtrl.navigateForward(['/tabs/tab2/bigbluebutton'], navigationExtras);
    } else if (this.events[i].modulename == 'assign') {
          //Navigate to the Assignment page
          //Call the Assignment page
          let navigationExtras: NavigationExtras = {
            state: {
              courseModule: {
                id: this.events[i].instance,
                name: this.events[i].name,
                //completion: this.events[i].,
                //modicon: Url;
                url: this.events[i].url,
                modname: this.events[i].modulename,
                //contents: ModuleFileContents[];
                //completiondata: Completiondata;
                dates: [{label:'starts',timestamp:0},{label:'due',timestamp: this.events[i].timeusermidnight}]
              },
              chosenCourseId: this.events[i].course.id
            }
          };
          //console.log("activity name: ", this.courseDetailsData[i].modules[j].name);
          //this.navCtrl.navigateForward(['/tabs/tab2/assignment'], navigationExtras);
           this.router.navigate(['/tabs/tab2/assignment'],navigationExtras);
  } 
  }

}

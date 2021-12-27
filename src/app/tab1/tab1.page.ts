import { Component } from '@angular/core';
import { Courses } from '../models/courses';
import { CallMoodleWsService } from '../services/call-moodle-ws.service';
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

//Tab 1 Page is mainly for Pending Action items for Attending Live class, pending Assignments etc.
export class Tab1Page {

  coursesData: Courses[];
  events: ActionEvent[];
  //private user: User;
  numNotifications: number;

  constructor(
    private callMoodleWs: CallMoodleWsService,
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

  //Currently the Calendar action events are obtained through Moodle WS and listed here
  //More Action items may come up here later
  getActionEvents(){
    /* const arrayCourseIds = (arr, n) => arr.map(x => 'courseids[]='+x[n]);
    const courseIds = arrayCourseIds(this.coursesData, 'id').toString().replace(",","&");
    console.log(courseIds); */
  const paramString = '&userid=' + this.envService.MOODLE_USER_ID;
  this.callMoodleWs.callWS('core_calendar_get_action_events_by_timesort', paramString).subscribe(response => {
    console.log(response);
    this.events=response.events;
    this.numNotifications = this.events.length;
    console.log(this.events);    
})
  }

  //Process the Action in case the User clicks on a button of an Action item
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
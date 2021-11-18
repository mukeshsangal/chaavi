import { Injectable } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";

import { GetBigbluebuttonModulesService } from '../../services/get-bigbluebutton-modules.service';
import { BbbMeetingService } from '../../services/bbb-meeting.service';
import { Bbb } from '../../models/bbb';
import {parseString} from 'xml2js';
import { XmlResponse } from '../../models/xml-response';
import { ToastController  } from '@ionic/angular';
import CryptoJS from 'crypto-js';
import { HTTP } from '@ionic-native/http/ngx';

@Component({
  selector: 'app-bigbluebutton',
  templateUrl: './bigbluebutton.page.html',
  styleUrls: ['./bigbluebutton.page.scss'],
})
export class BigbluebuttonPage  {

  bbb: Bbb[];
  bbbChosenModuleName: string ="";
  bbbChosenMeetingId: string;
  private myToast: any;
  courseid: string;
  cmid:string;
  modulename: string;

  constructor(
    private route: ActivatedRoute,
    private bbbMeeting: BbbMeetingService,
    private getBigbluebuttonModules : GetBigbluebuttonModulesService,
    public toast: ToastController,
    private http: HTTP
  ) { }

  ionViewWillEnter() {
        // Used ionViewWillEnter as ngOnInit is not 
    // called due to view persistence in Ionic
    this.route.queryParams.subscribe(params => {

      this.getBigbluebuttonModules.getModules(params['courseid']).subscribe(response => {
        console.log(response);
        this.courseid=params['courseid'];
        this.cmid=params['cmid'];
        //this.modulename=params['modulename'];
        this.bbb=response.bigbluebuttonbns.filter(x => x.coursemodule == this.cmid);

        //Moodle pads the courseid and bbbid to meeting id while creating meeting with BBB server
        //Hence padding those
        this.bbbChosenMeetingId = this.bbb[0].meetingid+'-'+ this.courseid +'-'+this.bbb[0].id;
        this.bbbChosenModuleName = this.bbb[0].name;
      })
    });
  }

  BBBJoinBtnclicked() {
    //call bbbmeetingservice
    //    moderatorpass | viewerpass
    //  | 2ajmIHVWyMYu  | UHJB6kL7d0KM |
    //  | lcU8CDwv7zrJ  | ZYlU0Lwgd3ba |

    const secretSalt = "8cd8ef52e8e101574e400365b55e11a6";

    var base_path1 = 'https://test-install.blindsidenetworks.com/bigbluebutton/api/getMeetingInfo?';
    var base_path2 = 'meetingID='+ this.bbbChosenMeetingId;
    var checksum = CryptoJS.SHA1("getMeetingInfo"+base_path2+secretSalt);
    var base_path3= base_path1+ base_path2+'&checksum='+ checksum;
    console.log("calling getMeetingInfo with url: ", base_path3);
    
    //Calling BBB Server API to Create meeting
    this.http
    .get(base_path3,{},{})
    .then(async response2 => {
        console.log(response2.data);
        var result = await this.parseXml(response2.data);
        console.log(result);
        if (result.returncode == "SUCCESS") {
          base_path1 = 'https://test-install.blindsidenetworks.com/bigbluebutton/api/join?';
          base_path2 = 'fullName=testwsuser&password='+ result.attendeePW +'&meetingID=' + this.bbbChosenMeetingId;
          base_path2 = base_path2 + '&createTime='+ result.createTime +'&userID=6&joinViaHtml5=true';
          checksum = CryptoJS.SHA1("join"+base_path2+secretSalt);
          base_path3 = base_path1 + base_path2+ '&checksum='+ checksum;
          console.log("calling join with url: ", base_path3);

          window.open(base_path3,'_SYSTEM');
          //const browser = this.iab.create(base_path3,'_self', "location=no");
          //Calling BBB Server API to Join meeting
          /* this.http
          .get(base_path3, {},{})
          .then( async response3 => {
              //const data = response.data;
              console.log(response3.data);
              var result = await this.parseXml(response3.data);
              console.log(result);
              if (result.returncode == "SUCCESS") {
                console.log(result.url[0]);
                //window.open(result.url[0],'_BLANK');



              } else if (result.returncode == "FAILED") {
                console.log("Unable to Join Meeting");
                this.showToast("Unable to join meeting");      
              }
            }, error => {
            console.log(error);
          }) */
        } else if (result.returncode == "FAILED") {
          console.log("Meeting Not Found");
          this.showToast("Class not started. Please try after 1min");
        }
  })
  }

  parseXml(xml) : Promise<any> {
    return new Promise((resolve, reject) => {
        parseString(xml, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(JSON.parse(JSON.stringify(result.response)));
            }
        });
    });
  } 


  showToast(msg: string) {
    this.myToast = this.toast.create({
      message: msg,
      duration: 4000
    }).then((toastData) => {
      console.log(toastData);
      toastData.present();
    });
  }

}
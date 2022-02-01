import { Injectable } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CallMoodleWsService } from 'src/app/services/call-moodle-ws.service';
//import { BbbMeetingService } from '../../services/bbb-meeting.service';
import { Bbb } from '../../models/bbb';
import { parseString } from 'xml2js';
//import { XmlResponse } from '../../models/xml-response';

import CryptoJS from 'crypto-js';
import { HTTP } from '@ionic-native/http/ngx';

import { AlertService } from 'src/app/services/alert.service';
import { EnvService } from '../../services/env.service';
@Component({
  selector: 'app-bigbluebutton',
  templateUrl: './bigbluebutton.page.html',
  styleUrls: ['./bigbluebutton.page.scss'],
})

//Displays the BBB page and does the process required to join the selected BBB meeting
//Once done the meeting opens up on Browser
//BBB only has an HTML5 client and as of now it only loads on Mobile browser
//After trying a lot I couldnt get the BBB client to load within the App in either WebView or InAppBrowser
export class BigbluebuttonPage {
  bbb: Bbb[];
  bbbChosenModuleName: string = '';
  bbbChosenMeetingId: string;
  courseid: string;
  cmid: string;
  modulename: string;

  constructor(
    private route: ActivatedRoute,
    //private bbbMeeting: BbbMeetingService,
    private callMoodleWs: CallMoodleWsService,
    private http: HTTP,
    private alertService: AlertService,
    public envService: EnvService
  ) {}

  ionViewWillEnter() {
    // Used ionViewWillEnter as ngOnInit is not
    // called due to view persistence in Ionic

    this.route.queryParams.subscribe((params) => {
      //Receive Course Id & Course Module Id as input parameter
      const paramString = '&courseids[0]=' + params['courseid'];
      console.log('inside bbb.page.ts' + paramString);
      //Call Moodle WS to get all BBB activities for the course
      this.callMoodleWs
        .callWS(
          'mod_bigbluebuttonbn_get_bigbluebuttonbns_by_courses',
          paramString
        )
        .subscribe((response) => {
          console.log(response);
          this.courseid = params['courseid'];
          this.cmid = params['cmid'];
          //Filter list of all BBB activities of the Course to choose the particular BBB activity that was clicked
          this.bbb = response.bigbluebuttonbns.filter(
            (x) => x.coursemodule == this.cmid
          );

          //Moodle pads the courseid and bbbid to meeting id while creating meeting with BBB server
          //Hence padding those to get appropriate meeting id
          this.bbbChosenMeetingId =
            this.bbb[0].meetingid + '-' + this.courseid + '-' + this.bbb[0].id;
          this.bbbChosenModuleName = this.bbb[0].name;
        });
    });
  }

  BBBJoinBtnclicked() {
    //Call bbbmeetingservice
    //    moderatorpass | viewerpass
    //  | 2ajmIHVWyMYu  | UHJB6kL7d0KM |
    //  | lcU8CDwv7zrJ  | ZYlU0Lwgd3ba |

    //BBB Server gives each Moodle site a Secret Salt which needs to be used to connect to a meeting on BBB
    const secretSalt = 'vuCrGBy5Sj8CxFIQdhmXkejLYQBGfUjlHUwptqadCa';

    //Currently BBB is on BlindSide's Test server. BBB needs to be setup on a separate server and this link pointed there
    var base_path1 = this.envService.BBB_MEETING_INFO;
    var base_path2 = 'meetingID=' + this.bbbChosenMeetingId;
    //security checksum for BBB. For Details check the Usage section of https://docs.bigbluebutton.org/dev/api.html
    var checksum = CryptoJS.SHA1('getMeetingInfo' + base_path2 + secretSalt);
    var base_path3 = base_path1 + base_path2 + '&checksum=' + checksum;
    console.log('calling getMeetingInfo with url: ', base_path3);

    //Calling BBB Server API to get meeting info
    this.http.get(base_path3, {}, {}).then(async (response2) => {
      console.log(response2.data);
      //BBB server returns data in XML format
      var result = await this.parseXml(response2.data);
      console.log(result);
      if (result.returncode == 'SUCCESS') {
        base_path1 = this.envService.BBB_MEETING_JOIN_INFO;
        base_path2 =
          'fullName=testwsuser&password=' +
          result.attendeePW +
          '&meetingID=' +
          this.bbbChosenMeetingId;
        base_path2 =
          base_path2 +
          '&createTime=' +
          result.createTime +
          '&userID=6&joinViaHtml5=true';
        checksum = CryptoJS.SHA1('join' + base_path2 + secretSalt);
        base_path3 = base_path1 + base_path2 + '&checksum=' + checksum;
        console.log('calling join with url: ', base_path3);

        //Above URL for joining BBB Meeting is opened on the System browser on the Mobile.
        //Join meeting automatically returns the session token and redirects to meeting url with token
        window.open(base_path3, '_SYSTEM');
      } else if (result.returncode == 'FAILED') {
        console.log('Meeting Not Found');
        //Student can join meeting only after Tutor has joined. Else this message is thrown.
        this.alertService.presentToast(
          'Class not started. Please try after 1min'
        );
      }
    });
  }

  //To convert the XML response from BBB server to JSON
  parseXml(xml): Promise<any> {
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
}

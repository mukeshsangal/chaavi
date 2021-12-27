import { Injectable } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { H5P } from 'h5p-standalone';
import { Capacitor } from '@capacitor/core';
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-h5p-display',
  templateUrl: './h5p-display.page.html',
  styleUrls: ['./h5p-display.page.scss'],
})

@Injectable({
  providedIn: 'root'
})

//Page to display the H5P interactive content
//This Page loads only after the H5P has been downloaded from Moodle and unzipped
//Here the path to H5P file is provided to a module which displays H5P
//Module obtained from: https://github.com/tunapanda/h5p-standalone
export class H5pDisplayPage {

  activityName: string="";
  constructor(private route: ActivatedRoute) { }

  ionViewWillEnter() {
    // Used ionViewWillEnter as ngOnInit is not 
    // called due to view persistence in Ionic
   
    this.route.queryParams.subscribe(params => {
      const h5pFolderPath = Capacitor.convertFileSrc(JSON.parse(params["h5pFolderPath"]));
      this.activityName = params["activityName"];
      console.log("inside H5PPage: ", this.activityName);
      //following is the format in which the H5P display module expects
      const el = document.getElementById('h5p-container');
      const options = {
          h5pJsonPath: h5pFolderPath,
          frameJs: '/assets/frame.bundle.js',
          frameCss: '/assets/styles/h5p.css',
      };
      new H5P(el, options);
    });
  }

}

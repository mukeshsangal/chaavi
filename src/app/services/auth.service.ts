import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { EnvService } from './env.service';
import { User } from '../models/user';
import { NavController } from '@ionic/angular';
import { CallMoodleWsService } from '../services/call-moodle-ws.service';

@Injectable({
  providedIn: 'root'
})

//For handling all Auth services: login, registration, logout
export class AuthService {
  isLoggedIn = false;
  token: any;
  constructor(
    private http: HttpClient,
    private storage: NativeStorage,
    public envService: EnvService,
    private navCtrl: NavController,
    private callMoodleWs: CallMoodleWsService
  ) { }

  login(username: String, password: String) {
    var token;

    //Calling Moodle login.php here with username/pwd to get user Token
    //Every Moodle Web Services call (eg: get courses, get action items) works only if this Token is passed
    return this.http.get<any>(this.envService.MOODLE_LOGIN_URL + '?username=' + username + '&password=' + password + '&service=moodle_mobile_app')
      .pipe(
        tap(response => {
          token = response.token;
          //console.log(response);

          if (token !== undefined) {
            //Token is stored in mobile local storage for login persistence
            this.storage.setItem('token', token)
              .then(
                () => {
                  console.log('Token Stored');
                },
                error => console.error('Error storing item', error)
              );
            this.token = token;
            this.isLoggedIn = true;
            //User Id # is Hardcoded for now. Later change it to call MOODLE API to find userid for the entered username and set it here
            //this.envService.MOODLE_USER_ID = 4;
            this.envService.MOODLE_USER_TOKEN = token;
            const paramString = '&field=username&values[]=' + username;
            this.callMoodleWs
              .callWS('core_user_get_users_by_field', paramString)
              .subscribe((response1) => {
                this.envService.MOODLE_USER_ID = response1[0].id;
              });
          }
          else token = null;
          //return token;
        }),
      );
  }

  register(fName: String, lName: String, email: String, password: String) {
    return this.http.post(this.envService.MOODLE_API_URL + 'auth/register',
      { fName: fName, lName: lName, email: email, password: password }
    )
  }
  logout() {
    //This is the proper way to logout. But Moodle WS is Token based and doesnt have logged in sessions etc.
    //So this type of Login may not be needed at Moodle end. (not 100% sure)
    /* const headers = new HttpHeaders({
      'Authorization': this.token["token_type"]+" "+this.token["access_token"]
    });
    return this.http.get(this.envService.MOODLE_API_URL + 'auth/logout', { headers: headers })
    .pipe(
      tap(data => {
        this.storage.remove("token");
        this.isLoggedIn = false;
        delete this.token;
        return data;
      })
    ) */

    //Currently Logout just means remove the token from local storage and setting status as not logged in
    this.storage.remove("token");
    this.isLoggedIn = false;
    delete this.token;
    this.navCtrl.navigateRoot('/landing');

  }

  //This function is for getting User details from Server. Currently not needed in Moodle
  /* user() {
    const headers = new HttpHeaders({
      'Authorization': this.token["token_type"]+" "+this.token["access_token"]
    });
    return this.http.get<User>(this.env.MOODLE_API_URL + 'auth/user', { headers: headers })
    .pipe(
      tap(user => {
        return user;
      })
    )
  } */

  //When loading, this is used to check for presence of Token to see if logged in or not
  getToken() {
    return this.storage.getItem('token').then(
      data => {
        this.token = data;
        if (this.token != null) {
          this.isLoggedIn = true;
          //User Id # is Hardcoded for now. Later change it to call MOODLE API to find userid for the entered username and set it here
          this.envService.MOODLE_USER_ID = 6;
          this.envService.MOODLE_USER_TOKEN = this.token;
        } else {
          this.isLoggedIn = false;
        }
      },
      error => {
        this.token = null;
        this.isLoggedIn = false;
      }
    );
  }
}

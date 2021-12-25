import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { EnvService } from './env.service';
import { User } from '../models/user';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isLoggedIn = false;
  token:any;
  constructor(
    private http: HttpClient,
    private storage: NativeStorage,
    public envService: EnvService,
  ) 
  { }

  login(username: String, password: String) {
    var token;
    return this.http.get<any>(this.envService.MOODLE_LOGIN_URL + '?username='+ username+'&password='+password + '&service=moodle_mobile_app')
    .pipe(
      tap(response => {
        token = response.token;
        console.log(token);
        if(token !== undefined) {
          this.storage.setItem('token', token)
          .then(
            () => {
              console.log('Token Stored');
            },
            error => console.error('Error storing item', error)
          );
          this.token = token;
          this.isLoggedIn = true;
          this.envService.MOODLE_USER_ID=6; //Hardcoded. Later change it to call MOODLE API and set User.
          this.envService.MOODLE_USER_TOKEN=token;
        }
        else token=null;
        //return token;
      }),
    );
  }

  register(fName: String, lName: String, email: String, password: String) {
    return this.http.post(this.envService.MOODLE_API_URL + 'auth/register',
      {fName: fName, lName: lName, email: email, password: password}
    )
  }
  logout() {
    const headers = new HttpHeaders({
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
    )
  }
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
  getToken() {
    return this.storage.getItem('token').then(
      data => {
        this.token = data;
        if(this.token != null) {
          this.isLoggedIn=true;
          this.envService.MOODLE_USER_ID=6; //Hardcoded. Later change it to call MOODLE API and set User.
          this.envService.MOODLE_USER_TOKEN=this.token;          
        } else {
          this.isLoggedIn=false;
        }
      },
      error => {
        this.token = null;
        this.isLoggedIn=false;
      }
    );
  }
}
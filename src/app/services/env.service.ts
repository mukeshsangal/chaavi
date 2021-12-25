import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EnvService {

//Place all MOODLE_API_URL type Env Constants here
public MOODLE_API_URL = 'https://chaavi.in/moodle/webservice/rest/server.php?moodlewsrestformat=json';
public MOODLE_LOGIN_URL = 'https://chaavi.in/moodle/login/token.php';
public MOODLE_USER_ID: number;
public MOODLE_USER_TOKEN: string;

  constructor() { }
}

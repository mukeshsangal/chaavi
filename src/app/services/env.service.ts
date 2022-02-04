import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class EnvService {
  //Place all MOODLE_API_URL type Env Constants here
  public MOODLE_API_URL =
    'https://moodle.gailabs.com/webservice/rest/server.php?moodlewsrestformat=json';
  public MOODLE_LOGIN_URL = 'https://moodle.gailabs.com/login/token.php';
  public MOODLE_USER_ID: number;
  public MOODLE_USER_TOKEN: string;
  public MOODLE_FILE_UPLOAD_URL =
    'https://moodle.gailabs.com/webservice/upload.php';
  public BBB_MEETING_INFO =
    'https://manager.bigbluemeeting.com/bigbluebutton/api/getMeetingInfo?';
  public BBB_MEETING_JOIN_INFO =
    'https://manager.bigbluemeeting.com/bigbluebutton/api/join?';

  constructor() {}
}

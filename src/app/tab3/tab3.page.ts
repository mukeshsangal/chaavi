import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})

//Page for Account related action. Currenly only does Logout.
export class Tab3Page {

  constructor(
    private auth: AuthService
  ) {}

  logout(){
    this.auth.logout();
  }

}
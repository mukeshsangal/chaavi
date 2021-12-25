import { Component } from '@angular/core';
import { Platform, NavController } from '@ionic/angular';
//import { SplashScreen } from '@ionic-native/splash-screen/ngx';
//import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthService } from './services/auth.service';
import { AlertService } from './services/alert.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    private authService: AuthService,
    private navCtrl: NavController,
    private alertService: AlertService,
    private platform: Platform
  ) {
    this.initializeApp();
  }

  initializeApp() {
  this.platform.ready().then(() => {
  /*    this.statusBar.styleDefault();
   */    // Commenting splashScreen Hide, so it won't hide splashScreen before auth check
      //this.splashScreen.hide();
      this.authService.getToken();
     });
  }

  // When Logout Button is pressed 
  logout() {
    this.authService.logout().subscribe(
      data => {
        this.alertService.presentToast(data['message']);        
      },
      error => {
        console.log(error);
      },
      () => {
        this.navCtrl.navigateRoot('/landing');
      }
    );
  }

}
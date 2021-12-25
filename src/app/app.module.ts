import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy, Platform } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HttpClientModule, HttpBackend, HttpXhrBackend } from '@angular/common/http';
import { HTTP } from '@ionic-native/http/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

//import { DocumentViewer} from '@ionic-native/document-viewer/ngx';

import { File } from '@ionic-native/file/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { ZipService } from './services/zip.service';
import {Zip} from '@ionic-native/zip/ngx'
import { NativeHttpModule, NativeHttpBackend, NativeHttpFallback } from 'ionic-native-http-connection-backend';

import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { Base64 } from '@ionic-native/base64/ngx';
import { FileChooser } from '@ionic-native/file-chooser/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { FileTransfer} from '@ionic-native/file-transfer/ngx';

import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { EnvService } from './services/env.service';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, HttpClientModule, NativeHttpModule],
  providers: [ FileTransfer, FilePath, FileChooser, Base64, AndroidPermissions, Diagnostic, 
    InAppBrowser,Zip, ZipService, File, FileOpener, HTTP, { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    {provide: HttpBackend, useClass: NativeHttpFallback, deps: [Platform, NativeHttpBackend, HttpXhrBackend]},
  NativeStorage, EnvService],
  bootstrap: [AppComponent],
})
export class AppModule {}

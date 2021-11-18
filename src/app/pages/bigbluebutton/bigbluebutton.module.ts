import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BigbluebuttonPageRoutingModule } from './bigbluebutton-routing.module';

import { BigbluebuttonPage } from './bigbluebutton.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BigbluebuttonPageRoutingModule
  ],
  declarations: [BigbluebuttonPage]
})
export class BigbluebuttonPageModule {}

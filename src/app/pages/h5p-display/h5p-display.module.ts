import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { H5pDisplayPageRoutingModule } from './h5p-display-routing.module';

import { H5pDisplayPage } from './h5p-display.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    H5pDisplayPageRoutingModule
  ],
  declarations: [H5pDisplayPage]
})
export class H5pDisplayPageModule {}

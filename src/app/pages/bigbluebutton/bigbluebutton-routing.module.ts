import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BigbluebuttonPage } from './bigbluebutton.page';

const routes: Routes = [
  {
    path: '',
    component: BigbluebuttonPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BigbluebuttonPageRoutingModule {}

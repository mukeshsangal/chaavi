import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { H5pDisplayPage } from './h5p-display.page';

const routes: Routes = [
  {
    path: '',
    component: H5pDisplayPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class H5pDisplayPageRoutingModule {}

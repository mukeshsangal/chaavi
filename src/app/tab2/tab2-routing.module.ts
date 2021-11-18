import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Tab2Page } from './tab2.page';

const routes: Routes = [
  {
    path: '',
    component: Tab2Page,
  },
  {
    path: 'h5p-display',
    loadChildren: () => import('../pages/h5p-display/h5p-display.module').then( m => m.H5pDisplayPageModule)
  },
  {
    path: 'assignment',
    loadChildren: () => import('../pages/assignment/assignment.module').then( m => m.AssignmentPageModule)
  },
  {
    path: 'bigbluebutton',
    loadChildren: () => import('../pages/bigbluebutton/bigbluebutton.module').then( m => m.BigbluebuttonPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Tab2PageRoutingModule {}

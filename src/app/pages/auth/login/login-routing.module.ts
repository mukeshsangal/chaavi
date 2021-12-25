import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginPage } from './login.page';
import { TabsPage } from 'src/app/tabs/tabs.page';
import { AuthGuard } from 'src/app/guard/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: LoginPage
  }/* ,
  {
    path: 'tabs',
    loadChildren: () => import('src/app/tabs/tabs.module').then(m => m.TabsPageModule),
    canActivate: [AuthGuard]
  } */
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LoginPageRoutingModule {}

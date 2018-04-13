import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ViewUserDetailPage } from './view-user-detail';

@NgModule({
  declarations: [
    ViewUserDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(ViewUserDetailPage),
  ],
})
export class ViewUserDetailPageModule {}

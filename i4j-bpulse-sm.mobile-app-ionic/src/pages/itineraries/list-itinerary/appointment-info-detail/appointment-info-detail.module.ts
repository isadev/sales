import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AppointmentInfoDetailPage } from './appointment-info-detail';

@NgModule({
  declarations: [
    AppointmentInfoDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(AppointmentInfoDetailPage),
  ],
})
export class AppointmentInfoDetailPageModule {}

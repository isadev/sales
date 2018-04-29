import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AppointmentStatusPage } from './appointment-status';

@NgModule({
  declarations: [
    AppointmentStatusPage,
  ],
  imports: [
    IonicPageModule.forChild(AppointmentStatusPage),
  ],
})
export class AppointmentStatusPageModule {}

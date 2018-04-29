import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AppointmentInfoHeaderPage } from './appointment-info-header';

@NgModule({
  declarations: [
    AppointmentInfoHeaderPage,
  ],
  imports: [
    IonicPageModule.forChild(AppointmentInfoHeaderPage),
  ],
})
export class AppointmentInfoHeaderPageModule {}

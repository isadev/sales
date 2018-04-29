import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UserAppointmentDetailPage } from './user-appointment-detail';

@NgModule({
  declarations: [
    UserAppointmentDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(UserAppointmentDetailPage),
  ],
})
export class UserAppointmentDetailPageModule {}

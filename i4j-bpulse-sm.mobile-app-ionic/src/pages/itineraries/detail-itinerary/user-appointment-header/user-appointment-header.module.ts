import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UserAppointmentHeaderPage } from './user-appointment-header';

@NgModule({
  declarations: [
    UserAppointmentHeaderPage,
  ],
  imports: [
    IonicPageModule.forChild(UserAppointmentHeaderPage),
  ],
})
export class UserAppointmentHeaderPageModule {}

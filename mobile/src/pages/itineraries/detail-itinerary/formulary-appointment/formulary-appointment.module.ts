import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FormularyAppointmentPage } from './formulary-appointment';
import { TranslateModule } from '@ngx-translate/core'

@NgModule({
  declarations: [
    FormularyAppointmentPage,
  ],
  imports: [
    IonicPageModule.forChild(FormularyAppointmentPage),
    TranslateModule,
  ],
})
export class FormularyAppointmentPageModule {}

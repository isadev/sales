import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ViewCustomerContactPage } from './view-customer-contact';

@NgModule({
  declarations: [
    ViewCustomerContactPage,
  ],
  imports: [
    IonicPageModule.forChild(ViewCustomerContactPage),
  ],
})
export class ViewCustomerContactPageModule {}

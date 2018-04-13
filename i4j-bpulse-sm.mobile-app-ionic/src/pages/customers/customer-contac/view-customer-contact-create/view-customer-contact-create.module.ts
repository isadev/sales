import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ViewCustomerContactCreatePage } from './view-customer-contact-create';

@NgModule({
  declarations: [
    ViewCustomerContactCreatePage,
  ],
  imports: [
    IonicPageModule.forChild(ViewCustomerContactCreatePage),
  ],
})
export class ViewCustomerContactCreatePageModule {}

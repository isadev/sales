import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ViewCustomerContactListPage } from './view-customer-contact-list';

@NgModule({
  declarations: [
    ViewCustomerContactListPage,
  ],
  imports: [
    IonicPageModule.forChild(ViewCustomerContactListPage),
  ],
})
export class ViewCustomerContactListPageModule {}

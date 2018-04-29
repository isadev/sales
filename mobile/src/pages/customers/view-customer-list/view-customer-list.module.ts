import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ViewCustomerListPage } from './view-customer-list';

@NgModule({
  declarations: [
    ViewCustomerListPage,
  ],
  imports: [
    IonicPageModule.forChild(ViewCustomerListPage),
  ],
})
export class ViewCustomerListPageModule {}

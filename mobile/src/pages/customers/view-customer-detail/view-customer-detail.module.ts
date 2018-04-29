import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ViewCustomerDetailPage } from './view-customer-detail';

@NgModule({
  declarations: [
    ViewCustomerDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(ViewCustomerDetailPage),
  ],
})
export class ViewCustomerDetailPageModule {}

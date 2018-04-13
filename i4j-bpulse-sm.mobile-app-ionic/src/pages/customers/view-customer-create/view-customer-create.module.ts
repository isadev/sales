import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ViewCustomerCreatePage } from './view-customer-create';

@NgModule({
  declarations: [
    ViewCustomerCreatePage,
  ],
  imports: [
    IonicPageModule.forChild(ViewCustomerCreatePage),
  ],
})
export class ViewCustomerCreatePageModule {}

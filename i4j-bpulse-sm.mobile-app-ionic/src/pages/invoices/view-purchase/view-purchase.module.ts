import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ViewPurchasePage } from './view-purchase';

@NgModule({
  declarations: [
    ViewPurchasePage,
  ],
  imports: [
    IonicPageModule.forChild(ViewPurchasePage),
  ],
})
export class ViewPurchasePageModule {}

import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ViewPurchaseDetailPage } from './view-purchase-detail';

@NgModule({
  declarations: [
    ViewPurchaseDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(ViewPurchaseDetailPage),
  ],
})
export class ViewPurchaseDetailPageModule {}

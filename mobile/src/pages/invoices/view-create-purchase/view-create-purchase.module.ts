import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ViewCreatePurchasePage } from './view-create-purchase';

@NgModule({
  declarations: [
    ViewCreatePurchasePage,
  ],
  imports: [
    IonicPageModule.forChild(ViewCreatePurchasePage),
  ],
})
export class ViewCreatePurchasePageModule {}

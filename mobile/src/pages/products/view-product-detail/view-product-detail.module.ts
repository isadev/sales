import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ViewProductDetailPage } from './view-product-detail';

@NgModule({
  declarations: [
    ViewProductDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(ViewProductDetailPage),
  ],
})
export class ViewProductDetailPageModule {}

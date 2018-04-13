import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ViewProductsListPage } from './view-products-list';

@NgModule({
  declarations: [
    ViewProductsListPage,
  ],
  imports: [
    IonicPageModule.forChild(ViewProductsListPage),
  ],
})
export class ViewProductsListPageModule {}

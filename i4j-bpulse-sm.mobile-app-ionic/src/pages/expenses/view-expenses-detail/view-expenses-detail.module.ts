import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ViewExpensesDetailPage } from './view-expenses-detail';

@NgModule({
  declarations: [
    ViewExpensesDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(ViewExpensesDetailPage),
  ],
})
export class ViewExpensesDetailPageModule {}

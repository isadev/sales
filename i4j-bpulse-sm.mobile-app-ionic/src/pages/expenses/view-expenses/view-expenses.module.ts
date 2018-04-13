import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ViewExpensesPage } from './view-expenses';

@NgModule({
  declarations: [
    ViewExpensesPage,
  ],
  imports: [
    IonicPageModule.forChild(ViewExpensesPage),
  ],
})
export class ViewExpensesPageModule {}

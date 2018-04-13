import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ViewCreateExpensePage } from './view-create-expense';

@NgModule({
  declarations: [
    ViewCreateExpensePage,
  ],
  imports: [
    IonicPageModule.forChild(ViewCreateExpensePage),
  ],
})
export class ViewCreateExpensePageModule {}

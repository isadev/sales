import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular/navigation/view-controller';
import { NavParams } from 'ionic-angular/navigation/nav-params';
import { NavController } from 'ionic-angular/navigation/nav-controller';
import { ViewCreateExpensePage } from '../../pages/expenses/view-create-expense/view-create-expense';

@Component({
  selector: 'pop-over-menu',
  templateUrl: 'pop-over-menu.html'
})
export class PopOverMenuComponent {

  expense_detail: string;

  constructor(public viewCtrl: ViewController, public navParams: NavParams, public navCtrl: NavController) {
    this.expense_detail = this.navParams.get('expense');
  }

  // close() {
  //   this.viewCtrl.dismiss();
  // }

  got_to_edit_expenses() {
    this.navCtrl.push(ViewCreateExpensePage, { expense_detail: this.expense_detail });
    this.viewCtrl.dismiss();
  }
}

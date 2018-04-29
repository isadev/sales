import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ModalController } from 'ionic-angular/components/modal/modal-controller';
import { PopoverController } from 'ionic-angular/components/popover/popover-controller';
import { ModalsPage } from '../../modals/modals';
import { PopOverMenuComponent } from '../../../components/pop-over-menu/pop-over-menu';
import { Expense } from '../../../entities/Expense';

@IonicPage()
@Component({
  selector: 'page-view-expenses-detail',
  templateUrl: 'view-expenses-detail.html',
})
export class ViewExpensesDetailPage {
  expense_detail: Expense;
  itinerary_status_id: number;

  constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController, public popoverCtrl: PopoverController) {
    this.expense_detail = this.navParams.get('expense_detail');
    this.itinerary_status_id = this.navParams.get('itinerary_status_id');
  }

  ionViewDidLoad() {

  }

  show_img() {
    let img_modal = this.modalCtrl.create(ModalsPage, { img_name: this.expense_detail.atteched, from_page: 'view_expenses_detail' });
    img_modal.present();
  }

  showMenu(event) {
    let popover = this.popoverCtrl.create(PopOverMenuComponent, { expense: this.expense_detail }, { cssClass: 'popover-width' });
    popover.present({
      ev: event
    });
  }
}

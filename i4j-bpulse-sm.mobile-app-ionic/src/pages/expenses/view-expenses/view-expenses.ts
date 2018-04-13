import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ViewExpensesDetailPage } from '../view-expenses-detail/view-expenses-detail';
import { TranslateService } from '@ngx-translate/core';
import { ExpenseCrudProvider } from '../../../providers/expense-crud/expense-crud';
import { Expense } from '../../../entities/Expense';

@IonicPage()
@Component({
  selector: 'page-view-expenses',
  templateUrl: 'view-expenses.html',
})
export class ViewExpensesPage {
  list_expenses: Array<Expense>;
  msg_please_wait: string;
  page: number = 0;
  itinerary_status_id: number;

  constructor(public expenseCrud: ExpenseCrudProvider, public translate: TranslateService, public navCtrl: NavController, public navParams: NavParams) {
    this.list_expenses = this.navParams.get('expense');
    this.itinerary_status_id = this.navParams.get('itinerary_status_id');

    this.translate.get('msg_please_wait').subscribe(response => {
      this.msg_please_wait = response;
    });
  }

  ionViewDidLoad() {

  }

  async buildData() {
    // Buscamos cualquier expense para conseguir a partir del itinerario las demas expenses
    this.expenseCrud.getListExpensesAsync(this.list_expenses[0]).then(async (response: any) => {
      if (this.page == 0) {
        this.list_expenses = response;
      }
      else {
        response.forEach(add_expense => {
          this.list_expenses.push(add_expense);
        });
      }
    });

  }

  async doRefresh(refresher) {
    this.page = 0;
    await this.buildData();
    refresher.complete();
  }

  // Carga de objetos mientras va bajando con el scroll
  async doInfinite(infiniteScroll) {
    this.page = this.page + 1;
    await this.buildData();
    infiniteScroll.complete();
  }

  detail_expenses(index) {
    this.navCtrl.push(ViewExpensesDetailPage, { expense_detail: this.list_expenses[index], itinerary_status_id: this.itinerary_status_id });
  }
}

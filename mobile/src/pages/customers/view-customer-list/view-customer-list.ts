import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { ViewCustomerDetailPage } from '../view-customer-detail/view-customer-detail';
import { ViewCustomerCreatePage } from '../view-customer-create/view-customer-create';
import { CustomerCrudProvider } from '../../../providers/customer-crud/customer-crud';
import { Customer } from '../../../entities/Customer';

@IonicPage()
@Component({
  selector: 'page-view-customer-list',
  templateUrl: 'view-customer-list.html',
})
export class ViewCustomerListPage {

  customer_list: Array<Customer>;
  page: number = 0;
  msg_please_wait: string;
  words: string = "";
  press_search: boolean = false;
  shouldShowCancel: boolean = true;
  max_result: number = 100;
  total_items: number;
  result_per_page: number = 100;
  handler: Function;

  constructor(
    public customerCrud: CustomerCrudProvider,
    public events: Events,
    public translate: TranslateService,
    public navCtrl: NavController,
    public navParams: NavParams
  ) {
    this.translate.get('msg_please_wait').subscribe(response => {
      this.msg_please_wait = response;
    });

    this.buildData();
  }

  ionViewDidLoad() {
    this.handler = async (userEventData) => {
      this.buildData();
    };

    this.events.subscribe('customer_deleted', this.handler);
  }

  ionViewWillUnload() {
    this.events.unsubscribe('customer_deleted', this.handler);
  }

  buildData(add_data: boolean = false) {
    this.customerCrud.getCustomerListAsync(this.page, this.words).then((response: any) => {
      this.total_items = response.total_items;

      if (add_data) {
        response.customers.forEach(add_customer => {
          this.customer_list.push(add_customer);
        });
      }
      else {
        this.customer_list = response.customers;
      }
    });
  }

  async doRefresh(refresher) {
    this.page = 0;
    this.words = "";
    await this.buildData();
    refresher.complete();
  }

  // Carga de objetos mientras va bajando con el scroll
  async doInfinite(infiniteScroll) {
    let div = Math.ceil(this.total_items / this.result_per_page);
    //let mod = this.max_result % this.result_per_page;
    if (div >= 2) {
      //sumarle solo el entero
      this.page = this.page + 1;
    }

    if ((this.page > 0) && (this.page < div)) {
      await this.buildData(true);
    }
    infiniteScroll.complete();
  }

  goToDetailCustomer(index) {
    this.navCtrl.push(ViewCustomerDetailPage, { customer: this.customer_list[index] });
  }

  addNewCustomer() {
    //ir a la vista de view-customer-create con la difernciacion de que es crear y no editarlo
    this.navCtrl.push(ViewCustomerCreatePage, { section_access: "create_customer", client_id: 0, customer: null });
  }

  btnSearch() {
    if (this.press_search) {
      this.press_search = false;
      this.words = "";
    }
    else {
      this.press_search = true;
    }
  }

  onInput(event) {
    let val = event.target.value;

    if (val && val.trim() !== '') {
      this.page = 0;
      this.words = val;
      this.buildData();
    }
  }

  async onCancel(event: Event) {
    this.page = 0;
    this.press_search = false;
    this.words = "";
    await this.buildData();
  }
}

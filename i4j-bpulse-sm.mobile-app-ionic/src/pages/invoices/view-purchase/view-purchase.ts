import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { ViewPurchaseDetailPage } from '../view-purchase-detail/view-purchase-detail';
import { InvoiceCrudProvider } from '../../../providers/invoice-crud/invoice-crud';
import { Invoice } from '../../../entities/Invoice';
import { Itinerary } from '../../../entities/Itinerary';

@IonicPage()
@Component({
  selector: 'page-view-purchase',
  templateUrl: 'view-purchase.html',
})
export class ViewPurchasePage {

  list_invoice: Array<Invoice> = [];
  itinerary: Itinerary;
  page: number = 0;
  words: string = "";
  press_search: boolean = false;
  shouldShowCancel: boolean = true;
  total_items: number;
  result_per_page: number = 100;
  handler: Function;

  constructor(public invoiceCrud: InvoiceCrudProvider, public events: Events, public navCtrl: NavController, public navParams: NavParams, public translate: TranslateService) {
    this.buildData();
  }

  async buildData(add_data: boolean = false) {
    await this.invoiceCrud.getInvoiceListAsync(this.page, this.words).then((response: any) => {
      this.total_items = response.invoice_total_items;
      if (add_data) {
        response.invoices.forEach(add_invoice => {
          this.list_invoice.push(add_invoice);
        });
      }
      else {
        this.list_invoice = response.invoices;
      }
    });
  }

  ionViewWillUnload() {
    this.events.unsubscribe('invoice_deleted', this.handler);
  }

  ionViewDidLoad() {
    this.handler = async (userEventData) => {
      await this.buildData();
    };

    this.events.subscribe('invoice_deleted', this.handler);
  }

  goDetailInvoiceOrder(invoice: Invoice) {
    this.navCtrl.push(ViewPurchaseDetailPage, { invoice: invoice });
  }

  // Funcion para actualizar la lista al hacer halar hacia abajo 
  async doRefresh(refresher) {
    this.page = 0;
    await this.buildData();
    refresher.complete();
  }

  // Carga de itinerarios mientras va bajando con el scroll
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
      this.words = val;
      this.page = 0;
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

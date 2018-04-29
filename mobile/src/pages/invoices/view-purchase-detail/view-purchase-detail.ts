import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { ViewCreatePurchasePage } from '../view-create-purchase/view-create-purchase';
import { CheckConectionProvider } from '../../../providers/check-conection/check-conection';
import { ViewProductsListPage } from '../../products/view-products-list/view-products-list';
import { InvoiceCrudProvider } from '../../../providers/invoice-crud/invoice-crud';
import { AlertGeneratorProvider } from '../../../providers/alert-generator/alert-generator';
import { Invoice } from '../../../entities/Invoice';
import { InvoiceProduct } from '../../../entities/InvoiceProduct';

@IonicPage()
@Component({
  selector: 'page-view-purchase-detail',
  templateUrl: 'view-purchase-detail.html',
})
export class ViewPurchaseDetailPage {
  show_ion_fab: boolean = false;
  invoice: Invoice;
  handler_event_invoice: Function;
  handler_event_itinerary: Function;

  constructor(public alertGenerator: AlertGeneratorProvider, public invoiceCrud: InvoiceCrudProvider, public events: Events, public conectionApi: CheckConectionProvider, public navCtrl: NavController, public navParams: NavParams) {
    let invoice: Invoice = this.navParams.get('invoice');
    this.invoiceCrud.buildInvoiceObjectByInvoice(invoice).then(response => {
      console.log(response);
      this.invoice = response;
    });
  }

  ionViewDidLoad() {
    //referencia de la funcion
    this.handler_event_invoice = (userEventData) => {
      this.invoiceCrud.buildInvoiceObjectByInvoice(this.navParams.get('invoice')).then(response => {
        this.invoice = response;
      });
    };

    //Evento para obtener los productos seleccionados desde la vista products
    this.events.subscribe('products_selected', this.handler_event_invoice);
    this.events.subscribe('invoice_added', this.handler_event_invoice);
    this.events.subscribe('invoice_product_deleted', this.handler_event_invoice);
    this.events.subscribe('invoice_product_added', this.handler_event_invoice);
  }

  ionViewWillUnload() {
    this.events.unsubscribe('products_selected', this.handler_event_invoice);
    this.events.unsubscribe('invoice_added', this.handler_event_invoice);
    this.events.unsubscribe('invoice_product_deleted', this.handler_event_invoice);
  }

  editInvoice() {
    this.show_ion_fab = false;
    this.navCtrl.push(ViewCreatePurchasePage, { invoice: this.invoice, itinerary: this.invoice.itinerary, section_access: 'edit_purchase_order' });
  }

  async delete() {
    let is_conected = await this.conectionApi.showConectionAlert();

    if (is_conected) {
      this.alertGenerator.showLoading();
      try {
        this.invoiceCrud.deleteInvoice(this.invoice).then(response => {
          this.alertGenerator.dismissLoading();
          this.show_ion_fab = false;
          this.alertGenerator.getAlert('ok');
          this.navCtrl.pop().then(() => {
            this.events.publish('invoice_deleted', { itinerary: this.invoice.itinerary, text_change: 'add' });
          });
        }).catch( error => {
          this.show_ion_fab = true;
          this.alertGenerator.dismissLoading();
          this.alertGenerator.getAlert('error');
        });
      } catch(error) {
        
      }
    }
  }

  async deleteInvoiceProduct(invoice_product: InvoiceProduct) {
    let is_conected: any = this.conectionApi.showConectionAlert();

    if (is_conected) {
      this.alertGenerator.showLoading();
      this.invoiceCrud.deleteInvoiceProduct(invoice_product).then(response => {
        this.show_ion_fab = false;
        this.alertGenerator.dismissLoading();
        this.alertGenerator.getAlert('ok');
        this.events.publish('invoice_product_deleted', { itinerary: this.invoice.itinerary, text_change: 'see' });
      })
      .catch( error => {
        this.alertGenerator.dismissLoading();
        this.alertGenerator.getAlert('error');
      });
    }
}

  createInvoiceProduct() {
    this.show_ion_fab = false;
    this.navCtrl.push(ViewProductsListPage, { invoice: this.invoice, itinerary: this.invoice.itinerary, section_access: 'add_purchase_order_product' });
  }

  clickIonFab() {
    this.show_ion_fab = !this.show_ion_fab;
  }
}

import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { ViewController } from 'ionic-angular/navigation/view-controller';
import { ViewProductDetailPage } from '../view-product-detail/view-product-detail';
import { TranslateService } from '@ngx-translate/core';
import { ViewCreatePurchasePage } from '../../invoices/view-create-purchase/view-create-purchase';
import { ProductCrudProvider } from '../../../providers/product-crud/product-crud';
import { SharedMethodProvider } from '../../../providers/shared-method/shared-method';
import { InvoiceCrudProvider } from '../../../providers/invoice-crud/invoice-crud';
import { Invoice } from '../../../entities/Invoice';
import { Itinerary } from '../../../entities/Itinerary';

@IonicPage()
@Component({
  selector: 'page-view-products-list',
  templateUrl: 'view-products-list.html',
})
export class ViewProductsListPage {

  products: Array<any> = [];
  previous_product_selected: any; //Objeto de tipo invoice_product con mas datos
  previous_invoice_product_existed: any; //Objeto de tipo invoice_product con mas datos
  invoice: Invoice;
  itinerary: Itinerary;
  from_section: string;
  show_chevron: boolean = false;
  show_button_add: boolean = true;
  page: number = 0;
  msg_please_wait: string;
  max_result: number = 100;
  total_items: number;
  words: string = "";
  press_search: boolean = false;
  shouldShowCancel: boolean = true;
  result_per_page: number = 100;

  constructor(public invoiceCrud: InvoiceCrudProvider, public sharedMethod: SharedMethodProvider, public translate: TranslateService, private viewCtrl: ViewController, public productCrud: ProductCrudProvider, public navCtrl: NavController, public navParams: NavParams, public events: Events) {

    this.previous_product_selected = this.navParams.get('previous_selected');

    //desde el detalle de invoice se reciben estos parametros
    this.invoice = this.navParams.get('invoice');
    this.itinerary = this.navParams.get('itinerary');
    this.from_section = this.navParams.get('section_access');

    this.translate.get('msg_please_wait').subscribe(response => {
      this.msg_please_wait = response;
    });

    this.buildData();
  }

  buildData(add_data: boolean = false) {
    // Si van a editar un producto lo colocamos como seleccionado (de la vista de view-create-purchase)
    if (typeof this.previous_product_selected != 'undefined') {
      // Recorremos el listado de productos
      this.sharedMethod.getListProductsAsync(false, this.page, this.words).then(async (response: any) => {
        this.total_items = response.total_items;

        if (add_data) {
          response.products.forEach(add_product => {
            this.products.push(add_product);
          });
        }
        else {
          this.products = response.products;
        }

        this.products.forEach(element => {
          element.selected = false;
          // Recorremos el listado de productos seleccionados previamente
          this.previous_product_selected.forEach(element_previous => {
            if (element_previous.id == element.id)
              element.selected = true;
            element.formulary_input_discount = element_previous.formulary_input_discount;
            element.formulary_input_quantity = element_previous.formulary_input_quantity;
          });
          if (!element.selected) {
            element.formulary_input_discount = "";
            element.formulary_input_quantity = 0;
          }
        });
      });
    }
    //Si viene de la vista de view-purchase-detail
    else if (this.from_section == 'add_purchase_order_product') {
      // Buscamos los productos que ya han sido agregados a ese invoice
      this.invoiceCrud.getInvoiceProductByInvoiceAsync(this.invoice).then(async response => {
        this.previous_invoice_product_existed = response;
      });

      this.sharedMethod.getListProductsAsync(false, this.page, this.words).then(async (response: any) => {
        this.total_items = response.total_items;

        if (add_data) {
          response.products.forEach(add_product => {
            this.products.push(add_product);
          });
        }
        else {
          this.products = response.products;
        }
        this.products = response.products;

        this.products.forEach(element => {
          element.selected = false;

          // Recorremos el listado de productos existentes para la orden de compra
          this.previous_invoice_product_existed.forEach(element_previous => {
            // buscar que el producto pertenezca al invoice y marcarlo, los demas productos solo listarlos
            if (element_previous.product.id == element.id)
              element.selected = true;
          });

          if (!element.selected) {
            element.formulary_input_discount = "";
            element.formulary_input_quantity = 0;
          }
        });
      });
    }
    // Si venimos del listado de productos desde el menu
    else {
      this.sharedMethod.getListProductsAsync(false, this.page, this.words).then(async (response: any) => {
        this.total_items = response.total_items;

        if (add_data) {
          response.products.forEach(add_product => {
            this.products.push(add_product);
          });
        }
        else {
          this.products = response.products;
        }
      });
      this.show_chevron = true;
      this.show_button_add = false;
    }
  }

  async doRefresh(refresher) {
    this.page = 0;
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
      await this.buildData();
    }
    infiniteScroll.complete();
  }

  ionViewDidLoad() {

  }

  //Seleccionar el producto para colorearlo
  selectProduct(product) {
    // Si la seccion de donde se viene es para agregar productos permitimos la coloracion
    if ((this.from_section == 'add_purchase_order_product') || (this.previous_product_selected != null)) {
      if ((!product.selected) && (product.show)) {
        product.selected = true;
      }
      else {
        product.selected = false;
      }
    }
    // Si venimos del listado de productos desde el menu
    else {
      this.navCtrl.push(ViewProductDetailPage, { product_detail: product });
    }
  }

  //Filtrar el producto para enviarlo a la vista anterior
  addProduct() {
    let product_selected: any = this.products.filter((value, index) => ((value.selected == true) && (value.show)));
    this.events.publish('products_selected', product_selected);
    if (this.from_section != 'add_purchase_order_product')
      this.navCtrl.pop();
    else {
      this.navCtrl.push(ViewCreatePurchasePage, { invoice: this.invoice, itinerary: this.itinerary, section_access: 'edit_purchase_order' }).then(() => {
        // first we find the index of the current view controller:
        const index = this.viewCtrl.index;
        // then we remove it from the navigation stack
        this.navCtrl.remove(index);
        // And pubish once more the event after erased this current view
        this.events.publish('products_selected', product_selected);
      });
    }
  }

  btnSearch() {
    if (this.press_search) {
      this.words = "";
    }
    this.press_search = !this.press_search;
  }

  onInput(event) {
    let val = event.target.value;

    if (val && val.trim() !== '') {
      this.page = 0;
      this.words = val;
      this.buildData();
    }
  }

  onCancel(event: Event) {
    this.page = 0;
    this.press_search = false;
    this.words = "";
    this.buildData();
  }
}

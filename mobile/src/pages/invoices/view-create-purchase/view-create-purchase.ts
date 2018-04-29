import { Component, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';
import * as moment from 'moment';
import { DateServiceProvider } from '../../../providers/date-service/date-service';
import { ViewProductsListPage } from '../../products/view-products-list/view-products-list';
import { SharedMethodProvider } from '../../../providers/shared-method/shared-method';
import { InvoiceCrudProvider } from '../../../providers/invoice-crud/invoice-crud';
import { FormGroup } from '@angular/forms/src/model';
import { Invoice } from '../../../entities/Invoice';
import { Itinerary } from '../../../entities/Itinerary';
import { AlertGeneratorProvider } from '../../../providers/alert-generator/alert-generator';

@IonicPage()
@Component({
  selector: 'page-view-create-purchase',
  templateUrl: 'view-create-purchase.html',
  host: {
    '(document:click)': 'handleClick($event)',
  },
})
export class ViewCreatePurchasePage implements OnInit {
  createAppointmentForm: any;
  date_max: string = "2020-10-31";
  date_min: string;
  date_format: string = "DDDD MMM D, YYYY";
  date_hour: string = "hh:mm a";
  date_days_short: Array<any> = [];
  date_days_name: Array<any> = [];
  date_month_name: Array<any> = [];
  date_month_short: Array<any> = [];

  create_purchase_form: any;
  from_section: string;
  purchase_order_title: string;
  product_list: any;
  all_complete: boolean = false;

  old_purchase_order_code: string;
  old_purchase_order_discount: number;
  old_purchase_order_order_date_time: string;
  old_purchase_order_delivery_date_time: string;
  old_purchase_order_delivery_address: string;
  old_purchase_order_city: string = "";
  old_purchase_order_payment_method: string = "";
  create_items_form: FormGroup;
  item_product_list_added: Array<any> = [];

  filtered_city_list: Array<string> = [];
  filtered_list_payment: Array<string> = [];
  element_ref: ElementRef;
  city: Array<string>;
  payment_method: Array<string>;
  is_new: boolean = true;
  old_invoice: Invoice;
  locale: string;
  update_itinerary: Itinerary;
  add_list_product: boolean = false;
  handler_event: Function;
  from_last_invoice: boolean = false;

  time_zone_name: string;

  constructor(
    public invoiceCrud: InvoiceCrudProvider,
    public sharedMethod: SharedMethodProvider,
    public myElement: ElementRef,
    public translateService: TranslateService,
    public dateService: DateServiceProvider,
    public events: Events,
    public alertCtrl: AlertController,
    public formBuilder: FormBuilder,
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertGenerator: AlertGeneratorProvider
  ) {
    this.locale = this.translateService.getDefaultLang();
    moment.locale(this.locale);
    let today = moment();
    this.date_min = moment().format();

    this.element_ref = myElement;
    this.sharedMethod.getOnlyCityListAsync().then(response => {
      this.city = response
    });

    this.sharedMethod.getPaymentMethodAsync().then(response => {
      this.payment_method = response;
    })

    this.sharedMethod.getListProductsAsync().then(async response => {
      this.product_list = response;
    });

    this.from_section = this.navParams.get('section_access');
    this.from_last_invoice = this.navParams.get('from_last_invoice');
    this.old_purchase_order_order_date_time = today.format();
    this.old_purchase_order_delivery_date_time = today.format();

    let section_name;
    this.update_itinerary = this.navParams.get('itinerary');
    this.old_invoice = this.navParams.get('invoice');
    if ((typeof this.from_last_invoice != 'undefined') && (this.from_last_invoice)) {
      this.getLastInvoice();
    }

    if (this.from_section === 'edit_purchase_order') {
      this.translateService.get('view_edit_purchase_order_title').subscribe(response => {
        section_name = response;
      });
    }
    else {
      this.translateService.get('view_create_purchase_order_title').subscribe(response => {
        section_name = response;
      });
    }

    this.purchase_order_title = section_name;

    // Si la data es para modificar    
    if (this.from_section === 'edit_purchase_order') {
      this.is_new = false;
      this.buildOldInvoice();
    }

    this.create_purchase_form = formBuilder.group({
      purchase_order_code: ['', Validators.compose([Validators.required])],
      purchase_order_discount: ['', Validators.compose([Validators.required])],
      purchase_order_order_date_time: ['', Validators.compose([Validators.required])],
      purchase_order_delivery_date_time: ['', Validators.compose([Validators.required])],
      purchase_order_delivery_address: ['', Validators.compose([Validators.required])],
      purchase_order_city: ['', Validators.compose([Validators.required])],
      purchase_order_payment_method: ['', Validators.compose([Validators.required])],
    });
  }

  ionViewDidLoad() {
    //referencia de la funcion
    this.handler_event = (user_event_data) => {
      // user_event_data is an array of parameters
      this.item_product_list_added = user_event_data;
      this.create_purchase_form.patchValue({ product_list: this.item_product_list_added });
      //Si en vez de agregar producto lo desmarcaron se inhabilita la opcion de guardar
      this.validate(null);
      this.add_list_product = true;
    };

    //Evento para obtener los productos seleccionados desde la vista products
    this.events.subscribe('products_selected', this.handler_event);
  }

  ionViewWillUnload() {
    this.events.unsubscribe('products_selected', this.handler_event);
  }

  // Inicializamos los valores para manipular las fechas en el idioma solicitado en la app
  ngOnInit() {
    let dateTranslate: any = this.dateService.getTranslate(this.locale);

    this.date_days_name = dateTranslate['days_name'];
    this.date_days_short = dateTranslate['days_short_name'];
    this.date_month_name = dateTranslate['month_name'];
    this.date_month_short = dateTranslate['month_name_short'];

    // Si vamos a editar el formulario estaba ya validado
    if (this.from_section === 'edit_purchase_order') {
      this.all_complete = true;
      this.create_purchase_form.patchValue({ product_list: this.item_product_list_added });
    }
    // Si venimos a crear una nueva orden de compra los productos no deben existir
    else
      this.item_product_list_added = [];
  }

  async saveForm() {
    this.alertGenerator.showLoading();
    this.invoiceCrud.saveInvoice(
      this.create_purchase_form.value,
      this.is_new,
      this.add_list_product,
      this.old_invoice,
      this.update_itinerary,
      this.item_product_list_added).then(() => {
        this.events.publish('invoice_added', { itinerary: this.update_itinerary, text_change: 'see' });
        this.events.publish('invoice_product_added', { itinerary: this.update_itinerary, text_change: 'see' });
        this.alertGenerator.dismissLoading();
        this.alertGenerator.getAlert('ok');
        this.navCtrl.pop();
      })
      .catch(error => {
        this.alertGenerator.dismissLoading();
        this.alertGenerator.getAlert('error');
      });
  }

  buildOldInvoice() {
    // let old_data = this.restApi.getOldPurchaseOrderByCriteria(update_itinenary, this.old_invoice);
    let old_products: any = { name: "", formulary_input_discount: "", formulary_input_quantity: 0, selected: true, id: 0 };
    let list_products: Array<any> = [];

    let old_order_date = moment(this.old_invoice.order_date_time);
    let old_delivery_date = moment(this.old_invoice.delivery_date_time);

    this.old_purchase_order_code = this.old_invoice.code;
    this.old_purchase_order_discount = this.old_invoice.discount;
    this.old_purchase_order_delivery_address = this.old_invoice.delivery_address;
    this.old_purchase_order_city = this.old_invoice.city.name;
    this.old_purchase_order_payment_method = this.old_invoice.payment_method.name;
    this.old_purchase_order_order_date_time = old_order_date.format();
    this.old_purchase_order_delivery_date_time = old_delivery_date.format();

    // Leemos los productos existentes y los asignamos a la estructura para editarlos
    let length_invoice_product = this.old_invoice.invoice_product.length;
    for (let i = 0; i < length_invoice_product; i++) {
      old_products.name = this.old_invoice.invoice_product[i].product.name;
      old_products.formulary_input_discount = this.old_invoice.invoice_product[i].discount;
      old_products.formulary_input_quantity = this.old_invoice.invoice_product[i].quantity;
      old_products.id = this.old_invoice.invoice_product[i].product.id;

      list_products.push(old_products);
      this.item_product_list_added.push(list_products);

      // Reinicializamos los valores para el siguiente producto
      old_products = {
        name: "",
        formulary_input_discount: "",
        formulary_input_quantity: 0,
        selected: true,
        id: -1,
      };
    };

    //Si la lista de productos cuando estamos añadiendo un producto nuevo en vez de editar el invoice
    if (this.old_invoice.invoice_product.length > 0)
      this.item_product_list_added = list_products;
  }

  async getLastInvoice() {
    this.old_invoice = await this.invoiceCrud.getLastInvoiceCreated();
    if (typeof this.old_invoice != 'undefined') {
      if (this.old_invoice.invoice_product.length > 0)
        this.add_list_product = true;
      this.buildOldInvoice();
    }
  }

  // Ir a la vista de seleccionar productos para incluirlos en la orden de compra
  goSelectProduct() {
    this.navCtrl.push(ViewProductsListPage, { previous_selected: this.item_product_list_added });
  }

  // Validamos si tras incluir los campos para los valores de los productos el fomulario esta bien
  validate(event) {
    let validate = true;

    if (this.item_product_list_added.length < 1) {
      validate = false;
    }
    else {
      // Si los productos no han sido cargados
      this.item_product_list_added.forEach(element => {
        if ((typeof element.formulary_input_discount === 'undefined') || ((element.formulary_input_quantity == 0) || (element.formulary_input_discount.length < 1)))
          validate = false
      });
      // Si algun campo del formulario falta por introducir datos
      if (this.create_purchase_form.status.toLowerCase == "invalid") {
        validate = false
      }
    }

    this.all_complete = validate;
  }

  /* Filtramos la palabra ingresada y comparamos si existe dentro de las opciones */
  filter() {
    if (this.old_purchase_order_city !== "") {
      this.filtered_city_list = this.city.filter((el) => {
        return el.toLowerCase().indexOf(this.old_purchase_order_city.toLowerCase()) > -1;
      }); //Enlazamos a la lista a aquellas palabras que cumplan con lo ingresado
    } else {
      this.filtered_city_list = [];
    }
  }

  select(item) {
    this.old_purchase_order_city = item;
    this.filtered_city_list = [];
  }

  // Evaluamos si selecciono un item para borrar la lista de opciones
  handleClick(event) {
    let clicked_component: any = event.target;
    do {
      clicked_component = clicked_component.parentNode;
    } while (clicked_component);
    this.filtered_city_list = [];
  }

  /* Filtramos la palabra ingresada y comparamos si existe dentro de las opciones */
  filterPayment() {
    if (this.old_purchase_order_payment_method !== "") {
      this.filtered_list_payment = this.payment_method.filter((el) => {
        return el.toLowerCase().indexOf(this.old_purchase_order_payment_method.toLowerCase()) > -1;
      }); //Enlazamos a la lista a aquellas palabras que cumplan con lo ingresado
    } else {
      this.filtered_list_payment = [];
    }
  }

  selectPayment(item) {
    this.old_purchase_order_payment_method = item;
    this.filtered_list_payment = [];
  }
}

import { Component, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';
import { Events } from 'ionic-angular/util/events';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { ViewCustomerContactListPage } from '../customer-contac/view-customer-contact-list/view-customer-contact-list';
import { CustomerCrudProvider } from '../../../providers/customer-crud/customer-crud';
import { SharedMethodProvider } from '../../../providers/shared-method/shared-method';
import { FormGroup } from '@angular/forms/src/model';
import { Customer } from '../../../entities/Customer';
import { CustomerContact } from '../../../entities/CustomerContact';
import { Itinerary } from '../../../entities/Itinerary';
import { AlertGeneratorProvider } from '../../../providers/alert-generator/alert-generator';

@IonicPage()
@Component({
  selector: 'page-view-customer-create',
  templateUrl: 'view-customer-create.html',
  host: {
    '(document:click)': 'handleClick($event)',
  },
})
export class ViewCustomerCreatePage implements OnInit {

  from_section: string;
  create_customer_form: FormGroup;
  customer_title: string;
  all_complete: boolean = false;
  from_itinerary: Itinerary;

  old_customer: Customer;
  old_customer_name: string;
  old_customer_city_name: string = '';
  old_customer_phone: string;
  old_customer_address: string;
  old_customer_postal_code: number;
  old_customer_nit: string;
  item_contact_list_added: Array<CustomerContact>;

  filtered_city_list: Array<string> = [];
  element_ref: ElementRef;
  city: Array<string>;
  is_new: boolean = true;
  from_add_contact: boolean = false;

  constructor(public alertGenerator: AlertGeneratorProvider, public myElement: ElementRef, public events: Events, public sharedMethod: SharedMethodProvider, public customerCrud: CustomerCrudProvider, public alertCtrl: AlertController, public formBuilder: FormBuilder, public translate: TranslateService, public navCtrl: NavController, public navParams: NavParams) {
    this.element_ref = myElement;
    this.sharedMethod.getOnlyCityListAsync().then(response => {
      this.city = response;
    });

    this.from_section = this.navParams.get('section_access');

    let section_name;
    this.old_customer = this.navParams.get('customer');

    if (this.from_section === 'create_customer') {
      this.translate.get('view_create_customer_title').subscribe(response => {
        section_name = response;
      });
    }
    else {
      this.translate.get('view_edit_customer_title').subscribe(response => {
        section_name = response;
      });
    }
    this.customer_title = section_name;

    //Evento para obtener los contactos seleccionados desde la vista contacts
    this.events.subscribe('contact_selected', (userEventData) => {
      this.item_contact_list_added = userEventData;
      //Indicamos que esta agregando un contacto ya existente
      this.from_add_contact = true;
    });

    this.create_customer_form = formBuilder.group({
      customer_name: ['', Validators.compose([Validators.required])],
      customer_city_name: ['', Validators.compose([Validators.required])],
      customer_phone: ['', Validators.compose([Validators.required])],
      customer_address: ['', Validators.compose([Validators.required])],
      customer_postal_code: ['', Validators.compose([Validators.required])],
      customer_nit: ['', Validators.compose([Validators.required])],
    });

    this.createOldDataOfCustomer();
  }

  async createOldDataOfCustomer() {
    let with_all_info_customer = this.navParams.get('is_complete');
    if ((typeof with_all_info_customer != 'undefined') && (!with_all_info_customer)) {
      this.from_itinerary = this.navParams.get('itinerary');
      await this.customerCrud.getDataOfCustomer(this.old_customer).then(response => {
        this.old_customer = response;
      });
    }

    // Si la data es para modificar    
    if (this.from_section === 'edit_customer') {
      this.is_new = false;
      let old_customer_contacts = { last_name: "", first_name: "", selected: true, id: "" };
      let list_products = [];

      this.old_customer_name = this.old_customer.name;
      this.old_customer_city_name = this.old_customer.city.name;
      this.old_customer_phone = this.old_customer.phone;
      this.old_customer_address = this.old_customer.address;
      this.old_customer_postal_code = this.old_customer.postal_code;
      this.old_customer_nit = this.old_customer.nit;

      // Leemos los contactos existentes y los asignamos a la estructura para editarlos
      this.old_customer.customer_contacts.forEach(element => {
        old_customer_contacts.first_name = element.first_name;
        old_customer_contacts.last_name = element.last_name;
        old_customer_contacts.id = element.id;

        list_products.push(old_customer_contacts);

        // Reinicializamos los valores para el siguiente producto
        old_customer_contacts = {
          first_name: "",
          last_name: "",
          selected: true,
          id: "",
        };
      });
      this.item_contact_list_added = list_products;
    }
  }

  ionViewDidLoad() {
  }

  // Inicializamos los valores
  ngOnInit() {
    // Si venimos a crear un nuevo customer los contactos no deben existir    
    if (this.from_section != 'edit_customer')
      this.item_contact_list_added = [];
  }

  async saveForm() {
    this.alertGenerator.showLoading();
    this.customerCrud.saveCustomerAsync(
      this.create_customer_form.value,
      this.is_new,
      this.old_customer,
      this.from_add_contact,
      this.item_contact_list_added).then(() => {
        this.alertGenerator.dismissLoading();
        this.alertGenerator.getAlert('ok');
        let with_all_info_customer: boolean = this.navParams.get('is_complete');
        if ((typeof with_all_info_customer != 'undefined') && (!with_all_info_customer)) {
          this.events.publish('customer_updated', { itinerary: this.from_itinerary });
        }
        else {
          this.events.publish('customer_updated');
        }
        this.events.publish('itinerary_updated', { itinerary: this.from_itinerary });
        this.navCtrl.pop();
      }).catch((error) => {
        this.alertGenerator.dismissLoading();
        this.alertGenerator.getAlert('error');
      });
  }

  goSelectContactsFromList() {
    this.navCtrl.push(ViewCustomerContactListPage, { previous_selected: this.item_contact_list_added, section_access: 'create_customer', customer_id: null });
  }

  /* Filtramos la palabra ingresada y comparamos si existe dentro de las opciones */
  filterCity() {
    if (this.old_customer_city_name !== "") {
      this.filtered_city_list = this.city.filter((el) => {
        return el.toLowerCase().indexOf(this.old_customer_city_name.toLowerCase()) > -1;
      }); //Enlazamos a la lista a aquellas palabras que cumplan con lo ingresado
    } else {
      this.filtered_city_list = [];
    }
  }

  select(city: string) {
    this.old_customer_city_name = city;
    this.filtered_city_list = [];
  }

  // Evaluamos si selecciono un pais para borrar la lista de opciones
  handleClick(event: Event) {
    var clicked_component: any = event.target;
    do {
      clicked_component = clicked_component.parentNode;
    } while (clicked_component);
    this.filtered_city_list = [];
  }
}

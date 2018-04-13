import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Events } from 'ionic-angular/util/events';
import { TranslateService } from '@ngx-translate/core';
import { CustomerCrudProvider } from '../../../../providers/customer-crud/customer-crud';
import { CustomerContact } from '../../../../entities/CustomerContact';

@IonicPage()
@Component({
  selector: 'page-view-customer-contact-list',
  templateUrl: 'view-customer-contact-list.html',
})
export class ViewCustomerContactListPage {

  contacts: Array<any>; //{ customer_contacts: [customerContact], total_items: number }
  from_section: string;
  from_customer_id: number;
  previous_contact_selected: Array<CustomerContact>;
  msg_please_wait: string;
  page: number = 0;
  words: string = "";
  press_search: boolean = false;
  shouldShowCancel: boolean = true;
  total_items: number;
  result_per_page: number = 100;

  constructor(public translate: TranslateService, public customerCrud: CustomerCrudProvider, public navCtrl: NavController, public navParams: NavParams, public events: Events) {
    this.translate.get('msg_please_wait').subscribe(response => {
      this.msg_please_wait = response;
    });

    this.from_section = this.navParams.get('section_access');
    this.from_customer_id = this.navParams.get('customer_id');
    this.buildData();
  }

  buildData(add_data: boolean = false) {
    this.customerCrud.getCustomerContactListAsync(this.from_customer_id, this.page, this.words).then((response: any) => {
      this.total_items = response.total_items;

      if (add_data) {
        response.customer_contacts.forEach(add_contact => {
          this.contacts.push(add_contact);
        });
      }
      else {
        this.contacts = response.customer_contacts;
      }

      this.previous_contact_selected = this.navParams.get('previous_selected');
      // Si van a editar un contacto lo colocamos como seleccionado
      if (this.previous_contact_selected.length > 0) {
        // Recorremos el listado de contactos
        this.contacts.forEach(element => {
          element.selected = false;
          // Recorremos el listado de productos seleccionados previamente
          this.previous_contact_selected.forEach(element_previous => {
            if (element_previous.id == element.id)
              element.selected = true;
          });
        });
      }
      else {
        this.contacts.forEach(element => {
          element = { selected: false }
        });
      }
    });
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

  ionViewDidLoad() {
  }

  selectProduct(i) {
    // Si viene de la seccion de agregar contactos permitimos que coloree
    if (this.from_section == 'create_customer') {
      if (!this.contacts[i].selected) {
        this.contacts[i].selected = true;
      }
      else {
        this.contacts[i].selected = false;
      }
    }
  }

  addContact() {
    let contact_selected = this.contacts.filter((value, index) => value.selected == true);
    this.events.publish('contact_selected', contact_selected);
    this.navCtrl.pop();
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

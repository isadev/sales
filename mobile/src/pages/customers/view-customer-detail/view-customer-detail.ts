import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { ViewCustomerCreatePage } from '../view-customer-create/view-customer-create';
import { CheckConectionProvider } from '../../../providers/check-conection/check-conection';
import { ViewCustomerContactCreatePage } from '../customer-contac/view-customer-contact-create/view-customer-contact-create';
import { ViewCustomerContactPage } from '../customer-contac/view-customer-contact/view-customer-contact';
import { CustomerCrudProvider } from '../../../providers/customer-crud/customer-crud';
import { AlertGeneratorProvider } from '../../../providers/alert-generator/alert-generator';
import { Customer } from '../../../entities/Customer';

@IonicPage()
@Component({
  selector: 'page-view-customer-detail',
  templateUrl: 'view-customer-detail.html',
})
export class ViewCustomerDetailPage {
  customer: Customer;
  show_ion_fab: boolean = false;
  handler: Function;
  handler_update: Function;

  constructor(public alertGenerator: AlertGeneratorProvider, public events: Events, public customerCrud: CustomerCrudProvider, public conectionApi: CheckConectionProvider, public navCtrl: NavController, public navParams: NavParams) {
    this.customer = this.navParams.get('customer');
  }

  ionViewDidLoad() {
    //Actualizcion tras eliminar un customer_contact
    this.handler = async (userEventData) => {
      await this.customerCrud.getDataOfCustomer(this.customer).then(response => {
        this.customer = response;
      });
    };

    this.events.subscribe('customer_contact_deleted', this.handler);
    this.events.subscribe('customer_contact_updated', this.handler);
    this.events.subscribe('customer_updated', this.handler);
  }

  ionViewWillUnload() {
    this.events.unsubscribe('customer_contact_deleted', this.handler);
    this.events.unsubscribe('customer_contact_updated', this.handler);
    this.events.unsubscribe('customer_updated', this.handler);
  }

  editCustomer() {
    this.show_ion_fab = false;
    //ir a la vista de view-customer-create con la difernciacion de que es editarlo y no crear
    this.navCtrl.push(ViewCustomerCreatePage, { section_access: "edit_customer", client_id: 0, customer: this.customer });
  }

  createCustomerContact() {
    this.show_ion_fab = false;
    this.navCtrl.push(ViewCustomerContactCreatePage,
      {
        section_access: "create_customer_contact",
        customer_id: this.customer.id,
      });
  }

  goDetailCustomerContact(position) {
    this.show_ion_fab = false;
    this.navCtrl.push(ViewCustomerContactPage, { section_access: "view_customer_contact", customer_contact_data: this.customer.customer_contacts[position] });
  }

  delete() {
    let is_conected = this.conectionApi.showConectionAlert();
    if (is_conected) {
      this.alertGenerator.showLoading();
      this.customerCrud.deleteCustomer(this.customer).then((response) => {
        this.alertGenerator.dismissLoading();
        if (response) {
          this.alertGenerator.getAlert('ok');
          this.show_ion_fab = false;
          this.navCtrl.pop().then(() => {
            this.events.publish('customer_deleted');
          });
        }
        else {
          this.alertGenerator.getAlert('error');
        }
      })
      .catch((error) => {
        this.show_ion_fab = true;
        this.alertGenerator.dismissLoading();
        this.alertGenerator.getAlert('error');
      });
    }
  }

  clickIonFab() {
    this.show_ion_fab = !this.show_ion_fab;
  }
}

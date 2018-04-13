import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { ViewCustomerContactCreatePage } from '../view-customer-contact-create/view-customer-contact-create';
import { CheckConectionProvider } from '../../../../providers/check-conection/check-conection';
import { CustomerCrudProvider } from '../../../../providers/customer-crud/customer-crud';
import { AlertGeneratorProvider } from '../../../../providers/alert-generator/alert-generator';

@IonicPage()
@Component({
  selector: 'page-view-customer-contact',
  templateUrl: 'view-customer-contact.html',
})
export class ViewCustomerContactPage {
  customer_contact: any;
  show_ion_fab: boolean = false;

  constructor(public alertGenerator: AlertGeneratorProvider, public events: Events, public customerCrud: CustomerCrudProvider, private conectionApi: CheckConectionProvider, public navCtrl: NavController, public navParams: NavParams) {
    this.customer_contact = this.navParams.get('customer_contact_data');
  }

  ionViewDidLoad() {

  }

  editCustomerContact() {
    this.show_ion_fab = false;
    this.navCtrl.push(ViewCustomerContactCreatePage, {
      section_access: "edit_customer_contact",
      customer_contact_id: this.customer_contact.id,
    });
  }

  async delete() {
    let is_conected: any = await this.conectionApi.showConectionAlert();

    if (is_conected) {
      this.alertGenerator.showLoading();
      this.customerCrud.deleteCustomerContact(this.customer_contact).then((response) => {
        this.alertGenerator.dismissLoading();
        if (response) {
          this.show_ion_fab = false;
          this.alertGenerator.getAlert('ok');
          this.navCtrl.pop().then(() => {
            this.events.publish('customer_contact_deleted');
          });
        }
        else 
          this.alertGenerator.getAlert('error');
      })
      .catch((error) => {
        this.show_ion_fab = true;
        this.alertGenerator.dismissLoading();
        this.alertGenerator.getAlert('error');
      });
    }
  }

  clickIonFab() {
    this.show_ion_fab = !this.show_ion_fab
  }
}

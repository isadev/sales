import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';
import { CustomerCrudProvider } from '../../../../providers/customer-crud/customer-crud';
import { FormGroup } from '@angular/forms/src/model';
import { Itinerary } from '../../../../entities/Itinerary';
import { CustomerContact } from '../../../../entities/CustomerContact';
import { AlertGeneratorProvider } from '../../../../providers/alert-generator/alert-generator';

@IonicPage()
@Component({
  selector: 'page-view-customer-contact-create',
  templateUrl: 'view-customer-contact-create.html',
})
export class ViewCustomerContactCreatePage {
  from_section: string;
  customer_contact_list_title: string;
  create_customer_contact_form: FormGroup;
  old_customer_contact: CustomerContact;
  is_new: boolean = true;
  from_itinerary: Itinerary;

  constructor(public alertGenerator: AlertGeneratorProvider, public events: Events, public customerCrud: CustomerCrudProvider, public alertCtrl: AlertController, public formBuilder: FormBuilder, public translate: TranslateService, public navCtrl: NavController, public navParams: NavParams) {
    this.from_section = this.navParams.get('section_access');
    let section_name: string;
    this.old_customer_contact = new CustomerContact();

    if (this.from_section == "create_customer_contact") {
      this.translate.get('view_create_customer_contact_title').subscribe(response => {
        section_name = response;
      });
    }
    else if (this.from_section == "edit_customer_contact") {
      this.translate.get('view_edit_customer_contact_title').subscribe(response => {
        section_name = response;
      });
    }
    this.customer_contact_list_title = section_name;

    this.create_customer_contact_form = formBuilder.group({
      customer_contact_first_name: ['', Validators.compose([Validators.required])],
      customer_contact_last_name: ['', Validators.compose([Validators.required])],
      customer_contact_email: ['', Validators.compose([Validators.required])],
      customer_contact_phone: ['', Validators.compose([Validators.required])],
      customer_contact_mobile: ['', Validators.compose([Validators.required])],
      customer_contact_job: ['', Validators.compose([Validators.required])],
    });

    if (typeof this.navParams.get('itinerary') != 'undefined') {
      this.from_itinerary = this.navParams.get('itinerary');
    }

    if (this.from_section === 'edit_customer_contact') {
      this.is_new = false;
      let customer_contact_id = this.navParams.get('customer_contact_id');

      this.customerCrud.getOldCustomerContactAsync(customer_contact_id).then(response => {
        this.old_customer_contact.first_name = response.first_name;
        this.old_customer_contact.last_name = response.last_name;
        this.old_customer_contact.email = response.email;
        this.old_customer_contact.phone = response.phone;
        this.old_customer_contact.mobile = response.mobile;
        this.old_customer_contact.job_title = response.job_title;
      });
    }
  }

  ionViewDidLoad() {

  }

  async saveForm() {
    let customer_contact_id = this.navParams.get('customer_id') ? this.navParams.get('customer_id') : this.navParams.get('customer_contact_id');
    this.alertGenerator.showLoading();
    this.customerCrud.saveCustomerContactAsync(this.create_customer_contact_form.value, this.is_new, customer_contact_id)
      .then((response_customer) => {
        this.alertGenerator.dismissLoading();
        this.alertGenerator.getAlert('ok');
        this.events.publish('itinerary_updated', { itinerary: this.from_itinerary });
        this.events.publish('customer_created', { itinerary: this.from_itinerary, show_alert_contact_change: true, new_customer_contact: response_customer });

        this.navCtrl.pop().then(() => {
          this.events.publish('customer_contact_updated');
        });
      })
      .catch((error) => {
        this.alertGenerator.dismissLoading();
        this.alertGenerator.getAlert('error');
      });
  }
}

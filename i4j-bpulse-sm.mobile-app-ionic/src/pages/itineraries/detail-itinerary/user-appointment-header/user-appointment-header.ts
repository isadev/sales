import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AppointmentStatusPage } from '../appointment-status/appointment-status';
import { TranslateService } from '@ngx-translate/core';
import { Events } from 'ionic-angular/util/events';
import { UserAppointmentDetailPage } from '../user-appointment-detail/user-appointment-detail';
import { CreateAppointmentPage } from '../../create-itinerary/create-appointment/create-appointment';
import { ViewPurchaseDetailPage } from '../../../invoices/view-purchase-detail/view-purchase-detail';
import { ViewExpensesPage } from '../../../expenses/view-expenses/view-expenses';
import { ViewCreateExpensePage } from '../../../expenses/view-create-expense/view-create-expense';
import { ViewCreatePurchasePage } from '../../../invoices/view-create-purchase/view-create-purchase';
import { ItineraryCrudProvider } from '../../../../providers/itinerary-crud/itinerary-crud';
import { CallNumber } from '@ionic-native/call-number';
import { ViewCustomerCreatePage } from '../../../customers/view-customer-create/view-customer-create';
import { ViewCustomerContactCreatePage } from '../../../customers/customer-contac/view-customer-contact-create/view-customer-contact-create';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';
import { CustomerContact } from '../../../../entities/CustomerContact';

@IonicPage()
@Component({
  selector: 'page-user-appointment-header',
  templateUrl: 'user-appointment-header.html',
})
export class UserAppointmentHeaderPage {
  tabPage: any = UserAppointmentDetailPage;
  tabPage3: any = AppointmentStatusPage;

  tab_selected = 0;

  tab_params_list: Array<any> = [
    { id: 0, name: 'calendar' },
    { id: 1, name: 'locale' },
    { id: 2, name: 'state_detail' },
  ];
  have_invoice: boolean = false;

  itinerary: any;
  appointmentListHeader: any;
  stateUserAppointment: any;
  invoice_action_msg: any;

  private handler: Function;

  show_ion_fab: boolean = false;

  constructor(public alertCtrl: AlertController, private call_number: CallNumber, public itineraryCrud: ItineraryCrudProvider, public events: Events, public translate: TranslateService, public navCtrl: NavController, public navParams: NavParams) {
    this.itinerary = this.navParams.get('itinerary');
    if (this.itinerary.invoice != undefined) {
      this.have_invoice = true;

      this.translate.get('see').subscribe(response => {
        this.invoice_action_msg = response;
      });
    }
    else {
      this.translate.get('btn_add').subscribe(response => {
        this.invoice_action_msg = response;
      });
    }

    if (this.itinerary.status.id == 5) {
      this.translate.get('state_approved').subscribe(response => {
        this.stateUserAppointment = response;
      });
    }
    else if ((this.itinerary.status.id == 6)) {
      this.translate.get('state_canceled').subscribe(response => {
        this.stateUserAppointment = response;
      });
    }
    else {
      this.translate.get('state_pending').subscribe(response => {
        this.stateUserAppointment = response;
      });
    }
  }

  ionViewDidLoad() {
    //Evento para llamar al actualizar el listado de itinerarios
    this.handler = async (userEventData) => {
      await this.itineraryCrud.getDataOfItinerary(userEventData.itinerary).then(async response => {
        this.itinerary = response;
        // Si el itinerario fue cancelado no puede añadir nada
        if (userEventData.itinerary.last_itinerary_position == 6) {
          this.invoice_action_msg = await this.translate.get('see').toPromise();
        }
        else {
          if ((userEventData.text_change == 'see') && (this.itinerary.invoice != null)) {
            this.have_invoice = true;
            this.invoice_action_msg = await this.translate.get('see').toPromise();
          }
          else if ( (userEventData.text_change == 'add') || (this.itinerary.invoice == null) ){
            this.have_invoice = false;
            this.invoice_action_msg = await this.translate.get('btn_add').toPromise();
          }
          if (typeof userEventData.show_alert_contact_change != 'undefined') {
            this.showAlertChangeCustomerContact(userEventData.new_customer_contact);
          }
        }
      });
    };

    this.events.subscribe('invoice_added', this.handler);
    this.events.subscribe('invoice_deleted', this.handler);
    this.events.subscribe('itinerary_updated', this.handler);
    this.events.subscribe('customer_created', this.handler);
  }

  ionViewWillUnload() {
    this.events.unsubscribe('invoice_added', this.handler);
    this.events.unsubscribe('invoice_deleted', this.handler);
    this.events.unsubscribe('itinerary_updated', this.handler);
    this.events.unsubscribe('customer_created', this.handler);
  }

  // Para movernos entre las tabs
  async showDataUser(tab_user: { id: number, name: string }) {
    this.tab_selected = tab_user.id;

    if (tab_user.id == 1) {
      let lat: any;
      let long: any;
      let geolocation: any;

      geolocation = await this.itinerary.getGeolocation();
      lat = geolocation[0];
      long = geolocation[1];
      //los dos primeros 0 es para que aparezca el pin
      window.open('geo://' + 0 + ',' + 0 + '?q=' + lat + ',' + long, '_system');
    }
    if (tab_user.id == 2) {
      this.show_ion_fab = false;
    }
  }

  // Ir a la vista de crear cita pero para ediar el objeto
  editItinerary() {
    this.show_ion_fab = false;
    this.navCtrl.push(CreateAppointmentPage, { itinerary: this.itinerary, section_access: 'edit_user_appointment' });
  }

  // Ver detalle orden de compra
  viewInvoice() {
    this.navCtrl.push(ViewPurchaseDetailPage, { invoice: this.itinerary.invoice });
  }

  //funcion para decidir si mostrar el detalle del gasto o si crer un gasto nuevo
  invoiceAction() {
    if (this.have_invoice) {
      this.viewInvoice();
    }
    else {
      this.createInvoice();
    }
  }

  // Ver gastos
  viewExpenses() {
    this.navCtrl.push(ViewExpensesPage, { expense: this.itinerary.expense, itinerary_status_id: this.itinerary.status.id });
  }


  createExpense() {
    this.show_ion_fab = false;
    this.navCtrl.push(ViewCreateExpensePage, { itinerary: this.itinerary, expenses: null });
  }

  async createInvoice() {
    let btn_yes: string;
    let btn_no: string;
    let msg_change_create_invoice_from_scratch: string;

    btn_yes = await this.translate.get('btn_yes').toPromise();

    btn_no = await this.translate.get('btn_no').toPromise();

    msg_change_create_invoice_from_scratch = await this.translate.get('msg_change_create_invoice_from_scratch').toPromise();

    let alertInside = this.alertCtrl.create({
      message: msg_change_create_invoice_from_scratch,
      cssClass: 'alert',
      buttons: [
        {
          text: btn_no,
          handler: () => {
            this.navCtrl.push(ViewCreatePurchasePage, { itinerary: this.itinerary, section_access: 'add_purchase_order' });
          }
        },
        {
          text: btn_yes,
          handler: () => {
            this.navCtrl.push(ViewCreatePurchasePage, { itinerary: this.itinerary, section_access: 'add_purchase_order', from_last_invoice: true });
          }
        }
      ]
    });
    alertInside.present();

  }

  clickIonFab() {
    this.show_ion_fab = !this.show_ion_fab;
  }

  callUser() {
    this.show_ion_fab = false;
    this.call_number.callNumber(this.itinerary.customer_contact.phone, true)
      .then(() => {
        /* this.show_ion_fab = false;
        console.log('Launched dialer!') */
      })
      .catch(() => {
        /* this.show_ion_fab = false;
        console.log('Error launching dialer') */
      });
  }

  editCustomer() {
    this.show_ion_fab = false;
    this.navCtrl.push(ViewCustomerCreatePage, { section_access: "edit_customer", is_complete: false, itinerary: this.itinerary, customer: this.itinerary.customer });
  }

  editContact() {
    this.show_ion_fab = false;
    this.navCtrl.push(ViewCustomerContactCreatePage, {
      section_access: "edit_customer_contact",
      customer_contact_id: this.itinerary.customer_contact.id,
      itinerary: this.itinerary
    });
  }

  addContact() {
    this.show_ion_fab = false;
    this.navCtrl.push(ViewCustomerContactCreatePage, {
      section_access: "create_customer_contact",
      customer_id: this.itinerary.customer.id,
      itinerary: this.itinerary
    });
  }

  async showAlertChangeCustomerContact(new_customer_contact: CustomerContact) {
    let simbol: string;
    let msg_translate: string;
    let message: string;
    let btn_accept: string;
    let btn_cancel: string;
    let msg_change: string;
    let msg_title: string;

    btn_accept = await this.translate.get('btn_accept').toPromise();
    btn_cancel = await this.translate.get('btn_cancel').toPromise();
    msg_change = await this.translate.get('msg_change_customer_contact').toPromise();
    msg_title = await this.translate.get('msg_change_customer_contact_title').toPromise();

    message = "msg_alert_success"
    simbol = "check_green.jpg";

    msg_translate = await this.translate.get(message).toPromise();

    //let msg_alert: string = '<div class="centering"> <img class="img_alert" src="assets/imgs/' + simbol + '"></div> <br> <div class="alert-pwd">' + msg_translate + '</div>'

    let alertInside = this.alertCtrl.create({
      title: msg_title,
      message: msg_change,
      cssClass: 'alert',
      buttons: [
        {
          text: btn_accept,
          handler: () => {
            this.itineraryCrud.updateCustomerOfItinerary(this.itinerary, new_customer_contact).then(() => {
              this.events.publish('itinerary_updated', { itinerary: this.itinerary });
              /* this.navCtrl.pop().then(() => {
                this.events.publish('itinerary_updated', { itinerary: this.itinerary })
              }); */
            });
          }
        },
        {
          text: btn_cancel,
          handler: () => {
          }
        }
      ]
    });
    alertInside.present();
  }
}

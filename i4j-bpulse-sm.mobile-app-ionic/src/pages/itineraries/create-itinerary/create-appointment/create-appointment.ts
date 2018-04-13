import { Component, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { TranslateService } from '@ngx-translate/core';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';
import * as moment from 'moment';
import { DateServiceProvider } from '../../../../providers/date-service/date-service';
import { ItineraryCrudProvider } from '../../../../providers/itinerary-crud/itinerary-crud';
import { SharedMethodProvider } from '../../../../providers/shared-method/shared-method';
import { CustomerCrudProvider } from '../../../../providers/customer-crud/customer-crud';
import { FormGroup } from '@angular/forms/src/model';
import { City } from '../../../../entities/City';
import { Province } from '../../../../entities/Province';
import { ItineraryType } from '../../../../entities/ItineraryType';
import { Itinerary } from '../../../../entities/Itinerary';
import { AlertGeneratorProvider } from '../../../../providers/alert-generator/alert-generator';

@IonicPage()
@Component({
  selector: 'page-create-appointment',
  templateUrl: 'create-appointment.html',
  host: {
    '(document:click)': 'handleClick($event)',
  },
})

export class CreateAppointmentPage implements OnInit {
  create_appointment_form: FormGroup;
  date_max: string = "2020-10-31";
  date_min: string;
  date_format: string = "DDDD MMM D, YYYY";
  date_hour: string = "hh:mm a";
  date_days_short: Array<string> = [];
  date_days_name: Array<string> = [];
  date_month_name: Array<string> = [];
  date_month_short: Array<string> = [];
  from_section: string;
  appointment_title: string;
  edit_appointment_type: string;
  edit_appointment_date: string;
  edit_appointment_date2: string;
  edit_appointment_hour: string;
  edit_appointment_contact: string = "";
  edit_appointment_company_name: string = "";
  edit_appointment_address: string = "";
  edit_appointment_observations: string = "";
  edit_appointment_city: string = "";
  edit_appointment_province: string = "";
  edit_appointment_longitude: number = 0;
  edit_appointment_latitude: number = 0;
  locale: string;
  correct_customer_contact: boolean = false;
  correct_customer: boolean = false;

  is_new: boolean = true;
  filtered_list_contact: Array<any> = [];
  filtered_list_customer: Array<any> = [];
  element_ref: ElementRef;
  customer: Array<string>;
  customer_contact: Array<string>;
  old_itinerary: Itinerary;
  provinces: Array<Province> = [];
  citys: Array<City> = [];
  itinerary_types: Array<ItineraryType> = [];

  constructor(
    public alertGenerator: AlertGeneratorProvider,
    public itineraryCrud: ItineraryCrudProvider,
    public sharedMethod: SharedMethodProvider,
    public customerCrud: CustomerCrudProvider,
    public events: Events,
    public myElement: ElementRef,
    public translateService: TranslateService,
    public alertCtrl: AlertController,
    public translate: TranslateService,
    public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public dateService: DateServiceProvider) {
    this.element_ref = myElement;

    this.customerCrud.getOnlyCustomerList().then(response => {
      this.customer = response;
    });

    this.sharedMethod.getProvinceList().then(response => {
      this.provinces = response;
    });

    this.sharedMethod.getCityList().then(response => {
      this.citys = response;
    });

    this.sharedMethod.getItineraryTypeList().then(response => {
      this.itinerary_types = response;
    });

    this.locale = this.translateService.getDefaultLang();
    moment.locale(this.locale);
    let today = moment();
    this.date_min = moment().format();

    this.edit_appointment_date = today.format();
    this.edit_appointment_hour = today.format();

    this.edit_appointment_type = "";

    this.from_section = this.navParams.get('section_access');
    let section_name;

    if ((this.from_section === 'edit_user_appointment') || (this.from_section === 'change_date_appointment')) {
      this.translate.get('edit_user_appointment_title').subscribe(response => {
        section_name = response;
      });
    }
    else {
      this.translate.get('create_user_appointment_title').subscribe(response => {
        section_name = response;
      });
    }
    this.appointment_title = section_name;

    let old_date_appointment: any;

    // Si la data es para modificar
    if (this.navParams.get('itinerary') != null) {
      this.translate.get('old_date_appointment').subscribe(response => {
        old_date_appointment = response;
      });

      this.old_itinerary = this.navParams.get('itinerary');

      let old_date = moment.utc(this.old_itinerary.date_time).local();

      this.customerCrud.getOnlyCustomerContactList(this.old_itinerary.customer.name).then(response => {
        this.customer_contact = response;
      });

      this.edit_appointment_date = old_date.format();
      this.edit_appointment_hour = old_date.format();
      this.edit_appointment_contact = this.old_itinerary.customer_contact.email;
      this.edit_appointment_company_name = this.old_itinerary.customer.name;
      this.edit_appointment_address = this.old_itinerary.address;
      this.edit_appointment_city = this.old_itinerary.city.name;
      this.edit_appointment_province = this.old_itinerary.city.province.name;
      this.edit_appointment_type = this.old_itinerary.itinerary_type.name;
      this.edit_appointment_observations = " " + old_date_appointment + ': ' + this.old_itinerary.observation + " ";

      this.is_new = false;

      this.correct_customer = true;
      this.correct_customer_contact = true;
    }
    this.create_appointment_form = formBuilder.group({
      appointmentDate: ['', Validators.compose([Validators.required])],
      appointmentHour: ['', Validators.compose([Validators.required])],
      appointmentType: [''],
      appointmentContact: ['', Validators.compose([Validators.required])],
      appointmentCompanyName: ['', Validators.compose([Validators.required])],
      appointmentAddress: ['', Validators.compose([Validators.required])],
      appointmentCity: ['', Validators.compose([Validators.required])],
      appointmentProvince: ['', Validators.compose([Validators.required])],
      appointmentObservations: [''],
    });
  }

  ngOnInit() {
    let date_translate = this.dateService.getTranslate(this.locale);

    this.date_days_name = date_translate['days_name'];
    this.date_days_short = date_translate['days_short_name'];
    this.date_month_name = date_translate['month_name'];
    this.date_month_short = date_translate['month_name_short'];
  }

  ionViewDidLoad() {

  }

  findCityOfProvinces(province: string) {
    this.sharedMethod.getCityOfProvince(province).then(response => {
      this.citys = response;
    });
  }

  async saveForm() {
    this.alertGenerator.showLoading();
    this.itineraryCrud.saveItinerary(this.create_appointment_form.value, this.is_new, this.old_itinerary)
      .then(() => {
        this.alertGenerator.dismissLoading();
        this.alertGenerator.getAlert('ok');
        this.navCtrl.pop().then(() => {
          this.events.publish('itinerary_updated', { itinerary: this.old_itinerary })
        });
      }).catch(error => {
        this.alertGenerator.dismissLoading();
        this.alertGenerator.getAlert('error');
      });
  }

  //Para mostrar el listado de compañias
  /* Filtramos la palabra ingresada y comparamos si existe dentro de las opciones */
  filterCustomer() {
    if (this.edit_appointment_company_name !== "") {

      let customer_find = this.customer.find((el) => {
        return el.toLowerCase() == this.edit_appointment_company_name.toLowerCase();
      });

      this.correct_customer = typeof customer_find != 'undefined';

      this.filtered_list_customer = this.customer.filter((el) => {
        return el.toLowerCase().indexOf(this.edit_appointment_company_name.toLowerCase()) > -1;
      }); //Enlazamos a la lista a aquellas palabras que cumplan con lo ingresado
    } else {
      this.filtered_list_customer = [];
    }
  }

  selectCustomer(customer: string) {
    this.edit_appointment_company_name = customer;
    this.filtered_list_contact = [];
    this.edit_appointment_contact = "";

    let customer_find = this.customer.find((el) => {
      return el.toLowerCase() == this.edit_appointment_company_name.toLowerCase();
    });

    this.correct_customer = typeof customer_find != 'undefined';

    //Llamamos a la busqueda de nombre de contactos de esa compañia
    this.customerCrud.getOnlyCustomerContactList(customer).then(response => {
      this.customer_contact = response;
    });
    this.filtered_list_customer = [];
  }

  //Para filtrar el listado de nombres de contactos
  /* Filtramos la palabra ingresada y comparamos si existe dentro de las opciones */
  filterContact() {
    if (this.customer.find((value, index) => value == this.edit_appointment_company_name)) {

      let customer_contact_find = this.customer_contact.find((el) => {
        return el.toLowerCase() == this.edit_appointment_contact.toLowerCase();
      });

      this.correct_customer_contact = typeof customer_contact_find != 'undefined';

      this.filtered_list_contact = this.customer_contact.filter((el) => {
        return el.toLowerCase().indexOf(this.edit_appointment_contact.toLowerCase()) > -1;
      }); //Enlazamos a la lista a aquellas palabras que cumplan con lo ingresado
    } else {
      this.filtered_list_contact = [];
    }
  }

  selectContact(contact: string) {
    this.edit_appointment_contact = contact;

    let customer_contact_find = this.customer_contact.find((el) => {
      return el.toLowerCase() == this.edit_appointment_contact.toLowerCase();
    });

    this.correct_customer_contact = typeof customer_contact_find != 'undefined';

    this.filtered_list_contact = [];
  }

  // Evaluamos si selecciono un item para borrar la lista de opciones
  handleClick(event) {
    var clicked_component = event.target;
    do {
      clicked_component = clicked_component.parentNode;
    } while (clicked_component);
    this.filtered_list_contact = [];
  }
}

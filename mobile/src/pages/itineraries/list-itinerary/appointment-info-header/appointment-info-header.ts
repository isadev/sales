import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AppointmentInfoDetailPage } from '../appointment-info-detail/appointment-info-detail';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { TranslateService } from '@ngx-translate/core';
import { UserAppointmentHeaderPage } from '../../detail-itinerary/user-appointment-header/user-appointment-header';
import { CreateAppointmentPage } from '../../create-itinerary/create-appointment/create-appointment';
import { ItineraryCrudProvider } from '../../../../providers/itinerary-crud/itinerary-crud';
import { Itinerary } from '../../../../entities/Itinerary';
import { AlertGeneratorProvider } from '../../../../providers/alert-generator/alert-generator';

@IonicPage()
@Component({
  selector: 'page-appointment-info-header',
  templateUrl: 'appointment-info-header.html',
})
export class AppointmentInfoHeaderPage implements OnInit {
  itinerary_list: Array<Itinerary>;
  tab_id: number = 0;
  words: string = "";
  press_search: boolean = false;
  shouldShowCancel: boolean = true;

  tab_params_list = [
    { id: 0, name: "todas", parent: this },
    { id: 1, name: "hoy", parent: this },
    { id: 2, name: "pasadas", parent: this }
  ];

  from_demo: boolean = false;
  page: any = 0;
  msg_please_wait: string;
  first_result: Array<Itinerary>;
  max_result: any;
  result_per_page: any = 100;

  constructor(
    public translate: TranslateService, 
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public itineraryCrud: ItineraryCrudProvider,
    public alertGenerator: AlertGeneratorProvider
  ) {
    this.translate.get('all').subscribe(response => {
      this.tab_params_list[0].name = response;
    });

    this.translate.get('today').subscribe(response => {
      this.tab_params_list[1].name = response;
    });

    this.translate.get('past').subscribe(response => {
      this.tab_params_list[2].name = response;
    });

    this.from_demo = this.navParams.get('from_demo');

    this.translate.get('msg_please_wait').subscribe(response => {
      this.msg_please_wait = response;
    });
  }

  // Funcion para actualizar la lista al hacer halar hacia abajo 
  doRefresh(refresher) {
    this.page = 0;
    this.itineraryCrud.getItineraryListAsync(this.tab_id, this.from_demo, this.page).then((response: any) => {
      this.itinerary_list = response.itinerary_list;
      this.first_result = response.itinerary_list;
      refresher.complete();
    });
  }

  // Carga de itinerarios mientras va bajando con el scroll
  async doInfinite(infiniteScroll) {
    let div = Math.ceil(this.max_result / this.result_per_page);
    //let mod = this.max_result % this.result_per_page;
    if (div >= 2) {
      //sumarle solo el entero
      this.page = this.page + 1;
    }

    if ((this.page > 0) && (this.page < div)) {
      await this.itineraryCrud.getItineraryListAsync(this.tab_id, this.from_demo, this.page).then((response: any) => {
        if (response.itinerary_list[0].data.length > 0) {
          response.itinerary_list.forEach(itinerary => {
            this.itinerary_list.push(itinerary);
          });
        }
      });
    }
    infiniteScroll.complete();
  }

  ngOnInit() {
    this.tab_id = 0;
  }
  ionViewDidLoad() {

  }

  tabPage = AppointmentInfoDetailPage;

  showDataUser(tabUser) {
    this.tab_id = tabUser.id == null ? 0 : tabUser.id;
    this.page = 0;
    this.alertGenerator.showLoading();
    this.itineraryCrud.getItineraryListAsync(this.tab_id, this.from_demo, this.page).then((response: any) => {
      this.max_result = response.total_items;
      this.itinerary_list = response.itinerary_list;
      this.first_result = response.itinerary_list;
      this.alertGenerator.dismissLoading();
    });
  }

  detailInfoUserItinerary(itinerary) {
    this.navCtrl.push(UserAppointmentHeaderPage, { itinerary: itinerary });
  }

  addAppointment() {
    this.navCtrl.push(CreateAppointmentPage, { section_access: "create_appointment" });
  }

  update_data() {

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
      this.itineraryCrud.getItineraryListAsync(this.tab_id, this.from_demo, this.page, val).then((response: any) => {
        this.itinerary_list = response.itinerary_list;
      });
    }
  }

  onCancel(event: Event) {
    this.press_search = false;
    this.itinerary_list = this.first_result;
  }
}

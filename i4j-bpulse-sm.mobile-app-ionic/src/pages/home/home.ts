import { Component } from '@angular/core';
import { NavController, Loading, LoadingController } from 'ionic-angular';
import { AppointmentInfoHeaderPage } from '../itineraries/list-itinerary/appointment-info-header/appointment-info-header';
import { TranslateService } from '@ngx-translate/core';
import { StartSessionPage } from '../session/start-session/start-session';
import { SharedMethodProvider } from '../../providers/shared-method/shared-method';
import { DatabaseCreateProvider } from '../../providers/database-create/database-create';
import { RestApiProvider } from '../../providers/rest-api/rest-api';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  loading: Loading;
  is_conected: boolean = false;
  locale: string;

  constructor(
    public databaseCreate: DatabaseCreateProvider, 
    public translateService: TranslateService, 
    private loadingCtrl: LoadingController, 
    public sharedMethod: SharedMethodProvider, 
    public navCtrl: NavController,
    public restApi:RestApiProvider,
  ) {
  }

  ionViewDidLoad() {
  }

  async start_session() {
    this.is_conected = await this.sharedMethod.getConnectedUser();

    if (!this.is_conected) {
      this.navCtrl.push(StartSessionPage);
      //this.databaseCreate.createDBStatic();
    }
    else {
      await this.restApi.buildCredentials();
      this.sharedMethod.getDataFromApi();
      this.navCtrl.setRoot(AppointmentInfoHeaderPage);
    }
  }

  async showLoading() {
    let msg_please_wait:string;

    msg_please_wait = await this.translateService.get('msg_please_wait').toPromise();

    this.loading = this.loadingCtrl.create({
      content: msg_please_wait,
      dismissOnPageChange: true
    });
    this.loading.present();
  }

  demo() {
    this.showLoading();
    this.databaseCreate.createDBStatic();
    this.navCtrl.setRoot(AppointmentInfoHeaderPage, { from_demo: true });
  }
}

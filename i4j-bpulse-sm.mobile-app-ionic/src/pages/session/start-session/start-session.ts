import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Loading } from 'ionic-angular';

import { AlertController } from 'ionic-angular/components/alert/alert-controller';
import { TranslateService } from '@ngx-translate/core';
import { AuthServiceProvider } from '../../../providers/auth-service/auth-service';
import { AppointmentInfoHeaderPage } from '../../itineraries/list-itinerary/appointment-info-header/appointment-info-header';
import { SynchronousForegroundProvider } from '../../../providers/synchronous-foreground/synchronous-foreground';
import { SharedMethodProvider } from '../../../providers/shared-method/shared-method';

@IonicPage()
@Component({
  selector: 'page-start-session',
  templateUrl: 'start-session.html',
})
export class StartSessionPage {
  loading: Loading;
  data: any = {
    email: "",
    pwd: "",
    emailInside: "",
  };

  constructor(public sharedMethod: SharedMethodProvider, public syncForeground: SynchronousForegroundProvider, public translate: TranslateService, public alertCtrl: AlertController, public navCtrl: NavController, public navParams: NavParams, private auth: AuthServiceProvider, private loadingCtrl: LoadingController) {
  }

  async recoveryPwd() {
    let msg_recover_password_alert, btn_send, btn_cancel, msg_email_placeholder;

    msg_recover_password_alert = await this.translate.get('msg_recover_password_alert').toPromise();

    btn_send = await this.translate.get('btn_send').toPromise();

    btn_cancel = await this.translate.get('btn_cancel').toPromise();

    msg_email_placeholder = await this.translate.get('msg_email_placeholder').toPromise();

    let alertPwd = this.alertCtrl.create({
      message: msg_recover_password_alert,
      inputs: [
        {
          name: 'email_inside',
          placeholder: msg_email_placeholder
        },
      ],
      buttons: [
        {
          text: btn_cancel,
          role: 'cancel',
          handler: () => {

          }
        },
        {
          text: btn_send,
          // Segunda alerta
          handler: data => {
            //hacer peticion http para saber cual fue la respuesta data.name <- referencia  al 'name' en inputs (email_inside)
            if (data.email_inside.search(/[A-Za-z0-9._%+-]{3,}@[a-zA-Z]{3,}([.]{1}[a-zA-Z]{2,}|[.]{1}[a-zA-Z]{2,}[.]{1}[a-zA-Z]{2,})/i))
              return false;
            let dataResponse = { status: 400 };
            if (dataResponse.status = 200)
              this.mailSendedOk();
            else
              this.mailSendedNotOk();
          }
        }
      ]
    });
    alertPwd.present();
  }

  async mailSendedOk() {
    let msg_email_sended_alert: any, btn_accept: any;

    msg_email_sended_alert = await this.translate.get('msg_email_sended_alert').toPromise();

    btn_accept = await this.translate.get('btn_accept').toPromise();

    let alertInside = this.alertCtrl.create({
      message: '<div class="centering"> <img class="img_alert" src="xxxxx"></div> <br> <div class="alert-pwd">' + msg_email_sended_alert + '</div>',
      cssClass: 'alert',
      buttons: [
        {
          text: btn_accept,
          handler: () => {

          }
        }
      ]
    });
    alertInside.present();
  }

  async mailSendedNotOk() {
    let msg_email_not_found_alert, btn_accept;

    msg_email_not_found_alert = await this.translate.get('msg_email_sended_alert').toPromise();

    btn_accept = await this.translate.get('btn_accept').toPromise();

    let alertInside = this.alertCtrl.create({
      message: '<div class="centering"> <img class="img_alert" src="xxxxx"></div> <br> <div class="alert-pwd">' + msg_email_not_found_alert + '</div>',
      cssClass: 'alert',
      buttons: [
        {
          text: btn_accept,
          handler: () => {

          }
        }
      ]
    });
    alertInside.present();
  }

  async login() {
    this.showLoading();

    let dataUser: Object = {
      email: this.data.email,
      pwd: this.data.pwd
    };

    let found_user;
    // hacer peticion al back para confirmar usuario y contraseña
    let data_downloaded_successfully: boolean = await this.sharedMethod.getDataOfUserFromServer(dataUser);
    if (data_downloaded_successfully) {
      found_user = await this.auth.login(dataUser);
      if (found_user) {
        this.navCtrl.setRoot(AppointmentInfoHeaderPage, { from_demo: false });
      } else {
        this.showError("access_denied");
      }
    }
    else {
      this.showError("error_during_data_loaded");
    }
  }

  async showLoading() {
    let msg_please_wait;

    msg_please_wait = await this.translate.get('msg_please_wait').toPromise();

    this.loading = this.loadingCtrl.create({
      content: msg_please_wait,
      dismissOnPageChange: true
    });
    this.loading.present();
  }

  async showError(text: string) {
    let msg_conection_user_error: string, msg_wong_pass_email: string, msg_please_try_again, btn_accept: string, string_msg: string;

    if (text == 'access_denied') {
      msg_wong_pass_email = await this.translate.get('msg_wong_pass_email').toPromise();
      msg_please_try_again = await this.translate.get('msg_please_try_again').toPromise();

      string_msg = '<div>' + msg_wong_pass_email + '<br>' + msg_please_try_again + '</div>';
    }
    else {
      msg_conection_user_error = await this.translate.get('error_during_data_loaded').toPromise();
      string_msg = '<div>' + msg_conection_user_error + '</div>';
    }

    btn_accept = await this.translate.get('btn_accept').toPromise();

    this.loading.dismiss();

    let alert = this.alertCtrl.create({

      message: string_msg,
      buttons: [
        {
          text: btn_accept,
          handler: () => {
          }
        },
      ]
    });
    alert.present();
  }
}

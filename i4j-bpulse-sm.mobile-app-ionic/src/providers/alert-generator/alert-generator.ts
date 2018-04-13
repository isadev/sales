import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AlertController } from 'ionic-angular';
import { LoadingController } from 'ionic-angular/components/loading/loading-controller';
import { Loading } from 'ionic-angular/components/loading/loading';

enum alert_type {
  ok = "ok",
  error = "error"
}

@Injectable()
export class AlertGeneratorProvider {
  loading: Loading;

  constructor(private loadingCtrl: LoadingController, public alertCtrl: AlertController, public translateService: TranslateService) {

  }

  /**
   * Funcion que se encarga de visualizar las alertas bien sea de error o de exito
   * 
   * @param type string que se encarga de separar si es de tipo error o de tipo exito
   */
  async getAlert(type: string) {
    let simbol: string;
    let msg_translate: string;
    let message: string;
    let btn_accept: string;

    btn_accept = await this.translateService.get('btn_accept').toPromise();

    if (type == alert_type.ok) {
      message = "msg_alert_success"
      simbol = "check_green.jpg";
    }
    else if (type == alert_type.error) {
      message = "msg_save_unsuccessfull";
      simbol = "check_green.jpg";
    }

    msg_translate = await this.translateService.get(message).toPromise();
    
    let msg_alert: string = '<div class="centering"> <img class="img_alert" src="assets/imgs/' + simbol + '"></div> <br> <div class="alert-pwd">' + msg_translate + '</div>'

    let alertInside = this.alertCtrl.create({
      message: msg_alert,
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

  async showLoading() {
    let msg_please_wait;

    msg_please_wait = await this.translateService.get('msg_please_wait').toPromise();

    this.loading = this.loadingCtrl.create({
      content: msg_please_wait,
      dismissOnPageChange: true
    });
    this.loading.present();
  }
  
  dismissLoading() {
    this.loading.dismiss();
  }
}

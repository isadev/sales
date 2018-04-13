import { Injectable } from '@angular/core';
import { Network } from '@ionic-native/network';
import { AlertController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class CheckConectionProvider {

  constructor(public translate: TranslateService, public alertCtrl: AlertController, private network: Network) {

  }

  // Verificamos que exista la conexion a internet
  checkNetwork() {
    return this.network.type;
  }

  isConected() {
    if ((this.checkNetwork() == 'none') || (this.checkNetwork() == 'unknown') || (this.checkNetwork() == null))
      return false;
    return true;
  }

  // Dejamos la responsabilidad de mostrar el mensaje de la alerta y 
  // devolvemos el estado de la conexion a quien solicito el servicio
  async showConectionAlert() {
    let btn_accept, msg_conection, msg_conection_not_found;
    let is_conected = this.isConected();

    btn_accept = await this.translate.get('btn_accept').toPromise();

    if (!is_conected) {
      msg_conection_not_found = await this.translate.get('msg_conection_not_found').toPromise();
      msg_conection = '<div class="centering"> <img class="img_alert" src="xxxxx"></div> <br> <div class="alert-pwd">' + msg_conection_not_found + '</div>'

      let alertInside = this.alertCtrl.create({
        message: msg_conection,
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
    return is_conected;
  }
}

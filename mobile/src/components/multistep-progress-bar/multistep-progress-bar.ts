import { Component, Input, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular/navigation/nav-controller';

import { AlertController } from 'ionic-angular/components/alert/alert-controller';
import { TranslateService } from '@ngx-translate/core';
import { Events } from 'ionic-angular/util/events';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { CreateAppointmentPage } from '../../pages/itineraries/create-itinerary/create-appointment/create-appointment';
import { FormularyAppointmentPage } from '../../pages/itineraries/detail-itinerary/formulary-appointment/formulary-appointment';
import { ViewFormularyPage } from '../../pages/itineraries/detail-itinerary/view-formulary/view-formulary';
import { ItineraryCrudProvider } from '../../providers/itinerary-crud/itinerary-crud';
import { Alert } from 'ionic-angular/components/alert/alert';

@Component({
  selector: 'multistep-progress-bar',
  templateUrl: 'multistep-progress-bar.html',
  inputs: ['id_user_appointment']
})
export class MultistepProgressBarComponent implements OnInit {
  @Input('itinerary') itinerary;

  private steps: Array<number> = [1, 2, 3, 4, 5];
  private states: Array<{ current_name: string, next_step: string }> = [
    {
      current_name: "msg_state_1_name",
      next_step: "msg_state_1_progress"
    },
    {
      current_name: "msg_state_2_name",
      next_step: "msg_state_2_progress"
    },
    {
      current_name: "msg_state_3_name",
      next_step: "msg_state_3_progress",
    },
    {
      current_name: "msg_state_4_name",
      next_step: "msg_state_4_progress",
    },
    {
      current_name: "msg_state_5_name",
      next_step: "msg_state_5_progress",
    },
  ];

  private handler: Function;
  private current_state: string;
  private next_step: string;
  private position: number = 1;

  private currentStep: number = 1;

  ngOnInit() {
    this.position = this.itinerary.last_itinerary_position != 6 ? this.itinerary.last_itinerary_position : 5;
    this.currentStep = this.itinerary.last_itinerary_position;
    let msg_state_name, msg_state_progress;
    let position = this.position - 1;
    this.translate.get(this.states[position].current_name).subscribe(response => {
      msg_state_name = response;
    });

    this.translate.get(this.states[position].next_step).subscribe(response => {
      msg_state_progress = response;
    });

    this.current_state = msg_state_name;
    this.next_step = msg_state_progress;
  }

  constructor(public auth: AuthServiceProvider, public events: Events, public itineraryCrud: ItineraryCrudProvider, public translate: TranslateService, public navCtrl: NavController, public alertCtrl: AlertController) {
    //Evento para llamar al actualizar el estado de la cita
    this.handler = async (userEventData) => {
      await this.itineraryCrud.getDataOfItinerary(userEventData).then(response => {
        this.itinerary = response;
        this.position = this.itinerary.last_itinerary_position;
        this.currentStep = this.itinerary.last_itinerary_position;
      });
    };

    this.events.subscribe('finish_questionnaire_checkout', this.handler);
  }

  user_logged() {
    return new Promise((resolve, reject) => {
      this.auth.getKey('state')
        .then(response => {
          resolve(response);
        })
        .catch(error => {
          reject(error);
        });
    });
  }
  async ionViewDidLoad() {

  }

  ngOnDestroy() {
    this.events.unsubscribe('finish_questionnaire_checkout', this.handler);
  }

  async moveStep(position: number) {
    //Si no es una visita cancelada
    if (this.itinerary.status.id != 5) {
      let is_user_login_active = await this.user_logged();
      if (is_user_login_active != 'active') {
        this.showAlertUserNotConnected();
      }
      else {
        let msg_state_name, msg_state_progress;
        this.translate.get(this.states[position - 1].current_name).subscribe(response => {
          msg_state_name = response;
        });

        this.translate.get(this.states[position - 1].next_step).subscribe(response => {
          msg_state_progress = response;
        });

        this.currentStep = position;
        this.current_state = msg_state_name;
        this.next_step = msg_state_progress;
        this.position = position;

        this.itinerary = await this.itineraryCrud.changeStateItineraryAsync(this.itinerary, this.currentStep);
      }
    }
  }

  async moveFoward() {
    let is_user_login_active = await this.user_logged();
    if (is_user_login_active != 'active') {
      this.showAlertUserNotConnected();
    } else {
      let is_charged_questionnaire: boolean = await this.itineraryCrud.isQuestionnaireCharged(this.itinerary);
      if (!is_charged_questionnaire)
        this.navCtrl.push(FormularyAppointmentPage, { itinerary: this.itinerary, formulary_type_number: 1 });
      if (this.currentStep == 4)
        this.showAlert();
      this.moveStep(this.currentStep + 1);
    }
  }

  async moveBackward() {
    let is_user_login_active = await this.user_logged();
    if (is_user_login_active != 'active') {
      this.showAlertUserNotConnected();
    } else {
      let is_charged_questionnaire: boolean = await this.itineraryCrud.isQuestionnaireCharged(this.itinerary);
      if (!is_charged_questionnaire)
        this.navCtrl.push(FormularyAppointmentPage, { itinerary: this.itinerary, formulary_type_number: 1 });
      this.moveStep(this.currentStep - 1);
    }
  }

  // Realizar Metodos intermedios propios de cada paso
  movement_button_state(currentStep: number) {
    switch (currentStep) {
      case 1:
        this.moveFoward();
        break;
      case 2:
        this.moveFoward();
        break;
      case 3:
        this.moveFoward();
        break;
      case 4:
        this.showAlert();
        break;
      case 5:
        this.showAlert();
        break;
    }
  }

  // Funcion para mandar mensaje de error en caso que el usuario no este logeado y con la session activa
  showAlertUserNotConnected() {
    let btn_accept: string;
    let alert: Alert = this.alertCtrl.create();
    alert.setTitle("user_not_logged");

    this.translate.get("btn_accept").subscribe(response => {
      btn_accept = response;
    });

    alert.addButton({
      text: btn_accept,
      handler: data => {

      }
    });
    alert.present();
  }

  async cancellItinerary() {
    let btn_finish: string, btn_cancel: string, cancell_itinerary_title: string;

    btn_finish = await this.translate.get("btn_finish").toPromise()
    btn_cancel = await this.translate.get("btn_cancel").toPromise();

    cancell_itinerary_title = await this.translate.get("cancell_itinerary_title").toPromise();

    let alert: Alert = this.alertCtrl.create();
    alert.setTitle(cancell_itinerary_title);
    alert.addButton({
      text: btn_finish,
      cssClass: 'color_button_secondary',
      handler: () => { //el value del input del seleccionado (addInput)
        this.itineraryCrud.cancellItinerary(this.itinerary, this.currentStep).then(() => {
          this.navCtrl.pop();
        });
      }
    });
    alert.addButton({
      text: btn_cancel,
      handler: data => {
      }
    });
    alert.present();
  }

  // Movernos a la lista del formulario o al editar cita
  view_form_or_edit_appointment(currentStep) {
    //Si quiere reagendar entonces ajusta la fecha de la cita
    if (currentStep <= 3) {

      this.navCtrl.push(CreateAppointmentPage, { itinerary: this.itinerary, section_access: 'change_date_appointment' });
      // Devolvemos el estado de la cita reagendada a 1
      this.currentStep = 1;
      this.position = 1;
      this.itineraryCrud.changeStateItineraryAsync(this.itinerary, this.currentStep);
    }
    // Si quiere ir al formulario checkin
    else if (currentStep == 4) {
      this.navCtrl.push(FormularyAppointmentPage, { itinerary: this.itinerary, current_step: currentStep });
    }
    // Si quiere ir al formulario checkout
    else if (currentStep == 5) {
      this.navCtrl.push(FormularyAppointmentPage, { itinerary: this.itinerary, current_step: currentStep });
    }
  }

  // Mostrar mensaje de finalizacion de registro de cita exitosamente
  showAlert() {
    let btn_finish: string;
    let msg_create_appointment_title_alert, msg_create_appointment_success_label_alert, msg_create_appointment_change_date_label_alert;

    this.translate.get("msg_create_appointment_title_alert").subscribe(response => {
      msg_create_appointment_title_alert = response;
    });

    this.translate.get("msg_create_appointment_success_label_alert").subscribe(response => {
      msg_create_appointment_success_label_alert = response;
    });

    this.translate.get("msg_create_appointment_change_date_label_alert").subscribe(response => {
      msg_create_appointment_change_date_label_alert = response;
    });

    this.translate.get("btn_finish").subscribe(response => {
      btn_finish = response;
    });

    let alert = this.alertCtrl.create({
      enableBackdropDismiss: false
    });
    alert.setTitle(msg_create_appointment_title_alert);

    alert.addInput({
      type: "radio",
      label: msg_create_appointment_success_label_alert,
      value: '0', // ir al formulario
      checked: true
    });

    if (this.currentStep != 5) {
      alert.addInput({
        type: "radio",
        label: msg_create_appointment_change_date_label_alert,
        value: '1', // dismiss alert
        checked: false
      });
    }

    alert.addButton({
      text: btn_finish,
      handler: data => { //el value del input del seleccionado (addInput)
        if (data == 0) { // Si quiere finalizar la cita e ir al formulario
          this.navCtrl.push(FormularyAppointmentPage, { itinerary: this.itinerary, formulary_type_number: 2 })
            .then(() => {
              this.moveStep(5);
            });
        }
        else if (data == 1) { // Si quiere reagendar
          this.navCtrl.push(CreateAppointmentPage, { itinerary: this.itinerary, section_access: 'change_date_appointment' });
          // Devolvemos el estado de la cita reagendada a 1
          this.moveStep(1);
        }
      }
    });
    alert.present();
  }

  view_formulary(type_formulary) {
    //checkin = 1, checkout = 2
    this.navCtrl.push(ViewFormularyPage, { itinerary: this.itinerary, type_formulary: type_formulary });
  }
}

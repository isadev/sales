import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder, Validators } from '@angular/forms';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { ItineraryCrudProvider } from '../../../../providers/itinerary-crud/itinerary-crud';
import { QuestionnaireCrudProvider } from '../../../../providers/questionnaire-crud/questionnaire-crud';
import { Itinerary } from '../../../../entities/Itinerary';
import { FormGroup } from '@angular/forms/src/model';
import { AlertGeneratorProvider } from '../../../../providers/alert-generator/alert-generator';

@IonicPage()
@Component({
  selector: 'page-formulary-appointment',
  templateUrl: 'formulary-appointment.html',
  providers: [FormBuilder]
})
export class FormularyAppointmentPage implements OnInit {
  data_to_formulary: Array<any> = [];
  itinerary: Itinerary;
  createFormularyForm: FormGroup;
  formulary_type_number: number;

  constructor(
    public questionnaireCrud: QuestionnaireCrudProvider, 
    public events: Events, 
    public formBuilder: FormBuilder, 
    public itineraryCrud: ItineraryCrudProvider, 
    public translate: TranslateService, 
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public alertCtrl: AlertController,
    public alertGenerator: AlertGeneratorProvider
  ) {
    this.itinerary = this.navParams.get('itinerary');
    this.formulary_type_number = this.navParams.get('formulary_type_number');
    //Para evitar el error que el formulario no ha sido creado aun
    this.createFormularyForm = this.formBuilder.group([]);
  }

  async ngOnInit() {
    this.itinerary = this.navParams.get('itinerary');
    this.formulary_type_number = this.navParams.get('formulary_type_number');

    await this.itineraryCrud.getFormularyByAppointmentIdAsync(this.itinerary, this.formulary_type_number).then(async response => {
      this.data_to_formulary = response;
      let group_question_index = [];
      let iterator = 1;
      var formData = [];

      //Generamos las claves para los formularios
      this.data_to_formulary.forEach(element => {

        // Si es un toggle
        if (element.question_type.id == 2) {
          group_question_index.push({ key: "toggle_" + element.question.id });
          element.form = "toggle_" + element.question.id;
        }

        //Si es un input
        if (element.question_type.id == 1) {
          group_question_index.push({ key: "input_" + element.question.id });
          element.form = "input_" + element.question.id;
        }

        iterator++;
      });

      //Enlazamos los indices del formulario a los validadores
      group_question_index.forEach(element => {
        var key = element.key;
        formData[key] = ['', Validators.compose([Validators.required])];
      });

      // Creamos el formulario como tal
      this.createFormularyForm = this.formBuilder.group(formData);
    });
  }

  ionViewDidLoad() {

  }

  async saveForm() {
    this.alertGenerator.showLoading();
    this.questionnaireCrud.saveQuestionnaireAsync(this.data_to_formulary, this.itinerary)
    .then(response => {
      this.alertGenerator.dismissLoading();
      this.alertGenerator.getAlert('ok');
      this.navCtrl.pop().then(() => {
        this.events.publish('finish_questionnaire_checkout', this.itinerary);
      });
    })
    .catch(error => {
      this.alertGenerator.dismissLoading();
      this.alertGenerator.getAlert('error');
    });
  }
}

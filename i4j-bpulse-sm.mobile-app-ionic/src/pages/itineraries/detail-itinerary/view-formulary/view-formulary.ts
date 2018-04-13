import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { QuestionnaireCrudProvider } from '../../../../providers/questionnaire-crud/questionnaire-crud';
import { Itinerary } from '../../../../entities/Itinerary';
import { Questionnaire } from '../../../../entities/Questionnaire';

@IonicPage()
@Component({
  selector: 'page-view-formulary',
  templateUrl: 'view-formulary.html',
})
export class ViewFormularyPage {
  itinerary: Itinerary;
  data_to_formulary: Questionnaire;
  type_formulary: number;

  constructor(public questionnaireCrud: QuestionnaireCrudProvider, public navCtrl: NavController, public navParams: NavParams) {
    this.itinerary = this.navParams.get('itinerary');
    this.type_formulary = this.navParams.get('type_formulary');

    this.questionnaireCrud.getQuestionaryByTypeAsync(this.itinerary, this.type_formulary).then(async response => {
      this.data_to_formulary = response;
      
    });
  }

  ionViewDidLoad() {
  }

}

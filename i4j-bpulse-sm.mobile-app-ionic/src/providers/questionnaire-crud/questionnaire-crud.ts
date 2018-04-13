import { Injectable } from '@angular/core';
import { getRepository } from 'typeorm';
import { Answer } from '../../entities/Answer';
import { Questionnaire } from '../../entities/Questionnaire';
import { Questions } from '../../entities/Questions';
import { SharedMethodProvider } from '../shared-method/shared-method';
import { v4 as uuid } from 'uuid';
import * as moment from 'moment';
import { Itinerary } from '../../entities/Itinerary';
import { TranslateService } from '@ngx-translate/core';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { NotificationIdMapperProvider } from '../notification-id-mapper/notification-id-mapper';
import { CheckConectionProvider } from '../check-conection/check-conection';
import { RestApiProvider } from '../rest-api/rest-api';
import { SyncStatus } from '../../entities/SyncStatus';

@Injectable()
export class QuestionnaireCrudProvider {

  constructor(
    public sharedMethod: SharedMethodProvider,
    public translateService: TranslateService,
    public localNotifications: LocalNotifications,
    private notificationIdMapper: NotificationIdMapperProvider,
    public checkConection: CheckConectionProvider,
    public restApi: RestApiProvider
  ) {

  }

  /**
   * Funcion que se encarga de guardar/actualizar la informacion correspondiente a las respuestas de los questionarios
   * 
   * @param array_questions array de objetos que contiene la pregunta y la respuesta del cuestionario
   * @param itinerary object itinerary
   */
  async saveQuestionnaireAsync(array_questions: Array<any>, itinerary: any) {
    const answer_repo = getRepository(Answer);
    const question_repo = getRepository(Questions);
    let sync_status_repo = getRepository(SyncStatus);
    let question: any;
    let answers: Answer;
    let length_array_question = array_questions.length;
    let user = await this.sharedMethod.getUser();
    let now = moment().utc().unix() * 1000;
    let exist_conection: boolean = this.checkConection.isConected();
    let ok: boolean;

    for (let i = 0; i < length_array_question; i++) {
      question = await question_repo.createQueryBuilder('q')
        .leftJoinAndSelect('q.answer', 'answer')
        .where('q.id = :id', { id: array_questions[i].question.id })
        .getOne();

      let answer: any = question.answer;
      //Si esa pregunta ya tiene una respuesta la editamos
      if ((typeof answer != 'undefined') && (answer.length > 1)) {

      }
      else {
        let sync_status_ = await sync_status_repo.findOne({ id: 1 });
        answers = new Answer();
        answers.itinerary = itinerary;
        answers.questions = array_questions[i].question;

        if (array_questions[i].input_answer.length != 0) {
          answers.text_data = array_questions[i].input_answer;
        }
        else {
          answers.text_data = array_questions[i].toggle_value.toString();
        }
        answers.id = uuid();
        answers.user_updated = user.user_obj.id;
        answers.user_created = user.user_obj.id;
        answers.date_updated = now;
        answers.date_created = now;
        answers.sync_status = sync_status_;

        if (exist_conection) {
          try {
            this.restApi.modifyHeaders();
            ok = await this.restApi.sendDataToServer('answer', answers, 'create');
            if (ok) {
              await answer_repo.save(answers);
            }
          } catch(error) {
            await answer_repo.save(answers);
          }
        }
        else {
          await answer_repo.save(answers);
        }
      }

      // Eliminamos las notificaciones de esta cita
      await this.cancelExpiration(itinerary);
    }
  }

  /**
   * Funcion encargada de borrar los datos de la notificacion finalizada
   * 
   * @param itinerary object itinerary
   */
  private async cancelExpiration(itinerary: Itinerary) {
    let notificacion_name = itinerary.id + ":expiration";

    let notificacion_id = await this.notificationIdMapper.getIdFromName(notificacion_name);
    if (notificacion_id != undefined) {
      await this.localNotifications.cancel(notificacion_id);
      await this.notificationIdMapper.clear(notificacion_name);
    }
  }


  /**
   * Funcion encargada de devolver el cuestionario solicitado (checkin / checkout)
   * 
   * @param itinerary object de tipo itinerary 
   * @param type integer con el tipo de questionario que se desea devolver
   */
  async getQuestionaryByTypeAsync(itinerary: Itinerary, type: number) {
    const questionnaire_repo = getRepository(Questionnaire);
    let questionnary;

    questionnary = await questionnaire_repo.createQueryBuilder('q')
      .leftJoinAndSelect('q.itinerary_type', "itinerary_type")
      .leftJoinAndSelect("q.questions", "questions")
      .leftJoinAndSelect("questions.question_type", "question_type")
      .leftJoinAndSelect("q.questionnaire_type", "questionnaire_type")
      .leftJoinAndSelect("questions.answer", "answer")
      .where("itinerary_type.id = :itinerary_type_id", { itinerary_type_id: itinerary.itinerary_type.id })
      .andWhere("questionnaire_type.id = :type", { type: type })
      .getOne();

    return questionnary;
  }

}

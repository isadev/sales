import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { TranslateService } from '@ngx-translate/core';
import { getRepository } from 'typeorm';
import { SharedMethodProvider } from '../shared-method/shared-method';
import { Itinerary } from '../../entities/Itinerary';
import { ItineraryType } from '../../entities/ItineraryType';
import { Customer } from '../../entities/Customer';
import { CustomerContact } from '../../entities/CustomerContact';
import { City } from '../../entities/City';
import { Status } from '../../entities/Status';
import { Questionnaire } from '../../entities/Questionnaire';
import { v4 as uuid } from 'uuid';
import { SynchronousForegroundProvider } from '../synchronous-foreground/synchronous-foreground';
import { CheckConectionProvider } from '../check-conection/check-conection';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { NotificationIdMapperProvider } from '../notification-id-mapper/notification-id-mapper';
import { RestApiProvider } from '../rest-api/rest-api';
import { SyncStatus } from '../../entities/SyncStatus';

@Injectable()
export class ItineraryCrudProvider {

  max_result: number = 100;
  locale: string;
  questionnaireInterval: NodeJS.Timer;
  is_close_timer: NodeJS.Timer;

  constructor(
    public translateService: TranslateService,
    public sharedMethod: SharedMethodProvider,
    public syncFore: SynchronousForegroundProvider,
    public checkConection: CheckConectionProvider,
    public localNotifications: LocalNotifications,
    private notificationIdMapper: NotificationIdMapperProvider,
    private restApi: RestApiProvider,
  ) {
    this.locale = this.translateService.getDefaultLang();
    moment.locale(this.locale);
  }

  async saveItinerary(data: Array<any>, is_new: boolean, old_itinerary: any = null) {

    const itinerary_type_repo = getRepository(ItineraryType);
    const itinerary_repo = getRepository(Itinerary);
    const customer_repo = getRepository(Customer);
    const customer_contact_repo = getRepository(CustomerContact);
    const sync_status_repo = getRepository(SyncStatus);
    const status_repo = getRepository(Status);
    const city_repo = getRepository(City);

    moment.locale(this.locale);

    let itinerary_type_ = await itinerary_type_repo.createQueryBuilder("it")
      .where('lower(it.name) = :type_name', { type_name: data['appointmentType'].toLowerCase() })
      .getOne();

    let customer_ = await customer_repo.createQueryBuilder("c")
      .where('lower(c.name) = :company_name', { company_name: data['appointmentCompanyName'].toLowerCase() })
      .getOne();

    let customer_contact_ = await customer_contact_repo.createQueryBuilder("cc")
      .where('lower(cc.email)  = :email', { email: data['appointmentContact'].toLowerCase() })
      .getOne();

    let city = await city_repo.createQueryBuilder("ct")
      .where('lower(ct.name)  = :name', { name: data['appointmentCity'].toLowerCase() })
      .getOne();

    let client: any;
    client = await this.sharedMethod.getClient();

    let user: any;
    user = await this.sharedMethod.getUser();
    let exist_conection: boolean = this.checkConection.isConected();

    // Si el usuario esta registrado se procede a guardar y editar los datos
    if (user.found) {
      //Construimos el objeto de tipo entero para guardarlo en la bd y luego transformarlo a fecha
      let day: number = moment(data['appointmentDate']).toObject().date;
      let month: number = moment(data['appointmentDate']).toObject().months;
      month++;
      let years: number = moment(data['appointmentDate']).toObject().years;
      let hour: number = moment(data['appointmentHour']).toObject().hours;
      let minutes: number = moment(data['appointmentHour']).toObject().minutes;
      let seconds: number = moment(data['appointmentHour']).toObject().seconds;

      let timestamp = moment(years + "-" + month + "-" + day + " " + hour + ":" + minutes + ":" + seconds).utc().unix() * 1000;
      let now: number = moment().utc().unix() * 1000;
      //Si se va a editar la data
      if (!is_new) {
        let sync_status_ = await sync_status_repo.findOne({ id: 2 });
        old_itinerary.date_time = timestamp;
        old_itinerary.address = data['appointmentAddress'];
        old_itinerary.observation = data['appointmentObservations'] == null ? "" : data['appointmentObservations'];
        old_itinerary.itinerary_type = itinerary_type_;
        old_itinerary.customer_contact = customer_contact_;
        old_itinerary.customer = customer_;
        old_itinerary.city = city;

        let geo = await this.syncFore.getGeolocation();
        old_itinerary.geolocation = geo.lat + "," + geo.long;
        old_itinerary.user_updated = user.user_obj.id;
        old_itinerary.date_updated = now;
        old_itinerary.sync_status = sync_status_;

        if (exist_conection) {
          try {
            this.restApi.modifyHeaders();
            let ok: boolean = await this.restApi.sendDataToServer('itinerary', old_itinerary, 'update');
            if (ok)
              await itinerary_repo.save(old_itinerary);
          } catch (error) {
            await itinerary_repo.save(old_itinerary);
          }
        }
        else {
          await itinerary_repo.save(old_itinerary);
        }

        await this.scheduleReminder(old_itinerary);
        await this.itinerarysForgotten(old_itinerary);
      }
      else {
        let itinerary: Itinerary = new Itinerary();
        let status_ini = await status_repo.findOne({ id: "1" });
        let sync_status_ = await sync_status_repo.findOne({ id: 1 });

        itinerary.id = uuid();
        itinerary.status = status_ini;
        itinerary.date_time = timestamp;
        itinerary.address = data['appointmentAddress'];
        itinerary.observation = data['appointmentObservations'] == null ? "" : data['appointmentObservations'];
        itinerary.customer = customer_;
        itinerary.itinerary_type = itinerary_type_;
        itinerary.customer_contact = customer_contact_;
        itinerary.user = user.user_obj;
        itinerary.client = client.client_obj;
        itinerary.city = city;
        itinerary.last_itinerary_position = 1;
        itinerary.user_created = user.user_obj.id;
        itinerary.user_updated = user.user_obj.id;
        itinerary.date_updated = now;
        itinerary.date_created = now;
        let geo = await this.syncFore.getGeolocation();
        itinerary.geolocation = geo.lat + "," + geo.long;
        itinerary.sync_status = sync_status_;

        if (exist_conection) {
          try {
            this.restApi.modifyHeaders();
            let ok: boolean = await this.restApi.sendDataToServer('itinerary', itinerary, 'create');
            if (ok)
              await itinerary_repo.save(itinerary);
          }
          catch (error) {
            await itinerary_repo.save(itinerary);
          }
        }
        else {
          await itinerary_repo.save(itinerary);
        }

        await this.scheduleReminder(itinerary);
        await this.itinerarysForgotten(itinerary);
      }
    }
  }

  /**
   * Funcion encargada de crear los datos en el local storage para generar las notificaciones 
   * 
   * @param itinerary object itinerary
   */
  private async scheduleReminder(itinerary: Itinerary) {
    let notification_msg_title = await this.translateService.get("notification_msg_reminder_title").toPromise();
    let notificacion_name = itinerary.id + ":reminder";

    let notificacion_id = await this.notificationIdMapper.getIdFromName(notificacion_name);
    if (notificacion_id != undefined) {
      await this.localNotifications.cancel(notificacion_id);
      await this.notificationIdMapper.clear(notificacion_name);
    }

    let notificationId: number = await this.notificationIdMapper.generateId(notificacion_name);
    let time = itinerary.date_time - 60 * 60 * 1000;
    this.localNotifications.schedule({
      id: notificationId,
      title: notification_msg_title,
      text: itinerary.client.name,
      at: moment.utc(time).local().format(), // cada hora
    });
  }

  /**
   * Funcion encargada de verificar si el itienrario que se esta actualizando ya lleno el formulario de checkin
   * @param itinerary Itinerary que se esta modificando
   */
  public async isQuestionnaireCharged(itinerary: Itinerary) {
    let itinerary_repo = getRepository(Itinerary);
    let itinerary_formulary = await itinerary_repo.createQueryBuilder('i')
      .leftJoinAndSelect("i.answers", "answers")
      .leftJoinAndSelect("answers.questions", "questions")
      .leftJoinAndSelect("questions.questionnaire", "questionnaire")
      .leftJoinAndSelect("questionnaire.questionnaire_type", "questionnaire_type")
      .where("i.id = :id", { id: itinerary.id })
      .andWhere("questionnaire_type.name = :name", { name: "checkin" })
      .getOne();

    return typeof itinerary_formulary == "undefined" ? false : true;
  }

  /**
   * Funcion encargada de revisar si los datos del formulario han sido llenados
   * 
   * @param itinerary object itinerary
   */
  private async questionnaireReminder(itinerary: Itinerary) {
    let itinerary_repo = getRepository(Itinerary);
    let answer_with_data: boolean = true;

    let itinerary_formulary = await itinerary_repo.createQueryBuilder('i')
      .leftJoinAndSelect("i.answers", "answers")
      .leftJoinAndSelect("answers.questions", "questions")
      .leftJoinAndSelect("questions.questionnaire", "questionnaire")
      .leftJoinAndSelect("questionnaire.questionnaire_type", "questionnaire_type")
      .where("i.id = :id", { id: itinerary.id })
      .andWhere("questionnaire_type.name = :name", { name: "checkin" })
      .getOne();

    if (typeof itinerary_formulary == "undefined") {
      let notification_msg_checkin_title = await this.translateService.get("notification_msg_checkin_title").toPromise();
      let notificacion_name = itinerary.id + ":questionnaireReminder";
      let notificacion_id = await this.notificationIdMapper.getIdFromName(notificacion_name);
      if (notificacion_id != undefined) {
        await this.localNotifications.cancel(notificacion_id);
        await this.notificationIdMapper.clear(notificacion_name);
      }

      let notificationId: number = await this.notificationIdMapper.generateId(notificacion_name);
      this.localNotifications.schedule({
        id: notificationId,
        title: notification_msg_checkin_title,
        text: itinerary.client.name,
      });
      answer_with_data = false;
    }

    if (answer_with_data)
      clearInterval(this.questionnaireInterval);
  }


  /**
   * Funcion encargada de crear las notificaciones para los itinerarios vencidos
   * 
   * @param itinerary object itinerary
   */
  private async itinerarysForgotten(itinerary: Itinerary) {
    let notification_msg_forgotten_title = await this.translateService.get("notification_msg_forgotten_title").toPromise();
    let notificacion_name = itinerary.id + ":expiration";

    let notificacion_id = await this.notificationIdMapper.getIdFromName(notificacion_name);
    if (notificacion_id != undefined) {
      await this.localNotifications.cancel(notificacion_id);
      await this.notificationIdMapper.clear(notificacion_name);
    }

    let notificationId: number = await this.notificationIdMapper.generateId(notificacion_name);
    let time = itinerary.date_time + 10 * 60 * 1000;
    this.localNotifications.schedule({
      id: notificationId,
      title: notification_msg_forgotten_title,
      text: itinerary.client.name,
      at: moment.utc(time).local().format() // 10 minutos de haberla perdido
    });
  }

  /**
   * Funcion encargada de generar dinamicamente el cuestionario
   * 
   * @param itinerary object de tipo itinerary 
   * @param formulary_type_number integer con la numeracion hasta el 6 que indica el estado del itinerario (en proceso,...,cancelado)
   */
  async getFormularyByAppointmentIdAsync(itinerary: any, formulary_type_number: any) {
    const questionnaire_repo: any = getRepository(Questionnaire);
    let questionnary: any;

    questionnary = await questionnaire_repo.createQueryBuilder('q')
      .leftJoinAndSelect('q.itinerary_type', "itinerary_type")
      .leftJoinAndSelect("q.questions", "questions")
      .leftJoinAndSelect("questions.question_type", "question_type")
      .leftJoinAndSelect("q.questionnaire_type", "questionnaire_type")
      .where("itinerary_type.id = :itinerary_type_id", { itinerary_type_id: itinerary.itinerary_type.id })
      .andWhere("questionnaire_type.id = :formulary_type_number", { formulary_type_number: formulary_type_number })
      .getOne();

    let response = [];
    let question_type;
    let object_construct;

    questionnary.questions.forEach(question => {
      question_type = question.question_type;
      object_construct = { question: question, question_type: question.question_type, questionnary: questionnary, toggle_value: false, input_answer: "" };
      response.push(object_construct);
      object_construct = {};
    });
    return response;
  }

  /**
   * Funcion encargada de obtener el itinerario solicitado.
   * 
   * @param itinerary object de tipo itinerary
   */
  async getDataOfItinerary(itinerary: any) {
    let itinerary_repo = getRepository(Itinerary);
    let itinerary_updated;

    itinerary_updated = await itinerary_repo.createQueryBuilder("i")
      .leftJoinAndSelect("i.itinerary_type", "itinerary_type")
      .leftJoinAndSelect("i.customer", "customer")
      .leftJoinAndSelect("i.city", "city")
      .leftJoinAndSelect("i.client", "client")
      .leftJoinAndSelect("city.province", "province")
      .leftJoinAndSelect("i.customer_contact", "customer_contact")
      .leftJoinAndSelect("i.status", "status")
      .leftJoinAndSelect("i.answers", "answers")
      .leftJoinAndSelect("i.expense", "expense")
      .leftJoinAndSelect("i.invoice", "invoice")
      .leftJoinAndSelect("i.user", "user")
      .where("i.id = :id", { id: itinerary.id })
      .getOne();

    itinerary_updated.date_format = moment.utc(itinerary_updated.date_time).local().format("LLL");
    return itinerary_updated;
  }

  /**
   * Funcion encargada de devolver el listado de itinerarios asi como sus datos.
   * 
   * @param tab_position int indica los itineraries a mostrar (todas = 0, hoy = 1, pasadas = 2)
   * @param from_demo bool indica si entra con la session de la demo y tiene que cargar datos estaticos de la bd
   * @param page integer entero que indica desde donde comenzar a buscar en la lista de itinerarios
   * @param from_search string que indica la busqueda por medio palabras especificas
   */
  async getItineraryListAsync(tab_position: any, from_demo: boolean, page: any = 0, from_search: string = "") {
    let dates: any = this.sharedMethod.getTodayAndTomorrowTimestamp();

    let timestamp_today = dates.today;
    let timestamp_tomorrow = dates.tomorrow;

    //if (from_demo)

    //else {

    this.restApi.modifyHeaders();
    await this.restApi.getMasterListFromServer('itinerary');
    let itinerary_repo = getRepository(Itinerary);
    let itinerary_list;

    let user: any;
    user = await this.sharedMethod.getUser();

    let query_builder_custom = itinerary_repo.createQueryBuilder("i")
      .leftJoinAndSelect("i.itinerary_type", "itinerary_type")
      .leftJoinAndSelect("i.customer", "customer")
      .leftJoinAndSelect("i.city", "city")
      .leftJoinAndSelect("city.province", "province")
      .leftJoinAndSelect("i.customer_contact", "customer_contact")
      .leftJoinAndSelect("i.status", "status")
      .leftJoinAndSelect("i.answers", "answers")
      .leftJoinAndSelect("i.expense", "expense")
      .leftJoinAndSelect("i.invoice", "invoice")
      .leftJoinAndSelect("i.user", "user")
      .leftJoinAndSelect("i.client", "client")
      .where('user.id = :user_id', { user_id: user.user_obj.id });

    if (user.found) {
      let total_itinerary_list = await query_builder_custom
        .orderBy("i.date_time", "DESC")
        .getManyAndCount();

      from_search = from_search.toLowerCase();
      let search_criteria = "lower(i.address) like '%" + from_search + "%' "
        + "or lower(itinerary_type.name) like '%" + from_search + "%' "
        + "or lower(customer.name) like '%" + from_search + "%' "
        + "or lower(status.name) like '%" + from_search + "%' ";

      if (tab_position == 0) {
        //si quiere buscar
        if (from_search.length == 0) {
          itinerary_list = await query_builder_custom
            .skip(this.max_result * page) // se multiplica y se lleva el control desde el metodo que lo llama
            //para mantener tantas paginas lleva saltanto
            .take(this.max_result)
            .orderBy("i.date_time", "DESC")
            .getMany();
        }
        else {
          itinerary_list = await query_builder_custom
            .andWhere(search_criteria)
            .orderBy("i.date_time", "DESC")
            .getMany();
        }
      }
      // las de hoy
      if (tab_position == 1) {
        if (from_search.length == 0) {
          itinerary_list = await query_builder_custom
            .where("i.date_time >= :today", { today: timestamp_today })
            .andWhere("i.date_time <= :tomorrow", { tomorrow: timestamp_tomorrow })
            .skip(this.max_result * page) // se multiplica y se lleva el control desde el metodo que lo llama
            //para mantener tantas paginas lleva saltanto
            .take(this.max_result)
            .orderBy("i.date_time", "DESC")
            .getMany();
        }
        else {
          itinerary_list = await query_builder_custom
            .where("i.date_time >= :today", { today: timestamp_today })
            .andWhere("i.date_time <= :tomorrow", { tomorrow: timestamp_tomorrow })
            .andWhere(search_criteria)
            .orderBy("i.date_time", "DESC")
            .getMany();
        }
      }
      // las pasadas
      else if (tab_position == 2) {
        let timestamp_old = moment().utc().unix() * 1000;
        if (from_search.length == 0) {
          itinerary_list = await query_builder_custom
            .andWhere("i.date_time <= :timestamp_old", { timestamp_old: timestamp_old })
            .skip(this.max_result * page) // se multiplica y se lleva el control desde el metodo que lo llama
            //para mantener tantas paginas lleva saltanto
            .take(this.max_result)
            .orderBy("i.date_time", "DESC")
            .getMany();
        }
        else {
          itinerary_list = await query_builder_custom
            .andWhere("i.date_time <= :timestamp_old", { timestamp_old: timestamp_old })
            .andWhere(search_criteria)
            .orderBy("i.date_time", "DESC")
            .getMany();
        }
      }
      return this.getDataBuildForItinerary(total_itinerary_list, itinerary_list);
    }
  }

  /**
   * Funcion para construir el objeto respuesta de los itinerarios
   * 
   * @param itinerary_list array de itineraries 
   * @param total_itinerary_list array [count_itinerary, objetos_itinerary]
   */
  async getDataBuildForItinerary(total_itinerary_list: Array<any>, itinerary_list: Array<any>) {
    let data: Array<any> = [];
    let response: Array<any> = [];
    let obj: Array<any> = [];
    let timestamp: any = {};
    timestamp.new = 0;

    //Transformamos la data para mostrarla en la vista
    for (let itinerary of itinerary_list) {
      moment.locale(this.locale);

      let moment_itinerary_date_time = moment.utc(itinerary.date_time).local();
      // Volvemos a crear la fecha iniciando en 0 horas
      let itinerary_today = moment_itinerary_date_time.format("YYYY-MM-DD 00:00:00");
      let moment_ = moment(itinerary_today);
      let itinerary_timestamp = moment_.unix() * 1000;

      // Si es la primera vuelta
      if (timestamp.new == 0) {
        timestamp.new = itinerary_timestamp;
        obj['date'] = moment_itinerary_date_time.format('LL');
      }
      // Si tienen la misma fecha los agrupamos
      if (itinerary_timestamp == timestamp.new) {
        //Guardamos la fecha del objeto en formato para mostrarlo en la vista
        itinerary.date_format = moment_itinerary_date_time.format("LLL");
        data.push(itinerary);
      }
      else {
        // Guardamos el objeto antes de iniciar con el siguiente
        obj['data'] = data;
        response.push(obj);
        timestamp.new = itinerary_timestamp;

        obj = [];
        obj['date'] = moment_itinerary_date_time.format('LL');
        obj['data'] = [];
        data = [];

        itinerary.date_format = moment_itinerary_date_time.format("LLL");
        data.push(itinerary);
      }
      await this.scheduleReminder(itinerary);
      await this.itinerarysForgotten(itinerary);
    }

    // Guardamos la ultima data filtrada
    obj['data'] = data;
    response.push(obj);

    return { total_items: total_itinerary_list[1], itinerary_list: response };
  }

  /**
   * Funcion encargada de actualizar el estado en el cual se encuentra el itinerario
   * 
   * @param itinerary object itinerary que se desea modificar
   * @param state_itinerary string estado al cual pasara el itinerario [1,2,3,4,5,6]
   */
  async changeStateItineraryAsync(itinerary: any, state_itinerary: any) {
    let itinerary_repo = getRepository(Itinerary);
    let status_repo = getRepository(Status);
    let exist_conection: boolean = this.checkConection.isConected();

    let itinerary_status = await status_repo.findOne({ id: state_itinerary });
    let user = await this.sharedMethod.getUser();
    let now = moment().utc().unix() * 1000;


    itinerary.last_itinerary_position = itinerary_status.id;
    itinerary.user_updated = user.user_obj.id;
    itinerary.date_updated = now;
    itinerary.status = itinerary_status;

    if (exist_conection) {
      try {
        this.restApi.modifyHeaders();
        let ok: boolean = await this.restApi.sendDataToServer('itinerary', itinerary, 'update');
        if (ok)
          await itinerary_repo.save(itinerary);
      } catch (error) {
        await itinerary_repo.save(itinerary);
      }
    }
    else {
      await itinerary_repo.save(itinerary);
    }

    // Cambiamos la frecuencia de ejecucion de la geolocalizacion si esta entre el estado "en desplazamiento" "en progreso"
    if ((state_itinerary >= 2) && (state_itinerary <= 4)) {
      this.syncFore.startGeolocation(120000);

      if (this.questionnaireInterval != undefined)
        clearInterval(this.questionnaireInterval);
      this.questionnaireInterval = setInterval(async () => {
        await this.questionnaireReminder(itinerary);
      }, 60 * 60 * 1000); // cada hora
    }
    else {
      if (this.questionnaireInterval != undefined)
        clearInterval(this.questionnaireInterval);
      this.syncFore.startGeolocation();

    }
    return this.getDataOfItinerary(itinerary);
  }

  /**
   * Funcion para actualizar el itinerario y colocarlo en estado cancelado
   * 
   * @param itinerary object de tipo itinerary para actualizar
   * @param last_position ultima posicion en la cual estuvo el itinerario
   */
  async cancellItinerary(itinerary: any, last_position: any) {
    let itinerary_repo = getRepository(Itinerary);
    let sync_status_repo = getRepository(SyncStatus);
    let status_repo = getRepository(Status);
    let exist_conection: boolean = this.checkConection.isConected();

    let sync_status_ = await sync_status_repo.findOne({ id: 2 });
    let user = await this.sharedMethod.getUser();
    let now = moment().utc().unix() * 1000;
    let status = await status_repo.findOne({ id: "6" });

    itinerary.last_itinerary_position = last_position;
    itinerary.user_updated = user.user_obj.id;
    itinerary.date_updated = now;
    itinerary.status = status;
    itinerary.sync_status = sync_status_;
    itinerary.date_updated = now;

    if (exist_conection) {
      try {
        this.restApi.modifyHeaders();
        let ok: boolean = await this.restApi.sendDataToServer('itinerary', itinerary, 'update');
        if (ok)
          await itinerary_repo.save(itinerary);
      } catch (error) {
        await itinerary_repo.save(itinerary);
      }
    }
    else {
      await itinerary_repo.save(itinerary);
    }

    await this.cancelExpiration(itinerary, "expiration");
    await this.cancelExpiration(itinerary, "reminder");
  }

  /**
   * Funcion encargada de borrar los datos de la notificacion finalizada y canceladas
   * 
   * @param itinerary object itinerary
   */
  private async cancelExpiration(itinerary: Itinerary, type: string) {
    let notificacion_name = itinerary.id + ":" + type;

    let notificacion_id = await this.notificationIdMapper.getIdFromName(notificacion_name);
    if (notificacion_id != undefined) {
      await this.localNotifications.cancel(notificacion_id);
      await this.notificationIdMapper.clear(notificacion_name);
    }
  }

  /**
   * Funcion encargada de actualizar la informacion del customer asociado al itinerario
   * 
   * @param itinerary objeto de tipo itinerario para modificarle el customer
   * @param customer_contact_new objeto de tipo customer_contact
   */
  async updateCustomerOfItinerary(itinerary: any, customer_contact_new: any) {
    const itinerary_repo = getRepository(Itinerary);
    let now = moment().utc().unix();
    let sync_status_repo = getRepository(SyncStatus);
    let sync_status_ = await sync_status_repo.findOne({ id: 2 });
    let exist_conection: boolean = this.checkConection.isConected();

    itinerary.sync_status = sync_status_;
    itinerary.date_updated = now;
    itinerary.customer_contact = customer_contact_new;

    if (exist_conection) {
      try {
        this.restApi.modifyHeaders();
        let ok: boolean = await this.restApi.sendDataToServer('itinerary', itinerary, 'update');
        if (ok)
          await itinerary_repo.save(itinerary);
      } catch (error) {
        await itinerary_repo.save(itinerary);
      }
    }
    else {
      await itinerary_repo.save(itinerary);
    }
  }
}

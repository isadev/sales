import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Storage } from '@ionic/storage';
import { getRepository } from 'typeorm';
import * as moment from 'moment';
import { AuthServiceProvider } from '../auth-service/auth-service';
import { CheckConectionProvider } from '../check-conection/check-conection';

import { City } from '../../entities/City';
import { Province } from '../../entities/Province';
import { ItineraryType } from '../../entities/ItineraryType';
import { PaymentMethod } from '../../entities/PaymentMethod';
import { Product } from '../../entities/Product';
import { Workday } from '../../entities/Workday';
import { Events } from 'ionic-angular/util/events';
import { DatabaseCreateProvider } from '../database-create/database-create';
import { v4 as uuid } from 'uuid';
import { Repository } from 'typeorm/repository/Repository';
import { NotificationIdMapperProvider } from '../notification-id-mapper/notification-id-mapper';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { RestApiProvider } from '../rest-api/rest-api';
import { SyncStatus } from '../../entities/SyncStatus';

@Injectable()
export class SharedMethodProvider {
  private max_result: number = 100;
  private synchronous_interval_db: NodeJS.Timer;
  private until_conection_not_exist: NodeJS.Timer;
  private syncingDb: number = 30 * 60 * 1000; // 30min
  private syncingConection: number = 5 * 1000; //5seg
  public is_conected: boolean = false;
  private locale: string;

  constructor(
    public events: Events,
    private checkConection: CheckConectionProvider,
    public authService: AuthServiceProvider,
    public translateService: TranslateService,
    public storage: Storage,
    public database: DatabaseCreateProvider,
    public notificationIdMapper: NotificationIdMapperProvider,
    public localNotifications: LocalNotifications,
    public restApi: RestApiProvider
  ) {
    this.locale = this.translateService.getDefaultLang();
    moment.locale(this.locale);
  }

  /**
   * Funcion para devolver el cliente exitente logeado
   */
  async getClient() {
    let client: any = { found: false, client_obj: null };
    return this.storage.get('client').then(value => {
      if (value == null) {
        client.found = false;
      }
      else {
        client.found = true;
        client.client_obj = value;
      }
      return client;
    });
  }

  /**
   * Funcion encargada de devolver el usuario existente logeado
   */
  async getUser() {
    let user: any = { found: false, user_obj: null };
    return this.storage.get('user').then(value => {
      if (value == null) {
        user.found = false;
      }
      else {
        user.found = true;
        user.user_obj = value;
      }
      return user;
    });
  }

  /**
   * Funcion para obtner el estado del usuario cuando se logea o se deslogea
   */
  async getStateUser() {
    return this.storage.get('state').then(value => {
      if (value == undefined)
        return 'gone';
      return value;
    });
  }

  /**
   * Funcion encargada de devolver el listado de nombres de las ciudades
   */
  async getOnlyCityListAsync() {
    const city_repo = getRepository(City);

    let city_list: any = await city_repo.createQueryBuilder("c")
      .getMany();

    let only_city: Array<string> = [];

    city_list.forEach(element => {
      only_city.push(element.name.toLowerCase());
    });

    return only_city;
  }

  /**
   * Funcion encargada de devolver el timestamp de hoy y de mañana
   */
  getTodayAndTomorrowTimestamp() {
    let locale = this.translateService.getDefaultLang();
    moment.locale(locale);

    let timestamp_today = moment().utc().unix() * 1000;
    let timestamp_tomorrow = moment().utc().add('1', 'day').unix() * 1000;

    return { "today": timestamp_today, "tomorrow": timestamp_tomorrow };
  }

  /**
   * Funcion encargada de devolver el listado de provincias existentes en la bd
   */
  async getProvinceList() {
    let province_repo = getRepository(Province);
    let province_list: any;

    province_list = await province_repo.createQueryBuilder("p")
      .getMany();
    return province_list;
  }

  /**
   * Funcion encargada de devolver el listado de ciudades existentes
   */
  async getCityList() {
    const city_repo = getRepository(City);

    let city_list = await city_repo.createQueryBuilder("c")
      .getMany();

    return city_list;
  }

  /**
   * Funcion encargada de devolver el listado de tipos de itinerarios existentes
   */
  async getItineraryTypeList() {
    const itinerary_type_repo = getRepository(ItineraryType);

    let itinerary_type_list = await itinerary_type_repo.createQueryBuilder("it")
      .getMany();

    return itinerary_type_list;
  }

  /**
   * Funcion encargada de devolver el listado de ciudades pertenecientes a una provincia dada
   * 
   * @param province objecto de tipo province
   */
  async getCityOfProvince(province: string) {
    let city_repo = getRepository(City);

    let citys = await city_repo.createQueryBuilder('c')
      .leftJoinAndSelect('c.province', 'province')
      .where('province.name = :name', { name: province })
      .getMany();

    return citys;
  }

  /**
   * Funcion encargada de obtener el listado de pagos existentes en la app
   */
  async getPaymentMethodAsync() {
    const payment_repo = getRepository(PaymentMethod);
    let only_payment = [];

    let payment_method = await payment_repo.createQueryBuilder('p').getMany();
    payment_method.forEach(payment => {
      only_payment.push(payment.name);
    });
    return only_payment;
  }

  /**
   * Funcion encargada de devolver el listado de productos asociado al usuario logeado
   * @param show_all bool booleano que indica si se deben mostrar todos los productos o solo los vigentes
   */
  async getListProductsAsync(show_all: boolean = false, page: any = 0, from_search: string = "") {
    const product_repo = getRepository(Product);

    let client: any;
    client = await this.getClient();

    // Si existe un cliente logeado
    if (client.found) {
      this.restApi.modifyHeaders();
      await this.restApi.getMasterListFromServer('product');

      let response;
      let query_builder_custom = product_repo.createQueryBuilder('p')
        .leftJoinAndSelect("p.prices", "prices")
        .leftJoinAndSelect("p.product_category", "product_category")
        .leftJoinAndSelect("p.client", "client")
        .leftJoinAndSelect("p.invoice_product", "invoice_product")
        .where("client.id = :id", { id: client.client_obj.id });

      let total = await query_builder_custom
        .getManyAndCount();

      //si se necesita buscar una informacion en especifico
      if (from_search.length == 0) {
        response = await query_builder_custom
          .skip(this.max_result * page) // se multiplica y se lleva el control desde el metodo que lo llama
          //para mantener tantas paginas lleva saltanto
          .take(this.max_result)
          .getMany();
      }
      else {
        from_search = from_search.toLowerCase();
        response = await query_builder_custom
          .andWhere("lower(p.name) like '%" + from_search + "%' "
          + "or lower(p.code) like '%" + from_search + "%' ")
          .getMany();
      }

      moment.locale(this.locale);
      let today = moment().unix();

      response.forEach(products => {
        /* The atteched came like this.
        local;[image/jpg];[/path/filename]
        url;[MIME];[filename guid].[extensión]*/
        // Extraemos la imagen del producto.
        let image = products.custom_image.split(';');
        products.image = image[2];

        let prices = products.prices;
        let length = prices.length;
        let cont = true;
        products.show = false;
        // iteramos por el listado de precios por producto
        for (let i = 0; ((i < length) && (cont)); i++) {
          //Buscamos si existe un precio que este vigente para hoy
          if ((today >= prices[i].start_date) && (today <= prices[i].end_date)) {
            products.actual_price = prices[i];
            products.show = true;
            cont = false;
          }
        }
      });
      return { products: response, total_items: total[1] };
    }
  }

  /**
   * Funcion encargada de cambiar el estado del usuario logeado y crear a su vez una entrada al workday.
   * @param state string con posibles valores [active, gone, offline]
   */
  async changeStatusUserAsync(state: string) {
    let user: any;
    let locale = this.translateService.getDefaultLang();
    moment.locale(locale);
    user = await this.getUser();
    let time_active: number;
    let exist_conection: boolean = this.checkConection.isConected();
    let ok: boolean;

    if (user.found) {
      let date: number = moment().utc().unix() * 1000;
      let workday_repo: Repository<Workday> = getRepository(Workday) as Repository<Workday>;
      if (state == 'active') {
        let new_workday = new Workday();
        new_workday.id = uuid();
        new_workday.start_date = date;
        new_workday.end_date = 0;
        new_workday.item_type = "0";
        new_workday.user = user.user_obj;
        new_workday.date_created = date;
        new_workday.date_updated = date;
        new_workday.user_created = user.user_obj.id;
        new_workday.user_updated = user.user_obj.id;
        new_workday.sync_status = new SyncStatus();
        new_workday.sync_status.id = 1;

        this.authService.setKeyValue("last_workday", new_workday);

        if (exist_conection) {
          try {
            this.restApi.modifyHeaders();
            ok = await this.restApi.sendDataToServer('workday', new_workday, 'create');
            if (ok) {
              await workday_repo.save(new_workday);
            }
          } catch (error) {
            await workday_repo.save(new_workday);
          }
        }
        else {
          await workday_repo.save(new_workday);
        }

        time_active = 4 * 65 * 60 * 1000; //4:05horas
      }
      else {
        time_active = 65 * 60 * 1000; //1:05horas
        let last_workday = await this.authService.getKey("last_workday");

        if ((typeof last_workday != 'undefined') && (typeof last_workday.end_date != 'undefined')) {
          //Actualizamos la ultima entrada
          last_workday.end_date = date;
          last_workday.date_created = date;
          last_workday.date_updated = date;
          last_workday.user = user.user_obj;
          last_workday.user_created = user.user_obj.id;
          last_workday.user_updated = user.user_obj.id;
          last_workday.sync_status = new SyncStatus();
          last_workday.sync_status.id = 2;

          if (exist_conection) {
            try {
              this.restApi.modifyHeaders();
              ok = await this.restApi.sendDataToServer('workday', last_workday, 'update');
              if (ok) {
                await workday_repo.save(last_workday);
              }
            }
            catch (error) {
              await workday_repo.save(last_workday);
            }
          }
          else {
            await workday_repo.save(last_workday);
          }
        }
      }

      let old_state: string = await this.authService.getKey('state');

      if (state != old_state) {
        let notification_msg_title: string;
        let notification_msg_text: string;

        if (state == 'active') {
          notification_msg_title = await this.translateService.get("notification_msg_session_max_work_hours_title").toPromise();
          notification_msg_text = await this.translateService.get("notification_msg_session_max_work_hours_text").toPromise();
        }
        else {
          notification_msg_title = await this.translateService.get("notification_msg_session_max_rest_hours_title").toPromise();
          notification_msg_text = await this.translateService.get("notification_msg_session_max_rest_hours_text").toPromise();
        }

        let notificacion_name = "session:reminder";

        let notificacion_id = await this.notificationIdMapper.getIdFromName(notificacion_name);
        if (notificacion_id != undefined) {
          await this.localNotifications.cancel(notificacion_id);
          await this.notificationIdMapper.clear(notificacion_name);
        }

        let notificationId: number = await this.notificationIdMapper.generateId(notificacion_name);
        this.localNotifications.schedule({
          id: notificationId,
          title: notification_msg_title,
          text: notification_msg_text,
          at: (moment().utc().unix()) + time_active, // 4:05 o 1:05 horas
        });
      }
    }
    //Cambiamos el valor del stado en el cual se esta el usuario
    this.authService.setKeyValue('state', state);
    this.events.publish('change_state_user');
  }

  //Funcion para verificar que el usuario este logeado
  async getConnectedUser() {
    let user;
    user = await this.getUser();

    return user.found;
  }

  /**
   * Funcion para obtener las actualizaciones sobre los datos existentes
   */
  public async updateDataFromServer() {
    if (this.checkConection.isConected()) {
      //Obtenemos la data que esta en el servidor, actualizamos lo que se encuentra en el local
      await this.restApi.getDataApiFromScrath();

      // realizamos la sincronizacion con la api para mandar los datos que fueron creados desde la app
      await this.restApi.sendAllDataToServer();
    }
  }

  /**
   * Funcion para obtnener la primera carga de los datos al instalar la app por primera vez
   */
  public async getAllDataFromServer() {
    let moment_ = moment().utc().unix() * 1000;
    let first_charge_db: boolean = await this.authService.getKey('first_charge_db');
    let all_ok: string;
    // si no existe ningun dato en la bd 
    if (first_charge_db == undefined) {
      //solicitamos a la api que nos devuelva toda la informacion referente a la base de datos
      all_ok = await this.restApi.getDataApiFromScrath();

      if (all_ok == 'ok') {
        await this.authService.setKeyValue('first_charge_db', true);
        await this.authService.setKeyValue('date_last_sync', moment_);

        // Inicializamos el intervalo con el cual la bd se debe actualizar
        await this.initializeIntervalForChangeFromDB();
      }
      else {
        console.log('Something happeng during the load of data:\n' + all_ok);
      }
      return (all_ok == 'ok');
    }
    //Si es indefinido 'ok' es debido a que ya se inicializo la bd una primera vez
    return ((all_ok == undefined) && first_charge_db);
  }

  /**
   * Funcion unicamente llamada en el start-session para inicializar la app si el usuario no se ha logeado
   * 
   * @param dataUser dataUser: Object = { email, pwd }
   */
  public async getDataOfUserFromServer(data_user: any = null) {
    await this.restApi.buildCredentials(data_user);

    let response = await this.getAllDataFromServer();
    return response;
  }

  /**
   * Funcion para corroborar la conexion e intentar cargar los datos de la api
   */
  async initializeIntervalForChangeFromDB() {
    this.is_conected = await this.checkConection.showConectionAlert();

    if (this.until_conection_not_exist == undefined) {
      if (!this.is_conected) {
        this.until_conection_not_exist = setInterval(() => {
          this.initializeIntervalForChangeFromDB();
        }, this.syncingConection);
      }
      else {
        await this.getDataFromApi();
      }
    }
    else {
      if (this.is_conected) {
        await this.getDataFromApi();
      }
    }
  }

  /**
 * Funcion para inicializar el intervalo en el cual se obtendran los datos de la bd
 */
  async getDataFromApi() {
    //let is_user_conected = await this.sharedMethod.getConnectedUser();
    let is_conected: boolean = await this.checkConection.isConected();
    if (is_conected) {
      //Si la conexion existe dejamos de preguntar por conexion pero iniciar para sincronizar la base de datos
      if (this.until_conection_not_exist)
        clearInterval(this.until_conection_not_exist);

      if (this.synchronous_interval_db)
        clearInterval(this.synchronous_interval_db);

      this.synchronous_interval_db = setInterval(async () => {
        await this.updateDataFromServer();
      }, this.syncingDb); // 30 min
    }
  }

  stopDataSync() {
    if (this.synchronous_interval_db)
      clearInterval(this.synchronous_interval_db);
  }

  async createDbStatic() {
    this.database.createDBStatic();
  }
}

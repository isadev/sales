import { Injectable, Inject } from '@angular/core';
import { CheckConectionProvider } from '../check-conection/check-conection';
import { Geolocation } from '@ionic-native/geolocation';
import { NotificationIdMapperProvider } from '../notification-id-mapper/notification-id-mapper';
import { getRepository } from 'typeorm';
import { Itinerary } from '../../entities/Itinerary';
import * as moment from 'moment';
import { TranslateService } from '@ngx-translate/core';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Configuration, APP_CONFIG } from '../../app/app.config';

@Injectable()
export class SynchronousForegroundProvider {
  private geolocation_interval_id: any;
  private syncingGeo: number = 5 * 60 * 1000; // cinco minutos
  public lat: any;
  public long: any;
  public is_conected: boolean = false;
  public sync_itinerary_interval: NodeJS.Timer;
  public syncItineraryInterval: NodeJS.Timer;
  private appConfig: Configuration;

  constructor(
    private geolocation: Geolocation,
    private checkConection: CheckConectionProvider,
    private notificationIdMapper: NotificationIdMapperProvider,
    private translateService: TranslateService,
    private localNotifications: LocalNotifications,
    private http: HttpClient,
    @Inject(APP_CONFIG) config: Configuration
  ) {
    this.appConfig = config;
  }

  /**
   * Funcion que inicializa la geolocalizacion
   */
  public async startGeolocation(timing: number = null) {
    let timingGeolocation = (timing == undefined) ? this.syncingGeo : timing;
    if (this.geolocation_interval_id != undefined)
      clearInterval(this.geolocation_interval_id);
    this.geolocation_interval_id = setInterval(async () => {
      await this.setGeolocation();
      await this.watchCloseItineraryPosition();
    }, timingGeolocation);
  }

  /**
   * Funcion para detener la geolocalizacion
   */
  public async stopGeolocation() {
    if (this.geolocation_interval_id != undefined)
      clearInterval(this.geolocation_interval_id);
  }

  /**
   * Funcion que inicia los valores de la geolocalizacion
   */
  async setGeolocation() {
    if (this.checkConection.isConected()) {
      return new Promise((resolve, reject) => {
        this.geolocation.getCurrentPosition()
          .then(response => {
            this.lat = response.coords.latitude;
            this.long = response.coords.longitude;
            resolve(true)
            console.log("despues localizacion", this.lat, this.long);
          })
          .catch(error => {
            reject(false);
          });
      });
    }
  }

  /**
   * Funcion para obtener los datos de la geolocalizacion
   */
  async getGeolocation() {
    return { lat: this.lat, long: this.long };
  }

  async getLatestGeolocation() {
    await this.setGeolocation();
    return this.lat + "," + this.long;
  }

  /**
   * Funcion para limpiar todas las notificaciones creadas cada 7 horas
   */
  clearNotifications() {
    let seven_hours = 7 * 60 * 60 * 1000; // siete horas
    setInterval(async () => {
      this.notificationIdMapper.clearAllOutdated();
    }, seven_hours);
  }

  async watchCloseItineraryPosition() {
    let itinerary_repo = getRepository(Itinerary);
    let locale = this.translateService.getDefaultLang();
    moment.locale(locale);
    let today;
    let tomorrow;
    let array_itinerary_proximity: Array<any>;
    let notification_msg_near_title;
    let notification_msg_near_text;
    let notification_name;
    let notification_id;
    let origin


    today = moment().utc().set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
    tomorrow = moment().utc().set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).add(1, 'days');

    let itineraries = await itinerary_repo.createQueryBuilder('i')
      .where("i.date_time >= :today", { today: today.unix() })
      .andWhere("i.date_time < :tomorrow", { tomorrow: tomorrow.unix() })
      .getMany();

    let locations: Array<{ itinerary_id: string, geolocation: string }>;
    locations = itineraries.map((itinerary: Itinerary) => {
      return {
        itinerary_id: itinerary.id,
        geolocation: itinerary.geolocation
      };
    });

    origin = await this.getLatestGeolocation();

    array_itinerary_proximity = await this.areClose(origin, locations);

    for (let near of array_itinerary_proximity) {
      if (near.near) {
        notification_msg_near_title = await this.translateService.get("notification_msg_near_title").toPromise();
        notification_msg_near_text = await this.translateService.get("notification_msg_near_text").toPromise();
        notification_name = near.itinerary_id + ":nearLocation";
        notification_id = await this.notificationIdMapper.getIdFromName(notification_name);

        if (notification_id != undefined) {
          await this.localNotifications.cancel(notification_id);
          await this.notificationIdMapper.clear(notification_name);
        }

        notification_id = await this.notificationIdMapper.generateId(notification_name);
        this.localNotifications.schedule({
          id: notification_id,
          title: notification_msg_near_title,
          text: notification_msg_near_text
        });
      }
    }
  }

  stopItineraryInterval() {
    if (this.sync_itinerary_interval != undefined)
      clearInterval(this.sync_itinerary_interval);
  }

  /**
   * Funcion encargada de solicitar a la api de google dada la posicion actual calcule 
   * la distancia a los itinerarios del dia de hoy
   * 
   * @param origin string con la ubicacion en coordenadas lat long de su posicion actual
   * @param destinations array de strings con las coordenadas lat long de todos los itinerarios 
   * que coinciden con el dia de hoy
   */
  async areClose(origin: string, destinations: Array<{ itinerary_id: string, geolocation: string }>) {

    if (destinations.length == 0) {
      return [];
    }

    let headers = new HttpHeaders({
      "Content-Type": 'application/json',
      'Accept': 'application/json',
      'Access-Control-Allow-Headers': '*',
      "Access-Control-Allow-Origin": "*"
    });

    let params = new HttpParams();
    params = params.set("origins", origin);
    params = params.set("key", this.appConfig.googleApiKey);

    let url: string = "https://maps.googleapis.com/maps/api/distancematrix/json?";
    let lat_long: string = destinations.map(dest => dest.geolocation).join('|');

    params = params.set("destinations", lat_long);

    /*let promise_data = {
      "destination_addresses": [
        "Avenida Intercomunal Don Julio Centeno, San Diego 2006, Carabobo, Venezuela",
        "12.092277,-68.858925"
      ],
      "origin_addresses": ["Cd Montemayor, San Diego 2006, Carabobo, Venezuela"],
      "rows": [
        {
          "elements": [
            {
              "distance": {
                "text": "5,8 km",
                "value": 5828
              },
              "duration": {
                "text": "12 min",
                "value": 720
              },
              "status": "OK"
            },
            {
              "status": "ZERO_RESULTS"
            }
          ]
        }
      ],
      "status": "OK"
    };*/

    let promise_data: any = await this.http
      .get(url, { headers: headers, params: params })
      .toPromise();

    // es un solo row porque tenemos un solo origin
    let rows = promise_data.rows[0].elements;

    return rows.map((row: any, index) => {
      return {
        itinerary_id: destinations[index].itinerary_id,
        near: (row.status.toLowerCase() == 'ok') ? true : false
      };
    });
  }
}

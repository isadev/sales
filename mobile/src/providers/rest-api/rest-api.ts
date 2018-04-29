import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, Inject } from '@angular/core';
import { Configuration, APP_CONFIG } from '../../app/app.config';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { CheckConectionProvider } from '../check-conection/check-conection';
import { DatabaseCreateProvider } from '../database-create/database-create';
import { AuthServiceProvider } from '../auth-service/auth-service';

@Injectable()
export class RestApiProvider {
  private locale: string;
  private appConfig: Configuration;
  private requestOptions: HttpHeaders;

  constructor(
    public http: HttpClient,
    @Inject(APP_CONFIG) config: Configuration,
    public translateService: TranslateService,
    private checkConection: CheckConectionProvider,
    public database: DatabaseCreateProvider,
    public auth: AuthServiceProvider,
  ) {
    this.locale = this.translateService.getDefaultLang();
    moment.locale(this.locale);
    this.appConfig = config;
  }

  /**
   * Funcion para construir los datos necesarios para las peticiones a la api
   */
  public async buildCredentials(user: any = null) {
    let token: string;

    if (user != null) {
      token = "Basic " + btoa(user.email + ':' + user.pwd);
    }
    else {
      token = await this.auth.getKey('token');
      console.log(token);
    }

    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Access-Control-Allow-Headers': '*',
      'Access-Control-Allow-Origin': "*",
      'Authorization': token
    });
    this.requestOptions = headers;
  }

  /**
   * Metodo encargado de realizar la peticion al servidor para obtener toda la data existente
   */
  async getDataApiFromScrath() {
    let last_sync = await this.database.getDateLastAsync();
    let url: string;
    let first_time: boolean = false;
    if (last_sync == null) {
      url = this.appConfig.apiBaseUrl + 'api/load/masters';
      first_time = true;
    }
    else {
      url = this.appConfig.apiBaseUrl + 'api/load/masters?dateLastSync=' + last_sync;
      first_time = false;
    }

    let promise_data: any = await this.http
      .get(url, { headers: this.requestOptions })
      .toPromise();

    this.database.setCredentials(this.requestOptions);
    let response_data = await this.database.initializeDBFromApi(promise_data.domain, first_time);
    return response_data;
  }

  /**
   * Funcion encargada de solicitar al servidor el listado de masters de la base de datos ej:"customer_contact"
   */
  async getMasterListFromServer(master: string) {
    let url: string = this.appConfig.apiBaseUrl + 'api/' + master + '/list'//?dateLastSync=' + last_sync;
    let all_ok: string;

    if (this.checkConection.isConected()) {
      console.log(this.requestOptions);
      let promise_data: any = await this.http
        .get(url, { headers: this.requestOptions })
        .toPromise();

      let new_object = { [master]: promise_data.domain };
      let master_camel_case: string = "";
      let master_name_splited = master.split('_');

      for (let ii = 0; ii < master_name_splited.length; ii++)
        master_camel_case += master_name_splited[ii].charAt(0).toUpperCase() + master_name_splited[ii].slice(1);

      let method_name = "update" + master_camel_case + "ListFromApi"; //

      if (typeof this.database[method_name] == "function") {
        all_ok = await this.database[method_name](new_object, true);
      } else {
        all_ok = "not ok";
      }

      return (all_ok == 'ok');
    }
    return false;
  }

  /**
   * Funcion encargad de modificar la cabecera dependiendo de la necesidad de la entidad
   * 
   * @param header string nombre de la cabecera (EJ: Content-Type)
   * @param action string action que se realizara sobre la cabecera (Ej: set o delete)
   * @param value string valor que sera asignado a esa cabecera (Ej: application/json)
   */
  modifyHeaders(header: string = "Content-Type", action: string = "set", value: string = "application/json") {
    if (typeof this.requestOptions != 'undefined') {
      if (action == 'delete')
        this.requestOptions = this.requestOptions[action](header);
      else if (action == 'set')
        this.requestOptions = this.requestOptions[action](header, value);
    }
  }

  async sendDataToServer(master_name: string, object: any, action: string, process_data: boolean = true) {
    let url: string = this.appConfig.apiBaseUrl + 'api/' + master_name + '/' + action;
    let promise_data: any;

    let data_process: any;
    let response: any;

    if (!this.checkConection.isConected())
      return false;

    if (process_data) {
      // Se procesa la data para enviarla al backend
      if ((action == 'update') || (action == 'create')) {
        response = await this.processData(master_name, object);
        data_process = response.data;
      }
      // En caso que suceda un error no se realizan las peticiones
      if ((response.data == undefined) && (response.status != 'ok'))
        return false;
    }
    else {
      data_process = object;
    }
    if (action == 'update') {
      try {
        promise_data = await this.http
          .put(url, data_process, { headers: this.requestOptions })
          .toPromise();
      }
      catch (error) {
        throw error;
      }
    }
    else if (action == 'create') {
      try {
        promise_data = await this.http
          .post(
          url,
          data_process,
          { headers: this.requestOptions }
          )
          .toPromise();
      } catch (error) {
        throw error;
      }
    }
    else if (action == 'delete') {
      //TODO: como se envian los de tipo invoice_product?
      let params_data: HttpParams = new HttpParams();
      try {
        if (typeof object.id == 'undefined') {
          params_data = params_data.set("id_invoice", object.invoices.id);
          params_data = params_data.set("id_product", object.product.id);
        }
        else
          params_data = params_data.set("id", object.id);
      } catch (error) {
        throw error;
      }
      try {
        promise_data = await this.http
          .delete(url + "/" + object.id, {
            headers: this.requestOptions,
          })
          .toPromise();
      } catch (error) {
        throw error;
      }
    }

    if (promise_data.error == null)
      return true;
    throw "false";
  }

  /**
   * Funcion encargada de mapear la data a lo necesario para ser recibida en el backend
   * 
   * @param object objeto con la data que se requiere procesar
   * @param string nombre de la tabla que se quiere procesar
   */
  async processData(master_name: string, object: any) {
    let master_camel_case: string = "", method_name: string;
    let master_name_splited = master_name.split('_');
    let all_ok: { status: string, data: any };

    for (let ii = 0; ii < master_name_splited.length; ii++)
      master_camel_case += master_name_splited[ii].charAt(0).toUpperCase() + master_name_splited[ii].slice(1);

    method_name = "generate" + master_camel_case + "ForApi"; //generateCustomerContactForApi

    if (typeof this.database[method_name] == "function") {
      all_ok = await this.database[method_name](object);
    } else {
      all_ok = { status: 'not ok', data: undefined };
    }

    return all_ok;
  }

  /**
   * Funcion encargada de armar el objeto que sera enviado al servidor
   */
  public async sendAllDataToServer() {
    let array_builded = await this.database.sendPostDataToServer();
    let response_all_ok: boolean = true;
    let array_update_local_data: Array<any> = [];
    let data_local: any = {};

    this.modifyHeaders("Content-Type", "delete");
    if (typeof array_builded.expense != "undefined") {
      for (let item of array_builded.expense) {
        if (item.data.sync_status.id == 1) {
          response_all_ok = await this.sendDataToServer("expense", item.data, 'create', false);
        }
        else if (item.data.sync_status.id == 2) {
          response_all_ok = await this.sendDataToServer("expense", item.data, "update", false);
        }
        else if (item.data.sync_status.id == 3) {
          response_all_ok = await this.sendDataToServer("expense", item.data, "delete", false);
        }
        if (response_all_ok) {
          array_update_local_data.push(item.data);
        }
      }
    }

    if (typeof array_builded.answer != "undefined") {
      for (let item of array_builded.answer) {
        if (item.data.sync_status.id == 1) {
          response_all_ok = await this.sendDataToServer("answer", item.data, 'create', false);
        }
        else if (item.data.sync_status.id == 2) {
          response_all_ok = await this.sendDataToServer("answer", item.data, 'update', false);
        }
        else if (item.data.sync_status.id == 3) {
          response_all_ok = await this.sendDataToServer("answer", item.data, 'delete', false);
        }
        if (response_all_ok) {
          array_update_local_data.push(item.data);
        }
      }
    }

    data_local.answer = array_update_local_data;
    array_update_local_data = [];

    // Se coloco a esta altura para reestablecer las cabeceras de 
    // las demas entidades que no llevan un file en el cuerpo de la peticion
    this.modifyHeaders();

    data_local.expense = array_update_local_data;
    array_update_local_data = [];

    if (typeof array_builded.itinerary != "undefined") {
      for (let item of array_builded.itinerary) {
        if (item.data.sync_status.id == 1) {
          response_all_ok = await this.sendDataToServer("itinerary", item.data, 'create', false);
        }
        else if (item.data.sync_status.id == 2) {
          response_all_ok = await this.sendDataToServer("itinerary", item.data, "update", false);
        }
        else if (item.data.sync_status.id == 3) {
          response_all_ok = await this.sendDataToServer("itinerary", item.data, "delete", false);
        }
        if (response_all_ok) {
          array_update_local_data.push(item.data);
        }
      }
    }

    data_local.itinerary = array_update_local_data;
    array_update_local_data = [];

    if (typeof array_builded.customer != "undefined") {
      for (let item of array_builded.customer) {
        if (item.data.sync_status.id == 1) {
          response_all_ok = await this.sendDataToServer("customer", item.data, 'create', false);
        }
        else if (item.data.sync_status.id == 2) {
          response_all_ok = await this.sendDataToServer("customer", item.data, "update", false);
        }
        else if (item.data.sync_status.id == 3) {
          response_all_ok = await this.sendDataToServer("customer", item.data, "delete", false);
        }
        if (response_all_ok) {
          array_update_local_data.push(item.data);
        }
      }
    }

    data_local.customer = array_update_local_data;
    array_update_local_data = [];

    if (typeof array_builded.customer_contact != "undefined") {
      for (let item of array_builded.customer_contact) {
        if (item.data.sync_status.id == 1) {
          response_all_ok = await this.sendDataToServer("customer_contact", item.data, 'create', false);
        }
        else if (item.data.sync_status.id == 2) {
          response_all_ok = await this.sendDataToServer("customer_contact", item.data, "update", false);
        }
        else if (item.data.sync_status.id == 3) {
          response_all_ok = await this.sendDataToServer("customer_contact", item.data, "delete", false);
        }
        if (response_all_ok) {
          array_update_local_data.push(item.data);
        }
      }
    }

    data_local.customer_contact = array_update_local_data;
    array_update_local_data = [];

    if (typeof array_builded.client != "undefined") {
      for (let item of array_builded.client) {
        if (item.data.sync_status.id == 1) {
          response_all_ok = await this.sendDataToServer("client", item.data, 'create', false);
        }
        else if (item.data.sync_status.id == 2) {
          response_all_ok = await this.sendDataToServer("client", item.data, 'update', false);
        }
        else if (item.data.sync_status.id == 3) {
          response_all_ok = await this.sendDataToServer("client", item.data, 'delete', false);
        }
        if (response_all_ok) {
          array_update_local_data.push(item.data);
        }
      }
    }

    data_local.client = array_update_local_data;
    array_update_local_data = [];

    if (typeof array_builded.workday != "undefined") {
      for (let item of array_builded.workday) {
        if (item.data.sync_status.id == 1) {
          response_all_ok = await this.sendDataToServer("workday", item.data, 'create', false);
        }
        else if (item.data.sync_status.id == 2) {
          response_all_ok = await this.sendDataToServer("workday", item.data, 'update', false);
        }
        else if (item.data.sync_status.id == 3) {
          response_all_ok = await this.sendDataToServer("workday", item.data, 'delete', false);
        }
      }
    }

    data_local.workday = array_update_local_data;
    array_update_local_data = [];

    if (typeof array_builded.invoice != "undefined") {
      for (let item of array_builded.invoice) {
        if (item.data.sync_status.id == 1) {
          response_all_ok = await this.sendDataToServer("invoice", item.data, 'create', false);
        }
        else if (item.data.sync_status.id == 2) {
          response_all_ok = await this.sendDataToServer("invoice", item.data, 'update', false);
        }
        else if (item.data.sync_status.id == 3) {
          response_all_ok = await this.sendDataToServer("invoice", item.data, 'delete', false);
        }
        if (response_all_ok) {
          array_update_local_data.push(item.data);
        }
      }
    }

    data_local.invoice = array_update_local_data;
    array_update_local_data = [];

    if (typeof array_builded.invoice_product != "undefined") {
      for (let item of array_builded.invoice_product) {
        if (item.data.sync_status.id == 1) {
          response_all_ok = await this.sendDataToServer("invoice_product", item.data, 'create', false);
        }
        else if (item.data.sync_status.id == 2) {
          response_all_ok = await this.sendDataToServer("invoice_product", item.data, 'update', false);
        }
        else if (item.data.sync_status.id == 3) {
          response_all_ok = await this.sendDataToServer("invoice_product", item.data, 'delete', false);
        }
        if (response_all_ok) {
          array_update_local_data.push(item.data);
        }
      }
    }

    data_local.invoice_product = array_update_local_data;
    array_update_local_data = [];

    if (typeof array_builded.user != "undefined") {
      for (let item of array_builded.user) {
        if (item.data.sync_status.id == 1) {
          response_all_ok = await this.sendDataToServer("user", item.data, 'create', false);
        }
        else if (item.data.sync_status.id == 2) {
          response_all_ok = await this.sendDataToServer("user", item.data, 'update', false);
        }
        else if (item.data.sync_status.id == 3) {
          response_all_ok = await this.sendDataToServer("user", item.data, 'delete', false);
        }
        if (response_all_ok) {
          array_update_local_data.push(item.data);
        }
      }
    }

    data_local.user = array_update_local_data;
    array_update_local_data = [];
    this.database.setDateLastAsync();
  }

}

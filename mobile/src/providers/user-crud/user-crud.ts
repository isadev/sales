import { Injectable } from '@angular/core';
import { getRepository } from 'typeorm';
import { User } from '../../entities/User';
import { CheckConectionProvider } from '../check-conection/check-conection';
import { RestApiProvider } from '../rest-api/rest-api';
import { AuthServiceProvider } from '../auth-service/auth-service';
import * as moment from 'moment';
import { SyncStatus } from '../../entities/SyncStatus';

@Injectable()
export class UserCrudProvider {

  constructor(
    public restApi: RestApiProvider,
    private checkConection: CheckConectionProvider,
    private auth: AuthServiceProvider
  ) {
  }

  /**
   * Funcion encargada de guardar la contraseña del nuevo usuario
   * 
   * @param data array con la data que viene del formulario del crear usuario
   * @param user object de tipo user que es el que se vera afectado
   */
  async saveUserNewPassword(data: Array<any>, user: User) {
    const user_repo = getRepository(User);
    let sync_status_repo = getRepository(SyncStatus);
    let exist_conection: boolean = this.checkConection.isConected();
    let ok: boolean;
    let now = moment().utc().unix() * 1000;
    let sync_status_ = await sync_status_repo.findOne({ id: 2 });

    user.password = data["new_password"];
    user.sync_status = sync_status_;
    user.date_updated = now;

    let token = "Basic " + btoa(user.email + ':' + data["new_password"]);

    if (exist_conection) {
      try {
        this.restApi.modifyHeaders();
        ok = await this.restApi.sendDataToServer('user', user, 'update');
        if (ok) {
          this.auth.setKeyValue("token", token);
          this.auth.setKeyValue('password', data["new_password"]);
          await this.restApi.buildCredentials();
          await user_repo.save(user);
        }
      } catch (error) {
        throw error;
      }
    }
    else {
      throw "error";
    }
  }

  /**
   * Funcion encargada de guardar el nuevo usuario
   * 
   * @param data array con la data que viene del formulario del crear usuario
   * @param user object de tipo user que es el que se vera afectado
   */
  async saveUserNewData(data: Array<string>, user: User) {
    const user_repo: any = getRepository(User);
    let sync_status_repo = getRepository(SyncStatus);
    let exist_conection: boolean = this.checkConection.isConected();
    let ok: boolean;
    let now = moment().utc().unix() * 1000;
    let sync_status_ = await sync_status_repo.findOne({ id: 2 });

    user.first_name = data["first_name"];
    user.last_name = data["last_name"];
    user.email = data["email"];
    user.sync_status = sync_status_;
    user.date_updated = now;

    let token = "Basic " + btoa(data["email"] + ':' + user.password);

    if (exist_conection) {
      try {
        this.restApi.modifyHeaders();
        ok = await this.restApi.sendDataToServer('user', user, 'update');
        if (ok) {
          this.auth.setKeyValue("token", token);
          this.auth.setKeyValue('email', data["email"]);
          await this.restApi.buildCredentials();
          await user_repo.save(user);
        }
      } catch (error) {
        throw error;
      }
    }
    else {
      throw "error";
    }
  }
}

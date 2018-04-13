import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Storage } from '@ionic/storage';
import { getRepository } from 'typeorm';
import { User } from '../../entities/User';
import { LocalNotifications } from '@ionic-native/local-notifications';

@Injectable()
export class AuthServiceProvider {

  constructor(public storage: Storage, public localNotifications: LocalNotifications) {

  }

  async login(credentials) {
    if (credentials.email === null || credentials.pwd === null) {
      return Observable.throw("Please insert credentials");
    } else {
      const user_repo = getRepository(User);

      let response = await this.storage.get('auth').then(value => {
        //Si no hay ninguna clave guardada como auth entonces el usuario se ha deslogeado y hay que pedir las 
        //credenciales nuevamente
        if (value == null)
          return false;
        else
          return true;
      });

      // Si ya se habia logeado previamente
      if (response) {
        return true;
      }
      else {
        let user_found = await user_repo.createQueryBuilder('u')
          .leftJoinAndSelect("u.client", "client")          
          .andWhere("u.email = :email", { email: credentials.email })
          .getOne();

          let token = "Basic " + btoa(credentials.email + ':' + credentials.pwd);          

        if (user_found) {
          this.setKeyValue("token", token);
          this.setKeyValue('auth', true);
          this.setKeyValue('client', user_found.client);
          this.setKeyValue('user', user_found);
          this.setKeyValue('email', credentials.email);
          this.setKeyValue('password', credentials.pwd);
          return true;
        }
        else
          return false;
      }
    }
  }

  public setKeyValue(key_name, value) {
    this.storage.set(key_name, value);
  }

  public getKey(key_name) {
    return this.storage.get(key_name) ? this.storage.get(key_name) : null;
  }

  public logout() {
    this.localNotifications.cancelAll();
    this.storage.clear();
  }
}

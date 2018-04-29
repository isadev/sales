import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { LocalNotifications } from '@ionic-native/local-notifications';

@Injectable()
export class NotificationIdMapperProvider {

  private prefix: string = "_notif_";

  constructor(public storage: Storage, private localNotifications: LocalNotifications) { }

  public async generateId(name: string): Promise<number> {
    let last_id: number = await this.storage.get('last_notification_id');
    let new_id: number = await last_id + 1;

    await this.storage.set(this.prefix + name, new_id);
    await this.storage.set('last_notification_id', new_id);

    return new_id
  }

  public async getIdFromName(name: string): Promise<number> {
    return await this.storage.get(this.prefix + name);
  }

  public async clear(name: string) {
    return await this.storage.remove(this.prefix + name);
  }

  public clearAllOutdated() {
    let twoDaysInMilliseconds = 300000; //2*24*60*60*1000;
    this.storage.forEach((value: any, key: string) => {
      if (key.slice(0, 7) == this.prefix) {
        this.localNotifications.get(value).then((notification: any) => {
          if ((typeof notification == "string" && notification.toLowerCase() == 'ok') || (notification.trigger.at < new Date().getTime() - twoDaysInMilliseconds) ) {
            this.storage.remove(key);
          }
        });
      }
    });
  }
}

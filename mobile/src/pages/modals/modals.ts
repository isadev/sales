import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ViewController } from 'ionic-angular/navigation/view-controller';

@IonicPage()
@Component({
  selector: 'page-modals',
  templateUrl: 'modals.html',
})
export class ModalsPage {

  from_page: string;
  img_name: string;
  
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {
    this.img_name = this.navParams.get('img_name');
    this.from_page = this.navParams.get('from_page');
  }

  ionViewDidLoad() {

  }

  closeModal() {
    this.viewCtrl.dismiss();
  }
}

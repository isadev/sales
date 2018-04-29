import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ViewProfileEditPage } from '../view-profile-edit/view-profile-edit';
import { ViewChangePasswordPage } from '../view-change-password/view-change-password';
import { SharedMethodProvider } from '../../../providers/shared-method/shared-method';

@IonicPage()
@Component({
  selector: 'page-view-user-detail',
  templateUrl: 'view-user-detail.html',
})
export class ViewUserDetailPage {

  users: any = {};
  show_ion_fab: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public sharedMethod: SharedMethodProvider) {
    this.sharedMethod.getUser().then((response) => {
      this.users = response.user_obj;
      console.log(this.users);
    });
  }

  ionViewDidLoad() {

  }

  changePassword() {
    this.show_ion_fab = false;
    this.navCtrl.push(ViewChangePasswordPage, { user: this.users });
  }

  changeProfile() {
    this.show_ion_fab = false;
    this.navCtrl.push(ViewProfileEditPage, { user: this.users });
  }

  clickIonFab() {
    this.show_ion_fab = !this.show_ion_fab;
  }

}

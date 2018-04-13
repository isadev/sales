import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { UserCrudProvider } from '../../../providers/user-crud/user-crud';
import { FormGroup } from '@angular/forms/src/model';
import { User } from '../../../entities/User';
import { AlertGeneratorProvider } from '../../../providers/alert-generator/alert-generator';

@IonicPage()
@Component({
  selector: 'page-view-profile-edit',
  templateUrl: 'view-profile-edit.html',
})
export class ViewProfileEditPage {

  user: User;
  old_first_name: string;
  old_last_name: string;
  old_email: string;
  profile_form: FormGroup;

  constructor(public userCrud: UserCrudProvider, 
    public alertCtrl: AlertController, 
    public formBuilder: FormBuilder, 
    public translate: TranslateService, 
    public navCtrl: NavController, 
    public navParams: NavParams,
    public alertGenerator: AlertGeneratorProvider
  ) {
    this.user = this.navParams.get('user');

    this.old_first_name = this.user.first_name;
    this.old_last_name = this.user.last_name;
    this.old_email = this.user.email;

    this.profile_form = formBuilder.group({
      first_name: ['', Validators.compose([Validators.required])],
      last_name: ['', Validators.compose([Validators.required])],
      email: ['', Validators.compose([Validators.required])],
    });
  }

  ionViewDidLoad() {

  }

  async saveForm() {
    this.alertGenerator.showLoading();
    this.userCrud.saveUserNewData(this.profile_form.value, this.user)
      .then(response => {
        this.alertGenerator.dismissLoading();
        this.alertGenerator.getAlert('ok');
        this.navCtrl.pop();
      })
      .catch(error => {
        this.alertGenerator.dismissLoading();
        this.alertGenerator.getAlert('error');
        this.navCtrl.pop();
      });
  }
}

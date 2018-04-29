import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { CheckConectionProvider } from '../../../providers/check-conection/check-conection';
import { UserCrudProvider } from '../../../providers/user-crud/user-crud';
import { AlertGeneratorProvider } from '../../../providers/alert-generator/alert-generator';

@IonicPage()
@Component({
  selector: 'page-view-change-password',
  templateUrl: 'view-change-password.html',
})
export class ViewChangePasswordPage {

  user: any;
  old_pwd: string;
  new_password_form: any;
  all_complete: boolean;
  new_password: string;
  repeat_password: string;

  constructor(
    public checkConection: CheckConectionProvider, 
    public userCrud: UserCrudProvider, 
    public alertCtrl: AlertController, 
    public formBuilder: FormBuilder, 
    public translate: TranslateService, 
    public navCtrl: NavController, 
    public navParams: NavParams,
    public alertGenerator: AlertGeneratorProvider
  ) {
    this.user = this.navParams.get('user');
    this.old_pwd = this.user.password;

    this.new_password_form = formBuilder.group({
      new_password: ['', Validators.compose([Validators.required])],
      repeat_password: ['', Validators.compose([Validators.required])],
    });
  }

  ionViewDidLoad() {

  }

  // Validacion aun por definir si se usara o no
  validate(input) {
    let validate = false;

    if (input != this.old_pwd)
      validate = true;
    this.all_complete = validate;
  }

  async saveForm() {
    let is_conected: boolean = await this.checkConection.showConectionAlert();
    if (is_conected) {
      this.alertGenerator.showLoading();
      this.userCrud.saveUserNewPassword(this.new_password_form.value, this.user)
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
}

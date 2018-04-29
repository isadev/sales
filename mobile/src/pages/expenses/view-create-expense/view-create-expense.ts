import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder, Validators } from '@angular/forms';
import { CameraOptions, Camera } from '@ionic-native/camera';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';
import { ExpenseCrudProvider } from '../../../providers/expense-crud/expense-crud';
import { Expense } from '../../../entities/Expense';
import { Itinerary } from '../../../entities/Itinerary';
import { AlertGeneratorProvider } from '../../../providers/alert-generator/alert-generator';
import { Events } from 'ionic-angular/util/events';

@IonicPage()
@Component({
  selector: 'page-view-create-expense',
  templateUrl: 'view-create-expense.html',
})
export class ViewCreateExpensePage {
  createExpensesForm: any;
  old_item: string;
  old_description: string;
  old_value: number;
  old_atteched: string = "";
  old_atteched_img: string = "";
  baseImage: string = "";
  imgUrl: string = "";
  submitAttempt: boolean = false;
  touched: boolean = false;
  is_new: boolean = true;
  old_expense: any;
  itinerary: Itinerary;

  constructor(
    public alertCtrl: AlertController,
    private camera: Camera,
    public translate: TranslateService,
    public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public expenseCrud: ExpenseCrudProvider,
    public alertGenerator: AlertGeneratorProvider,
    public events: Events
  ) {

    //Obtenemos el itinerary al cual se le asignara ese gasto
    this.itinerary = this.navParams.get('itinerary');

    // Si la data es para modificar    
    if (this.navParams.get('expense_detail') != null) {
      let camera_img_downloaded;
      this.translate.get('camera_img_downloaded').subscribe(response => {
        camera_img_downloaded = response;
      });

      let expense_to_modify: Expense = this.navParams.get('expense_detail');

      this.old_item = expense_to_modify.item;
      this.old_description = expense_to_modify.description;
      this.old_value = expense_to_modify.value;
      this.old_atteched = camera_img_downloaded;
      let img = expense_to_modify.atteched.split(';');
      this.old_atteched_img = img[2];
      this.is_new = false;
      this.old_expense = this.navParams.get('expense_detail');
    }
    this.createExpensesForm = formBuilder.group({
      expenseItem: ['', Validators.compose([Validators.required])],
      expenseDescription: ['', Validators.compose([Validators.required])],
      expenseValue: ['', Validators.compose([Validators.required])],
      expenseAtteched: [],
    });
  }

  async takePicture() {
    let camera_img_uploaded_success;
    camera_img_uploaded_success = await this.translate.get('camera_img_uploaded_success').toPromise();
    // Para capturar y mostar la imagen de vuelta
    let options: CameraOptions = {
      destinationType: this.camera.DestinationType.FILE_URI,
      targetWidth: 300,
      targetHeight: 300,
      quality: 70,
      mediaType: this.camera.MediaType.PICTURE,
      saveToPhotoAlbum: true,
    }
    this.camera.getPicture(options)
      .then(imageData => {
        this.baseImage = imageData;
        console.log(this.baseImage);
        this.createExpensesForm.patchValue({ expenseAtteched: this.baseImage });
        this.old_atteched_img = 'data:image/jpeg;base64,' + this.baseImage;
        this.old_atteched = camera_img_uploaded_success;
      })
      .catch(error => {
        console.log(error);
      });
  }

  async saveForm() {
    // Si al formulario le hace falta la foto porque es un gasto nuevo
    /* if (this.old_atteched == null && this.baseImage.length < 2) {
      this.submitAttempt = true;
    }
    // Si al formulario le hace falta la foto pero es una edicion de un gasto
    else if (this.old_atteched_img == null)
      this.submitAttempt = true;
    else { */
    let data = this.createExpensesForm.value;
    data.atteched_img = this.baseImage;
    this.alertGenerator.showLoading();
    this.expenseCrud.saveExpense(data, this.is_new, this.old_expense, this.itinerary)
      .then((response) => {
        this.alertGenerator.dismissLoading();
        this.alertGenerator.getAlert('ok');
        this.events.publish('itinerary_updated', { itinerary: this.itinerary });
        this.navCtrl.pop();
      }).catch((error) => {
        this.alertGenerator.dismissLoading();
        this.alertGenerator.getAlert('error');
      });
  }
}

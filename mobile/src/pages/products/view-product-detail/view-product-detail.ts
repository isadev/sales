import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Product } from '../../../entities/Product';

@IonicPage()
@Component({
  selector: 'page-view-product-detail',
  templateUrl: 'view-product-detail.html',
})
export class ViewProductDetailPage {

  product_detail: Product;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.product_detail = this.navParams.get('product_detail');
  }

  ionViewDidLoad() {

  }

}

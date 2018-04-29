import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { getRepository } from 'typeorm';
import { SharedMethodProvider } from '../shared-method/shared-method';
import { Product } from '../../entities/Product';

@Injectable()
export class ProductCrudProvider {

  constructor(public sharedMethod: SharedMethodProvider) {
  }

  /**
   * Busqueda de precio vigente por product_id
   * @param product_id integer id de un producto en especifico
   */
  async getPriceOfProduct(product_id:any) {
    const product_repo = getRepository(Product);
    let client: any;
    client = await this.sharedMethod.getClient();

    let products;

    products = await product_repo.createQueryBuilder('p')
      .leftJoinAndSelect("p.prices", "prices")
      .leftJoinAndSelect("p.client", "client")
      .where("client.id = :client_id", { client_id: client.client_obj.id })
      .andWhere("p.id = :product_id", { product_id: product_id })
      .getOne();

    let today = moment().unix() ;

    let prices = products.prices;
    let length = prices.length;
    let cont = true;

    // iteramos por el listado de precios por producto
    for (let i = 0; ((i < length) && (cont)); i++) {
      //Buscamos si existe un precio que este vigente para hoy
      if ((today >= prices[i].start_date) && (today <= prices[i].end_date)) {
        products.actual_price = prices[i];
        cont = false;
      }
    }
    return products;
  }
}

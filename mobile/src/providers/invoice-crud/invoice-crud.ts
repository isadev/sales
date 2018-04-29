import { HttpClient } from '@angular/common/http';
import { Injectable, Inject } from '@angular/core';
import * as moment from 'moment';
import { TranslateService } from '@ngx-translate/core';
import { getRepository } from 'typeorm';
import { SharedMethodProvider } from '../shared-method/shared-method';
import { ProductCrudProvider } from '../product-crud/product-crud';
import { Invoice } from '../../entities/Invoice';
import { City } from '../../entities/City';
import { Customer } from '../../entities/Customer';
import { PaymentMethod } from '../../entities/PaymentMethod';
import { InvoiceProduct } from '../../entities/InvoiceProduct';
import { v4 as uuid } from 'uuid';
import { CheckConectionProvider } from '../check-conection/check-conection';
import { APP_CONFIG, Configuration } from '../../app/app.config';
import { RestApiProvider } from '../rest-api/rest-api';
import { SyncStatus } from '../../entities/SyncStatus';

@Injectable()
export class InvoiceCrudProvider {

  max_result: number = 100;
  locale: string;
  private appConfig: Configuration;

  constructor(
    public translateService: TranslateService,
    public productCrud: ProductCrudProvider,
    public sharedMethod: SharedMethodProvider,
    public http: HttpClient,
    public checkConection: CheckConectionProvider,
    @Inject(APP_CONFIG) config: Configuration,
    public restApi: RestApiProvider
  ) {
    this.locale = this.translateService.getDefaultLang();
    moment.locale(this.locale);

    this.appConfig = config;
  }

  /**
   * Funcion encargada de crear un nuevo invoice
   * 
   * @param data string objeto enviado desde el formulario de view-create-purchase
   * @param is_new bool booleano que indica si estamos editando o estamos creando un invoice nuevo
   * @param add_list_product bool que indica si estamos agregando un listado de productos al invoice
   * @param old_invoice object de tipo invoice que indica el invoice a actualizar
   * @param from_itinerary object de tipo itinerary que indica a que itinerario pertenecera dicho invoice
   * @param item_product_list_added array de objetos de tipo product que indica los productos a agregar
   
   */
  async saveInvoice(data: Array<any>, is_new: boolean, add_list_product: boolean = false, old_invoice: any = null, from_itinerary: any = null, item_product_list_added: any = null) {
    let client: any;
    client = await this.sharedMethod.getClient();
    let user = await this.sharedMethod.getUser();

    // Si existe un cliente logeado
    if (client.found) {
      const invoice_repo = getRepository(Invoice);
      const city_repo = getRepository(City);
      const customer_repo = getRepository(Customer);
      const payment_repo = getRepository(PaymentMethod);
      const invoice_product_repo = getRepository(InvoiceProduct);
      let exist_conection: boolean = this.checkConection.isConected();
      let sync_repo = getRepository(SyncStatus);
      let ok: boolean;

      let city = await city_repo.createQueryBuilder('c')
        .where('lower(c.name) = :name', { name: data['purchase_order_city'].toLowerCase() })
        .getOne();

      let payment_method = await payment_repo.createQueryBuilder('p')
        .where('lower(p.name) = :name', { name: data['purchase_order_payment_method'].toLowerCase() })
        .getOne();

      let customer = await customer_repo.createQueryBuilder('c')
        .leftJoinAndSelect("c.client", "client")
        .where('client.id = :id', { id: client.client_obj.id })
        .getOne();

      let timestamp_order_date = moment(data['purchase_order_order_date_time']).utc().unix() * 1000;
      let timestamp_order_delivery = moment(data['purchase_order_delivery_date_time']).utc().unix() * 1000;
      let now = moment().utc().unix() * 1000;
      if (is_new) {
        let sync_status_ = await sync_repo.findOne({ id: 1 });
        let invoice = new Invoice();

        invoice.id = uuid();
        invoice.city = city;
        invoice.client = client.client_obj;
        invoice.code = data['purchase_order_code'];
        invoice.delivery_address = data['purchase_order_delivery_address'];
        invoice.delivery_date_time = timestamp_order_delivery;
        invoice.order_date_time = timestamp_order_date;
        invoice.discount = data['purchase_order_discount'];
        invoice.payment_method = payment_method;
        invoice.itinerary = from_itinerary;
        invoice.customer = customer;
        invoice.user_created = user.user_obj.id;
        invoice.user_updated = user.user_obj.id;
        invoice.date_created = now;
        invoice.date_updated = now;
        invoice.sync_status = sync_status_;

        if (exist_conection) {
          try {
            this.restApi.modifyHeaders();
            ok = await this.restApi.sendDataToServer('invoice', invoice, 'create');
            if (ok)
              await invoice_repo.save(invoice);
          } catch (error) {
            await invoice_repo.save(invoice);
          }
        }
        else {
          await invoice_repo.save(invoice);
        }

        //Si se quiere agregar un listado de productos a la orden
        if (add_list_product) {
          let product_length = item_product_list_added.length;

          for (let i = 0; i < product_length; i++) {
            let invoice_product = new InvoiceProduct();

            let product_with_price;
            if (typeof item_product_list_added[i].actual_price == 'undefined') {
              product_with_price = await this.productCrud.getPriceOfProduct(item_product_list_added[i].id);
            }
            else {
              product_with_price = item_product_list_added[i];
            }

            invoice_product.invoices = invoice;
            invoice_product.product = item_product_list_added[i];
            invoice_product.discount = item_product_list_added[i].formulary_input_discount;
            invoice_product.order_price = product_with_price.actual_price.value;
            invoice_product.quantity = item_product_list_added[i].formulary_input_quantity;
            invoice_product.user_created = user.user_obj.id;
            invoice_product.user_updated = user.user_obj.id;
            invoice_product.date_created = now;
            invoice_product.date_updated = now;
            invoice_product.sync_status = sync_status_;

            if (exist_conection) {
              try {
                this.restApi.modifyHeaders();
                ok = await this.restApi.sendDataToServer('invoice_product', invoice_product, 'create');
                if (ok)
                  await invoice_product_repo.save(invoice_product);
              } catch (error) {
                await invoice_product_repo.save(invoice_product);
              }
            }
            else {
              await invoice_product_repo.save(invoice_product);
            }

            invoice_product = null;
          }
        }
      }
      else {
        let sync_status_ = await sync_repo.findOne({ id: 2 });
        //Si se quiere agregar un listado nuevo de productos a la orden
        let product_length = item_product_list_added.length;
        let list_updated_invoice_product = [];
        for (let i = 0; i < product_length; i++) {
          //Buscamos un invoice_product con el old_invoice y los products 
          let invoice_product_previous = await invoice_product_repo.createQueryBuilder('ivp')
            .leftJoinAndSelect("ivp.invoices", "invoice")
            .leftJoinAndSelect("ivp.product", "product")
            .where("invoice.id = :invoice_id", { invoice_id: old_invoice.id })
            .andWhere("product.id = :product_id", { product_id: item_product_list_added[i].id })
            .getOne();

          // Buscamos el mejor precio para dicho producto
          let product_with_price;
          if (typeof item_product_list_added[i].actual_price == 'undefined') {
            product_with_price = await this.productCrud.getPriceOfProduct(item_product_list_added[i].id);
          }
          else {
            product_with_price = item_product_list_added[i];
          }

          // Si existe un producto al que realizarle las modificaciones
          if (typeof invoice_product_previous != 'undefined') {
            invoice_product_previous.discount = item_product_list_added[i].formulary_input_discount;
            invoice_product_previous.order_price = product_with_price.actual_price.value;
            invoice_product_previous.quantity = item_product_list_added[i].formulary_input_quantity;
            invoice_product_previous.user_updated = user.user_obj.id;
            invoice_product_previous.date_updated = now;
            invoice_product_previous.sync_status = sync_status_;

            if (exist_conection) {
              try {
                this.restApi.modifyHeaders();
                ok = await this.restApi.sendDataToServer('invoice_product', invoice_product_previous, 'update');
                if (ok)
                  await invoice_product_repo.save(invoice_product_previous);
              } catch (error) {
                await invoice_product_repo.save(invoice_product_previous);
              }
            }
            else {
              await invoice_product_repo.save(invoice_product_previous);
            }
            list_updated_invoice_product.push(invoice_product_previous);
          }
          // Sino deberia llegar entonces un listado de productos nuevos para crearlos
          else if (add_list_product) {
            let sync_status_ = await sync_repo.findOne({ id: 1 });
            let invoice_product = new InvoiceProduct();
            invoice_product.invoices = old_invoice;
            invoice_product.product = item_product_list_added[i];
            invoice_product.discount = item_product_list_added[i].formulary_input_discount;
            invoice_product.order_price = item_product_list_added[i].actual_price.value;
            invoice_product.quantity = item_product_list_added[i].formulary_input_quantity;
            invoice_product.user_created = user.user_obj.id;
            invoice_product.user_updated = user.user_obj.id;
            invoice_product.date_created = now;
            invoice_product.date_updated = now;
            invoice_product.sync_status = sync_status_;

            if (exist_conection) {
              try {
                this.restApi.modifyHeaders();
                ok = await this.restApi.sendDataToServer('invoice_product', invoice_product, 'create');
                if (ok)
                  await invoice_product_repo.save(invoice_product);
              }
              catch (error) {
                await invoice_product_repo.save(invoice_product);
              }
            }
            else {
              await invoice_product_repo.save(invoice_product);
            }

            list_updated_invoice_product.push(invoice_product);

            invoice_product = null;
          }
        } // cierre del for (let i = 0; i < product_length; i++)
        sync_status_ = await sync_repo.findOne({ id: 2 });
        old_invoice.city = city;
        old_invoice.code = data['purchase_order_code'];
        old_invoice.delivery_address = data['purchase_order_delivery_address'];
        old_invoice.delivery_date_time = timestamp_order_delivery;
        old_invoice.order_date_time = timestamp_order_date;
        old_invoice.discount = data['purchase_order_discount'];
        old_invoice.payment_method = payment_method;
        old_invoice.user_updated = user.user_obj.id;
        old_invoice.date_updated = now;
        old_invoice.sync_status = sync_status_;

        //Se actualizan las referencias al objeto invoice_producto para evitar que el invoice borre las que no se especifican
        if (list_updated_invoice_product.length > 0)
          old_invoice.invoice_product = list_updated_invoice_product;

        if (exist_conection) {
          try {
            this.restApi.modifyHeaders();
            ok = await this.restApi.sendDataToServer('invoice', old_invoice, 'update');
            if (ok)
              await invoice_repo.save(old_invoice);
          } catch (error) {
            await invoice_repo.save(old_invoice);
          }
        }
        else {
          await invoice_repo.save(old_invoice);
        }
      }
    }
  }

  /**
   * Funcion encargada de listar toda las ordenes de compras existentes para el usuario logeado
   * 
   */
  async getInvoiceListAsync(page: any = 0, from_search: string = "") {
    let client: any;
    client = await this.sharedMethod.getClient();
    moment.locale(this.locale);

    // Si el cliente existe se procede a guardar/editar/listar los datos
    if (client.found) {
      const invoice_repo = getRepository(Invoice);
      this.restApi.modifyHeaders();
      await this.restApi.getMasterListFromServer('invoice');

      let total_invoices;
      let invoices;
      let query_builder_custom = invoice_repo.createQueryBuilder('iv')
        .leftJoinAndSelect("iv.client", "client")
        .leftJoinAndSelect("iv.city", "city")
        .leftJoinAndSelect("iv.payment_method", "payment_method")
        .leftJoinAndSelect("iv.invoice_product", "invoice_product")
        .leftJoinAndSelect("iv.customer", "customer")
        .leftJoinAndSelect('iv.sync_status', 'sync_status')
        .where('sync_status.id != 3')
        .andWhere('client.id = :client_id', { client_id: client.client_obj.id })

      total_invoices = await query_builder_custom
        .getManyAndCount();

      if (from_search.length == 0) {
        invoices = await query_builder_custom
          .skip(this.max_result * page) // se multiplica y se lleva el control desde el metodo que lo llama
          //para mantener tantas paginas lleva saltanto
          .take(this.max_result)
          .getMany();
      }
      else {
        from_search = from_search.toLowerCase();
        invoices = await query_builder_custom
          .andWhere("lower(iv.code) like '%" + from_search + "%' ")
          .getMany();
      }

      invoices.forEach(invoice_element => {
        invoice_element.order_date_format = moment.utc(invoice_element.order_date_time).local().format('LL');
        invoice_element.delivery_date_format = moment.utc(invoice_element.delivery_date_time).local().format('LL');
      });
      return { invoices: invoices, invoice_total_items: total_invoices[1] };
    }
  }

  /**
   * Funcion encargada de armar el objeto de tipo invoice para la vista del detalle de invoice
   * 
   * @param invoice objeto de tipo invoice
   */
  async buildInvoiceObjectByInvoice(invoice: any) {
    const invoice_repo = getRepository(Invoice);
    let invoice_element: any;
    moment.locale(this.locale);

    if (invoice != undefined) {
      invoice_element = await invoice_repo.createQueryBuilder('iv')
        .leftJoinAndSelect("iv.client", "client")
        .leftJoinAndSelect("iv.city", "city")
        .leftJoinAndSelect("iv.payment_method", "payment_method")
        .leftJoinAndSelect("iv.itinerary", "itinerary")
        .leftJoinAndSelect("iv.customer", "customer")
        .leftJoinAndSelect("iv.invoice_product", "invoice_product")
        .leftJoinAndSelect("invoice_product.invoices", "invoices")
        .leftJoinAndSelect("invoice_product.product", "product")
        .where("iv.id = :id", { id: invoice.id })
        .getOne();
      invoice_element.order_date_format = moment.utc(invoice_element.order_date_time).local().format('LL');
      invoice_element.delivery_date_format = moment.utc(invoice_element.delivery_date_time).local().format('LL');
    }
    return invoice_element;
  }

  /**
   * Funcion para encontrar todos los objetos de tipo invoice en la relacion invoice_product
   * 
   * @param invoice objeto de tipo invoice_product
   */
  async getInvoiceProductByInvoiceAsync(invoice: any) {
    const invoice_product_repo = getRepository(InvoiceProduct);
    let invoice_product_list;

    invoice_product_list = await invoice_product_repo.createQueryBuilder('ip')
      .leftJoinAndSelect("ip.invoices", "invoice")
      .leftJoinAndSelect("ip.product", "product")
      .leftJoinAndSelect('ip.sync_status', 'sync_status')
      .where('sync_status.id != 3')
      .andWhere("invoice.id = :invoice_id", { invoice_id: invoice.id })
      .getMany();

    return invoice_product_list;
  }

  /**
   * Funcion encargada de eliminar el invoice dado
   * 
   * @param invoice object de tipo invoice
   */
  async deleteInvoice(invoice: any) {
    let invoice_repo = getRepository(Invoice);
    let sync_repo = getRepository(SyncStatus);
    let exist_conection: boolean = this.checkConection.isConected();
    let now = moment().utc().unix() * 1000;
    let sync_status_ = await sync_repo.findOne({ id: 3 });

    invoice.sync_status = sync_status_;
    invoice.date_updated = now;

    if (exist_conection) {
      try {
        let ok: boolean = await this.restApi.sendDataToServer('invoice', invoice, 'delete', false);
        if (ok)
          await invoice_repo.save(invoice);
      }
      catch (error) {
        throw " error during delete process of table: invoice";
      }
    }
    throw " error during delete process of table: invoice";
  }

  /**
   * Funcion encargada de eliminar el invoice_product dado
   * 
   * @param invoice_product object de tipo invoice_product
   */
  async deleteInvoiceProduct(invoice_product: any) {
    let invoice_product_repo = getRepository(InvoiceProduct);
    let sync_repo = getRepository(SyncStatus);
    let exist_conection: boolean = this.checkConection.isConected();
    let now = moment().utc().unix() * 1000;
    let sync_status_ = await sync_repo.findOne({ id: 3 });

    invoice_product.sync_status = sync_status_;
    invoice_product.date_updated = now;

    if (exist_conection) {
      try {
        this.restApi.modifyHeaders();
        let ok: boolean = await this.restApi.sendDataToServer('invoice_product', invoice_product, 'delete', false);
        if (ok) {
          await invoice_product_repo.manager.save(invoice_product);
        }
      } catch (error) {
        throw " error during delete process of table: invoice_product"
      }
    }
    throw " error during delete process of table: invoice_product";
  }

  /**
   * Funcion encargada de devolver el ultimo invoice con sus productos creados
   */
  async getLastInvoiceCreated() {
    const invoice_repo = getRepository(Invoice);
    let invoice;

    invoice = await invoice_repo.createQueryBuilder('i')
      .leftJoinAndSelect("i.invoice_product", "invoice_product")
      .leftJoinAndSelect('i.payment_method', "payment_method")
      .leftJoinAndSelect('i.customer', 'customer')
      .leftJoinAndSelect('i.city', 'city')
      .leftJoinAndSelect("invoice_product.product", "product")
      .leftJoinAndSelect("invoice_product.invoices", "invoices")
      .leftJoinAndSelect('i.sync_status', 'sync_status')
      .where('sync_status.id != 3')
      .orderBy('i.id', 'DESC')
      .getOne();

    return invoice;
  }
}

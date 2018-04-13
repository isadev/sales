import { HttpClient } from '@angular/common/http';
import { Injectable, Inject } from '@angular/core';
import * as moment from 'moment';
import { TranslateService } from '@ngx-translate/core';
import { getRepository } from 'typeorm';
import { CustomerContact } from '../../entities/CustomerContact';
import { Customer } from '../../entities/Customer';
import { City } from '../../entities/City';
import { SharedMethodProvider } from '../shared-method/shared-method';
import { SynchronousForegroundProvider } from '../synchronous-foreground/synchronous-foreground';
import { v4 as uuid } from 'uuid';
import { CheckConectionProvider } from '../check-conection/check-conection';
import { APP_CONFIG, Configuration } from '../../app/app.config';
import { RestApiProvider } from '../rest-api/rest-api';
import { CustomerAssign } from '../../entities/CustomerAssign';
import { SyncStatus } from '../../entities/SyncStatus';

@Injectable()
export class CustomerCrudProvider {

  max_result: number = 100;
  locale: string;
  private appConfig: Configuration;

  constructor(
    public syncFore: SynchronousForegroundProvider,
    public sharedMethod: SharedMethodProvider,
    public translateService: TranslateService,
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
   * Funcion para eliminar el customer contact seleccionado
   * 
   * @param customer_contact object de tipo customer contact
   */
  async deleteCustomerContact(customer_contact: any) {
    let exist_conection: boolean = this.checkConection.isConected();
    let customer_contact_repo: any = getRepository(CustomerContact);
    let sync_repo = getRepository(SyncStatus);

    let now = moment().utc().unix() * 1000;
    let sync_status_ = await sync_repo.findOne({ id: 3 });

    customer_contact.sync_status = sync_status_;
    customer_contact.date_updated = now;

    if (exist_conection) {
      try {
        this.restApi.modifyHeaders();
        let ok: boolean = await this.restApi.sendDataToServer('customer_contact', customer_contact, 'delete', false);
        if (ok)
          await customer_contact_repo.save(customer_contact);
      }
      catch (error) {
        throw " error during delete process of table: customer_contact";
      }
    }
    throw " error during delete process of table: customer_contact";
  }

  /**
   * Funcion para eliminar el customer seleccionado
   * 
   * @param customer_contact object de tipo customer
   */
  async deleteCustomer(customer: any) {
    let exist_conection: boolean = this.checkConection.isConected();
    let customer_repo: any = getRepository(Customer);

    let sync_repo = getRepository(SyncStatus);

    let now = moment().utc().unix() * 1000;
    let sync_status_ = await sync_repo.findOne({ id: 3 });
    customer.sync_status = sync_status_;
    customer.date_updated = now;

    if (exist_conection) {
      try {
        this.restApi.modifyHeaders();
        let ok: boolean = await this.restApi.sendDataToServer('customer', customer, 'delete', false);
        if (ok)
          await customer_repo.save(customer);
      }
      catch (error) {
        throw " error during delete process of table: customer";
      }
    }
    throw " error during delete process of table: customer";
  }

  /**
   * Funcion encargada de obtener los contactos de un customer dado
   * 
   * @param customer_id Customer objeto con el customer a buscarle los contactos
   * @param page numero de la pagina a buscar dentro de la bd
   */
  async getCustomerContactListAsync(customer_id: any, page: any, from_search: string) {

    const customer_contact_repo = getRepository(CustomerContact);
    let customer_contact_list;

    this.restApi.modifyHeaders();
    await this.restApi.getMasterListFromServer('customer_contact');

    // Si el customer_id es igual a null eso significa que se esta creando un nuevo customer 
    // y no tiene asociado ningun contacto, por lo que se devuelve la lista completa de contactos
    if (customer_id) {
      // Para el listado de los contacto dado un customer
      customer_contact_list = await customer_contact_repo.createQueryBuilder("cc")
        .leftJoinAndSelect("cc.customer", 'customer')
        .leftJoinAndSelect("customer.city", "city")
        .leftJoinAndSelect('cc.sync_status', 'sync_status')
        .where('sync_status.id != 3')
        .andWhere('customer.id = :customer_id', { customer_id: customer_id })
        .getManyAndCount();
      return { customer_contacts: customer_contact_list[0], total_items: customer_contact_list[1] };
    }
    else {
      let total_customer_contact_list = await customer_contact_repo.createQueryBuilder("cc")
        .leftJoinAndSelect("cc.customer", 'customer')
        .leftJoinAndSelect("customer.city", "city")
        .leftJoinAndSelect('cc.sync_status', 'sync_status')
        .where('sync_status.id != 3')
        .getManyAndCount();

      if (from_search.length == 0) {
        customer_contact_list = await customer_contact_repo.createQueryBuilder("cc")
          .leftJoinAndSelect('cc.sync_status', 'sync_status')
          .where('sync_status.id != 3')
          .skip(this.max_result * page) // se multiplica y se lleva el control desde el metodo que lo llama
          //para mantener tantas paginas lleva saltanto
          .take(this.max_result)
          .getMany();
      }
      else {
        from_search = from_search.toLowerCase();
        customer_contact_list = await customer_contact_repo.createQueryBuilder("cc")
          .leftJoinAndSelect('cc.sync_status', 'sync_status')
          .where('sync_status.id != 3')
          .andWhere("lower(cc.first_name) like '%" + from_search + "%' "
          + "or lower(cc.last_name) like '%" + from_search + "%' "
          + "or lower(cc.email) like '%" + from_search + "%' ")
          .getMany();
      }
      return { customer_contacts: customer_contact_list, total_items: total_customer_contact_list[1] };
    }

  }

  /**
   * Funcion encargada de devolver el listado de customer con sus contactos o devolver el listado de customers_contacts
   * 
   * @param customer_id integer customer_id para buscar la informacion referente a sus contactos
   */
  async getContactListOfCustomerAsync(customer_id: any) {
    const customer_repo = getRepository(Customer);
    const customer_contact_repo = getRepository(CustomerContact);
    let customer_list: any;
    let customer_contact_list: Array<any>;
    let client: any;

    client = this.sharedMethod.getClient();

    // Si el customer_id es igual a null eso significa que se esta creando un nuevo customer 
    // y no tiene asociado ningun contacto, por lo que se devuelve la lista completa de contactos
    if (customer_id) {
      customer_list = await customer_repo.createQueryBuilder("c")
        .leftJoinAndSelect("c.customer_contacts", 'contacts')
        .leftJoinAndSelect("c.city", "city")
        .leftJoinAndSelect("c.client", "client")
        .leftJoinAndSelect('c.sync_status', 'sync_status')
        .where('sync_status.id != 3')
        .andWhere('client.id = :client_id', { client_id: client.client_obj.id })
        .andWhere('c.id = :customer_id', { customer_id: customer_id })
        .getOne();
      return customer_list;
    }
    else {
      customer_contact_list = await customer_contact_repo.createQueryBuilder("cc")
        .leftJoinAndSelect('cc.sync_status', 'sync_status')
        .leftJoinAndSelect('cc.sync_status', 'sync_status')
        .where('sync_status.id != 3')
        .andWhere('sync_status.id != 3')
        .getMany();
      return customer_contact_list;
    }
  }

  /**
   * Funcion encargada de guardar en la base de datos un nuevo/actualizar objeto customer_contact
   * 
   * @param data objeto de tipo formulario proveniente de la clase view-customer-create
   * @param is_new bool indica si es un objeto nuevo o una edicion de objeto customer
   * @param old_customer_contact_id object indica el anterior customer, o customer_contact si se esta accediendo para editar
   */
  async saveCustomerContactAsync(data: Array<any>, is_new: boolean, old_customer_contact_id: any) {
    const customer_contact_repo = getRepository(CustomerContact);
    const customer_repo = getRepository(Customer);
    let exist_conection: boolean = this.checkConection.isConected();
    let ok: boolean;
    let sync_repo = getRepository(SyncStatus);

    let customer = await customer_repo.createQueryBuilder('c')
      .where('c.id = :id', { id: old_customer_contact_id })
      .getOne();

    let customer_cont = await customer_contact_repo.createQueryBuilder('cc')
      .leftJoinAndSelect("cc.customer", "customer")
      .where('cc.id = :id', { id: old_customer_contact_id })
      .getOne();

    if (customer == null)
      customer = customer_cont.customer;

    let now = moment().utc().unix() * 1000;
    let user = await this.sharedMethod.getUser();
    // Si es nuevo estamos creando un nuevo customer contact a partir de un customer
    if (is_new) {
      let sync_status_ = await sync_repo.findOne({ id: 1 });
      let customer_contact = new CustomerContact();

      customer_contact.customer = null;
      customer_contact.itineraries = null;

      customer_contact.id = uuid();
      customer_contact.first_name = data['customer_contact_first_name'];
      customer_contact.last_name = data['customer_contact_last_name'];
      customer_contact.email = data['customer_contact_email'];
      customer_contact.phone = data['customer_contact_phone'];
      customer_contact.mobile = data['customer_contact_mobile'];
      customer_contact.job_title = data['customer_contact_job'];
      customer_contact.customer = customer;
      customer_contact.user_created = user.user_obj.id;
      customer_contact.user_updated = user.user_obj.id;
      customer_contact.date_created = now;
      customer_contact.date_updated = now;
      customer_contact.sync_status = sync_status_;

      if (exist_conection) {
        try {
          this.restApi.modifyHeaders();
          ok = await this.restApi.sendDataToServer('customer_contact', customer_contact, 'create');
          if (ok) {
            await customer_contact_repo.save(customer_contact);
          }
        } catch (error) {
          await customer_contact_repo.save(customer_contact);
        }
      }
      else {
        await customer_contact_repo.save(customer_contact);
      }


      return customer_contact;
    }
    //Si no es nuevo estamos hablando de un customer contact que esta siendo editado
    else {
      let old_customer_contact = await customer_contact_repo.createQueryBuilder('cc')
        .where("cc.id = :id", { id: old_customer_contact_id })
        .leftJoinAndSelect("cc.customer", "customer")
        .getOne();
      let sync_status_ = await sync_repo.findOne({ id: 2 });

      old_customer_contact.first_name = data['customer_contact_first_name'];
      old_customer_contact.last_name = data['customer_contact_last_name'];
      old_customer_contact.email = data['customer_contact_email'];
      old_customer_contact.phone = data['customer_contact_phone'];
      old_customer_contact.mobile = data['customer_contact_mobile'];
      old_customer_contact.job_title = data['customer_contact_job'];
      old_customer_contact.user_updated = user.user_obj.id;
      old_customer_contact.date_updated = now;
      old_customer_contact.sync_status = sync_status_;

      if (exist_conection) {
        try {
          this.restApi.modifyHeaders();
          ok = await this.restApi.sendDataToServer('customer_contact', old_customer_contact, 'update');
          if (ok)
            await customer_contact_repo.save(old_customer_contact);
        } catch (error) {
          await customer_contact_repo.save(old_customer_contact);
        }
      }
      else {
        await customer_contact_repo.save(old_customer_contact);
      }
      return old_customer_contact;
    }
  }

  /**
   * Funcion encargada de guardar en la base de datos un nuevo/actualizar objeto customer
   * 
   * @param data objeto de tipo formulario proveniente de la clase view-customer-create
   * @param is_new bool indica si es un objeto nuevo o una edicion de objeto customer
   * @param old_customer object indica el anterior customer si se esta accediendo para editar
   * @param from_add_contact bool indica si esta asociando un customer_contact existente
   * @param contact_list array indica un array de objetos customer_contact seleccionados
   */
  async saveCustomerAsync(data: Array<any>, is_new: boolean, old_customer: any, from_add_contact: boolean, contact_list: Array<any>) {
    let customer_repo = getRepository(Customer);
    let customer_contact_repo = getRepository(CustomerContact);
    const sync_status_repo = getRepository(SyncStatus);


    const city_repo = getRepository(City);
    let now = moment().utc().unix() * 1000;
    let user = await this.sharedMethod.getUser();
    let client = await this.sharedMethod.getClient();
    let exist_conection: boolean = this.checkConection.isConected();
    let ok: boolean;

    if (is_new) {
      let sync_status_ = await sync_status_repo.findOne({ id: 1 });
      let customer_new = new Customer();

      let city = await city_repo.createQueryBuilder('c')
        .leftJoinAndSelect("c.customers", "customers")
        .where('lower(c.name) = :name', { name: data['customer_city_name'].toLowerCase() })
        .getOne();

      customer_new.id = uuid();
      customer_new.name = data['customer_name'];
      customer_new.city = city;
      customer_new.nit = data['customer_nit'];
      customer_new.phone = data['customer_phone'];
      customer_new.address = data['customer_address'];
      customer_new.postal_code = data['customer_postal_code'];

      let geolocation = await this.syncFore.getLatestGeolocation();
      customer_new.geolocation = geolocation;
      customer_new.user_created = user.user_obj.id;
      customer_new.user_updated = user.user_obj.id;
      customer_new.date_created = now;
      customer_new.date_updated = now;
      customer_new.client = client.client_obj;
      customer_new.sync_status = sync_status_;

      if (exist_conection) {
        try {
          this.restApi.modifyHeaders();
          ok = await this.restApi.sendDataToServer('customer', customer_new, 'create');
          if (ok)
            await customer_repo.save(customer_new);
        } catch (error) {
          await customer_repo.save(customer_new);
        }
      }
      else {
        await customer_repo.save(customer_new);
      }

      //Si viene de la seleccion del listado de usuario 
      if (from_add_contact) {
        customer_new.customer_contacts = contact_list;

        //        await customer_repo.save(customer_new);
        let sync_status_ = await sync_status_repo.findOne({ id: 2 });
        for (let ii = 0; ii < contact_list.length; ii++) {
          contact_list[ii] = customer_new;
          contact_list[ii].sync_status = sync_status_;
          if (exist_conection) {
            try {
              this.restApi.modifyHeaders();
              ok = await this.restApi.sendDataToServer('customer_contact', contact_list[ii], 'update');
              if (ok)
                await customer_contact_repo.save(contact_list[ii]);
            } catch (error) {
              await customer_contact_repo.save(contact_list[ii]);
            }
          }
          else {
            await customer_contact_repo.save(contact_list[ii]);
          }
        }
      }
    }
    else {
      let sync_status_ = await sync_status_repo.findOne({ id: 2 });
      let customer = await customer_repo.createQueryBuilder("cc")
        .leftJoinAndSelect("cc.customer_contacts", "customer_contact")
        .leftJoinAndSelect("cc.city", "city")
        .where("cc.id = :id", { id: old_customer.id })
        .getOne();

      let city = await city_repo.createQueryBuilder('c')
        .leftJoinAndSelect("c.customers", "customers")
        .where('lower(c.name) = :name', { name: data['customer_city_name'].toLowerCase() })
        .getOne();

      customer.city = city;

      if ((data['customer_name']) && (old_customer.name != data['customer_name']))
        customer.name = data['customer_name'];
      if ((data['customer_phone']) && (old_customer.name != data['customer_phone']))
        customer.phone = data['customer_phone'];
      if ((data['customer_address']) && (old_customer.name != data['customer_address']))
        customer.address = data['customer_address'];
      if ((data['customer_postal_code']) && (old_customer.name != data['customer_postal_code']))
        customer.postal_code = data['customer_postal_code'];

      customer.nit = data['customer_nit'];
      customer.geolocation = await this.syncFore.getLatestGeolocation();
      customer.user_updated = user.user_obj.id;
      customer.date_updated = now;
      customer.sync_status = sync_status_;

      if (exist_conection) {
        try {
          this.restApi.modifyHeaders();
          ok = await this.restApi.sendDataToServer('customer', customer, 'update');
          if (ok)
            await customer_repo.save(customer);
        } catch (error) {
          await customer_repo.save(customer);
        }
      }
      else {
        await customer_repo.save(customer);
      }

      //Si viene de la seleccion del listado de usuario y no creo uno nuevo
      if (from_add_contact) {
        customer.customer_contacts = contact_list;

        //await customer_repo.save(customer);

        for (let ii = 0; ii < contact_list.length; ii++) {
          contact_list[ii].sync_status = sync_status_;
          contact_list[ii].customer = customer;
          if (exist_conection) {
            try {
              this.restApi.modifyHeaders();
              ok = await this.restApi.sendDataToServer('customer_contact', contact_list[ii], 'update');
              if (ok)
                await customer_contact_repo.save(contact_list[ii]);
            } catch (error) {
              await customer_contact_repo.save(contact_list[ii]);
            }
          }
          else {
            await customer_contact_repo.save(contact_list[ii]);
          }
        }
      }
    }
  }

  /**
   * Funcion encargada de listar los customer existentes asociado a un client
   * 
   * @param page integer con el numero de la pagina que se desea buscar
   * @param from_search string con la palabra a buscar
   */
  async getCustomerListAsync(page: any = 0, from_search: string) {
    const customer_repo = getRepository(Customer);
    let client: any;

    client = await this.sharedMethod.getClient();

    // Si el cliente existe se procede a guardar/editar/listar los datos
    if (client.found) {
      let customer_list;
      this.restApi.modifyHeaders();
      await this.restApi.getMasterListFromServer('customer');

      let query_builder_custom = customer_repo.createQueryBuilder("c")
        .leftJoinAndSelect("c.customer_contacts", "customer_contact")
        .leftJoinAndSelect("c.city", "city")
        .leftJoinAndSelect("c.client", "client")
        .leftJoinAndSelect('c.sync_status', 'sync_status')
        .where('sync_status.id != 3')
        .andWhere('client.id = :client_id', { client_id: client.client_obj.id });

      let total_customer_list = await query_builder_custom
        .getManyAndCount();

      if (from_search.length == 0) {
        customer_list = await query_builder_custom
          .skip(this.max_result * page) // se multiplica y se lleva el control desde el metodo que lo llama
          //para mantener tantas paginas lleva saltanto
          .take(this.max_result)
          .getMany();
      }
      else {
        customer_list = await query_builder_custom
          .andWhere("lower(c.name) like '%" + from_search.toLowerCase() + "%' ")
          .getMany();
      }
      return { customers: customer_list, total_items: total_customer_list[1] };
    }
    else {
      return { customers: [], total_items: 0 };
    }
  }

  /**
   * Funcion encargada de devolver los customer contacts existentes
   * 
   * @param customer_contact_id integer con el customer_contact solicitado
   */
  async getOldCustomerContactAsync(customer_contact_id: any) {
    const customer_contact_repo = getRepository(CustomerContact);

    let old_customer_contact = await customer_contact_repo.createQueryBuilder('cc')
      .leftJoinAndSelect('cc.sync_status', 'sync_status')
      .where('sync_status.id != 3')
      .andWhere("cc.id = :id", { id: customer_contact_id })
      .getOne();

    return old_customer_contact;
  }

  /**
   * Funcion encargada de obtener los datos del customer solicitado
   * 
   * @param customer object de tipo customer 
   */
  async getDataOfCustomer(customer: any) {
    let customer_repo = getRepository(Customer);

    let customer_updated = await customer_repo.createQueryBuilder('c')
      .leftJoinAndSelect("c.city", "city")
      .leftJoinAndSelect('c.client', 'client')
      .leftJoinAndSelect("c.customer_contacts", "customer_contact")
      .where("c.id = :id", { id: customer.id })
      .getOne();

    return customer_updated;
  }

  /**
   * Funcion de devolver el listado de nombres de customers existentes
   */
  async getOnlyCustomerList() {
    const customer_assign_repo = getRepository(CustomerAssign);
    let user: any;

    user = await this.sharedMethod.getUser();

    // status 0 = no asignado
    // status 1 = asignado
    let customer_in_assign_list = await customer_assign_repo.createQueryBuilder("ca")
      .leftJoinAndSelect('ca.customer', 'customer')
      .leftJoinAndSelect('ca.user', 'user')
      .leftJoinAndSelect('ca.sync_status', 'sync_status')
      .where('sync_status.id != 3')
      .andWhere('user.id = :user_id', { user_id: user.user_obj.id })
      .getMany();

    let only_customer = [];

    customer_in_assign_list.forEach(customer_assign => {
      only_customer.push(customer_assign.customer.name);
    });
    return only_customer;
  }

  /**
   * Funcion encargada de devolver el listado de nombers de los customer_contacts existentes o asociados a un customer
   * 
   * @param customer_company_name string con el nombre de la compañia que pertenece el customer
   */
  async getOnlyCustomerContactList(customer_company_name: any = null) {
    const customer_repo = getRepository(Customer);
    //Si estamos devolviendo los contactos asociados a un customer
    if (customer_company_name != null) {
      let only_contact_of_customer = [];

      let client: any;
      client = await this.sharedMethod.getClient();

      let customer = await customer_repo.createQueryBuilder("c")
        .leftJoinAndSelect("c.client", "client")
        .leftJoinAndSelect("c.customer_contacts", 'customer_contacts')
        .leftJoinAndSelect("c.city", "city")
        .leftJoinAndSelect('c.sync_status', 'sync_status')
        .where('sync_status.id != 3')
        .andWhere('client.id = :client_id', { client_id: client.client_obj.id })
        .andWhere("lower(c.name) = :customer_company_name", { customer_company_name: customer_company_name.toLowerCase() })
        .getOne();

      customer.customer_contacts.forEach(contact => {
        only_contact_of_customer.push(contact.email);
      });

      return only_contact_of_customer;
    }
    else {
      let only_customer = [];

      let client: any;
      client = await this.sharedMethod.getClient();

      let customer_list = await customer_repo.createQueryBuilder("c")
        .leftJoinAndSelect("c.client", "client")
        .leftJoinAndSelect("c.customer_contacts", 'customer_contact')
        .leftJoinAndSelect("c.city", "city")
        .leftJoinAndSelect('c.sync_status', 'sync_status')
        .where('sync_status.id != 3')
        .andWhere('client.id = :client_id', { client_id: client.client_obj.id })
        .getMany();

      customer_list.forEach(element => {
        only_customer.push(element.name);
      });
      return only_customer;
    }
  }
}

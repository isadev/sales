import { Injectable, Inject } from '@angular/core';
import * as moment from 'moment';
import { getRepository } from 'typeorm';
import { InvoiceProduct } from '../../entities/InvoiceProduct';
import { Invoice } from '../../entities/Invoice';
import { Itinerary } from '../../entities/Itinerary';
import { ProductCategory } from '../../entities/ProductCategory';
import { Price } from '../../entities/Price';
import { ItineraryType } from '../../entities/ItineraryType';
import { Country } from '../../entities/Country';
import { Province } from '../../entities/Province';
import { City } from '../../entities/City';
import { Questionnaire } from '../../entities/Questionnaire';
import { Questions } from '../../entities/Questions';
import { QuestionType } from '../../entities/QuestionType';
import { Client } from '../../entities/Client';
import { CustomerContact } from '../../entities/CustomerContact';
import { Customer } from '../../entities/Customer';
import { User } from '../../entities/User';
import { Status } from '../../entities/Status';
import { PaymentMethod } from '../../entities/PaymentMethod';
import { Product } from '../../entities/Product';
import { QuestionnaireType } from '../../entities/QuestionnaireType';
import { Role } from '../../entities/Role';
import { Workday } from '../../entities/Workday';
import { Answer } from '../../entities/Answer';
import { Expense } from '../../entities/Expense';
import { TranslateService } from '@ngx-translate/core';
import { Storage } from '@ionic/storage';
import { SyncStatus } from '../../entities/SyncStatus';
import { CustomerAssign } from '../../entities/CustomerAssign';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { File } from '@ionic-native/file';
import { Configuration, APP_CONFIG } from '../../app/app.config';

@Injectable()
export class DatabaseCreateProvider {
  private locale: string;
  private requestOptions: HttpHeaders;
  private appConfig: Configuration;
  constructor(
    public http: HttpClient,
    @Inject(APP_CONFIG) config: Configuration,
    public translateService: TranslateService,
    public storage: Storage,
    public file: File
  ) {
    this.locale = this.translateService.getDefaultLang();
    moment.locale(this.locale);
    this.appConfig = config;
  }

  async createDBStatic() {
    // const itinerary_repo = getRepository(Itinerary);
    // const itinerary_type_repo = getRepository(ItineraryType);
    // const country_repo = getRepository(Country);
    // const province_repo = getRepository(Province);
    // const city_repo = getRepository(City);
    // const questionnaire_repo = getRepository(Questionnaire);
    // const questions_repo = getRepository(Questions);
    // const question_type_repo = getRepository(QuestionType);
    // const client_repo = getRepository(Client);
    // const customer_contact_repo = getRepository(CustomerContact);
    // const customer_repo = getRepository(Customer);
    // const user_repo = getRepository(User);
    // const status_repo = getRepository(Status);
    // const payment_repo = getRepository(PaymentMethod);
    // const price_repo = getRepository(Price);
    // const product_repo = getRepository(Product);
    // const product_category_repo = getRepository(ProductCategory);
    // const invoice_repo = getRepository(Invoice);
    // const invoice_product_repo = getRepository(InvoiceProduct);
    // const questionnaire_type_repo = getRepository(QuestionnaireType);

    // let date = moment();
    // let timestamp: number = (+date * 1000);

    // let country1 = new Country;
    // country1.id = uuid();
    // country1.name = "Pais 1";
    // await country_repo.save(country1);

    // let province1 = new Province();
    // province1.id = "1";
    // province1.name = "Provincia 1";
    // province1.country = country1;
    // await province_repo.save(province1);

    // let province2 = new Province();
    // province2.id = "2";
    // province2.name = "Provincia 2";
    // province2.country = country1;
    // await province_repo.save(province2);

    // let city1 = new City();
    // city1.id = "1";
    // city1.name = "ciudad 1";
    // city1.province = province1;
    // await city_repo.save(city1);

    // let city2 = new City();
    // city2.id = "2";
    // city2.name = "ciudad 2";
    // city2.province = province1;
    // await city_repo.save(city2);

    // let city3 = new City();
    // city3.id = "3";
    // city3.name = "ciudad 3";
    // city3.province = province1;
    // await city_repo.save(city3);

    // let itinerary_type1 = new ItineraryType();
    // itinerary_type1.id = "1";
    // itinerary_type1.name = "presentation";
    // itinerary_type1.with_email_to_contact = "none1";
    // itinerary_type1.itineraries = null;
    // itinerary_type1.questionnaires = null;
    // await itinerary_type_repo.save(itinerary_type1);

    // let itinerary_type2 = new ItineraryType();
    // itinerary_type2.id = "2";
    // itinerary_type2.name = "query";
    // itinerary_type2.with_email_to_contact = "none2";
    // itinerary_type2.itineraries = null;
    // itinerary_type2.questionnaires = null;
    // await itinerary_type_repo.save(itinerary_type2);

    // let itinerary_type3 = new ItineraryType();
    // itinerary_type3.id = "3";
    // itinerary_type3.name = "courtesy";
    // itinerary_type3.with_email_to_contact = "none3";
    // itinerary_type3.itineraries = null;
    // itinerary_type3.questionnaires = null;
    // await itinerary_type_repo.save(itinerary_type3);

    // let itinerary_type4 = new ItineraryType();
    // itinerary_type4.id = "4";
    // itinerary_type4.name = "order";
    // itinerary_type4.with_email_to_contact = "none4";
    // itinerary_type4.itineraries = null;
    // itinerary_type4.questionnaires = null;
    // await itinerary_type_repo.save(itinerary_type4);

    // let question1 = new Questions();
    // question1.id = "1";
    // question1.label = "Pregunta 1";
    // question1.questionnaire = null;
    // await questions_repo.save(question1);

    // let question2 = new Questions();
    // question2.id = "2";
    // question2.label = "Pregunta 2";
    // question2.questionnaire = null;
    // await questions_repo.save(question2);

    // let question3 = new Questions();
    // question3.id = "3";
    // question3.label = "Pregunta 3";
    // question3.questionnaire = null;
    // await questions_repo.save(question3);

    // let questionnaire_type1 = new QuestionnaireType();
    // questionnaire_type1.id = "1";
    // questionnaire_type1.name = "checkin";
    // await questionnaire_type_repo.save(questionnaire_type1);

    // let questionnaire_type2 = new QuestionnaireType();
    // questionnaire_type2.id = "2";
    // questionnaire_type2.name = "checkout";
    // await questionnaire_type_repo.save(questionnaire_type2);

    // let questionnaire1 = new Questionnaire();
    // questionnaire1.id = "1";
    // questionnaire1.enable = true;
    // questionnaire1.itinerary_type = itinerary_type1;
    // questionnaire1.label = "questionario 1";
    // questionnaire1.questions = [question1, question2];
    // questionnaire1.questionnaire_type = questionnaire_type1;
    // await questionnaire_repo.save(questionnaire1);

    // let questionnaire2 = new Questionnaire();
    // questionnaire2.id = "2";
    // questionnaire2.enable = true;
    // questionnaire2.itinerary_type = itinerary_type1;
    // questionnaire2.label = "questionario 2";
    // questionnaire2.questions = [question3];
    // questionnaire2.questionnaire_type = questionnaire_type2;
    // await questionnaire_repo.save(questionnaire2);

    // /* let questionnaire3 = new Questionnaire();
    // questionnaire3.enable = true;
    // questionnaire3.itinerary_type = itinerary_type3;
    // questionnaire3.label = "questionario 3";
    // await questionnaire_repo.save(questionnaire3); */

    // let question_type1 = new QuestionType();
    // question_type1.id = "1";
    // question_type1.name = "tipo 1";
    // question_type1.questions = [question1];
    // await question_type_repo.save(question_type1);

    // let question_type2 = new QuestionType();
    // question_type2.id = "2";
    // question_type2.name = "tipo 2";
    // question_type2.questions = [question2, question3];
    // await question_type_repo.save(question_type2);

    // let user1 = new User();
    // user1.id = "1";
    // user1.client = null;
    // user1.bpulse_user_token = "121212";
    // user1.email = "email@gmail.com";
    // user1.enabled = true;
    // user1.expense = [];
    // user1.first_name = "usuario 1";
    // user1.google_push_token = "1a2s1d2a";
    // user1.itineraries = [];
    // user1.last_name = "lastname 1";
    // user1.password = "123456";
    // user1.role = null;
    // user1.salt = "4s1s3s2";
    // user1.workday = [];
    // await user_repo.save(user1);

    // let client1 = new Client();
    // client1.id = "1";
    // client1.code = "1231121";
    // client1.custom_image = "asdasd1212a";
    // client1.enabled = true;
    // client1.name = "cliente de sehrs 11";
    // client1.city = city1;
    // client1.customers = [];
    // client1.invoices = [];
    // client1.itineraries = [];
    // client1.payment_method = [];
    // client1.product = [];
    // client1.product_category = [];
    // client1.users = [user1];
    // client1.questionnaires = [questionnaire1, questionnaire2];
    // await client_repo.save(client1);

    // let customer_contact1 = new CustomerContact();
    // customer_contact1.id = "1";
    // customer_contact1.email = "algun@email.com"
    // customer_contact1.first_name = "primer nombre cus contact 1";
    // customer_contact1.job_title = "algun trabajo x";
    // customer_contact1.last_name = "segundo apellido 2";
    // customer_contact1.mobile = "221313131";
    // customer_contact1.phone = "12313131";
    // customer_contact1.customer = null
    // customer_contact1.itineraries = null;
    // await customer_contact_repo.save(customer_contact1);

    // let customer1 = new Customer();
    // customer1.id = "1";
    // customer1.address = "address 1";
    // customer1.city = city1;
    // customer1.client = client1;
    // customer1.customer_contacts = [customer_contact1];
    // customer1.geolocation = 123;
    // customer1.invoices = null;
    // customer1.itineraries = null;
    // customer1.name = "customer 1";
    // customer1.phone = "123456789";
    // customer1.postal_code = 123;
    // await customer_repo.save(customer1);

    // let status1 = new Status();
    // status1.id = "1";
    // status1.name = "status 1";
    // status1.itineraries = null;
    // await status_repo.save(status1);

    // let status2 = new Status();
    // status2.id = "2";
    // status2.name = "status 2";
    // status2.itineraries = null;
    // await status_repo.save(status2);

    // let status3 = new Status();
    // status3.id = "3";
    // status3.name = "status 3";
    // status3.itineraries = null;
    // await status_repo.save(status3);

    // let status4 = new Status();
    // status4.id = "4";
    // status4.name = "status 4";
    // status4.itineraries = null;
    // await status_repo.save(status4);

    // let status5 = new Status();
    // status5.id = "5";
    // status5.name = "status 5";
    // status5.itineraries = null;
    // await status_repo.save(status5);

    // let status6 = new Status();
    // status6.id = "6";
    // status6.name = "status 6";
    // status6.itineraries = null;
    // await status_repo.save(status6);

    // let payment1 = new PaymentMethod();
    // payment1.id = "1";
    // payment1.client = client1;
    // payment1.name = "Method 1";
    // await payment_repo.save(payment1);

    // let payment2 = new PaymentMethod();
    // payment2.id = "2";
    // payment2.client = client1;
    // payment2.name = "Method 2";
    // await payment_repo.save(payment2);

    // let payment3 = new PaymentMethod();
    // payment3.id = "3";
    // payment3.client = client1;
    // payment3.name = "Method 3";
    // await payment_repo.save(payment3);

    // let payment4 = new PaymentMethod();
    // payment4.id = "4";
    // payment4.client = client1;
    // payment4.name = "Method 4";
    // await payment_repo.save(payment4);

    // let product1 = new Product();
    // product1.id = "1";
    // product1.bar_code = "123456";
    // product1.client = client1;
    // product1.code = "codigo1";
    // product1.custom_image = "imagen";
    // product1.invoice_product = null;
    // product1.name = "producto1"
    // await product_repo.save(product1);

    // let product2 = new Product();
    // product2.id = "2";
    // product2.bar_code = "987654";
    // product2.client = client1;
    // product2.code = "codigo2";
    // product2.custom_image = "imagen";
    // product2.invoice_product = null;
    // product2.name = "producto2";
    // await product_repo.save(product2);

    // let product3 = new Product();
    // product3.id = "3";
    // product3.bar_code = "369852";
    // product3.client = client1;
    // product3.code = "codigo3";
    // product3.custom_image = "imagen";
    // product3.invoice_product = null;
    // product3.name = "producto3";
    // await product_repo.save(product3);

    // let today = moment(new Date());
    // let tomorrow = moment(new Date()).add(1, 'd');

    // let price1 = new Price();
    // price1.id = "1";
    // price1.product = null;
    // price1.start_date = +today ;
    // price1.end_date = +tomorrow ;
    // price1.value = 8;
    // price1.product = product1;
    // await price_repo.save(price1);

    // let price2 = new Price();
    // price2.id = "2";
    // price2.product = null;
    // price2.start_date = +today.add(3, 'd') ;
    // price2.end_date = +tomorrow.add(4, 'd') ;
    // price2.value = 12;
    // price2.product = product1;
    // await price_repo.save(price2);

    // let price3 = new Price();
    // price3.id = "3";
    // price3.product = null;
    // price3.start_date = +today.add(9, 'd') ;
    // price3.end_date = +tomorrow.add(11, 'd') ;
    // price3.value = 15;
    // price3.product = product2;
    // await price_repo.save(price3);

    // let price4 = new Price();
    // price4.id = "4";
    // price4.product = null;
    // price4.start_date = +today.add(2, 'd') ;
    // price4.end_date = +tomorrow.add(5, 'd') ;
    // price4.value = 25;
    // price4.product = product2;
    // await price_repo.save(price4);

    // let price5 = new Price();
    // price5.id = "5";
    // price5.product = null;
    // price5.start_date = +today.add(2, 'd') ;
    // price5.end_date = +tomorrow.add(5, 'd') ;
    // price5.value = 25;
    // price5.product = product3;
    // await price_repo.save(price5);

    // let category1 = new ProductCategory();
    // category1.id = "1";
    // category1.bar_code = "barcode";
    // category1.client = client1;
    // category1.code = "code";
    // category1.custom_image = "image";
    // category1.name = "name1category";
    // category1.product = [product1];
    // await product_category_repo.save(category1);

    // let category2 = new ProductCategory();
    // category2.id = "2";
    // category2.bar_code = "barcode";
    // category2.client = client1;
    // category2.code = "code";
    // category2.custom_image = "image";
    // category2.name = "name2category";
    // category2.product = [product2, product3];
    // await product_category_repo.save(category2);

    // let itinerary1 = new Itinerary();
    // itinerary1.id = "1";
    // itinerary1.address = "a1";
    // itinerary1.answers = null;
    // itinerary1.city = city1;
    // itinerary1.client = client1;
    // itinerary1.customer = customer1;
    // itinerary1.customer_contact = customer_contact1;
    // itinerary1.date_time = timestamp;
    // itinerary1.expense = null;
    // itinerary1.geolocation = "37.7749,-122.4194";
    // itinerary1.itinerary_type = itinerary_type1;
    // itinerary1.text_observation = "observation 1";
    // itinerary1.status = status1;
    // itinerary1.user = user1;
    // itinerary1.last_itinerary_position = 1;

    // await itinerary_repo.save(itinerary1);

    // let invoice = new Invoice();
    // invoice.city = city1;
    // invoice.id = "1";
    // invoice.client = client1;
    // invoice.code = "o1";
    // invoice.customer = customer1;
    // invoice.delivery_address = "o1";
    // invoice.delivery_date_time = timestamp;
    // invoice.discount = 1;
    // invoice.itinerary = itinerary1;
    // invoice.order_date_time = timestamp;
    // invoice.payment_method = payment1;

    // await invoice_repo.save(invoice); 

    // let invoice_p = new InvoiceProduct();
    // invoice_p.discount = 1;
    // invoice_p.invoices = invoice;
    // invoice_p.product = product1;
    // invoice_p.order_price = 1;
    // invoice_p.quantity = 1;

    // await invoice_product_repo.save(invoice_p);
  }

  async initializeDBFromApi(data: Array<any>, first_time: boolean) {
    try {
      if (first_time)
        await this.ceroData(data);
      await this.saveFirstData(data);
      await this.saveSecondData(data);
      await this.saveThirdData(data);
    } catch (error) {
      return error;
    }
    return "ok";
  }

  async ceroData(data) {
    let repo_ = getRepository(SyncStatus);
    let sync_s = new SyncStatus();
    sync_s.id = 1;
    sync_s.name = "CREATED";
    await repo_.save(sync_s);

    sync_s = new SyncStatus();
    sync_s.id = 2;
    sync_s.name = "UPDATED";
    await repo_.save(sync_s);

    sync_s = new SyncStatus();
    sync_s.id = 3;
    sync_s.name = "DELETED";
    await repo_.save(sync_s);

    let countries: Array<Country> = [];
    for (let country_data of data['country']) {
      let country = new Country();
      country.id = country_data.id;
      country.name = country_data.name;
      countries.push(country);
    }
    await this.syncData(countries, Country, []);

    let provinces: Array<Province> = [];
    for (let province_data of data['province']) {
      let province = new Province();
      province.id = province_data.id;
      province.name = province_data.name;

      province.country = new Country();
      province.country.id = province_data.country_id;
      provinces.push(province);
    }
    await this.syncData(provinces, Province, ["country"]);

    let cities: Array<City> = [];
    for (let city_data of data['city']) {
      let city = new City();
      city.id = city_data.id;
      city.name = city_data.name;

      city.province = new Province();
      city.province.id = city_data.province_id;
      cities.push(city);
    }
    await this.syncData(cities, City, ["province"]);

    try {
      let question_type_repo = getRepository(QuestionType);
      let question_type = new QuestionType();
      question_type.id = "1";
      question_type.name = "booleano";
      await question_type_repo.save(question_type);

      question_type = new QuestionType();
      question_type.id = "2";
      question_type.name = "texto";
      await question_type_repo.save(question_type);

      question_type = new QuestionType();
      question_type.id = "3";
      question_type.name = "adjunto";
      await question_type_repo.save(question_type);
    }
    catch (error) {
      throw error + " in table: question_type";
    }

    try {
      let questionnaire_type_repo = getRepository(QuestionnaireType);
      let questionnaire_type = new QuestionnaireType();
      questionnaire_type.id = "1";
      questionnaire_type.name = "checkin";
      await questionnaire_type_repo.save(questionnaire_type);

      questionnaire_type = new QuestionnaireType();
      questionnaire_type.id = "2";
      questionnaire_type.name = "checkout";
      await questionnaire_type_repo.save(questionnaire_type);
    }
    catch (error) {
      throw error + " in table: questionnaire_type";
    }

    try {
      let itinerary_type_repo = getRepository(ItineraryType);
      let itinerary_type = new ItineraryType();

      itinerary_type.id = "1";
      itinerary_type.name = "visita_consultiva";
      itinerary_type.with_email_to_contact = "1";
      await itinerary_type_repo.save(itinerary_type);

      itinerary_type = new ItineraryType();
      itinerary_type.id = "2";
      itinerary_type.name = "orden_compra";
      itinerary_type.with_email_to_contact = "1";
      await itinerary_type_repo.save(itinerary_type);

      itinerary_type = new ItineraryType();
      itinerary_type.id = "3";
      itinerary_type.name = "visita_cortesia";
      itinerary_type.with_email_to_contact = "1";
      await itinerary_type_repo.save(itinerary_type);
    }
    catch (error) {
      throw error + " in table: itinerary_type";
    }

    try {
      let status_repo = getRepository(Status);
      let status = new Status();
      status.id = "1";
      status.name = "agendada";
      await status_repo.save(status);

      status = new Status();
      status.id = "2";
      status.name = "desplazamiento";
      await status_repo.save(status);

      status = new Status();
      status.id = "3";
      status.name = "espera";
      await status_repo.save(status);

      status = new Status();
      status.id = "4";
      status.name = "progreso";
      await status_repo.save(status);

      status = new Status();
      status.id = "5";
      status.name = "aprobada";
      await status_repo.save(status);

      status = new Status();
      status.id = "6";
      status.name = "cancelada";
      await status_repo.save(status);
    }
    catch (error) {
      throw error + " in table: status";
    }

    try {
      // Creamos los roles
      let role = new Role();
      let role_repo = getRepository(Role);
      role.id = "1";
      role.name = "Super Administrador";
      await role_repo.save(role);

      role = new Role();
      role.id = "2";
      role.name = "Administrador";
      await role_repo.save(role);

      role = new Role();
      role.id = "3";
      role.name = "Vendedor";
      await role_repo.save(role);
    }
    catch (error) {
      throw error + " in table: role";
    }
  }

  async existDataInDataBase() {
    let product_repo = getRepository(Product);
    let someData = await product_repo.createQueryBuilder('p').getCount();

    if (someData != undefined)
      return true;
    return false;

  }

  getTimestamp(date: string) {
    return (moment.utc(date).unix() * 1000);
  }

  async saveFirstData(data) {
    await this.updateUserListFromApi(data);

    await this.updateProductCategoryListFromApi(data);

    await this.updateProductListFromApi(data);

    await this.updatePaymentMethodListFromApi(data);

    await this.updateWorkdayListFromApi(data);

    await this.updateCustomerListFromApi(data);
  }

  async saveSecondData(data: any) {
    await this.updatePriceListFromApi(data);

    await this.updateCustomerContactListFromApi(data);

    await this.updateCustomerAssignListFromApi(data);
  }

  async saveThirdData(data: any) {
    await this.updateQuestionnaireListFromApi(data);

    await this.updateQuestionListFromApi(data);

    await this.updateItineraryListFromApi(data);

    await this.updateAnswerListFromApi(data); -

      await this.updateInvoiceListFromApi(data);

    await this.updateExpenseListFromApi(data);

    await this.updateInvoiceProductListFromApi(data);
  }

  getPositionByStatusId(status_id: number) {
    // 1 = Agendada
    // 2 = En desplazamiento
    // 3 = Espera en cliente
    // 4 = En progreso
    // 5 = Aprobada
    // 6 = Cancelada
    return status_id;
  }

  async updateUserListFromApi(data, second_charge = false) {
    let client_repo = getRepository(Client);
    let user_repo = getRepository(User);
    let user_data = data['user'];
    if (!second_charge || user_data.sync_status_id == 1) {
      let user = new User();
      user.id = user_data.id == null ? "" : user_data.id;
      user.bpulse_user_token = user_data.bpulse_user_token;
      user.email = user_data.email;
      user.enabled = user_data.enabled == null ? "" : user_data.enabled;
      user.first_name = user_data.first_name == null ? "" : user_data.first_name;
      user.google_push_token = user_data.google_push_token == null ? "" : user_data.google_push_token;
      user.last_name = user_data.last_name == null ? "" : user_data.last_name;
      user.password = user_data.password == null ? "" : user_data.password;
      user.salt = user_data.salt == null ? "" : user_data.salt;
      user.user_created = user_data.user_created == null ? "" : user_data.user_created;
      user.user_updated = user_data.user_updated == null ? "" : user_data.user_updated;
      user.date_created = user_data.date_created == null ? 0 : this.getTimestamp(user_data.date_created);
      user.date_updated = user_data.date_updated == null ? 0 : this.getTimestamp(user_data.date_updated);

      user.role = new Role();
      user.role.id = user_data.role_id;

      let client = new Client();
      let client_data = user_data.client;
      client.id = client_data.id;
      client.name = client_data.name;
      client.city = new City();
      client.city.id = client_data.city_id;
      await client_repo.save(client);

      user.client = new Client();
      user.client.id = client_data.id;

      user.sync_status = new SyncStatus();
      user.sync_status.id = 1;

      await user_repo.save(user);
    }
    if (second_charge && (user_data.sync_status_id == 2)) {
      let _repo = getRepository(User);
      let sync_status_ = new SyncStatus();
      sync_status_.id = user_data.sync_status_id;
      let role_ = new Role();
      role_.id = user_data.role_id;
      let client_ = new Client();
      client_.id = user_data.client_id;
      await _repo
        .createQueryBuilder('i')
        .update({
          bpulse_user_token: user_data.bpulse_user_token,
          email: user_data.email,
          enabled: user_data.enabled,
          first_name: user_data.first_name,
          google_push_token: user_data.google_push_token,
          last_name: user_data.last_name,
          password: user_data.password,
          salt: user_data.salt,
          user_created: user_data.user_created,
          user_updated: user_data.user_updated,
          date_created: this.getTimestamp(user_data.date_created),
          date_updated: this.getTimestamp(user_data.date_updated),

          sync_status: sync_status_,
          role: role_,
          client: client_
        })
        .where('id = :id', { id: user_data.id })
        .execute();
    }
    if (second_charge && (user_data.sync_status_id == 3)) {
      let _repo = getRepository(User);
      let sync_status_repo = getRepository(SyncStatus);

      let obj_found = await _repo
        .createQueryBuilder('x')
        .leftJoinAndSelect('x.expense', 'expense')
        .leftJoinAndSelect('x.itineraries', 'itineraries')
        .leftJoinAndSelect('x.workday', 'workday')
        .leftJoinAndSelect('x.customer_assign', 'customer_assign')
        .where('i.id = :id', { id: user_data.id })
        .getOne();

      // si no existe relacion entonces borramos
      if (
        (obj_found.expense.length == 0) &&
        (obj_found.itineraries.length == 0) &&
        (obj_found.workday.length == 0) &&
        (obj_found.customer_assign.length == 0)
      ) {
        await _repo.delete({ id: obj_found.id });
      }
      // Sino actualizamos el sync_status para indicar que no debe ser borrado
      else {
        let now = moment.utc().unix() * 1000;
        let sync_status_ = await sync_status_repo.findOne({ id: 2 });
        await _repo.createQueryBuilder('i')
          .update({ sync_status: sync_status_, date_updated: now })
          .where("id = :id_", { id_: obj_found.id });
      }
    }
  }

  async updateCustomerAssignListFromApi(data: any, second_charge = false) {
    try {
      let customers_assign: Array<CustomerAssign> = [];
      for (let customer_assign_data of data['customer_assign']) {
        if (!second_charge || customer_assign_data.sync_status_id == 1) {
          let customer_assign = new CustomerAssign();
          customer_assign.id = customer_assign_data.id;
          customer_assign.status = customer_assign_data.status;
          customer_assign.user_created = customer_assign_data.user_created;
          customer_assign.user_updated = customer_assign_data.user_updated;
          customer_assign.date_created = this.getTimestamp(customer_assign_data.date_created);
          customer_assign.date_updated = this.getTimestamp(customer_assign_data.date_updated);

          customer_assign.customer = new Customer();
          customer_assign.customer.id = customer_assign_data.customer_id;

          customer_assign.user = new User();
          customer_assign.user.id = customer_assign_data.user_id;

          customer_assign.sync_status = new SyncStatus();
          customer_assign.sync_status.id = 1;

          customers_assign.push(customer_assign);
        }
        if (second_charge && (customer_assign_data.sync_status_id == 2)) {
          let _repo = getRepository(CustomerAssign);
          let customer_ = new Customer();
          customer_.id = customer_assign_data.customer_id;
          let user_ = new User();
          user_.id = customer_assign_data.user_id;
          let sync_status_ = new SyncStatus();
          sync_status_.id = customer_assign_data.sync_status_id;
          await _repo
            .createQueryBuilder('i')
            .update({
              status: customer_assign_data.status,
              user_created: customer_assign_data.user_created,
              user_updated: customer_assign_data.user_updated,
              date_created: this.getTimestamp(customer_assign_data.date_created),
              date_updated: this.getTimestamp(customer_assign_data.date_updated),

              sync_status: sync_status_,
              user: user_,
              customer: customer_
            })
            .where('id = :id', { id: customer_assign_data.id })
            .execute();
        }
        if (second_charge && (customer_assign_data.sync_status_id == 3)) {
          let _repo = getRepository(CustomerAssign);
          await _repo.delete({ id: customer_assign_data.id });
        }
      }
      if (customers_assign.length >= 1)
        await this.syncData(customers_assign, CustomerAssign, ['customer', 'user', 'sync_status']);
    }
    catch (error) {
      throw error + " in table: customer_assign";
    }
  }

  /**
   * Funcion encargada de solicitar a la api los nuevos datos alojados en la bd
   * 
   * @param data Array con la informacion de los nuevo itinerarios
   * @param second_charge boolean que indica si es desde la primera carga o es una sincronizacion
   */
  async updateItineraryListFromApi(data, second_charge: boolean = false) {
    try {
      let itineraries: Array<Itinerary> = [];
      for (let itinerary_data of data['itinerary']) {
        //Si es una creacion hacemos push para llamar al syncData
        if (!second_charge || itinerary_data.sync_status_id == 1) {
          let itinerary = new Itinerary();
          itinerary.id = itinerary_data.id;
          itinerary.address = itinerary_data.address;
          itinerary.date_time = this.getTimestamp(itinerary_data.date_time);
          itinerary.geolocation = itinerary_data.geolocation == null ? "" : itinerary_data.geolocation;
          itinerary.observation = itinerary_data.observation == null ? "" : itinerary_data.observation;

          itinerary.user_created = itinerary_data.user_created;
          itinerary.user_updated = itinerary_data.user_updated;
          itinerary.date_created = this.getTimestamp(itinerary_data.date_created);
          itinerary.date_updated = this.getTimestamp(itinerary_data.date_updated);

          status = itinerary_data.status_id;
          itinerary.last_itinerary_position = this.getPositionByStatusId(itinerary_data.status_id);

          itinerary.itinerary_type = new ItineraryType();
          itinerary.itinerary_type.id = itinerary_data.itinerary_type_id;

          itinerary.customer = new Customer();
          itinerary.customer.id = itinerary_data.customer_id;

          itinerary.customer_contact = new CustomerContact();
          itinerary.customer_contact.id = itinerary_data.customer_contact_id;

          itinerary.city = new City();
          itinerary.city.id = itinerary_data.city_id;

          itinerary.client = new Client();
          itinerary.client.id = itinerary_data.client_id;

          itinerary.user = new User();
          itinerary.user.id = itinerary_data.user_id;

          itinerary.status = new Status();
          itinerary.status.id = itinerary_data.status_id;

          itinerary.sync_status = new SyncStatus();
          itinerary.sync_status.id = 1;

          itineraries.push(itinerary);
        }
        // Si es una actualizacion
        if (second_charge && (itinerary_data.sync_status_id == 2)) {
          let itinerary_repo = getRepository(Itinerary);
          let city_ = new City();
          city_.id = itinerary_data.city_id;
          let client_ = new Client();
          client_.id = itinerary_data.client_id;
          let user_ = new User();
          user_.id = itinerary_data.user_id;
          let status_ = new Status();
          status_.id = itinerary_data.status_id;
          let sync_status_ = new SyncStatus();
          sync_status_.id = itinerary_data.sync_status_id;
          let itinerary_type_ = new ItineraryType();
          itinerary_type_.id = itinerary_data.itinerary_type_id;
          let customer_ = new Customer();
          customer_.id = itinerary_data.customer_id;
          let customer_contact_ = new CustomerContact();
          customer_contact_.id = itinerary_data.customer_contact_id;

          await itinerary_repo
            .createQueryBuilder('i')
            .update({
              address: itinerary_data.address,
              date_time: this.getTimestamp(itinerary_data.date_time),
              geolocation: itinerary_data.geolocation,
              observation: itinerary_data.observation == null ? "" : itinerary_data.observation,
              date_created: this.getTimestamp(itinerary_data.date_created),
              date_updated: this.getTimestamp(itinerary_data.date_updated),
              user_created: itinerary_data.user_created,
              user_updated: itinerary_data.user_updated,
              last_itinerary_position: this.getPositionByStatusId(itinerary_data.status_id),

              city: city_,
              client: client_,
              user: user_,
              status: status_,
              sync_status: sync_status_,
              itinerary_type: itinerary_type_,
              customer: customer_,
              customer_contact: customer_contact_,
            })
            .where('id = :id', { id: itinerary_data.id })
            .execute();
        }
        if (second_charge && (itinerary_data.sync_status_id == 3)) {
          let itinerary_repo = getRepository(Itinerary);
          let sync_status_repo = getRepository(SyncStatus);

          let itinerary_found = await itinerary_repo
            .createQueryBuilder('i')
            .leftJoinAndSelect('i.answers', 'answers')
            .leftJoinAndSelect('i.expense', 'expense')
            .leftJoinAndSelect('i.invoice', 'invoice')
            .where('i.id = :id', { id: itinerary_data.id })
            .getOne();

          // si no existe relacion entonces borramos
          if (
            (itinerary_found.answers.length == 0) &&
            (itinerary_found.expense.length == 0) &&
            (typeof itinerary_found.invoice == 'undefined')
          ) {
            await itinerary_repo.delete({ id: itinerary_found.id });
          }
          // Sino actualizamos el sync_status para indicar que no debe ser borrado
          else {
            let now = moment.utc().unix() * 1000;
            let sync_status_ = await sync_status_repo.findOne({ id: 2 });
            await itinerary_repo.createQueryBuilder('i')
              .update({ sync_status: sync_status_, date_updated: now })
              .where("id = :id_", { id_: itinerary_found.id });
          }
        }
      }
      if (itineraries.length >= 1)
        await this.syncData(itineraries, Itinerary, ['itinerary_type', 'customer', 'customer_contact', 'city', 'client', 'user', 'status', 'sync_status']);
    }
    catch (error) {
      throw error + " in table: itinerary";
    }
  }
  async updateCustomerListFromApi(data, second_charge: boolean = false) {
    try {
      let customers: Array<Customer> = [];
      let date_created: number, date_updated: number;
      for (let customer_data of data['customer']) {
        let customer = new Customer();

        if (!second_charge || customer_data.sync_status_id == 1) {
          customer.id = customer_data.id;
          customer.name = customer_data.name;
          customer.phone = customer_data.phone;
          customer.address = customer_data.address;
          customer.postal_code = customer_data.postal_code;
          customer.geolocation = customer_data.geolocation;

          date_created = this.getTimestamp(customer_data.date_created);
          date_updated = this.getTimestamp(customer_data.date_updated);
          customer.date_created = date_created;
          customer.date_updated = date_updated;
          customer.user_created = customer_data.user_created;
          customer.user_updated = customer_data.user_updated;
          customer.nit = customer_data.nit;

          customer.client = new Client();
          customer.client.id = customer_data.client_id;

          customer.sync_status = new SyncStatus();
          customer.sync_status.id = 1;

          customer.city = new City();
          customer.city.id = customer_data.city_id;

          customers.push(customer);
        }
        if (second_charge && (customer_data.sync_status_id == 2)) {
          let customer_repo = getRepository(Customer);
          let client_ = new Client();
          client_.id = customer_data.client_id;
          let city_ = new City();
          city_.id = customer_data.city_id;
          let sync_status_ = new SyncStatus();
          sync_status_.id = customer_data.sync_status_id;
          await customer_repo
            .createQueryBuilder('i')
            .update({
              name: customer_data.name,
              phone: customer_data.phone,
              address: customer_data.address,
              postal_code: customer_data.postal_code,
              geolocation: customer_data.geolocation,
              date_created: this.getTimestamp(customer_data.date_created),
              date_updated: this.getTimestamp(customer_data.date_updated),
              user_created: customer_data.user_created,
              user_updated: customer_data.user_updated,
              nit: customer_data.nit,

              sync_status: sync_status_,
              client: client_,
              city: city_
            })
            .where('id = :id', { id: customer_data.id })
            .execute();
        }
        if (second_charge && (customer_data.sync_status_id == 3)) {
          let _repo = getRepository(Customer);
          let sync_status_repo = getRepository(SyncStatus);

          let obj_found = await _repo
            .createQueryBuilder('x')
            .leftJoinAndSelect('x.itineraries', 'itineraries')
            .leftJoinAndSelect('x.customer_contacts', 'customer_contacts')
            .leftJoinAndSelect('x.invoices', 'invoices')
            .leftJoinAndSelect('x.customer_assign', 'customer_assign')
            .where('x.id = :id', { id: customer_data.id })
            .getOne();

          // si no existe relacion entonces borramos
          if (
            (obj_found.itineraries.length == 0) &&
            (obj_found.customer_contacts.length == 0) &&
            (obj_found.invoices.length == 0) &&
            (obj_found.customer_assign.length == 0)
          ) {
            await _repo.delete({ id: obj_found.id });
          }
          // Sino actualizamos el sync_status para indicar que no debe ser borrado
          else {
            let now = moment.utc().unix() * 1000;
            let sync_status_ = await sync_status_repo.findOne({ id: 2 });
            await _repo.createQueryBuilder('x')
              .update({ sync_status: sync_status_, date_updated: now })
              .where("id = :id_", { id_: obj_found.id });
          }
        }
      }
      if (customers.length >= 1)
        await this.syncData(customers, Customer, ['client', 'city', 'sync_status']);
    }
    catch (error) {
      throw error + " in table: customer";
    }
  }
  async updateCustomerContactListFromApi(data, second_charge: boolean = false) {
    try {
      let customer_contacts: Array<CustomerContact> = [];
      for (let customer_contact_data of data['customer_contact']) {
        let customer_contact = new CustomerContact();

        if (!second_charge || customer_contact_data.sync_status_id == 1) {
          customer_contact.id = customer_contact_data.id;
          customer_contact.first_name = customer_contact_data.first_name;
          customer_contact.last_name = customer_contact_data.last_name;
          customer_contact.email = customer_contact_data.email;
          customer_contact.phone = customer_contact_data.phone;
          customer_contact.mobile = customer_contact_data.mobile;
          customer_contact.job_title = customer_contact_data.job_title;

          customer_contact.date_created = this.getTimestamp(customer_contact_data.date_created);
          customer_contact.date_updated = this.getTimestamp(customer_contact_data.date_updated);
          customer_contact.user_created = customer_contact_data.user_created;
          customer_contact.user_updated = customer_contact_data.user_updated;

          customer_contact.customer = new Customer();
          customer_contact.customer.id = customer_contact_data.customer_id;

          customer_contact.sync_status = new SyncStatus();
          customer_contact.sync_status.id = 1;

          customer_contacts.push(customer_contact);
        }
        if (second_charge && (customer_contact_data.sync_status_id == 2)) {
          let _repo = getRepository(CustomerContact);
          let customer_ = new Customer();
          customer_.id = customer_contact_data.customer_id;
          let sync_status_ = new SyncStatus();
          sync_status_.id = customer_contact_data.sync_status_id;
          await _repo
            .createQueryBuilder('i')
            .update({
              first_name: customer_contact_data.first_name,
              last_name: customer_contact_data.last_name,
              email: customer_contact_data.email,
              phone: customer_contact_data.phone,
              mobile: customer_contact_data.mobile,
              job_title: customer_contact_data.job_title,
              date_created: this.getTimestamp(customer_contact_data.date_created),
              date_updated: this.getTimestamp(customer_contact_data.date_updated),

              customer: customer_,
              sync_status: sync_status_
            })
            .where('id = :id', { id: customer_contact_data.id })
            .execute();
        }
        if (second_charge && (customer_contact_data.sync_status_id == 3)) {
          let _repo = getRepository(CustomerContact);
          let sync_status_repo = getRepository(SyncStatus);

          let obj_found = await _repo
            .createQueryBuilder('x')
            .leftJoinAndSelect('x.itineraries', 'itineraries')
            .where('x.id = :id', { id: customer_contact_data.id })
            .getOne();

          // si no existe relacion entonces borramos
          if (
            (obj_found.itineraries.length == 0)
          ) {
            await _repo.delete({ id: obj_found.id });
          }
          // Sino actualizamos el sync_status para indicar que no debe ser borrado
          else {
            let now = moment.utc().unix() * 1000;
            let sync_status_ = await sync_status_repo.findOne({ id: 2 });
            await _repo.createQueryBuilder('x')
              .update({ sync_status: sync_status_, date_updated: now })
              .where("id = :id_", { id_: obj_found.id });
          }
        }
      }
      if (customer_contacts.length >= 1)
        await this.syncData(customer_contacts, CustomerContact, ['customer', 'sync_status']);
    }
    catch (error) {
      throw error + " in table: customer_contact";
    }
  }
  async updateAnswerListFromApi(data, second_charge: boolean = false) {
    try {
      let answers: Array<Answer> = [];
      for (let answer_data of data['answer']) {
        let answer = new Answer();

        if (!second_charge || answer_data.sync_status_id == 1) {
          answer.id = answer_data.id;
          answer.text_data = answer_data.text_data;
          answer.attached_data = "answer_data.attached_data"; // TODO:Agregar al modelo
          answer.user_created = answer_data.user_created;
          answer.user_updated = answer_data.user_updated;
          answer.date_created = this.getTimestamp(answer_data.date_created);
          answer.date_updated = this.getTimestamp(answer_data.date_updated);

          answer.questions = new Questions();
          answer.questions.id = answer_data.question_id;

          answer.itinerary = new Itinerary();
          answer.itinerary.id = answer_data.itinerary_id;

          answer.sync_status = new SyncStatus();
          answer.sync_status.id = 1;

          answers.push(answer);
        }
        if (second_charge && (answer_data.sync_status_id == 2)) {
          let _repo = getRepository(Answer);
          let sync_status_ = new SyncStatus();
          sync_status_.id = answer_data.sync_status_id;
          let itinerary_ = new Itinerary();
          itinerary_.id = answer_data.itinerary_id;
          let questions_ = new Questions();
          sync_status_.id = answer_data.question_id;

          await _repo
            .createQueryBuilder('i')
            .update({
              text_data: answer_data.text_data,
              //attached_data : answer_data.attached_data,
              user_created: answer_data.user_created,
              user_updated: answer_data.user_updated,
              date_created: this.getTimestamp(answer_data.date_created),
              date_updated: this.getTimestamp(answer_data.date_updated),

              itinerary: itinerary_,
              sync_status: sync_status_,
              questions: questions_
            })
            .where('id = :id', { id: answer_data.id })
            .execute();
        }
        if (second_charge && (answer_data.sync_status_id == 3)) {
          let _repo = getRepository(Answer);
          let obj_found = await _repo.findOne({ id: answer_data.id });

          await _repo.delete({ id: obj_found.id });
        }
      }
      if (answers.length >= 1)
        await this.syncData(answers, Answer, ['questions', 'itinerary', 'sync_status']);
    }
    catch (error) {
      throw error + " in table: answer";
    }
  }

  setCredentials(requestOptions) {
    this.requestOptions = requestOptions;
  }

  getCredentials() {
    return this.requestOptions;
  }

  async updateExpenseListFromApi(data, second_charge: boolean = false) {
    try {
      let expenses: Array<Expense> = [];
      for (let expense_data of data['expense']) {
        let expense = new Expense();
        let atteched: string = "";

        if (!second_charge || expense_data.sync_status_id == 1) {
          expense.id = expense_data.id;
          expense.item = expense_data.item;
          expense.value = expense_data.value;
          expense.description = expense_data.description;

          if (expense_data.atteched.length > 2)
            atteched = await this.saveImageInDevice(expense_data.atteched, 'expense', expense_data.id);

          expense.atteched = atteched;
          expense.user_created = expense_data.user_created;
          expense.user_updated = expense_data.user_updated;
          expense.date_created = this.getTimestamp(expense_data.date_created);
          expense.date_updated = this.getTimestamp(expense_data.date_updated);

          expense.itinerary = new Itinerary();
          expense.itinerary.id = expense_data.itinerary_id;

          expense.user = new User();
          expense.user.id = expense_data.user_id;

          expense.sync_status = new SyncStatus();
          expense.sync_status.id = 1;

          expenses.push(expense);
        }
        if (second_charge && (expense_data.sync_status_id == 2)) {
          let _repo = getRepository(Expense);
          let sync_status_ = new SyncStatus();
          sync_status_.id = expense_data.sync_status_id;
          let itinerary_ = new Itinerary();
          itinerary_.id = expense_data.itinerary_id;
          let user_ = new User();
          user_.id = expense_data.user_id;

          if (expense_data.atteched.length > 2)
            atteched = await this.saveImageInDevice(expense_data.atteched, 'expense', expense_data.id);

          await _repo
            .createQueryBuilder('i')
            .update({
              item: expense_data.item,
              value: expense_data.value,
              description: expense_data.description,
              atteched: expense_data.atteched,
              user_created: expense_data.user_created,
              user_updated: expense_data.user_updated,
              date_created: this.getTimestamp(expense_data.date_created),
              date_updated: this.getTimestamp(expense_data.date_updated),

              itinerary: itinerary_,
              user: user_,
              sync_status: sync_status_
            })
            .where('id = :id', { id: expense_data.id })
            .execute();
        }
        if (second_charge && (expense_data.sync_status_id == 3)) {
          await this.dropImageInDevice('expense', expense_data.id);

          let _repo = getRepository(Expense);
          let obj_found = await _repo
            .createQueryBuilder('x')
            .where('x.id = :id', { id: expense_data.id })
            .getOne();

          await _repo.delete({ id: obj_found.id });
        }
      }
      if (expenses.length >= 1)
        await this.syncData(expenses, Expense, ['itinerary', 'user', "sync_status"]);
    }
    catch (error) {
      throw error + " in table: expense";
    }
  }
  async updateInvoiceListFromApi(data, second_charge: boolean = false) {
    try {

      let invoices: Array<Invoice> = [];
      for (let invoice_data of data['invoice']) {
        let invoice = new Invoice();

        if (!second_charge || (invoice_data.sync_status_id == 1)) {
          invoice.id = invoice_data.id;
          invoice.delivery_date_time = this.getTimestamp(invoice_data.delivery_date_time);
          invoice.delivery_address = invoice_data.delivery_address;
          invoice.date_created = this.getTimestamp(invoice_data.date_created);
          invoice.date_updated = this.getTimestamp(invoice_data.date_updated);
          invoice.user_created = invoice_data.user_created;
          invoice.user_updated = invoice_data.user_updated;
          invoice.order_date_time = invoice_data.order_date_time;
          invoice.discount = invoice_data.discount;
          invoice.code = invoice_data.code;

          invoice.client = new Client();
          invoice.client.id = invoice_data.client_id;

          invoice.payment_method = new PaymentMethod();
          invoice.payment_method.id = invoice_data.payment_method_id;

          invoice.customer = new Customer();
          invoice.customer.id = invoice_data.customer_id;

          invoice.city = new City();
          invoice.city.id = invoice_data.city_id;

          invoice.itinerary = new Itinerary();
          invoice.itinerary.id = invoice_data.itinerary_id;

          invoice.sync_status = new SyncStatus();
          invoice.sync_status.id = 1;

          invoices.push(invoice);
        }
        if (second_charge && (invoice_data.sync_status_id == 2)) {
          let _repo = getRepository(Invoice);
          let client_ = new Client();
          client_.id = invoice_data.client_id;
          let payment_method_ = new PaymentMethod();
          payment_method_.id = invoice_data.payment_method_id;
          let customer_ = new Customer();
          customer_.id = invoice_data.customer_id;
          let city_ = new City();
          city_.id = invoice_data.city_id;
          let sync_status_ = new SyncStatus();
          sync_status_.id = invoice_data.sync_status_id;

          await _repo
            .createQueryBuilder('i')
            .update({
              delivery_date_time: this.getTimestamp(invoice_data.delivery_date_time),
              delivery_address: invoice_data.delivery_address,
              date_created: this.getTimestamp(invoice_data.date_created),
              date_updated: this.getTimestamp(invoice_data.date_updated),
              user_created: invoice_data.user_created,
              user_updated: invoice_data.user_updated,
              order_date_time: invoice_data.order_date_time,
              discount: invoice_data.discount,
              code: invoice_data.code,

              client: client_,
              payment_method: payment_method_,
              customer: customer_,
              city: city_,
              sync_status: sync_status_
            })
            .where('id = :id', { id: invoice_data.id })
            .execute();
        }
        if (second_charge && (invoice_data.sync_status_id == 3)) {
          let _repo = getRepository(Invoice);
          let sync_status_repo = getRepository(SyncStatus);

          let obj_found = await _repo
            .createQueryBuilder('x')
            .leftJoinAndSelect('x.invoice_product', 'invoice_product')
            .where('x.id = :id', { id: invoice_data.id })
            .getOne();

          // si no existe relacion entonces borramos
          if (
            (obj_found.invoice_product.length == 0)
          ) {
            await _repo.delete({ id: obj_found.id });
          }
          // Sino, actualizamos el sync_status para indicar que no debe ser borrado
          else {
            let now = moment.utc().unix() * 1000;
            let sync_status_ = await sync_status_repo.findOne({ id: 2 });
            await _repo.createQueryBuilder('x')
              .update({ sync_status: sync_status_, date_updated: now })
              .where("id = :id_", { id_: obj_found.id });
          }
        }
      }
      if (invoices.length >= 1)
        await this.syncData(invoices, Invoice, ['client', 'payment_method', 'city', 'itinerary', 'sync_status']);
    }
    catch (error) {
      throw error + " in table: invoice";
    }
  }
  async updateInvoiceProductListFromApi(data, second_charge: boolean = false) {
    try {
      let invoice_product_repo = getRepository(InvoiceProduct);
      for (let invoice_product_data of data['invoice_product']) {
        let invoice_product = new InvoiceProduct();

        if (!second_charge || (invoice_product_data.sync_status_id == 1)) {
          invoice_product.discount = invoice_product_data.discount;
          invoice_product.order_price = invoice_product_data.order_price;
          invoice_product.quantity = invoice_product_data.quantity;

          invoice_product.product = new Product();
          invoice_product.product.id = invoice_product_data.product_id;
          invoice_product.invoices = new Invoice();
          invoice_product.invoices.id = invoice_product_data.invoice_id;
          invoice_product.sync_status = new SyncStatus();
          invoice_product.sync_status.id = 1;
          invoice_product.date_created = this.getTimestamp(invoice_product_data.date_created);
          invoice_product.date_updated = this.getTimestamp(invoice_product_data.date_updated);
          invoice_product.user_created = invoice_product_data.user_created;
          invoice_product.user_updated = invoice_product_data.user_updated;

          await invoice_product_repo.save(invoice_product);
        }
        if (second_charge && (invoice_product_data.sync_status_id == 2)) {
          let _repo = getRepository(InvoiceProduct);
          let sync_status_ = new SyncStatus();
          sync_status_.id = invoice_product_data.sync_status_id;

          await _repo
            .createQueryBuilder('i')
            .update({
              discount: invoice_product_data.discount,
              order_price: invoice_product_data.order_price,
              quantity: invoice_product_data.quantity,

              sync_status: sync_status_
            })
            .where('productid = :product_id', { product_id: invoice_product_data.product_id })
            .andWhere('invoicesid = :invoice_id', { invoice_id: invoice_product_data.invoice_id })
            .execute();
        }
        if (second_charge && (invoice_product_data.sync_status_id == 3)) {

          let sql = ' FROM invoice_product where '
            + ' invoicesid = "' + invoice_product_data.invoice_id + '"'
            + ' and productid = "' + invoice_product_data.product_id + '"';

          let response: any = await invoice_product_repo.manager.query("SELECT *" + sql);

          if (response.length == 1)
            await invoice_product_repo.manager.query("DELETE" + sql);
        }
      }
    }
    catch (error) {
      throw error + " in table: invoice_product";
    }
  }
  async updateWorkdayListFromApi(data, second_charge: boolean = false) {
    try {
      let workdays: Array<Workday> = [];
      for (let workday_data of data['workday']) {
        let workday = new Workday();

        if (!second_charge || (workday_data.sync_status_id == 1)) {
          workday.id = workday_data.id;
          workday.item_type = workday_data.item_type;
          workday.start_date = this.getTimestamp(workday_data.start_date);
          workday.end_date = this.getTimestamp(workday_data.end_date);
          workday.date_created = this.getTimestamp(workday_data.date_created);
          workday.date_updated = this.getTimestamp(workday_data.date_updated);
          workday.user_created = workday_data.user_created;
          workday.user_updated = workday_data.user_updated;

          workday.user = new User();
          workday.user.id = workday_data.user_id;

          workday.sync_status = new SyncStatus();
          workday.sync_status.id = 1;

          workdays.push(workday);
        }
        if (second_charge && (workday_data.sync_status_id == 2)) {
          let _repo = getRepository(Workday);
          let sync_status_ = new SyncStatus();
          sync_status_.id = workday_data.sync_status_id;
          let user_ = new User();
          user_.id = workday_data.user_id;

          await _repo
            .createQueryBuilder('x')
            .update({
              item_type: workday_data.item_type,
              start_date: this.getTimestamp(workday_data.start_date),
              end_date: this.getTimestamp(workday_data.end_date),
              date_created: this.getTimestamp(workday_data.date_created),
              date_updated: this.getTimestamp(workday_data.date_updated),
              user_created: workday_data.user_created,
              user_updated: workday_data.user_updated,

              user: user_,
              sync_status: sync_status_
            })
            .where('id = :id', { id: workday_data.id })
            .execute();
        }
        if (second_charge && (workday_data.sync_status_id == 3)) {
          let _repo = getRepository(Workday);
          let obj_found = await _repo.findOne({ id: workday_data.id });

          await _repo.delete({ id: obj_found.id });
        }
      }
      if (workdays.length >= 1)
        await this.syncData(workdays, Workday, ['user', 'sync_status']);
    }
    catch (error) {
      throw error + " in table: workday";
    }
  }
  async updateProductListFromApi(data, second_charge: boolean = false) {
    try {
      let products: Array<Product> = [];
      for (let product_data of data['product']) {
        let product = new Product();
        let atteched: string = "";
        if (!second_charge || (product_data.sync_status_id == 1)) {
          product.id = product_data.id;
          product.date_created = this.getTimestamp(product_data.date_created);
          product.date_updated = this.getTimestamp(product_data.date_updated);
          product.barcode = product_data.barcode;
          product.code = product_data.code;

          if (product_data['custom_image'].length > 2)
            atteched = await this.saveImageInDevice(product_data.custom_image, 'product', product_data.id);

          product.custom_image = atteched;
          product.name = product_data.name;
          product.user_created = product_data.user_created;
          product.user_updated = product_data.user_updated;

          product.client = new Client();
          product.client.id = product_data.client_id;

          product.product_category = new ProductCategory();
          product.product_category.id = product_data.product_category_id;

          product.sync_status = new SyncStatus();
          product.sync_status.id = 1;

          products.push(product);
        }
        if (second_charge && (product_data.sync_status_id == 2)) {
          let _repo = getRepository(Product);
          let sync_status_ = new SyncStatus();
          sync_status_.id = product_data.sync_status_id;
          let client_ = new Client();
          client_.id = product_data.client_id;
          let product_category_ = new ProductCategory();
          product_category_.id = product_data.product_category_id;

          if (product_data['custom_image'].length > 2)
            atteched = await this.saveImageInDevice(product_data.custom_image, 'product', product_data.id);

          await _repo
            .createQueryBuilder('x')
            .update({
              date_created: this.getTimestamp(product_data.date_created),
              date_updated: this.getTimestamp(product_data.date_updated),
              barcode: product_data.barcode,
              code: product_data.code,
              custom_image: product_data.custom_image,
              name: product_data.name,
              user_created: product_data.user_created,
              user_updated: product_data.user_updated,

              sync_status: sync_status_,
              client: client_,
              product_category: product_category_
            })
            .where('id = :id', { id: product_data.id })
            .execute();
        }
        if (second_charge && (product_data.sync_status_id == 3)) {
          await this.dropImageInDevice('product', product_data.id);
          let _repo = getRepository(Product);
          let sync_status_repo = getRepository(SyncStatus);

          let obj_found = await _repo
            .createQueryBuilder('x')
            .leftJoinAndSelect('x.prices', 'prices')
            .leftJoinAndSelect('x.invoice_product', 'invoice_product')
            .where('x.id = :id', { id: product_data.id })
            .getOne();

          // si no existe relacion entonces borramos
          if (
            (obj_found.prices.length == 0) &&
            (obj_found.invoice_product.length == 0)
          ) {
            await _repo.delete({ id: obj_found.id });
          }
          // Sino, actualizamos el sync_status para indicar que no debe ser borrado
          else {
            let now = moment.utc().unix() * 1000;
            let sync_status_ = await sync_status_repo.findOne({ id: 2 });
            await _repo.createQueryBuilder('x')
              .update({ sync_status: sync_status_, date_updated: now })
              .where("id = :id_", { id_: obj_found.id });
          }
        }
      }
      if (products.length >= 1)
        await this.syncData(products, Product, ["product_category", "client", "sync_status"]);
    }
    catch (error) {
      throw error + " in table: product";
    }
  }
  async updateProductCategoryListFromApi(data, second_charge: boolean = false) {
    try {
      let product_categories: Array<ProductCategory> = [];
      // Creamos las categorias por producto
      for (let product_category_data of data['product_category']) {
        if (!second_charge || (product_category_data.sync_status_id == 1)) {
          let product_category = new ProductCategory();

          product_category.id = product_category_data.id;
          product_category.name = product_category_data.name;
          product_category.user_created = product_category_data.user_created;
          product_category.user_updated = product_category_data.user_updated;
          product_category.date_created = this.getTimestamp(product_category_data.date_created);
          product_category.date_updated = this.getTimestamp(product_category_data.date_created);

          product_category.client = new Client();
          product_category.client.id = product_category_data.client_id;

          product_category.sync_status = new SyncStatus();
          product_category.sync_status.id = 1;

          product_categories.push(product_category);
        }
        if (second_charge && (product_category_data.sync_status_id == 2)) {
          let _repo = getRepository(ProductCategory);
          let sync_status_ = new SyncStatus();
          sync_status_.id = product_category_data.sync_status_id;
          let client_ = new Client();
          client_.id = product_category_data.client_id;

          await _repo
            .createQueryBuilder('x')
            .update({
              name: product_category_data.name,
              user_created: product_category_data.user_created,
              user_updated: product_category_data.user_updated,
              date_created: this.getTimestamp(product_category_data.date_created),
              date_updated: this.getTimestamp(product_category_data.date_created),

              sync_status: sync_status_,
              client: client_,
            })
            .where('id = :id', { id: product_category_data.id })
            .execute();
        }
        if (second_charge && (product_category_data.sync_status_id == 3)) {
          let _repo = getRepository(ProductCategory);
          let sync_status_repo = getRepository(SyncStatus);

          let obj_found = await _repo
            .createQueryBuilder('x')
            .leftJoinAndSelect('x.product', 'product')
            .where('x.id = :id', { id: product_category_data.id })
            .getOne();

          // si no existe relacion entonces borramos
          if (
            (obj_found.product.length == 0)
          ) {
            await _repo.delete({ id: obj_found.id });
          }
          // Sino, actualizamos el sync_status para indicar que no debe ser borrado
          else {
            let now = moment.utc().unix() * 1000;
            let sync_status_ = await sync_status_repo.findOne({ id: 2 });
            await _repo.createQueryBuilder('x')
              .update({ sync_status: sync_status_, date_updated: now })
              .where("id = :id_", { id_: obj_found.id });
          }
        }
      }
      if (product_categories.length >= 1)
        await this.syncData(product_categories, ProductCategory, ['client', 'sync_status']);
    }
    catch (error) {
      throw error + " in table: product_category";
    }
  }
  async updatePriceListFromApi(data, second_charge: boolean = false) {
    try {
      let prices: Array<Price> = [];
      for (let price_data of data['price']) {
        let price = new Price();

        if (!second_charge || (price_data.sync_status_id == 1)) {
          price.id = price_data.id;
          price.date_created = this.getTimestamp(price_data.date_created);
          price.date_updated = this.getTimestamp(price_data.date_updated);
          price.end_date = this.getTimestamp(price_data.end_date);
          price.start_date = this.getTimestamp(price_data.start_date);
          price.user_created = price_data.user_created;
          price.user_updated = price_data.user_updated;
          price.value = price_data.value;

          price.product = new Product();
          price.product.id = price_data.product_id;

          price.sync_status = new SyncStatus();
          price.sync_status.id = 1;

          prices.push(price);
        }
        if (second_charge && (price_data.sync_status_id == 2)) {
          let _repo = getRepository(Price);
          let sync_status_ = new SyncStatus();
          sync_status_.id = price_data.sync_status_id;
          let product_ = new Product();
          product_.id = price_data.product_id;

          await _repo
            .createQueryBuilder('x')
            .update({
              date_created: this.getTimestamp(price_data.date_created),
              date_updated: this.getTimestamp(price_data.date_updated),
              end_date: this.getTimestamp(price_data.end_date),
              start_date: this.getTimestamp(price_data.start_date),
              user_created: price_data.user_created,
              user_updated: price_data.user_updated,
              value: price_data.value,

              sync_status: sync_status_,
              product: product_,
            })
            .where('id = :id', { id: price_data.id })
            .execute();
        }
        if (second_charge && (price_data.sync_status_id == 3)) {
          let _repo = getRepository(Price);
          let obj_found = await _repo.findOne({ id: price_data.id });

          await _repo.delete({ id: obj_found.id });
        }
      }
      if (prices.length >= 1)
        await this.syncData(prices, Price, ['product', 'sync_status']);
    }
    catch (error) {
      throw error + " in table: price";
    }
  }
  async updateQuestionnaireListFromApi(data, second_charge: boolean = false) {
    try {
      let questionnaires: Array<Questionnaire> = [];
      for (let questionnaire_data of data['questionnaire']) {
        let questionnaire = new Questionnaire();

        if (!second_charge || (questionnaire_data.sync_status_id == 1)) {
          questionnaire.id = questionnaire_data.id;
          questionnaire.label = questionnaire_data.label;
          questionnaire.enabled = questionnaire_data.enabled;
          questionnaire.user_created = questionnaire_data.user_created;
          questionnaire.user_updated = questionnaire_data.user_updated;
          questionnaire.date_created = this.getTimestamp(questionnaire_data.date_created);
          questionnaire.date_updated = this.getTimestamp(questionnaire_data.date_updated);

          questionnaire.client = new Client();
          questionnaire.client.id = questionnaire_data.client_id;

          questionnaire.itinerary_type = new ItineraryType();
          questionnaire.itinerary_type.id = questionnaire_data.itinerary_type_id;

          questionnaire.questionnaire_type = new QuestionnaireType();
          questionnaire.questionnaire_type.id = questionnaire_data.questionnaire_type_id;

          questionnaire.sync_status = new SyncStatus();
          questionnaire.sync_status.id = 1;

          questionnaires.push(questionnaire);
        }
        if (second_charge && (questionnaire_data.sync_status_id == 2)) {
          let _repo = getRepository(Questionnaire);
          let sync_status_ = new SyncStatus();
          sync_status_.id = questionnaire_data.sync_status_id;
          let client_ = new Client();
          client_.id = questionnaire_data.client_id;
          let questionnaire_type_ = new QuestionnaireType();
          questionnaire_type_.id = questionnaire_data.questionnaire_type_id;
          let itinerary_type_ = new ItineraryType();
          itinerary_type_.id = questionnaire_data.itinerary_type_id;

          await _repo
            .createQueryBuilder('x')
            .update({
              label: questionnaire_data.label,
              enabled: questionnaire_data.enabled,
              user_created: questionnaire_data.user_created,
              user_updated: questionnaire_data.user_updated,
              date_created: this.getTimestamp(questionnaire_data.date_created),
              date_updated: this.getTimestamp(questionnaire_data.date_updated),

              sync_status: sync_status_,
              itinerary_type: itinerary_type_,
              client: client_,
              questionnaire_type: questionnaire_type_
            })
            .where('id = :id', { id: questionnaire_data.id })
            .execute();
        }
        if (second_charge && (questionnaire_data.sync_status_id == 3)) {
          let _repo = getRepository(Questionnaire);
          let sync_status_repo = getRepository(SyncStatus);

          let obj_found = await _repo
            .createQueryBuilder('x')
            .leftJoinAndSelect('x.questions', 'questions')
            .where('x.id = :id', { id: questionnaire_data.id })
            .getOne();

          // si no existe relacion entonces borramos
          if (
            (obj_found.questions.length == 0)
          ) {
            await _repo.delete({ id: obj_found.id });
          }
          // Sino, actualizamos el sync_status para indicar que no debe ser borrado
          else {
            let now = moment.utc().unix() * 1000;
            let sync_status_ = await sync_status_repo.findOne({ id: 2 });
            await _repo.createQueryBuilder('x')
              .update({ sync_status: sync_status_, date_updated: now })
              .where("id = :id_", { id_: obj_found.id });
          }
        }
      }
      if (questionnaires.length >= 1)
        await this.syncData(questionnaires, Questionnaire, ['client', 'itinerary_type']);
    }
    catch (error) {
      throw error + " in table: questionnaire";
    }
  }
  async updateQuestionListFromApi(data, second_charge: boolean = false) {
    try {
      let questions: Array<Questions> = [];
      for (let question_data of data['question']) {
        let question = new Questions();

        if (!second_charge || (question_data.sync_status_id == 1)) {
          question.id = question_data.id;
          question.label = question_data.label;
          question.date_created = this.getTimestamp(question_data.date_created);
          question.date_updated = this.getTimestamp(question_data.date_updated);
          question.user_created = question_data.user_created;
          question.user_updated = question_data.user_updated;

          question.questionnaire = new Questionnaire();
          question.questionnaire.id = question_data.questionnaire_id;

          question.question_type = new QuestionType();
          question.question_type.id = question_data.question_type_id;

          question.sync_status = new SyncStatus();
          question.sync_status.id = 1;

          questions.push(question);
        }
        if (second_charge && (question_data.sync_status_id == 2)) {
          let _repo = getRepository(Questions);
          let sync_status_ = new SyncStatus();
          sync_status_.id = question_data.sync_status_id;
          let questionnaire_ = new Questionnaire();
          questionnaire_.id = question_data.questionnaire_id;
          let question_type_ = new QuestionType();
          question_type_.id = question_data.question_type_id;

          await _repo
            .createQueryBuilder('x')
            .update({
              label: question_data.label,
              date_created: this.getTimestamp(question_data.date_created),
              date_updated: this.getTimestamp(question_data.date_updated),
              user_created: question_data.user_created,
              user_updated: question_data.user_updated,

              sync_status: sync_status_,
              questionnaire: questionnaire_,
              question_type: question_type_
            })
            .where('id = :id', { id: question_data.id })
            .execute();
        }
        if (second_charge && (question_data.sync_status_id == 3)) {
          let _repo = getRepository(Questions);
          let sync_status_repo = getRepository(SyncStatus);

          let obj_found = await _repo
            .createQueryBuilder('x')
            .leftJoinAndSelect('x.answer', 'answer')
            .where('x.id = :id', { id: question_data.id })
            .getOne();

          // si no existe relacion entonces borramos
          if (
            (obj_found.answer.length == 0)
          ) {
            await _repo.delete({ id: obj_found.id });
          }
          // Sino, actualizamos el sync_status para indicar que no debe ser borrado
          else {
            let now = moment.utc().unix() * 1000;
            let sync_status_ = await sync_status_repo.findOne({ id: 2 });
            await _repo.createQueryBuilder('x')
              .update({ sync_status: sync_status_, date_updated: now })
              .where("id = :id_", { id_: obj_found.id });
          }
        }
      }
      if (questions.length >= 1)
        await this.syncData(questions, Questions, ['questionnaire', 'question_type', 'sync_status']);
    }
    catch (error) {
      throw error + " in table: question";
    }
  }
  async updatePaymentMethodListFromApi(data, second_charge: boolean = false) {
    try {
      let payment_methods: Array<PaymentMethod> = [];
      for (let payment_method_data of data['payment_method']) {
        if (!second_charge || (payment_method_data.sync_status_id == 1)) {
          let payment_method = new PaymentMethod();
          payment_method.id = payment_method_data.id;
          payment_method.name = payment_method_data.name;
          /* payment_method.date_created = this.getTimestamp(payment_method_data.date_created);
          payment_method.date_updated = this.getTimestamp(payment_method_data.date_updated);
          payment_method.user_created = payment_method_data.user_created;
          payment_method.user_updated = payment_method_data.user_updated; */

          payment_method.client = new Client();
          payment_method.client.id = payment_method_data.client_id;

          payment_method.sync_status = new SyncStatus();
          payment_method.sync_status.id = 1;

          payment_methods.push(payment_method);
        }
        if (second_charge && (payment_method_data.sync_status_id == 2)) {
          let _repo = getRepository(PaymentMethod);
          let sync_status_ = new SyncStatus();
          sync_status_.id = payment_method_data.sync_status_id;

          let client_ = new Client();
          client_.id = payment_method_data.client_id;

          await _repo
            .createQueryBuilder('x')
            .update({
              name: payment_method_data.name,
              /* date_created : this.getTimestamp(payment_method_data.date_created),
              date_updated : this.getTimestamp(payment_method_data.date_updated),
              user_created : payment_method_data.user_created,
              user_updated : payment_method_data.user_updated, */

              sync_status: sync_status_,
              client: client_
            })
            .where('id = :id', { id: payment_method_data.id })
            .execute();
        }
        if (second_charge && (payment_method_data.sync_status_id == 3)) {
          let _repo = getRepository(PaymentMethod);
          let sync_status_repo = getRepository(SyncStatus);

          let obj_found = await _repo
            .createQueryBuilder('x')
            .leftJoinAndSelect('x.invoices', 'invoices')
            .where('x.id = :id', { id: payment_method_data.id })
            .getOne();

          // si no existe relacion entonces borramos
          if (
            (obj_found.invoices.length == 0)
          ) {
            await _repo.delete({ id: obj_found.id });
          }
          // Sino, actualizamos el sync_status para indicar que no debe ser borrado
          else {
            let sync_status_ = await sync_status_repo.findOne({ id: 2 });
            await _repo.createQueryBuilder('x')
              .update({ sync_status: sync_status_ })
              .where("id = :id_", { id_: obj_found.id });
          }
        }
      }
      if (payment_methods.length >= 1)
        await this.syncData(payment_methods, PaymentMethod, ['client', "sync_status"]);
    }
    catch (error) {
      throw error + " in table: payment";
    }
  }

  async syncData(entities: Array<any>, entityClass: any, relations: Array<string>) {
    if (entities.length == 0) {
      return;
    }

    let repo = getRepository(entityClass);
    let entityProperties = Object.getOwnPropertyNames(entities[0]);
    console.log(entityProperties);

    let optimousChunckSize = Math.floor(999 / entityProperties.length);

    for (let ii = 0; ii < Math.ceil(entities.length / optimousChunckSize); ii++) {
      let chunck = entities.slice(ii * optimousChunckSize, (ii + 1) * optimousChunckSize);
      let query = repo.createQueryBuilder()
        .insert()
        .into(entityClass)
        .values(chunck);

      let queryAndParameters = query.getQueryAndParameters();
      await repo.manager.query("INSERT OR IGNORE " + queryAndParameters[0].slice(6), queryAndParameters[1]);

      let queryBuilder = repo.createQueryBuilder('c');

      for (let relation of relations) {
        queryBuilder = queryBuilder.leftJoinAndSelect("c." + relation, relation);
      }

      try {
        let dbEntities = await queryBuilder
          .whereInIds(chunck.map(entity => entity.id))
          .getMany();

        let entitiesToUpdate = chunck.filter((serverEntity: any) => {
          let matchingDbEntity: any = dbEntities.find((dbEntity: any) => dbEntity.id == serverEntity.id);

          let areEqual: boolean = true;
          for (let prop of entityProperties) {
            if (typeof matchingDbEntity[prop] != "object") {
              // comprobar directamente
              areEqual = matchingDbEntity[prop] == serverEntity[prop];
            } else if (matchingDbEntity[prop] !== undefined) {
              // comprobar mediante el id
              areEqual = matchingDbEntity[prop].id == serverEntity[prop].id;
            }

            if (!areEqual) {
              break;
            }
          }

          return matchingDbEntity !== undefined && !areEqual;
        });

        for (let entity of entitiesToUpdate) {
          await repo.update({ id: entity.id }, entity);
        }
      } catch (error) {
        throw error + " in syncData";
      }
    }
  }

  async generateCustomerContactForApi(data, from_db: boolean = false) {
    let customer_contact_data: any;
    try {
      let customer_contact_repo = getRepository(CustomerContact);

      if (!from_db) {
        customer_contact_data = data;
      }
      else {
        customer_contact_data = await customer_contact_repo.createQueryBuilder('cc')
          .leftJoinAndSelect('cc.customer', 'customer')
          .leftJoinAndSelect('cc.sync_status', 'sync_status')
          .where('cc.id = :id', { id: data.id })
          .getOne();
      }

      customer_contact_data.customer_id = customer_contact_data.customer.id;
      customer_contact_data.date_created = moment.utc(customer_contact_data.date_created).format("YYYY-MM-DD HH:mm:ss");
      customer_contact_data.date_updated = moment.utc(customer_contact_data.date_updated).format("YYYY-MM-DD HH:mm:ss");
      customer_contact_data.sync_status_id = customer_contact_data.sync_status.id;
      return { status: 'ok', data: customer_contact_data };
    } catch (error) {
      return { status: error, data: data };
    }
  }

  async generateCustomerForApi(data, from_db: boolean = false) {
    let customer_data: any;
    try {
      let customer_repo = getRepository(Customer);

      if (!from_db) {
        customer_data = data;
      }
      else {
        customer_data = await customer_repo.createQueryBuilder('c')
          .leftJoinAndSelect('c.city', 'city')
          .leftJoinAndSelect('cc.sync_status', 'sync_status')
          .where('c.id =:id', { id: data.id })
          .getOne();
      }

      customer_data.city_id = customer_data.city.id;
      customer_data.date_created = moment.utc(customer_data.date_created).format("YYYY-MM-DD HH:mm:ss");
      customer_data.date_updated = moment.utc(customer_data.date_updated).format("YYYY-MM-DD HH:mm:ss");
      customer_data.sync_status_id = customer_data.sync_status.id;
      return { status: 'ok', data: customer_data };
    } catch (error) {
      return { status: error, data: data };
    }
  }

  async generateExpenseForApi(data, from_db: boolean = false) {
    let expense_data: any;
    try {
      let expense_repo = getRepository(Expense);
      let img_atteched: any = "";
      if (!from_db) {
        expense_data = data;
      }
      else {
        expense_data = await expense_repo.createQueryBuilder('x')
          .leftJoinAndSelect('x.itinerary', 'itinerary')
          .leftJoinAndSelect('x.sync_status', 'sync_status')
          .where('x.id = :id', { id: data.id })
          .getOne();
      }

      //if (expense_data.atteched.length > 2)
      img_atteched = await this.buildImageToSend(expense_data.id, 'expense');
      let newFormData = new FormData();
      newFormData.append("item", expense_data.item);
      newFormData.append("value", expense_data.value);
      newFormData.append("description", expense_data.description);
      newFormData.append('atteched', img_atteched, expense_data.id + ".jpg");
      newFormData.append("user_created", expense_data.user_created);
      newFormData.append("user_updated", expense_data.user_updated);
      newFormData.append("date_created", moment.utc(expense_data.date_created).format("YYYY-MM-DD HH:mm:ss"));
      newFormData.append("date_updated", moment.utc(expense_data.date_updated).format("YYYY-MM-DD HH:mm:ss"));
      newFormData.append("itinerary_id", expense_data.itinerary.id);
      newFormData.append("sync_status_id", expense_data.sync_status.id);
      return { status: 'ok', data: newFormData };
      /* expense_data.date_created = moment.utc(expense_data.date_created).format("YYYY-MM-DD HH:mm:ss");
      expense_data.date_updated = moment.utc(expense_data.date_updated).format("YYYY-MM-DD HH:mm:ss");
      expense_data.itinerary_id = expense_data.itinerary.id;
      expense_data.sync_status_id = expense_data.sync_status.id;

      return { status: 'ok', data: expense_data }; */
    } catch (error) {
      return { status: error, data: data };
    }
  }

  async generateInvoiceForApi(data, from_db: boolean = false) {
    let invoice_data: any;
    try {
      let invoice_repo = getRepository(Invoice);

      if (!from_db) {
        invoice_data = data;
      }
      else {
        invoice_data = await invoice_repo.createQueryBuilder('')
          .leftJoinAndSelect('x.payment_method', 'payment_method')
          .leftJoinAndSelect('x.customer', 'customer')
          .leftJoinAndSelect('x.itinerary', 'itinerary')
          .leftJoinAndSelect('x.sync_status', 'sync_status')
          .leftJoinAndSelect('x.city', 'city')
          .where('x.id = :id', { id: data.id })
          .getOne();
      }

      invoice_data.payment_method_id = invoice_data.payment_method.id;
      invoice_data.customer_id = invoice_data.customer.id;
      invoice_data.itinerary_id = invoice_data.itinerary.id;
      invoice_data.city_id = invoice_data.city.id;
      invoice_data.date_created = moment.utc(invoice_data.date_created).format("YYYY-MM-DD HH:mm:ss");
      invoice_data.date_updated = moment.utc(invoice_data.date_updated).format("YYYY-MM-DD HH:mm:ss");
      invoice_data.order_date_time = moment.utc(invoice_data.order_date_time).format("YYYY-MM-DD HH:mm:ss");
      invoice_data.delivery_date_time = moment.utc(invoice_data.delivery_date_time).format("YYYY-MM-DD HH:mm:ss");
      invoice_data.sync_status_id = invoice_data.sync_status.id;

      console.log("data!!", invoice_data);
      return { status: 'ok', data: invoice_data };
    } catch (error) {
      return { status: error, data: data };
    }
  }

  async generateInvoiceProductForApi(data, from_db: boolean = false) {
    let invoice_product_data: any;
    try {
      let invoice_product_repo = getRepository(InvoiceProduct);

      if (!from_db) {
        invoice_product_data = data;
        invoice_product_data.invoice_id = invoice_product_data.invoices.id;
        invoice_product_data.product_id = invoice_product_data.product.id;
        invoice_product_data.sync_status_id = invoice_product_data.sync_status.id;
      }
      else {
        let sql: string = "SELECT * FROM invoice_product where "
          + ' invoicesid = "' + data.invoices.id + '"'
          + ' and productid = "' + data.product.id + '"'
          + 'left join sync_status on id = sync_statusid'
          ;
        let response: any = await invoice_product_repo.manager.query(sql);

        invoice_product_data = response[0];
        invoice_product_data.invoice_id = invoice_product_data.invoicesId;
        invoice_product_data.product_id = invoice_product_data.productId;
        invoice_product_data.sync_status_id = invoice_product_data.syncStatusId;
      }

      console.log(invoice_product_data);

      invoice_product_data.date_created = moment.utc(invoice_product_data.date_created).format("YYYY-MM-DD HH:mm:ss");
      invoice_product_data.date_updated = moment.utc(invoice_product_data.date_updated).format("YYYY-MM-DD HH:mm:ss");

      return { status: 'ok', data: invoice_product_data };
    } catch (error) {
      return { status: error, data: invoice_product_data };
    }
  }

  //Generamos la data como utc
  async generateItineraryForApi(data: any, from_db: boolean = false) {
    let itinerary_data: any;
    try {
      let itinerary_repo = getRepository(Itinerary);
      if (!from_db) {
        itinerary_data = data;
      }
      else {
        itinerary_data = await itinerary_repo.createQueryBuilder('i')
          .leftJoinAndSelect('i.itinerary_type', 'itinerary_type')
          .leftJoinAndSelect('i.customer', 'customer')
          .leftJoinAndSelect('i.customer_contact', 'customer_contact')
          .leftJoinAndSelect('i.city', 'city')
          .leftJoinAndSelect('i.status', 'status')
          .leftJoinAndSelect('i.invoice', 'invoice')
          .leftJoinAndSelect('i.sync_status', 'sync_status')
          .where('i.id = :id', { id: data.id })
          .getOne();
      }

      itinerary_data.date_created = moment.utc(itinerary_data.date_created).format("YYYY-MM-DD HH:mm:ss");
      itinerary_data.date_updated = moment.utc(itinerary_data.date_updated).format("YYYY-MM-DD HH:mm:ss");
      itinerary_data.date_time = moment.utc(itinerary_data.date_time).format("YYYY-MM-DD HH:mm:ss");

      itinerary_data.itinerary_type_id = itinerary_data.itinerary_type.id;
      itinerary_data.city_id = itinerary_data.city.id;
      if (itinerary_data.invoice != null)
        itinerary_data.invoice_id = itinerary_data.invoice.id;
      itinerary_data.status_id = itinerary_data.status.id;
      itinerary_data.customer_id = itinerary_data.customer.id;
      itinerary_data.customer_contact_id = itinerary_data.customer_contact.id;
      itinerary_data.sync_status_id = itinerary_data.sync_status.id;

      return { status: 'ok', data: itinerary_data };
    } catch (error) {
      return { status: error, data: data };
    }
  }

  async generateWorkdayForApi(data: any, from_db: boolean = false) {
    let workday_data: any;
    try {
      let workday_repo = getRepository(Workday);

      if (!from_db) {
        workday_data = data;
      }
      else {
        workday_data = await workday_repo.createQueryBuilder('i')
          .leftJoinAndSelect('i.user', 'user')
          .leftJoinAndSelect('i.sync_status', 'sync_status')
          .where('i.id = :id', { id: data.id })
          .getOne();
      }
      workday_data.user_id = workday_data.user.id;
      workday_data.date_created = moment.utc(workday_data.date_created).format("YYYY-MM-DD HH:mm:ss");
      workday_data.date_updated = moment.utc(workday_data.date_updated).format("YYYY-MM-DD HH:mm:ss");
      workday_data.start_date = moment.utc(workday_data.start_date).format("YYYY-MM-DD HH:mm:ss");
      workday_data.end_date = moment.utc(workday_data.end_date).format("YYYY-MM-DD HH:mm:ss");
      workday_data.sync_status_id = workday_data.sync_status.id;

      return { status: 'ok', data: workday_data };
    } catch (error) {
      return { status: error, data: data };
    }
  }

  async generateAnswerForApi(data: any, from_db: boolean = false) {
    let answer_data: any;
    try {
      let answer_repo = getRepository(Answer);
      if (!from_db) {
        answer_data = data;
      }
      else {
        answer_data = await answer_repo.createQueryBuilder('i')
          .leftJoinAndSelect('i.itinerary', 'itinerary')
          .leftJoinAndSelect('i.questions', 'questions')
          .leftJoinAndSelect('i.sync_status', 'sync_status')
          .where('i.id = :id', { id: data.id })
          .getOne();
      }
      answer_data.question_id = answer_data.questions.id;
      answer_data.itinerary_id = answer_data.itinerary.id;
      answer_data.date_created = moment.utc(answer_data.date_created).format("YYYY-MM-DD HH:mm:ss");
      answer_data.date_updated = moment.utc(answer_data.date_updated).format("YYYY-MM-DD HH:mm:ss");
      answer_data.sync_status_id = answer_data.sync_status.id;

      return { status: 'ok', data: answer_data };
    } catch (error) {
      return { status: error, data: data };
    }
  }

  async generateClientForApi(data: any) {
    try {
      return { status: 'ok', data: data };
    } catch (error) {
      return { status: error, data: data };
    }
  }

  async generateUserForApi(data: any, from_db: boolean = false) {
    try {
      let _repo = getRepository(User);
      let user_data: any;

      if (!from_db) {
        user_data = data;
      }
      else {
        user_data = await _repo.createQueryBuilder('i')
          .leftJoinAndSelect('i.role', 'role')
          .leftJoinAndSelect('i.client', 'client')
          .leftJoinAndSelect('i.sync_status', 'sync_status')
          .where('i.id = :id', { id: data.id })
          .getOne();
      }

      user_data.date_created = moment.utc(user_data.date_created).format("YYYY-MM-DD HH:mm:ss");
      user_data.date_updated = moment.utc(user_data.date_updated).format("YYYY-MM-DD HH:mm:ss");
      user_data.client_id = user_data.client.id;
      user_data.role_id = user_data.role.id;
      user_data.sync_status_id = user_data.sync_status.id;

      return { status: 'ok', data: user_data };
    } catch (error) {
      return { status: error, data: data };
    }
  }

  /**
   * Funcion encargada de enviar toda la data que por motivos de falla de conexion no se enviaron
   * @param from_db booleano para indicar si construir la data desde la bd o a partir del objeto ingresado
   */
  async sendPostDataToServer(from_db: boolean = true) {
    let expense_repo = getRepository(Expense);
    let itinerary_repo = getRepository(Itinerary);
    let customer_repo = getRepository(Customer);
    let customer_contact_repo = getRepository(CustomerContact);
    let answer_repo = getRepository(Answer);
    let client_repo = getRepository(Client);
    let workday_repo = getRepository(Workday);
    let invoice_repo = getRepository(Invoice);
    let invoice_product_repo = getRepository(InvoiceProduct);
    let user_repo = getRepository(User);

    let array_of_data: any = {};
    let array_of_expense: Array<any> = [];
    let array_of_itinerary: Array<any> = [];
    let array_of_customer: Array<any> = [];
    let array_of_customer_contact: Array<any> = [];
    let array_of_answer: Array<any> = [];
    let array_of_client: Array<any> = [];
    let array_of_workday: Array<any> = [];
    let array_of_invoice: Array<any> = [];
    let array_of_invoice_product: Array<any> = [];
    let array_of_user: Array<any> = [];
    let date_last_sync = await this.getDateLastAsync();
    date_last_sync = date_last_sync * 1000;

    let data_to_send: Array<any> = await expense_repo
      .createQueryBuilder('query')
      .where('query.date_updated > :date_last_sync', { date_last_sync: date_last_sync })
      .getMany();
    for (let data of data_to_send)
      array_of_expense.push(await this.generateExpenseForApi(data, from_db));

    if (array_of_expense.length > 0)
      array_of_data.expense = array_of_expense;

    data_to_send = [];

    data_to_send = await itinerary_repo
      .createQueryBuilder('query')
      .where('query.date_updated > :date_last_sync', { date_last_sync: date_last_sync })
      .getMany();
    for (let data of data_to_send)
      array_of_itinerary.push(await this.generateItineraryForApi(data, from_db));

    if (array_of_itinerary.length > 0)
      array_of_data.itinerary = array_of_itinerary;

    data_to_send = [];
    data_to_send = await customer_repo
      .createQueryBuilder('query')
      .where('query.date_updated > :date_last_sync', { date_last_sync: date_last_sync })
      .getMany();
    for (let data of data_to_send)
      array_of_customer.push(await this.generateCustomerForApi(data, from_db));

    if (array_of_customer.length > 0)
      array_of_data.customer = array_of_customer;

    data_to_send = [];
    data_to_send = await customer_contact_repo
      .createQueryBuilder('query')
      .where('query.date_updated > :date_last_sync', { date_last_sync: date_last_sync })
      .getMany();
    for (let data of data_to_send)
      array_of_customer_contact.push(await this.generateCustomerContactForApi(data, from_db));

    if (array_of_customer_contact.length > 0)
      array_of_data.customer_contact = array_of_customer_contact;

    data_to_send = [];
    data_to_send = await answer_repo
      .createQueryBuilder('query')
      .where('query.date_updated > :date_last_sync', { date_last_sync: date_last_sync })
      .getMany();
    for (let data of data_to_send)
      array_of_answer.push(await this.generateAnswerForApi(data, from_db));

    if (array_of_answer.length > 0)
      array_of_data.answer = array_of_answer;

    data_to_send = [];
    data_to_send = await client_repo
      .createQueryBuilder('query')
      .where('query.date_updated > :date_last_sync', { date_last_sync: date_last_sync })
      .getMany();
    for (let data of data_to_send)
      array_of_client.push(await this.generateClientForApi(data));

    if (array_of_client.length > 0)
      array_of_data.client = array_of_client;

    data_to_send = [];
    data_to_send = await workday_repo
      .createQueryBuilder('query')
      .where('query.date_updated > :date_last_sync', { date_last_sync: date_last_sync })
      .getMany();
    for (let data of data_to_send)
      array_of_workday.push(await this.generateWorkdayForApi(data, from_db));

    if (array_of_workday.length > 0)
      array_of_data.workday = array_of_workday;

    data_to_send = [];
    data_to_send = await invoice_repo
      .createQueryBuilder('query')
      .where('query.date_updated > :date_last_sync', { date_last_sync: date_last_sync })
      .getMany();
    for (let data of data_to_send)
      array_of_invoice.push(await this.generateInvoiceForApi(data, from_db));

    if (array_of_invoice.length > 0)
      array_of_data.invoice = array_of_invoice;

    data_to_send = [];
    data_to_send = await invoice_product_repo
      .createQueryBuilder('query')
      .where('query.date_updated > :date_last_sync', { date_last_sync: date_last_sync })
      .getMany();
    for (let data of data_to_send)
      array_of_invoice_product.push(await this.generateInvoiceProductForApi(data, from_db));

    if (array_of_invoice_product.length > 0)
      array_of_data.invoice_product = array_of_invoice_product;

    data_to_send = [];
    data_to_send = await user_repo
      .createQueryBuilder('query')
      .where('query.date_updated > :date_last_sync', { date_last_sync: date_last_sync })
      .getMany();
    for (let data of data_to_send)
      array_of_user.push(await this.generateUserForApi(data, from_db));

    if (array_of_user.length > 0)
      array_of_data.user = array_of_user;

    return array_of_data;
  }

  /**
   * Actualizamos la data local asi como tambien la fecha de ultima actualizacion
   */
  async updateLocalData(data) {
    let itinerary_repo = getRepository(Itinerary);
    let expense_repo = getRepository(Expense);
    let customer_repo = getRepository(Customer);
    let customer_contact_repo = getRepository(CustomerContact);
    // let client_repo = getRepository(Client);
    let workday_repo = getRepository(Workday);
    let invoice_repo = getRepository(Invoice);
    let invoice_product_repo = getRepository(InvoiceProduct);
    let user_repo = getRepository(User);
    let now = moment.utc().unix() * 1000;

    this.storage.set('date_last_sync', moment().unix() * 1000);

    for (let item of data.itinerary) {
      await itinerary_repo.createQueryBuilder('i')
        .update({ date_updated: now })
        .where("id = :id", { id: item.id })
        .execute();
    }

    for (let item of data.expense) {
      await expense_repo.createQueryBuilder('i')
        .update({ date_updated: now })
        .where("id = :id", { id: item.id })
        .execute();
    }

    for (let item of data.customer) {
      await customer_repo.createQueryBuilder('i')
        .update({ date_updated: now })
        .where("id = :id", { id: item.id })
        .execute();
    }

    for (let item of data.customer_contact) {
      await customer_contact_repo.createQueryBuilder('i')
        .update({ date_updated: now })
        .where("id = :id", { id: item.id })
        .execute();
    }

    /* for (let item of data.client) {
      await client_repo.createQueryBuilder('i')
        .update({ date_updated: now })
        .where("id = :id", { id: item.id })
        .execute();
    } */

    for (let item of data.workday) {
      await workday_repo.createQueryBuilder('i')
        .update({ date_updated: now })
        .where("id = :id", { id: item.id })
        .execute();
    }

    for (let item of data.invoice) {
      await invoice_repo.createQueryBuilder('i')
        .update({ date_updated: now })
        .where("id = :id", { id: item.id })
        .execute();
    }

    for (let item of data.invoice_product) {
      await invoice_product_repo.createQueryBuilder('i')
        .update({ date_updated: now })
        .where("id = :id", { id: item.id })
        .execute();
    }

    for (let item of data.user) {
      await user_repo.createQueryBuilder('i')
        .update({ date_updated: now })
        .where("id = :id", { id: item.id })
        .execute();
    }
  }

  /**
   * Funcion encargada de devolver la ultima sincronizacion realizada
   */
  async getDateLastAsync() {
    return this.storage.get('date_last_sync').then(date => {
      return date;
    });
  }

  /**
   * Funcion encargada de actualizar la ultima sincronizacion realizada
   */
  async setDateLastAsync() {
    let now = moment.utc().unix();
    this.storage.set('date_last_sync', now);
  }

  /**
   * Funcion encargda de crear en la carpeta local de sistema el archivo que se esta recibiendo por la api
   * 
   * @param data_route_for_image ruta del dato enviado compuesto por donde existe(alojado), su tipo y a donde solicitarla(buscarla)
   * @param entity string con el nombre de la entidad bajo el cual se creara el directorio
   * @param file_name string identificador del objeto que se estara creando
   */
  async saveImageInDevice(data_route_for_image: string, entity: string, file_name: string) {
    let credentials = this.getCredentials();
    let url_directory: string = this.appConfig.apiBaseUrl + this.appConfig.uploadsFile + entity + "s/" + file_name + "/";
    console.log(this.file.cacheDirectory);
    /*let exist_dir: boolean = await this.file.checkDir(this.file.cacheDirectory, entity);*/

    /* The atteched came like this.
    local;image/jpg;[/path/filename]
    url;[MIME];[filename guid].[extensión]*/
    let data_route_for_image2 = "";
    data_route_for_image = data_route_for_image2 = "url;image/jpg;https://cdn.slidesharecdn.com/profile-photo-Docker-96x96.jpg?cb=1518558524"
    let img_route: Array<string> = data_route_for_image.split(';');
    let mime_type: Array<string> = img_route[1].split('/');
    let image_name: string = /*img_route[2];*/file_name + "." + mime_type[1];
    let directory: string = this.file.cacheDirectory/* + entity*/;
    let img: any;

    try {
      /* if (!exist_dir) {
        await this.file.createDir(this.file.cacheDirectory, entity, false);
      } */

      if (img_route[0] == "url") {
        // let exist_blob = await this.file.checkFile(this.file.cacheDirectory /*+ entity*/, /*img_route[2]*/"27347958-d9c7-404b-93c9-468a0574253a" + ".jpg");
        // if (!exist_blob) {
        img = await this.http
            .get(img_route[2]/*url_directory + img_route[2]*/, { headers: credentials, responseType: 'blob' })
          .toPromise();
        // }
        // else {
        //   return "local;" + img_route[1] + ";" + directory + image_name;
        // }
      }
      else if (img_route[0] == "local") {
        // Aca solicitamos la construccion de la imagen
        img = await this.buildImageToSend(image_name, entity);
      }
      await this.file.writeFile(
        directory,
        image_name,
        img,
        { replace: true });
      return "local;" + img_route[1] + ";" + directory + image_name;
    }
    catch (error) {
      throw error + "trying to create file in directory: " + entity;
    }
  }

  /**
   * Funcion encargada de construir un blob en base al objeto(imagen/video/audio) existente en el dispositivo
   * 
   * @param file_name string con el nombre del archivo
   * @param entity string con el nombre de la entidad/carpeta donde se encuentra el archivo
   */
  async buildImageToSend(file_name: string, entity: string) {
    // let exist_file = await this.file.checkFile(this.file.cacheDirectory /*+ entity*/, /*file_name*/"27347958-d9c7-404b-93c9-468a0574253a" + ".jpg");
    let file: string;

    // if (exist_file) {
      file = await this.file.readAsBinaryString(this.file.cacheDirectory /*+ entity*/, /*file_name*/"27347958-d9c7-404b-93c9-468a0574253a" + ".jpg");
      return new Blob([file], { type: "imagen/jpg" });
    // }
    // console.log(exist_file);
    // return "";
  }

  /**
   * Funcion encargada de 
   * @param old_directory antigua ubicacion de la imagen
   * @param file_name nombre del archivo
   * @param entity nombre de la carpeta/entidad donde existe el archivo
   */
  async moveImageToFolderEntity(old_directory, file_name, entity) {
    let file = await this.file.readAsBinaryString(old_directory, file_name + ".jpg");
    let blob = new Blob([file], { type: "imagen/jpg" });
    let directory: string = this.file.cacheDirectory/* + entity*/;

    await this.file.moveFile(old_directory, file_name + ".jpg", directory, file_name + ".jpg");
  }

  async dropImageInDevice(entity, file_name) {
    await this.file.removeFile(this.file.cacheDirectory + entity, file_name + ".jpg");
  }
}

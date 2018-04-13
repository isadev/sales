import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { createConnection, getRepository } from 'typeorm'
import { TranslateService } from '@ngx-translate/core';

import { HomePage } from '../pages/home/home';
import { AppointmentInfoHeaderPage } from '../pages/itineraries/list-itinerary/appointment-info-header/appointment-info-header';
import { ViewPurchasePage } from '../pages/invoices/view-purchase/view-purchase';
import { ViewCustomerListPage } from '../pages/customers/view-customer-list/view-customer-list';
import { ViewProductsListPage } from '../pages/products/view-products-list/view-products-list';
import { ViewUserDetailPage } from '../pages/users/view-user-detail/view-user-detail';

import { City } from '../entities/City';
import { User } from '../entities/User';
import { Expense } from '../entities/Expense';
import { Questions } from '../entities/Questions';
import { Questionnaire } from '../entities/Questionnaire';
import { ItineraryType } from '../entities/ItineraryType';
import { Itinerary } from '../entities/Itinerary';
import { Customer } from '../entities/Customer';
import { Role } from '../entities/Role';
import { CustomerContact } from '../entities/CustomerContact';
import { Status } from '../entities/Status';
import { QuestionType } from '../entities/QuestionType';
import { Answer } from '../entities/Answer';
import { Client } from '../entities/Client';
import { PaymentMethod } from '../entities/PaymentMethod';
import { Workday } from '../entities/Workday';
import { Product } from '../entities/Product';
import { ProductCategory } from '../entities/ProductCategory';
import { Price } from '../entities/Price';
import { Invoice } from '../entities/Invoice';
import { InvoiceProduct } from '../entities/InvoiceProduct';
import { Province } from '../entities/Province';
import { Country } from '../entities/Country';
import { QuestionnaireType } from '../entities/QuestionnaireType';
import { SyncStatus } from '../entities/SyncStatus';
import { CustomerAssign } from '../entities/CustomerAssign';

import { AuthServiceProvider } from '../providers/auth-service/auth-service';
import { SharedMethodProvider } from '../providers/shared-method/shared-method';
import { SynchronousBackgroundProvider } from '../providers/synchronous-background/synchronous-background';
import { SynchronousForegroundProvider } from '../providers/synchronous-foreground/synchronous-foreground';

@Component({
  templateUrl: 'app.html'
})
export class IonicSalesMobile {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = HomePage;

  pages: Array<{ title: string, component: any, position }>;
  user_log: string;
  show_list: boolean = false;
  state_user_trans: string;
  state_user: string = "gone"

  constructor(
    public syncForeground: SynchronousForegroundProvider,
    public syncBackground: SynchronousBackgroundProvider,
    public events: Events,
    public auth: AuthServiceProvider,
    public sharedMethod: SharedMethodProvider,
    public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    private translateService: TranslateService
  ) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: "itinerary_menu_title", component: AppointmentInfoHeaderPage, position: 0 },
      { title: "invoice_menu_title", component: ViewPurchasePage, position: 1 },
      { title: "customer_menu_title", component: ViewCustomerListPage, position: 2 },
      { title: "product_menu_title", component: ViewProductsListPage, position: 3 },
      { title: "user_menu_title", component: ViewUserDetailPage, position: 4 },
      { title: "session_offline_title", component: HomePage, position: -1 }
    ];
  }

  initializeApp() {
    this.platform.ready().then(async () => {
      let locale = navigator.language.split('-')[0];
      //Language
      this.translateService.setDefaultLang(locale);
      this.translateService.use(locale);

      this.user_log = await this.translateService.get('user_log').toPromise();

      this.state_user_trans = await this.translateService.get('state_disconected').toPromise();

      let state = await this.sharedMethod.getStateUser();
      this.state_user = state;

      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide(); //TODO: no comentar para elimianr el logo de la app cargando 

      await createConnection({
        type: 'cordova',
        database: 'test',
        location: 'default',
        logging: ['error', 'query', 'schema'],
        synchronize: true,
        entities: [
          City,
          Expense,
          Questions,
          Questionnaire,
          ItineraryType,
          Itinerary,
          Customer,
          Role,
          CustomerContact,
          Status,
          QuestionType,
          Answer,
          Client,
          PaymentMethod,
          User,
          Workday,
          Product,
          ProductCategory,
          Price,
          Invoice,
          InvoiceProduct,
          Province,
          Country,
          QuestionnaireType,
          SyncStatus,
          CustomerAssign
        ]
      });

      //Cambiar el estado del usuario a desconectado o ausente
      await this.sharedMethod.changeStatusUserAsync("gone");

      //Para inicializar la geolocalizacion
      await this.syncForeground.setGeolocation();

      // Eliminamos las notificaciones antiguas
      this.syncForeground.clearNotifications();

      //Configuramos la conexion con el background mode
      this.syncBackground.configure();

      if (this.platform.is('cordova')) {
        //Subscribe on pause
        this.platform.pause.subscribe(async () => {
          await this.sharedMethod.changeStatusUserAsync('gone');
          this.syncForeground.stopGeolocation();
        });

        //Subscribe on resume
        this.platform.resume.subscribe(async () => {
          window['paused'] = 0;
          let state = await this.sharedMethod.getStateUser();
          console.log(state);
          await this.sharedMethod.changeStatusUserAsync(state);
          this.state_user = state;
        });
      }
    });
  }

  async openPage(page) {
    let user_log = await this.sharedMethod.getUser();
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    if ( (page.position > -1) && (user_log.found) ) {
      if (page.position == 0)
        this.nav.setRoot(page.component, { from_demo: false });
      else
        this.nav.setRoot(page.component);
    }
    else {
      this.logout();
      this.nav.setRoot(HomePage);
    }
    /*this.nav.push(page.component); //para incluir ambos botones*/
  }

  showMenu(event) {
    this.show_list = !this.show_list;
  }
  async changeState(state) {
    if (state == 'active') {
      this.translateService.get('active').subscribe(response => {
        this.state_user_trans = response;
      });
      this.state_user = "active";
    } else if (state == 'gone') {
      this.translateService.get('gone').subscribe(response => {
        this.state_user_trans = response;
      });
    } else if (state == 'offline') {
      this.translateService.get('offline').subscribe(response => {
        this.state_user_trans = response;
      });
    }

    this.show_list = false;
    this.state_user = state;

    if (state == 'active') {
      this.syncForeground.startGeolocation();
    }
    else
      this.syncForeground.stopGeolocation();

    await this.sharedMethod.changeStatusUserAsync(state);
  }

  async logout() {
    this.syncForeground.stopItineraryInterval();
    this.sharedMethod.stopDataSync();
    this.auth.logout();
    this.rootPage = HomePage;
    await this.dropData();
  }

  async dropData() {
    let invoice_product_repo = getRepository(InvoiceProduct);
    let sql: string;

    sql = "DELETE FROM city";
    await invoice_product_repo.manager.query(sql);

    sql = "DELETE FROM expense";
    await invoice_product_repo.manager.query(sql);

    sql = "DELETE FROM questions";
    await invoice_product_repo.manager.query(sql);

    sql = "DELETE FROM questionnaire";
    await invoice_product_repo.manager.query(sql);

    sql = "DELETE FROM itinerary_type";
    await invoice_product_repo.manager.query(sql);

    sql = "DELETE FROM itinerary";
    await invoice_product_repo.manager.query(sql);

    sql = "DELETE FROM customer";
    await invoice_product_repo.manager.query(sql);

    sql = "DELETE FROM role";
    await invoice_product_repo.manager.query(sql);

    sql = "DELETE FROM customer_contact";
    await invoice_product_repo.manager.query(sql);

    sql = "DELETE FROM status";
    await invoice_product_repo.manager.query(sql);

    sql = "DELETE FROM question_type";
    await invoice_product_repo.manager.query(sql);

    sql = "DELETE FROM answer";
    await invoice_product_repo.manager.query(sql);

    sql = "DELETE FROM client";
    await invoice_product_repo.manager.query(sql);

    sql = "DELETE FROM payment_method";
    await invoice_product_repo.manager.query(sql);

    sql = "DELETE FROM user";
    await invoice_product_repo.manager.query(sql);

    sql = "DELETE FROM workday";
    await invoice_product_repo.manager.query(sql);

    sql = "DELETE FROM product";
    await invoice_product_repo.manager.query(sql);

    sql = "DELETE FROM product_category";
    await invoice_product_repo.manager.query(sql);

    sql = "DELETE FROM price";
    await invoice_product_repo.manager.query(sql);

    sql = "DELETE FROM invoice";
    await invoice_product_repo.manager.query(sql);

    sql = "DELETE FROM invoice_product";
    await invoice_product_repo.manager.query(sql);

    sql = "DELETE FROM province";
    await invoice_product_repo.manager.query(sql);

    sql = "DELETE FROM country";
    await invoice_product_repo.manager.query(sql);

    sql = "DELETE FROM questionnaire_type";
    await invoice_product_repo.manager.query(sql);
    
    sql = "DELETE FROM sync_status";
    await invoice_product_repo.manager.query(sql);

    sql = "DELETE FROM customer_assign";
    await invoice_product_repo.manager.query(sql);
  }
}

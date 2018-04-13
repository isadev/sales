import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { IonicSalesMobile } from './app.component';
import { HomePage } from '../pages/home/home';
import { StartSessionPage } from '../pages/session/start-session/start-session';

// Informacion para el listado de citas
import { AppointmentInfoHeaderPage } from '../pages/itineraries/list-itinerary/appointment-info-header/appointment-info-header';
import { AppointmentInfoDetailPage } from '../pages/itineraries/list-itinerary/appointment-info-detail/appointment-info-detail';
import { CreateAppointmentPage } from '../pages/itineraries/create-itinerary/create-appointment/create-appointment';
import { AppointmentStatusPage } from '../pages/itineraries/detail-itinerary/appointment-status/appointment-status';
import { FormularyAppointmentPage } from '../pages/itineraries/detail-itinerary/formulary-appointment/formulary-appointment';
//Para la visualizacion de los formularios
import { ViewFormularyPage } from '../pages/itineraries/detail-itinerary/view-formulary/view-formulary';
// Informacion para el detalle por usuario del listado de la cita
import { UserAppointmentHeaderPage } from '../pages/itineraries/detail-itinerary/user-appointment-header/user-appointment-header';
import { UserAppointmentDetailPage } from '../pages/itineraries/detail-itinerary/user-appointment-detail/user-appointment-detail';

//Para la visualizacin de invoices
import { ViewPurchasePage } from '../pages/invoices/view-purchase/view-purchase';
import { ViewPurchaseDetailPage } from '../pages/invoices/view-purchase-detail/view-purchase-detail';
import { ViewCreatePurchasePage } from '../pages/invoices/view-create-purchase/view-create-purchase';

// Para utilizar los observables (promesas)
import { HttpClientModule } from '@angular/common/http';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { AuthServiceProvider } from '../providers/auth-service/auth-service';

//Para la camara
import { Camera } from '@ionic-native/camera';

//Para la geolocalizacion
import { Geolocation } from '@ionic-native/geolocation';
import { DateServiceProvider } from '../providers/date-service/date-service';

// Para el manejo de la libreria moment
// import { MomentModule } from 'angular2-moment';

//Componentes
import { MultistepProgressBarComponent } from '../components/multistep-progress-bar/multistep-progress-bar';
import { PopOverMenuComponent } from '../components/pop-over-menu/pop-over-menu';

//Modal multifuncional
import { ModalsPage } from '../pages/modals/modals';

//Gastos
import { ViewCreateExpensePage } from '../pages/expenses/view-create-expense/view-create-expense';
import { ViewExpensesPage } from '../pages/expenses/view-expenses/view-expenses';
import { ViewExpensesDetailPage } from '../pages/expenses/view-expenses-detail/view-expenses-detail';

//Lista de productos
import { ViewProductsListPage } from '../pages/products/view-products-list/view-products-list';
import { ViewProductDetailPage } from '../pages/products/view-product-detail/view-product-detail';

//Lista de customer
import { ViewCustomerListPage } from '../pages/customers/view-customer-list/view-customer-list';
import { ViewCustomerDetailPage } from '../pages/customers/view-customer-detail/view-customer-detail';
import { ViewCustomerCreatePage } from '../pages/customers/view-customer-create/view-customer-create';
import { ViewCustomerContactListPage } from '../pages/customers/customer-contac/view-customer-contact-list/view-customer-contact-list';
import { ViewCustomerContactCreatePage } from '../pages/customers/customer-contac/view-customer-contact-create/view-customer-contact-create';
import { ViewCustomerContactPage } from '../pages/customers/customer-contac/view-customer-contact/view-customer-contact';

// Para el manejo de las traducciones
import { HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

//Para el manejo de material-icons
import { MaterialIconsModule } from 'ionic2-material-icons';

//Para manejar la verificacion de conexiones
import { CheckConectionProvider } from '../providers/check-conection/check-conection';
import { Network } from '@ionic-native/network';

//Para el listado de usuarios
import { ViewUserDetailPage } from '../pages/users/view-user-detail/view-user-detail';
import { ViewChangePasswordPage } from '../pages/users/view-change-password/view-change-password';
import { ViewProfileEditPage } from '../pages/users/view-profile-edit/view-profile-edit';

// Para el modulo de base de datos local
import { IonicStorageModule } from '@ionic/storage';

//Para las directivas
import { SwipeVerticallyDirective } from '../directives/swipe-vertically/swipe-vertically';

//Apis de las entidades
import { ProductCrudProvider } from '../providers/product-crud/product-crud';
import { InvoiceCrudProvider } from '../providers/invoice-crud/invoice-crud';
import { ItineraryCrudProvider } from '../providers/itinerary-crud/itinerary-crud';
import { ExpenseCrudProvider } from '../providers/expense-crud/expense-crud';
import { QuestionnaireCrudProvider } from '../providers/questionnaire-crud/questionnaire-crud';
import { CustomerCrudProvider } from '../providers/customer-crud/customer-crud';
import { SharedMethodProvider } from '../providers/shared-method/shared-method';
import { UserCrudProvider } from '../providers/user-crud/user-crud';
import { DatabaseCreateProvider } from '../providers/database-create/database-create';

//Api al servidor
import { RestApiProvider } from '../providers/rest-api/rest-api';

//Manejo de llamada desde la app
import { CallNumber } from '@ionic-native/call-number';
import { AlertGeneratorProvider } from '../providers/alert-generator/alert-generator';
import { SynchronousBackgroundProvider } from '../providers/synchronous-background/synchronous-background';
import { SynchronousForegroundProvider } from '../providers/synchronous-foreground/synchronous-foreground';

import { BackgroundMode } from '@ionic-native/background-mode';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { NotificationIdMapperProvider } from '../providers/notification-id-mapper/notification-id-mapper';

// Configuración del proyecto
import { APP_CONFIG, AppConfig } from './app.config';

import { File } from '@ionic-native/file';

@NgModule({
  declarations: [
    IonicSalesMobile,
    HomePage,
    StartSessionPage,
    AppointmentInfoHeaderPage,
    AppointmentInfoDetailPage,
    UserAppointmentHeaderPage,
    UserAppointmentDetailPage,
    CreateAppointmentPage,
    AppointmentStatusPage,
    FormularyAppointmentPage,
    ViewPurchasePage,
    ViewPurchaseDetailPage,
    ViewExpensesPage,
    ViewExpensesDetailPage,
    ModalsPage,
    ViewCreateExpensePage,
    ViewCreatePurchasePage,
    ViewProductsListPage,
    ViewCustomerListPage,
    ViewCustomerDetailPage,
    ViewCustomerContactPage,
    ViewCustomerCreatePage,
    ViewCustomerContactListPage,
    ViewCustomerContactCreatePage,
    ViewProductDetailPage,
    ViewUserDetailPage,
    ViewChangePasswordPage,
    ViewProfileEditPage,
    ViewFormularyPage,
    
    //Componentes
    MultistepProgressBarComponent,
    PopOverMenuComponent,

    //Directivas
    SwipeVerticallyDirective,
    
  ],
  imports: [
    MaterialIconsModule,
    BrowserModule,
    IonicModule.forRoot(IonicSalesMobile, {
      backButtonIcon: 'ios-arrow-back',
      backButtonText: "",
    }),
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
    IonicStorageModule.forRoot(),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    IonicSalesMobile,
    HomePage,
    StartSessionPage,
    AppointmentInfoHeaderPage,
    AppointmentInfoDetailPage,
    UserAppointmentHeaderPage,
    UserAppointmentDetailPage,
    CreateAppointmentPage,
    AppointmentStatusPage,
    FormularyAppointmentPage,
    ViewPurchasePage,
    ViewPurchaseDetailPage,
    ViewExpensesPage,
    ViewExpensesDetailPage,
    ModalsPage,
    ViewCreateExpensePage,
    ViewCreatePurchasePage,
    ViewProductsListPage,
    ViewCustomerListPage,
    ViewCustomerDetailPage,
    ViewCustomerContactPage,
    ViewCustomerCreatePage,
    ViewCustomerContactListPage,
    ViewCustomerContactCreatePage,
    ViewProductDetailPage,
    ViewUserDetailPage,
    ViewChangePasswordPage,
    ViewProfileEditPage,
    ViewFormularyPage,

    MultistepProgressBarComponent,
    PopOverMenuComponent,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    Camera,
    Geolocation,
    AuthServiceProvider,
    DateServiceProvider,
    CheckConectionProvider,
    Network,
    ProductCrudProvider,
    InvoiceCrudProvider,
    ItineraryCrudProvider,
    ExpenseCrudProvider,
    QuestionnaireCrudProvider,
    CustomerCrudProvider,
    SharedMethodProvider,
    UserCrudProvider,
    DatabaseCreateProvider,
    CallNumber,
    AlertGeneratorProvider,
    SynchronousBackgroundProvider,
    SynchronousForegroundProvider,
    BackgroundMode,
    LocalNotifications,
    NotificationIdMapperProvider,
    NotificationIdMapperProvider,
    {provide: APP_CONFIG, useValue: AppConfig},
    RestApiProvider,
    File
  ]
})
export class AppModule { }

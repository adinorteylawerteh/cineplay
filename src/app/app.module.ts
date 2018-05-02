import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { HttpModule } from '@angular/http';
import { Dialogs } from '@ionic-native/dialogs';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { VideoPlayer } from '@ionic-native/video-player';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { DeliveryPage } from '../pages/delivery/delivery';
import { PaymentsPage } from '../pages/payments/payments';
import { ListPage } from '../pages/list/list';
import { ProductPage } from '../pages/product/product';
import { CartPage } from '../pages/cart/cart';
import { LoginPage } from '../pages/login/login';
import { SignupPage } from '../pages/signup/signup';
import { CatPage } from '../pages/category/category';
import { ProfilePage } from '../pages/profile/profile';
import { SearchPage } from '../pages/search/search';
import { DealsPage } from '../pages/deals/deals';

import { OrdersPage } from '../pages/orders/orders';
import { DownloadsPage } from '../pages/downloads/downloads';
import { HelpPage } from '../pages/help/help';
import { EditProfilePage } from '../pages/editprofile/editprofile';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage,
    ProductPage,
    CartPage,
    LoginPage,
    SignupPage,
    CatPage,
    DeliveryPage,
    PaymentsPage,
    ProfilePage,
    OrdersPage,
    DownloadsPage,
    HelpPage,
    EditProfilePage,
    SearchPage,
    DealsPage,
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ListPage,
    ProductPage,
    CartPage,
    LoginPage,
    SignupPage,
    CatPage,
    DeliveryPage,
    PaymentsPage,
    ProfilePage,
    OrdersPage,
    DownloadsPage,
    HelpPage,
    EditProfilePage,
    SearchPage,
    DealsPage,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    SQLite,
    Dialogs,
    InAppBrowser,
    VideoPlayer,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}

import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { VideoPlayer } from '@ionic-native/video-player';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/timeout';

import { DeliveryPage } from '../pages/delivery/delivery';
import { PaymentsPage } from '../pages/payments/payments';
import { HomePage } from '../pages/home/home';
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

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = HomePage;

  pages: Array<{title: string, component: any, icon: any}>;
  categories: string[];
  homeplist: string[];
  is_logged: boolean;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, public http: Http, private sqlite: SQLite) {
    this.initializeApp();
    this.is_logged = false;
    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Home', component: HomePage, icon: 'ios-home-outline' },
      { title: 'Today\'s Deals', component: DealsPage, icon: 'ios-pricetags-outline' },
    ];


    this.getMenuCat();
    this.getHomeProd();

    setInterval(() => {
      this.checkLoggedIn();
    }, 300);

  //  this.createCartTable();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }


  checkLoggedIn() {
  this.sqlite.create({
    name: 'data.db',
    location: 'default'
  })
    .then((db: SQLiteObject) => {
    db.executeSql('CREATE TABLE IF NOT EXISTS dets (dets)', {})
      .then(() => console.log('Executed SQL'))
      .catch(e => console.log(e));

    db.executeSql('SELECT * FROM dets', [])
      .then(data => {
      console.log(data.rows.length);
      if(data.rows.length > 0) {
        this.is_logged = true;
      }

      })
      .catch(e => console.log(e));


    })
    .catch(e => console.log(e));
  }


  createCartTable() {
    this.sqlite.create({
      name: 'data.db',
      location: 'default'
    })
      .then((db: SQLiteObject) => {


        db.executeSql('CREATE TABLE IF NOT EXISTS mycart (product_id, product_name, sale_price)', {})
          .then(() => console.log('Executed SQL'))
          .catch(e => console.log(e));

          db.executeSql('CREATE TABLE IF NOT EXISTS dets (dets)', {})
            .then(() => console.log('Executed SQL'))
            .catch(e => console.log(e));


      })
      .catch(e => console.log(e));
  }

  getMenuCat() {
    return this.http.get(`https://app.arenagh.org/index.php/home/api_all_categories`)
    .map((res:Response) => res.json())
    .subscribe(
      data => {
        this.categories = data;
      },
      error => {
        console.log(error.data);
      });
  }

  getHomeProd() {
    return this.http.get(`https://app.arenagh.org/index.php/home/api_home_products`)
    .map((res:Response) => res.json())
    .subscribe(
      data => {
        this.homeplist = data;
      },
      error => {
        console.log(error.data);
      });
  }

  openCat(id,name) {
    this.nav.setRoot(CatPage, {
      catid: id,
      catname: name
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

  goSignup() {
    this.nav.push(SignupPage);
  }

  goLogin() {
    this.nav.push(LoginPage);
  }

  goProfile() {
    this.nav.push(ProfilePage);
  }


  logOut() {
    this.sqlite.deleteDatabase({
      name: 'data.db',
      location: 'default'
    })
      .then((db: SQLiteObject) => {
          this.createCartTable();
          this.is_logged = false;
          this.nav.setRoot(HomePage);

      })
      .catch(e => console.log(e));
  }
}

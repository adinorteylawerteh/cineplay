import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { NavParams } from 'ionic-angular';
import { Http, Response } from '@angular/http';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/timeout';
import { LoadingController } from 'ionic-angular';
import { SearchPage } from '../search/search';

import { ProductPage } from '../product/product';
import { CartPage } from '../cart/cart';

@Component({
  selector: 'page-deals',
  templateUrl: 'deals.html'
})
export class DealsPage {
  plist: string[];
  catname: string;
  selectedItem: any;
  cartnum: any;
  constructor(public navCtrl: NavController, public http: Http, private navParams: NavParams, private sqlite: SQLite, public loadingCtrl: LoadingController) {
    this.selectedItem = navParams.get('catid');
    this.catname = navParams.get('catname');
    var sel = this.selectedItem;
    this.getDeals();

    this.cartCount();

    setInterval(() => {
      this.cartCount();
    }, 300);
  }

  getDeals() {
  let loader = this.loadingCtrl.create({
    content: "Loading deals...",
  });
    loader.present();
    return this.http.get('https://app.arenagh.org/index.php/home/api_product_by_deal/')
    .map((res:Response) => res.json())
    .subscribe(
      data => {
        this.plist = data;
        loader.dismiss();
      },
      error => {
        console.log(error.data);
        loader.dismiss();
      });
  }

  thisProduct(id) {
    this.navCtrl.push(ProductPage, {
      id:id,
    });
  }


  cartCount() {
  this.sqlite.create({
    name: 'data.db',
    location: 'default'
  })
    .then((db: SQLiteObject) => {

      db.executeSql('SELECT * FROM mycart', [])
        .then(data => {
          this.cartnum = data.rows.length;
        })
        .catch(e => console.log(e));


    })
    .catch(e => console.log(e));
  }

  openCart() {
    this.navCtrl.push(CartPage);
  }

  openSearch() {
    this.navCtrl.push(SearchPage);
  }

}

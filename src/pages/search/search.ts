import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { NavParams } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { LoadingController } from 'ionic-angular';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/timeout';

import { ProductPage } from '../product/product';
import { CartPage } from '../cart/cart';

@Component({
  selector: 'page-search',
  templateUrl: 'search.html'
})
export class SearchPage {
  selectedItem: any;
  product: string;
  title: string;
  pid: string;
  price: string;
  pimage: string[];
  description: any;

  plist: string[];
  term: string;
  cartnum: any;
  constructor(public navCtrl: NavController, public http: Http, private navParams: NavParams, private sqlite: SQLite, public loadingCtrl: LoadingController) {
    this.product = "desc";
    this.term = "";
    this.selectedItem = navParams.get('id');
    var sel = this.selectedItem;

    this.cartCount();

    setInterval(() => {
      this.cartCount();
    }, 300);
  }




  getPbySearch() {
  let loader = this.loadingCtrl.create({
    content: "Searching",
  });
  //  loader.present();
    return this.http.get(`https://app.arenagh.org/index.php/home/api_product_by_search/`+this.term)
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

  thisProduct(id) {
    this.navCtrl.push(ProductPage, {
      id:id,
    });
  }

}

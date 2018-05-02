import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { NavParams } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/timeout';
import { LoadingController } from 'ionic-angular';
import { Dialogs } from '@ionic-native/dialogs';

import { LoginPage } from '../login/login';
import { DeliveryPage } from '../delivery/delivery';
import { SearchPage } from '../search/search';

@Component({
  selector: 'page-cart',
  templateUrl: 'cart.html'
})
export class CartPage {
  cartlist: Array<Object>;
  cartnum: any;
  total: any;
  is_logged: boolean;

  constructor(public navCtrl: NavController, private sqlite: SQLite, private dialogs: Dialogs, public loadingCtrl: LoadingController) {
  this.is_logged = false;
  this.getCart();
  this.SumUp();

  setInterval(() => {
    this.checkLoggedIn();
  }, 300);


  this.cartCount();

  setInterval(() => {
    this.cartCount();
  }, 300);
  }

  goLogin() {
    this.navCtrl.push(LoginPage);
  }


  goDelivery() {
    this.navCtrl.push(DeliveryPage);
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


  getCart() {
  this.sqlite.create({
    name: 'data.db',
    location: 'default'
  })
    .then((db: SQLiteObject) => {
    db.executeSql('CREATE TABLE IF NOT EXISTS mycart (product_id, product_name, sale_price)', {})
      .then(() => console.log('Executed SQL'))
      .catch(e => console.log(e));

      db.executeSql('SELECT * FROM mycart', [])
        .then(data => {
          var cartitems = [];
          var i = 0;
          var length = data.rows.length;
          for (i = 0; i < length; i++) {
            cartitems.push(data.rows.item(i));
          }
          this.cartlist = cartitems;
          console.log(JSON.stringify(cartitems));
        })
        .catch(e => console.log(e));


    })
    .catch(e => console.log(e));
  }

  delItemCart(id) {

  this.dialogs.confirm('Delete this item from cart?','Delete item', ['DELETE','Cancel'])
  .then(data => {
    console.log(data);

    if(data == 1) {
    this.sqlite.create({
      name: 'data.db',
      location: 'default'
    })
      .then((db: SQLiteObject) => {
        db.executeSql('DELETE FROM mycart WHERE product_id = ?', [id])
          .then(() => {
            this.getCart();
            this.SumUp();
          })
          .catch(e => console.log(e));


      })
      .catch(e => console.log(e));
    }

  })
  .catch(e => console.log('Error displaying dialog', e));




  }




  SumUp() {
  this.sqlite.create({
    name: 'data.db',
    location: 'default'
  })
    .then((db: SQLiteObject) => {

    db.executeSql('SELECT * FROM mycart', [])
      .then(data => {
        var calc=0;
        var i = 0;
        var length = data.rows.length;
        for (i = 0; i < length; i++) {
          calc += parseInt(data.rows.item(i).sale_price);
        }
        var sums = calc;
        this.total = sums;
        console.log(JSON.stringify(calc));
      })
      .catch(e => console.log(e));


    })
    .catch(e => console.log(e));
  }

  openSearch() {
    this.navCtrl.push(SearchPage);
  }


}

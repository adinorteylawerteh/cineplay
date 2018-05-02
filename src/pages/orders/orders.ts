import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/timeout';
import { LoadingController } from 'ionic-angular';

import { PaymentsPage } from '../payments/payments';
import { SignupPage } from '../signup/signup';
import { HomePage } from '../home/home';

@Component({
  selector: 'page-orders',
  templateUrl: 'orders.html'
})
export class OrdersPage {
  authkey: any;
  orders: string[];

  fname: string;
  lname: string;
  add1: string;
  add2: string;
  zip: string;
  email: string;
  phone: string;
  constructor(public navCtrl: NavController, public http: Http, public loadingCtrl: LoadingController, private sqlite: SQLite, private iab: InAppBrowser) {

  this.fname = "";
  this.lname = "";
  this.add1 = "";
  this.add2 = "";
  this.zip = "";
  this.email = "";
  this.phone = "";

  this.getOrders();

  }


  Invoice(id) {
    this.iab.create('https://app.arenagh.org/index.php/home/invoice/'+id);
  }

  getOrders() {
  let loader = this.loadingCtrl.create({
    content: "Loading address details.",
    duration: 3000
  });
    loader.present();

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
          var i = 0;
          var length = data.rows.length;
          for (i = 0; i < length; i++) {
            this.authkey = JSON.stringify(data.rows.item(i).dets);
            console.log("HERE WE GO"+JSON.stringify(data.rows.item(i).dets));

            var authdata = JSON.stringify(data.rows.item(i).dets);

            return this.http.get('https://app.arenagh.org/index.php/home/getordersinfo?dets='+authdata)
            .map((res:Response) => res.json())
            .subscribe(
              data => {
              console.log(data.success);
                if(data.success == true) {
                  this.orders = data.orders;
                } else {

                }
                loader.dismiss();
              },
              error => {
                console.log(error.data);
                loader.dismiss();
              });
          }
        }

        })
        .catch(e => console.log(e));


      })
      .catch(e => console.log(e));




  }

}

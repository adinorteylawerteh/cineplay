import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/timeout';
import { LoadingController } from 'ionic-angular';

import { SignupPage } from '../signup/signup';
import { HomePage } from '../home/home';

@Component({
  selector: 'page-payments',
  templateUrl: 'payments.html'
})
export class PaymentsPage {
  authkey: any;
  cartlist: any;

  fname: any;
  lname: any;
  add1: any;
  add2: any;
  zip: any;
  email: any;
  phone: any;

  constructor(public navCtrl: NavController, public http: Http, public loadingCtrl: LoadingController, private sqlite: SQLite, private navParams: NavParams) {
     this.fname = navParams.get('fname');
     this.lname = navParams.get('lname');
     this.add1 = navParams.get('add1');
     this.add2 = navParams.get('add2');
     this.zip = navParams.get('zip');
     this.email = navParams.get('email');
     this.phone = navParams.get('phone');
  }


  payCod() {
  let loader = this.loadingCtrl.create({
    content: "Buying",
  });
    loader.present();


    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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
            var authdata = JSON.stringify(data.rows.item(i).dets);

            var carts = this.cartlist;
            var cartencode = btoa(JSON.stringify(carts));

            return this.http.get('https://app.arenagh.org/index.php/home/paycod?dets='+authdata+'&fname='+this.fname+'&lname='+this.lname+'&add1='+this.add1+'&add2='+this.add2+'&zip='+this.zip+'&email='+this.email+'&phone='+this.phone+'&cartlist='+cartencode)
            .map((res:Response) => res.json())
            .subscribe(
              data => {
              console.log(data.success);
                if(data.success == true) {
                  alert(JSON.stringify(data));
                } else {
                  alert(JSON.stringify(data));
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

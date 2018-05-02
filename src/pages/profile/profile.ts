import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/timeout';
import { LoadingController } from 'ionic-angular';

import { PaymentsPage } from '../payments/payments';
import { SignupPage } from '../signup/signup';
import { HomePage } from '../home/home';

import { OrdersPage } from '../orders/orders';
import { DownloadsPage } from '../downloads/downloads';
import { HelpPage } from '../help/help';
import { EditProfilePage } from '../editprofile/editprofile';

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html'
})
export class ProfilePage {
  authkey: any;

  fname: string;
  lname: string;
  add1: string;
  add2: string;
  zip: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  country: string;

  last7: string;
  last30: string;
  constructor(public navCtrl: NavController, public http: Http, public loadingCtrl: LoadingController, private sqlite: SQLite) {

  this.fname = "";
  this.lname = "";
  this.add1 = "";
  this.add2 = "";
  this.zip = "";
  this.email = "";
  this.phone = "";
  this.city = "";
  this.state = "";
  this.country = "";
  this.last7 = "";
  this.last30 = "";
  this.getProfile();

  }


  getProfile() {
  let loader = this.loadingCtrl.create({
    content: "Loading profile details...",
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

            return this.http.get('https://app.arenagh.org/index.php/home/getprofileinfo?dets='+authdata)
            .map((res:Response) => res.json())
            .subscribe(
              data => {
              console.log(data.success);
                if(data.success == true) {
                  this.fname = data.fname;
                  this.lname = data.lname;
                  this.add1 = data.address1;
                  this.add2 = data.address2;
                  this.zip = data.zip;
                  this.email = data.email;
                  this.phone = data.phone;
                  this.city = data.city;
                  this.state = data.state;
                  this.country = data.country;
                  this.last7 = data.lasts;
                  this.last30 = data.lastt;
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



  goOrders() {
    this.navCtrl.push(OrdersPage);
  }

  goDownloads() {
    this.navCtrl.push(DownloadsPage);
  }

  goHelp() {
    this.navCtrl.push(HelpPage);
  }

  goEdit() {
    this.navCtrl.push(EditProfilePage);
  }

}

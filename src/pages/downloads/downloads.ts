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

@Component({
  selector: 'page-downloads',
  templateUrl: 'downloads.html'
})
export class DownloadsPage {
  authkey: any;
  downloads: string[];

  fname: string;
  lname: string;
  add1: string;
  add2: string;
  zip: string;
  email: string;
  phone: string;
  constructor(public navCtrl: NavController, public http: Http, public loadingCtrl: LoadingController, private sqlite: SQLite) {

  this.fname = "";
  this.lname = "";
  this.add1 = "";
  this.add2 = "";
  this.zip = "";
  this.email = "";
  this.phone = "";

  this.getDl();

  }


  getDl() {
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

            var authdata = JSON.stringify(data.rows.item(i).dets);

            return this.http.get('https://app.arenagh.org/index.php/home/getdownloads?dets='+authdata)
            .map((res:Response) => res.json())
            .subscribe(
              data => {
              console.log(data.success);
                if(data.success == true) {
                  this.downloads = data.orders;
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

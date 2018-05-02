import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/timeout';
import { LoadingController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';

import { LoginPage } from '../login/login';
import { HomePage } from '../home/home';
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html'
})
export class SignupPage {
  email: any;
  password: any;
  constructor(public navCtrl: NavController, public http: Http, public loadingCtrl: LoadingController, private sqlite: SQLite, public alertCtrl: AlertController) {
    this.email = "";
    this.password = "";
  }


  goLogin() {
    this.navCtrl.push(LoginPage);
  }


  doSignup() {
  let loader = this.loadingCtrl.create({
    content: "Just a moment...",
  });
    loader.present();

    var email = this.email;
    var password = this.password;


    if(email == "" || password == "") { 
      let alert = this.alertCtrl.create({
        title: 'Oops!',
        subTitle: 'All inputs are required to signup.',
        buttons: ['OK']
      });
      alert.present();
      loader.dismiss();
      return false;
    }

    return this.http.post('https://cineplayafrica.tv/index.php?home/api_signup', {
      'email' : this.email,
      'password': this.password,
    }, {

    })
    .map((res:Response) => res.json())
    .subscribe(
      data => {
        if(data.success == true) {

        this.sqlite.create({
          name: 'data.db',
          location: 'default'
        })
          .then((db: SQLiteObject) => {
            db.executeSql('CREATE TABLE IF NOT EXISTS dets (dets)', {})
              .then(() => console.log('Executed SQL'))
              .catch(e => console.log(e));
            var authkey = btoa(email+":"+password);

            db.executeSql('INSERT INTO dets VALUES (?)', [authkey])
              .then(() => console.log('Executed SQL'))
              .catch(e => console.log(e));

              this.navCtrl.setRoot(HomePage);

          })
          .catch(e => console.log(e));


        } else {
          let alert = this.alertCtrl.create({
            title: 'Oops!',
            subTitle: "Email already exists! Please try again.",
            buttons: ['OK']
          });
          alert.present();
        }
        loader.dismiss();
      },
      error => {
        console.log(error.data);
        loader.dismiss();
      });
  }
}

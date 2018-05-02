import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/timeout';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { LoadingController } from 'ionic-angular';
import { SearchPage } from '../search/search';

import { CatPage } from '../category/category';
import { ProductPage } from '../product/product';
import { CartPage } from '../cart/cart';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  homeplist: string[];
  cartnum: any;
  categories: string[];
  featuredtitle: any;
  featureddesc: any;
  featuredid: any;

  constructor(public navCtrl: NavController, public http: Http, private sqlite: SQLite, public loadingCtrl: LoadingController) {
    this.cartnum = 0;
    this.featuredtitle = "";
    this.featureddesc = "";
    this.featuredid = "";
    this.getHomeProd();
    this.cartCount();
    this.getCat();
    this.getFeatured();

    setInterval(() => {
      this.cartCount();
    }, 300);
  }

  getFeatured() {
  let loader = this.loadingCtrl.create({
    content: "Preparing your collection...",
  });
    loader.present();
    return this.http.post('https://cineplayafrica.tv/index.php?home/api_featured',{},{})
    .map((res:Response) => res.json())
    .subscribe(
      data => {
        this.featuredtitle = data.title;
        this.featureddesc = data.description_short;
        this.featuredid = data.movie_id;
        console.log();
        loader.dismiss();
      },
      error => {
        console.log(error.data);
        loader.dismiss();
      });
  }

  getHomeProd() {
  let loader = this.loadingCtrl.create({
    content: "Preparing your collection...",
  });
    loader.present();
    return this.http.get(`https://cineplayafrica.tv/index.php?home/api_movies`)
    .map((res:Response) => res.json())
    .subscribe(
      data => {
        this.homeplist = data;
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
        .catch(e => {});


    })
    .catch(e => console.log(e));
  }


  getCat() {
    return this.http.get('https://cineplayafrica.tv/index.php?home/api_movies')
    .map((res:Response) => res.json())
    .subscribe(
      data => {
        this.categories = data;
      },
      error => {
        console.log(error.data);
      });
  }

  openCat(id,name) {
    this.navCtrl.setRoot(CatPage, {
      catid: id,
      catname: name
    });
  }

  thisProduct(id) {
    this.navCtrl.push(ProductPage, {
      id:id,
    });
  }

  openCart() {
    this.navCtrl.push(CartPage);
  }

  openSearch() {
    this.navCtrl.push(SearchPage);
  }

}

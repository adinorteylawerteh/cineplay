import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { NavParams } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { VideoPlayer, VideoOptions } from '@ionic-native/video-player';
import { LoadingController } from 'ionic-angular';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/timeout';
import { SearchPage } from '../search/search';

import { CartPage } from '../cart/cart';

@Component({
  selector: 'page-product',
  templateUrl: 'product.html'
})
export class ProductPage {
  selectedItem: any;
  product: string;
  title: string;
  pid: string;
  price: string;
  pimage: string[];
  description: any;
  cartnum: any;

  videoOptions: VideoOptions;
  videoUrl: string;

  constructor(public navCtrl: NavController, public http: Http, private navParams: NavParams, private sqlite: SQLite, public loadingCtrl: LoadingController, private videoPlayer: VideoPlayer) {
    this.product = "desc";
    this.selectedItem = navParams.get('id');
    var sel = this.selectedItem;
    this.getHomeProd(sel);


    this.cartCount();

    setInterval(() => {
      this.cartCount();
    }, 300);
  }

  getHomeProd(id) {
  let loader = this.loadingCtrl.create({
    content: "Loading product details",
    duration: 3000
  });
    loader.present();
    return this.http.get('https://cineplayafrica.tv/index.php?home/api_play_movie/'+id)
    .map((res:Response) => res.json())
    .subscribe(
      data => {
        var res = data;
        this.title = res['0'].title;
        this.description = res['0'].description_long;
        this.pid = res['0'].movie_id;
        this.price = res['0'].year;
        var num_of_imgs = 1;

        var arr = [];
        for(var i = 1; i<=num_of_imgs; i++){
          arr.push(i);
        }

        this.pimage = arr;
        console.log(arr);
        loader.dismiss();
      },
      error => {
        console.log(error.data);
        loader.dismiss();
      });
  }

  addToCart(product_id,product_name,sale_price) {
  this.sqlite.create({
    name: 'data.db',
    location: 'default'
  })
    .then((db: SQLiteObject) => {


      db.executeSql('INSERT INTO mycart VALUES (?,?,?)', [product_id, product_name, sale_price])
        .then(() => console.log('Executed SQL'))
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


  async playVideo() {
    try {
      this.videoOptions = {
        volume: 0.7
      }
      this.videoUrl = "https://cineplay.stackfid.com/videos/akrantea1.mp4"
      await this.videoPlayer.play(this.videoUrl,this.videoOptions);
      console.log("Video has completed playing.");
    }
    catch(e){
      console.error(e);
    }
    this.videoPlayer.play('https://cineplay.stackfid.com/videos/akrantea1.mp4').then(() => {
     console.log('video completed');
    }).catch(err => {
     console.log(err);
    });
  }

  openCart() {
    this.navCtrl.push(CartPage);
  }

  openSearch() {
    this.navCtrl.push(SearchPage);
  }

}

import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import Web3 from 'web3';
import qrcode from 'qrcode';
import { GoogleNearby } from '@ionic-native/google-nearby';
import { ToastController } from 'ionic-angular';
import * as moment from 'moment';

/**
 * Generated class for the WalletPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-wallet',
  templateUrl: 'wallet.html',
})
export class WalletPage {

  // https://web3js.readthedocs.io/en/1.0/web3-eth-accounts.html
  account;
  name = "";
  bal = 0;
  nearbySub;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public googleNearby: GoogleNearby,
    public platform: Platform,
    private toastCtrl: ToastController
  ) {
    this.registerNearbyLifecycle();
  }

  ionViewDidLoad() {
    this.setupEthAccount();
    this.toast('Listening for nearby attendees...');
    this.setupNearby();
  }

  setupEthAccount() {
    // set the provider you want from Web3.providers
    let web3: any = new Web3(new Web3.providers.HttpProvider("https://rinkeby.infura.io"));

    if (!localStorage.getItem('account')) {

      this.account = web3.eth.accounts.create();
      localStorage.setItem('account', JSON.stringify(this.account));
    }
    else {
      this.account = JSON.parse(localStorage.getItem('account'));
    }


    let canvas = document.getElementById('qr')

    qrcode.toCanvas(canvas, this.account.address, function (error) {
      if (error) console.error(error)
      console.log('success!');
    });

    if (localStorage.getItem('name')) {
      this.name = localStorage.getItem('name');
    }

    if (localStorage.getItem('bal')) {
      this.bal = parseInt(localStorage.getItem('bal'));
    }

    //let coinbase = web3.eth.coinbase;
    //let balance = web3.eth.getBalance(coinbase);

  }

  ionViewDidLeave() {
    if (this.platform.is('cordova')) {
      this.nearbySub.unsubscribe();
    }
  }

  registerNearbyLifecycle(){
    this.platform.ready().then(() => {
      // When app pauses, unsubscripbe from nearby
      this.platform.pause.subscribe(() => {
        console.log('MessagePage App paused');
        try{
            this.ionViewDidLeave();
        }
        catch(e){}
      });
      // When app resumes subscribe to nearby
      this.platform.resume.subscribe(() => {
        console.log('MessagePage App resume');
        this.setupNearby();
      });
    });
  }

  setupNearby(){
    if (this.platform.is('cordova')) {
      // Get Data
      this.nearbySub = this.googleNearby.subscribe().subscribe(result => {
        this.toast(result);
        this.bal = this.bal + 1;
        localStorage.setItem('bal', this.bal.toString());
      });
    }
  }

  sendAttendanceGossip() {

    if (this.name !== "") {
      localStorage.setItem('name', this.name);
    }

    if (this.platform.is('cordova')) {
      let now = moment().format('MMMM Do YYYY, h:mm:ss a');
      let msg = now + ' Hello I am ';
      if (this.name) {
        msg = msg + this.name + " - ";
      }
      msg = msg + this.account.address;
      this.googleNearby.publish(msg)
        .then((res: any) => {
          let msg = this.name + " sent message to nearby attendees!";
          this.toast(msg)
        })
        .catch((error: any) => alert("Error" + error));
    }
  }

  toast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'top'
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });

    toast.present();
  }

}

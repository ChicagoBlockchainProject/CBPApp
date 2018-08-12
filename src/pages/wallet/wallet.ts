import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import Web3 from 'web3';
import qrcode from 'qrcode';
import { GoogleNearby } from '@ionic-native/google-nearby';

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

  constructor(public navCtrl: NavController, public navParams: NavParams, public googleNearby: GoogleNearby, public platform: Platform) {
  }

  ionViewDidLoad() {
    
      // set the provider you want from Web3.providers
      let web3:any = new Web3(new Web3.providers.HttpProvider("https://rinkeby.infura.io"));  
      
      if (!localStorage.getItem('account')) {
        
        this.account = web3.eth.accounts.create();
        localStorage.setItem('account', JSON.stringify(this.account));
      }
      else{
        this.account = JSON.parse(localStorage.getItem('account'));
      }


      let canvas = document.getElementById('qr')

      qrcode.toCanvas(canvas, this.account.address, function (error) {
        if (error) console.error(error)
        console.log('success!');
      });


      

      //let coinbase = web3.eth.coinbase;
      //let balance = web3.eth.getBalance(coinbase);
  }

  sendAttendanceGossip() {
    alert('Sent message to nearby attendees');

    if (this.platform.is('cordova')) {

      this.googleNearby.publish('Hello I am ' + this.account.address)
        .then((res: any) => {
          alert(res);
        })
        .catch((error: any) => alert(error));
    }
  }

}

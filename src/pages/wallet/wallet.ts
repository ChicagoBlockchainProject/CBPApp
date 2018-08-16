import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import Web3 from 'web3';
import qrcode from 'qrcode';
import { GoogleNearby } from '@ionic-native/google-nearby';
import { ToastController } from 'ionic-angular';
import * as moment from 'moment';
import { Attendee } from './../../models/attendee';
import 'rxjs/add/operator/toPromise';


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
  eth = 0;
  name = "";
  bal = 0;
  nearbySub;
  public attendeeList = [] as Array<Attendee>;
  api = "https://ropsten.infura.io/v3/324440bb7e154822848fbe7cd1b052c3";

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public googleNearby: GoogleNearby,
    public platform: Platform,
    private toastCtrl: ToastController
  ) {
    this.registerNearbyLifecycle();
     //let a = {} as Attendee;
    // a.name = 'n';
    // a.time = this.now();
    // a.publicAddress ='this.account.address';
    // this.attendeeList.push(a);
    // this.attendeeList.push({name:'b', time: '1', publicAddress: '11'});
 
  }

  ionViewDidLoad() {
    this.setupEthAccount();
    this.toast('Listening for nearby attendees...');
    this.setupNearby();
  }

  async setupEthAccount() {
    // set the provider you want from Web3.providers
    // https://rinkeby.infura.io
    let web3: any = new Web3(new Web3.providers.HttpProvider(this.api));

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

    // let coinbase = web3.eth.coinbase;
    web3.eth.getBalance(this.account.address).then( (wei)=>{      
      let balance = web3.utils.fromWei(wei, 'ether');
      this.eth = balance;
      console.log(balance + " ETH");
    });

    // web3.eth.getBalance.request('0x0000000000000000000000000000000000000000', 'latest', callback)

  }

  async submitAttendanceListToBlockChain(){
    // ETH
    // https://stackoverflow.com/questions/48184969/calling-smart-contracts-methods-using-web3-ethereum

    // EOS
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
        result = result.replace(/\\/g, "");
        result = result.substring(1, result.length-1);
        console.log(result);
        this.toast(result);
        let a = JSON.parse(result);
        this.bal = this.bal + 1;
        localStorage.setItem('bal', this.bal.toString());
        this.attendeeList.push(a);
      });
    }
  }

  sendAttendanceGossip() {

    if (this.name !== "") {
      localStorage.setItem('name', this.name);
    }

    let attendee = {
      name: this.name,
      time: this.now(),
      publicAddress: this.account.address
    }

    if (this.platform.is('cordova')) {

      // let msg = now + ' Hello I am ';
      // if (this.name) {
      //   msg = msg + this.name + " - ";
      // }
      // msg = msg + this.account.address;

      this.googleNearby.publish(JSON.stringify(attendee))
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
      duration: 6000,
      position: 'top'
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });

    toast.present();
  }

  itemSelected(item){

  }

  now(){
    return moment().format('MMMM Do YYYY, h:mm:ss a');
  }

}

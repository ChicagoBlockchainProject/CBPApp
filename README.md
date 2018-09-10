ChiCoin Wallet
==============

<img height="500px" src="https://raw.githubusercontent.com/ntheile/chicoinapp/master/src/assets/img/app.jpg"/>

Debug on web

`ionic serve`

Debug on android

`npm run android`

Deploy to android

`npm run deploy`

Proof of Presence (PoP) Algorithm
=============================
Proof of Presence uses BlueTooth/Audio to prove somebody is in attendance at an event. Unlike GPS (which can be spoofed), the algorithm proves you are there by other people confirming that you are present. Bluetooth and audio validation work as multi-factor authentication, before the PoP settles on a blockchain. A majority of people at the event need to confirm you are there. This data needs to be sent to a smart contract to calulate and come to consensus that you attended in a decentralized fashion and then fairly distrubte the tokens. Each event must have a unique EventId. 

### Translated to Tech

Person =  public/ private key pair 

Saying "I'm Here, or I'm Present!" = signing a message with the other parties public key
<pre>
{
	myPublicKey: 0x55738495h34iu534u9534njk,
	time: 8/16/2018 7:09:01 PM
}
</pre>

You need to broadcast your public key so all attendees can sign messages before they send them to you. This is to prevent fake attendees claiming they are somebody else (i.e. checking in your buddy).  Only signed messages are valid, others are ignored. This should prevent some forms of Sybil attack.

TODO - Are there other Attach Vectors??? (Time Clock Skew attacks, 51%, Sybil etc...)

### Test Case (Nick and Patrick)

####  "I'm Here!"

Lets say, Nick, enters an event with 10 people. When Nick walks in, he will probably receive 10 public keys (representing the 10 other people). He loops thru the 10 public keys and signs a message that he is "present". Nick's phone uses Google Nearby to broadcast the message to the 10 other people near him. 

#### "Hi! Ill add you to the Attendance List"
When Patrick receives a "Presence" request from Nick he decrypts the signed message proving it came from you (and not Ferris Bueller "sick" from home). Patrick adds Nick to his "attendance List". * Note - the Nearby api can filter out messages that are not intended for you (i.e. if its not signed to your public key). This will save on bandwidth, since NearBy broadcasts to everybody in the room via BLE/Audio but transmits the encrypted data via network. Eventually 
Patrick builds up a list with everybody, or most, people at the event. 

#### "Turn in the list to the smart contract"
At the end of the Event everybody will "turn in the attendance list" to the Smart Contract. The smart contract will tally everybodies lists and determine who was actually there. Let's say you need 26% confirmations to prove you attended the event. 


Nick

    I see Joel (Pub Key)
    I see Peter (Pub Key)
    I see Patrick (pub key)

Joel

    I see Nick (Pub Key)
    I see Peter (Pub Key)

Peter

    I see Nick (Pub Key)
    I see Patrick (pub key)

Patrick

    I see Nick (Pub Key)
    I see Peter (Pub Key)


### Smart Contract

    Nick = 3/4 => 75% => present +1 CHI
    Joel = 1/4 => 25% => not present 0 CHI
    Peter = 3/4 => present +1 CHI
    Patrick = 2/4 => present +1 CHI

What if you come in late?

The app uses Google NearBy, which is a foreground running process. If you come in late, you may not get attendance credit: if less than X% of the room are not using the app at that time, attendance will not be confirmed. Therefore, we will build features into the app to make it interactive. The ChiCoinApp UX will incentivise people to keep the app open during sessions. 

A few logical ways to incentivize during events include: users can ask question to a speaker, give tokens to a speaker for a good presentation, and receive coins for solving any problems that are presented at the event. 


### Blockchain
We want to fairly distribute ("mine") the tokens to the attendees in a decentralized fashion. We do not want to have a centralized treasurer to manually disperse the tokens in a centralzied way. Centralization enables stealing, fraud or corruption where a decentralized network can manage fair token distribution securely. The distribution will be based on a consensus that the community has been developing throughout the past few months.

Therefore, we must use a Smart Contract that can handle a high data load for low/no transaction fee. Token distribution provides secure distribution when users "PoP in" and "PoP out" at the beginning and end of each event. The PoP algorithm incentivizes users to network before and after events. PoP also enables the event management team to shift their focus from taking attendance to creating more content for each event. Similarly, attendees will no longer need to speed their time at a check-in line. The data confirms community presence from everyone's distributed ledger, so the majority of the community has the only authority to send coins throughout the group.

Currently, the only blockchain that can process this amount of data and transactions cheaply is EOS. The smart contract will need a few EOS tokens staked for the duration of the computation. The data can be stored as JSON in EOS's NoSQL storage after the event for a few hours hours or long enough for all the attedees to submit their lists, which will happen automatically when they close the app.

Nano coins provide another avenue that can solve processing transactions with its ability to transfer without a fee. Nevertheless, the Nano environment is primarily intended as a global currency like Bitcoin, so the CBP development team is weighing their options to provide a hybrid solution between the advantages that both EOS and Nano can give to the network.

After the event concludes, everybody submits their request, so the smart contract can calcualte who attended. Coins will distribute to all who have been deemed present. After the event the data can be pulled from its NoSQL storage and the token's unstaked. EOS' NoSQL storage gives developers the ability to run smart contracts for free, however, each EOS account requires an initial payment for each attendee (although it's free on the EOS Jungle Testnet). The open source community at Chicago Blockchain Project will vote on how these fees will be paid.

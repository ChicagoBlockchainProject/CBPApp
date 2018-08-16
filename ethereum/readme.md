Commands
============

https://medium.com/edgefund/ethereum-development-on-windows-part-1-da260f6a6c06
https://medium.com/edgefund/ethereum-development-on-windows-web3-and-truffle-debugging-9d47dda77c1e

create new project

`truffle unbox metacoin`

`truffle compile`

`truffle develop`
- `migrate`
- `test`
- `migrate --reset`
- `web3.eth.accounts`
- `web3.eth.getBalance(web3.eth.accounts[1]).toNumber() * 10e-18;`

To call a Smart Contract in Truffle

<pre>
    MetaCoin.deployed().then(function(instance) {
        return instance.getBalance.call(web3.eth.accounts[0]);
    }).then(function(value){
        return value.toNumber();
    });
</pre>

`MetaCoin.deployed().then(function(instance){return instance.getBalance.call(web3.eth.accounts[0]);}).then(function(value){return value.toNumber()});`


Debug a transaction

`debug 0xee9941e118fbed71c42d4681945288ead0566e2b4842eb0f783215345494340a`
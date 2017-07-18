/*
Tests that depends on ledger event go here
*/
'use strict';
const isLive = true

const {RippleAPI} = require('ripple-lib')
const obUtils = require('../ob-utils.js')
const txUtils = require('../tx-utils.js')
const credentialsPath = '../credentials.txt'
const env = require('../env-utils.js').makeEnv(isLive, credentialsPath, './fixtures/config.txt.fixtures')

const api = new RippleAPI({
  server: env.net
})


api.on('disconnected', (code) => {
  console.log('disconnected, code:', code);
});

api.on('error', (errorCode, errorMessage) => {
  console.log(errorCode + ': ' + errorMessage);
});

const options = {
  currency_gets: 'JPY',
  currency_pays: 'XRP',

  issuer_gets: 'rB3gZey7VWHYRqJHLoHDEJXJ2pEPNieKiS',
  account: 'raNDu1gNyZ5hipBTKxm5zx7NovA1rNnNRf'
};

api.connect().then(() => {
  console.log('connected');
  /*
	getOrderBook()
  */

})

api.on('ledger', ledger => {
    console.log('aaa')
})

api.on('ledger', ledger => {
    console.log('bbb')

})


function getOrderBook(){
  const orderbookConf = {
    "base": { // the first currency in pair
      "currency": env.botConfig.base
    },
    "counter": {
      "currency": env.botConfig.quote,
      "counterparty": env.botConfig.issuer
    }
  };
  api.on('ledger', ledger => {
    api.getOrderbook(env.address, orderbookConf)
    .then(orderbook => {
      console.log(JSON.stringify(orderbook))
      //var book = obUtils.buildBook(env.address,orderbook)
      //obUtils.buildVerticalSequence(book)
    })
  })
}


function getTransactions(){
  console.log("Subscribed to account " + env.address)
  api.on('ledger', ledger => {
    var tx = {
      minLedgerVersion : ledger.ledgerVersion
      // types : [order] also filters out consumed orders. Don't use it for now
    }

    console.log('Ledger : ' + tx.minLedgerVersion)
    api.getTransactions(env.address, tx).then(transactions => {
      console.log(JSON.stringify(transactions));
      //txUtils.performCounter(env, transactions)
    });
  })
}


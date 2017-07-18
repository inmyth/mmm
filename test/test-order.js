/*
Test create orders
*/
'use strict';
const isLive = true;

const {RippleAPI} = require('ripple-lib')
const obUtils = require('../ob-utils.js')
const txUtils = require('../tx-utils.js')
const {makeEnv, loga, logs} = require('../env-utils.js')

const WebSocket = require('ws');

const altnet = 'ws://s.altnet.rippletest.net:51233';
const livenet = 'wss://s1.ripple.com'


const api = new RippleAPI({
  server: isLive ? livenet : altnet
});


const envTest1 = { // buys USD
    net: 'ws://s.altnet.rippletest.net:51233',
    address : 'rDnUEzgvZHE6UX7ZJXBA4wt5jWC4uwXAjL',
    secret : 'shF1tYM52sMZif2k2cB5Qs8QvNmHM',
    pair  : 'USD/XRP',
    issuer : 'rHjGuGDJvKQ2RSLj3WesnxVoKVVhbSwYQL'
  }

const envTest2 = { // buys XRP
    net: 'ws://s.altnet.rippletest.net:51233',
    address : 'rD8dZy2cXdzURTbFb3bhebQ3FFvaWCB8Nx',
    secret : 'ssr5uhqU7VZdZrUE36iogSQwyRQ8b',
    pair  : 'XRP/USD',
    issuer : 'rHjGuGDJvKQ2RSLj3WesnxVoKVVhbSwYQL'
  }


const envLive = {
  net: 'wss://s1.ripple.com',
  address : 'rB3gZey7VWHYRqJHLoHDEJXJ2pEPNieKiS',
  secret : 'NEED SECRET',
  pair  : 'XRP/USD',
  issuer : 'rB3gZey7VWHYRqJHLoHDEJXJ2pEPNieKiS'
}

api.on('disconnected', (code) => {
  console.log('disconnected, code:', code);
});

api.on('error', (errorCode, errorMessage) => {
  console.log(errorCode + ': ' + errorMessage);
});


//createTestXRPUSD();
testSendMultiple()
function testSendMultiple(){
  var env = makeEnv(isLive, '../credentials.txt')
  const ws = new WebSocket(env.net);

  const bids = []

  bids.push(
    {
      "direction": "buy",
      "quantity": {
        "currency": "XRP",
        "value": "1"
      },
      "totalPrice": {
        "currency": "JPY",
        "counterparty": env.issuer,
        "value": "2"
      },
      "passive": false,
      "fillOrKill": false
    }
  )
  var order =
      {
      "direction": "buy",
      "quantity": {
        "currency": "XRP",
        "value": "1"
      },
      "totalPrice": {
        "currency": "JPY",
        "counterparty": env.issuer,
        "value": "1"
      },
      "passive": false,
      "fillOrKill": false
    }

  var i
  for (i = 0; i < 1; i++){
    bids.push(order)
  }


    var txCache  = new txUtils.TxCache()

  	ws.on('open', function open() {
  		api.connect().then(() => {
  			console.log('connected');
  			sendMultipleOrders(env.address, env.secret, api, bids, txCache)
  			api.on('ledger', ledger => {

  				console.log(ledger.ledgerVersion)
  				sendMultipleOrders(env.address, env.secret, api, txCache.getImmediatesAndReset(), txCache)
  				txCache.checkDelayed(ws, ledger.ledgerVersion)

  			})
  		})
  	});
}


function sendMultipleOrders(address, secret, api, orders, txCache){
    var preparePromises = []
    orders.map(order => {
		console.log(order)
		preparePromises.push(api.prepareOrder(address, order))
    })

	var respecTxPromise = Promise.all(preparePromises).then(preparedTxs => {
		//console.log(preparedTxs)
		preparedTxs.forEach((preparedTx, currentIndex, arr) => {
			var txJSON = JSON.parse(preparedTx.txJSON)
		    var newSequence = txJSON.Sequence + currentIndex
			txJSON.Sequence = newSequence
			preparedTx.txJSON = JSON.stringify(txJSON)
			//console.log(preparedTx)
			var signedTx = api.sign(preparedTx.txJSON, secret)
			var load = txUtils.TxCache.makeLoad(orders[currentIndex], preparedTx, txJSON, signedTx)
			api.submit(load.signedTx.signedTransaction).then(message => {
				console.log(message)
				txCache.push(load, message)
				//pastTxs.set(load.signedTx.id, load)
			})
		})
	})
}




function deleteOrders(){
api.connect().then(() => {
  console.log('connected');
  deleteOrdersByFirstSequence(envTest2, 385, 10)
})
}

function createTestXRPUSD(){
api.connect().then(() => {
  console.log('connected');
  createTestBuyUSD()
  /*
  var c = 0
  api.on('ledger', ledger => {
    c++
    if (c==1){
      createTestBuyXRP()
    }
  })
  */
})
}



function createTestBuyUSD(){
  var bids = []
  var order =
    {
      "direction": "buy",
      "quantity": {
        "currency": "USD",
        "counterparty": envTest1.issuer,
        "value": "2"
      },
      "totalPrice": {
        "currency": "XRP",
        "value": "10"
      },
      "passive": false,
      "fillOrKill": false
    }

    bids.push(order)
    /*
  var i
  for (i = 0; i <1; i++){
    bids.push(order)
  }
  */
  txUtils.sendMultipleOrders(envTest1.address, envTest1.secret, api, bids)
}

function createTestBuyXRP(){
  const bids = []
  bids.push(
    {
      "direction": "buy",
      "quantity": {
        "currency": "XRP",
        "value": "10"
      },
      "totalPrice": {
        "currency": "USD",
        "counterparty": envTest2.issuer,
        "value": "2"
      },
      "passive": false,
      "fillOrKill": false
    }
  )

  var order =
      {
      "direction": "buy",
      "quantity": {
        "currency": "XRP",
        "value": "10"
      },
      "totalPrice": {
        "currency": "USD",
        "counterparty": envTest2.issuer,
        "value": "1.5"
      },
      "passive": false,
      "fillOrKill": false
    }

  var i
  for (i = 0; i < 1; i++){
    bids.push(order)
  }

  txUtils.sendMultipleOrders(envTest2.address, envTest2.secret, api, bids) //address, secret, api, conf

}


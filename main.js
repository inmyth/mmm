'use strict'
const {RippleAPI} = require('ripple-lib')
const PubSub      = require ('pubsub-js')
const WebSocket 	= require('ws');
const txUtils 		= require('./tx-utils.js')
const winston		 	= require('winston')
const loga 				= require('./env-utils.js').loga(winston)
const env 				= require('./env-utils.js').makeEnv()
const events 			= require('./events.js')
const api 			= new RippleAPI({server: env.net})
const ws 				= new WebSocket(env.net)
const txCache   = new txUtils.TxCache()
const counter = new txUtils.Counter(env)

var onPrepareTxSubmitRequest = function(msg, orders){
	txUtils.sendMultipleOrders(env.address, env.secret, api, orders)
}

var onTxSubmittedResponse = function(msg, param){
	txCache.pushOrder(param.load, param.message)
}

var onPrepareTxCancelRequest = function(msg, seqs){
	//let seqs = txUtils.getCancelsAndReset()
	//txUtils.cancelOrdersByArray(env.address, env.secret, api, seqs)
}


PubSub.subscribe(events.REQ_API_PREPARE_SUBMIT_TX, onPrepareTxSubmitRequest)
PubSub.subscribe(events.GOT_TX_SUBMITTED_RESPONSE, onTxSubmittedResponse)
// PubSub.subscribe(events.REQ_API_PREPARE_CANCEL_TX, onPrepareTxCancelRequest)

api.on('error', (errorCode, errorMessage) => {
  loga.error(errorCode + ': ' + errorMessage)
})

api.on('disconnected', (code) => {
  loga.info('disconnected, code:', code)
})

function start(){

	ws.on('open', function open() {
		api.connect().then(() => {
		  loga.info('connected')
			api.on('ledger', ledger => {
				let tx = {minLedgerVersion : ledger.ledgerVersion}
				loga.info(ledger.ledgerVersion)
				if (txCache.immediates.length > 0){
					txUtils.sendMultipleOrders(env.address, env.secret, api, txCache.getImmediatesAndReset())
				}
				txCache.getUnvalidateds(ws, ledger.ledgerVersion).forEach(unvalidated => {
					ws.send(unvalidated)
				})

				let txPromise = api.getTransactions(env.address, tx)
				txPromise.then(txs => {
					counter.performCounter(txs)
				})
			})
		})
	})

	ws.on('message', function incoming(data) {
		var info = JSON.parse(data)
		if(info.result.hasOwnProperty('validated') && info.result.validated){
			loga.info('validated = true for ' + info.result.hash)
			txCache.delayeds.delete(info.result.hash)
		}
	})

}


start()

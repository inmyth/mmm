'use strict'
const {RippleAPI} = require('ripple-lib')
const WebSocket = require('ws');
const txUtils = require('./tx-utils.js')
const winston = require('winston')
const loga = require('./env-utils.js').loga(winston)
const logs = require('./env-utils.js').logs(winston)
const env = require('./env-utils.js').makeEnv()
const createInitialOrders = require('./env-utils').createInitialOrders
const api = new RippleAPI({
  server: env.net
})

const ws = new WebSocket(env.net) // need ws because ripple-lib getTransaction sucks

api.on('error', (errorCode, errorMessage) => {
  loga.error(errorCode + ': ' + errorMessage)
})

api.on('disconnected', (code) => {
  loga.info('disconnected, code:', code)
})


function start(){
  var txCache  = new txUtils.TxCache()
  let orders = []
  env.botConfigs.forEach(botConfig => {
    orders = orders.concat(createInitialOrders(botConfig))
  });

	var wait = 10
  ws.on('open', function open() {
    api.connect().then(() => {
      loga.info('connected')
      loga.info('sending orders')
      txUtils.sendMultipleOrders(env.address, env.secret, api, orders)
      api.on('ledger', ledger => {
        let tx = {
          minLedgerVersion : ledger.ledgerVersion
        }
        loga.info(ledger.ledgerVersion)
        if (txCache.immediates.length > 0){
          txUtils.sendMultipleOrders(env.address, env.secret, api, txCache.getImmediatesAndReset(), txCache)
        }
        txCache.getUnvalidateds(ws, ledger.ledgerVersion).forEach(unvalidated => {
          ws.send(unvalidated)
        })
        wait--
        if (wait <= 0 && Object.keys(txCache.delayeds).length == 0 && txCache.immediates.length == 0){
           process.exit(1)
        }

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

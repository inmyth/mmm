'use strict'

const {RippleAPI} = require('ripple-lib')
const WebSocket   = require('ws');
const PubSub      = require ('pubsub-js')
const env         = require('../env-utils.js').makeEnv(true, '../credentials.txt', './fixtures/config.txt.fixtures')
const events      = require('../events.js')
const {Maintainer, buildAccountOffersConfig} = require('../ob-utils')
const txUtils     = require('../tx-utils.js')
const api = new RippleAPI({
  server: env.net
})
const maintainer = new Maintainer(env)
const ws = new WebSocket(env.net)
const txCache = new txUtils.TxCache()

var gotCanceledSequences = function(msg, seqs){
  seqs.forEach(seq => {
    console.log(seq)
    txCache.cancels.push(seq)
  })
}

var gotMaintainSeedOrders = function(msg, newOrders){
  newOrders.forEach(newOrder => {
    txCache.immediates.push(newOrder)
  })
}

PubSub.subscribe(events.GOT_MAINTAIN_TRIM_ORDERS, gotCanceledSequences)
PubSub.subscribe(events.GOT_MAINTAIN_SEED_ORDERS, gotMaintainSeedOrders)


ws.on('open', function open() {
  api.connect().then(() => {
    console.log('connected')
    ws.send(JSON.stringify(buildAccountOffersConfig(env.address)))

    api.on('ledger', ledger => {
      let ledgerVersion = ledger.ledgerVersion
      console.log(ledgerVersion)

      if (txCache.immediates.length > 0){
        txUtils.sendMultipleOrders(env.address, env.secret, api, txCache.getImmediatesAndReset())
      }

      if(txCache.cancels.length > 0){
        txUtils.cancelOrdersByArray(env.address, env.secret, api, txCache.getCancelsAndReset())
      }

      txCache.getUnvalidateds(ws, ledger.ledgerVersion).forEach(unvalidated => {
        ws.send(unvalidated)
      })
    })
  })

  ws.on('message', response => {

    let data = JSON.parse(response)
    if (data.hasOwnProperty('result')){
      // case account_offers
      if (data.result.hasOwnProperty('account') && data.result.hasOwnProperty('offers')){
        if (data.result.account === env.address){
          maintainer.processOffers(data.result.offers)
        }
      }
    }
  })
})



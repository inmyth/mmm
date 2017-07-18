'use strict'

/*
Cancel orders in sequence range
Define the lowest and highest order sequence you want.
The range should be short around 30 to have higher possibility of tesSUCCESS. Setting too high above 150  will disconnect the websocket
*/

const cancelOpt = {
  low   :  3560,
  high  :  3580
}

const isLive = true
const {RippleAPI} = require('ripple-lib')
const txUtils = require('./tx-utils.js')
const credentials = './credentials.txt'
const env = require('./env-utils.js').makeEnv(isLive, credentials)
const api = new RippleAPI({
  server: env.net
})

api.on('error', (errorCode, errorMessage) => {
  console.log(errorCode + ': ' + errorMessage)
})

api.on('disconnected', (code) => {
  console.log('disconnected, code:', code)
})

function start(){
    var countdown = 10
    var low = cancelOpt.low <= cancelOpt.high ? cancelOpt.low : cancelOpt.high
    var high = cancelOpt.high >= cancelOpt.low ? cancelOpt.high : cancelOpt.low

    api.connect().then(() => {

      txUtils.cancelOrdersByRange(env.address, env.secret, api, low, high)
      api.on('ledger', ledger => {
          countdown--
          if (countdown <= 0){
            process.exit(1)
          }
          console.log('shutdown in ' + countdown)
      })
    })
}

start()

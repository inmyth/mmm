'use-strict'
const inspect = require('util').inspect

/*
If one order consumed multiple of our orders (reported by Yuki)

{
   "type": "payment",
   "address": "rnog8JA6y226WH5RqwPkbU23YCzRkVHsQz",
   "sequence": 3,
   "id": "90B26770BBAB07FC7E2022946F5448F87E324E59D9BEF9AEE452F51081FFC2E7",
   "specification": {
      "source": {
         "address": "rnog8JA6y226WH5RqwPkbU23YCzRkVHsQz",
         "maxAmount": {
            "currency": "JPY",
            "value": "1604.998525"
         }
      },
      "destination": {
         "address": "rnog8JA6y226WH5RqwPkbU23YCzRkVHsQz",
         "amount": {
            "currency": "XRP",
            "value": "50"
         }
      },
      "paths": [
         [
            {
               "account": "rB3gZey7VWHYRqJHLoHDEJXJ2pEPNieKiS",
               "type": 1,
               "type_hex": "0000000000000001"
            },
            {
               "currency": "XRP",
               "type": 16,
               "type_hex": "0000000000000010"
            }
         ]
      ]
   },
   "outcome": {
      "result": "tesSUCCESS",
      "timestamp": "2017-06-08T21:24:11.000Z",
      "fee": "0.000012",
      "balanceChanges": {
         "raNDu1gNyZ5hipBTKxm5zx7NovA1rNnNRf": [
            {
               "counterparty": "rB3gZey7VWHYRqJHLoHDEJXJ2pEPNieKiS",
               "currency": "JPY",
               "value": "289.09114999998"
            },
            {
               "currency": "XRP",
               "value": "-9.131"
            }
         ],
         "rB3gZey7VWHYRqJHLoHDEJXJ2pEPNieKiS": [
            {
               "counterparty": "raNDu1gNyZ5hipBTKxm5zx7NovA1rNnNRf",
               "currency": "JPY",
               "value": "-289.09114999998"
            },
            {
               "counterparty": "rBGGmp22NG7eNmzAKNPeGhGUoxHv8ZaFDD",
               "currency": "JPY",
               "value": "-1297.18206"
            },
            {
               "counterparty": "rnog8JA6y226WH5RqwPkbU23YCzRkVHsQz",
               "currency": "JPY",
               "value": "1589.44575641998"
            }
         ],
         "rnog8JA6y226WH5RqwPkbU23YCzRkVHsQz": [
            {
               "currency": "XRP",
               "value": "49.999988"
            },
            {
               "counterparty": "rB3gZey7VWHYRqJHLoHDEJXJ2pEPNieKiS",
               "currency": "JPY",
               "value": "-1589.44575641998"
            }
         ],
         "rBGGmp22NG7eNmzAKNPeGhGUoxHv8ZaFDD": [
            {
               "currency": "XRP",
               "value": "-40.869"
            },
            {
               "counterparty": "rB3gZey7VWHYRqJHLoHDEJXJ2pEPNieKiS",
               "currency": "JPY",
               "value": "1297.18206"
            }
         ]
      },
      "orderbookChanges": {
         "raNDu1gNyZ5hipBTKxm5zx7NovA1rNnNRf": [
            {
               "direction": "sell",
               "quantity": {
                  "currency": "XRP",
                  "value": "1.777"
               },
               "totalPrice": {
                  "currency": "JPY",
                  "counterparty": "rB3gZey7VWHYRqJHLoHDEJXJ2pEPNieKiS",
                  "value": "56.1532"
               },
               "sequence": 3074,
               "status": "filled",
               "makerExchangeRate": "31.6"
            },
            {
               "direction": "sell",
               "quantity": {
                  "currency": "XRP",
                  "value": "1.9"
               },
               "totalPrice": {
                  "currency": "JPY",
                  "counterparty": "rB3gZey7VWHYRqJHLoHDEJXJ2pEPNieKiS",
                  "value": "60.135"
               },
               "sequence": 3019,
               "status": "filled",
               "makerExchangeRate": "31.65"
            },
            {
               "direction": "sell",
               "quantity": {
                  "currency": "XRP",
                  "value": "1.777"
               },
               "totalPrice": {
                  "currency": "JPY",
                  "counterparty": "rB3gZey7VWHYRqJHLoHDEJXJ2pEPNieKiS",
                  "value": "56.33089999999999"
               },
               "sequence": 3049,
               "status": "filled",
               "makerExchangeRate": "31.69999999999999"
            },
            {
               "direction": "sell",
               "quantity": {
                  "currency": "XRP",
                  "value": "1.9"
               },
               "totalPrice": {
                  "currency": "JPY",
                  "counterparty": "rB3gZey7VWHYRqJHLoHDEJXJ2pEPNieKiS",
                  "value": "60.23"
               },
               "sequence": 3001,
               "status": "filled",
               "makerExchangeRate": "31.7"
            },
            {
               "direction": "sell",
               "quantity": {
                  "currency": "XRP",
                  "value": "1.777"
               },
               "totalPrice": {
                  "currency": "JPY",
                  "counterparty": "rB3gZey7VWHYRqJHLoHDEJXJ2pEPNieKiS",
                  "value": "56.24204999999999"
               },
               "sequence": 3047,
               "status": "filled",
               "makerExchangeRate": "31.64999999999999"
            }
         ],
         "rBGGmp22NG7eNmzAKNPeGhGUoxHv8ZaFDD": [
            {
               "direction": "sell",
               "quantity": {
                  "currency": "XRP",
                  "value": "40.869"
               },
               "totalPrice": {
                  "currency": "JPY",
                  "counterparty": "rB3gZey7VWHYRqJHLoHDEJXJ2pEPNieKiS",
                  "value": "1297.18206"
               },
               "sequence": 3691,
               "status": "partially-filled",
               "makerExchangeRate": "31.74"
            }
         ]
      },
      "ledgerVersion": 30362161,
      "indexInLedger": 60,
      "deliveredAmount": {
         "currency": "XRP",
         "value": "50"
      }
   }
}
*/

const raw = '[{\r\n   \"type\": \"payment\",\r\n   \"address\": \"rnog8JA6y226WH5RqwPkbU23YCzRkVHsQz\",\r\n   \"sequence\": 3,\r\n   \"id\": \"90B26770BBAB07FC7E2022946F5448F87E324E59D9BEF9AEE452F51081FFC2E7\",\r\n   \"specification\": {\r\n      \"source\": {\r\n         \"address\": \"rnog8JA6y226WH5RqwPkbU23YCzRkVHsQz\",\r\n         \"maxAmount\": {\r\n            \"currency\": \"JPY\",\r\n            \"value\": \"1604.998525\"\r\n         }\r\n      },\r\n      \"destination\": {\r\n         \"address\": \"rnog8JA6y226WH5RqwPkbU23YCzRkVHsQz\",\r\n         \"amount\": {\r\n            \"currency\": \"XRP\",\r\n            \"value\": \"50\"\r\n         }\r\n      },\r\n      \"paths\": [\r\n         [\r\n            {\r\n               \"account\": \"rB3gZey7VWHYRqJHLoHDEJXJ2pEPNieKiS\",\r\n               \"type\": 1,\r\n               \"type_hex\": \"0000000000000001\"\r\n            },\r\n            {\r\n               \"currency\": \"XRP\",\r\n               \"type\": 16,\r\n               \"type_hex\": \"0000000000000010\"\r\n            }\r\n         ]\r\n      ]\r\n   },\r\n   \"outcome\": {\r\n      \"result\": \"tesSUCCESS\",\r\n      \"timestamp\": \"2017-06-08T21:24:11.000Z\",\r\n      \"fee\": \"0.000012\",\r\n      \"balanceChanges\": {\r\n         \"raNDu1gNyZ5hipBTKxm5zx7NovA1rNnNRf\": [\r\n            {\r\n               \"counterparty\": \"rB3gZey7VWHYRqJHLoHDEJXJ2pEPNieKiS\",\r\n               \"currency\": \"JPY\",\r\n               \"value\": \"289.09114999998\"\r\n            },\r\n            {\r\n               \"currency\": \"XRP\",\r\n               \"value\": \"-9.131\"\r\n            }\r\n         ],\r\n         \"rB3gZey7VWHYRqJHLoHDEJXJ2pEPNieKiS\": [\r\n            {\r\n               \"counterparty\": \"raNDu1gNyZ5hipBTKxm5zx7NovA1rNnNRf\",\r\n               \"currency\": \"JPY\",\r\n               \"value\": \"-289.09114999998\"\r\n            },\r\n            {\r\n               \"counterparty\": \"rBGGmp22NG7eNmzAKNPeGhGUoxHv8ZaFDD\",\r\n               \"currency\": \"JPY\",\r\n               \"value\": \"-1297.18206\"\r\n            },\r\n            {\r\n               \"counterparty\": \"rnog8JA6y226WH5RqwPkbU23YCzRkVHsQz\",\r\n               \"currency\": \"JPY\",\r\n               \"value\": \"1589.44575641998\"\r\n            }\r\n         ],\r\n         \"rnog8JA6y226WH5RqwPkbU23YCzRkVHsQz\": [\r\n            {\r\n               \"currency\": \"XRP\",\r\n               \"value\": \"49.999988\"\r\n            },\r\n            {\r\n               \"counterparty\": \"rB3gZey7VWHYRqJHLoHDEJXJ2pEPNieKiS\",\r\n               \"currency\": \"JPY\",\r\n               \"value\": \"-1589.44575641998\"\r\n            }\r\n         ],\r\n         \"rBGGmp22NG7eNmzAKNPeGhGUoxHv8ZaFDD\": [\r\n            {\r\n               \"currency\": \"XRP\",\r\n               \"value\": \"-40.869\"\r\n            },\r\n            {\r\n               \"counterparty\": \"rB3gZey7VWHYRqJHLoHDEJXJ2pEPNieKiS\",\r\n               \"currency\": \"JPY\",\r\n               \"value\": \"1297.18206\"\r\n            }\r\n         ]\r\n      },\r\n      \"orderbookChanges\": {\r\n         \"raNDu1gNyZ5hipBTKxm5zx7NovA1rNnNRf\": [\r\n            {\r\n               \"direction\": \"sell\",\r\n               \"quantity\": {\r\n                  \"currency\": \"XRP\",\r\n                  \"value\": \"1.777\"\r\n               },\r\n               \"totalPrice\": {\r\n                  \"currency\": \"JPY\",\r\n                  \"counterparty\": \"rB3gZey7VWHYRqJHLoHDEJXJ2pEPNieKiS\",\r\n                  \"value\": \"56.1532\"\r\n               },\r\n               \"sequence\": 3074,\r\n               \"status\": \"filled\",\r\n               \"makerExchangeRate\": \"31.6\"\r\n            },\r\n            {\r\n               \"direction\": \"sell\",\r\n               \"quantity\": {\r\n                  \"currency\": \"XRP\",\r\n                  \"value\": \"1.9\"\r\n               },\r\n               \"totalPrice\": {\r\n                  \"currency\": \"JPY\",\r\n                  \"counterparty\": \"rB3gZey7VWHYRqJHLoHDEJXJ2pEPNieKiS\",\r\n                  \"value\": \"60.135\"\r\n               },\r\n               \"sequence\": 3019,\r\n               \"status\": \"filled\",\r\n               \"makerExchangeRate\": \"31.65\"\r\n            },\r\n            {\r\n               \"direction\": \"sell\",\r\n               \"quantity\": {\r\n                  \"currency\": \"XRP\",\r\n                  \"value\": \"1.777\"\r\n               },\r\n               \"totalPrice\": {\r\n                  \"currency\": \"JPY\",\r\n                  \"counterparty\": \"rB3gZey7VWHYRqJHLoHDEJXJ2pEPNieKiS\",\r\n                  \"value\": \"56.33089999999999\"\r\n               },\r\n               \"sequence\": 3049,\r\n               \"status\": \"filled\",\r\n               \"makerExchangeRate\": \"31.69999999999999\"\r\n            },\r\n            {\r\n               \"direction\": \"sell\",\r\n               \"quantity\": {\r\n                  \"currency\": \"XRP\",\r\n                  \"value\": \"1.9\"\r\n               },\r\n               \"totalPrice\": {\r\n                  \"currency\": \"JPY\",\r\n                  \"counterparty\": \"rB3gZey7VWHYRqJHLoHDEJXJ2pEPNieKiS\",\r\n                  \"value\": \"60.23\"\r\n               },\r\n               \"sequence\": 3001,\r\n               \"status\": \"filled\",\r\n               \"makerExchangeRate\": \"31.7\"\r\n            },\r\n            {\r\n               \"direction\": \"sell\",\r\n               \"quantity\": {\r\n                  \"currency\": \"XRP\",\r\n                  \"value\": \"1.777\"\r\n               },\r\n               \"totalPrice\": {\r\n                  \"currency\": \"JPY\",\r\n                  \"counterparty\": \"rB3gZey7VWHYRqJHLoHDEJXJ2pEPNieKiS\",\r\n                  \"value\": \"56.24204999999999\"\r\n               },\r\n               \"sequence\": 3047,\r\n               \"status\": \"filled\",\r\n               \"makerExchangeRate\": \"31.64999999999999\"\r\n            }\r\n         ],\r\n         \"rBGGmp22NG7eNmzAKNPeGhGUoxHv8ZaFDD\": [\r\n            {\r\n               \"direction\": \"sell\",\r\n               \"quantity\": {\r\n                  \"currency\": \"XRP\",\r\n                  \"value\": \"40.869\"\r\n               },\r\n               \"totalPrice\": {\r\n                  \"currency\": \"JPY\",\r\n                  \"counterparty\": \"rB3gZey7VWHYRqJHLoHDEJXJ2pEPNieKiS\",\r\n                  \"value\": \"1297.18206\"\r\n               },\r\n               \"sequence\": 3691,\r\n               \"status\": \"partially-filled\",\r\n               \"makerExchangeRate\": \"31.74\"\r\n            }\r\n         ]\r\n      },\r\n      \"ledgerVersion\": 30362161,\r\n      \"indexInLedger\": 60,\r\n      \"deliveredAmount\": {\r\n         \"currency\": \"XRP\",\r\n         \"value\": \"50\"\r\n      }\r\n   }\r\n}]\r\n\r\n'

const isLive = true
const {RippleAPI} = require('ripple-lib')
const txUtils = require('../tx-utils.js')
const credentials = '../credentials.txt'
const winston = require('winston')
const loga = require('../env-utils.js').loga(winston)
const logs = require('../env-utils.js').logs(winston)
const env = require('../env-utils.js').makeEnv(isLive, credentials)
const api = new RippleAPI({
  server: env.net
})

api.on('error', (errorCode, errorMessage) => {
  loga.error(errorCode + ': ' + errorMessage)
})

api.on('disconnected', (code) => {
  loga.info('disconnected, code:', code)
})

function start(){
  var txCache  = new txUtils.TxCache()
    api.connect().then(() => {
      loga.info('connected')
      var txs = JSON.parse(raw)
      txUtils.performCounter(txs, api, env, txCache)
    })
}

start()

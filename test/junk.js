//console.log(Math.floor(3/2))
const txUtils = require('../tx-utils.js')
const myUtils = require('../my-utils.js')
const fixtures = require('./fixtures.js')
const winston  = require('winston')
const loga = require('../env-utils.js').loga(winston)




//console.log(myUtils.checkNested(JSON.parse(fixtures.TX_CONSUMED, 'outcome', 'sbalanceChanges', 'rD8dZy2cXdzURTbFb3bhebQ3FFvaWCB8Nx')))

//var consOffer = JSON.parse(fixtures.TX_CONSUMED);
//txUtils.counterOffers('rD8dZy2cXdzURTbFb3bhebQ3FFvaWCB8Nx', consOffer)
//arrayQueue()

//delayAsync()


//testMockSend()
//testPrecision()



var txData = '{\r\n\t\"result\": {\r\n\t\t\"Account\": \"raNDu1gNyZ5hipBTKxm5zx7NovA1rNnNRf\",\r\n\t\t\"Fee\": \"12\",\r\n\t\t\"Flags\": 2147483648,\r\n\t\t\"LastLedgerSequence\": 30239029,\r\n\t\t\"Sequence\": 838,\r\n\t\t\"SigningPubKey\": \"02E2F1208D1715E18B0957FC819546FA7434B4A19EE38321932D2ED28FA090678E\",\r\n\t\t\"TakerGets\": {\r\n\t\t\t\"currency\": \"JPY\",\r\n\t\t\t\"issuer\": \"rB3gZey7VWHYRqJHLoHDEJXJ2pEPNieKiS\",\r\n\t\t\t\"value\": \"2\"\r\n\t\t},\r\n\t\t\"TakerPays\": \"1000000\",\r\n\t\t\"TransactionType\": \"OfferCreate\",\r\n\t\t\"TxnSignature\": \"304502210097EA54D26CC70F45836FECF1E6E81665EC952387228A688859AE3B1B144F4A9902201E7719A22F67742105FBFAB5C54F6FDD714201EE3F429A3F8917AC515FEB4D5B\",\r\n\t\t\"date\": 549834882,\r\n\t\t\"hash\": \"7E1E104E079FC664C50EB5843EA8744E4DCB6786DF6997BCA2DA6D2A8C9E2446\",\r\n\t\t\"inLedger\": 30239028,\r\n\t\t\"ledger_index\": 30239028,\r\n\t\t\"meta\": {\r\n\t\t\t\"AffectedNodes\": [{\r\n\t\t\t\t\"ModifiedNode\": {\r\n\t\t\t\t\t\"FinalFields\": {\r\n\t\t\t\t\t\t\"Account\": \"raNDu1gNyZ5hipBTKxm5zx7NovA1rNnNRf\",\r\n\t\t\t\t\t\t\"Balance\": \"5268735547\",\r\n\t\t\t\t\t\t\"Flags\": 0,\r\n\t\t\t\t\t\t\"OwnerCount\": 4,\r\n\t\t\t\t\t\t\"Sequence\": 839\r\n\t\t\t\t\t},\r\n\t\t\t\t\t\"LedgerEntryType\": \"AccountRoot\",\r\n\t\t\t\t\t\"LedgerIndex\": \"72A59CDF8FFBF65C20D01D3A3D5DA5BAE3158A3881E7AEE525A01B1CC73D32DD\",\r\n\t\t\t\t\t\"PreviousFields\": {\r\n\t\t\t\t\t\t\"Balance\": \"5268735559\",\r\n\t\t\t\t\t\t\"OwnerCount\": 3,\r\n\t\t\t\t\t\t\"Sequence\": 838\r\n\t\t\t\t\t},\r\n\t\t\t\t\t\"PreviousTxnID\": \"94C2C8AAD51D86FC6C3F99627968E5E53ECC700CD72FE4E5933AC272A1FD20F4\",\r\n\t\t\t\t\t\"PreviousTxnLgrSeq\": 30239013\r\n\t\t\t\t}\r\n\t\t\t}, {\r\n\t\t\t\t\"ModifiedNode\": {\r\n\t\t\t\t\t\"FinalFields\": {\r\n\t\t\t\t\t\t\"ExchangeRate\": \"5A11C37937E08000\",\r\n\t\t\t\t\t\t\"Flags\": 0,\r\n\t\t\t\t\t\t\"RootIndex\": \"A7A2258942BF79A1C2A55DA88560879DC312966AFDD1CD055A11C37937E08000\",\r\n\t\t\t\t\t\t\"TakerGetsCurrency\": \"0000000000000000000000004A50590000000000\",\r\n\t\t\t\t\t\t\"TakerGetsIssuer\": \"6F2531F2B8CDB96D6D986D9D75CC0156DF2C5387\",\r\n\t\t\t\t\t\t\"TakerPaysCurrency\": \"0000000000000000000000000000000000000000\",\r\n\t\t\t\t\t\t\"TakerPaysIssuer\": \"0000000000000000000000000000000000000000\"\r\n\t\t\t\t\t},\r\n\t\t\t\t\t\"LedgerEntryType\": \"DirectoryNode\",\r\n\t\t\t\t\t\"LedgerIndex\": \"A7A2258942BF79A1C2A55DA88560879DC312966AFDD1CD055A11C37937E08000\"\r\n\t\t\t\t}\r\n\t\t\t}, {\r\n\t\t\t\t\"ModifiedNode\": {\r\n\t\t\t\t\t\"FinalFields\": {\r\n\t\t\t\t\t\t\"Flags\": 0,\r\n\t\t\t\t\t\t\"Owner\": \"raNDu1gNyZ5hipBTKxm5zx7NovA1rNnNRf\",\r\n\t\t\t\t\t\t\"RootIndex\": \"C5383B94DDE4BE2A184757D80837080C4D1EAB80789FE39F7D7AECFB0D0304BB\"\r\n\t\t\t\t\t},\r\n\t\t\t\t\t\"LedgerEntryType\": \"DirectoryNode\",\r\n\t\t\t\t\t\"LedgerIndex\": \"DE9566F4A52F813268B6F782F7DFA05BEA928B886439C6530575020BC59F509B\"\r\n\t\t\t\t}\r\n\t\t\t}, {\r\n\t\t\t\t\"CreatedNode\": {\r\n\t\t\t\t\t\"LedgerEntryType\": \"Offer\",\r\n\t\t\t\t\t\"LedgerIndex\": \"EA23F8DE2C5CFD98645EACA5812BCCFAD19C6B5D1F144F3884C53AF1F519D495\",\r\n\t\t\t\t\t\"NewFields\": {\r\n\t\t\t\t\t\t\"Account\": \"raNDu1gNyZ5hipBTKxm5zx7NovA1rNnNRf\",\r\n\t\t\t\t\t\t\"BookDirectory\": \"A7A2258942BF79A1C2A55DA88560879DC312966AFDD1CD055A11C37937E08000\",\r\n\t\t\t\t\t\t\"OwnerNode\": \"0000000000000001\",\r\n\t\t\t\t\t\t\"Sequence\": 838,\r\n\t\t\t\t\t\t\"TakerGets\": {\r\n\t\t\t\t\t\t\t\"currency\": \"JPY\",\r\n\t\t\t\t\t\t\t\"issuer\": \"rB3gZey7VWHYRqJHLoHDEJXJ2pEPNieKiS\",\r\n\t\t\t\t\t\t\t\"value\": \"2\"\r\n\t\t\t\t\t\t},\r\n\t\t\t\t\t\t\"TakerPays\": \"1000000\"\r\n\t\t\t\t\t}\r\n\t\t\t\t}\r\n\t\t\t}],\r\n\t\t\t\"TransactionIndex\": 14,\r\n\t\t\t\"TransactionResult\": \"tesSUCCESS\"\r\n\t\t},\r\n\t\t\"validated\": true\r\n\t},\r\n\t\"status\": \"success\",\r\n\t\"type\": \"response\"\r\n}'

//testTx()

function checkWinston(){

  loga.info('sadas')
}

function testTx(){
	let info = JSON.parse(txData)
	if (info.hasOwnProperty('result') &&
		info.result.hasOwnProperty('validated') &&
		info.result.validated
		){

		console.log('has')
	}else{
		console.log('no')

	}

}

function testPrecision(){
var a = 319.18806228708996999999
  console.log(a.toPrecision(16))
}

//testChunk()
function testChunk(){
  var cofs = [1,4,5,6,89,3,34,54,8,9,32,34,12,34,5]
  console.log(cofs)
  console.log(myUtils.chunk(2, cofs))
}

function delayAsync(){
  function print(){
    console.log('delay')
  }
  console.log('main')
  setTimeout( print, 200 );
  console.log('main')
}


function testMockSend(){
  var cofs = [1,4,5,6,89,3,34,54,8,9,32,34,12,34,5]
  mockSend(cofs, 200, 2)
}

function mockSend(counterOffers, interval, throttle){
  var buffer = []
  var i = 1;
  for (let cOffer of counterOffers){
    buffer.push(cOffer)
    if (buffer.length == throttle){
      var fill = []
      while (buffer.length > 0 ){
        fill.unshift(buffer.pop())
      }
      setTimeout(mockCreateOrder, interval * i, fill)
      i++
    }
  }
  if (buffer.length > 0){
    console.log("remainder " + buffer)
    setTimeout(mockCreateOrder, interval * i, buffer)

  }
  console.log('done')
}

function mockCreateOrder(orders){
  console.log(orders)
}


function arrayQueue (){
  var array = [];
  array.unshift(4);
  console.log(array);
  array.unshift(7);
  array.pop();
  console.log(array);
}

function loop(){
  var ar = [1, 2, 3, 4, 5];

  for (let i in ar){
   console.log(i)
  }
}

function splice(){
var ar = [1, 2, 3, 4, 5];

var ar2 = ar.slice(3, 5);
console.log(ar);
console.log(ar2);

}

function testNull(){
  var a = null
  if (a){
    console.log('aaa')
  }else{
    console.log('bbbb')

  }
}

const manyOrders = '{\r\n   \"type\": \"payment\",\r\n   \"address\": \"rnog8JA6y226WH5RqwPkbU23YCzRkVHsQz\",\r\n   \"sequence\": 3,\r\n   \"id\": \"90B26770BBAB07FC7E2022946F5448F87E324E59D9BEF9AEE452F51081FFC2E7\",\r\n   \"specification\": {\r\n      \"source\": {\r\n         \"address\": \"rnog8JA6y226WH5RqwPkbU23YCzRkVHsQz\",\r\n         \"maxAmount\": {\r\n            \"currency\": \"JPY\",\r\n            \"value\": \"1604.998525\"\r\n         }\r\n      },\r\n      \"destination\": {\r\n         \"address\": \"rnog8JA6y226WH5RqwPkbU23YCzRkVHsQz\",\r\n         \"amount\": {\r\n            \"currency\": \"XRP\",\r\n            \"value\": \"50\"\r\n         }\r\n      },\r\n      \"paths\": [\r\n         [\r\n            {\r\n               \"account\": \"rB3gZey7VWHYRqJHLoHDEJXJ2pEPNieKiS\",\r\n               \"type\": 1,\r\n               \"type_hex\": \"0000000000000001\"\r\n            },\r\n            {\r\n               \"currency\": \"XRP\",\r\n               \"type\": 16,\r\n               \"type_hex\": \"0000000000000010\"\r\n            }\r\n         ]\r\n      ]\r\n   },\r\n   \"outcome\": {\r\n      \"result\": \"tesSUCCESS\",\r\n      \"timestamp\": \"2017-06-08T21:24:11.000Z\",\r\n      \"fee\": \"0.000012\",\r\n      \"balanceChanges\": {\r\n         \"raNDu1gNyZ5hipBTKxm5zx7NovA1rNnNRf\": [\r\n            {\r\n               \"counterparty\": \"rB3gZey7VWHYRqJHLoHDEJXJ2pEPNieKiS\",\r\n               \"currency\": \"JPY\",\r\n               \"value\": \"289.09114999998\"\r\n            },\r\n            {\r\n               \"currency\": \"XRP\",\r\n               \"value\": \"-9.131\"\r\n            }\r\n         ],\r\n         \"rB3gZey7VWHYRqJHLoHDEJXJ2pEPNieKiS\": [\r\n            {\r\n               \"counterparty\": \"raNDu1gNyZ5hipBTKxm5zx7NovA1rNnNRf\",\r\n               \"currency\": \"JPY\",\r\n               \"value\": \"-289.09114999998\"\r\n            },\r\n            {\r\n               \"counterparty\": \"rBGGmp22NG7eNmzAKNPeGhGUoxHv8ZaFDD\",\r\n               \"currency\": \"JPY\",\r\n               \"value\": \"-1297.18206\"\r\n            },\r\n            {\r\n               \"counterparty\": \"rnog8JA6y226WH5RqwPkbU23YCzRkVHsQz\",\r\n               \"currency\": \"JPY\",\r\n               \"value\": \"1589.44575641998\"\r\n            }\r\n         ],\r\n         \"rnog8JA6y226WH5RqwPkbU23YCzRkVHsQz\": [\r\n            {\r\n               \"currency\": \"XRP\",\r\n               \"value\": \"49.999988\"\r\n            },\r\n            {\r\n               \"counterparty\": \"rB3gZey7VWHYRqJHLoHDEJXJ2pEPNieKiS\",\r\n               \"currency\": \"JPY\",\r\n               \"value\": \"-1589.44575641998\"\r\n            }\r\n         ],\r\n         \"rBGGmp22NG7eNmzAKNPeGhGUoxHv8ZaFDD\": [\r\n            {\r\n               \"currency\": \"XRP\",\r\n               \"value\": \"-40.869\"\r\n            },\r\n            {\r\n               \"counterparty\": \"rB3gZey7VWHYRqJHLoHDEJXJ2pEPNieKiS\",\r\n               \"currency\": \"JPY\",\r\n               \"value\": \"1297.18206\"\r\n            }\r\n         ]\r\n      },\r\n      \"orderbookChanges\": {\r\n         \"raNDu1gNyZ5hipBTKxm5zx7NovA1rNnNRf\": [\r\n            {\r\n               \"direction\": \"sell\",\r\n               \"quantity\": {\r\n                  \"currency\": \"XRP\",\r\n                  \"value\": \"1.777\"\r\n               },\r\n               \"totalPrice\": {\r\n                  \"currency\": \"JPY\",\r\n                  \"counterparty\": \"rB3gZey7VWHYRqJHLoHDEJXJ2pEPNieKiS\",\r\n                  \"value\": \"56.1532\"\r\n               },\r\n               \"sequence\": 3074,\r\n               \"status\": \"filled\",\r\n               \"makerExchangeRate\": \"31.6\"\r\n            },\r\n            {\r\n               \"direction\": \"sell\",\r\n               \"quantity\": {\r\n                  \"currency\": \"XRP\",\r\n                  \"value\": \"1.9\"\r\n               },\r\n               \"totalPrice\": {\r\n                  \"currency\": \"JPY\",\r\n                  \"counterparty\": \"rB3gZey7VWHYRqJHLoHDEJXJ2pEPNieKiS\",\r\n                  \"value\": \"60.135\"\r\n               },\r\n               \"sequence\": 3019,\r\n               \"status\": \"filled\",\r\n               \"makerExchangeRate\": \"31.65\"\r\n            },\r\n            {\r\n               \"direction\": \"sell\",\r\n               \"quantity\": {\r\n                  \"currency\": \"XRP\",\r\n                  \"value\": \"1.777\"\r\n               },\r\n               \"totalPrice\": {\r\n                  \"currency\": \"JPY\",\r\n                  \"counterparty\": \"rB3gZey7VWHYRqJHLoHDEJXJ2pEPNieKiS\",\r\n                  \"value\": \"56.33089999999999\"\r\n               },\r\n               \"sequence\": 3049,\r\n               \"status\": \"filled\",\r\n               \"makerExchangeRate\": \"31.69999999999999\"\r\n            },\r\n            {\r\n               \"direction\": \"sell\",\r\n               \"quantity\": {\r\n                  \"currency\": \"XRP\",\r\n                  \"value\": \"1.9\"\r\n               },\r\n               \"totalPrice\": {\r\n                  \"currency\": \"JPY\",\r\n                  \"counterparty\": \"rB3gZey7VWHYRqJHLoHDEJXJ2pEPNieKiS\",\r\n                  \"value\": \"60.23\"\r\n               },\r\n               \"sequence\": 3001,\r\n               \"status\": \"filled\",\r\n               \"makerExchangeRate\": \"31.7\"\r\n            },\r\n            {\r\n               \"direction\": \"sell\",\r\n               \"quantity\": {\r\n                  \"currency\": \"XRP\",\r\n                  \"value\": \"1.777\"\r\n               },\r\n               \"totalPrice\": {\r\n                  \"currency\": \"JPY\",\r\n                  \"counterparty\": \"rB3gZey7VWHYRqJHLoHDEJXJ2pEPNieKiS\",\r\n                  \"value\": \"56.24204999999999\"\r\n               },\r\n               \"sequence\": 3047,\r\n               \"status\": \"filled\",\r\n               \"makerExchangeRate\": \"31.64999999999999\"\r\n            }\r\n         ],\r\n         \"rBGGmp22NG7eNmzAKNPeGhGUoxHv8ZaFDD\": [\r\n            {\r\n               \"direction\": \"sell\",\r\n               \"quantity\": {\r\n                  \"currency\": \"XRP\",\r\n                  \"value\": \"40.869\"\r\n               },\r\n               \"totalPrice\": {\r\n                  \"currency\": \"JPY\",\r\n                  \"counterparty\": \"rB3gZey7VWHYRqJHLoHDEJXJ2pEPNieKiS\",\r\n                  \"value\": \"1297.18206\"\r\n               },\r\n               \"sequence\": 3691,\r\n               \"status\": \"partially-filled\",\r\n               \"makerExchangeRate\": \"31.74\"\r\n            }\r\n         ]\r\n      },\r\n      \"ledgerVersion\": 30362161,\r\n      \"indexInLedger\": 60,\r\n      \"deliveredAmount\": {\r\n         \"currency\": \"XRP\",\r\n         \"value\": \"50\"\r\n      }\r\n   }\r\n}\r\n\r\n'

function testMany(){
  let a = JSON.parse(manyOrders)

}


function  testFile(){
  var fs = require('fs')
  var obj = JSON.parse(fs.readFileSync('../config.txt', 'utf8'))
  console.log(obj)
}

function testModulo(){
  var a = 3048627 % 17
  console.log(a)
}

function testForEachReturn(){
  var a = [1,2,56,7]
  let b = []
  a.forEach(aa => {
    return
  })

}

testModulo()

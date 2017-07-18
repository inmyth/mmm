const inspect         = require('util').inspect
const PubSub          = require ('pubsub-js')
const events          = require ('./events.js')
const chunk           = require('./my-utils.js').chunk
const winston         = require('winston')
const loga            = require('./env-utils.js').loga(winston)
const logs            = require('./env-utils.js').logs(winston)
const formatPrecision = require('./env-utils.js').formatPrecision

class Counter {
  constructor(env){
    this.env        = env
    this.throttleMs = 200
    this.throttle   = 2
  }

  performCounter(txs){
    let obChangePromises = this.filterTxsForObChange(txs)
    this.buildCounter(obChangePromises, this.submitCounters, this.sendDelayedOffers)
  }

  filterTxsForObChange(txs){
    let self = this

    var isStatusOk = function(change){
      return (change.status == 'filled' || change.status == 'partially-filled')
    }

    var getBotConfig = function(order){
      let key = order.quantity.currency + '/' + order.totalPrice.currency
      let botConfig = self.env.botConfigs.get(key)
      if (botConfig){
        if (order.quantity.counterparty == botConfig.issuer || order.totalPrice.counterparty == botConfig.issuer){
          return botConfig
        }
      }
      return undefined
    }

    var obChangeProms = []

    txs.forEach(tx => {
      //loga.verbose(inspect(tx, false, null))
      if (tx.type == 'order' || tx.type == 'payment'){
        if (tx.type == 'order'){
          if (tx.address != self.env.address){ // then orderbookChanges must contain our address and the direction has to be reversed
            var obChanges = eval('tx.outcome.orderbookChanges.' + this.env.address)
            if(obChanges){
              obChanges.forEach(obChange => {
                if (isStatusOk(obChange)){
                  let botConfig = getBotConfig(obChange)
                  if (botConfig){
                    obChange.direction = obChange.direction == 'buy' ? 'sell' : 'buy'
                    obChange.botConfig = botConfig
                    obChangeProms.push(Promise.resolve(obChange))
                  }
                }
              })
            }
          }
          else if (tx.address == self.env.address){ // then orderbookChanges must contain counters' address and the direction is already counter direction
            let botConfig = getBotConfig(tx.specification)
            if (botConfig){
              for(var counterAccount in tx.outcome.orderbookChanges){
                var obChanges = eval('tx.outcome.orderbookChanges.' + counterAccount)
                if (obChanges){
                  obChanges.forEach(obChange => {
                    // (if XRP/JPY buy is consumed, the consuming order can be direction sell XRP buy JPY or direction buy JPY sell XRP). So reverse it if quantity has counter currency.
                    if (obChange.quantity.currency == botConfig.quote){
                      obChange.direction = obChange.direction == 'buy' ? 'sell' : 'buy'
                      var totalPrice = obChange.totalPrice
                      obChange.totalPrice = obChange.quantity
                      obChange.quantity = totalPrice
                    }
                    if (isStatusOk(obChange)){
                      obChange.botConfig = botConfig
                      obChangeProms.push(Promise.resolve(obChange))
                    }
                  })
                }
              }
            }
          }
        }
        else if (tx.type == 'payment'){
          if (tx.address != self.env.address){ //only count address belonging to counter
            var obChanges = eval('tx.outcome.orderbookChanges.' + this.env.address)
            if(obChanges){
              obChanges.forEach(obChange => {
                if (isStatusOk(obChange)){
                  let botConfig = getBotConfig(obChange)
                  if (botConfig){
                    obChange.direction = obChange.direction == 'buy' ? 'sell' : 'buy'  // reverse it because it's our own
                    obChange.botConfig = botConfig
                    obChangeProms.push(Promise.resolve(obChange))
                  }
                }
              })
            }
          }
        }
      }
    })
    return obChangeProms
  }

  buildCounter(obChangePromises){
    Promise.all(obChangePromises).then(obChanges => {
      var counterProms = []
      obChanges.forEach(obChange => {
        let counter = Counter.createBalancedCounter(obChange)
        loga.info(counter)
        if (counter){
          counterProms.push(Promise.resolve(counter))
        }else{
          loga.error('Counter rate is negative. Possible cause : gridSpace is too large.')
        }
      })
      Promise.all(counterProms).then(counters => {
        let counterOffer = new CounterOffer()
        counterOffer.fill(counters)
        this.sendDelayedOffers(counterOffer.sells)
        this.sendDelayedOffers(counterOffer.buys)
      })
    })
  }

  sendDelayedOffers(orders){
    var i = 0;
    chunk(this.throttle, orders)
    .forEach(chunk => {
      setTimeout(this.publishRequestPrepareSubmitTx, this.throttleMs * i, chunk)
      i++
    })
  }

  publishRequestPrepareSubmitTx(orders){
    PubSub.publish(events.REQ_API_PREPARE_SUBMIT_TX, orders)
  }

  // In balanced counter, the new order quantity is the same as consumed quantity
  static createBalancedCounter(change){
    //loga.info(change)
    var counter = {}
    let rate = Counter.getRate(change)
    counter.direction = change.direction
    let counterRate = Counter.getNewRate(counter.direction, rate, change.botConfig.gridSpace)
    if (counterRate <= 0){
      loga.error('negative rate : ' + counterRate + ' , not countering')
      return null
    }
    counter.quantity = change.quantity
    counter.totalPrice = change.totalPrice
    counter.totalPrice.value = String(Counter.getCounterTotalPriceValue(counter.quantity.value, counterRate))
    counter.passive = false
    counter.fillOrKill = false
    return counter
  }

// In Yuki counter, all new orders' quantity is fixed. I think it has to be proportional to the settings quantity otherwise partially-filled order will be problem.
  static createYukiCounter(change){
    //loga.info(change)
    var counter = {}
    let rate = Counter.getRate(change)
    counter.direction = change.direction
    let counterRate = Counter.getNewRate(counter.direction, rate, change.botConfig.gridSpace)
    if (counterRate <= 0){
      loga.error('negative rate : ' + counterRate + ' , not countering')
      return null
    }
    counter.quantity = String(Counter.getYukiCounterQuantityValue(counter.direction, change.botConfig))
    counter.totalPrice = change.totalPrice
    counter.totalPrice.value = String(Counter.getCounterTotalPriceValue(counter.quantity.value, counterRate))
    counter.passive = false
    counter.fillOrKill = false
    return counter
  }

  static getNewRate(direction, rate, margin){
    let res = direction == 'buy' ? rate - margin : rate + margin
    return res
  }

  static getRate(change){
    let res = parseFloat(change.totalPrice.value) /  parseFloat(change.quantity.value)
    return res
  }

  static getCounterTotalPriceValue(quantityValue, rate){
    let res =  parseFloat(quantityValue) * rate
    return formatPrecision(res)
  }

  static getYukiCounterQuantityValue(counterDirection, botConfig){
    let res = counterDirection == 'buy' ? botConfig.sellOrderQuantity : botConfig.buyOrderQuantity
    return formatPrecision(res)
  }

}


/*
Each order needs different sequence. I increment the sequence from the first order
prepared. Read https://forum.ripple.com/viewtopic.php?f=2&t=15869
*/
function sendMultipleOrders(address, secret, api, orders){
	var preparePromises = []
		orders.map(order => {
  		loga.info(order)
  		preparePromises.push(api.prepareOrder(address, order))
	})

	Promise.all(preparePromises).then(preparedTxs => {
		preparedTxs.forEach((preparedTx, currentIndex, arr) => {
			var txJSON = JSON.parse(preparedTx.txJSON)
		  var newSequence = txJSON.Sequence + currentIndex
			txJSON.Sequence = newSequence
			preparedTx.txJSON = JSON.stringify(txJSON)
			var signedTx = api.sign(preparedTx.txJSON, secret)
			var load = TxCache.makeLoad(orders[currentIndex], preparedTx, txJSON, signedTx)
      logs.info(newSequence)
			api.submit(load.signedTx.signedTransaction).then(message => {
				loga.info(inspect(load, false, null))
        loga.verbose(message)
        let param = {
          load    : load,
          message : message
        }
        PubSub.publish('GOT_TX_SUBMITTED_RESPONSE', param)
        //txCache.push(load, message)
			})
		})
	})
}

function cancelOrdersByRange(address, secret, api, lowSeq, highSeq){
  let seqs = []
  for (var i = lowSeq; i <= highSeq; orderSeq++){
    seqs.push(i)
  }
  cancelOrdersByArray(address, secret, api, seqs)
}

function cancelOrdersByArray(address, secret, api, seqs){
  /*
  There are two sequences: orderSequence (the order to be canceled) and the request sequence
  */
  if (seqs.length == 0){
    return
  }
  var increment = 0
  seqs.forEach(orderSeq => {
    const orderCancellation = {orderSequence: orderSeq}
    api.prepareOrderCancellation(address, orderCancellation)
    .then(prepared => {
      var txJSON = JSON.parse(prepared.txJSON)
      let seq = txJSON.Sequence
      seq += increment
      txJSON.Sequence = seq
      prepared.txJSON = JSON.stringify(txJSON)
      prepared.instructions.sequence = seq
      increment++
      console.log(prepared)
      return Promise.resolve(prepared)
    })
    .then(prepared => {
      const {signedTransaction} = api.sign(prepared.txJSON, secret)
      api.submit(signedTransaction).then(message => {
        console.log(message)
      })
    })
  })

}


class CounterOffer{
  constructor(){
    this.buys  = []
    this.sells = []
  }

  fill(counters){
    counters.map(counter => {
      if (counter.direction == 'buy'){
        this.buys.push(counter)
      }else if (counter.direction == 'sell'){
        this.sells.push(counter)
      }
    })
  }
}

class TxCache{
  constructor() {
    this.immediates = [] // immediately create new offer: tefMAX_LEDGER, tefPAST_SEQ
    this.delayeds 	= new Map() // check if exist given ledger interval : tesSUCCESS, terQUEUED
    this.cancels    = [] //contains sequences of orders to be canceled
  }

	static makeLoad (order, preparedTx, txJSON, signedTx){
		var load = {
			order	      : order,
			preparedTx  : preparedTx,
			txJSON		  : txJSON,
			signedTx 	  : signedTx
		}
		return load
	}

	getImmediatesAndReset(){
		let orders = this.immediates
		this.immediates = []
		return orders
	}

  getCancelsAndReset(){
    let seqs = this.cancels
    this.cancels = []
    return seqs
  }
	getUnvalidateds(ws, currentLedgerVersion){
		let txOpt = {
			command     : 'tx',
			transaction : 'SIGNED_TX_HASH'
		}

    var unvalidateds = []
		for (let [key, load] of this.delayeds) {
			loga.info('Verifying tesSUCCESS : ' + key)
			if (currentLedgerVersion > load.txJSON.LastLedgerSequence){
				this.immediates.push(load.order)
				this.delayeds.delete(key)
				loga.warn('Failed to verify tesSUCCESS: ' + key + ' , will retry next ledger.')
			}
			txOpt.transaction = key
      unvalidateds.push(JSON.stringify(txOpt))
		}
    return unvalidateds
	}

	pushOrder(load, message){
		var resultCode = message.resultCode
		if (resultCode == 'tesSUCCESS' || resultCode == 'terQUEUED'){
			this.delayeds.set(load.signedTx.id, load)
		}
		else if (resultCode == 'tefPAST_SEQ' || resultCode == 'tefMAX_LEDGER' || resultCode == 'tefALREADY' || resultCode == 'telINSUF_FEE_P' || resultCode == 'terPRE_SEQ'){
			this.immediates.push(load.order)
		}
	}

}


module.exports = {
  Counter               : Counter,
  sendMultipleOrders    : sendMultipleOrders,
  cancelOrdersByRange   : cancelOrdersByRange,
  cancelOrdersByArray   : cancelOrdersByArray,
  TxCache			          : TxCache
}

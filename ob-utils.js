'use strict'

const inspect = require('util').inspect
const PubSub = require ('pubsub-js')
const events = require('./events.js')
const {buildOrderConfig, formatPrecision} = require('./env-utils')

function buildAskArray(myAddress, orderbook){
  var asks        = orderbook.asks
  var askArray    = []
  var myAskArray  = []
  asks.forEach(ask => {
    var order = new Order(ask.specification)
    askArray.unshift(order)
    if(myAddress === ask.properties.maker){
        myAskArray.push(order)
    }
  })
  return new SortedOrder(askArray, myAskArray )
}

function buildBidArray(myAddress, orderbook){
  var bids        = orderbook.bids
  var bidArray    = []
  var myBidArray  = []
  bids.forEach(bid => {
    let order = new Order(bid.specification)
    bidArray.push(order)
    if(myAddress === bid.properties.maker){
      myBidArray.push(order)
    }
  })
  // sort it because bids may contain rate 0.1 misplaced at top.
  bidArray.sort(function(a, b) {
    return b.rate - a.rate
  })
  return new SortedOrder(bidArray, myBidArray)
}

function buildVerticalSequence (book){
  function getVal(order){
    return order.order.specification.quantity.value
  }
  function getRate(order){
    return order.rate
  }
  for (let ask of book.asks){
    console.log('Ask ' + getRate(ask) + ' ' +  getVal(ask));
  }
  for (let bid of book.bids){
    console.log('Bid ' + getVal(bid) + ' ' + getRate(bid));
  }
}

var SortedOrder = function(orders, myOrders){
	this.orders = orders
	this.myOrders = myOrders
}

var Book = function(myAddress, orderbook){
  var sortedBid = buildBidArray(myAddress, orderbook)
  this.bids = sortedBid.orders
  this.myBids = sortedBid.myOrders
  var sortedAsk = buildAskArray(myAddress, orderbook)
  this.asks = sortedAsk.orders
  this.myAsks = sortedAsk.myOrders

  if (this.asks.length == 0 || this.bids.length == 0){
    this.spread = 0
  }else{
    this.spread = this.asks[this.asks.length - 1].rate - this.bids[0].rate
    this.highestBid = this.bids[0]
    this.lowestAsk = this.asks[this.asks.length - 1]
  }
}


class Order {
  constructor(spec, seq = -1){
    this.specification  = spec
    let quantityValue   = spec.quantity.value
    var totalPrice      = spec.totalPrice.value
    this.rate           = parseFloat(totalPrice) / parseFloat(quantityValue)
    this.seq            = seq
  }

}

class Maintainer {
  constructor(env) {
    this.env      = env
    this.interval = env.botConfigs.size + env.maintainInterval
  }

  shouldRun(ledgerVersion){
    return ledgerVersion % this.interval == 0
  }

  createPairSymbolFromOffer(offer) {
    let base
    let quote
    if(offer.taker_gets.hasOwnProperty('currency')){
      base = offer.taker_gets.currency
    }else {
      base = 'XRP'
    }
    if(offer.taker_pays.hasOwnProperty('currency')){
      quote = offer.taker_pays.currency
    }else {
      quote = 'XRP'
    }
    return base + '/' + quote
  }

/*
     {
      //sell 1 XRP for 0.3 USD
        "flags": 131072,
        "quality": "0.0000003",
        "seq": 3809,
        "taker_gets": "1000000",
        "taker_pays": {
          "currency": "USD",
          "issuer": "rB3gZey7VWHYRqJHLoHDEJXJ2pEPNieKiS",
          "value": "0.3"
        }
      },
      {
        // sell 1 XRP for 32 JPY
        "flags": 131072,
        "quality": "0.000032",
        "seq": 3810,
        "taker_gets": "1000000",
        "taker_pays": {
          "currency": "JPY",
          "issuer": "rB3gZey7VWHYRqJHLoHDEJXJ2pEPNieKiS",
          "value": "32"
        }
      }
      // buy 2 XRP for 48 JPY
      {
        "flags": 0,
        "quality": "41666.66666666667",
        "seq": 3811,
        "taker_gets": {
          "currency": "JPY",
          "issuer": "rB3gZey7VWHYRqJHLoHDEJXJ2pEPNieKiS",
          "value": "48"
        },
        "taker_pays": "2000000"
      },
*/
  buildOrderBookMap(offers){
    let simpleBooks = new Map()
    offers.forEach(offer => {
      let base                  = undefined
      let quote                 = undefined
      let takergetsIssuer       = undefined
      let takergetsValue        = undefined
      let takerpaysIssuer       = undefined
      let takerpaysValue        = undefined

      if(offer.taker_gets.hasOwnProperty('currency')){
        quote = offer.taker_gets.currency
        takergetsIssuer = offer.taker_gets.issuer
        takergetsValue = parseFloat(offer.taker_gets.value)
      }else if(offer.taker_gets){
        quote = 'XRP'
        takergetsValue = parseInt(offer.taker_gets) / 1e6
      }
      if(offer.taker_pays.hasOwnProperty('currency')){
        base = offer.taker_pays.currency
        takerpaysIssuer = offer.taker_pays.issuer
        takerpaysValue = parseFloat(offer.taker_pays.value)
      }else if(offer.taker_pays){
        base = 'XRP'
        takerpaysValue = parseInt(offer.taker_pays) / 1e6
      }

      let symbol        = base + '/' + quote
      let reverseSymbol = quote + '/' + base
      let isReversed    = false

      let botConfig = this.env.botConfigs.get(symbol)
      if (botConfig == undefined){
        botConfig   = this.env.botConfigs.get(reverseSymbol)
        isReversed  = true
      }

      if(botConfig == undefined){
        return
      }
      if(quote != 'XRP' && takergetsIssuer != botConfig.issuer){
        return
      }
      if(base != 'XRP' && takerpaysIssuer != botConfig.issuer){
        return
      }

      let keySymbol = isReversed ? reverseSymbol : symbol
      if (!simpleBooks.has(keySymbol)){
        simpleBooks.set(keySymbol, new SimpleBook(botConfig))
      }
      let simpleBook = simpleBooks.get(keySymbol)
      let orderConfig
      if (!isReversed){
        orderConfig = buildOrderConfig('buy', base, takerpaysValue, quote, takergetsValue, botConfig.issuer)
        simpleBook.pushBuy(new Order(orderConfig, offer.seq))
      }else{
        orderConfig = buildOrderConfig('sell', quote, takergetsValue, base, takerpaysValue, botConfig.issuer)
        simpleBook.pushSell(new Order(orderConfig, offer.seq))
      }
    })
    return simpleBooks
  }

  seedBuys(count, startRate, botConfig, result){
    let i
    for(i = 1; i <= count; i++){
      let newRate =  startRate - botConfig.gridSpace * i
      if (newRate > 0){
        let totalPriceQuantity = newRate * botConfig.buyOrderQuantity
        let newOrder = buildOrderConfig('buy', botConfig.base, botConfig.buyOrderQuantity, botConfig.quote, totalPriceQuantity, botConfig.issuer)
        result.push(newOrder)
      }else{
        break
      }
    }
  }

  seedSells(count, startRate, botConfig, result){
    let i
    for(i = 1; i <= count; i++){
      let newRate = startRate + botConfig.gridSpace * i
      let totalPriceQuantity = newRate * botConfig.sellOrderQuantity
      let newOrder = buildOrderConfig('sell', botConfig.base, botConfig.sellOrderQuantity, botConfig.quote, totalPriceQuantity, botConfig.issuer)
      result.push(newOrder)
    }
  }

  addOrTrim(sbMap){
    let newOrders   = []
    let cancelSeqs  = []

    sbMap.forEach(simpleBook => {
      let botConfig = simpleBook.botConfig
      let buyGap  = botConfig.buyGridLevels - simpleBook.buys.length
      let sellGap = botConfig.sellGridLevels - simpleBook.sells.length
      if (buyGap > 0){
        let startRate = simpleBook.buys.length == 0 ? botConfig.startMiddlePrice : simpleBook.buys[0].rate
        let count     = simpleBook.buys.length == 0 ? botConfig.buyGridLevels : buyGap
        this.seedBuys(count, startRate, botConfig, newOrders)
      } else if (buyGap < 0){
        let i
        for(i = 0; i < buyGap * -1; i++){
          cancelSeqs.push(simpleBook.buys[i].seq)
        }
      }
      if (sellGap > 0){
        let startRate = simpleBook.sells.length == 0 ? botConfig.startMiddlePrice : simpleBook.sells[simpleBook.sells.length - 1].rate
        let count     = simpleBook.sells.length == 0 ? botConfig.sellGridLevels : sellGap
        this.seedSells(count, startRate, botConfig, newOrders)
      } else if (sellGap < 0){
        let i
        for(i = 0; i > sellGap; i--){
          cancelSeqs.push(simpleBook.sells[simpleBook.sells.length - 1 + i].seq)
        }
      }
    })

    if (cancelSeqs.length > 0){
      PubSub.publish(events.GOT_MAINTAIN_TRIM_ORDERS, cancelSeqs)
    }
    if (newOrders.length > 0){
      PubSub.publish(events.GOT_MAINTAIN_SEED_ORDERS, newOrders)
    }
  }

  processOffers(offers) {
    let orderBookMap = this.buildOrderBookMap(offers)
    this.addOrTrim(orderBookMap)
  }
}

class SimpleBook {
  constructor(botConfig){
    this.botConfig  = botConfig
    this.sells      = []
    this.buys       = []
  }

  pushSell(order){
    this.sells = this.insertAscending(this.sells, order)
  }

  pushBuy(order){
    this.buys = this.insertAscending(this.buys, order)
  }

  insertAscending(arr, item){
    let ix = 0
    while (ix < arr.length) {
      if (item.rate < arr[ix].rate) { break }
      ix++
    }
    arr.splice(ix,0,item)
    return arr
  }

}

function buildAccountOffersConfig(address){
  let res = {
    command   : 'account_offers',
    account   : 'ADDRESS',
    ledger    : 'current'
  }
  res.account = address
  return res
}

function buildOrderbookConfig(botConfig){
  let orderbookConf = {
    'base': {
      'currency': 'base currency here'
    },
    'counter': {
      'currency': 'quote currency here'
    }
  }
  base.currency = botConfig.base
  if (base.currency != 'XRP'){
    base.counterparty = botConfig.issuer
  }
  counter.currency = botConfig.quote
  if (counter.currency != 'XRP'){
    counter.counterparty = botConfig.issuer
  }
  return orderbookConf
}

module.exports = {
  buildBook : function(myAddress, orderbook){
    return new Book(myAddress, orderbook)
  },
  buildVerticalSequence     : buildVerticalSequence,
  buildOrderbookConfig      : buildOrderbookConfig,
  buildAccountOffersConfig  : buildAccountOffersConfig,
  Maintainer                : Maintainer
}



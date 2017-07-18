'use strict';
const {RippleAPI} = require('ripple-lib');
const altnet = 'ws://s.altnet.rippletest.net:51233'
const live = 'wss://s1.ripple.com'
const bankTest = 'rHjGuGDJvKQ2RSLj3WesnxVoKVVhbSwYQL'
const bankMrRipple = 'rB3gZey7VWHYRqJHLoHDEJXJ2pEPNieKiS'
const tradePair = "XRP/JPY";

const api = new RippleAPI({
  server: altnet
});

const resolution = 0.5;

//const address = 'r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59';
const address = 'raNDu1gNyZ5hipBTKxm5zx7NovA1rNnNRf';
const orderbookConf = {
  "base": { // the first currency in pair
    "currency": tradePair.split('/')[0]
  },
  "counter": {
    "currency": tradePair.split('/')[1],
    "counterparty": bankMrRipple
  }
};

api.on('error', (errorCode, errorMessage) => {
  console.log(errorCode + ': ' + errorMessage);
});
api.on('connected', () => {
  console.log('connected');
  console.log(tradePair);
});
api.on('disconnected', (code) => {
  console.log('disconnected, code:', code);
});

var MAX_LEDGER = 500;
api.connect().then(() => {
  var max_ledger_count = 1;
  var orderBookQ = [];

  api.on('ledger', ledger => {
    api.getOrderbook(address, orderbookConf)
    .then(orderbook => {

      console.log(orderbook)
/*
      var timeStamp = Math.floor(Date.now() / 1000);
      orderBookQ.unshift(new Orderbook(timeStamp, orderbook));
      if (orderBookQ.length > 1 ){
        // find consumed orders, find partially consumed orders
        compareOrdersLength(orderBookQ[1], orderBookQ[0])
        orderBookQ.pop();
        //console.log(JSON.stringify(orderBookQ[0].getAsksJson(), null, 2))
      }

       //buildVerticalSequence(orderbook);
       //console.log(JSON.stringify(obNow.getAsksJson(), null, 2));
    }).then(() => {
        max_ledger_count++;
        if(max_ledger_count >= MAX_LEDGER){
          return api.disconnect();
        }
    });
    */
});

}).catch(console.error);

function marketMake(oldOb, newOb){
  /*
    1. Check length. Positive = more orders, Negative = consumed
    2. Check change in balance in latest orders regardless of length dif

  */
  var oldAsks = oldOb.getAsks();
  var newAsks = newOb.getAsks();
  var askDif = oldAsks.length - newAsks.length
  var marker = oldAsks.length - askDif

  var askRecovers = [];
  if (askDif >= 0){ // Maintain old order index

  }else{ // Consumed. Maintain last element in old orders
    askDif = askDif * -1;
    var consumeds = oldOb.getAsks().slice(oldAsks.length - askDif, newAsks.length)
    for (let consumed of consumeds){
        var replacementOrder = buildReplacementOrder(consumed, null, consumed.getRate() - resolution)
        if (!replacementOrder){
          askRecovers.push(replacementOrder);
        }
    }
    if (newAsks.length > 0){
        replacementOrder = buildReplacementOrder(consumed, null, consumed.getRate() - resolution)
    }
  }


  var bidDif = oldOb.getBids().length - newOb.getBids().length

}

function buildReplacementOrder(oldOrder, newOrder, recoveryRate){
  var newOrderAmount = newOrder === null ? 0 : newOrder.specification.quantity.value
  var recoveryAmount = oldOrder.specification.quantity.value - newOrderAmount;
  if (recoveryAmount == 0){
    return null;
  }
  return new SimpleOrder(recoveryAmount, recoveryRate);
}

function compareOrdersLength(oldOb, newOb){
  var askDif = oldOb.getAsks().length - newOb.getAsks().length
  var bidDif = oldOb.getBids().length - newOb.getBids().length
  console.log('askDif ' + askDif + ' BidDiff '+ bidDif)
}

function getVolumeChange(oldOrder, newOrder){
  var oldVal = oldOrder.specification.quantity.value
  var newVal = newOrder.specification.quantity.value
  return oldVal - newVal
}

function buildVerticalSequence(orderbook){
  printOrderArray(buildAskArray(orderbook), "Ask", true)
  printOrderArray(buildBidArray(orderbook), "Bid", false)
}

function buildAskArray(orderbook){
  var asks = orderbook.asks;
  var askArray = [];
  for (var i in asks){
      var ask = new Order(asks[i])
      askArray.unshift(ask)
  }
  return askArray
}

function buildBidArray(orderbook){
  var bids = orderbook.bids;
  var bidArray = []
  for (var i in bids){
      var bid = new Order(bids[i])
      bidArray.push(bid)
  }
// sort it because bids may contain rate 0.1 wrongly placed at top.
  bidArray.sort(function(a,b) {
    return b.getRate() - a.getRate()
  });
  return bidArray
}

function printOrderArray (orders, prefix, isAsk){
  for (var i in orders){
      var val = orders[i].getOrder().specification.quantity.value;
      var rate = orders[i].getRate();
      if (!isAsk){
        console.log('Bid ' + val + ' ' + rate);
      }else {
        console.log('Ask ' + rate + ' ' +  val);
      }
  }
}

function printSequence (item){
  console.log(item.properties.sequence);
}

var SimpleOrder = function(amount, rate){
  this.amount = amount;
  this.rate = rate;
}

SimpleOrder.prototype.getAmount = function(){
  return(this.amount)
}

SimpleOrder.prototype.getRate = function(){
  return(this.rate)
}

var Orderbook = function(ts, orderbook){
  this.ts = ts;
  this.askArray = buildAskArray(orderbook);
  this.bidArray = buildBidArray(orderbook);
};

Orderbook.prototype.getTs = function(){
  return(this.ts);
};

Orderbook.prototype.getAsks = function(){
  return(this.askArray);
};

Orderbook.prototype.getBids = function(){
  return(this.bidArray);
};

var Order = function(order){
  this.order = order;
  var sellVal = order.specification.quantity.value;
  var buyVal = order.specification.totalPrice.value;
  var makerExchangeRate = order.properties.makerExchangeRate;
  this.rate = parseFloat(buyVal) / parseFloat(sellVal);
}

Order.prototype.getRate = function(){
  return(this.rate);
};

Order.prototype.getOrder = function(){
  return(this.order);
};


/*
    {
      "specification": {
        "direction": "buy",
        "quantity": {
          "currency": "XRP",
          "value": "3000"
        },
        "totalPrice": {
          "currency": "JPY",
          "value": "33750",
          "counterparty": "rB3gZey7VWHYRqJHLoHDEJXJ2pEPNieKiS"
        }
      },
      "properties": {
        "maker": "rPt3mX7UNbzHmSVwmmkP4p1TSThF1Z5bgp",
        "sequence": 276,
        "makerExchangeRate": "0.08888888888888889"
      },
      "state": {
        "fundedAmount": {
          "currency": "JPY",
          "value": "0",
          "counterparty": "rB3gZey7VWHYRqJHLoHDEJXJ2pEPNieKiS"
        },
        "priceOfFundedAmount": {
          "currency": "XRP",
          "value": "0"
        }
      }
    }
*/

/*
    {
      "specification": {
        "direction": "sell",
        "quantity": {
          "currency": "XRP",
          "value": "3000"
        },
        "totalPrice": {
          "currency": "JPY",
          "value": "9000000",
          "counterparty": "rB3gZey7VWHYRqJHLoHDEJXJ2pEPNieKiS"
        }
      },
      "properties": {
        "maker": "rhVC1hS1qTvAgbcH187nywTdSgWckwkqjW",
        "sequence": 7,
        "makerExchangeRate": "3000"
      }
    },

*/

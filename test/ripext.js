const {RippleAPI} = require('ripple-lib');
//const rippleOrderbook = require('ripple-lib-orderbook')
const OrderBook = require('./ripple-lib-extensions/orderbook/dist/npm/orderbook').OrderBook;
//const OrderBookUtils = require('./ripple-lib-extensions/orderbook/src/orderbookutils');

const altnet = 'ws://s.altnet.rippletest.net:51233';
const api = new RippleAPI({
  server: altnet
});


  api.connect().then(function() {

    var book = OrderBook.createOrderBook(api, {
      currency_gets: 'XRP',
      issuer_pays: 'rHjGuGDJvKQ2RSLj3WesnxVoKVVhbSwYQL',
      currency_pays: 'USD'
    });

    book.on('model', function(offers) {
      console.log(new Date().toUTCString());
      console.log(offers);
    });
  });

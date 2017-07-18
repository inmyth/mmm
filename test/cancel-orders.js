/*
Tests that depends on ledger event go here
*/
'use strict';
const isLive = false;

const {RippleAPI} = require('ripple-lib');
const obUtils = require('../ob-utils.js');
const txUtils = require('../tx-utils.js')

const altnet = 'ws://s.altnet.rippletest.net:51233';
const livenet = 'wss://s1.ripple.com'


const api = new RippleAPI({
  server: isLive ? livenet : altnet
});

const envTest1 = { // buys USD
    net: 'ws://s.altnet.rippletest.net:51233',
    address : 'rDnUEzgvZHE6UX7ZJXBA4wt5jWC4uwXAjL',
    secret : 'shF1tYM52sMZif2k2cB5Qs8QvNmHM',
    pair  : 'USD/XRP',
    issuer : 'rHjGuGDJvKQ2RSLj3WesnxVoKVVhbSwYQL'
  }

const envTest2 = { // buys XRP
    net: 'ws://s.altnet.rippletest.net:51233',
    address : 'rD8dZy2cXdzURTbFb3bhebQ3FFvaWCB8Nx',
    secret : 'ssr5uhqU7VZdZrUE36iogSQwyRQ8b',
    pair  : 'XRP/USD',
    issuer : 'rHjGuGDJvKQ2RSLj3WesnxVoKVVhbSwYQL'
  }


const envLive = {
  net: 'wss://s1.ripple.com',
  address : 'rB3gZey7VWHYRqJHLoHDEJXJ2pEPNieKiS',
  secret : 'NEED SECRET',
  pair  : 'XRP/USD',
  issuer : 'rB3gZey7VWHYRqJHLoHDEJXJ2pEPNieKiS'
}

api.on('disconnected', (code) => {
  console.log('disconnected, code:', code);
});

api.on('error', (errorCode, errorMessage) => {
  console.log(errorCode + ': ' + errorMessage);
});


cancelOrders()

function cancelOrders(){
  api.connect().then(() => {
    console.log('connected');
    deleteOrdersByFirstSequence(envTest2, 405, 10)
  })
}

function deleteOrdersByFirstSequence(env, firstSeq, length){
  var delSeqs = []
  var i
  for (i = firstSeq; i < firstSeq + length; i++){
      console.log(i)

    delSeqs.push(parseInt(i))
  }
  cancelAllTestOrders(env, delSeqs)
}

function getDeleteSequencesFromFile(){
  var delSeqs = []
  require('fs').readFileSync('delseqs.txt').toString().split('\n')
  .forEach(
    function (line) {
      var isnum = /^\d+$/.test(line);
      if (isnum){
        delSeqs.push(parseInt(line))
      }
   }
  )
  console.log('Deleting sequences ' + delSeqs)
  return delSeqs
}

function cancelAllTestOrders(env, seqs){
  txUtils.cancelOrders(env.address, env.secret, api, seqs)
}




'use strict'
const isLive = true
const RippleAPI = require('ripple-lib').RippleAPI
const credentials = './credentials.txt'
const env = require('./env-utils.js').makeEnv(isLive, credentials)

const api = new RippleAPI({server: 'wss://s1.ripple.com'})

function fail(message) {
  console.error(message);
  process.exit(1);
}

function cancelOrder(orderSequence) {
  console.log('Cancelling order: ' + orderSequence.toString());
  return api.prepareOrderCancellation(env.address, {orderSequence})
  .then(prepared => {
    const signing = api.sign(prepared.txJSON, env.secret);
    return api.submit(signing.signedTransaction);
  });
}

function cancelAllOrders(orderSequences) {
  if (orderSequences.length === 0) {
    return Promise.resolve();
  }
  const orderSequence = orderSequences.pop();
  return cancelOrder(orderSequence).then(() => cancelAllOrders(orderSequences));
}

api.connect().then(() => {
  console.log('Connected...');
  return api.getOrders(env.address).then(orders => {
    const orderSequences = orders.map(order => order.properties.sequence);
    return cancelAllOrders(orderSequences);
  }).then(() => process.exit(0));
}).catch(fail);

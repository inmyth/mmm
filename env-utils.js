'use strict'
const winston       = require('winston')
const readFileSync  = require('fs').readFileSync

const livenet = 'wss://s1.ripple.com'
const altnet  = 'ws://s.altnet.rippletest.net:51233'

const envTemplate = {
  net               : 'websocket address',
  address           : 'wallet address',
  secret            : 'secret key',
  maintainInterval  : 10, // ledger interval between maintainer operation
  botConfigs        : 'map of currency pair - botConfig as defined by config.txt'
}

function makeEnv(isLive = true, credentialsPath = './credentials.txt', configPath = './config.txt'){
  let env = envTemplate

  let botConfigRaws = JSON.parse(readFileSync(configPath, 'utf8'))
  if (!botConfigRaws){
    return null
  }

  var botConfigMap = new Map()
  botConfigRaws.forEach(botConfigRaw => {
    botConfigRaw.base     = botConfigRaw.pair.split('/')[0]
    botConfigRaw.quote    = botConfigRaw.pair.split('/')[1]
    botConfigRaw.throttle = botConfigRaw.throttle == undefined || botConfigRaw.throttle < 1 ? 1 : botConfigRaw.throttle
    botConfigMap.set(botConfigRaw.pair, botConfigRaw)
  })

  env.net = isLive ? livenet : altnet
  const lineBreakRegex = /(\r\n|\n|\r)/gm;
  var lines = require('fs').readFileSync(credentialsPath, 'utf-8').split('\n')
  if (lines.length >= 2){
    env.address = lines[0].replace(lineBreakRegex,"")
    env.secret  = lines[1].replace(lineBreakRegex,"")
  }

  env.botConfigs = botConfigMap
  return env
}


function createInitialOrders(config){
  let nSells = config.sellGridLevels
  let nBuys = config.buyGridLevels
  let orders = []
  var nSell = 1
  var nBuy  = 1

  while (true){
    if (nBuy > nBuys && nSell > nSells){
      break
    }
    if (nSell  <= nSells){
      let rate = config.startMiddlePrice  + config.gridSpace * nBuy
      let totalPriceValue = rate * config.sellOrderQuantity
      var sellConfig = buildOrderConfig('sell', config.base, config.sellOrderQuantity, config.quote, totalPriceValue, config.issuer)
      orders.push(sellConfig)
      nSell++
    }
    if (nBuy <= nBuys){
      let rate = config.startMiddlePrice  - config.gridSpace * nBuy
      if (rate > 0){
        let totalPriceValue = rate * config.buyOrderQuantity
        var buyConfig = buildOrderConfig('buy', config.base, config.buyOrderQuantity, config.quote, totalPriceValue, config.issuer)
        orders.push(buyConfig)
        nBuy++
      }else{
        nBuy = nBuys + 1
      }
    }
  }
  return orders
}

function getHighestSell(startMiddlePrice, gridLevels, gridSpace){
  return startMiddlePrice + gridLevels * gridSpace;
}

function calculateBuyGridLevels(startMiddlePrice, gridlevels, gridSpace){
  var lowestBuy = getLowestBuy(startMiddlePrice, gridlevels, gridSpace);
  if (lowestBuy >= 0){
    return gridlevels;
  }
  return (Math.floor(startMiddlePrice / gridSpace));
}

function getLowestBuy(startMiddlePrice, gridLevels, gridSpace){
  var lowestBuy = startMiddlePrice - gridLevels * gridSpace;
}


function getLogAll(winston){
  winston.loggers.add('log', {
  console: {
    level: 'silly'
  },
  file: {
    filename: 'log.txt'
  }
  })
  var loga = winston.loggers.get('log')
  return loga
}

function getLogSequence(winston){
  winston.loggers.add('sequences', {
  console: {
    level: 'info'
  },
  file: {
    filename: 'sequences.txt'
  }
  })
  var logs = winston.loggers.get('sequences')
  return logs
}



function buildOrderConfig(
  direction,
  quantityCurrency,
  quantityValue,
  totalPriceCurrency,
  totalPriceValue,
  issuer){

  const order = {
    'direction' : direction,
    'quantity': {
      'currency': quantityCurrency,
      'value' : String(formatPrecision(quantityValue))
    },
    'totalPrice': {
      'currency': totalPriceCurrency,
      'value': String(formatPrecision(totalPriceValue))
    },
    'passive': false,
    'fillOrKill': false
  }

  if (quantityCurrency != 'XRP'){
    order.quantity.counterparty = issuer
  }
  if (totalPriceCurrency != 'XRP'){
    order.totalPrice.counterparty = issuer
  }

	return order
}

function formatPrecision(value){
  return value.toPrecision(16)
}

module.exports = {
  makeEnv  						: makeEnv,
  loga     						: getLogAll,
  logs     						: getLogSequence,
  createInitialOrders : createInitialOrders,
  buildOrderConfig    : buildOrderConfig,
  formatPrecision 		: formatPrecision
}

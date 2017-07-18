'use strict';

const WebSocket = require('ws')

const ws = new WebSocket('wss://s1.ripple.com' )

const subscribeTx = '{\r\n  \"command\": \"subscribe\",\r\n  \"accounts\": [\"raNDu1gNyZ5hipBTKxm5zx7NovA1rNnNRf\"]\r\n}'

ws.on('open', function open() {
  console.log('connected')
  ws.send(subscribeTx)
})

ws.on('message', function incoming(data) {
  console.log(data)
})




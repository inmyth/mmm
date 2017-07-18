## Ripple Market Making Bot

- Creates offers on different levels of rate. The grid space between them is constant. Trade pairs, quantities, grid space are all defined in bot config. 
- Each time an offer is taken, it creates a counter offer with new rate ( new_rate = consumed_rate + or - grid_space).
- Features a robust retrial menchanism. Due to the nature of Ripple blockchain, there is no guarantee that orders submitted will be successfull (recorded in the validated ledger). The bot features automated retrial and checking function to make sure orders sent reach immutability in the ledger.    
- This bot is tested for trading between XRP/currency. It doesn't support autobridge and arbitrage (trading of same currencies with different issuers).


### How to use


- Install dependencies
```npm install ripple-lib```
```npm install ws```
```npm install winston```
```npm install pubsub-js```

- Create trading parameters in a file `config.txt`. Use config.template as reference.   
- Open main.js and set isLive = true for live trading, false for testnet trading.  
- To use live net:  
Create `credentials.txt` in root folder. Put account address on the first line and secret on the second like this.
```
ADDRESS
SECRET
```

### Run
To run the bot:
`node main.js`
You will see log.txt for general log and sequences.txt for order sequence numbers (useful for canceling orders) in root folder.

To create initial orders:
`node create-orders.js`

Both main.js and create-orders.js depend on the settings in `config.txt`.

To cancel many orders at once, put the highest and lowest order sequences you want to cancel in cancel-orders.js and run it. You can use get the sequence numbers from sequences.txt or the wallet app.
`node cancel-orders.js`

To cancel all order, use 
`node cancel-all-orders.js`  


### Version History
v.019
- fixed bugs (event names, function signature) in main.js


v.018
- fixed create-orders.js

v.017
- fixed some logic on test-orderbook.js

v.016
- refactor to Pub-sub pattern
- created maintainer to maintain number of order levels

v.015 (work in progress)
- bug (v15)
- work on maintainer

v.014
- Bot will counter currencies defined in config.txt. Botconfigs was arranged as Map<pair, config> so the bot can quickly match the currency pair of tx that comes in.

v.013
- Added cancel-all-orders.js (taken from ripple-lib samples)

v.012
- Counter rate is set as consumed rate + or - gridSpace.

v.011
- Bug fix: tx-utils.js : When a consuming order contains multiple orders only one element is passed to counter mechanism. Turns out using "for of" only returns one element. I changed it to forEach.
- Changed tx-utils.js so first it collect all orderbook changes then iterate them to counters.
- Added `test-many-in-one-orders.js` to test this case order

v.010
- Negative counter rate will not pass the order. To avoid this make sure that gridspace is proportional to market rate.

v.009
- Create shutdown for cancel-orders.js. Canceling orders will not be retried regardless of response because some sequences do not correspond to existing orders.

v.008
- Fixed bug in tx-utils#performCounter (env.counter is now env.botConfig.quote)
- Created shutdown procedure for create-orders.js
- Fixed create-orders' orders not showing up as trades (fillorkill and passive should be set false)
- Merged bot-utils.js to env-utils.js
- Rearranged some files

v.007
- Created order levels.

v.006
- Fixed bugs in order intercept. All orders entering value and quantity modifiation must already be reversed.
- Cleaned rate and value calculations
- Added winston dependency for logging.


v.005
- Added retry strategies. Technically all submitted txs need to be verified. Only once it gets validated=true it is saved on the ledger.
- Ripple API's getTransaction does not work so raw websocket is used.

v.004
live net returns many responses. Need to check each scenario or use ripple-lib-extension

v.003 alpha
completed test (read tx, find consumed offers, create counter, send new offer)
credentials must be put on a file

v.002
functionalized performCounter


TODO
- (done) conceal live env
- (done) send counters to prepareOrders
- (done) handle order consumed scenarios (buy order XRP/JPY will be consumed by sell order XRP buy JPY -default-, buy order JPY sell XRP, and payment)
- (done) non-XRP values need 16 point precision
- (done)create retries for send (tefMAX_LEDGER error)
- need synchronized for txCache ?
- (done) create cancel orders procedure for saved sequences.txt
- read tx responses to see if calculation is correct
- (done) create order levels by botConfig
- (done) create log mechanism (trades, errors)
- subscribe to tx will get all orders in different currencies so make sure to counter only what the bot is set for.
- (done) create create-orders.js shutdown
- (cancelled, some sequences correspond to non-existing orders) create cache mechanism for cancel-orders
- (done) if counter rate is negative then log.error
- (done) change env to json format to accomodate more than one pair
- (done) create config.txt for bot configs
- main should validate config
- (done) performCounter needs to match currency pair
- (urgent after v.014) check everything that uses env as env structure has changed
- one websocket per pair or all pairs in one socket  (maybe one socket because of sequence)
- (done) create "maintainer" process to keep the number of orders as set in env.
--  Maintainer checks orderbook, gets own orders,
--  if the number < config create new ones
--  if number > config delete some. Deleting requires sequence number. Orderbook has it.
- get pair from an offer, use it as key to get botConfig, push the offer to a temp map, after offer sream completes check length of each value in temp map against botConfig, if length differs, sort the temp's value, add create offers or delete offers as needed, send them to txCache
- (canceled) make maintainer run every N ledgers
- (done) test maintainer
- test main post-refactor
- race problem with maintainer : some orders are cached to wait for validated=true, maintainer needs take into account these orders.


TEST
- live test 1 : check if order consumed response is as assumed
-- start with one transaction each
-- get all responses
-- get order consumed response
- v.004 live test 2 : check of each time order is consumed a counter offer is created
-- need to see why it stops at the end: a submitted tx even with tesSUCCESS response may fail to be saved in the ledger. A retry strategy is needed.
- multiple currency test
-- create orders defined in config.bot. These orders should be counteres.
-- create orders not defined in config.bot. These orders should be ignored.


NOTES
- getTransactions set with types : ['order'] also filters out consumed order (some orders arrive with type : [payment])
- submit may fail even with tesSUCCESS. All successfull submitted txs are to be verified in next ledger event. Those that fail will be immediately resubmitted.


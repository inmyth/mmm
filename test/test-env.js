'use strict'
const envUtils = require('../env-utils.js')


function testmakeEnv(){
  console.log(envUtils.makeEnv(true, '../credentials.txt', './fixtures/config.txt.fixtures'))
}

testmakeEnv()

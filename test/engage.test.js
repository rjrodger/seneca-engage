/* Copyright (c) 2013 Richard Rodger */
"use strict";

// mocha engage.test.js



var assert  = require('assert')

var _  = require('underscore')
var gex  = require('gex')


var seneca = require('seneca')()

seneca.use( require('..') )

var engagement = seneca.pin({role:'engage',cmd:'*'})

describe('engage', function() {
  
  it('version', function() {
    assert.ok(gex(seneca.version),'0.5.*')
  }),


  it('happy', function() {
    engagement.set({key:'k1',value:'v1'},function(err,token){
      console.log(err,token)
      assert.ok(null==err)
      assert.ok(null!=token)
      assert.ok(_.isString(token))
      assert.ok(0 < token.length)
    })

  })
})
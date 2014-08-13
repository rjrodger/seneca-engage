/* Copyright (c) 2013-2014 Richard Rodger */
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
    engagement.set({key:'k1',value:'v1'},function(err,out){
      assert.ok(null==err)
      assert.ok(null!=out)
      assert.ok(_.isString(out.token))
      assert.ok(0 < out.token.length)

      
      engagement.get({key:'k1',token:out.token},function(err,out){
        assert.ok(null==err)
        assert.ok(null!=out)
        assert.ok(_.isString(out.value))
        assert.equal(out.value,'v1')
      })
    })
  })

  it('context', function() {
    var ctxt = {}
    engagement.set({key:'k2',value:'v2',context:ctxt},function(err,out){
      assert.ok(null==err)
      assert.ok(0 < out.token.length)
      assert.equal( ctxt.engage_token, out.token )

      engagement.get({key:'k2',token:out.token,context:ctxt},function(err,out){
        assert.ok(null==err)
        assert.ok(null!=out)
        assert.ok(_.isString(out.value))
        assert.equal(out.value,'v2')
      })
    })
  })

})

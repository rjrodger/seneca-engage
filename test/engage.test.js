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
      assert.ok(null==err)
      assert.ok(null!=token)
      assert.ok(_.isString(token))
      assert.ok(0 < token.length)

      
      engagement.get({key:'k1',token:token},function(err,value){
        assert.ok(null==err)
        assert.ok(null!=value)
        assert.ok(_.isString(value))
        assert.equal(value,'v1')
      })
    })
  })

  it('context', function() {
    var ctxt = {}
    engagement.set({key:'k2',value:'v2',context:ctxt},function(err,token){
      assert.ok(null==err)
      assert.ok(0 < token.length)
      assert.equal( ctxt.engage_token, token )

      engagement.get({key:'k2',token:token,context:ctxt},function(err,value){
        assert.ok(null==err)
        assert.ok(null!=value)
        assert.ok(_.isString(value))
        assert.equal(value,'v2')
      })
    })
  })

  it('reqres', function() {
    var req = {}, res = {cookie:function(k,v){req.seneca={engage_token:v}}}
    engagement.set({key:'k3',value:'v3',req$:req,res$:res},function(err,token){
      assert.ok(null==err)
      assert.ok(0 < token.length)
      assert.ok(null!=req.seneca)
      assert.equal( req.seneca.engage_token, token )

      engagement.get({key:'k3',token:token,req:req,res:res},function(err,value){
        assert.ok(null==err)
        assert.equal(value,'v3')
      })
    })
  })
  
})

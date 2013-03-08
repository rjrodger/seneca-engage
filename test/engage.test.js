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


  it('wrap', function() {

    seneca.add({foo:'A'},function(args,done){
      done(null,{d:args.a+args.b+args.c,c:4})
    })

    engagement.wrap({pin:{foo:'A'},keys:['b','c']})

    var ctxt = {}
    engagement.set({values:{b:2,c:3},context:ctxt},function(err,token){
      console.dir(ctxt)
      seneca.act({foo:'A',a:1,context:ctxt},function(err,out){
        //console.log(out)
        assert.equal(out.d,6)

        engagement.get({context:ctxt},function(err,out){
          //console.dir(out)
          assert.equal(out.c,4)
        })
      })
    })
  })
  
})

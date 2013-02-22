/* Copyright (c) 2013 Richard Rodger, MIT License */
"use strict";


var _ = require('underscore')
var uuid = require('node-uuid')



module.exports = function engage( options, register ) {
  var name = "engage"

  options = _.extend({
    tokenkey:'seneca-engage', // name of cookie
  },options)

  
  var engage_ent = this.make('sys','engage')


  function create_engage(cb) {
    var engage = engage_ent.make$()
    engage.token = uuid()
    engage.save$(cb)
  }


  function ensure_engage(token,error,handler) {
    engage_ent.load$({token:token},function(err,engage){
      if( err ) return error(err);
      if( engage ) return handler(engage);
      create_engage(function(err,engage){
        if( err ) return error(err);
        if( engage ) return handler(engage);
      })
    })
  }
  
  
  function setone(engage,key,value,cb) {
    engage[key]=value
    engage.save$(function(err,engage){
      cb(err,engage&&engage.token)
    })
  }

  function setmany(engage,values,cb) {
    _.each(values,function(k,v){ engage[k]=v })
    engage.save$(function(err,engage){
      cb(err,engage&&engage.token)
    })
  }

  function getone(token,key,cb) {
    ensure_engage(token,cb,function(engage){
      cb(null,engage[key])
    })
  }

  function getmany(token,cb) {
    ensure_engage(token,cb,function(engage){
      cb(null,engage.data$(false))
    })
  }


  this.add({role:name,cmd:'set'},function(args,cb){
    var token = args.token || 
      (args.context && args.context.engage_token) || 
      (args.req$&&args.req$.seneca&&args.req$.seneca.engage_token)

    ensure_engage(token,cb,do_set)

    function do_set(engage) {
      if( args.key ) {
        setone( engage, args.key, args.value, settoken )
      }
      else {
        setmany( engage, args.values, settoken )
      }
    }


    function settoken(err, token) {
      if( err ) return cb(err);

      if( args.context ) {
        args.context.engage_token = token
      }

      if( args.res$ ) {
        args.res$.cookie(options.tokenkey,token)
      }

      cb(null,token)
    }
  })


  this.add({role:name,cmd:'get'},function(args,cb){
    var token = args.token || (args.context && args.context.engage_token) || (args.req$&&args.req$.seneca&&args.req$.seneca.engage_token)
    if( !token ) return cb();

    if( args.key ) {
      getone( token, args.key, cb )
    }
    else {
      getmany( token, cb )
    }
  })


  this.add({role:name,info:true},function(args,cb){
    cb(null,{name:name})
  })


  function service(req,res,next) {
    var token = req.cookies[options.tokenkey]
    if( token ) {
      req.seneca = req.seneca || {}
      req.seneca.engage_token = token
      next()
    }
    else return next();
  }


  register(null,{
    name:name,
    service:service
  })
}

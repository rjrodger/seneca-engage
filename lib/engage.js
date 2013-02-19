/* Copyright (c) 2013 Richard Rodger, MIT License */
"use strict";




var _ = require('underscore')
var uuid = require('node-uuid')



module.exports = function engage( seneca, options, register ) {
  var name = "engage"

  options = _.extend({
    tokenkey:'seneca-engage', // name of cookie
  },options)

  
  var engage_ent = seneca.make('sys','engage')

  function loadengage(token,error,handler) {
    if( token && token.$ ) return handler(token)
    engage_ent.load$({token:token},function(err,engage){
      if( err ) return error(err);
      if( engage ) return handler(engage);
      seneca.fail({code:'engage/not-found',token:token},error)
    })
  }
  
  
  function setone(token,key,value,cb) {
    loadengage(token,cb,function(engage){
      engage[key]=value
      engage.save$(function(err,engage){
        cb(err,engage&&engage.token)
      })
    })
  }

  function setmany(token,values,cb) {
    loadengage(token,cb,function(engage){
      _.each(values,function(k,v){ engage[k]=v })
      engage.save$(function(err,engage){
        cb(err,engage&&engage.token)
      })
    })
  }

  function getone(token,key,cb) {
    loadengage(token,cb,function(engage){
      cb(null,engage[key])
    })
  }

  function getmany(token,cb) {
    loadengage(token,cb,function(engage){
      cb(null,engage.data$(false))
    })
  }


  seneca.add({role:name,cmd:'set'},function(args,cb){
    var token = args.token || (args.context && args.context.engage_token) || (args.req&&args.req.seneca&&args.req.seneca.engage_token)
    if( token ) return do_set(token)

    // TODO: handle not found - just recreate
    
    var engage = engage_ent.make$()
    engage.token = uuid()
    engage.save$(function(err,engage){
      if( err ) return cb(err);

      if( args.context ) {
        args.context.engage_token = engage.token
      }

      if( args.res ) {
        args.res.cookie(options.tokenkey,engage.token)
      }
      
      do_set(engage.token)
    })

    function do_set(token) {
      if( args.key ) {
        setone( token, args.key, args.value, cb )
      }
      else {
        setmany( token, args.values, cb )
      }
    }
  })


  seneca.add({role:name,cmd:'get'},function(args,cb){
    var token = args.token || (args.context && args.context.engage_token) || (args.req&&args.req.seneca&&args.req.seneca.engage_token)
    if( !token ) return cb();

    if( args.key ) {
      getone( token, args.key, cb )
    }
    else {
      getmany( token, cb )
    }
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

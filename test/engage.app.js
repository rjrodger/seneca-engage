/* Copyright (c) 2013-2014 Richard Rodger */
"use strict";

// node engage.app.js

var connect = require('connect')

var seneca = require('seneca')()

seneca.use( require('..') )

seneca.act({role:'web',use:function(req,res,next){
  var key = req.query.k
  var val = req.query.v

  if( val ) {
    req.seneca.act('role:engage,cmd:set',{key:key,value:val},respond)
  }
  else {
    req.seneca.act('role:engage,cmd:get',{key:key},respond)
  }

  function respond(err,out) {
    if( err) return next(err);

    res.writeHead(200)
    res.end('key '+key+'='+out.value)
  }

}})



var app = connect()
app.use( connect.query() )
app.use( seneca.export('web') )

app.listen(3000)

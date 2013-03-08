/* Copyright (c) 2013 Richard Rodger */
"use strict";

// node engage.app.js

var connect = require('connect')

var seneca = require('seneca')()

seneca.use( require('..') )


var engagement = seneca.pin({role:'engage',cmd:'*'})


var app = connect()
app.use( connect.logger() )
app.use( connect.query() )
app.use( connect.cookieParser() )

app.use( seneca.service() )

app.use( function(req,res,next) {
  if( '/favicon.ico' ==req.url ) return next();

  console.dir(req.query)
  var key = req.query.k
  var val = req.query.v

  if( val ) {
    engagement.set({key:key,value:val,req$:req,res$:res},function(){respond()})
  }
  else {
    engagement.get({key:key,req$:req,res$:res},respond)
  }

  function respond(err,val) {
    console.log(key,val,err)
    res.writeHead(200)
    res.end('key '+key+'='+val)
  }
})


app.listen(3000)
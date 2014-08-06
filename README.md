seneca-engage
=============

Handle web visitor engagements

Prerequisites
-------------

seneca-engage is a [Seneca](http://senecajs.org/) plugin.  In order to use seneca-engage, you must have Seneca installed in your project.  Make sure `seneca` is a dependency in your `package.json` file, and run `npm install`

Setup
-----

Add seneca-engage to your project by adding it as a dependency in your `package.json` file:
```JSON
"dependencies": {
  ...
  "seneca-engage": "X.Y.Z",
  ...
}
```
where X, Y, and Z are the appropriate version numbers. Run `npm install` to install all of the dependencies, including seneca-engage.

Since seneca-engage is a seneca plugin, it can be registered to the seneca instance simply by adding the line

```JavaScript
seneca.use('engage');
```

Then, in order for the engage plugin and other web-plugins to be available on the server (in this case a connect server), all you need to add to the server is the seneca web middleware:

```JavaScript
var app = connect();
app.use( seneca.export('web') );
app.listen(3000);
```

The engage commands are now available via the `seneca.act()` API.  For example, to call the `get` command, with the key `'myKey'`, you could write

```JavaScript
seneca.act('role:engage, cmd:get', {key:'myKey'}, callback);
```

Alternatively, you can pin the engage role to a variable via the `seneca.pin()` API and call the commands as methods.

```JavaScript
var engagement = seneca.pin({role:'engage',cmd:'*'});
engage.get({key:'myKey'}, callback);
```

Commands
--------

engagement.set({key:'k1',value:'v1'},function(err,out){...})

Example
-------

TODO

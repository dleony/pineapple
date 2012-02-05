var jsdom = require('jsdom');
var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var util = require('util');

var host = process.env['MONGO_NODE_DRIVER_HOST'] != null ? process.env['MONGO_NODE_DRIVER_HOST'] : 'localhost';
var port = process.env['MONGO_NODE_DRIVER_PORT'] != null ? process.env['MONGO_NODE_DRIVER_PORT'] : Connection.DEFAULT_PORT;

console.log(process.version);

var db = new Db('crawler', new Server(host, port, {}), {native_parser: false, auto_reconnect: true});

var open = function onOpen(error, db) {
    console.log('Connecting to mongodb: ' + db.databaseName);
};

function pushToMongo(html) {
    db.collection('history', function withCollection(error, collection) {
        collection.insert({'html': html }, function whenDone(error, docs) {
            console.log('the docs are: ' + util.inspect(docs));
            docs.forEach(function(doc) {
                console.dir(doc);
            });
        });
    });  
};

function start() {
  console.log('starting...');
  jsdom.env({
    html: 'http://www.html5rocks.com/en/',
    scripts: ['http://code.jquery.com/jquery.min.js'], 
    done: function parse(errors, window) {
        var html = window.$('html');
        var attrs = html[0].attributes;  
        var result = '<html';
        window.$.each(attrs, function() { 
            result += ' ' + this.name + '="' + this.value + '"';
        });    
        result += '>' + html.html() + '</html>';
        console.log(result);
        pushToMongo(result);
      }
  });
}

process.on('uncaughtException', function (err) {
  console.log('Caught exception: ' + err);
});

db.open(open);

start();
//setInterval(start, 5000);

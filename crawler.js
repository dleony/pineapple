var jsdom = require('jsdom');
var Db = require('mongodb').Db,
  Connection = require('mongodb').Connection,
  Server = require('mongodb').Server;


function start() {
  console.log('starting...');
  jsdom.env({
    html: 'http://www.html5rocks.com/en/',
    scripts: ['http://code.jquery.com/jquery.min.js'], 
    done: function parse(errors, window) {
      window.$('a').each(function(index) {        
        console.log(window.$(this).attr('href'));
        //debugger;
      });
    }
  });
}

process.on('uncaughtException', function (err) {
  console.log('Caught exception: ' + err);
});

start();
//setInterval(start, 5000);

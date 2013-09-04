
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var sensors = require('./routes/sensors');
var actuators = require('./routes/actuators');
var charts = require('./routes/charts');
var http = require('http');
var path = require('path');

var app = express();

//menus
app.locals.menus = [
	{'name':'dashboard', 	'href':'/',				'css':'icon-play', 					'label':'Dashboard'},
	{'name':'sensors', 		'href':'/sensor/list', 	'css':'icon-circle-arrow-right', 	'label':'Sensors'},
	{'name':'actuators', 	'href':'/actuator/list','css':'icon-random', 				'label':'Actuators'},
	{'name':'hourlychart', 	'href':'/charts', 		'css':'icon-signal', 				'label':'Hourly chart (24h)'},
	{'name':'rawchart', 	'href':'/chartsRaw', 	'css':'icon-signal', 				'label':'Raw chart (3h)'},
	{'name':'credits', 		'href':'/credits', 		'css':'icon-heart', 				'label':'Credits'},
	{'name':'typography', 	'href':'/typography', 	'css':'icon-list-alt', 				'label':'Typography'}
];

// all environments
app.set('port', process.env.PORT || 8080);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
var oneYear = 31557600000;
app.use(express.static(__dirname + '/public', { maxAge: oneYear }));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/credits', routes.credits);
app.get('/typography', routes.typography);
app.get('/charts', charts.charts);
app.get('/chartsRaw', charts.chartsRaw);
app.get('/json/chart/currentDay', charts.currentDay);
app.get('/json/chart/raw', charts.raw);
app.get('/sensor/list', sensors.index);
app.get('/sensor/add', sensors.form);
app.get('/actuator/list', actuators.index);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

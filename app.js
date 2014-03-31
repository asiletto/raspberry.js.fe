var express = require('express');
var routes = require('./routes');
var sensors = require('./routes/sensors');
var actuators = require('./routes/actuators');
var charts = require('./routes/charts');
var dcharts = require('./routes/dynChart');
var http = require('http');
var path = require('path');
var dao = require('./fedao').FeDAO;

var app = express();

// load menus the first time the app start
var dynmenus = [];
var loadMenus = function(req, res, next){

	if(dynmenus.length == 0){
		console.log("loading menus...");
		dao.loadCharts(function(err, charts){
		
		dynmenus.push({'name':'dashboard', 	'href':'/',	'css':'icon-play', 	'label':'Dashboard'});
		dynmenus.push({'name':'sensors', 'href':'/sensor/list', 	'css':'icon-circle-arrow-right', 'label':'Sensors'});
		dynmenus.push({'name':'actuators', 	'href':'/actuator/list','css':'icon-random', 'label':'Actuators'});
		
		for(var i in charts){
			var chart = charts[i];
			
			console.log("dynchart: "+chart._id+", title:"+chart.title);
			
			dynmenus.push({'name':'chart'+chart._id, 	'href':'/dcharts/raw?id='+chart._id, 	'css':'icon-signal', 				'label':chart.title});
			
		}
		
		dynmenus.push({'name':'rawchart', 	'href':'/charts/raw', 	'css':'icon-signal', 				'label':'Raw chart (3h)'});
		dynmenus.push({'name':'hourlychart', 	'href':'/charts/day',	'css':'icon-signal', 				'label':'Hourly chart (24h)'});
		dynmenus.push({'name':'weeklychart', 	'href':'/charts/week',	'css':'icon-signal', 				'label':'Weekly chart (7d)'});
		dynmenus.push({'name':'credits', 		'href':'/credits', 		'css':'icon-heart', 				'label':'Credits'});
		dynmenus.push({'name':'typography', 	'href':'/typography', 	'css':'icon-list-alt', 				'label':'Typography'});

		res.locals({
			menus: dynmenus
		});
		
		next();
		});
		
	}else{

	res.locals({
		menus: dynmenus
	});
	
	next();
	
	}
	
}

// all environments
app.set('port', process.env.PORT || 8080);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
//app.use(express.cookieParser('your secret here 123 abc aaa sss xxx ssss ddd fff ggg'));
//app.use(express.session());
app.use(loadMenus);

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
app.get('/charts/day', charts.chartsDay);
app.get('/charts/week', charts.chartsWeek);
app.get('/charts/raw', charts.chartsRaw);

app.get('/dcharts/raw', dcharts.chartRaw);
app.get('/json/dchart/raw', dcharts.raw);
app.get('/dcharts/last', dcharts.lastValues);

app.get('/json/chart/hourly', charts.hourly);
app.get('/json/chart/raw', charts.raw);
app.get('/sensor/list', sensors.index);
app.get('/sensor/add', sensors.form);
app.get('/actuator/list', actuators.index);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

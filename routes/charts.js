var dao = require('../dao').LogDAO;

exports.chartsDay = function(req, res){
  res.render('charts', { title: 'Hourly chart (24h)', hcharts: 'true', menu: 'hourlychart', hours: '24'});
};

exports.chartsWeek = function(req, res){
  res.render('charts', { title: 'Weekly chart (7d)', hcharts: 'true', menu: 'weeklychart', hours: '168'});
};

exports.chartsRaw = function(req, res){
  res.render('chartsRaw', { title: 'By minute chart (3h)',  hcharts: 'true', menu: 'rawchart'});
};

exports.raw = function(req, res){
  var sensors = req.query.sensors;
  var sensArr = sensors.split(",");
  var sensorNames = req.query.labels;
  var nameArr = sensorNames.split(",");
  var response = [];
  var serieMap = {};
   for (var i in sensArr) {
       var serie = sensArr[i];
       var label = nameArr[i];
       serieMap[serie] = {}
       serieMap[serie]['name'] = label;
       serieMap[serie]['data'] = [];
   }
  dao.raw(sensArr, function(data){
    var count =0;
    data.forEach(function(doc) {
    count++;

    for (var i in sensArr) {
       var serie = sensArr[i];
       var item = [];
       if(doc[serie] != undefined){
         item.push(doc.timestamp.getTime());
         item.push(doc[serie]);
         if(doc[serie] > 0)//temporary fix, handle -0.1 (TODO on logger)
  	   serieMap[serie]['data'].unshift(item);//highcharts wants correct order
       }
    }

    if(count == data.length){
     for (var i in sensArr) {
      var serie = sensArr[i];
      response.push(serieMap[serie]);
     }
     res.send(response);
    }

    });

  });


}

exports.hourly = function(req, res){
  var sensors = req.query.sensors;
  var sensArr = sensors.split(",");
  var sensorNames = req.query.labels;
  var nameArr = sensorNames.split(",");
  var response = [];
  var serieMap = {};
   for (var i in sensArr) {
       var serie = sensArr[i];
       var label = nameArr[i];
       serieMap[serie] = {}
       serieMap[serie]['name'] = label;
       serieMap[serie]['data'] = [];
   }
  dao.hourly(sensArr,parseInt(req.query.hours), function(data){
    var count =0;
    data.forEach(function(doc) {  
    count++;
    
    for (var i in sensArr) {
       var serie = sensArr[i];
       var item = [];
	if(doc[serie] != undefined){
       	 item.push(doc.timestamp.getTime());
      	 item.push(doc[serie]['average']);
         serieMap[serie]['data'].push(item);
	}
    } 

    if(count == data.length){
     for (var i in sensArr) {
      var serie = sensArr[i];
      response.push(serieMap[serie]);
     }
     res.send(response);
    }

    });

  });
};

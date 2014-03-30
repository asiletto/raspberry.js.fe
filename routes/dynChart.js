var dao = require('../fedao').FeDAO;

exports.chartRaw = function(req, res){
	
  var chartid = req.query.id;

  dao.findChart(chartid, function(err, charts){
	
	if(err)
		throw err;
		
	if(charts[0] != undefined){
		
		var chart = charts[0];
		
		dao.getSensors(function(errS, sensors){
			
			var map = {};
			for(var j in chart.series){
				var serie = chart.series[j];
				var serieLabel = serie;
				for(var i in sensors){
					var sensor = sensors[i];
					for(var key in sensor.series){
						if(key == serie)
							serieLabel = sensor.series[key];
					}
				}
				map[serie] = serieLabel;
			}

			var series = "";
			var labels = "";
			for(key in map){
				series += (key + ",");
				labels += (map[key] + ",");
			}
			series = series.slice(0,-1);
			labels = labels.slice(0,-1);
			
			res.render(chart.view, {
				'hcharts': 'true',
				'menu': 'chart'+chartid,
				'series': series,
				'labels':labels,
				'title': chart.title,
				'duration': chart.duration
			});
			
		});
		
	
	}
	
  });

};

exports.raw = function(req, res){
  var sensors = req.query.sensors;
  var duration = req.query.duration;
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
  dao.raw(duration, sensArr, function(data){
    var count =0;
    data.forEach(function(doc) {
    count++;

    for (var i in sensArr) {
       var serie = sensArr[i];
       var item = [];
       if(doc[serie] != undefined){
         item.push(doc.timestamp.getTime());
         item.push(doc[serie]);
        // if(doc[serie] > 0)//temporary fix, handle -0.1 (TODO on logger)
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
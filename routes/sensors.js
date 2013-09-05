var dao = require('../fedao').FeDAO;

exports.index = function(req, res){

  dao.getSensors(function(err, results){
	res.render('sensors', { title: 'Test sensors', menu:'sensors', sensors: results});
  });
  
};

exports.form = function(req, res) {

	res.render('sensorForm', { title: 'Add new sensor', menu:'sensors'});

}
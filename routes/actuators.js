var dao = require('../dao').LogDAO;

exports.index = function(req, res){

  dao.getActuators(function(err, results){
	res.render('actuators', { title: 'Test actuators', menu:'actuators', actuators:results });
  });

  
};
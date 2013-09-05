var dao = require('../fedao').FeDAO;

exports.index = function(req, res){

  dao.getActuators(function(err, results){
	res.render('actuators', { title: 'Test actuators', menu:'actuators', actuators:results });
  });

  
};
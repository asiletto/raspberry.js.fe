
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('actuators', { title: 'Test actuators', menu:'actuators' });
};
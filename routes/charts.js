
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('charts', { title: 'Charts' });
};

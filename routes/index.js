
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'raspberry.pi.js' });
};

exports.typography = function(req, res){
  res.render('typography', { title: 'raspberry.pi.js/typography' });
};
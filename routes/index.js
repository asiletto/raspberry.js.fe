
exports.index = function(req, res){
  res.render('index', {'hcharts': 'true', title: 'raspberry.pi.js', menu:'dashboard' });
};

exports.typography = function(req, res){
  res.render('typography', { title: 'raspberry.pi.js/typography', menu:'typography' });
};

exports.credits = function(req, res){
  res.render('credits', { title: 'raspberry.pi.js/credits', menu:'credits' });
};

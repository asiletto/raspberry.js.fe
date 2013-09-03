/*
http://www.quora.com/Time-Series/What-is-the-best-way-to-store-time-series-data-in-MongoDB
http://blog.ijasoneverett.com/2013/03/a-sample-app-with-node-js-express-and-mongodb-part-1/
*/
var mongodb = require('mongodb');
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;

var LogDAO = function(){
  var self = this;
  this.db = new mongodb.Db(process.env.DB_NAME, new mongodb.Server(process.env.DB_HOST_NAME, parseInt(process.env.DB_PORT), {auto_reconnect: true, poolSize: 2}), {native_parser: false, w:1});
  
  console.log("opening "+ process.env.DB_USER_NAME+":"+ process.env.DB_PASSWORD+"@"+ process.env.DB_HOST_NAME + ":" + parseInt(process.env.DB_PORT) + "/"+process.env.DB_NAME)
  this.db.open(function(err, adb) {
		if(err) throw err;
		console.log(" * db opened()");
	 	self.adb = adb;
		adb.authenticate(process.env.DB_USER_NAME, process.env.DB_PASSWORD, function(err, result) {
			if(err) throw err;
			console.log(" * db authenticated()");
	 	 
		});
	});

};

LogDAO.prototype.getCollection= function(name, callback) {
  this.db.collection(name, function(error, my_collection) {
    if( error ) callback(error);
    else callback(null, my_collection);
  });
};

LogDAO.prototype.currentDay = function(serie, callback) {
   var dateOffset = (24*60*60*1000);
   var myDate = new Date();
   myDate.setTime(myDate.getTime() - dateOffset);
   var fieldFilter = {};
   fieldFilter[serie] = 1;
   fieldFilter['timestamp'] = 1;
   console.log("fieldFilter",fieldFilter);
   var count = 0;
   this.adb.collection("v1_hourly").find( { timestamp: {$gte:myDate,$lte:new Date()} }, fieldFilter).toArray(
    function(err, results){
      if(err)
          console.log("error", err);
        else{
        results.forEach(function(doc) {
	//calcolo la media
         count++;
         doc[serie]['average'] = doc[serie]['sum'] / doc[serie]['count'];
   
         if(count == results.length)
           callback(results);    

         });
        }
    }
   ); 



};


exports.LogDAO = LogDAO;

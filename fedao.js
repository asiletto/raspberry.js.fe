var mongodb = require('mongodb');
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;

var FeDAO = function(){
  var self = this;
  this.tables = {};
  this.tables.config = "v1_config";
  this.tables.raw = "v1_raw";
  this.tables.daily = "v1_daily";
  this.tables.hourly = "v1_hourly";
  
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

FeDAO.prototype.getCollection= function(name, callback) {
  this.db.collection(name, function(error, my_collection) {
    if( error ) callback(error);
    else callback(null, my_collection);
  });
};

FeDAO.prototype.hourly = function(series, hours, callback) {
   var dateOffset = (hours*60*60*1000);
   var myDate = new Date();
   myDate.setTime(myDate.getTime() - dateOffset);
   var fieldFilter = {};
   for (var i in series) {
    var serie = series[i]
    fieldFilter[serie] = 1;
   }
   fieldFilter['timestamp'] = 1;
   var count = 0;
   this.adb.collection(this.tables.hourly).find( { timestamp: {$gte:myDate,$lte:new Date()} }, fieldFilter).toArray(
    function(err, results){
      if(err)
          console.log("error", err);
        else{
        results.forEach(function(doc) {
	//calcolo la media
         count++;
         for (var i in series) {
           var serie = series[i]
	   if(doc[serie] != undefined)
	           doc[serie]['average'] = doc[serie]['sum'] / doc[serie]['count'];
         }  
         if(count == results.length)
           callback(results);    

         });
        }
    }
   ); 

};

FeDAO.prototype.raw = function(series, callback) {
   var dateOffset = (5*60*60*1000);
   var myDate = new Date();
   myDate.setTime(myDate.getTime() - dateOffset);
   var fieldFilter = {};
   for (var i in series) {
    var serie = series[i]
    fieldFilter[serie] = 1;
   }
   fieldFilter['timestamp'] = 1;
   var count = 0;
   this.adb.collection(this.tables.raw).find( { timestamp: {$gte:myDate,$lte:new Date()} }, fieldFilter, {sort: [['timestamp','desc']], limit:180}).toArray(
    function(err, results){
      if(err)
          console.log("error", err);
        else{
        results.forEach(function(doc) {
         count++;
         if(count == results.length)
           callback(results);
         });
        }
    }
   );

};

FeDAO.prototype.getSensors = function(callback){
	this.adb.collection(this.tables.config).find({type:'sensor'}).toArray(callback);
}

FeDAO.prototype.getActuators = function(callback){
	this.adb.collection(this.tables.config).find({type:'actuator'}).toArray(callback);
}
exports.FeDAO = new FeDAO();

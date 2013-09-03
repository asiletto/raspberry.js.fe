var dao = require('../logdao').LogDAO;
var sleep = require('sleep');

function printCallback(results){
	console.log("printCallback");
	results.forEach(function(doc) {
            console.log("Doc from Array ");
            console.dir(doc);
          });
};

console.log("new dao");

var dao2 = require('../logdao').LogDAO;

setTimeout(function(){
  var array = ['s1', 's2']
  dao.currentDay(array, printCallback);
  console.log("===================");


}, 3000);

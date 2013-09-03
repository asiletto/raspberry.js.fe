var LogDAO = require('../logdao').LogDAO;
var sleep = require('sleep');

function printCallback(results){
	console.log("printCallback");
	results.forEach(function(doc) {
            console.log("Doc from Array ");
            console.dir(doc);
          });
}
var dao = new LogDAO();

console.log("new dao");

setTimeout(function(){
  dao.currentDay('s1', printCallback);
  console.log("===================");

  dao.currentDay('s2', printCallback);
  console.log("===================");

  dao.currentDay('s3', printCallback);
  console.log("===================");



}, 3000);

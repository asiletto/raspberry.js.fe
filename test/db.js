var mongodb = require('mongodb');

var db = new mongodb.Db(process.env.DB_NAME, new mongodb.Server(process.env.DB_HOST_NAME, parseInt(process.env.DB_PORT), {auto_reconnect: true, poolSize: 2}), {native_parser: false, w:1});
  console.log("db instantiated");
  console.log("opening "+ process.env.DB_USER_NAME+":"+ process.env.DB_PASSWORD+"@"+ process.env.DB_HOST_NAME + ":" + parseInt(process.env.DB_PORT) + "/"+process.env.DB_NAME)
  db.open(function(err, db) {
                if(err) throw err;
                console.log(" * db opened()");

                db.authenticate(process.env.DB_USER_NAME, process.env.DB_PASSWORD, function(err, result) {
                        if(err) throw err;
                        console.log(" * db authenticated()");

                });
        });


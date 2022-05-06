var mysql = require('mysql');

var con = mysql.createConnection({
  host:'coms-319-055.class.las.iastate.edu', //TODO: Make sure all of this stuff lines up with your setup.
  user:'team1',
  password:'team1comsVM@319',
  database:'MyProject'
});
con.connect(function(err) {
  if (err) throw err;
  console.log("Connected to server!");
  // add code here
  var sqlCreate='CREATE TABLE IF NOT EXISTS users(username VARCHAR(255), password VARCHAR(255), likesRecieved INT DEFAULT 0, likesGiven INT DEFAULT 0, decisions INT DEFAULT 0, messages INT DEFAULT 0, PRIMARY KEY (username))'
  con.query(sqlCreate, function (err, result) {
    if (err) {
      console.log(err);
      throw err;
    } else{
        console.log("Prepare to insert default admin accounts into table Users: ");
        var values= [
          ["username", "password"],
        ];
        // add code here
        var sqlInsert='INSERT INTO users (username,password) values ?';
        con.query(sqlInsert,[values], function (err, result) {
          if (err) {
            // console.log(err);
            console.log("1 record exists!");
          } else {
            console.log("1 record inserted");
          }

        });

        con.end(function(err) {
         if (err) {
           return console.log(err.message);
         } else{
           console.log("Close connection!");
         }
       });
    }

  });

});

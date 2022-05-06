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
  var sqlCreate='CREATE TABLE IF NOT EXISTS game_scenarios(id int NOT NULL AUTO_INCREMENT, \
    question VARCHAR(255), choice_one VARCHAR(255), choice_two VARCHAR(255), result_one VARCHAR(255), \
    result_two VARCHAR(255), PRIMARY KEY (id))'
  con.query(sqlCreate, function (err, result) {
    if (err) {
      console.log(err);
      throw err;
    } else{
        console.log("Prepare to insert default scenarios into table game_scenarios: ");
        var values= [
          ["You are stuck in a dark room. What do you do?", "Go North", "Cry", "You don't know which way that is", "It feels nice, honestly"],
          ["You are both hungry... AND thirsty. What do you do first?", "Drink Water", "Eat Something.", 
          "It tastes pretty good all things considered.", "You eat some pretzels. You did not think this through."],
          ["You should sleep. Do you sleep?", "Yes.", "No.", "Yeah that's a good call.", "Well. Uh. Okay then. Mood, but also sorry."],
          ["You find something that you are 99% sure is an actual magic artifact. What do you do?", "Keep it secret.", "Inform others.",
          "No one else learns of the existence of magic. But like, are you actually, truely worried about the actual real current government tracking you down or something?", 
          "People are pretty impressed, or at least interested in the implications. You could sell it, but really its a unique and pretty interesting toy."],
          ["Hot button decision: Does pineapple belong on pizza's friend list?", "Yes", "What?", "Pineapple is relieved your confidence in it as a friend.",
          "Well you see this is a subversion of a pretty popular if meaningless 'debate' about pineapple on pizza, \
          but instead its asking if pineapple and pizza could be friends, which is inherently more nonsensical and fun to debate."]
        ];
        // add code here
        var sqlInsert='INSERT INTO game_scenarios (question,choice_one,choice_two,result_one,result_two) values ?';
        con.query(sqlInsert,[values], function (err, result) {
          if (err) {
            // console.log(err);
            console.log("5 records exist!");
          } else {
            console.log("5 records inserted");
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

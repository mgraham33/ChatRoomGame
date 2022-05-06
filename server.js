const express = require("express");
const app = express();
var mysql = require('mysql');
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

var currentUser;
var currentDecisions = 0;
var currentMessages = 0;

app.set('view-engine', 'ejs');

var con = mysql.createConnection({
    host:'coms-319-055.class.las.iastate.edu', //TODO: Make sure all of this stuff lines up with your setup.
    user:'team1',
    password:'team1comsVM@319',
    database:'MyProject'
});
con.connect(function(error){
    if (!error) {
        console.log("Connected");
    } else {
        console.log(error);
    }
})

app.use(express.urlencoded({ extended: false }))

// Static Files
app.use(express.static('public'))
app.use('/css', express.static(__dirname + 'public/css'))
app.use('/js', express.static(__dirname + 'public/js'))
app.use('/img', express.static(__dirname + 'public/img'))


io.on("connection", (socket) => {
    console.log("A user connected");
    socket.on("choice", (lobby, chosen) => {
        var firstQuery = "SELECT current_scenario FROM games WHERE id = ?";
        con.query(firstQuery, lobby, function(err, result) {
            if (err)
            {
                socket.emit('question_data' + lobby, 'A Database Error Occurred, please refresh', 'Try Again', 'Try Again');
            }
            else
            {
                let scenario = result[0].current_scenario;
                var sqlQuery = "SELECT * FROM game_scenarios WHERE id = " + scenario;
                con.query(sqlQuery, "", function(err, result) {
                    if (err)
                    {
                        socket.emit('question_data' + lobby, 'A Database Error Occurred, please refresh', 'Try Again', 'Try Again');
                    }
                    else
                    {
                        if (chosen === 1)
                        {
                            socket.emit('question_result' + lobby, result[0].result_one);
                            socket.broadcast.emit('question_result' + lobby, result[0].result_one);
                        }
                        else
                        {
                            socket.emit('question_result' + lobby, result[0].result_two);
                            socket.broadcast.emit('question_result' + lobby, result[0].result_two);
                        }
                    }
                });
            }
        });
    });

    socket.on("proceed", (lobby) => {
        var sqlQuery = "SELECT * FROM game_scenarios ORDER BY RAND() LIMIT 1";
        con.query(sqlQuery, "", function(err, result) {
            if (err)
            {
                socket.emit('question_data' + lobby, 'A Database Error Occurred, please refresh', 'Try Again', 'Try Again');
            }
            else
            {
                var question = result[0].question;
                var choice_one = result[0].choice_one;
                var choice_two = result[0].choice_two;
                var secondQuery = "UPDATE games SET current_scenario = ? WHERE id = ?";
                con.query(secondQuery, [result[0].id, lobby], function(errTwo, resultTwo) {
                    if (errTwo)
                    {
                        socket.emit('question_data' + lobby, 'A Database Error Occurred, please refresh', 'Try Again', 'Try Again');
                    }
                    else
                    {
                        socket.emit('question_data' + lobby, question, choice_one, choice_two);
                        socket.broadcast.emit('question_data' + lobby, question, choice_one, choice_two);
                    }
                });
            }
        });
    });

    socket.on("loadData", (lobby) => {
        var firstQuery = "SELECT current_scenario FROM games WHERE id = ?";
        con.query(firstQuery, lobby, function(errFirst, resultFirst) {
            if (errFirst)
            {
                socket.emit('question_data' + lobby, 'A Database Error Occurred, please refresh', 'Try Again', 'Try Again');
            }
            else
            {
                let scenario = resultFirst[0].current_scenario;
                var sqlQuery = "SELECT * FROM game_scenarios WHERE id = " + scenario;
                con.query(sqlQuery, "", function(err, result) {
                    if (err)
                    {
                        socket.emit('question_data' + lobby, 'A Database Error Occurred, please refresh', 'Try Again', 'Try Again');
                    }
                    else
                    {
                        socket.emit('question_data' + lobby, result[0].question, result[0].choice_one, result[0].choice_two);
                    }
                });
            }
        });
    });
});

app.get('/', (req, res) => {
    res.render("login.ejs");
});

app.get('/home', (req, res) => {
    res.render("home.ejs");
});

app.get('/game/:lobby', (req, res) => {
    res.render("game.ejs", { lobby: req.params.lobby });
});

app.get('/login', (req, res) => {
    res.render("login.ejs");
});

app.post('/login', (req, res) => {
    
    let username = req.body.username; 
    currentUser = username;
    let password = req.body.password;
    var sqlQuery='SELECT count(*) as count FROM users WHERE username = ? AND password = ?';
    con.query(sqlQuery,[username, password], function (err, result) {
        if (err) {
            res.render("failedLogin.ejs");
        }
        else if (result[0].count == 1) {
            res.render('home.ejs');
        } else {
            res.render("failedLogin.ejs");
        }
    });

    var sqlQuery="SELECT * FROM users WHERE username=" + "'" + currentUser + "'";
    con.query(sqlQuery, function (err, result) {
        if (err) {
            console.log(err);
            throw err;
        } else {
            Object.keys(result).forEach(function(key) {
                var row = result[key];
                currentDecisions += parseInt(row.decisions);
                currentMessages += parseInt(row.messages);
            });
            console.log(currentUser + "'s stats = Decisions: " + currentDecisions + ", Messages: " + currentMessages);
        }
    });
});

app.get('/signup', (req, res) => {
    res.render("signup.ejs");
});

app.post('/signup', (req, res) => {
    
    let username = req.body.username;
    let password = req.body.password;
    var values=[[username, password]];
    var sqlInsert='INSERT INTO users (username,password) values ?'; 
    con.query(sqlInsert,[values], function (err, result) {
        if (err) {
            res.render('failedSignUp.ejs');
        } else {
            res.render("login.ejs");
        }
    });
});

app.get('/user', (req, res) => {
    res.render("user.ejs");
});

app.get('/profiles', (req, res) => {
    var sqlQuery='SELECT * FROM users ORDER BY username ASC';
    con.query(sqlQuery, function (err, result, fields) {
        var uList = [];
        var lrList = [];
        var lgList = [];
        var dList = [];
        var mList = [];
        if (err) throw err;
        Object.keys(result).forEach(function(key) {
            var row = result[key];
            uList.push(row.username);
            lrList.push(row.likesRecieved);
            lgList.push(row.likesGiven);
            dList.push(row.decisions);
            mList.push(row.messages);
          });
          res.render("profiles.ejs", { currentUser : currentUser, uList : uList, lrList : lrList, lgList : lgList, dList : dList, mList : mList });
      });
});

app.get('/lobbySelect', (req, res) => {

    var sqlInsert="UPDATE users SET decisions= " + currentDecisions + " WHERE username=" + "'" + currentUser + "'"; 
    con.query(sqlInsert, function (err) {
        if (err) {
            console.log(err);
            throw err;
        } else {
            console.log("Decisions updated");
        }
    });
    sqlInsert="UPDATE users SET messages= " + currentMessages + " WHERE username=" + "'" + currentUser + "'"; 
    con.query(sqlInsert, function (err) {
        if (err) {
            console.log(err);
            throw err;
        } else {
            console.log("Messages updated");
        }
    });

    res.render("lobbySelect.ejs");
});

app.get('/incDesc/:id', function (req, res) { 
    console.log("Desc " + req.params.id);
    currentDecisions += parseInt(req.params.id);
    console.log(currentUser + "'s stats = Decisions: " + currentDecisions + ", Messages: " + currentMessages);
  });
  
  app.get('/incMess/:id', function (req, res) { 
    console.log("Mess " + req.params.id);
    currentMessages += parseInt(req.params.id);
    console.log(currentUser + "'s stats = Decisions: " + currentDecisions + ", Messages: " + currentMessages);
  });

server.listen(3000, () => {
    console.log("listening on port 3000");
});

//app.listen(3000)
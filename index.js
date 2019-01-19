var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname + "/frontend"));

var outcomes = {
    "pierre": {
        "feuille": false,
        "ciseau": true
    },
    "feuille": {
        "ciseau": false,
        "pierre": true
    },
    "ciseau": {
        "pierre": false,
        "feuille": true,
    }
};
var number_of_players = 0;
var available_player_ids = [1, 2];
var choices = {};
var scores = {1: 0, 2: 0};


function compute_winner() {
    if (choices[1] === choices[2]) {
        io.emit("result", {choices: choices, result: "tie", scores: scores});
    } else {
        var is_first_player_winner = outcomes[choices[1]][choices[2]];
        if (is_first_player_winner) {
            scores[1] += 1;
            io.emit("result", {choices: choices, result: 1, scores: scores});
        } else {
            scores[2] += 1;
            io.emit("result", {choices: choices, result: 2, scores: scores});
        }
    }
}

io.on('connection', function(socket){
    var user_id = available_player_ids.pop();

    socket.emit("user_id", user_id);
    if (!user_id) {
        // max player reached, do nothing else
        return;
    }

    socket.on('disconnect', function(){
        available_player_ids.push(user_id);
        if (available_player_ids.length > 0) {
            io.emit("state", "stop");
        }
    });

    if (available_player_ids.length == 0) {
        io.emit("state", "start");
        scores = {1: 0, 2: 0};
    }

    socket.on("shifumi", function(choice) {
        choices[user_id] = choice;
        if (Object.keys(choices).length == 2) {
            compute_winner();
            choices = {};
        }
    });
});


http.listen(3001, function(){
    console.log('listening on *:3001');
});

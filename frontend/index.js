var socket = io();

var my_user_id;
var reverse = {1: 2, 2: 1};

$("#msg").html("En attente de joueurs...");
$("#choices_menu").hide();
$("#replay").hide();
$("#results").hide();

function animate(cb) {
    $("#shi").fadeIn("slow");
    $("#shi").fadeOut("fast", function() {
        $("#fu").fadeIn("slow");
        $("#fu").fadeOut("fast", function () {
            $("#mi").fadeIn("slow");
            $("#mi").fadeOut("fast", cb);
        });
    });
}
socket.on('user_id', function(user_id) {
    if (user_id) {
        my_user_id = user_id;
        console.log("loaded user id", user_id);
        $("#player_id").html(my_user_id);
    } else {
        $("body").html("Deux joueurs sont déjà en partie, essaie plus tard !");
    }
});
socket.on('result', function(result_dict) {
    var msg;
    console.log("loaded result dict", result_dict);
    if (result_dict.result === my_user_id) {
        msg = "<h3>Gagné !</h3>";
    } else if (result_dict.result === "tie") {
        msg = "<h3>Egalité !</h3>";
    } else {
        msg = "<h3>Perdu !</h3>";
    }
    msg += "Tu as choisis " + result_dict.choices[my_user_id] + " contre " + result_dict.choices[reverse[my_user_id]];
    $("#result").html("");
    $("#choices_menu").hide();
    animate(function () {
        $("#result").html(msg);
        $("#replay").show();
        if (result_dict.result === "tie") {
            $('#choice1').prepend($('<img>',{id:'theImg', src:result_dict.choices[my_user_id] + '.png'}));
            $('#choice2').prepend($('<img>',{id:'theImg', src:result_dict.choices[reverse[my_user_id]] + '.png'}));
        } else if (result_dict.result === my_user_id) {
            $('#choice1').prepend($('<img>',{id:'theImg', src:result_dict.choices[my_user_id] + '_win.png'}));
            $('#choice2').prepend($('<img>',{id:'theImg', src:result_dict.choices[reverse[my_user_id]] + '_grey.png'}));
        } else {
            $('#choice1').prepend($('<img>',{id:'theImg', src:result_dict.choices[my_user_id] + '_grey.png'}));
            $('#choice2').prepend($('<img>',{id:'theImg', src:result_dict.choices[reverse[my_user_id]] + '_win.png'}));
        }
        $("#results").show();
        $("#scores").html("J1: " + result_dict.scores[1] + " | J2: " + result_dict.scores[2]);
    });
});
socket.on('state', function(state) {
    console.log("loaded state", state);
    if (state === "start") {
        $("#scores").html("J1: 0 | J2: 0");
        replay();
    } else if (state === "stop") {
        $("#msg").html("En attente de joueurs...");
        $("#choices_menu").hide();
    }
});
function shifumi(choice) {
    $("#result").html("Attente du choix de l'autre joueur...");
    socket.emit('shifumi', choice);
    $("#choice_pierre").attr("src","pierre_grey.png");
    $("#choice_feuille").attr("src","feuille_grey.png");
    $("#choice_ciseau").attr("src","ciseau_grey.png");

    $("#choice_" + choice).attr("src",choice + ".png");
}
function replay () {
    $("#result").html("");
    $("#results").hide();
    $("#choices_menu").show();
    $("#replay").hide();
    $('#choice1').html("");
    $('#choice2').html("");
    $("#msg").html("");
    $("#choice_pierre").attr("src","pierre_grey.png");
    $("#choice_feuille").attr("src","feuille_grey.png");
    $("#choice_ciseau").attr("src","ciseau_grey.png");
}

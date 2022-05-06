const socket = io("localhost:3000");

socket.on('connection');

$(document).ready(function() { 
    var lobby = document.getElementById('screen').dataset.lobby;

    socket.on('question_data' + lobby, (question, left, right) => {
        document.getElementById('connectButton').style.display = "none";
        document.getElementById('option1Button').style.display = "block";
        document.getElementById('option2Button').style.display = "block";
        document.getElementById('proceedButton').style.display = "none";
        document.querySelector("#option1Button").innerHTML = left;
        document.querySelector("#option2Button").innerHTML = right;
        document.querySelector("#question").innerHTML = question;
    });

    socket.on('question_result' + lobby, (result) => {
        document.getElementById('connectButton').style.display = "none";
        document.getElementById('option1Button').style.display = "none";
        document.getElementById('option2Button').style.display = "none";
        document.getElementById('proceedButton').style.display = "block";
        document.getElementById("question").innerHTML = result;
    });

    $("#escapeButton").click(function() {
        if (confirm("Are you sure you want to leave the game?")) {
            window.location.href = "/lobbySelect";
        }
    });

    $("#option1Button").click(function() {
        if (socket.connected) {
            socket.emit('choice', lobby, 1)
        }
        else
        {
            //Offer some kind of reconnect button
        }
    });

    $("#option2Button").click(function() {
        if (socket.connected) {
            socket.emit('choice', lobby, 2)
        }
        else
        {
            //Offer some kind of reconnect button
        }
    });

    $("#proceedButton").click(function() {
        if (socket.connected) {
            socket.emit('proceed', lobby);
        }
    });

    $("#connectButton").click(function() {
        if (socket.connected) {
            socket.emit('loadData', lobby);
        }
    })
})

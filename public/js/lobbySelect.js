$(document).ready(function() {
    $("#createNewLobbyButton").click(function() {
       $("#lobbyFormContainer").css("display", "table"); 
    });
    $("#closeForm").click(function(e) {
        $("#lobbyFormContainer").css("display", "none");
        $("#lobbyName").val('');
        $("#lobbyType").val('');
        $("#numPlayers").val('');
    });
    $("#formSubmit").click(function(e) {
        e.preventDefault();
        var lobbyName = $("#lobbyName").val();
        var lobbyType = $("#lobbyType").val();
        var numPlayers = $("#numPlayers").val();
        var formElements = [$("#lobbyName"), $("#lobbyType"), $("#numPlayers")];
        var passed = true;
        
        for(let i = 0; i < formElements.length; i++){
            let element = formElements[i];
            if(element.val() == ''){
                element.css("border", "1px solid red");
                passed = false;
            }
            else{
                element.css("border", "1px solid black");
            }
        }
        if(passed){
            $("#serverTable tr:last").after('<tr class="hover" onclick="location.href = \'\/game3\'";><td>' + lobbyName + '</td><td>' + lobbyType + '</td><td>' + '0/' + numPlayers + '</td></tr>');
            $("#lobbyFormContainer").css("display", "none");
        }
    });
});

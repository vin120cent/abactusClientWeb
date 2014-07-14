// La socket
var socket;
// Le plateau, tableau associatif de uw=>xy de toutes les cells
var plateau;
// la game, objet json renvoyé par le serveur
var game;
// Le canvas
var $canvas;
// tabUWtoCell est un tableau associatif uw => cell (objet json renvoyé par le serveur)
var UWtoCell = {};
// Tableaux des formes et des couleurs
var tabCouleurs = {0:"#EB7A36",1:"#F9EE5E", 2:"#B6CF34",3:"#6497C3",4:"#9170A8",5:"#D54E56"};
var tabCouleurs2 = {0:"#fcdfc7",1:"#fffce2", 2:"#daf2c4",3:"#cce5f9",4:"#ecd3ff",5:"#fccccc"};
var tabFormes = {0:"rectangle",1:"circle", 2:"triangle",3:"rectangle",4:"circle",5:"triangle"};
var tabBase = {0:{pos:"0,0",color:"#ddd"},1:{pos:"0,0",color:"#ddd"},2:{pos:"0,0",color:"#ddd"},3:{pos:"0,0",color:"#ddd"},4:{pos:"0,0",color:"#ddd"},5:{pos:"0,0",color:"#ddd"}};//tableau qui contient les couleurs des bases
var firstLoop;//Booléen qui determine si on est dans le premier tour d'une partie
// Variable pour les informations du client
var moi = null;
var spectateur = false;
// Pour les animations de combat et de tenaille si les uw ont changé lors du tour du serveur
var movedSolders = [];
var timer = {name:"timer",initSec:30, i:30, countdow:null};
var timer_step = 200; //par défaut
var timer_step_desktop = 200; //200ms entre chaque maj du timer
var timer_step_mobile = 1000; //1s entre chaque maj du timer
var currentpage = "";
// Tableau pour calculer la moyenne du décalage entre le timer serveur et le timer client
var pingpong = [0];
// pour les déplacements avec le click
var latest_click;
var move_mode = "drag";
var waitroominfo = false;
//old : var waitforroom = false;
var sound_chat = true;
var sound_game = true;

jQuery(document).ready(function($){

    // Si touch device alors on active le click au lieu du drag
    if(is_touch_device()) move_mode = "click";

    $.getScript(window.siteUrl+"/assets/js/game/draw_"+move_mode+".js").done(function(script, textStatus){
        // Initialisation de la socket
        initSocket();
    });

});

// ***************************
// Initialisation de la websocket vers le serveur de jeu
function initSocket() {

    // Create socket
    //pour le développement
    //socket = new WebSocket("ws://"+location.hostname+":3006");
    //socket = new WebSocket("ws://www.rtot.eu:3006");
    //socket = new WebSocket("ws://www.ttor.eu:3006");

    //socket = new WebSocket("ws://94.23.18.65:3006");
    socket = new WebSocket("ws://localhost:3006");

    // serveur OVH virtuel
    //socket = new WebSocket("ws://92.222.18.63:3006");



    console.log("create socket");

    // Log errors
    socket.onerror = function (error) {
        console.log('WebSocket Error : ');
        console.log(error);
    }

    // Log messages from the server
    socket.onmessage = function (e) {
        traiterReponseServeur(e.data);
    }

    socket.onopen = function (e) {
        console.log("socket open");
    }

    socket.onclose = function (e) {
        console.log("socket closed");
        if(getBoxinfoStatus() !== false)	openBoxinfo("deco", [{'site_url':window.siteUrl}]); //alert("Vous êtes déconnecté du serveur !");
    }
} // End function initSocket


// ***************************
// Pour envoyer des information au serveur de jeu
// Attention, data doit être un json préalablement transformé en string
function sendData(data){
    try {
        socket.send((data));
        console.log("Envoyé au serveur : " + data);
    }
    catch (err) {
        console.log("ERREUR à l'appel de sendData (error json string) : "+ data);
    }
}


// *******************************
// Fonction "controller" pour traiter ce que renvoi le serveur
function traiterReponseServeur(data){
    var response = JSON.parse(data);
    console.log(response);

    // traitement de la réponse
    switch (response.type) {
        case "clientInformation" :
            window.clientId = response.clientId;
            sendData('{"type":"connection","pseudo":"'+window.pseudo+'","userId":"'+window.userId+'","token":"'+window.token+'","clientId":"'+window.clientId+'"}');
            break;
        case "alreadyInActivity" :
            if(!response.result) {
                initStartPage();
            }
            initChat();
            break;
        case "myGameInformation" :
            moi = {};
            moi.pseudo = window.pseudo;
            moi.playerId = response.playerId;
            moi.playerTeamId = response.playerTeamId;
            moi.playerLegionId = response.playerLegionId.legionId;
            break;
        case "notifyCreatedRoom" :
            addRoomInList(response);
            break;
        case "notifyAllRoom":
            showRooms(response);
            break;
        case "notifyAllGame":
            showGames(response);
            break;
        case "joinedRoom":
            if(currentpage != "room") {
                waitroominfo = true;
                initRoomPage();
                setTimeout(function(){ initRoom(response); }, 250);
            }
            else {
                initRoom(response);
            }
            break;
        case "roomInformation":
            setTimeout(function(){ updateComposition(response); }, 300);
            break;
        case "playerExit":
            if(currentpage == "game") deactivatePlayerGameComposition(response);
            break;
        case "playerKicked":
            destroyChatBox("chatbox_all");
            initStartPage();
            break;
        case "answerJoinRoom":
            displayAnswerRoomMessage(response);
            break;
        case "gameCreated":
            window.moncoup = {};
            if(response.timer != undefined) {
                timer.initSec = parseInt(response.timer);
                timer.i = parseInt(response.timer);
            }
            spectateur = (moi == null );
            initGamePage(response);
            break;
        case "gameUpdated":
            window.moncoup = {};
            initTimer();
            if (response.gameAction != undefined){
                var delai = drawMouvment(response.gameAction);
                setTimeout(function(){
                    if (response.gameAction.fights[0].allFights != undefined || response.gameAction.fights[1].allTenailles != undefined) {
                        var delai2 = drawTenailles(response.gameAction.fights[1].allTenailles);
                        setTimeout(function(){
                            var delai3 = drawFights(response.gameAction.fights[0].allFights);
                            setTimeout(function(){
                                plateau = drawBoard(response);
                            }, delai3);
                        }, delai2);
                    }
                    else {
                        plateau = drawBoard(response);
                    }
                },delai);
            }
            break;
        case "endTurn":
            if(timer.i < 2 && timer.i > -2) pingpong.push(timer.i);
            console.log(avg(pingpong));
            clearInterval(timer.countdown);
            $canvas.setLayer("timer", {end:0});
            $canvas.drawLayers();
            if(!spectateur) valideMonTour();
            break;
        case "chatMessage":
            receiveMessage(response);
            break;
        case "gameResult":
            if(!spectateur) controlswin = '<a href="javascript:void(0)" onClick="restartGame();"><strong>Rejouer</strong></a> ou <a href="javascript:void(0)" onClick="doNotRestartGame();"><strong>non</strong></a>';
            else controlswin = '<a href="javascript:void(0)" onClick="doNotRestartGame()"><strong>'+"Je veux sortir d'ici"+'</strong></a>';
            setTimeout(function() {
                var win = "";
                var announced = false;
                if(response.winnerPseudos != null) {
                    $.each(response.winnerPseudos, function(i, item) {
                        if(item.pseudo == window.pseudo) {
                            announced = true;
                            playSound("win");
                        }
                        win += item.pseudo + "<br/>"
                    });
                    openBoxinfo("gameResult",[{'pseudos':win, 'controls':controlswin}], false);
                }
                if(!announced && !spectateur)	playSound("lost");
            }, 2000);
            break;
        case "connectError":
            switch(response.errorType) {
                case 0:
                    openBoxinfo("auth", [{'site_url':window.siteUrl}], true);
                    break;
                case 1:
                    openBoxinfo("session", [{'site_url':window.siteUrl}], true);
                    break;
            }
            break;
        case "checkConnection":
            sendData('{"type":"checkConnection", "clientId":"'+window.clientId+'"}');
            break;
        case "allClient":
            updateChatList(response);
            break;
        case "roomInvite":
            //TODO comprendre cette ligne
            response = JSON.parse(
                '{"message": "'
                    + 'Invitation : <a href=\\"javascript:void(0);\\" onClick=\\"joinRoom('
                    +response.roomId
                    +', \''
                    +response.roomMdp+'\');\\">ici</a>'
                    +'", "target": "'
                    +response.clientSource+
                    '", "clientSource": "invite", "type": "chatMessage"}'
            );
            receiveMessage(response);
            break;
    }
}


// *******************************
// Fonction qui renvoie l' url d' un avatar
function getAvatar(pseudo, size){
    return window.siteUrl+"user/avatar/"+pseudo+"/"+size+"/";
}


// *******************************
// Joue un fichier audio situé dans assets/audio/fileName.js
function playSound(fileName){
    if(fileName == "chat" && !sound_chat) return;
    if(fileName != "chat" && !sound_game)	return;
    $("#audioPlay").remove();
    $("#game").after('<audio id="audioPlay"><source src="'+window.siteUrl+'assets/audio/'+fileName+'.mp3" type="audio/mpeg" /><source src="'+window.siteUrl+'assets/audio/'+fileName+'.wav" type="audio/wav"></audio>');
    var audio = $("#audioPlay")[0];
    audio.play();
}

// *******************************
// Calcule la moyenne d' un tableau
function avg(tab){
    var cnt = 0;
    var len = tab.length;
    for (var i = 0; i < len; i++) {
        cnt += parseFloat(tab[i]);
    }
    return parseFloat(cnt/len);
}


// *******************************
// Renvoie true ou false si le client est capable d' utiliser les événements tactiles
function is_touch_device(){
    return ('ontouchstart' in window || 'onmsgesturechange' in window);
}

// *******************************
// joinRoom quoi
function joinRoom(rid, rpwd){
    sendData('{"type":"joinRoom","roomId":"'+rid+'","roomMdp":"'+rpwd+'","clientId":"'+window.clientId+'"}');
}

//Fonction pour additionner des hexadécimaux (pour les couleurs)
function addHexColor(c1, c2) {
    var hexStr = (parseInt(c1, 16) + parseInt(c2, 16)).toString(16);
    while (hexStr.length < 6) { hexStr = '0' + hexStr; } // Zero pad.
    return hexStr.substr(0,6);
}

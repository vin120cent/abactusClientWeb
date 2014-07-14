function initStartPage(){
	refreshChatList();
	currentpage = "start";
	$("#game").fadeOut("fast", function(){
		$(this).replaceWith($('<div id="game"><div class="grid"><div class="grid3"><div id="pageLeft"></div><div id="pageMiddle"></div><div id="pageRight"></div></div></div></div>').hide());
		$('#game').fadeIn("fast");
		initStart();
		sendData('{"type":"refreshRoomList","clientId":"'+window.clientId+'"}');
		sendData('{"type":"refreshGameList","clientId":"'+window.clientId+'"}');
		$.ajax({url:window.siteUrl+"views/game/rank.html", cache:false, async:false, success: function(data){$("#pageRight").append(data);}});
	});
}

function displayAnswerRoomMessage(response) {
	if($("#room_item-"+response.roomId).length) {
		var roomAnswered = $("#room_item-"+response.roomId).parent();
		switch(response.state) {
			case 3:
				if(roomAnswered.find("[name=pwdJoinRoom]").length) {
					roomAnswered.find("[name=pwdJoinRoom]").addClass("room_pwd-error");
				}
				break;
		}
	}
}

function initStart() {
	$(document).off("click", ".nb_games");
	$(document).on("click", ".nb_games", function() {
		$.get( window.siteUrl+"ajax/gamehistory/rank/", { type: "nb_games", } )
			.done(function( data ) {
				$(".rank_box-content").html('<thead><tr><th>Pseudo</th><th>Parties</th></tr></thead><tbody class="rank_box-body"></tbody>');
				$.each(JSON.parse(data), function(i, item) { $(".rank_box-body").append('<tr><td>'+item.player_name+'</td><td>'+item.nb+'</td></tr>'); });
				$(".nb_games").addClass("rank_box-active");
				$(".nb_wins").removeClass("rank_box-active");
				$(".win_rate").removeClass("rank_box-active");
		});
	});
	
	$(document).off("click", ".nb_wins");
	$(document).on("click", ".nb_wins", function() {
		$.get( window.siteUrl+"ajax/gamehistory/rank/", { type: "nb_wins", } )
			.done(function( data ) {
				$(".rank_box-content").html('<thead><tr><th>Pseudo</th><th>Victoires</th></tr></thead><tbody class="rank_box-body"></tbody>');
				$.each(JSON.parse(data), function(i, item) { $(".rank_box-body").append('<tr><td>'+item.player_name+'</td><td>'+item.nb+'</td></tr>'); });
				$(".nb_games").removeClass("rank_box-active");
				$(".nb_wins").addClass("rank_box-active");
				$(".win_rate").removeClass("rank_box-active");
		});
	});
	
	$(document).off("click", ".win_rate");
	$(document).on("click", ".win_rate", function() {
		$.get( window.siteUrl+"ajax/gamehistory/rank/", { type: "win_rate", } )
			.done(function( data ) {
				$(".rank_box-content").html('<thead><tr><th>Pseudo</th><th>Ratio</th></tr></thead><tbody class="rank_box-body"></tbody>');
				$.each(JSON.parse(data), function(i, item) { $(".rank_box-body").append('<tr><td>'+item.player_name+'</td><td>'+item.win_rate+'%</td></tr>'); });
				$(".nb_games").removeClass("rank_box-active");
				$(".nb_wins").removeClass("rank_box-active");
				$(".win_rate").addClass("rank_box-active");
		});
	});
	
	$(document).off("click", ".init_new_room");
	$(document).on("click", ".init_new_room", function() {
		initRoomPage();		
	});
	
	$(document).off("click", ".show_more");
	$(document).on("click", ".show_more", function() {
		var more = $(this).parent().parent().find('.room_item-more');
		if(!more.hasClass('opened')) {
			more.addClass('opened');
			more.slideDown("fast");
			$(this).html("Voir -");
		}
		else {
			more.removeClass('opened');
			more.slideUp("fast");
			$(this).html("Voir +");
		}		
	});
	
	$(document).off("click", ".room_lock");
	$(document).on("click", ".room_lock", function() {
		$(this).parent().replaceWith('<span class="room_pwd_container"><input type="password" class="room_pwd" name="pwdJoinRoom" /><button class="join_room btn-disabled">OK</button></span>');
	});
	
	$(document).off("click", ".refresh_rooms");
	$(document).on("click", ".refresh_rooms", function() {
		sendData('{"type":"refreshRoomList","clientId":"'+window.clientId+'"}');
	});

	$(document).off("click", ".refresh_games");
	$(document).on("click", ".refresh_games", function() {
		sendData('{"type":"refreshGameList","clientId":"'+window.clientId+'"}');
	});
	
    $("#pageLeft").html('<h2>Liste des rooms &nbsp;<a href="javascript:void(0);" style="color: #559;" class="refresh_rooms"><i class="fa fa-refresh"></i></a></h2><div class="room_item init_new_room txtcenter ptm pbm"><i class="fa fa-plus-circle" style="color:#333; font-size: 20px;"></i>&nbsp; Nouvelle partie</div><div id="room_list"></div>');
    $("#pageMiddle").html('<h2>Parties en cours &nbsp;<a href="javascript:void(0);" style="color: #559;" class="refresh_games"><i class="fa fa-refresh"></i></a></h2><div id="game_list"></div>');
    $.get( window.siteUrl+"ajax/gamehistory/rank/", { type: "nb_games", } )
		.done(function( data ) {
			$(".rank_box-content").html('<thead><tr><th>Pseudo</th><th>Parties</th></tr></thead><tbody class="rank_box-body"></tbody>');
			$.each(JSON.parse(data), function(i, item) { $(".rank_box-body").append('<tr><td>'+item.player_name+'</td><td>'+item.nb+'</td></tr>'); });
			$(".nb_games").addClass("rank_box-active");
			$(".nb_wins").removeClass("rank_box-active");
			$(".win_rate").removeClass("rank_box-active");
	});
}
function showRooms(response) {
	$("#room_list").html("");
	$(document).off("click", ".join_room");
	$(document).on("click", ".join_room", function() {
		var room_pwd_value = "";
		var room_id_value = $(this).parent().parent().find(".room_item-roomId").html()
		if($(this).parent().find('[name=pwdJoinRoom]').length)
		{
			room_pwd_value = $(this).parent().find('[name=pwdJoinRoom]').val();
			var room_id_value = $(this).parent().parent().parent().find(".room_item-roomId").html();
		}
		joinRoom(room_id_value, room_pwd_value);
	});
    if(response.roomsInformations.rooms != null) {
		$.each(response.roomsInformations.rooms, function(i, room) {
			addRoomInList(room);
		});
	}
	else $("#room_list").append('<i style="display: block;" class="empty_rooms pt1 pl3">Aucune room à afficher</i>')
}
function addRoomInList(room) {
	var avatars = "";
	var button = '<button class="show_more">Voir +</button><button class="join_room">Rejoindre</button>';

	if(room.roomSecurity == 1) {
		button = '<button class="show_more">Voir +</button><span class="room_pwd_container"><button class="room_lock"><i class="fa fa-lock"></i></button></span>';
	}
	if(typeof room.playersPseudo.pseudos !== "undefined")	$.each(room.playersPseudo.pseudos, function(i, pseudo) { avatars += '<img class="avatar_small" src="'+getAvatar(pseudo, "small")+'" alt="avatar de '+pseudo+'" title="'+pseudo+'" />'; });
	$(".empty_rooms").remove();
	$.ajax({url:window.siteUrl+"views/game/roomBox.html", cache:false, async:false, success: function(tpl){$("#room_list").append(tplawesome(tpl, [{'roomId':room.roomId,'boardRadius':room.boardRadius,'playerCount':(room.nbCurrentPlayers+room.nbCurrentRobots)+"/"+room.nbPlayers, 'roomName':unescape(room.roomName), 'controls':button, 'more':"<p>Nombres d'équipes : "+room.nbTeams+"<br>Nombres de légions par joueur :"+(room.nbLegions/room.nbPlayers)+"</p>", 'players':avatars,}]))}});
}
function showGames(response) {
	$("#game_list").html("");
	$(document).off("click", ".watch_game");
	$(document).on("click", ".watch_game", function() {
		sendData('{"type":"watchGame","gameId":"'+$(this).parent().parent().find(".room_item-roomId").html()+'","clientId":"'+window.clientId+'"}');
	});
	
    if(response.gamesInformations.games != null) {
		$.each(response.gamesInformations.games, function(i, game) {
			var avatars = "";
			if(typeof game.playersPseudo.pseudos !== "undefined")	$.each(game.playersPseudo.pseudos, function(i, pseudo) { avatars += '<img class="avatar_small" src="'+getAvatar(pseudo, "small")+'" alt="avatar de '+pseudo+'" title="'+pseudo+'" />'; });
			var button = '<button class="show_more">Voir +</button><button class="watch_game">Visionner</button>';
			$.ajax({url:window.siteUrl+"views/game/gameBox.html", cache:false, async:false, success: function(tpl){$("#game_list").append(tplawesome(tpl, [{'gameId':game.gameId,'boardRadius':game.boardRadius,'gameName':unescape(game.gameName), 'controls':button, 'more':"<p>Nombres d'équipes : "+game.nbTeams+"<br>Nombres de légions par joueur :"+(game.nbLegions/game.nbPlayers)+"</p>", 'players':avatars}]))}});
		});
	} 
	else $("#game_list").append('<i style="display: block;" class="pt1 pl3">Aucune partie en cours</i>')
}

function initRoomPage(){
	refreshChatList();
	$("#game").fadeOut("fast", function(){
		var structure = $('<div id="game"><div class="grid"><div class="grid1-2"><div id="pageLeft"></div><div id="pageRight"><div id="game_composition"></div></div></div></div></div>').hide();
		$(this).replaceWith(structure);
		
		$.ajax({url:window.siteUrl+"views/game/createRoom.html", cache:false, async:false, success: function(data){$("#pageLeft").html(data);}});
		
		$("#pageRight").prepend('<h2 class="game_name">Partie<h2></div>');

		updateCompositionStructure("normal", 2, 2, window.pseudo, 0.5);
		
		$("[name='roomType']").change(function(){
			switch($(this).val()) {
				case "normal":	
					$(".form_create_room-all").slideDown("fast"); 
					updateCompositionStructure("normal", $("[name=nbTeams]").val(), $("[name=nbPlayers]").val(), window.pseudo);
					break;
				case "robot":	
					$(".form_create_room-all").slideUp("fast"); 
					updateCompositionStructure("robot", 2, 2, window.pseudo, 0.5);
					break;
			}
		});
		
		$('[name=nbLegions]').change(function() {
			switch($(this).val())
			{
				case '1':	$('[name=timer]').find('option[value=10]').attr('selected', true); break;
				case '2':	$('[name=timer]').find('option[value=20]').attr('selected', true); break;
				case '3':	$('[name=timer]').find('option[value=30]').attr('selected', true); break;
			}
		});
		 
		
		$('[name=nbTeams]').change(function() {
			updateCompositionStructure("normal", $(this).val(), $("[name=nbPlayers]").val(), window.pseudo, 0.5);
		});
		 
		$('[name=nbPlayers]').change(function() {   
			var value = $(this).val();
			var legion = $('[name=nbLegions]');
			var team = $('[name=nbTeams]');
			switch(value) {
				case '2': 
					team.find('option[value=2]').attr('disabled', false);
					team.find('option[value=3]').attr('disabled', true);
					legion.find('option[value=1]').attr('disabled', false);
					legion.find('option[value=2]').attr('disabled', false);
					legion.find('option[value=3]').attr('disabled', false);
					team.find('option[value=2]').attr('selected', true);
					break;				
				case '3': 
					team.find('option[value=2]').attr('disabled', true);
					team.find('option[value=3]').attr('disabled', false);
					legion.find('option[value=1]').attr('disabled', false);
					legion.find('option[value=2]').attr('disabled', false);
					legion.find('option[value=3]').attr('disabled', true);
					team.find('option[value=3]').attr('selected', true);
					legion.find('option[value=1]').attr('selected', true);
					break;				
				case '4':
					team.find('option[value=2]').attr('disabled', false);
					team.find('option[value=3]').attr('disabled', true);
					legion.find('option[value=1]').attr('disabled', false);
					legion.find('option[value=2]').attr('disabled', true);
					legion.find('option[value=3]').attr('disabled', true);
					team.find('option[value=2]').attr('selected', true);
					legion.find('option[value=1]').attr('selected', true);
					break;
				case '6':
					team.find('option[value=2]').attr('disabled', false);
					team.find('option[value=3]').attr('disabled', false);
					legion.find('option[value=1]').attr('disabled', false);
					legion.find('option[value=2]').attr('disabled', true);
					legion.find('option[value=3]').attr('disabled', true);
					team.find('option[value=2]').attr('selected', true);
					legion.find('option[value=1]').attr('selected', true);
					break;
			}
			updateCompositionStructure("normal", team.val(), $(this).val(), window.pseudo, 0.5);
		});
		$('.form_create_room').submit(function(e) {    
			e.preventDefault();
			var roomInfos = {};
			roomInfos["type"] = "createRoom";
			roomInfos["clientId"] = ""+window.clientId;
			roomInfos["roomName"] = escape($('[name=roomName]').val()+"");
			roomInfos["roomMdp"] = ($('[name=roomType]').val() != "robot" ? $('[name=roomMdp]').val()+"" : "");
			roomInfos["boardRadius"] = $('[name=boardRadius]').val()+"";
			roomInfos["nbPlayers"] = ($('[name=roomType]').val() != "robot" ? $('[name=nbPlayers]').val()+"" : "2");
			roomInfos["nbTeams"] = ($('[name=roomType]').val() != "robot" ? $('[name=nbTeams]').val()+"" : "2");
			roomInfos["nbLegions"] = ($('[name=roomType]').val() != "robot" ? (($('[name=nbPlayers]').val() * $('[name=nbLegions]').val())+"") : ((2*$('[name=nbLegions]').val())+""));
			roomInfos["roomType"] = $('[name=roomType]').val()+"";
			roomInfos["timer"] = $('[name=timer]').val()+"";
			sendData(JSON.stringify(roomInfos));
		});
		$('.form_create_room-cancel').click(function(e) {
			e.preventDefault();
			initStartPage();
		});
		$('#game').fadeIn("fast");
	});
}

function initRoom(response) {
	$(".form_create_room input, .form_create_room select").attr("disabled", true);
	$(".form_create_room input, .form_create_room select").css("opacity", "0.5");
	$(".form_create_room input[type=submit], .form_create_room button").remove();
	$("[name=roomName]").val(response.roomName);
	$("[name=roomType]").val(response.roomType);
	$("[name=roomMdp]").val(response.roomMdp);
	$("[name=boardRadius]").val(response.boardRadius);
	$("[name=nbTeams]").val(response.nbTeams);
	$("[name=timer]").val(response.timer);
	$("[name=nbPlayers]").val(response.nbPlayers);
	$("[name=nbLegions]").val(response.nbLegions / response.nbPlayers);
	
	updateCompositionStructure("normal", response.nbTeams, response.nbPlayers, response.roomAdmin, 1);
	
	if($("[name='roomType']").val() == "robot")	$(".form_create_room-all").slideUp("fast");
			
	$("#pageRight").fadeOut("fast", function(){
		$(".game_name").replaceWith('<h2 class="game_name"><span class="visually-hidden" id="room_id_val">'+response.roomId+'</span>Partie '+unescape(response.roomName)+'<h2></div>');
		
		$("#pageRight").append('<br><div id="room_controls" class="txtcenter"><button id="room_exit">Quitter</button> <button id="room_ready">Je suis prêt</button></div><br>');
		$("#room_exit").click(function(e) {
			sendData('{"type":"exitRoom","roomId":"'+response.roomId+'","clientId":"'+window.clientId+'"}');
			destroyChatBox("chatbox_all");
			initStartPage();
		});
		$("#room_ready").click(function(e) {
			sendData('{"type":"playerReady","roomId":"'+response.roomId+'","clientId":"'+window.clientId+'"}');
			$("#room_controls").html("<button disabled>Vous êtes prêt !</button>");
		});
		$("#pageRight").fadeIn("fast");
	});
		
	openNewChatBox(unescape(response.roomName), "chatbox_all");
}

function swapPlayers(from, to) {
	var from_html = from.html();
	var to_html = to.html();
	from.html(to_html);
	to.html(from_html);
	//send the event to the game server
	sendData('{"type":"switchPlayer","roomId":"'+$("#room_id_val").html()+'","numberPlayer1":"'+(from.attr("id")).replace("slot", "")+'","numberPlayer2":"'+(to.attr("id")).replace("slot", "")+'","clientId":"'+window.clientId+'"}');
}

function makeRobot(slot) {
	//send the event to the game server
	sendData('{"type":"createRobot","roomId":"'+$("#room_id_val").html()+'","numberRobot":"'+slot+'","clientId":"'+window.clientId+'"}');
}

function kickPlayer(slot) {
	//send the event to the game server
	sendData('{"type":"kickPlayer","roomId":"'+$("#room_id_val").html()+'","numberKicked":"'+slot+'","clientId":"'+window.clientId+'"}');
}
        
function updateComposition(response) {
	$.each(response.players.player, function(i, player) {
		if(player.pseudoPlayer != "") {
			if(window.pseudo == response.roomAdmin && player.pseudoPlayer != window.pseudo)	$("#slot"+player.numberPlayer).html('<img src="'+window.siteUrl+'user/avatar/'+player.pseudoPlayer+'/medium/'+'" class="avatar" alt="avatar de '+player.pseudoPlayer+'" /><strong class="txtcenter pseudo">'+player.pseudoPlayer+'&nbsp;&nbsp;<a href="javascript:void(0);" onclick="kickPlayer('+player.numberPlayer+')"><i class="fa fa-times-circle"></i></a></strong>');
			else	$("#slot"+player.numberPlayer).html('<img src="'+window.siteUrl+'user/avatar/'+player.pseudoPlayer+'/medium/'+'" class="avatar" alt="avatar de '+player.pseudoPlayer+'" /><strong class="txtcenter pseudo">'+player.pseudoPlayer+'</strong>');
			if(window.pseudo == response.roomAdmin)	$("#slot"+player.numberPlayer).draggable("enable");
			if(player.pseudoPlayer == response.roomAdmin) $("#slot"+player.numberPlayer+" .avatar").addClass("avatar-admin");
			else $("#slot"+player.numberPlayer+" .avatar").removeClass("avatar-admin");
		}
		else {
			if(window.pseudo == response.roomAdmin) {
				$("#slot"+player.numberPlayer).html('<img src="'+window.siteUrl+'user/avatar/empty/medium/'+'" class="avatar" alt="avatar par défaut" /><strong class="txtcenter pseudo"><a href="javascript:void(0);" onclick="makeRobot('+player.numberPlayer+')"><i class="fa fa-android"></i></a></strong>');
				$("#slot"+player.numberPlayer).draggable("disable");
			}
			else {
				$("#slot"+player.numberPlayer).html('<img src="'+window.siteUrl+'user/avatar/empty/medium/'+'" class="avatar" alt="avatar par défaut" /><strong class="txtcenter pseudo">&nbsp;</strong>');
			}
		}
	});
}
        
function updateCompositionStructure(mode, nbTeams, nbPlayers, admin, opacity) {
	$("#game_composition").html(""); // empty the structure
	$("#game_composition").css("opacity", opacity);
	$("#game_composition").removeClass(); // remove all classes
	$("#game_composition").addClass("game_composition");
	$("#game_composition").addClass("game_composition"+nbTeams);
	if(mode=="robot") {
		$("#game_composition").append('<div id="team0" class="team team-vs"><div id="slot1" class="slot"><img src="'+window.siteUrl+'user/avatar/'+admin+'/medium/'+'" class="avatar" alt="avatar de '+admin+'" /><strong class="txtcenter pseudo">'+admin+'</strong></div></div>');
		$("#game_composition").append('<div id="team1" class="team"><div id="slot0" class="slot"><img src="'+window.siteUrl+'user/avatar/robot/medium/'+'" class="avatar" alt="avatar de robot" /><strong class="txtcenter pseudo">Robot</strong></div></div>');
	}
	else {
		var current_slot = 0;
		for(var i = 0; i < nbTeams; i++)	{
			if(i < nbTeams -1)	$("#game_composition").append('<div id="team'+i+'" class="team team-vs"></div>');
			else	$("#game_composition").append('<div id="team'+i+'" class="team"></div>');
			for(var j = 0; j < nbPlayers/nbTeams; j++)	{
				$("#team"+i).append('<div id="slot'+current_slot+'" class="slot"><img src="'+window.siteUrl+'user/avatar/empty/medium/'+'" class="avatar" alt="avatar par défaut" /><strong class="txtcenter pseudo">&nbsp;</strong></div>');
				$("#slot"+current_slot).draggable({ revert: true, zIndex: 100 });
				$("#slot"+current_slot).draggable("disable");
				$("#slot"+current_slot).droppable({
					drop: function(event, ui) {
						swapPlayers(ui.draggable, $(this));
					}
				});
				current_slot++;
			}
		}
	}
}

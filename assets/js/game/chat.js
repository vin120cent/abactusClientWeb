function initChat() {
	$("#game").after('<div id="chatboxes_container"></div>');
	$("#game").after('<div id="chat_container"><div class="chat_trigger"><span class="txt"><<</span></div><div class="chat_list"></div></div>');
	$(document).on("click", ".chat_minimize", function() {
		var chat = $(this).parent().parent();
		if(!$(chat).hasClass("minimized"))
		{
			$(chat).removeClass("notify");
			$(chat).addClass("minimized");
		}
		else
		{
			$(chat).addClass("notify");
			$(chat).removeClass("minimized");
			$(chat).find(".chat_input").focus();
		}

	});
	$(document).on("click", ".chat_trigger", function() {
		if($(this).parent().hasClass("opened")) {
			$(this).html('<span class="txt"><<</span>');
			$("#chatboxes_container").removeClass("shift");
			$(this).parent().removeClass("opened");
			$(this).parent().removeClass("stop");	
		}
		else {
			$(this).html('<span class="txt">>></span>');
			$("#chatboxes_container").addClass("shift");
			$(this).parent().addClass("opened");
			$(this).parent().addClass("stop");	
		}

	});
	$(document).on("click", ".chat_send", function() {
		$(this).parent().submit();
	});
	$(document).on("submit", ".chat_write", function(e) {
		e.preventDefault();
		id = $(this).parent().attr("id");
		sendMessage(escape($(this).find(".chat_input").val()), id.replace("chatbox_", ""));
		$(this).find(".chat_input").val("");		
	});	
	$(document).on("click", "#chat_container .item", function() {
		var pseudo = $(this).find(".pseudo").html();
		openNewChatBox(pseudo, "chatbox_"+pseudo);
	});
}

function destroyChatBox(id) {
	if($("#"+id).length && id.indexOf("chatbox_") > -1) {
		$("#"+id).remove();
	}
}

function openNewChatBox(title, id) {
	if(!$("#"+id).length && id != "chatbox_"+window.pseudo) {
		$.ajax({url:"../../views/game/chat.html", cache:false, async:false, success: function(tpl){$("#chatboxes_container").append(tplawesome(tpl, [{'id':id, 'title':title}]))}});
	}
	$("#"+id).addClass("notify");
	$("#"+id).removeClass("minimized");
	$("#"+id).find(".chat_input").focus();

}

function sendMessage(m, t) {
	if($.trim(m) != "")
	{
		sendData('{"type":"chatMessage","target":"'+t+'","message":"'+m+'","clientId":"'+window.clientId+'"}');
		if(t != "all" && t != "team")	receiveMessage(JSON.parse('{"message": "'+m+'", "target": "'+t+'", "clientSource": "moi", "type": "chatMessage"}'));
	}
}

function receiveMessage(m) {
	if(m.clientSource != window.pseudo && m.clientSource != "moi") playSound("chat");
	if(m.target == "team" || m.target == "all" || m.clientSource == "moi" || m.clientSource == "invite")	var chatbox_id = m.target;
	else	var chatbox_id = m.clientSource;
	var chatbox = $("#chatbox_"+chatbox_id);
	if(!chatbox.length > 0)	
	{
		openNewChatBox(chatbox_id, "chatbox_"+chatbox_id);
		receiveMessage(m);
	}
	else
	{
		var messages = chatbox.find(".chat_messages");
		var message = $("<div>"+unescape(m.message)+"</div>");
		if(m.clientSource == "server" || m.clientSource == "invite") messages.append('<div class="chat_item server_notification">'+m.message+'</div>');
		else messages.append('<div class="chat_item"><strong>'+m.clientSource+'</strong> '+message.text()+'</div>');
		messages.scrollTop(messages.prop("scrollHeight"));
		if(m.clientSource != window.pseudo && m.clientSource != "moi")	chatbox.addClass("notify");
	}
}

function refreshChatList() {
	sendData('{"type":"allClient","clientId":"'+window.clientId+'"}');	
}

function updateChatList(response) {
	var clients = "";
	var friends = "";
	$.each(response.client, function(i, client) {
		if((client.pseudo).trim() == "" || client.pseudo == window.pseudo)	return;
		if($.inArray((client.pseudo).toLowerCase(), window.friends) > 0)	friends += '<div class="item"><img src="'+window.siteUrl+'user/avatar/'+client.pseudo+'/small/'+'" class="avatar" alt="avatar de '+client.pseudo+'" /><a target="blank" title="Ouvrir le profil" href="'+window.siteUrl+'user/profile/'+client.pseudo+'/"><strong class="pseudo">'+client.pseudo+'</strong></a></div>';
		else	clients += '<div class="item"><img src="'+window.siteUrl+'user/avatar/'+client.pseudo+'/small/'+'" class="avatar" alt="avatar de '+client.pseudo+'" /><a target="blank" title="Ouvrir le profil" href="'+window.siteUrl+'user/profile/'+client.pseudo+'/"><strong class="pseudo">'+client.pseudo+'</strong></a></div>';
	});
	if(friends == "")	friends = "<i>Aucun ami connecté</i>";
	$("#chat_container .chat_list").html('<div class="clients">'+clients+'</div><span class="chat_break"><strong>Mes amis </strong>&nbsp;&nbsp;<a href="javascript:void(0);" onClick="refreshChatList();"><i class="fa fa-refresh"></i></a>&nbsp;&nbsp;<a href="javascript:void(0);" onClick="sound_chat = !sound_chat; refreshChatList();"><i class="fa fa-volume-'+(sound_chat ? "up" : "off")+'"></i></a></span><div class="friends">'+friends+'</div>');
}

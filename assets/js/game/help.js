function openHelpBox(){//Ouvre la fenêtre d' aide
	if(window.helpStatus){
		$("#helpBox").append("\
			<div class='helpBox'>\
			<input id=\"numHelpBox\" type=\"hidden\" value=\"1\">\
				<i id=\"previousHelpBox\" class=\"fa fa-angle-left\" onclick=\"previousHelpBox()\"> précédente</i>\
				<i id=\"nextHelpBox\" class=\"fa fa-angle-right\" onclick=\"nextHelpBox()\"> suivante</i>\
				<i id=\"closeHelpBox\" class=\"fa fa-times\" onclick=\"closeHelpBox()\"></i>\
				<div id=\"content\"></div>\
				<input id=\"helpStatus\" type=\"checkbox\">Ne plus afficher</input>\
			</div>");
		var content = fillHelpBoxWithContent(1);
		$("#content").html(content);
	}
}

function closeHelpBox(){//Ferme la fenêtre d' aide
	if($("#helpStatus").val()){
		window.helpStatus = false;
		$.post(window.siteUrl + 'ajax/user/help/', {help:window.helpStatus}).done(function(data){
			$(".helpBox").remove();
		});
	}
}

function nextHelpBox(){//Affiche le message d' aide suivant
	var num = $("#numHelpBox").val();
	if (num < 4){//limite du nombre maximum de message
		num++;
		$("#numHelpBox").val(num);
	}
	var content = fillHelpBoxWithContent(parseInt(num));
	$("#content").html(content);
}

function previousHelpBox(){//Affiche le message d' aide précédent
	var num = $("#numHelpBox").val();
	if (num > 1){
		num--;
		$("#numHelpBox").val(num);
	}
	var content = fillHelpBoxWithContent(parseInt(num));
	$("#content").html(content);
}

function fillHelpBoxWithContent(num){//Retourne le texte selon le numéro de page en entrée
	switch(num){
		case 1:
			return "<p>Bienvenue dans votre première partie! Afin de vous guider, ces messages vont vous indiquez la marche à suivre.</p>";
		break;
		case 2:
			return "<p>La barre autour du plateau de jeu symbolise le temps qu'il vous reste à jouer. Si vous avez fini votre tour vous pouvez le valider afin de gagner du temps. Si vous ne validez pas votre tour mais que vous avez joué des coups, ceux-ci seront validés automatiquement.</p>";
		break;
		case 3:
			return "<p>Vous disposez de 3 légions. Elles sont indiqués en dessous de ce message. Vous disposez d'un coup par légion. Afin de déplacer un soldat faites le glisser sur une case adjacente à votre légion.</p>";
		break;
		case 4:
			return "<p>Rappel déplacer le laurier compte comme un tour pour une de vos légions. Ainsi, si vous n'avez qu'une seule légion adjacente au laurier il vous suffit de le déplacer de la même manière que vos soldats. En revanche si plus d'une de vos légions est à proximité cliquez sur la légion pour laquelle vous souhaitez utiliser votre tour puis déplacez le laurier.</p>";
		break;
		default:
			return "<p>Oups, aucune aide disponible!</p>";
		break;
	}
}

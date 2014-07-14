// *******************************
// Fonction qui génère la structure html pour une partie
function initGamePage(response){
	refreshChatList();
	firstLoop = true;
	currentpage = "game";
	$("#game").fadeOut("fast", function(){
		var structure = $('<div id="game"><div class="grid"><div class="grid2-1 grid-game-resp"><div id="pageLeft"></div><div id="pageRight"><div id="helpBox"></div><div id="playersInfo"><div id="game_composition"></div></div><div id="gameControls"></div></div></div></div></div>').hide();
		$(this).replaceWith(structure);
		game = response;
		initBoard(response);
		if(!spectateur)	openHelpBox();
		$('#game').fadeIn("fast");
		$("html, body").animate({ scrollTop: $("#game").offset().top });
	});
	if(!spectateur) openNewChatBox("Team", "chatbox_team");
	else openNewChatBox(unescape(response.gameName), "chatbox_all");	
} // End function initGamePage


// *******************************
// Fonction qui génère la structure html pour un nouveau plateau
function initBoard(response) {
    var pageLeft=$("#pageLeft").html("");
    pageLeft.append("<canvas id='plateau'><canvas>");
    
    //infos joueurs
    if(response.players != null) {
		var gameComposition=$("#game_composition").html(""); // empty the structure
        gameComposition.addClass("game_composition");
        gameComposition.addClass("game_composition"+response.nbTeams);
		for(var i = 0; i < response.nbTeams; i++) {
			if(i < response.nbTeams -1)	gameComposition.append('<div id="team'+i+'" class="team team-vs"></div>');
			else	gameComposition.append('<div id="team'+i+'" class="team"></div>');
		}
		$.each(response.players, function(i, player) {
			var playerLegions = "";
			var current_legion_class = "";
			$.each(player.legionId, function(i, legion) {
				switch(tabFormes[legion % response.nbTeams]) {
					case "rectangle": current_legion_class = "fa fa-stop"; break;
					case "circle": current_legion_class = "fa fa-circle"; break;
					case "triangle": current_legion_class = "fa fa-play"; break;
				}
				playerLegions += '<i class="'+current_legion_class+'" style="color:'+tabCouleurs[legion]+';"></i>&nbsp;';
			});
			$("#team"+player.teamId).append('<div class="slot slot-'+(player.pseudo).toLowerCase()+'"><img src="'+window.siteUrl+'user/avatar/'+player.pseudo+'/small/'+'" class="avatar avatar-small" alt="avatar de '+player.pseudo+'" /><strong class="txtcenter pseudo">'+player.pseudo+'</strong><span class="shapes">'+playerLegions+'</span></div>');

		});
    }
        
    var width = parseFloat($(window).height());
    var height = parseFloat(width);
    width = Math.min(width, height);
    height = width;
    var ctx = $("#plateau");
    ctx.attr("width", width);
    ctx.attr("height", width);
    $canvas = ctx;
    pingpong = [0];
    initTimer();
    plateau = drawBoard(response);
} // End function initBoard

// *******************************
function deactivatePlayerGameComposition(response) {
	$(".slot-"+response.exitPseudo).css("opacity", 0.5);
} // End function deactivatePlayerGameComposition

// *******************************
// Fonction qui permet de changer de mode de déplacement entre drag et clique
function change_move_mode(){
    switch (move_mode) {
        case "click":
            move_mode = "drag";
            $.getScript(window.siteUrl+"/assets/js/game/draw_"+move_mode+".js").done(function(a, b){
                $("#change_move").text("Passez en mode clique");
            });
            break;
        case "drag":
            move_mode = "click";
            $.getScript(window.siteUrl+"/assets/js/game/draw_"+move_mode+".js").done(function(a, b){
                $("#change_move").text("Passez en mode drag&drop");
            });
            break;
    }
} // End function change_move_mode


// *******************************
// Fonction qui gère tout le timer
function initTimer(){
    var width = parseFloat($(window).height());
    var height = parseFloat(width);
    var dim = Math.min(width, height);
    
    if($(window).width() <= 768) { //mobile devices
		timer_step = timer_step_mobile;
	}
	else {
		timer_step = timer_step_desktop;
	}
    
    timer.i = timer.initSec;
    timer.i = timer.i - avg(pingpong);
    clearInterval(timer.countdown);

    if($canvas.getLayer("timer") != undefined) {
        $canvas.setLayer("timer",{end:360});
            timer.countdown = setInterval(function(){
            countdown();
            timer.i = timer.i - (timer_step/1000);
        }, timer_step);
    }
    else{
	    $canvas.addLayer({
            type: 'arc',
            name:'timer-border',
            strokeStyle: '#c6bfaf',
            strokeWidth: 8,
            x: (dim/2), y: (dim/2),
            radius: ((dim-20)/2),
            start: 0, end: 360
        });
        $canvas.addLayer({
            type: 'arc',
            name:'timer',
            strokeStyle: '#fff',
            strokeWidth: 5,
            x: (dim/2), y: (dim/2),
            radius: ((dim-20)/2),
            start: 0, end: 360
        });
        $canvas.drawLayer("timer");
            timer.countdown = setInterval(function(){
            countdown();
            timer.i = timer.i - (timer_step/1000);
        }, timer_step);
    }
} // End function initTimer

// *******************************
// Fonction appelée par le timer à chaque décompte
function countdown(){
    if(timer.i < 0){clearInterval(timer.countdown);return}
    $canvas.setLayer("timer", {end:(timer.i*360/timer.initSec)});
    $canvas.drawLayers();
} // End function countdown



// *******************************
// Fonction qui dessine le plateau de jeu
function drawBoard(plateau) {
	
	var gameControls=$("#gameControls").html(""); //vide la div des boutons d' actions
	if(!spectateur) gameControls.append("<br/><button id='btnValideTour' onclick='valideMonTour();'>Valider mon tour</button><br/>");
    gameControls.append("<button id='exitGame'>Quitter</button>");
    if(move_mode == "click" && !spectateur && !is_touch_device()) gameControls.append("<button id='change_move' onclick='change_move_mode();'>Passer en mode drag&drop</button>");
    if(move_mode == "drag" && !spectateur && !is_touch_device()) gameControls.append("<button id='change_move' onclick='change_move_mode();'>Passer en mode clic</button>");
    gameControls.append("<button id='disable_sound' onclick='disableGameSounds();'>"+(sound_game ? "Désactiver les sons" : "Réactiver les sons")+"</button>");

	var wait_confirm_exit = false;
	$("#exitGame").click(function() {
		if(!wait_confirm_exit) {
			$(this).html("Cliquez pour confirmer");
			wait_confirm_exit = true;
		}
		else {
			sendData('{"type":"exitGame","gameId":"'+plateau.gameId+'","clientId":"'+window.clientId+'"}');
			moi = null;
			initStartPage();
			destroyChatBox("chatbox_all");
			destroyChatBox("chatbox_team");
		}
	});
	
	var width = parseFloat($(window).width());
	if(width > 768)	width = width * 0.6;
	else width = width * 0.90 - 20;
	var height = parseFloat($(window).height());
        width = Math.min(width, height);
        height = width;
	var ctx = $("#plateau");
	$canvas.attr("width", width);
        $canvas.attr("height", width);
        $canvas.setLayer("timer",  {x: (height/2), y: (height/2), radius: ((height-20)/2)});
        $canvas.setLayer("timer-border",  {x: (height/2), y: (height/2), radius: ((height-20)/2)});

	//on vide
        $canvas.removeLayerGroup('plateau');
	
	// Initialisation de variables
	var res = {};
	var RBoard = plateau.boardRadius;
	var xStart = parseFloat(width/2);
	var yStart = parseFloat(height/2);
	var radius = parseFloat((height/(RBoard*2+1))/2);
	var cells = plateau.cells;
	var cell, uw, u, w, Rin, Rout, Ux, Uy, Wx, Wy, x, y;
        var fill;
	var laurelCoordonnees = {};
	var source = '';        

	// *** Draw the board ***
        // On dessine d' abord les cases pour des soucis de z-index sur les layers, donc deux boucles !
	for(var i in cells){
		cell = cells[i];
		uw = cell.uw.split(",");
		u = parseInt(uw[0]);
		w = parseInt(uw[1]);
		Rin = parseFloat(height/((4*RBoard+4)));
		Rout = parseFloat(Rin*2/Math.sqrt(3));
		Ux = parseFloat(3./2*Rout);
		Uy = -Rin;
		Wx = 0.;
		Wy = parseFloat(2*Rin);
		x = parseFloat((u*Ux+w*Wx)+xStart);
		y = parseFloat((u*Uy+w*Wy)+yStart);
		source = window.siteUrl+'assets/img/game/laurel_bw.png';
		
		//Si case pour gagner
		switch (u+","+w) {
			case RBoard+",0" :
				if(cell.soldier && firstLoop){
					fill = tabCouleurs2[cell.legionId];
					tabBase[0] = {pos: u+","+w,color: fill};
				} else {
					fill = tabBase[0].color;
				}
			break;
			case "0,-"+RBoard :
				if(cell.soldier && firstLoop){
					fill = tabCouleurs2[cell.legionId];
					tabBase[1] = {pos: u+","+w,color: fill};
				} else {
					fill = tabBase[1].color;
				}
			break;
			case RBoard+","+RBoard :
				if(cell.soldier && firstLoop){
					fill = tabCouleurs2[cell.legionId];
					tabBase[2] = {pos: u+","+w,color: fill};
				} else {
					fill = tabBase[2].color;
				}
			break;
			case "0,"+RBoard :
				if(cell.soldier && firstLoop){
					fill = tabCouleurs2[cell.legionId];
					tabBase[3] = {pos: u+","+w,color: fill};
				} else {
					fill = tabBase[3].color;
				}
			break;
			case "-"+RBoard+",0" :
				if(cell.soldier && firstLoop){
					fill = tabCouleurs2[cell.legionId];
					tabBase[4] = {pos: u+","+w,color: fill};
				} else {
					fill = tabBase[4].color;
				}
			break;
			case "-"+RBoard+","+"-"+RBoard :
				if(cell.soldier && firstLoop){
					fill = tabCouleurs2[cell.legionId];
					tabBase[5] = {pos: u+","+w,color: fill};
				} else {
					fill = tabBase[5].color;
				}
			break;
			default:
				fill = "#fff";
			break;
		}
		
			
		// On dessine l' hexagone
		$canvas.drawPolygon({
			layer : true,
			bringToFront: false,
			name: u+','+w,
			fillStyle: fill,
			strokeStyle: '#000',
			strokeWidth: 1.2,
			x: x, y: y,
			radius: radius,
			sides: 6,
			rotate: 60,
			click:function(layer){
				console.log(layer.name);
			}
		})
		.addLayerToGroup(u+','+w, 'case').addLayerToGroup(u+','+w, 'plateau');
                
                // On dessine le laurier grisé sur les bords
                if (move_mode == "drag") {
                    if(uw == RBoard+",0" || uw == "0,-"+RBoard || uw == RBoard+","+RBoard || uw == "0,"+RBoard || uw == "-"+RBoard+",0" || uw == "-"+RBoard+","+"-"+RBoard ){
						$canvas.addLayer({
							type: 'image',
							source: source,
							x: x, y: y,
							name : 'b'+u+','+w,
							width: radius, 
							height:radius,
							layer: true,
							radius: radius
						}).addLayerToGroup('b'+u+','+w, 'base').addLayerToGroup('b'+u+','+w, 'plateau');
                    }
                }
                
		res[u+','+w] = x+','+y;
		UWtoCell[u+','+w] = cell;
	} // *** End dessin du plateau ***
        
	firstLoop = false;
	
        // *** Draw solders ***
        // Deuxième boucles pour les soldats, sinon certains soldats se retrouvent en dessous de certaines cases
	for(var i in cells){
		cell = cells[i];
		uw = cell.uw.split(",");
		u = parseInt(uw[0]);
		w = parseInt(uw[1]);
		Rin = parseFloat(height/((4*RBoard+4)));
		Rout = parseFloat(Rin*2/Math.sqrt(3));
		Ux = parseFloat(3./2*Rout);
		Uy = -Rin;
		Wx = 0.;
		Wy = parseFloat(2*Rin);
		x = parseFloat((u*Ux+w*Wx)+xStart);
		y = parseFloat((u*Uy+w*Wy)+yStart);
		
		// SI SOLDAT
		if(cell.soldier == true) {
			if(tabFormes[cell.legionId % game.nbTeams] === "rectangle"){
				drawArectangle(x, y, u, w, radius, cell);
			}
			if(tabFormes[cell.legionId % game.nbTeams] === "circle"){
				drawAcircle(x, y, u, w, radius, cell);
			}
			if(tabFormes[cell.legionId % game.nbTeams] === "triangle"){
				drawAtriangle(x, y, u, w, radius, cell);
			}
		}
		// SI ARMURE
		if(cell.armor) {
		   drawAnArmor(x, y, u, w, radius);
		}
		// SI LAURIER
		if(cell.laurel) {
			laurelCoordonnees = {
				x:x,
				y:y,
				u:u,
				w:w,
				radius:radius
			};
		}
	} // *** End draw solders ***
        
        
	// On dessine le laurier
	drawLaurel(laurelCoordonnees.x, laurelCoordonnees.y, laurelCoordonnees.u, laurelCoordonnees.w, laurelCoordonnees.radius);
        
        // On dessine tous les layers
	$canvas.drawLayers();
        
	return res;
} // End function drawBoard


// *******************************
// Fonction appelée pour valider un tour et envoyer les infos au serveur de jeu
function valideMonTour(){
    
        $(".btnResetCoup").each(function(){$(this).remove()});
        var coup;
        for(var c in window.moncoup){
            coup = window.moncoup[c];
            if(coup != null) sendData(JSON.stringify(coup));
        }
	var text = new Object();
	text.type = "finishClientMovement";
	text.mvtType = "finishClientMovement";
	text.clientId = window.clientId+"";
	text.gameId = game.gameId+"";
	sendData(JSON.stringify(text));
        $("#btnValideTour").html("En attente des autres joueurs.");
        $("#btnValideTour").prop("disabled",true);
        $canvas.setLayerGroup('case', {
                strokeStyle: '#000',
                strokeWidth: 1,
                click:function(layer){},
                touchend:function(layer){}
        }).drawLayers();
        $canvas.setLayers({click:function(layer){}, draggable:false, touchend:function(layer){}});
        $canvas.drawLayers();
} // End function valideMonTour


// *******************************
// Fonction qui fait les animations de déplacement
// tabMvt = Array de déplacement
function drawMouvment(tabMvt){

    var delai = 0;
    movedSolders = new Array();

    if(tabMvt.movements.soldierMovements != undefined) {
        playSound("move");
        var mvt, layer, cell;
        for(var m in tabMvt.movements.soldierMovements){
            mvt = tabMvt.movements.soldierMovements[m];
            layer = $canvas.getLayer(mvt.celArr);
            movedSolders[mvt.celArr] = $canvas.getLayer('s'+mvt.celDep);
            // Si c'est un de nos soldats pas besoin de déplacer
            if(!spectateur && moi.playerLegionId.indexOf(mvt.legionId) == -1) {
                $canvas.animateLayer('s'+mvt.celDep, {x: layer.x, y: layer.y}, 1000, function(layeur){
                    if ($canvas.getLayer('a'+mvt.celArr) != undefined) {
                        $canvas.animateLayer(layeur.name, {strokeWidth : 3,strokeStyle: '#000'}, 400, function(l){$canvas.removeLayer(l.name)});
                        delai = 1500;
                    }
                });
            }
            if(spectateur) {
                $canvas.animateLayer('s'+mvt.celDep, {x: layer.x, y: layer.y}, 1000, function(layeur){
                    if ($canvas.getLayer('a'+mvt.celArr) != undefined) {
                        $canvas.animateLayer(layeur.name, {strokeWidth : 3,strokeStyle: '#000'}, 400, function(l){$canvas.removeLayer(l.name)});
                        delai = 1500;
                    }
                });
            }
        }
    }

    if(tabMvt.movements.laurelMovements != undefined) {
        var mvt = tabMvt.movements.laurelMovements[0];
        var layer = $canvas.getLayer(mvt.celArr);
        $canvas.animateLayer('l'+mvt.celDep, {x: layer.x, y: layer.y}, 1000);
    }

    if (delai == 1500) return 1500;
    else return 1000;

} // End function drawMouvment

// *******************************
// Fonction qui fait les animations de combat
// tabFights = Array de fights
function drawFights(tabFights){
    var delai = 0;
    var playsoud = false;
    if(tabFights != undefined) {
        var fight, winner, looser;
        for(var f in tabFights){
            fight = tabFights[f];
            if(fight.fightLooser !== undefined) {
                if(!playsoud) playSound("fight");
                if(!playsoud) playsoud = true;
                if(movedSolders[fight.fightLooser] != undefined) {
                    looser = movedSolders[fight.fightLooser];
                    if(looser.type == "rectangle") $canvas.animateLayer(looser.name, {width: 0, height: 0}, 1000);
                    else $canvas.animateLayer(looser.name, {radius: 0}, 1000);
                }
                else{
                    looser = $canvas.getLayer('s'+fight.fightLooser);
                    if(looser.type == "rectangle") $canvas.animateLayer('s'+fight.fightLooser, {width: 0, height: 0}, 1000);
                    else $canvas.animateLayer('s'+fight.fightLooser, {radius: 0}, 1000);
                }
                
            }
        }
        delai+=1000;
    }
    return delai;

} // End function drawFights


// *******************************
// Fonction qui fait les animations de tenaille
// tabTenailles = Array de tenailles
function drawTenailles(tabTenailles){
    var delai = 0;
    var playsoud = false;
    if(tabTenailles != undefined) {
        var ten, ft, st, xm, ym;
        for(var t in tabTenailles){
            ten = tabTenailles[t];
            if(ten.firstTenailler !== undefined && ten.secondeTenailler !== undefined) {
                
                if(!playsoud) playSound("fight");
                if(!playsoud) playsoud = true;
                
                if(movedSolders[ten.firstTenailler] != undefined){
                    ft = movedSolders[ten.firstTenailler];
                }
                else{
                    ft = $canvas.getLayer('s'+ten.firstTenailler);
                }
                
                if(movedSolders[ten.secondeTenailler] != undefined){
                    st = movedSolders[ten.secondeTenailler];
                }
                else{
                    st = $canvas.getLayer('s'+ten.secondeTenailler);
                }
                
                if(ft !== undefined && st !== undefined) {
                    xm = Math.abs(ft.x - st.x)/2;
                    ym = Math.abs(ft.y - st.y)/2;
                    if(ft.x > st.x) xm = ft.x - xm;
                    else xm = ft.x + xm;
                    if(ft.y > st.y) ym = ft.y - ym;
                    else ym = ft.y + ym;
                    var x1 = ft.x;
                    var y1 = ft.y;
                    var x2 = st.x;
                    var y2 = st.y;
                    
                    $canvas.drawLine({
                        layer:true,
                        name: ten.firstTenailler+ten.secondeTenailler,
                        groups:["plateau"],
                        strokeStyle: '#000',
                        strokeWidth: 3,
                        rounded: true,
                        startArrow: true,
                        arrowRadius: 15,
                        x1: xm, y1: ym,
                        x2: x1, y2: y1
                    });
                    //$canvas.moveLayer(ten.firstTenailler+ten.secondeTenailler, plateau.cells.length);
                    $canvas.drawLayer(ten.firstTenailler+ten.secondeTenailler);
                    $canvas.drawLine({
                        layer:true,
                        name: ten.secondeTenailler+ten.firstTenailler,
                        groups:["plateau"],
                        strokeStyle: '#000',
                        strokeWidth: 3,
                        rounded: true,
                        startArrow: true,
                        arrowRadius: 15,
                        x1: xm, y1: ym,
                        x2: x2, y2: y2
                    });
                    //$canvas.moveLayer(ten.secondeTenailler+ten.firstTenailler, plateau.cells.length);
                    $canvas.drawLayer(ten.secondeTenailler+ten.firstTenailler);
                }
            }
            delai = 2000;
        }
    }
    return delai;

} // End function drawTenailles


// *******************************
// Fonction de dessin d'une armure : un carré plein
function drawAnArmor(x, y, u, w, radius) {
	//$canvas.addLayer({
	//	type: 'rectangle',
	//	bringToFront: true,
	//	fillStyle: "#000",
	//	x: x, y: y,
	//	width: radius/100*50, height: radius/100*50,
	//	name: 'a'+u+','+w,
	//	layer : true
	//}).addLayerToGroup('a'+u+','+w, 'plateau');
        
    $canvas.addLayer({
        type:"polygon",
        name: 'a'+u+','+w,
	ayer : true,
        fillStyle: "#000",
        x: x, y: y,
        radius: radius/100*50,
        sides: 3,
        concavity: -0.65,
        rotate: 180
    }).addLayerToGroup('a'+u+','+w, 'plateau');
    
} // End function drawAnArmor


// *******************************
// Fonction qui renvoie les voisins proche d' une cellule
function getVoisins(layer){
	var nom = layer.name.substring(1);
	var uw = nom.split(",");
	var u = parseInt(uw[0]);
	var w = parseInt(uw[1]);
	var UWs =[];
	UWs[0] = {u: u+1, w: w}; 
	UWs[1] = {u: u+1, w: w+1};
	UWs[2] = {u: u, w: w+1};
	UWs[3] = {u: u, w: w-1};
	UWs[4] = {u: u-1, w: w-1};
	UWs[5] = {u: u-1, w: w};

	return UWs;
} // End function getVoisins


// *******************************
// Fonction qui retourne les voisins proche où l' on peut se déplacer
function getVoisinsLibres(layer, layerOrigine){
	var potentiel = getVoisins(layer);		
	var lesLibres = [];
	var cellPotentiel;
	var cell;
	cell = UWtoCell[layerOrigine.name.substring(1)];
	
	for (var i in potentiel){
		if ($canvas.getLayer('s'+potentiel[i].u+','+potentiel[i].w) == null && $canvas.getLayer('l'+potentiel[i].u+','+potentiel[i].w) == null ){
			cellPotentiel = UWtoCell[potentiel[i].u+','+potentiel[i].w];
				if (cellPotentiel != null && (cellPotentiel.armor == true && cell.isArmored == true) == false) {
					lesLibres.push(potentiel[i]);
				}
		}
	}		
	return lesLibres;
} // End function getVoisinsLibres


// *******************************
// Fonction qui renvois la liste des voisins d' un groupe de cellule où l' on peut se déplacer
function getCasesLibresPourGroupe(layer){

	var lesValides = [];
	var maLegion = $canvas.getLayerGroup(layer.groups[0]);
	var monGroupe = getMonGroupe(layer);
	$.each(monGroupe, function(i, soldat){
		var lesLibres = getVoisinsLibres(soldat, layer);
		$.each(lesLibres, function(j, item2){
			var DejaPresent = $.grep(lesValides, function(maCase){
				return maCase.u == item2.u && maCase.w == item2.w;
			}); 
			if(DejaPresent.length == 0){
				lesValides.push(lesLibres[j]);
			}
		});
	});
	return lesValides;
} // End function getCasesLibresPourGroupe


// *******************************
// Fonction qui retourne toutes les cellules d' un groupe
function getMonGroupe(layer){
	var monGroupe = [];
	monGroupe.push(layer);
	var maLegion = $canvas.getLayerGroup(layer.groups[0]);
	var trouve = true;
	var i = 0;
	var DejaTeste = [];
	var ATester
	var nomLayer = layer.name.substring(1);
	var uwLayer = nomLayer.split(",");
	var uLayer = parseInt(uwLayer[0]);
	var wLayer = parseInt(uwLayer[1]);
	DejaTeste.push({u:uLayer, w:wLayer});
		
	while(trouve && i < maLegion.length)
	{	
		var monGroupeLengthOld = monGroupe.length;
		$.each(monGroupe, function(j, soldat){
			var VoisinsDeMonSoldat = getVoisins(soldat);
			ATester = $(VoisinsDeMonSoldat).not(DejaTeste).get();
			$.each(ATester, function(k, soldat2){
				var tmp = $canvas.getLayer('s'+soldat2.u+','+soldat2.w);
				if( tmp != null)
				{
					if(tmp.groups[0] == soldat.groups[0])
					{
						if (monGroupe.indexOf(tmp) == -1) {
													monGroupe.push(tmp);
												}
					}
				}
				DejaTeste.push(soldat2);
			});
		});
		if(monGroupe.length == monGroupeLengthOld){
			trouve = false;
		}
		i++;
	}
	return monGroupe;
} // End function getMonGroupe


// *******************************
// Fonction qui retourne les coordonnées uw avec des pixels x et y
function getUWfromPixel(dropX, dropY, radius){
	var res = {u:'', w:''};
	var uw, u, w;
	for(var i in plateau) {
		uw = i.split(",");
		u = parseInt(uw[0]);
		w = parseInt(uw[1]);
		
		xy = plateau[i].split(",");
		x = parseInt(xy[0]);
		y = parseInt(xy[1]);
		
		if((dropX <= x+radius) && (dropX >= x-radius) && (dropY <= y+radius) && (dropY >= y-radius)) res = {u:u, w:w, x:x, y:y};
	}
	return res;
} // End function getUWfromPixel


// *******************************
// Fonction pour restart la game
function restartGame() {
	destroyChatBox("chatbox_all");
	destroyChatBox("chatbox_team");
	sendData('{"type":"restartGame","clientId":"'+window.clientId+'"}');
	closeBoxinfo();
} // End function restartGame

// *******************************
// Fonction pour pas restart la game
function doNotRestartGame() {
	initStartPage();
	destroyChatBox("chatbox_all");
	destroyChatBox("chatbox_team");
	closeBoxinfo();
} // End function doNotRestartGame


// *******************************
// Fonction pour désactiver et réactiver les sons dans la partie
function disableGameSounds() {
	sound_game = !sound_game;
	var newtxt = (sound_game ? "Désactiver les sons" : "Réactiver les sons");
	$("#disable_sound").html(newtxt);
} // End function disableGameSounds






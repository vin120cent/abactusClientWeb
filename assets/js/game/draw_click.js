
// *******************************
// Fonction dessin d'un rectangle
function drawArectangle(x, y, u, w, radius, cell) {
	
	// Si armure on met une bordure plus épaisse
	var sw = 0;
	if(cell.isArmored) sw = 3;
	// On dessine le soldat
	$canvas.addLayer({
		type: 'rectangle',
                groups: [cell.legionId],
		bringToFront: true,
		fillStyle: tabCouleurs[cell.legionId],
		strokeWidth : sw,
		strokeStyle: '#000',
		x: x, y: y,
		radius : radius/100*95,
		width: radius/100*95, height: radius/100*95,
		name: 's'+u+','+w,
		layer : true,
		click : function(layer){
			if(!spectateur && moi.playerLegionId.indexOf(cell.legionId) != -1) clickAsolder(layer);
		},
		touchend : function(layer){
			if(!spectateur && moi.playerLegionId.indexOf(cell.legionId) != -1) clickAsolder(layer);
		},
	}).addLayerToGroup('s'+u+','+w, 'plateau');
}


// *******************************
// Fonction de dessin d'un rond
function drawAcircle(x, y, u, w, radius, cell) {
	
	// Si armure on met une bordure plus épaisse
	var sw = 0;
	if(cell.isArmored) sw = 3;
	// On dessine le soldat
	$canvas.addLayer({
		type: 'arc',
		groups: [cell.legionId],
		bringToFront: true,
		fillStyle: tabCouleurs[cell.legionId],
		strokeWidth : sw,
		strokeStyle: '#000',
		x: x, y: y,
		radius: radius/100*60,
		name: 's'+u+','+w,
		layer : true,
		click : function(layer){
			if(!spectateur && moi.playerLegionId.indexOf(cell.legionId) != -1) clickAsolder(layer);
		},
		touchend : function(layer){
			if(!spectateur && moi.playerLegionId.indexOf(cell.legionId) != -1) clickAsolder(layer);
		},
	}).addLayerToGroup('s'+u+','+w, 'plateau');
}


// *******************************
// Fonction de dessin d'un triangle
function drawAtriangle(x, y, u, w, radius, cell) {
	
	// Si armure on met une bordure plus épaisse
	var sw = 0;
	if(cell.isArmored) sw = 3;
	// On dessine le soldat
	$canvas.addLayer({
		type: 'polygon',
                groups: [cell.legionId],
		bringToFront: true,
		fillStyle: tabCouleurs[cell.legionId],
		strokeWidth : sw,
		strokeStyle: '#000',
		x: x, y: y,
		sides: 3,
		radius: radius/100*70,
		name: 's'+u+','+w,
		layer : true,
		click : function(layer){
			if(!spectateur && moi.playerLegionId.indexOf(cell.legionId) != -1) clickAsolder(layer);
		},
		touchend : function(layer){
			if(!spectateur && moi.playerLegionId.indexOf(cell.legionId) != -1) clickAsolder(layer);
		},
	}).addLayerToGroup('s'+u+','+w, 'plateau');
}


// *******************************
// Fonction de dessin du laurier
function drawLaurel(x, y, u, w, radius) {
	
	$canvas.addLayer({
		type: 'image',
		source: window.siteUrl+'assets/img/game/laurel.png',
		x: x, y: y,
		width: radius, height:radius,
		radius : radius,
		layer : true,
		name : 'l'+u+','+w
	}).addLayerToGroup('l'+u+','+w, 'plateau');
	
	// On regarde si autour du laurier il y a une des nos légion, si oui, on peut le déplacer
	var drag = false;
	var uw = getUWfromPixel(x, y, radius);
	var layer = $canvas.getLayer('l'+u+','+w);
	var voisins = getVoisins(layer);
	var voisin, cell;
	var cellNearLaurel = [];
	if(!spectateur)	moi.laurelLegion = [];
	
	for(var v in voisins){
		voisin = voisins[v];
		cell = UWtoCell[''+voisin.u+','+voisin.w+''];
		if(cell == undefined) cell = UWtoCell[''+voisin.u+','+voisin.w+''];
		if(cell != null && cell.soldier == true) {
			if(!spectateur && moi.playerLegionId.indexOf(cell.legionId) != -1){
				drag = true;
				if(moi.laurelLegion.indexOf(cell.legionId) == -1) moi.laurelLegion.push(cell.legionId);
				cellNearLaurel.push(cell);
			}
		}
	}
	
	if(!spectateur && moi.laurelLegion.length > 1){
		moi.selectedLegion = -1;
		for(var c in cellNearLaurel){
			cell = cellNearLaurel[c];
			$canvas.setLayer('s'+cell.uw, {
				dblclick: function(layeur) {
					$canvas.setLayerGroup('case', {
						strokeStyle: '#000',
						strokeWidth: 1,
						click:function(layer){},
						touchend:function(layer){},
					}).drawLayers();
					moi.selectedLegion = layeur.groups[0];
					$canvas.setLayer(u+','+w, {strokeWidth:3, strokeStyle:layeur.fillStyle}).drawLayer(u+','+w);
					$canvas.triggerLayerEvent('l'+u+','+w, 'click');
				},
				touchend:function(layeur) {
					$canvas.setLayerGroup('case', {
						strokeStyle: '#000',
						strokeWidth: 1,
						click:function(layer){},
						touchend:function(layer){},
					}).drawLayers();
					moi.selectedLegion = layeur.groups[0];
					$canvas.setLayer(u+','+w, {strokeWidth:3, strokeStyle:layeur.fillStyle}).drawLayer(u+','+w);
					clickAsolder(layeur);
				}
			});
		}
	}
	
	if(!spectateur) {
		$canvas.setLayer('l'+u+','+w, {
			click:function(layer){
				clickTheLaurel(layer);
			},
			touchend:function(layer){
				clickTheLaurel(layer);
			},
		});
	}
}


// *******************************
// Fonction appelé lors du click sur un soldat pour afficher les possibilités de déplacement
function clickAsolder(layer){
	
	$canvas.setLayerGroup('case', {
		strokeStyle: '#000',
		strokeWidth: 1,
		click:function(layer){},
		touchend:function(layer){},
	}).drawLayers();

	var voisins = getCasesLibresPourGroupe(layer);
	var nom;
	for(var v in voisins){
		nom = voisins[v].u+','+voisins[v].w;
		$canvas.setLayer(nom, {
			strokeStyle: layer.fillStyle,
			strokeWidth: 2.5,
			click:function(layer){second_clickAsolder(layer)},
			touchend:function(layer){second_clickAsolder(layer)},
		}).drawLayer(nom);
	}
	
	latest_click = layer.name;
}


// *******************************
// Fonction appelé lors de la validation du déplacement
function second_clickAsolder(layer){
	
	// On récupère le layer d'origine
	var layerOrigine = $canvas.getLayer(latest_click);
	var radius = layerOrigine.radius;
	var isValid = false;
	// Les coordonées du drop du soldat
	var dropX = layer.x;
	var dropY = layer.y;
	var uw = getUWfromPixel(layer.x, layer.y, radius);
	var voisins = getCasesLibresPourGroupe(layerOrigine);
	
	
	// Si la case du drop est bien une des cases valide
	for(var v in voisins){
		if((voisins[v].u == uw.u) && (voisins[v].w == uw.w)) isValid = true;
	}
	
	// Si coup pas valide, on remet le soldat sur la case d'origine
	if(isValid == false) {
		// On remet toute les cases normales
		$canvas.setLayerGroup('case', {
			strokeStyle: '#000',
			strokeWidth: 1,
			click:function(layer){},
			touchend:function(layer){},
		}).drawLayers();
	}
	else{
		// Si le coup est valide
		// On déplace le soldat
		$canvas.animateLayer(layerOrigine.name, {
			x:uw.x,
			y:uw.y,
		}, 750);
		if($canvas.getLayer('a'+uw.u+','+uw.w) != undefined) {
                        $canvas.animateLayer(layerOrigine.name, {strokeWidth : 3,strokeStyle: '#000',}, 500, function(l){$canvas.removeLayer('a'+uw.u+','+uw.w)});
                }
		
		// On bloque le click, on ajoute les boutons reset, validé
		$canvas.removeLayerFromGroup(layer.name, 'case');
		// On remet toute les cases normales
		$canvas.setLayerGroup('case', {
			strokeStyle: '#000',
			strokeWidth: 1,
			click:function(layer){},
			touchend:function(layer){}
		}).drawLayers();
		$canvas.setLayerGroup(layerOrigine.groups[0], {
			click:function(layeur){},
			touchend:function(layeur){}
		});
		if(!spectateur && moi.laurelLegion.indexOf(layer.groups[0]) != -1) moi.laurelLegion.splice(moi.laurelLegion.indexOf(layer.groups[0]), 1);
		$("#gameControls").prepend("<button class='btnResetCoup' style='background:"+tabCouleurs[layerOrigine.groups[0]]+"' value='"+layerOrigine.groups[0]+"' onclick=\"resetMySolder('"+layerOrigine.name+"', '"+layerOrigine.x+"', '"+layerOrigine.y+"');\">Annuler le coup</button>");
		
		// On définie les variables qu'on va envoyé au server
		window.moncoup[layerOrigine.groups[0]] = {
			'type':'clientMovement',
			'clientId':""+window.clientId+"",
			'gameId':""+game.gameId+"",
			'legionId':""+layerOrigine.groups[0]+"",
			'mvtType':'soldierMovement',
			'uwDep':layerOrigine.name.substring(1),
			'uwArr':""+uw.u+','+uw.w+""
		};
	}
	$canvas.drawLayers();
}


// *******************************
// Fonction appelé pour afficher les possibilités de déplacement pour le laurier
function clickTheLaurel(layer){
	
	$canvas.setLayerGroup('case', {
		strokeStyle: '#000',
		strokeWidth: 1,
		click:function(layer){},
		touchend:function(layer){},
	}).drawLayers();
	
	if(!spectateur && moi.laurelLegion.length > 1 && moi.selectedLegion == -1) {
		alert("Plusieurs de vos légions sont autour du laurier, veuillez en sélectionner une");
		return false;
	}
	if(!spectateur && moi.selectedLegion == -1) {
		alert("Plusieurs de vos légions sont autour du laurier, veuillez en sélectionner une");
		return false;
	}
	if(moi.laurelLegion.length == 0) {
		$canvas.setLayer(layer.name, {click:function(layeur){}, touchend:function(layeur){}}).drawLayer(layer.name);
		//$canvas.setLayer(layer.name.substring(1), {strokeStyle: '#000', strokeWidth: 1.2,}).drawLayer(layer.name.substring(1));
		return false;
	}
	//else $canvas.setLayer(layer.name, {draggable:true}).drawLayer(layername);
	
	
	var legionId;
	if(moi.laurelLegion.length == 1) legionId = moi.laurelLegion[0];
	else legionId = moi.selectedLegion;
	var voisins = getVoisins(layer);
	var cell, nom;
	for(var v in voisins){
		nom = voisins[v].u+','+voisins[v].w;
		cell = UWtoCell[nom];
		if(cell != null && (cell.soldier == false && cell.armor == false)){
			$canvas.setLayer(nom, {
				strokeWidth: 2.5,
				strokeStyle : tabCouleurs[legionId],
				click:function(layer){second_clickTheLaurel(layer)},
				touchend:function(layer){second_clickTheLaurel(layer)},
			}).drawLayer(nom);
		}
		
	}
	
	latest_click = layer.name;
	
}


// *******************************
// Fonction appelé pour valider le déplacement du laurier 
function second_clickTheLaurel(layer){
	// On remet toute les cases normales
	$canvas.setLayerGroup('case', {
		strokeStyle: '#000',
		strokeWidth: 1
	}).drawLayers();
	
	
	// On récupère le layer d'origine
	var layerOrigine = $canvas.getLayer(latest_click);
	var radius = layer.radius;
	var isValid = false;
	// Les coordonées du drop du soldat
	var uw = getUWfromPixel(layer.x, layer.y, layerOrigine.radius);
	var voisins = getVoisins(layerOrigine);
	var cell;
	
	// Si on lache sur la même case
	if(layer.name.substr(1,layer.name.length) == uw.u+','+uw.w) return true;
	
	// Si la case du drop est bien une des cases valide
	for(var v in voisins){
		cell = UWtoCell[voisins[v].u+','+voisins[v].w];
		if(cell != null && (cell.soldier == false && cell.armor == false)){
			if((voisins[v].u == uw.u) && (voisins[v].w == uw.w)) isValid = true;
		}
		
	}
	
	if(moi.laurelLegion.length == 0) isValid = false;
	if(moi.selectedLegion == -1) isValid = false;
	if(window.moncoup[moi.selectedLegion] != null) isValid = false;
	
	// Si coup pas valide, on remet le soldat sur la case d'origine
	if(isValid == false) {
		// On remet toute les cases normales
		$canvas.setLayerGroup('case', {
			strokeStyle: '#000',
			strokeWidth: 1,
			click:function(layer){},
			touchend:function(layer){},
		}).drawLayers();
	}
	else{
		// Si le coup est valide
		// On déplace le soldat
		$canvas.animateLayer(layerOrigine.name, {
			x:layer.x,
			y:layer.y,
		}, 750);
		
		var legionId;
		if(moi.laurelLegion.length == 1) legionId = moi.laurelLegion[0];
		else legionId = moi.selectedLegion;
		
		// On bloque le click, on ajoute les boutons reset, validé
		$canvas.setLayer(uw.u+','+uw.w, {strokeWidth: 3, strokeStyle : tabCouleurs[legionId]});
		$canvas.setLayer(layer.name, {
			click:function(layeur){},
			touchend:function(layeur){}
		});
		$canvas.setLayerGroup(legionId, {
			click:function(layeur){},
			touchend:function(layeur){}
		});
		$("#gameControls").prepend("<button class='btnResetCoup' value='laurel' style='background-color:"+tabCouleurs[legionId]+"' onclick=\"resetMySolder('"+layerOrigine.name+"', '"+layerOrigine.x+"', '"+layerOrigine.y+"');\">Annuler le déplacement du laurier</button>");
		
		// On définie les variables qu'on va envoyé au server
		window.moncoup["laurel"] = {
			'type':'clientMovement',
			'clientId':""+window.clientId+"",
			'gameId':""+game.gameId+"",
			'legionId':""+legionId+"",
			'mvtType':'laurelMovement',
			'uwDep':layerOrigine.name.substring(1),
			'uwArr':""+uw.u+','+uw.w+""
		};
	}
	$canvas.drawLayers();
}


// *******************************
// Fonction appelée pour reset son coup
function resetMySolder(layername, x, y){
	
	var layer = $canvas.getLayer(layername);
	// On remet le soldat
	$canvas.animateLayer(layername,{
		x : parseFloat(x),
		y : parseFloat(y),
	});
	
	// On remet les cases normales
	var uw = getUWfromPixel(layer.x, layer.y, layer.radius);
	$canvas.addLayerToGroup(uw.u+","+uw.w, 'case');
	$canvas.setLayerGroup('case', {
		strokeStyle: '#000',
		strokeWidth: 1
	});
	
	// On remet le click
	if(layername.substr(0,1) == 'l') {
		var uw = layer.name.substring(1).split(',');
		$canvas.removeLayer(layer.name);
		drawLaurel(x, y, uw[0], uw[1], layer.radius);
		$canvas.drawLayer("l"+uw[0]+","+uw[1]);
		$(".btnResetCoup[value='laurel']").remove();
		$canvas.setLayerGroup(window.moncoup["laurel"].legionId, {
			click:function(layer){clickAsolder(layer)},
			touchend:function(layer){clickAsolder(layer)}
		});
		window.moncoup["laurel"] = null;
	}
	else{
		$canvas.setLayerGroup(layer.groups[0], {
			click:function(layer){clickAsolder(layer)},
			touchend:function(layer){clickAsolder(layer)}
		});
		$(".btnResetCoup[value='"+layer.groups[0]+"']").remove();
		window.moncoup[layer.groups[0]] = null;
		
		
		// Et on reset aussi le laurier
		var laurier = $canvas.getLayers(function(layer){return layer.name.substr(0,1) === "l"});
		laurier = laurier[0];
		var xl = laurier.x;
		var yl = laurier.y;
		var lradius = laurier.radius;
		var uw = laurier.name.substring(1).split(',');
		$canvas.removeLayer(laurier.name);
		drawLaurel(xl, yl, uw[0], uw[1], lradius);
		$canvas.drawLayer("l"+uw[0]+","+uw[1]);
	}
	
	$canvas.drawLayers();
	
	return false;
}

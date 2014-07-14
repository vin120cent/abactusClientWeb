// *******************************
// Fonction dessin d' un rectangle
function drawArectangle(x, y, u, w, radius, cell) {
	
	// Si armure on met une bordure plus épaisse
	var sw = 0;
	if(cell.isArmored) sw = 3;
	// Si c'est un soldat d'une de mes légion, on peut le déplacer
	var drag = false;
	if(!spectateur && moi.playerLegionId.indexOf(cell.legionId) != -1) drag = true;
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
		dragstart : function(){startDrag('s'+u+','+w);},
                dragstop: function(layer){dropAsolder(layer);},
		draggable : drag,
	}).addLayerToGroup('s'+u+','+w, 'plateau');
}


// *******************************
// Fonction de dessin d'un rond
function drawAcircle(x, y, u, w, radius, cell) {
	
	// Si armure on met une bordure plus épaisse
	var sw = 0;
	if(cell.isArmored) sw = 3;
	// Si c'est un soldat d'une de mes légion, on peut le déplacer
	var drag = false;
	if(!spectateur && moi.playerLegionId.indexOf(cell.legionId) != -1) drag = true;
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
		dragstart : function(){startDrag('s'+u+','+w);},
                dragstop: function(layer){dropAsolder(layer);},
		draggable : drag,
	}).addLayerToGroup('s'+u+','+w, 'plateau');
}


// *******************************
// Fonction de dessin d'un triangle
function drawAtriangle(x, y, u, w, radius, cell) {
	
	// Si armure on met une bordure plus épaisse
	var sw = 0;
	if(cell.isArmored) sw = 3;
	// Si c'est un soldat d'une de mes légion, on peut le déplacer
	var drag = false;
	if(!spectateur && moi.playerLegionId.indexOf(cell.legionId) != -1) drag = true;
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
		dragstart : function(){startDrag('s'+u+','+w);},
                dragstop: function(layer){dropAsolder(layer);},
		draggable : drag,
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
				click: function(layeur) {
					moi.selectedLegion = layeur.groups[0];
					$canvas.setLayer(u+','+w, {strokeWidth:3, strokeStyle:layeur.fillStyle}).drawLayer(u+','+w);
					$canvas.setLayer('l'+u+','+w, {draggable:true}).drawLayer('l'+u+','+w);
				}
			});
		}
	}
	
	if(!spectateur) {
		$canvas.setLayer('l'+u+','+w, {
			dragstart : function(){startDragLaurel('l'+u+','+w);},
			dragstop: function(layer){dropTheLaurel(layer);},
			draggable : drag,
		});
	}
}


// *******************************
// Fonction appelée au drag pour mettre en évidence les cases où l'on peut déplacé le soldat 
function startDrag(name) {
	var layer = $canvas.getLayer(name);
	var voisins = getCasesLibresPourGroupe(layer);
	var nom;
	for(var v in voisins){
		nom = voisins[v].u+','+voisins[v].w;
		$canvas.setLayer(nom, {
			strokeStyle: layer.fillStyle,
			strokeWidth: 2.5
		}).drawLayer(nom);
	}
}


// *******************************
// Fonction appelée au drop d'un soldat
// Vérification si la case est valide, ajout des boutons, et préparation du json d'envois du coup
function dropAsolder(layer){
	
	// On remet toute les cases normales
	$canvas.setLayerGroup('case', {
		strokeStyle: '#000',
		strokeWidth: 1
	}).drawLayers();
	
	// On récupère le layer d'origine
	var layerOrigine = $canvas.getLayer(layer.name.substr(1,layer.name.length));
	var radius = layer.radius;
	var isValid = false;
	// Les coordonées du drop du soldat
	var dropX = layer.x;
	var dropY = layer.y;
	var uw = getUWfromPixel(dropX, dropY, radius);
	var voisins = getCasesLibresPourGroupe(layer);
	
	// Si on lache sur la même case
	if(layer.name.substr(1,layer.name.length) == uw.u+','+uw.w) return true;
	
	// Si la case du drop est bien une des cases valide
	for(var v in voisins){
		if((voisins[v].u == uw.u) && (voisins[v].w == uw.w)) isValid = true;
	}
	
	// Si coup pas valide, on remet le soldat sur la case d'origine
	if(isValid == false) {
		//alert("Votre coup n'est pas valide.");
		$canvas.animateLayer(layer.name, {
			x:layerOrigine.x,
			y:layerOrigine.y
		});
	}
	else{
		// Si le coup est valide
		// On centre le soldat sur la case du drop
		$canvas.setLayer(layer.name, {
			x:uw.x,
			y:uw.y
		});
		// Si ya un bouclier on lance l'animation pour lui mettre
		if ($canvas.getLayer('a'+uw.u+','+uw.w) != undefined) {
                        $canvas.animateLayer(layer.name, {strokeWidth : 3,strokeStyle: '#000',}, 500, function(l){$canvas.removeLayer('a'+uw.u+','+uw.w)});
                }
		
		// On bloque le drag&drop, on ajoute les boutons reset, validé
		$canvas.setLayer(uw.u+','+uw.w, {strokeWidth: 3, strokeStyle: layer.fillStyle,});
                $canvas.removeLayerFromGroup(uw.u+','+uw.w, 'case');
		$canvas.setLayerGroup(layer.groups[0], {draggable:false});
                if(!spectateur && moi.laurelLegion.indexOf(layer.groups[0]) != -1) moi.laurelLegion.splice(moi.laurelLegion.indexOf(layer.groups[0]), 1);
		$("#gameControls").prepend("<button class='btnResetCoup' style='background:"+tabCouleurs[layer.groups[0]]+"' value='"+layer.groups[0]+"' onclick=\"resetMySolder('"+layer.name+"', '"+layerOrigine.x+"', '"+layerOrigine.y+"');\">Annuler le coup</button>");
		
		// On définie les variables qu'on va envoyé au server
		window.moncoup[layer.groups[0]] = {
			'type':'clientMovement',
			'clientId':""+window.clientId+"",
			'gameId':""+game.gameId+"",
			'legionId':""+layer.groups[0]+"",
			'mvtType':'soldierMovement',
			'uwDep':layerOrigine.name,
			'uwArr':""+uw.u+','+uw.w+""
		};
	}
	$canvas.drawLayers();
}


// *******************************
// Fonction appelée quand le laurier est déplacer
function startDragLaurel(layername){
	
	if(moi.laurelLegion.length > 1 && moi.selectedLegion == -1) {
		alert("Plusieurs de vos légions sont autour du laurier, veuillez en sélectionner une");
		$canvas.setLayer(layername, {draggable:false}).drawLayer(layername);
		return false;
	}
	else $canvas.setLayer(layername, {draggable:true}).drawLayer(layername);
	if(moi.laurelLegion.length == 0) {
		$canvas.setLayer(layername, {draggable:false}).drawLayer(layername);
		$canvas.setLayer(layername.substring(1), {strokeStyle: '#000', strokeWidth: 1.2,}).drawLayer(layername.substring(1));
		return false;
	}
	else $canvas.setLayer(layername, {draggable:true}).drawLayer(layername);
	var legionId;
	if(moi.laurelLegion.length == 1) legionId = moi.laurelLegion[0];
	else legionId = moi.selectedLegion;
	var layer = $canvas.getLayer(layername);
	var voisins = getVoisins(layer);
	var cell, nom;
	for(var v in voisins){
		nom = voisins[v].u+','+voisins[v].w;
		cell = UWtoCell[nom];
		if(cell != null && (cell.soldier == false && cell.armor == false)){
			$canvas.setLayer(nom, {
				strokeWidth: 2.5,
				strokeStyle : tabCouleurs[legionId]
			}).drawLayer(nom);
		}
		
	}
}


// *******************************
// Fonction appelée quand le laurier est dropé
function dropTheLaurel(layer){
	
	// On remet toute les cases normales
	$canvas.setLayerGroup('case', {
		strokeStyle: '#000',
		strokeWidth: 1
	}).drawLayers();
	
	// On récupère le layer d'origine
	var layerOrigine = $canvas.getLayer(layer.name.substr(1,layer.name.length));
	var radius = layer.radius;
	var isValid = false;
	// Les coordonées du drop du soldat
	var dropX = layer.x;
	var dropY = layer.y;
	var uw = getUWfromPixel(dropX, dropY, radius);
	var voisins = getVoisins(layer);
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
		alert("Votre coup n'est pas valide.");
		$canvas.animateLayer(layer.name, {
			x:layerOrigine.x,
			y:layerOrigine.y
		});
	}
	else{
		// Si le coup est valide
		// On centre le soldat sur la case du drop
		$canvas.setLayer(layer.name, {
			x:uw.x,
			y:uw.y
		});
		
		var legionId;
		if(moi.laurelLegion.length == 1) legionId = moi.laurelLegion[0];
		else legionId = moi.selectedLegion;
		
		// On bloque le drag&drop, on ajoute les boutons reset, validé
		$canvas.setLayer(uw.u+','+uw.w, {strokeWidth: 3, strokeStyle : tabCouleurs[legionId]});
		$canvas.setLayer(layer.name, {draggable:false});
                $canvas.setLayerGroup(legionId, {draggable:false});
		$("#gameControls").prepend("<button class='btnResetCoup' value='laurel' style='background-color:"+tabCouleurs[legionId]+"' onclick=\"resetMySolder('"+layer.name+"', '"+layerOrigine.x+"', '"+layerOrigine.y+"');\">Annuler le déplacement du laurier</button>");
		
		// On définie les variables qu'on va envoyé au server
		window.moncoup["laurel"] = {
			'type':'clientMovement',
			'clientId':""+window.clientId+"",
			'gameId':""+game.gameId+"",
			'legionId':""+legionId+"",
			'mvtType':'laurelMovement',
			'uwDep':layerOrigine.name,
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
	// On remet le drag&drop
	if(layername.substr(0,1) == 'l') {
		var uw = layer.name.substring(1).split(',');
		$canvas.removeLayer(layer.name);
		drawLaurel(x, y, uw[0], uw[1], layer.radius);
		$canvas.drawLayer("l"+uw[0]+","+uw[1]);
		$(".btnResetCoup[value='laurel']").remove();
		$canvas.setLayerGroup(window.moncoup["laurel"].legionId, {draggable:true});
		window.moncoup["laurel"] = null;
	}
	else{
		$canvas.setLayerGroup(layer.groups[0], {draggable:true});
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


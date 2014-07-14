$(document).ready(function()
{
	parallax.add("home",$("#home"))
			.add("presentation",$("#presentation"))
			.add("rules",$("#rules"));
	
	parallax.background = $("body");
	parallax.scaling = 0.1; //background moves 10% with the pages

	var current_hash = window.location.hash;
	
	switch(current_hash)
	{
		case "#home": goToHome(); break;
		case "#presentation": goToPresentation(); break;
		case "#rules": goToRules(); break;
		default: goToHome();
	}
	
	$(window).on('hashchange', function(e) {
		window.scrollTo(0,0);
		switch(window.location.hash)
		{
			case "#home": if(parallax.current != parallax.home) { goToHome(); } break;
			case "#presentation": if(parallax.current != parallax.presentation) { goToPresentation(); } break;
			case "#rules": if(parallax.current != parallax.rules) { goToRules(); } break;
		}
	});
});

function goToPresentation(){
	if(parallax.current == parallax.rules){ 
		parallax.presentation.left();
	} else {
		parallax.presentation.right();
	}
	$("#accueil").removeClass("active");
	$("#infos").addClass("active");
	$("#regles").removeClass("active");
}

function goToRules(){
	parallax.rules.right();
	$("#accueil").removeClass("active");
	$("#infos").removeClass("active");
	$("#regles").addClass("active");
}

function goToHome(){
	parallax.home.left();
	$("#accueil").addClass("active");
	$("#infos").removeClass("active");
	$("#regles").removeClass("active");
}

$(document).keydown(function(e){
	if (e.keyCode == 37) { //this is the left key,
		if(parallax.current == parallax.home){ 
			//Do nothing
		} else if (parallax.current == parallax.presentation){
			goToHome();
		} else if(parallax.current == parallax.rules){
			goToPresentation();
		}
	}
});

$(document).keydown(function(e){
	if (e.keyCode == 39) { //this is the right key,
		if(parallax.current == parallax.home){ 
			goToPresentation();
		} else if (parallax.current == parallax.presentation){
			goToRules();
		} else if(parallax.current == parallax.rules){
			//Do nothing
		}
	}
});

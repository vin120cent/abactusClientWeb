function openBoxinfo(tplname, data, clicktoclose)
{
	$(document).off("click", "#boxinfo");
	$(document).off("click", "#boxinfo .cadre");
	$(document).on("click", "#boxinfo", function(e) {
		if(getBoxinfoStatus)
		{
			if(clicktoclose)	closeBoxinfo();
		}
	});	
	$(document).on("click", "#boxinfo .cadre", function(e) {
		e.stopPropagation();
	});
	
	$('.pagecover').css('display', 'block');  
	$('.pagecover').css('opacity', '0');  
	$.ajax({url:window.siteUrl+"views/game/"+tplname+".html", cache:false, async:false, success: function(tpl){$("#boxinfo").html(tplawesome(tpl, data));}});
	$('#boxinfo').css('display', 'block');
	sto = setTimeout("displayBoxinfo()", 100);
}

function displayBoxinfo()
{
	$('#boxinfo').css('opacity', '1.0');
	$('.pagecover').css('opacity', '0.4');
	$('#boxinfo .cadre').css('marginTop', '100px');
}	

function closeBoxinfo()
{
	$('#boxinfo').html("");
	$('.pagecover').css('opacity', '0');
 	$('#boxinfo').css('opacity', '0.1');
 	$('#boxinfo').css('display', 'none');
	stout = setTimeout("$('.pagecover').css('display', 'none')", 1000);

}

function getBoxinfoStatus()
{
	return 	($('#boxinfo').html() == "");
}

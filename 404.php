<?php
	require_once("globals/config.php");
	require_once("globals/helpers.php");
	$home = false;
	$header_params = array();
	$header_params['title'] = "Page non trouvée";
	include_once("views/header.php");
?>
	<p>404 - Page non trouvée</p>
<?php 
	include_once("views/footer.php");
?>

<?php
// error handling
//ini_set('display_errors',1); // display errors on the page
ini_set('log_errors',1);
ini_set('error_log', dirname(__FILE__).'/log.txt');
error_reporting(E_ALL); // match everything
	
session_start();
require_once("globals/config.php");
require_once("globals/helpers.php");

$home = false;
$notFound = false;

if (isset($_GET['section']) && isset($_GET['action']))
{
	ob_start();
	$controller_file = dirname(__FILE__).'/controllers/controller'.ucfirst(strtolower($_GET['section'])).'.php';
	if (is_file($controller_file))
	{
		include $controller_file;
		$controller_name = 'Controller_'.ucfirst($_GET['section']);
		if (class_exists($controller_name))
		{
			$c = new $controller_name;
			$action = strtolower($_GET['action']);
			if (method_exists($c, $action)) $c->$action();
			else $notFound = true;
		}
		else $notFound = true;
	}
	else $notFound = true;
	$content = ob_get_clean();
}
else 
{	
	$home = true;
	ob_start();
	include "views/home.php";
	$content = ob_get_clean();
}

if($notFound) {
	header("HTTP/1.0 404 Not Found");
	include "404.php";
	exit();
}

include_once("views/header.php");
if(isset($content)) echo $content;
include_once("views/footer.php");
?>

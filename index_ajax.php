<?php
session_start();
require_once("globals/config.php");
require_once("globals/helpers.php");

ob_start();

$notfound = false;

if (isset($_GET['section']) && !empty($_GET['section']))
{
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
			else $notfound = true;
		}
		else $notfound = true;
	}
	else $notfound = true;
}
else $notfound = true;

$content = ob_get_clean();

if(!$notfound) echo $content;

?>

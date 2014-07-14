<?php

require_once 'controllers/controller.php';
require_once 'models/friendManager.php';

class Controller_Game extends Controller {

	function __construct(){
		parent::__construct();
		$this->_fm = new FriendManager($this->_db);
	}
	
	function game(){
		if(isset($_SESSION['logged_user'])) {
			$friends_obj = $this->_fm->getFriends($_SESSION["logged_user"]["id"]);
			$friends = '';
			foreach($friends_obj as $f) {
				$friends .= '"'.strtolower($f->getPseudo()).'",';
			}
			$friends = rtrim($friends, ",");
			include_once("views/game/game.php");
		}
		else
		{
			$_SESSION["error"] = "Vous n'êtes pas connecté ou votre session a expirée.";
			header("Location:".SITE_URL."user/connexion/");
			exit();
		}
	}
	function demo(){
		if(!isset($_SESSION['logged_user']))
			echo 'DEMO';
		else
		{
			header("Location:".SITE_URL);
			exit();
		}
	}
}
?>

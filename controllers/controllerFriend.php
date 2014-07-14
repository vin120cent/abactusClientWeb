<?php

require_once 'controllers/controller.php';
require_once 'models/friendManager.php';

class Controller_Friend extends Controller {

	protected $_fm;

	function __construct(){
		parent::__construct();
		$this->_fm = new FriendManager($this->_db);
	}
	
	function listing(){
		if(isset($_SESSION["logged_user"])) {
			$friends = $this->_fm->getFriends($_SESSION["logged_user"]["id"]);
			$request = $this->_fm->getFriendRequests($_SESSION["logged_user"]["id"]);
			include_once("views/user/mesamis.php");
		}
		else {
			$_SESSION["error"] = "Vous n'êtes pas connecté ou votre session a expirée.";
			header("Location:".SITE_URL."user/connexion/");
			exit();
		}
	}
	
	function add(){
		if(isset($_SESSION["logged_user"])) {
			if(!$this->_fm->exists($_SESSION["logged_user"]["id"], $_GET["friend"])){
				$this->_fm->addFriendRequest($_SESSION["logged_user"]["id"], $_GET["friend"]);
				$_SESSION["info"] = "Votre demande a bien été envoyée.";
				header("Location:".SITE_URL."friend/listing/");
				exit();
			}
			else{
				$_SESSION["error"] = "Vous êtes déjà amis avec cette personne.";
				header("Location:".SITE_URL."friend/listing/");
				exit();
			}
		}
		else {
			$_SESSION["error"] = "Vous n'êtes pas connecté ou votre session a expirée.";
			header("Location:".SITE_URL."user/connexion/");
			exit();
		}
	}
	
	function accept(){
		if(isset($_SESSION["logged_user"])) {
			$this->_fm->acceptFriendRequest($_GET["friend"], $_SESSION["logged_user"]["id"]);
			$_SESSION["info"] = "La demande a bien été envoyée.";
			header("Location:".SITE_URL."friend/listing/");
			exit();
		}
		else {
			$_SESSION["error"] = "Vous n'êtes pas connecté ou votre session a expirée.";
			header("Location:".SITE_URL."user/connexion/");
			exit();
		}
	}
	
	function delete(){
		if(isset($_SESSION["logged_user"])) {
			$this->_fm->deleteFriendRequest($_SESSION["logged_user"]["id"], $_GET["user"]);
			$_SESSION["info"] = "Vous avez retirer cette personne de vos amis.";
			header("Location:".SITE_URL."friend/listing/");
			exit();
		}
		else {
			$_SESSION["error"] = "Vous n'êtes pas connecté ou votre session a expirée.";
			header("Location:".SITE_URL."user/connexion/");
			exit();
		}
	}
}
?>

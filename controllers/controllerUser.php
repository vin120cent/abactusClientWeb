<?php

require_once 'controllers/controller.php';
require_once 'models/userManager.php';
require_once 'models/friendManager.php';
require_once 'models/gameHistoryManager.php';

class Controller_User extends Controller {

	protected $_um;
	protected $_fm;

	function __construct(){
		parent::__construct();
		$this->_um = new UserManager($this->_db);
		$this->_fm = new FriendManager($this->_db);
		$this->_ghm = new GameHistoryManager($this->_db);		
	}

	// Process the connection form
	function connexion(){
		if(isset($_POST["pseudo"]) && isset($_POST["password"])){
			extract($_POST);
			if(!empty($pseudo) && !empty($password)) {
				if(strtolower($pseudo) != "robot" && $this->_um->existsWithPseudo($pseudo)){
					$user = $this->_um->getUserWithPseudo($pseudo);
					if($user->getPassword() == sha1($password)){
						$_SESSION["logged_user"]["id"] = $user->getId();
						$_SESSION["logged_user"]["pseudo"] = $user->getPseudo();
						$_SESSION["logged_user"]["email"] = $user->getEmail();
						$_SESSION["logged_user"]["password"] = $user->getPassword();
						$_SESSION["logged_user"]["image"] = $user->getImage();
						$_SESSION["logged_user"]["create_timestamp"] = $user->getCreateTimestamp();
						$_SESSION["logged_user"]["update_timestamp"] = $user->getUpdateTimestamp();
						$_SESSION["logged_user"]["help"] = $user->getHelp();
						$_SESSION["logged_user"]["token"] = sha1($user->getPseudo().SALT_PSEUDO_TOKEN.$user->getId());
						header("Location:".SITE_URL);
						exit();
					}
					else{
						$_SESSION["error"] = "Les informations renseignées ne sont pas valides";
						header("Location:".SITE_URL."user/connexion/");
						exit();
					}
				}
				else{
					$_SESSION["error"] = "Les informations renseignées ne sont pas valides";
					header("Location:".SITE_URL."user/connexion/");
					exit();
				}
			}
			else{
				$_SESSION["error"] = "Merci de renseigner tout les champs";
				header("Location:".SITE_URL."user/connexion/");
				exit();
			}
		}		
	}

	// login via ajax call
	function ios_login(){
		if(isset($_POST["pseudo"]) && isset($_POST["password"])){
			extract($_POST);
			if(!empty($pseudo) && !empty($password)) {
				if(strtolower($pseudo) != "robot" && $this->_um->existsWithPseudo($pseudo)){
					$user = $this->_um->getUserWithPseudo($pseudo);
					if($user->getPassword() == sha1($password)){
						echo "ok";
					}
					else{
						echo "ko";
					}
				}
				else{
					echo "ko";
				}
			}
			else{
				echo "empty";
			}
		}		
	}

	// Process the connection form
	function ios_connexion(){
		if(isset($_GET["pseudo"]) && isset($_GET["password"])){
			extract($_GET);
			if($this->_um->existsWithPseudo($pseudo)){
				$user = $this->_um->getUserWithPseudo($pseudo);
				if($user->getPassword() == sha1($password)){
					$_SESSION["logged_user"]["id"] = $user->getId();
					$_SESSION["logged_user"]["pseudo"] = $user->getPseudo();
					$_SESSION["logged_user"]["email"] = $user->getEmail();
					$_SESSION["logged_user"]["password"] = $user->getPassword();
					$_SESSION["logged_user"]["image"] = $user->getImage();
					$_SESSION["logged_user"]["create_timestamp"] = $user->getCreateTimestamp();
					$_SESSION["logged_user"]["update_timestamp"] = $user->getUpdateTimestamp();
					$_SESSION["logged_user"]["token"] = sha1($user->getPseudo().SALT_PSEUDO_TOKEN.$user->getId());
					header("Location:".SITE_URL."game/game/");
					exit();
				}
				else{
					$_SESSION["error"] = "Les informations renseignées ne sont pas valides";
					header("Location:".SITE_URL."user/connexion/");
					exit();
				}
			}
			else{
				$_SESSION["error"] = "Les informations renseignées ne sont pas valides";
				header("Location:".SITE_URL."user/connexion/");
				exit();
			}
		}
		else{
			//include_once("views/user/connexion.php");
		}
	}


	function ios_register(){
		//if(!isset($_SESSION["logged_user"])) {
			$pseudos_reserves = array("team", "all", "moi", "server", "robot", "admin", "administrateur", "empty");
			if(isset($_POST) && !empty($_POST["pseudo"]) && !empty($_POST["email"]) && !empty($_POST["password"]) && !empty($_POST["confirm_password"])){
				
				extract($_POST);			
				
				// Check the username
				if (preg_match('/^[A-Za-z0-9]{4,31}$/', $pseudo)){
					if(!$this->_um->existsWithPseudo($pseudo) && !in_array(strtolower($pseudo), $pseudos_reserves)){
						// Check the mail
						if(filter_var($email, FILTER_VALIDATE_EMAIL)){
							// Check email unicity
							if(!$this->_um->existsWithEmail($email)) {
								// Check passwords
								if($password == $confirm_password){
									if($this->_um->validatePassword($_POST["password"])) {
										$user = new User(0, $pseudo, $email, sha1($password), null);
										$user = $this->_um->add($user);
										echo "ok";
									}
									else {
										echo "prbMdp";
									}
								}
								else{
									echo "mdpDiff";
								}
							}
							else {
								echo "mailUsed";
							}
						}
						else{
							echo "mailKo";
						}
					}
					else{
						echo "pseudoKo";
					}
				}
				else{
					echo "pbrPseudo";
				}
			}
			//include_once("views/user/inscription.php");
		//}
	}



	function register(){
		if(!isset($_SESSION["logged_user"])) {
			$pseudos_reserves = array("team", "all", "moi", "server", "robot", "admin", "administrateur", "empty");
			if(isset($_POST) && !empty($_POST["pseudo"]) && !empty($_POST["email"]) && !empty($_POST["password"]) && !empty($_POST["confirm_password"])){
				
				extract($_POST);			
				
				// Check the username
				if (preg_match('/^[A-Za-z0-9]{4,31}$/', $pseudo)){
					if(!$this->_um->existsWithPseudo($pseudo) && !in_array(strtolower($pseudo), $pseudos_reserves)){
						// Check the mail
						if(filter_var($email, FILTER_VALIDATE_EMAIL)){
							// Check email unicity
							if(!$this->_um->existsWithEmail($email)) {
								// Check passwords
								if($password == $confirm_password){
									if($this->_um->validatePassword($_POST["password"])) {
										$user = new User(0, $pseudo, $email, sha1($password), null);
										$user = $this->_um->add($user);
										$_SESSION["info"] = "Votre compte à bien été enregistré.";
										header("Location:".SITE_URL."user/connexion/");
										exit();
									}
									else {
										$_SESSION["error"] = "Votre mot de passe doit contenir au minimum 6 caractères dont au moins 2 chiffres.";
									}
								}
								else{
									$_SESSION["error"] = "Les mots de passe ne sont pas valides.";
								}
							}
							else {
								$_SESSION["error"] = "L'adresse email est déjà utilisée sur un autre compte.";
							}
						}
						else{
							$_SESSION["error"] = "L'adresse email n'est pas valide.";
						}
					}
					else{
						$_SESSION["error"] = "Ce pseudo est déjà pris.";
					}
				}
				else{
					$_SESSION["error"] = "Votre pseudo doit comporter 4 caractères minimums.";
				}
			}
			include_once("views/user/inscription.php");
		}
		else {
			header("Location:".SITE_URL."user/account/");
			exit();
		}
	}

	function lost_password() {

		if(isset($_POST["infoMdp"]) && !empty($_POST["infoMdp"])) {
			
			extract($_POST);
			$user = false;
			$id = "";

			if($this->_um->existsWithPseudo($_POST["infoMdp"])){ // it was a username
				$user = $this->_um->getUserWithPseudo($_POST["infoMdp"]);
			}
			else if ($this->_um->existsWithEmail($_POST["infoMdp"])) { // it was an email
				$user = $this->_um->getUserWithEmail($_POST["infoMdp"]);				
			}
			else { // it was shit
				$_SESSION["error"] = "Le pseudo ou l'adresse de messagerie renseigné ne sont pas enregistrés dans notre base de données.";
				header("Location:".SITE_URL."user/lost_password/");
				exit();
			}
			
			if($user)
			{
				$mail = $user->getEmail();
				// url valid until tomorrow night at  23h59 and 59s 
				$reset_pwd_url = SITE_URL.'user/reset_password/?id='.$user->getId().'&c='.substr(sha1($user->getId().(strtotime('tomorrow')+(86399)).SALT_RESET_PWD.$user->getUpdateTimestamp()),2,10); 
				$sent = $this->_um->sendMailForNewPassword($mail, $reset_pwd_url);
				
				if($sent) { // the mail was sent
					$_SESSION["info"] = "Un mail contenant un lien de ré-initialisation vous a été envoyé.";
					header("Location:".SITE_URL."user/lost_password/");
					exit();
				}
				else {
					$_SESSION["error"] = "Une erreur s'est produite lors de l'envoi du mail.";
				}
			}
		}
		else {
			include_once("views/user/lost_password.php");
		}
	}

	function reset_password() {
		
		// check if we got the generated passphrase and the user id
		if(isset($_GET["id"]) && !empty($_GET["id"]) && isset($_GET["c"]) && !empty($_GET["c"])) {
			if(!$this->_um->exists($_GET["id"]))
			{
				$_SESSION['error'] = 'Ce lien a expiré ou est erroné, veuillez renseigner votre email ou votre pseudo pour recevoir de nouvelles instructions.'; 
                header("Location:".SITE_URL."user/lost_password/");
				exit();
			}
			else {
				$curr = $this->_um->getUser($_GET['id']);
				if(($_GET["c"] != substr(sha1($_GET["id"].(strtotime('tomorrow')+(86399)).SALT_RESET_PWD.$curr->getUpdateTimestamp()),2,10) && ($_GET["c"] != substr(sha1($_GET["id"].(strtotime('tomorrow')-1).SALT_RESET_PWD.$curr->getUpdateTimestamp()),2,10))))
				{
					$_SESSION['error'] = 'Ce lien a expiré ou est erroné, veuillez renseigner votre email ou votre pseudo pour recevoir de nouvelles instructions.'; 
					header("Location:".SITE_URL."user/lost_password/");
					exit();
				}
				else
				{
					if(isset($_POST["new_password"]) && !empty($_POST["new_password"]) && isset($_POST["new_password2"]) && !empty($_POST["new_password2"]))
					{
						if($_POST["new_password"] == $_POST["new_password2"]) {
							if($this->_um->validatePassword($_POST["new_password"])) {
								$this->_um->updatePassword($_GET["id"], $_POST["new_password"]);
								$_SESSION["info"] = "Votre mot de passe a bien été mis à jour.";
								header("Location:".SITE_URL."user/connexion/");
								exit();
							}
							else {
								$_SESSION["error"] = "Votre mot de passe doit contenir au minimum 6 caractères dont au moins 2 chiffres.";
								include_once("views/user/reset_password.php");
							}
						} else {
							$_SESSION["error"] = "Les mots de passe ne sont pas identiques.";
							include_once("views/user/reset_password.php");
						}
					}
					else {
						include_once("views/user/reset_password.php");
					}
				}
			}
		}
		else {
			header("Location:".SITE_URL."user/lost_password/");
			exit();
		}
	}

	function new_password() {
		if(isset($_SESSION["logged_user"])) {
			if(isset($_POST["current_password"]) && !empty($_POST["current_password"])) {

				if(isset($_POST["new_password"]) && !empty($_POST["new_password"])) {

					if(isset($_POST["new_password2"]) && !empty($_POST["new_password2"])) {
						
						if($_SESSION["logged_user"]["password"] == sha1($_POST["current_password"])) {

							if($_POST["new_password"] == $_POST["new_password2"]) {
								if($this->_um->validatePassword($_POST["new_password"])) {							
									$this->_um->updatePassword($_SESSION["logged_user"]["id"], $_POST["new_password"]);
									$_SESSION["info"] = "Votre mot de passe a bien été mis à jour.\n";
									$_SESSION["info"] .= "Merci de vous reconnecter.";
									header("Location:".SITE_URL."user/logout/");
									exit();
								}
								else {
									$_SESSION["error"] = "Votre mot de passe doit contenir au minimum 6 caractères dont au moins 2 chiffres.";
									include_once("views/user/new_password.php");
								}
							} else {
								$_SESSION["error"] = "Les mot de passes sont différents.";
								include_once("views/user/new_password.php");
							}
						} else {
							$_SESSION["error"] = "Le mot de passe actuel est erroné.";
							include_once("views/user/new_password.php");
						}
					} else {
						$_SESSION["error"] = "Merci de confirmer le nouveau mot de passe.";
						include_once("views/user/new_password.php");
					}
				} else {
					$_SESSION["error"] = "Merci de renseigner le nouveau mot de passe.";
					include_once("views/user/new_password.php");
				}
			} else {
				include_once("views/user/new_password.php");
			}
		}
		else {
			$_SESSION["error"] = "Vous n'êtes pas connecté ou votre session a expirée.";
			header("Location:".SITE_URL."user/connexion/");
			exit();
		}
	}
	
	/* 
	 * Update the user infos (mail, and call to upload_avatar)
	 * Called from the account page
	 * 
	*/
	function update() {
		if(isset($_SESSION["logged_user"])) {
			if(isset($_FILES['avatar']) && isset($_POST["account_email"])) {
				if(!empty($_POST["account_email"]) && $_SESSION["logged_user"]["email"] != $_POST["account_email"]) {
					$email = $_POST["account_email"];
					// Check the mail
					if(filter_var($email, FILTER_VALIDATE_EMAIL)) {
						// Check email unicity
						if(!$this->_um->existsWithEmail($email)) {
							$this->_um->updateEmail($_SESSION["logged_user"]["id"], $email);
							$_SESSION["logged_user"]["email"] = $email;
							if(!empty($_FILES['avatar']['name'])) { // there is a file
								$this->upload_avatar(); // call the controller that manages the upload
							}
							else {
								$_SESSION["info"] = "Opération effectuée avec succès.";
								header("Location:".SITE_URL."user/account/");
								exit();
							}
						}
						else {
							$_SESSION["error"] = "L'adresse email est déjà utilisée sur un autre compte.";
							header("Location:".SITE_URL."user/account/");
							exit();
						}
					}
					else {
						$_SESSION["error"] = "L'adresse email n'est pas valide.";
						header("Location:".SITE_URL."user/account/");
						exit();
					}
				}
				else {
					if(!empty($_FILES['avatar']['name'])) { // there is a file
						$this->upload_avatar(); // call the controller that manages the upload
					}
					else { // nothing changed
						header("Location:".SITE_URL."user/account/");
						exit();
					}
				}				
			}
			else {
				header("Location:".SITE_URL."user/account/");
				exit();
			}
		}
		else {
			$_SESSION["error"] = "Vous n'êtes pas connecté ou votre session a expirée.";
			header("Location:".SITE_URL."user/connexion/");
			exit();
		}
	}


	function upload_avatar() {
		if(isset($_SESSION["logged_user"])) {
			if ($_FILES['avatar']['error'] > 0) {
				// erreur lors de l'upload
				if($_FILES['avatar']['error'] == "UPLOAD_ERR_NO_FILE") {
					$_SESSION["error"] = "Le fichier est manquant.";
					header("Location:".SITE_URL."user/account/");
					exit();
				} elseif ($_FILES['avatar']['error'] == "UPLOAD_ERR_INI_SIZE" || $_FILES['avatar']['error'] == "UPLOAD_ERR_FORM_SIZE") {
					$_SESSION["error"] = "Le fichier dépasse la taille maximale autorisée.";
					header("Location:".SITE_URL."user/account/");
					exit();
				} else {
					$_SESSION["error"] = "Une erreur inconnue est survenue lors de l'upload.";
					header("Location:".SITE_URL."user/account/");
					exit();
				}
			}


			$extensions_valides = array( 'jpg' , 'jpeg' , 'gif' , 'png' );
			//1. strrchr renvoie l'extension avec le point (« . »).
			//2. substr(chaine,1) ignore le premier caractère de chaine.
			//3. strtolower met l'extension en minuscules.
			$extension_upload = strtolower(  substr(  strrchr($_FILES['avatar']['name'], '.')  ,1)  );
			if (!in_array($extension_upload,$extensions_valides)) {

				$_SESSION["error"] = "L'extension n'est pas correcte." . $extension_upload;
				header("Location:".SITE_URL."user/account/");
				exit();
			}

			$nom = "avatar_" . $_SESSION["logged_user"]["id"] ."." . $extension_upload;
			$chemin = "uploads/" . $nom;
			$resultat = move_uploaded_file($_FILES['avatar']['tmp_name'], $chemin);
			if ($resultat) {

				$this->_um->updateAvatar($_SESSION["logged_user"]["id"],$chemin);

				if(isset($_SESSION["logged_user"]["image"]) || empty($_SESSION["logged_user"]["image"])) {

					// dans le cas ou l'utilisateur n'avait pas d'avatar
					// evite de recharger la session
					$_SESSION["logged_user"]["image"] = $chemin;
				}

				$_SESSION["info"] = "Opération effectuée avec succès.";
				header("Location:".SITE_URL."user/account/");
				exit();
			} else {
				$_SESSION["error"] = "Le transfert a échoué.";
				header("Location:".SITE_URL."user/account/");
				exit();
			}
		}
		else {
			$_SESSION["error"] = "Vous n'êtes pas connecté ou votre session a expirée.";
			header("Location:".SITE_URL."user/connexion/");
			exit();
		}
	}


	function delete_avatar() {
		if(isset($_SESSION["logged_user"])) {
			if(isset($_SESSION["logged_user"]["image"]) || empty($_SESSION["logged_user"]["image"])) {
				$this->_um->updateAvatar($_SESSION["logged_user"]["id"], "");
				$_SESSION["logged_user"]["image"] = "";
				$_SESSION["info"] = "Votre avatar a bien été supprimé.";
				header("Location:".SITE_URL."user/account/");
				exit();
			} else {
				$_SESSION["error"] = "Vous ne possédez pas d'avatar.";
				header("Location:".SITE_URL."user/account/");
				exit();
			}
		}
		else {
			$_SESSION["error"] = "Vous n'êtes pas connecté ou votre session a expirée.";
			header("Location:".SITE_URL."user/connexion/");
			exit();
		}
	}
	

	
	function logout(){
		if(isset($_SESSION["logged_user"])) {
			unset($_SESSION["logged_user"]);
			header("Location:".SITE_URL); //A+
			exit();
		}
		else {
			$_SESSION["error"] = "Vous n'êtes pas connecté ou votre session a expirée.";
			header("Location:".SITE_URL."user/connexion/");
			exit();
		}
	}
	
	function account(){		
		if(isset($_SESSION["logged_user"])) {
			$current_user = new User($_SESSION["logged_user"]["id"], $_SESSION["logged_user"]["pseudo"], $_SESSION["logged_user"]["email"], $_SESSION["logged_user"]["password"], $_SESSION["logged_user"]["image"], $_SESSION["logged_user"]["create_timestamp"], $_SESSION["logged_user"]["update_timestamp"]);
			include_once("views/user/moncompte.php");
		}
		else {
			$_SESSION["error"] = "Vous n'êtes pas connecté ou votre session a expirée.";
			header("Location:".SITE_URL."user/connexion/");
			exit();
		}		
	}
	
	function search_ajax(){
		if(isset($_SESSION["logged_user"])) {
			$results = $this->_um->searchUsers($_POST["text"]);
			$friends = $this->_fm->getFriends($_SESSION["logged_user"]["id"]);
			$arrayFriendsId = array();
			foreach($friends as $f) $arrayFriendsId[] = $f->getId();
			foreach($results as $u){
				if(in_array($u->getId(), $arrayFriendsId)) continue;
				if($u->getId() == $_SESSION["logged_user"]["id"]) continue;
				$li = "<li>";
				$li .= "<img class='avatar' src='".SITE_URL."user/avatar/".$u->getPseudo()."/medium/' alt='avatar de ".$u->getPseudo()."' title='avatar de ".$u->getPseudo()."'>";
				$li .= "<div class='infos'>";
				$li .= "<p><a href='".SITE_URL.'user/profile/'.$u->getPseudo()."/'>".ucfirst($u->getPseudo())."</a></p>";
				//$li .= "<p>".$u->getEmail()."</p>";
				$li .= "<a class='btn-like' href='".SITE_URL."friend/add/?friend=".$u->getId()."'>Demander en ami</a>";
				$li .= "</div>";
				$li .= "</li>";
				echo "jQuery(\"#result\").append(\"$li\");";
			}
		}
	}
	
	function profile() {
		if(isset($_GET["user"]) && !empty($_GET["user"])) {
			$user = $this->_um->getUserWithPseudo($_GET["user"]);
			
			if($user != false || strtolower($_GET["user"]) == "robot") {
				if(strtolower($_GET["user"]) == "robot") {
					$user = new User(0, "Robot", "", "", "", "", "");
				}
				
				$games = $this->_ghm->getByUser($_GET["user"]);
				$nb_games = $this->_ghm->getNbGamesByUser($_GET["user"]);
				$nb_wins = $this->_ghm->getNbWinsByUser($_GET["user"]);
				$nb_defeats = $nb_games - $nb_wins;
				$final_games = array();
				if(count($games) > 0) {
					$old_game_id = 0;
					foreach($games as $g) {
						$current_game_id = $g->getGameId();
						if($current_game_id != $old_game_id) {
							if($old_game_id != 0) {
								$final_games[] = $current_final_game;
							}
							$current_final_game = array("game_id" => $g->getGameId(), "game_name" => $g->getGameName(), "board_radius" => $g->getBoardRadius(), "date_added" => $g->getDate(), "teams" => array(), );
							$old_game_id = $current_game_id;
						}
						if($g->getHasWin() == 1)	$current_final_game["team_winner"] = $g->getTeamId();
						$current_final_game["teams"][$g->getTeamId()][] = $g->getPlayerName();				
					}
					$final_games[] = $current_final_game;
				}				
				include_once("views/user/user.php");
			}
			else {
				header("HTTP/1.0 404 Not Found");
				include "404.php";
				exit();
			}
		}
		else {
			if(isset($_SESSION["logged_user"])) {
				header("Location:".SITE_URL."user/profile/".$_SESSION["logged_user"]["pseudo"]."/");
				exit();
			}
			else {
				header("Location:".SITE_URL);
				exit();
			}
		}
	}
	
	function avatar(){
		if(isset($_GET["user"]))
		{
			if(strtolower($_GET['user']) == "empty") {
				$imgpath = 'assets/img/user/avatar_empty.png';
			}
			elseif(strtolower($_GET['user']) == "robot") {
				$imgpath = 'assets/img/user/avatar_robot'.rand(1,5).'.png';
			}
			else {
				$user = $this->_um->getUserWithPseudo($_GET["user"]);
				$imgpath = $user->getImage();
			}
		}
		else
		{
			$imgpath = "";
		}
		
		if($imgpath == "" || !file_exists($imgpath))
		{
			$imgpath = 'assets/img/user/avatar_default.png';
		}
		 
		// Get the mimetype for the file
		$finfo = finfo_open(FILEINFO_MIME_TYPE);  // return mime type ala mimetype extension
		$mime_type = finfo_file($finfo, $imgpath);
		finfo_close($finfo);
				
		switch ($mime_type){
			case "image/jpeg":
				// Set the content type header - in this case image/jpg
				header('Content-Type: image/jpeg');
				 
				// Get image from file
				$img = imagecreatefromjpeg($imgpath);
				 
				break;
			case "image/png":
				// Set the content type header - in this case image/png
				header('Content-Type: image/png');
				 
				// Get image from file
				$img = imagecreatefrompng($imgpath);
				 
				// integer representation of the color white (rgb: 255,255,255)
				$background = imagecolorallocate($img, 255, 255, 255);
				 
				// removing the black from the placeholder
				imagecolortransparent($img, $background);
				 
				// turning off alpha blending (to ensure alpha channel information 
				// is preserved, rather than removed (blending with the rest of the 
				// image in the form of black))
				imagealphablending($img, false);
				 
				// turning on alpha channel information saving (to ensure the full range 
				// of transparency is preserved)
				imagesavealpha($img, true);
				
				break;
			case "image/gif":
				// Set the content type header - in this case image/gif
				header('Content-Type: image/gif');
				 
				// Get image from file
				$img = imagecreatefromgif($imgpath);
				 
				// integer representation of the color black white (rgb: 255,255,255)
				$background = imagecolorallocate($img, 255, 255, 255);
				 
				// removing the black from the placeholder
				imagecolortransparent($img, $background);
				 
				break;
		}
		
		if(isset($_GET['size']) && ($_GET['size'] == "small" || $_GET['size'] == "medium" || $_GET['size'] == "large")) {
			$width = imagesx($img);
			$height = imagesy($img);
			
			if($_GET['size'] == "large")
			{
				$desired_width = 400;
			}
			elseif($_GET['size'] == "medium")
			{
				$desired_width = 150;
			}
			else
			{
				$desired_width = 50;
			}
			
			$desired_height = $desired_width; //square thumbnail
			
			$original_aspect = $width / $height;
			$thumb_aspect = $desired_width / $desired_height;

			if ( $original_aspect >= $thumb_aspect )
			{
			   // If image is wider than thumbnail (in aspect ratio sense)
			   $new_height = $desired_height;
			   $new_width = $width / ($height / $desired_height);
			}
			else
			{
			   // If the thumbnail is wider than the image
			   $new_width = $desired_width;
			   $new_height = $height / ($width / $desired_width);
			}
						
			$virtual_image = imagecreatetruecolor($desired_width, $desired_height);		
						
			// set background to white (ou presque lol mdr)
			$white = imagecolorallocate($virtual_image, 245, 245, 245);
			imagefill($virtual_image, 0, 0, $white);
			
			imagecopyresampled($virtual_image, $img, 0 - ($new_width - $desired_width) / 2, 0 - ($new_height - $desired_height) / 2, 0, 0, $new_width, $new_height, $width, $height);
		}
		else
		{
			$virtual_image = $img;
		}
		
		switch ($mime_type){
			case "image/jpeg":
				imagejpeg($virtual_image);
				break;
			case "image/png":
				imagepng($virtual_image);
				break;
			case "image/gif":
				imagegif($virtual_image);				 
				break;
		}

		if(isset($img) && $img != null)	imagedestroy($img);
		exit();
	}
	
	function help(){
		if(isset($_SESSION["logged_user"])) {
			if(isset($_POST['help'])) {
				$help = $_POST['help'];
				if($help == 0 || $help == 1) {
					$this->_um->updateHelp($_SESSION["logged_user"]["id"], $help);					
				}
			}
		}
	}
}
?>

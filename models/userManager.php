<?php

require_once('models/manager.php');
require_once('models/user.php');

/* PhpMailer */
require_once('libs/phpmailer/class.phpmailer.php');


class UserManager extends Manager {

	public function __construct(PDO $db) {
		parent::__construct($db);
	}
	
	function getUser($id){
		$id = (int) $id;
		$q = $this->_db->prepare("SELECT * FROM users WHERE id = :id");
		$q->bindValue(':id', $id, PDO::PARAM_INT);
		$q->execute() or die(print_r($q->errorInfo()));
		$data = $q->fetch(PDO::FETCH_ASSOC);
		return new User($data["id"], $data["pseudo"], $data["email"], $data["password"], $data["image"], $data["create_timestamp"], $data["update_timestamp"], $data["help"]);
	}

	function getUserWithPseudo($pseudo) {
		$q = $this->_db->prepare("SELECT * FROM users WHERE pseudo LIKE :p");
		$q->bindValue(':p', $pseudo, PDO::PARAM_STR);
		$q->execute() or die(print_r($q->errorInfo()));
		if($data = $q->fetch(PDO::FETCH_ASSOC)) {
			return new User($data["id"], $data["pseudo"], $data["email"], $data["password"], $data["image"], $data["create_timestamp"], $data["update_timestamp"], $data["help"]);
		}
		else
		{
			return false;
		}
		
	}

	function getUserWithEmail($email){
		$q = $this->_db->prepare("SELECT * FROM users WHERE email LIKE :e");
		$q->bindValue(':e', $email, PDO::PARAM_STR);
		$q->execute() or die(print_r($q->errorInfo()));
		$data = $q->fetch(PDO::FETCH_ASSOC);
		return new User($data["id"], $data["pseudo"], $data["email"], $data["password"], $data["image"], $data["create_timestamp"], $data["update_timestamp"], $data["help"]);
	}

	function getUsers(){
		$users = array();
		$q = $this->_db->query("SELECT * FROM users");
		while ($data = $q->fetch(PDO::FETCH_ASSOC)) {
		    $users[] = new User($data["id"], $data["pseudo"], $data["email"], $data["password"], $data["image"], $data["create_timestamp"], $data["update_timestamp"], $data["help"]);
		}
		return $users;
	}
	
	function searchUsers($pseudo){
		$users = array();
		$q = $this->_db->prepare("SELECT * FROM users WHERE pseudo LIKE :p ORDER BY pseudo ASC");
		$q->bindValue(':p', $pseudo."%", PDO::PARAM_STR);
		//$q->bindValue(':u', $_SESSION["logged_user"]["id"], PDO::PARAM_INT);
		$q->execute() or die(print_r($q->errorInfo()));
		while ($data = $q->fetch(PDO::FETCH_ASSOC)) {
		    $users[] = new User($data["id"], $data["pseudo"], $data["email"], $data["password"], $data["image"], $data["create_timestamp"], $data["update_timestamp"], $data["help"]);
		}
		return $users;
	}

	function add(User $u){
		$q = $this->_db->prepare('INSERT INTO users SET pseudo = :p, email = :e, password = :pass, image = :im, help = :h');
		$q->bindValue(':p', $u->getPseudo(), PDO::PARAM_STR);
		$q->bindValue(':e', $u->getEmail(), PDO::PARAM_STR);
		$q->bindValue(':pass', $u->getPassword(), PDO::PARAM_STR);
		$q->bindValue(':im', $u->getImage(), PDO::PARAM_STR);
		$q->bindValue(':h', $u->getHelp(), PDO::PARAM_INT);
		$q->execute() or die(print_r($q->errorInfo()));
	
		$u->setId($this->_db->lastInsertId());
		return $u;
	}

	function exists($id){
		$q = $this->_db->prepare("SELECT COUNT(*) as nb FROM users WHERE id LIKE :i");
		$q->bindValue(':i', $id, PDO::PARAM_INT);
		$q->execute() or die(print_r($q->errorInfo()));
		$r = $q->fetch(PDO::FETCH_ASSOC);
		return (bool) $r["nb"] > 0;
	}

	function existsWithPseudo($pseudo){
		$q = $this->_db->prepare("SELECT COUNT(*) as nb FROM users WHERE pseudo LIKE :p");
		$q->bindValue(':p', $pseudo, PDO::PARAM_STR);
		$q->execute() or die(print_r($q->errorInfo()));
		$r = $q->fetch(PDO::FETCH_ASSOC);
		return (bool) $r["nb"] > 0;
	}

	function existsWithEmail($email){
		$q = $this->_db->prepare("SELECT COUNT(*) as nb FROM users WHERE email LIKE :e");
		$q->bindValue(':e', $email, PDO::PARAM_STR);
		$q->execute() or die(print_r($q->errorInfo()));
		$r = $q->fetch(PDO::FETCH_ASSOC);
		return (bool) $r["nb"] > 0;
	}

	function update(User $u){
		$q = $this->_db->prepare("UPDATE users SET pseudo = :p, email = :e, password = :pass, image = :im WHERE id = :id");
		$q->bindValue(':p', $u->getPseudo(), PDO::PARAM_STR);
		$q->bindValue(':e', $u->getEmail(), PDO::PARAM_STR);
		$q->bindValue(':pass', $u->getPassword(), PDO::PARAM_STR);
		$q->bindValue(':im', $u->getImage(), PDO::PARAM_STR);
		$q->bindValue(':id', $u->id(), PDO::PARAM_INT);
		$q->execute() or die(print_r($q->errorInfo()));
	}

	function delete(User $u){
		$q = $this->_db->prepare("DELETE FROM users WHERE id = :id");
		$q->bindValue(':id', $u->getId(), PDO::PARAM_INT);
		$q->execute() or die(print_r($q->errorInfo()));
	}


	function sendMailForNewPassword($email, $link) {

		/*
		$headers = "From: ".SITE_NAME." <".SITE_EMAIL.">\n";
		$headers .= "Reply-To: ".SITE_EMAIL."\n";
		$headers .= "Content-type: text/html; charset=utf-8\n";
		$headers .= "Content-Transfer-Encoding: 8bit\r\n";
		*/

		$message = "<p>Bonjour,</p>";
		$message .= "<p>Veuillez cliquer sur le lien ci-dessous pour ré-initialiser votre mot de passe :<br>";
		$message .= "<a href=" . $link . " target'_blank'>" . $link . "</a><br></p>";
		$message .= "<p>Si vous n'avez pas demandé à réinitialiser votre mot de passe, ignorez cet email.<br></p>";
		$message .= "<p>Cordialement,<br>L'équipe du jeu ".SITE_NAME."</p>";

		/*
		$subject = SITE_NAME." - Restauration du mot de passe";

		//send the email
		$sent = mail($email,$subject,$message,$headers); 
		return $sent;
		*/


		$mail = new PHPmailer();
        $mail->IsSMTP();
        $mail->SMTPSecure = "tls";
        $mail->IsHTML(true);
        //$mail->SMTPDebug=true;    

        // Connexion au serveur SMTP   
        $mail->Host='smtp.gmail.com'; 
        $mail->Port = 587;
        $mail->SMTPAuth = true; 
        $mail->Username = 'game.abactus@gmail.com'; 
        $mail->Password = 'sutcabacool'; 
   		$mail->CharSet = 'UTF-8';


		$mail->From = "game.abactus@gmail.com";
		$mail->FromName = SITE_NAME;
		// Définition du sujet/objet
		$mail->Subject = SITE_NAME." - Restauration du mot de passe";
		// On définit le corps du message
		$mail->Body = $message;
		// Il reste encore à ajouter au moins un destinataire
		$mail->AddAddress($email);

		// Pour finir, on envoi l'e-mail
		$sent = $mail->send();
        $mail->SmtpClose();
        // ferme la connexion smtp et désalloue la mémoire
        unset($mail);
		return $sent;
	}



	function updatePassword($id, $password) {
		$hash_pass = sha1($password);

		$q = $this->_db->prepare("UPDATE users SET password = :pass, update_timestamp = CURRENT_TIMESTAMP WHERE id = :id");
		$q->bindValue(':pass', $hash_pass, PDO::PARAM_STR);
		$q->bindValue(':id', $id, PDO::PARAM_INT);
		$q->execute() or die(print_r($q->errorInfo()));
		
	}

	function updateEmail($id, $email) {
		$q = $this->_db->prepare("UPDATE users SET email = :email, update_timestamp = CURRENT_TIMESTAMP WHERE id = :id");
		$q->bindValue(':email', $email, PDO::PARAM_STR);
		$q->bindValue(':id', $id, PDO::PARAM_INT);
		$q->execute() or die(print_r($q->errorInfo()));		
	}

	function updateAvatar($id, $lien) {
		$q = $this->_db->prepare("UPDATE users SET image = :im WHERE id = :id");
		$q->bindValue(':im', $lien, PDO::PARAM_STR);
		$q->bindValue(':id', $id, PDO::PARAM_INT);
		$q->execute() or die(print_r($q->errorInfo()));

	} 

	function updateHelp($id, $help) {
		$q = $this->_db->prepare("UPDATE users SET help = :h, update_timestamp = CURRENT_TIMESTAMP WHERE id = :id");
		$q->bindValue(':h', $help, PDO::PARAM_INT);
		$q->bindValue(':id', $id, PDO::PARAM_INT);
		$q->execute() or die(print_r($q->errorInfo()));		
	}
	/*
	 * Check if the password contains at least 6 chars including 2 digits
	 * 
	 * @returns boolean
	*/
	function validatePassword($pwd) {
		return (strlen($pwd) >= 6 && preg_match_all("/[0-9]/", $pwd) >= 2);
	} 
}

?>

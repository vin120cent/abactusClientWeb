<?php

require_once('models/manager.php');
require_once 'models/userManager.php';
require_once('models/user.php');

class FriendManager extends Manager {
	
	protected $_um;

	public function __construct(PDO $db) {
		parent::__construct($db);
		$this->_um = new UserManager($db);
	}

	function getFriends($id){
		$friends = array();
		$q = $this->_db->prepare("	SELECT * FROM friends WHERE user1 = :id AND statut = 1
								UNION
							SELECT * FROM friends WHERE user2 = :idd AND statut = 1");
		$q->bindValue(':id', $id, PDO::PARAM_INT);
		$q->bindValue(':idd', $id, PDO::PARAM_INT);
		$q->execute() or die(print_r($q->errorInfo()));
		while ($data = $q->fetch(PDO::FETCH_ASSOC)) {
			$user;
			if($data["user1"] == $id) $user = $this->_um->getUser($data["user2"]);
			if($data["user2"] == $id) $user = $this->_um->getUser($data["user1"]);
		    $friends[] = $user;
		}
	
		return $friends;
	}

	function getFriendRequests($u_id){
		$id = $u_id;
		$friends = array();
		$q = $this->_db->prepare("SELECT * FROM friends WHERE user2 = :id AND statut = 0");
		$q->bindValue(':id', $id, PDO::PARAM_INT);
		$q->execute() or die(print_r($q->errorInfo()));
		while ($data = $q->fetch(PDO::FETCH_ASSOC)) {
			$user = $this->_um->getUser($data["user1"]);
			$friends[] = $user;
		}
	
		return $friends;
	}

	function addFriendRequest($u_id, $id_friend){
		$id = $u_id;
		$friend = $id_friend;
		$q = $this->_db->prepare("INSERT INTO friends SET user1 = :u1, user2 = :u2, statut = 0");
		$q->bindValue(':u1', $id, PDO::PARAM_INT);
		$q->bindValue(':u2', $friend, PDO::PARAM_INT);
		$q->execute() or die(print_r($q->errorInfo()));
	}

	function acceptFriendRequest($u1, $u2){
		$q = $this->_db->prepare("UPDATE friends SET statut = 1 WHERE user1 = :u1 AND user2 = :u2 AND statut = 0");
		$q->bindValue(':u1', $u1, PDO::PARAM_INT);
		$q->bindValue(':u2', $u2, PDO::PARAM_INT);
		$q->execute() or die(print_r($q->errorInfo()));
	}

	function deleteFriendRequest($u1, $u2){
		$q = $this->_db->prepare("DELETE FROM friends WHERE (user1 = :u1 AND user2 = :u2) OR (user1 = :u3 AND user2 = :u4)");
		$q->bindValue(':u1', $u1, PDO::PARAM_INT);
		$q->bindValue(':u2', $u2, PDO::PARAM_INT);
		$q->bindValue(':u3', $u2, PDO::PARAM_INT);
		$q->bindValue(':u4', $u1, PDO::PARAM_INT);
		$q->execute() or die(print_r($q->errorInfo()));
	}
	
	function exists($u1, $u2){
		$q = $this->_db->prepare("SELECT COUNT(*) as nb FROM friends WHERE (user1 = :u1 AND user2 = :u2) OR (user1 = :u3 AND user2 = :u4)");
		$q->bindValue(':u1', $u1, PDO::PARAM_INT);
		$q->bindValue(':u2', $u2, PDO::PARAM_INT);
		$q->bindValue(':u3', $u2, PDO::PARAM_INT);
		$q->bindValue(':u4', $u1, PDO::PARAM_INT);
		$q->execute() or die(print_r($q->errorInfo()));
		$r = $q->fetch(PDO::FETCH_ASSOC);
		return (bool) $r["nb"] > 0;
	}
}

?>
<?php

class User{
	
	protected $_id;
	protected $_pseudo;
	protected $_email;
	protected $_password;
	protected $_image;
	protected $_create_timestamp;
	protected $_update_timestamp;
	protected $_help;

	function __construct($id, $pseudo, $email, $password, $image, $create, $update, $help=1){
		$this->setId($id);
		$this->setPseudo($pseudo);
		$this->setEmail($email);
		$this->setPassword($password);
		$this->setImage($image);
		$this->setCreateTimestamp($create);
		$this->setUpdateTimestamp($update);
		$this->setHelp($help);
	}

	function setId($id){
		$this->_id = (int)$id;
	}

	function getId(){
		return $this->_id;
	}

	function setPseudo($pseudo){
		$this->_pseudo = $pseudo . "";
	}

	function getPseudo(){
		return $this->_pseudo;
	}

	function setEmail($email){
		$this->_email = $email . "";
	}

	function getEmail(){
		return $this->_email;
	}

	function setPassword($password){
		$this->_password = $password . "";
	}

	function getPassword(){
		return $this->_password;
	}

	function setImage($image){
		$this->_image = $image . "";
	}

	function getImage(){
		return $this->_image;
	}
	
	function setCreateTimestamp($time){
		$this->_create_timestamp = $time;
	}
	
	function getCreateTimestamp(){
		return $this->_create_timestamp;
	}
	
	function setUpdateTimestamp($time){
		$this->_update_timestamp = $time;
	}
	
	function getUpdateTimestamp(){
		return $this->_update_timestamp;
	}
	
	function setHelp($help){
		$this->_help = $help;
	}
	
	function getHelp(){
		return $this->_help;
	}
}

?>

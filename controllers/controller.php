<?php
class Controller
{
	protected $_db;

	public function __construct(){
		$this->_db = new PDO(SQL_DSN, SQL_USERNAME, SQL_PASSWORD);
	}
}
?>
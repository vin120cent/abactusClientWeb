<?php

class Manager
{
    protected $_db;

	public function __construct(PDO $db) {
		$this->_db = $db;
	}
}

?>
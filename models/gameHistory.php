<?php

class GameHistory {
	
	protected $_id;//primary autoincrement
	protected $_game_id;
	protected $_game_name;
	protected $_board_radius;
	protected $_team_id;
	protected $_player_id; //0 = robot
	protected $_player_name; //"robot" = robot
	protected $_has_win; //tinyint 1 (boolean)
	protected $_date_added; //NOW()
	protected $_win_mode;

	function __construct($id, $game_id, $game_name, $board_radius, $team_id, $player_id, $player_name, $_has_win, $date_added, $win_mode){
		$this->setId($id);
		$this->setGameId($game_id);
		$this->setGameName($game_name);
		$this->setBoardRadius($board_radius);
		$this->setTeamId($team_id);
		$this->setPlayerId($player_id);
		$this->setPlayerName($player_name);
		$this->setHasWin($_has_win);
		$this->setDate($date_added);
		$this->setWinMode($win_mode);
	}

	function setId($id){
		$this->_id = (int)$id;
	}

	function getId(){
		return $this->_id;
	}

	function setGameId($game_id){
		$this->_game_id = $game_id;
	}

	function getGameId(){
		return $this->_game_id;
	}
	
	function setBoardRadius($board_radius){
		$this->_board_radius = (int)$board_radius;
	}

	function getBoardRadius(){
		return $this->_board_radius;
	}

	function setGameName($game_name){
		$this->_game_name = $game_name . "";
	}

	function getGameName(){
		return $this->_game_name;
	}

	function setTeamId($team_id){
		$this->_team_id = (int)$team_id;
	}

	function getTeamId(){
		return $this->_team_id;
	}

	function setPlayerId($player_id){
		$this->_player_id = (int)$player_id;
	}

	function getPlayerId(){
		return $this->_player_id;
	}

	function setPlayerName($player_name){
		$this->_player_name = $player_name . "";
	}

	function getPlayerName(){
		return $this->_player_name;
	}

	function setHasWin($has_win){
		if($has_win == true || $has_win == 1)	$this->_has_win = 1;
		else $this->_has_win = 0;
	}

	function getHasWin(){
		return $this->_has_win;
	}

	function setDate($date){
		$this->_date_added = $date;
	}

	function getDate(){
		return $this->_date_added;
	}

	function setWinMode($win_mode){
		$this->_win_mode = $win_mode;
	}

	function getWinMode(){
		return $this->_win_mode;
	}
}

?>

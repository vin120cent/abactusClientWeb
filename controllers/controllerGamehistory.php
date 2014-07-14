<?php

require_once 'controllers/controller.php';
require_once 'models/userManager.php';
require_once 'models/gameHistoryManager.php';

class Controller_Gamehistory extends Controller {

	function __construct() {
		parent::__construct();
		$this->_um = new UserManager($this->_db);
		$this->_ghm = new GameHistoryManager($this->_db);
	}
	
	function save() {
		// vérifie que le serveur web est physiquement au même endroit. 
		if(isset($_POST['infos']) && $_SERVER['REMOTE_ADDR'] == '127.0.0.1') {
			$infos = json_decode($_POST['infos'], true);
			$game_id = $infos['gameId'];
			$game_name = $infos['gameName'];
			$board_radius = $infos['boardRadius'];
			$win_mode = $infos['winMode'];
			foreach($infos['players'] as $player) {			
				$team_id = $player['teamId'];
				$player_name = $player['pseudo'];
				if($player_name != "robot")	$player_id = $this->_um->getUserWithPseudo($player_name)->getId();
				else	$player_id = 0;
				$has_win = $player['hasWin'];
				$ngh = new GameHistory(0, $game_id, $game_name, $board_radius, $team_id, $player_id, $player_name, $has_win, 0, $win_mode);
				$this->_ghm->add($ngh);
			}
			echo "1";
		}
		else {
			echo "either bad data or bad ip (".$_SERVER['REMOTE_ADDR'].")";
		}
	}
	
	function rank() {
		if(isset($_GET["type"])) {
			$type = $_GET["type"];
			if(!(isset($_GET["nb"]) && $_GET["nb"] > 0 && $_GET["nb"] < 100)) $nb = 10; //default
			else $nb = (int) $_GET["nb"];
					
			switch($type) {
				case "nb_games": echo json_encode($this->_ghm->getNbGamesRanking($nb)); break;
				case "nb_wins": echo json_encode($this->_ghm->getNbWinsRanking($nb)); break;
				case "win_rate": echo json_encode($this->_ghm->getWinRateRanking($nb)); break;
				default : echo json_encode(array("type" => "error", "message" => "wrong type"));
			}
		}
		else {
			echo json_encode(array("type" => "error", "message" => "no type"));
		}
	}
}
?>

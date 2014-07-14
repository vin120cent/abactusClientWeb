<?php

require_once('models/manager.php');
require_once('models/gameHistory.php');


class GameHistoryManager extends Manager {

	public function __construct(PDO $db) {
		parent::__construct($db);
	}
	
	function add(GameHistory $g) {
		$q = $this->_db->prepare('INSERT INTO games SET game_id = :game_id, game_name = :game_name, board_radius = :board_radius, team_id = :team_id, player_id = :player_id, player_name = :player_name, has_win = :has_win, date_added = NOW(), win_mode = :win_mode');
		$q->bindValue(':game_id', $g->getGameId(), PDO::PARAM_INT);
		$q->bindValue(':game_name', $g->getGameName(), PDO::PARAM_STR);
		$q->bindValue(':board_radius', $g->getBoardRadius(), PDO::PARAM_INT);
		$q->bindValue(':team_id', $g->getTeamId(), PDO::PARAM_INT);
		$q->bindValue(':player_id', $g->getPlayerId(), PDO::PARAM_INT);
		$q->bindValue(':player_name', $g->getPlayerName(), PDO::PARAM_STR);
		$q->bindValue(':has_win', $g->getHasWin(), PDO::PARAM_INT);
		$q->bindValue(':win_mode', $g->getWinMode(), PDO::PARAM_STR);
		$q->execute() or die(print_r($q->errorInfo()));
	
		$g->setId($this->_db->lastInsertId());
		return $g;
	}
	
	function getByUser($pseudo) {
		$res = array();
		$q = $this->_db->prepare("SELECT * FROM games WHERE game_id IN (SELECT game_id from games WHERE player_name LIKE :pseudo) ORDER BY date_added DESC, game_id");
		$q->bindValue(':pseudo', $pseudo, PDO::PARAM_STR);
		$q->execute() or die(print_r($q->errorInfo()));
		while ($data = $q->fetch(PDO::FETCH_ASSOC)) {
			$res[] = new GameHistory($data['id'], $data['game_id'], $data['game_name'], $data['board_radius'], $data['team_id'], $data['player_id'], $data['player_name'], $data['has_win'], $data['date_added'], "");
		}
		return $res;		
	}
	
	function getNbGamesByUser($pseudo) {
		$q = $this->_db->prepare("SELECT COUNT(*) as nb FROM games WHERE player_name LIKE :pseudo");
		$q->bindValue(':pseudo', $pseudo, PDO::PARAM_STR);
		$q->execute() or die(print_r($q->errorInfo()));
		$res = $q->fetch(PDO::FETCH_ASSOC);
		return $res["nb"];		
	}
	
	function getNbGamesRanking($nbr) {
		$res = array();
		$q = $this->_db->prepare("SELECT COUNT(*) as nb, player_name FROM games WHERE player_name != '' GROUP BY player_name ORDER BY nb DESC LIMIT 0, :nbr");
		$q->bindValue(':nbr', $nbr, PDO::PARAM_INT);
		$q->execute() or die(print_r($q->errorInfo()));
		while ($data = $q->fetch(PDO::FETCH_ASSOC)) {
			$res[] = $data;
		}
		return $res;
	}
	
	function getNbWinsRanking($nbr) {
		$res = array();
		$q = $this->_db->prepare("SELECT COUNT(*) as nb, player_name FROM games WHERE has_win = 1 AND player_name != '' GROUP BY player_name ORDER BY nb DESC LIMIT 0, :nbr");
		$q->bindValue(':nbr', $nbr, PDO::PARAM_INT);
		$q->execute() or die(print_r($q->errorInfo()));
		while ($data = $q->fetch(PDO::FETCH_ASSOC)) {
			$res[] = $data;
		}
		return $res;
	}
	
	function getWinRateRanking($nbr) {
		$res = array();
		$q = $this->_db->prepare("SELECT COUNT(id) as nb, SUM(has_win) as nb_wins, ROUND(100*(SUM(has_win) / COUNT(id))) as win_rate, player_name FROM games WHERE player_name != '' GROUP BY player_name ORDER BY win_rate DESC, nb_wins DESC LIMIT 0, :nbr");
		$q->bindValue(':nbr', $nbr, PDO::PARAM_INT);
		$q->execute() or die(print_r($q->errorInfo()));
		while ($data = $q->fetch(PDO::FETCH_ASSOC)) {
			$res[] = $data;
		}
		return $res;
	}
	
	function getNbWinsByUser($pseudo) {
		$q = $this->_db->prepare("SELECT COUNT(*) as nb FROM games WHERE player_name LIKE :pseudo AND has_win = 1");
		$q->bindValue(':pseudo', $pseudo, PDO::PARAM_STR);
		$q->execute() or die(print_r($q->errorInfo()));
		$res = $q->fetch(PDO::FETCH_ASSOC);
		return $res["nb"];		
	}
}

?>

        <div class="profile_header grid">
            <div class="grid1-2">
                <div>
                    <img class="avatar center" src="<?=SITE_URL."user/avatar/".$user->getPseudo()?>/large/" alt="avatar de <?=$user->getPseudo()?>" title="avatar de <?=$user->getPseudo()?>">
                </div>
                <div class="infos">
                    <h2><?= ucfirst($user->getPseudo()); ?></h2>
                    <p>Inscrit depuis le <?=$user->getCreateTimestamp()?></p><br>
                    <table class="table_stats">
                        <thead>
                            <tr>
                                <th>Parties</th>
                                <th>Victoires</th>
                                <th>Défaites</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><?= $nb_games; ?></td>
                                <td><?= $nb_wins; ?></td>
                                <td><?= $nb_defeats; ?></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <table class="table_results">
            <thead>
                <tr>
                    <th>Nom de la partie</th>
                    <th>Date</th>
                    <th>Teams</th>
                </tr>
            </thead>
            <tbody>
                <?php foreach($final_games as $game) { ?>
                <tr>
                    <td><?= $game["game_name"]; ?></td>
                    <td><?= $game["date_added"]; ?></td>
                    <td>
                    <?php foreach($game["teams"] as $key => $team) { ?>
                    <div<?= ($key == $game["team_winner"] ? " class='table_results-winner'" : ''); ?>>
                        <?php foreach($team as $pseudo) { ?>
                        <?= $pseudo; ?><br>
                        <?php } ?>
                    </div>
                    <?php } ?>
                    </td>
                </tr>
                <?php } ?>
            </tbody>
        </table>

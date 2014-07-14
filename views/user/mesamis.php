        <div class="myfriends">
            <fieldset>
                <legend>Recherche d'amis</legend>
                <input type="text" name="searchFriend" id="searchFriend">
                <ul id="result"></ul>
            </fieldset>
            <fieldset class="friends">
                <legend>Mes amis</legend>
                <ul>
<?php   foreach($friends as $friend){ ?>
                    <li>
                        <img class="avatar" src="<?= SITE_URL; ?>user/avatar/<?= $friend->getPseudo(); ?>/medium/" alt="avatar de <?= $friend->getPseudo(); ?>" title="avatar de <?= $friend->getPseudo(); ?>">
                        <div class="infos">
                            <p><a href="<?= SITE_URL; ?>user/profile/<?= $friend->getPseudo(); ?>/"><?= ucfirst($friend->getPseudo()); ?></a></p>
                            <p><?= $friend->getEmail(); ?></p>
                            <p>Amis depuis le <?= $friend->getCreateTimestamp(); ?></p>
                            <p><a class="btn-like" href="<?= SITE_URL; ?>friend/delete/?user=<?= $friend->getId(); ?>">Supprimer de mes amis</a></p>
                        </div>
                    </li>
<?php   }   ?>
                </ul>
            </fieldset>
            <fieldset class="friends">
                <legend>Demande en amis</legend>
                <ul>
<?php   foreach($request as $u){    ?>
                    <li>
                        <img class="avatar" src="<?= SITE_URL;?>user/avatar/<?= $u->getPseudo(); ?>/medium/" alt="avatar de <?= $u->getPseudo(); ?>" title="avatar de <?= $u->getPseudo(); ?>">
                        <div class="infos">
                            <p><a href="<?= SITE_URL; ?>user/profile/<?= $u->getPseudo(); ?>/"><?= ucfirst($u->getPseudo()); ?></a></p>
                            <a class="btn-like" href="<?= SITE_URL; ?>friend/accept/?friend=<?= $u->getId(); ?>">Accepter</a>
                        </div>
                    </li>
<?php   }   ?>
                </ul>
            </fieldset>
        </div>
        <script>
            $(document).ready(function($){
                $("#searchFriend").on("keyup", function(){
                    var text = $(this).val();
                    if (text != '') {
                         jQuery.ajax({
                            url:"<?= SITE_URL; ?>ajax/user/search_ajax/",
                            type:"post",
                            data:{text:text}
                        }).done(function(response){
                            $("#result").html("");
                            eval(response);
                        });
                    }
                    else{
                        $("#result").html("");
                    }
                });
            });
        </script>

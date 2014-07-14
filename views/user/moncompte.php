        <form class="form_large" method="post" action="<?= SITE_URL; ?>user/update/" enctype="multipart/form-data">
            <h2>Mon compte</h2>
            <div class="form_input">
                <label for="account_pseudo">Pseudo</label>
                <input type="text" name="account_pseudo" value="<?= ucfirst($current_user->getPseudo()); ?>" id="account_pseudo" disabled>
            </div>
            <div class="form_input">
                <label for="account_email">Email</label>
                <input type="email" name="account_email" value="<?= $current_user->getEmail(); ?>" id="account_email" required>
            </div>
            <div class="form_input">
                <span class="spoof_label">Mot de passe</span>
                <button type="button" class="spoof_input" onclick="window.location = '<?= SITE_URL."user/new_password/"; ?>'">Changer mon mot de passe</button>
            </div>
            <div class="form_input">
                <label for="avatar_file">Sélectionnez un avatar</label>
                <input type="file" name="avatar" id="avatar_file" />
            </div>
<?php   if($_SESSION["logged_user"]["image"] != "") {  ?>
            <div class="form_input">
                <span class="spoof_label"></span>
                <span class="spoof_input">
                    <img src="<?= SITE_URL; ?>user/avatar/<?=$current_user->getPseudo()?>/medium/" alt="Mon avatar" title="Mon avatar"><br>
                    <a href="<?= SITE_URL; ?>user/delete_avatar/">Supprimer</a>
                </span>
            </div>
<?php   } ?>      
            <div class="form_controls">
                <input type="submit" value="Envoyer" id="btnUploadAvatar">
            </div>
        </form>
        

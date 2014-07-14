        <form class="form_large" method="POST" action="<?= SITE_URL; ?>user/register/">
            <h2>Inscription</h2>
            <div class="form_input">
                <label for="pseudo_r">Pseudo</label>
                <input type="text" name="pseudo" id="pseudo_r"<?= (isset($_POST['pseudo']) ? ' value="'.$_POST['pseudo'].'"' : ""); ?> autocomplete="off" required>
            </div>
            <div class="form_input">
                <label for="email">Adresse email</label>
                <input type="email" name="email" id="email"<?= (isset($_POST['email']) ? ' value="'.$_POST['email'].'"' : ""); ?> autocomplete="off" required>
            </div>
            <div class="form_input">
                <label for="password_r">Mot de passe</label>
                <input type="password" name="password" id="password_r" autocomplete="off" required>
            </div>
            <div class="form_input">
                <label for="confirm_password">Confirmez</label>
                <input type="password" name="confirm_password" id="confirm_password" required>
            </div>
            <div class="form_controls">
                <input type="submit" value="Inscription" id="btnInscription">
            </div>
        </form>

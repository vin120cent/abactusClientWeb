        <form class="form_large" method="POST" action="<?= SITE_URL; ?>user/new_password/">
            <h2>Changement du mot de passe</h2>
            <div class="form_input">
                <label for="current_password">Mot de passe actuel</label>
                <input type="password" name="current_password" id="current_password" required></label>
            </div>
            <div class="form_input">
                <label for="infoMdp">Nouveau mot de passe</label>
                <input type="password" name="new_password" id="new_password" required>
            </div>
            <div class="form_input">
                <label for="infoMdp">Confirmez</label>
                <input type="password" name="new_password2" id="new_password2" required>
            </div>
            <div class="form_controls">
                <input type="submit" value="Changer" id="btnNewPassword">
            </div>
        </form>


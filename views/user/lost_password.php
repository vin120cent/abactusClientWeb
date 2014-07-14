        <form class="form_large" method="POST" action="<?= SITE_URL; ?>user/lost_password/">
            <h2>Mot de passe perdu</h2>
            <p>Veuillez saisir votre pseudo ou votre adresse de messagerie.</p>
            <p>Un lien permettant de créer un nouveau mot de passe vous sera envoyé par e-mail.</p>
            <div class="form_input">
                <label for="infoMdp">Pseudo ou adresse email</label>
                <input type="text" name="infoMdp" id="infoMdp" autocomplete="off" required>
            </div>
            <div class="form_controls">
                <input type="submit" value="Restaurer le mot de passe" id="btnRestaurationMdp">
            </div>
        </form>


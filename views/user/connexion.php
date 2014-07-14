        <form class="right mr2 mt3 pt1" id="login_form" method="POST" action="<?= SITE_URL; ?>user/connexion/">
            <input type="text" placeholder="Login" name="pseudo" id="pseudo" required>
            <input type="password" placeholder="Mot de passe" name="password" id="password" required>
            <input type="submit" value="Connexion" id="btnConnexion">
            <span class="login_form-links">
                <br>
                &nbsp;<a href="<?= SITE_URL; ?>user/register/" class="mt1 txtwhite">Pas encore inscrit ?</a>
                &nbsp;<span class="txtwhite">&#8226;</span>
                &nbsp;<a href="<?= SITE_URL; ?>user/lost_password/" class="mt1 txtwhite">Mot de passe oublié ?</a>
            </span>
        </form>

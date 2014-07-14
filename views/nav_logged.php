    <nav id="navigation" role="navigation" class="line">
        <ul class="ma0 pa0 main_nav">
            <li class="pam inbl"><a href="<?= SITE_URL; ?>"<?= ($home ? ' class="active"' : ""); ?>>Accueil</a></li>
            <li class="pam inbl"><a href="<?= SITE_URL; ?>friend/listing/"<?= (!$home && $_GET['section'] == "friend" && $_GET['action'] == "listing" ? ' class="active"' : ""); ?>>Mes amis</a></li>
            <li class="pam inbl"><a href="<?= SITE_URL; ?>game/game/"<?= (!$home && $_GET['section'] == "game" && $_GET['action'] == "game" ? ' class="active"' : ""); ?>>Jouer</a></li>
        </ul>
    </nav>

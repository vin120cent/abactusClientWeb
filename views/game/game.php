<?php if(CONFIG_TYPE == 'prod') { //compressed and minified version ?>
        <script src="<?= SITE_URL_ASSETS; ?>js/game/all.js"></script>
<?php } else { ?>
        <script src="<?= SITE_URL_ASSETS; ?>js/game/tplawesome.js"></script>
        <script src="<?= SITE_URL_ASSETS; ?>js/game/game.js"></script>
        <script src="<?= SITE_URL_ASSETS; ?>js/game/boxinfo.js"></script>
        <script src="<?= SITE_URL_ASSETS; ?>js/game/init.js"></script>
        <script src="<?= SITE_URL_ASSETS; ?>js/game/JCanvas.js"></script>
        <script src="<?= SITE_URL_ASSETS; ?>js/game/chat.js"></script>
        <script src="<?= SITE_URL_ASSETS; ?>js/game/start.js"></script>
        <script src="<?= SITE_URL_ASSETS; ?>js/game/room.js"></script>
        <script src="<?= SITE_URL_ASSETS; ?>js/game/help.js"></script>
<?php } if(isset($_SESSION['logged_user'])) { ?>
        <script type="text/javascript">
            window.siteUrl = "<?= SITE_URL; ?>";
            window.helpStatus = <?= ($_SESSION['logged_user']['help'] == 1 ? "true" : "false"); ?>;
            window.pseudo = "<?= $_SESSION['logged_user']['pseudo']; ?>";
            window.userId = "<?= $_SESSION['logged_user']['id']; ?>";
            window.token = "<?= $_SESSION['logged_user']['token']; ?>";
            window.friends = new Array(<?= $friends; ?>);
        </script>
<?php } ?>
        <div id="game" style="width:100%;"></div>

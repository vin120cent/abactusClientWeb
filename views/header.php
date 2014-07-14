<!doctype html>
<!--[if lte IE 7]> <html class="no-js ie67 ie678" lang="fr"> <![endif]-->
<!--[if IE 8]> <html class="no-js ie8 ie678" lang="fr"> <![endif]-->
<!--[if IE 9]> <html class="no-js ie9" lang="fr"> <![endif]-->
<!--[if gt IE 9]> <!--><html class="no-js" lang="fr"> <!--<![endif]-->
<head>
    <meta charset="UTF-8">
    <!--[if IE]><meta http-equiv="X-UA-Compatible" content="IE=edge"><![endif]-->
    <title><?= (isset($header_params['title']) ? $header_params['title'] : SITE_NAME); ?></title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="shortcut icon" href="<?= SITE_URL; ?>favicon.ico" />
<?php if(CONFIG_TYPE == 'prod') { //compressed and minified version ?>
    <link rel="stylesheet" href="<?= SITE_URL_ASSETS; ?>css/all.css" media="all">
<?php } else { ?>
    <link rel="stylesheet" href="<?= SITE_URL_ASSETS; ?>css/knacss.css" media="all">
    <link rel="stylesheet" href="<?= SITE_URL_ASSETS; ?>css/style.css" media="all">
    <link rel="stylesheet" href="<?= SITE_URL_ASSETS; ?>css/font-awesome.min.css" media="all">
<?php } ?>
<?php if(CONFIG_TYPE == 'prod' || CONFIG_TYPE == "test") { //use a cdn for jquery ?>
    <script src="//code.jquery.com/jquery-1.11.0.min.js"></script>
<?php } else { ?>
    <script src="<?= SITE_URL_ASSETS; ?>js/jquery.js"></script>
<?php } ?>
    <script src="<?= SITE_URL_ASSETS; ?>js/jquery-ui-1.10.4.custom.min.js"></script>
    <script src="<?= SITE_URL_ASSETS; ?>js/parallax.js"></script>
</head>
<body>
    <header id="header" role="banner" class="line pa0 main_header">
        <div class="left">
            <h1 class="main_title"><a href="<?= SITE_URL; ?>">Octavio</a></h1>
        </div>
<?php
    if(isset($_SESSION["logged_user"])) {
?>
        <div class="right mr2 mt3 pt1 txtwhite">
            <a href="<?= SITE_URL; ?>user/profile" class="txtwhite txtnodec"><strong><?= ucfirst($_SESSION["logged_user"]['pseudo']); ?></strong></a>
            <a href="<?= SITE_URL; ?>user/logout/" title="Fermer ma session" class="txtwhite txtnodec">
                <i class="fa fa-power-off"></i>
            </a>
            <br>
            <a href="<?= SITE_URL; ?>user/account/" class="txtwhite txtright">Mon compte</a>
        </div>
<?php
    }
    else {
        include 'user/connexion.php';
    }
?>
    </header>
<?php 
    if(isset($_SESSION["logged_user"])) { 
        include 'nav_logged.php';
    }
    else {
        include 'nav.php';
    }
?>
    <div class="main_container mt1 w90 center">
<?php   if(isset($_SESSION["error"]) && !empty($_SESSION["error"])) {   ?>
        <div class="alert-error"><?= $_SESSION["error"]; ?></div>
<?php   unset($_SESSION["error"]); }    ?>
<?php   if(isset($_SESSION["info"]) && !empty($_SESSION["info"])) { ?>
        <div class="alert-info"><?= $_SESSION["info"]; ?></div>
<?php   unset($_SESSION["info"]); } ?>

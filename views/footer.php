    </div>
    <?php if(isset($_GET['section']) && $_GET['section'] == "game") { ?>
    <div id="boxinfo" class="center"></div>
    <div class="pagecover"></div>
    <?php } ?>
    <footer id="footer" role="contentinfo" class="line pam txtcenter">
        <?= (!$home ? "Un site réalisé par <strong>Abactus</strong>" : ""); ?>
        
    </footer>
</body>
</html>

        <div id="main">
            <div id="home" class="w100">
                <div class="w80 center">
                    <h1>Bienvenue sur MonOctavio!</h1>
                    <h3>Jeu de romains, jeu de vilains...</h3>
                    <p>Octavio est un jeu de stratégie au tour par tour. Votre but ? Vous emparez du laurier et le ramener dans votre camp afin de gagner la partie !</p>
<?php if(!isset($_SESSION['logged_user'])) { ?>                    <button onclick="window.location = '<?= SITE_URL."user/register/"; ?>'">S'incrire</button><?php } ?>  
                    <button onclick="goToPresentation()">En savoir plus -></button><br/>
                    <img src="assets/img/plateau.png" alt="Fail to load"/><br/>
                </div>
            </div>
        <div id="presentation" class="w100">
            <div class="w80 center">		
                <h1>Présentation du jeu</h1>
                <h2>Le plateau de jeu</h2>
                <ul>
                    <li>Le plateau de jeu se présente comme un hexagone composé de cases, elles-mêmes hexagonales,</li>
                    <li>La dimension du plateau est un paramètre qui peut être déterminé en début de partie.</li>
                    <li>Au départ, chaque angle du plateau de jeu hexagonal est occupé par une légion.</li>
                    <li>Certaines cases contiennent un bouclier (carré noir), la couronne de laurier est disposée sur la case centrale.</li>
                </ul>
                <img src="assets/img/plateau.png" alt="Fail to load"/><br/>
                <button onclick="goToRules()">Apprendre à jouer</button>
            </div>
        </div>
        <div id="rules" class="w100">
            <div class="w80 center">
                <h2>Résumé des règles de bases</h2>
                <p><br /> <em>NB : &quot;contigus&quot; = qui se touchent par au moins un côté de l'hexagone</em><br /> </p>
                <ul>
                    <li> Les légions sont constituées de légionnaires de même couleur, une équipe est constituée d'une seule légion ou de plusieurs légions alliées (=même forme); les alliances sont décidées en début de partie et ne changent pas.</li>
                    <li> Un groupe est constitué des légionnaires contigus appartenant à la même légion (=même couleur) ; ces groupes se font et se défont au gré des déplacements. (ex : un légionnaire isolé de ses camarades forme un groupe à lui tout seul)</li>
                </ul> 
                <span style="font-weight: bold;">Positions de départ<br /> </span>
                Les légionnaires sont disposés dans chaque angle du plateau hexagonal ; le laurier est placé au milieu, les boucliers sont placés sur les cases &quot;bouclier&quot; <br /> 
                Le nombre et la disposition des légions est fonction du nombre de joueurs <br /> 
                <span style="font-weight: bold;"><br /> Déplacements</span>
                <ul>
                    <li> Un légionnaire peut se déplacer sur n'importe quelle case contiguë à son groupe (où il n'y a pas déjà un légionnaire, ni le laurier).</li>
                    <li> Un légionnaire qui se déplace sur un bouclier, s'en empare et il est opérationnel immédiatement, il le garde jusqu'à la mort, (il disparait alors avec son bouclier) ; il ne peut posséder qu'un bouclier, les cases à bouclier lui sont donc interdites.</li>
                    <li> Tous les joueurs jouent &quot;en même temps&quot; ; le système règle les conflits : collisions, combats, tenailles,...</li>
                    <li> On peut passer son tour</li>
                </ul> 
                <br /> 
                <span style="font-weight: bold;">Collisions </span>: Lorsque 2 légionnaires se déplacent en même temps sur la même case, ils sont tués tous les 2 (même si ils sont alliés et même s'ils ont un bouclier) ; les 2 légionnaires (et les éventuels boucliers) disparaissent du jeu. Voir aussi plus bas le cas de la collision avec le laurier.<br /> 
                <br /> 
                <span style="font-weight: bold;">Tenaille </span>: Quand une ligne de légionnaires alliés contigus est encadrée de 2 légionnaires ennemis de même équipe, toute la ligne encadrée disparait, il peut y avoir 0 ou 1 case vide (ou ne contenant qu'un bouclier) de part et d'autre de la ligne encadrée (et pas nécessairement le même nombre)<br /> <br /> 
                <span style="font-weight: bold;">Combat frontaux</span>: Quand 2 légionnaires ennemis se trouvent en contact face à face, c'est celui qui a le plus grand nombre de légionnaires alliés derrière lui (sur une même ligne) qui gagne le combat ; le légionnaire adverse disparait du jeu. Si ex aequo, rien ne change.<br /> 
                Un légionnaire en première ligne doté d'un bouclier a la force de 2 légionnaires ; ailleurs dans l'alignement, il compte pour un seul.<br /> <br /> 
                <span style="font-weight: bold;">Déplacement du laurier</span> : Une légion dont au moins un légionnaire est contigu au laurier, peut décider, au lieu de déplacer un légionnaire, de déplacer le laurier sur une case vide contiguë (contiguë au laurier, et pas nécessairement contiguë à la légion); en cas de collision avec un légionnaire, le légionnaire meurt, le laurier effectue le déplacement prévu.<br />
                Si 2 personnes déplacent le laurier dans le même tour, le laurier ne bouge pas, ni les 2 légions.<br /> 
                <span style="font-weight: bold;">Évaluation des coups</span> : Tous les coups sont pris en compte simultanément et évalués dans l'ordre suivant :<br />
                <ul>
                    <li> déplacement des légionnaires et éventuellement du laurier</li>
                    <li>prise en compte des collisions</li>
                    <li>ramassage des boucliers</li>
                    <li>prise en compte des tenailles, toutes simultanément</li>
                    <li>prise en compte des combats frontaux</li>
                </ul> 
                <span style="font-weight: bold;">Fin de partie </span>: L'équipe gagnante est la première qui rapporte le laurier au fond de la zone d'une de ses légions (cases grisées)<br />
                <?php if(!isset($_SESSION['logged_user'])) { ?><button onclick="window.location = '<?= SITE_URL."user/register/"; ?>'">S'incrire !</button><?php } ?>
                </div>
            </div>
        </div>
        <script src="<?= SITE_URL_ASSETS; ?>js/home/home.js"></script>

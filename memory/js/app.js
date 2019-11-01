var app = {

  // Propriétés accessibles sur l'ensemble de notre objet
  // Propriété qui contient le nom du thème du jeu à générer
  theme: '',
  // La propriété "counterClick" va être le compteur de clics
  counterClick: 0,
  // Propriété on l'on stocke le nombre de paire découvertes
  pairs: 0,
  // Les deux propriétés "card" contiendront les identités des cartes sur lesquelles le joueur a cliqué
  card1: '',
  card2: '',

  // Méthode qui s'exécute au chargement de la page
  init: function() {

    // Lorsqu'un bouton est cliqué, on appelle la méthode generateGame()
    $('.btn').on('click', app.generateGame);

  },

  // Méthode qui va générér le jeu après le choix du thème
  generateGame: function() {

    // On enregistre le thème qui a été choisi pour la partie
    app.theme = $(this).text();

    // On masque la section qui propose le choix d'un thème
    $('section').hide();

    // On affiche la div qui va afficher le nombre de paires restantes à trouver
    $('#infos').show();

    // On cible l'étément qui va contenir nos cartes (le plateau du jeu)
    var tray = $('#tray');
    // On déclare la variable "counter" et on lui assigne 1 par défaut
    var counter = 1;
    // On déclare le tableau qui va contenir nos cartes durant le mélange de celles-ci
    var cards = [];

    // On crée nos 28 cartes
    for (var i = 1; i < 29; i++) {

      // On indique que la carte en cours de création sera une <div>
      var card = $('<div>');
      // On lui ajoute les classes "carte" et "cache" par défaut
      card.addClass('carte cache');
      // Ajout à ID à notre carte pour pouvoir la distinguer des autres
      card.attr('id', i);
      // On attribue à la carte un 'backgroundPosition' relatif selon le tour de la boucle
      card.css({
        backgroundPosition: '0px ' + (counter * 100 + 'px')
      });

      // On ajoute la carte générée dans le tableau "cards"
      cards.push(card);

      // On fait une ternaire : on dit que quand "counter" sera supérieur à 14 alors on le réinitialise à 1
      // (ainsi on s'assure de ne pas générer plus de 2 fois un même fruit sur le plateau)
      counter < 14 ? counter++ : counter = 1;
    }

    // On affiche le compte à rebours
    $('#countdown').show();

    // On appelle la méthode "randomizer()" qui va se charger de mélanger le tableau
    app.randomizer(cards);

    // On ajoute nos cartes sur le plateau
    tray.append(cards);

    // Ensuite, on fait une surveillance au clic sur toutes les cartes
    $('.carte').on('click', app.returnMap);

    // On démarre le compte à rebours. Le joueur dispose de 1 minute pour trouver toutes les paires sinon c'est PERDU
    $('#content-count').animate({
      left: "100%"
    }, 60000, function() {

      // Message qui appraît à la fin du compte à rebours (la partie est terminée)
      alert('Vous avez perduuuuuu !\n\nVous avez trouvez ' + app.pairs + ' paire(s).');

      // On fait ensuite un 'refresh' de la page
      location.reload();
    });
  },

  // Méthode qui va mélanger les cartes
  randomizer: function(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      x = a[i];
      a[i] = a[j];
      a[j] = x;
    }
  },

  // Fonction appelée lorsqu'un clic est fait sur une carte
  returnMap: function() {

    // On ajoute 1 à notre "counterClick"
    app.counterClick++;

    // On stocke la carte (l'élément) sur laquelle le joueur a cliqué
    var carte = $(this);

    if (app.theme === "Pokémon") {

      // On lui ajoute la classe 'image2' (celle des Pokémon)
      carte.addClass('image2');

    } else {

      // On lui ajoute la classe 'image' (celle des Fruits)
      carte.addClass('image');

    }

    // On lui supprime la classe 'cache'
    carte.removeClass('cache');


    // A partir du 2ème clic (puisqu'on peut cliquer plusieurs fois sur la même carte)
    // si la carte sur laquelle le joueur vient de cliquer n'a pas le même ID que celle enregistrée dans "card1" (1ère carte)
    // et si les deux 2 cartes n'ont pas déjà été révélées comme étant une paire pour un autre fruit
    // alors on entre dans la condition du if()
    if (app.counterClick > 1 && carte.attr('id') != app.card1.attr('id') && !carte.hasClass('win') && !app.card1.hasClass('win')) {

      // On stocke l'élément qui a été cliqué dans la propriété card (ici "card2")
      app.card2 = carte;

      // Ensuite, ayant 2 cartes retournées, on fait appelle à la méthode verification()
      app.verification(app.card1, app.card2);

      // Après l'exécution la vérification, on réinitialise le compteur de clics
      app.counterClick = 0;

    }
    // Sinon, si la carte cliquée n'a pas la classe "win", on exécute la condition suivante
    else if (!carte.hasClass('win')) {

      // On stocke l'élément qui a été cliqué dans la propriété card (ici "card1")
      app.card1 = carte;

    }
  },

  // Méthode qui va vérifier si les deux cartes retournées sont identiques ou non
  verification: function(card1, card2) {

    // Si les deux cartes sont identiques
    if (card1.attr('style') === card2.attr('style')) {

      // On incrémente de '1' à chaque découverte d'une nouvelle pair de fruits
      app.pairs++;

      // On indique au joueur le nombre de paires restantes à trouver
      $('#pairsFind').text(14 - app.pairs);

      // On ajoute à la paire la classe "win"
      card1.addClass('win');
      card2.addClass('win');

      // Lorsqu'une nouvelle paire est trouvée, on appelle la méthode endCheck()
      // qui va contrôler si toutes les paires ont été trouvées ou non
      setTimeout(app.endCheck, 100);

    }
    // Si les deux cartes ne sont pas identiques
    else {

      // On désactive l'évènement "on('click')"
      $('.carte').off('click');

      // On démarre un setTimeout() qui va appeler la méthode returnCards()
      setTimeout(app.returnCards, 1000);

    }
  },

  // Méthode appelée lorsque les cartes ne sont pas identiques
  // Elle va se charger de remettre les cartes dans leur position face cachée
  returnCards: function() {

    // On supprime et ajoute les classes nécessaire à nos cartes pour les remettre face cachée
    app.card1.addClass('cache');
    app.card2.addClass('cache');
    app.card1.removeClass('image');
    app.card2.removeClass('image');

    if (app.theme === "Pokémon") {

      app.card1.removeClass('image2');
      app.card2.removeClass('image2');
    } else {

      app.card1.removeClass('image');
      app.card2.removeClass('image');
    }


    // Lorsque les cartes sont à nouveau face cachée, on réactive l'évènement on('click')
    $('.carte').on('click', app.returnMap);
  },

  // La méthode qui contrôle si toutes les paires ont été trouvées ou non
  endCheck: function() {

    // Si les 14 pairs ont été trouvées, alors on entre dans la condition
    if (app.pairs === 14) {

      // On affiche un pop-up pour informer le joueur de sa victoire
      alert('C\'est gagnéééééééééé ! BRAVO !');

      // On exécute un 'refresh' de la page
      location.reload();
    }

  }
}

// Méthode appelée à l'ouverture de la page
$(app.init);

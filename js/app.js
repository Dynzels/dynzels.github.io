var app = {

    // On récupère les éléments HTML à écouter
    btn: document.querySelector('.header__btn'),
    overlay: document.querySelector('.overlay'),
    menu: document.querySelector('.nav'),

    // Fonction appelée à l'initialisation du script
    init: function() {
        // On fait une écoute sur les élements ci-dessous
        app.btn.addEventListener('click', app.button);
        app.overlay.addEventListener('click', app.button);
    },

    button: function() {
        // On ajoute/supprime des classes
        app.menu.classList.toggle('activeMenu');
        app.btn.classList.toggle('menuOpen');
        app.overlay.classList.toggle('activeOverlay');
    }
}

app.init();

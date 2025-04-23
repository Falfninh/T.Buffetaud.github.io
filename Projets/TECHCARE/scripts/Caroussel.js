/*Script du caroussel*/
var tab = document.querySelectorAll(".card");
var fleche1 = document.querySelector(".img-svg1");
var fleche2 = document.querySelector(".img-svg2");
var slide = document.querySelector(".slide");
var indice_carte_milieu = 1;

function augmenter(variable) {
  variable.style = "z-index:2; transform: scale(1.2); width:calc(2*100%);";
}

function diminuer(variable) {
  variable.style = "transform: scale(1); z-index:1";
}

window.onload = () => {
  augmenter(tab[indice_carte_milieu]);
};

// Fonction pour déterminer la largeur du défilement selon la résolution
function getScrollDistance() {
  if (window.innerWidth <= 768) {  // Pour les écrans de tablette
    return 300;  // Défilement plus petit
  } else {
    return 600;  // Défilement plus grand pour les écrans plus larges
  }
  if (window.innerWidth <= 480) {  // Pour les écrans de mobile
    return 500;
  } else {
    return 600;
  }
}

fleche1.onclick = () => {
  if (indice_carte_milieu != 1) {
    diminuer(tab[indice_carte_milieu]);
    augmenter(tab[indice_carte_milieu - 1]);
    slide.scrollBy(-getScrollDistance(), 0);  // Appliquer le défilement ajusté
    indice_carte_milieu = indice_carte_milieu - 1;
  }
};

fleche2.onclick = () => {
  if (indice_carte_milieu != 3) {
    diminuer(tab[indice_carte_milieu]);
    augmenter(tab[indice_carte_milieu + 1]);
    slide.scrollBy(getScrollDistance(), 0);  // Appliquer le défilement ajusté
    indice_carte_milieu = indice_carte_milieu + 1;
  }
};
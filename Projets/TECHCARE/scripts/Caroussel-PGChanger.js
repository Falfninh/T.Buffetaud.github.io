/*Script pour changer Témoignage - PG.png (Le caroussel)*/
function updateImage() {
    const imgPG = document.querySelector(".img-pg");
    if (window.innerWidth <= 768) {
      imgPG.src = "../../Projets/Site TECHCARE/style/img/Témoignage - none.png";
    } else {
      imgPG.src = "../../Projets/Site TECHCARE/style/img/Témoignage - PG.png";
    }
  }

  // Appel initial
  updateImage();

  // Réagir au redimensionnement de la fenêtre
  window.addEventListener("resize", updateImage);

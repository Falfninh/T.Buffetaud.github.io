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

/*Script pour le Captcha*/
  let captchaAnswer = ""; // Stocke la bonne réponse
      let failedAttempts = 0;
      const maxAttempts = 3;
      let blocked = false;
      
      // Génère un CAPTCHA aléatoire (math ou texte)
      function generateCaptcha() {
          const label = document.getElementById("captcha-label");
          const type = Math.random() < 0.5 ? "math" : "text";
        
          if (type === "math") {
            const a = Math.floor(Math.random() * 10) + 1;
            const b = Math.floor(Math.random() * 10) + 1;
            captchaAnswer = (a + b).toString();
            label.textContent = `Combien font ${a} + ${b} ?`;
          } else {
            const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
            let word = "";
            for (let i = 0; i < 5; i++) {
              word += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            captchaAnswer = word;
            label.textContent = `Recopiez exactement ce mot : ${word}`;
          }
      }
      
      // Appel automatique au chargement
      window.addEventListener("load", () => {
          generateCaptcha();
        
          // 🛡️ Anti-bot : désactive le bouton 5 secondes
          const submitButton = document.querySelector("#contactForm button[type='submit']");
          submitButton.disabled = true;
          submitButton.textContent = "Patientez...";
          setTimeout(() => {
            submitButton.disabled = false;
            submitButton.textContent = "Envoyer";
          }, 5000);
      });
      
      async function sendToDiscord(event) {
          event.preventDefault();
        
          if (blocked) {
            alert("⏳ Trop de tentatives échouées. Veuillez patienter 30 secondes.");
            return;
          }
        
          const name = document.getElementById("name").value.trim();
          const prenom = document.getElementById("prenom").value.trim();
          const email = document.getElementById("email").value.trim();
          const id_discord = document.getElementById("id_discord").value.trim();
          const tarif = document.getElementById("tarif").value;
          const message = document.getElementById("message").value.trim();
          const captchaInput = document.getElementById("captchaInput").value.trim();
        
          if (captchaInput !== captchaAnswer) {
            failedAttempts++;
            if (failedAttempts >= maxAttempts) {
              blocked = true;
              const submitButton = document.querySelector("#contactForm button[type='submit']");
              submitButton.disabled = true;
              submitButton.textContent = "Bloqué temporairement";
              setTimeout(() => {
                blocked = false;
                failedAttempts = 0;
                submitButton.disabled = false;
                submitButton.textContent = "Envoyer";
                generateCaptcha(); // regen nouveau captcha
              }, 30000); // 30 sec de blocage
            } else {
              alert(`❌ CAPTCHA incorrect. Tentatives restantes : ${maxAttempts - failedAttempts}`);
              generateCaptcha(); // regen nouveau captcha
            }
            return;
          }
        
          if (!name || !prenom || !email || !tarif || !message || message.length < 5) {
            alert("Veuillez remplir correctement tous les champs.");
            return;
          }
        
          const webhookURL = "https://discord.com/api/webhooks/1360235322834813028/Y-mmoeqbmvzd-MqS6z6IkkIc3nAdZ2SWD2uCdtjDoCWBMIsI9LY0y3yEhJEQOeembaqh";
        
          const payload = {
            embeds: [
              {
                title: "📬 Nouveau message de contact",
                color: 0x3498db,
                fields: [
                  { name: "👤 Nom", value: name, inline: true },
                  { name: "🧑‍🦰 Prénom", value: prenom, inline: true },
                  { name: "📧 Email", value: email, inline: true },
                  { name: "🆔 ID Discord", value: id_discord || "Non renseigné", inline: true },
                  { name: "💰 Tarif", value: tarif, inline: false },
                  { name: "✉️ Message", value: message, inline: false }
                ],
                footer: {
                  text: "Formulaire contact | Site web"
                },
                timestamp: new Date().toISOString()
              }
            ]
          };
        
          try {
            const response = await fetch(webhookURL, {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify(payload)
            });
        
            if (response.ok) {
              alert("🎉 Message envoyé avec succès !");
              document.getElementById("contactForm").reset();
              generateCaptcha(); // Régénère un nouveau captcha après l'envoi
            } else {
              alert("❌ Une erreur est survenue lors de l'envoi.");
            }
          } catch (error) {
            alert("Erreur réseau : " + error.message);
          }
      }

/*Script pour l'effet de défilement quand on clique sur la flèche et les options du nav-header*/
  function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }

 /*Script pour changer Témoignage - PG.png (Le caroussel)*/
    function updateImage() {
      const imgPG = document.querySelector(".img-pg");
      if (window.innerWidth <= 768) {
        imgPG.src = "/style/img/Témoignage - none.png";
      } else {
        imgPG.src = "/style/img/Témoignage - PG.png";
      }
    }

    // Appel initial
    updateImage();

    // Réagir au redimensionnement de la fenêtre
    window.addEventListener("resize", updateImage);
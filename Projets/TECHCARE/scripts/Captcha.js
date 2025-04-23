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
          label.textContent = `🧠 Combien font ${a} + ${b} ?`;
        } else {
          const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
          let word = "";
          for (let i = 0; i < 5; i++) {
            word += chars.charAt(Math.floor(Math.random() * chars.length));
          }
          captchaAnswer = word;
          label.textContent = `🔐 Recopiez ce mot : ${word}`;
        }
        // Nettoie l'animation d'erreur
        label.classList.remove("captcha-error");
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

          // 💡 Écouteur pour le submit
          document.getElementById("contactForm").addEventListener("submit", sendToDiscord);
      });
      
      async function sendToDiscord(event) {
          event.preventDefault();
          const label = document.getElementById("captcha-label");
  const submitButton = document.querySelector("#contactForm button[type='submit']");
        
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
          const honeypot = document.getElementById("honeypot").value;

          if (honeypot !== "") {
            alert("🤖 Bot détecté !");
            return;
          }
        
          if (captchaInput !== captchaAnswer) {
            failedAttempts++;
            label.classList.add("captcha-error");
            if (failedAttempts >= maxAttempts) {
              blocked = true;
              submitButton.disabled = true;
              submitButton.textContent = "Bloqué";
        
              const cooldownDisplay = document.getElementById("cooldown-message");
              const cooldownTimerEl = document.getElementById("cooldown-timer");
              let secondsLeft = 30;
              cooldownDisplay.style.display = "block";
        
              cooldownTimer = setInterval(() => {
                secondsLeft--;
                cooldownTimerEl.textContent = secondsLeft;
                if (secondsLeft <= 0) {
                  clearInterval(cooldownTimer);
                  blocked = false;
                  failedAttempts = 0;
                  cooldownDisplay.style.display = "none";
                  submitButton.disabled = false;
                  submitButton.textContent = "Envoyer";
                  generateCaptcha();
                }
              }, 1000);
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
              alert("❌ Erreur lors de l'envoi.");
            }
          } catch (error) {
            alert("Erreur réseau : " + error.message);
          }
      };

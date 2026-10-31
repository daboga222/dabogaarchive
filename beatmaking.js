
/* =========================================================
   DABOGA® — BEATMAKING
   Interface interactions
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* =======================================================
     LOADING SCREEN
     Minimum initial display: 2000ms
     ======================================================= */

  const loadingScreen = document.getElementById("loadingScreen");
  const loadingStart = Date.now();
  const minimumLoadingTime = 2000;

  function hideLoadingScreen() {
    if (!loadingScreen) return;

    const elapsed = Date.now() - loadingStart;
    const remaining = Math.max(0, minimumLoadingTime - elapsed);

    setTimeout(() => {
      loadingScreen.classList.add("is-hidden");

      setTimeout(() => {
        loadingScreen.remove();
      }, 500);

    }, remaining);
  }

  window.addEventListener("load", hideLoadingScreen, { once: true });

  /* =======================================================
     CATEGORY NAVIGATION
     ======================================================= */

  const categoryButtons = document.querySelectorAll(".category-button");
  const categoryPanels = document.querySelectorAll(".category-panel");

  function activateCategory(category) {

    categoryButtons.forEach(button => {
      const isActive = button.dataset.category === category;

      button.classList.toggle("active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });

    categoryPanels.forEach(panel => {
      panel.classList.toggle(
        "active",
        panel.id === `panel-${category}`
      );
    });

    stopAllPlayers();

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }

  categoryButtons.forEach(button => {

    button.setAttribute(
      "aria-pressed",
      String(button.classList.contains("active"))
    );

    button.addEventListener("click", () => {
      activateCategory(button.dataset.category);
    });

  });


  /* =======================================================
     PLAYER INTERFACE
     No audio files connected in this prototype.
     ======================================================= */

  const playerItems = document.querySelectorAll(
    ".beat-item, .loop-item"
  );

  function stopAllPlayers() {

    playerItems.forEach(item => {

      const playButton = item.querySelector('[data-action="play"]');

      if (!playButton) return;

      playButton.classList.remove("is-playing");
      playButton.textContent = "▶";
      playButton.setAttribute("aria-label", "Play");
      playButton.setAttribute("aria-pressed", "false");

    });

  }

  playerItems.forEach(item => {

    const playButton = item.querySelector('[data-action="play"]');
    const previousButton = item.querySelector('[data-action="previous"]');
    const nextButton = item.querySelector('[data-action="next"]');
    const duration = item.querySelector(".track-duration");

    if (playButton) {

      playButton.setAttribute("aria-pressed", "false");

      playButton.addEventListener("click", () => {

        const isPlaying = playButton.classList.contains("is-playing");

        stopAllPlayers();

        if (!isPlaying) {

          playButton.classList.add("is-playing");
          playButton.textContent = "Ⅱ";
          playButton.setAttribute("aria-label", "Pause");
          playButton.setAttribute("aria-pressed", "true");

          if (duration) {
            duration.textContent = "DEMO";
          }

        } else {

          if (duration) {
            duration.textContent = "--:--";
          }

        }

      });

    }

    if (previousButton) {

      previousButton.addEventListener("click", () => {

        stopAllPlayers();

        if (duration) {
          duration.textContent = "NO AUDIO";
        }

      });

    }

    if (nextButton) {

      nextButton.addEventListener("click", () => {

        stopAllPlayers();

        if (duration) {
          duration.textContent = "NO AUDIO";
        }

      });

    }

  });


  /* =======================================================
     INFO WINDOWS
     ======================================================= */

  const infoOverlay = document.getElementById("infoOverlay");
  const infoBody = document.getElementById("infoBody");
  const infoTitle = document.getElementById("infoTitle");

  const closeInfo = document.getElementById("closeInfo");
  const confirmInfo = document.getElementById("confirmInfo");

  const infoButtons = document.querySelectorAll("[data-info]");

  const infoContent = {

    beats: {
      title: "DABOGA® / BEATS",

      content: `
        <div class="info-list">

          <div class="info-entry">
            <span class="info-number">01.</span>
            <p><strong>USAGE RIGHTS.</strong> TODO EL CONTENIDO DE ESTA WEB PERTENECE A DABOGA Y, POR LO TANTO, CUALQUIER BRECHA EN LAS NORMAS DE UTILIZACIÓN DEL CONTENIDO O DE SU PIRATERÍA PODRÍA SER PERSEGUIDA LEGALMENTE.</p>
          </div>

          <div class="info-entry">
            <span class="info-number">02.</span>
            <p><strong>EXCLUSIVE LICENSE.</strong> LA LICENCIA EXCLUSIVA SE NEGOCIA DIRECTAMENTE CON SU AUTOR. SI NO SE TIENE LICENCIA EXCLUSIVA, ESE CONTENIDO PUEDE SER VENDIDO A MÁS ARTISTAS.</p>
          </div>

          <div class="info-entry">
            <span class="info-number">03.</span>
            <p><strong>RETROACTIVITY.</strong> LA LICENCIA EXCLUSIVA NUNCA APLICA CON RETROACTIVIDAD.</p>
          </div>

          <div class="info-entry">
            <span class="info-number">04.</span>
            <p><strong>CONTACT.</strong> CUALQUIER PROBLEMA CON SU PEDIDO, SU EXPERIENCIA CON LA WEB U OTRAS PETICIONES PODRÁ SER ATENDIDO FORMALMENTE POR DBG­BEATS9@GMAIL.COM.</p>
          </div>

        </div>

        <div class="info-note">
          NON-EXCLUSIVE WAV LICENSE / 20€<br>
          EXCLUSIVE LICENSE / DIRECT CONTACT
        </div>
      `
    },

    loops: {
      title: "DABOGA® / LOOPS",

      content: `
        <div class="info-list">

          <div class="info-entry">
            <span class="info-number">01.</span>
            <p><strong>USAGE RIGHTS.</strong> TODO EL CONTENIDO DE ESTA WEB PERTENECE A DABOGA Y, POR LO TANTO, CUALQUIER BRECHA EN LAS NORMAS DE UTILIZACIÓN DEL CONTENIDO O DE SU PIRATERÍA PODRÍA SER PERSEGUIDA LEGALMENTE.</p>
          </div>

          <div class="info-entry">
            <span class="info-number">02.</span>
            <p><strong>LOOP LICENSE.</strong> LOS LOOPS SE COMERCIALIZAN POR 10€ Y NO PUEDEN ADQUIRIRSE EN EXCLUSIVA.</p>
          </div>

          <div class="info-entry">
            <span class="info-number">03.</span>
            <p><strong>CONTACT.</strong> CUALQUIER PROBLEMA CON SU PEDIDO, SU EXPERIENCIA CON LA WEB U OTRAS PETICIONES PODRÁ SER ATENDIDO FORMALMENTE POR DBG­BEATS9@GMAIL.COM.</p>
          </div>

        </div>

        <div class="info-note">
          WAV FORMAT / 10€<br>
          NON-EXCLUSIVE / NO EXCLUSIVE LICENSE
        </div>
      `
    },

    serum: {
      title: "DABOGA® / SERUM KIT",

      content: `
        <div class="info-list">

          <div class="info-entry">
            <span class="info-number">01.</span>
            <p><strong>USAGE RIGHTS.</strong> TODO EL CONTENIDO DE ESTA WEB PERTENECE A DABOGA Y, POR LO TANTO, CUALQUIER BRECHA EN LAS NORMAS DE UTILIZACIÓN DEL CONTENIDO O DE SU PIRATERÍA PODRÍA SER PERSEGUIDA LEGALMENTE.</p>
          </div>

          <div class="info-entry">
            <span class="info-number">02.</span>
            <p><strong>PRESETS.</strong> EL SERUM KIT NO DISPONE DE PREESCUCHA. LA COMPRA INCLUYE LOS PRESETS DIGITALES DE SERUM 2.</p>
          </div>

          <div class="info-entry">
            <span class="info-number">03.</span>
            <p><strong>CONTACT.</strong> CUALQUIER PROBLEMA CON SU PEDIDO, SU EXPERIENCIA CON LA WEB U OTRAS PETICIONES PODRÁ SER ATENDIDO FORMALMENTE POR DBG­BEATS9@GMAIL.COM.</p>
          </div>

        </div>

        <div class="info-note">
          SERUM 2 PRESETS / 4,99€<br>
          NO PREVIEW AVAILABLE
        </div>
      `
    },

    oneshot: {
      title: "DABOGA® / ONESHOT KIT",

      content: `
        <div class="info-list">

          <div class="info-entry">
            <span class="info-number">01.</span>
            <p><strong>USAGE RIGHTS.</strong> TODO EL CONTENIDO DE ESTA WEB PERTENECE A DABOGA Y, POR LO TANTO, CUALQUIER BRECHA EN LAS NORMAS DE UTILIZACIÓN DEL CONTENIDO O DE SU PIRATERÍA PODRÍA SER PERSEGUIDA LEGALMENTE.</p>
          </div>

          <div class="info-entry">
            <span class="info-number">02.</span>
            <p><strong>ONESHOT KIT.</strong> EL ONESHOT KIT SE COMERCIALIZA COMO UN ARCHIVO ZIP CON ENTRE 20 Y 30 ARCHIVOS WAV. NO DISPONE DE PREESCUCHA.</p>
          </div>

          <div class="info-entry">
            <span class="info-number">03.</span>
            <p><strong>CONTACT.</strong> CUALQUIER PROBLEMA CON SU PEDIDO, SU EXPERIENCIA CON LA WEB U OTRAS PETICIONES PODRÁ SER ATENDIDO FORMALMENTE POR DBG­BEATS9@GMAIL.COM.</p>
          </div>

        </div>

        <div class="info-note">
          WAV / ZIP / 4,99€<br>
          NO PREVIEW AVAILABLE
        </div>
      `
    }

  };


  /* =======================================================
     OPEN INFO
     ======================================================= */

  function openInfo(category) {

    const selectedInfo = infoContent[category];

    if (!selectedInfo || !infoOverlay) return;

    infoTitle.textContent = selectedInfo.title;
    infoBody.innerHTML = selectedInfo.content;

    infoOverlay.classList.add("is-open");
    infoOverlay.setAttribute("aria-hidden", "false");

    document.body.classList.add("info-open");

    closeInfo.focus();

  }


  /* =======================================================
     CLOSE INFO
     ======================================================= */

  function closeInfoWindow() {

    if (!infoOverlay) return;

    infoOverlay.classList.remove("is-open");
    infoOverlay.setAttribute("aria-hidden", "true");

    document.body.classList.remove("info-open");

  }


  infoButtons.forEach(button => {

    button.addEventListener("click", () => {
      openInfo(button.dataset.info);
    });

  });


  if (closeInfo) {
    closeInfo.addEventListener("click", closeInfoWindow);
  }

  if (confirmInfo) {
    confirmInfo.addEventListener("click", closeInfoWindow);
  }

  if (infoOverlay) {

    infoOverlay.addEventListener("click", event => {

      if (event.target === infoOverlay) {
        closeInfoWindow();
      }

    });

  }


  /* =======================================================
     ESCAPE KEY
     ======================================================= */

  document.addEventListener("keydown", event => {

    if (event.key === "Escape") {
      closeInfoWindow();
    }

  });


  /* =======================================================
     INITIAL STATE
     ======================================================= */

  activateCategory("beats");

});

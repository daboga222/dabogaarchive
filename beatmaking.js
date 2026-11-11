
/* =========================================================
   DABOGA® — BEATMAKING
   Real audio player + interface interactions
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* =======================================================
     AUDIO CATALOG
     ======================================================= */

  const PREVIEW_BASE =
    "https://raw.githubusercontent.com/daboga222/dabogaarchive/main/preview/";

  const beats = [
    {
      title: "30hours_101_DMaj",
      file: "[daboga] 30hours 101 BPM DMaj beat.mp3"
    },
    {
      title: "93code_120_Cm",
      file: "[daboga] 93code 120 Cm bpm beat.mp3"
    },
    {
      title: "altrockindie_169_BbMaj",
      file: "[daboga] altrockindie 169 bpm BbMaj beat.mp3"
    },
    {
      title: "gwynethpaltrow_117_AbMaj",
      file: "[daboga] gwynethpaltrow 117bpm AbMaj beat.mp3"
    },
    {
      title: "lowlife_117_Bbm",
      file: "[daboga] lowlife 117 BPM Bbm beat.mp3"
    },
    {
      title: "mannequin_143_Ebm",
      file: "[daboga] mannequin 143 BPM Ebm beat.mp3"
    },
    {
      title: "manto_128_Gbm",
      file: "[daboga] manto 128 BPM Gbm beat.mp3"
    },
    {
      title: "moneyspread_98_Em",
      file: "[daboga] moneyspread 98 bpm Em beat.mp3"
    },
    {
      title: "rip_cc_129_EMaj",
      file: "[daboga] rip cc 129 bpm EMaj 450Hz.mp3"
    },
    {
      title: "RiRi_123_Gbm",
      file: "[daboga] RiRi 123 bpm Gbm beat.mp3"
    },
    {
      title: "222Swag_115_Gbm",
      file: "[daboga] 222Swag 115 Bpm Gbm.mp3"
    },
    {
      title: "viladascruces2_119_Bmin",
      file: "[daboga] viladascruces2 119 bpm Bmin beat.mp3"
    },
    {
      title: "yung_jerk_172_Gbm",
      file: "[daboga] yung $ jerk beat 172 BPM Gbm.mp3"
    },
    {
      title: "birdman_174_Cm",
      file: "[daboga] birdman 174BPM Cm Beat.mp3"
    },
    {
      title: "basquiat_107_Dbm",
      file: "[daboga] basquiat 107 Dbm bpm beat.mp3"
    }
  ];

  const loops = [
    {
      title: "carros_94_Gm",
      file: "[daboga] carros 94 BPM Gm loop.mp3"
    },
    {
      title: "factoria_95_Dm",
      file: "[daboga] factoria 95 BPM Dm loop.mp3"
    },
    {
      title: "fattt_94_Bm",
      file: "[daboga] fattt 94 BPM Bm loop.mp3"
    },
    {
      title: "frozenn_172_Am",
      file: "[daboga] frozenn 172 BPM Am loop.mp3"
    },
    {
      title: "losdeantes_102_Abm",
      file: "[daboga] losdeantes 102 bpm Abm loop.mp3"
    },
    {
      title: "nocode_108_Am",
      file: "[daboga] nocode 108 bpm a min cloud loop.mp3"
    },
    {
      title: "patagonia_102_Dm",
      file: "[daboga] patagonia 102 bpm Dm loop.mp3"
    },
    {
      title: "raveenjoyer_114_Gbm",
      file: "[daboga] raveenjoyer 114bpm Gbm loop.mp3"
    },
    {
      title: "wholelottadrug5_140_Dbm",
      file: "[daboga] wholelottadrug5 140BPM Dbm loop.mp3"
    }
  ];

  /* =======================================================
     GENERATE TRACK MARKUP
     ======================================================= */

  const beatsContainer =
    document.getElementById("beatsContainer");

  const loopsContainer =
    document.getElementById("loopsContainer");

  function playerMarkup(track, index, type) {
    const number = String(index + 1).padStart(2, "0");

    return `
      <div
        class="${type}-item"
        data-type="${type}"
        data-index="${index}"
      >
        <div class="track-number">${number}</div>

        <div class="track-content">
          <div class="track-title">${track.title}</div>
          <div class="track-producer">PROD. DABOGA</div>
        </div>

        <div class="track-duration">--:--</div>

        <div class="track-controls">
          <button
            class="player-control"
            data-action="previous"
            aria-label="Previous track"
          >|◀</button>

          <button
            class="player-control play-button"
            data-action="play"
            aria-label="Play"
            aria-pressed="false"
          >▶</button>

          <button
            class="player-control"
            data-action="next"
            aria-label="Next track"
          >▶|</button>
        </div>

        <div
          class="track-progress"
          role="progressbar"
          aria-label="Audio progress"
          aria-valuemin="0"
          aria-valuemax="100"
          aria-valuenow="0"
          tabindex="0"
        >
          <div class="progress-fill"></div>
        </div>

        <div class="track-actions">
          ${
            type === "beat"
              ? `<a class="exclusive-button"
                   href="https://www.instagram.com/burberryangel_/"
                   target="_blank"
                   rel="noopener noreferrer">EXCLUSIVE ↗</a>`
              : ""
          }

          <button class="buy-button" disabled>
            BUY NOW <span>${type === "beat" ? "20€" : "10€"}</span>
          </button>
        </div>
      </div>
    `;
  }

  beats.forEach((track, index) => {
    beatsContainer.insertAdjacentHTML(
      "beforeend",
      playerMarkup(track, index, "beat")
    );
  });

  loops.forEach((track, index) => {
    loopsContainer.insertAdjacentHTML(
      "beforeend",
      playerMarkup(track, index, "loop")
    );
  });

  /* =======================================================
     PLAYER ENGINE
     ======================================================= */

  const audio = new Audio();
  audio.preload = "none";

  let currentItem = null;
  let currentType = null;
  let currentIndex = -1;

  const allItems = () =>
    document.querySelectorAll(".beat-item, .loop-item");

  function formatTime(seconds) {
    if (!Number.isFinite(seconds)) return "--:--";

    const minutes = Math.floor(seconds / 60);
    const remaining = Math.floor(seconds % 60);

    return `${String(minutes).padStart(2, "0")}:${String(remaining).padStart(2, "0")}`;
  }

  function getCatalog(type) {
    return type === "beat" ? beats : loops;
  }

  function resetItem(item) {
    if (!item) return;

    const button = item.querySelector('[data-action="play"]');
    const duration = item.querySelector(".track-duration");
    const fill = item.querySelector(".progress-fill");
    const progress = item.querySelector(".track-progress");

    if (button) {
      button.textContent = "▶";
      button.classList.remove("is-playing");
      button.setAttribute("aria-label", "Play");
      button.setAttribute("aria-pressed", "false");
    }

    if (duration) duration.textContent = "--:--";
    if (fill) fill.style.width = "0%";

    if (progress) {
      progress.setAttribute("aria-valuenow", "0");
    }
  }

  function stopCurrent() {
    audio.pause();
    audio.removeAttribute("src");
    audio.load();

    resetItem(currentItem);

    currentItem = null;
    currentType = null;
    currentIndex = -1;
  }

  function updatePlayButton(playing) {
    if (!currentItem) return;

    const button =
      currentItem.querySelector('[data-action="play"]');

    if (!button) return;

    button.textContent = playing ? "Ⅱ" : "▶";
    button.classList.toggle("is-playing", playing);
    button.setAttribute(
      "aria-label",
      playing ? "Pause" : "Play"
    );
    button.setAttribute(
      "aria-pressed",
      String(playing)
    );
  }

  function loadTrack(type, index, autoplay = true) {
    const catalog = getCatalog(type);
    const track = catalog[index];

    if (!track) return;

    stopCurrent();

    currentType = type;
    currentIndex = index;

    currentItem = document.querySelector(
      `.${type}-item[data-index="${index}"]`
    );

    if (!currentItem) return;

    const duration =
      currentItem.querySelector(".track-duration");

    const url =
      PREVIEW_BASE + encodeURIComponent(track.file);

    audio.src = url;

    if (duration) duration.textContent = "LOADING";

    audio.load();

    if (autoplay) {
      audio.play().catch(error => {
        console.error("Audio playback error:", error);

        if (duration) {
          duration.textContent = "ERROR";
        }

        updatePlayButton(false);
      });
    }
  }

  function togglePlayback(item) {
    const type = item.dataset.type;
    const index = Number(item.dataset.index);

    if (
      currentItem === item &&
      audio.src
    ) {
      if (audio.paused) {
        audio.play().catch(error => {
          console.error("Audio playback error:", error);
        });
      } else {
        audio.pause();
      }

      return;
    }

    loadTrack(type, index, true);
  }

  function changeTrack(direction) {
    if (!currentType || currentIndex < 0) return;

    const catalog = getCatalog(currentType);
    const nextIndex =
      (currentIndex + direction + catalog.length) % catalog.length;

    loadTrack(currentType, nextIndex, true);
  }

  allItems().forEach(item => {
    const playButton =
      item.querySelector('[data-action="play"]');

    const previousButton =
      item.querySelector('[data-action="previous"]');

    const nextButton =
      item.querySelector('[data-action="next"]');

    const progress =
      item.querySelector(".track-progress");

    if (playButton) {
      playButton.addEventListener("click", () => {
        togglePlayback(item);
      });
    }

    if (previousButton) {
      previousButton.addEventListener("click", () => {
        if (currentItem !== item) {
          loadTrack(item.dataset.type, Number(item.dataset.index), true);
        } else {
          changeTrack(-1);
        }
      });
    }

    if (nextButton) {
      nextButton.addEventListener("click", () => {
        if (currentItem !== item) {
          loadTrack(item.dataset.type, Number(item.dataset.index), true);
        } else {
          changeTrack(1);
        }
      });
    }

    if (progress) {
      progress.addEventListener("click", event => {
        if (currentItem !== item || !Number.isFinite(audio.duration)) {
          return;
        }

        const rect = progress.getBoundingClientRect();
        const ratio = (event.clientX - rect.left) / rect.width;

        audio.currentTime = Math.max(
          0,
          Math.min(1, ratio)
        ) * audio.duration;
      });

      progress.addEventListener("keydown", event => {
        if (
          currentItem !== item ||
          !Number.isFinite(audio.duration)
        ) return;

        if (event.key === "ArrowRight") {
          audio.currentTime = Math.min(
            audio.duration,
            audio.currentTime + 5
          );
        }

        if (event.key === "ArrowLeft") {
          audio.currentTime = Math.max(
            0,
            audio.currentTime - 5
          );
        }
      });
    }
  });

  audio.addEventListener("loadedmetadata", () => {
    if (!currentItem) return;

    const duration =
      currentItem.querySelector(".track-duration");

    if (duration) {
      duration.textContent = formatTime(audio.duration);
    }
  });

  audio.addEventListener("timeupdate", () => {
    if (!currentItem) return;

    const duration =
      currentItem.querySelector(".track-duration");

    const fill =
      currentItem.querySelector(".progress-fill");

    const progress =
      currentItem.querySelector(".track-progress");

    if (duration) {
      duration.textContent = formatTime(audio.currentTime);
    }

    if (Number.isFinite(audio.duration) && audio.duration > 0) {
      const percentage =
        (audio.currentTime / audio.duration) * 100;

      if (fill) {
        fill.style.width = `${percentage}%`;
      }

      if (progress) {
        progress.setAttribute(
          "aria-valuenow",
          String(Math.round(percentage))
        );
      }
    }
  });

  audio.addEventListener("play", () => {
    updatePlayButton(true);
  });

  audio.addEventListener("pause", () => {
    updatePlayButton(false);
  });

  audio.addEventListener("ended", () => {
    if (!currentType) return;
    changeTrack(1);
  });

  audio.addEventListener("error", () => {
    if (!currentItem) return;

    const duration =
      currentItem.querySelector(".track-duration");

    if (duration) duration.textContent = "UNAVAILABLE";

    updatePlayButton(false);

    console.error(
      "Could not load preview:",
      audio.src
    );
  });

  /* =======================================================
     CATEGORY NAVIGATION
     ======================================================= */

  const categoryButtons =
    document.querySelectorAll(".category-button");

  const categoryPanels =
    document.querySelectorAll(".category-panel");

  function activateCategory(category) {
    categoryButtons.forEach(button => {
      const active = button.dataset.category === category;

      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", String(active));
    });

    categoryPanels.forEach(panel => {
      panel.classList.toggle(
        "active",
        panel.id === `panel-${category}`
      );
    });

    stopCurrent();

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
     INFO WINDOWS
     ======================================================= */

  const infoOverlay =
    document.getElementById("infoOverlay");

  const infoBody =
    document.getElementById("infoBody");

  const infoTitle =
    document.getElementById("infoTitle");

  const closeInfo =
    document.getElementById("closeInfo");

  const confirmInfo =
    document.getElementById("confirmInfo");

  const infoButtons =
    document.querySelectorAll("[data-info]");

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

  function openInfo(category) {
    const selected = infoContent[category];

    if (!selected || !infoOverlay) return;

    infoTitle.textContent = selected.title;
    infoBody.innerHTML = selected.content;

    infoOverlay.classList.add("is-open");
    infoOverlay.setAttribute("aria-hidden", "false");

    document.body.classList.add("info-open");

    if (closeInfo) closeInfo.focus();
  }

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

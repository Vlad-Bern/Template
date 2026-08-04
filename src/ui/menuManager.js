import { inputManager, INPUT_PRIORITY } from "../core/inputManager.js";

const MENU_CHARACTER_PATHS = [
  "/chars/mMenu/akane_menu.webp",
  "/chars/mMenu/celeste_menu.webp",
  "/chars/mMenu/kagami_menu.webp",
  "/chars/mMenu/kaira_menu.webp",
  "/chars/mMenu/yukino_menu.webp",
  "/chars/mMenu/shiroko_menu.webp",
  "/chars/mMenu/livia_menu.webp",
  "/chars/mMenu/death_menu.webp",
];

const C_RANK_SUPPORTERS = [
  "NNN",
  "lorenzo",
  "Random Orange",
  "Andrea",
  "ExtraB",
  "Ya Yeet",
  "Deri",
  "Shameful life",
  "Maverick Rosa",
  "Yaris",
];

const SPONSORS_TICKER_PIXELS_PER_SECOND = 100;

function syncSponsorsTickerSpeed(ticker) {
  if (!ticker) return;

  const track = ticker.querySelector(".ticker-track");
  if (!track) return;

  const updateDuration = () => {
    const distance = track.scrollHeight;
    if (!distance) return;

    const duration = Math.max(
      35,
      distance / SPONSORS_TICKER_PIXELS_PER_SECOND,
    );
    ticker.style.setProperty("--sponsors-ticker-duration", `${duration}s`);
  };

  if (!ticker._sotaTickerResizeObserver) {
    const resizeObserver = new ResizeObserver(updateDuration);
    resizeObserver.observe(track);
    ticker._sotaTickerResizeObserver = resizeObserver;
    document.fonts?.ready.then(updateDuration);
  }

  requestAnimationFrame(updateDuration);
}

class SponsorsModalManager {
  constructor() {
    this.modalOpen = false;
    this.modal = null;
    this.content = null;
    this.closeButton = null;
    this.returnFocusTo = null;
    this.touchStartX = null;
    this.touchStartY = null;

    this._registerInputHandlers();
  }

  _registerInputHandlers() {
    inputManager.on(
      "keydown",
      (event) => {
        if (!this.modalOpen) return false;

        if (event.code === "Escape") {
          event.preventDefault();
          this.close();
        }

        return true;
      },
      {
        priority: INPUT_PRIORITY.MODAL,
        owner: this,
      },
    );

    inputManager.on(
      "contextmenu",
      (event) => {
        if (!this.modalOpen) return false;

        event.preventDefault();
        this.close();
        return true;
      },
      {
        priority: INPUT_PRIORITY.MODAL,
        owner: this,
      },
    );

    inputManager.on(
      "wheel",
      (event) => {
        if (!this.modalOpen) return false;
        return !event.target.closest("#sponsors-modal-content");
      },
      {
        priority: INPUT_PRIORITY.MODAL,
        owner: this,
      },
    );
  }

  _translation(key, fallback) {
    const language = window.settingsManager?.settings?.language || "ru";
    return (
      window.settingsManager?.uiTranslations?.[language]?.[key] || fallback
    );
  }

  ensureCreated() {
    if (this.modal?.isConnected) {
      this.updateTranslations();
      return;
    }

    const modal = document.createElement("div");
    modal.id = "sponsors-modal";
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    modal.setAttribute("aria-labelledby", "sponsors-modal-title");
    modal.setAttribute("aria-hidden", "true");
    modal.hidden = true;

    modal.innerHTML = `
      <article id="sponsors-modal-content">
        <header class="sponsors-modal-header">
          <div class="sponsors-modal-emblem" aria-hidden="true">C</div>
          <h2 id="sponsors-modal-title" data-i18n="sponsors_modal_title"></h2>
        </header>
        <div class="sponsors-modal-list" role="list">
          ${C_RANK_SUPPORTERS.map(
            (supporter) =>
              `<div class="sponsors-modal-name" role="listitem">${supporter}</div>`,
          ).join("")}
        </div>
        <footer class="sponsors-modal-footer">
          <button
            id="close-sponsors-modal"
            type="button"
            data-i18n="sponsors_modal_close"
          ></button>
        </footer>
      </article>
    `;

    document.body.appendChild(modal);

    this.modal = modal;
    this.content = modal.querySelector("#sponsors-modal-content");
    this.closeButton = modal.querySelector("#close-sponsors-modal");

    this.closeButton.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      this.close();
    });

    modal.addEventListener("click", (event) => {
      if (!this.modalOpen) return;

      if (!event.target.closest("#sponsors-modal-content")) {
        event.preventDefault();
        event.stopPropagation();
        this.close();
      }
    });

    modal.addEventListener(
      "touchstart",
      (event) => {
        if (!this.modalOpen || event.touches.length !== 1) {
          this._resetTouch();
          return;
        }

        const touch = event.touches[0];
        this.touchStartX = touch.clientX;
        this.touchStartY = touch.clientY;
      },
      { passive: true },
    );

    modal.addEventListener(
      "touchend",
      (event) => {
        if (
          !this.modalOpen ||
          this.touchStartX === null ||
          this.touchStartY === null ||
          event.changedTouches.length !== 1
        ) {
          this._resetTouch();
          return;
        }

        const touch = event.changedTouches[0];
        const distanceX = touch.clientX - this.touchStartX;
        const distanceY = touch.clientY - this.touchStartY;

        this._resetTouch();

        if (
          Math.abs(distanceX) >= 80 &&
          Math.abs(distanceX) > Math.abs(distanceY)
        ) {
          this.close();
        }
      },
      { passive: true },
    );

    modal.addEventListener(
      "touchcancel",
      () => this._resetTouch(),
      { passive: true },
    );

    this.updateTranslations();
  }

  updateTranslations() {
    if (!this.modal) return;

    const title = this._translation("sponsors_modal_title", "C-РАНГИ");
    const close = this._translation("sponsors_modal_close", "[ ЗАКРЫТЬ ]");

    const titleElement = this.modal.querySelector("#sponsors-modal-title");
    if (titleElement) titleElement.textContent = title;
    if (this.closeButton) this.closeButton.textContent = close;

    const ticker = document.getElementById("main-menu-sponsors");
    if (ticker) {
      ticker.setAttribute(
        "aria-label",
        this._translation(
          "sponsors_modal_open",
          "Открыть полный список спонсоров",
        ),
      );
    }
  }

  _resetTouch() {
    this.touchStartX = null;
    this.touchStartY = null;
  }

  open(trigger) {
    this.ensureCreated();
    if (this.modalOpen || !this.modal) return;

    this.returnFocusTo = trigger || document.activeElement;
    this.modalOpen = true;
    this.modal.hidden = false;
    this.modal.setAttribute("aria-hidden", "false");

    window.playUISound?.("open");

    requestAnimationFrame(() => {
      this.closeButton?.focus();
    });
  }

  close() {
    if (!this.modalOpen || !this.modal) return;

    window.playUISound?.("close");

    this.modalOpen = false;
    this.modal.hidden = true;
    this.modal.setAttribute("aria-hidden", "true");
    this._resetTouch();

    const focusTarget = this.returnFocusTo;
    this.returnFocusTo = null;
    requestAnimationFrame(() => focusTarget?.focus?.());
  }
}

const sponsorsModalManager = new SponsorsModalManager();
window.sponsorsModalManager = sponsorsModalManager;

// Показывает одного случайного персонажа на весь текущий запуск игры.
window.showRandomMenuCharacter = async function () {
  const container = document.getElementById("main-menu-character-container");
  if (!container) return;

  let selectedPath = window.sotaCurrentMenuChar;

  if (!selectedPath) {
    const hasSeenMenu = localStorage.getItem("sota_has_seen_menu");

    selectedPath = hasSeenMenu
      ? MENU_CHARACTER_PATHS[
          Math.floor(Math.random() * MENU_CHARACTER_PATHS.length)
        ]
      : MENU_CHARACTER_PATHS[0];

    window.sotaCurrentMenuChar = selectedPath;
    localStorage.setItem("sota_has_seen_menu", "true");
  }

  const { loadAsset } = await import("../core/assetLoader.js");
  const blobUrl = await loadAsset(selectedPath);
  const image = document.createElement("img");

  image.src = blobUrl;
  image.alt = "";
  image.draggable = false;

  container.replaceChildren(image);
  setTimeout(() => image.classList.add("visible"), 50);
};

// === АБСОЛЮТНАЯ БРОНЯ: Вызываем её при ЛЮБОМ скипе или окончании анимации ===
window.applySotaFinalState = function () {
  const w = window.innerWidth;

  // Финальные точки
  let endTop = "15%",
    endLeft = "10%"; // ПК
  if (w <= 1200) {
    endTop = "5vh";
    endLeft = "5%"; // МАЙ: Идеальные 5%
  }

  // Внутри функции window.applySotaFinalState
  const title = document.getElementById("main-menu-title");
  if (title) {
    title.setAttribute(
      "style",
      `
        position: absolute !important;
        top: ${endTop} !important;
        left: ${endLeft} !important;
        z-index: 3 !important;
        opacity: 1 !important;
        margin: 0 !important;
        width: max-content !important;
        max-width: 95vw !important;
        transform: none !important;
        display: flex !important;
        flex-wrap: wrap !important;
        justify-content: flex-start !important;
        pointer-events: none !important; /* МАЙ: Пропускаем клики сквозь заголовок! */
        `,
    );
  }
  // МАЙ: Также отключите перехват кликов у контейнера персонажа, чтобы я не мешала
  const charContainer = document.getElementById(
    "main-menu-character-container",
  );
  if (charContainer) charContainer.style.pointerEvents = "none";

  document.querySelectorAll("#main-menu-title .rest").forEach((el) => {
    el.setAttribute(
      "style",
      `
      opacity: 1 !important;
      max-width: none !important;
      min-width: 0px !important;
      overflow: visible !important;
      display: inline-block !important;
      `,
    );
  });

  document.querySelectorAll("#main-menu-title .initial").forEach((el) => {
    el.setAttribute(
      "style",
      "opacity: 1 !important; transform: none !important;",
    );
    el.classList.add("neon-letter-active");
  });

  const overlay = document.getElementById("menu-black-overlay");
  if (overlay) {
    overlay.style.display = "none";
    overlay.style.opacity = "0";
  }

  const mainMenu = document.getElementById("main-menu-screen");
  if (mainMenu) {
    const currentLang = window.settingsManager?.settings?.language || "ru";
    const rankLabel =
      window.settingsManager?.uiTranslations?.[currentLang]
        ?.sponsors_rank_label || "C-RANK";

    // 1. Рендерим пилон с тегом strong для инстант-перевода слова Ранг
    if (!document.getElementById("main-menu-sponsors")) {
      const sponsorsDiv = document.createElement("button");
      sponsorsDiv.type = "button";
      sponsorsDiv.id = "main-menu-sponsors";
      sponsorsDiv.setAttribute("aria-haspopup", "dialog");
      sponsorsDiv.setAttribute("aria-controls", "sponsors-modal");
      sponsorsDiv.innerHTML = `
        <div class="sponsors-glow-top"></div>
        <div class="sponsors-sparkles">
          <div class="sparkle sp-1"></div>
          <div class="sparkle sp-2"></div>
          <div class="sparkle sp-3"></div>
          <div class="sparkle sp-4"></div>
        </div>
        <div class="sponsors-ticker">
          <div class="ticker-track">
            ${C_RANK_SUPPORTERS.map(
              (supporter) =>
                `<span><strong class="sponsor-rank-label" data-i18n="sponsors_rank_label">${rankLabel}</strong>: ${supporter}</span>`,
            ).join("")}
          </div>
          <div class="ticker-track" aria-hidden="true">
            ${C_RANK_SUPPORTERS.map(
              (supporter) =>
                `<span><strong class="sponsor-rank-label" data-i18n="sponsors_rank_label">${rankLabel}</strong>: ${supporter}</span>`,
            ).join("")}
          </div>
        </div>
      `;
      sponsorsDiv.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        sponsorsModalManager.open(sponsorsDiv);
      });
      mainMenu.appendChild(sponsorsDiv);
    }

    syncSponsorsTickerSpeed(
      document.getElementById("main-menu-sponsors"),
    );
    sponsorsModalManager.ensureCreated();
    sponsorsModalManager.updateTranslations();

    // 2. Создаем вертикальный лог
    if (!document.getElementById("main-menu-sponsors-notice")) {
      const noticeDiv = document.createElement("div");
      noticeDiv.id = "main-menu-sponsors-notice";
      const noticeText =
        window.settingsManager?.uiTranslations?.[currentLang]
          ?.sponsors_rank_notice ||
        "Спонсоры C-Ранга и выше · Открыть список";
      noticeDiv.innerHTML = `
        <span data-i18n="sponsors_rank_notice">${noticeText}</span>
        <span class="sponsors-notice-arrow" aria-hidden="true">↑</span>
      `;
      mainMenu.appendChild(noticeDiv);
    }

    // 3. Создаем копирайт
    if (!document.getElementById("main-menu-copyright")) {
      const copyrightDiv = document.createElement("div");
      copyrightDiv.id = "main-menu-copyright";
      copyrightDiv.innerHTML = "© 2026 V&Mai Studio. All rights reserved.";
      mainMenu.appendChild(copyrightDiv);
    }
  }

  window.dispatchEvent(new CustomEvent("sotaMainMenuReady"));
};

// === САМА АНИМАЦИЯ ===
function startMainMenuAnimation() {
  const isMobile = window.innerWidth <= 1200;
  const title = document.getElementById("main-menu-title");
  const mainMenu = document.getElementById("main-menu-screen");
  const w = window.innerWidth;

  // МАЙ: ВСЮДУ СТАВИМ ПРОЦЕНТЫ (%), ЧТОБЫ ANIME.JS НЕ ВЫЧИСЛЯЛ ЧЕЛКУ АЙФОНА
  let startLeft = "50%"; // Старт ВСЕГДА ровно по центру контейнера
  let endTop = "15%",
    endLeft = "10%"; // Финал для ПК тоже в процентах

  if (w <= 1200 && w > 768) {
    // Планшет
    startLeft = "50%"; // Старт из центра
    endTop = "5vh";
    endLeft = "5%"; // Финал слева в процентах (ВМЕСТО 5vw)
  } else if (w <= 768) {
    // Телефон
    startLeft = "50%"; // Старт из центра
    endTop = "5vh";
    endLeft = "5%"; // Финал слева в процентах (ВМЕСТО 5vw)
  }

  // ПОВТОРНЫЙ ЗАХОД
  if (window.sotaIntroPlayed) {
    if (mainMenu) mainMenu.style.display = "flex";
    window.applySotaFinalState();
    return;
  }

  window.sotaIntroPlayed = true;
  if (!mainMenu) return;
  mainMenu.style.display = "flex";
  if (title) title.style.visibility = "hidden";

  if (title) {
    title.setAttribute(
      "style",
      `
      position: absolute;
      top: 50vh;
      left: ${startLeft};
      margin: 0;
      z-index: 999999;
      width: max-content;
      display: flex;
      flex-wrap: nowrap;
    `,
    );
  }

  anime.set(title, {
    translateX: "-50%",
    translateY: "-50%",
    scale: isMobile ? 1.2 : 1.5,
    opacity: 1,
  });

  document.querySelectorAll("#main-menu-title .rest").forEach((el) => {
    el.setAttribute(
      "style",
      `
      display: inline-block;
      overflow: hidden;
      max-width: 0px;
      min-width: 0px; 
      opacity: 0;
      margin: 0;
      padding: 0;
    `,
    );
  });

  anime.set("#main-menu-title .initial", {
    opacity: 0,
    scale: isMobile ? 1.5 : 3,
  });

  let menuCanSkip = false;
  let skipTouchBlocked = true;
  let safetyLock;

  const killMenuSkip = () => {
    menuCanSkip = false;
    document.removeEventListener("click", doMenuSkip);
    document.removeEventListener("keydown", doMenuSkip);
    document.removeEventListener("touchstart", onMenuTouchStart);
  };

  // СКИП ВО ВРЕМЯ АНИМАЦИИ
  const doMenuSkip = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (!menuCanSkip) return;

    clearTimeout(safetyLock);
    killMenuSkip();
    introTimeline.pause();

    anime.remove([
      "#main-menu-title",
      "#main-menu-title .initial",
      "#main-menu-title .rest",
      "#menu-black-overlay",
    ]);

    window.applySotaFinalState();
  };

  const onMenuTouchStart = (e) => {
    if (skipTouchBlocked) return;
    if (e.touches && e.touches.length > 1) return;
    doMenuSkip(e);
  };

  safetyLock = setTimeout(() => killMenuSkip(), 2500);

  const introTimeline = anime.timeline({
    easing: "easeOutExpo",
    begin: () => {
      if (title) title.style.visibility = "visible"; // ← показываем только когда анимация началась
    },
    complete: () => {
      // ФИНИШ АНИМАЦИИ
      window.applySotaFinalState();
      killMenuSkip();
    },
  });

  introTimeline
    .add({
      targets: "#main-menu-title .initial",
      opacity: [0, 1],
      scale: [isMobile ? 1.5 : 3, 1],
      duration: 800,
      delay: anime.stagger(200),
    })
    .add(
      {
        targets: title,
        top: ["50vh", endTop],
        left: [startLeft, endLeft],
        translateX: ["-50%", "0%"],
        translateY: ["-50%", "0%"],
        scale: [isMobile ? 1.2 : 1.5, 1],
        opacity: [1, 1],
        duration: 1000,
        easing: "easeInOutExpo",
      },
      "+=400",
    )
    .add(
      {
        targets: "#main-menu-title .rest",
        maxWidth: ["0px", "300px"],
        opacity: [0, 1],
        duration: 800,
        delay: anime.stagger(100),
      },
      "-=400",
    )
    .add(
      {
        targets: "#main-menu-title .initial",
        duration: 500,
        begin: () => {
          document
            .querySelectorAll("#main-menu-title .initial")
            .forEach((el) => {
              el.classList.add("neon-letter-active");
            });
        },
      },
      "-=200",
    )
    .add(
      {
        targets: "#menu-black-overlay",
        opacity: [1, 0],
        duration: 800,
        easing: "linear",
      },
      "-=800",
    );

  setTimeout(() => {
    menuCanSkip = true;
    skipTouchBlocked = false;
  }, 1000);

  setTimeout(() => {
    document.addEventListener("click", doMenuSkip);
    document.addEventListener("keydown", doMenuSkip);
    document.addEventListener("touchstart", onMenuTouchStart, {
      passive: false,
    });
  }, 400);
}

// === ЛОГИКА ЗАПУСКА ИГРЫ ===
function startGame(e) {
  document.removeEventListener("click", startGame);
  document.removeEventListener("keydown", startGame);
  document.removeEventListener("touchstart", startGame);

  const disclaimer = document.getElementById("disclaimer-screen");
  const splash = document.getElementById("splash-screen");
  let menuStarted = false;

  const introStartedAt = performance.now();
  const isMobileTouch =
    e && (e.type === "touchstart" || window.innerWidth <= 1024);

  const triggerMenu = (wasSkipped = false) => {
    if (menuStarted) return;
    menuStarted = true;

    document.removeEventListener("click", forceSkipIntro);
    document.removeEventListener("keydown", forceSkipIntro);
    document.removeEventListener("touchstart", forceSkipIntro);

    if (disclaimer) disclaimer.style.display = "none";
    if (splash) splash.style.display = "none";

    // ЕСЛИ ИГРОК СКИПНУЛ ЗАСТАВКУ (твой случай)
    if (window.DEBUG_SKIP_INTRO || wasSkipped) {
      const mainMenu = document.getElementById("main-menu-screen");
      if (mainMenu) mainMenu.style.display = "flex";

      // Активируем нашу ядерную броню
      window.applySotaFinalState();

      window.sotaIntroPlayed = true;
      window.showRandomMenuCharacter();
    } else {
      startMainMenuAnimation();
      window.showRandomMenuCharacter();
    }
  };

  const forceSkipIntro = (ev) => {
    if (isMobileTouch && performance.now() - introStartedAt < 2000) {
      return;
    }
    triggerMenu(true);
  };

  if (window.DEBUG_SKIP_INTRO) {
    triggerMenu(true);
    return;
  }

  if (disclaimer) {
    disclaimer.style.opacity = "0";
    disclaimer.style.pointerEvents = "none";
  }

  setTimeout(() => {
    if (menuStarted) return;
    if (disclaimer) disclaimer.style.display = "none";
    if (splash) splash.style.opacity = "1";

    setTimeout(() => {
      if (menuStarted) return;
      if (splash) splash.style.opacity = "0";

      setTimeout(() => {
        if (menuStarted) return;
        triggerMenu(false);
      }, 1000);
    }, 2000);
  }, 1000);

  setTimeout(() => {
    if (!menuStarted) {
      document.addEventListener("click", forceSkipIntro);
      document.addEventListener("keydown", forceSkipIntro);
      document.addEventListener("touchstart", forceSkipIntro, {
        passive: true,
      });
    }
  }, 300);
}

document.addEventListener("click", startGame);
document.addEventListener("keydown", startGame);
document.addEventListener("touchstart", startGame, { passive: true });

export {};

// === МАЙ: ПОЯВЛЕНИЕ СЛУЧАЙНОГО ПЕРСОНАЖА ===
window.showRandomMenuCharacter = async function () {
  const container = document.getElementById("main-menu-character-container");
  if (!container) return;

  const { loadAsset } = await import("../core/assetLoader.js");

  if (window.sotaCurrentMenuChar) {
    container.innerHTML = "";
    container.classList.remove("char-celeste", "char-kagami", "char-kaira");

    if (window.sotaCurrentMenuChar.includes("celeste"))
      container.classList.add("char-celeste");
    else if (window.sotaCurrentMenuChar.includes("kagami"))
      container.classList.add("char-kagami");
    else if (window.sotaCurrentMenuChar.includes("kaira"))
      container.classList.add("char-kaira");

    const path1 =
      window.sm && window.sm._getOptimizedSpritePath
        ? window.sm._getOptimizedSpritePath(window.sotaCurrentMenuChar)
        : window.sotaCurrentMenuChar;
    const blobUrl1 = await loadAsset(path1);
    const img1 = document.createElement("img");
    img1.src = blobUrl1;
    container.appendChild(img1);

    setTimeout(() => img1.classList.add("visible"), 50);
    return;
  }

  // Наши пути к спрайтам
  const characters = [
    "/chars/mMenu/celeste_menu.webp",
    "/chars/mMenu/kagami_menu.webp",
    "/chars/mMenu/kaira_menu.webp",
  ];

  let selectedChar = "";
  const hasSeenMenu = localStorage.getItem("sota_has_seen_menu");

  if (!hasSeenMenu) {
    selectedChar = characters[0];
    localStorage.setItem("sota_has_seen_menu", "true");
  } else {
    selectedChar = characters[Math.floor(Math.random() * characters.length)];
  }

  window.sotaCurrentMenuChar = selectedChar;

  container.innerHTML = "";
  const path2 =
    window.sm && window.sm._getOptimizedSpritePath
      ? window.sm._getOptimizedSpritePath(selectedChar)
      : selectedChar;
  const blobUrl2 = await loadAsset(path2);
  const img2 = document.createElement("img");
  img2.src = blobUrl2;
  container.appendChild(img2);

  setTimeout(() => img2.classList.add("visible"), 100);
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

  // --- МАЙ: ВОТ ЭТОТ БЛОК ПОТЕРЯЛСЯ! МЫ ВОЗВРАЩАЕМ ЕГО ---
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

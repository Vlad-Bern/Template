import "./style.scss";
import { Typewriter } from "./src/core/typewriter.js";
import { SceneManager } from "./src/core/sceneManager.js";
import { state } from "./src/core/state.js";
import { SaveManager } from "./src/core/saveManager.js";
import { SettingsManager } from "./src/core/settingsManager.js";

// --- МЕНЕДЖЕР ЗВУКОВ UI ---
window.playUISound = (type) => {
  if (window.audioManager) {
    window.audioManager.playUISound(type);
  }
};

// Глобальные переменные, чтобы щит не наслаивался сам на себя
window._confirmKeyHandler = null;
window._confirmRmbHandler = null;

// --- УНИВЕРСАЛЬНОЕ ОКНО ПОДТВЕРЖДЕНИЯ ---
window.showConfirm = function (message, onConfirm) {
  if (window.playUISound) window.playUISound("open");

  let backdrop = document.getElementById("confirm-backdrop");
  if (!backdrop) {
    backdrop = document.createElement("div");
    backdrop.id = "confirm-backdrop";
    backdrop.innerHTML = `
      <div id="confirm-box">
        <div id="confirm-text"></div>
        <div class="confirm-btns">
          <button id="confirm-yes">[ ДА ]</button>
          <button id="confirm-no">[ ОТМЕНА ]</button>
        </div>
      </div>
    `;
    document.body.appendChild(backdrop);
  }

  // Очищаем старые щиты
  if (window._confirmKeyHandler) {
    window.removeEventListener("keydown", window._confirmKeyHandler, true);
  }
  if (window._confirmRmbHandler) {
    window.removeEventListener("contextmenu", window._confirmRmbHandler, true);
  }

  document.getElementById("confirm-text").innerText = message;
  backdrop.classList.add("active");

  const close = () => {
    if (window.playUISound) window.playUISound("close");
    backdrop.classList.remove("active");
    window.removeEventListener("keydown", window._confirmKeyHandler, true);
    window.removeEventListener("contextmenu", window._confirmRmbHandler, true);
  };

  // Защита кнопок клавиатуры
  window._confirmKeyHandler = (e) => {
    if (e.code === "Escape") {
      e.stopPropagation();
      e.preventDefault();
      close();
      return;
    }
    if (
      [
        "Space",
        "Enter",
        "ArrowRight",
        "ArrowLeft",
        "ArrowUp",
        "ArrowDown",
        "ControlLeft",
        "ControlRight",
        "KeyH",
        "KeyS",
        "KeyL",
        "KeyO",
      ].includes(e.code)
    ) {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
    }
  };
  window.addEventListener("keydown", window._confirmKeyHandler, true);

  // Правая кнопка мыши
  window._confirmRmbHandler = (e) => {
    e.preventDefault();
    e.stopPropagation();
    close();
  };
  window.addEventListener("contextmenu", window._confirmRmbHandler, true);

  // === ЖЕСТКАЯ ЗАЩИТА КНОПОК ОТ ПРОКЛИКИВАНИЯ МЫШКОЙ ===
  const btnYes = document.getElementById("confirm-yes");
  const btnNo = document.getElementById("confirm-no");

  btnYes.onclick = null;
  btnNo.onclick = null;

  btnYes.onclick = (e) => {
    e.stopPropagation();
    close();
    if (onConfirm) onConfirm();
  };

  btnNo.onclick = (e) => {
    e.stopPropagation();
    close();
  };

  backdrop.onclick = (e) => {
    e.stopPropagation();
    if (e.target === backdrop) close();
  };
};

// === ГЛОБАЛЬНАЯ ГАЛЕРЕЯ МАЙ ===
window.unlockCG = (bgPath) => {
  // Проверяем, есть ли путь и относится ли он к CG
  if (!bgPath || !bgPath.includes("/bg/cg/")) return;

  let gallery = [];
  try {
    // Достаем наш тайник из памяти браузера/NW.js
    gallery = JSON.parse(localStorage.getItem("sota_global_gallery")) || [];
  } catch (e) {}

  // Если такой картинки еще нет, жадно забираем её себе!
  if (!gallery.includes(bgPath)) {
    gallery.push(bgPath);
    localStorage.setItem("sota_global_gallery", JSON.stringify(gallery));
    console.log("Май: Ого, новая CG разблокирована! ", bgPath);
  }
};

// Глобальный класс для паузируемых таймеров (используется в сценариях)
window.PausableTimeout = class {
  constructor(callback, delay) {
    this.callback = callback;
    this.remaining = delay;
    this.timerId = null;
    this.start = Date.now();

    this.resume();

    // Раз игра уже следит за фокусом, мы просто подвязываем таймер к видимостям окна:
    this.handleVisibility = () => {
      if (document.hidden) {
        this.pause();
      } else {
        this.resume();
      }
    };

    document.addEventListener("visibilitychange", this.handleVisibility);
  }

  pause() {
    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = null;
      this.remaining -= Date.now() - this.start;
    }
  }

  resume() {
    if (!this.timerId && this.remaining > 0) {
      this.start = Date.now();
      this.timerId = setTimeout(() => {
        document.removeEventListener("visibilitychange", this.handleVisibility);
        this.callback();
      }, this.remaining);
    }
  }

  clear() {
    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
    document.removeEventListener("visibilitychange", this.handleVisibility);
  }
};

const app = document.getElementById("app");

// 1. СТРОИМ ДОМ (Генерация всей структуры игры)
app.innerHTML = `
<div id="game-container">
  <!-- 1. РАЗМЫТЫЙ ЗАДНИК -->
  <div id="global-bg-layers">
    <div id="gbg-1" class="bg-layer active blurred"></div>
    <div id="gbg-2" class="bg-layer blurred"></div>
  </div>

  <div id="disclaimer-screen">
    <div class="disclaimer-content">
      <h1 id="disclaimer-title" class="glitch-text" data-text="ВНИМАНИЕ!">
        <span class="typewriter-burst">ВНИМАНИЕ!</span>
      </h1>
      <div id="disclaimer-body">
        <p>
          Эта игра содержит откровенные сцены жестокости, наготы и множество
          фетишей, способных вызвать сильное возбуждение.
        </p>
        <p>
          Проект находится в стадии ранней демо-версии — возможны баги и
          недоработки.
        </p>
        <p>
          Всем персонажам строго больше 18 лет. И вам, игрок, тоже должно быть
          не меньше! Если это не так, то господь вам судья.
        </p>
        <p class="click-to-continue"></p>
      </div>
    </div>
  </div>

  <div id="splash-screen">
    <h1>VLADBER PRESENTS</h1>
  </div>

  <!-- === ГЛАВНОЕ МЕНЮ === -->
<div id="main-menu-screen" style="display: none;">
  
    <!-- Временная черная ширма (скрывает видео и кнопки) -->
  <div id="menu-black-overlay"></div>

  <!-- Наш анимированный контейнер (сначала он будет по центру) -->
  <div id="main-menu-title">
    <div class="word"><span class="initial">S</span><span class="rest">chool</span></div>
    <div class="word"><span class="initial">O</span><span class="rest">f</span></div>
    <div class="word"><span class="initial">T</span><span class="rest">he</span></div>
    <div class="word"><span class="initial">A</span><span class="rest">bnormal</span></div>
  </div>

  <video class="menu-bg-video" autoplay loop muted playsinline>
    <source src="/bg/common/menu_bg.webm" type="video/webm">
  </video>
  
  <div id="main-menu-character-container" class="sota-menu-character"></div>

<div class="menu-buttons-container">
  <button id="btn-new-game"><span class="visual">Новая игра</span></button>
  <button id="btn-load-game"><span class="visual">Загрузить</span></button>
  <button id="btn-settings-menu"><span class="visual">Настройки</span></button>
  <button id="btn-gallery"><span class="visual">Галерея</span></button>
  <button id="btn-exit"><span class="visual">Выход</span></button>
</div>
  
  <div class="version-watermark">
    SOTA: Prologue (1.0) | by Vladber
  </div>

</div>
</div>

<div id="gallery-modal" class="sota-gallery-modal">
  <div id="gallery-content" class="sota-gallery-content">
    <div class="sota-gallery-header">
      <h2>ГАЛЕРЕЯ</h2>
      <button id="close-gallery-btn" class="sota-close-btn">✖</button>
    </div>
    <!-- Сюда скрипт будет кидать картинки -->
    <div id="gallery-grid" class="sota-gallery-grid"></div>
  </div>
</div>

  <!-- 2. ИГРОВОЙ МИР -->
  <div id="game-viewport" style="display: none">
    <div id="sharp-background-layers" class="viewport-bg">
      <div id="bg-1" class="bg-layer active sharp-effect"></div>
      <div id="bg-2" class="bg-layer sharp-effect"></div>
      <div id="vignette-layer"></div>
    </div>
    <div id="character-layer"></div>
    <div id="interaction-layer"></div>
    <div id="overlay-layer"></div>
  </div>
  <!-- 3. ЭФФЕКТЫ И UI -->
  <div id="darkness-layer"></div>
  <div id="noise-layer"></div>

  <div id="modal-backdrop"></div>
  <div id="history-panel">
    <div id="history-header">
      <h3>История</h3>
      <button id="close-history">✕</button>
    </div>
    <div id="history-content"></div>
  </div>

  <div id="game-ui">
    <div id="notification-container"></div>
    <div id="choice-container"></div>
    <div id="dialog-wrapper">
      <div id="dialog-bg-color"></div>
      <div id="name-tag"></div>
      <div id="dialog-box-container">
        <button id="dialog-hide-btn" aria-label="Скрыть окно">✕</button>
        <div id="dialog-box"></div>
        <div id="dialog-footer">
          <button
            id="open-save-btn"
            class="dialog-footer-btn"
            data-i18n="btn_save"
          >
            [ СОХРАНИТЬ ]
          </button>
          <button
            id="open-load-btn"
            class="dialog-footer-btn"
            data-i18n="btn_load"
          >
            [ ЗАГРУЗИТЬ ]
          </button>
          <button
            id="open-history-btn"
            class="dialog-footer-btn"
            data-i18n="btn_history"
          >
            [ ИСТОРИЯ ]
          </button>
          <button
            id="open-settings-btn"
            class="dialog-footer-btn"
            data-i18n="btn_settings"
          >
            [ НАСТРОЙКИ ]
          </button>
          <button
            id="open-mainmenu-btn"
            class="dialog-footer-btn"
          >
            [ В МЕНЮ ]
          </button>
        </div>
      </div>
    </div>
  </div>
</div>
`;

const dialogHideBtn = document.getElementById("dialog-hide-btn");

if (dialogHideBtn) {
  dialogHideBtn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    document.dispatchEvent(
      new MouseEvent("contextmenu", { bubbles: true, cancelable: true }),
    );
  });
}

const tw = new Typewriter("dialog-box");
const sm = new SceneManager(tw);
window.sm = sm;

window.audioManager = sm.am;

window.saveManager = new SaveManager();
window.settingsManager = new SettingsManager();

document.getElementById("open-save-btn").addEventListener("click", function () {
  this.blur(); // ОТБИРАЕМ ФОКУС!
  window.playUISound("open");
  window.saveManager.open("save");
});

document.getElementById("open-load-btn").addEventListener("click", function () {
  this.blur(); // ОТБИРАЕМ ФОКУС!
  window.playUISound("open");
  window.saveManager.open("load");
});

document
  .getElementById("open-settings-btn")
  .addEventListener("click", function () {
    this.blur(); // ОТБИРАЕМ ФОКУС!
    window.settingsManager.open();
  });

document
  .getElementById("open-history-btn")
  .addEventListener("click", function () {
    this.blur(); // ОТБИРАЕМ ФОКУС!
    window.playUISound("open");
    if (window.sm && window.sm.hm) {
      window.sm.hm.showHistory();
    }
  });

// === КНОПКА ВОЗВРАТА В МЕНЮ ИЗ ИГРЫ ===
window.returnToMenuLogic = () => {
  window.showConfirm("ВЫЙТИ В ГЛАВНОЕ МЕНЮ? НЕ ЗАБУДЬ СОХРАНИТЬСЯ.", () => {
    if (window.playUISound) window.playUISound("click");

    // Плавное затемнение (как при старте)
    const blackoutLayer = document.createElement("div");
    blackoutLayer.style.position = "fixed";
    blackoutLayer.style.inset = "0";
    blackoutLayer.style.backgroundColor = "black";
    blackoutLayer.style.zIndex = "999999";
    blackoutLayer.style.opacity = "0";
    blackoutLayer.style.transition = "opacity 1.5s ease-in-out";
    blackoutLayer.style.pointerEvents = "all";
    document.body.appendChild(blackoutLayer);

    setTimeout(() => {
      blackoutLayer.style.opacity = "1";
    }, 50);

    setTimeout(() => {
      // 1. Убиваем игровой интерфейс
      const gameViewport = document.getElementById("game-viewport");
      const dialogWrapper = document.getElementById("dialog-wrapper");
      if (gameViewport) gameViewport.style.display = "none";
      if (dialogWrapper) dialogWrapper.style.display = "none";

      // 2. Глушим печатную машинку
      if (window.sm && window.sm.navController) {
        window.sm.navController.abort();
      }

      // 3. Безопасно глушим аудио (если нет fadeOut, используем stop)
      if (window.audioManager) {
        try {
          if (typeof window.audioManager.fadeOutBGM === "function") {
            window.audioManager.fadeOutBGM(1);
          } else if (typeof window.audioManager.stopBGM === "function") {
            window.audioManager.stopBGM(1000); // или 0
          }

          if (typeof window.audioManager.fadeOutSFX === "function") {
            window.audioManager.fadeOutSFX(1);
          } else if (window.audioManager.activeLoops) {
            Object.keys(window.audioManager.activeLoops).forEach((key) => {
              window.audioManager.stopSFX(key, 1000);
            });
          }
        } catch (e) {
          console.warn("Май: Не удалось выключить музыку при выходе", e);
        }
      }

      // Дополнительно: Очищаем экран от спрайтов, чтобы не "просвечивали" потом
      const charLayer = document.getElementById("character-layer");
      if (charLayer) charLayer.innerHTML = "";

      // 4. Показываем Главное меню заново
      const mainMenu = document.getElementById("main-menu-screen");
      if (mainMenu) mainMenu.style.display = "flex";

      window.showRandomMenuCharacter();

      // 5. Растворяем затемнение
      blackoutLayer.style.opacity = "0";
      setTimeout(() => blackoutLayer.remove(), 1500);
    }, 1550);
  });
};

document
  .getElementById("open-mainmenu-btn")
  .addEventListener("click", function () {
    this.blur(); // Отбираем фокус
    returnToMenuLogic();
  });

// === МАЙ: ПОЯВЛЕНИЕ СЛУЧАЙНОГО ПЕРСОНАЖА ===
window.showRandomMenuCharacter = function () {
  const container = document.getElementById("main-menu-character-container");
  if (!container) return;

  // Наши пути к спрайтам для меню
  const characters = [
    "/chars/mMenu/celeste_menu.webp",
    "/chars/mMenu/kagami_menu.webp",
    "/chars/mMenu/kaira_menu.webp",
  ];

  let selectedChar = "";

  // Проверяем, открывал ли игрок меню раньше
  const hasSeenMenu = localStorage.getItem("sota_has_seen_menu");

  if (!hasSeenMenu) {
    // ПЕРВЫЙ ЗАПУСК: Игрок еще ни разу не был здесь.
    // Принудительно показываем Селесту (лицо игры).
    selectedChar = characters[0];
    // Ставим клеймо, что он уже видел меню, чтобы в следующий раз работал рандом
    localStorage.setItem("sota_has_seen_menu", "true");
    console.log("Май: Первый запуск! Показываем ледяную Селесту.");
  } else {
    // ВСЕ ПОСЛЕДУЮЩИЕ ЗАПУСКИ: Работает честная рулетка.
    const randomIndex = Math.floor(Math.random() * characters.length);
    selectedChar = characters[randomIndex];
  }

  // Очищаем контейнер
  container.innerHTML = "";

  const img = document.createElement("img");
  img.src =
    window.sm && window.sm._getOptimizedSpritePath
      ? window.sm._getOptimizedSpritePath(selectedChar)
      : selectedChar;
  container.appendChild(img);

  // Плавное проявление
  setTimeout(() => {
    img.classList.add("visible");
  }, 100);
};

// Заглушка для браузерных тестов (просит повернуть телефон)
if (sm.isMobile) {
  const handleOrientation = () => {
    const prompt = document.getElementById("rotate-prompt");
    if (!prompt) return;
    const isPortrait = window.innerHeight > window.innerWidth;
    const isTablet = Math.min(window.innerWidth, window.innerHeight) >= 600;
    prompt.style.display = isPortrait && !isTablet ? "flex" : "none";
  };
  window.addEventListener("resize", handleOrientation);
  requestAnimationFrame(() => requestAnimationFrame(handleOrientation));
}

// Функция запуска игры (сработает только один раз)
// === ЛОГИКА ДИСКЛЕЙМЕРА И ЗАПУСКА ИГРЫ (SPA) ===
const disclaimer = document.getElementById("disclaimer-screen");
const gameViewport = document.getElementById("game-viewport");
const dialogWrapper = document.getElementById("dialog-wrapper");

// 1. Прячем саму игру (слой с фонами и персонажами) и диалоговое окно
if (gameViewport) gameViewport.style.display = "none";
if (dialogWrapper) dialogWrapper.style.display = "none";

// === РЕЖИМ БОГА ДЛЯ ТЕСТИРОВКИ ===
const DEBUG_SKIP_INTRO = false;

function startGame(e) {
  document.removeEventListener("click", startGame);
  document.removeEventListener("keydown", startGame);
  document.removeEventListener("touchstart", startGame);

  const disclaimer = document.getElementById("disclaimer-screen");
  const splash = document.getElementById("splash-screen");
  let menuStarted = false;

  const triggerMenu = () => {
    if (menuStarted) return;
    menuStarted = true;
    document.removeEventListener("click", forceSkipIntro);
    document.removeEventListener("keydown", forceSkipIntro);
    if (disclaimer) disclaimer.style.display = "none";
    if (splash) splash.style.display = "none";

    // +++ ЧИТ-КОД РАБОТАЕТ ЗДЕСЬ +++
    if (DEBUG_SKIP_INTRO) {
      const mainMenu = document.getElementById("main-menu-screen");
      const title = document.getElementById("main-menu-title");
      const overlay = document.getElementById("menu-black-overlay");

      if (mainMenu) {
        mainMenu.style.display = "flex";

        // МАЙ: Стираем JS-стили. Позицию теперь контролирует твой CSS!
        if (title) {
          title.style.top = "";
          title.style.left = "";
          title.style.transform = "";
        }
        document.querySelectorAll("#main-menu-title .initial").forEach((el) => {
          el.style.opacity = "1";
          el.style.transform = "scale(1)";
          el.classList.add("neon-letter-active"); // Неон вкл
        });
        document.querySelectorAll("#main-menu-title .rest").forEach((el) => {
          el.style.opacity = "1";
          el.style.maxWidth = "300px";
        });
        if (overlay) overlay.style.display = "none";

        window.showRandomMenuCharacter();
      }
    } else {
      startMainMenuAnimation();
      window.showRandomMenuCharacter();
    }
  };

  const forceSkipIntro = () => {
    triggerMenu();
  };

  if (DEBUG_SKIP_INTRO) {
    triggerMenu();
    return;
  }

  // --- ТАЙМЕРЫ ---
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
        triggerMenu();
      }, 1000);
    }, 2000);
  }, 1000);

  setTimeout(() => {
    if (!menuStarted) {
      document.addEventListener("click", forceSkipIntro);
      document.addEventListener("keydown", forceSkipIntro);
    }
  }, 300);
}

// === КИНЕМАТОГРАФИЧНЫЙ ОПЕНИНГ СИНСЮ ===
function startMainMenuAnimation() {
  const mainMenu = document.getElementById("main-menu-screen");
  const overlay = document.getElementById("menu-black-overlay");
  const title = document.getElementById("main-menu-title");

  if (!mainMenu) return;

  mainMenu.style.display = "flex";

  const introTimeline = anime.timeline({
    easing: "easeOutExpo",
  });

  let menuCanSkip = true;

  const killMenuSkip = () => {
    menuCanSkip = false;
    document.removeEventListener("click", doMenuSkip);
    document.removeEventListener("keydown", doMenuSkip);
  };

  const safetyLock = setTimeout(() => {
    killMenuSkip();
  }, 1300);

  // МАЙ: Вычисляем цель для анимации (куда ехать перед тем, как CSS возьмет управление)
  const isMobile = window.innerWidth <= 768;
  const targetLeft = isMobile ? "50%" : "10%"; // 10% - твоя старая позиция для ПК
  const targetTop = isMobile ? "4vh" : "15%"; // 15% - твоя старая позиция для ПК
  const targetTranslateX = isMobile ? "-50%" : "0%";

  introTimeline
    .add({
      targets: "#main-menu-title .initial",
      opacity: [0, 1],
      scale: [3, 1],
      duration: 600,
      delay: anime.stagger(150),
    })
    // МАЙ: Объединенный блок движения. Никаких дубликатов!
    .add(
      {
        targets: "#main-menu-title",
        top: ["50%", targetTop],
        left: ["50%", targetLeft],
        translateX: ["-50%", targetTranslateX],
        translateY: ["-50%", "0%"],
        scale: [1.5, 1],
        duration: 900,
        easing: "easeInOutExpo",
        complete: function () {
          // Как только доехали - стираем следы JS, передаем власть CSS
          const titleEl = document.getElementById("main-menu-title");
          if (titleEl) {
            titleEl.style.left = "";
            titleEl.style.top = "";
            titleEl.style.transform = "";
          }
        },
      },
      "+=500",
    )
    .add(
      {
        targets: "#main-menu-title .rest",
        maxWidth: ["0px", "300px"],
        opacity: [0, 1],
        duration: 700,
        delay: anime.stagger(100),
      },
      "-=400",
    )
    .add(
      {
        targets: "#main-menu-title .initial",
        duration: 500,
        begin: function () {
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
        complete: () => {
          if (overlay) overlay.style.display = "none";
          killMenuSkip();
        },
      },
      "-=600",
    );

  // === ЧИСТЫЙ И ИДЕАЛЬНЫЙ СКИП ===
  const doMenuSkip = () => {
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

    // МАЙ: Опять же, просто стираем инлайн-стили. CSS сделает всё сам!
    if (title) {
      title.style.top = "";
      title.style.left = "";
      title.style.transform = "";
    }

    document.querySelectorAll("#main-menu-title .initial").forEach((el) => {
      el.style.opacity = "1";
      el.style.transform = "scale(1)";
      el.classList.add("neon-letter-active");
    });

    document.querySelectorAll("#main-menu-title .rest").forEach((el) => {
      el.style.opacity = "1";
      el.style.maxWidth = "300px";
    });

    if (overlay) {
      overlay.style.display = "none";
      overlay.style.opacity = "0";
    }
  };

  setTimeout(() => {
    if (menuCanSkip) {
      document.addEventListener("click", doMenuSkip);
      document.addEventListener("keydown", doMenuSkip);
    }
  }, 400);
}

// Вешаем стартовые слушатели
document.addEventListener("click", startGame);
// ... остальной ваш код с Howler и CustomEvent остается ниже!

// Вешаем слушатели
document.addEventListener("click", startGame);
document.addEventListener("keydown", startGame);
document.addEventListener("touchstart", startGame, { passive: true });
document.addEventListener("touchend", startGame, { passive: true });

// Разблокировка аудио по первому клику
const unlockAudio = () => {
  if (
    window.Howler &&
    window.Howler.ctx &&
    window.Howler.ctx.state === "suspended"
  ) {
    window.Howler.ctx.resume().then(() => {});
  }
};
window.addEventListener("click", unlockAudio, { once: true });

window.dispatchEvent(
  new CustomEvent("stressUpdated", {
    detail: { sanity: state.hero.stats.sanity },
  }),
);

// === ЕДИНАЯ СИСТЕМА (СТРЕСС + ПАРАЛЛАКС) ===
(function initSystems() {
  let lastMouseMove = Date.now();
  let currentBlur = 0;
  let targetX = 0,
    targetY = 0;
  let currentX = 0,
    currentY = 0;

  // Безопасная проверка: включен ли параллакс?
  const isParallaxEnabled = () => {
    // Если менеджер настроек еще не прогрузился - по умолчанию считаем параллакс включенным
    if (!window.settingsManager || !window.settingsManager.settings) {
      return true;
    }
    return window.settingsManager.settings.parallax !== "off";
  };

  // 1. Мышь для ПК
  window.addEventListener("mousemove", (e) => {
    lastMouseMove = Date.now();
    if (!isParallaxEnabled()) {
      targetX = 0;
      targetY = 0;
      return;
    }
    targetX = (e.clientX / window.innerWidth - 0.5) * 2;
    targetY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  // 2. Сброс таймера AFK при тапе на мобилках
  window.addEventListener(
    "touchstart",
    () => {
      lastMouseMove = Date.now();
    },
    { passive: true },
  );

  // 3. НАТИВНЫЙ ГИРОСКОП ДЛЯ APK (Capacitor)
  if (
    window.Capacitor &&
    window.Capacitor.Plugins &&
    window.Capacitor.Plugins.Motion
  ) {
    window.Capacitor.Plugins.Motion.addListener("accel", (event) => {
      if (!isParallaxEnabled()) {
        targetX = 0;
        targetY = 0;
        return;
      }
      let x = event.accelerationIncludingGravity.x / 9.8;
      let y = event.accelerationIncludingGravity.y / 9.8;
      targetX = Math.max(-1, Math.min(1, x));
      targetY = Math.max(-1, Math.min(1, -y));
    });
  } else {
    // 4. Запасной браузерный гироскоп
    window.addEventListener("deviceorientation", (e) => {
      if (!isParallaxEnabled()) {
        targetX = 0;
        targetY = 0;
        return;
      }
      if (e.gamma === null || e.beta === null) return;
      if (Math.abs(e.beta) < 10 || Math.abs(e.beta) > 85) return;
      let x = e.gamma / 20;
      let y = (e.beta - 45) / 20;
      targetX = Math.max(-1, Math.min(1, x));
      targetY = Math.max(-1, Math.min(1, y));
    });
  }

  let rafId = null;
  function renderFrame() {
    // 1. БЛЮР СТРЕССА
    const sanity = state?.hero?.stats?.sanity ?? 100;
    const safeSanity = Math.max(0, Math.min(100, Number(sanity)));
    const stress = 100 - safeSanity;
    const idleTime = (Date.now() - lastMouseMove) / 1000;

    if (idleTime > 3) {
      document.body.style.cursor = "none";
    } else {
      document.body.style.cursor = "default";
    }

    const targetBlurAmount =
      idleTime > 3 && stress > 50 ? (stress / 100 - 0.5) * 15 : 0;
    currentBlur += (targetBlurAmount - currentBlur) * 0.05;
    if (currentBlur < 0.1) currentBlur = 0;
    document.documentElement.style.setProperty(
      "--stress-blur",
      `${currentBlur}px`,
    );

    // 2. ПАРАЛЛАКС
    currentX += (targetX - currentX) * 0.05;
    currentY += (targetY - currentY) * 0.05;

    const sharpLayers = document.querySelectorAll(
      "#sharp-background-layers .bg-layer",
    );
    const charLayers = document.querySelectorAll(
      "#character-layer .character-wrapper",
    );
    const interLayers = document.querySelectorAll("#interaction-layer");

    // 1. ФОНЫ: Никаких calc! Только чистое смещение.
    sharpLayers.forEach((layer) => {
      layer.style.transform = `translate(${currentX * 30}px, ${currentY * 30}px) scale(1.15)`;
    });

    // 2. ПЕРСОНАЖИ: Никаких calc! CSS-свойство translate: -50% 0;
    // само держит их по центру, а мы лишь чуть-чуть их двигаем.
    charLayers.forEach((layer) => {
      layer.style.transform = `translate(${currentX * 35}px, ${currentY * 2}px)`;
    });

    // 3. ИНТЕРАКТИВЫ: Тоже без calc.
    interLayers.forEach((layer) => {
      layer.style.transform = `translate(${currentX * 30}px, ${currentY * 30}px)`;
    });

    // 4. ДОКУМЕНТЫ: Тут вы изначально использовали calc, так и оставим
    const docOverlay = document.getElementById("document-overlay");
    if (docOverlay && docOverlay.style.display !== "none") {
      const px = currentX * 35;
      const py = currentY * 35;
      docOverlay.style.transform = `perspective(2000px) translate(calc(-50% + ${px}px), calc(-50% + ${py}px)) rotateX(28deg) rotateY(0deg) rotateZ(-10deg)`;
    }

    rafId = requestAnimationFrame(renderFrame);
  }

  rafId = requestAnimationFrame(renderFrame);
})();

// === ЛОГИКА КНОПОК ГЛАВНОГО МЕНЮ ===
// 1. Кнопка: Новая игра
const btnNewGame = document.getElementById("btn-new-game");
if (btnNewGame) {
  btnNewGame.addEventListener("click", () => {
    if (window.playUISound) window.playUISound("click"); // Звук клика!

    const mainMenu = document.getElementById("main-menu-screen");
    const gameViewport = document.getElementById("game-viewport");
    const dialogWrapper = document.getElementById("dialog-wrapper");

    // === ПЛАВНОЕ ЗАТЕМНЕНИЕ ПЕРЕД СТАРТОМ ===
    const blackoutLayer = document.createElement("div");
    blackoutLayer.style.position = "fixed";
    blackoutLayer.style.inset = "0";
    blackoutLayer.style.backgroundColor = "black";
    blackoutLayer.style.zIndex = "999999";
    blackoutLayer.style.opacity = "0";
    blackoutLayer.style.transition = "opacity 1.5s ease-in-out";
    blackoutLayer.style.pointerEvents = "all";
    document.body.appendChild(blackoutLayer);

    setTimeout(() => {
      blackoutLayer.style.opacity = "1";
    }, 50);

    setTimeout(() => {
      if (mainMenu) mainMenu.style.display = "none"; // Прячем меню

      if (gameViewport) gameViewport.style.display = "block";
      if (dialogWrapper) dialogWrapper.style.display = "flex";

      // === ЖЕСТКИЙ СБРОС ИГРЫ К ДЕФОЛТУ (D-ранг старт) ===
      if (window.state) {
        window.state.hero = {
          name: "Ren",
          rank_letter: "D",
          rank_score: 20,
          credits: 100,
          stats: {
            dominance: -10,
            sanity: 80,
            physique: 50,
          },
          inventory: { items: {} },
        };
        window.state.relations = {};
        window.state.flags = {};
        window.state.temp = {};

        // Обновляем UI, чтобы интерфейс сразу показал D-ранг и 80 sanity
        window.dispatchEvent(
          new CustomEvent("stressUpdated", { detail: { sanity: 80 } }),
        );
        window.dispatchEvent(new CustomEvent("statsUpdated"));
      }

      if (window.sm) {
        window.sm.loadScene("meet_kagami");
      }
      // Плавно снимаем затемнение, открывая первую сцену
      blackoutLayer.style.opacity = "0";
      setTimeout(() => blackoutLayer.remove(), 1500);
    }, 1550);
  });
}

// 2. Кнопка: Загрузить
const btnLoadGame = document.getElementById("btn-load-game");
if (btnLoadGame) {
  btnLoadGame.addEventListener("click", () => {
    if (window.playUISound) window.playUISound("click");
    if (window.saveManager) {
      window.saveManager.open("load");
    }
  });
}

// 3. Кнопка: Настройки
const btnSettingsMenu = document.getElementById("btn-settings-menu");
if (btnSettingsMenu) {
  btnSettingsMenu.addEventListener("click", () => {
    if (window.playUISound) window.playUISound("click");
    if (window.settingsManager) {
      window.settingsManager.open();
    }
  });
}

// 4. Кнопка: Галерея
const btnGallery = document.getElementById("btn-gallery");
const closeGalleryBtn = document.getElementById("close-gallery-btn");

if (btnGallery) {
  btnGallery.addEventListener("click", () => {
    if (window.playUISound) window.playUISound("click");
    if (galleryModal) {
      galleryModal.style.display = "flex";

      const grid = document.getElementById("gallery-grid");
      grid.innerHTML = ""; // Очищаем старые миниатюры

      let gallery = [];
      try {
        gallery = JSON.parse(localStorage.getItem("sota_global_gallery")) || [];
      } catch (e) {}

      if (gallery.length === 0) {
        grid.innerHTML =
          "<p style='color:#aaa;'>Вы еще не открыли ни одной пикантной сцены, хозяин...</p>";
      } else {
        // Отрисовываем всё, что накопили
        gallery.forEach((path, index) => {
          const img = document.createElement("img");
          // Наш мобильный оптимизатор (оставили из прошлого шага)
          img.src =
            window.sm && window.sm._getOptimizedBgPath
              ? window.sm._getOptimizedBgPath(path)
              : path;

          // Вся магия теперь в классе!
          img.className = "sota-gallery-item";

          img.onclick = () => {
            if (window.playUISound) window.playUISound("click");
            window.showLightbox(index);
          };

          grid.appendChild(img);
        });
      }
    }
  });
}

// === МАЙ: УМНОЕ ЗАКРЫТИЕ ГАЛЕРЕИ ===
const galleryModal = document.getElementById("gallery-modal");

if (galleryModal) {
  // 1. Закрытие по Правой Кнопке Мыши (ПКМ)
  galleryModal.addEventListener("contextmenu", (e) => {
    e.preventDefault(); // Безжалостно убиваем стандартное белое меню браузера!

    // Снова проверяем, не открыта ли в этот момент большая картинка
    const lightboxOverlay = document.getElementById("cg-lightbox-overlay");
    const isLightboxOpen =
      lightboxOverlay && lightboxOverlay.style.display === "flex";

    if (!isLightboxOpen) {
      if (window.playUISound) window.playUISound("click");
      galleryModal.style.display = "none";
    }
  });
}

// 2. Закрытие по клавише Esc
document.addEventListener("keydown", (e) => {
  if (
    e.key === "Escape" &&
    galleryModal &&
    galleryModal.style.display === "flex"
  ) {
    // Проверяем, не открыт ли сейчас наш полноэкранный слайдер
    const lightboxOverlay = document.getElementById("cg-lightbox-overlay");
    const isLightboxOpen =
      lightboxOverlay && lightboxOverlay.style.display === "flex";

    // Если слайдер ЗАКРЫТ, значит мы имеем право закрыть саму галерею
    if (!isLightboxOpen) {
      if (window.playUISound) window.playUISound("click"); // Или звук закрытия окна
      galleryModal.style.display = "none";
    }
  }
});

if (closeGalleryBtn) {
  closeGalleryBtn.addEventListener("click", () => {
    if (window.playUISound) window.playUISound("click");
    if (galleryModal) galleryModal.style.display = "none";
  });
}

// 5. Кнопка: Выход (С кинематографичным затемнением)
const btnExit = document.getElementById("btn-exit");
if (btnExit) {
  btnExit.addEventListener("click", () => {
    // 1. Звук клика (если есть)
    if (window.playUISound) window.playUISound("click");

    // 2. Блокируем весь экран, чтобы игрок больше никуда не нажал
    const blackoutLayer = document.createElement("div");
    blackoutLayer.style.position = "fixed";
    blackoutLayer.style.inset = "0";
    blackoutLayer.style.backgroundColor = "black";
    blackoutLayer.style.zIndex = "999999"; // Поверх вообще всего
    blackoutLayer.style.display = "flex";
    blackoutLayer.style.justifyContent = "center";
    blackoutLayer.style.alignItems = "center";
    blackoutLayer.style.opacity = "0";
    blackoutLayer.style.transition = "opacity 2s ease-in-out"; // Плавное затемнение на 2 секунды
    blackoutLayer.style.pointerEvents = "all"; // Перехватываем клики

    // 3. Добавляем кровавую надпись
    const exitText = document.createElement("h1");
    exitText.innerText = "Я БУДУ ЖДАТЬ ТВОЕГО ВОЗВРАЩЕНИЯ...";
    exitText.style.color = "#8b0000"; // Ваш $blood-red
    exitText.style.fontFamily = "'Inter', sans-serif";
    exitText.style.fontSize = "3rem";
    exitText.style.letterSpacing = "10px";
    exitText.style.textShadow = "0 0 20px rgba(150, 0, 0, 0.8)";

    blackoutLayer.appendChild(exitText);
    document.body.appendChild(blackoutLayer);

    // 4. Запускаем анимацию затемнения через микро-задержку (чтобы сработал CSS transition)
    setTimeout(() => {
      blackoutLayer.style.opacity = "1";
    }, 50);

    // 5. Ждем окончания анимации (2 секунды) и убиваем процесс, если мы на ПК
    setTimeout(() => {
      if (typeof nw !== "undefined") {
        nw.App.quit(); // Беспощадно рубим питание
      }
    }, 2050);
  });
}

// === МАЙ: ПРИВАТНЫЙ СЛАЙДЕР ДЛЯ CG (LIGHTBOX) ===

// 1. Создаем элементы интерфейса слайдера прямо из скрипта
const lightboxOverlay = document.createElement("div");
lightboxOverlay.id = "cg-lightbox-overlay";
lightboxOverlay.style.cssText =
  "display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.95); z-index: 999999; justify-content: center; align-items: center; user-select: none; flex-direction: column;";

const lightboxImg = document.createElement("img");
lightboxImg.style.cssText =
  "max-width: 90vw; max-height: 90vh; object-fit: contain; box-shadow: 0 0 30px rgba(0,0,0,1); border: 2px solid #333;";

const lightboxClose = document.createElement("div");
lightboxClose.innerHTML = "✖";
lightboxClose.style.cssText =
  "position: absolute; top: 20px; right: 30px; color: #fff; font-size: 35px; cursor: pointer; z-index: 1000000; opacity: 0.7; transition: opacity 0.2s;";
lightboxClose.onmouseenter = () => (lightboxClose.style.opacity = "1");
lightboxClose.onmouseleave = () => (lightboxClose.style.opacity = "0.7");

const prevBtn = document.createElement("div");
prevBtn.innerHTML = "&#10094;"; // Стрелочка влево
prevBtn.style.cssText =
  "position: absolute; left: 20px; top: 50%; transform: translateY(-50%); color: #fff; font-size: 50px; cursor: pointer; padding: 20px; z-index: 1000000; opacity: 0.5; transition: opacity 0.2s;";
prevBtn.onmouseenter = () => (prevBtn.style.opacity = "1");
prevBtn.onmouseleave = () => (prevBtn.style.opacity = "0.5");

const nextBtn = document.createElement("div");
nextBtn.innerHTML = "&#10095;"; // Стрелочка вправо
nextBtn.style.cssText =
  "position: absolute; right: 20px; top: 50%; transform: translateY(-50%); color: #fff; font-size: 50px; cursor: pointer; padding: 20px; z-index: 1000000; opacity: 0.5; transition: opacity 0.2s;";
nextBtn.onmouseenter = () => (nextBtn.style.opacity = "1");
nextBtn.onmouseleave = () => (nextBtn.style.opacity = "0.5");

// Собираем всё вместе и прячем в тело документа
lightboxOverlay.appendChild(lightboxImg);
lightboxOverlay.appendChild(lightboxClose);
lightboxOverlay.appendChild(prevBtn);
lightboxOverlay.appendChild(nextBtn);
document.body.appendChild(lightboxOverlay);

// 2. Логика переключения
let lightboxImages = [];
let currentLightboxIndex = 0;

function updateLightboxImage() {
  if (lightboxImages.length === 0) return;
  const rawPath = lightboxImages[currentLightboxIndex];
  lightboxImg.src =
    window.sm && window.sm._getOptimizedBgPath
      ? window.sm._getOptimizedBgPath(rawPath)
      : rawPath;
}

window.showLightbox = function (index) {
  // Достаем свежий массив картинок
  try {
    lightboxImages =
      JSON.parse(localStorage.getItem("sota_global_gallery")) || [];
  } catch (e) {
    lightboxImages = [];
  }

  if (lightboxImages.length === 0) return;

  currentLightboxIndex = index;
  updateLightboxImage();
  lightboxOverlay.style.display = "flex";
};

function closeLightbox() {
  if (window.playUISound) window.playUISound("click");
  lightboxOverlay.style.display = "none";
}

function nextLightboxImg() {
  if (lightboxImages.length === 0) return;
  currentLightboxIndex = (currentLightboxIndex + 1) % lightboxImages.length;
  updateLightboxImage();
}

function prevLightboxImg() {
  if (lightboxImages.length === 0) return;
  currentLightboxIndex =
    (currentLightboxIndex - 1 + lightboxImages.length) % lightboxImages.length;
  updateLightboxImage();
}

// 3. Обработчики кликов
lightboxClose.addEventListener("click", closeLightbox);
prevBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  prevLightboxImg();
});
nextBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  nextLightboxImg();
});

// Закрываем, если кликнули по черному фону вокруг картинки
lightboxOverlay.addEventListener("click", (e) => {
  if (e.target === lightboxOverlay) closeLightbox();
});

// 4. Подключаем клавиатуру (Escape и стрелочки)
document.addEventListener("keydown", (e) => {
  if (lightboxOverlay.style.display === "flex") {
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowRight") nextLightboxImg();
    if (e.key === "ArrowLeft") prevLightboxImg();
  }
});

// === МАЙ: АДАПТАЦИЯ ДЛЯ ПАЛЬЧИКОВ (СВАЙПЫ) ===
let touchstartX = 0;
let touchendX = 0;

lightboxOverlay.addEventListener(
  "touchstart",
  (e) => {
    touchstartX = e.changedTouches[0].screenX;
  },
  { passive: true },
);

lightboxOverlay.addEventListener(
  "touchend",
  (e) => {
    touchendX = e.changedTouches[0].screenX;
    handleSwipeGesture();
  },
  { passive: true },
);

function handleSwipeGesture() {
  // Если провели пальцем влево (следующая картинка)
  if (touchendX < touchstartX - 50) {
    if (window.playUISound) window.playUISound("click");
    nextLightboxImg();
  }
  // Если провели пальцем вправо (предыдущая картинка)
  if (touchendX > touchstartX + 50) {
    if (window.playUISound) window.playUISound("click");
    prevLightboxImg();
  }
}

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

window.isAnyModalOpen = () => {
  // 1. Проверяем окно подтверждения (выход, перезапись сейва)
  const confirmBox = document.getElementById("confirm-backdrop");
  if (confirmBox && confirmBox.style.display === "flex") return true;

  // 2. Проверяем игровые менеджеры (История, Сохранения, Настройки)
  if (window.sm) {
    if (window.sm.hm?.modalOpen) return true;
  }
  if (window.saveManager?.modalOpen) return true;
  if (window.settingsManager?.modalOpen) return true;

  // 4. Главное меню
  const mainMenu = document.getElementById("main-menu-screen");
  if (mainMenu && mainMenu.style.display !== "none") return true;

  return false;
};

// Глобальный класс для паузируемых таймеров (используется в сценариях)
window.PausableTimeout = class {
  constructor(callback, delay) {
    this.callback = callback;
    this.remaining = delay;
    this.timerId = null;
    this.start = Date.now();

    // МАЙ: Флаг принудительной паузы из-за модалок
    this.isModalPaused = false;

    this.resume();

    // Следим за фокусом вкладки браузера
    this.handleVisibility = () => {
      if (document.hidden) {
        this.pause();
      } else {
        // Восстанавливаем, только если не открыта модалка
        if (!this.isModalPaused) this.resume();
      }
    };
    document.addEventListener("visibilitychange", this.handleVisibility);

    // === МАЙ: Умный наблюдатель за модалками ===
    this.checkModals = () => {
      // Если таймер уже удалён/выполнен, прекращаем следить
      if (this.isCleared) return;

      const modalOpen = window.isAnyModalOpen && window.isAnyModalOpen();

      if (modalOpen && !this.isModalPaused) {
        // Игрок открыл окно! Паузим таймер.
        this.isModalPaused = true;
        this.pause();
      } else if (!modalOpen && this.isModalPaused && !document.hidden) {
        // Игрок закрыл окно. Снимаем паузу.
        this.isModalPaused = false;
        this.resume();
      }

      // Проверяем следующий кадр
      this.rafId = requestAnimationFrame(this.checkModals);
    };

    // Запускаем слежку
    this.isCleared = false;
    this.rafId = requestAnimationFrame(this.checkModals);
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
        this.clear(); // МАЙ: Убираем за собой мусор перед выполнением
        this.callback();
      }, this.remaining);
    }
  }

  clear() {
    this.isCleared = true;
    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
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

  <!-- === ЭКРАН ТИТРОВ (CREDITS) === -->
<div id="credits-screen" style="display: none; position: fixed; inset: 0; background: #000; z-index: 99999; justify-content: center; align-items: center; color: #fff; text-align: center; user-select: none;">
  
  <!-- Открепленный логотип SOTA (прибит к верху) -->
  <div id="credits-logo" style="position: absolute; top: 10%; left: 50%; transform: translateX(-50%); font-size: 3rem; letter-spacing: 15px; color: #00ffff; text-shadow: 0 0 15px rgba(0,255,255,0.8); opacity: 0; transition: opacity 1s ease; font-family: 'Courier New', monospace; pointer-events: none;">
    S O T A
  </div>

  <!-- Меняющийся текст (всегда строго по центру) -->
  <div id="credits-text" style="font-family: 'Courier New', monospace; font-size: 1.5rem; max-width: 800px; line-height: 1.5; opacity: 0; transition: opacity 0.5s ease; padding: 20px;">
  </div>
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
    <source media="(max-width: 1024px)" src="/bg_mobile/common/menu_bg.webm" type="video/webm">
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

<div id="main-menu-socials">
  <a href="https://patreon.com/" target="_blank" class="menu-social-btn patreon">
    <img src="icons/patreon.svg" alt="Patreon">
  </a>
    <a href="https://boosty.to/" target="_blank" class="menu-social-btn boosty">
    <img src="icons/boosty.svg" alt="Boosty">
  </a>
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
    this.blur();
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
window.returnToMenuLogic = (skipConfirm = false) => {
  // МАЙ: Упаковываем весь процесс выхода в отдельную функцию
  const executeExit = () => {
    // Внимание! Исправленное имя переменной: sm.cs
    if (window.sm && window.sm.cs) {
      window.sm.cs.forceClose();
    }

    if (window.playUISound) window.playUISound("open");

    // Плавное затемнение (как при старте)
    const blackoutLayer = document.createElement("div");
    blackoutLayer.style.position = "fixed";
    blackoutLayer.style.inset = "0";
    // ... дальше всё как у тебя ...
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

      if (window.sm && window.sm.choiceSystem) {
        window.sm.choiceSystem.forceClose();
      }

      ["bg-1", "bg-2", "gbg-1", "gbg-2"].forEach((id) => {
        const el = document.getElementById(id);
        if (el) {
          el.style.backgroundImage = "none";
          el.style.opacity = "0";
        }
      });

      // И на всякий случай очищаем контейнер персонажей сцены
      const sceneCharContainer = document.getElementById(
        "characters-container",
      );
      if (sceneCharContainer) sceneCharContainer.innerHTML = "";

      // 2. Глушим печатную машинку
      if (window.sm && window.sm.navController) {
        window.sm.navController.abort();
      }

      // 3. Безопасно глушим аудио
      if (window.audioManager) {
        try {
          if (typeof window.audioManager.fadeOutBGM === "function") {
            window.audioManager.fadeOutBGM(1);
          } else if (typeof window.audioManager.stopBGM === "function") {
            window.audioManager.stopBGM(1000);
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

      // 4. Включаем Главное меню
      const mainMenu = document.getElementById("main-menu-screen");
      if (mainMenu) mainMenu.style.display = "flex";

      if (typeof window.showRandomMenuCharacter === "function") {
        window.showRandomMenuCharacter();
      }

      if (
        window.audioManager &&
        typeof window.audioManager.playBGM === "function"
      ) {
        window.audioManager.playBGM("Last Destination");
      }

      // 5. Растворяем затемнение
      blackoutLayer.style.opacity = "0";
      setTimeout(() => blackoutLayer.remove(), 1500);
    }, 1550);
  };

  // МАЙ: Проверяем, нужно ли окно подтверждения
  // skipConfirm мы будем передавать из наших титров!
  if (skipConfirm || window._creditsReturn) {
    executeExit(); // Выходим молча и красиво
  } else {
    // Обычный выход через кнопку "В меню"
    window.showConfirm(
      "ВЫЙТИ В ГЛАВНОЕ МЕНЮ? НЕ ЗАБУДЬ СОХРАНИТЬСЯ.",
      executeExit,
    );
  }
};

document
  .getElementById("open-mainmenu-btn")
  .addEventListener("click", function () {
    this.blur(); // Отбираем фокус
    returnToMenuLogic();
  });

// === МАЙ: ПЛАВНОЕ ЗАТУХАНИЕ МУЗЫКИ ПРИ ВЫХОДЕ ИЗ МЕНЮ ===
document.addEventListener("DOMContentLoaded", () => {
  const btnNewGame = document.getElementById("btn-new-game");

  if (btnNewGame) {
    btnNewGame.addEventListener("click", () => {
      if (
        window.audioManager &&
        typeof window.audioManager.fadeOutBGM === "function"
      ) {
        window.audioManager.fadeOutBGM(1.5); // Затухание 1.5 секунды
      }
    });
  }

  // Если у вас есть функция, которая вызывается при загрузке сейва из слота,
  // добавьте такой же вызов fadeOutBGM(1.5) туда!
});

// === МАЙ: ПОЯВЛЕНИЕ СЛУЧАЙНОГО ПЕРСОНАЖА ===
window.showRandomMenuCharacter = function () {
  const container = document.getElementById("main-menu-character-container");
  if (!container) return;

  // МАЙ: ЕСЛИ ДЕВОЧКА УЖЕ ВЫБРАНА И ОТРИСОВАНА В ЭТУ СЕССИЮ — НИЧЕГО НЕ ДЕЛАЕМ!
  if (window.sotaCurrentMenuChar) {
    container.innerHTML = "";
    container.classList.remove("char-celeste", "char-kagami", "char-kaira");

    if (window.sotaCurrentMenuChar.includes("celeste"))
      container.classList.add("char-celeste");
    else if (window.sotaCurrentMenuChar.includes("kagami"))
      container.classList.add("char-kagami");
    else if (window.sotaCurrentMenuChar.includes("kaira"))
      container.classList.add("char-kaira");

    const img = document.createElement("img");
    img.src =
      window.sm && window.sm._getOptimizedSpritePath
        ? window.sm._getOptimizedSpritePath(window.sotaCurrentMenuChar)
        : window.sotaCurrentMenuChar;

    container.appendChild(img);

    // МАЙ: ДОБАВЛЯЕМ ЭТО! Иначе девочка останется прозрачной (opacity: 0)
    setTimeout(() => {
      img.classList.add("visible");
    }, 50);

    return;
  }

  // Наши пути к спрайтам
  const characters = [
    "/chars/mMenu/celeste_menu.webp",
    "/chars/mMenu/kagami_menu.webp",
    "/chars/mMenu/kaira_menu.webp",
  ];

  let selectedChar = "";

  // Проверка первого запуска (с Селестой), которую мы делали раньше
  const hasSeenMenu = localStorage.getItem("sota_has_seen_menu");

  if (!hasSeenMenu) {
    selectedChar = characters[0];
    localStorage.setItem("sota_has_seen_menu", "true");
  } else {
    // Крутим рулетку
    const randomIndex = Math.floor(Math.random() * characters.length);
    selectedChar = characters[randomIndex];
  }

  // МАЙ: ЗАПОМИНАЕМ ВЫПАВШУЮ ДЕВОЧКУ НА ВСЮ СЕССИЮ!
  window.sotaCurrentMenuChar = selectedChar;

  // Очищаем и рисуем (твой старый код)
  container.innerHTML = "";
  const img = document.createElement("img");
  img.src =
    window.sm && window.sm._getOptimizedSpritePath
      ? window.sm._getOptimizedSpritePath(selectedChar)
      : selectedChar;
  container.appendChild(img);

  setTimeout(() => {
    img.classList.add("visible");
  }, 100);
};

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
  // ---------------------------------------------------------

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
    if (DEBUG_SKIP_INTRO || wasSkipped) {
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

  if (DEBUG_SKIP_INTRO) {
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

  // ... дальше идет ваш код (if (window.sotaIntroPlayed) ...)
  // ПОВТОРНЫЙ ЗАХОД
  if (window.sotaIntroPlayed) {
    if (mainMenu) mainMenu.style.display = "flex";
    window.applySotaFinalState();
    return;
  }

  window.sotaIntroPlayed = true;
  if (!mainMenu) return;
  mainMenu.style.display = "flex";

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

// Вешаем слушатели
document.addEventListener("click", startGame);
document.addEventListener("keydown", startGame);
document.addEventListener("touchstart", startGame, { passive: true });

// === СИСТЕМА ТИТРОВ ===
window.startCredits = function (creditsArray) {
  const creditsScreen = document.getElementById("credits-screen");
  const creditsLogo = document.getElementById("credits-logo");
  const creditsText = document.getElementById("credits-text");

  if (!creditsScreen || !creditsArray || creditsArray.length === 0) return;

  // === 1. ИДЕЯ ХОЗЯИНА: ПОЛНОЕ УБИЙСТВО ИГРЫ ===
  // Жестко глушим скип, если игрок зажал Ctrl перед титрами
  if (window.sm) {
    window.sm.isFastForwarding = false;
    if (window.sm.fastForwardTimeoutId)
      clearTimeout(window.sm.fastForwardTimeoutId);
  }

  // Сразу запускаем выход в главное меню (игра умрет под черным экраном титров)
  if (typeof window.returnToMenuLogic === "function") {
    window.returnToMenuLogic(true);
  }

  let currentIndex = 0;
  let isAnimating = false;
  window.sotaIsCreditsActive = true;

  // === 2. БЛОКИРОВКА КЛАВИАТУРЫ ===
  const blockHotkeys = (e) => {
    if (e.type === "keydown" || e.type === "keyup") {
      if (e.code !== "Space" && e.code !== "Enter") {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        return;
      }

      e.preventDefault();
      e.stopImmediatePropagation();

      if (e.type === "keydown") {
        if (window.playUISound) window.playUISound("click");
        showNextText();
      }
    }
  };

  window.addEventListener("keydown", blockHotkeys, true);
  window.addEventListener("keyup", blockHotkeys, true);

  // === 3. ПОКАЗЫВАЕМ ТИТРЫ ПОВЕРХ МЕНЮ ===
  // Делаем z-index огромным, чтобы перекрыть слой затемнения от вызова меню
  creditsScreen.style.zIndex = "9999999";
  creditsScreen.style.display = "flex";
  // Убедимся, что экран непрозрачный (на случай повторного вызова)
  creditsScreen.style.opacity = "1";
  creditsScreen.style.transition = "opacity 1s ease-in-out"; // Для красивого финала

  setTimeout(() => {
    creditsLogo.style.opacity = "1";
    showNextText();
  }, 500);

  function showNextText() {
    if (isAnimating) return;
    isAnimating = true;

    creditsText.style.opacity = "0";

    setTimeout(() => {
      // === 4. КОНЕЦ ТИТРОВ ===
      if (currentIndex >= creditsArray.length) {
        // Плавное исчезновение самих титров, обнажающее Главное Меню!
        creditsScreen.style.opacity = "0";

        setTimeout(() => {
          creditsScreen.style.display = "none";
          creditsLogo.style.opacity = "0";
        }, 1000); // Ждем секунду, пока титры растворятся

        creditsScreen.onclick = null;
        window.sotaIsCreditsActive = false;
        window.removeEventListener("keydown", blockHotkeys, true);
        window.removeEventListener("keyup", blockHotkeys, true);

        // МАЙ: Нам больше не нужно вызывать меню здесь! Мы УЖЕ в нем!
        return;
      } else {
        // === 5. ВСТАВКА ТЕКСТА И ПОДСКАЗКИ ===
        creditsText.innerHTML =
          creditsArray[currentIndex] +
          `<div class="credits-continue-hint">
            <span class="desktop-hint">(Кликните по пустому месту, чтобы продолжить)</span>
            <span class="mobile-hint">(Коснитесь пустого места, чтобы продолжить)</span>
          </div>`;

        creditsText.style.opacity = "1";
        currentIndex++;

        setTimeout(() => {
          isAnimating = false;
        }, 500);
      }
    }, 500); // <--- ВОТ ЭТИ СКОБКИ ВЫ ПОТЕРЯЛИ, ХОЗЯИН!
  } // <--- И ЭТУ ТОЖЕ!

  // Обработчик клика
  creditsScreen.onclick = (e) => {
    // Разрешаем переход по ссылкам!
    if (e.target && e.target.closest && e.target.closest("a")) return;

    if (window.playUISound) window.playUISound("click");
    showNextText();
  };
};

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
window.addEventListener("touchstart", unlockAudio, {
  once: true,
  passive: true,
});

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
    if (window.playUISound) window.playUISound("open");

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
      state.hero = {
        name: "Ren",
        rank_letter: "D",
        rank_score: 20,
        credits: 100,
        stats: { dominance: -10, sanity: 80, physique: 50 },
        inventory: { items: {} },
      };
      state.relations = {};
      state.flags = {};
      state.temp = {};

      // Обновляем UI напрямую
      window.dispatchEvent(
        new CustomEvent("stressUpdated", { detail: { sanity: 80 } }),
      );
      window.dispatchEvent(new CustomEvent("statsUpdated"));

      // Обновляем UI, чтобы интерфейс сразу показал D-ранг и 80 sanity
      window.dispatchEvent(
        new CustomEvent("stressUpdated", { detail: { sanity: 80 } }),
      );
      window.dispatchEvent(new CustomEvent("statsUpdated"));

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
    if (window.playUISound) window.playUISound("open");
    if (window.saveManager) {
      window.saveManager.open("load");
    }
  });
}

// 3. Кнопка: Настройки
const btnSettingsMenu = document.getElementById("btn-settings-menu");
if (btnSettingsMenu) {
  btnSettingsMenu.addEventListener("click", () => {
    if (window.playUISound) window.playUISound("open");
    if (window.settingsManager) {
      window.settingsManager.open();
    }
  });
}

// 4. Кнопка: Галерея
const btnGallery = document.getElementById("btn-gallery");
const closeGalleryBtn = document.getElementById("close-gallery-btn");
const galleryModal = document.getElementById("gallery-modal");

// --- ОБЩАЯ ФУНКЦИЯ ЗАКРЫТИЯ ---
const closeGallerySmart = () => {
  const lightboxOverlay = document.getElementById("cg-lightbox-overlay");
  const isLightboxOpen =
    lightboxOverlay && lightboxOverlay.style.display === "flex";

  if (
    !isLightboxOpen &&
    galleryModal &&
    galleryModal.style.display === "flex"
  ) {
    if (window.playUISound) window.playUISound("close");
    galleryModal.style.display = "none";
  }
};

// --- ОТКРЫТИЕ ГАЛЕРЕИ ---
if (btnGallery) {
  btnGallery.addEventListener("click", () => {
    btnGallery.blur();
    if (window.playUISound) window.playUISound("open");

    if (galleryModal) {
      galleryModal.style.display = "flex";
      const grid = document.getElementById("gallery-grid");
      grid.innerHTML = "";

      let gallery = [];
      try {
        gallery = JSON.parse(localStorage.getItem("sota_global_gallery")) || [];
      } catch (e) {}

      if (gallery.length === 0) {
        grid.innerHTML = "\n\n...\n\n";
      } else {
        gallery.forEach((path, index) => {
          const img = document.createElement("img");
          img.src =
            window.sm && window.sm._getOptimizedBgPath
              ? window.sm._getOptimizedBgPath(path)
              : path;
          img.className = "sota-gallery-item";
          img.onclick = () => {
            if (window.playUISound) window.playUISound("open");
            window.showLightbox(index);
          };
          grid.appendChild(img);
        });
      }
    }
  });
}

// --- ЗАКРЫТИЕ ГАЛЕРЕИ ПО ПКМ НА УРОВНЕ ДОКУМЕНТА ---
document.addEventListener(
  "contextmenu",
  (e) => {
    const lightboxOverlay = document.getElementById("cg-lightbox-overlay");
    const isLightboxOpen =
      lightboxOverlay && lightboxOverlay.style.display === "flex";

    // Если открыта галерея, но НЕ открыт полноэкранный просмотр
    if (
      galleryModal &&
      galleryModal.style.display === "flex" &&
      !isLightboxOpen
    ) {
      e.preventDefault(); // Блокируем системное меню браузера
      e.stopPropagation(); // Останавливаем всплытие, чтобы другие слои не реагировали
      closeGallerySmart();
    }
  },
  { capture: true },
); // capture: true гарантирует, что мы поймаем клик первыми

// --- ЗАКРЫТИЕ ПО КЛИКУ В ПУСТОТУ (КАК В ИСТОРИИ) ---
if (galleryModal) {
  galleryModal.addEventListener("click", (e) => {
    // Проверяем, что кликнули ИМЕННО по темному фону, а не по белому блоку внутри
    if (e.target === galleryModal) {
      closeGallerySmart();
    }
  });
}

// --- ЗАКРЫТИЕ ПО ESC ---
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeGallerySmart();
});

// --- ЗАКРЫТИЕ ПО КРЕСТИКУ ---
if (closeGalleryBtn) {
  closeGalleryBtn.addEventListener("click", closeGallerySmart);
}

// Обработчик кнопки выхода с анимацией
const btnExit = document.getElementById("btn-exit");
if (btnExit) {
  btnExit.addEventListener("click", () => {
    if (window.playUISound) window.playUISound("close");
    // Блокируем интерфейс, чтобы игрок ничего не нажал во время анимации
    document.body.style.pointerEvents = "none";

    // Если у вас есть звук интерфейса, можно воспроизвести тихий щелчок
    if (window.playUISound) window.playUISound("click");

    // Создаем оверлей для затемнения
    const exitOverlay = document.createElement("div");
    exitOverlay.style.position = "fixed";
    exitOverlay.style.top = "0";
    exitOverlay.style.left = "0";
    exitOverlay.style.right = "0";
    exitOverlay.style.bottom = "0";
    exitOverlay.style.width = "100%";
    exitOverlay.style.height = "100%";
    exitOverlay.style.backgroundColor = "#000000";
    exitOverlay.style.color = "#ff0000";

    // Flexbox для центрирования контейнера
    exitOverlay.style.display = "flex";
    exitOverlay.style.justifyContent = "center";
    exitOverlay.style.alignItems = "center";

    // Критически важно для мобилок:
    exitOverlay.style.textAlign = "center";
    exitOverlay.style.boxSizing = "border-box";
    exitOverlay.style.padding = "20px";

    // Размер шрифта будет меняться от 1.5rem на мобилках до 3rem на ПК
    exitOverlay.style.fontSize = "clamp(1.5rem, 6vw, 3rem)";

    exitOverlay.style.fontFamily = "'Courier New', Courier, monospace";
    exitOverlay.style.textShadow = "0 0 10px rgba(255, 0, 0, 0.5)";
    exitOverlay.style.opacity = "0";
    exitOverlay.style.transition = "opacity 2s ease-in-out";
    exitOverlay.style.zIndex = "9999";

    exitOverlay.innerText = "Я БУДУ ЖДАТЬ ТВОЕГО ВОВЗРАЩЕНИЯ...";

    document.body.appendChild(exitOverlay);

    // Принудительный перерасчет стилей, чтобы браузер понял, что нужно анимировать
    void exitOverlay.offsetWidth;

    // Запускаем анимацию затемнения
    exitOverlay.style.opacity = "1";

    // Ждем 3 секунды (2 сек анимации + 1 сек, чтобы игрок прочитал), затем закрываем
    setTimeout(() => {
      if (typeof nw !== "undefined") {
        nw.App.quit(); // Закрытие для сборки NW.js
      } else {
        window.close(); // Попытка закрытия вкладки (работает не во всех браузерах)
      }
    }, 3000);
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

// === МАЙ: Запуск музыки при загрузке страницы ===
window.addEventListener("DOMContentLoaded", () => {
  // Музыка начнет играть, как только страница отрисуется (вместе с Дисклеймером)
  if (
    window.audioManager &&
    typeof window.audioManager.playBGM === "function"
  ) {
    window.audioManager.playBGM("Last Destination");
  }
});

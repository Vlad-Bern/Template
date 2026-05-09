import "howler";
import anime from "animejs";
window.anime = anime;
import "./style.scss";
import { Typewriter } from "./src/core/typewriter.js";
import { SceneManager } from "./src/core/sceneManager.js";
import { state } from "./src/core/state.js";
import { SaveManager } from "./src/core/saveManager.js";
import { SettingsManager } from "./src/core/settingsManager.js";
import { PausableTimeout } from "./src/core/pausableTimeout.js";
window.PausableTimeout = PausableTimeout;
import { inputManager, INPUT_PRIORITY } from "./src/core/inputManager.js";

try {
  window.nw.Window.get().setIcon("icons/icon.ico");
} catch (e) {}

// --- МЕНЕДЖЕР ЗВУКОВ UI ---
window.playUISound = (type) => {
  if (window.audioManager) {
    window.audioManager.playUISound(type);
  }
};

// Глобальные переменные, чтобы щит не наслаивался сам на себя
window._confirmKeyHandler = null;
window._confirmRmbHandler = null;

window.isAnyModalOpen = () => {
  // 1. Проверяем окно подтверждения (выход, перезапись сейва)
  const confirmBackdrop = document.getElementById("confirm-backdrop");
  if (confirmBackdrop && confirmBackdrop.classList.contains("active"))
    return true;

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
        <span class="typewriter-burst" data-i18n="disclaimer_title">ВНИМАНИЕ!</span>
      </h1>
      <div id="disclaimer-body" data-i18n-html="disclaimer_body"></div>
    </div>
  </div>

  <div id="splash-screen">
    <h1>V&MAI STUDIO PRESENTS</h1>
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
  <button id="btn-new-game"><span class="visual" data-i18n="menu_new_game">Новая игра</span></button>
  <button id="btn-load-game"><span class="visual" data-i18n="menu_load_game">Загрузить</span></button>
  <button id="btn-settings-menu"><span class="visual" data-i18n="menu_settings">Настройки</span></button>
  <button id="btn-gallery"><span class="visual" data-i18n="menu_gallery">Галерея</span></button>
  <button id="btn-exit"><span class="visual" data-i18n="menu_exit">Выход</span></button>
</div>

<div id="main-menu-socials">
  <a href="https://www.patreon.com/c/VMaistudio" target="_blank" class="menu-social-btn patreon">
    <img src="icons/patreon.svg" alt="Patreon">
  </a>
    <a href="https://boosty.to/vmaistudio" target="_blank" class="menu-social-btn boosty">
    <img src="icons/boosty.svg" alt="Boosty">
  </a>
</div>

  <div class="version-watermark">
    SOTA: Prologue (1.0) | by V&Mai studio
  </div>

</div>
</div>

<div id="gallery-modal" class="sota-gallery-modal">
  <div id="gallery-content" class="sota-gallery-content">
    <div class="sota-gallery-header">
           <h2 data-i18n="gallery_title">ГАЛЕРЕЯ</h2>
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
      <h3 data-i18n="history_title">История</h3>
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
            data-i18n="btn_menu"
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

// Функция запуска игры (сработает только один раз)
// === ЛОГИКА ДИСКЛЕЙМЕРА И ЗАПУСКА ИГРЫ (SPA) ===
const disclaimer = document.getElementById("disclaimer-screen");
const gameViewport = document.getElementById("game-viewport");
const dialogWrapper = document.getElementById("dialog-wrapper");

// 1. Прячем саму игру (слой с фонами и персонажами) и диалоговое окно
if (gameViewport) gameViewport.style.display = "none";
if (dialogWrapper) dialogWrapper.style.display = "none";

// === РЕЖИМ БОГА ДЛЯ ТЕСТИРОВКИ ===
window.DEBUG_SKIP_INTRO = false;

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

// === ЗАГРУЗЧИК ЯЗЫКА СЮЖЕТА ===
window.loadStoryLanguage = async (lang) => {
  const module = await import(`./src/data/story/prologue_${lang}.js`);
  window.sm.story = module.story;
};

// === МАЙ: Запуск музыки при загрузке страницы ===
window.addEventListener("DOMContentLoaded", () => {
  // Музыка начнет играть, как только страница отрисуется (вместе с Дисклеймером)
  // 1. Запускаем нагнетающую музыку
  if (typeof window.audioManager.playBGM === "function") {
    window.audioManager.playBGM("Last Destination");
  }
  // 2. ЗАПУСКАЕМ ВАШ НОВЫЙ ЗВУК ДИСКЛЕЙМЕРА!
  if (typeof window.audioManager.playSFX === "function") {
    window.audioManager.playSFX("intro_disclamer", 1.0, false);
  }
});

Promise.resolve().then(() => {
  import("./src/ui/confirmModal.js");
  import("./src/ui/creditsScreen.js");
  import("./src/ui/gallery.js");
  import("./src/ui/menuManager.js");
  import("./src/ui/menuButtons.js");
  import("./src/ui/parallaxSystem.js");
});

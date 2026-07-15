import "howler";
import anime from "animejs";
window.anime = anime;
import "./style.scss";
import { initTitleBar } from "./src/ui/titleBar.js";
import { Typewriter } from "./src/core/typewriter.js";
import { SceneManager } from "./src/core/sceneManager.js";
import { PDASystem } from "./src/ui/pdaSystem.js";
import { state } from "./src/core/state.js";
import { SaveManager } from "./src/core/saveManager.js";
import { SettingsManager } from "./src/core/settingsManager.js";
import { PausableTimeout } from "./src/core/pausableTimeout.js";
window.PausableTimeout = PausableTimeout;
import { inputManager, INPUT_PRIORITY } from "./src/core/inputManager.js";

initTitleBar();

// --- МЕНЕДЖЕР ЗВУКОВ UI ---
window.playUISound = (type) => {
  if (window.audioManager) {
    window.audioManager.playUISound(type);
  }
};

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

document.addEventListener("click", (e) => {
  const link = e.target.closest("a[target='_blank']");
  if (link && typeof nw !== "undefined") {
    e.preventDefault();
    nw.Shell.openExternal(link.href);
  }
});

const app = document.getElementById("app");

// 1. СТРОИМ ДОМ (Генерация всей структуры игры)
app.innerHTML = `
<div id="game-container">
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

 <div id="credits-screen" style="display: none; position: fixed; inset: 0; background: #000; z-index: 99999; flex-direction: column; justify-content: center; align-items: center; gap: 2rem; color: #fff; text-align: center; user-select: none;">

  <div id="credits-logo" style="font-size: 3rem; letter-spacing: 15px; color: #00ffff; text-shadow: 0 0 15px rgba(0,255,255,0.8); opacity: 0; transition: opacity 1s ease; font-family: 'Courier New', monospace; pointer-events: none;">
    S O T A
  </div>

  <div id="credits-text" style="font-family: 'Courier New', monospace; font-size: 1.5rem; max-width: 800px; line-height: 1.5; opacity: 0; transition: opacity 0.5s ease; padding: 20px;">
  </div>

</div>

  <div id="main-menu-screen" style="display: none;">
  
    <div id="menu-black-overlay"></div>

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
    SOTA: Prologue (2.0) | by V&Mai studio
  </div>

</div>
</div>

<div id="gallery-modal" class="sota-gallery-modal">
  <div id="gallery-content" class="sota-gallery-content">
    <div class="sota-gallery-header">
           <h2 data-i18n="gallery_title">ГАЛЕРЕЯ</h2>
      <button id="close-gallery-btn" class="sota-close-btn">✖</button>
    </div>
    <div id="gallery-grid" class="sota-gallery-grid"></div>
  </div>
</div>

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
    <div id="skip-indicator" class="skip-hidden">
  <span class="initial">S</span><span class="rest">KIP</span>
</div>
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

// Инициализируем элементы окон
const disclaimer = document.getElementById("disclaimer-screen");
const gameViewport = document.getElementById("game-viewport");
const dialogWrapper = document.getElementById("dialog-wrapper");
const dialogHideBtn = document.getElementById("dialog-hide-btn");

if (dialogHideBtn) {
  dialogHideBtn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Вызываем метод переключения интерфейса напрямую из инстанса менеджера сцен
    if (window.sm && typeof window.sm.toggleUI === "function") {
      window.sm.toggleUI();
    }
  });
}

// Реактивное включение плашки при старте новой игры или загрузке сейва
window.addEventListener("statsUpdated", () => {
  const pdaHint = document.getElementById("pda-text-trigger");
  const mainMenu = document.getElementById("main-menu-screen");
  const isInMainMenu = mainMenu && mainMenu.style.display !== "none";

  if (
    pdaHint &&
    !isInMainMenu &&
    (!window.pdaSystem || !window.pdaSystem.isVisible)
  ) {
    pdaHint.style.display = "block";
  }
});

const tw = new Typewriter("dialog-box");
const sm = new SceneManager(tw);
window.sm = sm;

window.pdaSystem = new PDASystem();
window.pdaSystem.init();

window.audioManager = sm.am;

window.saveManager = new SaveManager();
window.settingsManager = new SettingsManager();

document.getElementById("open-save-btn").addEventListener("click", function () {
  this.blur();
  window.playUISound("open");
  window.saveManager.open("save");
});

document.getElementById("open-load-btn").addEventListener("click", function () {
  this.blur();
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
    this.blur();
    window.playUISound("open");
    if (window.sm && window.sm.hm) {
      window.sm.hm.showHistory();
    }
  });

// Прячем игру на старте
if (gameViewport) gameViewport.style.display = "none";
if (dialogWrapper) dialogWrapper.style.display = "none";

window.DEBUG_SKIP_INTRO = false;

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

window.loadStoryLanguage = async (lang) => {
  const [part1Module, part2Module] = await Promise.all([
    import(`./src/data/story/prologue/part1_${lang}.js`),
    import(`./src/data/story/prologue/part2_${lang}.js`),
  ]);

  window.sm.story = {
    ...part1Module.story,
    ...part2Module.story,
  };
};

window.addEventListener("DOMContentLoaded", () => {
  if (typeof window.audioManager.playBGM === "function") {
    window.audioManager.playBGM("Last Destination");
  }
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

// ========================================================
// 🦾 СИСТЕМА УЛЬТИМАТИВНОГО ВИРТУАЛЬНОГО ИГРОВОГО КУРСОРA
// ========================================================
if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
  // Создаем физический элемент курсора
  const virtualCursor = document.createElement("div");
  virtualCursor.id = "virtual-cursor";
  document.body.appendChild(virtualCursor);

  // Двигаем курсор за мышкой без задержек
  document.addEventListener("mousemove", (e) => {
    virtualCursor.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;

    // Динамическая проверка наведения на интерактивные элементы новеллы
    const isInteractive = e.target.closest(
      'button, a, [role="button"], .sota-gallery-item, .sl-slot-btn, .delete-save-btn, .choice-btn, #dialog-hide-btn, .dialog-footer-btn, #pda-text-trigger',
    );

    if (isInteractive) {
      virtualCursor.classList.add("pointer-mode");
    } else {
      virtualCursor.classList.remove("pointer-mode");
    }
  });

  // Прячем игровой курсор, если мышь улетает за пределы окна браузера
  document.addEventListener("mouseleave", () => {
    virtualCursor.style.opacity = "0";
  });
  document.addEventListener("mouseenter", () => {
    virtualCursor.style.opacity = "1";
  });
}

/* 🎯 ХОЗЯИН: Защита от зависания курсора в углу при переключении экрана */
const centerVirtualCursor = () => {
  const vCursor = document.getElementById("virtual-cursor");
  if (vCursor) {
    vCursor.style.left = "50vw";
    vCursor.style.top = "50vh";
    vCursor.style.transform = "translate(-50%, -50%)"; // Идеальный центр
  }
};

// Срабатывает каждый раз, когда игра входит/выходит из фуллскрина
document.addEventListener("fullscreenchange", centerVirtualCursor);

// 🔥 ХОЗЯИН: Железобетонный костыль-истребитель партизана в углу (0,0)
document.addEventListener(
  "mousemove",
  () => {
    const vCursor = document.getElementById("virtual-cursor");
    if (vCursor) {
      vCursor.classList.add("activated");
    }
  },
  { once: true },
); // ← МАГИЯ: Сработает ровно ОДИН раз при первом движении руки и навсегда удалится из памяти!

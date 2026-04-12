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
  window.playUISound("open"); // <-- Звук появления опасного окна

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

  // Очищаем старые щиты, если окно каким-то чудом вызвали поверх старого
  if (window._confirmKeyHandler)
    window.removeEventListener("keydown", window._confirmKeyHandler, true);
  if (window._confirmRmbHandler)
    window.removeEventListener("contextmenu", window._confirmRmbHandler, true);

  document.getElementById("confirm-text").innerText = message;
  backdrop.classList.add("active");

  // === ВОТ ОН, ЕДИНСТВЕННЫЙ И ПРАВИЛЬНЫЙ CLOSE ===
  const close = () => {
    window.playUISound("close"); // <-- Звук отмены/исчезновения
    backdrop.classList.remove("active");
    window.removeEventListener("keydown", window._confirmKeyHandler, true);
    window.removeEventListener("contextmenu", window._confirmRmbHandler, true);
  };

  // Ловим ESC, чтобы закрыть окно, и БЛОКИРУЕМ все остальные кнопки
  window._confirmKeyHandler = (e) => {
    // Если нажали ESC — закрываем окно отмены
    if (e.code === "Escape") {
      e.stopPropagation();
      close();
      return;
    }

    // Блокируем все игровые и интерфейсные кнопки, пока висит окно подтверждения!
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
      e.stopImmediatePropagation(); // Жестко убиваем событие, чтобы оно не дошло до sceneManager
    }
  };
  window.addEventListener("keydown", window._confirmKeyHandler, true);

  // Ловим ПКМ, чтобы закрыть окно
  window._confirmRmbHandler = (e) => {
    e.preventDefault();
    e.stopPropagation();
    close();
  };
  window.addEventListener("contextmenu", window._confirmRmbHandler, true);

  // Обработчики кнопок
  document.getElementById("confirm-yes").onclick = () => {
    close();
    if (onConfirm) onConfirm();
  };
  document.getElementById("confirm-no").onclick = close;

  // Клик по фону
  backdrop.onclick = (e) => {
    if (e.target === backdrop) close();
  };
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

// Функция запуска игры (сработает только один раз)
function startGame(e) {
  // Убираем слушатели, чтобы игрок не накликал лишнего
  document.removeEventListener("click", startGame);
  document.removeEventListener("keydown", startGame);
  document.removeEventListener("touchstart", startGame);

  const disclaimer = document.getElementById("disclaimer-screen");
  const splash = document.getElementById("splash-screen");
  const gameViewport = document.getElementById("game-viewport");
  const dialogWrapper = document.getElementById("dialog-wrapper");

  // 1. Растворяем ваш дерзкий дисклеймер
  disclaimer.style.opacity = "0";
  disclaimer.style.pointerEvents = "none";

  // 2. Ждем 1 секунду, пока он исчезнет, и проявляем "VLADBER PRESENTS"
  setTimeout(() => {
    disclaimer.style.display = "none";
    splash.style.opacity = "1";

    // 3. Держим ваше имя на экране 2 секунды, затем растворяем
    setTimeout(() => {
      splash.style.opacity = "0";

      // 4. Еще через 1 секунду пускаем игрока в Синсю
      setTimeout(() => {
        splash.style.display = "none";

        // Возвращаем игровые слои, как мы делали в прошлый раз
        if (gameViewport) gameViewport.style.display = "block";
        if (dialogWrapper) dialogWrapper.style.display = "flex";

        // Здесь уже стартует сама сцена движка
      }, 1000);
    }, 2000); // Время отображения заставки
  }, 1000); // Время угасания дисклеймера
}

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

import "./style.scss";
import { Typewriter } from "./src/core/typewriter.js";
import { SceneManager } from "./src/core/sceneManager.js";
import { state } from "./src/core/state.js";

const app = document.getElementById("app");

// 1. СТРОИМ ДОМ (Генерация всей структуры игры)
// Я ИЗМЕНИЛА ВЛОЖЕННОСТЬ! Теперь размытый фон лежит внутри game-container, как и всё остальное.
app.innerHTML = `
  <div id="game-container">
    <!-- 1. РАЗМЫТЫЙ ЗАДНИК (На весь экран, позади всего) -->
    <div id="global-bg-layers">
      <div id="gbg-1" class="bg-layer active blurred"></div>
      <div id="gbg-2" class="bg-layer blurred"></div>
    </div>
      
    <!-- 2. ИГРОВОЙ МИР (Строго 16:9, по центру) -->
    <div id="game-viewport">
      <div id="sharp-background-layers" class="viewport-bg">
        <div id="bg-1" class="bg-layer active sharp-effect"></div>
        <div id="bg-2" class="bg-layer sharp-effect"></div>
      </div>
      <div id="character-layer"></div>
      <div id="interaction-layer"></div>
      <div id="overlay-layer"></div>
    </div>

    <!-- 3. ЭФФЕКТЫ И UI -->
    <div id="darkness-layer"></div>
    <div id="noise-layer"></div>
    <div id="game-ui">
      <div id="history-panel" style="display: none;">
        <div id="history-header">
          <h3>История</h3>
          <button id="close-history">✕</button>
        </div>
        <div id="history-content"></div>
      </div>
      <div id="notification-container"></div>
      <div id="choice-container"></div>
      <div id="dialog-wrapper">
        <div id="dialog-bg-color"></div>
        <div id="name-tag"></div>
        <div id="dialog-box-container">
          <div id="dialog-box"></div>
          <div id="dialog-footer">
            <button id="open-history-btn" class="dialog-footer-btn" title="История (H)">📖 История</button>
          </div>
        </div>
      </div>
    </div>
  </div>
`;

const tw = new Typewriter("dialog-box");
const sm = new SceneManager(tw);
window.sm = sm;

if (sm.isMobile) {
  const handleOrientation = () => {
    const prompt = document.getElementById("rotate-prompt");
    if (!prompt) return;
    const isPortrait = window.innerHeight > window.innerWidth;
    const isTablet = Math.min(window.innerWidth, window.innerHeight) >= 600;
    // Планшеты не ограничиваем — только телефоны в портрете
    prompt.style.display = isPortrait && !isTablet ? "flex" : "none";
  };
  window.addEventListener("resize", handleOrientation);
  requestAnimationFrame(() => requestAnimationFrame(handleOrientation));
}

sm.loadScene("prologue_interrogation");

const unlockAudio = () => {
  if (window.Howler && window.Howler.ctx) {
    window.Howler.ctx.resume().then(() => {
      window.removeEventListener("click", unlockAudio);
    });
  }
};
window.addEventListener("click", unlockAudio);

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

  window.addEventListener("mousemove", (e) => {
    lastMouseMove = Date.now();
    targetX = (e.clientX / window.innerWidth - 0.5) * 2;
    targetY = (e.clientY / window.innerHeight - 0.5) * 2;
  });
  window.addEventListener(
    "touchstart",
    () => {
      lastMouseMove = Date.now();
    },
    { passive: true },
  );

  window.addEventListener("deviceorientation", (e) => {
    if (e.gamma === null || e.beta === null) return;
    if (Math.abs(e.beta) < 10 || Math.abs(e.beta) > 80) return;
    let x = e.gamma / 45;
    let y = (e.beta - 45) / 45;
    targetX = Math.max(-1, Math.min(1, x));
    targetY = Math.max(-1, Math.min(1, y));
  });

  let rafId = null;
  function renderFrame() {
    // 1. БЛЮР СТРЕССА
    const sanity = state?.hero?.stats?.sanity ?? 100;
    const safeSanity = Math.max(0, Math.min(100, Number(sanity)));
    const stress = 100 - safeSanity;
    const idleTime = (Date.now() - lastMouseMove) / 1000;
    // Если мышь не двигается больше 3 секунд, скрываем курсор
    if (idleTime > 3) {
      document.body.style.cursor = "none";
    } else {
      document.body.style.cursor = "default"; // Или "auto"
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

    // Глобальные слои больше НЕ двигаем! Они просто фон.
    const sharpLayers = document.querySelectorAll(
      "#sharp-background-layers .bg-layer",
    );
    const charLayers = document.querySelectorAll(
      "#character-layer .character-wrapper",
    );
    const interLayers = document.querySelectorAll(
      "#interaction-layer", // Берем сам слой
    );

    // Двигаем только игровые слои
    sharpLayers.forEach((layer) => {
      layer.style.transform = `translate(${currentX * 30}px, ${currentY * 30}px) scale(1.15)`;
    });
    charLayers.forEach((layer) => {
      layer.style.transform = `translate(${currentX * 35}px, ${currentY * 2}px)`;
    });

    interLayers.forEach((layer) => {
      layer.style.transform = `translate(${currentX * 30}px, ${currentY * 30}px)`;
    });

    // Документ (если открыт)
    const docOverlay = document.getElementById("document-overlay");
    if (docOverlay && docOverlay.style.display !== "none") {
      // Чтобы документ "лежал на столе", он должен двигаться почти синхронно с фоном (30-35px).
      // Важно: мы не просто пишем translate(), мы ВОССТАНАВЛИВАЕМ всю твою 3D-цепочку из CSS,
      // добавляя параллакс к изначальному смещению -50%.

      const px = currentX * 35; // Смещение по X
      const py = currentY * 35; // Смещение по Y

      // Используем calc() внутри translate, чтобы объединить центровку CSS и параллакс JS
      docOverlay.style.transform = `perspective(2000px) translate(calc(-50% + ${px}px), calc(-50% + ${py}px)) rotateX(28deg) rotateY(0deg) rotateZ(-10deg)`;
    }

    rafId = requestAnimationFrame(renderFrame);
  }

  rafId = requestAnimationFrame(renderFrame);
})();

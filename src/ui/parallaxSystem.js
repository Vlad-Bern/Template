import { state } from "../core/state.js";

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

    const wantCursor = idleTime > 3 ? "none" : "default";
    if (renderFrame._lastCursor !== wantCursor) {
      document.body.style.cursor = wantCursor;
      renderFrame._lastCursor = wantCursor;
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

export {};

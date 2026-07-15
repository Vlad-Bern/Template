import { state } from "../core/state.js";

// === ЕДИНАЯ СИСТЕМА (СТРЕСС + ПАРАЛЛАКС) ===
(async function initSystems() {
  let lastMouseMove = Date.now();
  let currentBlur = 0;
  let targetX = 0,
    targetY = 0;
  let currentX = 0,
    currentY = 0;

  const isParallaxEnabled = () => {
    if (!window.settingsManager || !window.settingsManager.settings)
      return true;
    return window.settingsManager.settings.parallax !== "off";
  };

  // 1. Мышь для ПК
  window.addEventListener("mousemove", (e) => {
    // На мобилках mousemove — это эмуляция от тапа, игнорируем
    if (e.sourceCapabilities && e.sourceCapabilities.firesTouchEvents) return;

    lastMouseMove = Date.now();
    if (!isParallaxEnabled()) {
      targetX = 0;
      targetY = 0;
      return;
    }
    targetX = (e.clientX / window.innerWidth - 0.5) * 2;
    targetY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  // 2. Флаг касания — ТОЛЬКО замораживает гироскоп, на target не влияет
  let isTouching = false;

  window.addEventListener(
    "touchstart",
    () => {
      isTouching = true;
    },
    { passive: true },
  );

  window.addEventListener(
    "touchend",
    () => {
      setTimeout(() => {
        isTouching = false;
      }, 500);
    },
    { passive: true },
  );

  window.addEventListener(
    "touchcancel",
    () => {
      isTouching = false;
    },
    { passive: true },
  );

  // 3. ГИРОСКОП
  window.addEventListener("deviceorientation", (e) => {
    if (!isParallaxEnabled()) {
      targetX = 0;
      targetY = 0;
      return;
    }
    if (isTouching) return; // палец на экране — гироскоп молчит
    if (e.gamma === null || e.beta === null) return;

    // Защита от gimbal lock (резкий скачок при наклоне вниз)
    const safeBeta = Math.max(-40, Math.min(40, e.beta));
    const weight = 1 - Math.abs(safeBeta) / 40;

    targetX = Math.max(-1, Math.min(1, safeBeta / 40));
    targetY = Math.max(-1, Math.min(1, (e.gamma / 90) * weight));
  });

  let rafId = null;
  function renderFrame() {
    // БЛЮР СТРЕССА
    const sanity = state?.hero?.stats?.sanity ?? 100;
    const safeSanity = Math.max(0, Math.min(100, Number(sanity)));
    const stress = 100 - safeSanity;
    const idleTime = (Date.now() - lastMouseMove) / 1000;

    const wantOpacity = idleTime > 3 ? "0" : "1";
    if (renderFrame._lastCursorOpacity !== wantOpacity) {
      const vCursor = document.getElementById("virtual-cursor");
      if (vCursor) {
        vCursor.style.opacity = wantOpacity;
      }
      renderFrame._lastCursorOpacity = wantOpacity;
    }

    const targetBlurAmount =
      idleTime > 3 && stress > 50 ? (stress / 100 - 0.5) * 15 : 0;
    currentBlur += (targetBlurAmount - currentBlur) * 0.05;
    if (currentBlur < 0.1) currentBlur = 0;
    document.documentElement.style.setProperty(
      "--stress-blur",
      `${currentBlur}px`,
    );

    // ПАРАЛЛАКС
    currentX += (targetX - currentX) * 0.06;
    currentY += (targetY - currentY) * 0.06;

    document
      .querySelectorAll("#sharp-background-layers .bg-layer")
      .forEach((layer) => {
        layer.style.transform = `translate(${currentX * 30}px, ${currentY * 30}px) scale(1.15)`;
      });
    document
      .querySelectorAll("#character-layer .character-wrapper")
      .forEach((layer) => {
        layer.style.transform = `translate(${currentX * 35}px, ${currentY * 2}px)`;
      });
    document.querySelectorAll("#interaction-layer").forEach((layer) => {
      layer.style.transform = `translate(${currentX * 30}px, ${currentY * 30}px)`;
    });

    const docOverlay = document.getElementById("document-overlay");
    if (docOverlay && docOverlay.style.display !== "none") {
      docOverlay.style.transform = `perspective(2000px) translate(calc(-50% + ${currentX * 35}px), calc(-50% + ${currentY * 35}px)) rotateX(28deg) rotateY(0deg) rotateZ(-10deg)`;
    }

    rafId = requestAnimationFrame(renderFrame);
  }

  rafId = requestAnimationFrame(renderFrame);
})();

export {};

import { state } from "../core/state.js";

export const initEffects = () => {
  const app = document.getElementById("app");
  let lastMouseMove = Date.now();
  let currentBlur = 0;

  window.addEventListener("mousemove", () => {
    lastMouseMove = Date.now();
  });

  const update = () => {
    const stress = state.hero.stats.stress; // <- ФИКС: берём напрямую
    const factor = stress / 100;
    const idleTime = Date.now() - lastMouseMove;

    // Классы для CSS
    app.classList.remove("stress-low", "stress-med", "stress-high");
    if (stress >= 85) app.classList.add("stress-high");
    else if (stress >= 50) app.classList.add("stress-med");
    else if (stress >= 20) app.classList.add("stress-low");

    // Блюр логика (Gaze Control)
    let targetBlur = 0;
    if (idleTime > 600) {
      targetBlur = factor * 15;
    }

    const lerpSpeed = targetBlur > currentBlur ? 0.01 + factor * 0.03 : 0.15;
    currentBlur += (targetBlur - currentBlur) * lerpSpeed;
    if (currentBlur < 0.1) currentBlur = 0;

    // Применяем блюр к слоям (НЕ к #app, чтобы UI не плыл)
    const bg = document.getElementById("bg-layer");
    const char = document.getElementById("character-layer");
    if (bg) bg.style.filter = `blur(${currentBlur}px)`;
    if (char) char.style.filter = `blur(${currentBlur}px)`;

    app.style.setProperty("--stress-val", factor);
    requestAnimationFrame(update);
  };

  requestAnimationFrame(update);
};

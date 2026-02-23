import { state } from "../core/state.js";

export const initEffects = () => {
  const app = document.getElementById("app");
  let lastMouseMove = Date.now();
  let currentBlur = 0;
  let lastSanityTier = "";
  let lastBlur = -1;
  let lastStressVal = -1;

  window.addEventListener("mousemove", () => {
    lastMouseMove = Date.now();
  });

  const update = () => {
    const sanity = state.hero.stats.sanity;
    const stress = 100 - sanity;
    const factor = stress / 100;

    // 1. СЧИТАЕМ ТИР СТРЕССА
    let currentTier = "normal"; // по умолчанию
    if (stress >= 80) currentTier = "high";
    else if (stress >= 50) currentTier = "med";
    else if (stress >= 20) currentTier = "low";

    // 2. ПРИМЕНЯЕМ КЛАССЫ ТОЛЬКО ПРИ ИЗМЕНЕНИИ (Dirty Check)
    if (currentTier !== lastSanityTier) {
      app.classList.remove("stress-low", "stress-med", "stress-high");
      if (currentTier !== "normal") {
        app.classList.add(`stress-${currentTier}`);
      }
      lastSanityTier = currentTier; // запомнили
    }

    // 3. СЧИТАЕМ БЛЮР
    const idleTime = (Date.now() - lastMouseMove) / 1000;
    let targetBlur = 0;
    if (idleTime > 3) {
      targetBlur = factor * 15;
    }

    const lerpSpeed = targetBlur > currentBlur ? 0.01 + factor * 0.03 : 0.15;
    currentBlur += (targetBlur - currentBlur) * lerpSpeed;
    if (currentBlur < 0.1) currentBlur = 0;

    // 4. ПРИМЕНЯЕМ БЛЮР ТОЛЬКО ПРИ ИЗМЕНЕНИИ (Dirty Check)
    if (Math.abs(currentBlur - lastBlur) > 0.05) {
      const bg = document.getElementById("bg-layer");
      const char = document.getElementById("character-layer");
      if (bg) bg.style.filter = `blur(${currentBlur}px)`;
      if (char) char.style.filter = `blur(${currentBlur}px)`;
      lastBlur = currentBlur; // запомнили
    }

    // 5. ПРИМЕНЯЕМ CSS ПЕРЕМЕННУЮ ТОЛЬКО ПРИ ИЗМЕНЕНИИ
    if (Math.abs(factor - lastStressVal) > 0.01) {
      app.style.setProperty("--stress-val", factor);
      lastStressVal = factor;
    }

    // 6. ТРЯСКА (Тут логика нормальная, оставляем твою)
    if (stress >= 80) {
      const dialogBox = document.getElementById("dialog-box-container");
      if (dialogBox && !dialogBox.classList.contains("shaking")) {
        dialogBox.classList.add("shaking");

        const shakeDuration = 300 + Math.random() * 300;
        setTimeout(() => {
          dialogBox.classList.remove("shaking");
        }, shakeDuration);

        const pauseDuration = 2000 + sanity * 50;
        setTimeout(() => {
          if (state.hero.stats.sanity <= 20 && dialogBox) {
            dialogBox.classList.remove("shaking");
          }
        }, shakeDuration + pauseDuration);
      }
    }

    requestAnimationFrame(update);
  };
};

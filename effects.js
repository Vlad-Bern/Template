import { state } from "../core/state.js";

export const initEffects = () => {
  const app = document.getElementById("app");
  let lastMouseMove = Date.now();
  let currentBlur = 0;

  window.addEventListener("mousemove", () => {
    lastMouseMove = Date.now();
  });

  const update = () => {
    const sanity = state.hero.stats.sanity; // Берём sanity из state
    const stress = 100 - sanity; // Считаем stress (инверсия sanity)
    const factor = stress / 100;

    // Классы для CSS
    app.classList.remove("stress-low", "stress-med", "stress-high");
    if (stress >= 80)
      app.classList.add("stress-high"); // sanity <= 20
    else if (stress >= 50)
      app.classList.add("stress-med"); // sanity <= 50
    else if (stress >= 20) app.classList.add("stress-low"); // sanity <= 80

    // Блюр логика (Gaze Control)
    const idleTime = (Date.now() - lastMouseMove) / 1000; // Секунды без движения мыши
    let targetBlur = 0;
    if (idleTime > 3) {
      // 3 секунды idle
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

    if (stress >= 80) {
      // Режим психа
      const dialogBox = document.getElementById("dialog-box-container");
      if (dialogBox && !dialogBox.classList.contains("shaking")) {
        // Запускаем тряску
        dialogBox.classList.add("shaking");

        // Убираем через 300-600 мс (короткий приступ)
        const shakeDuration = 300 + Math.random() * 300;
        setTimeout(() => {
          dialogBox.classList.remove("shaking");
        }, shakeDuration);

        // Пауза зависит от sanity: чем хуже, тем чаще приступы
        const pauseDuration = 2000 + sanity * 50; // При sanity=0 → 2 сек, при sanity=20 → 3 сек
        setTimeout(() => {
          // Рекурсивно повторяем, если всё ещё в психозе
          if (state.hero.stats.sanity <= 20) {
            dialogBox.classList.remove("shaking"); // Сброс для перезапуска
          }
        }, shakeDuration + pauseDuration);
      }
    }

    requestAnimationFrame(update);
  };

  requestAnimationFrame(update);
};

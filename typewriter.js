import { state } from "./state.js";

export class Typewriter {
  constructor(elementId) {
    this.element = document.getElementById(elementId);
    this.isTyping = false;
    this.skipRequested = false;
    this.fullText = "";
  }

  async type(text) {
    const sanity = state.hero?.stats?.sanity ?? 100;
    this.fullText = text || "";
    this.isTyping = true;
    this.skipRequested = false;

    if (!this.element) return;
    this.element.classList.remove("waiting");
    this.element.textContent = "";

    const baseSpeed = state.settings?.typewriterSpeed || 30;
    const chars = this.fullText.split("");

    // 1. Создаем коробку для букв
    const fragment = document.createDocumentFragment();
    this.spans = []; // Сохраняем ссылки на буквы, чтобы потом их показывать

    // 2. Генерируем все <span> в памяти
    for (let i = 0; i < chars.length; i++) {
      const char = chars[i];
      const span = document.createElement("span");
      span.textContent = char;
      span.style.opacity = "0";
      span.style.transition = "opacity 0.2s ease"; // Убрали transform

      // Глитч (Мираж)
      if (sanity < 40 && Math.random() < (40 - sanity) / 300) {
        this.applyMirageEffect(span, char);
      }

      fragment.appendChild(span);
      this.spans.push(span);
    }

    // 3. Вставляем все невидимые буквы в DOM за 1 раз
    this.element.appendChild(fragment);

    // 4. Запускаем цикл показа
    for (let i = 0; i < chars.length; i++) {
      if (this.skipRequested) {
        this.applyFinalText();
        return;
      }

      const char = chars[i];
      const span = this.spans[i];

      // Анимация входа
      requestAnimationFrame(() => {
        span.style.opacity = "1";
        span.style.transform = "translateY(0)";
      });

      // Расчет паузы (ТВОЯ ЛОГИКА)
      let delay = baseSpeed;
      if ([".", "!", "?"].includes(char)) delay = baseSpeed * 8;
      else if ([",", "-", ":"].includes(char)) delay = baseSpeed * 4;

      // Умный сон
      const steps = Math.ceil(delay / 10);
      for (let s = 0; s < steps; s++) {
        if (this.skipRequested) {
          this.applyFinalText();
          return;
        }
        await new Promise((r) => setTimeout(r, 10));
      }
    }

    this.isTyping = false;
    this.element.classList.add("waiting");
  }

  applyMirageEffect(span, originalChar) {
    const glitchChars = "▰▱▲△▴▵▶▷";
    span.textContent =
      glitchChars[Math.floor(Math.random() * glitchChars.length)];
    span.classList.add("glitch-char");

    setTimeout(
      () => {
        // Если мы уже скипнули и спан удалён — ничего не делаем
        if (!this.skipRequested && span.parentNode) {
          span.textContent = originalChar;
          span.classList.remove("glitch-char");
        }
      },
      150 + Math.random() * 200,
    );
  }

  applyFinalText() {
    // ВСЕГДА чистый текст при скипе (как ты просил)
    this.element.textContent = this.fullText;
    this.isTyping = false;
    this.skipRequested = false;
    this.element.classList.add("waiting");
  }

  skip() {
    if (this.isTyping) {
      this.skipRequested = true;
    }
  }
}

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

    for (let i = 0; i < chars.length; i++) {
      // ПРОВЕРКА СККИПА: В начале каждого шага
      if (this.skipRequested) {
        this.applyFinalText();
        return; // Сразу выходим, не дожидаясь конца цикла
      }

      const char = chars[i];
      const span = document.createElement("span");
      span.textContent = char;

      // СТИЛЬ ПОЯВЛЕНИЯ
      span.style.opacity = "0";
      span.style.transform = "translateY(4px)";
      span.style.display = "inline-block";
      span.style.transition = "opacity 0.2s ease, transform 0.2s ease";
      if (char === " ") span.style.whiteSpace = "pre";

      // ГЛИТЧ (Мираж)
      if (sanity < 40 && Math.random() < (40 - sanity) / 300) {
        this.applyMirageEffect(span, char);
      }

      this.element.appendChild(span);

      // Анимация входа
      requestAnimationFrame(() => {
        span.style.opacity = "1";
        span.style.transform = "translateY(0)";
      });

      // РАСЧЕТ ПАУЗЫ
      let delay = baseSpeed;
      if ([".", "!", "?"].includes(char)) delay = baseSpeed * 8;
      else if ([",", "-", ":"].includes(char)) delay = baseSpeed * 4;

      // УМНЫЙ СОН: проверяем скип каждые 10мс, чтобы не "тупить" на длинных паузах
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

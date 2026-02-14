// typewriter.js
import { state } from "./state.js";

export class Typewriter {
  constructor(elementId) {
    this.element = document.getElementById(elementId);
    this.isTyping = false;
    this.skipRequested = false;
    this.fullText = "";
  }

  async type(text) {
    // ЗАЩИТА: Если текста нет, превращаем в пустую строку
    this.fullText = text || "";

    this.isTyping = true;
    this.skipRequested = false;
    this.element.classList.remove("waiting");
    this.element.textContent = "";

    // Если текст пустой, просто выходим
    if (!this.fullText) {
      this.isTyping = false;
      return;
    }

    const chars = this.fullText.split(""); // Теперь безопасно
    for (let i = 0; i < chars.length; i++) {
      if (this.skipRequested) {
        this.applyFinalText();
        break;
      }

      const { stress } = state.hero.stats;
      let char = chars[i];
      let delay = state.config.typewriterSpeed;

      // Глитч логика
      if (stress > 70 && Math.random() < 0.15) {
        char = "$#!@%&"[Math.floor(Math.random() * 6)];
      }

      this.element.textContent += char;
      await new Promise((res) => setTimeout(res, delay));
    }

    this.isTyping = false;
    this.element.classList.add("waiting");
  }
  applyFinalText() {
    const { stress } = state.hero.stats;
    if (stress > 80) {
      this.element.textContent = this.fullText
        .split("")
        .map((c) =>
          Math.random() < 0.1 ? "?!#$@"[Math.floor(Math.random() * 5)] : c,
        )
        .join("");
    } else {
      this.element.textContent = this.fullText;
    }
  }

  skip() {
    if (this.isTyping) {
      this.skipRequested = true;
      console.log("[Typewriter] Skip requested!"); // Добавь лог для проверки
    }
  }
}

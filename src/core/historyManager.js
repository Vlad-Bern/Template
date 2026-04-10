import { characters } from "../data/characters.js";
import { state } from "./state.js"; // Важно: импортируем state для проверки флагов!

export class HistoryManager {
  constructor() {
    this.history = [];
    this.modalOpen = false;
    this.panel = document.getElementById("history-panel");
    this.content = document.getElementById("history-content");
    this.backdrop = document.getElementById("modal-backdrop"); // Никакого создания элементов!
    this.initEvents();
  }

  initEvents() {
    // Закрытие по кнопке или фону
    document.addEventListener("click", (e) => {
      if (window.saveManager?.modalOpen) return;

      if (e.target.closest("#open-history-btn")) {
        e.stopPropagation();
        this.showHistory();
        return;
      }

      if (this.modalOpen) {
        const clickedInsideContent = e.target.closest("#history-content");
        if (!clickedInsideContent) {
          e.stopPropagation();
          this.hideHistory();
        }
      }
    });

    // Обработка колесика мыши (только открытие)
    let isScrolling = false;
    document.addEventListener(
      "wheel",
      (e) => {
        if (window.saveManager?.modalOpen) {
          e.preventDefault();
          e.stopPropagation();
          return;
        }

        if (window.sm && window.sm.cs && window.sm.cs.isActive) return;
        if (this.modalOpen && e.target.closest("#history-content")) return;
        if (isScrolling) return;

        if (e.deltaY < -20 && !this.modalOpen) {
          isScrolling = true;
          this.showHistory();
          setTimeout(() => {
            isScrolling = false;
          }, 300);
        }
      },
      { passive: false },
    );

    let touchStartY = 0;
    document.addEventListener(
      "touchstart",
      (e) => {
        touchStartY = e.touches[0].clientY;
      },
      { passive: true },
    );

    document.addEventListener(
      "touchmove",
      (e) => {
        if (window.saveManager?.modalOpen) return;
        if (this.modalOpen) return;
        if (window.sm?.cs?.isActive) return;

        const deltaY = touchStartY - e.touches[0].clientY;
        if (deltaY > 40) this.showHistory();
      },
      { passive: true },
    );
  }

  addToHistory(speakerKey, text) {
    let finalName = speakerKey;

    if (speakerKey && characters[speakerKey]) {
      const char = characters[speakerKey];
      // ТОЧНО ТАКАЯ ЖЕ УНИВЕРСАЛЬНАЯ ПРОВЕРКА
      if (char.requiresFlag && !state.flags[char.requiresFlag]) {
        finalName = "???";
      } else {
        finalName = char.name;
      }
    }

    this.history.push({
      speakerKey: speakerKey,
      displayName: finalName,
      text: text,
    });

    if (this.history.length > 50) this.history.shift();
  }

  showHistory() {
    if (!this.panel || !this.content) return;

    this.content.textContent = "";

    this.history.forEach((entry) => {
      const entryDiv = document.createElement("div");
      entryDiv.className = "history-entry";

      if (!entry.speakerKey) {
        // Режим рассказчика
        const span = document.createElement("span");
        span.className = "history-narration";
        span.textContent = entry.text;
        entryDiv.appendChild(span);
      } else {
        // Режим персонажа
        const strong = document.createElement("strong");
        // Берем имя из памяти (оно уже навсегда "???" или "Кагами")
        strong.textContent = (entry.displayName || entry.speakerKey) + ": ";

        // Красим имя в цвет персонажа
        const charColor = characters[entry.speakerKey]?.color || "#cccccc";
        strong.style.color = charColor;

        const span = document.createElement("span");
        span.textContent = entry.text;

        entryDiv.appendChild(strong);
        entryDiv.appendChild(span);
      }

      this.content.appendChild(entryDiv);
    });

    if (this.backdrop) this.backdrop.style.display = "block";
    this.panel.style.display = "flex";
    this.modalOpen = true;

    const gameUi = document.getElementById("game-ui");
    if (gameUi) gameUi.style.pointerEvents = "none";

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        this.content.scrollTop = this.content.scrollHeight;
      });
    });
  }

  hideHistory() {
    if (this.panel) this.panel.style.display = "none";
    if (this.backdrop) this.backdrop.style.display = "none";
    this.modalOpen = false;

    const gameUi = document.getElementById("game-ui");
    if (gameUi) {
      gameUi.style.pointerEvents = "";
    }
  }
}

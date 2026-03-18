import { characters } from "../data/characters.js";

// historyManager.js
export class HistoryManager {
  constructor() {
    this.history = [];
    this.modalOpen = false;
    this.panel = document.getElementById("history-panel");
    this.content = document.getElementById("history-content");
    this.backdrop = document.getElementById("modal-backdrop");

    // Инициализация событий
    this.initEvents();
  }

  initEvents() {
    // Закрытие по кнопке или фону
    document.addEventListener("click", (e) => {
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
        if (this.modalOpen) return;
        if (window.sm?.cs?.isActive) return;
        const deltaY = touchStartY - e.touches[0].clientY;
        if (deltaY > 40) this.showHistory();
      },
      { passive: true },
    );
  }

  addToHistory(speakerKey, text) {
    // Сохраняем в массив
    this.history.push({ speaker: speakerKey, text: text });
    if (this.history.length > 50) this.history.shift(); // Ограничение длины
  }

  showHistory() {
    if (!this.panel || !this.content) return;

    // Очищаем и рендерим
    this.content.textContent = "";
    this.history.forEach((entry) => {
      const entryDiv = document.createElement("div");
      entryDiv.className = "history-entry";

      if (!entry.speaker) {
        const span = document.createElement("span");
        span.className = "history-narration";
        span.textContent = entry.text;
        entryDiv.appendChild(span);
      } else {
        const strong = document.createElement("strong");
        const displayName = characters[entry.speaker]?.name || entry.speaker;
        strong.textContent = displayName + ": ";
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
      // Проверяем, не скрыт ли UI через ПКМ (см. Проблему 2)
      if (window.sm && window.sm.uiHidden) {
        gameUi.style.pointerEvents = "none";
      } else {
        gameUi.style.pointerEvents = "auto";
      }
    }
  }
}

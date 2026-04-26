import { characters } from "../data/characters.js";
import { state } from "./state.js"; // Важно: импортируем state для проверки флагов!
import { inputManager, INPUT_PRIORITY } from "./inputManager.js";

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
      // Блокируем клики, если открыты другие модалки
      if (window.saveManager?.modalOpen) return;
      if (window.settingsManager?.modalOpen) return;

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

    // Обработка колесика мыши (только открытие истории)
    let isScrolling = false;
    inputManager.on(
      "wheel",
      (e) => {
        // Блокируем колесо в главном меню / дисклеймере / сплэше
        if (
          document.getElementById("main-menu-screen")?.style.display !== "none"
        )
          return false;
        const _d = document.getElementById("disclaimer-screen");
        const _s = document.getElementById("splash-screen");
        if (
          (_d && _d.style.display !== "none") ||
          (_s && _s.style.display !== "none")
        )
          return false;

        // Если открыты другие модалки — пусть они и обработают (саveManager тоже подписан с MODAL)
        if (window.saveManager?.modalOpen || window.settingsManager?.modalOpen) {
          return false;
        }
        if (window.sm && window.sm.cs && window.sm.cs.isActive) return false;
        if (this.modalOpen && e.target.closest("#history-content")) return false;
        if (isScrolling) return false;
        if (e.deltaY < -20 && !this.modalOpen) {
          isScrolling = true;
          this.showHistory();
          setTimeout(() => {
            isScrolling = false;
          }, 300);
          return true;
        }
        return false;
      },
      { priority: INPUT_PRIORITY.SCENE, owner: this },
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

    // +++ ФИКС: Используем CSS-классы вместо жесткого display
    if (this.backdrop) this.backdrop.classList.add("active");
    this.panel.classList.add("active");
    this.modalOpen = true;

    const gameUi = document.getElementById("game-ui");
    // Не забываем, что pointerEvents="none" у gameUi блочит и клики по кнопкам истории (крестик),
    // потому что панель истории лежит ВНУТРИ game-ui.
    // Вместо этого мы блокируем только сам dialog-wrapper!
    const dialogWrapper = document.getElementById("dialog-wrapper");
    if (dialogWrapper) dialogWrapper.style.pointerEvents = "none";

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        this.content.scrollTop = this.content.scrollHeight;
      });
    });
  }

  hideHistory() {
    if (!this.modalOpen) return;

    window.playUISound("close");

    if (this.panel) this.panel.classList.remove("active");
    if (this.backdrop) this.backdrop.classList.remove("active");
    this.modalOpen = false;

    const dialogWrapper = document.getElementById("dialog-wrapper");
    if (dialogWrapper) {
      dialogWrapper.style.pointerEvents = "auto";
    }
  }
}

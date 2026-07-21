import { inputManager, INPUT_PRIORITY } from "../core/inputManager.js";

const SUPPORTER_CARD_STORAGE_KEY = "sota_seen_supporter_card_version";

class SupporterWelcomeManager {
  constructor() {
    this.modalOpen = false;
    this.autoShowHandled = false;
    this.autoShowTimer = null;

    this.modal = document.getElementById("supporter-welcome-modal");

    this.content = document.getElementById("supporter-welcome-content");

    this.continueButton = document.getElementById("continue-supporter-welcome");

    this.currentVersion = this.modal?.dataset.cardVersion || null;

    this.touchStartX = null;
    this.touchStartY = null;

    this.initEvents();
  }

  initEvents() {
    if (!this.modal || !this.content || !this.continueButton) {
      console.error(
        "[SupporterWelcomeManager] Не найдены элементы открытки.",
      );

      return;
    }

    this.continueButton.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();

      this.close();
    });

    // Клик или тап по затемнённой области.
    this.modal.addEventListener("click", (event) => {
      if (!this.modalOpen) return;

      if (!event.target.closest("#supporter-welcome-content")) {
        event.preventDefault();
        event.stopPropagation();

        this.close();
      }
    });

    // Показываем после полного появления главного меню.
    window.addEventListener("sotaMainMenuReady", () => {
      this.tryAutoOpen();
    });

    // Escape закрывает открытку.
    // Остальные клавиши не проходят в главное меню.
    inputManager.on(
      "keydown",
      (event) => {
        if (!this.modalOpen) return false;

        if (event.code === "Escape") {
          event.preventDefault();
          this.close();
        }

        return true;
      },
      {
        priority: INPUT_PRIORITY.MODAL,
        owner: this,
      },
    );

    // Правая кнопка мыши закрывает открытку.
    inputManager.on(
      "contextmenu",
      (event) => {
        if (!this.modalOpen) return false;

        event.preventDefault();
        this.close();

        return true;
      },
      {
        priority: INPUT_PRIORITY.MODAL,
        owner: this,
      },
    );

    // Колесо может прокручивать текст открытки,
    // но не должно воздействовать на главное меню.
    inputManager.on(
      "wheel",
      (event) => {
        if (!this.modalOpen) return false;

        if (event.target.closest("#supporter-welcome-content")) {
          return false;
        }

        return true;
      },
      {
        priority: INPUT_PRIORITY.MODAL,
        owner: this,
      },
    );

    // Начало мобильного жеста.
    this.modal.addEventListener(
      "touchstart",
      (event) => {
        if (!this.modalOpen || event.touches.length !== 1) {
          this._resetTouch();
          return;
        }

        const touch = event.touches[0];

        this.touchStartX = touch.clientX;
        this.touchStartY = touch.clientY;
      },
      {
        passive: true,
      },
    );

    // Закрытие горизонтальным свайпом.
    this.modal.addEventListener(
      "touchend",
      (event) => {
        if (
          !this.modalOpen ||
          this.touchStartX === null ||
          this.touchStartY === null ||
          event.changedTouches.length !== 1
        ) {
          this._resetTouch();
          return;
        }

        const touch = event.changedTouches[0];

        const distanceX = touch.clientX - this.touchStartX;

        const distanceY = touch.clientY - this.touchStartY;

        this._resetTouch();

        const horizontalDistance = Math.abs(distanceX);

        const verticalDistance = Math.abs(distanceY);

        if (horizontalDistance >= 80 && horizontalDistance > verticalDistance) {
          this.close();
        }
      },
      {
        passive: true,
      },
    );

    this.modal.addEventListener(
      "touchcancel",
      () => {
        this._resetTouch();
      },
      {
        passive: true,
      },
    );
  }

  _resetTouch() {
    this.touchStartX = null;
    this.touchStartY = null;
  }

  _getSeenVersion() {
    try {
      return localStorage.getItem(SUPPORTER_CARD_STORAGE_KEY);
    } catch (error) {
      console.warn(
        "[SupporterWelcomeManager] Не удалось прочитать версию открытки:",
        error,
      );

      return null;
    }
  }

  _markCurrentVersionAsSeen() {
    if (!this.currentVersion) return;

    try {
      localStorage.setItem(SUPPORTER_CARD_STORAGE_KEY, this.currentVersion);
    } catch (error) {
      console.warn(
        "[SupporterWelcomeManager] Не удалось сохранить версию открытки:",
        error,
      );
    }
  }

  _mainMenuIsVisible() {
    const mainMenu = document.getElementById("main-menu-screen");

    return Boolean(
      mainMenu && window.getComputedStyle(mainMenu).display !== "none",
    );
  }

  _anotherModalIsOpen() {
    return Boolean(
      window.patchNotesManager?.modalOpen ||
      window.saveManager?.modalOpen ||
      window.settingsManager?.modalOpen ||
      window.sm?.hm?.modalOpen,
    );
  }

  tryAutoOpen() {
    if (this.autoShowHandled || this.modalOpen || !this.currentVersion) {
      return;
    }

    if (this._getSeenVersion() === this.currentVersion) {
      this.autoShowHandled = true;
      return;
    }

    clearTimeout(this.autoShowTimer);

    this.autoShowTimer = setTimeout(() => {
      if (!this._mainMenuIsVisible()) {
        return;
      }

      // Если игрок успел открыть другое окно,
      // ждём его закрытия и пробуем снова.
      if (this._anotherModalIsOpen()) {
        this.tryAutoOpen();
        return;
      }

      this.open();
    }, 450);
  }

  open() {
    if (this.modalOpen || !this.modal || !this.currentVersion) {
      return;
    }

    clearTimeout(this.autoShowTimer);

    this.modalOpen = true;
    this.autoShowHandled = true;

    this.modal.hidden = false;
    this.modal.setAttribute("aria-hidden", "false");

    this._markCurrentVersionAsSeen();

    if (window.playUISound) {
      window.playUISound("open");
    }

    requestAnimationFrame(() => {
      this.continueButton?.focus();
    });
  }

  close() {
    if (!this.modalOpen || !this.modal) return;

    if (window.playUISound) {
      window.playUISound("close");
    }

    this.modalOpen = false;

    this.modal.hidden = true;
    this.modal.setAttribute("aria-hidden", "true");

    this._resetTouch();

    requestAnimationFrame(() => {
      document.getElementById("btn-new-game")?.focus();
    });
  }
}

window.supporterWelcomeManager = new SupporterWelcomeManager();

export {};

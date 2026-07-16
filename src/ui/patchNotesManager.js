import { inputManager, INPUT_PRIORITY } from "../core/inputManager.js";

const PATCH_NOTES_STORAGE_KEY = "sota_seen_patch_notes_version";

class PatchNotesManager {
  constructor() {
    this.modalOpen = false;
    this.autoShowHandled = false;
    this.autoShowTimer = null;

    this.opener = document.getElementById("open-patch-notes");
    this.modal = document.getElementById("patch-notes-modal");
    this.content = document.getElementById("patch-notes-content");
    this.closeButton = document.getElementById("close-patch-notes");

    this.currentVersion = this.opener?.dataset.patchVersion || null;

    this.touchStartY = null;

    this.initEvents();
  }

  initEvents() {
    if (!this.opener || !this.modal || !this.content) return;

    // Ручное открытие по клику на версию.
    this.opener.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();

      this.open();
    });

    // Закрытие крестиком.
    this.closeButton?.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();

      this.close();
    });

    // Клик или тап по затемнённой области.
    this.modal.addEventListener("click", (event) => {
      if (!this.modalOpen) return;

      if (!event.target.closest("#patch-notes-content")) {
        event.preventDefault();
        event.stopPropagation();

        this.close();
      }
    });

    // Автопоказ после завершения появления главного меню.
    window.addEventListener("sotaMainMenuReady", () => {
      this.tryAutoOpen();
    });

    // Закрытие через Escape и блокировка остальных клавиш.
    inputManager.on(
      "keydown",
      (event) => {
        if (!this.modalOpen) return false;

        if (event.code === "Escape") {
          this.close();
        }

        return true;
      },
      {
        priority: INPUT_PRIORITY.MODAL,
        owner: this,
      },
    );

    // Закрытие правой кнопкой мыши.
    inputManager.on(
      "contextmenu",
      () => {
        if (!this.modalOpen) return false;

        this.close();
        return true;
      },
      {
        priority: INPUT_PRIORITY.MODAL,
        owner: this,
      },
    );

    // Не даём колесу воздействовать на главное меню.
    inputManager.on(
      "wheel",
      (event) => {
        if (!this.modalOpen) return false;

        // Содержимое патчноута должно нормально прокручиваться.
        if (event.target.closest("#patch-notes-content")) {
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
          this.touchStartY = null;
          return;
        }

        this.touchStartY = event.touches[0].clientY;
      },
      {
        passive: true,
      },
    );

    // Свайп вниз закрывает окно, но только если список уже наверху.
    this.modal.addEventListener(
      "touchend",
      (event) => {
        if (
          !this.modalOpen ||
          this.touchStartY === null ||
          event.changedTouches.length !== 1
        ) {
          this.touchStartY = null;
          return;
        }

        const touchEndY = event.changedTouches[0].clientY;
        const swipeDistance = touchEndY - this.touchStartY;

        this.touchStartY = null;

        if (swipeDistance >= 80 && this.content.scrollTop <= 0) {
          this.close();
        }
      },
      {
        passive: true,
      },
    );
  }

  _getSeenVersion() {
    try {
      return localStorage.getItem(PATCH_NOTES_STORAGE_KEY);
    } catch (error) {
      console.warn(
        "[PatchNotesManager] Не удалось прочитать просмотренную версию:",
        error,
      );

      return null;
    }
  }

  _markCurrentVersionAsSeen() {
    if (!this.currentVersion) return;

    try {
      localStorage.setItem(PATCH_NOTES_STORAGE_KEY, this.currentVersion);
    } catch (error) {
      console.warn(
        "[PatchNotesManager] Не удалось сохранить просмотренную версию:",
        error,
      );
    }
  }

  tryAutoOpen() {
    // За один запуск проверяем автоматическое открытие только один раз.
    if (this.autoShowHandled) return;

    this.autoShowHandled = true;

    if (!this.currentVersion) return;

    const seenVersion = this._getSeenVersion();

    // Эту версию на данном устройстве уже показывали.
    if (seenVersion === this.currentVersion) return;

    clearTimeout(this.autoShowTimer);

    // Небольшая пауза после появления главного меню.
    this.autoShowTimer = setTimeout(() => {
      const mainMenu = document.getElementById("main-menu-screen");

      const menuIsVisible =
        mainMenu && window.getComputedStyle(mainMenu).display !== "none";

      if (!menuIsVisible) return;

      // Защита от одновременного открытия нескольких окон.
      if (
        window.saveManager?.modalOpen ||
        window.settingsManager?.modalOpen ||
        window.sm?.hm?.modalOpen
      ) {
        return;
      }

      this.open();
    }, 350);
  }

  open() {
    if (this.modalOpen || !this.modal) return;

    clearTimeout(this.autoShowTimer);

    if (window.playUISound) {
      window.playUISound("open");
    }

    this.modalOpen = true;
    this.modal.hidden = false;
    this.modal.setAttribute("aria-hidden", "false");

    // Версия считается просмотренной, когда окно реально показалось.
    this._markCurrentVersionAsSeen();

    requestAnimationFrame(() => {
      this.closeButton?.focus();
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
    this.touchStartY = null;

    requestAnimationFrame(() => {
      this.opener?.focus();
    });
  }
}

window.patchNotesManager = new PatchNotesManager();

export {};

import { inputManager, INPUT_PRIORITY } from "../core/inputManager.js";

class PatchNotesManager {
  constructor() {
    this.modalOpen = false;

    this.opener = document.getElementById("open-patch-notes");
    this.modal = document.getElementById("patch-notes-modal");
    this.content = document.getElementById("patch-notes-content");
    this.closeButton = document.getElementById("close-patch-notes");

    this.touchStartY = null;

    this.initEvents();
  }

  initEvents() {
    if (!this.opener || !this.modal || !this.content) return;

    // Открытие по версии игры.
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

    // Закрытие кликом или тапом по области вне содержимого.
    this.modal.addEventListener("click", (event) => {
      if (!this.modalOpen) return;

      if (!event.target.closest("#patch-notes-content")) {
        event.preventDefault();
        event.stopPropagation();
        this.close();
      }
    });

    // Закрытие по Escape.
    inputManager.on(
      "keydown",
      (event) => {
        if (!this.modalOpen) return false;

        if (event.code === "Escape") {
          this.close();
          return true;
        }

        // Пока модалка открыта, клавиши не должны управлять меню.
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

    // Не даём колесу воздействовать на элементы под модалкой.
    inputManager.on(
      "wheel",
      (event) => {
        if (!this.modalOpen) return false;

        // Внутри патчноута оставляем обычную прокрутку.
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
        if (!this.modalOpen || event.touches.length !== 1) return;

        this.touchStartY = event.touches[0].clientY;
      },
      {
        passive: true,
      },
    );

    // Свайп вниз закрывает патчноут.
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

        if (swipeDistance >= 80) {
          this.close();
        }
      },
      {
        passive: true,
      },
    );
  }

  open() {
    if (this.modalOpen || !this.modal) return;

    if (window.playUISound) {
      window.playUISound("open");
    }

    this.modalOpen = true;
    this.modal.hidden = false;
    this.modal.setAttribute("aria-hidden", "false");

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

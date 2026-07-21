import { inputManager, INPUT_PRIORITY } from "../core/inputManager.js";

class PatchNotesManager {
  constructor() {
    this.modalOpen = false;

    this.opener = document.getElementById("open-patch-notes");
    this.modal = document.getElementById("patch-notes-modal");
    this.content = document.getElementById("patch-notes-content");
    this.closeButton = document.getElementById("close-patch-notes");

    this.currentVersion = this.opener?.dataset.patchVersion || null;

    this.touchStartX = null;
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

    // Запоминаем начало мобильного жеста.
    this.modal.addEventListener(
      "touchstart",
      (event) => {
        if (!this.modalOpen || event.touches.length !== 1) {
          this.touchStartX = null;
          this.touchStartY = null;
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

    // Закрываем только горизонтальным свайпом влево или вправо.
    this.modal.addEventListener(
      "touchend",
      (event) => {
        if (
          !this.modalOpen ||
          this.touchStartX === null ||
          this.touchStartY === null ||
          event.changedTouches.length !== 1
        ) {
          this.touchStartX = null;
          this.touchStartY = null;
          return;
        }

        const touch = event.changedTouches[0];
        const distanceX = touch.clientX - this.touchStartX;
        const distanceY = touch.clientY - this.touchStartY;

        this.touchStartX = null;
        this.touchStartY = null;

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
        this.touchStartX = null;
        this.touchStartY = null;
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
    this.touchStartX = null;
    this.touchStartY = null;

    requestAnimationFrame(() => {
      this.opener?.focus();
    });
  }
}

window.patchNotesManager = new PatchNotesManager();

export {};

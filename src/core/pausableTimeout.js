// Единый PausableTimeout: учитывает modal + visibility
export class PausableTimeout {
  constructor(callback, delay) {
    this.callback = callback;
    this.remaining = delay;
    this.timerId = null;
    this.start = Date.now();
    this.isModalPaused = false;
    this.isCleared = false;

    this.handleVisibility = () => {
      if (document.hidden) {
        this.pause();
      } else if (!this.isModalPaused) {
        this.resume();
      }
    };
    document.addEventListener("visibilitychange", this.handleVisibility);

    this.checkModals = () => {
      if (this.isCleared) return;
      const modalOpen = window.isAnyModalOpen && window.isAnyModalOpen();
      if (modalOpen && !this.isModalPaused) {
        this.isModalPaused = true;
        this.pause();
      } else if (!modalOpen && this.isModalPaused && !document.hidden) {
        this.isModalPaused = false;
        this.resume();
      }
      this.rafId = requestAnimationFrame(this.checkModals);
    };

    this.resume();
    this.rafId = requestAnimationFrame(this.checkModals);
  }

  pause() {
    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = null;
      this.remaining -= Date.now() - this.start;
    }
  }

  resume() {
    if (!this.timerId && this.remaining > 0) {
      this.start = Date.now();
      this.timerId = setTimeout(() => {
        this.clear();
        this.callback();
      }, this.remaining);
    }
  }

  clear() {
    this.isCleared = true;
    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    document.removeEventListener("visibilitychange", this.handleVisibility);
  }
}

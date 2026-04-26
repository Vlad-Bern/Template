// Один центральный диспетчер ввода. Все слушатели регистрируются ЗДЕСЬ.
class InputManager {
  constructor() {
    this.keyHandlers = []; // [{priority, handler, owner}]
    this.wheelHandlers = [];
    window.addEventListener("keydown", this._onKey, { capture: true });
    window.addEventListener("wheel", this._onWheel, {
      capture: true,
      passive: false,
    });
  }

  // priority: больше = раньше срабатывает. Модалки = 100, сцена = 10.
  on(type, handler, { priority = 0, owner = null } = {}) {
    const list = type === "keydown" ? this.keyHandlers : this.wheelHandlers;
    list.push({ handler, priority, owner });
    list.sort((a, b) => b.priority - a.priority);
    return () => this.off(type, handler);
  }

  off(type, handler) {
    const list = type === "keydown" ? this.keyHandlers : this.wheelHandlers;
    const i = list.findIndex((x) => x.handler === handler);
    if (i >= 0) list.splice(i, 1);
  }

  _onKey = (e) => this._dispatch(this.keyHandlers, e);
  _onWheel = (e) => this._dispatch(this.wheelHandlers, e);

  _dispatch(list, e) {
    for (const { handler } of list) {
      const stop = handler(e);
      if (stop === true) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        return;
      }
    }
  }
}

export const inputManager = new InputManager();
window.inputManager = inputManager;

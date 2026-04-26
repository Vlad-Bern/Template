// Центральный диспетчер ввода. Один слушатель на window, всё остальное — подписки.
//
// Контракт обработчика:
//   handler(e) => true  — событие "съели", дальше не передаём
//   handler(e) => false / undefined — пропускаем вниз по приоритету
//
// Приоритет: больше = раньше срабатывает.

const PRIORITY = Object.freeze({
  CONFIRM: 100, // showConfirm — самый верх
  MODAL: 90, // save / load / settings / history
  CHOICE: 50, // выбор реплики
  SCENE: 10, // диалог
  MENU: 0, // главное меню
});

class InputManager {
  constructor() {
    this._lists = {
      keydown: [],
      wheel: [],
      contextmenu: [],
    };

    window.addEventListener("keydown", this._dispatch.bind(this, "keydown"), {
      capture: true,
    });
    window.addEventListener("wheel", this._dispatch.bind(this, "wheel"), {
      capture: true,
      passive: false,
    });
    window.addEventListener(
      "contextmenu",
      this._dispatch.bind(this, "contextmenu"),
      { capture: true },
    );
  }

  on(type, handler, { priority = 0, owner = null } = {}) {
    if (!this._lists[type]) {
      console.warn(`[InputManager] Неизвестный тип события: ${type}`);
      return () => {};
    }
    const entry = { handler, priority, owner };
    this._lists[type].push(entry);
    this._lists[type].sort((a, b) => b.priority - a.priority);
    return () => this.off(type, handler);
  }

  off(type, handler) {
    const list = this._lists[type];
    if (!list) return;
    const i = list.findIndex((x) => x.handler === handler);
    if (i >= 0) list.splice(i, 1);
  }

  // Снять все подписки одного владельца (удобно при destroy)
  offByOwner(owner) {
    for (const type of Object.keys(this._lists)) {
      this._lists[type] = this._lists[type].filter((x) => x.owner !== owner);
    }
  }

  _dispatch(type, e) {
    const list = this._lists[type];
    for (const { handler } of list) {
      let stop;
      try {
        stop = handler(e);
      } catch (err) {
        console.error(`[InputManager] Ошибка в обработчике ${type}:`, err);
        continue;
      }
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
export const INPUT_PRIORITY = PRIORITY;

// Для обратной совместимости (например, если что-то в инлайн-скриптах)
window.inputManager = inputManager;
window.INPUT_PRIORITY = PRIORITY;

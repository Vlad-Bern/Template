import { state } from "./state.js";

let fs = null;
let path = null;
try {
  // nw - глобальный объект в NW.js
  if (typeof nw !== "undefined" && typeof require !== "undefined") {
    fs = require("fs");
    path = require("path");
  }
} catch (e) {
  console.warn("FS not available, falling back to localStorage");
}

export class SaveManager {
  constructor() {
    this.saveSlots = 60; // 10 страниц по 6 слотов
    this.currentPage = 1;
    this.containerId = "save-load-panel";
    this.mode = "save"; // "save" или "load"
    this.modalOpen = false; // ФЛАГ ДЛЯ SCENEMANAGER
    this.saveDir = this._initSaveDir();
    this.initUI();
  }

  _initSaveDir() {
    if (fs && path && typeof nw !== "undefined") {
      try {
        // Находим папку AppData (Windows) или ~/.local/share (Linux) или ~/Library/Preferences (Mac)
        const appData =
          process.env.APPDATA ||
          (process.platform == "darwin"
            ? process.env.HOME + "/Library/Preferences"
            : process.env.HOME + "/.local/share");
        const dir = path.join(appData, "SOTA_Saves"); // Название папки с сейвами

        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        return dir;
      } catch (e) {
        console.error("[SaveManager] Error creating save directory:", e);
      }
    }
    return null;
  }

  _readSave(slotIndex) {
    if (this.saveDir && fs && path) {
      const file = path.join(this.saveDir, `save_${slotIndex}.json`);
      if (fs.existsSync(file)) {
        try {
          return JSON.parse(fs.readFileSync(file, "utf-8"));
        } catch (e) {
          console.error("Error reading save file:", e);
        }
      }
      return null;
    }
    // Фолбек на браузерный localStorage
    return JSON.parse(localStorage.getItem(`sota_save_${slotIndex}`) || "null");
  }

  _writeSave(slotIndex, data) {
    if (this.saveDir && fs && path) {
      const file = path.join(this.saveDir, `save_${slotIndex}.json`);
      try {
        fs.writeFileSync(file, JSON.stringify(data, null, 2), "utf-8");
        return true;
      } catch (e) {
        console.error("Error writing save file:", e);
        return false;
      }
    }
    // Фолбек на браузерный localStorage
    localStorage.setItem(`sota_save_${slotIndex}`, JSON.stringify(data));
    return true;
  }

  _deleteSave(slotIndex) {
    if (slotIndex === 0) return;
    // 1. Пытаемся удалить физический файл (если мы в NW.js)
    if (this.saveDir && fs && path) {
      const file = path.join(this.saveDir, `save_${slotIndex}.json`);
      try {
        if (fs.existsSync(file)) fs.unlinkSync(file);
      } catch (e) {
        console.error("Error deleting save file:", e);
      }
    }
    // 2. И всегда чистим localStorage для браузера/Android
    localStorage.removeItem(`sota_save_${slotIndex}`);
  }

  initUI() {
    if (!document.getElementById(this.containerId)) {
      const panel = document.createElement("div");
      panel.id = this.containerId;

      panel.innerHTML = `
        <div id="sl-inner-content">
          <div class="sl-header">
            <h2 id="sl-title">Сохранение</h2>
            <button id="close-sl-btn">✕</button>
          </div>
          <div class="sl-pagination">
            <button id="sl-prev-page">◀</button>
            <span id="sl-page-info">Страница 1 / 10</span>
            <button id="sl-next-page">▶</button>
          </div>
          <div id="sl-slots-container"></div>
        </div>
      `;
      document.body.appendChild(panel);

      document.getElementById("close-sl-btn").addEventListener("click", (e) => {
        e.stopPropagation();
        this.close();
      });
      document
        .getElementById("sl-prev-page")
        .addEventListener("click", () => this.changePage(-1));
      document
        .getElementById("sl-next-page")
        .addEventListener("click", () => this.changePage(1));

      panel.addEventListener("click", (e) => {
        // Если открыто окно подтверждения - игнорируем клик!
        if (
          document
            .getElementById("confirm-backdrop")
            ?.classList.contains("active")
        )
          return;

        if (!e.target.closest("#sl-inner-content")) {
          e.stopPropagation();
          this.close();
        }
      });

      window.addEventListener(
        "keydown",
        (e) => {
          if (!this.modalOpen) return;

          if (
            document
              .getElementById("confirm-backdrop")
              ?.classList.contains("active")
          ) {
            return;
          }

          if (e.code === "ArrowLeft") {
            e.preventDefault();
            e.stopImmediatePropagation();
            this.changePage(-1);
            return;
          }

          if (e.code === "ArrowRight") {
            e.preventDefault();
            e.stopImmediatePropagation();
            this.changePage(1);
            return;
          }

          if (e.code === "Escape") {
            e.preventDefault();
            e.stopImmediatePropagation();
            this.close();
            return;
          }

          // Все остальные хоткеи модалок теперь обрабатывает SceneManager
        },
        { capture: true },
      );

      // Жесткая блокировка колесика мыши
      document.addEventListener(
        "wheel",
        (e) => {
          if (this.modalOpen) {
            e.stopPropagation();
          }
        },
        { passive: false, capture: true },
      );
    }
  }

  open(mode) {
    this.mode = mode;
    this.modalOpen = true;

    document.getElementById("sl-title").innerText =
      mode === "save" ? "[ СОХРАНИТЬ ДАННЫЕ ]" : "[ ЗАГРУЗИТЬ ДАННЫЕ ]";

    const panel = document.getElementById(this.containerId);
    // Добавляем класс .active (он включит display: flex и запустит CSS-анимацию!)
    panel.classList.add("active");

    this.renderSlots();
  }

  close() {
    if (!this.modalOpen) return; // Чтобы звук не играл вхолостую
    window.playUISound("close");
    this.modalOpen = false;
    const panel = document.getElementById(this.containerId);
    panel.classList.remove("active");
  }

  changePage(dir) {
    this.currentPage += dir;
    if (this.currentPage < 1) this.currentPage = 10;
    if (this.currentPage > 10) this.currentPage = 1;
    document.getElementById("sl-page-info").innerText =
      `Страница ${this.currentPage} / 10`;
    this.renderSlots();
  }

  renderSlots() {
    const container = document.getElementById("sl-slots-container");
    container.innerHTML = "";
    const startIdx = (this.currentPage - 1) * 6;

    for (let i = 0; i < 6; i++) {
      const slotIndex = startIdx + i;
      const slotData = this._readSave(slotIndex);
      const btn = document.createElement("button");

      // === ПРОВЕРКА НА АВТОСЕЙВ (Слот 0) ===
      const isAutoSave = slotIndex === 0;
      btn.className = `sl-slot-btn ${isAutoSave ? "auto-save" : ""}`;

      if (slotData) {
        const date = new Date(slotData.timestamp).toLocaleString("ru-RU", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });

        btn.innerHTML = `
          ${!isAutoSave ? '<button class="delete-save-btn" title="Удалить слот">[ DEL ]</button>' : ""}
          <div class="slot-title">${isAutoSave ? "АВТОСОХРАНЕНИЕ" : `СЛОТ ${slotIndex + 1}`}</div>
          <div class="slot-date">${date}</div>
        `;

        // Логика удаления (только если кнопка существует)
        if (!isAutoSave) {
          const delBtn = btn.querySelector(".delete-save-btn");
          delBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            window.showConfirm(
              `БЕЗВОЗВРАТНО УДАЛИТЬ ДАННЫЕ В СЛОТЕ ${slotIndex + 1}?`,
              () => {
                this._deleteSave(slotIndex);
                this.renderSlots();
              },
            );
          });
        }
      } else {
        // Если слот пустой
        btn.classList.add("empty");
        btn.innerHTML = `
          <div class="slot-title">${isAutoSave ? "АВТОСОХРАНЕНИЕ" : `СЛОТ ${slotIndex + 1}`}</div>
          <div>Пусто</div>
        `;
      }

      btn.addEventListener("click", () => {
        if (this.mode === "save") {
          this.saveGame(slotIndex);
        } else {
          this.loadGame(slotIndex, slotData);
        }
      });
      container.appendChild(btn);
    }
  }

  saveGame(slotIndex, isOverwrite = false, isAuto = false) {
    // Жестко блокируем ручные попытки сохранить в первый слот
    if (slotIndex === 0 && !isAuto) {
      console.warn("Слот 1 зарезервирован для автосохранений!");
      return;
    }

    // Если слот НЕ ПУСТОЙ и мы еще не дали команду на перезапись (isOverwrite = false)
    if (!isOverwrite && this._readSave(slotIndex)) {
      window.showConfirm(
        `ПЕРЕЗАПИСАТЬ ДАННЫЕ В СЛОТЕ ${slotIndex + 1}?`,
        () => {
          // Вызываем снова, но уже с флагом перезаписи
          this.saveGame(slotIndex, true);
        },
      );
      return; // Прерываем текущее выполнение
    }

    const dataToSave = {
      timestamp: Date.now(),
      sceneId: window.sm.currentSceneId,
      lineIndex: window.sm.currentLineIndex || 0,
      state: JSON.parse(JSON.stringify(state)),
    };

    this._writeSave(slotIndex, dataToSave);
    this.renderSlots();
  }

  loadGame(slotIndex, slotData) {
    if (!slotData) return;

    Object.assign(state.hero, slotData.state.hero);
    Object.assign(state.relations, slotData.state.relations);
    Object.assign(state.flags, slotData.state.flags);
    Object.assign(state.temp, slotData.state.temp);

    window.dispatchEvent(
      new CustomEvent("stressUpdated", {
        detail: { sanity: state.hero.stats.sanity },
      }),
    );
    window.dispatchEvent(new CustomEvent("statsUpdated"));

    this.close();

    if (window.sm) {
      // Используем новый специальный метод загрузки без дублирования статов
      if (typeof window.sm.loadSceneFromSave === "function") {
        window.sm.loadSceneFromSave(slotData.sceneId, slotData.lineIndex);
      } else {
        window.sm.loadScene(slotData.sceneId, slotData.lineIndex);
      }
    }
  }

  autoSave() {
    this._deleteSave(0); // Стираем старый автосейв по индексу 0
    this.saveGame(0, true, true); // Сохраняем в индекс 0
  }
}

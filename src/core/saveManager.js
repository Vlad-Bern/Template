import { state } from "./state.js";
import { inputManager, INPUT_PRIORITY } from "./inputManager.js";

// Первая публичная версия с официальной разблокировкой КПК.
const SAVE_SCHEMA_VERSION = 2;

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
    if (fs && path && typeof nw !== "undefined" && nw?.App?.dataPath) {
      try {
        const dir = path.join(nw.App.dataPath, "SOTA_Saves");
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

  /* 🔥 NEW МЕТОД: Полная очистка всей базы сохранений новеллы (включая автосейв) */
  wipeAllSaves() {
    for (let i = 0; i < this.saveSlots; i++) {
      // Чистим физические файлы на ПК
      if (this.saveDir && fs && path) {
        const file = path.join(this.saveDir, `save_${i}.json`);
        try {
          if (fs.existsSync(file)) fs.unlinkSync(file);
        } catch (e) {
          console.error(
            `[SaveManager] Ошибка при удалении файла save_${i}.json:`,
            e,
          );
        }
      }
      // Чистим локальное хранилище браузера/мобилок
      localStorage.removeItem(`sota_save_${i}`);
    }
    console.log(
      "%c[SaveManager] Все сохранения и автосейвы успешно уничтожены.",
      "color: #ff4d4f; font-weight: bold;",
    );

    // Перерисовываем пустую сетку слотов текущей страницы
    this.renderSlots();
  }

  initUI() {
    if (!document.getElementById(this.containerId)) {
      const panel = document.createElement("div");
      panel.id = this.containerId;

      panel.innerHTML = `
        <div id="sl-inner-content">
          <div class="sl-header" style="display: flex; align-items: center;">
            <h2 id="sl-title" style="margin: 0; display: inline-block;">Сохранение</h2>
            
            <button id="sl-wipe-all-btn" class="delete-save-btn" style="margin-left: 12px; display: inline-block;">[ DEL ALL ]</button>
            
            <button id="close-sl-btn" style="margin-left: auto;">✕</button>
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

      /* 🔥 NEW: Обработчик клика глобальной деструкции с защитным подтверждением */
      document
        .getElementById("sl-wipe-all-btn")
        .addEventListener("click", (e) => {
          e.stopPropagation();

          // Проверяем локализацию для модалки подтверждения
          const lang = window.settingsManager
            ? window.settingsManager.settings.language
            : "ru";
          const dict = window.settingsManager
            ? window.settingsManager.uiTranslations[lang]
            : null;

          const confirmText = dict
            ? dict.confirm_wipe_all_saves ||
              "БЕЗВОЗВРАТНО УДАЛИТЬ ДАННЫЕ, ВСЕ СЛОТЫ И АВТОСОХРАНЕНИЯ ИГРЫ?"
            : "БЕЗВОЗВРАТНО УДАЛИТЬ ДАННЫЕ, ВСЕ СЛОТЫ И АВТОСОХРАНЕНИЯ ИГРЫ?";

          // Вызов нашего окна подтверждения новеллы
          window.showConfirm(confirmText, () => {
            this.wipeAllSaves();
          });
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

      inputManager.on(
        "keydown",
        (e) => {
          if (!this.modalOpen) return false;

          if (
            document
              .getElementById("confirm-backdrop")
              ?.classList.contains("active")
          ) {
            return false;
          }

          if (e.code === "ArrowLeft") {
            this.changePage(-1);
            return true;
          }
          if (e.code === "ArrowRight") {
            this.changePage(1);
            return true;
          }
          if (e.code === "Escape") {
            this.close();
            return true;
          }
          return false;
        },
        { priority: INPUT_PRIORITY.MODAL, owner: this },
      );

      // Блокировка колесика мыши на открытой модалке (просто съедаем событие)
      inputManager.on(
        "wheel",
        () => {
          if (this.modalOpen) return true;
          return false;
        },
        { priority: INPUT_PRIORITY.MODAL, owner: this },
      );
    }
  }

  open(mode = "save") {
    // МАЙ ФИКС: Берем перевод для заголовка
    const lang = window.settingsManager
      ? window.settingsManager.settings.language
      : "ru";
    const dict = window.settingsManager
      ? window.settingsManager.uiTranslations[lang]
      : null;

    if (this.modalOpen && this.mode === mode) return;
    this.mode = mode;
    this.modalOpen = true;

    // Переводим заголовок!
    document.getElementById("sl-title").innerText =
      mode === "save"
        ? dict
          ? dict.sl_title_save
          : "[ СОХРАНИТЬ ДАННЫЕ ]"
        : dict
          ? dict.sl_title_load
          : "[ ЗАГРУЗИТЬ ДАННЫЕ ]";

    // 🔥 ХОЗЯИН: Динамический перевод большой кнопки глобальной очистки
    const wipeAllBtn = document.getElementById("sl-wipe-all-btn");
    if (wipeAllBtn) {
      wipeAllBtn.innerText = dict?.btn_delete_all || "[ УДАЛИТЬ ВСЁ ]";
    }

    const panel = document.getElementById(this.containerId);
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
    // МАЙ ФИКС: Переводим слово "Страница"
    const lang = window.settingsManager
      ? window.settingsManager.settings.language
      : "ru";
    const dict = window.settingsManager
      ? window.settingsManager.uiTranslations[lang]
      : null;
    const pageText = dict ? dict.sl_page : "Страница";

    this.currentPage += dir;
    if (this.currentPage < 1) this.currentPage = 10;
    if (this.currentPage > 10) this.currentPage = 1;
    document.getElementById("sl-page-info").innerText =
      `${pageText} ${this.currentPage} / 10`;
    this.renderSlots();
  }

  renderSlots() {
    const container = document.getElementById("sl-slots-container");
    container.innerHTML = "";
    const startIdx = (this.currentPage - 1) * 6;

    // МАЙ ФИКС: Достаем все переводы для слотов один раз перед циклом
    const lang = window.settingsManager
      ? window.settingsManager.settings.language
      : "ru";
    const dict = window.settingsManager
      ? window.settingsManager.uiTranslations[lang]
      : null;

    const wordAuto = dict ? dict.sl_autosave : "АВТОСОХРАНЕНИЕ";
    const wordSlot = dict ? dict.sl_slot : "СЛОТ";
    const wordEmpty = dict ? dict.sl_empty : "Пусто";
    const wordDelTitle = dict ? dict.sl_delete_title : "Удалить слот";
    const wordPage = dict ? dict.sl_page : "Страница";

    // Переводим слово "Страница" при первой отрисовке (до того как нажали changePage)
    document.getElementById("sl-page-info").innerText =
      `${wordPage} ${this.currentPage} / 10`;

    for (let i = 0; i < 6; i++) {
      const slotIndex = startIdx + i;
      const slotData = this._readSave(slotIndex);
      const btn = document.createElement("button");

      const isAutoSave = slotIndex === 0;
      btn.className = `sl-slot-btn ${isAutoSave ? "auto-save" : ""}`;

      if (slotData) {
        // Локализация даты
        const date = new Date(slotData.timestamp).toLocaleString(
          lang === "en" ? "en-US" : lang === "ja" ? "ja-JP" : "ru-RU",
          {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          },
        );

        btn.innerHTML = `
          ${!isAutoSave ? `<button class="delete-save-btn">[ DEL ]</button>` : ""}
          <div class="slot-title">${isAutoSave ? wordAuto : `${wordSlot} ${slotIndex + 1}`}</div>
          <div class="slot-date">${date}</div>
        `;

        if (!isAutoSave) {
          const delBtn = btn.querySelector(".delete-save-btn");
          delBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            const delTextBase = dict
              ? dict.confirm_delete_save
              : "БЕЗВОЗВРАТНО УДАЛИТЬ ДАННЫЕ В СЛОТЕ ";
            window.showConfirm(`${delTextBase}${slotIndex + 1}?`, () => {
              this._deleteSave(slotIndex);
              this.renderSlots();
            });
          });
        }
      } else {
        btn.classList.add("empty");
        btn.innerHTML = `
          <div class="slot-title">${isAutoSave ? wordAuto : `${wordSlot} ${slotIndex + 1}`}</div>
          <div>${wordEmpty}</div>
        `;
      }

      // Стало (ЗАЩИТНЫЙ БАРЬЕР МАЙ):
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation(); // 🛑 УБИВАЕМ ВСПЛЫТИЕ! Клик застревает здесь и не летит в игру!

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
      // МАЙ ФИКС: Берем перевод
      const lang = window.settingsManager
        ? window.settingsManager.settings.language
        : "ru";
      const dict = window.settingsManager
        ? window.settingsManager.uiTranslations[lang]
        : null;
      const overwTextBase = dict
        ? dict.confirm_overwrite_save
        : "ПЕРЕЗАПИСАТЬ ДАННЫЕ В СЛОТЕ ";

      window.showConfirm(`${overwTextBase}${slotIndex + 1}?`, () => {
        // Вызываем снова, но уже с флагом перезаписи
        this.saveGame(slotIndex, true);
      });
      return; // Прерываем текущее выполнение
    }

    const dataToSave = {
      saveVersion: SAVE_SCHEMA_VERSION,
      timestamp: Date.now(),
      sceneId: window.sm.currentSceneId,
      lineIndex: window.sm.currentLineIndex || 0,
      state: JSON.parse(JSON.stringify(state)),
      audioState:
        window.saveManager?._pendingAudioState ??
        (window.sm?.am?.getSaveState ? window.sm.am.getSaveState() : null),
      history: window.sm?.hm ? [...window.sm.hm.history] : [],
    };

    this._writeSave(slotIndex, dataToSave);
    this.renderSlots();
  }

  loadGame(slotIndex, slotData) {
    if (!slotData) return;

    const saveVersion = Number(slotData.saveVersion) || 0;
    const savedUiState = slotData.state?.uiState || {};

    /*
     * Сейвы без saveVersion были созданы до официального
     * появления КПК.
     *
     * Даже если промежуточная сборка случайно записала
     * pdaUnlocked: true, это значение сбрасывается.
     */
    const migratedUiState = {
      dialogStyle: savedUiState.dialogStyle || "normal",

      pdaUnlocked:
        saveVersion >= SAVE_SCHEMA_VERSION && savedUiState.pdaUnlocked === true,

      pdaUnlockHintShown:
        saveVersion >= SAVE_SCHEMA_VERSION &&
        savedUiState.pdaUnlockHintShown === true,
    };

    // Очищаем и заново собираем героя
    Object.keys(state.hero).forEach((key) => delete state.hero[key]);
    Object.assign(state.hero, JSON.parse(JSON.stringify(slotData.state.hero)));

    // Очищаем и заново собираем отношения
    Object.keys(state.relations).forEach((key) => delete state.relations[key]);
    Object.assign(
      state.relations,
      JSON.parse(JSON.stringify(slotData.state.relations)),
    );

    // Очищаем и заново собираем флаги
    Object.keys(state.flags).forEach((key) => delete state.flags[key]);
    Object.assign(
      state.flags,
      JSON.parse(JSON.stringify(slotData.state.flags)),
    );

    // МАЙ ФИКС: Очищаем и заново собираем системные настройки
    if (state.uiState) {
      Object.keys(state.uiState).forEach((key) => delete state.uiState[key]);
    } else {
      state.uiState = {};
    }

    Object.assign(state.uiState, JSON.parse(JSON.stringify(migratedUiState)));

    // Очищаем и заново собираем временные переменные
    Object.keys(state.temp).forEach((key) => delete state.temp[key]);
    Object.assign(state.temp, JSON.parse(JSON.stringify(slotData.state.temp)));

    // МАЙ ФИКС: Сбрасываем историю ПЕРЕД загрузкой, чтобы не смешивалась со старой
    if (window.sm?.hm) {
      window.sm.hm.history = [];
    }

    // МАЙ ФИКС: Восстанавливаем историю диалогов из сейва
    if (window.sm?.hm && slotData.history) {
      window.sm.hm.history = slotData.history;
    }

    window.dispatchEvent(
      new CustomEvent("stressUpdated", {
        detail: { sanity: state.hero.stats.sanity },
      }),
    );
    window.dispatchEvent(new CustomEvent("statsUpdated"));

    if (
      window.pdaSystem &&
      typeof window.pdaSystem.updateVisibility === "function"
    ) {
      window.pdaSystem.updateVisibility();
    }

    this.close(); // Закрываем само окно сохранений

    // ПРОВЕРЯЕМ: Грузимся ли мы из Главного меню?
    const mainMenu = document.getElementById("main-menu-screen");
    const isMenuVisible =
      mainMenu && window.getComputedStyle(mainMenu).display !== "none";

    // Функция финальной передачи данных в SceneManager
    const finalizeLoad = async () => {
      if (window.sm) {
        if (window.sm.cs) window.sm.cs.forceClose();

        const requestedSceneExists =
          window.sm.story && window.sm.story[slotData.sceneId];

        if (!requestedSceneExists) {
          const lang = window.settingsManager?.settings?.language || "ru";

          if (typeof window.loadStoryLanguage === "function") {
            await window.loadStoryLanguage(lang);
          }
        }

        window.sm.loadScene(
          slotData.sceneId,
          slotData.lineIndex,
          true,
          slotData.audioState || null,
        );
      }
    };

    if (isMenuVisible) {
      // === ПЛАВНЫЙ ПЕРЕХОД ИЗ МЕНЮ В ИГРУ ===
      const transitionScreen = document.createElement("div");
      transitionScreen.style.position = "fixed";
      transitionScreen.style.inset = "0";
      transitionScreen.style.backgroundColor = "black";
      transitionScreen.style.zIndex = "999999";
      transitionScreen.style.opacity = "0";
      transitionScreen.style.transition = "opacity 1s ease";
      transitionScreen.style.pointerEvents = "all";
      document.body.appendChild(transitionScreen);

      setTimeout(() => {
        transitionScreen.style.opacity = "1";
      }, 50);

      setTimeout(() => {
        mainMenu.style.display = "none";

        const gameViewport = document.getElementById("game-viewport");
        const dialogWrapper = document.getElementById("dialog-wrapper");
        if (gameViewport) gameViewport.style.display = "block";
        if (dialogWrapper) dialogWrapper.style.display = "flex";

        finalizeLoad();

        transitionScreen.style.opacity = "0";
        setTimeout(() => transitionScreen.remove(), 1000);
      }, 1050);
    } else {
      // === МГНОВЕННАЯ ЗАГРУЗКА ВНУТРИ ИГРЫ ===
      finalizeLoad();
    }
  }

  autoSave() {
    // Внимание: Раньше _deleteSave(0) прерывался гуардом, теперь wipeAllSaves чистит всё напрямую.
    // Оставляем оригинальный вызов без изменений для стабильности движка:
    this._deleteSave(0);
    this.saveGame(0, true, true);
  }
}

import { CharacterManager } from "./characterManager.js";
import { AudioManager } from "./audioManager.js";
import { NotificationManager } from "./notificationManager.js";
import { updateStat } from "./state.js";
import { story } from "../data/story/prologue_ru.js";
import { animations } from "../data/macros.js";
import { UIManager } from "./uiManager.js";
import { BgManager } from "./bgManager.js";
import { ChoiceSystem } from "./choiceSystem.js";
import { HistoryManager } from "./historyManager.js";

const nm = new NotificationManager();

export class PausableTimeout {
  constructor(callback, delay) {
    this.callback = callback;
    this.remaining = delay;
    this.resume();
  }

  pause() {
    clearTimeout(this.timerId);
    this.remaining -= Date.now() - this.startTime;
  }

  resume() {
    this.startTime = Date.now();
    clearTimeout(this.timerId);
    this.timerId = setTimeout(this.callback, this.remaining);
  }

  clear() {
    clearTimeout(this.timerId);
  }
}

export class SceneManager {
  constructor(tw) {
    this.tw = tw;
    this.cm = new CharacterManager();
    this.am = new AudioManager();
    this.ui = new UIManager();
    this.bgManager = new BgManager("bg-1", "gbg-1");
    this.cs = new ChoiceSystem();
    this.hm = new HistoryManager();
    this.initFocusManagement();

    this.isTyping = false;
    this.currentScene = null;
    this.navController = null;
    this.currentLineIndex = 0;
    this.isCtrlPressed = false;
    this.fastForwardTimeoutId = null;
    this.isFastForwarding = false;

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => {
        this.initGlobalEvents();
        this.initStripFill();
      });
    } else {
      this.initGlobalEvents();
      this.initStripFill();
    }

    // Продвинутый детектор: проверяем Android или запуск внутри Capacitor/Cordova
    this.isMobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent,
      ) ||
      !!window.cordova ||
      !!window.Capacitor;
  }

  initGlobalEvents() {
    // Полноэкранный режим по двойному клику
    document.addEventListener("dblclick", (e) => {
      if (e.target.closest("#game-ui")) {
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen().catch(() => {});
        } else {
          document.exitFullscreen();
        }
      }
    });

    // Скролл мыши для продвижения текста (открытие истории теперь в historyManager.js)
    let isScrolling = false;
    document.addEventListener(
      "wheel",
      (e) => {
        if (this.uiHidden) {
          return;
        }

        if (this.cs && this.cs.isActive) return;

        if (this.hm && this.hm.modalOpen) return;
        if (window.saveManager && window.saveManager.modalOpen) return;

        if (isScrolling) return;

        if (e.deltaY > 20) {
          isScrolling = true;
          const skipEvent = new KeyboardEvent("keydown", {
            code: "Enter",
            bubbles: true,
          });
          window.dispatchEvent(skipEvent);
          setTimeout(() => {
            isScrolling = false;
          }, 200);
        }
      },
      { passive: false },
    );

    // Возвращение скрытого UI по левому клику ИЛИ ТАПУ (перехватчик)
    document.addEventListener(
      "click",
      (e) => {
        // Если интерфейс скрыт — любой клик/тап по экрану обязан его вернуть!
        if (this.uiHidden) {
          e.preventDefault();
          e.stopPropagation();
          document.dispatchEvent(
            new MouseEvent("contextmenu", { bubbles: true, cancelable: true }),
          );
          return;
        }
        // А вот если UI открыт, и это тап пальцем - не лезем, пусть работает базовая логика
        if (e.pointerType === "touch" || window.sm?.isMobile) return;
      },
      true,
    );

    // Правый клик (скрыть/показать UI или закрыть историю)
    document.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      // ПРОПУСКАЕМ искусственные клики (от нашего крестика) через проверку !e.isTrusted
      if (e.isTrusted && (e.pointerType === "touch" || window.sm?.isMobile))
        return;

      // ... дальше ваш старый код ПКМ

      if (
        this.hm.modalOpen ||
        (window.saveManager && window.saveManager.modalOpen) ||
        (window.settingsManager && window.settingsManager.modalOpen) // Добавили проверку Настроек
      ) {
        if (this.hm.modalOpen) this.hm.hideHistory();
        if (window.saveManager && window.saveManager.modalOpen)
          window.saveManager.close();
        if (window.settingsManager && window.settingsManager.modalOpen)
          window.settingsManager.close(); // Закрываем Настройки
      } else {
        const ui = document.getElementById("game-ui");
        const choiceContainer = document.getElementById("choice-container");
        const interLayer = document.getElementById("interaction-layer");

        if (ui) {
          this.uiHidden = !this.uiHidden; // Переключаем глобальный флаг

          document.body.classList.toggle("ui-hidden", this.uiHidden);

          const opacity = this.uiHidden ? "0" : "";
          const pointerEvents = this.uiHidden ? "none" : "";

          // Скрываем и делаем "прозрачным" для кликов основной UI
          ui.style.opacity = opacity;
          ui.style.pointerEvents = pointerEvents;
          ui.style.transition = "opacity 0.3s ease";

          // Жестко отключаем кликабельность контейнеров выбора, если они есть
          if (choiceContainer) {
            choiceContainer.style.opacity = opacity;
            choiceContainer.style.pointerEvents = pointerEvents;
            choiceContainer.style.transition = "opacity 0.3s ease";
          }
          if (interLayer) {
            interLayer.style.opacity = opacity;
            interLayer.style.pointerEvents = pointerEvents;
            interLayer.style.transition = "opacity 0.3s ease";
          }
        }
      }
    });

    window.addEventListener("loadScene", (e) => {
      const sceneId = e.detail;
      if (sceneId) this.loadScene(sceneId);
    });

    // Клавиатура (горячие клавиши)
    window.addEventListener("keydown", (e) => {
      // Собираем состояния всех наших окон
      const isSave = window.saveManager && window.saveManager.modalOpen;
      const isSettings = window.settingsManager && window.settingsManager.modalOpen;
      const isHistory = this.hm && this.hm.modalOpen;

      // ЕСЛИ ОТКРЫТО ХОТЯ БЫ ОДНО ОКНО:
      if (isSave || isSettings || isHistory) {
        
        // 1. БЛОКИРУЕМ ИГРОВЫЕ КНОПКИ (Пробел, Enter, Стрелки, Ctrl)
        if (["Space", "Enter", "ArrowRight", "ArrowLeft", "ArrowUp", "ArrowDown", "ControlLeft", "ControlRight"].includes(e.code)) {
          e.preventDefault();
          e.stopPropagation();
          return;
        }

        // 2. ЗАКРЫТИЕ НА ESCAPE
        if (e.code === "Escape") {
          if (isSettings) window.settingsManager.close();
          if (isSave) window.saveManager.close();
          if (isHistory) this.hm.hideHistory();
          e.stopPropagation();
          return;
        }

        // 3. ПЕРЕКЛЮЧЕНИЕ: НАСТРОЙКИ (O)
        if (e.code === "KeyO" && !e.repeat) {
          if (isSettings) window.settingsManager.close(); // Закрываем, если открыто
          else {
            if (isSave) window.saveManager.close();
            if (isHistory) this.hm.hideHistory();
            window.settingsManager.open(); // Открываем настройки
          }
          e.stopPropagation();
          return;
        }

        // 4. ПЕРЕКЛЮЧЕНИЕ: СОХРАНЕНИЕ (S)
        if (e.code === "KeyS" && !e.repeat) {
          if (isSave && window.saveManager.mode === "save") window.saveManager.close();
          else {
            if (isSettings) window.settingsManager.close();
            if (isHistory) this.hm.hideHistory();
            window.saveManager.open("save");
          }
          e.stopPropagation();
          return;
        }

        // 5. ПЕРЕКЛЮЧЕНИЕ: ЗАГРУЗКА (L)
        if (e.code === "KeyL" && !e.repeat) {
          if (isSave && window.saveManager.mode === "load") window.saveManager.close();
          else {
            if (isSettings) window.settingsManager.close();
            if (isHistory) this.hm.hideHistory();
            window.saveManager.open("load");
          }
          e.stopPropagation();
          return;
        }

        // 6. ПЕРЕКЛЮЧЕНИЕ: ИСТОРИЯ (H)
        if (e.code === "KeyH" && !e.repeat) {
          if (isHistory) this.hm.hideHistory();
          else {
            if (isSettings) window.settingsManager.close();
            if (isSave) window.saveManager.close();
            this.hm.showHistory();
          }
          e.stopPropagation();
          return;
        }

        // Блокируем любые другие случайные кнопки
        e.stopPropagation();
        return;
      }

      // === ЕСЛИ НИ ОДНО ОКНО НЕ ОТКРЫТО, РАБОТАЕТ ИГРА ===
      
      // Открытие окон из чистой игры
      if (e.code === "KeyO" && !e.repeat) {
        window.settingsManager.open();
        return;
      } else if (e.code === "KeyS" && !e.repeat) {
        window.saveManager.open("save");
        return;
      } else if (e.code === "KeyL" && !e.repeat) {
        window.saveManager.open("load");
        return;
      } else if (e.code === "KeyH" && !e.repeat) {
        this.hm.showHistory();
        return;
      }

      if (this.cs && this.cs.isActive) return;

      // Код перемотки
      if (e.code === "ControlLeft" || e.code === "ControlRight") {
        if (!this.isFastForwarding) {
          this.isFastForwarding = true;
          this.handleFastForward();
        }
      }
    });

    window.addEventListener("keyup", (e) => {
      if (this.cs && this.cs.isActive) {
        this.isFastForwarding = false; // На всякий случай сбрасываем скип
        return;
      }

      if (e.code === "ControlLeft" || e.code === "ControlRight") {
        this.isFastForwarding = false;
      }
    });
  }

  handleFastForward() {
    if (!this.isFastForwarding) return;
    if (this.fastForwardTimeoutId) {
      clearTimeout(this.fastForwardTimeoutId);
    }
    this.skipToNextChoice();
    if (this.isFastForwarding) {
      this.fastForwardTimeoutId = setTimeout(
        () => this.handleFastForward(),
        50,
      );
    }
  }

  skipToNextChoice() {
    if (this.isTyping) {
      this.tw.skip();
    } else {
      const skipEvent = new KeyboardEvent("keydown", {
        code: "Enter",
        bubbles: true,
      });
      window.dispatchEvent(skipEvent);
    }
  }

  // +++ НОВЫЙ МЕТОД ДЛЯ БЕЗОПАСНОЙ ЗАГРУЗКИ СЕЙВОВ +++
  async loadScene(sceneId, startLineIndex = 0, isRestoring = false) {
    this.isRestoringSave = isRestoring;
    this.currentSceneId = sceneId;
    this.currentLineIndex = startLineIndex;

    this.currentPlayId = Symbol();
    const loadPlayId = this.currentPlayId;

    if (this.tw) {
      this.tw.currentRunId = Symbol();
      this.tw.isTyping = false;
    }
    if (this.navController) this.navController.abort();

    this.isFastForwarding = false;
    if (this.fastForwardTimeoutId) {
      clearTimeout(this.fastForwardTimeoutId);
      this.fastForwardTimeoutId = null;
    }
    if (this.navController) this.navController.abort();

    const scene = story[sceneId];
    if (!scene) return console.error(`[SM] Scene not found: ${sceneId}`);

    // 1. ОЧИСТКА ДОМА (Фикс "прибитых" спрайтов)
    this.ui.handleFx({ darkness: 0, noise: 0, vignette: 0, duration: 0 });

    const interLayer = document.getElementById("interaction-layer");
    const dialogWrapper = document.getElementById("dialog-wrapper");
    const charLayer = document.getElementById("character-layer");

    if (interLayer) {
      interLayer.innerHTML = "";
      interLayer.style.display = "none";
    }
    if (dialogWrapper) dialogWrapper.style.display = "flex";
    if (charLayer) charLayer.innerHTML = ""; // Жестко удаляем старые спрайты

    // 2. Сюжетные скрипты запускаем ТОЛЬКО если это не загрузка сейва
    if (!this.isRestoringSave && typeof scene.action === "function") {
      try {
        scene.action();
      } catch (e) {
        console.error("Scene action error:", e);
      }
    }

    let sceneLines =
      typeof scene.lines === "function" ? scene.lines() : scene.lines;
    sceneLines = sceneLines || [];

    // 3. ВОССТАНОВЛЕНИЕ ВИЗУАЛЬНОГО СОСТОЯНИЯ
    let targetBg = scene.bg || null;
    let activeChars = {};
    let targetFx = {}; // Собираем нужные эффекты

    // Прогоняем скрипт до точки сохранения в фоновом режиме
    for (let i = 0; i < startLineIndex && i < sceneLines.length; i++) {
      const l = sceneLines[i];
      if (l.bg) targetBg = l.bg;
      if (l.showCharacter) activeChars[l.showCharacter.id] = l.showCharacter;
      if (l.hideCharacter) delete activeChars[l.hideCharacter];

      // Если на строке был эффект, наслаиваем его поверх старых
      if (l.fx) Object.assign(targetFx, l.fx);
    }

    // Применяем финальный фон (скорость 0 = мгновенно)
    // Применяем финальный фон (скорость 0 = мгновенно)
    if (targetBg) {
      const optimizedBg = this._getOptimizedBgPath(targetBg);
      this.ui.updateBackground(optimizedBg, 0);
    }

    // Мгновенно натягиваем правильные эффекты без анимации
    if (Object.keys(targetFx).length > 0) {
      targetFx.duration = 0;
      this.ui.handleFx(targetFx);
    }

    let currentBGM =
      scene.audio && scene.audio.type === "bgm" ? scene.audio : null;
    let currentSFX =
      scene.audio && scene.audio.type === "sfx" && scene.audio.loop
        ? scene.audio
        : null;

    // Прогоняем скрипт до точки сохранения, чтобы найти последнюю музыку
    for (let i = 0; i <= startLineIndex && i < sceneLines.length; i++) {
      const l = sceneLines[i];
      if (l.audio) {
        let audios = Array.isArray(l.audio) ? l.audio : [l.audio];
        for (let a of audios) {
          if (a.type === "bgm") currentBGM = a;
          if (a.type === "stop") currentBGM = null;
          if (a.type === "sfx" && a.loop) currentSFX = a;
          if (a.type === "stop_sfx") currentSFX = null;
        }
      }
    }

    // Останавливаем всё старое перед загрузкой нового
    this.am.stopBGM(0);
    Object.keys(this.am.activeLoops).forEach((key) => this.am.stopSFX(key, 0));

    // Включаем то, что должно играть на момент сохранения
    if (currentBGM) this.am.handleAudio(currentBGM);
    if (currentSFX) this.am.handleAudio(currentSFX);

    // Восстанавливаем персонажей мгновенно (пустая функция вместо анимации)
    Object.values(activeChars).forEach((char) => {
      if (this.cm && this.cm.show) {
        this.cm.show(char.id, char.emotion, char.position, () => {});
      }
    });

    this.currentScene = scene;

    // 4. ЗАПУСК ДИАЛОГА ИЛИ ВЫБОРОВ
    if (sceneLines && sceneLines.length > 0) {
      await this.playLines(sceneLines, startLineIndex, isRestoring);
    }

    if (this.currentPlayId !== loadPlayId) return;

    this.prepareNavigation(scene);

    if (window.saveManager) {
      window.saveManager.autoSave();
    }
  }

  // +++ ИСПРАВЛЕННЫЙ PLAYLINES +++
  async playLines(lines, startIndex = 0) {
    const playId = this.currentPlayId;
    const db = document.getElementById("dialog-box");

    for (let i = startIndex; i < lines.length; i++) {
      if (this.currentPlayId !== playId) return;

      const line = lines[i];
      const isRestoredLine = this.isRestoringSave && i === startIndex;

      const bgsToPreload = [];
      for (let j = 1; j <= 3; j++) {
        const futureLine = lines[i + j];
        if (futureLine && futureLine.bg && futureLine.bg !== "black_screen") {
          bgsToPreload.push(this._getOptimizedBgPath(futureLine.bg));
        }
      }
      if (bgsToPreload.length > 0) {
        this.bgManager.preload(bgsToPreload);
      }

      // ФИКС ДУБЛИРОВАНИЯ: Не меняем статы и не вызываем action, если строка восстановлена
      if (!isRestoredLine && line.effects) {
        Object.entries(line.effects).forEach(([stat, val]) =>
          updateStat(stat, val),
        );
      }

      if (!isRestoredLine && typeof line.action === "function") {
        try {
          const result = line.action();
          if (result && result.fx) this.ui.handleFx(result.fx);
        } catch (e) {
          console.error("Line action error:", e, line);
        }
      }

      // Визуал, эффекты и аудио применяем всегда
      if (!isRestoredLine && line.audio) this.am.handleAudio(line.audio);
      if (line.shake) this.ui.shakeScreen(line.shake);
      if (line.fx) this.ui.handleFx(line.fx);

      if (line.bg) {
        if (line.dialogStyle === "transparent") this.isTransparentMode = true;
        else if (line.dialogStyle === "normal") this.isTransparentMode = false;

        const dialogWrapper = document.getElementById("dialog-wrapper");
        if (dialogWrapper) {
          if (this.isTransparentMode)
            dialogWrapper.classList.add("transparent-mode");
          else dialogWrapper.classList.remove("transparent-mode");
        }

        const optimizedLineBg = this._getOptimizedBgPath(line.bg);
        const speed = line.bgSpeed !== undefined ? line.bgSpeed : 400;
        // Мгновенная смена фона при загрузке сейва
        this.ui.updateBackground(optimizedLineBg, isRestoredLine ? 0 : speed);
      }

      let displayText = line.text;
      if (!line.speaker) displayText = `${line.text}`;

      this.currentLineIndex = i;

      // Не дублируем логи в истории
      if (!isRestoredLine) {
        this.hm.addToHistory(line.speaker, displayText);
      }
      this.ui.updateNameTag(line.speaker);

      if (line.showCharacter) {
        const { id, emotion, position } = line.showCharacter;
        const animFunc = animations[line.anim] || animations.fadeInUp;
        if (this.cm.show)
          this.cm.show(
            id,
            emotion,
            position,
            isRestoredLine ? () => {} : animFunc,
          );
      }

      if (line.hideCharacter) {
        const animFunc = animations[line.anim] || animations.fadeOut;
        if (this.cm.hide)
          this.cm.hide(
            line.hideCharacter,
            isRestoredLine ? () => {} : animFunc,
          );
      }

      this.isTyping = true;
      if (db) db.classList.remove("waiting");

      let typePromise;
      if (isRestoredLine) {
        // Мгновенно выводим текст при загрузке, без печатной машинки!
        db.innerHTML = displayText;
        typePromise = Promise.resolve();
      } else {
        typePromise = this.tw.type(displayText);
      }

      const clickPromise = this.waitForClick();

      await Promise.race([typePromise, clickPromise]);
      if (this.currentPlayId !== playId) return;

      await typePromise;
      if (this.currentPlayId !== playId) return;

      this.isTyping = false;
      if (db) db.classList.add("waiting");

      await this.waitForClick();
      if (this.currentPlayId !== playId) return;
    }

    if (db) db.classList.remove("waiting");
  }

  prepareNavigation(scene) {
    const dialogWrapper = document.getElementById("dialog-wrapper");
    const choiceContainer = document.getElementById("choice-container");
    const interLayer = document.getElementById("interaction-layer");

    if (choiceContainer) choiceContainer.innerHTML = "";
    if (interLayer) interLayer.innerHTML = "";
    if (dialogWrapper) dialogWrapper.style.display = "flex";

    if (scene.interactables && scene.interactables.length > 0) {
      if (dialogWrapper) dialogWrapper.style.display = "none";
      this.cs.renderInteractions(
        scene,
        (nextId) => this.loadScene(nextId),
        this.am,
      ); // Передаем scene целиком и this.am
    } else if (scene.choices && scene.choices.length > 0) {
      this.cs.showChoices(
        scene.choices,
        (nextId) => this.loadScene(nextId),
        this.am,
      ); // Передаем this.am
    } else if (scene.next) {
      const nextSceneId =
        typeof scene.next === "function" ? scene.next() : scene.next;
      if (nextSceneId) this.loadScene(nextSceneId);
    }
  }

  waitForClick() {
    return new Promise((resolve) => {
      if (this.navController) {
        this.navController.abort();
      }

      this.navController = new AbortController();
      const { signal } = this.navController;

      // 2. ГЛАВНОЕ: Если этот контроллер прервут извне (через abort), мы ОБЯЗАТЕЛЬНО резолвим этот промис!
      signal.addEventListener(
        "abort",
        () => {
          resolve(); // Теперь промис не повиснет в памяти
        },
        { once: true },
      );

      const advance = (e) => {
        if (window.saveManager?.modalOpen) {
          if (e.type === "keydown") {
            e.preventDefault();
            e.stopPropagation();
          }
          return;
        }

        if (this.hm && this.hm.modalOpen) return;
        if (this.uiHidden) return;

        if (e.target && e.target.closest) {
          if (
            e.target.id === "modal-backdrop" ||
            e.target.closest("#close-history") ||
            e.target.closest("#open-history-btn") ||
             e.target.closest("#open-settings-btn")
          ) {
            return;
          }
        }

        if (e.repeat) return;

        const allowed = ["Space", "Enter", "NumpadEnter", "ArrowRight"];
        if (e.type === "keydown" && !allowed.includes(e.code)) return;
        if (e.code === "Space") e.preventDefault();

        if (this.isTyping) {
          this.tw.skip();
        } else {
          this.navController.abort();
        }
      };

      window.addEventListener("click", advance, { signal });
      window.addEventListener("keydown", advance, { signal });
    });
  }

  initStripFill() {
    const container = document.getElementById("dialog-box-container");
    if (!container || document.getElementById("strip-fill")) return;
    const fill = document.createElement("div");
    fill.id = "strip-fill";
    container.appendChild(fill);
  }

  _getOptimizedBgPath(originalPath) {
    if (!this.isMobile || !originalPath || typeof originalPath !== "string") {
      return originalPath;
    }
    // Заменяем "/bg/" на "/bg_mobile/" (используем replaceAll на всякий случай)
    // Ищем именно папку bg со слэшами, чтобы случайно не сломать имя файла, в котором есть буквы "bg"
    if (originalPath.includes("/bg/")) {
      return originalPath.replaceAll("/bg/", "/bg_mobile/");
    }
    return originalPath;
  }

  initFocusManagement() {
    const handleVisibilityChange = () => {
      if (document.hidden || !document.hasFocus()) {
        window.isGamePaused = true;

        // 1. Глушим весь звук и музыку через Howler
        if (this.am && typeof Howler !== "undefined") {
          Howler.mute(true);
        }

        // 2. Замораживаем печать текста (в typewriter.js есть while(this.isPaused))
        if (this.tw) {
          this.tw.isPaused = true;
        }

        // 3. Останавливаем таймер викторины (если он есть)
        if (window.quizTimer) {
          if (typeof window.quizTimer.pause === "function") {
            window.quizTimer.pause();
          } else if (typeof window.quizTimer.clear === "function") {
            window.quizTimer.clear();
            window.quizTimer = null;
          }
        }
      } else {
        // ==========================================
        // --- ОКНО АКТИВНО (ВОЗОБНОВЛЕНИЕ)
        // ==========================================
        window.isGamePaused = false;

        // 1. Возвращаем звук
        if (this.am && typeof Howler !== "undefined") {
          Howler.mute(false);
        }

        // 2. Снимаем текст с паузы (он продолжит печататься с того же символа)
        if (this.tw) {
          this.tw.isPaused = false;
        }

        // 3. Возобновляем таймер
        if (window.quizTimer && typeof window.quizTimer.resume === "function") {
          window.quizTimer.resume();
        }
      }
    };

    // Слушаем стандартные браузерные события (в NW.js они работают отлично)
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleVisibilityChange);
    window.addEventListener("focus", handleVisibilityChange);
  }
}

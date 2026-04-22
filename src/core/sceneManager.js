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
    // Возвращение скрытого UI по левому клику ИЛИ ТАПУ (перехватчик)
    document.addEventListener(
      "click",
      (e) => {
        // Если интерфейс скрыт — любой клик/тап по экрану обязан его вернуть!
        if (this.uiHidden) {
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();

          this.toggleUI(); // Вызываем скрытие напрямую!
          return;
        }
        // А вот если UI открыт, и это тап пальцем - не лезем, пусть работает базовая логика
        if (e.pointerType === "touch" || window.sm?.isMobile) return;
      },
      true, // true = ловим событие самым первым
    );

    // Правый клик (скрыть/показать UI или закрыть окна)
    document.addEventListener("contextmenu", (e) => {
      e.preventDefault(); // Убиваем стандартное меню браузера

      // Игнорируем на мобилках (там свайпы)
      if (e.isTrusted && (e.pointerType === "touch" || window.sm?.isMobile))
        return;

      // Если открыты модалки - закрываем их
      if (
        this.hm?.modalOpen ||
        window.saveManager?.modalOpen ||
        window.settingsManager?.modalOpen
      ) {
        if (this.hm?.modalOpen) this.hm.hideHistory();
        if (window.saveManager?.modalOpen) window.saveManager.close();
        if (window.settingsManager?.modalOpen) window.settingsManager.close();
      } else {
        // Если всё чисто — скрываем/показываем интерфейс
        this.toggleUI();
      }
    });

    // === ГЛОБАЛЬНЫЕ ЖЕСТЫ (Hold-to-Skip и Скрытие UI) ===
    let touchStartX = 0;
    let touchStartY = 0;
    let holdSkipTimer = null;
    let isHolding = false;


    document.addEventListener(
      "touchend",
      (e) => {
        clearTimeout(holdSkipTimer);

        // 1. Обработка удержания (Skip)
        if (isHolding) {
          this.isFastForwarding = false;
          isHolding = false;
          if (this.fastForwardTimeoutId)
            clearTimeout(this.fastForwardTimeoutId);
          if (e.cancelable) e.preventDefault();
          return;
        }

        // Вычисляем дистанцию и направление свайпа
        const touchEndX = e.changedTouches[0].clientX;
        const touchEndY = e.changedTouches[0].clientY;
        const deltaX = touchEndX - touchStartX; // Вправо > 0, Влево < 0
        const deltaY = touchEndY - touchStartY; // Вниз > 0, Вверх < 0
        const absX = Math.abs(deltaX);
        const absY = Math.abs(deltaY);

        // Проверяем, открыто ли хоть одно окно
        const isModalOpen =
          this.hm?.modalOpen ||
          window.saveManager?.modalOpen ||
          window.settingsManager?.modalOpen;

        // === 2. ЛОГИКА ЗАКРЫТИЯ ОКОН (ГОРИЗОНТАЛЬНЫЙ СВАЙП) ===
        if (isModalOpen) {
          // Если свайпнули по горизонтали больше чем на 50px (влево или вправо)
          if (absX > 50 && absX > absY) {
            if (this.hm?.modalOpen && typeof this.hm.hideHistory === "function")
              this.hm.hideHistory();
            if (window.saveManager?.modalOpen) window.saveManager.close();
            if (window.settingsManager?.modalOpen)
              window.settingsManager.close();
          }
          return; // Блокируем остальные игровые свайпы, пока открыто меню
        }

        // === 3. ЛОГИКА ИГРЫ (ВЕРТИКАЛЬНЫЕ СВАЙПЫ) ===
        // Если свайпнули по вертикали больше чем на 50px
        if (absY > 50 && absY > absX) {
          if (deltaY < 0) {
            // Свайп ВВЕРХ (отрицательный Y) -> Скрыть/Показать UI
            this.toggleUI();
          } else {
            // Свайп ВНИЗ (положительный Y) -> Открыть Историю
            if (
              this.hm &&
              !this.hm.modalOpen &&
              typeof this.hm.showHistory === "function"
            ) {
              this.hm.showHistory();
            }
          }
        }
      },
      { passive: false },
    );

    document.addEventListener(
      "touchend",
      (e) => {
        clearTimeout(holdSkipTimer);

        // 1. Обработка удержания (Skip)
        if (isHolding) {
          this.isFastForwarding = false;
          isHolding = false;
          if (this.fastForwardTimeoutId)
            clearTimeout(this.fastForwardTimeoutId);
          if (e.cancelable) e.preventDefault();
          return;
        }

        // Вычисляем дистанцию и направление свайпа
        const touchEndX = e.changedTouches[0].clientX;
        const touchEndY = e.changedTouches[0].clientY;
        const deltaX = touchEndX - touchStartX; // Вправо > 0, Влево < 0
        const deltaY = touchEndY - touchStartY; // Вниз > 0, Вверх < 0
        const absX = Math.abs(deltaX);
        const absY = Math.abs(deltaY);

        // Проверяем, открыто ли хоть одно окно
        const isModalOpen =
          this.hm?.modalOpen ||
          window.saveManager?.modalOpen ||
          window.settingsManager?.modalOpen;

        // === 2. ЛОГИКА ЗАКРЫТИЯ ОКОН (ГОРИЗОНТАЛЬНЫЙ СВАЙП) ===
        if (isModalOpen) {
          // Если свайпнули по горизонтали больше чем на 50px
          if (absX > 50 && absX > absY) {
            // Закрываем то окно, которое сейчас открыто
            if (
              this.hm?.modalOpen &&
              typeof this.hm.toggleHistory === "function"
            )
              this.hm.toggleHistory();
            if (window.saveManager?.modalOpen) window.saveManager.closeModal();
            if (window.settingsManager?.modalOpen)
              window.settingsManager.closeModal();
          }
          return; // Блокируем остальные игровые свайпы, пока открыто меню
        }

        // === 3. ЛОГИКА ИГРЫ (ВЕРТИКАЛЬНЫЕ СВАЙПЫ) ===
        // Если свайпнули по вертикали больше чем на 50px
        if (absY > 50 && absY > absX) {
          if (deltaY < 0) {
            // Свайп ВВЕРХ (отрицательный Y) -> Скрыть/Показать UI
            this.toggleUI();
          } else {
            // Свайп ВНИЗ (положительный Y) -> Открыть Историю
            if (
              this.hm &&
              !this.hm.modalOpen &&
              typeof this.hm.toggleHistory === "function"
            ) {
              this.hm.toggleHistory();
            }
          }
        }
      },
      { passive: false },
    );

    window.addEventListener("loadScene", (e) => {
      const sceneId = e.detail;
      if (sceneId) this.loadScene(sceneId);
    });

    // Клавиатура (горячие клавиши)
    window.addEventListener("keydown", (e) => {
      // 0. Собираем состояния всех окон
      const isSave = window.saveManager && window.saveManager.modalOpen;
      const isSettings =
        window.settingsManager && window.settingsManager.modalOpen;
      const isHistory = this.hm && this.hm.modalOpen;
      const isModalOpen = isSave || isSettings || isHistory;

      // Самая надежная проверка на Главное меню (не обмануть даже через CSS!)
      const mainMenu = document.getElementById("main-menu-screen");
      const isMainMenuActive =
        mainMenu && window.getComputedStyle(mainMenu).display !== "none";

      // Игровые клавиши, которые мы берем под жесткий контроль
      const gameHotkeys = [
        "KeyO",
        "KeyS",
        "KeyL",
        "KeyH",
        "Space",
        "Enter",
        "ArrowUp",
        "ArrowDown",
        "ArrowLeft",
        "ArrowRight",
        "ControlLeft",
        "ControlRight",
      ];

      // === ФАЗА 1: МЫ В ГЛАВНОМ МЕНЮ ===
      if (isMainMenuActive) {
        // Escape всегда может закрыть всплывшие поверх меню настройки или загрузку
        if (e.code === "Escape") {
          if (isSettings) window.settingsManager.close();
          if (isSave) window.saveManager.close();
          if (isHistory) this.hm.hideHistory();
          e.stopImmediatePropagation();
          return;
        }

        // Блокируем ТОЛЬКО игровые кнопки (O, S, L, H, Пробел и т.д.)
        // Чтобы нельзя было открыть историю или запустить диалог из меню.
        if (gameHotkeys.includes(e.code)) {
          e.preventDefault();
          e.stopImmediatePropagation();
        }
        return;
      }

      // === ФАЗА 2: МЫ В ИГРЕ, НО ОТКРЫТО ОКНО (Настройки, Сохранения, Лог) ===
      if (isModalOpen) {
        // Разрешаем стрелки ТОЛЬКО для окна сохранений (листать страницы)
        if (isSave && (e.code === "ArrowLeft" || e.code === "ArrowRight")) {
          return;
        }

        // Закрытие на Escape
        if (e.code === "Escape") {
          if (isSettings) window.settingsManager.close();
          if (isSave) window.saveManager.close();
          if (isHistory) this.hm.hideHistory();
          e.stopImmediatePropagation();
          return;
        }

        // --- ВЗАИМОЗАМЕНЯЕМОЕ ПЕРЕКЛЮЧЕНИЕ ОКОН ---
        if (e.code === "KeyO" && !e.repeat) {
          isSettings
            ? window.settingsManager.close()
            : window.settingsManager.open();
          if (!isSettings && isSave) window.saveManager.close();
          if (!isSettings && isHistory) this.hm.hideHistory();
          e.preventDefault();
          e.stopImmediatePropagation();
          return;
        }
        if (e.code === "KeyS" && !e.repeat) {
          if (isSave && window.saveManager.mode === "save")
            window.saveManager.close();
          else {
            if (isSettings) window.settingsManager.close();
            if (isHistory) this.hm.hideHistory();
            window.saveManager.open("save");
          }
          e.preventDefault();
          e.stopImmediatePropagation();
          return;
        }
        if (e.code === "KeyL" && !e.repeat) {
          if (isSave && window.saveManager.mode === "load")
            window.saveManager.close();
          else {
            if (isSettings) window.settingsManager.close();
            if (isHistory) this.hm.hideHistory();
            window.saveManager.open("load");
          }
          e.preventDefault();
          e.stopImmediatePropagation();
          return;
        }
        if (e.code === "KeyH" && !e.repeat) {
          isHistory ? this.hm.hideHistory() : this.hm.showHistory();
          if (!isHistory && isSettings) window.settingsManager.close();
          if (!isHistory && isSave) window.saveManager.close();
          e.preventDefault();
          e.stopImmediatePropagation();
          return;
        }

        // Жестко глушим пробелы, энтеры и прочее, чтобы игра не шла на фоне открытых настроек!
        if (gameHotkeys.includes(e.code)) {
          e.preventDefault();
          e.stopImmediatePropagation();
        }
        return;
      }

      // === ФАЗА 3: ЧИСТАЯ ИГРА (МЕНЮ И ОКНА ЗАКРЫТЫ) ===
      if (e.code === "ControlLeft" || e.code === "ControlRight") {
        if (!e.repeat && !this.uiHidden) {
          this.isFastForwarding = true;
          this.handleFastForward();
        }
        e.preventDefault();
        e.stopImmediatePropagation();
        return;
      }

      if (e.code === "KeyO" && !e.repeat) {
        window.settingsManager.open();
        e.preventDefault();
        e.stopImmediatePropagation();
        return;
      }
      if (e.code === "KeyS" && !e.repeat) {
        window.saveManager.open("save");
        e.preventDefault();
        e.stopImmediatePropagation();
        return;
      }
      if (e.code === "KeyL" && !e.repeat) {
        window.saveManager.open("load");
        e.preventDefault();
        e.stopImmediatePropagation();
        return;
      }
      if (e.code === "KeyH" && !e.repeat) {
        this.hm.showHistory();
        e.preventDefault();
        e.stopImmediatePropagation();
        return;
      }

      // Выход в меню на ESCAPE!
      if (e.code === "Escape") {
        e.preventDefault();
        e.stopImmediatePropagation();

        // Вызываем нашу красивую функцию возврата в меню из main.js!
        if (typeof window.returnToMenuLogic === "function") {
          window.returnToMenuLogic();
        }
        return;
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

  toggleUI() {
    const ui = document.getElementById("game-ui");
    const choiceContainer = document.getElementById("choice-container");
    const interLayer = document.getElementById("interaction-layer");
    if (!ui) return;

    this.uiHidden = !this.uiHidden;
    document.body.classList.toggle("ui-hidden", this.uiHidden);

    const opacity = this.uiHidden ? "0" : "";
    const pointerEvents = this.uiHidden ? "none" : "";

    ui.style.opacity = opacity;
    ui.style.pointerEvents = pointerEvents;
    ui.style.transition = "opacity 0.3s ease";

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
    if (this.tw && this.tw.isTyping) {
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

    // МАЙ: Добавьте этот сброс!
    this.isFastForwarding = false;
    if (this.fastForwardTimeoutId) {
      clearTimeout(this.fastForwardTimeoutId);
      this.fastForwardTimeoutId = null;
    }

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

      if (window.unlockCG) window.unlockCG(targetBg);
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
        if (window.unlockCG) window.unlockCG(line.bg);
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
      this.isFastForwarding = false;
      if (this.fastForwardTimeoutId) clearTimeout(this.fastForwardTimeoutId);
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
        // === ЗАМОК МАЙ: ЕСЛИ ВИСИТ ОКНО ПОДТВЕРЖДЕНИЯ - ИГНОРИРУЕМ ВСЁ! ===
        const confirmBackdrop = document.getElementById("confirm-backdrop");
        if (confirmBackdrop && confirmBackdrop.classList.contains("active")) {
          e.stopPropagation();
          return;
        }

        // Если открыто ХОТЯ БЫ ОДНО меню - убиваем событие на месте
        if (document.activeElement) document.activeElement.blur();
        if (
          (window.saveManager && window.saveManager.modalOpen) ||
          (window.settingsManager && window.settingsManager.modalOpen) ||
          (this.hm && this.hm.modalOpen)
        ) {
          if (e.type === "keydown") {
            e.preventDefault();
            e.stopPropagation();
          }
          return; // Не пускаем клик дальше!
        }

        if (this.uiHidden) return;

        // Игнорируем клики по кнопкам UI (чтобы не перелистывать текст)
        if (e.target && e.target.closest) {
          if (
            e.target.id === "modal-backdrop" ||
            e.target.closest(".modal-close-btn") || // Универсальная кнопка закрытия
            e.target.closest(".footer-btn") || // Универсальные кнопки внизу (Save, Load, Opt, History)
            e.target.closest("#close-history")
          ) {
            return;
          }
        }

        if (e.repeat) return;

        const allowed = ["Space", "Enter", "NumpadEnter", "ArrowRight"];
        if (e.type === "keydown" && !allowed.includes(e.code)) return;
        if (e.code === "Space") e.preventDefault();

        // Пропускаем текст или идем дальше
        if (this.tw && this.tw.isTyping) {
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

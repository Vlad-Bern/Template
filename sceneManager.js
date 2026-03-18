import { CharacterManager } from "./characterManager.js";
import { AudioManager } from "./audioManager.js";
import { NotificationManager } from "./notificationManager.js";
import { updateStat } from "./state.js";
import { story } from "../data/story/prologue_ru.js";
import { animations } from "../data/macros.js";
import { UIManager } from "./uiManager.js";
import { ChoiceSystem } from "./choiceSystem.js";
import { HistoryManager } from "./historyManager.js";

const nm = new NotificationManager();

export class SceneManager {
  constructor(tw) {
    this.tw = tw;
    this.cm = new CharacterManager();
    this.am = new AudioManager();
    this.ui = new UIManager();
    this.cs = new ChoiceSystem();
    this.hm = new HistoryManager();

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

    // Правый клик (скрыть/показать UI или закрыть историю)
    document.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      if (e.pointerType === "touch" || window.sm?.isMobile) return;

      if (this.hm.modalOpen) {
        this.hm.hideHistory();
      } else {
        const ui = document.getElementById("game-ui");
        const choiceContainer = document.getElementById("choice-container");
        const interLayer = document.getElementById("interaction-layer");

        if (ui) {
          this.uiHidden = !this.uiHidden; // Переключаем глобальный флаг

          const opacity = this.uiHidden ? "0" : "1";
          const pointerEvents = this.uiHidden ? "none" : "auto";

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
      // Игнорируем всё, если интерфейс скрыт ПКМ
      if (this.uiHidden) {
        if (e.code === "Escape") {
          document.dispatchEvent(new MouseEvent("contextmenu"));
        }
        return;
      }

      // Открытие/закрытие истории на H (работает всегда!)
      if (this.hm.modalOpen) {
        if (e.code === "Escape" || e.code === "KeyH") {
          this.hm.hideHistory();
        }
        return; // Если история открыта, дальше ничего не обрабатываем
      } else if (e.code === "KeyH" && !e.repeat) {
        this.hm.showHistory();
        return; // Открыли историю - выходим
      }

      if (this.cs && this.cs.isActive) return;

      // Скип (работает ТОЛЬКО если нет выборов)
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

  async loadScene(sceneId) {
    this.isFastForwarding = false;
    if (this.fastForwardTimeoutId) {
      clearTimeout(this.fastForwardTimeoutId);
      this.fastForwardTimeoutId = null;
    }
    if (this.navController) this.navController.abort();

    if (window.quizTimer) {
      clearTimeout(window.quizTimer);
      window.quizTimer = null;
    }

    const scene = story[sceneId];
    if (!scene) return console.error(`[SM] Scene not found: ${sceneId}`);

    if (typeof scene.action === "function") {
      try {
        scene.action();
      } catch (e) {
        console.error("Scene action error:", e);
      }
    }

    if (scene.bg) {
      const optimizedBg = this._getOptimizedBgPath(scene.bg);
      this.ui.updateBackground(optimizedBg);
    }

    this.currentScene = scene;
    this.currentLineIndex = 0;

    const interLayer = document.getElementById("interaction-layer");
    const dialogWrapper = document.getElementById("dialog-wrapper");

    if (interLayer) {
      interLayer.innerHTML = "";
      interLayer.style.display = "none";
    }
    if (dialogWrapper) dialogWrapper.style.display = "flex";

    this.am.handleAudio(scene.audio);

    if (scene.showCharacter) {
      const { id, emotion, position } = scene.showCharacter;
      const animFunc = animations[scene.anim] || animations.fadeInUp;
      this.cm.show(id, emotion, position, animFunc);
    }

    if (scene.hideCharacter) {
      const animFunc = animations[scene.anim] || animations.fadeOut;
      if (this.cm.hide) this.cm.hide(scene.hideCharacter, animFunc);
    }

    let sceneLines =
      typeof scene.lines === "function" ? scene.lines() : scene.lines;

    if (sceneLines && sceneLines.length > 0) {
      await this.playLines(sceneLines);
    }

    this.prepareNavigation(scene);
  }

  async playLines(lines) {
    const db = document.getElementById("dialog-box");

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      if (line.effects) {
        Object.entries(line.effects).forEach(([stat, val]) =>
          updateStat(stat, val),
        );
      }

      if (typeof line.action === "function") {
        try {
          const result = line.action();
          if (result && result.fx) this.ui.handleFx(result.fx);
        } catch (e) {
          console.error("Line action error:", e, line);
        }
      }

      if (line.audio) this.am.handleAudio(line.audio);
      if (line.shake) this.ui.shakeScreen(line.shake);
      if (line.fx) this.ui.handleFx(line.fx);
      if (line.bg) {
        const optimizedLineBg = this._getOptimizedBgPath(line.bg);
        this.ui.updateBackground(optimizedLineBg);
      }

      let displayText = line.text;
      if (!line.speaker) displayText = `${line.text}`;

      this.currentLineIndex = i;
      this.hm.addToHistory(line.speaker, displayText);
      this.ui.updateNameTag(line.speaker);

      if (line.showCharacter) {
        const { id, emotion, position } = line.showCharacter;
        const animFunc = animations[line.anim] || animations.fadeInUp;
        if (this.cm.show) this.cm.show(id, emotion, position, animFunc);
      }

      // Если нужно скрыть персонажа прямо посреди разговора
      if (line.hideCharacter) {
        const animFunc = animations[line.anim] || animations.fadeOut;
        if (this.cm.hide) this.cm.hide(line.hideCharacter, animFunc);
      }

      this.isTyping = true;
      if (db) db.classList.remove("waiting");

      const typePromise = this.tw.type(displayText);
      const clickPromise = this.waitForClick();

      await Promise.race([typePromise, clickPromise]);
      await typePromise;

      this.isTyping = false;
      if (db) db.classList.add("waiting");
      await this.waitForClick();
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
      // 1. Если был старый контроллер - убиваем его
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
        if (this.hm && this.hm.modalOpen) return;
        if (this.uiHidden) return;

        if (e.target && e.target.closest) {
          if (
            e.target.id === "modal-backdrop" ||
            e.target.closest("#close-history") ||
            e.target.closest("#open-history-btn")
          ) {
            return;
          }
        }

        if (e.repeat) return;

        const allowed = ["Space", "Enter", "NumpadEnter", "ArrowRight"];
        if (e.type === "keydown" && !allowed.includes(e.code)) return;
        if (e.code === "Space") e.preventDefault();

        // Если текст печатается - скипаем эффект печатной машинки
        if (this.isTyping) {
          this.tw.skip();
        } else {
          // Если текст уже напечатан - идем дальше (аборт сам вызовет resolve благодаря коду выше)
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
}

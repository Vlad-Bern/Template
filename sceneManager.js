import { CharacterManager } from "./characterManager.js";
import { AudioManager } from "./audioManager.js";
import { NotificationManager } from "./notificationManager.js";
import { state, updateStat } from "./state.js";
import { story } from "../data/story/prologue_ru.js";
import { animations } from "../data/macros.js";
import { characters } from "../data/characters.js";

const nm = new NotificationManager();

export class SceneManager {
  constructor(tw) {
    this.tw = tw;
    this.cm = new CharacterManager();
    this.am = new AudioManager();
    this.isTyping = false;
    this.currentScene = null;
    this.navController = null;
    this.currentLineIndex = 0;
    this.history = [];
    this.maxHistoryLength = 50;
    this.isCtrlPressed = false;
    this.modalOpen = false;
    this.fastForwardTimeoutId = null;
    this.isFastForwarding = false;

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () =>
        this.initGlobalEvents(),
      );
    } else {
      this.initGlobalEvents();
    }
  }

  initGlobalEvents() {
    document.addEventListener("dblclick", (e) => {
      if (e.target.closest("#game-ui")) {
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen().catch(() => {});
        } else {
          document.exitFullscreen();
        }
      }
    });

    document.addEventListener("click", (e) => {
      if (e.target.closest("#open-history-btn")) {
        e.stopPropagation();
        this.showHistory();
        return;
      }
      if (
        e.target.closest("#close-history") ||
        e.target.id === "modal-backdrop"
      ) {
        e.stopPropagation();
        this.hideHistory();
        return;
      }
    });

    window.addEventListener("loadScene", (e) => {
      const sceneId = e.detail;
      if (sceneId) {
        console.log(`[SM] Пойман ивент loadScene: перехожу на ${sceneId}`);
        this.loadScene(sceneId);
      }
    });

    window.addEventListener("keydown", (e) => {
      if (this.modalOpen) {
        if (e.code === "Escape" || e.code === "KeyH") {
          this.hideHistory();
        }
        return;
      }

      if (e.code === "ControlLeft" || e.code === "ControlRight") {
        if (!this.isFastForwarding) {
          this.isFastForwarding = true;
          this.handleFastForward();
        }
      }

      if (e.code === "KeyH" && !e.repeat) {
        this.showHistory();
      }
    });

    window.addEventListener("keyup", (e) => {
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
      const bgLayer = document.getElementById("bg-layer");
      const globalBg = document.getElementById("global-bg");
      if (bgLayer) bgLayer.style.backgroundImage = `url('${scene.bg}')`;
      if (globalBg) globalBg.style.backgroundImage = `url('${scene.bg}')`;
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

    this.handleAudio(scene.audio);

    if (scene.showCharacter) {
      const { id, emotion, position } = scene.showCharacter;
      const animFunc = animations[scene.anim] || animations.fadeInUp;
      this.cm.show(id, emotion, position, animFunc);
    }

    if (scene.action && typeof scene.action === "function") {
      try {
        scene.action();
        console.log(`[SM] Action executed for scene: ${sceneId}`);
      } catch (e) {
        console.error(`[SM] Action failed in ${sceneId}:`, e);
      }
    }

    if (scene.lines && scene.lines.length > 0) {
      await this.playLines(scene.lines);
    }

    this.prepareNavigation(scene);
  }

  async playLines(lines) {
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      if (line.effects) {
        Object.entries(line.effects).forEach(([stat, val]) =>
          updateStat(stat, val),
        );
      }

      if (typeof line.action === "function") {
        try {
          line.action();
        } catch (e) {
          console.error("Line action error:", e, line);
        }
      }

      if (line.audio) {
        this.handleAudio(line.audio);
      }

      if (line.shake) {
        this.shakeScreen(line.shake);
      }

      if (line.fx) {
        this.handleFx(line.fx);
      }

      // Анимации диалогового окна
      if (line.anim && !line.showCharacter) {
        const animFunc = animations[line.anim];
        if (animFunc) animFunc("#dialog-wrapper");
      }

      if (line.showCharacter) {
        const { id, emotion, position } = line.showCharacter;
        const animFunc = animations[line.anim] || animations.fadeInUp;
        this.cm.show(id, emotion, position, animFunc);
      }

      if (line.hideCharacter) {
        const animFunc = animations[line.anim] || animations.fadeOut;
        if (this.cm.hide) this.cm.hide(line.hideCharacter, animFunc);
      }

      // Логика мыслей
      let displayText = line.text;
      if (!line.speaker) {
        displayText = `*${line.text}*`;
      }

      this.currentLineIndex = i;
      this.addToHistory(line.speaker, displayText);
      this.updateNameTag(line.speaker);

      this.isTyping = true;
      const typePromise = this.tw.type(displayText);
      const clickPromise = this.waitForClick();

      await Promise.race([typePromise, clickPromise]);
      await typePromise;

      this.isTyping = false;
      await this.waitForClick();
    }

    const db = document.getElementById("dialog-box"); // Берем сам контейнер текста

    for (let i = 0; i < lines.length; i++) {
      // ... твой код эффектов ...

      this.isTyping = true;
      if (db) db.classList.remove("waiting"); // Убираем стрелочку во время печати

      const typePromise = this.tw.type(displayText);
      const clickPromise = this.waitForClick();

      await Promise.race([typePromise, clickPromise]);
      await typePromise;

      this.isTyping = false;
      if (db) db.classList.add("waiting"); // Показываем стрелочку в конце текста!

      await this.waitForClick();
    }

    if (db) db.classList.remove("waiting"); // Убираем перед сменой сцены или выбором
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
      this.renderInteractions(scene);
    } else if (scene.choices && scene.choices.length > 0) {
      this.showChoices(scene.choices);
    } else if (scene.next) {
      // === ВОТ ТУТ ТОТ САМЫЙ ФИКС! ===
      // Если next это функция - выполняем её. Если просто текст - берем как есть.
      const nextSceneId =
        typeof scene.next === "function" ? scene.next() : scene.next;

      // И загружаем результат
      if (nextSceneId) {
        this.loadScene(nextSceneId);
      }
    } else {
      console.log("[SM] Конец ветки/игры. scene.next отсутствует.");
    }
  }

  renderInteractions(scene) {
    const layer = document.getElementById("interaction-layer");
    if (!layer) return;
    layer.innerHTML = "";
    layer.style.display = "block";

    scene.interactables.forEach((obj) => {
      const el = document.createElement("div");
      el.className = `interact-point type-${obj.type}`;
      el.style.top = obj.pos.y + "%";
      el.style.left = obj.pos.x + "%";

      let icon = obj.type === "exit" ? "➔" : obj.type === "talk" ? "💬" : "👁️";
      el.innerHTML = `<div class="icon">${icon}</div><div class="label">${obj.label || ""}</div>`;
      el.onclick = (e) => {
        e.stopPropagation();
        this.am.playSFX("click_world");
        if (typeof obj.action === "function") {
          obj.action();
        }

        this.loadScene(obj.next);
      };
      layer.appendChild(el);
    });
  }

  showChoices(choices) {
    const container = document.getElementById("choice-container");
    if (!container) return;
    container.innerHTML = "";

    choices.forEach((choice) => {
      const wrapper = document.createElement("div");
      wrapper.className = "choice-wrapper";

      const btn = document.createElement("button");
      btn.className = "choice-btn";
      btn.textContent = choice.text;

      let isMet = true;
      if (choice.req) {
        const { stat, value } = choice.req;
        isMet = this.getStat(stat) >= value;
        const info = document.createElement("div");
        info.className = `choice-info ${isMet ? "met" : "unmet"}`;
        info.innerHTML = `<span>${this.getStatDisplayName(stat)} ${value}+</span> <span>${isMet ? "✅" : "❌"}</span>`;
        wrapper.appendChild(info);
      }

      btn.onclick = (e) => {
        e.stopPropagation();
        if (!isMet) {
          this.am.playSFX("access_denied");
          btn.classList.add("invalid-click");
          setTimeout(() => btn.classList.remove("invalid-click"), 400);
          return;
        }

        // Обработка эффектов ВЫБОРА (это было, но для строк не было!)
        if (choice.effects) {
          Object.entries(choice.effects).forEach(([s, v]) => updateStat(s, v));
        }
        // === ДОБАВЛЕНО ДЛЯ ТЕСТА ===
        if (typeof choice.action === "function") {
          choice.action();
        }
        // ===========================
        container.innerHTML = "";
        // Проверяем choice.next, потому что action мог сам вызвать переход
        const nextSceneId =
          typeof choice.next === "function" ? choice.next() : choice.next;

        if (nextSceneId) {
          this.loadScene(nextSceneId);
        }
      };
      wrapper.appendChild(btn);
      container.appendChild(wrapper);
    });
  }

  getStat(statName) {
    return state.hero?.stats?.[statName] ?? 0;
  }

  getStatDisplayName(statName) {
    const names = {
      dominance: "Доминирование",
      willpower: "Воля",
      physique: "Сила",
      sanity: "Рассудок",
    };
    return names[statName] || statName;
  }

  waitForClick() {
    return new Promise((resolve) => {
      if (this.navController) this.navController.abort();
      this.navController = new AbortController();
      const { signal } = this.navController;

      const advance = (e) => {
        if (this.modalOpen) return;
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
        const allowed = ["Space", "Enter", "ArrowRight"];
        if (e.type === "keydown" && !allowed.includes(e.code)) return;
        if (e.code === "Space") e.preventDefault();

        if (this.isTyping) {
          this.tw.skip();
        } else {
          if (this.navController) this.navController.abort();
          resolve();
        }
      };

      window.addEventListener("click", advance, { signal });
      window.addEventListener("keydown", advance, { signal });
    });
  }

  handleAudio(audio) {
    if (!audio) return;
    const play = (a) => {
      if (a.type === "bgm") this.am.playBGM(a.id, a.volume || 0.5);
      if (a.type === "sfx") this.am.playSFX(a.id, a.volume || 1);
    };
    Array.isArray(audio) ? audio.forEach(play) : play(audio);
  }

  updateNameTag(speakerKey) {
    const nt = document.getElementById("name-tag");
    const db = document.getElementById("dialog-box");
    const bg = document.getElementById("dialog-bg-color"); // Наш новый фон!

    if (!nt) return;

    const character = characters[speakerKey];

    // Определяем базовый цвет
    let charColor = "#ffffff";
    let bgColor = "rgba(10, 10, 10, 0.85)"; // Дефолтный темный фон для мыслей

    if (character) {
      charColor = character.color || "#ffffff";
      // Делаем фон цвета персонажа, но очень прозрачным (15%), чтобы текст читался!
      bgColor = this.hexToRgba(charColor, 0.15);

      nt.textContent = character.name;
      nt.classList.add("active");
    } else if (!speakerKey) {
      // Мысли
      charColor = "#aaaaaa";
      nt.classList.remove("active");
    } else {
      // Кастомный спикер
      charColor = "#ffffff";
      nt.textContent = speakerKey;
      nt.classList.add("active");
    }

    // Применяем цвета с плавными CSS-транзишенами
    nt.style.color = charColor;
    nt.style.borderColor = charColor;
    if (db) db.style.color = charColor;

    // Магия заливки фона!
    if (bg) {
      // Если это Кагами, фон плавно станет красноватым. Если мысли - плавно вернется в темно-серый.
      bg.style.backgroundColor = bgColor;
    }
  }

  handleFx({ darkness, noise, duration = 1000 }) {
    if (darkness !== undefined) {
      anime({
        targets: "#fx-layer",
        opacity: darkness,
        duration: duration,
        easing: "linear",
      });
    }
    if (noise !== undefined) {
      anime({
        targets: "#noise-layer",
        opacity: noise,
        duration: duration,
        easing: "linear",
      });
    }
  }

  shakeScreen(intensity = "medium") {
    const dialog = document.getElementById("dialog-wrapper");
    if (!dialog) return;
    const force = { small: 2, medium: 5, heavy: 12 }[intensity] || 5;
    anime({
      targets: dialog,
      translateX: [force, -force, 0],
      duration: 300,
      easing: "easeInOutSine",
    });
  }

  addToHistory(speaker, text) {
    this.history.push({ speaker, text, timestamp: Date.now() });
    if (this.history.length > 50) this.history.shift();
  }

  showHistory() {
    const panel = document.getElementById("history-panel");
    const backdrop = document.getElementById("modal-backdrop");
    const content = document.getElementById("history-content");
    if (!panel || !content) return;
    content.innerHTML = this.history
      .map(
        (entry) => `
      <div class="history-entry">
        <strong>${entry.speaker || "Narrator"}:</strong>
        <span>${entry.text}</span>
      </div>
    `,
      )
      .join("");
    if (backdrop) backdrop.style.display = "block";
    panel.style.display = "flex";
    this.modalOpen = true;
    setTimeout(() => {
      content.scrollTop = content.scrollHeight;
    }, 50);
  }

  hideHistory() {
    const panel = document.getElementById("history-panel");
    const backdrop = document.getElementById("modal-backdrop");
    if (panel) panel.style.display = "none";
    if (backdrop) backdrop.style.display = "none";
    this.modalOpen = false;
  }

  // Функция-хелпер для превращения HEX (#ff0000) в RGBA с нужной прозрачностью
  hexToRgba(hex, alpha) {
    if (!hex.startsWith("#")) return `rgba(10, 10, 10, ${alpha})`;
    let r = parseInt(hex.slice(1, 3), 16);
    let g = parseInt(hex.slice(3, 5), 16);
    let b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
}

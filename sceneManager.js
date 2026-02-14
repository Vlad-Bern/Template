import { Typewriter } from "./typewriter.js";
import { CharacterManager } from "./characterManager.js";
import { AudioManager } from "./audioManager.js";
import { NotificationManager } from "./notificationManager.js";
import { state, updateStat } from "./state.js";
import { story } from "../data/story.js";
import { animations } from "../data/macros.js";

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
  }

  async loadScene(sceneId) {
    const scene = story[sceneId];
    if (!scene) {
      console.error(`[SM] Scene not found: ${sceneId}`);
      return;
    }
    this.currentScene = scene;
    this.currentLineIndex = 0;

    // 1. АУДИО И ЭФФЕКТЫ СЦЕНЫ
    this.handleAudio(scene.audio);

    // 2. ПЕРСОНАЖИ
    if (scene.showCharacter) {
      const { id, emotion, position } = scene.showCharacter;
      const animFunc = animations[scene.anim] || animations.fadeInUp;
      this.cm.show(id, emotion, position, animFunc);
    }

    // 3. ЭФФЕКТЫ СЦЕНЫ
    if (scene.effects) {
      Object.entries(scene.effects).forEach(([stat, val]) =>
        updateStat(stat, val),
      );
    }

    // 4. ПРОКЛИКИВАЕМ МАССИВ LINES
    if (scene.lines && scene.lines.length > 0) {
      await this.playLines(scene.lines);
    } else if (scene.dialogue) {
      this.updateNameTag(scene.speaker);
      this.isTyping = true;
      await this.tw.type(scene.dialogue);
      this.isTyping = false;
      await this.waitForClick();
    }

    // 5. НАВИГАЦИЯ
    this.prepareNavigation(scene);
  }

  async playLines(lines) {
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      this.currentLineIndex = i;

      // Добавляем в историю для backlog
      this.addToHistory(line.speaker, line.text);

      this.updateNameTag(line.speaker);

      if (line.effects) {
        Object.entries(line.effects).forEach(([stat, val]) =>
          updateStat(stat, val),
        );
      }

      if (line.audio) this.handleAudio(line.audio);

      if (line.showCharacter) {
        const { id, emotion, position } = line.showCharacter;
        const animFunc = animations[line.anim] || animations.fadeInUp;
        this.cm.show(id, emotion, position, animFunc);
      }

      if (line.shake) this.shakeScreen(line.shake);

      this.isTyping = true;
      await this.tw.type(line.text || "");
      this.isTyping = false;

      await this.waitForClick();
    }
  }

  waitForClick() {
    return new Promise((resolve) => {
      if (this.navController) this.navController.abort();
      this.navController = new AbortController();
      const { signal } = this.navController;

      const handler = () => {
        if (this.isTyping) {
          this.tw.skip();
        } else {
          resolve();
        }
      };

      window.addEventListener("click", handler, { signal });
    });
  }

  handleAudio(audio) {
    if (!audio) return;
    const play = (a) => {
      if (a.type === "bgm") this.am.playBGM(a.id, a.volume || 0.5);
      if (a.type === "sfx") this.am.playSFX(a.id, a.volume || 1);
      if (a.type === "stop") this.am.stopBGM(a.fade || 1000);
    };
    Array.isArray(audio) ? audio.forEach(play) : play(audio);
  }

  updateNameTag(speaker) {
    const nameTag = document.getElementById("name-tag");
    if (!nameTag) return;

    if (speaker) {
      nameTag.textContent = speaker;
      nameTag.classList.add("active");
      nameTag.style.display = "inline-block";
    } else {
      nameTag.classList.remove("active");
      nameTag.style.display = "none";
    }
  }

  prepareNavigation(scene) {
    const container = document.getElementById("choice-container");
    container.innerHTML = "";

    if (this.navController) this.navController.abort();
    this.navController = new AbortController();
    const { signal } = this.navController;

    if (scene.choices) {
      this.showChoices(scene.choices);
    } else if (scene.next) {
      window.addEventListener(
        "click",
        () => {
          this.loadScene(scene.next);
        },
        { signal },
      );
    }
  }

  // === КЛЮЧЕВОЙ ФИКС: ПРАВИЛЬНАЯ ПРОВЕРКА И УВЕДОМЛЕНИЯ ===
  showChoices(choices) {
    const container = document.getElementById("choice-container");

    choices.forEach((choice) => {
      const btn = document.createElement("button");
      btn.className = "choice-btn pulse-in";

      // Проверка требований (гибкая для любой структуры state)
      let isLocked = false;
      let currentValue = 0;
      let requiredValue = 0;
      let statName = "";

      if (choice.req) {
        statName = choice.req.stat;
        requiredValue = choice.req.value;

        // Универсальный геттер (поддерживает state.dominance и state.hero.stats.dominance)
        currentValue = this.getStat(statName);
        isLocked = currentValue < requiredValue;
      }

      btn.innerHTML = isLocked
        ? `<span class="lock-icon">🔒</span> ${choice.text}`
        : choice.text;

      if (isLocked) btn.classList.add("locked");

      btn.addEventListener("click", (e) => {
        e.stopPropagation();

        if (isLocked) {
          // === ВАЖНО: УВЕДОМЛЕНИЕ ДЛЯ ИГРОКА ===
          this.am.playSFX("access_denied");
          nm.show(
            `🚫 Недостаточно ${this.getStatDisplayName(statName)}: ${currentValue}/${requiredValue}`,
            "error",
          );

          // Анимация тряски кнопки
          btn.classList.add("shake-error");
          setTimeout(() => btn.classList.remove("shake-error"), 500);

          console.log(
            `[SM] Choice blocked: ${statName} (${currentValue}/${requiredValue})`,
          );
          return;
        }

        // Применяем эффекты выбора
        if (choice.effects) {
          Object.entries(choice.effects).forEach(([stat, val]) =>
            updateStat(stat, val),
          );
        }

        container.innerHTML = "";
        this.loadScene(choice.next);
      });

      container.appendChild(btn);
    });
  }

  // === НОВАЯ ФУНКЦИЯ: Универсальный геттер статов ===
  getStat(statName) {
    // Поддержка разных структур:
    // 1. state.dominance (плоская)
    // 2. state.hero.stats.dominance (вложенная)

    if (state[statName] !== undefined) {
      return state[statName];
    }

    if (
      state.hero &&
      state.hero.stats &&
      state.hero.stats[statName] !== undefined
    ) {
      return state.hero.stats[statName];
    }

    console.warn(`[SM] Stat "${statName}" not found in state`);
    return 0;
  }

  // === НОВАЯ ФУНКЦИЯ: Красивые имена статов для уведомлений ===
  getStatDisplayName(statName) {
    const names = {
      dominance: "Доминирования",
      willpower: "Силы воли",
      physique: "Физ. силы",
      stress: "Стресса",
      fear: "Страха",
      rank: "Ранга",
      influence: "Влияния",
    };
    return names[statName] || statName;
  }

  shakeScreen(intensity = "medium") {
    const gameContainer = document.getElementById("game-container");
    const levels = { small: 5, medium: 10, heavy: 20 };
    const force = levels[intensity] || 10;

    anime({
      targets: gameContainer,
      translateX: [force, -force, force, -force, 0],
      duration: 400,
      easing: "easeInOutSine",
    });
  }

  // === СИСТЕМА СОХРАНЕНИЙ ===
  saveProgress() {
    const saveData = {
      sceneId: this.currentScene.id,
      stats: { ...state },
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem("abnormal_save_auto", JSON.stringify(saveData));
    nm.show("💾 Прогресс сохранён", "success");
    console.log("[SM] Game saved:", saveData);
  }

  loadProgress() {
    const saved = localStorage.getItem("abnormal_save_auto");
    if (!saved) {
      console.warn("[SM] No save found.");
      return false;
    }

    try {
      const data = JSON.parse(saved);
      Object.entries(data.stats).forEach(([key, val]) => {
        state[key] = val;
      });
      this.loadScene(data.sceneId);
      nm.show("📂 Прогресс загружен", "info");
      console.log("[SM] Game loaded:", data);
      return true;
    } catch (e) {
      console.error("[SM] Failed to load save:", e);
      return false;
    }
  }

  // === ИСТОРИЯ ДИАЛОГОВ (BACKLOG) ===
  addToHistory(speaker, text) {
    this.history.push({ speaker, text, timestamp: Date.now() });
    if (this.history.length > this.maxHistoryLength) {
      this.history.shift();
    }
  }

  showHistory() {
    console.log("[SM] History:", this.history);
    // TODO: Реализовать UI для показа истории
  }
}

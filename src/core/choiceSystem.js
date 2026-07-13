import { state, updateStat, setFlag, getFlag } from "./state.js";
import { inputManager, INPUT_PRIORITY } from "./inputManager.js";

export class ChoiceSystem {
  constructor() {
    this.choiceContainer = document.getElementById("choice-container");
    this.interactionLayer = document.getElementById("interaction-layer");

    this.currentNavIndex = -1;
    this.navButtons = [];
    this.keydownHandler = null;
    this.wheelHandler = null;
    this.globalClickHandler = null;
    this._keyOff = null;
    this._wheelOff = null;
    this.isActive = false;
    this.isInputLocked = false;
    this.touchStartHandler = null;
    this.touchMoveHandler = null;
  }

  getStat(statPath) {
    // Сначала ищем в state.hero.stats (dominance, sanity, physique)
    if (state.hero?.stats && Object.hasOwn(state.hero.stats, statPath)) {
      return state.hero.stats[statPath];
    }
    // Потом в state.hero (rank_score, credits)
    if (state.hero && Object.hasOwn(state.hero, statPath)) {
      return state.hero[statPath];
    }
    // Потом по точечному пути "hero.rank_score" на всякий случай
    const parts = statPath.split(".");
    let current = state;
    for (const part of parts) {
      if (current?.[part] === undefined) return 0;
      current = current[part];
    }
    return typeof current === "number" ? current : 0;
  }

  getStatDisplayName(rawKey) {
    let cleanKey = rawKey
      .split(".")
      .pop()
      .replace(/stats?\(/gi, "")
      .replace(/\)/g, "")
      .trim()
      .toLowerCase();

    const lang = window.settingsManager?.settings?.language || "ru"; // ← FIX

    const names = {
      ru: {
        dominance: "Доминирование",
        physique: "Сила",
        sanity: "Рассудок",
        rank_score: "Ранг",
      },
      en: {
        dominance: "Dominance",
        physique: "Physique",
        sanity: "Sanity",
        rank_score: "Rank",
      },
      ja: {
        dominance: "支配力",
        physique: "体力",
        sanity: "正気度",
        rank_score: "ランク",
      },
    };

    return names[lang]?.[cleanKey] || names["ru"][cleanKey] || cleanKey;
  }

  _getConditionLabels(lang) {
    const labels = {
      ru: { condition: "Условие", required: "Требуется" },
      en: { condition: "Condition", required: "Required" },
      ja: { condition: "条件", required: "必要" },
    };
    return labels[lang] ?? labels["ru"];
  }

  checkRequirements(reqs) {
    if (!reqs) return true;
    for (const [key, condition] of Object.entries(reqs)) {
      if (key.startsWith("flag_")) {
        const flagName = key.replace("flag_", "");
        const flagVal = state.flags[flagName];
        if (flagVal !== condition) return false;
      } else {
        const statValue = this.getStat(key);
        if (typeof condition === "object") {
          if (condition.min !== undefined && statValue < condition.min)
            return false;
          if (condition.max !== undefined && statValue > condition.max)
            return false;
        } else if (statValue < condition) {
          return false;
        }
      }
    }
    return true;
  }

  applyEffects(effects) {
    if (!effects) return;
    for (const [key, value] of Object.entries(effects)) {
      if (key.startsWith("flag_")) {
        const flagName = key.replace("flag_", "");
        setFlag(flagName, value);
      } else {
        updateStat(key, value);
      }
    }
  }

  setupKeyboardNavigation() {
    this.currentNavIndex = -1;
    this.removeEventListeners();

    if (this.choiceContainer) {
      this.choiceContainer.tabIndex = -1;
      this.choiceContainer.focus();
    }

    const updateHighlight = () => {
      this.navButtons.forEach((btn, index) => {
        if (index === this.currentNavIndex) {
          btn.classList.add("selected");
        } else {
          btn.classList.remove("selected");
        }
      });
    };

    this.globalClickHandler = (e) => {
      if (
        this.isInputLocked ||
        (window.sm && window.sm.uiHidden) ||
        (window.sm && window.sm.hm && window.sm.hm.modalOpen) ||
        !this.isActive
      )
        return;

      const isClickOnButton =
        e.target.closest(".choice-btn") || e.target.closest(".choice-wrapper");

      if (
        !isClickOnButton &&
        this.currentNavIndex >= 0 &&
        this.currentNavIndex < this.navButtons.length
      ) {
        e.preventDefault();
        this.navButtons[this.currentNavIndex].click();
      }
    };

    this.keydownHandler = (e) => {
      if (
        this.isInputLocked ||
        (window.sm && window.sm.uiHidden) ||
        (window.sm && window.sm.hm && window.sm.hm.modalOpen) ||
        !this.isActive ||
        this.navButtons.length === 0
      )
        return;

      if (e.code === "ArrowDown" || e.code === "KeyS") {
        e.preventDefault();
        this.currentNavIndex++;
        if (this.currentNavIndex >= this.navButtons.length)
          this.currentNavIndex = 0;
        updateHighlight();
      } else if (e.code === "ArrowUp" || e.code === "KeyW") {
        e.preventDefault();
        this.currentNavIndex--;
        if (this.currentNavIndex < 0)
          this.currentNavIndex = this.navButtons.length - 1;
        updateHighlight();
      } else if (e.code === "Enter" || e.code === "Space") {
        e.preventDefault();
        if (
          this.currentNavIndex >= 0 &&
          this.currentNavIndex < this.navButtons.length
        ) {
          this.navButtons[this.currentNavIndex].click();
        }
      }
    };

    let isScrolling = false;
    this.wheelHandler = (e) => {
      if (
        this.isInputLocked ||
        (window.sm && window.sm.uiHidden) ||
        (window.sm && window.sm.hm && window.sm.hm.modalOpen) ||
        !this.isActive ||
        this.navButtons.length === 0 ||
        isScrolling
      )
        return;

      if (e.deltaY > 20) {
        isScrolling = true;
        this.currentNavIndex++;
        if (this.currentNavIndex >= this.navButtons.length)
          this.currentNavIndex = 0;
        updateHighlight();
        setTimeout(() => (isScrolling = false), 150);
      } else if (e.deltaY < -20) {
        isScrolling = true;
        this.currentNavIndex--;
        if (this.currentNavIndex < 0)
          this.currentNavIndex = this.navButtons.length - 1;
        updateHighlight();
        setTimeout(() => (isScrolling = false), 150);
      }
    };

    this._keyOff = inputManager.on(
      "keydown",
      (e) => {
        if (!this.isActive) return false;
        const handled =
          e.code === "ArrowDown" ||
          e.code === "KeyS" ||
          e.code === "ArrowUp" ||
          e.code === "KeyW" ||
          e.code === "Enter" ||
          e.code === "Space";
        if (!handled) return false;
        if (this.keydownHandler) this.keydownHandler(e);
        return true;
      },
      { priority: INPUT_PRIORITY.CHOICE, owner: this },
    );
    this._wheelOff = inputManager.on(
      "wheel",
      (e) => {
        if (!this.isActive) return false;
        if (this.wheelHandler) this.wheelHandler(e);
        return true;
      },
      { priority: INPUT_PRIORITY.CHOICE, owner: this },
    );
    document.addEventListener("click", this.globalClickHandler, true);

    let touchStartY = 0;
    this.touchStartHandler = (e) => {
      touchStartY = e.touches[0].clientY;
    };
    this.touchMoveHandler = (e) => {
      if (this.isInputLocked || !this.isActive || this.navButtons.length === 0)
        return;
      const deltaY = touchStartY - e.touches[0].clientY;
      if (Math.abs(deltaY) < 30) return;
      if (deltaY > 0) {
        this.currentNavIndex = Math.min(
          this.currentNavIndex + 1,
          this.navButtons.length - 1,
        );
      } else {
        this.currentNavIndex = Math.max(this.currentNavIndex - 1, 0);
      }
      updateHighlight();
      touchStartY = e.touches[0].clientY;
    };
    document.addEventListener("touchstart", this.touchStartHandler, {
      passive: true,
    });
    document.addEventListener("touchmove", this.touchMoveHandler, {
      passive: true,
    });

    this.navButtons.forEach((btn, index) => {
      btn.addEventListener("pointerenter", (e) => {
        // Игнорируем всё, если это тач-событие или девайс без реальной мыши
        if (
          this.isInputLocked ||
          e.pointerType === "touch" ||
          window.matchMedia("(hover: none)").matches
        )
          return;
        this.currentNavIndex = index;
        updateHighlight();
      });
      btn.addEventListener("pointerleave", (e) => {
        if (
          e.pointerType === "touch" ||
          window.matchMedia("(hover: none)").matches
        )
          return;
        this.currentNavIndex = -1;
        updateHighlight();
      });
    });
  }

  removeEventListeners() {
    if (this._keyOff) {
      this._keyOff();
      this._keyOff = null;
    }
    if (this._wheelOff) {
      this._wheelOff();
      this._wheelOff = null;
    }
    this.keydownHandler = null;
    this.wheelHandler = null;
    if (this.globalClickHandler) {
      document.removeEventListener("click", this.globalClickHandler, true);
      this.globalClickHandler = null;
    }
    if (this.touchStartHandler) {
      document.removeEventListener("touchstart", this.touchStartHandler);
      this.touchStartHandler = null;
    }
    if (this.touchMoveHandler) {
      document.removeEventListener("touchmove", this.touchMoveHandler);
      this.touchMoveHandler = null;
    }
  }

  cleanupNavigation() {
    this.removeEventListeners();
    this.navButtons = [];
  }

  forceClose() {
    this.isActive = false;
    this.cleanupNavigation();

    if (this.choiceContainer) {
      this.choiceContainer.innerHTML = "";
      this.choiceContainer.style.display = "none";
    }
    if (this.interactionLayer) {
      this.interactionLayer.innerHTML = "";
      this.interactionLayer.style.display = "none";
    }
  }

  showChoices(choices, onSelectCallback, audioManager) {
    if (!this.choiceContainer) return;

    this.isActive = true;

    // МАЙ: Жестко отрезвляем SceneManager от залипших касаний!
    // Эмитируем системные события отмены, чтобы сбросить любые висящие флаги
    // из-за которых первый тап уходил в пустоту.
    window.dispatchEvent(new Event("touchcancel"));
    window.dispatchEvent(new Event("touchend"));

    const skipIndicator = document.getElementById("skip-indicator");
    if (skipIndicator) {
      skipIndicator.classList.add("skip-hidden");
    }

    if (window.sm) {
      window.sm.isFastForwarding = false;
    }

    this.isInputLocked = true;
    setTimeout(() => {
      this.isInputLocked = false;
    }, 100);

    this.choiceContainer.innerHTML = "";
    this.choiceContainer.style.display = "flex";
    this.cleanupNavigation();

    choices.forEach((choice) => {
      const wrapper = document.createElement("div");
      wrapper.className = "choice-wrapper";

      const btn = document.createElement("button");
      btn.className = "choice-btn";

      const lang = window.settingsManager?.settings?.language || "ru";
      const labelText =
        typeof choice.text === "object"
          ? (choice.text[lang] ?? choice.text["ru"])
          : choice.text;
      btn.textContent = labelText;
      if (typeof choice.text === "object") {
        btn.dataset.i18nLabel = JSON.stringify(choice.text);
      }

      wrapper.appendChild(btn);

      let isMet = true;
      if (choice.req) {
        isMet = this.checkRequirements(choice.req);

        const info = document.createElement("div");
        info.className = `choice-info ${isMet ? "met" : "unmet"}`;

        const reqKey = Object.keys(choice.req)[0];
        const reqVal = choice.req[reqKey];
        const displayName = this.getStatDisplayName(reqKey);
        const requiredValue = typeof reqVal === "object" ? reqVal.min : reqVal;

        const lbl = this._getConditionLabels(lang);
        const conditionText = reqKey.startsWith("flag_")
          ? `${lbl.condition}: ${reqKey.replace("flag_", "")}`
          : `${lbl.required}: ${displayName} (${requiredValue})`;

        info.innerHTML = ` ${conditionText}   ${isMet ? "✅" : "❌"} `;
        info.dataset.reqKey = reqKey;
        info.dataset.reqValue = requiredValue;
        info.dataset.met = isMet;

        wrapper.appendChild(info);
      }

      const handleSelect = (e) => {
        if (e) e.stopPropagation();
        // Убиваем системный клик браузера, если это был тачскрин, чтобы не было двойных срабатываний
        if (e.type === "touchend") e.preventDefault();

        if (!isMet) {
          if (window.playUISound) window.playUISound("close");

          // МАЙ: Убираем выделение со всех кнопок и вешаем на ту, которую тапнули.
          // Это заставит плашку с требованиями красиво выехать, даже без hover!
          const allBtns = document.querySelectorAll(".choice-btn");
          allBtns.forEach((b) => b.classList.remove("selected"));
          btn.classList.add("selected");

          btn.classList.add("invalid-click");
          setTimeout(() => btn.classList.remove("invalid-click"), 400);
          return;
        }

        if (window.playUISound) window.playUISound("open");
        this.isActive = false;
        this.cleanupNavigation();

        this.choiceContainer.innerHTML = "";
        this.choiceContainer.style.display = "none";

        this.applyEffects(choice.effects);
        if (typeof choice.action === "function") choice.action();

        const nextSceneId =
          typeof choice.next === "function" ? choice.next() : choice.next;
        if (nextSceneId) onSelectCallback(nextSceneId);
      };

      // МАЙ: Вешаем клик для мыши
      btn.addEventListener("click", handleSelect);

      // МАЙ: ФИКС АВТОСКИПА!
      // Жёстко блокируем touchstart на самой кнопке, чтобы он не долетел до SceneManager
      // и не запустил скрытый таймер перемотки.
      btn.addEventListener("touchstart", (e) => e.stopPropagation(), {
        passive: true,
      });

      // МАЙ: Вешаем мгновенный хук для телефонов с защитой от скролла!
      let isMoved = false;
      btn.addEventListener("touchmove", () => (isMoved = true), {
        passive: true,
      });
      btn.addEventListener("touchend", (e) => {
        if (!isMoved) handleSelect(e); // Сработает мгновенно при отпускании пальца!
        isMoved = false;
      });

      this.choiceContainer.appendChild(wrapper);
      this.navButtons.push(btn);
    });

    this.setupKeyboardNavigation();
  }

  /**
   * Рисует экранные точки интерактива.
   *
   * Поддерживаемые типы:
   * - look: локальный осмотр; SceneManager проигрывает obj.lines и возвращает точки;
   * - exit: завершает блок, переходя в obj.next или к следующей строке.
   *
   * source может быть как сценой/блоком с полем interactables, так и самим массивом.
   * consumed содержит id уже использованных look-точек.
   */
  renderInteractions(source, onSelectCallback, audioManager, options = {}) {
    const layer = document.getElementById("interaction-layer");
    if (!layer) return;

    const interactables = Array.isArray(source)
      ? source
      : source?.interactables;
    const consumed = options.consumed || new Set();

    this.isActive = true;
    this.cleanupNavigation();

    layer.innerHTML = "";
    layer.style.display = "block";

    if (!interactables || interactables.length === 0) {
      this.isActive = false;
      return;
    }

    interactables.forEach((obj, index) => {
      const interactionId = obj.id ?? `interaction-${index}`;
      const type = obj.type || "look";

      if (type !== "look" && type !== "exit") {
        console.error(
          `[ChoiceSystem] Неизвестный тип интерактива "${type}". ` +
            'Разрешены только "look" и "exit".',
          obj,
        );
        return;
      }

      if (type === "look" && consumed.has(interactionId)) return;
      if (obj.req && !this.checkRequirements(obj.req)) return;

      const el = document.createElement("div");
      el.className = `interact-point type-${type}`;
      el.dataset.interactionId = interactionId;

      if (obj.pos) {
        el.style.top = obj.pos.y + "%";
        el.style.left = obj.pos.x + "%";
      } else {
        el.style.top = obj.y + "%";
        el.style.left = obj.x + "%";
      }

      if (obj.icon) {
        const iconEl = document.createElement("div");
        iconEl.className = "icon";
        iconEl.textContent = obj.icon;
        el.appendChild(iconEl);
      } else if (!obj.label) {
        const dot = document.createElement("div");
        dot.className = "dot-indicator";
        el.appendChild(dot);
      }

      if (obj.label) {
        const labelEl = document.createElement("div");
        labelEl.className = "label";
        if (typeof obj.label === "object") {
          const lang = window.settingsManager?.settings?.language || "ru";
          labelEl.textContent = obj.label[lang] ?? obj.label["ru"];
          labelEl.dataset.i18nLabel = JSON.stringify(obj.label);
        } else {
          labelEl.textContent = obj.label;
        }
        el.appendChild(labelEl);
      }

      el.onclick = (e) => {
        if (e) e.stopPropagation();
        if (window.playUISound) window.playUISound("open");
        if (window.sm && window.sm.uiHidden) return;
        if (!this.isActive) return;

        this.isActive = false;
        this.cleanupNavigation();

        layer.innerHTML = "";
        layer.style.display = "none";

        this.applyEffects(obj.effects);
        if (typeof obj.action === "function") obj.action();

        const nextSceneId =
          typeof obj.next === "function" ? obj.next() : obj.next;
        onSelectCallback?.({
          type,
          obj,
          interactionId,
          nextSceneId: nextSceneId || null,
        });
      };

      layer.appendChild(el);
    });
  }

  refreshChoiceTexts() {
    const lang = window.settingsManager?.settings?.language || "ru"; // ← FIX: один раз, наверху
    const lbl = this._getConditionLabels(lang);

    document.querySelectorAll(".choice-info[data-req-key]").forEach((info) => {
      const reqKey = info.dataset.reqKey;
      const reqValue = info.dataset.reqValue;
      const isMet = info.dataset.met === "true";
      const displayName = this.getStatDisplayName(reqKey);

      const conditionText = reqKey.startsWith("flag_")
        ? `${lbl.condition}: ${reqKey.replace("flag_", "")}`
        : `${lbl.required}: ${displayName} (${reqValue})`;

      info.innerHTML = ` ${conditionText}   ${isMet ? "✅" : "❌"} `;
    });

    document.querySelectorAll(".label[data-i18n-label]").forEach((el) => {
      const map = JSON.parse(el.dataset.i18nLabel);
      el.textContent = map[lang] ?? map["ru"];
    });

    document.querySelectorAll(".choice-btn[data-i18n-label]").forEach((btn) => {
      const map = JSON.parse(btn.dataset.i18nLabel);
      btn.textContent = map[lang] ?? map["ru"];
    });
  }
}

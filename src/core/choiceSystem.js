import { state, updateStat, setFlag, getFlag } from "./state.js";

export class ChoiceSystem {
  constructor() {
    this.choiceContainer = document.getElementById("choice-container");
    this.interactionLayer = document.getElementById("interaction-layer");

    // --- НОВЫЕ СВОЙСТВА ДЛЯ НАВИГАЦИИ ---
    this.currentNavIndex = -1;
    this.navButtons = [];
    this.keydownHandler = null;
    this.wheelHandler = null;
    this.globalClickHandler = null;
    this.isActive = false;
    this.isInputLocked = false;
    this.touchStartHandler = null;
    this.touchMoveHandler = null;
  }

  // --- Хелперы для работы со статами ---
  getStat(statPath) {
    const parts = statPath.split(".");
    let current = state;
    for (const part of parts) {
      if (current[part] === undefined) return 0;
      current = current[part];
    }
    return current;
  }

  getStatDisplayName(rawKey) {
    // Вычищаем всё лишнее: точки, "stat(", "stats(", ")" и случайные пробелы
    let cleanKey = rawKey
      .split(".")
      .pop()
      .replace(/stats?\(/gi, "") // Убиваем stat( или stats( (даже если с большой буквы)
      .replace(/\)/g, "") // Убиваем закрывающую скобку
      .trim() // Убиваем твои случайные пробелы по краям
      .toLowerCase();

    // Спасаем тебя от опечаток
    if (cleanKey === "domincance") cleanKey = "dominance";

    const names = {
      dominance: "Доминирование",
      physique: "Сила",
      sanity: "Рассудок",
      rank_score: "Ранг",
    };

    return names[cleanKey] || cleanKey; // Теперь вернет "Доминирование" 100%
  }

  // --- Проверки и эффекты ---
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

  // ==========================================
  // --- УПРАВЛЕНИЕ КЛАВИАТУРОЙ ---
  // ==========================================

  setupKeyboardNavigation() {
    this.currentNavIndex = -1;

    // ВАЖНО: Удаляем старые слушатели перед тем, как повесить новые,
    // чтобы они не дублировались при каждом новом выборе!
    this.removeEventListeners();

    // Перехватываем фокус на контейнер
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

      // Проверяем, не кликнули ли мы случайно по самой кнопке или ее тексту
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

    // ВЕШАЕМ СЛУШАТЕЛИ
    document.addEventListener("keydown", this.keydownHandler, true);
    document.addEventListener("wheel", this.wheelHandler, {
      passive: false,
      capture: true,
    });
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

    // Синхронизация мыши и клавиатуры
    this.navButtons.forEach((btn, index) => {
      btn.addEventListener("mouseenter", () => {
        if (this.isInputLocked) return;
        this.currentNavIndex = index;
        updateHighlight();
      });
      btn.addEventListener("mouseleave", () => {
        this.currentNavIndex = -1;
        updateHighlight();
      });
    });
  }

  // НОВЫЙ МЕТОД: Только удаляет слушатели, не трогая массив
  removeEventListeners() {
    if (this.keydownHandler) {
      document.removeEventListener("keydown", this.keydownHandler, true);
      this.keydownHandler = null;
    }
    if (this.wheelHandler) {
      document.removeEventListener("wheel", this.wheelHandler, {
        capture: true,
      });
      this.wheelHandler = null;
    }
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

  // СТАРЫЙ МЕТОД: Удаляет слушатели И очищает массив (вызывается перед рендером и после клика)
  cleanupNavigation() {
    this.removeEventListeners();
    this.navButtons = [];
  }

  // ==========================================
  // --- Отрисовка ВЫБОРОВ ---
  // ==========================================

  showChoices(choices, onSelectCallback, audioManager) {
    if (!this.choiceContainer) return;

    this.isActive = true;
    this.isInputLocked = true;
    setTimeout(() => {
      this.isInputLocked = false;
    }, 300);

    this.choiceContainer.innerHTML = "";
    this.choiceContainer.style.display = "flex";

    // Очищаем и слушатели, и массив ПЕРЕД заполнением
    this.cleanupNavigation();

    choices.forEach((choice) => {
      const wrapper = document.createElement("div");
      wrapper.className = "choice-wrapper";

      // 1. Создаем и добавляем кнопку во враппер
      const btn = document.createElement("button");
      btn.className = "choice-btn";
      btn.textContent = choice.text;
      wrapper.appendChild(btn);

      // 2. Создаем и добавляем плашку (ПОСЛЕ кнопки)
      let isMet = true;
      if (choice.req) {
        isMet = this.checkRequirements(choice.req);

        const info = document.createElement("div");
        info.className = `choice-info ${isMet ? "met" : "unmet"}`;

        const reqKey = Object.keys(choice.req)[0];
        const reqVal = choice.req[reqKey];
        const displayName = this.getStatDisplayName(reqKey);
        const requiredValue = typeof reqVal === "object" ? reqVal.min : reqVal;

        let conditionText = reqKey.startsWith("flag_")
          ? `Условие: ${reqKey.replace("flag_", "")}`
          : `Требуется: ${displayName} (${requiredValue})`;
        info.innerHTML = ` ${conditionText}   ${isMet ? "✅" : "❌"} `;

        wrapper.appendChild(info); // Плашка добавляется
      }

      // 3. Вешаем обработчик клика
      btn.onclick = (e) => {
        if (e) e.stopPropagation();

        if (!isMet) {
          if (audioManager) audioManager.playSFX("access_denied");
          btn.classList.add("invalid-click");
          setTimeout(() => btn.classList.remove("invalid-click"), 400);
          return;
        }

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

      // 4. ВАЖНО: Выносим это ЗА ПРЕДЕЛЫ onclick!
      // Добавляем готовый враппер (с кнопкой и плашкой) на экран
      this.choiceContainer.appendChild(wrapper);
      // И добавляем кнопку в массив для навигации
      this.navButtons.push(btn);
    });

    // Запускаем управление
    this.setupKeyboardNavigation();
  }

  // --- Отрисовка ИНТЕРАКЦИЙ ---

  renderInteractions(scene, onSelectCallback, audioManager) {
    const layer = document.getElementById("interaction-layer");
    if (!layer) return;

    this.isActive = true;
    this.cleanupNavigation();

    layer.innerHTML = "";
    layer.style.display = "block";

    if (!scene.interactables || scene.interactables.length === 0) return;

    scene.interactables.forEach((obj) => {
      if (obj.req && !this.checkRequirements(obj.req)) return;

      const el = document.createElement("div");
      el.className = `interact-point type-${obj.type || "default"}`;

      if (obj.pos) {
        el.style.top = obj.pos.y + "%";
        el.style.left = obj.pos.x + "%";
      } else {
        el.style.top = obj.y + "%";
        el.style.left = obj.x + "%";
      }

      let innerHTML = "";

      if (obj.icon) {
        innerHTML += `<div class="icon">${obj.icon}</div>`;
      } else if (!obj.label) {
        innerHTML += `<div class="dot-indicator"></div>`;
      }
      if (obj.label) {
        innerHTML += `<div class="label">${obj.label}</div>`;
      }

      el.innerHTML = innerHTML;

      el.onclick = (e) => {
        if (e) e.stopPropagation();
        if (audioManager) audioManager.playSFX("click_world");
        if (window.sm && window.sm.uiHidden) return;

        this.isActive = false;

        // Очищаем навигацию при клике
        this.cleanupNavigation();

        layer.innerHTML = "";
        layer.style.display = "none";

        this.applyEffects(obj.effects);
        if (typeof obj.action === "function") obj.action();

        const nextSceneId =
          typeof obj.next === "function" ? obj.next() : obj.next;
        if (nextSceneId) onSelectCallback(nextSceneId);
      };

      layer.appendChild(el);
    });
  }
}

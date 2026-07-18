import { state } from "../core/state.js";
import { characters } from "../data/characters.js";

export class PDASystem {
  constructor() {
    this.container = null;
    this.isVisible = false;
    this.isAnimating = false; // Защита от спама кнопкой
    this.mainMenuScrollTop = 0;
    this.currentPeopleRole = null;
  }

  _getLanguage() {
    return window.settingsManager?.settings?.language || "ru";
  }

  _t(key) {
    const lang = this._getLanguage();
    const dictionaries = window.settingsManager?.uiTranslations;
    const translationKey = key.startsWith("pda_") ? key : `pda_${key}`;

    return (
      dictionaries?.[lang]?.[translationKey] ??
      dictionaries?.ru?.[translationKey] ??
      translationKey
    );
  }

  init() {
    // 1. ЗАЩИТНЫЙ ЩИТ: Создаем бэкдроп за телефоном (блокирует клики сквозь КПК)
    if (!document.getElementById("pda-backdrop")) {
      const backdrop = document.createElement("div");
      backdrop.id = "pda-backdrop";

      // Клик по фону мимо телефона закрывает КПК без пролистывания новеллы
      backdrop.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.toggle();
      });

      document.body.appendChild(backdrop);
    }

    // 2. Создаем главный корпус телефона
    this.container = document.createElement("div");
    this.container.id = "pda-container";

    // 3. Чёлка камеры
    const notch = document.createElement("div");
    notch.id = "pda-notch";
    this.container.appendChild(notch);

    // 4. Внутренний экран
    const screen = document.createElement("div");
    screen.id = "pda-screen";
    this.container.appendChild(screen);

    // 5. Черный экран-заглушка (выключенная матрица)
    const screenOffOverlay = document.createElement("div");
    screenOffOverlay.id = "pda-screen-off";
    screen.appendChild(screenOffOverlay);

    // 6. ВЕРХНЯЯ ПАНЕЛЬ (Батарея и время)
    const header = document.createElement("div");
    header.id = "pda-header";
    header.innerHTML = `
      <div id="pda-battery">
        <span class="battery-icon"></span>
        <span id="pda-battery-text">--%</span>
      </div>
      <div id="pda-time">00:00</div>
    `;
    screen.appendChild(header);

    // Запускаем часы
    const updateTime = () => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      const timeEl = document.getElementById("pda-time");
      if (timeEl) timeEl.textContent = timeStr;
    };
    updateTime();
    setInterval(updateTime, 1000);

    // Читаем реальную батарею
    const batteryText = header.querySelector("#pda-battery-text");
    if ("getBattery" in navigator) {
      navigator
        .getBattery()
        .then((battery) => {
          const updateBattery = () => {
            batteryText.textContent = Math.round(battery.level * 100) + "%";
          };
          updateBattery();
          battery.addEventListener("levelchange", updateBattery);
        })
        .catch(() => {
          batteryText.textContent = "50%";
        });
    } else {
      batteryText.textContent = "50%";
    }

    // 7. РЯД СТАТОВ
    const statsRow = document.createElement("div");
    statsRow.id = "pda-stats-grid";

    const renderSegments = () => {
      let html = "";
      for (let i = 0; i < 5; i++) {
        html += `<div class="stat-segment"></div>`;
      }
      return html;
    };

    statsRow.innerHTML = `
      <div class="stat-card">
        <div class="stat-info">
          <span class="stat-label" data-pda-i18n="sanity">Психика</span>
          <span class="stat-val" id="pda-stat-sanity">100</span>
        </div>
        <div class="stat-visual">
          <div class="stat-bar">${renderSegments()}</div>
          <div class="stat-icon placeholder-webp"></div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-info">
          <span class="stat-label" data-pda-i18n="dominance">Доминация</span>
          <span class="stat-val" id="pda-stat-dominance">0</span>
        </div>
        <div class="stat-visual">
          <div class="stat-bar">${renderSegments()}</div>
          <div class="stat-icon placeholder-webp"></div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-info">
          <span class="stat-label" data-pda-i18n="strength">Сила</span>
          <span class="stat-val" id="pda-stat-physique">10</span>
        </div>
        <div class="stat-visual">
          <div class="stat-bar">${renderSegments()}</div>
          <div class="stat-icon placeholder-webp"></div>
        </div>
      </div>

      <div class="stat-card money-card">
        <div class="stat-info">
          <span class="stat-label" data-pda-i18n="sp_balance">СП-Счёт</span>
        </div>
        <div class="stat-visual sp-visual">
          <span class="stat-val sp-val" id="pda-stat-money">0</span>
          <div class="stat-icon placeholder-webp"></div>
        </div>
      </div>
    `;
    screen.appendChild(statsRow);

    // 8. Карточка профиля
    const profileCard = document.createElement("div");
    profileCard.id = "pda-profile-card";
    screen.appendChild(profileCard);

    this._renderProfileCard();

    // 9. Грид кнопок
    const appGrid = document.createElement("div");
    appGrid.id = "pda-app-grid";
    appGrid.innerHTML = `
      <button id="pda-btn-people" data-pda-i18n="people">Люди</button>
      <button id="pda-btn-rules" data-pda-i18n="rules">Правила</button>
      <button id="pda-btn-quests" data-pda-i18n="quests">Задания</button>
      <button id="pda-btn-map" data-pda-i18n="map">Карта</button>
    `;
    screen.appendChild(appGrid);

    // 10. ЭКРАН ПРИЛОЖЕНИЯ (Заглушка)
    const blockedScreen = document.createElement("div");
    blockedScreen.id = "pda-blocked-screen";
    blockedScreen.innerHTML = `
      <div class="blocked-text" data-pda-i18n-html="access_blocked">Доступ заблокирован.<br>Идёт синхронизация биометрии</div>
      <button id="pda-btn-back" data-pda-i18n="back">Назад</button>
    `;
    screen.appendChild(blockedScreen);

    // 11. ЭКРАН "ЛЮДИ" (Категории)
    const peopleScreen = document.createElement("div");
    peopleScreen.id = "pda-people-screen";
    peopleScreen.innerHTML = `
      <div class="people-header" data-pda-i18n="people_database">База учеников и учителей</div>
      <div class="people-categories">
        <button id="pda-btn-teachers" class="pda-sys-btn category-btn" data-pda-i18n="teachers">УЧИТЕЛЯ</button>
        <button id="pda-btn-students" class="pda-sys-btn category-btn" data-pda-i18n="students">УЧЕНИКИ</button>
      </div>
      <div class="people-bottom-bar">
        <button id="pda-btn-people-back" class="pda-sys-btn back-btn" data-pda-i18n="back">НАЗАД</button>
      </div>
    `;
    screen.appendChild(peopleScreen);

    // 12. ЭКРАН СПИСКА ЛЮДЕЙ (Контейнер с прокруткой)
    const peopleListScreen = document.createElement("div");
    peopleListScreen.id = "pda-people-list-screen";
    peopleListScreen.innerHTML = `
      <div class="people-header" id="pda-people-list-title" data-pda-i18n="list">СПИСОК</div>
      <div class="people-list-container" id="pda-people-list-container"></div>
      <div class="people-bottom-bar">
        <button id="pda-btn-people-list-back" class="pda-sys-btn back-btn" data-pda-i18n="back">НАЗАД</button>
      </div>
    `;
    screen.appendChild(peopleListScreen);

    // 13. ЭКРАН ПРАВИЛ (Вертикальный слайдер)
    const rulesScreen = document.createElement("div");
    rulesScreen.id = "pda-rules-screen";
    rulesScreen.innerHTML = `
      <div class="rules-viewport">
        <div class="rules-slider" id="rules-slider">
          <div class="rule-slide">
            <div class="rule-number" data-pda-i18n="rule_1_title">Правило №1</div>
            <div class="rule-text" data-pda-i18n="rule_1">Синсю-очки (СП) являются единственным законным платёжным средством на территории Академии. Обмен СП среди учеников разрешён. СП могут находиться только в электронном виде.</div>
          </div>
          <div class="rule-slide">
            <div class="rule-number" data-pda-i18n="rule_2_title">Правило №2</div>
            <div class="rule-text" data-pda-i18n="rule_2">Ранговая система отражает статус и полезность ученика для школы. Ученики младших рангов обязаны беспрекословно уступать дорогу, места в столовой и в зонах отдыха ученикам высших рангов.</div>
          </div>
          <div class="rule-slide">
            <div class="rule-number" data-pda-i18n="rule_3_title">Правило №3</div>
            <div class="rule-text" data-pda-i18n="rule_3">Выход из общежития после 22:00 разрешён только по уважительной причине. Каждый ученик обязан спать только в своей выделенной комнате, за исключением приказов и специфических ситуаций.</div>
          </div>
          <div class="rule-slide">
            <div class="rule-number" data-pda-i18n="rule_4_title">Правило №4</div>
            <div class="rule-text" data-pda-i18n="rule_4">Карта ученика (телефон) является вашим фактическим паспортом на территории школы. Карта всегда обязана быть при вас. Поломка карты, целенаправленная или случайная, требует срочного восстановления за ваш счёт (1000 СП).</div>
          </div>
          <div class="rule-slide">
            <div class="rule-number" data-pda-i18n="rule_5_title">Правило №5</div>
            <div class="rule-text" data-pda-i18n="rule_5">Физическое насилие на территории школы строго запрещено без официально зарегистрированного поединка. Зарегистрировать поединок можно у учителя или Элиты. Любое несанкционированное нападение, зафиксированное камерой или доказанное иным способом, ведёт к немедленному наказанию зачинщика.</div>
          </div>
          <div class="rule-slide">
            <div class="rule-number" data-pda-i18n="rule_6_title">Правило №6</div>
            <div class="rule-text" data-pda-i18n="rule_6">За каждое нарушение индивидуальное наказание назначается администрацией, учителями или учениками высоких рангов.</div>
          </div>
        </div>
      </div>
      <div class="rules-bottom-bar">
        <button id="pda-btn-rules-back" class="pda-sys-btn back-btn" data-pda-i18n="back">НАЗАД</button>
        <div class="rules-controls">
          <button id="pda-btn-rule-up" class="pda-sys-btn arrow-btn">▲</button>
          <button id="pda-btn-rule-down" class="pda-sys-btn arrow-btn">▼</button>
        </div>
      </div>
    `;
    screen.appendChild(rulesScreen);

    // 14. Полоска смахивания (Home Indicator)
    const homeIndicator = document.createElement("div");
    homeIndicator.id = "pda-home-indicator";
    screen.appendChild(homeIndicator);

    // === СЕНСОРНЫЙ СКРОЛЛ ДЛЯ СПИСКА ПЕРСОНАЖЕЙ (Имитация пальца) ===
    const listContainer = peopleListScreen.querySelector(
      "#pda-people-list-container",
    );
    let isContainerDown = false;
    let listStartY;
    let listScrollTop;

    listContainer.addEventListener("mousedown", (e) => {
      isContainerDown = true;
      listStartY = e.pageY - listContainer.offsetTop;
      listScrollTop = listContainer.scrollTop;
      listContainer.style.cursor = "grabbing";
    });

    listContainer.addEventListener("mouseleave", () => {
      isContainerDown = false;
      listContainer.style.cursor = "default";
    });
    listContainer.addEventListener("mouseup", () => {
      isContainerDown = false;
      listContainer.style.cursor = "default";
    });

    listContainer.addEventListener("mousemove", (e) => {
      if (!isContainerDown) return;
      e.preventDefault();
      const y = e.pageY - listContainer.offsetTop;
      const walk = (y - listStartY) * 1.5;
      listContainer.scrollTop = listScrollTop - walk;
    });

    // === ЛОГИКА СЛАЙДЕРА ПРАВИЛ ===
    let currentRuleSlide = 0;
    const totalRuleSlides = 6;
    const rulesSlider = rulesScreen.querySelector("#rules-slider");
    const btnRuleUp = rulesScreen.querySelector("#pda-btn-rule-up");
    const btnRuleDown = rulesScreen.querySelector("#pda-btn-rule-down");

    const updateRulesSlider = () => {
      rulesSlider.style.transform = `translateY(-${currentRuleSlide * 100}%)`;
      btnRuleUp.style.opacity = currentRuleSlide === 0 ? "0.3" : "1";
      btnRuleDown.style.opacity =
        currentRuleSlide === totalRuleSlides - 1 ? "0.3" : "1";
    };
    updateRulesSlider();

    const slideRuleUp = () => {
      if (currentRuleSlide > 0) {
        currentRuleSlide--;
        updateRulesSlider();
      }
    };
    const slideRuleDown = () => {
      if (currentRuleSlide < totalRuleSlides - 1) {
        currentRuleSlide++;
        updateRulesSlider();
      }
    };

    rulesScreen.addEventListener("wheel", (e) => {
      e.preventDefault();
      if (e.deltaY > 0) slideRuleDown();
      else slideRuleUp();
    });

    let touchStartY = 0;
    let isSwiping = false;

    rulesScreen.addEventListener("mousedown", (e) => {
      isSwiping = true;
      touchStartY = e.clientY;
    });
    rulesScreen.addEventListener("mouseleave", () => {
      isSwiping = false;
    });
    rulesScreen.addEventListener("mouseup", (e) => {
      if (!isSwiping) return;
      isSwiping = false;
      const swipeDistance = e.clientY - touchStartY;
      if (swipeDistance < -40) slideRuleDown();
      else if (swipeDistance > 40) slideRuleUp();
    });

    // Скролл стрелочками на клавиатуре
    document.addEventListener("keydown", (e) => {
      if (!rulesScreen.classList.contains("active")) return;
      if (e.key === "ArrowUp") slideRuleUp();
      if (e.key === "ArrowDown") slideRuleDown();
    });

    // === ХОЗЯИН: НАСТОЯЩИЙ ТАЧ-СКРОЛЛ ДЛЯ МОБИЛЬНЫХ ПРАВИЛ ===
    let rulesTouchStartY = 0;
    rulesScreen.addEventListener(
      "touchstart",
      (e) => {
        rulesTouchStartY = e.touches[0].clientY;
      },
      { passive: true },
    );

    rulesScreen.addEventListener(
      "touchend",
      (e) => {
        if (!rulesScreen.classList.contains("active")) return;

        const touchEndY = e.changedTouches[0].clientY;
        const swipeDistance = touchEndY - rulesTouchStartY;

        // Палец идет вверх ( swipeDistance < -40 ) -> листаем правила вниз
        if (swipeDistance < -40) {
          slideRuleDown();
        }
        // Палец идет вниз ( swipeDistance > 40 ) -> листаем правила вверх
        else if (swipeDistance > 40) {
          slideRuleUp();
        }
      },
      { passive: true },
    );

    // === ОБРАБОТЧИКИ НАЖАТИЙ КНОПОК ===
    screen.addEventListener("click", (e) => {
      const btn = e.target.closest("button");
      if (!btn) return;

      console.log("📱 Клик зафиксирован по кнопке с ID:", btn.id);
      const pdaScreenEl = document.getElementById("pda-screen");

      // 🔥 ХОЗЯИН: ИСПРАВЛЕНИЕ СИСТЕМЫ УМНОГО КАСКАДНОГО СКРОЛЛА
      const isBackBtn = btn.id.includes("back");

      // Считаем, сколько окон открыто прямо сейчас
      const activeAppsCount = screen.querySelectorAll(".active").length;

      if (isBackBtn) {
        // Мы возвращаемся в САМО ГЛАВНОЕ МЕНЮ (закрывается последнее окно)
        if (activeAppsCount <= 1) {
          setTimeout(() => {
            if (pdaScreenEl) pdaScreenEl.scrollTop = this.mainMenuScrollTop;
          }, 10);
        } else {
          // Мы выходим из глубокого подраздела (например, из Учеников назад в Люди)
          // Оставляем скролл на отметке 0, чтобы экран людей не уплывал вверх!
          if (pdaScreenEl) pdaScreenEl.scrollTop = 0;
        }
      } else {
        // МЫ ИДЕМ ВПЕРЕД (Открываем приложение)
        // Запоминаем позицию только если уходим со СВЕРНУТОЙ главной страницы
        if (activeAppsCount === 0 && pdaScreenEl) {
          this.mainMenuScrollTop = pdaScreenEl.scrollTop;
        }
        if (pdaScreenEl) pdaScreenEl.scrollTop = 0;
      }

      // ... дальше идёт ваш стандартный блок условий (btn.id === "pda-btn-quests" и т.д.)

      // Переключение окон (Ваш старый код условий ниже, его не трогаем!)
      if (btn.id === "pda-btn-quests" || btn.id === "pda-btn-map")
        blockedScreen.classList.add("active");
      if (btn.id === "pda-btn-back") blockedScreen.classList.remove("active");
      if (btn.id === "pda-btn-rules") rulesScreen.classList.add("active");
      if (btn.id === "pda-btn-rules-back") {
        rulesScreen.classList.remove("active");
        currentRuleSlide = 0;
        updateRulesSlider();
      }
      if (btn.id === "pda-btn-rule-up") slideRuleUp();
      if (btn.id === "pda-btn-rule-down") slideRuleDown();
      if (btn.id === "pda-btn-people") peopleScreen.classList.add("active");
      if (btn.id === "pda-btn-people-back")
        peopleScreen.classList.remove("active");
      if (btn.id === "pda-btn-teachers") {
        this._renderPeopleList("teacher");
        peopleListScreen.classList.add("active");
      }
      if (btn.id === "pda-btn-students") {
        this._renderPeopleList("student");
        peopleListScreen.classList.add("active");
      }
      if (btn.id === "pda-btn-people-list-back")
        peopleListScreen.classList.remove("active");
    });

    // Внедряем собранный телефон в корневой UI игры
    const gameUi = document.getElementById("game-ui");
    if (gameUi) {
      gameUi.appendChild(this.container);

      // 🔥 ХОЗЯИН: ЖЕЛЕЗНЫЙ ЩИТ ОТ КЛИКОВ
      // Запрещаем кликам внутри телефона всплывать в игру, чтобы SceneManager не сбрасывал стили интерфейса!
      this.container.addEventListener("click", (e) => {
        e.stopPropagation();
      });

      // Создаем плашку-переключатель, висящую на голове корпуса
      if (!document.getElementById("pda-text-trigger")) {
        const pdaTextHint = document.createElement("div");
        pdaTextHint.id = "pda-text-trigger";
        this._setTriggerText(pdaTextHint);

        pdaTextHint.addEventListener("click", (e) => {
          e.stopPropagation();
          this.toggle();
        });

        this.container.appendChild(pdaTextHint);

        const bridge = document.createElement("div");
        bridge.id = "pda-cursor-bridge";
        bridge.style.cssText = `
          position: fixed;
          z-index: 10000;
          background: rgba(0, 0, 0, 0.005) !important; /* ← ЖЕСТКИЙ ФИКС: Создаем микро-слой для обмана Chromium */
          cursor: url("/ui/cursor.png?v=2") 0 0, pointer !important;
          display: block;
        `;

        // Функция идеального копирования координат оригинальной плашки
        const syncBridge = () => {
          if (this.isVisible) {
            bridge.style.display = "none";
            return;
          }
          bridge.style.display = "block";
          const rect = pdaTextHint.getBoundingClientRect();
          if (rect.width > 0) {
            bridge.style.left = rect.left + "px";
            bridge.style.top = rect.top + "px";
            bridge.style.width = rect.width + "px";
            bridge.style.height = rect.height + "px";
          }
        };

        // Следим за изменением окна и ховером для обновления позиции
        window.addEventListener("resize", syncBridge);
        pdaTextHint.addEventListener("mouseenter", syncBridge);

        // Передаем ховер оригинальной плашке для красивой CSS подсветки
        bridge.addEventListener("mouseenter", () =>
          pdaTextHint.classList.add("fake-hover"),
        );
        bridge.addEventListener("mouseleave", () =>
          pdaTextHint.classList.remove("fake-hover"),
        );

        // Клик по мосту открывает телефон
        bridge.addEventListener("click", (e) => {
          e.stopPropagation();
          this.toggle();
        });

        gameUi.appendChild(bridge);
        setTimeout(syncBridge, 100); // Мягкий старт после рендеринга DOM
      }

      if (!document.getElementById("pda-unlock-arrow")) {
        const unlockArrow = document.createElement("div");

        unlockArrow.id = "pda-unlock-arrow";
        unlockArrow.setAttribute("aria-hidden", "true");
        unlockArrow.textContent = "↓";

        this.container.appendChild(unlockArrow);
      }

      // Метод контроля сюжетной видимости uiState.pdaUnlocked
      this.updateVisibility = () => {
        const gameViewport = document.getElementById("game-viewport");
        const isGameActive =
          gameViewport && gameViewport.style.display !== "none";
        const isPdaAllowed = !!(state.uiState && state.uiState.pdaUnlocked);

        if (isGameActive && isPdaAllowed) {
          this.container.style.display = "block";
        } else {
          this.container.style.display = "none";
          if (this.isVisible) {
            this.isVisible = false;
            this.container.classList.remove("pda-active");
            const pdaHint = document.getElementById("pda-text-trigger");
            if (pdaHint) this._setTriggerText(pdaHint);
            const backdrop = document.getElementById("pda-backdrop");
            if (backdrop) backdrop.classList.remove("active");
            const screenOff = document.getElementById("pda-screen-off");
            if (screenOff) screenOff.classList.remove("screen-on");
          }
        }
      };

      const gameViewport = document.getElementById("game-viewport");
      if (gameViewport) {
        const observer = new MutationObserver(() => this.updateVisibility());
        observer.observe(gameViewport, {
          attributes: true,
          attributeFilter: ["style"],
        });
      }
      this.updateVisibility();
    }

    this.applyTranslations();
  }

  _renderProfileCard() {
    const profileCard = document.getElementById("pda-profile-card");
    const ren = characters.ren;

    if (!profileCard || !ren) return;

    const fullName =
      this._getLocalizedValue(ren.fullName) ||
      this._getLocalizedValue(ren.name) ||
      this._t("unnamed");

    const rank = this._formatRank(ren.rank);
    const room = ren.room || "?";

    const photoClass = ren.photo
      ? "profile-photo has-webp"
      : "profile-photo placeholder-webp";

    const photoStyle = ren.photo
      ? `style="background-image: url('${ren.photo}')"`
      : "";

    profileCard.innerHTML = `
      <div class="${photoClass}" ${photoStyle}></div>

      <div class="profile-info">
        <div class="profile-name">${fullName}</div>

        <div class="profile-detail">
          <strong>${this._t("rank")}:</strong> ${rank}
        </div>

        <div class="profile-detail">
          <strong>${this._t("class")}:</strong> ${room}
        </div>

        <div class="profile-bio-sync">
          ${this._t("bio_sync")}
        </div>
      </div>
    `;
  }

  _setTriggerText(element) {
    if (!element) return;

    const isJapanese = this._getLanguage() === "ja";
    const [initial = "", ...rest] = Array.from(this._t("phone_trigger"));

    element.classList.toggle("pda-japanese-font", isJapanese);

    element.innerHTML = `
    <span class="initial">${initial}</span>
    <span class="rest">${rest.join("")}</span>
  `;

    requestAnimationFrame(() => this._syncTriggerBridge(element));
  }

  applyTranslations() {
    if (!this.container) return;

    this.container.querySelectorAll("[data-pda-i18n]").forEach((element) => {
      element.textContent = this._t(element.dataset.pdaI18n);
    });

    this.container
      .querySelectorAll("[data-pda-i18n-html]")
      .forEach((element) => {
        element.innerHTML = this._t(element.dataset.pdaI18nHtml);
      });

    this._renderProfileCard();

    if (!this.isVisible) {
      this._setTriggerText(document.getElementById("pda-text-trigger"));
    }

    if (this.currentPeopleRole) {
      this._renderPeopleList(this.currentPeopleRole);
    }
  }

  showUnlockHint() {
    const arrow = document.getElementById("pda-unlock-arrow");

    if (!arrow) return;

    const isMobileLayout = window.matchMedia("(max-width: 1024px)").matches;

    // ПК — вниз, телефон — вправо.
    arrow.textContent = isMobileLayout ? "←" : "↓";
    arrow.classList.toggle("mobile", isMobileLayout);

    arrow.classList.remove("show");

    // Принудительно перезапускаем CSS-анимацию.
    void arrow.offsetWidth;

    arrow.classList.add("show");

    window.setTimeout(() => {
      arrow.classList.remove("show");
    }, 1100);
  }

  refreshFromState() {
    this.updateStats();
    this._renderProfileCard();

    if (this.currentPeopleRole) {
      this._renderPeopleList(this.currentPeopleRole);
    }
  }

  updateStats() {
    const heroStats = state?.hero?.stats;
    const hero = state?.hero;
    if (!heroStats || !hero) return;

    const sanityEl = document.getElementById("pda-stat-sanity");
    if (sanityEl) sanityEl.textContent = heroStats.sanity;

    const domEl = document.getElementById("pda-stat-dominance");
    if (domEl) domEl.textContent = heroStats.dominance;

    const physEl = document.getElementById("pda-stat-physique");
    if (physEl) physEl.textContent = heroStats.physique;

    const spEl = document.getElementById("pda-stat-money");
    if (spEl) {
      const currentSP = hero.sp || 0;
      const numberLocale = {
        ru: "ru-RU",
        en: "en-US",
        ja: "ja-JP",
      }[this._getLanguage()];
      spEl.textContent = Number(currentSP).toLocaleString(
        numberLocale || "en-US",
      );
    }

    const statCards = document.querySelectorAll("#pda-stats-grid .stat-card");
    if (statCards.length >= 3) {
      this._updateSegments(statCards[0], heroStats.sanity);
      this._updateSegments(statCards[1], heroStats.dominance);
      this._updateSegments(statCards[2], heroStats.physique);
    }
  }

  _renderPeopleList(role) {
    const container = document.getElementById("pda-people-list-container");
    const title = document.getElementById("pda-people-list-title");
    if (!container || !title) return;

    this.currentPeopleRole = role;
    title.textContent = this._t(role === "student" ? "students" : "teachers");
    container.innerHTML = "";

    for (const key in characters) {
      const char = characters[key];
      if (char.role === role) {
        const isUnlocked = state?.flags?.[char.requiresFlag];
        if (isUnlocked) {
          const details = this._renderCharacterDetails(char, role, false);
          container.innerHTML += `
            <div class="pda-char-card">
              <div class="char-photo has-photo" style="background-image: url('${char.photo || ""}')"></div>
              <div class="char-info">
                <div class="char-name">${this._getCharacterName(char)}</div>
                ${details}
              </div>
            </div>
          `;
        } else {
          const details = this._renderCharacterDetails(char, role, true);
          container.innerHTML += `
            <div class="pda-char-card locked">
              <div class="char-photo"></div>
              <div class="char-info">
                <div class="char-name">${this._getLocalizedValue(char.unknownName) || "???"}</div>
                ${details}
                <div class="char-bio-sync">${this._t("biometrics_required")}</div>
              </div>
            </div>
          `;
        }
      }
    }
  }

  _getLocalizedValue(value) {
    if (typeof value === "string") return value;
    if (!value || typeof value !== "object") return "";

    const lang = this._getLanguage();
    return value[lang] || value.ru || Object.values(value)[0] || "";
  }

  _getCharacterName(char) {
    return (
      this._getLocalizedValue(char?.fullName) ||
      this._getLocalizedValue(char?.name) ||
      this._t("unnamed")
    );
  }

  _getTeacherSubject(char) {
    return this._getLocalizedValue(char?.subject) || "?";
  }

  _renderCharacterDetails(char, role, isLocked) {
    const hidden = this._t("data_hidden");

    if (role === "teacher") {
      const subject = isLocked ? hidden : this._getTeacherSubject(char);
      const room = isLocked ? hidden : char.room || "?";

      return `
    <div class="char-detail">
      <strong>${this._t("subject")}:</strong> ${subject}
    </div>

    <div class="char-detail">
      <strong>${this._t("class")}:</strong> ${room}
    </div>
  `;
    }

    const rank = isLocked ? hidden : this._formatRank(char.rank);
    const room = isLocked ? hidden : char.room || "?";
    return `
      <div class="char-detail"><strong>${this._t("rank")}:</strong> ${rank}</div>
      <div class="char-detail"><strong>${this._t("class")}:</strong> ${room}</div>
    `;
  }

  _formatRank(rank) {
    if (!rank) return "?";
    const lang = this._getLanguage();
    if (lang === "ja") return `${rank}ランク`;
    if (lang === "ru") return `${rank}-Ранг`;
    return `${rank}-Rank`;
  }

  _updateSegments(cardEl, value) {
    if (!cardEl) return;
    const segments = cardEl.querySelectorAll(".stat-segment");
    const isNegative = value < 0;
    const absValue = Math.min(Math.abs(value || 0), 100);
    const themeColor = isNegative ? "#ff4d4f" : "#00ffff";

    segments.forEach((seg, index) => {
      const segmentMin = index * 20;
      const segmentMax = (index + 1) * 20;
      let fillPercentage = 0;
      if (absValue >= segmentMax) {
        fillPercentage = 100;
      } else if (absValue > segmentMin) {
        fillPercentage = ((absValue - segmentMin) / 20) * 100;
      }
      seg.style.setProperty("--fill", `${fillPercentage}%`);
      seg.style.setProperty("--theme-color", themeColor);
    });
  }

  async toggle() {
    if (this.isAnimating) return;
    if (!state.uiState || !state.uiState.pdaUnlocked) return; // Наша сюжетная защита

    const screenOff = document.getElementById("pda-screen-off");
    const pdaHint = document.getElementById("pda-text-trigger");
    const backdrop = document.getElementById("pda-backdrop");
    this.isAnimating = true;

    if (!this.isVisible) {
      this.isVisible = true;
      this.refreshFromState();

      // 🔥 ХОЗЯИН: Мгновенно убираем мост, давая полную свободу крестику и его анимациям
      const bridge = document.getElementById("pda-cursor-bridge");
      if (bridge) bridge.style.display = "none";

      // ХОЗЯИН: display = "block" удалён, контейнером рулит updateVisibility()
      if (backdrop) backdrop.classList.add("active");
      screenOff.classList.remove("screen-on");

      await new Promise((r) => setTimeout(r, 10));
      this.container.classList.add("pda-active");
      if (pdaHint) pdaHint.innerHTML = `<span class="initial">X</span>`;

      await new Promise((r) => setTimeout(r, 200));

      this.container.classList.add("power-pressed");
      await new Promise((r) => setTimeout(r, 80));
      this.container.classList.remove("power-pressed");

      screenOff.classList.add("screen-on");
      if (window.playUISound) window.playUISound("open");
    } else {
      this.isVisible = false;
      if (backdrop) backdrop.classList.remove("active");

      this.container.classList.add("power-pressed");
      await new Promise((r) => setTimeout(r, 80));
      this.container.classList.remove("power-pressed");

      screenOff.classList.remove("screen-on");
      await new Promise((r) => setTimeout(r, 100));

      // Телефон уезжает за экран за счёт CSS-транслейта, но остаётся display: block!
      this.container.classList.remove("pda-active");

      // ХОЗЯИН: Стираем задержку и display = "none" отсюда к чертям!
      this._setTriggerText(pdaHint);

      // 🔥 ХОЗЯИН: Возвращаем мост на место после того, как телефон уехал вниз
      const bridge = document.getElementById("pda-cursor-bridge");
      if (bridge) {
        setTimeout(() => {
          bridge.style.display = "block";
          const rect = pdaHint.getBoundingClientRect();
          if (rect.width > 0) {
            bridge.style.left = rect.left + "px";
            bridge.style.top = rect.top + "px";
            bridge.style.width = rect.width + "px";
            bridge.style.height = rect.height + "px";
          }
        }, 350); // Небольшое ожидание завершения скольжения корпуса
      }

      if (window.playUISound) window.playUISound("close");
    }

    this.isAnimating = false;
  }
}

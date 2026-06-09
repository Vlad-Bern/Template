import { state } from "../core/state.js";
import { characters } from "../data/characters.js";

export class PDASystem {
  constructor() {
    this.container = null;
    this.isVisible = false;
    this.isAnimating = false; // Защита от спама кнопкой
  }

  init() {
    // 1. Создаем главный корпус телефона
    this.container = document.createElement("div");
    this.container.id = "pda-container";

    // 2. Чёлка камеры
    const notch = document.createElement("div");
    notch.id = "pda-notch";
    this.container.appendChild(notch);

    // 3. Внутренний экран
    const screen = document.createElement("div");
    screen.id = "pda-screen";
    this.container.appendChild(screen);

    // 4. Черный экран-заглушка (выключенная матрица)
    const screenOffOverlay = document.createElement("div");
    screenOffOverlay.id = "pda-screen-off";
    screen.appendChild(screenOffOverlay);

    // 5. ВЕРХНЯЯ ПАНЕЛЬ (Батарея и время)
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

    // 6. РЯД СТАТОВ
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
          <span class="stat-label">Психика</span>
          <span class="stat-val" id="pda-stat-sanity">100</span>
        </div>
        <div class="stat-visual">
          <div class="stat-bar">${renderSegments()}</div>
          <div class="stat-icon placeholder-webp"></div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-info">
          <span class="stat-label">Доминация</span>
          <span class="stat-val" id="pda-stat-dominance">0</span>
        </div>
        <div class="stat-visual">
          <div class="stat-bar">${renderSegments()}</div>
          <div class="stat-icon placeholder-webp"></div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-info">
          <span class="stat-label">Сила</span>
          <span class="stat-val" id="pda-stat-physique">10</span>
        </div>
        <div class="stat-visual">
          <div class="stat-bar">${renderSegments()}</div>
          <div class="stat-icon placeholder-webp"></div>
        </div>
      </div>

      <div class="stat-card money-card">
        <div class="stat-info">
          <span class="stat-label">СП-Счёт</span>
        </div>
        <div class="stat-visual sp-visual">
          <span class="stat-val sp-val" id="pda-stat-money">0</span>
          <div class="stat-icon placeholder-webp"></div>
        </div>
      </div>
    `;
    screen.appendChild(statsRow);

    // 7. Карточка профиля
    const profileCard = document.createElement("div");
    profileCard.id = "pda-profile-card";
    profileCard.innerHTML = `
      <div class="profile-photo placeholder-webp"></div>
      <div class="profile-info">
        <div class="profile-name">Рен Амано</div>
        <div class="profile-detail"><strong>Статус:</strong> D-Ранг</div>
        <div class="profile-detail"><strong>Класс:</strong> 2-B</div>
        <div class="profile-bio-sync">Идёт синхронизация биометрии...</div>
      </div>
    `;
    screen.appendChild(profileCard);

    // 8. Грид кнопок
    const appGrid = document.createElement("div");
    appGrid.id = "pda-app-grid";
    appGrid.innerHTML = `
      <button id="pda-btn-people">Люди</button>
      <button id="pda-btn-rules">Правила</button>
      <button id="pda-btn-quests">Задания</button>
      <button id="pda-btn-map">Карта</button>
    `;
    screen.appendChild(appGrid);

    // 9. ЭКРАН ПРИЛОЖЕНИЯ (Заглушка)
    const blockedScreen = document.createElement("div");
    blockedScreen.id = "pda-blocked-screen";
    blockedScreen.innerHTML = `
      <div class="blocked-text">Доступ заблокирован.<br>Идёт синхронизация биометрии</div>
      <button id="pda-btn-back">Назад</button>
    `;
    screen.appendChild(blockedScreen);

    // 10. ЭКРАН "ЛЮДИ" (Категории)
    const peopleScreen = document.createElement("div");
    peopleScreen.id = "pda-people-screen";
    peopleScreen.innerHTML = `
      <div class="people-header">База учеников и учителей</div>
      <div class="people-categories">
        <button id="pda-btn-teachers" class="pda-sys-btn category-btn">УЧИТЕЛЯ</button>
        <button id="pda-btn-students" class="pda-sys-btn category-btn">УЧЕНИКИ</button>
      </div>
      <div class="people-bottom-bar">
        <button id="pda-btn-people-back" class="pda-sys-btn back-btn">НАЗАД</button>
      </div>
    `;
    screen.appendChild(peopleScreen);

    // 10.6 ЭКРАН СПИСКА ЛЮДЕЙ (Контейнер с прокруткой)
    const peopleListScreen = document.createElement("div");
    peopleListScreen.id = "pda-people-list-screen";
    peopleListScreen.innerHTML = `
      <div class="people-header" id="pda-people-list-title">СПИСОК</div>
      <div class="people-list-container" id="pda-people-list-container"></div>
      <div class="people-bottom-bar">
        <button id="pda-btn-people-list-back" class="pda-sys-btn back-btn">НАЗАД</button>
      </div>
    `;
    screen.appendChild(peopleListScreen);

    // 11. ЭКРАН ПРАВИЛ (Вертикальный слайдер)
    const rulesScreen = document.createElement("div");
    rulesScreen.id = "pda-rules-screen";
    rulesScreen.innerHTML = `
      <div class="rules-viewport">
        <div class="rules-slider" id="rules-slider">
          <div class="rule-slide">
            <div class="rule-number">Правило №1</div>
            <div class="rule-text">Синсю-очки (СП) являются единственным законным платёжным средством на территории Академии. Обмен СП среди учеников разрешён. СП могут находиться только в электронном виде.</div>
          </div>
          <div class="rule-slide">
            <div class="rule-number">Правило №2</div>
            <div class="rule-text">Ранговая система отражает статус и полезность ученика для школы. Ученики младших рангов обязаны беспрекословно уступать дорогу, места в столовой и в зонах отдыха ученикам высших рангов.</div>
          </div>
          <div class="rule-slide">
            <div class="rule-number">Правило №3</div>
            <div class="rule-text">Выход из общежития после 22:00 разрешён только по уважительной причине. Каждый ученик обязан спать только в своей выделенной комнате, за исключением приказов и специфических ситуаций.</div>
          </div>
          <div class="rule-slide">
            <div class="rule-number">Правило №4</div>
            <div class="rule-text">Карта ученика (телефон) является вашим фактическим паспортом на территории школы. Карта всегда обязана быть при вас. Поломка карты, целенаправленная или случайная, требует срочного восстановления за ваш счёт (1000 СП).</div>
          </div>
          <div class="rule-slide">
            <div class="rule-number">Правило №5</div>
            <div class="rule-text">Физическое насилие на территории школы строго запрещено без официальной регистрации. Любое несанкционированное нападение, которое будет зарегистрировано, ведёт к немедленному наказанию зачинщика.</div>
          </div>
          <div class="rule-slide">
            <div class="rule-number">Правило №6</div>
            <div class="rule-text">За каждое нарушение выносится индивидуальное наказание администрацией, учителями или высокими рангами.</div>
          </div>
        </div>
      </div>
      <div class="rules-bottom-bar">
        <button id="pda-btn-rules-back" class="pda-sys-btn back-btn">НАЗАД</button>
        <div class="rules-controls">
          <button id="pda-btn-rule-up" class="pda-sys-btn arrow-btn">▲</button>
          <button id="pda-btn-rule-down" class="pda-sys-btn arrow-btn">▼</button>
        </div>
      </div>
    `;
    screen.appendChild(rulesScreen);

    // 12. Полоска смахивания (Home Indicator)
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

    // Безопасный скролл колёсиком для правил
    rulesScreen.addEventListener("wheel", (e) => {
      e.preventDefault();
      if (e.deltaY > 0) slideRuleDown();
      else slideRuleUp();
    });

    // Имитация свайпа пальцем (Drag мышкой)
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

      const touchEndY = e.clientY;
      const swipeDistance = touchEndY - touchStartY;

      if (swipeDistance < -40) slideRuleDown();
      else if (swipeDistance > 40) slideRuleUp();
    });

    // Скролл стрелочками на клавиатуре
    document.addEventListener("keydown", (e) => {
      if (!rulesScreen.classList.contains("active")) return;
      if (e.key === "ArrowUp") slideRuleUp();
      if (e.key === "ArrowDown") slideRuleDown();
    });

    // === ОБРАБОТЧИКИ НАЖАТИЙ КНОПОК ===
    screen.addEventListener("click", (e) => {
      const btn = e.target.closest("button");
      if (!btn) return;

      console.log("📱 Клик зафиксирован по кнопке с ID:", btn.id);

      // 1. Приложения-заглушки (Задания, Карта)
      if (btn.id === "pda-btn-quests" || btn.id === "pda-btn-map") {
        blockedScreen.classList.add("active");
      }

      // Закрытие экрана заглушки биометрии
      if (btn.id === "pda-btn-back") {
        blockedScreen.classList.remove("active");
      }

      // 2. Открытие Правил
      if (btn.id === "pda-btn-rules") {
        rulesScreen.classList.add("active");
      }
      // Закрытие Правил
      if (btn.id === "pda-btn-rules-back") {
        rulesScreen.classList.remove("active");
        currentRuleSlide = 0;
        updateRulesSlider();
      }
      // Стрелки на экране правил
      if (btn.id === "pda-btn-rule-up") slideRuleUp();
      if (btn.id === "pda-btn-rule-down") slideRuleDown();

      // 3. Открытие экрана "Люди"
      if (btn.id === "pda-btn-people") {
        peopleScreen.classList.add("active");
      }
      // Закрытие экрана "Люди"
      if (btn.id === "pda-btn-people-back") {
        peopleScreen.classList.remove("active");
      }

      // 4. Открытие списков персонажей (Учителя / Ученики)
      if (btn.id === "pda-btn-teachers") {
        this._renderPeopleList("teacher");
        peopleListScreen.classList.add("active"); // МАЙ: Управляем напрямую через переменную!
      }
      if (btn.id === "pda-btn-students") {
        this._renderPeopleList("student");
        peopleListScreen.classList.add("active"); // МАЙ: Управляем напрямую через переменную!
      }
      // Закрытие списка персонажей
      if (btn.id === "pda-btn-people-list-back") {
        peopleListScreen.classList.remove("active"); // МАЙ: Управляем напрямую через переменную!
      }
    });

    // Внедряем собранный телефон в корневой UI игры
    const gameUi = document.getElementById("game-ui");
    if (gameUi) {
      gameUi.appendChild(this.container);
    }
  }

  updateStats() {
    const heroStats = state?.hero?.stats;
    const hero = state?.hero;

    if (!heroStats || !hero) return;

    // Обновляем текстовые цифры
    const sanityEl = document.getElementById("pda-stat-sanity");
    if (sanityEl) sanityEl.textContent = heroStats.sanity;

    const domEl = document.getElementById("pda-stat-dominance");
    if (domEl) domEl.textContent = heroStats.dominance;

    const physEl = document.getElementById("pda-stat-physique");
    if (physEl) physEl.textContent = heroStats.physique;

    // SP берем из корня героя
    const spEl = document.getElementById("pda-stat-money");
    if (spEl) {
      const currentSP = hero.sp || 0;
      spEl.textContent = Number(currentSP).toLocaleString("en-US");
    }

    // Обновляем сегменты дробно
    const statCards = document.querySelectorAll("#pda-stats-grid .stat-card");
    if (statCards.length >= 3) {
      this._updateSegments(statCards[0], heroStats.sanity);
      this._updateSegments(statCards[1], heroStats.dominance);
      this._updateSegments(statCards[2], heroStats.physique);
    }
  }

  // Умный рендер списка персонажей
  _renderPeopleList(role) {
    const container = document.getElementById("pda-people-list-container");
    const title = document.getElementById("pda-people-list-title");
    if (!container || !title) return;

    title.textContent =
      role === "student" ? "УЧЕНИКИ" : "УЧИТЕЛЯ";
    container.innerHTML = "";

    for (const key in characters) {
      const char = characters[key];

      if (char.role === role) {
        // МАЙ: Защищенная проверка флага сюжета, чтобы скрипт никогда не падал в начале игры!
        const isUnlocked = state?.flags?.[char.requiresFlag];

        if (isUnlocked) {
          container.innerHTML += `
            <div class="pda-char-card">
              <div class="char-photo has-photo" style="background-image: url('${char.photo || ""}')"></div>
              <div class="char-info">
                <div class="char-name">${char.realName || "Имя не задано"}</div>
                <div class="char-detail"><strong>Статус:</strong> ${char.rank || "?"}-Ранг</div>
                <div class="char-detail"><strong>Класс:</strong> ${char.room || "?"}</div>
              </div>
            </div>
          `;
        } else {
          container.innerHTML += `
            <div class="pda-char-card locked">
              <div class="char-photo"></div>
              <div class="char-info">
                <div class="char-name">${char.unknownName || "???"}</div>
                <div class="char-detail"><strong>Статус:</strong> Данные скрыты</div>
                <div class="char-detail"><strong>Класс:</strong> Данные скрыты</div>
                <div class="char-bio-sync">Требуется биометрия...</div>
              </div>
            </div>
          `;
        }
      }
    }
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

    const screenOff = document.getElementById("pda-screen-off");
    this.isAnimating = true;

    if (!this.isVisible) {
      this.isVisible = true;
      this.updateStats();
      this.container.style.display = "block";
      screenOff.classList.remove("screen-on");

      await new Promise((r) => setTimeout(r, 10));
      this.container.classList.add("pda-active");

      await new Promise((r) => setTimeout(r, 200));

      this.container.classList.add("power-pressed");
      await new Promise((r) => setTimeout(r, 80));
      this.container.classList.remove("power-pressed");

      screenOff.classList.add("screen-on");
    } else {
      this.isVisible = false;

      this.container.classList.add("power-pressed");
      await new Promise((r) => setTimeout(r, 80));
      this.container.classList.remove("power-pressed");

      screenOff.classList.remove("screen-on");

      await new Promise((r) => setTimeout(r, 100));

      this.container.classList.remove("pda-active");

      await new Promise((r) => setTimeout(r, 250));
      this.container.style.display = "none";
    }

    this.isAnimating = false;
  }
}

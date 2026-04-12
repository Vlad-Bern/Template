export class SettingsManager {
  constructor() {
    this.modalOpen = false;
    this.containerId = "settings-panel";

    // БАЗОВЫЕ НАСТРОЙКИ (По умолчанию)
    this.defaultSettings = {
      fullscreen: "window",
      parallax: "on",
      bgmVolume: 50,
      sfxVolume: 100,
      textSpeed: 70,
      language: "en",
    };

    // Словарь для перевода интерфейса настроек (ТЕПЕРЬ ОН ТУТ, НАВЕРХУ!)
    this.uiTranslations = {
      ru: {
        settings_header: "[ НАСТРОЙКИ СИСТЕМЫ ]",
        lang_label: "Язык (Language)",
        bgm_volume: "Громкость музыки",
        btn_save: "[ СОХРАНИТЬ ]",
        btn_load: "[ ЗАГРУЗИТЬ ]",
        btn_history: "[ ИСТОРИЯ ]",
        btn_settings: "[ НАСТРОЙКИ ]",
        history_title: "История",
      },
      en: {
        settings_header: "[ SYSTEM SETTINGS ]",
        lang_label: "Language",
        bgm_volume: "Music Volume",
        btn_save: "[ SAVE ]",
        btn_load: "[ LOAD ]",
        btn_history: "[ LOG ]",
        btn_settings: "[ SETTINGS ]",
        history_title: "History Log",
      },
    };

    // Загружаем сохраненные или берем базовые
    this.settings = this.loadSettings();

    // Теперь, когда словарь готов, мы можем строить и переводить интерфейс!
    this._initUI();
    this._applySettingsOnLoad();
    this._updateUIFromSettings();
  }

  // --- РАБОТА С ПАМЯТЬЮ ---
  loadSettings() {
    const saved = localStorage.getItem("sota_settings");
    if (saved) {
      return { ...this.defaultSettings, ...JSON.parse(saved) };
    }
    return { ...this.defaultSettings };
  }

  saveCurrentSettings() {
    localStorage.setItem("sota_settings", JSON.stringify(this.settings));
  }

  resetToDefaults() {
    Object.assign(this.settings, this.defaultSettings);
    this.saveCurrentSettings();
    this._updateUIFromSettings();
    this._applySettingsOnLoad();
  }

  // Применяем настройки к самой игре (вызывается при старте и сбросе)
  _applySettingsOnLoad() {
    if (this.settings.parallax === "off") {
      document.body.classList.add("disable-parallax");
    } else {
      document.body.classList.remove("disable-parallax");
    }

    // Применяем полный экран (ТОЛЬКО ДЛЯ NW.JS)
    if (this.settings.fullscreen === "full" && typeof nw !== "undefined") {
      nw.Window.get().enterFullscreen();
    } else if (
      this.settings.fullscreen === "window" &&
      typeof nw !== "undefined"
    ) {
      nw.Window.get().leaveFullscreen();
    }
  }

  // Обновляем визуальное состояние кнопок в меню настроек
  _updateUIFromSettings() {
    const panel = document.getElementById(this.containerId);
    if (!panel) return;

    // Обновляем тумблеры полного экрана
    const fsBtns = panel.querySelectorAll("#fullscreen-toggle .toggle-btn");
    fsBtns.forEach((b) => b.classList.remove("active"));
    const activeFs = panel.querySelector(
      `#fullscreen-toggle .toggle-btn[data-val="${this.settings.fullscreen}"]`,
    );
    if (activeFs) activeFs.classList.add("active");

    // Обновляем тумблеры параллакса
    const pxBtns = panel.querySelectorAll("#parallax-toggle .toggle-btn");
    pxBtns.forEach((b) => b.classList.remove("active"));
    const activePx = panel.querySelector(
      `#parallax-toggle .toggle-btn[data-val="${this.settings.parallax}"]`,
    );
    if (activePx) activePx.classList.add("active");
  }

  // ... (дальше идет _initUI)

  _initUI() {
    const panel = document.createElement("div");
    panel.id = this.containerId;
    panel.className = "modal-panel";

    panel.innerHTML = `
      <div id="settings-inner">
        <button class="modal-close-btn" id="close-settings-btn" title="Закрыть">[ × ]</button>
        
        <div class="settings-layout">
          <!-- ЛЕВАЯ ЧАСТЬ: НАСТРОЙКИ (60%) -->
          <div class="settings-left">
            <div class="modal-header">[ НАСТРОЙКИ СИСТЕМЫ ]</div>
            <div class="settings-list">
              
              <!-- ГРУППА 1: ГРАФИКА -->
              <div class="settings-group">
                <div class="group-title">ЭКРАН И ГРАФИКА</div>
                
                <div class="settings-row" id="row-fullscreen">
                  <span class="settings-label">Режим экрана</span>
                  <div class="toggle-group" id="fullscreen-toggle">
                    <button class="toggle-btn active" data-val="window">Окно</button>
                    <button class="toggle-btn" data-val="full">Полный</button>
                  </div>
                </div>

                <div class="settings-row">
                  <span class="settings-label">Эффект параллакса</span>
                  <div class="toggle-group" id="parallax-toggle">
                    <button class="toggle-btn active" data-val="on">Вкл</button>
                    <button class="toggle-btn" data-val="off">Выкл</button>
                  </div>
                </div>
              </div>

              <div class="settings-row" id="row-language">
                  <span class="settings-label">Язык (Language)</span>
                  <div class="toggle-group" id="language-toggle">
                    <button class="toggle-btn ${this.settings.language === "ru" ? "active" : ""}" data-val="ru">Русский</button>
                    <button class="toggle-btn ${this.settings.language === "en" ? "active" : ""}" data-val="en">English</button>
                  </div>
              </div>
              
              <div class="settings-group">
                <div class="group-title">ЗВУК И ТЕКСТ</div>
                
                <div class="settings-row">
                  <span class="settings-label" data-i18n="bgm_volume">Громкость музыки</span>
                  <input type="range" id="bgm-slider" class="settings-slider" min="0" max="100" value="${this.settings.bgmVolume}">
                </div>
                
                <div class="settings-row">
                  <span class="settings-label">Громкость звуков</span>
                  <input type="range" id="sfx-slider" class="settings-slider" min="0" max="100" value="${this.settings.sfxVolume}">
                </div>

                <div class="settings-row">
                  <span class="settings-label">Скорость текста</span>
                  <input type="range" id="text-speed-slider" class="settings-slider" min="10" max="100" value="${this.settings.textSpeed}">
                </div>
              </div>

            </div>
            <button class="reset-btn">[ СБРОС ]</button>
          </div>

          <!-- ПРАВАЯ ЧАСТЬ: СПРАВОЧНИК -->
          <div class="settings-right">
            <div class="manual-header">СПРАВОЧНИК</div>
            <div class="manual-content">
              <div class="hotkey-row"><span class="key">[ ЛКМ / Пробел / -> / Колёсико вниз ]</span><span class="desc">Далее</span></div>
              <div class="hotkey-row"><span class="key">[ Ctrl ]</span><span class="desc">Промотка</span></div>
              <div class="hotkey-row"><span class="key">[ H / Колёсико вверх]</span><span class="desc">История</span></div>
              <div class="hotkey-row"><span class="key">[ S / L ]</span><span class="desc">Сохранить / Загрузить</span></div>
              <div class="hotkey-row"><span class="key">[ O ]</span><span class="desc">Настройки</span></div>
              <div class="hotkey-row"><span class="key">[ ПКМ ]</span><span class="desc">Скрыть интерфейс</span></div>
            </div>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(panel);

    // --- КНОПКА ЗАКРЫТИЯ (которую мы случайно сломали) ---
    const closeBtn = panel.querySelector("#close-settings-btn");
    if (closeBtn) {
      closeBtn.addEventListener("click", () => this.close());
    }

    // --- АДАПТАЦИЯ ПОД МОБИЛЬНЫЕ УСТРОЙСТВА ---
    const isMobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent,
      ) ||
      !!window.cordova ||
      !!window.Capacitor;

    if (isMobile) {
      const fsRow = panel.querySelector("#row-fullscreen");
      if (fsRow) fsRow.style.display = "none";

      const manualContent = panel.querySelector(".manual-content");
      if (manualContent) {
        manualContent.innerHTML = `
          <div class="hotkey-row"><span class="key">[ Тап по экрану ]</span><span class="desc">Далее</span></div>
          <div class="hotkey-row"><span class="key">[ Удержание ]</span><span class="desc">Промотка</span></div>
          <div class="hotkey-row"><span class="key">[ Свайп вниз ]</span><span class="desc">История</span></div>
          <div class="hotkey-row"><span class="key">[ Свайп вверх ]</span><span class="desc">Скрыть интерфейс</span></div>
        `;
      }
    }

    // --- ЛОГИКА НАСТРОЕК ГРАФИКИ ---
    const fsToggleBtns = panel.querySelectorAll(
      "#fullscreen-toggle .toggle-btn",
    );
    fsToggleBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        window.playUISound("open");
        const val = e.target.getAttribute("data-val");
        this.settings.fullscreen = val;
        this.saveCurrentSettings();
        this._updateUIFromSettings();
        if (val === "full") {
          if (!document.fullscreenElement) {
            document.documentElement
              .requestFullscreen()
              .catch((err) => console.warn(err));
          }
        } else {
          if (document.fullscreenElement) {
            document.exitFullscreen().catch((err) => console.warn(err));
          }
        }
      });
    });

    document.addEventListener("fullscreenchange", () => {
      if (document.fullscreenElement) {
        this.settings.fullscreen = "full";
      } else {
        this.settings.fullscreen = "window";
      }
      this.saveCurrentSettings();
      this._updateUIFromSettings();
    });

    const parallaxToggleBtns = panel.querySelectorAll(
      "#parallax-toggle .toggle-btn",
    );
    parallaxToggleBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        window.playUISound("open");
        const val = e.target.getAttribute("data-val");
        this.settings.parallax = val;
        this.saveCurrentSettings();
        this._updateUIFromSettings();
        if (val === "off") {
          document.body.classList.add("disable-parallax");
        } else {
          document.body.classList.remove("disable-parallax");
        }
      });
    });

    // --- ЛОГИКА АУДИО И ТЕКСТА ---
    const bgmSlider = panel.querySelector("#bgm-slider");
    const sfxSlider = panel.querySelector("#sfx-slider");
    const tsSlider = panel.querySelector("#text-speed-slider");

    if (bgmSlider) {
      bgmSlider.addEventListener("input", (e) => {
        this.settings.bgmVolume = parseInt(e.target.value);
        if (window.audioManager) window.audioManager.updateVolumes();
      });
      bgmSlider.addEventListener("change", () => {
        this.saveCurrentSettings();
        if (window.playUISound) window.playUISound("open");
      });
    }

    if (sfxSlider) {
      sfxSlider.addEventListener("input", (e) => {
        this.settings.sfxVolume = parseInt(e.target.value);
        if (window.audioManager) window.audioManager.updateVolumes();
      });
      sfxSlider.addEventListener("change", () => {
        this.saveCurrentSettings();
        if (window.playUISound) window.playUISound("open");
      });
    }

    if (tsSlider) {
      tsSlider.addEventListener("input", (e) => {
        this.settings.textSpeed = parseInt(e.target.value);
      });
      tsSlider.addEventListener("change", () => {
        this.saveCurrentSettings();
        if (window.playUISound) window.playUISound("open");
      });
    }

    // --- Кнопка СБРОСА ---
    const resetBtn = panel.querySelector(".reset-btn");
    if (resetBtn) {
      resetBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        window.showConfirm("ВОССТАНОВИТЬ НАСТРОЙКИ ПО УМОЛЧАНИЮ?", () => {
          this.resetToDefaults();
          // Обновляем ползунки после сброса
          if (bgmSlider) bgmSlider.value = this.settings.bgmVolume;
          if (sfxSlider) sfxSlider.value = this.settings.sfxVolume;
          if (tsSlider) tsSlider.value = this.settings.textSpeed;
        });
      });
    }

    // --- ЗАКРЫТИЕ ПО КЛИКУ В ПУСТОТУ (на затемненный фон) ---
    panel.addEventListener("click", (e) => {
      if (e.target === panel) {
        e.stopPropagation();
        this.close();
      }
    });

    // --- ЛОГИКА СМЕНЫ ЯЗЫКА ---
    const langToggleBtns = panel.querySelectorAll(
      "#language-toggle .toggle-btn",
    );
    langToggleBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        window.playUISound("click"); // Или "hover"

        // Убираем класс active у всех и вешаем на нажатую
        langToggleBtns.forEach((b) => b.classList.remove("active"));
        e.target.classList.add("active");

        const val = e.target.getAttribute("data-val");
        this.settings.language = val;
        this.saveCurrentSettings();

        // 🔥 ВОТ ЭТА СТРОЧКА МЕНЯЕТ ТЕКСТ ПРИ КЛИКЕ:
        this.applyTranslations();
      });
    });

    // 🔥 ВОТ ЭТА СТРОЧКА МЕНЯЕТ ТЕКСТ ПРИ ПЕРВОМ ОТКРЫТИИ НАСТРОЕК:
    this.applyTranslations();
  }

  open() {
    if (this.modalOpen) return;

    // Закрываем другие модалки
    if (window.saveManager && window.saveManager.modalOpen)
      window.saveManager.close();
    if (window.sm && window.sm.hm && window.sm.hm.modalOpen)
      window.sm.hm.hideHistory();

    window.playUISound("open");
    this.modalOpen = true;
    document.getElementById(this.containerId).classList.add("active");

    // Показываем общий блюр (он тоже забирает клики)
    const backdrop = document.getElementById("modal-backdrop");
    if (backdrop) backdrop.classList.add("active");

    // Блокируем клики по текстовому окну на всякий случай
    const dialogWrapper = document.getElementById("dialog-wrapper");
    if (dialogWrapper) dialogWrapper.style.pointerEvents = "none";
  }

  close() {
    if (!this.modalOpen) return;

    window.playUISound("close");
    this.modalOpen = false;
    document.getElementById(this.containerId).classList.remove("active");

    const backdrop = document.getElementById("modal-backdrop");
    if (backdrop) backdrop.classList.remove("active");

    const dialogWrapper = document.getElementById("dialog-wrapper");
    if (dialogWrapper) dialogWrapper.style.pointerEvents = "auto";
  }

  // Мгновенно переводит все элементы с атрибутом data-i18n
  applyTranslations() {
    const lang = this.settings.language || "ru";
    const dict = this.uiTranslations[lang];
    if (!dict) return;

    // 🔥 ИЩЕМ ПО ВСЕМУ ДОКУМЕНТУ, А НЕ ТОЛЬКО В ПАНЕЛИ НАСТРОЕК!
    const elements = document.querySelectorAll("[data-i18n]");

    elements.forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (dict[key]) {
        el.textContent = dict[key];
      }
    });
  }
}

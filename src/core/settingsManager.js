export class SettingsManager {
  constructor() {
    this.modalOpen = false;
    this.containerId = "settings-panel";

    // БАЗОВЫЕ НАСТРОЙКИ (По умолчанию)
    this.defaultSettings = {
      fullscreen: "window",
      parallax: "on",
      bgmVolume: 100, // Заготовка для аудио
      sfxVolume: 100, // Заготовка для аудио
      textSpeed: 50, // Заготовка для текста
    };

    // Загружаем сохраненные или берем базовые
    this.settings = this.loadSettings();

    this._initUI();
    this._applySettingsOnLoad(); // Применяем их при старте игры
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
                
                <!-- ПЕРВАЯ НАСТРОЙКА -->
                <div class="settings-row" id="row-fullscreen">
                  <span class="settings-label">Режим экрана</span>
                  <div class="toggle-group" id="fullscreen-toggle">
                    <button class="toggle-btn active" data-val="window">Окно</button>
                    <button class="toggle-btn" data-val="full">Полный</button>
                  </div>
                </div>

                <!-- ВТОРАЯ НАСТРОЙКА -->
                <div class="settings-row">
                  <span class="settings-label">Эффект параллакса</span>
                  <div class="toggle-group" id="parallax-toggle">
                    <button class="toggle-btn active" data-val="on">Вкл</button>
                    <button class="toggle-btn" data-val="off">Выкл</button>
                  </div>
                </div>

              </div>
              
            </div>
            <button class="reset-btn">[ СБРОС ]</button>
          </div>

          <div class="settings-right">
            <div class="manual-header">СПРАВОЧНИК</div>
            <div class="manual-content">
              <div class="hotkey-row"><span class="key">[ ЛКМ / Пробел / -&gt; / Колёсико вниз ]</span><span class="desc">Далее</span></div>
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

    // Если мы на телефоне/планшете, скрываем настройку режима экрана
    const isMobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent,
      );
    if (isMobile) {
      const fsRow = panel.querySelector("#row-fullscreen");
      if (fsRow) fsRow.style.display = "none";
    }

    // --- ЛОГИКА КНОПОК ЗАКРЫТИЯ ---
    document
      .getElementById("close-settings-btn")
      .addEventListener("click", (e) => {
        e.stopPropagation();
        this.close();
      });

    const inner = panel.querySelector("#settings-inner");
    inner.addEventListener("click", (e) => {
      e.stopPropagation();
    });

    panel.addEventListener("click", (e) => {
      e.stopPropagation();
      if (!e.target.closest("#settings-inner")) {
        this.close();
      }
    });

    // --- ЛОГИКА НАСТРОЕК ГРАФИКИ ---

    const fsToggleBtns = panel.querySelectorAll(
      "#fullscreen-toggle .toggle-btn",
    );
    fsToggleBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        window.playUISound("open");
        const val = e.target.getAttribute("data-val");

        // Сохраняем в память
        this.settings.fullscreen = val;
        this.saveCurrentSettings();
        this._updateUIFromSettings(); // Подсвечиваем кнопку

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

    // Синхронизация, если нажали F11 (меняем память, но не вызываем requestFullscreen)
    document.addEventListener("fullscreenchange", () => {
      if (document.fullscreenElement) {
        this.settings.fullscreen = "full";
      } else {
        this.settings.fullscreen = "window";
      }
      this.saveCurrentSettings();
      this._updateUIFromSettings();
    });

    // 2. Параллакс
    const parallaxToggleBtns = panel.querySelectorAll(
      "#parallax-toggle .toggle-btn",
    );
    parallaxToggleBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        window.playUISound("open");
        const val = e.target.getAttribute("data-val");

        // Сохраняем в память
        this.settings.parallax = val;
        this.saveCurrentSettings();
        this._updateUIFromSettings(); // Подсвечиваем кнопку

        // Применяем к игре
        if (val === "off") {
          document.body.classList.add("disable-parallax");
        } else {
          document.body.classList.remove("disable-parallax");
        }
      });
    });

    // 3. Кнопка СБРОСА
    const resetBtn = panel.querySelector(".reset-btn");
    if (resetBtn) {
      resetBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        window.showConfirm("ВОССТАНОВИТЬ НАСТРЙОКИ ПО УМОЛЧАНИЮ?", () => {
          this.resetToDefaults();
        });
      });
    }
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
}

export class SettingsManager {
  constructor() {
    this.modalOpen = false;
    this.containerId = "settings-panel";
    this._initUI();
  }

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
                
                <div class="settings-row">
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
              
            </div>
            <button class="reset-btn">[ СБРОС ]</button>
          </div>

          <!-- ПРАВАЯ ЧАСТЬ: СПРАВОЧНИК (40%) -->
          <div class="settings-right">
            <div class="manual-header">СПРАВОЧНИК ТЕРМИНАЛА</div>
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

    // 1. Полный экран
    const fsToggleBtns = panel.querySelectorAll(
      "#fullscreen-toggle .toggle-btn",
    );
    fsToggleBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        window.playUISound("open");
        const val = e.target.getAttribute("data-val");

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
      fsToggleBtns.forEach((b) => b.classList.remove("active"));
      if (document.fullscreenElement) {
        panel.querySelector('[data-val="full"]').classList.add("active");
      } else {
        panel.querySelector('[data-val="window"]').classList.add("active");
      }
    });

    // 2. Параллакс
    const parallaxToggleBtns = panel.querySelectorAll(
      "#parallax-toggle .toggle-btn",
    );
    parallaxToggleBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        window.playUISound("open");
        const val = e.target.getAttribute("data-val");

        parallaxToggleBtns.forEach((b) => b.classList.remove("active"));
        e.target.classList.add("active");

        if (val === "off") {
          document.body.classList.add("disable-parallax"); // Вешаем класс на body
        } else {
          document.body.classList.remove("disable-parallax");
        }
      });
    });
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

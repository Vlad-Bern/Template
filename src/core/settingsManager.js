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

    // Обертка settings-inner нужна, чтобы отличать клик по самой панели от клика мимо
    panel.innerHTML = `
      <div id="settings-inner">
        <button class="modal-close-btn" id="close-settings-btn" title="Закрыть">[ × ]</button>
        
        <div class="settings-layout">
          <!-- ЛЕВАЯ ЧАСТЬ: НАСТРОЙКИ (60%) -->
          <div class="settings-left">
            <div class="modal-header">[ НАСТРОЙКИ СИСТЕМЫ ]</div>
            <div class="settings-list">
              <!-- Сюда мы позже добавим ползунки -->
              <p style="text-align: center; color: #888;">[ ПАРАМЕТРЫ ЗАБЛОКИРОВАНЫ ДОСТУПОМ D-РАНГА ]</p>
            </div>
            <button class="reset-btn">[ СБРОС ]</button>
          </div>

          <!-- ПРАВАЯ ЧАСТЬ: СПРАВОЧНИК (40%) -->
          <div class="settings-right">
            <div class="manual-header">СПРАВОЧНИК ТЕРМИНАЛА</div>
            <div class="manual-content">
              <div class="hotkey-row"><span class="key">[ ЛКМ / Пробел / -> / Колёсико вниз ]</span><span class="desc">Далее</span></div>
              <div class="hotkey-row"><span class="key">[ Ctrl ]</span><span class="desc">Промотка</span></div>
              <div class="hotkey-row"><span class="key">[ H / Колёсико вверх]</span><span class="desc">История</span></div>
              <div class="hotkey-row"><span class="key">[ S / L ]</span><span class="desc">Сохранить / Загрузить</span></div>
              <div class="hotkey-row"><span class="key">[ O ]</span><span class="desc">Настройки</span></div>
              <div class="hotkey-row"><span class="key">[ ПКМ ]</span><span class="desc">Скрыть интерфейс</span></div>
            </div>
            <!-- Сюда вы потом можете добавить любой лор или картинки -->
          </div>
        </div>
      </div>
    `;

    // КРЕПИМ К BODY! Это навсегда решит проблему с z-index и блюром.
    document.body.appendChild(panel);

    // 1. Кнопка закрытия
    document
      .getElementById("close-settings-btn")
      .addEventListener("click", (e) => {
        e.stopPropagation();
        this.close();
      });

    // 2. ЩИТ ДЛЯ САМОЙ ТАБЛИЧКИ
    // Блокируем абсолютно все клики внутри настроек, чтобы они не летели в игру
    const inner = panel.querySelector("#settings-inner");
    inner.addEventListener("click", (e) => {
      e.stopPropagation();
    });

    // 3. ЗАКРЫТИЕ ПО ПУСТОТЕ (И перехват клика)
    panel.addEventListener("click", (e) => {
      e.stopPropagation(); // <-- ВОЗВРАЩАЕМ УБИТЫЙ МНОЮ ЩИТ!
      if (!e.target.closest("#settings-inner")) {
        this.close();
      }
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

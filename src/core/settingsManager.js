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
        <div class="modal-header">НАСТРОЙКИ СИСТЕМЫ</div>
        <div class="settings-content">
          <p style="text-align: center; color: #888;">[ ПАРАМЕТРЫ ЗАБЛОКИРОВАНЫ ДОСТУПОМ D-РАНГА ]</p>
        </div>
        <button class="modal-close-btn" id="close-settings-btn">[ ЗАКРЫТЬ ]</button>
      </div>
    `;

    // КРЕПИМ К BODY! Это навсегда решит проблему с z-index и блюром.
    document.body.appendChild(panel);

    // Закрытие по кнопке
    document
      .getElementById("close-settings-btn")
      .addEventListener("click", (e) => {
        e.stopPropagation();
        this.close();
      });

    // Закрытие по клику В ПУСТОТУ
    panel.addEventListener("click", (e) => {
      // Если кликнули не по внутреннему блоку, значит кликнули по фону
      if (!e.target.closest("#settings-inner")) {
        e.stopPropagation();
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

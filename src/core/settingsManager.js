export class SettingsManager {
  constructor() {
    this.modalOpen = false;
    this.containerId = "settings-panel";
    this._initUI();
  }

  _initUI() {
    // 1. Создаем HTML
    const panel = document.createElement("div");
    panel.id = this.containerId;
    panel.className = "modal-panel"; // Используем общий класс модалок
    panel.innerHTML = `
      <div class="modal-header">НАСТРОЙКИ СИСТЕМЫ</div>
      <div class="settings-content">
        <!-- Сюда потом добавим ползунки -->
        <p style="text-align: center; color: #888;">[ ПАРАМЕТРЫ ЗАБЛОКИРОВАНЫ ДОСТУПОМ D-РАНГА ]</p>
      </div>
      <button class="modal-close-btn" id="close-settings-btn">[ ЗАКРЫТЬ ]</button>
    `;

    // Вставляем панель в game-ui (туда же, где лежат history-panel и save-panel)
    document.getElementById("game-ui").appendChild(panel);

    // 2. Слушатель на кнопку закрытия
    document
      .getElementById("close-settings-btn")
      .addEventListener("click", () => this.close());
  }

  open() {
    if (this.modalOpen) return;

    // Закрываем другие окна перед открытием
    if (window.saveManager && window.saveManager.modalOpen)
      window.saveManager.close();
    if (window.sm && window.sm.hm && window.sm.hm.modalOpen)
      window.sm.hm.hideHistory();

    window.playUISound("open");
    this.modalOpen = true;
    document.getElementById(this.containerId).classList.add("active");

    // Блокируем игру
    const dialogWrapper = document.getElementById("dialog-wrapper");
    if (dialogWrapper) dialogWrapper.style.pointerEvents = "none";

    // Показываем общий фон модалок
    const backdrop = document.getElementById("modal-backdrop");
    if (backdrop) backdrop.classList.add("active");
  }

  close() {
    if (!this.modalOpen) return;

    window.playUISound("close");
    this.modalOpen = false;
    document.getElementById(this.containerId).classList.remove("active");

    // Возвращаем управление игре
    const dialogWrapper = document.getElementById("dialog-wrapper");
    if (dialogWrapper) dialogWrapper.style.pointerEvents = "auto";

    // Прячем фон
    const backdrop = document.getElementById("modal-backdrop");
    if (backdrop) backdrop.classList.remove("active");
  }
}

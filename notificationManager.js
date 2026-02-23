export class NotificationManager {
  constructor() {
    this.container = null;
    this.activeMessages = new Set(); // Храним текст активных уведомлений
  }

  show(message, type = "info") {
    // Если такое сообщение уже на экране — игнорим
    if (this.activeMessages.has(message)) return;

    if (!this.container) this.container = this.createContainer();

    const toast = document.createElement("div");
    toast.className = `toast toast-${type} pulse-in`;
    toast.textContent = message;

    this.activeMessages.add(message); // Помечаем как активное
    this.container.appendChild(toast);

    requestAnimationFrame(() => toast.classList.add("show"));

    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => {
        toast.remove();
        this.activeMessages.delete(message); // Удаляем из реестра после исчезновения
      }, 300);
    }, 3000);
  }

  createContainer() {
    let container = document.getElementById("notification-container");
    if (!container) {
      container = document.createElement("div");
      container.id = "notification-container";
      document.body.appendChild(container);
    }
    return container;
  }
}
export const nm = new NotificationManager();

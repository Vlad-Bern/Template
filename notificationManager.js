export class NotificationManager {
  constructor() {
    this.container = null; // Не ищем сразу
  }

  show(message, type = "info") {
    // Ищем контейнер ТОЛЬКО когда нужно показать тост
    if (!this.container) {
      this.container = document.getElementById("notification-container");
      // Если всё ещё нет (забыли в HTML), создаём сами
      if (!this.container) {
        this.container = document.createElement("div");
        this.container.id = "notification-container";
        document.body.appendChild(this.container); // Кидаем прямо в body
      }
    }

    const toast = document.createElement("div");
    this.container.appendChild(toast);

    // Анимация входа
    requestAnimationFrame(() => toast.classList.add("show"));

    // Удаление через 3 секунды
    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }
}

export const nm = new NotificationManager();

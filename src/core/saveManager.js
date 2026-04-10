import { state } from "./state.js";

export class SaveManager {
  constructor() {
    this.saveSlots = 60; // 10 страниц по 6 слотов
    this.currentPage = 1;
    this.containerId = "save-load-panel";
    this.mode = "save"; // "save" или "load"
    this.modalOpen = false; // ФЛАГ ДЛЯ SCENEMANAGER
    this.initUI();
  }

  initUI() {
    if (!document.getElementById(this.containerId)) {
      const panel = document.createElement("div");
      panel.id = this.containerId;

      panel.innerHTML = `
        <div id="sl-inner-content">
          <div class="sl-header">
            <h2 id="sl-title">Сохранение</h2>
            <button id="close-sl-btn">✕</button>
          </div>
          <div class="sl-pagination">
            <button id="sl-prev-page">◀</button>
            <span id="sl-page-info">Страница 1 / 10</span>
            <button id="sl-next-page">▶</button>
          </div>
          <div id="sl-slots-container"></div>
        </div>
      `;
      document.body.appendChild(panel);

      document.getElementById("close-sl-btn").addEventListener("click", (e) => {
        e.stopPropagation();
        this.close();
      });
      document
        .getElementById("sl-prev-page")
        .addEventListener("click", () => this.changePage(-1));
      document
        .getElementById("sl-next-page")
        .addEventListener("click", () => this.changePage(1));

      panel.addEventListener("click", (e) => {
        if (!e.target.closest("#sl-inner-content")) {
          e.stopPropagation();
          this.close();
        }
      });

      // Навигация стрелочками
      window.addEventListener("keydown", (e) => {
        if (!this.modalOpen) return;
        if (e.code === "ArrowLeft") this.changePage(-1);
        if (e.code === "ArrowRight") this.changePage(1);
        if (e.code === "Escape") this.close();
      });

      // Жесткая блокировка колесика мыши
      document.addEventListener(
        "wheel",
        (e) => {
          if (this.modalOpen) {
            e.stopPropagation();
          }
        },
        { passive: false, capture: true },
      );
    }
  }

  open(mode) {
    this.mode = mode;
    this.modalOpen = true;

    document.getElementById("sl-title").innerText =
      mode === "save" ? "💾 Сохранить игру" : "📂 Загрузить игру";

    const panel = document.getElementById(this.containerId);
    // Добавляем класс .active (он включит display: flex и запустит CSS-анимацию!)
    panel.classList.add("active");

    this.renderSlots();
  }

  close() {
    this.modalOpen = false;
    const panel = document.getElementById(this.containerId);
    panel.classList.remove("active"); // Прячем панель
  }

  changePage(dir) {
    this.currentPage += dir;
    if (this.currentPage < 1) this.currentPage = 10;
    if (this.currentPage > 10) this.currentPage = 1;
    document.getElementById("sl-page-info").innerText =
      `Страница ${this.currentPage} / 10`;
    this.renderSlots();
  }

  renderSlots() {
    const container = document.getElementById("sl-slots-container");
    container.innerHTML = "";
    const startIdx = (this.currentPage - 1) * 6;

    for (let i = 0; i < 6; i++) {
      const slotIndex = startIdx + i;
      const slotData = JSON.parse(
        localStorage.getItem(`sota_save_${slotIndex}`) || "null",
      );

      const btn = document.createElement("button");
      btn.className = "sl-slot-btn"; // Теперь стили полностью из CSS

      if (slotData) {
        const date = new Date(slotData.timestamp).toLocaleString("ru-RU", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
        // Используем новые красивые CSS классы для данных
        btn.innerHTML = `
          <div class="slot-title">Слот ${slotIndex + 1}</div>
          <div class="slot-rank">Ранг: <span class="rank-letter">${slotData.state.hero.rank_letter}</span> (${slotData.state.hero.rank_score})</div>
          <div class="slot-stats">Рассудок: ${slotData.state.hero.stats.sanity} | Доминация: ${slotData.state.hero.stats.dominance}</div>
          <div class="slot-date">${date}</div>
        `;
      } else {
        btn.classList.add("empty");
        btn.innerHTML = `
          <div class="slot-title">Слот ${slotIndex + 1}</div>
          <div>Пусто</div>
        `;
      }

      btn.addEventListener("click", () => {
        if (this.mode === "save") {
          this.saveGame(slotIndex);
        } else {
          this.loadGame(slotIndex, slotData);
        }
      });

      container.appendChild(btn);
    }
  }

  saveGame(slotIndex) {
    if (!window.sm || !window.sm.currentSceneId) {
      alert("Невозможно сохранить игру в данный момент!");
      return;
    }

    const dataToSave = {
      timestamp: Date.now(),
      sceneId: window.sm.currentSceneId,
      lineIndex: window.sm.currentLineIndex || 0,
      state: JSON.parse(JSON.stringify(state)),
    };

    localStorage.setItem(`sota_save_${slotIndex}`, JSON.stringify(dataToSave));
    this.renderSlots();
  }

  loadGame(slotIndex, slotData) {
    if (!slotData) return;

    Object.assign(state.hero, slotData.state.hero);
    Object.assign(state.relations, slotData.state.relations);
    Object.assign(state.flags, slotData.state.flags);
    Object.assign(state.temp, slotData.state.temp);

    window.dispatchEvent(
      new CustomEvent("stressUpdated", {
        detail: { sanity: state.hero.stats.sanity },
      }),
    );
    window.dispatchEvent(new CustomEvent("statsUpdated"));

    this.close();

    if (window.sm) {
      window.sm.loadScene(slotData.sceneId, slotData.lineIndex);
    }
  }
}

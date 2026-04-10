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
      panel.style.cssText = `
        display: none; position: absolute; inset: 0; background: rgba(0,0,0,0.95); 
        z-index: 2000; padding: 30px; color: white; font-family: 'Inter', sans-serif;
      `;

      panel.innerHTML = `
        <div style="display: flex; justify-content: space-between; border-bottom: 1px solid #444; padding-bottom: 15px; margin-bottom: 20px;">
          <h2 id="sl-title" style="margin: 0; color: #b19cd9;">Сохранение</h2>
          <button id="close-sl-btn" style="background: none; border: none; color: white; font-size: 24px; cursor: pointer;">✕</button>
        </div>
        <div style="text-align: center; margin-bottom: 30px;">
          <button id="sl-prev-page" style="background: #222; color: white; border: 1px solid #555; padding: 10px 20px; cursor: pointer;">◀</button>
          <span id="sl-page-info" style="margin: 0 20px; font-size: 18px;">Страница 1 / 10</span>
          <button id="sl-next-page" style="background: #222; color: white; border: 1px solid #555; padding: 10px 20px; cursor: pointer;">▶</button>
        </div>
        <div id="sl-slots-container" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; max-width: 900px; margin: 0 auto;"></div>
      `;
      document.body.appendChild(panel);

      document
        .getElementById("close-sl-btn")
        .addEventListener("click", () => this.close());
      document
        .getElementById("sl-prev-page")
        .addEventListener("click", () => this.changePage(-1));
      document
        .getElementById("sl-next-page")
        .addEventListener("click", () => this.changePage(1));

      // Закрытие по клику мимо контента (по фону)
      panel.addEventListener("click", (e) => {
        if (e.target === panel) {
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

      // Жесткая блокировка колесика мыши (перехват на погружении)
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
    document.getElementById(this.containerId).style.display = "block";

    // Отключаем кликабельность нижнего UI
    const gameUi = document.getElementById("game-ui");
    if (gameUi) gameUi.style.pointerEvents = "none";

    this.renderSlots();
  }

  close() {
    this.modalOpen = false;
    document.getElementById(this.containerId).style.display = "none";

    // Возвращаем кликабельность
    const gameUi = document.getElementById("game-ui");
    if (gameUi) gameUi.style.pointerEvents = "auto";
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
      btn.style.cssText = `
        background: #111; color: #fff; border: 1px solid #444; padding: 20px; 
        min-height: 140px; text-align: left; cursor: pointer; transition: 0.2s;
      `;

      if (slotData) {
        const date = new Date(slotData.timestamp).toLocaleString("ru-RU", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
        btn.innerHTML = `
          <div style="color: #b19cd9; font-weight: bold; margin-bottom: 8px;">Слот ${slotIndex + 1}</div>
          <div style="font-size: 14px;">Ранг: ${slotData.state.hero.rank_letter} (${slotData.state.hero.rank_score})</div>
          <div style="font-size: 14px; margin-top: 4px;">Рассудок: ${slotData.state.hero.stats.sanity} | Доминация: ${slotData.state.hero.stats.dominance}</div>
          <div style="font-size: 12px; color: #777; margin-top: 15px;">${date}</div>
        `;
      } else {
        btn.innerHTML = `
          <div style="color: #666; font-weight: bold;">Слот ${slotIndex + 1}</div>
          <div style="color: #444; margin-top: 10px;">Пусто</div>
        `;
      }

      btn.addEventListener(
        "mouseover",
        () => (btn.style.borderColor = "#b19cd9"),
      );
      btn.addEventListener("mouseout", () => (btn.style.borderColor = "#444"));

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
      // ПЕРЕДАЕМ ИНДЕКС СТРОКИ ДЛЯ ЗАГРУЗКИ
      window.sm.loadScene(slotData.sceneId, slotData.lineIndex);
    }
  }
}

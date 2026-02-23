import "./style.scss";
import { initEffects } from "./src/ui/effects.js";
import { Typewriter } from "./src/core/typewriter.js";
import { SceneManager } from "./src/core/sceneManager.js";
import { state, updateStat, updateStressVisuals } from "./src/core/state.js";

const app = document.getElementById("app");

// 1. СТРОИМ ДОМ (Генерация всей структуры игры)
app.innerHTML = `
 <div id="global-bg"></div>
  <div id="bg-layer"></div>
  <div id="character-layer"></div>
  <div id="fx-layer"></div>
  <div id="noise-layer"></div> 
  <div id="interaction-layer"></div>
  <div id="ultra-wide-blur-layer"></div>
  <div id="game-ui">
    <div id="notification-container"></div>
    <div id="choice-container"></div>
    
    <div id="modal-backdrop" style="display: none;"></div>
    
    <div id="history-panel" style="display: none;">
      <div id="history-header">
        <h3>История диалогов</h3>
        <button id="close-history">✖</button>
      </div>
      <div id="history-content"></div>
    </div>

    <div id="dialog-wrapper">
      <div id="dialog-bg-color"></div> 
      <div id="name-tag"></div>
      <div id="dialog-box-container">
      <div id="dialog-box"></div>
        
        <div id="dialog-footer">
          <button id="open-history-btn" class="dialog-footer-btn">
            История (H)
          </button>
        </div>
      </div>
    </div>
  </div>
`;

// 2. ИНИЦИАЛИЗАЦИЯ (Только после того, как HTML готов!)
initEffects();

const tw = new Typewriter("dialog-box");
const sm = new SceneManager(tw);

// 3. СТАРТ
sm.loadScene("quiz_intro");

// 4. РАЗБЛОКИРОВКА АУДИО (Первый клик)
const unlockAudio = () => {
  if (window.Howler && window.Howler.ctx) {
    window.Howler.ctx.resume().then(() => {
      window.removeEventListener("click", unlockAudio);
    });
  }
};
window.addEventListener("click", unlockAudio);

updateStressVisuals(state.hero.stats.sanity);

// Дебаг-режим: жамкаем "1" — теряем рассудок
window.addEventListener("keydown", (e) => {
  if (e.key === "1") {
    console.log("DEBUG: Понижаем рассудок на 10");
    updateStat("sanity", -10); // Понижаем

    // Визуальный фидбек: если рассудок низкий, добавляем класс "психа" всему приложению
    if (state.hero.stats.sanity < 40) {
      app.classList.add("stress-high");
    } else if (state.hero.stats.sanity < 60) {
      app.classList.remove("stress-high");
      app.classList.add("stress-med");
    } else {
      app.classList.remove("stress-high", "stress-med");
    }
  }
});

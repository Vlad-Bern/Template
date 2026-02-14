// main.js
import "./style.scss"; // Помнишь, мы перешли на SCSS?
import { initEffects } from "./src/ui/effects.js";
import { Typewriter } from "./src/core/typewriter.js";
import { SceneManager } from "./src/core/sceneManager.js";
import { state, updateStat } from "./src//core/state.js";

const app = document.getElementById("app");

// 1. СТРОИМ ДОМ (Генерация всей структуры игры)
app.innerHTML = `
  <div id="bg-layer"></div>
  <div id="character-layer"></div>
  <div id="fx-layer"></div>
  <div id="game-ui">
    <div id="choice-container"></div>
      <div id="notification-container"></div>

    <div id="dialog-wrapper">
      <div id="name-tag"></div>
      <div id="dialog-box-container">
        <div id="dialog-box"></div>
      </div>
    </div>
  </div>
`;

// 2. ИНИЦИАЛИЗАЦИЯ (Только после того, как HTML готов!)
initEffects();

const tw = new Typewriter("dialog-box");
const sm = new SceneManager(tw);

// 3. СТАРТ
sm.loadScene("prologue_interrogation");

// 4. РАЗБЛОКИРОВКА АУДИО (Первый клик)
const unlockAudio = () => {
  if (window.Howler && window.Howler.ctx) {
    window.Howler.ctx.resume().then(() => {
      console.log("[Audio] Поток разблокирован!");
      window.removeEventListener("click", unlockAudio);
    });
  }
};
window.addEventListener("click", unlockAudio);

// 5. ТЕСТОВАЯ ПАНЕЛЬ (Клавиши 1, 2)
window.addEventListener("keydown", (e) => {
  if (e.key === "1") updateStat("stress", 10);
  if (e.key === "2") updateStat("stress", -10);
});

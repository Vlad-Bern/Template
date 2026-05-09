import { inputManager, INPUT_PRIORITY } from "../core/inputManager.js";

// --- УНИВЕРСАЛЬНОЕ ОКНО ПОДТВЕРЖДЕНИЯ ---
window.showConfirm = function (message, onConfirm) {
  if (window.playUISound) window.playUISound("open");

  // === МАЙ: СТАВИМ НА ПАУЗУ ПРИ ОТКРЫТИИ ===
  if (window.quizTimer) {
    window.quizTimer.pause();
  }

  let backdrop = document.getElementById("confirm-backdrop");
  if (!backdrop) {
    backdrop = document.createElement("div");
    backdrop.id = "confirm-backdrop";
    backdrop.innerHTML = `
      <div id="confirm-box">
        <div id="confirm-text"></div>
        <div class="confirm-btns">
          <button id="confirm-yes"></button>
          <button id="confirm-no"></button>
        </div>
      </div>
    `;
    document.body.appendChild(backdrop);
  }

  // МАЙ ФИКС: Переводим кнопки "Да" и "Отмена" перед показом
  const lang =
    window.settingsManager && window.settingsManager.settings
      ? window.settingsManager.settings.language
      : "ru";
  const dict = window.settingsManager
    ? window.settingsManager.uiTranslations[lang]
    : null;

  const btnYes = document.getElementById("confirm-yes");
  const btnNo = document.getElementById("confirm-no");

  if (btnYes) btnYes.innerText = dict ? dict.confirm_yes : "[ ДА ]";
  if (btnNo) btnNo.innerText = dict ? dict.confirm_no : "[ ОТМЕНА ]";

  document.getElementById("confirm-text").innerText = message;
  backdrop.classList.add("active");

  // Сохраняем функции отписки на самой backdrop, чтобы close() их выдернул
  const keyOff = inputManager.on(
    "keydown",
    (e) => {
      if (e.code === "Escape") {
        close();
        return true;
      }
      if (
        [
          "Space",
          "Enter",
          "ArrowRight",
          "ArrowLeft",
          "ArrowUp",
          "ArrowDown",
          "ControlLeft",
          "ControlRight",
          "KeyH",
          "KeyS",
          "KeyL",
          "KeyO",
        ].includes(e.code)
      ) {
        return true; // съедаем, чтобы не дошло до сцены
      }
      return false;
    },
    { priority: INPUT_PRIORITY.CONFIRM, owner: backdrop },
  );

  const rmbOff = inputManager.on(
    "contextmenu",
    () => {
      close();
      return true;
    },
    { priority: INPUT_PRIORITY.CONFIRM, owner: backdrop },
  );

  const close = () => {
    if (window.playUISound) window.playUISound("close");
    backdrop.classList.remove("active");
    keyOff();
    rmbOff();
    if (window.quizTimer) window.quizTimer.resume();
    window.removeEventListener("keydown", window._confirmKeyHandler, true);
    window.removeEventListener("contextmenu", window._confirmRmbHandler, true);

    // === МАЙ: ВОЗОБНОВЛЯЕМ ТАЙМЕР ПРИ ЗАКРЫТИИ ===
    if (window.quizTimer) {
      window.quizTimer.resume();
    }
  };

  btnYes.onclick = null;
  btnNo.onclick = null;

  btnYes.onclick = (e) => {
    e.stopPropagation();
    close();
    if (onConfirm) onConfirm();
  };

  btnNo.onclick = (e) => {
    e.stopPropagation();
    close();
  };

  backdrop.onclick = (e) => {
    e.stopPropagation();
    if (e.target === backdrop) close();
  };
};

export {};

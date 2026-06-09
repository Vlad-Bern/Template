import { state } from "../core/state.js";
import { SaveManager } from "../core/saveManager.js";

// === ЛОГИКА КНОПОК ГЛАВНОГО МЕНЮ ===
// 1. Кнопка: Новая игра
const btnNewGame = document.getElementById("btn-new-game");
if (btnNewGame) {
  btnNewGame.addEventListener("click", () => {
    if (window.playUISound) window.playUISound("open");

    const mainMenu = document.getElementById("main-menu-screen");
    const gameViewport = document.getElementById("game-viewport");
    const dialogWrapper = document.getElementById("dialog-wrapper");

    // === ПЛАВНОЕ ЗАТЕМНЕНИЕ ПЕРЕД СТАРТОМ ===
    const blackoutLayer = document.createElement("div");
    blackoutLayer.style.position = "fixed";
    blackoutLayer.style.inset = "0";
    blackoutLayer.style.backgroundColor = "black";
    blackoutLayer.style.zIndex = "999999";
    blackoutLayer.style.opacity = "0";
    blackoutLayer.style.transition = "opacity 1.5s ease-in-out";
    blackoutLayer.style.pointerEvents = "all";
    document.body.appendChild(blackoutLayer);

    setTimeout(() => {
      blackoutLayer.style.opacity = "1";
    }, 50);

    setTimeout(() => {
      if (mainMenu) mainMenu.style.display = "none";

      if (gameViewport) gameViewport.style.display = "block";
      if (dialogWrapper) dialogWrapper.style.display = "flex";

      // === ЖЕСТКИЙ СБРОС ИГРЫ К ДЕФОЛТУ (D-ранг старт) ===
      state.hero = {
        name: "Ren",
        rank_letter: "D",
        rank_score: 20,
        sp: 100,
        stats: { dominance: -10, sanity: 80, physique: 50 },
        inventory: { items: {} },
      };
      state.relations = {};
      state.flags = {};
      state.temp = {};

      window.dispatchEvent(
        new CustomEvent("stressUpdated", { detail: { sanity: 80 } }),
      );
      window.dispatchEvent(new CustomEvent("statsUpdated"));

      // Загружаем язык сюжета, затем стартуем сцену
      const lang = window.settingsManager?.settings?.language || "ru";
      window.loadStoryLanguage(lang).then(() => {
        if (window.sm) {
          window.sm.loadScene("prologue_interrogation");
        }
      });

      // Плавно снимаем затемнение, открывая первую сцену
      blackoutLayer.style.opacity = "0";
      setTimeout(() => blackoutLayer.remove(), 1500);
    }, 1550);
  });
}

// 2. Кнопка: Загрузить
const btnLoadGame = document.getElementById("btn-load-game");
if (btnLoadGame) {
  btnLoadGame.addEventListener("click", () => {
    if (window.playUISound) window.playUISound("open");
    if (window.saveManager) {
      window.saveManager.open("load");
    }
  });
}

// 3. Кнопка: Настройки
const btnSettingsMenu = document.getElementById("btn-settings-menu");
if (btnSettingsMenu) {
  btnSettingsMenu.addEventListener("click", () => {
    if (window.playUISound) window.playUISound("open");
    if (window.settingsManager) {
      window.settingsManager.open();
    }
  });
}

// === КНОПКА ВОЗВРАТА В МЕНЮ ИЗ ИГРЫ ===
window.returnToMenuLogic = (skipConfirm = false) => {
  // МАЙ: Упаковываем весь процесс выхода в отдельную функцию
  const lang =
    window.settingsManager && window.settingsManager.settings
      ? window.settingsManager.settings.language
      : "ru";
  const dict = window.settingsManager
    ? window.settingsManager.uiTranslations[lang]
    : null;
  const exitText = dict
    ? dict.confirm_exit_menu
    : "ВЫЙТИ В ГЛАВНОЕ МЕНЮ? НЕ ЗАБУДЬ СОХРАНИТЬСЯ.";
  const executeExit = () => {
    // Внимание! Исправленное имя переменной: sm.cs
    if (window.sm && window.sm.cs) {
      window.sm.cs.forceClose();
    }

    if (window.quizTimer) {
      window.quizTimer.clear();
      window.quizTimer = null;
    }

    if (window.playUISound) window.playUISound("open");

    // Плавное затемнение (как при старте)
    const blackoutLayer = document.createElement("div");
    blackoutLayer.style.position = "fixed";
    blackoutLayer.style.inset = "0";
    blackoutLayer.style.backgroundColor = "black";
    blackoutLayer.style.zIndex = "999999";
    blackoutLayer.style.opacity = "0";
    blackoutLayer.style.transition = "opacity 1.5s ease-in-out";
    blackoutLayer.style.pointerEvents = "all";
    document.body.appendChild(blackoutLayer);

    setTimeout(() => {
      blackoutLayer.style.opacity = "1";
    }, 50);

    setTimeout(() => {
      // 1. Убиваем игровой интерфейс
      const gameViewport = document.getElementById("game-viewport");
      const dialogWrapper = document.getElementById("dialog-wrapper");
      if (gameViewport) gameViewport.style.display = "none";
      if (dialogWrapper) dialogWrapper.style.display = "none";

      if (window.sm && window.sm.choiceSystem) {
        window.sm.choiceSystem.forceClose();
      }

      // === МАЙ: ЖЕСТКОЕ УБИЙСТВО ЭФФЕКТОВ БЕЗ АНИМАЦИИ ===
      // Снимаем анимации, если они идут
      if (window.anime) {
        anime.remove(["#darkness-layer", "#noise-layer", "#vignette-layer"]);
      }
      // Сбрасываем стили напрямую
      const dl = document.getElementById("darkness-layer");
      const nl = document.getElementById("noise-layer");
      const vl = document.getElementById("vignette-layer");
      if (dl) dl.style.opacity = "0";
      if (nl) nl.style.opacity = "0";
      if (vl) vl.style.opacity = "0";

      // Сбрасываем фоны
      ["bg-1", "bg-2", "gbg-1", "gbg-2"].forEach((id) => {
        const el = document.getElementById(id);
        if (el) {
          el.style.backgroundImage = "none";
          el.style.opacity = "0";
        }

        // И на всякий случай очищаем контейнер персонажей сцены
        const sceneCharContainer = document.getElementById(
          "characters-container",
        );
        if (sceneCharContainer) sceneCharContainer.innerHTML = "";

        // === МАЙ: ПОЛНАЯ ЗАЧИСТКА ЭКРАНА И ПАМЯТИ ===
        // 1. Убиваем эффекты темноты и шума (жестко)
        if (window.anime) {
          anime.remove(["#darkness-layer", "#noise-layer", "#vignette-layer"]);
        }
        const dl = document.getElementById("darkness-layer");
        const nl = document.getElementById("noise-layer");
        const vl = document.getElementById("vignette-layer");
        if (dl) dl.style.opacity = "0";
        if (nl) nl.style.opacity = "0";
        if (vl) vl.style.opacity = "0";

        // 2. Убиваем документ на экране, если он открыт
        if (
          window.sm &&
          window.sm.ui &&
          typeof window.sm.ui.showDocument === "function"
        ) {
          window.sm.ui.showDocument(false); // Прячем слой документа
        }
        // Жестко сносим сам документ из DOM, чтобы наверняка
        const docOverlay = document.getElementById("document-overlay");
        if (docOverlay) docOverlay.remove();

        // 3. Сбрасываем "память" SceneManager о текущей картинке!
        // Это исправит баг "перетекания" старого фона в новую игру
        if (window.sm) {
          window.sm.currentSceneId = null;
          window.sm.currentLineIndex = 0;
          window.sm.currentPlayId = Symbol(); // Отменяем все незаконченные promises
          // Стираем память bgManager о текущем фоне, чтобы он начал с чистого листа
          if (window.sm.bgManager) {
            window.sm.bgManager.currentBg = null;
          }
          // МАЙ ФИКС: Очищаем историю диалогов при выходе в меню
          if (window.sm.hm) {
            window.sm.hm.history = [];
          }
        }
      });

      // И на всякий случай очищаем контейнер персонажей сцены
      const sceneCharContainer = document.getElementById(
        "characters-container",
      );
      if (sceneCharContainer) sceneCharContainer.innerHTML = "";

      // 2. Глушим печатную машинку
      if (window.sm && window.sm.navController) {
        window.sm.navController.abort();
      }

      // 3. Безопасно глушим аудио
      if (window.audioManager) {
        try {
          if (typeof window.audioManager.fadeOutBGM === "function") {
            window.audioManager.fadeOutBGM(1);
          } else if (typeof window.audioManager.stopBGM === "function") {
            window.audioManager.stopBGM(1000);
          }

          if (typeof window.audioManager.fadeOutSFX === "function") {
            window.audioManager.fadeOutSFX(1);
          } else if (window.audioManager.activeLoops) {
            Object.keys(window.audioManager.activeLoops).forEach((key) => {
              window.audioManager.stopSFX(key, 1000);
            });
          }
        } catch (e) {
          console.warn("Май: Не удалось выключить музыку при выходе", e);
        }
      }

      // 4. Включаем Главное меню
      const mainMenu = document.getElementById("main-menu-screen");
      if (mainMenu) mainMenu.style.display = "flex";

      if (typeof window.showRandomMenuCharacter === "function") {
        window.showRandomMenuCharacter();
      }

      if (
        window.audioManager &&
        typeof window.audioManager.playBGM === "function"
      ) {
        setTimeout(() => {
          window.audioManager.playBGM("Last Destination");
        }, 1200);
      }

      // 5. Растворяем затемнение
      blackoutLayer.style.opacity = "0";
      setTimeout(() => blackoutLayer.remove(), 1500);
    }, 1550);
  };

  // МАЙ: Проверяем, нужно ли окно подтверждения
  // skipConfirm мы будем передавать из наших титров!
  if (skipConfirm || window._creditsReturn) {
    executeExit(); // Выходим молча и красиво
  } else {
    // Обычный выход через кнопку "В меню"
    window.showConfirm(exitText, executeExit);
  }
};

document
  .getElementById("open-mainmenu-btn")
  .addEventListener("click", function () {
    this.blur(); // Отбираем фокус
    returnToMenuLogic();
  });

export {};

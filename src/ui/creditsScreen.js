// === СИСТЕМА ТИТРОВ ===
window.startCredits = function (creditsArray) {
  const creditsScreen = document.getElementById("credits-screen");
  const creditsLogo = document.getElementById("credits-logo");
  const creditsText = document.getElementById("credits-text");

  if (!creditsScreen || !creditsArray || creditsArray.length === 0) return;

  // === 1. ИДЕЯ ХОЗЯИНА: ПОЛНОЕ УБИЙСТВО ИГРЫ ===
  // Жестко глушим скип, если игрок зажал Ctrl перед титрами
  if (window.sm) {
    window.sm.isFastForwarding = false;
    if (window.sm.fastForwardTimeoutId)
      clearTimeout(window.sm.fastForwardTimeoutId);
  }

  // Сразу запускаем выход в главное меню (игра умрет под черным экраном титров)
  if (typeof window.returnToMenuLogic === "function") {
    window.returnToMenuLogic(true);
  }

  let currentIndex = 0;
  let isAnimating = false;
  window.sotaIsCreditsActive = true;

  // === 2. БЛОКИРОВКА КЛАВИАТУРЫ ===
  const blockHotkeys = (e) => {
    if (e.type === "keydown" || e.type === "keyup") {
      if (e.code !== "Space" && e.code !== "Enter") {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        return;
      }

      e.preventDefault();
      e.stopImmediatePropagation();

      if (e.type === "keydown") {
        if (window.playUISound) window.playUISound("open");
        showNextText();
      }
    }
  };

  window.addEventListener("keydown", blockHotkeys, true);
  window.addEventListener("keyup", blockHotkeys, true);

  // === 3. ПОКАЗЫВАЕМ ТИТРЫ ПОВЕРХ МЕНЮ ===
  // Делаем z-index огромным, чтобы перекрыть слой затемнения от вызова меню
  creditsScreen.style.zIndex = "9999999";
  creditsScreen.style.display = "flex";
  // Убедимся, что экран непрозрачный (на случай повторного вызова)
  creditsScreen.style.opacity = "1";
  creditsScreen.style.transition = "opacity 1s ease-in-out"; // Для красивого финала

  setTimeout(() => {
    creditsLogo.style.opacity = "1";
    showNextText();
  }, 500);

  function showNextText() {
    if (isAnimating) return;
    isAnimating = true;

    creditsText.style.opacity = "0";

    setTimeout(() => {
      // === 4. КОНЕЦ ТИТРОВ ===
      if (currentIndex >= creditsArray.length) {
        // Плавное исчезновение самих титров
        creditsScreen.style.opacity = "0";

        setTimeout(() => {
          creditsScreen.style.display = "none";
          creditsLogo.style.opacity = "0";

          // МАЙ ФИКС: Принудительно показываем главное меню,
          // если returnToMenuLogic спрятал его под черным экраном титров
          const mainMenu = document.getElementById("main-menu-screen");
          if (mainMenu) {
            mainMenu.style.opacity = "1";
            mainMenu.style.display = "flex";
            mainMenu.style.zIndex = "100"; // Убеждаемся, что меню сверху
          }

          // Принудительно включаем музыку меню, если она не заиграла
          if (
            window.audioManager &&
            typeof window.audioManager.playBGM === "function"
          ) {
            window.audioManager.playBGM("Last Destination");
          }
        }, 1000); // Ждем секунду, пока титры растворятся

        creditsScreen.onclick = null;
        window.sotaIsCreditsActive = false;
        window.removeEventListener("keydown", blockHotkeys, true);
        window.removeEventListener("keyup", blockHotkeys, true);

        return;
      } else {
        // === 5. ВСТАВКА ТЕКСТА И ПОДСКАЗКИ ===
        const lang =
          window.settingsManager && window.settingsManager.settings
            ? window.settingsManager.settings.language
            : "ru";

        const dict = window.settingsManager
          ? window.settingsManager.uiTranslations[lang]
          : null;

        const hintPc = dict
          ? dict.credits_hint_pc
          : "(Кликните по пустому месту, чтобы продолжить)";
        const hintMob = dict
          ? dict.credits_hint_mob
          : "(Коснитесь экрана, чтобы продолжить)";

        // Вот здесь мы подставляем ПЕРЕМЕННЫЕ вместо русского текста!
        creditsText.innerHTML =
          creditsArray[currentIndex] +
          `<div class="credits-continue-hint">
            <span class="desktop-hint">${hintPc}</span>
            <span class="mobile-hint">${hintMob}</span>
          </div>`;

        creditsText.style.opacity = "1";
        currentIndex++;

        setTimeout(() => {
          isAnimating = false;
        }, 500);
      }
    }, 500);
  }

  // Обработчик клика
  creditsScreen.onclick = (e) => {
    // Разрешаем переход по ссылкам!
    if (e.target && e.target.closest && e.target.closest("a")) return;

    if (window.playUISound) window.playUISound("open");
    showNextText();
  };
};

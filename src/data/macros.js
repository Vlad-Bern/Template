// macros.js
// Anime.js используется как глобальная переменная (подключена в index.html)
import { state } from "../core/state.js";

// --- СИСТЕМА ТОТАЛЬНОЙ БЛОКИРОВКИ ВВОДА (МАЙ-ЩИТ) ---
const silentBlock = (e) => {
  e.preventDefault();
  e.stopPropagation();
  e.stopImmediatePropagation();
};

const startInputBlock = () => {
  window.addEventListener("click", silentBlock, true);
  window.addEventListener("keydown", silentBlock, true);
  window.addEventListener("touchstart", silentBlock, true);
  window.addEventListener("touchmove", silentBlock, true);
  window.addEventListener("touchend", silentBlock, true);
  window.addEventListener("wheel", silentBlock, true);
  window.addEventListener("contextmenu", silentBlock, true);
};

const stopInputBlock = () => {
  window.removeEventListener("click", silentBlock, true);
  window.removeEventListener("keydown", silentBlock, true);
  window.removeEventListener("touchstart", silentBlock, true);
  window.removeEventListener("touchmove", silentBlock, true);
  window.removeEventListener("touchend", silentBlock, true);
  window.removeEventListener("wheel", silentBlock, true);
  window.removeEventListener("contextmenu", silentBlock, true);
};

// --- БИБЛИОТЕКА ПРЕДУСТАНОВЛЕННЫХ АНИМАЦИЙ ---
export const animations = {
  // Плавное появление снизу
  fadeInUp: (target) =>
    anime({
      targets: target,
      opacity: [0, 1],
      translateY: [50, 0],
      duration: 800,
      easing: "easeOutCubic",
    }),

  // Резкий вход слева
  slideInLeft: (target) =>
    anime({
      targets: target,
      opacity: [0, 1],
      translateX: [-200, 0],
      duration: 600,
      easing: "easeOutBack",
    }),

  // Медленное исчезновение
  fadeOut: (target) =>
    anime({
      targets: target,
      opacity: [1, 0],
      duration: 500,
      easing: "easeInQuad",
    }),

  // Психоделическая тряска (для шоковых моментов)
  psychoShake: (target) =>
    anime({
      targets: target,
      translateX: [
        { value: -10, duration: 50 },
        { value: 10, duration: 50 },
        { value: -8, duration: 50 },
        { value: 8, duration: 50 },
        { value: 0, duration: 100 },
      ],
      easing: "linear",
    }),

  // Селеста: холодный вход (эпический)
  epicEntrance: (target) =>
    anime
      .timeline()
      .add({
        targets: target,
        opacity: [0, 1],
        scale: [1.05, 1],
        duration: 1500,
        easing: "easeOutQuint",
      })
      .add(
        {
          targets: target,
          translateY: [0, -3, 0],
          duration: 3000,
          easing: "easeInOutSine",
          loop: true,
        },
        "-=1000",
      ),

  // Быстрый вход справа (агрессивный персонаж)
  slideInRight: (target) =>
    anime({
      targets: target,
      opacity: [0, 1],
      translateX: [200, 0],
      duration: 500,
      easing: "easeOutExpo",
    }),

  // Дополнительно: мягкое появление
  fadeIn: (target) =>
    anime({
      targets: target,
      opacity: [0, 1],
      duration: 1500,
      easing: "linear",
    }),

  heavyBreath: (target) =>
    anime({
      targets: target,
      scaleY: [1, 1.02, 1],
      scaleX: [1, 0.99, 1],
      duration: 2500,
      easing: "easeInOutSine",
      loop: true,
    }),

  dropDown: (target) =>
    anime({
      targets: target,
      translateY: [0, 150],
      duration: 400,
      easing: "easeInQuad",
      complete: () => {
        // Легкий отскок от удара об пол
        anime({
          targets: target,
          translateY: [150, 130, 150],
          duration: 300,
          easing: "easeOutQuad",
        });
      },
    }),

  heartbeat: (target) =>
    anime({
      targets: target,
      scale: [
        { value: 1.05, duration: 100, easing: "easeOutQuad" },
        { value: 1, duration: 100, easing: "easeInQuad" },
        { value: 1.05, duration: 100, easing: "easeOutQuad" },
        { value: 1, duration: 200, easing: "easeInQuad" },
      ],
      loop: true,
    }),
};

// --- МАКРОСЫ ДЛЯ УПРОЩЕНИЯ STORY.JS ---
export const m = {
  // Интерактивный блок внутри массива lines
  interact: (...interactables) => ({
    interactables: interactables.flat(),
  }),

  // Обычный выбор внутри lines или look.lines
  choice: (...choices) => ({
    choices: choices.flat(),
  }),

  // Эффекты на статы (ОБЕРНУТО В EFFECTS ДЛЯ СОВМЕСТИМОСТИ)
  sanity: (val) => ({ effects: { sanity: val } }),

  rank: (amount = 5) => ({ effects: { rank: amount } }),

  // --- АУДИО МАКРОСЫ ---
  bgm: (trackId, volume = 0.5) => ({
    audio: { type: "bgm", id: trackId, volume },
  }),

  sfx: (sfxId, volume = 1.0, loop = false) => ({
    audio: { type: "sfx", id: sfxId, volume: volume, loop: loop },
  }),

  stopBgm: (fade = 1000) => ({
    audio: { type: "stop", fade: fade },
  }),

  // 🔥 Выключить один зацикленный звук по id
  stopSfx: (id, fade = 500) => ({
    audio: { type: "stop_sfx", id, fade },
  }),

  // Запустить несколько SFX одновременно: m.sfxMix(["rain", 0.8, true], ["walking"])
  sfxMix: (...sounds) => ({
    audio: sounds.map((s) => ({
      type: "sfx",
      id: s[0],
      volume: s[1] !== undefined ? s[1] : 1.0,
      loop: s[2] || false,
    })),
  }),

  // Остановить несколько SFX одновременно: m.sfxMixStop("rain", "walking")
  // Второй аргумент fade — опциональный, по умолчанию 500мс
  sfxMixStop: (...ids) => ({
    audio: ids.map((id) => ({ type: "stop_sfx", id, fade: 500 })),
  }),

  show: (...args) => {
    let entries;

    // Старый формат для одного персонажа:
    // m.show("kagami", "neutral", "center", "fadeIn")
    if (typeof args[0] === "string") {
      const [
        id,
        emotion = "neutral",
        position = "center",
        anim = "fadeInUp",
        options = {},
      ] = args;

      entries = [
        {
          id,
          emotion,
          position,
          anim,
          ...options,
        },
      ];
    } else {
      // Новый формат для одного, двух или трёх персонажей:
      // m.show({ ... }, { ... }, { ... })
      entries = args.flat();
    }

    if (entries.length < 1 || entries.length > 3) {
      throw new Error(
        `[Macros] m.show expects from 1 to 3 characters, received ${entries.length}.`,
      );
    }

    const normalizedEntries = entries.map((entry, index) => {
      if (!entry || typeof entry !== "object") {
        throw new Error(
          `[Macros] Invalid character at position ${index + 1} in m.show.`,
        );
      }

      if (!entry.id) {
        throw new Error(
          `[Macros] Character at position ${index + 1} in m.show has no id.`,
        );
      }

      return {
        id: entry.id,
        emotion: entry.emotion ?? "neutral",
        position: entry.position ?? "center",
        anim: entry.anim ?? "fadeInUp",

        ...(entry.src ? { src: entry.src } : {}),
        ...(entry.name ? { name: entry.name } : {}),
      };
    });

    return {
      showCharacters: normalizedEntries,
    };
  },

  hide: (id, anim = "fadeOut") => ({
    hideCharacter: id,
    anim,
  }),

  hideAll: (anim = "fadeOut") => ({
    hideCharacters: "all",
    anim,
  }),

  // 🔥 МАЙ-ФИКС: Спасаем вторую часть пролога от вылета психо-тряски!
  psychoShake: (id) => ({
    shake: "medium", // Трясем экран для сочности эффекта
    action: () => {
      // Если это персонаж (а не Рен), то дополнительно заставляем вибрировать его спрайт
      if (id && id !== "ren" && typeof window.anime === "function") {
        // Ищем элемент спрайта по ID или дата-атрибутам новеллы
        const spriteElement = document.querySelector(
          `[data-id="${id}"], .char-${id}, #${id}`,
        );
        if (spriteElement) {
          window.anime({
            targets: spriteElement,
            translateX: [
              { value: -10, duration: 50 },
              { value: 10, duration: 50 },
              { value: -8, duration: 50 },
              { value: 8, duration: 50 },
              { value: 0, duration: 100 },
            ],
            easing: "linear",
          });
        }
      }
    },
  }),

  enter: (id, emotion, position, anim, statEffects = {}) => ({
    showCharacter: { id, emotion, position },
    anim,
    effects: statEffects,
  }),

  // Драма (тряска + звук + стресс)
  drama: (id, emotion, sfxId, sanityVal = 20) => ({
    ...m.show(id, emotion, "center", "psychoShake"),
    ...m.sfx(sfxId),
    ...m.sanity(-sanityVal),
    shake: "medium",
  }),

  // Универсальный вызов: m.fx({ darkness: 1, noise: 0.2, duration: 2000 })
  fx: ({ darkness, noise, vignette, duration = 1000 }) => ({
    fx: { darkness, noise, vignette, duration },
  }),

  // 🔥 УМНЫЙ МЕТОД ДЛЯ КИНЕМАТОГРАФИЧНЫХ ОГЛАВЛЕНИЙ (С полной блокировкой управления)
  playActCinematic: (
    firstChar,
    restOfWord,
    durationVisible = 2500,
    onCompleteCallback,
  ) => {
    const dialogWrapper = document.getElementById("dialog-wrapper");
    const creditsScreen = document.getElementById("credits-screen");
    const creditsLogo = document.getElementById("credits-logo");
    const creditsText = document.getElementById("credits-text");

    if (!creditsScreen || !creditsLogo) {
      if (onCompleteCallback) onCompleteCallback();
      return;
    }

    // 🛑 ВКЛЮЧАЕМБЛОКИРОВКУ: Никакие клики, клавиши и жесты телефона не пройдут!
    startInputBlock();

    if (dialogWrapper) dialogWrapper.style.display = "none";
    if (creditsText) creditsText.innerHTML = "";

    creditsScreen.style.display = "flex";
    creditsScreen.style.opacity = "1";
    creditsScreen.style.pointerEvents = "auto"; // Перебиваем none из main.js, чтобы блокировать ховеры кнопок под ним

    creditsLogo.style.opacity = "1";
    creditsLogo.style.display = "flex";
    creditsLogo.style.flexDirection = "column";
    creditsLogo.style.alignItems = "center";
    creditsLogo.style.justifyContent = "center";

    const isJapanese = /[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff]/.test(
      firstChar + restOfWord,
    );

    const fontStyle = isJapanese
      ? "'Meiryo', 'Hiragino Kaku Gothic ProN', 'Noto Sans JP', sans-serif"
      : "'Inter', sans-serif";
    const strokeStyle = isJapanese
      ? "1.2px rgba(0, 0, 0, 0.9)"
      : "2px rgba(0, 0, 0, 0.9)";
    const letterSpacing = isJapanese ? "0.4rem" : "0.8rem";
    const fontWeightTarget = isJapanese ? "400" : "300";

    creditsLogo.innerHTML = `
      <div class="sota-title-wrapper" style="display: flex; align-items: center; justify-content: center; font-size: 3.5rem; font-family: ${fontStyle}; letter-spacing: ${letterSpacing}; position: relative; white-space: nowrap;">
        <span class="first-letter" style="color: #ffffff; font-weight: 200; display: inline-block; transition: color 1s, text-shadow 1s, font-weight 1s, -webkit-text-stroke 1s;">${firstChar}</span>
        <span class="other-letters" style="color: #ffffff; font-weight: 200; display: inline-block; width: 0px; opacity: 0; overflow: hidden; white-space: nowrap; transition: color 1s, text-shadow 1s, font-weight 1s, -webkit-text-stroke 1s;">${restOfWord}</span>
      </div>
      <div class="corporate-line" style="height: 1px; background: linear-gradient(90deg, transparent, #ffffff, transparent); opacity: 0.7; margin-top: 25px; transform: scaleX(0); transform-origin: center; transition: background 1s, box-shadow 1s, height 1s;"></div>
    `;

    const firstLetter = creditsLogo.querySelector(".first-letter");
    const otherLetters = creditsLogo.querySelector(".other-letters");
    const corporateLine = creditsLogo.querySelector(".corporate-line");

    otherLetters.style.position = "absolute";
    otherLetters.style.width = "auto";
    otherLetters.style.opacity = "1";
    const exactWidth = otherLetters.offsetWidth;

    otherLetters.style.position = "static";
    otherLetters.style.width = "0px";
    otherLetters.style.opacity = "0";

    corporateLine.style.width = `${exactWidth + 120}px`;

    if (typeof anime === "function") {
      // Чистим старые наслоения анимаций при загрузке сейвов
      anime.remove(firstLetter);
      anime.remove(otherLetters);
      anime.remove(corporateLine);
      anime.remove([creditsLogo, creditsScreen]);

      const tl = anime.timeline({ easing: "easeOutQuint" });

      tl.add({
        targets: firstLetter,
        opacity: [0, 1],
        scale: [3.0, 1],
        duration: 900,
      });

      tl.add(
        {
          targets: otherLetters,
          width: [0, exactWidth],
          opacity: [0, 1],
          duration: 1100,
          delay: 100,
        },
        "-=300",
      );

      tl.add(
        {
          targets: corporateLine,
          scaleX: [0, 1],
          duration: 600,
          easing: "easeInOutQuad",
        },
        "-=600",
      );

      tl.add({
        targets: [firstLetter, otherLetters],
        opacity: [1, 1],
        duration: 1000,
        delay: 200,
        begin: () => {
          firstLetter.style.color = "#00ffff";
          firstLetter.style.fontWeight = fontWeightTarget;
          firstLetter.style.webkitTextStroke = strokeStyle;
          firstLetter.style.textShadow = "0 0 20px rgba(0, 255, 255, 0.5)";

          otherLetters.style.color = "#00ffff";
          otherLetters.style.fontWeight = fontWeightTarget;
          otherLetters.style.webkitTextStroke = strokeStyle;
          otherLetters.style.textShadow = "0 0 20px rgba(0, 255, 255, 0.5)";

          corporateLine.style.height = "2px";
          corporateLine.style.background =
            "linear-gradient(90deg, transparent, #00ffff, #0066ff, #00ffff, transparent)";
          corporateLine.style.boxShadow =
            "0 0 15px rgba(0, 255, 255, 0.8), 0 0 5px #0066ff";
        },
      });

      tl.add({
        targets: [creditsLogo, creditsScreen],
        opacity: 0,
        duration: 1000,
        delay: durationVisible,
        easing: "linear",
        complete: () => {
          creditsScreen.style.display = "none";
          if (dialogWrapper) dialogWrapper.style.display = "block";

          // 🔓 СНИМАЕМ БЛОК: Отдаем управление строго в момент загрузки следующей сцены
          stopInputBlock();
          if (onCompleteCallback) onCompleteCallback();
        },
      });
    } else {
      creditsScreen.style.display = "none";
      if (dialogWrapper) dialogWrapper.style.display = "block";
      stopInputBlock();
      if (onCompleteCallback) onCompleteCallback();
    }
  },

  // 🔥 МАКРОС: Черный экран смены дня (С точечным возвратом управления)
  dayTransition: (textString, visibleDuration = 1500) => ({
    action: () => {
      const dialogWrapper = document.getElementById("dialog-wrapper");
      if (dialogWrapper) dialogWrapper.style.display = "none";

      // 🛑 ВКЛЮЧАЕМ БЛОКИРОВКУ: Защита экрана до завершения всех анимаций
      startInputBlock();

      const overlay = document.createElement("div");
      overlay.id = "day-transition-screen";
      Object.assign(overlay.style, {
        position: "fixed",
        top: "0",
        left: "0",
        width: "100vw",
        height: "100vh",
        backgroundColor: "#000000",
        zIndex: "99999",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: "auto",
        opacity: "1",
        transition: "opacity 1s ease",
      });

      const text = document.createElement("div");
      text.innerHTML = textString;
      Object.assign(text.style, {
        fontFamily: "'Inter', sans-serif",
        fontSize: "3rem",
        fontWeight: "200",
        color: "#ffffff",
        letterSpacing: "0.8rem",
        opacity: "0",
        transition: "opacity 0.5s ease",
      });

      overlay.appendChild(text);
      document.body.appendChild(overlay);

      setTimeout(() => {
        text.style.opacity = "1";
      }, 100);

      setTimeout(() => {
        text.style.opacity = "0";
        overlay.style.opacity = "0";

        setTimeout(() => {
          overlay.remove();

          // Появилось диалоговое окно новеллы
          if (dialogWrapper) dialogWrapper.style.display = "block";

          // 🔓 ТОЧЕЧНЫЙ ВОЗВРАТ УПРАВЛЕНИЯ: Отдаем контроль игроку ровно в эту миллисекунду!
          stopInputBlock();

          // Автоматически пускаем текст дальше
          if (window.sm && typeof window.sm.nextLine === "function") {
            window.sm.nextLine();
          } else if (window.sm && typeof window.sm.next === "function") {
            window.sm.next();
          } else {
            const gameContainer =
              document.getElementById("game-container") || document.body;
            gameContainer.click();
          }
        }, 1000); // Время растворения оверлея
      }, visibleDuration);
    },
  }),
};

// === МАЙ: МАКРОСЫ ДЛЯ АДАПТИВНОЙ МУЗЫКИ ===
export const audioMacros = {
  // Запуск адаптивной музыки. Пример:
  // action: () => audioMacros.playStems({ calm: "bgm_school", scary: "bgm_school_tension" }, "calm")
  playStems: (stemTracks, initialLayer = "calm", volume = 0.5) => {
    const am = window.sm?.am || window.audioManager; // ← сначала sm.am
    if (am) am.playStemBGM(stemTracks, initialLayer, volume);
  },

  fadeToStem: (targetLayer, durationMs = 2000) => {
    const am = window.sm?.am || window.audioManager; // ← сначала sm.am
    if (am) am.crossfadeStems(targetLayer, durationMs);
  },
};

// --- СОКРАЩЕНИЯ ДЛЯ НАПИСАНИЯ ИСТОРИЙ ---

// Нарраторская реплика (без персонажа)
export const n = (text, extra = {}) => ({ speaker: "", text, ...extra });

// Реплика персонажа
export const say = (speaker, text, extra = {}) => ({ speaker, text, ...extra });

// Нарраторская реплика с эффектами одной строкой
// Пример: nfx("Темнота накрывает.", m.fx({ darkness: 1 }), m.sfx("heartbeat"))
export const nfx = (text, ...extras) =>
  Object.assign({ speaker: "", text }, ...extras);

// Реплика персонажа с эффектами одной строкой
// Пример: sf("kagami", "Встань.", m.sfx("chair_scrape"), m.sanity(-5))
export const sf = (speaker, text, ...extras) =>
  Object.assign({ speaker, text }, ...extras);

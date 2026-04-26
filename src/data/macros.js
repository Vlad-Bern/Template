// macros.js
// Anime.js используется как глобальная переменная (подключена в index.html)

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

  // 🔥 И добавляем новый макрос, чтобы было удобно выключать зацикленные звуки!
  stopSfx: (id, fade = 500) => ({
    audio: { type: "stop_sfx", id, fade },
  }),

  // В файле macros.js добавьте это:
  sfxMix: (...sounds) => ({
    audio: sounds.map((s) => ({
      type: "sfx",
      id: s[0],
      volume: s[1] !== undefined ? s[1] : 1.0,
      loop: s[2] || false,
    })),
  }),

  // --- ПЕРСОНАЖИ ---
  show: (id, emotion = "neutral", position = "center", anim = "fadeInUp") => ({
    showCharacter: { id, emotion, position },
    anim,
  }),

  hide: (id, anim = "fadeOut") => ({
    hideCharacter: id,
    anim,
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
};

// === МАЙ: МАКРОСЫ ДЛЯ АДАПТИВНОЙ МУЗЫКИ ===
export const audioMacros = {
  // Запуск адаптивной музыки. Пример:
  // action: () => audioMacros.playStems({ calm: "bgm_school", scary: "bgm_school_tension" }, "calm")
  playStems: (stemTracks, initialLayer = "calm", volume = 0.5) => {
    if (window.audioManager) {
      window.audioManager.playStemBGM(stemTracks, initialLayer, volume);
    }
  },

  // Плавный переход в другой слой. Пример:
  // action: () => audioMacros.fadeToStem("scary", 3000)
  fadeToStem: (targetLayer, durationMs = 2000) => {
    if (window.audioManager) {
      window.audioManager.crossfadeStems(targetLayer, durationMs);
    }
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

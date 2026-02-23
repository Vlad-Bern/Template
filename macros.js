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
  celesteEntrance: (target) =>
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

  sfx: (sfxId, volume = 1.0) => ({
    audio: { type: "sfx", id: sfxId, volume },
  }),

  stopBgm: (fadeDuration = 1000) => ({
    audio: { type: "stop", fade: fadeDuration },
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
  fx: ({ darkness, noise, duration = 1000 }) => ({
    fx: { darkness, noise, duration },
  }),
};

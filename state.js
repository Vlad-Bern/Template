// src/core/state.js
export const state = {
  config: {
    typewriterSpeed: 30,
    textGlitchChance: 0.15,
  },
  hero: {
    stats: {
      physique: 50,
      willpower: 70,
      dominance: 0,
      stress: 0,

      // ВОТ ОНИ, РОДНЫЕ:
      fear: 0,
      rank: 0,
      influence: 0,
      submission: 0,
    },
    flags: {
      isBroken: false,
      metCeleste: false,
    },
  },
  current: {
    sceneId: "start_scene",
    dialogueIndex: 0,
  },
};

// Алиасы для удобства
const STAT_ALIAS = {
  submission: "stress",
  subinance: "stress",
  submissiveness: "stress",
};

export function updateStat(statName, value) {
  const key = STAT_ALIAS[statName] ?? statName;
  if (state.hero.stats.hasOwnProperty(key)) {
    // Если value - это объект типа { set: 0 }, то устанавливаем жестко
    if (typeof value === "object" && value.set !== undefined) {
      state.hero.stats[key] = value.set;
    } else if (statName === "stress" && value === 0) {
      // Хак специально для твоего стори: m.stress(0) теперь ОБНУЛЯЕТ
      state.hero.stats[key] = 0;
    } else {
      state.hero.stats[key] += value;
    }

    state.hero.stats[key] = Math.max(0, Math.min(100, state.hero.stats[key]));
    window.dispatchEvent(new CustomEvent("stateChanged"));
  }
}

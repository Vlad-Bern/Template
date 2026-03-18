export const state = {
  hero: {
    name: "Ren",
    rank_letter: "D",
    rank_score: 20,
    credits: 100,
    stats: {
      dominance: -10,
      sanity: 80,
      physique: 50,
    },
    inventory: { items: {} },
  },
  relations: {},
  flags: {},
  temp: {},
};

const STAT_LIMITS = {
  dominance: { min: -100, max: 100 },
  sanity: { min: 0, max: 100 },
  physique: { min: 0, max: 100 },
  rank_score: { min: 0, max: 100 },
};

export function updateStat(stat, value) {
  if (typeof value !== "number") {
    console.error(`Хозяин, значение для ${stat} должно быть числом!`);
    return;
  }

  if (state.hero.stats && Object.hasOwn(state.hero.stats, stat)) {
    state.hero.stats[stat] += value;
    if (STAT_LIMITS[stat]) {
      const { min, max } = STAT_LIMITS[stat];
      state.hero.stats[stat] = Math.max(
        min,
        Math.min(max, state.hero.stats[stat]),
      );
    }
  } else if (Object.hasOwn(state.hero, stat)) {
    state.hero[stat] += value;
    if (STAT_LIMITS[stat]) {
      const { min, max } = STAT_LIMITS[stat];
      state.hero[stat] = Math.max(min, Math.min(max, state.hero[stat]));
    }
  } else {
    console.warn(`Стат ${stat} не найден!`);
    return;
  }

  if (stat === "sanity") {
    // +++ ФИКС: больше не лезем в DOM из state — диспатчим событие
    window.dispatchEvent(
      new CustomEvent("stressUpdated", {
        detail: { sanity: state.hero.stats.sanity },
      }),
    );
  }

  if (stat === "rank_score") {
    updateRankLetter();
  }

  window.dispatchEvent(new CustomEvent("statsUpdated"));
}

export function updateRankLetter() {
  const score = state.hero.rank_score;
  if (score >= 95) state.hero.rank_letter = "S";
  else if (score >= 80) state.hero.rank_letter = "A";
  else if (score >= 60) state.hero.rank_letter = "B";
  else if (score >= 40) state.hero.rank_letter = "C";
  else state.hero.rank_letter = "D";
}

export function setFlag(flagName, value = true) {
  state.flags[flagName] = value;
}

// +++ ФИКС: было === true, теперь ловим любое truthy-значение
export function getFlag(flagName) {
  return !!state.flags[flagName];
}

export function removeFlag(flagName) {
  if (Object.hasOwn(state.flags, flagName)) {
    delete state.flags[flagName];
  }
}

// +++ ФИКС: rank_letter теперь инициализируется корректно из rank_score, не хардкодом
updateRankLetter();

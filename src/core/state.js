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

  let newValue = 0; // МАЙ: Сюда сохраним итоговое значение для лога

  if (state.hero.stats && Object.hasOwn(state.hero.stats, stat)) {
    state.hero.stats[stat] += value;
    if (STAT_LIMITS[stat]) {
      const { min, max } = STAT_LIMITS[stat];
      state.hero.stats[stat] = Math.max(
        min,
        Math.min(max, state.hero.stats[stat]),
      );
    }
    newValue = state.hero.stats[stat]; // Запомнили
  } else if (Object.hasOwn(state.hero, stat)) {
    state.hero[stat] += value;
    if (STAT_LIMITS[stat]) {
      const { min, max } = STAT_LIMITS[stat];
      state.hero[stat] = Math.max(min, Math.min(max, state.hero[stat]));
    }
    newValue = state.hero[stat]; // Запомнили
  } else {
    console.warn(`Стат ${stat} не найден!`);
    return;
  }

  // === МАЙ: Красивый лог изменения статов ===
  // Если значение прибавилось, цвет зелёный. Если убавилось — красный.
  const color = value > 0 ? "#4ade80" : "#ff4d4f";
  const sign = value > 0 ? "+" : "";
  console.log(
    `%c[Статы] %c${stat.toUpperCase()} %c${sign}${value} %c(Стало: ${newValue})`,
    "color: #a78bfa; font-weight: bold;", // Цвет тега [Статы]
    "color: #fff;", // Цвет имени стата
    `color: ${color}; font-weight: bold;`, // Цвет изменения (+/-)
    "color: #9ca3af; font-style: italic;", // Цвет итогового значения
  );

  // === Твоя старая логика событий ===
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
  // Проверяем, изменилось ли значение
  const oldValue = state.flags[flagName];
  if (oldValue !== value) {
    state.flags[flagName] = value;
    // +++ МАЙ: Логируем изменение флага в консоль для дебага
    console.log(
      `[STATE] 🚩 Флаг изменён: "${flagName}" | Было: ${oldValue} -> Стало: ${value}`,
    );
  }
}

export function removeFlag(flagName) {
  if (Object.hasOwn(state.flags, flagName)) {
    delete state.flags[flagName];
    // +++ МАЙ: Логируем удаление флага
    console.log(`[STATE] 🗑️ Флаг удалён: "${flagName}"`);
  }
}

// +++ ФИКС: было === true, теперь ловим любое truthy-значение
export function getFlag(flagName) {
  return !!state.flags[flagName];
}

// +++ ФИКС: rank_letter теперь инициализируется корректно из rank_score, не хардкодом
updateRankLetter();

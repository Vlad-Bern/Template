export const state = {
  hero: {
    name: "Ren",
    rank: "D",
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

export function updateStat(stat, value) {
  // 1. Проверяем вложенные статы (dominance, sanity и т.д.)
  if (state.hero.stats && state.hero.stats.hasOwnProperty(stat)) {
    state.hero.stats[stat] += value;
    // Ограничиваем dominance (-100 до 100) и sanity (0 до 100)
    if (stat === "dominance")
      state.hero.stats[stat] = Math.max(
        -100,
        Math.min(100, state.hero.stats[stat]),
      );
    if (stat === "sanity")
      state.hero.stats[stat] = Math.max(
        0,
        Math.min(100, state.hero.stats[stat]),
      );
  }
  // 2. Проверяем корень объекта героя (rank)
  else if (state.hero.hasOwnProperty(stat)) {
    state.hero[stat] += value;
    // Ограничиваем ранг (0 до 100)
    if (stat === "rank")
      state.hero[stat] = Math.max(0, Math.min(100, state.hero[stat]));
  } else {
    console.warn(`Стат ${stat} не найден ни в stats, ни в корне героя!`);
  }

  // Вызываем событие обновления UI, если оно у тебя есть
  window.dispatchEvent(new CustomEvent("statsUpdated"));
}

export function setFlag(flagName, value = true) {
  state.flags[flagName] = value;
}

export function getFlag(flagName) {
  return state.flags[flagName] === true;
}

export function removeFlag(flagName) {
  if (state.flags.hasOwnProperty(flagName)) {
    delete state.flags[flagName];
  }
}

export function updateStressVisuals(sanityValue) {
  const app = document.getElementById("app");
  if (!app) {
    return;
  }

  // Сначала чистим
  app.classList.remove("stress-low", "stress-med", "stress-high");
  app.style.removeProperty("--stress-val"); // Чистим переменную CSS

  // Вычисляем фактор стресса (0.0 - 1.0) для CSS
  const stressFactor = (100 - sanityValue) / 100;
  app.style.setProperty("--stress-val", stressFactor);

  // Применяем классы
  if (sanityValue <= 20) {
    app.classList.add("stress-high");
  } else if (sanityValue <= 50) {
    app.classList.add("stress-med");
  } else if (sanityValue <= 80) {
    // Добавил легкий стресс
    app.classList.add("stress-low");
  }
}

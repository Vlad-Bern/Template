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
};

export function updateStat(statName, value) {
  const heroStats = state.hero.stats;
  if (heroStats[statName] !== undefined) {
    heroStats[statName] += value;

    // Ограничиваем sanity от 0 до 100
    if (statName === "sanity") {
      heroStats[statName] = Math.max(0, Math.min(100, heroStats[statName]));
    }
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

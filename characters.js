export const characters = {
  ren: {
    name: "Рен",
    color: "#cccccc", // Нейтральный серый (протагонист)
  },

  celeste: {
    name: "Селеста",
    color: "#b19cd9", // Цвет её имени в диалогах
    sprites: {
      neutral: "/chars/celeste.png",
      cold: "./chars/celeste_cold.png",
      dominant: "/chars/celeste_dominant.png",
    },
  },

  kagami: {
    name: "Кагами",
    color: "#ff7f50", // Коралловый (теплый, но тревожный)
    sprites: {
      neutral: "assets/chars/kagami/neutral.png",
      drunk: "assets/chars/kagami/drunk.png",
      tired: "assets/chars/kagami/tired.png",
      serious: "assets/chars/kagami/serious.png",
    },
  },

  mystery: { name: "???", color: "#ffffff" },
  driver: { name: "Водитель", color: "#aaaaaa" },
};

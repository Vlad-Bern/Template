import { getFlag } from "../core/state.js";

export const characters = {
  ren: {
    name: "Рен",
    color: "#cccccc", // Нейтральный серый (протагонист)
  },

  celeste: {
    name: getFlag("knowsCeleste") ? "Селеста" : "???",
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
      neutral: "/chars/kagami/neutral.webp",
      neutral2: "/chars/kagami/neutral2.webp",
      drunk: "/chars/kagami/drunk.png",
      tired: "assets/chars/kagami/tired.png",
      serious: "assets/chars/kagami/serious.png",
    },
  },

  kaira: {
    name: getFlag("knowsKaira") ? "Кайра" : "???",
    color: "#b30000",
    sprites: {
      neutral: "assets/sprites/kaira/neutral.png",
      smug: "assets/sprites/kaira/smug.png",
      blush: "assets/sprites/kaira/blush.png",
      shocked: "assets/sprites/kaira/shocked.png",
      messy: "assets/sprites/kaira/messy.png",
    },
  },

  akane: {
    name: getFlag("knowsAkane") ? "Аканэ" : "???",
    color: "#ff6600",
    sprites: {
      neutral: "assets/sprites/akane/neutral.png",
      angry: "assets/sprites/akane/angry.png",
      crazy: "assets/sprites/akane/crazy.png",
    },
  },
  rin: {
    name: getFlag("knowsRin") ? "Рин" : "???",
    color: "#0033cc",
    sprites: {
      neutral: "assets/sprites/rin/neutral.png",
      strict: "assets/sprites/rin/strict.png",
    },
  },
  livia: {
    name: getFlag("knowsLivia") ? "Ливия" : "???",
    color: "#33cc33",
    sprites: {
      neutral: "assets/sprites/livia/neutral.png",
      concerned: "assets/sprites/livia/concerned.png",
    },
  },
  aiden: {
    name: getFlag("knowsAiden") ? "Эйден" : "???",
    color: "#999999",
    sprites: {
      neutral: "assets/sprites/aiden/neutral.png",
    },
  },

  mia: {
    name: getFlag("knowsMia") ? "Мия" : "???",
    color: "#ff99cc",
    sprites: {
      shaking: "assets/sprites/pink_girl/shaking.png",
    },
  },

  // Внутри characters.js
  death: {
    name: "Смертница ли Смерть",
    color: "#ff3366", // Ядовито-розовый/красный цвет для контраста с её белой комнатой
    sprites: {
      neutral: "assets/chars/death/neutral.png",
      happy: "assets/chars/death/happy.png",
      crazy: "assets/chars/death/crazy.png",
      angry: "assets/chars/death/angry.png",
      smirk: "assets/chars/death/smirk.png",
      lewd: "assets/chars/death/lewd.png",
      smug: "assets/chars/death/smug.png",
    },
  },

  mystery: { name: "???", color: "#ffffff" },
  driver: { name: "Водитель", color: "#aaaaaa" },
};

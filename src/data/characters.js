export const characters = {
  ren: {
    name: "Рен",
    color: "#cccccc",
  },
  celeste: {
    name: "Селеста",
    color: "#b19cd9",
    sprites: {
      neutral: "assets/chars/celeste/neutral.png",
      cold: "assets/chars/celeste/cold.png",
      dominant: "assets/chars/celeste/dominant.png",
    },
  },
  kagami: {
    name: "Кагами",
    color: "#ff7f50",
    requiresFlag: "knowsKagami",
    sprites: {
      neutral: "/chars/kagami/neutral.webp",
      neutral2: "/chars/kagami/neutral2.webp",
      angry: "/chars/kagami/angry.webp",
      tired: "/chars/kagami/tired.webp",
    },
  },
  kaira: {
    name: "Кайра",
    color: "#b30000",
    sprites: {
      neutral: "assets/chars/kaira/neutral.webp",
      smug: "assets/chars/kaira/smug.webp",
      blush: "assets/chars/kaira/blush.webp",
      shocked: "assets/chars/kaira/shocked.webp",
      messy: "assets/chars/kaira/messy.webp",
    },
  },
  akane: {
    name: "Аканэ",
    color: "#ff6600",
    sprites: {
      neutral: "assets/chars/akane/neutral.webp",
      angry: "assets/chars/akane/angry.webp",
      crazy: "assets/chars/akane/crazy.webp",
    },
  },
  rin: {
    name: "Рин",
    color: "#0033cc",
    sprites: {
      neutral: "assets/chars/rin/neutral.webp",
      strict: "assets/chars/rin/strict.webp",
    },
  },
  livia: {
    name: "Ливия",
    color: "#33cc33",
    sprites: {
      neutral: "assets/chars/livia/neutral.webp",
      concerned: "assets/chars/livia/concerned.webp",
    },
  },
  aiden: {
    name: "Эйден",
    color: "#999999",
    sprites: {
      neutral: "assets/chars/aiden/neutral.webp",
    },
  },
  mia: {
    name: "Мия",
    color: "#ff99cc",
    sprites: {
      shaking: "assets/chars/pink_girl/shaking.webp",
    },
  },
  death: {
    name: "Смертница ли Смерть",
    color: "#ff3366", // Ядовито-розовый/красный цвет
    sprites: {
      neutral: "assets/chars/death/neutral.webp",
      happy: "assets/chars/death/happy.webp",
      crazy: "assets/chars/death/crazy.webp",
      angry: "assets/chars/death/angry.webp",
      smirk: "assets/chars/death/smirk.webp",
      lewd: "assets/chars/death/lewd.webp",
      smug: "assets/chars/death/smug.webp",
    },
  },
  mystery: {
    name: "???",
    color: "#ffffff",
    // Спрайтов нет, uiManager и characterManager это проглотят без ошибок
  },
  driver: {
    name: "Водитель",
    color: "#aaaaaa",
  },
};

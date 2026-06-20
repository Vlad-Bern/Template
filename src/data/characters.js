export const characters = {
  ren: {
    name: { ru: "Рен", en: "Ren", ja: "レン" },
    color: "#cccccc",
  },
  celeste: {
    name: "Селеста",
    color: "#b19cd9",
    requiresFlag: "knowsCeleste",
    rank: "S",
    room: "2-D",
    photo: "assets/chars/kaira/pda_photo.webp",
    sprites: {
      neutral: "assets/chars/celeste/neutral.png",
      cold: "assets/chars/celeste/cold.png",
      dominant: "assets/chars/celeste/dominant.png",
    },
    role: "student",
  },

  kagami: {
    name: { ru: "Кагами", en: "Kagami", ja: "鏡" },
    color: "#ff7f50",
    requiresFlag: "knowsKagami",
    rank: "B",
    room: "2-B",
    subject: "Современная литература",
    sprites: {
      neutral: "/chars/kagami/neutral.webp",
      neutral2: "/chars/kagami/neutral2.webp",
      angry: "/chars/kagami/angry.webp",
      tired: "/chars/kagami/tired.webp",
    },
    role: "teacher",
  },

  shiroko: {
    id: "shiroko",
    requiresFlag: "knowsShiroko",
    room: "2-A",
    subject: "Физкультура",
    name: {
      ru: "Широко",
      en: "Shiroko",
      ja: "羽矢多",
    },
    color: "#b82e2e", // Элегантный темно-красный для доминантного физрука
    sprites: {
      neutral: "/chars/kagami/neutral.webp",
      neutral2: "/chars/kagami/neutral2.webp",
      angry: "/chars/kagami/angry.webp",
      tired: "/chars/kagami/tired.webp",
    },
    role: "teacher",
  },

  kaira: {
    name: "Кайра",
    color: "#b30000",
    requiresFlag: "knowsKaira",
    rank: "B",
    room: "2-B",
    sprites: {
      neutral: "assets/chars/kaira/neutral.webp",
      smug: "assets/chars/kaira/smug.webp",
      blush: "assets/chars/kaira/blush.webp",
      shocked: "assets/chars/kaira/shocked.webp",
      messy: "assets/chars/kaira/messy.webp",
    },
    role: "student",
  },

  akane: {
    name: "Аканэ",
    color: "#ff6600",
    requiresFlag: "knowsAkane",
    rank: "C",
    room: "2-B",
    sprites: {
      neutral: "assets/chars/akane/neutral.webp",
      angry: "assets/chars/akane/angry.webp",
      crazy: "assets/chars/akane/crazy.webp",
    },
    role: "student",
  },

  yukino: {
    name: "Юкино Шиба",
    color: "#0033cc",
    requiresFlag: "knowsYukino",
    rank: "A",
    room: "2-B",
    sprites: {
      neutral: "assets/chars/rin/neutral.webp",
      strict: "assets/chars/rin/strict.webp",
    },
    role: "student",
  },

  livia: {
    name: "Ливия",
    color: "#33cc33",
    requiresFlag: "knowsLivia",
    rank: "B",
    room: "2-B",
    sprites: {
      neutral: "assets/chars/livia/neutral.webp",
      concerned: "assets/chars/livia/concerned.webp",
    },
    role: "student",
  },

  aiden: {
    name: "Эйден",
    color: "#999999",
    requiresFlag: "knowsAiden",
    rank: "A",
    room: "2-B",
    sprites: {
      neutral: "assets/chars/aiden/neutral.webp",
    },
    role: "student",
  },

  mia: {
    name: "Мия",
    color: "#ff99cc",
    requiresFlag: "knowsMia",
    rank: "C",
    room: "2-B",
    sprites: {
      shaking: "assets/chars/pink_girl/shaking.webp",
    },
    role: "student",
  },

  death: {
    name: "Смертница ли Смерть",
    color: "#ff3366",
    requiresFlag: "knowsDeath",
    rank: "A",
    room: "2-T",
    sprites: {
      neutral: "assets/chars/death/neutral.webp",
      happy: "assets/chars/death/happy.webp",
      crazy: "assets/chars/death/crazy.webp",
      angry: "assets/chars/death/angry.webp",
      smirk: "assets/chars/death/smirk.webp",
      lewd: "assets/chars/death/lewd.webp",
      smug: "assets/chars/death/smug.webp",
    },
    role: "student",
  },

  mystery: {
    name: "???",
    color: "#ffffff",
  },

  driver: {
    name: { ru: "Водитель", en: "Driver", ja: "運転手" },
    color: "#aaaaaa",
  },
};

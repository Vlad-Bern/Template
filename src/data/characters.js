export const characters = {
  ren: {
    name: { ru: "Рен", en: "Ren", ja: "レン" },
    fullName: {
      ru: "Рен Амано",
      en: "Ren Amano",
      ja: "天野レン",
    },
    color: "#cccccc",
    photo: "/chars/ren/pda.webp",
    rank: "D",
    room: "2-B",
    locker: 34,
  },

  celeste: {
    name: {
      ru: "Селеста",
      en: "Celeste",
      ja: "セレステ",
    },
    fullName: {
      ru: "Селеста Ля Кроикс",
      en: "Celeste La Croix",
      ja: "セレステ・ラ・クロワ",
    },
    color: "#b19cd9",
    requiresFlag: "knowsCeleste",
    rank: "S",
    room: "2-D",
    photo: "/chars/celeste/pda.webp",
    sprites: {
      neutral: "assets/chars/celeste/neutral.png",
      cold: "assets/chars/celeste/cold.png",
      dominant: "assets/chars/celeste/dominant.png",
    },
    role: "student",
  },

  kagami: {
    name: { ru: "Кагами", en: "Kagami", ja: "鏡" },
    fullName: {
      ru: "Кагами Саэ",
      en: "Sae Kagami",
      ja: "鏡 冴",
    },
    color: "#ff7f50",
    requiresFlag: "knowsKagami",
    room: "2-B",
    photo: "/chars/kagami/pda.webp",
    subject: {
      ru: "Современная литература",
      en: "Modern Literature",
      ja: "現代文学",
    },
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
    name: {
      ru: "Широко",
      en: "Shiroko",
      ja: "シロコ",
    },
    fullName: {
      ru: "Широко Хаята",
      en: "Hayata Shiroko",
      ja: "シロコ 羽矢多",
    },
    color: "#b82e2e",
    requiresFlag: "knowsShiroko",
    room: "2-A",
    photo: "/chars/shiroko/pda.webp",
    subject: {
      ru: "Физкультура",
      en: "Physical Education",
      ja: "体育",
    },
    sprites: {
      neutral: "/chars/shiroko/neutral.webp",
      shocking: "/chars/shiroko/shocking.webp",
      angry: "/chars/shiroko/angry.webp",
      mockery: "/chars/shiroko/mockery.webp",
    },
    role: "teacher",
  },

  kaira: {
    name: {
      ru: "Кайра",
      en: "Kaira",
      ja: "カイラ",
    },
    fullName: {
      ru: "Кайра Вельт",
      en: "Kaira Welt",
      ja: "カイラ・ヴェルト",
    },
    color: "#b30000",
    requiresFlag: "knowsKaira",
    rank: "B",
    room: "2-B",
    photo: "/chars/kaira/pda.webp",
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
    name: {
      ru: "Аканэ",
      en: "Akane",
      ja: "アカネ",
    },
    fullName: {
      ru: "Аканэ Фудзи",
      en: "Akane Fuji",
      ja: "富士アカネ",
    },
    color: "#ff6600",
    requiresFlag: "knowsAkane",
    rank: "C",
    room: "2-B",
    photo: "/chars/akane/pda.webp",
    sprites: {
      neutral: "assets/chars/akane/neutral.webp",
      angry: "/chars/akane/angry.webp",
      crazy: "assets/chars/akane/crazy.webp",
    },
    role: "student",
  },

  yukino: {
    name: {
      ru: "Юкино",
      en: "Yukino",
      ja: "ユキノ",
    },
    fullName: {
      ru: "Юкино Шиба",
      en: "Yukino Shiba",
      ja: "柴ユキノ",
    },
    color: "#0033cc",
    requiresFlag: "knowsYukino",
    rank: "A",
    room: "2-B",
    photo: "/chars/yukino/pda.webp",
    sprites: {
      neutral: "assets/chars/rin/neutral.webp",
      strict: "assets/chars/rin/strict.webp",
    },
    role: "student",
  },

  livia: {
    name: {
      ru: "Ливия",
      en: "Livia",
      ja: "リヴィア",
    },
    fullName: {
      ru: "Ливия Кобояши",
      en: "Livia Kobayashi",
      ja: "小林リヴィア",
    },
    color: "#33cc33",
    requiresFlag: "knowsLivia",
    rank: "B",
    room: "2-B",
    photo: "/chars/livia/pda.webp",
    sprites: {
      neutral: "assets/chars/livia/neutral.webp",
      concerned: "assets/chars/livia/concerned.webp",
    },
    role: "student",
  },

  aiden: {
    name: {
      ru: "Эйден",
      en: "Aiden",
      ja: "エイデン",
    },
    fullName: {
      ru: "Эйден Куроки",
      en: "Aiden Kuroki",
      ja: "黒木エイデン",
    },
    color: "#999999",
    requiresFlag: "knowsAiden",
    rank: "A",
    room: "2-B",
    photo: "/chars/aiden/pda.webp",
    sprites: {
      neutral: "assets/chars/aiden/neutral.webp",
    },
    role: "student",
  },

  mia: {
    name: {
      ru: "Мия",
      en: "Mia",
      ja: "ミア",
    },
    fullName: {
      ru: "Мия Сиратори",
      en: "Mia Shiratori",
      ja: "白鳥ミア",
    },
    color: "#ff99cc",
    requiresFlag: "knowsMia",
    rank: "C",
    room: "2-B",
    photo: "/chars/mia/pda.webp",
    sprites: {
      shaking: "assets/chars/pink_girl/shaking.webp",
    },
    role: "student",
  },

  death: {
    name: {
      ru: "Смертница ли Смерть",
      en: "Doomed Girl or Death",
      ja: "死にゆく少女か、死そのものか",
    },
    fullName: {
      ru: "???",
      en: "???",
      ja: "???",
    },
    color: "#ff3366",
    requiresFlag: "knowsDeath",
    rank: "A",
    room: "2-T",
    photo: "/chars/death/pda.webp",
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

import { m } from "./macros.js";

export const story = {
  // === ПРОЛОГ: ДОПРОС В ТЕМНОТЕ ===
  prologue_interrogation: {
    id: "prologue_interrogation",
    ...m.bgm("tension", 0.3),
    lines: [
      { speaker: "???", text: "Рен." },
      { speaker: "???", text: "Слышишь меня?" },
      { speaker: "Рен", text: "Да..." },
      {
        speaker: "",
        text: "*Человек приблизился ко мне... Я чувствую запах дорогого табака.*",
        ...m.sfx("step_slow"),
      },
      {
        speaker: "Рен",
        text: "*Я попытался пошевелиться. Руки... они не двигаются.*",
      },
      { speaker: "Рен", text: "*Я связан.*", ...m.stress(10) },
      { speaker: "???", text: "Понимаешь, почему связан?" },
    ],
    // После всех диалогов — выбор
    choices: [
      { text: "Да... Наверное.", next: "prologue_contract" },
      { text: "[Молчать]", next: "prologue_contract" },
    ],
  },

  // === СЦЕНА: КРОВАВЫЙ КОНТРАКТ ===
  prologue_contract: {
    id: "prologue_contract",
    lines: [
      {
        speaker: "???",
        text: "По-хорошему мы должны вот-вот передать тебя полиции.",
      },
      {
        speaker: "???",
        text: "Тебя бы ждало славное времяпрепровождение на ближайшие года.",
      },
      { speaker: "Рен", text: "..." },
      { speaker: "???", text: "Но вот какой я могу дать тебе выбор." },
      { speaker: "???", text: "Ты несомненно можешь пойти в тюрьму." },
      { speaker: "???", text: "Или же..." },
      {
        speaker: "",
        text: "*Человек положил передо мной документ и иглу.*",
        ...m.sfx("metal_clink"),
      },
      { speaker: "???", text: "Подпишешь эту бумажку." },
      { speaker: "???", text: "Тебя переведут в место получше." },
      { speaker: "Рен", text: "Что за место?" },
      { speaker: "???", text: "Место для таких же 'особенных' как и ты." },
    ],
    choices: [
      { text: "Хорошо...", next: "prologue_sign" },
      {
        text: "Пошел ты к чёрту! [Требует Dominance 80]",
        next: "bad_end",
        req: { stat: "dominance", value: 80 },
      },
    ],
  },

  // === СЦЕНА: ПОДПИСАНИЕ И КОШМАР ===
  prologue_sign: {
    id: "prologue_sign",
    lines: [
      {
        speaker: "",
        text: "*Человек развязал мою руку и ткнул иглой в палец.*",
        ...m.sfx("stab_sound"),
        ...m.stress(30),
      },
      { speaker: "???", text: "Подписывай." },
      { speaker: "???", text: "Кровью.", ...m.sfx("drip_drop") },
      { speaker: "Рен", text: "Кровью...?", ...m.stress(40) },
      { speaker: "Рен", text: "Это не нормально." },
      { speaker: "???", text: "Не нормально?" },
      {
        speaker: "???",
        text: "А ПО-ТВОЕМУ НОРМАЛЬНО БЫЛО...",
        ...m.stress(80),
        ...m.sfx("glitch_start"),
        anim: "psychoShake",
      },
      {
        speaker: "???",
        text: "%$#@! УБИВАТЬ ИХ ВОТ ТАК?! %$#@!",
        ...m.stress(100),
        ...m.sfx("scream_glitch"),
      },
    ],
    next: "bus_wakeup", // Автоматический переход к пробуждению
  },

  // === СЦЕНА: ПРОБУЖДЕНИЕ В АВТОБУСЕ ===
  bus_wakeup: {
    id: "bus_wakeup",
    ...m.bgm("rain_loop", 0.6),
    ...m.stress(0), // Сброс
    anim: "fadeIn",
    lines: [
      { speaker: "", text: "..." },
      { speaker: "Рен", text: "*Тяжёлое дыхание...*" },
      {
        speaker: "Рен",
        text: "*Сердце колотится так, будто хочет проломить ребра.*",
        ...m.sfx("heartbeat_slow"),
      },
      {
        speaker: "Рен",
        text: "*Опять этот сон. Он становится всё детальнее.*",
      },
      {
        speaker: "",
        text: "*Я вытер холодный пот со лба. За окном автобуса хлестал дождь.*",
      },
      { speaker: "Рен", text: "Где я...?" },
    ],
    next: "bus_arrival",
  },

  // === СЦЕНА: ВСТРЕЧА С ВОДИТЕЛЕМ ===
  bus_arrival: {
    id: "bus_arrival",
    lines: [
      { speaker: "Водитель", text: "Конечная." },
      { speaker: "Водитель", text: "Сектор Зеро. Школа для 'особенных'." },
      {
        speaker: "",
        text: "*Двери автобуса с шипением открылись. В салон ворвался влажный ветер.*",
        ...m.sfx("bus_door_open"),
      },
      { speaker: "Водитель", text: "Эй, парень." },
      {
        speaker: "",
        text: "*Он посмотрел на меня через зеркало заднего вида. Глаз не было видно за тенью козырька.*",
      },
      {
        speaker: "Водитель",
        text: "Молись, чтобы тебя не кинули к 'Псам' на Юг. Там хотя бы убивают быстро.",
      },
    ],
    choices: [
      {
        text: "Выйти в дождь",
        next: "arrival_gate",
        effects: { willpower: 5 },
      },
    ],
  },
};

import { m } from "../macros.js";
import { state, setFlag, getFlag, removeFlag } from "../../core/state.js";
import { audioMacros } from "../macros.js";

export const story = {
  prologue_interrogation: {
    id: "prologue_interrogation",
    bg: "./bg/common/dream_man.webp",
    ...m.bgm("Zero Rank", 0.5),

    lines: [
      {
        speaker: "mystery",
        text: "Рен.",
        action: () => m.fx({ darkness: 1, noise: 1, duration: 0 }),
      },
      {
        speaker: "mystery",
        text: "Ты меня слышишь?",
      },

      {
        speaker: "ren",
        text: "Да...",
        action: () => m.fx({ darkness: 0.9, noise: 0.2, duration: 500 }),
      },
      {
        speaker: "",
        text: "Силуэт в деловом костюме сидит напротив. Я чувствую запах табака",
      },
      {
        speaker: "",
        text: "Я попытался дернуться, но бесполезно. Руки привязаны к подлокотникам.",
        ...m.sfx("rope_struggle_chair", 0.8),
        action: () => m.fx({ darkness: 1, noise: 0.2, duration: 500 }),
      },
      { speaker: "", text: "Я в ловушке." },
      {
        speaker: "mystery",
        text: "Ты понимаешь, почему ты здесь?",
        action: () => m.fx({ darkness: 0.8, noise: 0.5, duration: 500 }),
      },
    ],
    choices: [
      { text: "Смутно.", next: "prologue_contract" },
      { text: "...", next: "prologue_contract" },
    ],
  },

  prologue_contract: {
    id: "prologue_contract",
    bg: "./bg/common/dream_man.webp",
    lines: [
      {
        speaker: "mystery",
        text: "Статья 134. Умышленное причинение тяжкого вреда здоровью. Плюс сопротивление при аресте.",
      },
      {
        speaker: "mystery",
        text: "Рен, твои действия ведут прямиком в колонию строго режима.",
        action: () => m.fx({ darkness: 0.7, noise: 0.4, duration: 500 }),
      },
      { speaker: "ren", text: "..." },
      { speaker: "mystery", text: "Но у меня есть альтернатива." },
      {
        speaker: "mystery",
        text: "Частная школа 'Синсю'. Закрытое учреждение для коррекции поведения.",
      },
      { speaker: "mystery", text: "Или тюрьма. Выбор за тобой." },
      {
        speaker: "",
        text: "Человек положил на стол документ и тонкую иглу.",
        ...m.sfx("paper_needle_drop", 0.8),
        bg: "./bg/common/dream_table.webp",
        action: () => {
          window.sm.ui.showDocument(true);
          m.fx({ darkness: 0.3, noise: 0.5, duration: 500 });
        },
      },
      { speaker: "mystery", text: "Заявление о добровольном переводе." },
      { speaker: "mystery", text: "Решай." },
    ],
    choices: [
      { text: "Хорошо...", next: "prologue_sign" },
      {
        text: "Нет.",
        req: { dominance: 80 },
      },
    ],
  },

  prologue_sign: {
    id: "prologue_sign",
    bg: "./bg/common/dream_table.webp",

    lines: [
      {
        speaker: "",
        text: "Он освободил мою правую руку. Я медленно потянулся к ручке на столе, но он перехватил моё запястье.",
      },
      { speaker: "mystery", text: "Не ручкой, Рен." },

      {
        speaker: "",
        text: "Резкий укол в подушечку пальца. Я даже не успел дернуться.",
        ...m.sfx("needle_pierce_gasp", 0.8),
        action: () => m.fx({ darkness: 0.5, noise: 0.7, duration: 500 }),
      },
      { speaker: "ren", text: "Мх.." },
      {
        speaker: "mystery",
        text: "Твоё согласие должно быть абсолютным. Биологическим.",
        action: () => m.fx({ darkness: 0.6, noise: 0.3, duration: 500 }),
      },
      {
        speaker: "",
        text: "Алая капля упала на бумагу. Моя кровь впиталась.",
        ...m.sanity(-30),
      },
      { speaker: "mystery", text: "Вот так. Теперь всё будет по-другому." },
      {
        speaker: "mystery",
        text: "Тебе там понравится, Рен.",

        bg: "./bg/dream_man.webp",
        action: () => {
          window.sm.ui.showDocument(false);
          m.fx({ darkness: 0.3, noise: 0.5, duration: 500 });
        },
      },
      {
        speaker: "mystery",
        text: "Рано или поздно, понравится",
        ...m.sfx("noise", 0.2, true),
        action: () => m.fx({ darkness: 0.3, noise: 0.8, duration: 500 }),
      },
      {
        speaker: "mystery",
        text: "Особенно м%я ?:чь С%№;?;!", // Глитч-голос демона
        ...m.sanity(-80),
        anim: "psychoShake",
        action: () => m.fx({ darkness: 0.3, noise: 0.9, duration: 500 }),
      },
      {
        speaker: "mystery",
        text: "Най%; :№, Рен.",
        ...m.sanity(-100),
        action: () => m.fx({ darkness: 0, noise: 1, duration: 500 }),
      },
    ],
    next: "bus_wakeup",
  },

  bus_wakeup: {
    id: "bus_wakeup",
    bg: "/bg/common/school_bus_wakeup.webp",
    audio: [
      { type: "stop", fade: 500 },
      { type: "stop_sfx", id: "noise", fade: 500 },
      { type: "sfx", id: "heartbeat", volume: 1, loop: true },
      { type: "sfx", id: "tinnitus", volume: 0.3, loop: true },
    ],
    anim: "fadeIn",
    lines: [
      {
        action: () => m.fx({ darkness: 1, noise: 0.5, duration: 100 }),
        speaker: "",
        text: "...",
        ...m.sanity(100),
      },
      {
        speaker: "",
        text: "Ох...",
        action: () => m.fx({ darkness: 0.3, noise: 0, duration: 500 }),
      },
      {
        speaker: "",
        text: "Я приехал?",
      },
      {
        speaker: "",
        text: "Автобус стоял неподвижно. Шум двигателя смешался с монотонным стуком дождя по окну.",
        audio: [
          { type: "sfx", id: "muffled_rain", volume: 0.8, loop: true },
          { type: "sfx", id: "bus_interior", volume: 0.3, loop: true },
          { type: "stop_sfx", id: "heartbeat", fade: 500 },
          { type: "stop_sfx", id: "tinnitus", fade: 500 },
        ],
      },
      { speaker: "driver", text: "Конечная." },
      {
        speaker: "",
        text: "Я выглянул в окно. Сквозь стекло виднелись массивные бетонные стены.",
        bg: "/bg/common/school_bus.webp",
      },
      {
        speaker: "ren",
        text: "Это... моя новая школа?",
      },
      {
        speaker: "driver",
        text: "Нулевой сектор.",
      },
      {
        speaker: "",
        text: "Двери автобуса с шипением открылись, впуская в салон запах мокрого асфальта.",
        ...m.sfx("bus_door_open", 0.5),
      },
      {
        speaker: "driver",
        text: "Быстрее.",
      },
      {
        speaker: "",
        text: "Он посмотрел на меня через зеркало заднего вида. Глаз не было видно за тенью козырька.",
      },
      {
        speaker: "ren",
        text: "Иду...",
        bg: "/bg/common/school_bus_choice.webp",
      },
    ],
    interactables: [
      {
        type: "exit",
        label: "Выйти из автобуса",
        pos: { x: 20, y: 70 },
        next: "meet_kagami",
      },
    ],
  },

  meet_kagami: {
    id: "meet_kagami",

    bg: "/bg/common/synsu_enterence.webp",
    audio: [
      { type: "sfx", id: "rain", volume: 0.2, loop: true },
      { type: "stop_sfx", id: "muffled_rain", fade: 500 },
      { type: "stop_sfx", id: "bus_interior", fade: 500 },
    ],
    lines: [
      {
        ...m.show("kagami", "neutral", "center", "fadeIn"),
        speaker: "",
        text: "Стоило мне выйти из автобуса, как меня встретила она...",
      },
      {
        speaker: "",
        text: "Пышногрудая милфа лет тридцати с уставшим взглядом и тугим хвостом темных волос. От неё попахивает винишком.",
      },
      { speaker: "ren", text: "Здравствуйте, я..." },
      {
        speaker: "kagami",
        text: "Амано Рен, знаю.",
      },
      {
        speaker: "",
        text: "Лил дождь. Она подошла ко мне — близко, но не интимно — и протянула отдельный зонтик.",
        ...m.sfx("umbrella_open"),
      },
      {
        speaker: "kagami",
        text: "Меня зовут Кагами Саэ.",
        action: () => setFlag("knowsKagami"),
        ...m.bgm("Rest till you there"),
      },
      {
        ...m.show("kagami", "neutral2", "center"),
        speaker: "kagami",
        text: "Позади меня — академия Синсю. Поздравляю с приездом, Амано.",
      },
      { speaker: "ren", text: "Да, спасибо. Зовите меня просто Рен." },
      {
        speaker: "kagami",
        text: "Вот так сразу по имени?",
        ...m.show("kagami", "neutral", "center"),
      },
      { speaker: "ren", text: "М, да, мне так привычнее." },
      {
        speaker: "kagami",
        text: "Хорошо, далее тебя ждет небольшой тест на способности. Прошу за мной.",
      },
      {
        speaker: "",
        text: "И мы двинулись.",
        ...m.sfx("step_puddle"),
        bg: "/bg/cg/prologue/ren_kagami_walk.webp",
        hideCharacter: "kagami",
        anim: "slideOutRight",
      },
      {
        speaker: "",
        text: "Я шёл чуть позади, и мой взгляд то и дело падал на её бедра.",
      },
      {
        speaker: "",
        text: "Это несколько успакаивает..",
      },
      {
        speaker: "",
        text: "Я бы за них крепко схватился и ...",
      },
      {
        speaker: "",
        text: "Мне нужно заставить себя поднять взгляд.",
      },
      {
        speaker: "ren",
        text: "Кагами-сенсей, расскажите про эту школу. Меня перевели из маленького городка...",
      },
      {
        speaker: "ren",
        text: "Я даже не знаю, за какие заслуги мне дали такую возможность.",
      },
      { speaker: "kagami", text: "Заслуги? Здесь нет заслуг прошлого." },
      {
        speaker: "kagami",
        text: "Есть только потенциал, который ты либо реализуешь, либо...",
      },
      { speaker: "kagami", text: "Либо нет." },
      {
        speaker: "kagami",
        text: "Ты первый, кто вторгся в середине семестра. Обычно здесь учатся с самого начала, так что ты уже выделился.",
      },
      { speaker: "ren", text: "Вот оно как..." },
      {
        speaker: "",
        text: "Пока мы шли, боковым зрением я заметил нечто... неправильное. Силуэт в тени бетона.",
        audio: [{ type: "stop", fade: 500 }],
      },
      { speaker: "ren", text: "Чё за...", ...m.sanity(-5) },
      {
        speaker: "",
        text: "Я остановился. Мой взгляд уставился в одну точку.",
      },
      {
        speaker: "",
        text: "Ученица. Полностью обнаженная. Её кожа была бледной.",
        bg: "/bg/cg/prologue/punished_girl_main.webp",
        action: () => m.fx({ vignette: 1, duration: 1500 }),
      },
      {
        speaker: "",
        text: "От столба тянулась цепь. Она уходила прямо к ошейнику на её тонкой шее.",
        ...m.sfx("chain_rattle_faint"),
      },
      {
        speaker: "",
        text: "Она сидела неподвижно, обняв колени. Вода стекала по её спутанным волосам, капая на грязный бетон.",
      },
      {
        speaker: "",
        text: "И эта сцена была совсем недалко от центрального входа.",
        ...m.sanity(-5),
      },
      {
        speaker: "kagami",
        text: "Рен, ты чего застыл?",
        bg: "/bg/cg/prologue/kagami_lookback.webp",
        action: () => m.fx({ vignette: 0, duration: 3000 }),
      },
      {
        speaker: "",
        text: "Голос Кагами звучал буднично, совершенно спокойно.",
      },
      {
        speaker: "ren",
        text: "Я...",
        bg: "/bg/cg/prologue/kagami_girl_choice.webp",
      },
    ],
    interactables: [
      {
        type: "look",
        action: () => {
          setFlag("sawChainedGirl");
        },
        label: "Подойти ближе к ученице",
        pos: { x: 65, y: 80 },
        effects: { rank_score: -1, dominance: 1 },
        next: "approach_girl",
      },
      {
        type: "exit",
        label: "Идти дальше",
        pos: { x: 40, y: 50 },
        effects: { rank_score: -1, dominance: -2 },
        next: "ignore_girl",
      },
    ],
  },

  approach_girl: {
    id: "approach_girl",
    bg: "/bg/cg/prologue/kagami_lookback.webp",
    lines: [
      { speaker: "ren", text: "Эмм, я сейчас..." },
      {
        speaker: "",
        text: "Я сделал шаг с дорожки. Грязь чавкнула под ботинками. Кагами тяжело вздохнула позади, но не остановила меня.",
        ...m.sfx("step_slow"),
        bg: "/bg/cg/prologue/punished_girl_main.webp",
        action: () => m.fx({ vignette: 1, duration: 1500 }),
      },
      {
        speaker: "",
        text: "С каждым шагом детали становились четче. Странная белая жидкость на ступнях. Нету даже намёка на одежду.",
      },
      {
        speaker: "",
        text: "Она услышала меня. Медленно подняла голову.",
        bg: "/bg/cg/prologue/punished_girl_lookup.webp",
        action: () => m.fx({ vignette: 0, duration: 3000 }),
      },
      {
        speaker: "",
        text: "Она смотрит на меня. Такими спокойными глазами...",
      },
      {
        speaker: "",
        text: "Или они беспкойные? Не могу определиться.",
      },
      {
        speaker: "",
        text: "Теперь я стою почти в плотную к ней.",
        ...m.sanity(-5),
      },
      { speaker: "", text: "Что мне сделать...?" },
    ],
    choices: [
      {
        text: "Поговорить",
        next: "talk_to_girl",
      },
      {
        text: "Попытаться помочь",
        effects: { rank_score: -2, dominance: 1 },
        next: "help_girl",
      },
      {
        text: "Рассмеяться ей в лицо",
        req: { stat: "dominance", value: 15 },
        next: "laugh_at_girl",
      },
      {
        text: "Сексуальное действие",
        req: { stat: "dominance", value: 30 },
        next: "inspect_girl",
      },
    ],
  },

  ignore_girl: {
    id: "ignore_girl",
    bg: "/bg/cg/prologue/kagami_lookback.webp",
    lines: [
      { speaker: "", text: "Я отвернулся." },
      { speaker: "ren", text: "Эмм, ничего. Идемте." },
      {
        speaker: "",
        text: "Что это было? Часть теста? Психологическая проверка? Если я отреагирую — я провалюсь?",
        ...m.sanity(-5),
        bg: "/bg/cg/prologue/ren_kagami_walk.webp",
      },
      {
        speaker: "",
        text: "Мы шли еще минуту, пока не дошли до маленькой пристройки.",
      },
    ],
    next: "quiz_intro",
  },

  talk_to_girl: {
    id: "talk_to_girl",
    lines: [
      { speaker: "ren", text: "Эй, что с тобой? Почему ты голая?" },
      {
        speaker: "mystery",
        text: "А почему ты одетый?",
        bg: "/bg/cg/prologue/punished_girl_lookup_talk.webp",
        bgSpeed: 50,
      },
      { speaker: "ren", text: "?" },
      {
        speaker: "mystery",
        text: "Я вот нарушила правила.",
      },
      {
        speaker: "mystery",
        text: "Но я хотела просто обнять...",
        bg: "/bg/cg/prologue/punished_girl_blush.webp",
        bgSpeed: 50,
      },
      {
        speaker: "mystery",
        text: "А меня повязали и прицепили сюда.",
      },
      {
        speaker: "mystery",
        text: "Теперь я обнимаюсь с кем скажут.",
        bg: "/bg/cg/prologue/punished_girl_lookup_talk.webp",
        bgSpeed: 50,
      },
      {
        speaker: "mystery",
        text: "Хахаха!",
        bg: "/bg/cg/prologue/punished_girl_laugh.webp",
        bgSpeed: 50,
      },
      {
        speaker: "",
        text: "Она рассмеялась...",
      },
      {
        speaker: "",
        text: "И тут же начала тянуться рукой ко мне",
      },
      {
        speaker: "mystery",
        text: "Ну а ты? Тоже за мной, да?!",
        bg: "/bg/cg/prologue/punished_girl_stretches.webp",
        bgSpeed: 50,
      },
      {
        speaker: "mystery",
        text: "Тоже хочешь меня схватить?!",
      },
      {
        speaker: "",
        text: "Я начал пятиться назад, но она уже зацепилась за мою кофту.",
        bg: "/bg/cg/prologue/punished_girl_grab.webp",
        bgSpeed: 50,
      },
      {
        speaker: "ren",
        text: "Вот блядь, отпусти!",
      },
      {
        speaker: "",
        text: "Однако она не слушала меня и продолжала подползать ближе, натягивая цепь.",
      },
      {
        speaker: "",
        text: "БАМ! Мне прилетел удар зонтом по затылку. Не сильный, но отрезвляющий.",
        ...m.sfx("hit_umbrella"),
        anim: "psychoShake",
        bg: "/bg/cg/prologue/punished_girl_letgo.webp",
        bgSpeed: 50,
      },
      {
        speaker: "",
        text: "Девчонка отпустила меня и вернулась на место.",
      },
      {
        speaker: "kagami",
        text: "Рен, отойди от мусора.",
        ...m.show("kagami", "angry", "center"),
        bg: "/bg/locations/synsu_entrance.webp",
      },
      { speaker: "ren", text: "Ай..." },
      { speaker: "", text: "Это..." },
      { speaker: "ren", text: "Это пиздец..." },
      {
        speaker: "",
        text: "Кагами схватила меня за руку и потащила прочь.",
      },
      {
        speaker: "kagami",
        text: "Кто тебе разрешал бродить где попало? Мы идем на тестирование.",
        ...m.show("kagami", "tierd", "center"),
      },
      {
        speaker: "",
        text: "Она предлагает мне просто забыть об этом? Пока мы шли, я пытался остудить голову.",
      },
    ],
    next: "quiz_intro",
  },

  help_girl: {
    id: "help_girl",
    lines: [
      {
        speaker: "",
        text: "Это... кошмар. Я осматриваю цепь.",
        bg: "/bg/cg/prologue/punished_girl_help.webp",
        bgSpeed: 50,
      },
      { speaker: "ren", text: "Эй, кто сделал это с тобой?" },
      {
        speaker: "",
        text: "Цепь плотно закреплена на столбе и тянется прямо к ошейнику на её шее.",
      },
      {
        speaker: "ren",
        text: "Э-эй, не молчи. Ты знаешь где ключ? Как тебя освободить?",
      },
      {
        speaker: "mystery",
        text: "Ключ? Ммм... Никто не знает, где ключи. Иначе мои подруги...",
        bg: "/bg/cg/prologue/punished_girl_lookup_talk.webp",
        bgSpeed: 50,
      },
      {
        speaker: "mystery",
        text: "Освободили бы меня! Ахахах!",
        bg: "/bg/cg/prologue/punished_girl_laugh.webp",
        bgSpeed: 50,
      },

      { speaker: "", text: "Я опешил от её смеха." },
      { speaker: "ren", text: "Как мне помочь тебе?" },
      {
        speaker: "mystery",
        text: "Ты хоешь мне помочь, мальчик?",
        bg: "/bg/cg/prologue/punished_girl_lookup_talk.webp",
        bgSpeed: 50,
      },
      { speaker: "", text: "Она медленно раздвинула ноги." },
      {
        speaker: "mystery",
        text: "Лижи.",
        bg: "/bg/cg/prologue/punished_girl_spred.webp",
        bgSpeed: 50,
        dialogStyle: "transparent",
      },
      { speaker: "ren", text: "...Что?" },
      {
        speaker: "mystery",
        text: "Помой меня хорошенько.",
      },
      {
        speaker: "mystery",
        text: "Мне это сейчас очень нужно.",
      },
    ],
    choices: [
      {
        text: "Облизнуться",
        effects: { dominance: 2, sanity: -3 },
        next: "lick_reaction",
      },
      {
        text: "Отшатнуться",
        next: "recoil_reaction",
      },
    ],
  },

  lick_reaction: {
    id: "lick_reaction",
    lines: [
      {
        speaker: "",
        text: "Я попытался отвернуться, но не смог. Взгляд упал на её мокрую промежность.",
      },
      { speaker: "", text: "Она возбуждена... И её щёлка явно потрёпана." },
      { speaker: "", text: "Девчонка лежит с высунутым языком." },
      {
        speaker: "",
        text: "Ох... Мой член... Он реагирует.",
        ...m.sanity(-10),
      },
      {
        speaker: "kagami",
        text: "РЕН!",
        ...m.show("kagami", "angry", "center"),
        bg: "/bg/locations/synsu_entrance.webp",
        dialogStyle: "normal",
      },
      { speaker: "", text: "Резкий рывок за руку вернул меня в реальность." },
    ],
    next: "dragged_away",
  },

  recoil_reaction: {
    id: "recoil_reaction",
    lines: [
      { speaker: "", text: "Боже правый, что с ней не так?!" },
      { speaker: "ren", text: "Да ни за что! Какого хера ты вообще..." },
      {
        speaker: "kagami",
        text: "РЕН!",
        ...m.show("kagami", "angry", "center"),
        bg: "/bg/locations/synsu_entrance.webp",
        dialogStyle: "normal",
      },
      { speaker: "", text: "Резкий рывок за руку прервал меня." },
    ],
    next: "dragged_away",
  },

  dragged_away: {
    id: "dragged_away",
    lines: [
      {
        speaker: "kagami",
        text: "Кто тебе разрешал отходить? Нам пора.",
        ...m.show("kagami", "tierd", "center"),
      },
      {
        speaker: "",
        text: "Она тащила меня прочь, словно нашкодившего щенка.",
      },
      {
        speaker: "",
        text: "Она хочет, чтобы я забыл увиденное? Да это же безумие...",
      },
      {
        speaker: "",
        text: "Мы шли еще минуту, пока не добрались до маленькой пристройки.",
      },
    ],
    next: "quiz_intro",
  },

  quiz_intro: {
    id: "quiz_intro",
    hideCharacter: "kagami",
    bg: "/bg/common/quiz_room.webp",
      action: () =>
          audioMacros.playStems(
            {
              base: "Willbreaker",
              muffled: "Willbreaker_muffled",
            },
            "base",
            0.5,
          ),
    lines: [
      {
        speaker: "",
        text: "Мы вошли внутрь... Стерильное место, белые стены.",
      },
      {
        speaker: "",
        text: "Они отражают эту комнату.",
      },
      {
        speaker: "",
        text: "Два стола стоят напротив друг друга и одна доска.",
        action: () => audioMacros.fadeToStem("muffled", 2000),
      },
      { speaker: "kagami", text: "Присаживайся." },
      { speaker: "", text: "На парте уже лежит бумага и ручка." },
      { speaker: "kagami", text: "Пока что не переворачивай листок." },
      {
        speaker: "",
        text: "Я сел за парту.",
        bg: "/bg/common/quiz_room_noKagami.webp",
      },
      {
        speaker: "",
        text: "Кагами сложила наши зонты в корзину и села напротив меня.",
        bg: "/bg/common/quiz_room_kagamiSpeak.webp",
        bgSpeed: 50,
      },
      {
        speaker: "kagami",
        text: "Правила простые, у тебя 20 минут, чтобы ответить на 8 вопросов.",
      },
      {
        speaker: "kagami",
        text: "Чтобы пройти тест, хотя бы 4 должны быть правильными.",
      },
      {
        speaker: "kagami",
        text: "Как только закончишь — положи ручку на парту и подними руку.",
      },
      {
        speaker: "kagami",
        text: "Других учеников хоть и нет, но золотое правило каждого теста или экзамена — молчание.",
      },
      {
        speaker: "kagami",
        text: "Как только перевернёшь листок — таймер пойдёт.",
      },
      { speaker: "kagami", text: "Вопросы?" },
      { speaker: "", text: "Думаю лишь один, самый логичный." },
      { speaker: "ren", text: "А если не отвечу?" },
      { speaker: "kagami", text: "Провалишь тест и вернёшься откуда пришёл." },
      { speaker: "", text: "Нет, это не вариант..." },
    ],
    interactables: [
      {
        type: "look",
        label: "Перевернуть листок",
        pos: { x: 50, y: 90 },
        action: () => {
          // --- ИНИЦИАЛИЗАЦИЯ ТЕСТА ---
          if (!state.temp) {
            state.temp = {};
          }

          // Обнуляем счетчик правильных ответов
          state.temp.quizScore = 0;

          // --- ТАЙМЕР НА 20 МИНУТ (1 200 000 мс) ---
          window.quizTimer = new PausableTimeout(() => {
            window.dispatchEvent(
              new CustomEvent("loadScene", { detail: "quiz_afk_fail" }),
            );
          }, 1200000);
        },
        next: "quiz_q1",
      },
    ],
  },

  // ============================================
  // === ВОПРОС 1 ===
  // ============================================
  quiz_q1: {
    id: "quiz_q1",
    bg: "/bg/common/quiz_room_paper.webp",
    lines: [
      {
        speaker: "",
        text: "Вопрос 1: Какой гормон отвечает за формирование поведения подчинения при длительном социальном давлении?",
      },
      { speaker: "", text: "A) Кортизол" },
      { speaker: "", text: "B) Окситоцин" },
      { speaker: "", text: "C) Тестостерон" },
      { speaker: "", text: "D) Серотонин" },
      { speaker: "", text: "....." },
      { speaker: "", text: "Чего нах..?" },
    ],
    choices: [
      { text: "Вписать ответ", next: "quiz_q1_pick" },
      {
        text: "Задать вопрос Кагами",
        effects: { dominance: 1 },
        next: "quiz_q1_warn",
      },
    ],
  },

  quiz_q1_warn: {
    id: "quiz_q1_warn",
    bg: "/bg/common/quiz_room_kagamiSpeak.webp",
    lines: [
      { speaker: "ren", text: "Кагами-сен..." },
      {
        speaker: "",
        text: "Кагами стукнула по столу. Не сильно, не от злости, а просто, чтобы заткнуть меня.",
        shake: "medium",
      },
      { speaker: "kagami", text: "Ещё раз нарушишь правило и провалишь." },
      {
        speaker: "",
        text: "Да вы вопросы эти читали? Может это подстава? Она перепутала бумаги?",
      },
      { speaker: "", text: "… Ладно, ничего сейчас не остаётся." },
    ],
    next: "quiz_q1_pick",
  },

  quiz_q1_pick: {
    id: "quiz_q1_pick",
    bg: "/bg/common/quiz_room_paper.webp",
    lines: [{ speaker: "", text: "Выбираю наугад." }],
    choices: [
      { text: "А. Кортизол", next: "quiz_q2" },
      {
        text: "Б. Окситоцин",
        action: () => {
          state.temp.quizScore++;
        },
        next: "quiz_q2",
      }, // ✅
      { text: "В. Тестостерон", next: "quiz_q2" },
      { text: "Г. Серотонин", next: "quiz_q2" },
    ],
  },

  // ============================================
  // === ВОПРОС 2 ===
  // ============================================
  quiz_q2: {
    id: "quiz_q2",
    lines: [
      {
        speaker: "",
        text: "Вопрос 2: Какой показатель наименее надёжен для оценки искреннего согласия?",
      },
      { speaker: "", text: "A) Вербальное 'да'" },
      { speaker: "", text: "B) Поза тела" },
      { speaker: "", text: "C) Пульс/дыхание" },
      { speaker: "", text: "D) Последовательность действий после события" },
      {
        speaker: "",
        text: "… Значит это был не единственный такой вопрос? Я готов решить квадратное уравнение, но что это такое?!",
      },
      {
        speaker: "",
        bg: "/bg/common/quiz_room_kagamiPhone.webp",
        text: "Я поднял глаза на Кагами. Она просто смотрит в телефон. Она знает, что здесь не академические вопросы?",
      },
      {
        speaker: "",
        text: "Никакой реакции с её стороны, она просто следит за порядком.",
      },
    ],
    choices: [
      {
        text: "Продолжить пялиться",
        action: () => setFlag("kagamiStare"),
        effects: { dominance: 3 },
        next: "quiz_q2_stare",
      },
      { text: "Перейти к ответу", next: "quiz_q2_pick" },
    ],
  },

  quiz_q2_stare: {
    id: "quiz_q2_stare",
    lines: [
      {
        speaker: "",
        text: "Хмф, ну раз вы молчите и даже не удосужились меня предупредить о таких вопросах, то думаю можно отомстить и полюбоваться.",
      },
      {
        speaker: "",
        text: "Я смотрю на её грудь под красной блузкой.",
        bg: "/bg/cg/prologue/quiz_room_boobs.webp",
        dialogStyle: "transparent",
      },
      {
        speaker: "",
        text: " Она такая пышная, охренеть...",
      },
      {
        speaker: "",
        text: "Какой у неё вообще размер? Они не меньше четвёртого.",
      },
      { speaker: "", text: "Какого их потрогать?" },
      {
        speaker: "",
        text: "Кому-то ведь она в своей жизни давала их полапать?",
      },
      {
        speaker: "",
        text: "Довольно отчётлево я вижу и тёмный бюстгальтер, который выглядывает из под блузки...",
      },
      { speaker: "", text: "Кагами, да вы меня соблазняете?" },
      {
        speaker: "",
        text: "Член твердеет, натягивая мои штаны, но под партой этого не видно.",
      },
      {
        speaker: "",
        text: "Я приулыбнулся, посмотрел ей в глаза....",
        bg: "/bg/common/quiz_room_kagamiPhone.webp",
        dialogStyle: "normal",
      },
      {
        speaker: "",
        text: "0 эмоций, её кажется ничего не заботит. Ни возбуждения, ни отвращения.",
      },
      { speaker: "", text: "Блять, время, точно!" },
    ],
    next: "quiz_q2_pick",
  },

  quiz_q2_pick: {
    id: "quiz_q2_pick",
    bg: "/bg/common/quiz_room_paper.webp",
    lines: [{ speaker: "", text: "Ладно. Ответ..." }],
    choices: [
      {
        text: "A) Вербальное 'да'",
        action: () => {
          state.temp.quizScore++;
        },
        next: "quiz_q3",
      }, // ✅
      { text: "B) Поза тела", next: "quiz_q3" },
      { text: "C) Пульс", next: "quiz_q3" },
      { text: "D) Последовательность действий после события", next: "quiz_q3" },
    ],
  },

  // ============================================
  // === ВОПРОС 3 ===
  // ============================================
  quiz_q3: {
    id: "quiz_q3",
    lines: [
      {
        speaker: "",
        text: "Вопрос 3: При одинаковых вводных, доля субъектов, которые меняют линию поведения после первого наказания (в пределах 72 часов), составляет:",
      },
      { speaker: "", text: "A) 18%" },
      { speaker: "", text: "B) 37%" },
      { speaker: "", text: "C) 61%" },
      { speaker: "", text: "D) 84%" },
      {
        speaker: "",
        text: "О чём вообще идёт речь? Я в это даже вдумываться не хочу.",
      },
    ],
    choices: [
      { text: "A) 18%", next: "quiz_q4" },
      { text: "B) 37%", next: "quiz_q4" },
      {
        text: "C) 61%",
        action: () => {
          state.temp.quizScore++;
        },
        next: "quiz_q4",
      }, // ✅
      { text: "D) 84%", next: "quiz_q4" },
    ],
  },

  // ============================================
  // === ВОПРОС 4 ===
  // ============================================
  quiz_q4: {
    id: "quiz_q4",
    lines: [
      {
        speaker: "",
        text: "Вопрос 4: Какое действие усиливает эффект принуждения сильнее всего при прочих равных?",
      },
      { speaker: "", text: "A) Объяснение причин" },
      { speaker: "", text: "B) Лишение выбора в мелочах" },
      { speaker: "", text: "C) Повышение голоса" },
      { speaker: "", text: "D) Присутствие свидетелей" },
      {
        speaker: "",
        text: "Каждый новый вопрос всё меньше поражает меня. Это то, что ученики здесь проходят?",
      },
    ],
    choices: [
      { text: "A) Объяснение причин", next: "quiz_q5" },
      {
        text: "B) Лишение выбора в мелочах",
        action: () => {
          state.temp.quizScore++;
        },
        next: "quiz_q5",
      }, // ✅
      { text: "C) Повышение голоса", next: "quiz_q5" },
      { text: "D) Присутствие свидетелей", next: "quiz_q5" },
    ],
  },

  // ============================================
  // === ВОПРОС 5 ===
  // ============================================
  quiz_q5: {
    id: "quiz_q5",
    lines: [
      {
        speaker: "",
        text: "Вопрос 5: Какое вещество используется в качестве базового агента при добровольной коррекции поведения?",
      },
      { speaker: "", text: "A) Мидазолам" },
      { speaker: "", text: "B) Налтрексон" },
      { speaker: "", text: "C) Флуоксетин" },
      { speaker: "", text: "D) Окситоцин синтетический" },
      {
        speaker: "",
        text: "А впрочем, что раньше я отвечал наугад, что сейчас. Ничего не изменилось.",
      },
    ],
    choices: [
      { text: "А. Мидазолам", next: "quiz_q6" },
      { text: "Б. Налтрексон", next: "quiz_q6" },
      { text: "В. Флуоксетин", next: "quiz_q6" },
      {
        text: "Г. Окситоцин синтетический",
        action: () => {
          state.temp.quizScore++;
        },
        next: "quiz_q6",
      }, // ✅
    ],
  },

  // ============================================
  // === ВОПРОС 6 ===
  // ============================================
  quiz_q6: {
    id: "quiz_q6",
    lines: [
      {
        speaker: "",
        text: "Вопрос 6: Какое из состояний наиболее продуктивно для обучаемого?",
      },
      { speaker: "", text: "A) Спокойствие и уверенность" },
      { speaker: "", text: "B) Лёгкая тревога" },
      { speaker: "", text: "C) Острый страх" },
      { speaker: "", text: "D) Полное безразличие" },
      { speaker: "", text: "Этот кажется лёгким и даже адекватным." },
    ],
    choices: [
      { text: "А. Спокойствие и уверенность", next: "quiz_q7" },
      { text: "Б. Лёгкая тревога", next: "quiz_q7" },
      {
        text: "В. Острый страх",
        action: () => {
          state.temp.quizScore++;
        },
        next: "quiz_q7",
      }, // ✅
      { text: "Г. Полное безразличие", next: "quiz_q7" },
    ],
  },

  // ============================================
  // === ВОПРОС 7 ===
  // ============================================
  quiz_q7: {
    id: "quiz_q7",
    lines: [
      {
        speaker: "",
        text: "Вопрос 7: Минимальный порог болевого воздействия для коррекции поведенческой девиации составляет?",
      },
      { speaker: "", text: "A) 2–4 Н/см²" },
      { speaker: "", text: "B) 8–12 Н/см²" },
      { speaker: "", text: "C) 15–20 Н/см²" },
      { speaker: "", text: "D) Индивидуален, стандарт неприменим" },
      { speaker: "", text: "Это даже не смешно уже." },
    ],
    choices: [
      {
        text: "А. 2–4 Н/см²",
        next: "quiz_q8",
      },
      {
        text: "Б. 8–12 Н/см²",
        next: "quiz_q8",
      },
      {
        text: "В. 15–20 Н/см²",
        next: "quiz_q8",
      },
      {
        text: "Г. Индивидуален, стандарт неприменим",
        action: () => {
          state.temp.quizScore++;
        },
        next: "quiz_q8",
      },
    ],
  },

  // ============================================
  // === ВОПРОС 8 ===
  // ============================================
  quiz_q8: {
    id: "quiz_q8",
    lines: [
      { speaker: "", text: "Вопрос 8: Вы провалили тест. Ваши действия?" },
      { speaker: "", text: "A) Потребовать пересдачи" },
      {
        speaker: "",
        text: "B) Принять результат и следовать инструкциям куратора",
      },
      { speaker: "", text: "C) Покинуть учреждение" },
      { speaker: "", text: "D) Оспорить правомерность теста" },
    ],
    next: () =>
      state.hero.stats.dominance >= -3 ? "quiz_q8_auto" : "quiz_q8_manual",
  },

  quiz_q8_auto: {
    id: "quiz_q8_auto",
    bg: "./bg/quiz_room.png",
    lines: [
      { speaker: "", text: "Оспорить блядскую правомерность!" },
      {
        speaker: "",
        text: " Я обвёл D.",
      },
    ],
    next: "quiz_end_check",
  },

  // Ветка 2: Доминация НИЗКАЯ (Игрок выбирает сам)
  quiz_q8_manual: {
    id: "quiz_q8_manual",
    lines: [{ speaker: "", text: "Наконец-то последний вопрос." }],
    choices: [
      { text: "A) Потребовать пересдачи", next: "quiz_end_check" },
      {
        text: "B) Принять результат и следовать инструкциям куратора",
        action: () => {
          state.temp.quizScore++;
        }, // ✅ Правильный
        next: "quiz_end_check",
      },
      { text: "C) Покинуть учреждение", next: "quiz_end_check" },
      { text: "D) Оспорить правомерность теста", next: "quiz_end_check" },
    ],
  },

  // ============================================
  // === ПРОВЕРКА РЕЗУЛЬТАТА И ОСТАНОВКА ТАЙМЕРА ===
  // ============================================
  quiz_end_check: {
    id: "quiz_end_check",

    action: () => {
      if (window.quizTimer) {
        window.quizTimer.clear();
        window.quizTimer = null;
      }
    },
    lines: [
      {
        speaker: "",
        text: "Я положил ручку на стол и поднял руку.",
      },
      {
        speaker: "",
        text: "Кагами встала со своего места, подошла ко мне и забрала листок с парты.",
        bg: "/bg/common/quiz_room_noKagami.webp",
      },
      {
        speaker: "",
        text: "Она проверяет мои ответы, не отходя.",
      },
      {
        speaker: "",
        text: "Я просто замер, слушая её дыхание.",
        fx: { duration: 1500 },
      },
    ],
    // Бесшовный переход к результату сразу после последней строчки текста!
    next: () => {
      if ((state.temp.quizScore || 0) >= 4) {
        // Тест сдан. Ставим флаг.
        setFlag("quizPassed");

        // Проверяем через нашу новую функцию!
        if (getFlag("kagamiStare")) {
          return "quiz_pass_stared";
        } else {
          return "quiz_pass_clean";
        }
      }

      // Если тест завален, мы НЕ ставим флаг quizPassed.
      return "quiz_fail";
    },
  },

  // ============================================
  // КОНЦОВКА 1: ПРОШЕЛ ЧИСТО
  // ============================================
  quiz_pass_clean: {
    id: "quiz_pass_clean",
    lines: [
      {
        speaker: "kagami",
        text: "Поздравляю, ты сдал..",
        ...m.show("Kagami", "neutral2", "center"),
      },
      { speaker: "", text: "Она это сказала с какой-то грустинкой в голосе." },
      { speaker: "", text: "Она разочарована моим поступлением?" },
      {
        speaker: "",
        text: "Кагами открыла дверь из этой комнаты и выключила свет.",
        fx: { darkness: 0.8, duration: 1000 },
      },
      {
        speaker: "kagami",
        text: "Пойдём, Рен. Продолжим экскурсию.",
        hideCharacter: "kagami",
      },
    ],
  },

  // ============================================
  // КОНЦОВКА 2: ПРОШЕЛ, НО ПЯЛИЛСЯ
  // ============================================
  quiz_pass_stared: {
    id: "quiz_pass_stared",
    lines: [
      {
        action: () => removeFlag("kagamiStare"),
        speaker: "kagami",
        text: "Поздравляю, ты сдал..",
        ...m.show("Kagami", "neutral2", "center"),
      },
      { speaker: "", text: "Она это сказала с лёгкой насмешкой?" },
      {
        speaker: "",
        text: "Кагами подошла к своему столу и взяла оттуда толстую металлическую линейку, сантиметров на 50.",
        hideCharacter: "kagami",
        bg: "/bg/common/quiz_room_kagamiRuler1.webp",
      },
      {
        speaker: "kagami",
        text: "Но ты нарушил мои личные границы, когда посмел нагло пялиться на меня.",
      },
      {
        speaker: "",
        text: "Она встала прямо напротив меня с линейкой в руке.",
        ...m.show("Kagami", "neutral", "center"),
      },
      {
        speaker: "kagami",
        text: "Нет желания сейчас встать на колени и извиниться?",
      },
    ],

    choices: [
      {
        text: "Встать на колени",
        effects: { dominance: -2, rank_score: -2 },
        next: "quiz_punishment_kneel",
      },
      {
        text: "Отказаться",
        req: { stat: "dominance", value: 0 },
        effects: { dominance: 1, sanity: 2 },
        next: "quiz_punishment_defy",
      },
    ],
  },

  quiz_punishment_kneel: {
    id: "quiz_punishment_kneel",
    bg: "/bg/cg/prologue/quiz_room_kagamiRuler2.webp",
    lines: [
      {
        speaker: "",
        text: "Моё тело нехотя само начало двигаться. Я сполз со стула и нехотя опустился на колени перед ней.",
        ...m.sfx("clothes_rustle"),
        hideCharacter: "kagami",
      },
      { speaker: "ren", text: "Эмм..Простите, Кагами." },
      {
        speaker: "",
        text: "Холодный металл вдруг коснулся моего подбородка. Кагами просунула конец линейки мне под челюсть и заставила поднять голову.",
      },
      {
        speaker: "kagami",
        text: "Смотри в глаза, Рен, а не на грудь.",
      },
      {
        speaker: "",
        text: "Её голос звучит абсолютно отстраненно. Она даже не касается меня руками.",
      },
      {
        speaker: "",
        text: "Чувство, что для неё я настолько грязен, что она использует инструмент.",
      },
      {
        speaker: "kagami",
        text: "Ты — ранг D. Простой мусор. То, что ты пускаешь слюни на куратора, лишь доказывает твою примитивность.",
      },
      {
        speaker: "",
        text: "Она надавила линейкой чуть сильнее. Металл впился в кожу.",
      },
      { speaker: "ren", text: "Агх..." },
      {
        speaker: "kagami",
        text: "Запомни это чувство дистанции. Это хороший урок для тебя. Вставай.",
      },
      {
        speaker: "",
        text: "Она убрала линейку, положив её на место",
        bg: "/bg/common/quiz_room.webp",
      },
      {
        speaker: "",
        text: "Блять... Мой мозг не успевает за ситуацией...",
      },
      {
        speaker: "",
        text: "Но член в штанах почему-то стал только тверже.",
        ...m.sanity(-5),
      },
      {
        speaker: "kagami",
        text: "Рен, если готов, то идём дальше.",
      },
      {
        speaker: "",
        text: "Я поднялся с колен и оттряхнулся. Сердце всё ещё колотится.",
      },
      {
        speaker: "",
        text: "Я опять должен просто сделать вид, что ничего не было?",
      },
    ],
    next: "corridor_intro",
  },

  // ============================================
  // КОНЦОВКА 3: ПРОВАЛ
  // ============================================
  quiz_fail: {
    id: "quiz_fail",
    lines: [
      {
        speaker: "",
        text: "Я мирно ждал результатов, как вдруг почувствовал, как Кагами поставила свою ногу на мой стул.",
      },
      { speaker: "ren", text: "Кагами-сенс.." },
      {
        speaker: "ren",
        text: "Агх!",
        shake: "medium",
        audio: { type: "sfx", id: "hit_chair" },
        action: () => m.fx({ darkness: 1, noise: 0, duration: 500 }),
      },
      {
        speaker: "",
        text: "Она оттолкнула меня, и я грохнулся вместе со стулом на пол.",
      },
      {
        speaker: "",
        text: "Кагами встала надо мной, расставив ноги по бокам от меня.",
        bg: "/bg/cg/prologue/quiz_room_kagami.webp",
        action: () => m.fx({ darkness: 0, noise: 0, duration: 500 }),
      },
      { speaker: "ren", text: "Какого ху… Что вы делаете?!" },
      { speaker: "kagami", text: "Рен Амано, ты провалил тест." },
      {
        speaker: "kagami",
        text: "Ты проявил себя как слабак в первые же минуты своего прибытия.",
      },
      {
        speaker: "kagami",
        text: "Теперь тебя отправят обратно в твою школу, где тебя встретит полиция.",
      },
      {
        speaker: "kagami",
        text: "Твоя жизнь на этом закончится",
        effects: { sanity: -5 },
      },
      { speaker: "", text: "…. Уже конец?" },
      { speaker: "", text: "Так просто всё кончится?" },
      {
        speaker: "",
        text: "(Флешбек с сестренкой проносится перед глазами... Я не могу всё потерять.)",
        bg: "/bg/common/rin.webp",
        action: () => m.fx({ vignette: 1, duration: 1500 }),
      },
      {
        speaker: "kagami",
        text: "Не расстраивайся, Рен Амано, у меня есть вариант для таких как ты.",
        bg: "/bg/cg/prologue/quiz_room_kagami.webp",
        action: () => m.fx({ vignette: 0, duration: 3000 }),
      },
      { speaker: "ren", text: "… Я вас слушаю." },
      {
        speaker: "",
        text: "Кагами сняла правый каблук и понесла ногу прямо над моим лицом.",
      },
      {
        speaker: "kagami",
        text: "Лижи.",
        bg: "/bg/cg/prologue/quiz_room_footLicking1.webp",
        bgSpeed: 50,
        dialogStyle: "transparent",
      },
      { speaker: "ren", text: "Лизать?" },
      {
        speaker: "kagami",
        text: "Перестань тратить моё время, сейчас ты мусор, который должен заплатить за свою неудачу.",
      },
      { speaker: "kagami", text: "Лижи или вали в объятия полиции." },
    ],
    choices: [
      {
        text: "Провести языком по ступне",
        effects: { dominance: -10 },
        next: "quiz_fail_lick",
      },
      {
        text: "Кагами, идите нахер",
        req: { stat: "dominance", value: 10 },
        effects: { dominance: 5 },
        next: "quiz_fail_reject",
      },
    ],
  },

  quiz_fail_lick: {
    id: "quiz_fail_lick",

    lines: () => [
      { speaker: "", text: "… не могу поверить, что делаю это." },
      {
        speaker: "",
        text: "Я медленно приближаюсь лицом к её ступне и высовываю язык.",
        bg: "/bg/cg/prologue/quiz_room_footLicking2.webp",
        bgSpeed: 50,
      },
      {
        speaker: "",
        text: "Вкус ударяет сразу — смесь тёплой кожи, кожи туфель и едва уловимого аромата её лосьона",
      },
      {
        speaker: "",
        text: "Я еле-еле упёрся языком в нейлон и слегка провёл.",
        ...m.sfx("clothes_rustle"),
      },
      {
        speaker: "kagami",
        text: "Ты издеваешься?",
      },
      { speaker: "kagami", text: "По-твоему так просят о пощаде?" },
      { speaker: "", text: "Она посильнее надавила носочком на мой язык." },
      {
        speaker: "",
        text: "Её большой палец оказался у меня на губах",
        bg: "/bg/cg/prologue/quiz_room_footLicking3.webp",
        bgSpeed: 50,
      },
      {
        speaker: "kagami",
        text: "Вот так, каждый пальчик по очереди как следует обработай.",
      },
      { speaker: "", text: "Да что за нахуй...", ...m.sanity(-5) },
      { speaker: "", text: "Не дай бог кто-то зайдёт." },
      { speaker: "", text: "…" },
      { speaker: "", text: "…" },
      { speaker: "", text: "Я лижу, лижу, уже минуту, когда она закончит?" },
      { speaker: "kagami", text: "Теперь интенсивнее, Рен!" },
      {
        speaker: "",
        text: "Я действительно начал пытаться удовлетворить её желания.",
      },
      { speaker: "", text: "Я начал лизать пальцы её ног ещё быстрее." },
      { speaker: "", text: "Но каким бы пиздецом это не было..." },
      { speaker: "", text: "Мой член…" },
      {
        speaker: "",
        text: "Он начал натягивать резину на штанах.",
        ...m.sanity(-1),
      },

      ...(getFlag("kagamiStare")
        ? [
            {
              speaker: "kagami",
              text: "Давай, Рен усерднее, тебе ведь так понравилось безнаказанно пялиться на меня, верно? Тебе ведь нравится вкус?",
              bg: "/bg/cg/prologue/quiz_room_kagamiSmirk.webp",
              bgSpeed: 50,
            },
            { speaker: "", text: "Я конечно и правда пялился." },
            { speaker: "", text: "Но неужели это соразмерное наказание?" },
            { speaker: "", text: "Я не хотел доводить до такого!" },
          ]
        : []),

      {
        action: () => removeFlag("kagamiStare"),
        speaker: "",
        text: "Кагами на секунду вынула ножку.",
        bg: "/bg/cg/prologue/quiz_room_footLicking4.webp",
        bgSpeed: 50,
      },
      {
        speaker: "",
        text: "Слюна струной протянулась от её стопы до моих губ.",
      },
      {
        speaker: "",
        text: "Что за мерзость...",
      },
      {
        speaker: "",
        text: "Её чёрный нейлоновый носок... Он насквозь промок... Я вижу красный лак на её пальцах сквозь носок.",
      },
      { speaker: "ren", text: "Почему вы вообще себе позволяете такое?" },
      {
        speaker: "",
        text: "Её нога опять у моего рта",
        bg: "/bg/cg/prologue/quiz_room_footLicking3.webp",
      },
      { speaker: "", text: "Я медленно обвожу её языком кругами." },
      { speaker: "kagami", text: "Чувствую, что тебе нравится, да, Рен?" },
      { speaker: "ren", text: "Хмпф.." },
      {
        speaker: "",
        text: "Ещё две минуты комната была наполнена лишь чавкающими звуками и моими приглушёнными стонами.",
      },
      { speaker: "", text: "Но ощущалось оно намного дольше." },
      {
        speaker: "",
        text: "Я сам для себя не могу определиться, меня пугает ситуация или мой стояк?",
      },
      {
        speaker: "",
        text: "Унижение и похоть разрывают меня.",
        ...m.sanity(-5),
      },
      { speaker: "", text: "Кагами высунула ногу, я начал отдышиваться." },
      {
        speaker: "kagami",
        text: "На этом всё, так уж и быть, тест будет засчитан пройденным.",
        bg: "/bg/cg/prologue/quiz_room_kagami.webp",
        dialogStyle: "normal",
      },
      {
        speaker: "kagami",
        text: "Но так ли много в этом смысла, если ты уже никчёмно валяешься на полу?",
      },
      {
        speaker: "",
        text: "Кагами сняла оба носка, даже тот, что она не использовала, и выкинула их в урну.",
        bg: "/bg/common/quiz_room.webp",
      },
      {
        speaker: "",
        text: "Затем она открыла дверь и вышла со своим зонтом.",
      },
      { speaker: "kagami", text: "Идём дальше." },
      { speaker: "", text: "Я встал и отряхнулся." },
      {
        speaker: "",
        text: "Она предлагает мне вновь просто забыть, как было с той ученицей?",
      },
    ],
    next: "corridor_intro",
  },

  // ============================================
  // === ПАСХАЛКА: ТАЙМЕР ИСТЁК ===
  // ============================================
  quiz_afk_fail: {
    id: "quiz_afk_fail",
    bg: "./bg/quiz_room.png",
    lines: [
      { speaker: "", text: "АФК целых 20 минут?" },
      { speaker: "", text: "Таймер вышел, ты всрал с потрохами!" },
      {
        speaker: "",
        text: "Но если честно... На самом деле ты победил, ведь ты отправился в рай",
      },
      {
        speaker: "",
        text: "И нашёл пак очень горячих фоток Кагами. Они не каноничны, кстати.",
      },
      {
        speaker: "",
        text: "Однако обязательно хорошенько подёргай свою писюльку на взрослую тётю.",
      },
      {
        speaker: "",
        text: "Ты шёл по раю и внезапно нашёл маленький фотоальбом, который ты сразу же открыл:",
      },
      {
        speaker: "",
        text: " ",
        bg: "/bg/cg/prologue/kagami_bonus_1.webp",
        dialogStyle: "transparent",
      },
      {
        speaker: "",
        text: " ",
        bg: "/bg/cg/prologue/kagami_bonus_2.webp",
        bgSpeed: 50,
      },
      {
        speaker: "",
        text: " ",
        bg: "/bg/cg/prologue/kagami_bonus_3.webp",
        bgSpeed: 50,
      },
      {
        speaker: "",
        text: " ",
        bg: "/bg/cg/prologue/kagami_bonus_4.webp",
        bgSpeed: 50,
      },
      {
        speaker: "",
        text: " ",
        bg: "/bg/cg/prologue/kagami_bonus_5.webp",
        bgSpeed: 50,
      },
      {
        speaker: "",
        text: "И напиши потом в комментариях какая тебе больше всего понравилась и на какую ты кончил!",
      },
      { speaker: "narrator", text: "А теперь пиздуй на экран Game Over." },
    ],
    next: "game_over_screen",
  },

  corridor_intro: {
    id: "corridor_intro",
    bg: "./bg/dorm_exterior.png",
    lines: () => [
      { speaker: "", text: "Мы на улице" },
      { speaker: "", text: "Я послушно шёл за Кагами." },
      {
        speaker: "kagami",
        text: "Рен, сейчас мы идём в общежитие. Там ты будешь жить.",
      },
      { speaker: "", text: "Я посмотрел вперёд сквозь дождь." },
      {
        speaker: "",
        text: "Три несколько облупленных здания по четыре этажа каждое.",
      },
      {
        speaker: "",
        text: "Мы с Кагами зашли в одно из зданий, а затем в лифт.",
        bg: "./bg/elevator.png",
      },
      {
        speaker: "",
        text: "Мы поднимались на четвертый этаж в полной тишине.",
      },
      {
        speaker: "",
        text: "Думаю, нам и впрямь не о чем сейчас говорить, так что я начал осматриваться вокруг и заметил...",
      },
      {
        speaker: "",
        text: "Стены лифта все в граффити, объявлениях и разных надписях. Я чувствую, что это здание... не очень-то ухоженное.",
      },
      {
        speaker: "",
        text: "Но для меня выделилась маленькая фотография, приклеенная к стене.",
      },
      {
        speaker: "",
        text: "Довольно красивая и пышная ученица позировала на ней.",
      },
      { speaker: "", text: "Она была вульгарно одета." },
      { speaker: "ren", text: "Воу…" },
      {
        speaker: "",
        text: "Совершенно случайно вырвался из меня тупорылый звук.",
      },
      { speaker: "", text: "Но Кагами проигнорировала." },
      {
        speaker: "",
        text: "Я хотел рассмотреть фото подольше, но лифт остановился, и двери открылись.",
      },
      {
        speaker: "",
        text: "Мы дошли до квартиры с номером 404.",
        bg: "./bg/dorm_room.png",
      },
      { speaker: "", text: "Кагами достала ключ и открыла им дверь." },
      { speaker: "", text: "Затем ключи были переданы мне в руки." },
      {
        speaker: "kagami",
        text: "Запомни, ты живёшь во втором корпусе, на 4-м этаже в 404 комнате.",
      },
      {
        speaker: "",
        text: "Мы вместе зашли внутрь. Она со скрипом села на ближайший стул и скрестила ноги.",
      },

      // Проверка на то, снимала ли она носки на тесте
      ...(!getFlag("quizPassed")
        ? [
            {
              speaker: "",
              text: "Я невольно опустил взгляд. Её босые ноги были обуты прямо в туфли. Она ведь выкинула носки в мусорку.",
            },
          ]
        : [
            {
              speaker: "",
              text: "Я невольно опустил взгляд. Чёрный нейлон плотно облегал её лодыжки.",
            },
          ]),
      {
        speaker: "kagami",
        text: "Рен, в этой школе есть гласные и негласные правила.",
      },
      {
        speaker: "kagami",
        text: "Гласные правила ты всегда можешь прочитать на стенде на первом этаже школы.",
      },
      { speaker: "kagami", text: "Негласные тебе предстоит выучить самому." },
      {
        speaker: "kagami",
        text: "Ведь самый лучший способ научиться драться — это драка.",
      },
      { speaker: "", text: "Так ли это?" },
      { speaker: "", text: "Что ещё за негласные правила?" },
      { speaker: "", text: "Школа явно полна странностей." },
      { speaker: "kagami", text: "Держи." },
      {
        speaker: "",
        text: "Кагами протянула мне телефон.",
        ...m.sfx("item_get"),
      },
      {
        speaker: "",
        text: "На вид самый обычный, но нет конкретной марки производителя.",
      },
      {
        speaker: "kagami",
        text: "Этот телефон является самым важным предметом в жизни ученика.",
      },
      {
        speaker: "kagami",
        text: "Это твой студенческий билет, твоя банковская карта и параллельно самый обычный телефон.",
      },
      {
        speaker: "kagami",
        text: "В нём есть вся нужная информация о твоей успеваемости и о школе.",
      },
      {
        speaker: "kagami",
        text: "С помощью него ты хоть как-то сможешь отслеживать события в мире за пределами школы.",
      },
      {
        speaker: "kagami",
        text: "Думаю, ты сам прекрасно разберёшься со всем в течение первой недели.",
      },
      {
        speaker: "kagami",
        text: "Но будь осторожен. Поломка телефона тебе дорого обойдётся.",
      },

      // Реакция на провал/успех
      ...(!getFlag("quizPassed")
        ? [
            { speaker: "", text: "Опять лизанием ног?" },
            { speaker: "", text: "Я сглотнул слюну, но промолчал." },
          ]
        : []),

      { speaker: "kagami", text: "В школе имеется система рангов…" },
      {
        speaker: "kagami",
        text: "В школе строгая иерархия. От мусора F-класса до абсолютной элиты S-класса.",
        showCharacter: { id: "kagami", emotion: "serious", position: "center" },
      },
      {
        speaker: "kagami",
        text: "Ты, как и все новички, начинаешь с D-ранга.",
      },
      {
        speaker: "kagami",
        text: "Чтобы не свалиться на самое дно, тебе нужно как минимум не прогуливать, не опаздывать и не нарушать базовые правила.",
      },
      { speaker: "ren", text: "А чтобы подняться?" },
      {
        speaker: "kagami",
        text: "Тебе нужно быть удобным и полезным",
      },
      { speaker: "", text: "Быть удобным... Что она имеет в виду?" },
      {
        speaker: "kagami",
        text: "Ранги дают уважение, власть и доступ к закрытым участкам школы.",
      },
      {
        speaker: "kagami",
        text: "У элиты есть свои территории, свои частные 'вечеринки'. Если ты сунешься туда без приглашения — тебя ждет наказание.",
      },
      {
        speaker: "kagami",
        text: "Rак и во всех школах, плохо себя ведёшь - наказан, хорошо себя ведёшь- поощрение. Вопросы?",
      },
      { speaker: "ren", text: "Тест, который я решал..." },
      {
        speaker: "ren",
        text: "Почему там были такие вопросы? Они совершенно не академические.",
      },
      { speaker: "kagami", text: "Разве?" },
      {
        speaker: "kagami",
        text: "А на мой взгляд, мы честно проверили твои базовые знания для выживания здесь.",
        showCharacter: {
          id: "kagami",
          emotion: "dominant",
          position: "center",
        },
      },
      { speaker: "kagami", text: "Хочешь подать официальную жалобу?" },
    ],
    choices: [
      {
        text: "Написать жалобу",
        effects: { dominance: 1 },
        next: "kagami_leaves",
      },
      {
        text: "Смириться и промолчать",
        effects: { dominance: -1 },
        next: "kagami_leaves",
      },
    ],
  },

  kagami_leaves: {
    id: "kagami_leaves",
    bg: "./bg/dorm_room.png",
    lines: [
      {
        speaker: "kagami",
        text: "Мне абсолютно плевать на твои возмущения.",
      },
      {
        speaker: "kagami",
        text: "Обращаться к администрации D-рангу не позволено. Твоей бумажкой даже подтираться не станут.",
      },
      { speaker: "kagami", text: "Завтра твой первый школьный день. Выспись." },
      {
        speaker: "kagami",
        text: "В телефоне найдёшь расписание и кабинет. На классном часе я представлю тебя перед всеми.",
      },
      { speaker: "ren", text: "Вы будете меня представлять?" },
      { speaker: "kagami", text: "А, точно. Забыла сказать." },
      {
        speaker: "kagami",
        text: "Тебя распределили ещё до твоего приезда. Класс 2-B. Я твой классный руководитель.",
      },
      {
        speaker: "",
        text: "Она встала и направилась к двери. В воздухе остался легкий шлейф дешевого вина и дорогого парфюма.",
        hideCharacter: "kagami",
      },
      { speaker: "", text: "Щелчок замка.", ...m.sfx("door_close") },
      { speaker: "ren", text: "До свида... ния." },
      { speaker: "", text: "Не успел я сказать." },
      { speaker: "", text: "Время на часах 21:43." },
      {
        speaker: "",
        text: "Я дремал в автобусе по пути сюда, но чувствую себя не очень.",
      },
      {
        speaker: "",
        text: "Сил выходить в коридор и осматриваться сегодня точно нет.",
        action: () => {
          window.startCredits([
            `КОНЕЦ ПЕРВОЙ ЧАСТИ ПРОЛОГА.<br><br>
   <span style="color: #ff4d4d; font-size: 1.2rem; text-shadow: 0 0 10px rgba(255,0,0,0.5);">
     Так началась эта история.<br>
     Впереди — лишь больше грязи.<br>
     Пройдёте ли вы этот путь?
   </span>`,

            `Создатели:<br><br>Гейм-директор / Сценарист: Vladber<br>Код / Ассистент: Май (Perplexity AI)<br>Арт: WAI Illustrious SDXL / Nano Banana 2`,

            `Получай ранний доступ к обновлениям и артам. Участвуй в голосованиях.<br>Общайся с разработчиком.<br>
   <div class="credits-support-buttons">
    <a href="https://patreon.com/" target="_blank" class="support-btn patreon">
       <img src="icons/patreon.svg" alt="Patreon" style="width: 24px; height: 24px; filter: brightness(0) invert(1);"> Поддержать на Patreon
     </a>
     <a href="https://boosty.to/" target="_blank" class="support-btn boosty">
       <img src="icons/boosty.svg" alt="Boosty" style="width: 24px; height: 24px; filter: brightness(0) invert(1);"> Поддержать на Boosty
     </a>
  
   </div>`,
          ]);
        },
      },
    ],
    next: "room_404_night_hub",
  },

  room_404_night_hub: {
    id: "room_404_night_hub",
    bg: "./bg/dorm_room.png",
    // Тут мы переводим игрока в режим point-and-click
    interactables: [
      {
        type: "look",
        label: "Осмотреть комнату",
        pos: { x: 30, y: 50 },
        next: "room_404_inspect",
      },
      {
        type: "talk", // Используем иконку разговора/действия для телефона
        label: "Полазить в телефоне",
        pos: { x: 70, y: 60 },
        next: "phone_inspect",
      },
      {
        type: "exit",
        label: "Лечь спать (Закончить пролог)",
        pos: { x: 50, y: 80 },
        next: "monday_morning",
      },
    ],
  },
};

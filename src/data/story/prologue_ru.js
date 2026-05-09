import { m, audioMacros, n, say, nfx, sf } from "../macros.js";
import { state, setFlag, getFlag, removeFlag } from "../../core/state.js";

export const story = {
  prologue_interrogation: {
    id: "prologue_interrogation",
    bg: "./bg/common/dream_man.webp",
    lines: [
      sf(
        "mystery",
        "Рен.",
        {
          ...m.fx({ darkness: 1, noise: 1, duration: 0 }),
          ...m.bgm("Zero Rank", 0.5),
        },
        {
          dialogStyle: "normal",
        },
      ),
      say("mystery", "Ты меня слышишь?"),
      sf("ren", "Да...", m.fx({ darkness: 0.9, noise: 0.2, duration: 500 })),
      n("Силуэт в деловом костюме сидит напротив. Я чувствую запах табака."),
      nfx(
        "Я попытался дернуться, но бесполезно. Руки привязаны к подлокотникам.",
        m.sfx("rope_struggle_chair", 0.8),
        m.fx({ darkness: 1, noise: 0.2, duration: 500 }),
      ),
      n("Я в ловушке."),
      sf(
        "mystery",
        "Ты понимаешь, почему ты здесь?",
        m.fx({ darkness: 0.8, noise: 0.5, duration: 500 }),
      ),
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
      say(
        "mystery",
        "Статья 134. Умышленное причинение тяжкого вреда здоровью. Плюс сопротивление при аресте.",
      ),
      sf(
        "mystery",
        "Рен, твои действия ведут прямиком в колонию строгого режима.",
        m.fx({ darkness: 0.7, noise: 0.4, duration: 500 }),
      ),
      say("ren", "..."),
      say("mystery", "Но у меня есть альтернатива."),
      say(
        "mystery",
        "Частная школа 'Синсю'. Закрытое учреждение для коррекции поведения.",
      ),
      say("mystery", "Или тюрьма. Выбор за тобой."),
      nfx(
        "Человек положил на стол документ и тонкую иглу.",
        m.sfx("paper_slide", 0.8),
        { bg: "./bg/common/dream_table.webp" },
        {
          action: () => {
            window.sm.ui.showDocument(true);
            window.sm.ui.handleFx({ darkness: 0.3, noise: 0.5, duration: 500 });
          },
        },
      ),
      say("mystery", "Заявление о добровольном переводе."),
      say("mystery", "Решай."),
    ],
    choices: [
      { text: "Хорошо...", next: "prologue_sign" },
      { text: "Нет.", req: { dominance: { min: 80 } } },
    ],
  },

  prologue_sign: {
    id: "prologue_sign",
    bg: "./bg/common/dream_table.webp",
    lines: [
      n(
        "Он освободил мою правую руку. Я медленно потянулся к ручке на столе, но он перехватил моё запястье.",
      ),
      say("mystery", "Не ручкой, Рен."),
      nfx(
        "Резкий укол в подушечку пальца. Я даже не успел дернуться.",
        m.sfx("needle_pierce_gasp", 0.8),
        m.fx({ darkness: 0.5, noise: 0.7, duration: 500 }),
      ),
      say("ren", "Мх.."),
      sf(
        "mystery",
        "Твоё согласие должно быть абсолютным. Биологическим.",
        m.fx({ darkness: 0.6, noise: 0.3, duration: 500 }),
      ),
      nfx("Алая капля упала на бумагу. Моя кровь впиталась.", m.sanity(-30)),
      say("mystery", "Вот так. Теперь всё будет по-другому."),
      sf(
        "mystery",
        "Тебе там понравится, Рен.",
        { bg: "./bg/common/dream_man.webp" },
        {
          action: () => {
            window.sm.ui.showDocument(false);
            window.sm.ui.handleFx({ darkness: 0.3, noise: 0.5, duration: 500 });
          },
        },
      ),
      sf(
        "mystery",
        "Рано или поздно, понравится",
        m.sfx("noise", 0.2, true),
        m.fx({ darkness: 0.3, noise: 0.8, duration: 500 }),
      ),
      sf(
        "mystery",
        "Особенно м%я ?:чь С%№;?;!",
        m.sanity(-80),
        { anim: "psychoShake" },
        m.fx({ darkness: 0.3, noise: 0.9, duration: 500 }),
      ),
      sf(
        "mystery",
        "Най%; :№, Рен.",
        m.sanity(-100),
        m.fx({ darkness: 0, noise: 1, duration: 500 }),
      ),
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
      nfx(
        "...",
        m.fx({ darkness: 1, noise: 0.5, duration: 100 }),
        m.sanity(100),
      ),
      nfx("Ох...", m.fx({ darkness: 0.3, noise: 0, duration: 500 })),
      n("Я приехал?"),
      nfx(
        "Автобус стоял неподвижно. Шум двигателя смешался с монотонным стуком дождя по окну.",
        {
          audio: [
            { type: "sfx", id: "muffled_rain", volume: 0.8, loop: true },
            { type: "sfx", id: "bus_interior", volume: 0.3, loop: true },
            { type: "stop_sfx", id: "heartbeat", fade: 500 },
            { type: "stop_sfx", id: "tinnitus", fade: 500 },
          ],
        },
      ),
      say("driver", "Конечная."),
      nfx(
        "Я выглянул в окно. Сквозь стекло виднелись массивные бетонные стены.",
        { bg: "/bg/common/school_bus.webp" },
      ),
      say("ren", "Это... моя новая школа?"),
      say("driver", "Нулевой сектор."),
      nfx(
        "Двери автобуса с шипением открылись, впуская в салон запах мокрого асфальта.",
        m.sfx("bus_door_open", 0.5),
      ),
      say("driver", "Быстрее."),
      n(
        "Он посмотрел на меня через зеркало заднего вида. Глаз не было видно за тенью козырька.",
      ),
      sf("ren", "Иду...", { bg: "/bg/common/school_bus_choice.webp" }),
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
      nfx(
        "Стоило мне выйти из автобуса, как меня встретила она...",
        m.show("kagami", "neutral", "center", "fadeIn"),
      ),
      n(
        "Взрослая женщина с пронзительным, уставшим взглядом и тугим хвостом темных волос. От нее едва уловимо пахло терпким вином.",
      ),
      say("ren", "Здравствуйте, я..."),
      say("kagami", "Амано Рен, знаю."),
      nfx(
        "Лил дождь. Она подошла ко мне — близко, но не интимно — и протянула отдельный зонтик.",
        m.sfx("umbrella_open"),
      ),
      sf(
        "kagami",
        "Меня зовут Кагами Саэ.",
        { action: () => setFlag("knowsKagami") },
        m.bgm("Rest till you there"),
      ),
      sf(
        "kagami",
        "Позади меня — академия Синсю. Поздравляю с приездом, Амано.",
        m.show("kagami", "neutral2", "center"),
      ),
      say("ren", "Да, спасибо. Зовите меня просто Рен."),
      sf(
        "kagami",
        "Вот так сразу по имени?",
        m.show("kagami", "neutral", "center"),
      ),
      say("ren", "М, да, мне так привычнее."),
      say(
        "kagami",
        "Хорошо, далее тебя ждет небольшой тест на способности. Прошу за мной.",
      ),
      nfx(
        "И мы двинулись.",
        m.sfx("step_puddle"),
        { bg: "/bg/cg/prologue/ren_kagami_walk.webp" },
        m.hide("kagami", "fadeOut"),
        m.sfx("walking", 1),
      ),
      n("Я шёл чуть позади, и мой взгляд то и дело падал на её бедра."),
      n(
        "Я отчаянно цеплялся за эти мысли, пытаясь убедить себя, что всё нормально... что я в безопасности.",
      ),
      n("Но мне нужно было заставить себя поднять взгляд."),
      say(
        "ren",
        "Кагами-сенсей, расскажите про эту школу. Меня перевели из маленького городка...",
      ),
      say(
        "ren",
        "Я даже не знаю, за какие заслуги мне дали такую возможность.",
      ),
      say("kagami", "Заслуги? Здесь нет заслуг прошлого."),
      say(
        "kagami",
        "Есть только потенциал, который ты либо реализуешь, либо...",
      ),
      say("kagami", "Либо нет."),
      say(
        "kagami",
        "Ты первый, кто вторгся в середине семестра. Обычно здесь учатся с самого начала, так что ты уже выделился.",
      ),
      say("ren", "Вот оно как..."),
      nfx(
        "Пока мы шли, боковым зрением я заметил нечто... неправильное. Силуэт в тени бетона.",
        m.stopBgm(500),
      ),
      sf("ren", "Чё за...", m.sanity(-5)),
      n("Я остановился. Мой взгляд уставился в одну точку."),
      nfx(
        "Ученица. Полностью обнаженная. Её кожа была бледной.",
        { bg: "/bg/cg/prologue/punished_girl_main.webp" },
        m.fx({ vignette: 1, duration: 1500 }),
      ),
      nfx(
        "От столба тянулась цепь. Она уходила прямо к ошейнику на её тонкой шее.",
        m.sfx("chain_rattle_faint"),
      ),
      n(
        "Она сидела неподвижно, обняв колени. Вода стекала по её спутанным волосам, капая на грязный бетон.",
      ),
      nfx(
        "И эта сцена была совсем недалеко от центрального входа.",
        m.sanity(-5),
      ),
      sf(
        "kagami",
        "Рен, ты чего застыл?",
        { bg: "/bg/cg/prologue/kagami_lookback.webp" },
        m.fx({ vignette: 0, duration: 3000 }),
      ),
      n("Голос Кагами звучал буднично, совершенно спокойно."),
      sf("ren", "Я...", { bg: "/bg/cg/prologue/kagami_girl_choice.webp" }),
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
      say("ren", "Эмм, я сейчас..."),
      nfx(
        "Я сделал шаг с дорожки. Грязь чавкнула под ботинками. Кагами тяжело вздохнула позади, но не остановила меня.",
        { bg: "/bg/cg/prologue/punished_girl_main.webp" },
        {
          action: () => window.sm.ui.handleFx({ vignette: 1, duration: 1500 }),
        },
        m.sfx("walking", 1),
      ),
      n(
        "С каждым шагом детали становились четче. Странная белая жидкость на ступнях. Нет даже намека на одежду.",
      ),
      nfx(
        "Она услышала меня. Медленно подняла голову.",
        { bg: "/bg/cg/prologue/punished_girl_lookup.webp" },
        {
          action: () => window.sm.ui.handleFx({ vignette: 0, duration: 3000 }),
        },
        m.sfx("metal_chain", 1),
      ),
      n("Она смотрит на меня. Такими спокойными глазами..."),
      n("Или они беспокойные? Не могу определиться."),
      nfx("Теперь я стою почти вплотную к ней.", m.sanity(-5)),
      n("Что мне сделать...?"),
    ],
    choices: [
      { text: "Поговорить", next: "talk_to_girl" },
      {
        text: "Попытаться помочь",
        effects: { rank_score: -2, dominance: 1 },
        next: "help_girl",
      },
      {
        text: "Рассмеяться ей в лицо",
        req: { dominance: { min: 15 } },
        next: "laugh_at_girl",
      },
      {
        text: "Сексуальное действие",
        req: { dominance: { min: 30 } },
        next: "inspect_girl",
      },
    ],
  },

  ignore_girl: {
    id: "ignore_girl",
    bg: "/bg/cg/prologue/kagami_lookback.webp",
    lines: [
      n("Я отвернулся."),
      say("ren", "Эмм, ничего. Идемте."),
      nfx(
        "Что это было? Часть теста? Психологическая проверка? Если я отреагирую — я провалюсь?",
        m.sanity(-5),
        { bg: "/bg/cg/prologue/ren_kagami_walk.webp" },
        m.sfx("walking", 1),
      ),
      n("Мы шли еще минуту, пока не дошли до маленькой пристройки."),
    ],
    next: "quiz_intro",
  },

  talk_to_girl: {
    id: "talk_to_girl",
    lines: [
      say("ren", "Эй, что с тобой? Почему ты голая?"),
      sf("mystery", "А почему ты одетый?", {
        bg: "/bg/cg/prologue/punished_girl_lookup_talk.webp",
        bgSpeed: 50,
      }),
      say("ren", "?"),
      say("mystery", "Я вот нарушила правила."),
      sf("mystery", "Но я хотела просто обнять...", {
        bg: "/bg/cg/prologue/punished_girl_blush.webp",
        bgSpeed: 50,
      }),
      say("mystery", "А меня повязали и прицепили сюда."),
      sf("mystery", "Теперь я обнимаюсь с кем скажут.", {
        bg: "/bg/cg/prologue/punished_girl_lookup_talk.webp",
        bgSpeed: 50,
      }),
      sf("mystery", "Хахаха!", {
        bg: "/bg/cg/prologue/punished_girl_laugh.webp",
        bgSpeed: 50,
      }),
      n("Она тихо рассмеялась..."),
      n("И тут же начала тянуться рукой ко мне."),
      sf(
        "mystery",
        "Ну а ты? Тоже за мной, да?!",
        {
          bg: "/bg/cg/prologue/punished_girl_stretches.webp",
          bgSpeed: 50,
        },
        m.sfx("metal_chain", 1),
      ),
      say("mystery", "Тоже хочешь меня схватить?!"),
      nfx(
        "Я начал пятиться назад, но она уже зацепилась за мою кофту.",
        {
          bg: "/bg/cg/prologue/punished_girl_grab.webp",
          bgSpeed: 50,
        },
        m.sfx("clothes_grab", 1),
      ),
      say("ren", "Вот блядь, отпусти!"),
      n(
        "Однако она не слушала меня и продолжала подползать ближе, натягивая цепь.",
      ),
      nfx(
        "Бам. Мне прилетел удар зонтом по затылку.",
        m.sfx("hit_umbrella", 1),
        { shake: "medium" },
        {
          anim: "psychoShake",
          bg: "/bg/cg/prologue/punished_girl_letgo.webp",
          bgSpeed: 50,
        },
      ),
      n("Девчонка отпустила меня и вернулась на место."),
      sf(
        "kagami",
        "Рен, отойди от мусора.",
        m.show("kagami", "angry", "center"),
        { bg: "/bg/locations/synsu_entrance.webp" },
      ),
      say("ren", "Ай..."),
      n("Это..."),
      say("ren", "Это пиздец..."),
      n("Кагами схватила меня за руку и потащила прочь."),
      sf(
        "kagami",
        "Кто тебе разрешал бродить где попало? Мы идем на тестирование.",
        m.show("kagami", "tired", "center"),
      ),
      n(
        "Она предлагает мне просто забыть об этом? Пока мы шли, я пытался остудить голову.",
      ),
    ],
    next: "quiz_intro",
  },

  help_girl: {
    id: "help_girl",
    lines: [
      nfx("Это... кошмар. Я осматриваю цепь.", {
        bg: "/bg/cg/prologue/punished_girl_help.webp",
        bgSpeed: 50,
      }),
      say("ren", "Эй, кто сделал это с тобой?"),
      n(
        "Цепь плотно закреплена на столбе и тянется прямо к ошейнику на её шее.",
      ),
      say("ren", "Э-эй, не молчи. Ты знаешь где ключ? Как тебя освободить?"),
      sf(
        "mystery",
        "Ключ? Ммм... Никто не знает, где ключи. Иначе мои подруги...",
        { bg: "/bg/cg/prologue/punished_girl_lookup_talk.webp", bgSpeed: 50 },
      ),
      sf("mystery", "Освободили бы меня! Ахахах!", {
        bg: "/bg/cg/prologue/punished_girl_laugh.webp",
        bgSpeed: 50,
      }),
      n("Я опешил от её смеха."),
      say("ren", "Как мне помочь тебе?"),
      sf("mystery", "Ты хочешь мне помочь, мальчик?", {
        bg: "/bg/cg/prologue/punished_girl_lookup_talk.webp",
        bgSpeed: 50,
      }),
      n("Она медленно раздвинула ноги."),
      sf("mystery", "Лижи.", m.sfx("metal_chain", 1), {
        bg: "/bg/cg/prologue/punished_girl_spred.webp",
        bgSpeed: 50,
        dialogStyle: "transparent",
      }),
      say("ren", "...Что?"),
      say("mystery", "Помой меня хорошенько."),
      say("mystery", "Мне это сейчас очень нужно."),
    ],
    choices: [
      {
        text: "Облизнуться",
        effects: { dominance: 2, sanity: -3 },
        next: "lick_reaction",
      },
      { text: "Отшатнуться", next: "recoil_reaction" },
    ],
  },

  lick_reaction: {
    id: "lick_reaction",
    lines: [
      n(
        "Я попытался отвернуться, но не смог. Взгляд упал на её мокрую промежность.",
      ),
      n("Она возбуждена... И её щёлка явно потрёпана."),
      n("Девчонка лежит с высунутым языком."),
      nfx("Ох... Мой член... Он реагирует.", m.sanity(-10)),
      sf(
        "kagami",
        "РЕН!",
        m.show("kagami", "angry", "center"),
        {
          bg: "/bg/locations/synsu_entrance.webp",
          dialogStyle: "normal",
        },
        { shake: "medium" },
      ),
      n("Резкий рывок за руку вернул меня в реальность."),
    ],
    next: "dragged_away",
  },

  recoil_reaction: {
    id: "recoil_reaction",
    lines: [
      n("Боже правый, что с ней не так?!"),
      say("ren", "Да ни за что! Какого хера ты вообще..."),
      sf(
        "kagami",
        "РЕН!",
        m.show("kagami", "angry", "center"),
        {
          bg: "/bg/locations/synsu_entrance.webp",
          dialogStyle: "normal",
        },
        { shake: "medium" },
      ),
      n("Резкий рывок за руку прервал меня."),
    ],
    next: "dragged_away",
  },

  dragged_away: {
    id: "dragged_away",
    lines: [
      sf(
        "kagami",
        "Кто тебе разрешал отходить? Нам пора.",
        m.show("kagami", "tired", "center"),
      ),
      n(
        "Она тащила меня прочь, словно нашкодившего щенка.",
        m.sfx("walking", 1),
      ),
      n("Она хочет, чтобы я забыл увиденное? Да это же безумие..."),
      n("Мы шли еще минуту, пока не добрались до маленькой пристройки."),
    ],
    next: "quiz_intro",
  },

  quiz_intro: {
    id: "quiz_intro",
    hideCharacter: "kagami",
    bg: "/bg/common/quiz_room.webp",
    lines: [
      nfx("Мы вошли внутрь... Стерильное место, белые стены.", {
        audio: [
          { type: "stop_sfx", id: "rain", fade: 500 },
          { type: "sfx", id: "door_close", volume: 1 },
          { type: "sfx", id: "muffled_rain", volume: 0.05, loop: true },
        ],
        action: () =>
          audioMacros.playStems(
            {
              base: "Struggle won't change anything",
              muffled: "Struggle won't change anything_muffled",
            },
            "base",
            0.7,
          ),
      }),
      n("Они отражают эту комнату."),
      n("Два стола стоят напротив друг друга и одна доска."),
      say("kagami", "Присаживайся."),
      n("На парте уже лежит бумага и ручка."),
      say("kagami", "Пока что не переворачивай листок."),
      nfx(
        "Я сел за парту.",
        { bg: "/bg/common/quiz_room_noKagami.webp" },
        m.sfx("chair_sitting", 1),
      ),
      nfx("Кагами сложила наши зонты в корзину и села напротив меня.", {
        bg: "/bg/common/quiz_room_kagamiSpeak.webp",
        bgSpeed: 50,
        ...m.sfx("highHeels_walking", 1),
      }),
      say(
        "kagami",
        "Правила простые, у тебя 20 минут, чтобы ответить на 8 вопросов.",
      ),
      say("kagami", "Чтобы пройти тест, хотя бы 4 должны быть правильными."),
      say(
        "kagami",
        "Как только закончишь — положи ручку на парту и подними руку.",
      ),
      say(
        "kagami",
        "Других учеников хоть и нет, но золотое правило каждого теста или экзамена — молчание.",
      ),
      say("kagami", "Как только перевернёшь листок — таймер пойдёт."),
      say("kagami", "Вопросы?"),
      n("Думаю лишь один, самый логичный."),
      say("ren", "А если не отвечу?"),
      say("kagami", "Провалишь тест и вернёшься откуда пришёл."),
      n("Нет, это не вариант..."),
    ],
    interactables: [
      {
        type: "look",
        label: "Перевернуть листок",
        pos: { x: 50, y: 90 },
        action: () => {
          if (!state.temp) {
            state.temp = {};
          }
          state.temp.quizScore = 0;

          if (window.quizTimer) {
            window.quizTimer.clear();
          }

          window.quizTimer = new PausableTimeout(() => {
            window.quizTimer = null;
            window.dispatchEvent(
              new CustomEvent("loadScene", { detail: "quiz_afk_fail" }),
            );
          }, 1200000);
        },
        next: "quiz_q1",
      },
    ],
  },

  quiz_q1: {
    id: "quiz_q1",
    bg: "/bg/common/quiz_room_paper.webp",
    lines: [
      n(
        "Вопрос 1: Какой гормон отвечает за формирование поведения подчинения при длительном социальном давлении?",
        m.sfx("paper_turn", 1),
      ),
      n("A) Кортизол"),
      n("B) Окситоцин"),
      n("C) Тестостерон"),
      n("D) Серотонин"),
      n("....."),
      n("Чего нах..?"),
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
      say("ren", "Кагами-сен..."),
      nfx(
        "Кагами стукнула по столу. Не сильно, не от злости, а просто, чтобы заткнуть меня.",
        { shake: "medium" },
        m.sfx("table_hit", 1),
      ),
      say("kagami", "Ещё раз нарушишь правило и провалишь."),
      n("Да вы вопросы эти читали? Может это подстава? Она перепутала бумаги?"),
      n("… Ладно, ничего сейчас не остаётся."),
    ],
    next: "quiz_q1_pick",
  },

  quiz_q1_pick: {
    id: "quiz_q1_pick",
    bg: "/bg/common/quiz_room_paper.webp",
    lines: [n("Выбираю наугад.")],
    choices: [
      { text: "A) Кортизол", next: "quiz_q2" },
      {
        text: "B) Окситоцин",
        action: () => {
          state.temp.quizScore++;
        },
        next: "quiz_q2",
      }, // ✅
      { text: "C) Тестостерон", next: "quiz_q2" },
      { text: "D) Серотонин", next: "quiz_q2" },
    ],
  },

  quiz_q2: {
    id: "quiz_q2",
    lines: [
      n(
        "Вопрос 2: Какой показатель наименее надёжен для оценки искреннего согласия?",
        m.sfx("writing", 1),
      ),
      n("A) Вербальное 'да'"),
      n("B) Поза тела"),
      n("C) Пульс/дыхание"),
      n("D) Последовательность действий после события"),
      n(
        "… Значит, это был не единственный такой вопрос? Я готов решить квадратное уравнение, но что это такое?!",
      ),
      nfx(
        "Я поднял глаза на Кагами. Она просто смотрит в телефон. Она знает, что здесь не академические вопросы?",
        { bg: "/bg/common/quiz_room_kagamiPhone.webp" },
      ),
      n("Никакой реакции с её стороны, она просто следит за порядком."),
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
      n(
        "Хмф, ну раз вы молчите и даже не удосужились меня предупредить о таких вопросах, то думаю, можно отомстить и полюбоваться.",
        { action: () => audioMacros.fadeToStem("muffled", 1000) },
      ),
      nfx("Я смотрю на её грудь под красной блузкой.", {
        bg: "/bg/cg/prologue/quiz_room_boobs.webp",
        dialogStyle: "transparent",
      }),
      n("Она такая пышная, охренеть..."),
      n("Какой у неё вообще размер? Они не меньше четвёртого."),
      n("Каково их потрогать?"),
      n("Кому-то ведь она в своей жизни давала их полапать?"),
      n(
        "Довольно отчетливо я вижу и тёмный бюстгальтер, который выглядывает из-под блузки...",
      ),
      n("Кагами, да вы меня соблазняете?"),
      n("Член твердеет, натягивая мои штаны, но под партой этого не видно."),
      nfx("Я приулыбнулся, посмотрел ей в глаза....", {
        bg: "/bg/common/quiz_room_kagamiPhone.webp",
        dialogStyle: "normal",
      }),
      n(
        "Ноль эмоций, её, кажется, ничего не заботит. Ни возбуждения, ни отвращения.",
      ),
      n("Блять, время, точно!", {
        action: () => audioMacros.fadeToStem("base", 1000),
      }),
    ],
    next: "quiz_q2_pick",
  },

  quiz_q2_pick: {
    id: "quiz_q2_pick",
    bg: "/bg/common/quiz_room_paper.webp",
    lines: [n("Ладно. Ответ...")],
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

  quiz_q3: {
    id: "quiz_q3",
    lines: [
      n(
        "Вопрос 3: При одинаковых вводных, доля субъектов, которые меняют линию поведения после первого наказания (в пределах 72 часов), составляет:",
        m.sfx("writing", 1),
      ),
      n("A) 18%"),
      n("B) 37%"),
      n("C) 61%"),
      n("D) 84%"),
      n("О чём вообще идёт речь? Я в это даже вдумываться не хочу."),
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

  quiz_q4: {
    id: "quiz_q4",
    lines: [
      n(
        "Вопрос 4: Какое действие усиливает эффект принуждения сильнее всего при прочих равных?",
        m.sfx("writing", 1),
      ),
      n("A) Объяснение причин"),
      n("B) Лишение выбора в мелочах"),
      n("C) Повышение голоса"),
      n("D) Присутствие свидетелей"),
      n(
        "Каждый новый вопрос всё меньше поражает меня. Это то, что ученики здесь проходят?",
      ),
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

  quiz_q5: {
    id: "quiz_q5",
    lines: [
      n(
        "Вопрос 5: Какое вещество используется в качестве базового агента при добровольной коррекции поведения?",
        m.sfx("writing", 1),
      ),
      n("A) Мидазолам"),
      n("B) Налтрексон"),
      n("C) Флуоксетин"),
      n("D) Окситоцин синтетический"),
      n(
        "А впрочем, что раньше я отвечал наугад, что сейчас. Ничего не изменилось.",
      ),
    ],
    choices: [
      { text: "A) Мидазолам", next: "quiz_q6" },
      { text: "B) Налтрексон", next: "quiz_q6" },
      { text: "C) Флуоксетин", next: "quiz_q6" },
      {
        text: "D) Окситоцин синтетический",
        action: () => {
          state.temp.quizScore++;
        },
        next: "quiz_q6",
      }, // ✅
    ],
  },

  quiz_q6: {
    id: "quiz_q6",
    lines: [
      n(
        "Вопрос 6: Какое из состояний наиболее продуктивно для обучаемого?",
        m.sfx("writing", 1),
      ),
      n("A) Спокойствие и уверенность"),
      n("B) Лёгкая тревога"),
      n("C) Острый страх"),
      n("D) Полное безразличие"),
      n("Этот кажется лёгким и даже адекватным."),
    ],
    choices: [
      { text: "A) Спокойствие и уверенность", next: "quiz_q7" },
      { text: "B) Лёгкая тревога", next: "quiz_q7" },
      {
        text: "C) Острый страх",
        action: () => {
          state.temp.quizScore++;
        },
        next: "quiz_q7",
      }, // ✅
      { text: "D) Полное безразличие", next: "quiz_q7" },
    ],
  },

  quiz_q7: {
    id: "quiz_q7",
    lines: [
      n(
        "Вопрос 7: Минимальный порог болевого воздействия для коррекции поведенческой девиации составляет?",
        m.sfx("writing", 1),
      ),
      n("A) 2–4 Н/см²"),
      n("B) 8–12 Н/см²"),
      n("C) 15–20 Н/см²"),
      n("D) Индивидуален, стандарт неприменим"),
      n("Это даже не смешно уже."),
    ],
    choices: [
      { text: "A) 2–4 Н/см²", next: "quiz_q8" },
      { text: "B) 8–12 Н/см²", next: "quiz_q8" },
      { text: "C) 15–20 Н/см²", next: "quiz_q8" },
      {
        text: "D) Индивидуален, стандарт неприменим",
        action: () => {
          state.temp.quizScore++;
        },
        next: "quiz_q8",
      }, // ✅
    ],
  },

  quiz_q8: {
    id: "quiz_q8",
    lines: [
      n("Вопрос 8: Вы провалили тест. Ваши действия?", m.sfx("writing", 1)),
      n("A) Потребовать пересдачи"),
      n("B) Принять результат и следовать инструкциям куратора"),
      n("C) Покинуть учреждение"),
      n("D) Оспорить правомерность теста"),
    ],
    next: () =>
      state.hero.stats.dominance >= -3 ? "quiz_q8_auto" : "quiz_q8_manual",
  },

  quiz_q8_auto: {
    id: "quiz_q8_auto",
    lines: [n("Оспорить блядскую правомерность!"), n("Я обвёл D.")],
    next: "quiz_end_check",
  },

  quiz_q8_manual: {
    id: "quiz_q8_manual",
    lines: [n("Наконец-то последний вопрос.")],
    choices: [
      { text: "A) Потребовать пересдачи", next: "quiz_end_check" },
      {
        text: "B) Принять результат и следовать инструкциям куратора",
        action: () => {
          state.temp.quizScore++;
        },
        next: "quiz_end_check",
      }, // ✅ Правильный
      { text: "C) Покинуть учреждение", next: "quiz_end_check" },
      { text: "D) Оспорить правомерность теста", next: "quiz_end_check" },
    ],
  },

  quiz_end_check: {
    id: "quiz_end_check",
    action: () => {
      if (window.quizTimer) {
        window.quizTimer.clear();
        window.quizTimer = null;
      }
    },
    lines: [
      n("Я положил ручку на стол и поднял руку.", m.sfx("writing", 1)),
      nfx(
        "Кагами встала со своего места, подошла ко мне и забрала листок с парты.",
        {
          bg: "/bg/common/quiz_room_noKagami.webp",
          ...m.sfx("highHeels_walking", 1),
        },
      ),
      n("Она проверяет мои ответы, не отходя."),
      n("Я просто замер, слушая её дыхание."),
    ],
    next: () => {
      if ((state.temp.quizScore || 0) >= 4) {
        setFlag("quizPassed");
        if (getFlag("kagamiStare")) {
          return "quiz_pass_stared";
        } else {
          return "quiz_pass_clean";
        }
      }
      return "quiz_fail";
    },
  },

  // ============================================
  // КОНЦОВКА 1: ПРОШЕЛ ЧИСТО
  // ============================================
  quiz_pass_clean: {
    id: "quiz_pass_clean",
    lines: [
      sf(
        "kagami",
        "Поздравляю, ты сдал..",
        m.show("kagami", "neutral2", "center"),
        m.stopBgm(),
      ),
      n("Она это сказала с какой-то грустинкой в голосе."),
      n("Она разочарована моим поступлением?"),
      nfx(
        "Кагами открыла дверь из этой комнаты и выключила свет.",
        m.fx({ darkness: 0.8, duration: 1000 }),
        m.sfx("light_switch", 1),
      ),
      sf("kagami", "Пойдём, Рен. Продолжим экскурсию.", m.hide("kagami")),
    ],
    next: "corridor_intro",
  },

  // ============================================
  // КОНЦОВКА 2: ПРОШЕЛ, НО ПЯЛИЛСЯ
  // ============================================
  quiz_pass_stared: {
    id: "quiz_pass_stared",
    lines: [
      sf(
        "kagami",
        "Поздравляю, ты сдал..",
        m.show("kagami", "neutral2", "center"),
        m.stopBgm(),
        { action: () => removeFlag("kagamiStare") },
      ),
      n("Она это сказала с лёгкой насмешкой?"),
      nfx(
        "Кагами подошла к своему столу и взяла оттуда толстую металлическую линейку, сантиметров на 50.",
        m.hide("kagami"),
        {
          bg: "/bg/common/quiz_room_kagamiRuler1.webp",
          ...m.sfx("highHeels_walking", 1),
        },
      ),
      say(
        "kagami",
        "Но ты нарушил мои личные границы, когда посмел нагло пялиться на меня.",
      ),
      nfx(
        "Она встала прямо напротив меня с линейкой в руке.",
      ),
      say("kagami", "Нет желания сейчас встать на колени и извиниться?"),
    ],
    choices: [
      {
        text: "Встать на колени",
        effects: { dominance: -2, rank_score: -2 },
        next: "quiz_punishment_kneel",
      },
      {
        text: "Отказаться",
        req: { dominance: { min: 0 } },
        effects: { dominance: 1, sanity: 2 },
        next: "quiz_punishment_defy",
      },
    ],
  },

  quiz_punishment_kneel: {
    id: "quiz_punishment_kneel",
    bg: "/bg/cg/prologue/quiz_room_kagamiRuler2.webp",
    lines: [
      nfx(
        "Моё тело нехотя само начало двигаться. Я сполз со стула и опустился на колени перед ней.",
      ),
      say("ren", "Эмм.. Простите, Кагами."),
      n(
        "Холодный металл вдруг коснулся моего подбородка. Кагами просунула конец линейки мне под челюсть и заставила поднять голову.",
      ),
      say("kagami", "Смотри в глаза, Рен, а не на грудь."),
      n(
        "Её голос звучит абсолютно отстраненно. Она даже не касается меня руками.",
      ),
      n(
        "Чувство, что для неё я настолько грязен, что она использует инструмент.",
      ),
      say(
        "kagami",
        "Ты — ранг D. Простой мусор. То, что ты пускаешь слюни на куратора, лишь доказывает твою примитивность.",
      ),
      n("Она надавила линейкой чуть сильнее. Металл впился в кожу."),
      say("ren", "Агх..."),
      say(
        "kagami",
        "Запомни это чувство дистанции. Это хороший урок для тебя. Вставай.",
      ),
      nfx("Она убрала линейку, положив её на место.", {
        bg: "/bg/common/quiz_room.webp",
      }),
      n("Блять... Мой мозг не успевает за ситуацией..."),
      nfx("Но член в штанах почему-то стал только тверже.", m.sanity(-5)),
      say("kagami", "Рен, если готов, то идём дальше."),
      n("Я поднялся с колен и отряхнулся. Сердце всё ещё колотится."),
      n(
        "Кагами выключила свет в комнате.",
        m.fx({ darkness: 0.8, duration: 1000 }),
        m.sfx("light_switch", 1),
      ),
      n("Я опять должен просто сделать вид, что ничего не было?"),
    ],
    next: "corridor_intro",
  },

  // ============================================
  // КОНЦОВКА 3: ПРОВАЛ
  // ============================================
  quiz_fail: {
    id: "quiz_fail",
    lines: [
      // n() принимает только 1 объект — мержим stopBgm внутрь
      n(
        "Я мирно ждал результатов, как вдруг почувствовал, как Кагами поставила свою ногу на мой стул.",
        {
          ...m.stopBgm(),
        },
      ),
      say("ren", "Кагами-сенс.."),
      sf(
        "ren",
        "Агх!",
        { shake: "medium", ...m.sfx("falling_chair", 1) },
        // fx — отдельным полем, action не нужен
        { ...m.fx({ darkness: 1, noise: 0, duration: 500 }) },
      ),
      n("Она оттолкнула меня, и я грохнулся вместе со стулом на пол."),
      nfx(
        "Кагами встала надо мной, расставив ноги по бокам от меня.",
        { bg: "/bg/cg/prologue/quiz_room_kagami.webp" },
        { ...m.fx({ darkness: 0, noise: 0, duration: 500 }) },
        {
          action: () =>
            audioMacros.playStems(
              { base: "Willbreaker", muffled: "Willbreaker_muffled" },
              "base",
              0.7,
            ),
        },
      ),
      say("ren", "Какого ху… Что вы делаете?!"),
      say("kagami", "Рен Амано, ты провалил тест."),
      say(
        "kagami",
        "Ты проявил себя как слабак в первые же минуты своего прибытия.",
      ),
      say(
        "kagami",
        "Теперь тебя отправят обратно в твою школу, где тебя встретит полиция.",
      ),
      sf("kagami", "Твоя жизнь на этом закончится.", {
        effects: { sanity: -5 },
      }),
      n("…Уже конец?", m.fx({ darkness: 1, duration: 500 })),
      n("Так просто всё кончится?"),
      nfx(
        "Без меня...",
        { bg: "/bg/common/rin.webp" },
        { ...m.fx({ vignette: 1, duration: 1500 }) },
        { action: () => audioMacros.fadeToStem("muffled", 1000) },
      ),
      n("Рин.", m.fx({ darkness: 0, duration: 500 })),
      n("Что с ней сделают, если я не вернусь?"),
      n("Всё не должно было дойти до этого."),
      sf(
        "kagami",
        "Не расстраивайся, Рен Амано, у меня есть вариант для таких, как ты.",
        { bg: "/bg/cg/prologue/quiz_room_kagami.webp" },
        { ...m.fx({ vignette: 0, duration: 3000 }) },
        { action: () => audioMacros.fadeToStem("base", 1000) },
      ),
      say("ren", "… Я вас слушаю."),
      n("Кагами сняла правый каблук и поднесла ногу прямо к моему лицу."),
      sf("kagami", "Лижи.", {
        bg: "/bg/cg/prologue/quiz_room_footLicking1.webp",
        bgSpeed: 50,
        dialogStyle: "transparent",
      }),
      say("ren", "Лизать?"),
      say(
        "kagami",
        "Перестань тратить моё время, сейчас ты мусор, который должен заплатить за свою неудачу.",
      ),
      say("kagami", "Лижи или вали в объятия полиции."),
    ],
    choices: [
      {
        text: "Провести языком по ступне",
        effects: { dominance: -10 },
        next: "quiz_fail_lick",
      },
      {
        text: "Кагами, идите нахер",
        req: { dominance: { min: 10 } },
        effects: { dominance: 5 },
        next: "quiz_fail_reject",
      },
    ],
  },

  quiz_fail_lick: {
    id: "quiz_fail_lick",
    lines: () => [
      // n() — один объект, action внутри него
      n("…Не могу поверить, что делаю это.", {
        action: () => audioMacros.fadeToStem("muffled", 1000),
      }),
      nfx("Я медленно приближаюсь лицом к её ступне и высовываю язык.", {
        bg: "/bg/cg/prologue/quiz_room_footLicking2.webp",
        bgSpeed: 50,
      }),
      n(
        "Вкус ударяет сразу — смесь тёплой кожи, туфель и едва уловимого аромата её лосьона.",
      ),
      nfx("Я еле упёрся языком в нейлон и слегка провёл.", {
        ...m.sfx("clothes_rustle"),
      }),
      say("kagami", "Ты издеваешься?"),
      say("kagami", "По-твоему, так просят о пощаде?"),
      n("Она посильнее надавила носочком на мой язык."),
      nfx("Её большой палец оказался у меня на губах.", {
        bg: "/bg/cg/prologue/quiz_room_footLicking3.webp",
        bgSpeed: 50,
      }),
      say(
        "kagami",
        "Вот так, каждый пальчик по очереди как следует обработай.",
      ),
      nfx("Да что за нахуй...", { ...m.sanity(-5) }),
      n("Не дай бог кто-то зайдёт."),
      n("…"),
      n("…"),
      n("Я лижу, лижу, уже минуту, когда она закончит?"),
      say("kagami", "Теперь интенсивнее, Рен!"),
      n("Я действительно начал пытаться удовлетворить её желания."),
      n("Я начал лизать пальцы её ног ещё быстрее."),
      n("Но каким бы пиздецом это ни было..."),
      n("Мой член…"),
      nfx("Он начал натягивать резину на штанах.", { ...m.sanity(-1) }),

      ...(getFlag("kagamiStare")
        ? [
            sf(
              "kagami",
              "Давай, Рен, усерднее. Тебе ведь так понравилось безнаказанно пялиться на меня, верно? Тебе ведь нравится вкус?",
              { bg: "/bg/cg/prologue/quiz_room_kagamiSmirk.webp", bgSpeed: 50 },
            ),
            n("Я, конечно, и правда пялился."),
            n("Но неужели это соразмерное наказание?"),
            n("Я не хотел доводить до такого!"),
          ]
        : []),

      nfx(
        "Кагами на секунду вынула ногу.",
        { bg: "/bg/cg/prologue/quiz_room_footLicking4.webp", bgSpeed: 50 },
        {
          action: () => {
            removeFlag("kagamiStare");
            audioMacros.fadeToStem("base", 1000);
          },
        },
      ),
      n("Слюна струной протянулась от её стопы до моих губ."),
      n("Что за мерзость..."),
      n(
        "Её чёрный нейлоновый носок... Он насквозь промок... Я вижу красный лак на её пальцах сквозь носок.",
      ),
      say("ren", "Почему вы вообще себе позволяете такое?"),
      nfx(
        "Её нога опять у моего рта.",
        { bg: "/bg/cg/prologue/quiz_room_footLicking3.webp" },
        { action: () => audioMacros.fadeToStem("muffled", 1000) },
      ),
      n("Я медленно обвожу её языком кругами."),
      say("kagami", "Чувствую, что тебе нравится, да, Рен?"),
      say("ren", "Хмпф.."),
      n(
        "Ещё две минуты комната была наполнена лишь чавкающими звуками и моими приглушёнными стонами.",
      ),
      n("Но ощущалось это намного дольше."),
      n(
        "Я сам для себя не могу определиться, меня пугает ситуация или мой стояк?",
      ),
      nfx("Унижение и похоть разрывают меня.", { ...m.sanity(-5) }),
      // stopBgm — через audio-поле, не через action
      n("Кагами высунула ногу, я начал отдышиваться.", { ...m.stopBgm() }),
      sf(
        "kagami",
        "На этом всё, так уж и быть, тест будет засчитан пройденным.",
        { bg: "/bg/cg/prologue/quiz_room_kagami.webp", dialogStyle: "normal" },
      ),
      say(
        "kagami",
        "Но так ли много в этом смысла, если ты уже никчёмно валяешься на полу?",
      ),
      nfx(
        "Кагами сняла оба носка, даже тот, что она не использовала, и выкинула их в урну.",
        { bg: "/bg/common/quiz_room.webp" },
      ),
      nfx(
        "Затем она выключила свет, открыла дверь и вышла со своим зонтом.",
        { ...m.fx({ darkness: 0.8, noise: 0, duration: 500 }) },
        { ...m.sfx("light_switch", 1) },
      ),
      say("kagami", "Идём дальше."),
      n("Я встал и отряхнулся."),
      n("Она предлагает мне вновь просто забыть, как было с той ученицей?"),
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
      nfx(
        "АФК целых 20 минут?",
        nfx("АФК целых 20 минут?", {
          audio: [
            { type: "stop_sfx", id: "muffled_rain", fade: 50 },
            { type: "stop", fade: 1000 },
          ],
        }),
      ),
      n("Таймер вышел, ты всрал с потрохами!"),
      n(
        "Но если честно... На самом деле ты победил, ведь ты отправился в рай,",
      ),
      n("И нашёл пак очень горячих фоток Кагами. Они не каноничны, кстати."),
      n(
        "Однако обязательно хорошенько подёргай свою писюльку на взрослую тётю.",
      ),
      n(
        "Ты шёл по раю и внезапно нашёл маленький фотоальбом, который ты сразу же открыл:",
      ),
      nfx(" ", {
        bg: "/bg/common/kagami_bonus_1.webp",
        dialogStyle: "transparent",
      }),
      nfx(" ", { bg: "/bg/common/kagami_bonus_2.webp", bgSpeed: 50 }),
      nfx(" ", { bg: "/bg/common/kagami_bonus_3.webp", bgSpeed: 50 }),
      nfx(" ", { bg: "/bg/common/kagami_bonus_4.webp", bgSpeed: 50 }),
      nfx(" ", { bg: "/bg/common/kagami_bonus_5.webp", bgSpeed: 50 }),
      n("И напиши потом в комментариях, какая тебе больше всего понравилась!"),
      n("Ладно, даю ещё шанс по-нормальному переиграть.", {
        dialogStyle: "normal",
      }),
    ],
    next: "quiz_intro",
  },

  corridor_intro: {
    id: "corridor_intro",
    bg: "/bg/common/road_dorm.webp",
    lines: () => [
      nfx("Мы на улице.", {
        ...m.fx({ darkness: 0, duration: 1000 }),
        audio: [
          { type: "stop_sfx", id: "muffled_rain", fade: 50 },
          { type: "sfx", id: "rain", volume: 0.8, loop: true },
        ],
      }),
      n("Я послушно шёл за Кагами."),
      say("kagami", "Рен, сейчас мы идём в общежитие. Там ты будешь жить."),
      n("Я посмотрел вперёд сквозь дождь."),
      n("Я разглядел три довольно стрёмно выглядящих здания."),
      n("Одно из них находится за забором?"),
      nfx(
        "Мы шли молча... Кажется, что у меня очень много вопросов, но я не решаюсь их сейчас задать.",
        m.fx({ darkness: 1, noise: 0, duration: 500 }),
      ),
      nfx("И вот мы наконец зашли в одно из зданий и молча прошли в лифт.", {
        bg: "/bg/common/elevator_kagami.webp",
      }),
      nfx("Мы поднимались на четвёртый этаж в всё той же полной тишине.", {
        ...m.fx({ darkness: 0, noise: 0, duration: 0 }),
        audio: [
          { type: "stop_sfx", id: "rain", fade: 500 },
          { type: "sfx", id: "elevator", volume: 1, loop: true },
        ],
      }),
      n("Ну, осмотрю хотя бы лифт."),
      n(
        "Его стены были в граффити, дверь ржавая, а цифровое табло с цифрой этажа не работало. Я чувствую, что это здание... не очень-то ухоженное.",
      ),
      n("Но для меня выделилась маленькая фотография, приклеенная к стене."),
      nfx(
        "Какая-то очкастая девочка с хорошими формами сфотографировала себя.",
        { bg: "/bg/common/elevator_photo.webp" },
      ),
      n("Она была полуголой, но блин, сосков не видно."),
      say("ren", "Воу…"),
      n("Совершенно случайно вырвался из меня тупорылый звук."),
      n("Но Кагами проигнорировала."),
      n(
        "Я хотел рассмотреть фото подольше, но лифт остановился, и двери открылись.",
        {
          audio: [
            { type: "stop_sfx", id: "elevator", fade: 500 },
            { type: "sfx", id: "elevator_door", volume: 1 },
          ],
        },
      ),
      nfx(
        "Мы шли по длинному коридору общежития и остановились прямо у комнаты номер 404.",
        {
          bg: "/bg/locations/dorm_hall.webp",
          ...m.sfxMix(["rain", 0.8, true], ["walking"]),
        },
      ),
      n("Кагами достала ключ и открыла им дверь."),
      nfx("Затем ключи были переданы мне в руки.", {
        ...m.show("kagami", "neutral", "center"),
        ...m.sfx("key_door"),
      }),
      say(
        "kagami",
        "Запомни, ты живёшь во втором корпусе, на 4-м этаже в 404 комнате.",
      ),
      n("Я слегка кивнул, и мы вместе зашли внутрь."),
      nfx("А вот и моя комната, да?", m.hide("kagami"), {
        bg: "/bg/locations/dorm_renRoom.webp",
        audio: [
          { type: "stop_sfx", id: "rain" },
          { type: "sfx", id: "muffled_rain", volume: 0.5, loop: true },
          { type: "bgm", id: "Im Home", volume: 1 },
        ],
      }),
      n("Кроватка, столик, мини-кухня."),
      n("Ничего необычного, кроме решётки... И этой камеры в углу."),
      n("Блять, вы серьёзно, кто-то будет смотреть, как я дрочу?"),
      n("Я просто прикрою камеру чем-нибудь."),
      n(
        "Пока я размышлял, Кагами уже прошла дальше, со скрипом села на ближайший стул и скрестила ноги.",
        m.sfx("chair_sitting"),
      ),

      ...(!getFlag("quizPassed")
        ? [
            nfx(
              "Я невольно опустил взгляд. Её босые ноги были обуты прямо в туфли. Она ведь выкинула носки в мусорку.",
              {
                bg: "/bg/cg/prologue/dorm_kagami_noSocks.webp",
                dialogStyle: "transparent",
              },
            ),
          ]
        : [
            nfx(
              "Я невольно опустил взгляд. Чёрный нейлон плотно облегал её ступни.",
              {
                bg: "/bg/cg/prologue/dorm_kagami_withSocks.webp",
                dialogStyle: "transparent",
              },
            ),
          ]),

      say("kagami", "Рен, в этой школе есть гласные и негласные правила."),
      say(
        "kagami",
        "Гласные правила ты всегда можешь прочитать на стенде на первом этаже школы.",
      ),
      say("kagami", "Негласные тебе предстоит выучить самому."),
      say("kagami", "Ведь самый лучший способ научиться драться — это драка."),
      n("Так ли это?"),
      n("Что ещё за негласные правила?"),
      n("Школа явно полна странностей."),
      say("kagami", "Держи."),
      nfx("Кагами протянула мне телефон.", m.sfx("item_get")),
      n("На вид самый обычный, но нет конкретной марки производителя."),
      say(
        "kagami",
        "Этот телефон является самым важным предметом в жизни ученика.",
      ),
      say(
        "kagami",
        "Это твой студенческий билет, твоя банковская карта и параллельно самый обычный телефон.",
      ),
      say(
        "kagami",
        "В нём есть вся нужная информация о твоей успеваемости и о школе.",
      ),
      say(
        "kagami",
        "С помощью него ты хоть как-то сможешь отслеживать события в мире за пределами школы.",
      ),
      say(
        "kagami",
        "Думаю, ты сам прекрасно разберёшься со всем в течение первой недели.",
      ),
      say(
        "kagami",
        "Но будь осторожен. Поломка телефона тебе дорого обойдётся.",
      ),

      ...(!getFlag("quizPassed")
        ? [n("Опять лизанием ног?"), n("Я не хочу.")]
        : []),

      say(
        "kagami",
        "В школе строгая иерархия. От мусора F-ранга до абсолютной элиты S-ранга.",
      ),
      say("kagami", "Ты, как и все новички, начинаешь с D-ранга."),
      say(
        "kagami",
        "Чтобы не свалиться на самое дно, тебе нужно как минимум не прогуливать, не опаздывать и не нарушать базовые правила.",
      ),
      say("ren", "А чтобы подняться?"),
      say("kagami", "Тебе нужно быть удобным и полезным."),
      n("Быть удобным... Что она имеет в виду?"),
      say(
        "kagami",
        "Ранги дают уважение, власть и доступ к закрытым участкам школы.",
      ),
      say(
        "kagami",
        "У элиты есть свои территории, свои частные 'вечеринки'. Если ты сунешься туда без приглашения — тебя ждёт наказание.",
      ),
      say(
        "kagami",
        "Как и во всех школах, плохо себя ведёшь — наказан, хорошо себя ведёшь — поощрение. Вопросы?",
      ),
      say("ren", "Тест, который я решал..."),
      say(
        "ren",
        "Почему там были такие вопросы? Они совершенно не академические.",
      ),
      say("kagami", "Разве?"),
      say(
        "kagami",
        "А на мой взгляд, мы честно проверили твои базовые знания для выживания здесь.",
      ),
      say("kagami", "Хочешь подать официальную жалобу?"),
    ],
    choices: [
      {
        text: "Написать жалобу",
        effects: { dominance: 1 },
        next: "kagami_leaves",
      },
      {
        text: "Забить и промолчать",
        effects: { dominance: -1 },
        next: "kagami_leaves",
      },
    ],
  },

  kagami_leaves: {
    id: "kagami_leaves",
    lines: [
      say("kagami", "Мне абсолютно плевать на твои возмущения."),
      say(
        "kagami",
        "Обращаться к администрации D-рангу не позволено. Но конечно у тебя ещё есть мысли, что ты что-то тут значишь.",
      ),
      say("kagami", "Завтра твой первый школьный день. Выспись."),
      say(
        "kagami",
        "В телефоне найдёшь расписание и кабинет. На классном часе я представлю тебя перед всеми.",
      ),
      say("ren", "Вы будете меня представлять?"),
      say("kagami", "А, точно. Забыла сказать."),
      say(
        "kagami",
        "Тебя распределили ещё до твоего приезда. Класс 2-B. Я твой классный руководитель.",
      ),
      nfx(
        "Она встала и направилась к двери. В воздухе остался лёгкий шлейф вина и её духов.",
        { bg: "/bg/locations/dorm_renRoom.webp" },
      ),
      n("...", m.sfx("door_close")),
      say("ren", "До свида... ния."),
      n("Не успел я сказать."),
      n("Время на часах 21:43."),
      n("Я дремал в автобусе по пути сюда, но чувствую себя не очень."),
    ],
    next: "tbc",
  },

  tbc: {
    id: "tbc",
    lines: () => [
      n(
        "Да, можно было бы заглянуть в телефон или осмотреться, но пока нет, я хочу просто уснуть.",
      ),
      nfx("Я разлёгся на кровати. Она вроде неплохая.", {
        ...m.fx({ darkness: 1, noise: 0, duration: 500 }),
        ...m.sfx("bed_creak"),
      }),
      n("Необычный денёк, хех."),
      nfx(
        "Голая ученица у входа...",
        m.fx({ darkness: 0, noise: 0, duration: 500 }),
        { bg: "/bg/cg/prologue/punished_girl_laugh.webp" },
      ),
      n("Всё ещё не верю в увиденное."),

      ...(getFlag("sawChainedGirl")
        ? [
            n("Она вела себя несколько странно."),
            n("Но не сама же себя она прицепила."),
            n(
              "Мне странно это осознавать, но, вероятно, с ней делают много плохих вещей... И школе плевать?",
            ),
          ]
        : []),

      n("Затем этот странный тест..."),

      ...(!getFlag("quizPassed")
        ? [
            nfx("Мне уже плевать на вопросы... Я лизал ноги учительницы.", {
              bg: "/bg/cg/prologue/quiz_room_footLicking2.webp",
            }),
            n(
              "Кагами красивая, грудастая. Но она уложила меня на пол и заставила лизать ноги...",
            ),
          ]
        : []),

      nfx(
        "Этот небольшой приезд утомил меня больше, чем весь остальной день.",
        m.fx({ darkness: 1, noise: 0, duration: 500 }),
      ),
      n("А что меня ждёт дальше?"),
      n(
        "Кажется мне... Что ученики и учителя здесь давно несколько ёбнулись...",
      ),
      n(
        "Да..... Я начинаю уже уходить в сон... Такой прекрасный и тихий... Подальше от всего этого...",
      ),
      n("Вглубь..."),
    ],

    // МАЙ ФИКС: Вызываем титры ТОЛЬКО ЗДЕСЬ, вне массива lines!
    next: () => {
      // 1. Прячем интерфейс игры
      const dialogWrapper = document.getElementById("dialog-wrapper");
      if (dialogWrapper) dialogWrapper.style.display = "none";

      // 2. Вызываем титры
      window.startCredits([
        `КОНЕЦ ПЕРВОЙ ЧАСТИ ПРОЛОГА.<br /><br />
    <span
      style="
        color: #ff4d4d;
        font-size: 1.2rem;
        text-shadow: 0 0 10px rgba(255, 0, 0, 0.5);
      "
    >
      Так началась эта история.<br />
      Впереди — лишь больше грязи.<br />
      Пройдёте ли вы этот путь? </span
    >`,
        `Создатели:<br /><br />Гейм-директор / Сценарист: V&Mai Studio<br />Код /
    Ассистент: Май (Perplexity AI)<br />Арт: WAI Illustrious SDXL / Nano Banana
    2`,
        `Получай ранний доступ к обновлениям и артам. Участвуй в
    голосованиях.<br />Общайся с разработчиком.<br />
    <div class="credits-support-buttons">
      <a
        href="https://www.patreon.com/c/VMaistudio"
        target="_blank"
        class="support-btn patreon"
      >
        <img
          src="icons/patreon.svg"
          alt="Patreon"
          style="width: 24px; height: 24px; filter: brightness(0) invert(1)"
        />
        Поддержать на Patreon
      </a>
      <a href="https://boosty.to/vmaistudio" target="_blank" class="support-btn boosty">
        <img
          src="icons/boosty.svg"
          alt="Boosty"
          style="width: 24px; height: 24px; filter: brightness(0) invert(1)"
        />
        Поддержать на Boosty
      </a>
    </div>
    `,
      ]);

      // 3. Возвращаем null, чтобы движок понял, что история окончена и больше загружать нечего
      return null;
    },
  },
};

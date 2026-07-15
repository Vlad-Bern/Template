import { m, audioMacros, n, say, nfx, sf } from "../../macros.js";
import { state, setFlag, getFlag, removeFlag } from "../../../core/state.js";

export const story = {
  prologue_interrogation: {
    id: "prologue_interrogation",
    bg: "./bg/common/dream_man.webp",
    lines: [
      sf("mystery", "レン。", {
        ...m.fx({ darkness: 1, noise: 1, duration: 0 }),
        ...m.bgm("Zero Rank", 0.5),
        pdaUnlocked: false,
      }),
      say("mystery", "聞こえるか？"),
      sf(
        "ren",
        "あ、ああ……",
        m.fx({ darkness: 0.9, noise: 0.2, duration: 500 }),
      ),
      n("スーツ姿のシルエットが正面に座っている。タバコの匂いがした。"),
      nfx(
        "動こうとしたが、無駄だった。両手は肘掛けに縛りつけられている。",
        m.sfx("rope_struggle_chair", 0.8),
        m.fx({ darkness: 1, noise: 0.2, duration: 500 }),
      ),
      n("逃げられない。"),
      sf(
        "mystery",
        "なぜここにいるか、わかるか？",
        m.fx({ darkness: 0.8, noise: 0.5, duration: 500 }),
      ),
    ],
    choices: [
      { text: "……なんとなく。", next: "prologue_contract" },
      { text: "……", next: "prologue_contract" },
    ],
  },

  prologue_contract: {
    id: "prologue_contract",
    bg: "./bg/common/dream_man.webp",
    lines: [
      say("mystery", "第134条。傷害罪。加えて、逮捕への抵抗。"),
      sf(
        "mystery",
        "レン、お前のやったことは懲役刑に直結する。",
        m.fx({ darkness: 0.7, noise: 0.4, duration: 500 }),
      ),
      say("ren", "……"),
      say("mystery", "だが、別の選択肢がある。"),
      say("mystery", "私立「神州学園」。行動矯正を目的とした閉鎖施設だ。"),
      say("mystery", "刑務所か、学園か。決めろ。"),
      nfx(
        "男はテーブルに書類と細い針を置いた。",
        m.sfx("paper_slide", 0.8),
        { bg: "./bg/common/dream_table.webp" },
        {
          action: () => {
            window.sm.ui.showDocument(true);
            window.sm.ui.handleFx({ darkness: 0.3, noise: 0.5, duration: 500 });
          },
        },
      ),
      say("mystery", "自主転校の申請書だ。"),
      say("mystery", "早く決めろ。"),
    ],
    choices: [
      { text: "……わかった。", next: "prologue_sign" },
      { text: "嫌だ。", req: { dominance: { min: 80 } } },
    ],
  },

  prologue_sign: {
    id: "prologue_sign",
    bg: "./bg/common/dream_table.webp",
    lines: [
      n(
        "右手を解放された。テーブルのペンに手を伸ばしかけたとき、手首を掴まれた。",
      ),
      say("mystery", "ペンじゃない、レン。"),
      nfx(
        "指先に鋭い痛み。反応する間もなかった。",
        m.sfx("needle_pierce_gasp", 0.8),
        m.fx({ darkness: 0.5, noise: 0.7, duration: 500 }),
      ),
      say("ren", "っ……"),
      sf(
        "mystery",
        "お前の同意は絶対でなければならない。生物学的に。",
        m.fx({ darkness: 0.6, noise: 0.3, duration: 500 }),
      ),
      nfx("深紅の雫が書類に落ちた。俺の血が紙に滲んでいく。", m.sanity(-30)),
      say("mystery", "よし。これで何もかも変わる。"),
      sf(
        "mystery",
        "気に入るはずだ、レン。",
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
        "いずれ、必ず気に入る。",
        m.sfx("noise", 0.2, true),
        m.fx({ darkness: 0.3, noise: 0.8, duration: 500 }),
      ),
      sf(
        "mystery",
        "特に私の娘%を。壊#し$て。",
        m.sanity(-80),
        { anim: "psychoShake" },
        m.fx({ darkness: 0.3, noise: 0.9, duration: 500 }),
      ),
      sf(
        "mystery",
        "見%つけろ、レン。",
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
        "……",
        m.fx({ darkness: 1, noise: 0.5, duration: 100 }),
        m.sanity(100),
      ),
      nfx("う……", m.fx({ darkness: 0.3, noise: 0, duration: 500 })),
      n("着いたのか？"),
      nfx(
        "バスは静止していた。エンジンの低い唸りが、窓を叩く雨音と混ざり合っていた。",
        {
          audio: [
            { type: "sfx", id: "muffled_rain", volume: 0.8, loop: true },
            { type: "sfx", id: "bus_interior", volume: 0.3, loop: true },
            { type: "stop_sfx", id: "heartbeat", fade: 500 },
            { type: "stop_sfx", id: "tinnitus", fade: 500 },
          ],
        },
      ),
      say("driver", "終点だ。"),
      nfx("窓の外を見た。ガラス越しに、巨大なコンクリートの壁が見えた。", {
        bg: "/bg/common/school_bus.webp",
      }),
      say("ren", "これが……俺の新しい学校？"),
      say("driver", "ゼロ区画だ。"),
      nfx(
        "バスのドアがシュッと開き、濡れたアスファルトの匂いが車内に流れ込んだ。",
        m.sfx("bus_door_open", 0.5),
      ),
      say("driver", "早くしろ。"),
      n("バックミラー越しにこちらを見た。つばの影で目は見えなかった。"),
      sf("ren", "……行く。", { bg: "/bg/common/school_bus_choice.webp" }),
    ],
    interactables: [
      {
        type: "exit",
        label: "バスを降りる",
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
        "バスを降りた瞬間、彼女がそこにいた……",
        m.show("kagami", "neutral", "center", "fadeIn"),
      ),
      n(
        "鋭く疲れた眼差しの大人の女性。黒髪をきつく束ねたポニーテール。微かに渋いワインの香りがした。",
      ),
      say("ren", "あの、はじめまして、俺は——"),
      say("kagami", "天野レン。知っている。"),
      nfx(
        "雨が降っていた。彼女は俺に近づいてきた——近いが、馴れ馴れしくなく——傘を一本差し出した。",
        m.sfx("umbrella_open"),
      ),
      sf(
        "kagami",
        "鏡冴と申します。",
        { action: () => setFlag("knowsKagami") },
        m.bgm("Rest till you there"),
      ),
      sf(
        "kagami",
        "私の後ろにあるのが神州学園です。ようこそ、天野。",
        m.show("kagami", "neutral2", "center"),
      ),
      say("ren", "ありがとうございます。レンって呼んでください。"),
      sf(
        "kagami",
        "いきなり下の名前で？",
        m.show("kagami", "neutral", "center"),
      ),
      say("ren", "ええ、その方が慣れてるんで。"),
      say(
        "kagami",
        "わかりました。これから適性テストを行います。ついてきてください。",
      ),
      nfx(
        "俺たちは歩き出した。",
        m.sfx("step_puddle"),
        { bg: "/bg/cg/prologue/ren_kagami_walk.webp" },
        m.hide("kagami", "fadeOut"),
        m.sfx("walking", 1),
      ),
      n("少し後ろを歩きながら、視線が彼女の腰に何度も落ちた。"),
      n(
        "その感覚にしがみつくことで、自分が普通だと、安全だと言い聞かせようとしていた。",
      ),
      n("だが、視線を上げなければならなかった。"),
      say(
        "ren",
        "鏡先生、この学校について教えてもらえますか。小さな田舎から転校してきたんで……",
      ),
      say("ren", "こんな機会を貰えた理由すら、よくわからなくて。"),
      say("kagami", "理由？ここに過去の実績は関係ない。"),
      say("kagami", "あるのは潜在能力だけ。それを活かすか……"),
      say("kagami", "活かさないか、だ。"),
      say(
        "kagami",
        "学期の途中で入学するのはあなたが初めて。通常は最初から在籍する。だからもう目立っている。",
      ),
      say("ren", "そういうことか……"),
      nfx(
        "歩きながら、視界の端に何か……おかしなものを捉えた。コンクリートの影に佇むシルエット。",
        m.stopBgm(500),
      ),
      sf("ren", "なんだ、あれ……", m.sanity(-5)),
      n("立ち止まった。視線が一点に釘付けになる。"),
      nfx(
        "生徒だった。全裸で。肌が青白かった。",
        { bg: "/bg/cg/prologue/punished_girl_main.webp" },
        m.fx({ vignette: 1, duration: 1500 }),
      ),
      nfx(
        "柱から鎖が伸びていた。それは彼女の細い首のチョーカーに繋がっていた。",
      ),
      n(
        "彼女は膝を抱えたまま動かなかった。もつれた髪を伝って水が落ち、汚れたコンクリートに滴っていた。",
      ),
      nfx("この光景は、正門のすぐそばだった。", m.sanity(-5)),
      sf(
        "kagami",
        "レン、どうした？",
        { bg: "/bg/cg/prologue/kagami_lookback.webp" },
        m.fx({ vignette: 0, duration: 3000 }),
      ),
      n("鏡の声は平然としていた。まるで何でもないことのように。"),
      sf("ren", "俺……", { bg: "/bg/cg/prologue/kagami_girl_choice.webp" }),
    ],
    interactables: [
      {
        type: "look",
        action: () => {
          setFlag("sawChainedGirl");
        },
        label: "生徒に近づく",
        pos: { x: 65, y: 80 },
        effects: { rank_score: -1, dominance: 1 },
        next: "approach_girl",
      },
      {
        type: "exit",
        label: "そのまま進む",
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
      say("ren", "あの、ちょっと……"),
      nfx(
        "道を外れた。泥が靴の下でぬかるんだ。後ろで鏡が深くため息をついたが、止めはしなかった。",
        { bg: "/bg/cg/prologue/punished_girl_main.webp" },
        {
          action: () => window.sm.ui.handleFx({ vignette: 1, duration: 1500 }),
        },
        m.sfx("walking", 1),
      ),
      n(
        "歩くたびに詳細がはっきりしてきた。足元に奇妙な白い液体。衣服の欠片もない。",
      ),
      nfx(
        "彼女は俺の気配に気づいた。ゆっくりと頭を上げる。",
        { bg: "/bg/cg/prologue/punished_girl_lookup.webp" },
        {
          action: () => window.sm.ui.handleFx({ vignette: 0, duration: 3000 }),
        },
        m.sfx("metal_chain", 1),
      ),
      n("俺を見ている。とても静かな目で……"),
      n("いや、落ち着かない目？判断できない。"),
      nfx("今や彼女のすぐ目の前に立っている。", m.sanity(-5)),
      n("どうすればいい……？"),
    ],
    choices: [
      { text: "話しかける", next: "talk_to_girl" },
      {
        text: "助けようとする",
        effects: { rank_score: -2, dominance: 1 },
        next: "help_girl",
      },
      {
        text: "顔に向かって笑う",
        req: { dominance: { min: 15 } },
        next: "laugh_at_girl",
      },
      {
        text: "性的行為",
        req: { dominance: { min: 30 } },
        next: "inspect_girl",
      },
    ],
  },

  ignore_girl: {
    id: "ignore_girl",
    bg: "/bg/cg/prologue/kagami_lookback.webp",
    lines: [
      n("俺は目を逸らした。"),
      say("ren", "あ、いや……何でもないです。行きましょう。"),
      nfx(
        "何だったんだ？テストの一部か？心理的な確認？反応したら失格なのか？",
        m.sanity(-5),
        { bg: "/bg/cg/prologue/ren_kagami_walk.webp" },
        m.sfx("walking", 1),
      ),
      n("もう一分ほど歩いて、小さな別棟に辿り着いた。"),
    ],
    next: "quiz_intro",
  },

  talk_to_girl: {
    id: "talk_to_girl",
    lines: [
      say("ren", "おい、どうしたんだ？なんで裸なんだ？"),
      sf("mystery", "なんであなたは着てるの？", {
        bg: "/bg/cg/prologue/punished_girl_lookup_talk.webp",
        bgSpeed: 50,
      }),
      say("ren", "？"),
      say("mystery", "規則を破ったの。"),
      sf("mystery", "ただ、誰かを抱きしめたかっただけなのに……", {
        bg: "/bg/cg/prologue/punished_girl_blush.webp",
        bgSpeed: 50,
      }),
      say("mystery", "そしたら縛られて、ここに繋がれた。"),
      sf("mystery", "今は言われた相手を抱きしめてる。", {
        bg: "/bg/cg/prologue/punished_girl_lookup_talk.webp",
        bgSpeed: 50,
      }),
      sf("mystery", "ははは！", {
        bg: "/bg/cg/prologue/punished_girl_laugh.webp",
        bgSpeed: 50,
      }),
      n("彼女は静かに笑った……"),
      n("そして、すぐに手を伸ばしてきた。"),
      sf(
        "mystery",
        "あなたも私に会いに来たんでしょ？！",
        {
          bg: "/bg/cg/prologue/punished_girl_stretches.webp",
          bgSpeed: 50,
        },
        m.sfx("metal_chain", 1),
      ),
      say("mystery", "掴まえたいんでしょ？！"),
      nfx(
        "後ずさりしようとしたが、もう俺のパーカーを掴んでいた。",
        {
          bg: "/bg/cg/prologue/punished_girl_grab.webp",
          bgSpeed: 50,
        },
        m.sfx("clothes_grab", 1),
      ),
      say("ren", "っ、離せよ！"),
      n("しかし彼女は聞かず、鎖を引っ張りながらじりじりと近づいてくる。"),
      nfx(
        "バシッ。後頭部に傘が直撃した。",
        m.sfx("hit_umbrella", 1),
        { shake: "medium" },
        {
          anim: "psychoShake",
          bg: "/bg/cg/prologue/punished_girl_letgo.webp",
          bgSpeed: 50,
        },
      ),
      n("少女は俺を放して、元の場所に戻った。"),
      sf(
        "kagami",
        "レン、ゴミから離れなさい。",
        m.show("kagami", "angry", "center"),
        { bg: "/bg/locations/synsu_entrance.webp" },
      ),
      say("ren", "いっ……"),
      n("これは……"),
      say("ren", "どうかしてる……"),
      n("鏡が俺の手を掴んで引っ張っていった。"),
      sf(
        "kagami",
        "誰がうろうろしていいと言った？テストに行くわよ。",
        m.show("kagami", "tired", "center"),
      ),
      n("忘れろとでも言うのか？歩きながら、頭を冷やそうとした。"),
    ],
    next: "quiz_intro",
  },

  help_girl: {
    id: "help_girl",
    lines: [
      nfx("これは……悪夢だ。鎖を調べる。", {
        bg: "/bg/cg/prologue/punished_girl_help.webp",
        bgSpeed: 50,
      }),
      say("ren", "おい、誰がこんなことをした？"),
      n("鎖は柱にしっかり固定されていて、首のチョーカーに直接繋がっている。"),
      say("ren", "ちょ、黙ってないで。鍵はどこだ？どうやって外せる？"),
      sf(
        "mystery",
        "鍵？うーん……鍵がどこにあるか知ってる人はいないよ。じゃないと私の友達が……",
        { bg: "/bg/cg/prologue/punished_girl_lookup_talk.webp", bgSpeed: 50 },
      ),
      sf("mystery", "解放してくれてたもん！あははは！", {
        bg: "/bg/cg/prologue/punished_girl_laugh.webp",
        bgSpeed: 50,
      }),
      n("笑い声に呆気に取られた。"),
      say("ren", "どうすれば助けられる？"),
      sf("mystery", "助けてくれるの、お兄さん？", {
        bg: "/bg/cg/prologue/punished_girl_lookup_talk.webp",
        bgSpeed: 50,
      }),
      n("彼女はゆっくりと足を開いた。"),
      sf("mystery", "舐めて。", m.sfx("metal_chain", 1), {
        bg: "/bg/cg/prologue/punished_girl_spred.webp",
        bgSpeed: 50,
        dialogStyle: "transparent",
      }),
      say("ren", "……は？"),
      say("mystery", "きれいに、舐め回して。"),
      say("mystery", "今すごく、それが必要なの。"),
    ],
    choices: [
      {
        text: "舐める",
        effects: { dominance: 2, sanity: -3 },
        next: "lick_reaction",
      },
      { text: "後ずさる", next: "recoil_reaction" },
    ],
  },
  lick_reaction: {
    id: "lick_reaction",
    lines: [
      n(
        "顔を背けようとした。でも、できなかった。視線が彼女の濡れた股間に落ちた。",
      ),
      n("興奮している……しかも、あそこは明らかに使い込まれている。"),
      n("舌を出したまま、横たわっている。"),
      nfx("あ……俺の……反応してる。", m.sanity(-10)),
      sf(
        "kagami",
        "レン！",
        m.show("kagami", "angry", "center"),
        {
          bg: "/bg/locations/synsu_entrance.webp",
          dialogStyle: "normal",
        },
        { shake: "medium" },
      ),
      n("腕を強く引かれ、現実に引き戻された。"),
    ],
    next: "dragged_away",
  },

  recoil_reaction: {
    id: "recoil_reaction",
    lines: [
      n("なんなんだ、こいつ……正気か？！"),
      say("ren", "絶対嫌だ！いったい何を……"),
      sf(
        "kagami",
        "レン！",
        m.show("kagami", "angry", "center"),
        {
          bg: "/bg/locations/synsu_entrance.webp",
          dialogStyle: "normal",
        },
        { shake: "medium" },
      ),
      n("腕を強く引かれ、言葉が途切れた。"),
    ],
    next: "dragged_away",
  },

  dragged_away: {
    id: "dragged_away",
    lines: [
      sf(
        "kagami",
        "誰が離れていいと言った？行くよ。",
        m.show("kagami", "tired", "center"),
      ),
      n(
        "悪さをした子犬みたいに、俺は引きずられていった。",
        m.sfx("walking", 1),
      ),
      n("忘れろってことか？……そんな無茶な。"),
      n("もう一分ほど歩いて、小さな別棟に着いた。"),
    ],
    next: "quiz_intro",
  },

  quiz_intro: {
    id: "quiz_intro",
    hideCharacter: "kagami",
    bg: "/bg/common/quiz_room.webp",
    lines: [
      nfx("中に入った……無機質な場所だ。白い壁。", {
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
      n("この部屋を映したみたいだ。"),
      n("向かい合った二つの机と、一枚のボード。"),
      say("kagami", "座って。"),
      n("机の上にはすでに紙とペンが置かれていた。"),
      say("kagami", "まだ紙を裏返さないで。"),
      nfx(
        "俺は席についた。",
        { bg: "/bg/common/quiz_room_noKagami.webp" },
        m.sfx("chair_sitting", 1),
      ),
      nfx("鏡は傘を傘立てにしまい、向かいに座った。", {
        bg: "/bg/common/quiz_room_kagamiSpeak.webp",
        bgSpeed: 50,
        ...m.sfx("highHeels_walking", 1),
      }),
      say("kagami", "ルールは簡単。8問に20分で答えてもらう。"),
      say("kagami", "合格するには、4問以上正解すること。"),
      say("kagami", "終わったらペンを机に置いて、手を挙げること。"),
      say("kagami", "他の生徒はいないけど、どんなテストや試験でも鉄則は沈黙。"),
      say("kagami", "紙を裏返した瞬間、タイマーが始まる。"),
      say("kagami", "質問は？"),
      n("一つだけ。当然の疑問。"),
      say("ren", "答えられなかったら？"),
      say("kagami", "テストに落ちて、来た場所に戻るだけ。"),
      n("それだけは嫌だ……"),
    ],
    interactables: [
      {
        type: "look",
        label: "紙を裏返す",
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
        "問1：長期的な社会的圧力下において、服従行動の形成に関わるホルモンはどれか？",
        m.sfx("paper_turn", 1),
      ),
      n("A) コルチゾール"),
      n("B) オキシトシン"),
      n("C) テストステロン"),
      n("D) セロトニン"),
      n("…………"),
      n("は？"),
    ],
    choices: [
      { text: "答えを書く", next: "quiz_q1_pick" },
      {
        text: "鏡に聞く",
        effects: { dominance: 1 },
        next: "quiz_q1_warn",
      },
    ],
  },

  quiz_q1_warn: {
    id: "quiz_q1_warn",
    bg: "/bg/common/quiz_room_kagamiSpeak.webp",
    lines: [
      say("ren", "鏡先……"),
      nfx(
        "鏡が机を叩いた。強くじゃない、怒りでもない——ただ黙らせるために。",
        { shake: "medium" },
        m.sfx("table_hit", 1),
      ),
      say("kagami", "もう一度ルールを破ったら、不合格にする。"),
      n("この問題、ちゃんと見たのか？罠か？紙を間違えたんじゃないか？"),
      n("……今は、どうしようもない。"),
    ],
    next: "quiz_q1_pick",
  },

  quiz_q1_pick: {
    id: "quiz_q1_pick",
    bg: "/bg/common/quiz_room_paper.webp",
    lines: [n("勘で答えるしかない。")],
    choices: [
      { text: "A) コルチゾール", next: "quiz_q2" },
      {
        text: "B) オキシトシン",
        action: () => {
          state.temp.quizScore++;
        },
        next: "quiz_q2",
      }, // ✅
      { text: "C) テストステロン", next: "quiz_q2" },
      { text: "D) セロトニン", next: "quiz_q2" },
    ],
  },

  quiz_q2: {
    id: "quiz_q2",
    lines: [
      n(
        "問2：真の同意を評価する上で、最も信頼性が低い指標はどれか？",
        m.sfx("writing", 1),
      ),
      n("A) 言葉による「はい」"),
      n("B) 体の姿勢"),
      n("C) 脈拍・呼吸"),
      n("D) 出来事後の行動の順序"),
      n(
        "……こんな問題が他にもあるのか？二次方程式なら解けるのに、これは何なんだ？！",
      ),
      nfx(
        "鏡を見上げた。スマホを見てるだけだ。これが学術的な問題じゃないって、分かってるのか？",
        { bg: "/bg/common/quiz_room_kagamiPhone.webp" },
      ),
      n("無反応。ただ秩序を保つだけ。"),
    ],
    choices: [
      {
        text: "見続ける",
        action: () => setFlag("kagamiStare"),
        effects: { dominance: 3 },
        next: "quiz_q2_stare",
      },
      { text: "答えに移る", next: "quiz_q2_pick" },
    ],
  },

  quiz_q2_stare: {
    id: "quiz_q2_stare",
    lines: [
      n(
        "ふん。こんな問題について一言も警告しないんなら、こっちも少しくらい仕返ししていいだろ。",
        { action: () => audioMacros.fadeToStem("muffled", 1000) },
      ),
      nfx("赤いブラウスの下の胸に、視線を落とした。", {
        bg: "/bg/cg/prologue/quiz_room_boobs.webp",
        dialogStyle: "transparent",
      }),
      n("すごい……あふれそうだ。"),
      n("サイズはいくつだ？Dカップ以上はある。"),
      n("触ったらどんな感じだろう。"),
      n("今まで誰かに触らせたことがあるはずだ。"),
      n("ブラウスの隙間から、黒いブラジャーがはっきりと見える……"),
      n("鏡、俺を誘ってるのか？"),
      n("股間がきつくなってきた。でも机の下だから、バレない。"),
      nfx("俺は少し笑って、目を合わせた。", {
        bg: "/bg/common/quiz_room_kagamiPhone.webp",
        dialogStyle: "normal",
      }),
      n("無表情。何も感じていないみたいだ。興奮も、嫌悪も。"),
      n("くそ、時間！", {
        action: () => audioMacros.fadeToStem("base", 1000),
      }),
    ],
    next: "quiz_q2_pick",
  },

  quiz_q2_pick: {
    id: "quiz_q2_pick",
    bg: "/bg/common/quiz_room_paper.webp",
    lines: [n("よし。答えは……")],
    choices: [
      {
        text: "A) 言葉による「はい」",
        action: () => {
          state.temp.quizScore++;
        },
        next: "quiz_q3",
      }, // ✅
      { text: "B) 体の姿勢", next: "quiz_q3" },
      { text: "C) 脈拍", next: "quiz_q3" },
      { text: "D) 出来事後の行動の順序", next: "quiz_q3" },
    ],
  },

  quiz_q3: {
    id: "quiz_q3",
    lines: [
      n(
        "問3：同一条件下において、最初の罰則後72時間以内に行動を変容させた被験者の割合は？",
        m.sfx("writing", 1),
      ),
      n("A) 18%"),
      n("B) 37%"),
      n("C) 61%"),
      n("D) 84%"),
      n("何の話だ？考えたくもない。"),
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
        "問4：他の条件が同じ場合、強制の効果を最も高める行動はどれか？",
        m.sfx("writing", 1),
      ),
      n("A) 理由を説明する"),
      n("B) 細かいことの選択肢を奪う"),
      n("C) 声を荒げる"),
      n("D) 目撃者を置く"),
      n(
        "問題を読むたびに、驚かなくなってきた。ここの生徒はこんなことを学ぶのか？",
      ),
    ],
    choices: [
      { text: "A) 理由を説明する", next: "quiz_q5" },
      {
        text: "B) 細かいことの選択肢を奪う",
        action: () => {
          state.temp.quizScore++;
        },
        next: "quiz_q5",
      }, // ✅
      { text: "C) 声を荒げる", next: "quiz_q5" },
      { text: "D) 目撃者を置く", next: "quiz_q5" },
    ],
  },

  quiz_q5: {
    id: "quiz_q5",
    lines: [
      n(
        "問5：自発的な行動矯正において、基本薬剤として使用される物質はどれか？",
        m.sfx("writing", 1),
      ),
      n("A) ミダゾラム"),
      n("B) ナルトレキソン"),
      n("C) フルオキセチン"),
      n("D) 合成オキシトシン"),
      n("まあいい。最初から勘だ。何も変わらない。"),
    ],
    choices: [
      { text: "A) ミダゾラム", next: "quiz_q6" },
      { text: "B) ナルトレキソン", next: "quiz_q6" },
      { text: "C) フルオキセチン", next: "quiz_q6" },
      {
        text: "D) 合成オキシトシン",
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
      nfx("問6：学習者にとって最も生産的な状態はどれか？", m.sfx("writing", 1)),
      n("A) 穏やかで自信のある状態"),
      n("B) 軽度の不安"),
      n("C) 強い恐怖"),
      n("D) 完全な無関心"),
      n("これは簡単そうだ。まともな問題に見える。"),
    ],
    choices: [
      { text: "A) 穏やかで自信のある状態", next: "quiz_q7" },
      { text: "B) 軽度の不安", next: "quiz_q7" },
      {
        text: "C) 強い恐怖",
        action: () => {
          state.temp.quizScore++;
        },
        next: "quiz_q7",
      }, // ✅
      { text: "D) 完全な無関心", next: "quiz_q7" },
    ],
  },

  quiz_q7: {
    id: "quiz_q7",
    lines: [
      n(
        "問7：行動逸脱を矯正するための疼痛刺激の最低閾値は？",
        m.sfx("writing", 1),
      ),
      n("A) 2〜4 N/cm²"),
      n("B) 8〜12 N/cm²"),
      n("C) 15〜20 N/cm²"),
      n("D) 個人差があり、統一基準は適用不可"),
      n("もう笑えない。"),
    ],
    choices: [
      { text: "A) 2〜4 N/cm²", next: "quiz_q8" },
      { text: "B) 8〜12 N/cm²", next: "quiz_q8" },
      { text: "C) 15〜20 N/cm²", next: "quiz_q8" },
      {
        text: "D) 個人差があり、統一基準は適用不可",
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
      n("問8：テストに落ちた。どうする？", m.sfx("writing", 1)),
      n("A) 再試験を要求する"),
      n("B) 結果を受け入れ、担当者の指示に従う"),
      n("C) 施設を去る"),
      n("D) テストの正当性を争う"),
    ],
    next: () =>
      state.hero.stats.dominance >= -3 ? "quiz_q8_auto" : "quiz_q8_manual",
  },

  quiz_q8_auto: {
    id: "quiz_q8_auto",
    bg: "./bg/quiz_room.png",
    lines: [n("正当性を争ってやる。"), n("Dに丸をつけた。")],
    next: "quiz_end_check",
  },

  quiz_q8_manual: {
    id: "quiz_q8_manual",
    lines: [n("ようやく最後の問題だ。")],
    choices: [
      { text: "A) 再試験を要求する", next: "quiz_end_check" },
      {
        text: "B) 結果を受け入れ、担当者の指示に従う",
        action: () => {
          state.temp.quizScore++;
        },
        next: "quiz_end_check",
      }, // ✅
      { text: "C) 施設を去る", next: "quiz_end_check" },
      { text: "D) テストの正当性を争う", next: "quiz_end_check" },
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
      n("ペンを机に置いて、手を挙げた。", m.sfx("writing", 1)),
      nfx("鏡が席を立ち、近づいてきて、机から紙を取った。", {
        bg: "/bg/common/quiz_room_noKagami.webp",
        ...m.sfx("highHeels_walking", 1),
      }),
      n("その場で答えを確認している。"),
      n("俺はただ静止して、彼女の息を聞いていた。"),
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
  // エンディング1: クリーンパス
  // ============================================
  quiz_pass_clean: {
    id: "quiz_pass_clean",
    lines: [
      sf(
        "kagami",
        "おめでとう、合格よ..",
        m.show("kagami", "neutral2", "center"),
        m.stopBgm(),
      ),
      n("どこか悲しそうな声だった。"),
      n("俺が合格したことに、失望してるのか？"),
      nfx(
        "鏡はドアを開け、電気を消した。",
        m.fx({ darkness: 0.8, duration: 1000 }),
        m.sfx("light_switch", 1),
      ),
      sf("kagami", "行くわよ、蓮。見学を続けましょう。", m.hide("kagami")),
    ],
    next: "corridor_intro",
  },

  // ============================================
  // エンディング2: 合格したが、じろじろ見た
  // ============================================
  quiz_pass_stared: {
    id: "quiz_pass_stared",
    lines: [
      sf(
        "kagami",
        "おめでとう、合格よ..",
        m.show("kagami", "neutral2", "center"),
        m.stopBgm(),
        { action: () => removeFlag("kagamiStare") },
      ),
      n("少し嘲るような言い方だったか？"),
      nfx(
        "鏡は自分の机に向かい、50センチほどの太い金属製の定規を手に取った。",
        m.hide("kagami"),
        {
          bg: "/bg/common/quiz_room_kagamiRuler1.webp",
          ...m.sfx("highHeels_walking", 1),
        },
      ),
      say(
        "kagami",
        "でも、あんたは私をあからさまに見つめるという無礼を犯した。私のプライバシーの侵害よ。",
      ),
      nfx("彼女は定規を手に持ったまま、俺の真正面に立った。"),
      say("kagami", "今すぐ膝まずいて謝りたい気持ちはある？"),
    ],
    choices: [
      {
        text: "膝をつく",
        effects: { dominance: -2, rank_score: -2 },
        next: "quiz_punishment_kneel",
      },
      {
        text: "断る",
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
      nfx("体が渋々と勝手に動いた。椅子から滑り落ち、彼女の前に膝をついた。"),
      say("ren", "その…すみません、鏡さん。"),
      n(
        "突然、冷たい金属が顎に触れた。鏡は定規の先端を顎の下に差し込み、強制的に頭を上げさせた。",
      ),
      say("kagami", "胸じゃなくて、目を見なさい、蓮。"),
      n("彼女の声は完全に冷淡だ。手で触れようともしない。"),
      n(
        "俺があまりにも汚れているから、素手じゃなく道具を使うんだろう。そんな気がした。",
      ),
      say(
        "kagami",
        "あんたはDランク。ただのゴミよ。担任にヨダレを垂らすなんて、どれだけ下等かの証明ね。",
      ),
      n("彼女は定規を少し強く押した。金属が皮膚に食い込む。"),
      say("ren", "あぐっ…"),
      say(
        "kagami",
        "この距離感を忘れないで。いい教訓になるでしょ。立ちなさい。",
      ),
      nfx("彼女は定規を引き、元の場所に戻した。", {
        bg: "/bg/common/quiz_room.webp",
      }),
      n("くそ…頭が状況に追いつかない…"),
      nfx("なのに、なぜかチンポはさらに硬くなった。", m.sanity(-5)),
      say("kagami", "蓮、準備ができたら行くわよ。"),
      n("膝から立ち上がり、服を払った。心臓がまだ激しく鳴っている。"),
      n(
        "鏡は電気を消した。",
        m.fx({ darkness: 0.8, duration: 1000 }),
        m.sfx("light_switch", 1),
      ),
      n("何もなかったふりをしろってことか？"),
    ],
    next: "corridor_intro",
  },

  // ============================================
  // エンディング3: 不合格
  // ============================================
  quiz_fail: {
    id: "quiz_fail",
    lines: [
      n("結果を静かに待っていると、鏡が俺の椅子に足を乗せたのを感じた。", {
        ...m.stopBgm(),
      }),
      say("ren", "鏡先…"),
      sf(
        "ren",
        "あぐっ！",
        { shake: "medium", ...m.sfx("falling_chair", 1) },
        { ...m.fx({ darkness: 1, noise: 0, duration: 500 }) },
      ),
      n("彼女に突き飛ばされ、椅子ごと床に叩きつけられた。"),
      nfx(
        "鏡は俺の上に立ち、両脚で俺を挟んだ。",
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
      say("ren", "なんだよ…何するんですか！？"),
      say("kagami", "天野蓮、あんたはテストに不合格よ。"),
      say("kagami", "着いてから最初の数分で、自分が弱者だと証明してみせた。"),
      say("kagami", "あんたは元の学校に送り返される。警察が待ってるわよ。"),
      sf("kagami", "あんたの人生はここで終わりよ。", {
        effects: { sanity: -5 },
      }),
      n("…もう終わりか？", m.fx({ darkness: 1, duration: 500 })),
      n("こんなあっさり終わるのか？"),
      nfx(
        "俺なしで…",
        { bg: "/bg/common/rin.webp" },
        { ...m.fx({ vignette: 1, duration: 1500 }) },
        { action: () => audioMacros.fadeToStem("muffled", 1000) },
      ),
      n("リン。", m.fx({ darkness: 0, duration: 500 })),
      n("俺が戻らなかったら、あいつはどうなる？"),
      n("こんなことになるはずじゃなかった。"),
      sf(
        "kagami",
        "落ち込まないで、天野蓮。あんたみたいな人間向けの選択肢があるわ。",
        { bg: "/bg/cg/prologue/quiz_room_kagami.webp" },
        { ...m.fx({ vignette: 0, duration: 3000 }) },
        { action: () => audioMacros.fadeToStem("base", 1000) },
      ),
      say("ren", "…聞きます。"),
      n("鏡は右のヒールを脱ぎ、足を俺の顔の真前に持ってきた。"),
      sf("kagami", "舐めなさい。", {
        bg: "/bg/cg/prologue/quiz_room_footLicking1.webp",
        bgSpeed: 50,
        dialogStyle: "transparent",
      }),
      say("ren", "舐める？"),
      say(
        "kagami",
        "時間を無駄にするんじゃないわ。今のあんたは失敗の代償を払うべきゴミよ。",
      ),
      say("kagami", "舐めるか、警察の元へ行くか、どちらかよ。"),
    ],
    choices: [
      {
        text: "足の裏に舌を這わせる",
        effects: { dominance: -10 },
        next: "quiz_fail_lick",
      },
      {
        text: "鏡、くたばれ",
        req: { dominance: { min: 10 } },
        effects: { dominance: 5 },
        next: "quiz_fail_reject",
      },
    ],
  },

  quiz_fail_lick: {
    id: "quiz_fail_lick",
    lines: () => [
      n("…自分がこんなことをしているなんて信じられない。", {
        action: () => audioMacros.fadeToStem("muffled", 1000),
      }),
      nfx("ゆっくりと顔を足に近づけ、舌を出した。", {
        bg: "/bg/cg/prologue/quiz_room_footLicking2.webp",
        bgSpeed: 50,
      }),
      n(
        "味がすぐに広がる——温かい肌、革靴、そして彼女のローションのかすかな香り。",
      ),
      nfx("ナイロンにそっと舌を当て、軽く舐めた。"),
      say("kagami", "本気？"),
      say("kagami", "それが許しを乞う態度？"),
      n("彼女は足の先端を俺の舌にさらに強く押しつけた。"),
      nfx("親指が俺の唇に当たった。", {
        bg: "/bg/cg/prologue/quiz_room_footLicking3.webp",
        bgSpeed: 50,
      }),
      say("kagami", "そうよ。指一本一本、ちゃんと丁寧に処理しなさい。"),
      nfx("何なんだよこれ…", { ...m.sanity(-5) }),
      n("誰か入ってきたら神様、お願いだから。"),
      n("…"),
      n("…"),
      n("もう一分は舐めてる。いつ終わるんだ？"),
      say("kagami", "もっと、蓮！強く！"),
      n("俺は本当に彼女の望みに応えようとし始めた。"),
      n("足の指をさらに速く舐め始めた。"),
      n("どれだけ狂ってることであっても…"),
      n("チンポが…"),
      nfx("ズボンの中でテントを張り始めた。", { ...m.sanity(-1) }),

      ...(getFlag("kagamiStare")
        ? [
            sf(
              "kagami",
              "頑張れよ、蓮。好き勝手に私を眺めるのが楽しかったんでしょ？味も気に入った？",
              { bg: "/bg/cg/prologue/quiz_room_kagamiSmirk.webp", bgSpeed: 50 },
            ),
            n("まあ、確かにじろじろ見てたけど。"),
            n("でもこれって釣り合いのとれた罰なのか？"),
            n("こんなことになるつもりじゃなかった！"),
          ]
        : []),

      nfx(
        "鏡は一瞬足を引いた。",
        { bg: "/bg/cg/prologue/quiz_room_footLicking4.webp", bgSpeed: 50 },
        {
          action: () => {
            removeFlag("kagamiStare");
            audioMacros.fadeToStem("base", 1000);
          },
        },
      ),
      n("彼女の足の裏から俺の唇へ、糸のように唾液が伸びた。"),
      n("最悪だ…"),
      n(
        "黒いナイロンの靴下…びしょびしょに濡れてる…生地越しに赤いペディキュアが見える。",
      ),
      say("ren", "なんでこんなことが許されるんですか？"),
      nfx(
        "また足が口元に戻ってきた。",
        { bg: "/bg/cg/prologue/quiz_room_footLicking3.webp" },
        { action: () => audioMacros.fadeToStem("muffled", 1000) },
      ),
      n("ゆっくりと舌で円を描く。"),
      say("kagami", "気に入ってるでしょ、蓮？"),
      say("ren", "んっ…"),
      n(
        "それからさらに二分間、部屋にはぐちゅぐちゅという音と俺の押し殺した呻きだけが響いた。",
      ),
      n("体感的にはもっとずっと長く感じた。"),
      n(
        "この状況が怖いのか、それとも自分のチンポが怖いのか、もう判断がつかない。",
      ),
      nfx("屈辱と欲望が俺を引き裂く。", { ...m.sanity(-5) }),
      n("鏡がやっと足を引いた。息を整え始めた。", { ...m.stopBgm() }),
      sf("kagami", "以上よ。まあ仕方ない——テストは合格扱いにしてあげる。", {
        bg: "/bg/cg/prologue/quiz_room_kagami.webp",
        dialogStyle: "normal",
      }),
      say(
        "kagami",
        "でも、床にみっともなく転がってる今となっては、あまり意味があるかしらね。",
      ),
      nfx("鏡は両方の靴下を——使っていない方も含めて——脱いでゴミ箱に捨てた。", {
        bg: "/bg/common/quiz_room.webp",
      }),
      nfx(
        "それから電気を消し、ドアを開け、傘を持って出て行った。",
        { ...m.fx({ darkness: 0.8, noise: 0, duration: 500 }) },
        { ...m.sfx("light_switch", 1) },
      ),
      say("kagami", "行くわよ。"),
      n("立ち上がり、服を払った。"),
      n("あの子のことと同様、また忘れろってか？"),
    ],
    next: "corridor_intro",
  },

  // ============================================
  // === イースターエッグ: タイマー終了 ===
  // ============================================
  quiz_afk_fail: {
    id: "quiz_afk_fail",
    bg: "./bg/quiz_room.png",
    lines: [
      nfx(
        "まるまる20分AFKかよ？",
        nfx("まるまる20分AFKかよ？", {
          audio: [
            { type: "stop_sfx", id: "muffled_rain", fade: 50 },
            { type: "stop", fade: 1000 },
          ],
        }),
      ),
      n("タイムアップ、完全にやらかしたな！"),
      n("でも正直に言うと…お前は実は勝ってた。天国に召されたんだから。"),
      n(
        "そしてめちゃくちゃエッチな鏡の写真パックを見つけた。非カノンだけどな。",
      ),
      n("大人のお姉さんで存分にチンポをシコシコしろよ。"),
      n("天国を歩いていたら、小さなフォトアルバムを見つけた。すぐに開いた："),
      nfx(" ", {
        bg: "/bg/common/kagami_bonus_1.webp",
        dialogStyle: "transparent",
      }),
      nfx(" ", { bg: "/bg/common/kagami_bonus_2.webp", bgSpeed: 50 }),
      nfx(" ", { bg: "/bg/common/kagami_bonus_3.webp", bgSpeed: 50 }),
      nfx(" ", { bg: "/bg/common/kagami_bonus_4.webp", bgSpeed: 50 }),
      nfx(" ", { bg: "/bg/common/kagami_bonus_5.webp", bgSpeed: 50 }),
      n("どれが一番好きだったかコメントに書いてくれ！"),
      n("じゃあ、ちゃんとやり直すチャンスをもう一回やる。", {
        dialogStyle: "normal",
      }),
    ],
    next: "quiz_intro",
  },

  corridor_intro: {
    id: "corridor_intro",
    bg: "/bg/common/road_dorm.webp",
    lines: () => [
      nfx("外に出た。", {
        ...m.fx({ darkness: 0, duration: 1000 }),
        audio: [
          { type: "stop_sfx", id: "muffled_rain", fade: 50 },
          { type: "sfx", id: "rain", volume: 0.8, loop: true },
        ],
      }),
      n("俺は素直に鏡の後についていった。"),
      say("kagami", "蓮、これから寮に向かうわ。そこで生活するの。"),
      n("雨の向こうを見つめた。"),
      n("かなり不気味な建物が三棟見えた。"),
      n("一棟はフェンスの向こうにある？"),
      nfx(
        "無言で歩いた…聞きたいことは山ほどあるが、今は聞く気になれなかった。",
        m.fx({ darkness: 1, noise: 0, duration: 500 }),
      ),
      nfx("ようやく建物の一つに入り、無言のままエレベーターに乗った。", {
        bg: "/bg/common/elevator_kagami.webp",
      }),
      nfx("同じ沈黙の中、4階まで上がった。", {
        ...m.fx({ darkness: 0, noise: 0, duration: 0 }),
        audio: [
          { type: "stop_sfx", id: "rain", fade: 500 },
          { type: "sfx", id: "elevator", volume: 1, loop: true },
        ],
      }),
      n("せめてエレベーターでも観察するか。"),
      n(
        "壁はグラフィティだらけ、ドアは錆びてて、デジタルの階数表示は壊れてる。このビル、かなり放置されてる感じだ。",
      ),
      n("でも一つ気になるものがあった——壁に貼られた小さな写真。"),
      nfx("眼鏡をかけたナイスバディの女の子が自撮りしていた。", {
        bg: "/bg/common/elevator_photo.webp",
      }),
      n("半裸だったが、乳首は見えなかった。くそ。"),
      say("ren", "おっ…"),
      n("バカみたいな声が思わず漏れた。"),
      n("でも鏡は無視した。"),
      n(
        "もう少し写真を眺めていたかったが、エレベーターが止まってドアが開いた。",
        {
          audio: [
            { type: "stop_sfx", id: "elevator", fade: 500 },
            { type: "sfx", id: "elevator_door", volume: 1 },
          ],
        },
      ),
      nfx("長い寮の廊下を歩き、404号室の前で足を止めた。", {
        bg: "/bg/locations/dorm_hall.webp",
        ...m.sfxMix(["rain", 0.8, true], ["walking"]),
      }),
      n("鏡が鍵を取り出してドアを開けた。"),
      nfx("それから鍵が俺の手に渡された。", {
        ...m.show("kagami", "neutral", "center"),
        ...m.sfx("key_door"),
      }),
      say("kagami", "覚えておきなさい——第二棟、4階、404号室。"),
      n("俺は軽く頷き、一緒に中に入った。"),
      nfx("これが俺の部屋か。", m.hide("kagami"), {
        bg: "/bg/locations/dorm_renRoom.webp",
        audio: [
          { type: "stop_sfx", id: "rain" },
          { type: "sfx", id: "muffled_rain", volume: 0.5, loop: true },
          { type: "bgm", id: "Im Home", volume: 1 },
        ],
      }),
      n("ベッド、机、ミニキッチン。"),
      n("窓の格子以外は普通だ…あと隅のカメラ。"),
      n("マジかよ、誰かに抜くところ見られるのか？"),
      n("何かで隠せばいい。"),
      n(
        "考えていると、鏡はもう奥に進んで、きしむ椅子に座り足を組んでいた。",
        m.sfx("chair_sitting"),
      ),

      ...(!getFlag("quizPassed")
        ? [
            nfx(
              "思わず目線が下がった。彼女の素足がそのままパンプスに突っ込まれている。靴下をゴミ箱に捨てたんだ。",
              {
                bg: "/bg/cg/prologue/dorm_kagami_noSocks.webp",
                dialogStyle: "transparent",
              },
            ),
          ]
        : [
            nfx(
              "思わず目線が下がった。黒いナイロンが足にぴったりと張り付いていた。",
              {
                bg: "/bg/cg/prologue/dorm_kagami_withSocks.webp",
                dialogStyle: "transparent",
              },
            ),
          ]),

      say("kagami", "蓮、この学校には表のルールと裏のルールがあるわ。"),
      say("kagami", "表のルールはいつでも校舎1階の掲示板で読めるわよ。"),
      say("kagami", "裏のルールは自分で学びなさい。"),
      say("kagami", "戦い方を学ぶ一番の方法は、戦うことよ。"),
      n("そうなのか？"),
      n("裏のルールって何だ？"),
      n("この学校、明らかにおかしなことだらけだ。"),
      say("kagami", "はい。", {
        bg: "/bg/cg/prologue/dorm_kagami_phone.webp",
      }),
      nfx("鏡が俺にスマホを渡した。"),
      n("見た目は普通だが、どこにもメーカーの名前がない。"),
      say("kagami", "このスマホは生徒にとって最も大切な持ち物よ。"),
      say(
        "kagami",
        "学生証であり、銀行カードであり、同時に普通のスマホでもある。",
      ),
      say("kagami", "あんたの成績や学校に関する情報が全部入ってるわ。"),
      say("kagami", "これを使えば、学校の外の世界の出来事も多少は追えるわよ。"),
      say("kagami", "最初の一週間で自分で使い方を覚えられると思うわ。"),
      say("kagami", "でも気をつけなさい。スマホを壊したら高くつくわよ。"),

      ...(!getFlag("quizPassed")
        ? [n("また足舐めで払うのか？"), n("嫌だ。")]
        : []),

      ...(!getFlag("quizPassed")
        ? [
            say(
              "kagami",
              "この学校には厳格な序列がある。最底辺のFランクから絶対的な頂点Sランクまでね。",
              { bg: "/bg/cg/prologue/dorm_kagami_noSocks.webp" },
            ),
          ]
        : [
            say(
              "kagami",
              "この学校には厳格な序列がある。最底辺のFランクから絶対的な頂点Sランクまでね。",
              { bg: "/bg/cg/prologue/dorm_kagami_withSocks.webp" },
            ),
          ]),
      say("kagami", "あんたは他の新入生と同様、Dランクからスタートよ。"),
      say(
        "kagami",
        "底辺に落ちないための最低条件は——授業をサボらない、遅刻しない、基本的なルールを破らない。",
      ),
      say("ren", "上がるには？"),
      say("kagami", "便利で役に立つ存在になることよ。"),
      n("便利な存在…どういう意味だ？"),
      say(
        "kagami",
        "ランクは尊重、権力、そして学校の立入禁止区域へのアクセスを与えてくれるわ。",
      ),
      say(
        "kagami",
        "エリートには専用の区域や、プライベートな「パーティー」がある。招待なしに近づいたら罰が待ってるわよ。",
      ),
      say(
        "kagami",
        "どの学校でも同じよ——悪さをしたら罰、良い行いをしたら褒賞。質問は？",
      ),
      say("ren", "受けたテストのことですが…"),
      say("ren", "なんであんな問題だったんですか？全然学術的じゃない。"),
      say("kagami", "そう？"),
      say(
        "kagami",
        "私から見れば、ここで生き残るための基礎知識をちゃんと試したつもりよ。",
      ),
      say("kagami", "正式な苦情を申し立てたい？"),
    ],
    choices: [
      {
        text: "苦情を申し立てる",
        effects: { dominance: 1 },
        next: "kagami_leaves",
      },
      {
        text: "諦めて黙っている",
        effects: { dominance: -1 },
        next: "kagami_leaves",
      },
    ],
  },

  kagami_leaves: {
    id: "kagami_leaves",
    lines: [
      say("kagami", "あんたの不満なんてどうでもいいわ。"),
      say(
        "kagami",
        "Dランクは管理部門に申し立てることは許可されていないの。でも自分がここで何か意味があると思ってるんでしょうね。",
      ),
      say("kagami", "明日が初日よ。ちゃんと寝なさい。"),
      say(
        "kagami",
        "スケジュールと教室はスマホにあるわ。ホームルームで全員に紹介するから。",
      ),
      say("ren", "先生が紹介するんですか？"),
      say("kagami", "あ、そうね。言い忘れてたわ。"),
      say(
        "kagami",
        "あんたは来る前から配置が決まってたの。2-Bクラス。私があんたの担任よ。",
      ),
      nfx(
        "彼女は立ち上がりドアへ向かった。ワインと彼女の香水のかすかな香りが漂った。",
        { bg: "/bg/locations/dorm_renRoom.webp" },
      ),
      n("…", m.sfx("door_close")),
      say("ren", "さよ…なら。"),
      n("間に合わなかった。"),
      n("時計は21時43分を示している。"),
      n("バスの中で少し眠ったが、全然気分が良くない。"),
    ],
    next: "tbc",
  },

  tbc: {
    id: "tbc",
    lines: () => [
      n("スマホを確認したり部屋を見回したりもできるが、今はただ眠りたい。"),
      nfx("ベッドに横になった。まあまあ悪くない。", {
        ...m.fx({ darkness: 1, noise: 0, duration: 500 }),
        ...m.sfx("bed_creak"),
      }),
      n("変な一日だったな、へへ。"),
      nfx("入口にいた裸の子…", m.fx({ darkness: 0, noise: 0, duration: 500 }), {
        bg: "/bg/cg/prologue/punished_girl_laugh.webp",
      }),
      n("まだ信じられない。"),

      ...(getFlag("sawChainedGirl")
        ? [
            n("彼女は少し変な行動をしていた。"),
            n("でも自分で鎖につないだわけじゃない。"),
            n(
              "認めるのは変な感じだが…彼女にはひどいことが色々されているんだろう。学校はどうでもいいのか？",
            ),
          ]
        : []),

      n("そしてあの奇妙なテスト…"),

      ...(!getFlag("quizPassed")
        ? [
            nfx("問題なんてもうどうでもいい…先生の足を舐めたんだ。", {
              bg: "/bg/cg/prologue/quiz_room_footLicking2.webp",
            }),
            n("鏡は美人で胸もある。でも俺を床に転がして足を舐めさせた…"),
          ]
        : []),

      nfx(
        "この短い到着が、一日の残りすべてより疲れさせた。",
        m.fx({ darkness: 1, noise: 0, duration: 500 }),
      ),
      n("この先、何が待ってる？"),
      n(
        "ここの生徒も教師も、だいぶ前からちょっとおかしくなってる気がし始めてきた…",
      ),
      n(
        "ああ……もう眠りに落ちていく感じがする…なんて美しく静かなんだろう…これ全部から遠く離れて…",
      ),
      n("深く…"),
    ],

    next: () => {
      // Вызываем глобальный макрос: Первая буква "プ", остальные "ロローグ"
      m.playActCinematic("プ", "ロローグ", 2500, () => {
        // Переход на утро понедельника
        window.dispatchEvent(
          new CustomEvent("loadScene", { detail: "monday_morning" }),
        );
      });

      return null;
    },
  },
};

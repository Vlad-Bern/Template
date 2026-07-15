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
      n("スーツ姿の影が正面に座っていた。タバコの匂いがする。"),
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
      say("mystery", "第134条。故意による重傷害。加えて、逮捕への抵抗。"),
      sf(
        "mystery",
        "レン、お前のやったことなら、重警備刑務所へ直行だ。",
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
        "特に私の娘%を。あ#のク$女を。",
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
        "鋭くも疲れた眼差しの大人の女性。黒髪をきつくポニーテールに束ねている。かすかに渋いワインの香りがした。",
      ),
      say("ren", "あの、はじめまして、俺は——"),
      say("kagami", "天野レン。知っている。"),
      nfx(
        "雨が降りしきる中、彼女は俺のそばまで歩み寄り、もう一本の傘を差し出した。",
        m.sfx("umbrella_open"),
      ),
      sf(
        "kagami",
        "鏡 冴と申します。",
        { action: () => setFlag("knowsKagami") },
        m.bgm("Rest till you there"),
      ),
      sf(
        "kagami",
        "後ろにあるのが神州学園です。ようこそ、天野。",
        m.show("kagami", "neutral2", "center"),
      ),
      say("ren", "ありがとうございます。レンって呼んでください。"),
      sf(
        "kagami",
        "いきなり下の名前で呼べと？",
        m.show("kagami", "neutral", "center"),
      ),
      say("ren", "はい。そのほうが慣れてるんで。"),
      say(
        "kagami",
        "わかりました。これから簡単な適性テストを行います。ついてきてください。",
      ),
      nfx(
        "俺たちは歩き出した。",
        m.sfx("step_puddle"),
        { bg: "/bg/cg/prologue/ren_kagami_walk.webp" },
        m.hide("kagami", "fadeOut"),
        m.sfx("walking", 1),
      ),
      n("一歩後ろを歩きながら、何度も彼女の腰へ視線を落とした。"),
      n(
        "そんなことを考えて、すべて正常だ、自分は安全だと言い聞かせようとした。",
      ),
      n("だが、視線を上げなければならなかった。"),
      say(
        "ren",
        "鏡先生、この学校について教えてもらえますか。小さな田舎から転校してきたんで……",
      ),
      say("ren", "こんな機会を貰えた理由すら、よくわからなくて。"),
      say("kagami", "実績？ここでは過去など何の意味もありません。"),
      say("kagami", "あるのは可能性だけ。それを活かせるか……"),
      say("kagami", "活かせないか。それだけです。"),
      say(
        "kagami",
        "学期の途中で入学するのはあなたが初めてです。通常は年度の初めから在籍します。ですから、すでに目立っていますよ。",
      ),
      say("ren", "そういうことか……"),
      nfx(
        "歩いていると、視界の端に何か……異様なものが映った。コンクリート壁の陰にうずくまる人影。",
        m.stopBgm(500),
      ),
      sf("ren", "なんだ、あれ……", m.sanity(-5)),
      n("立ち止まった。視線が一点に釘付けになる。"),
      nfx(
        "生徒だった。全裸で。肌が青白かった。",
        { bg: "/bg/cg/prologue/punished_girl_main.webp" },
        m.fx({ vignette: 1, duration: 1500 }),
      ),
      nfx("柱から伸びた鎖が、彼女の細い首にはめられた首輪へと繋がっていた。"),
      n(
        "彼女は膝を抱えたまま動かなかった。もつれた髪を伝って水が落ち、汚れたコンクリートに滴っていた。",
      ),
      nfx("この光景は、正門のすぐそばだった。", m.sanity(-5)),
      sf(
        "kagami",
        "レン、どうしました？",
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
        "道を外れると、靴の下で泥がぬちゃりと鳴った。背後で鏡が深くため息をついたが、止めはしなかった。",
        { bg: "/bg/cg/prologue/punished_girl_main.webp" },
        {
          action: () => window.sm.ui.handleFx({ vignette: 1, duration: 1500 }),
        },
        m.sfx("walking", 1),
      ),
      n(
        "近づくほど細部がはっきりしてきた。足には奇妙な白い液体。衣服はひとかけらも身につけていない。",
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
      n("いや、不安げなのか？判断できない。"),
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
        text: "性的なことをする",
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
      say("ren", "おい、何があった？なんで裸なんだ？"),
      sf("mystery", "なんであなたは着てるの？", {
        bg: "/bg/cg/prologue/punished_girl_lookup_talk.webp",
        bgSpeed: 50,
      }),
      say("ren", "？"),
      say("mystery", "わたしね、ルールを破っちゃったの。"),
      sf("mystery", "ただ誰かを、ぎゅってしたかっただけなのに……", {
        bg: "/bg/cg/prologue/punished_girl_blush.webp",
        bgSpeed: 50,
      }),
      say("mystery", "そしたら縛られて、ここに繋がれちゃった。"),
      sf("mystery", "今はね、言われた人をぎゅってするの。", {
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
        "あなたも、わたしに会いに来たんでしょ？！",
        {
          bg: "/bg/cg/prologue/punished_girl_stretches.webp",
          bgSpeed: 50,
        },
        m.sfx("metal_chain", 1),
      ),
      say("mystery", "わたしを捕まえたいんでしょ？！"),
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
        "レン、そのゴミから離れなさい。",
        m.show("kagami", "angry", "center"),
        { bg: "/bg/locations/synsu_entrance.webp" },
      ),
      say("ren", "いっ……"),
      n("これは……"),
      say("ren", "どうかしてる……"),
      n("鏡が俺の手を掴んで引っ張っていった。"),
      sf(
        "kagami",
        "勝手に歩き回っていいと誰が言いました？テストを受けに行きます。",
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
      n("鎖は柱にしっかり固定され、首にはめられた首輪へ直接繋がっている。"),
      say("ren", "お、おい、黙ってないでくれ。鍵はどこだ？どうすれば外せる？"),
      sf(
        "mystery",
        "鍵？うーん……どこにあるか、誰も知らないの。知ってたら、わたしのお友達が……",
        { bg: "/bg/cg/prologue/punished_girl_lookup_talk.webp", bgSpeed: 50 },
      ),
      sf("mystery", "とっくに外してくれてるもん！あははは！", {
        bg: "/bg/cg/prologue/punished_girl_laugh.webp",
        bgSpeed: 50,
      }),
      n("笑い声に呆気に取られた。"),
      say("ren", "どうすれば助けられる？"),
      sf("mystery", "わたしを助けてくれるの？", {
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
      say("mystery", "きれいにしてほしいな。いっぱい舐めて。"),
      say("mystery", "今ね、すっごく必要なの。"),
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
      n("興奮している……しかも、あそこは明らかに荒れていた。"),
      n("舌を出したまま、横たわっている。"),
      nfx("あ……俺のものが……反応してる。", m.sanity(-10)),
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
        "勝手に離れていいと誰が言いました？もう行きますよ。",
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
      nfx("中へ入った……無機質な空間。白い壁。", {
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
      n("白さが部屋の空虚さをいっそう際立たせていた。"),
      n("向かい合う二つの机と、壁に掛けられた一枚のホワイトボード。"),
      say("kagami", "座ってください。"),
      n("机の上にはすでに紙とペンが置かれていた。"),
      say("kagami", "まだ用紙を裏返さないでください。"),
      nfx(
        "俺は席についた。",
        { bg: "/bg/common/quiz_room_noKagami.webp" },
        m.sfx("chair_sitting", 1),
      ),
      nfx("鏡は二本の傘を傘立てに入れ、向かいの席に座った。", {
        bg: "/bg/common/quiz_room_kagamiSpeak.webp",
        bgSpeed: 50,
        ...m.sfx("highHeels_walking", 1),
      }),
      say("kagami", "ルールは簡単です。20分以内に8問へ答えてください。"),
      say("kagami", "4問以上正解すれば合格です。"),
      say("kagami", "終わったらペンを机に置き、手を挙げてください。"),
      say("kagami", "他の生徒はいませんが、試験中は私語厳禁です。"),
      say("kagami", "用紙を裏返した瞬間にタイマーが始まります。"),
      say("kagami", "質問はありますか？"),
      n("一つだけ。当然の疑問。"),
      say("ren", "答えられなかったら？"),
      say("kagami", "不合格となり、元いた場所へ戻るだけです。"),
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
        "鏡が机を叩いた。強くもなく、怒りからでもない。ただ俺を黙らせるのに十分な音だった。",
        { shake: "medium" },
        m.sfx("table_hit", 1),
      ),
      say("kagami", "もう一度規則を破れば、不合格です。"),
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
        "鏡を見上げた。スマホを眺めているだけだ。これが普通の学力問題じゃないと分かっているのか？",
        { bg: "/bg/common/quiz_room_kagamiPhone.webp" },
      ),
      n("反応はない。ただ俺が規則を守るか見張っているだけだ。"),
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
        "ふん。こんな問題について何の説明もないなら、少しくらい目の保養をしてもいいだろ。",
        { action: () => audioMacros.fadeToStem("muffled", 1000) },
      ),
      nfx("赤いブラウスの下の胸に、視線を落とした。", {
        bg: "/bg/cg/prologue/quiz_room_boobs.webp",
        dialogStyle: "transparent",
      }),
      n("でかい……すごいな。"),
      n("サイズはいくつだ？Dカップ以上はある。"),
      n("触ったらどんな感じだろう。"),
      n("今までに誰かの手が触れたことくらい、あるんだろうな。"),
      n("ブラウスの隙間から、黒いブラジャーがはっきりと見える……"),
      n("鏡、俺を誘ってるのか？"),
      n("ズボンの中で硬くなってきた。でも机の下ならバレない。"),
      nfx("薄く笑い、彼女と目を合わせた。", {
        bg: "/bg/common/quiz_room_kagamiPhone.webp",
        dialogStyle: "normal",
      }),
      n("無表情。興奮も嫌悪もない。まるで何も感じていないようだった。"),
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
      n("D) 第三者を同席させる"),
      n(
        "問題を追うごとに驚きが薄れていく。ここの生徒は本当にこんなことを学ぶのか？",
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
      { text: "D) 第三者を同席させる", next: "quiz_q5" },
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
      n("まあいい。さっきから勘で答えている。今さら何も変わらない。"),
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
      n("彼女はその場を動かず、俺の解答を確認した。"),
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
        "おめでとうございます。合格です。",
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
      sf("kagami", "行きますよ、レン。見学を続けます。", m.hide("kagami")),
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
        "おめでとうございます。合格です。",
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
        "ですが、あなたは私をあからさまに見つめ、私の境界を踏み越えました。",
      ),
      nfx("彼女は定規を手に持ったまま、俺の真正面に立った。"),
      say("kagami", "今すぐ跪いて謝る気はありますか？"),
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
      nfx(
        "気は進まないのに、体が勝手に動いた。椅子から滑り降り、彼女の前に膝をついた。",
      ),
      say("ren", "その……すみません、鏡先生。"),
      n(
        "突然、冷たい金属が顎に触れた。鏡は定規の先端を顎の下に差し込み、強制的に頭を上げさせた。",
      ),
      say("kagami", "胸ではなく、私の目を見なさい、レン。"),
      n("彼女の声は完全に冷淡だ。手で触れようともしない。"),
      n(
        "俺など素手で触れる価値もないから、道具を使っている。そう言われている気がした。",
      ),
      say(
        "kagami",
        "あなたはDランク。ただのゴミです。自分の担当者に涎を垂らすとは、どれほど下等か証明しているだけですよ。",
      ),
      n("彼女は定規を少し強く押した。金属が皮膚に食い込む。"),
      say("ren", "あぐっ……"),
      say(
        "kagami",
        "この隔たりを忘れないでください。あなたにはよい教訓でしょう。立ちなさい。",
      ),
      nfx("彼女は定規を引き、元の場所に戻した。", {
        bg: "/bg/common/quiz_room.webp",
      }),
      n("くそ……頭が状況に追いつかない……"),
      nfx("なのに、なぜかチンポはさらに硬くなった。", m.sanity(-5)),
      say("kagami", "レン、準備ができたら先へ進みます。"),
      n("立ち上がって服の埃を払った。心臓はまだ激しく鳴っている。"),
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
      say("ren", "鏡先……"),
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
      say("ren", "なんだよ……何するんですか！？"),
      say("kagami", "天野レン、あなたはテストに不合格です。"),
      say("kagami", "到着してわずか数分で、自分が弱者だと証明しました。"),
      say("kagami", "元の学校へ送り返します。そこでは警察が待っています。"),
      sf("kagami", "あなたの人生はここで終わりです。", {
        effects: { sanity: -5 },
      }),
      n("……もう終わりか？", m.fx({ darkness: 1, duration: 500 })),
      n("こんなあっさり終わるのか？"),
      nfx(
        "俺なしで……",
        { bg: "/bg/common/rin.webp" },
        { ...m.fx({ vignette: 1, duration: 1500 }) },
        { action: () => audioMacros.fadeToStem("muffled", 1000) },
      ),
      n("リン。", m.fx({ darkness: 0, duration: 500 })),
      n("俺が戻らなかったら、あいつはどうなる？"),
      n("こんなことになるはずじゃなかった。"),
      sf(
        "kagami",
        "落ち込まないでください、天野レン。あなたのような人間にも選択肢はあります。",
        { bg: "/bg/cg/prologue/quiz_room_kagami.webp" },
        { ...m.fx({ vignette: 0, duration: 3000 }) },
        { action: () => audioMacros.fadeToStem("base", 1000) },
      ),
      say("ren", "……聞きます。"),
      n("鏡は右のパンプスを脱ぎ、足を俺の顔のすぐ前へ突き出した。"),
      sf("kagami", "舐めなさい。", {
        bg: "/bg/cg/prologue/quiz_room_footLicking1.webp",
        bgSpeed: 50,
        dialogStyle: "transparent",
      }),
      say("ren", "舐める？"),
      say(
        "kagami",
        "私の時間を無駄にしないでください。今のあなたは、失敗の代償を払うべきゴミです。",
      ),
      say("kagami", "舐めるか、警察のもとへ戻るか。選びなさい。"),
    ],
    choices: [
      {
        text: "足の裏に舌を這わせる",
        effects: { dominance: -10 },
        next: "quiz_fail_lick",
      },
      {
        text: "鏡先生、くたばれ",
        req: { dominance: { min: 10 } },
        effects: { dominance: 5 },
        next: "quiz_fail_reject",
      },
    ],
  },

  quiz_fail_lick: {
    id: "quiz_fail_lick",
    lines: () => [
      n("……自分がこんなことをしているなんて信じられない。", {
        action: () => audioMacros.fadeToStem("muffled", 1000),
      }),
      nfx("ゆっくりと顔を足に近づけ、舌を出した。", {
        bg: "/bg/cg/prologue/quiz_room_footLicking2.webp",
        bgSpeed: 50,
      }),
      n("すぐに味が広がった。温かな肌、革靴、そしてローションのかすかな香り。"),
      nfx("ナイロンにそっと舌を当て、軽く舐めた。"),
      say("kagami", "本気ですか？"),
      say("kagami", "それが許しを乞う態度ですか？"),
      n("彼女はつま先を俺の舌へさらに強く押しつけた。"),
      nfx("足の親指が俺の唇に当たった。", {
        bg: "/bg/cg/prologue/quiz_room_footLicking3.webp",
        bgSpeed: 50,
      }),
      say("kagami", "そうです。指を一本ずつ、きちんと舐めなさい。"),
      nfx("何なんだよこれ……", { ...m.sanity(-5) }),
      n("頼むから、誰も入ってくるな。"),
      n("……"),
      n("……"),
      n("もう一分は舐めてる。いつ終わるんだ？"),
      say("kagami", "もっと強く、レン！"),
      n("俺は本当に彼女の望みに応えようとし始めた。"),
      n("足の指をさらに速く舐め始めた。"),
      n("どれだけ狂った状況でも……"),
      n("チンポが……"),
      nfx("ズボンを内側から押し上げていた。", { ...m.sanity(-1) }),

      ...(getFlag("kagamiStare")
        ? [
            sf(
              "kagami",
              "もっと励みなさい、レン。好き勝手に私を眺めるのは楽しかったのでしょう？この味も気に入りましたか？",
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
      n("最悪だ……"),
      n(
        "黒いナイロンの靴下……びしょびしょに濡れている……生地越しに赤いペディキュアが見える。",
      ),
      say("ren", "どうしてこんなことが平気でできるんですか？"),
      nfx(
        "また足が口元に戻ってきた。",
        { bg: "/bg/cg/prologue/quiz_room_footLicking3.webp" },
        { action: () => audioMacros.fadeToStem("muffled", 1000) },
      ),
      n("ゆっくりと舌で円を描く。"),
      say("kagami", "気に入っているのでしょう、レン？"),
      say("ren", "んっ……"),
      n(
        "それからさらに二分間、部屋にはぐちゅぐちゅという音と俺の押し殺した呻きだけが響いた。",
      ),
      n("実際よりも、はるかに長く感じた。"),
      n(
        "この状況が怖いのか、それとも自分が勃起していることが怖いのか、もう判断がつかない。",
      ),
      nfx("屈辱と欲望に引き裂かれそうだった。", { ...m.sanity(-5) }),
      n("鏡がやっと足を引いた。俺は必死に息を整えた。", { ...m.stopBgm() }),
      sf("kagami", "そこまでです。仕方ありません。テストは合格扱いにします。", {
        bg: "/bg/cg/prologue/quiz_room_kagami.webp",
        dialogStyle: "normal",
      }),
      say(
        "kagami",
        "もっとも、こうして無様に床へ転がっているあなたに、どれほど意味があるかは分かりませんが。",
      ),
      nfx("鏡は両方の靴下を——使っていない方も含めて——脱いでゴミ箱に捨てた。", {
        bg: "/bg/common/quiz_room.webp",
      }),
      nfx(
        "それから電気を消し、ドアを開け、傘を持って出て行った。",
        { ...m.fx({ darkness: 0.8, noise: 0, duration: 500 }) },
        { ...m.sfx("light_switch", 1) },
      ),
      say("kagami", "先へ進みます。"),
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
      n("でも正直に言うと……お前は勝ったんだ。天国に召されたんだからな。"),
      n(
        "そこで、とびきりエッチな鏡の写真集を見つけた。もちろん本編とは無関係だけどな。",
      ),
      n("大人のお姉さんで存分にチンポをシコシコしろよ。"),
      n(
        "天国を歩いていると、小さなフォトアルバムを見つけた。さっそく開いてみると——",
      ),
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
      say("kagami", "レン、これから寮へ向かいます。あなたが生活する場所です。"),
      n("雨の向こうを見つめた。"),
      n("かなり不気味な建物が三棟見えた。"),
      n("一棟はフェンスの向こうにある？"),
      nfx(
        "無言で歩いた……聞きたいことは山ほどあったが、今は口にする勇気がなかった。",
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
      n("せめてエレベーターの中でも見回すか。"),
      n(
        "壁は落書きだらけで、ドアは錆びつき、デジタルの階数表示も壊れていた。この建物、かなり放置されている。",
      ),
      n("だが、一つだけ目を引くものがあった。壁に貼られた小さな写真だ。"),
      nfx("眼鏡をかけたスタイルのいい女の子が、自撮り写真に収まっていた。", {
        bg: "/bg/common/elevator_photo.webp",
      }),
      n("半裸だったが、乳首は見えなかった。くそ。"),
      say("ren", "おっ……"),
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
      nfx("それから彼女は俺に鍵を手渡した。", {
        ...m.show("kagami", "neutral", "center"),
        ...m.sfx("key_door"),
      }),
      say("kagami", "覚えておいてください。第二棟、4階、404号室です。"),
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
      n("窓の格子以外は普通だ……いや、隅にカメラもある。"),
      n("マジかよ、誰かに抜くところ見られるのか？"),
      n("何かで隠せばいい。"),
      n(
        "考えていると、鏡はもう奥に進んで、きしむ椅子に座り足を組んでいた。",
        m.sfx("chair_sitting"),
      ),

      ...(!getFlag("quizPassed")
        ? [
            nfx(
              "思わず視線が下がった。素足のままパンプスを履いている。そういえば、靴下はゴミ箱へ捨てていた。",
              {
                bg: "/bg/cg/prologue/dorm_kagami_noSocks.webp",
                dialogStyle: "transparent",
              },
            ),
          ]
        : [
            nfx(
              "思わず視線が下がった。黒いナイロンが足をぴったりと包んでいた。",
              {
                bg: "/bg/cg/prologue/dorm_kagami_withSocks.webp",
                dialogStyle: "transparent",
              },
            ),
          ]),

      say(
        "kagami",
        "レン、この学校には明文化された規則と、暗黙の規則があります。",
      ),
      say("kagami", "明文化された規則は、校舎1階の掲示板でいつでも読めます。"),
      say("kagami", "暗黙の規則は自分で学んでください。"),
      say("kagami", "戦い方を学ぶ最善の方法は、実際に戦うことです。"),
      n("そうなのか？"),
      n("裏のルールって何だ？"),
      n("この学校、明らかにおかしなことだらけだ。"),
      say("kagami", "どうぞ。", {
        bg: "/bg/cg/prologue/dorm_kagami_phone.webp",
      }),
      nfx("鏡が俺にスマホを渡した。"),
      n("見た目は普通だが、どこにもメーカーの名前がない。"),
      say("kagami", "このスマホは、生徒にとって最も大切な持ち物です。"),
      say(
        "kagami",
        "学生証であり、銀行カードであり、同時に普通のスマホでもあります。",
      ),
      say("kagami", "あなたの成績や学校に関する情報が、すべて入っています。"),
      say(
        "kagami",
        "学校の外で起きていることも、これである程度は把握できます。",
      ),
      say("kagami", "一週間もあれば、自分で使い方を把握できるでしょう。"),
      say(
        "kagami",
        "ただし、壊さないよう注意してください。相応の代償を払うことになります。",
      ),

      ...(!getFlag("quizPassed")
        ? [n("また足を舐めて償うのか？"), n("嫌だ。")]
        : []),

      ...(!getFlag("quizPassed")
        ? [
            say(
              "kagami",
              "この学校には厳格な序列があります。最底辺のFランクから、絶対的な頂点であるSランクまで。",
              { bg: "/bg/cg/prologue/dorm_kagami_noSocks.webp" },
            ),
          ]
        : [
            say(
              "kagami",
              "この学校には厳格な序列があります。最底辺のFランクから、絶対的な頂点であるSランクまで。",
              { bg: "/bg/cg/prologue/dorm_kagami_withSocks.webp" },
            ),
          ]),
      say("kagami", "あなたも他の新入生と同様、Dランクから始まります。"),
      say(
        "kagami",
        "最底辺へ落ちないための最低条件は、欠席しないこと、遅刻しないこと、基本的な規則を破らないことです。",
      ),
      say("ren", "上がるには？"),
      say("kagami", "扱いやすく、役に立つ存在になることです。"),
      n("扱いやすい存在……どういう意味だ？"),
      say(
        "kagami",
        "ランクが上がれば、敬意と権限、そして学校の制限区域へ立ち入る資格が得られます。",
      ),
      say(
        "kagami",
        "エリートには専用の区域や、私的な『パーティー』があります。招待なしで立ち入れば、罰が待っています。",
      ),
      say(
        "kagami",
        "どの学校でも同じです。悪い行いには罰を、良い行いには褒賞を。質問はありますか？",
      ),
      say("ren", "受けたテストのことですが……"),
      say("ren", "なんであんな問題だったんですか？学力とは何の関係もない。"),
      say("kagami", "そうでしょうか？"),
      say(
        "kagami",
        "私としては、ここで生き残るための基礎知識を適正に測ったつもりです。",
      ),
      say("kagami", "正式に苦情を申し立てますか？"),
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
      say("kagami", "あなたの不満など、私にはどうでもいいことです。"),
      say(
        "kagami",
        "Dランクには、管理部門へ申し立てる権利がありません。それでも自分には価値があると思っているのでしょうね。",
      ),
      say("kagami", "明日が初登校です。よく休んでください。"),
      say(
        "kagami",
        "時間割と教室はスマホで確認できます。ホームルームで皆に紹介します。",
      ),
      say("ren", "先生が紹介するんですか？"),
      say("kagami", "そうでした。伝え忘れていました。"),
      say(
        "kagami",
        "あなたの所属は到着前から決まっています。2年B組。私が担任です。",
      ),
      nfx(
        "彼女は立ち上がり、ドアへ向かった。ワインと香水のかすかな香りがあとに残った。",
        { bg: "/bg/locations/dorm_renRoom.webp" },
      ),
      n("……", m.sfx("door_close")),
      say("ren", "さよ……なら。"),
      n("最後まで言う前に、ドアが閉まった。"),
      n("時計は21時43分を示していた。"),
      n("ここへ来る途中、バスで少し眠ったはずなのに、ひどく疲れている。"),
    ],
    next: "tbc",
  },

  tbc: {
    id: "tbc",
    lines: () => [
      n(
        "スマホを確認することも、部屋を見て回ることもできる。でも今は、ただ眠りたい。",
      ),
      nfx("ベッドに横になった。まあまあ悪くない。", {
        ...m.fx({ darkness: 1, noise: 0, duration: 500 }),
        ...m.sfx("bed_creak"),
      }),
      n("とんでもない一日だったな……。"),
      nfx(
        "校門にいた裸の子……",
        m.fx({ darkness: 0, noise: 0, duration: 500 }),
        {
          bg: "/bg/cg/prologue/punished_girl_laugh.webp",
        },
      ),
      n("まだ信じられない。"),

      ...(getFlag("sawChainedGirl")
        ? [
            n("あの子は少しおかしな様子だった。"),
            n("でも自分で鎖につないだわけじゃない。"),
            n(
              "考えたくはないが……きっと、あの子はひどい目に遭わされている。それを学校は放置しているのか？",
            ),
          ]
        : []),

      n("そしてあの奇妙なテスト……"),

      ...(!getFlag("quizPassed")
        ? [
            nfx("問題なんてもうどうでもいい……俺は教師の足を舐めたんだ。", {
              bg: "/bg/cg/prologue/quiz_room_footLicking2.webp",
            }),
            n("鏡は美人で、胸もでかい。でも俺を床に転がし、足を舐めさせた……"),
          ]
        : []),

      nfx(
        "ここへ着いてからの数時間だけで、それまでの一日よりずっと疲れた。",
        m.fx({ darkness: 1, noise: 0, duration: 500 }),
      ),
      n("この先、何が待ってる？"),
      n(
        "ここの生徒も教師も、みんなどこか狂ってるんじゃないか……そんな気がしてきた。",
      ),
      n(
        "ああ……もう眠りに落ちていく……きれいで静かな場所へ……何もかもから、遠く離れて……",
      ),
      n("もっと深く……"),
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

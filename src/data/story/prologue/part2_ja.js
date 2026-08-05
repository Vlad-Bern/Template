import { m, n, say, nfx, sf } from "../../macros.js";
import { setFlag, getFlag } from "../../../core/state.js";

export const story = {
  // ============================================
  // === 月曜の朝：エレベーター ===
  // ============================================
  monday_morning: {
    id: "monday_morning",
    bg: "./bg/locations/dorm_renRoom_rainingMorning.webp",
    lines: () => [
      m.dayTransition("月曜日"),
      nfx(
        "おはよう、俺。",
        m.fx({ darkness: 0, duration: 2000 }),
        m.audioMix(
          m.stopBgm(500),
          m.stopSfx("muffled_rain"),
          m.sfx("dorm_ambience", 0.5, true),
        ),
        { dialogStyle: "normal" },
      ),
      n("本当にいい朝だといいけど。"),
      n("窓の外は今日も曇っている。でも、少なくとも雨は降っていない。"),

      // 鏡に屈辱を与えられた場合のみ挿入
      ...(!getFlag("quizPassed")
        ? [
            n("昨日、教師の足を舐めたなんて、いまだに信じられない。"),
            n("人生が変わるとは思っていた。でも、これはさすがにやりすぎだ。"),
          ]
        : []),

      n("部屋を見て回るには絶好の機会だ。"),
      m.interact(
        {
          type: "look",
          label: "ベッド",
          pos: { x: 25, y: 70 },
          lines: [
            n("ベッドはかなり硬く、寝心地もよくなかった。"),
            n(
              "もっとも、昨日の後なら、どんなクソみたいな場所でも眠れただろうけど。",
            ),
          ],
        },
        {
          type: "look",
          label: "窓",
          pos: { x: 50, y: 40 },
          lines: [
            n("窓の鉄格子を手でなぞった。"),
            n("何のためにあるんだ？"),
            n("部屋全体が息苦しく感じる。まるで囚人になったみたいだ。"),
          ],
        },
        {
          type: "look",
          label: "テーブルと簡易キッチン",
          pos: { x: 70, y: 60 },
          lines: [
            n("食事をするための小さなテーブル。"),
            n("あるいは、あのクソみたいな鉄格子を眺めるための場所。"),
          ],
        },
        {
          type: "look",
          label: "ドア",
          pos: { x: 90, y: 50 },
          lines: [
            n("このドアは浴室につながっている。"),
            n("中には……浴槽、洗面台、洗濯機、それにトイレ。"),
            n("どれも簡素なものだ。"),
          ],
        },
        {
          type: "look",
          label: "監視カメラ",
          pos: { x: 75, y: 10 },
          lines: [
            n("監視カメラ……"),
            n("誰が俺を見ている？　何のために？"),
            n("カメラに向かって手を振った。"),
            say(
              "ren",
              "せめて、俺が一人で楽しんでる時くらいは目を逸らしてくれよ。",
            ),
          ],
        },
        {
          type: "look",
          label: "紙",
          pos: { x: 98, y: 35 },
          lines: [
            n("居住規則が書かれた紙だ。"),
            m.choice(
              {
                text: "どうでもいい規則を読む。",
                lines: [
                  n(
                    "1. 生徒は、割り当てられた部屋の状態について全責任を負う。",
                  ),
                  n(
                    "2. 設備の故障を発見した場合、生徒はスマホから報告する義務を負う。",
                  ),
                  n(
                    "3. 招き入れた生徒の行為については、その部屋の居住者が責任を負う。",
                  ),
                  n(
                    "4. 清掃、修理、違反への対処にかかる費用は、居住者の口座から自動的に差し引かれる。",
                  ),
                  n(
                    "5. 規則を読んでいなかったことは、処罰を免れる理由にはならない。",
                  ),
                ],
              },
              {
                text: "時間を無駄にしない。",
              },
            ),
          ],
        },
        { type: "exit", label: "見終える", pos: { x: 50, y: 95 } },
      ),
      n("もう十分だ。"),
      nfx("この部屋と一緒に、スマホも手に入った。", {
        pdaUnlocked: true,
      }),
      n("こっちも見ておこう。"),
      n("質素に暮らすぶんには、この部屋もそこまで悪くない。"),
      nfx("部屋を出て、エレベーターへ向かった。"),
      nfx(
        "...",
        { bg: "./bg/common/elevator_students.webp" },
        m.sfxMix(["elevator_door", 0.5], ["elevator", 1, true]),
      ),

      n("中にはすでに四人の生徒が乗っていた。"),
      n("ふむ。本当に制服はないらしい。"),
      n("俺が乗り込むと、エレベーターはそのまま動き続けた。"),

      sf(
        "student_angry",
        "あのクソ女、マイ！　頭の悪いビッチみたいな真似しやがって！",
        m.show({
          id: "student_angry",
          src: "/chars/minorCharacters/angryGirl_angry.webp",
          name: "怒った女子生徒",
          position: "left",
          anim: "slideInLeft",
        }),
        m.psychoShake("student_angry"),
      ),
      n(
        "うわっ。女子生徒の一人が、俺の存在など気にも留めず、突然わめき始めた。",
      ),
      sf(
        "student_dumb",
        "何も考えずに襲いかかったとは思えない。誰かに唆されたんだろ。",
        m.show({
          id: "student_dumb",
          src: "/chars/minorCharacters/dumbBoy_natural.webp",
          name: "間抜けな男子生徒",
          position: "right",
          anim: "slideInRight",
        }),
      ),
      say("student_angry", "黙れ。考えなしのお前にだけは言われたくない。"),
      n("ここの生徒は、いつもこんなふうに話すのか？"),

      sf(
        "student_shy",
        "でも、あの子の自業自得でしょ。もう四日も鎖につながれてるし、様子を見に行かない？",
        m.show({
          id: "student_shy",
          src: "/chars/minorCharacters/shyGirl_natural.webp",
          name: "内気な女子生徒",
          position: "center",
          anim: "fadeInUp",
        }),
      ),
      sf(
        "student_angry",
        "やめとけ、アヤネ。最低のクソ案だ。",
        m.show({
          id: "student_angry",
          src: "/chars/minorCharacters/angryGirl_embrassed.webp",
          name: "怒った女子生徒",
          position: "left",
        }),
      ),
      say("student_shy", "どうして？"),
      sf(
        "student_angry",
        "セレステに見つかったら……",
        m.show({
          id: "student_angry",
          src: "/chars/minorCharacters/angryGirl_blush.webp",
          name: "怒った女子生徒",
          position: "left",
        }),
      ),

      n("なぜか、彼女はその名前だけ小声で口にした。"),

      sf(
        "student_crazy",
        "そしたら全員まとめてヤられちゃうね！！　あはは！",
        m.show({
          id: "student_crazy",
          src: "/chars/minorCharacters/clownGirl_natural.webp",
          name: "イカれた女子生徒",
          position: "center",
          anim: "slideInLeft",
        }),
        m.psychoShake("student_crazy"),
      ),
      n("対して、こちらはエレベーターいっぱいに響き渡るほど大声で笑い出した。"),

      n("到着するまで視線を固定できそうな場所を探し……"),
      nfx(
        "昨日見かけた、眼鏡の女子の面白い写真をすぐに見つけた。",
        { bg: "./bg/common/elevator_photoCum.webp" },
        m.hideAll(),
      ),
      n("ただし……"),
      n("その写真は今、乾いた白い液体で汚れていた。"),
      nfx(
        "正体は分からないが、どう見ても精液にしか見えない。絵の具であってほしい。",
        m.sanity(-2),
      ),

      sf(
        "student_dumb",
        "『ヤられる』って、どっちの意味だ？　みんなであの女のアソコでも舐めるのか？",
        { bg: "./bg/common/elevator_students.webp" },
        m.show({
          id: "student_dumb",
          src: "/chars/minorCharacters/dumbBoy_tongue.webp",
          name: "間抜けな男子生徒",
          position: "right",
          anim: "slideInLeft",
        }),
      ),
      sf(
        "student_angry",
        "ケント、あんたじゃ《ピット》のホームレス女にだって舐めさせてもらえないわよ！",
        m.show({
          id: "student_angry",
          src: "/chars/minorCharacters/angryGirl_exhale.webp",
          name: "怒った女子生徒",
          position: "left",
          anim: "slideInLeft",
        }),
      ),
      sf(
        "student_crazy",
        "風俗にでも行ってくれば、役立たず。",
        m.show({
          id: "student_crazy",
          src: "/chars/minorCharacters/clownGirl_smirk.webp",
          name: "イカれた女子生徒",
          position: "center",
        }),
      ),
      say("student_angry", "レイコにすら相手にされないくせに！"),

      nfx(
        "エレベーターが到着し、俺は外へ出た。",
        m.audioMix(m.stopSfx("elevator", 500), m.sfx("elevator_door", 0.5)),
        m.hideAll(),
        m.fx({
          darkness: 1,
          duration: 100,
        }),
      ),

      n("今のは一体、何の話だったんだ？！"),

      nfx(
        "もっと聞いていたかった気もする。あいつらが話していたのは、彼女のことだよな？",
        { bg: "/bg/cg/prologue/punished_girl_main.webp" },
        m.fx({
          vignette: 1,
          darkness: 0,
          duration: 300,
        }),
      ),
      n("昨日、校舎の入口で、裸のまま鎖につながれた女子生徒を見た。"),
      n("いまだに、どう理解すればいいのか分からない。"),
    ],
    next: "school_courtyard",
  },

  // ============================================
  // === 通学路と上履き用ロッカー ===
  // ============================================
  school_courtyard: {
    id: "school_courtyard",
    bg: "./bg/locations/shinshu_wayTo.webp",
    lines: [
      nfx(
        "外に出た……",
        m.fx({ vignette: 0, duration: 1000 }),
        m.bgm("A Morning Where Nothing Happens", 0.5),
      ),
      n("胸いっぱいに息を吸い込んだ。雨上がりのオゾンの匂いがする。"),
      n("学校へ続く小道をゆっくり歩いた。"),
      n(
        "遅刻には昔から縁がない。無理やり放り込まれたこんなクソみたいな場所でも、俺はきちんと時間どおりに起きる。",
      ),
      n("あちこちに生徒がいる。俺と同じように、みんな本校舎へ向かっている……"),
      n("でも、全員が誰かと一緒なのか？"),
      n("俺みたいな一人ぼっちは、一人もいないのか？"),
      n("ここでも、普通に友達はできるのかもしれない。"),
      nfx(
        "校舎へ入ると、上履き用のロッカーがずらりと並んでいた。",
        { bg: "./bg/locations/enterance_lockers.webp" },
        m.sfx("school_door", 1),
      ),
      n("そうか……上履き……制服はないくせに、汚れた靴のまま歩くのは駄目なのか。"),
      n("でも、俺のはどれだ？！"),
      n("視線を左右に走らせたまま、俺は固まった。"),

      n("そこへ希望の光が向こうから歩いてきて……俺の額を指で弾いた。"),
      sf(
        "ren",
        "痛っ！　何するんですか？！",
        m.psychoShake("ren"),
        m.audioMix(m.stopBgm(100), m.sfx("finger_flick")),
      ),
      sf(
        "shiroko",
        "なぜ突っ立っている？　他の生徒の邪魔だ。",
        m.show("shiroko", "angry", "center"),
        m.bgm("Invite for a punishment", 0.8),
      ),
      n("また別の教師だ。年齢は鏡と同じくらいに見えるが、この格好からすると……"),
      n("体育教師か？"),

      say(
        "ren",
        "こんにちは。俺、転入してきたばかりで……どのロッカーを使えばいいのか分からなくて。",
      ),

      sf(
        "shiroko",
        "転入生？　ああ……お前がそうか。学期の途中に突然やって来た。",
        m.show("shiroko", "shocking", "center"),
      ),
      say(
        "shiroko",
        "スマホで自分のプロフィールを開け。部屋番号の隣に、ロッカー番号も載っている。",
      ),
      say("shiroko", "そのロッカーへ行き、鍵にスマホをかざせば開く。"),

      say("ren", "どうしてそんな情報を生徒のプロフィールに？"),
      sf(
        "shiroko",
        "スマホとロッカーがひも付けられているからだ。本人以外には開けられない。大事な物を置いておく生徒も多い。",
        m.show("shiroko", "neutral", "center"),
      ),
      n("なるほど……でも、俺が何も知らないのは鏡のせいだ！　俺のせいじゃない！"),

      say("ren", "ありがとうございます。"),

      nfx("ロッカーの列へ歩み寄った。", m.hide("shiroko")),

      m.interact(
        {
          id: "locker_12",
          type: "look",
          label: "12",
          pos: { x: 8, y: 62 },
          lines: [
            n("鍵にスマホをかざした。開かない。"),
            n("先にスマホで自分のロッカー番号を確かめるべきじゃないか？！"),
          ],
        },

        {
          id: "locker_21",
          type: "look",
          label: "21",
          pos: { x: 5, y: 50 },
          lines: [
            n("鍵にスマホをかざした。開かない。"),
            n("先にスマホで自分のロッカー番号を確かめるべきじゃないか？！"),
          ],
        },

        {
          id: "locker_29",
          type: "look",
          label: "29",
          pos: { x: 13, y: 65 },
          lines: [
            n("鍵にスマホをかざした。開かない。"),
            n("先にスマホで自分のロッカー番号を確かめるべきじゃないか？！"),
          ],
        },

        {
          id: "locker_34",
          type: "exit",
          label: "34",
          pos: { x: 21, y: 72 },
        },

        {
          id: "locker_36",
          type: "look",
          label: "36",
          pos: { x: 13, y: 90 },
          lines: [
            n("鍵にスマホをかざした。開かない。"),
            n("先にスマホで自分のロッカー番号を確かめるべきじゃないか？！"),
          ],
        },

        {
          id: "locker_37",
          type: "look",
          label: "37",
          pos: { x: 17.5, y: 88 },
          lines: [
            n("鍵にスマホをかざした。開かない。"),
            n("先にスマホで自分のロッカー番号を確かめるべきじゃないか？！"),
          ],
        },
      ),
      n("34番ロッカーの鍵にスマホをかざした。"),
      nfx("ロッカーが開いた。中は空だ。", m.sfx("locker_open")),
      n("仕方ない。さっきの教師に聞こう。"),
      sf(
        "ren",
        "すみません。初日はどこで上履きを手に入れればいいんですか？",
        m.show("shiroko", "neutral", "center"),
      ),

      sf(
        "shiroko",
        "つまり上履きも持たず、廊下を汚しに来たということか？",
        m.show("shiroko", "angry", "center"),
      ),
      say("shiroko", "本来なら、自分で売店へ行って買うべきものだ。"),
      say("ren", "え？　どうして担任は教えてくれなかったんですか？"),

      n("彼女は真っすぐ俺へ向かって歩き始めた。"),

      sf(
        "shiroko",
        "担任のせいにするのか？",
        m.show("shiroko", "mockery", "center"),
      ),
      nfx(
        "背中が壁に当たった。彼女の両手が俺の頭すれすれをかすめ、そのまま壁についた。",
        { bg: "./bg/cg/prologue/shiroko_kabedo.webp" },
        m.audioMix(m.sfx("kadedo"), m.sfx("heartbeat_short")),
        m.psychoShake("ren"),
        m.hide("shiroko"),
      ),

      say(
        "shiroko",
        "まあ、転入したばかりだから今回は見逃してやる。ただし、ただでは済まさん。",
      ),
      say(
        "shiroko",
        "放課後、体育館へ来い。上履きをどこで、どう買うのか、私が直々に教えてやる。",
      ),
      say("shiroko", "まずは座学、その後に実技だ。"),
      n("何だ、その笑顔は……また頭のおかしい教師か？"),
      n("この学校にまともな人間は一人もいないのか？！"),

      nfx("彼女は俺から離れた。", m.show("shiroko", "neutral", "center"), {
        bg: "./bg/locations/enterance_lockers.webp",
      }),

      say("shiroko", "では、待っている。体育館の場所はスマホで確認できる。"),
      sf(
        "shiroko",
        "それから、来ないという選択肢は考えるな。教師の言葉は絶対だ。分かったな？　命令に背いた結果に耐えられるほど、お前はまだ経験を積んでいない。",
        m.show("shiroko", "angry", "center"),
      ),
      nfx("俺は黙ってロッカーを閉め、その場を離れた。", m.hide("shiroko")),
      nfx("くそっ、俺のちんこ、こんなことで勃つな。", m.sanity(-1)),
    ],
    next: "class_enter",
  },

  // ============================================
  // === 教室へ入る ===
  // ============================================
  class_enter: {
    bg: "./bg/locations/2B_coridor.webp",
    lines: [
      sf(
        "ren",
        "次は、校舎二階の2-B教室だ。",
        m.audioMix(m.sfx("walking"), m.stopBgm()),
      ),
      n("ドアの向こうから生徒たちの声が聞こえる。もうほとんど揃っているのか？"),
      n("教室へ入る。"),
      nfx(
        "すぐに鏡とクラスメイトたちが目に入った。",
        {
          bg: "./bg/locations/2B_class.webp",
        },
        m.sfx("door_close"),
      ),
      nfx(
        "鏡がこちらを向く。その目は昨日と同じく、何の感情も映していない。",
        m.show("kagami", "neutral2", "center"),
      ),
      say("kagami", "静かにしなさい。新しい生徒を紹介します。自己紹介を。"),
      nfx(
        "教室が一瞬で静まり返る。全員の視線が俺に集まった。",
        m.hide("kagami"),
      ),
      say(
        "ren",
        "皆さん、初めまして。天野レンです。これからよろしくお願いします。",
      ),
      n("今のでよかったよな。"),
      sf(
        "kagami",
        "ええ。私たちも、あなたと過ごせることを心から『楽しみ』にしています。",
        m.show("kagami", "tired", "center"),
      ),
      n("そこまで皮肉を利かせなくてもいいだろ。"),

      sf(
        "kagami",
        "覚えておきなさい、天野レン。この学園で誰かに名乗る時は、まずランクを、次に名前を名乗りなさい。もう一度。これが最後の機会です。",
        m.show("kagami", "neutral", "center"),
      ),
      n("ランクがそれほど重要なのか？"),
      sf(
        "ren",
        "Dランク、天野レンです。よろしくお願いします。",
        m.hide("kagami"),
      ),
      n("クラスは何の反応も示さなかった。"),
      n("ただ視線を逸らし、それぞれのしていたことに戻る。"),

      sf(
        "kagami",
        "よろしい。では、あなたの席を決めましょう……",
        m.show("kagami", "neutral2", "center"),
      ),
      say("kagami", "あそこが空いています。カイラの隣です。"),
      nfx("空いている席を目で探した。", m.hide("kagami")),
      nfx("あった。窓際だ。隣の席の女子も見える。", {
        bg: "./bg/cg/prologue/2B_kairaMain.webp",
      }),
      say("kagami", "彼女の隣に座りなさい、レン。"),

      say("kaira", "こっち来なよ、転入生。"),
      n("女子にしては、ずいぶん荒っぽい声だ。"),
      say("kaira", "ほら、早く～"),
      nfx("短い黒髪の女子が、カイラらしい。", {
        action: () => setFlag("knowsKaira"),
      }),
      nfx("自分の席へ向かう。もう誰も俺を見ていない。", m.sfx("walking")),
      n("カイラをさっと眺めた。"),
      n("長いイヤリングに、赤い文字の入った黒いTシャツ。"),
      nfx(
        "机の下には、黒いストッキングに包まれた綺麗な脚が、スニーカーを履いて覗いている……",
        {
          bg: "./bg/cg/prologue/2B_kairaSneakers.webp",
        },
      ),
      n("いや、タイツか？"),
      nfx("視線をカイラの顔まで上げる。うわ、くそっ……", {
        bg: "./bg/cg/prologue/2B_kairaCloseUp.webp",
      }),
      n("その目は一体何なんだ？"),

      sf(
        "kaira",
        "いつまで私の脚をじろじろ見てるつもり？",
        m.psychoShake("ren"),
      ),
      say("ren", "あっ、悪い。"),
      nfx(
        "自分の席に腰を下ろした。",
        {
          bg: "./bg/locations/2B_classKagami.webp",
        },
        m.sfx("chair_sitting"),
      ),
      n("カイラはどう見ても友好的な雰囲気じゃない……話しかけるべきだろうか？"),

      nfx("チャイムが鳴った。", m.sfx("school_bell")),
      n("普通の学校で聞くチャイムとは、まるで違う音だ。"),
      say("yukino", "授業を始めます。全員、起立！"),
      nfx(
        "全員が一斉に立ち上がる。号令をかけたのは後ろの席の女子――おそらく学級委員だ。",
        m.fx({ darkness: 1, duration: 500 }),
      ),
      say("yukino", "礼。"),
      say("yukino", "着席。"),
      sf(
        "kagami",
        "現代文学の続きを始めます。教科書の45ページを開いてください……",
        m.fx({ darkness: 0, duration: 500 }),
      ),

      n(
        "初めての授業だ。鏡の話に集中しよう。もっとも、今は何かを学ぶ意欲なんて底をついているが……",
      ),
      sf(
        "kaira",
        "転入生……転入生……転入生……",
        {
          bg: "./bg/cg/prologue/2B_kairaSide.webp",
        },
        m.bgm("Bass solo", 0.6),
      ),
      n(
        "横目で見ると、人生で初めて隣の席になったカイラが腕を組み、『転入生』と何度も囁いていた。",
      ),
      nfx(
        "よし、見ないことにしよう。俺にさえ構わなければ、そこで何をしていようが勝手だ。",
        {
          bg: "./bg/locations/2B_classKagami.webp",
        },
      ),
      nfx("右から物音がする。何かが動いている……", m.sfx("desk_scrape", 0.4)),
      nfx("……今、何が起きた？", {
        bg: "./bg/locations/2B_classKagami2Desks.webp",
      }),
      n("カイラが自分の机を俺の机に寄せ、俺の椅子の背に片手を置いていた。"),
      n("まだ彼女の方は見ない。"),
      n("向こうも何も言ってこない。クラスの連中もほとんど反応していない。"),
      n("彼女からはサクランボと煙草の匂いがする。俺は鏡に意識を向け続けた。"),
      nfx(
        "十五分ほど、授業は何事もなく進んだ。悪いことは何も起きない。それなのに、ずっと神経が張り詰めている……",
        {
          bg: "./bg/locations/2B_classKagami2Desks.webp",
        },
      ),
      n(
        "鎖につながれた生徒、教師の態度、ほかの生徒たち、そして空気そのもの。この学園のすべてが重くのしかかってくる。",
      ),
      n(
        "分かっている。あまりに異常な状況が続いて、調子を崩しているだけだ。今は考えないようにしよう。",
      ),
      nfx("!!!", m.psychoShake("ren"), m.sfx("fabric_rustle")),
      n("何かが俺の脚を滑っていく。"),
      n("机の下を見る。カイラ！"),
      nfx(
        "片方のスニーカーを脱ぎ、足で俺の脚を撫でている！",
        m.sfx("fabric_rustle"),
        {
          bg: "./bg/cg/prologue/2B_kaira_underDesk.webp",
        },
      ),
      n("ただ上下に動かしている。"),
      n("改めてよく見ると……やはり脚にぴったりと張りつく黒いナイロンタイツだ……"),
      nfx(
        "その上にはチェック柄のスカート。黒いTシャツが少し雑にスカートへ押し込まれている。",
        {
          bg: "./bg/common/2B_kairaObserve.webp",
        },
      ),
      nfx("そして最後に顔まで視線を上げると、真っすぐこちらを見つめていた……", {
        bg: "./bg/cg/prologue/2B_kairaSmile.webp",
        bgSpeed: 50,
      }),
      n("カイラが俺の耳元で囁く。"),

      say("kaira", "綺麗な脚、好きなの？　転入生。"),
      say("ren", "何してるんだ？"),
      say("kaira", "あんたの性癖を調べてるの、ばーか！"),
      n("授業中に？　俺は喜ぶべきなのか？"),
      n(
        "カイラは俺から離れる気などないらしい。こんなことを続けたら、みんなの注目を集めるだけだ！",
      ),
      nfx(
        "",
        "彼女の可愛い足がさらに上へ滑り、俺の太腿に乗った。",
        m.sfx("fabric_rustle"),
        { bg: "./bg/cg/prologue/2B_kairasFeet_tight.webp" },
      ),
      sf(
        "kaira",
        "いつまで黙ってるの～～～。何が好きなのか、早く教えてよ。ほら、何、何なの？！",
        m.psychoShake("kaira"),
      ),
      n("くそっ、どうして口を開けないんだ？"),
      n("カイラが腕を頭の後ろへ回し、脇を見せつけてくる。"),
      sf("kaira", "こういうのが好きだったりはしない？", {
        bg: "./bg/cg/prologue/2B_kairaArmpit.webp",
        bgSpeed: 50,
      }),
      say("kaira", "私の脇に擦りつけてみたい、とか？"),
      say(
        "kaira",
        "どうして私が一つ一つ聞き出さなきゃいけないの？　話したくないなら、もっと正直なものがあるでしょ。",
      ),
      nfx(
        "カイラが完全にこちらを向き、その小さな足をさらに高く上げる。今度は文字どおり、俺のちんこに触れている！",
        m.psychoShake("ren"),
      ),
      say("ren", "カイラ、やめろ！"),
      say("kaira", "あっ！　あっ！　あっ！　もう硬くなってる！！！"),
      n(
        "なんでそんなクソでかい声で言うんだよ？！　教室を見回すと、全員の視線を集めていた！",
      ),
      say(
        "kaira",
        "あら、心配しないで。誰もあんたを責めないって！　ちょっと確かめただけ、あはは！",
      ),

      sf(
        "kagami",
        "カイラ！",
        m.show("kagami", "angry", "center"),
        {
          bg: "./bg/locations/2B_classKagami2Desks.webp",
        },
        m.stopBgm(),
      ),
      n(
        "カイラはため息をつき、渋々少しだけ身体を離した。だが、可愛い足は俺の股間に乗せたままだ。",
      ),
      sf("kaira", "ごめんごめん。", m.hide("kagami")),
      sf("kaira", "でも、運命そのものがこの子を私の隣に座らせたんだよ。", {
        choices: [
          { text: "彼女の足を払いのける", next: "class_kaira_drop" },
          {
            text: "彼女の足を掴み、さらに強く押しつける",
            next: "class_kaira_grab",
          },
          { text: "彼女の図々しさを我慢する", next: "class_kaira_submit" },
        ],
      }),
    ],
  },

  class_kaira_drop: {
    lines: [
      nfx("彼女の足首を掴み、そのまま乱暴に払いのけた。", m.dominance(1)),
      say("ren", "やめろ。俺の上に足を置いていいなんて言ってない。"),
      nfx("カイラは、わざとらしく申し訳なさそうな顔で俺を見た。", {
        bg: "./bg/cg/prologue/2B_kairaGuilt.webp",
        bgSpeed: 50,
      }),
      say("kaira", "私……今が授業中なの、本当に残念。そう思わない？"),
      nfx("カイラはゆっくり席を立った。", {
        bg: "./bg/locations/2B_classKagami2Desks.webp",
      }),
      say("kaira", "すみませ～ん、ちょっと外に出ます～～～"),
      nfx(
        "そう言って、廊下へ飛び出していった。",
        {
          bg: "./bg/locations/2B_classKagami2Desks.webp",
        },
        m.sfx("light_walking"),
      ),
      say("kagami", "また許可を取らずに出ていきましたね。"),
      nfx(
        "カイラはそれから五分経っても戻らない。机の横には空の椅子、机の上には開いたままの筆箱。",
        {
          bg: "./bg/common/2B_kairasDesk.webp",
        },
      ),
      n("中を漁る勇気はないが、小さな青い袋が見える。コンドームか？"),
      n(
        "驚きはしない。あんな女子が、こんな学校にいるんだ……ほかに何を期待しろっていうんだ？",
      ),
      n("さらに五分が過ぎ、ようやくドアが開いた。"),
      nfx(
        "カイラが戻ってきた。髪は少し濡れ、満足そうでありながら疲れ切った顔をしている。",
        {
          bg: "./bg/cg/prologue/2B_kairaWet.webp",
          bgSpeed: 50,
        },
        m.sfx("light_walking"),
      ),
      n("その後は何事もなかったように静かに座り、俺を見ることもなかった。"),
      n("石鹸と、何か甘い匂いがする。机も元の位置へ戻してくれればいいのに。"),
      n("やがて授業が終わった。"),
    ],
    next: "class_lesson_1_end",
  },

  class_kaira_grab: {
    lines: [
      nfx(
        "もらえるものは、もらっておけ。この理屈に間違いはないよな？",
        m.stats({ dominance: 1, sanity: -2 }),
      ),
      nfx(
        "カイラの小さな足を掴み、硬くなったちんこへ強く押しつけた。",
        {
          bg: "./bg/cg/prologue/2B_kairasFeet_grab.webp",
        },
        m.sfx("fabric_rustle"),
      ),
      n("彼女がつま先で俺を弄んでいるのが分かる。"),
      n("カイラはすでに息を荒らげ、顔を赤くしていた。"),
      say("kaira", "ちゃんと度胸もあるんだ。楽しみなよ。"),
      n(
        "このまま授業が終わるまで勃ちっぱなしになるかもしれない。これからどうすればいい？",
      ),
      n("欲望が膨らんでいく。くそっ、もちろん、この可愛い足を犯してみたい。"),
      n("だが、ここは教室だ。こんな場所で始めるほど、俺は堕ちていない。"),
      nfx("結局、俺は彼女の足を放した。カイラも素直に引っ込めた。", {
        bg: "./bg/locations/2B_classKagami2Desks.webp",
      }),
      say("kaira", "口だけ？"),
      n(
        "何も答えなかった。カイラは机を戻さないまま、残りの授業中ずっと椅子の上でもじもじしていた。",
      ),
    ],
    next: "class_lesson_1_end",
  },

  class_kaira_submit: {
    lines: [
      nfx(
        "分かった……見ているだけにしよう。",
        m.stats({ dominance: -1, sanity: -2 }),
      ),
      n("俺は何もしなかった。"),
      nfx(
        "時間だけが過ぎていく。彼女の可愛い足は俺の上に、顔は平静なまま、俺のちんこは臨戦態勢のまま。",
        {
          bg: "./bg/cg/prologue/2B_kairasFeet_groin.webp",
        },
      ),
      n("こうして、この学園での最初の授業が終わった。"),
    ],
    next: "class_lesson_1_end",
  },

  class_lesson_1_end: {
    lines: () => [
      sf(
        "kagami",
        "では、授業を終える前に……初日から、理由もなくレンに手を出してはいけません。",
        {
          bg: "./bg/locations/2B_classKagami2Desks.webp",
        },
        m.show("kagami", "neutral", "center"),
      ),
      say("kagami", "転入生が慣れるまで、少しは時間を与えなさい。"),
      n("教室は完全に静まり返った。"),
      sf(
        "kagami",
        "全員、理解しましたか？",
        m.show("kagami", "neutral2", "center"),
      ),
      say("yukino", "はい！　鏡先生！"),
      sf("kagami", "……授業を終わります。", m.hide("kagami")),

      nfx(
        "どうやら、その言葉が生徒たちを席から解放する合図だったらしい。",
        m.fx({ darkness: 1, duration: 500 }),
        m.audioMix(
          m.bgm("Freaking out with my best Enimes", 0.6),
          m.sfx("crowd_walking"),
        ),
      ),
      nfx(
        "なぜ分かったか？　突然、身体を揺さぶられたからだ。",
        m.psychoShake("ren"),
      ),
      n("数人がすぐさま俺を半円状に取り囲んだ。"),

      nfx(
        "そのうちの一人、眼鏡の女子が俺の襟を掴もうとする。",
        m.fx({ darkness: 0, duration: 500 }),
        {
          bg: "./bg/common/2B_pupilSurround.webp",
        },
      ),
      n("身体が強張り、反撃しようと身構える……"),

      nfx(
        "だが、カイラの方が速く、眼鏡の女子の手首を掴んだ。",
        m.show("kaira", "intresting", "right", "slideInRight"),
        m.sfx("clothes_grab"),
      ),
      say(
        "kaira",
        "あらあら。鏡の話、聞いてなかったの？　今日は転入生を痛めつけちゃ駄目でしょ。",
      ),
      n("カイラは眼鏡の女子の手首を掴んだままだ。"),
      sf(
        "akane",
        "転入生。このクラスに学期の途中で新しい生徒が放り込まれたことなんて、私の知る限り一度もない……",
        m.show("akane", "angry", "center", "slideInLeft"),
      ),
      say("akane", "だったら、お前は一体どこから来たの？！"),
      say("akane", "お前は誰？　誰なの？！"),
      n("くそっ、こいつは何なんだ？！"),

      sf(
        "yukino",
        "違う、それは一番大事な質問じゃない！　今やるべきなのは、転入生にこの学園――このクラスの規則を教えること！",
        m.show("yukino", "objection", "left", "slideInLeft"),
      ),
      say("yukino", "そして、その規則に従わせること！"),
      sf(
        "akane",
        "もし、こいつが送り込まれたんだとしたら？！　もし……もし《外》から来たんだとしたら？",
        m.show("akane", "suspect", "center"),
      ),
      n("何だって？　どこから？"),

      say(
        "livia",
        "勝手なことを言わないで、アカネ。もう存在しない。そんなことはありえない。",
      ),
      sf(
        "akane",
        "こいつが《生存者》よ！！",
        m.show("akane", "angry", "center"),
      ),
      sf(
        "aiden",
        "黙れ。",
        {
          bg: "./bg/common/2B_eyden.webp",
        },
        m.hideAll(),
        m.stopBgm(100),
      ),
      n("その声は大きいのに、妙に落ち着いていた。"),
      n("声の主は、白髪の男子生徒だった。"),
      n("それにしても、こいつ……ずいぶんと優男っぽい顔をしている。"),
      n(
        "全員を完全に黙らせたわけではないが、少なくとも眼鏡の女子は叫ぶのをやめた。",
      ),
      n("カイラがようやく彼女の手首を放す。"),
      say("yukino", "何？　どうして急に口を挟んだの？"),
      sf(
        "livia",
        "あっ、見て！",
        m.show("livia", "palm", "center", "slideInRight"),
      ),
      nfx(
        "女子が、一人の生徒を指差した。",
        {
          bg: "./bg/common/2B_mia.webp",
        },
        m.hide("livia"),
      ),
      n("可愛らしい服を着た、小柄なピンク色の髪の女子だ。"),
      n(
        "体つきだけを見れば、同い年とは思えない。分厚い本の陰に隠れていて、顔も見えなかった。",
      ),
      n("ただ一つ、はっきり分かる。震えている。"),
      sf(
        "yukino",
        "そうか。俺たちが怖がらせたのか……",
        m.show("yukino", "think", "left"),
        {
          bg: "./bg/common/2B_pupilSurround.webp",
        },
      ),
      n("眼鏡の女子が、今度はずっと小さな声で口を開く。"),
      sf(
        "akane",
        "この子のために、こんな野良を放っておけっていうの？　決めた。今日からあんたの正式な名前は『野良』よ！",
        m.show("akane", "humble", "center"),
      ),
      sf(
        "livia",
        "私はそんなふうに呼ばない！",
        m.show("livia", "angry", "right"),
      ),
      say("akane", "少なくとも、私の中では正式名称よ。"),
      n("こんなクソみたいな騒ぎは、もう見ていたくない。"),
      nfx(
        "みんなが気を取られている間に、カイラへ小声で話しかけた。",
        {
          bg: "./bg/cg/prologue/2B_kairaSerious.webp",
          bgSpeed: 50,
        },
        m.hideAll(),
      ),
      say("ren", "出してくれないか？　少し外の空気を吸いたい……"),
      say("kaira", "この私に立てって言うの？"),
      say("kaira", "私のお尻が見たい？"),
      sf("kaira", "スカート越しじゃあまり見えないけど。めくってあげようか？", {
        bg: "./bg/cg/prologue/2B_kairaEmbressed.webp",
        bgSpeed: 50,
      }),
      say("ren", "頼む、カイラ。手遅れになる前に出してくれ。"),
      say("kaira", "仕方ないなあ。特別に許してあげる。"),
      nfx(
        "カイラが席を立ち、俺は彼女の側から席を抜け出した。",
        m.fx({ darkness: 1, duration: 500 }),
        m.sfx("chair_sitting"),
      ),
      nfx(
        "言い争う女子たちは俺に気づかず、そのまま廊下へ抜け出せた。",
        m.fx({ darkness: 0, duration: 500 }),
        {
          bg: "./bg/locations/2floorDay.webp",
        },
        m.bgm("A Morning Where Nothing Happens", 0.5),
      ),
      n("今ほしいものは水だけだ。"),
      n("どこへ行けばいいのか分からないが、壁に案内表示が見えた。"),
      nfx(
        "矢印に従って進み、自動販売機を見つけた。",
        {
          bg: "./bg/locations/vending_machine.webp",
        },
        m.sfx("vending_machine", 0.8, true),
      ),

      n("水、一リットル――10ポイント……"),
      n("スマホには残高が表示されている。"),
      n("今の残高は100SP（神州ポイント）。これが学園内の通貨なのか？"),
      nfx(
        "自動販売機で水を選び、決済端末にスマホをかざした。",
        m.sp(-10),
        m.sfx("ven_battle"),
      ),
      n("決済完了――水が出てきた。"),
      n("水を飲んでいないのは一時間ほどだが、もっと長く感じる。"),
      nfx("自動販売機の隣の壁にもたれた……", {
        bg: "./bg/locations/closeTo_vending_machine.webp",
      }),
      n(
        "すべてを整理して考えなければ。頭の中が、果てしない思考の海に沈んでいる。",
      ),
      n(
        "いや、海どころか大洋だ。この数時間、考えてばかりいる……まるで哲学者だな……",
      ),

      ...(!getFlag("quizPassed")
        ? [
            n("つまり、昨日みたいに足を舐めることは、ここでは日常なのか？"),
            n("なら、この先はどうなる？"),
            n("こいつらに命じられるまま、何でも舐めることになるのか？"),
            n("まあ……少し興奮するかもしれない。"),
          ]
        : []),
      n("生徒たちは、俺にほとんど注意を払わず通り過ぎていく。"),

      nfx("授業開始のチャイムが鳴った。", m.sfx("school_bell")),
      say("ren", "んぐっ……"),
      n("駄目だ。この場所では、落ち着いて考える時間すらない。"),
      nfx(
        "ゆっくり教室へ戻った。ほとんどの生徒はすでに席についている。",
        {
          bg: "./bg/locations/2B_classRecess.webp",
        },
        m.audioMix(m.sfx("walking"), m.stopSfx("vending_machine"), m.stopBgm()),
      ),
      n("特に眼鏡の女子が、訝しげにこちらを横目で見ていた。"),
      nfx(
        "自分の席に座る。カイラはまだ戻っていない。",
        {
          bg: "./bg/locations/2B_classRecess_noteHole.webp",
        },
        m.sfx("chair_sitting"),
      ),
      n("だが、ノートには……穴が開いていた。全ページを貫く穴だ。"),
      n("直径から考えると、ペンか鉛筆を突き刺したらしい。"),
      n("カイラが小さく笑いながら教室へ入り、俺の隣に座った。"),
      sf("ren", "これ、お前がやったんじゃないよな？", {
        bg: "./bg/cg/prologue/2B_kairaEmbressed.webp",
        bgSpeed: 50,
      }),
      say(
        "kaira",
        "私？　証拠もないのに疑わないでよ、レン！　それで、何の話？",
      ),
      say("ren", "俺のノートだ。全ページに穴が開いてる。"),
      say("kaira", "あっ！　それはアカネだよ！"),
      say("kaira", "安心して。学級委員がもうお仕置きしたから！"),
      n("罰？　どうやって？"),

      sf(
        "mat_teacher",
        "やあ、子供たち。",
        {
          bg: "./bg/locations/2B_class2Desks.webp",
        },
        m.sfx("door_close"),
      ),
      n("新しい教師が入ってきた。次は数学だったはずだ。"),
      n("ノートも新しいものに替えた。平穏な授業を迎える準備は万全だ。"),
    ],
    next: "class_lesson_2_start",
  },

  // ============================================
  // === 二時限目：カイラとストッキング ===
  // ============================================
  class_lesson_2_start: {
    lines: [
      n("カイラ……また俺にちょっかいを出してみろ。"),
      n("数学の授業が始まった。今度こそ祈りが天に届くと信じたい。"),
      n("五分。"),
      n("十分。"),
      n("十五分。"),
      n("何事もない。教師の話に集中することさえできている。"),

      say("kaira", "ふん、ふん、ふん、ふふふ。"),
      n("彼女が小さく笑う。"),
      n("カイラ、またかよ。席を替わる方法を探させないでくれ。"),
      n("ただし、これは心の中じゃなく、声に出して言わなきゃ意味がない。"),
      sf("kaira", "ねえ、レン。ストッキングは何色が一番好き？", {
        bg: "./bg/cg/prologue/2B_kairaSmile.webp",
        bgSpeed: 50,
      }),
      say("ren", "どうしてそんなことを聞く？"),
      say(
        "kaira",
        "ほら、新しい服を揃えてるんだけど、ストッキングの色が決まらなくてさ……",
      ),
      say(
        "kaira",
        "それで、あんたみたいな可愛い子はどんな色が好きなのかなって。",
      ),

      n("カイラのミントの香りがする息が顔にかかる。"),
      n("どうやら授業中にガムを噛んでいるらしい。"),
      sf("ren", "そうだな……", {
        choices: [
          { text: "黒", next: "class_kaira_thighs_black" },
          { text: "肌色", next: "class_kaira_thighs_nude" },
          { text: "白", next: "class_kaira_thighs_white" },
          { text: "赤", next: "class_kaira_thighs_red" },
          { text: "特にない", next: "class_kaira_thighs_none" },
        ],
      }),
    ],
  },

  class_kaira_thighs_black: {
    lines: [
      sf(
        "kaira",
        "へえ、へえ。いい趣味してるじゃん、レン。というか、定番だね。",
        {
          action: () => setFlag("favoriteThighsBlack"),
        },
      ),
      nfx("カイラは笑みを浮かべたままだ。", {
        bg: "./bg/cg/prologue/2B_kairaSmirk.webp",
        bgSpeed: 50,
      }),
      say(
        "kaira",
        "そういうのをちんこに被せて、思い切りシコるのが夢だったりして？",
      ),
      say("kaira", "女の子の可愛い脚が入ってたばかりのやつでね。そうでしょ？"),
      n("お前に性癖を打ち明けるつもりはない、この変態女。"),
    ],
    next: "class_kaira_phone",
  },

  class_kaira_thighs_nude: {
    lines: [
      sf("kaira", "脚の肌に溶け込むようなストッキングが好きなの？", {
        action: () => setFlag("favoriteThighsNude"),
      }),
      nfx("カイラは笑みを浮かべたままだ。", {
        bg: "./bg/cg/prologue/2B_kairaSmirk.webp",
        bgSpeed: 50,
      }),
      say(
        "kaira",
        "そういうのをちんこに被せて、思い切りシコるのが夢だったりして？",
      ),
      say("kaira", "女の子の可愛い脚が入ってたばかりのやつでね。そうでしょ？"),
      n("お前に性癖を打ち明けるつもりはない、この変態女。"),
    ],
    next: "class_kaira_phone",
  },

  class_kaira_thighs_white: {
    lines: [
      sf("kaira", "白いやつ？", {
        action: () => setFlag("favoriteThighsWhite"),
      }),
      sf("kaira", "うん、私も好き。", {
        bg: "./bg/cg/prologue/2B_kairaSmirk.webp",
        bgSpeed: 50,
      }),
      say("kaira", "なるほど、なるほど。面白いね。"),
      say(
        "kaira",
        "そういうのをちんこに被せて、思い切りシコるのが夢だったりして？",
      ),
      say("kaira", "女の子の可愛い脚が入ってたばかりのやつでね。そうでしょ？"),
      n("お前に性癖を打ち明けるつもりはない、この変態女。"),
    ],
    next: "class_kaira_phone",
  },

  class_kaira_thighs_red: {
    lines: [
      sf("kaira", "あまり普通の選択じゃないね。", {
        action: () => setFlag("favoriteThighsRed"),
      }),
      sf(
        "kaira",
        "どうやら、ちょっと特殊な趣味をお持ちみたいだね、変態さん～～",
        {
          bg: "./bg/cg/prologue/2B_kairaSmirk.webp",
          bgSpeed: 50,
        },
      ),
      say("kaira", "なるほど、なるほど。面白いね。"),
      say(
        "kaira",
        "そういうのをちんこに被せて、思い切りシコるのが夢だったりして？",
      ),
      say("kaira", "女の子の可愛い脚が入ってたばかりのやつでね。そうでしょ？"),
      n("お前に性癖を打ち明けるつもりはない、この変態女。"),
    ],
    next: "class_kaira_phone",
  },

  class_kaira_thighs_none: {
    lines: [
      sf(
        "kaira",
        "なんてひど～～い選択～～",
        { action: () => setFlag("favoriteThighsNone") },
        {
          bg: "./bg/cg/prologue/2B_kairaSmirk.webp",
          bgSpeed: 50,
        },
      ),
      say("kaira", "つまんない。"),
    ],
    next: "class_kaira_phone",
  },

  class_kaira_phone: {
    lines: [
      nfx(
        "カイラが机の下でスマホを見せてくる。",
        {
          bg: "./bg/common/2B_kairaPhone.webp",
        },
        m.sfx("fabric_rustle"),
      ),
      n("俺のものと同じ機種らしいが、彼女のスマホにはケースがついている。"),
      n("画面には下着が映っていた……"),
      say("kaira", "1,100ポイント。"),
      say(
        "kaira",
        "それだけ貸してくれたりしない？　ちゃーんと、たっぷりお礼してあげるから。",
      ),
      say("ren", "そんなに持ってない。転入したばかりだぞ。"),
      sf("kaira", "あっ、そっか……", {
        bg: "./bg/cg/prologue/2B_kairaSmirk.webp",
        bgSpeed: 50,
      }),
      say("kaira", "Dランクだもんね。期待しすぎてごめんね～～"),
      n("なんでわざわざ俺をからかうんだ？"),
      nfx("それから数分は平穏に過ぎた。", {
        bg: "./bg/locations/2B_class2Desks.webp",
      }),
      n(
        "だが、カイラという人間は、どうやらじっと座っていることができないらしい。",
      ),
      nfx(
        "突然、彼女の手が俺の太腿に置かれた。",
        m.psychoShake("ren"),
        m.audioMix(m.sfx("fabric_rustle"), m.bgm("Torn nylon", 0.6)),
      ),
      say(
        "kaira",
        "レン、最初の授業からずっと緊張してるの、分かってるよ。私の悪戯が忘れられない？",
      ),
      say("kaira", "手伝ってあげよっか？"),

      nfx(
        "彼女は余計な音を立てないよう、ゆっくり俺のズボンのファスナーを下ろし始めた。",
        m.sfx("zip"),
      ),
      say("kaira", "ほら。やってる間、何か面白いものも見たくない？"),
      nfx(
        "カイラがスカートを持ち上げ、タイツを引き下げる。黒いパンツが露わになった。",
        {
          bg: "./bg/cg/prologue/2B_kairaPanties.webp",
        },
        m.sfx("fabric_rustle"),
        { dialogStyle: "transparent" },
      ),
      n("俺たちの肩が触れ合う。"),
      n("彼女の息がだんだん荒くなるのが聞こえる。"),
      n("彼女の手が本当に下着の中へ入り、俺のちんこを握り込んだ！"),
      n("指が俺を包み込む。もう硬くなっている……"),
      nfx(
        "親指で亀頭をなぞって先走りを塗り広げ、根元を握ると、先端近くまでゆっくり手を滑らせる。",
        m.sfx("masturbation_slow", 1, true),
      ),
      say("ren", "あぐっ……"),
      sf("kaira", "静かに。見つかりたくないでしょ。", {
        bg: "./bg/cg/prologue/2B_kairaMasturbate.webp",
        bgSpeed: 50,
      }),
      n("少しでも周りを気にしている奴なら、絶対に俺たちに気づく！"),
      n("教師の声しか響かない静かな教室で、俺たちは衣擦れの音を立てている。"),
      n("止めるべきなのに、これ……これ……死ぬほど気持ちいい……"),
      n("温かく柔らかい手が、絶妙な強さで俺を握っている。"),
      n("どうして、こんなに上手いんだ？"),
      n("ありえない。俺が自分でやるのと同じくらい上手い……"),
      n(
        "女子の手の温もりと、こんな場所でやっているという背徳感が、快感をさらに強くする。",
      ),
      n(
        "思考が快感に呑まれていく。彼女のパンツから目を逸らせない。歯でずらし、その脚の間へ顔を埋めたい。",
      ),
      sf("ren", "カイラ、くそっ……", {
        choices: [
          {
            text: "抵抗をやめる",
            next: "class_kaira_handjob_climax",
          },
          {
            text: "彼女を止める",
            req: { dominance: { min: 0 } },
            next: "class_kaira_handjob_resist",
          },
        ],
      }),
    ],
  },

  class_kaira_handjob_resist: {
    lines: [
      nfx(
        "だが、みんなの前でこんなに簡単に屈するわけにはいかない！",
        m.dominance(1),
      ),
      n("カイラの腕を掴み、引き離そうとする。"),
      say("kaira", "ん～～～？"),
      say("kaira", "あはは。"),
      say("kaira", "やめてほしいの？"),
      say("ren", "ああ、もう十分だ！"),
      n("今度は両手を使って、彼女を押し戻そうとする。"),
      n("どこにこんな力があるんだ？！"),
      say("kaira", "レ～～ン、私にシコられるの、気持ちよくない？"),
      n("甘えるような声で言いながら、その一方で……"),
      n("空いている手で俺の手首を掴み、痛いところを強く押した。"),
      nfx("もう片方の手では、痛みを感じるほど強くちんこを握り込む。", {
        bg: "./bg/cg/prologue/2B_collage.webp",
      }),
      nfx(
        "ちんこの快感と手首の痛みが混ざり合い、身体が動かなくなった。",
        m.psychoShake("ren"),
      ),
      say("ren", "めぇっ！"),
      n("くそっ！"),
      nfx(
        "思ったより大きな声が出た。教室中に聞こえたに違いない！",
        m.sanity(-3),
      ),
      sf("mat_teacher", "おい！　お前、名前は何だった？", {
        bg: "./bg/locations/2B_class2Desks.webp",
      }),
      say("mat_teacher", "静かにしなよ。"),
      n("小さく頷き、カイラを見る。"),
      sf("kaira", "あれ、痛すぎる？　それとも気持ちよすぎる？", {
        bg: "./bg/cg/prologue/2B_collage.webp",
      }),
      say("kaira", "もしかして両方？！"),
      n("このクソ女……どうして止められないんだ？"),
    ],
    next: "class_kaira_handjob_climax",
  },

  class_kaira_handjob_climax: {
    lines: [
      sf("ren", "うぐっ……くっ……", {
        bg: "./bg/cg/prologue/2B_collage.webp",
      }),
      say("kaira", "んふっ、ふふふ。"),
      nfx(
        "くそっ、速くなった！",
        m.audioMix(
          m.stopSfx("masturbation_slow"),
          m.sfx("masturbation_fast", 1, true),
        ),
      ),
      n("彼女の手の中で、ちんこが脈打つ。"),
      n("カイラの肩に身体を預け……好きにさせる。"),
      n(
        "二人の間に性の匂いが漂う。彼女の濡れた匂いと、俺の汗が混ざり合っていた。",
      ),
      n("もう駄目だ。あと数秒で……！"),
      nfx("!!!!", m.orgasmFlash(300), m.sfx("climax", 0.5)),
      nfx(
        "!!...",
        m.audioMix(
          m.stopSfx("masturbation_fast"),
          m.sfx("masturbation_slow", 1, true),
        ),
      ),
      n("..."),

      nfx(
        "奇跡的に声を漏らさず、カイラの柔らかな手に熱い精液を放った。",
        m.sanity(-2),
        m.fx({ darkness: 0.3, duration: 500 }),
      ),
      n(
        "彼女はすぐには止めない。ゆっくり搾り続け、最後の一滴まで俺から絞り出す。",
      ),
      nfx(
        "カイラは精液まみれの手をゆっくり引き抜いた。",
        {
          bg: "./bg/cg/prologue/2B_kairaCum.webp",
          bgSpeed: 50,
        },
        m.orgasmRelease(),
        m.stopSfx("masturbation_slow"),
      ),
      n("嫌がると思っていた。だが、反応は正反対だった。"),
      n("..."),
      n("彼女は指を一本ずつ舐め始める。"),
      say("kaira", "ん、ん、ん……もう少し味わってみよっと。"),
      n("..."),
      say("kaira", "普通かな。いつもより少し塩辛い。"),
      say(
        "kaira",
        "百点満点なら67点。まずくはないけど、天国ってほどでもないね。",
      ),
      say("kaira", "たまにつまむなら悪くないけど、毎日は要らないかな。"),
      nfx(
        "まだ今日の二時限目だ。",
        {
          bg: "./bg/locations/2B_class2Desks.webp",
        },
        m.stopBgm(),
        { dialogStyle: "normal" },
      ),
      n("そして、俺の語彙は完全に尽きた。"),
      n("興奮が引いていき、代わりに苛立ちが湧いてくる。"),

      say("kaira", "はい、おしまい。ごちそうさま！"),
      say("kaira", "それと、ファスナー閉めて。もう手は入れてあげないから。"),
      say("kaira", "今のところはね。"),
      nfx("言われたとおりにした。", m.sfx("zip")),
      nfx("パンツの中はべたべただ。", m.sanity(-2)),
      n("言いたいことは山ほどあるが、休み時間まで待つしかない。"),
      n("ズボンに染みができず、変な匂いもしないよう祈ることしかできない。"),
      nfx(
        "その後は新たな災難もなく、授業が長々と続いた。",
        m.fx({ darkness: 1, duration: 500 }),
      ),
      nfx(
        "チャイムが鳴った瞬間、俺は教室を飛び出し、トイレへ急いだ。",
        m.sfx("school_bell"),
      ),
      nfx(
        "ふうううっ……",
        {
          bg: "./bg/common/batrhroom_ren.webp",
        },
        m.fx({ darkness: 0, duration: 500 }),
        m.sfx("water_splash"),
      ),
      n("何をどう考えればいいのかすら分からない。"),
      n("人前で誰かとこんな性的なことをしたのは初めてだ。"),
      n("自分の精液が、他人の手についているのを見たのも初めてだった。"),
      n("まともじゃない。でも……何とも言えない体験だった。"),
      nfx("小便がしたい。", m.fx({ darkness: 1, duration: 500 })),
      n("..."),
      n("..."),
      nfx(
        "トイレを出ると、廊下に一人でスマホを見ているカイラがいた。",
        {
          bg: "./bg/locations/2floor_ver2.webp",
        },
        m.fx({ darkness: 0, duration: 500 }),
        m.sfx("walking"),
      ),
      n("今のうちに話しかけよう。"),
      sf(
        "ren",
        "カイラ……",
        m.show("kaira", "neutral", "center"),
        m.bgm("Bass solo", 0.6),
      ),
      say("ren", "き……教室で何しやがったんだ？"),
      sf(
        "kaira",
        "んん？　ちょっと試料を採って、味見しただけ。",
        m.show("kaira", "intresting", "center"),
      ),
      say("kaira", "今のところ、普通かな。"),
      say("kaira", "静かにやったんだから、誰にも気づかれてないよ。"),
      say("ren", "俺には全員にバレてたようにしか思えない！"),
      say("ren", "どうして教室なんだ？　別の時まで待てなかったのか？"),
      sf("kaira", "うん、待てなかった。", m.show("kaira", "neutral", "center")),
      say(
        "kaira",
        "プレゼントを開けるのが待ちきれなくて、その場で包装を破っちゃうのと同じ！",
      ),
      sf("kaira", "あははは！", m.show("kaira", "laugh", "center")),
      say(
        "kaira",
        "もう、レンちゃん。そんなに恥ずかしがらなくてもいいでしょ？",
      ),
      say("kaira", "それとも……童貞なの？"),
      say("ren", "だったら何だ？"),
      sf("kaira", "おやおやおや。", m.show("kaira", "intresting", "center")),
      say("kaira", "それ、もう少し小さな声で認めた方がいいかもね……"),
      say(
        "kaira",
        "別に守ってあげたいわけじゃないけど、お姉ちゃんから一つ助言……",
      ),
      say("kaira", "高ランクの女子には絶対に言わないこと。"),
      say("ren", "どうして？"),
      sf(
        "kaira",
        "いいから、私の言うことを聞いて。それだけ覚えておけばいい！",
        m.show("kaira", "neutral", "center"),
      ),
      say("kaira", "私があんたに悪い助言をしたこと、ある？"),
      n("助言自体、今まで一つもしてないだろ。"),
      n("カイラは間違いなく変人だ。野生動物みたいな女。"),
      n("だが、こいつみたいな女なら、セックスまでいけるんじゃないか？"),
      n("もう手で抜いてくれた。もっと先へ進めるかもしれない。"),
      say("ren", "なあ、学園の中を案内してくれないか？"),
      sf(
        "kaira",
        "レン、私は案内係じゃないよ。でも、ごちそうしてもらったし……",
        m.show("kaira", "intresting", "center"),
      ),
      say("kaira", "面白い場所を一つ見せてあげよっか？"),
      say("kaira", "怖がって近づかない人も多いところ。"),
      say("ren", "どんな場所だ？　危険なのか？"),
      nfx("カイラが俺の手を掴み、引っ張っていく。", m.hideAll()),
      sf(
        "kaira",
        "この学園はどこだって危険だよ！　でも私が一緒だから、怖がらないで。",
        {
          bg: "./bg/cg/prologue/kaira_ren.webp",
        },
        m.sfx("crowd_walking"),
      ),
      nfx("その声にはまだ興奮が残っているように聞こえた。", m.stopBgm()),
      n("おとなしく彼女についていく。後悔するかどうかは、すぐ分かるだろう。"),
      n(
        "そういえば、今握っているのは、さっき俺を触っていた方の手だ。もう綺麗になっている。",
      ),
      n("三分ほど歩き、ようやく辿り着いたのは……"),
      nfx("壁にはめ込まれた金属製のドア。", {
        bg: "./bg/locations/death_enterance.webp",
      }),
    ],
    next: "yuno_room_enter",
  },

  // ============================================
  // === 死に娘との出会い ===
  // ============================================
  yuno_room_enter: {
    lines: [
      nfx("カイラが楽しそうにノックする。", m.sfx("knock")),
      nfx(
        "十五秒ほどすると、俺たちと同じくらいの年頃に見える女子が小窓から顔を覗かせた。",
        m.sfx("window_open"),
        {
          bg: "./bg/cg/prologue/death_open.webp",
        },
        { dialogStyle: "transparent" },
      ),
      n("乱れた髪。ベルトのついた白いドレス。"),
      n(
        "部屋の壁は大きな白いクッションで覆われている。まるで精神病棟の隔離室だ。",
      ),
      n("だが、眠り、身体を洗い、暇を潰すためのものはすべて揃っていた。"),
      n("壁に埋め込まれた大型テレビとソファまである。どれも高そうだ。"),
      sf(
        "death",
        "やっほー、カーイーラー！！！",
        {
          bg: "./bg/cg/prologue/death_greeting.webp",
          bgSpeed: 50,
        },
        m.bgm("Ima Doomed Girl or DEATH!!!!", 0.7),
      ),
      say("death", "元気にしてた？？"),
      sf(
        "kaira",
        "久しぶり。今日は会わせたい子を連れてきたよ。",
        m.show("kaira", "neutral", "center", "slideInRight"),
      ),
      say("kaira", "転入生。入学したばかりで、今日が初日。"),
      say("kaira", "経験豊富なあんたから、助言とか熱い演説とかしてあげてよ。"),

      say("death", "もちろん！！！"),
      say("death", "おっぱいを窓からどけて！　その子を見せて！！！"),
      nfx(
        "カイラが横へ退き、壁にもたれる。俺はドアの正面へ立った。",
        m.show("kaira", "intresting", "right"),
      ),
      say("kaira", "ほら、鏡に教わったとおりに自己紹介して。"),
      m.choice(
        {
          text: "Dランク、天野レン",
          next: "yuno_intro_correct",
        },
        {
          text: "天野レン、Dランク",
          effects: { rank_score: -2, sanity: -1 },
          next: "yuno_intro_wrong1",
        },
        {
          text: "天野レン",
          effects: { rank_score: -3, sanity: -2 },
          next: "yuno_intro_wrong2",
        },
      ),
    ],
  },
  yuno_intro_correct: {
    lines: [
      say("ren", "Dランク、天野レンです。よろしくお願いします。"),

      sf("death", "まあ、まあ、まあ！！！　なんて礼儀正しい男の子！", {
        bg: "./bg/cg/prologue/death_like.webp",
        bgSpeed: 50,
      }),

      say(
        "kaira",
        "次からは、ランクの後に2-B組ってクラスも言うのを忘れないでね。",
      ),
    ],
    next: "yuno_intro_continue",
  },

  yuno_intro_wrong1: {
    lines: [
      say("ren", "天野レン、Dランク"),

      sf(
        "kaira",
        "ランクが先だよ、レン。",
        m.show("kaira", "neutral", "right"),
      ),

      sf("death", "ああっ、大丈夫！　転入したばかりなんだから！", {
        bg: "./bg/cg/prologue/death_like.webp",
        bgSpeed: 50,
      }),

      say(
        "kaira",
        "それと、ランクの後に2-B組って付けるのも忘れないで。必要になる時もあるから。",
      ),
    ],
    next: "yuno_intro_continue",
  },

  yuno_intro_wrong2: {
    lines: [
      say("ren", "天野レン。"),

      sf(
        "kaira",
        "……金魚並みの記憶力なの？",
        m.show("kaira", "neutral", "right"),
      ),

      say("kaira", "いい？　こうやるの。Bランク、2-B組、カイラ・ヴェルト！"),
      say("kaira", "やってみて！"),

      say("ren", "ちっ、分かったよ。"),

      say("ren", "Dランク、2-B組、天野レン。"),

      sf("death", "そう、それで完璧！", {
        bg: "./bg/cg/prologue/death_like.webp",
        bgSpeed: 50,
      }),
    ],
    next: "yuno_intro_continue",
  },

  yuno_intro_continue: {
    lines: [
      sf(
        "death",
        "私はAランク、2-T組、死に娘か、死か！",
        {
          bg: "./bg/cg/prologue/death_speaking.webp",
          bgSpeed: 50,
        },
        { action: () => setFlag("knowsDeath") },
      ),
      say("ren", "は？"),
      say("death", "聞こえなかったの？！"),
      say("death", "死に娘か、死か！　そう、本当にそれが私の名前！"),
      n("また完全にイカれた女子か……"),
      sf(
        "kaira",
        "そのイカれた名前は、こいつが自分で名乗り始めたの。",
        m.show("kaira", "neutral", "right"),
      ),
      say(
        "kaira",
        "本名を知る者がごくわずかしかいない、数少ない生徒の一人だよ。",
      ),
      say("death", "これが私の本名だってば！"),
      say("death", "私は死の化身！"),
      say("death", "欲望の化身！"),
      say("death", "私は死に娘か、死か！！！"),
      n("闇が深い。"),
      say(
        "ren",
        "それと、お前のクラスだけど、普通はA、B、C、Dの四つじゃないのか？　T組なんてどこから出てきた？",
      ),
      say(
        "kaira",
        "あそこは特別な事情を抱えた生徒のためのクラス。実際に存在するけど、専用教室があるわけじゃないから、普通に歩いていても見つからないよ。",
      ),
      n("分かった。そういうことにしておこう……"),
      say("ren", "あの、どうしてこの部屋に閉じ込められてるんだ？"),
      say(
        "death",
        "閉じ込められてる？　違う違う！　誰も私を閉じ込めてないよ！",
      ),

      say("death", "私はここに住んでるの！"),
      say("kaira", "外へ出してもらえるのは、大半の生徒が学園を出た後だけ。"),
      say("kaira", "一人で学園の外へ出ることも禁止されてる。"),
      say("ren", "なぜ？"),
      say(
        "kaira",
        "みんなと普通の授業を受けさせるには危険すぎる、って判断されたから。",
      ),
      say("death", "そうそう！！　そのとおり！"),
      sf(
        "death",
        "ああっ、誤解しないでね。危険っていっても、近づいた瞬間に君を八つ裂きにするわけじゃないよ。私、完全に頭がおかしいわけじゃないから！",
        {
          bg: "./bg/cg/prologue/death_warning.webp",
          bgSpeed: 50,
        },
      ),
      say(
        "death",
        "カイラちゃんが言ったでしょ。大半の生肉が学園から出たら、私も外へ出してもらえるの！",
      ),
      say(
        "death",
        "毎日ちゃんと人と接してるけど、まだ誰も殺してないし、手足も切ってない！",
      ),

      say(
        "kaira",
        "それも本当。この子は頭に問題があるけど、何も理解できないわけじゃない。自分が何をしているかも、きちんと分かってる。",
      ),
      say(
        "death",
        "最近は、私と二人きりになることを怖がらない人だっているんだから！！！",
      ),
      say(
        "death",
        "何を怖がる必要があるの？！　その人たちは私に何もしなかったよ！　会う人全員に噛みつくわけじゃないし、感染もしない！！",
      ),

      nfx(
        "チャイムが鳴り、二人の話に集中していた俺の意識を断ち切った。",
        m.sfx("school_bell"),
      ),

      n("カイラは壁から身体を起こし、ゆっくり歩き出す。"),
      sf("kaira", "それじゃ、授業に戻ろっか。", m.hideAll()),

      n("俺が背を向けようとした瞬間、死に娘が再び声を上げた。"),

      sf("death", "ちょっと待って！", {
        bg: "./bg/cg/prologue/death_think.webp",
        bgSpeed: 50,
      }),
      say("death", "ねえ、男の子。授業、サボらない？"),
      say("death", "カイラは一人で寂しく授業を受けてればいいの！"),
      say("death", "私と話すために君を連れてきたんだから、まだ行かせないよ！"),

      say("ren", "授業をサボる？"),
      sf(
        "kaira",
        "心配しないで、レン。もう少しこの子と話していきなよ。",
        m.show("kaira", "neutral", "right"),
      ),
      say("ren", "次の休み時間じゃ駄目なのか？"),
      say(
        "kaira",
        "その頃には用事があるかもしれないから、今話した方がいいよ。",
      ),
      say(
        "kaira",
        "時間ならあるって。誰かのノート運びを手伝ってるって、私が教師に言っておくから。",
      ),
      say("ren", "信じてもらえるのか？"),
      sf(
        "kaira",
        "お姉ちゃんを疑うなんて、いちばんやっちゃいけないことだよ。",
        m.show("kaira", "intresting", "right"),
      ),
      say("kaira", "チャオ！"),

      nfx("カイラは俺を一人残し、教室へ駆けていった。", m.hideAll()),

      say("death", "ねえねえ、もっと近くに来て。お話しよう。"),
      n("一歩だけ近づいた。"),
      say("death", "もう、窓にぴったりくっつくくらい近くへ来てよ！"),
      say(
        "death",
        "カイラと私が説明したでしょ。私は君みたいな相手には危害を加えないって！",
      ),

      nfx(
        "覚悟を決めて窓のすぐそばまで近づくと、彼女も同じように寄ってきた。",
        {
          bg: "./bg/cg/prologue/death_closeNeutral.webp",
          bgSpeed: 50,
        },
      ),
      n("互いの顔は、ほんの数センチしか離れていない。"),
      n("意外にも、彼女からは心地よい匂いがした。"),
      n("彼女は声を落とした。"),

      say("death", "君って無口な男の子だね。照れてるの？"),

      say("ren", "いや……どちらかっていうと、マジでドン引きしてる。"),
      say(
        "death",
        "『ドン引き』？……ここに転入生が来たなんて初めて聞いたから、少しくらいなら分かってあげられるかな。",
      ),
      say(
        "death",
        "でも私が言いたかったのは、君がカイラや私の目をあまり見ようとしないってこと。",
      ),
      sf("death", "女の子相手だと照れちゃうんだ！", {
        bg: "./bg/cg/prologue/death_closeSmile.webp",
        bgSpeed: 50,
      }),

      n("俺が苦手なのは、頭のおかしい奴の方だ。"),

      say(
        "death",
        "でも大丈夫！　口を開けて、まともに言葉を話せるんだから、恥ずかしがるのも一時的な問題だよ！",
      ),

      say("ren", "それより、本題に入ろう。"),
      say("ren", "何を話したかったんだ？"),
      say("death", "そうだった！　もう急ぐ必要はないよね？"),
      say("death", "よく聞いて、レン。"),
      say("death", "後ろを確認して。誰かいる？"),

      nfx(
        "振り返る。廊下には誰もいない。",
        m.fx({ darkness: 1, duration: 500 }),
      ),
      sf("ren", "ハエ一匹いない。", m.fx({ darkness: 0, duration: 500 })),

      sf(
        "death",
        "よし。君に頼みたいことが一つあるの。もちろん、成功したらご褒美もあげる。",
        {
          bg: "./bg/cg/prologue/death_closeNeutral.webp",
          bgSpeed: 50,
        },
      ),
      say("death", "依頼システムのことは、もう知ってる？"),
      say("ren", "いや。"),
      say(
        "death",
        "スマホの生徒メニューに、小さな『依頼』ボタンがあるでしょ！",
      ),
      say("ren", "何も入ってない。"),
      say(
        "death",
        "さあ、私にも分からない。転入生だから、君だけ違う仕組みなのかも。",
      ),
      say(
        "death",
        "仕組みは単純。高ランクの生徒が、低ランクの生徒に報酬つきの依頼を出せるの。",
      ),
      say("death", "ただし、私は依頼を出すのを禁止されてるけど～～～～"),
      say(
        "death",
        "私のスマホには強い制限がかかってるの。解除できない特別モードで……",
      ),
      say("death", "でも、頼みたいことはとっても簡単。"),
      say("death", "ある女の子に、手紙を届けてくれない？"),
      say(
        "death",
        "私の友達なんだけど、自分では届ける時間がないの。急ぎの手紙なんだ。",
      ),
      sf("death", "ただし、絶対にその子と直接会っちゃ駄目！", {
        bg: "./bg/cg/prologue/death_closeCreepy.webp",
        bgSpeed: 50,
      }),
      say("death", "手紙を届けるところは、絶対に誰にも見られちゃ駄目。"),
      say(
        "death",
        "今は水泳の授業中だから、女子更衣室に入って、その子のロッカーの隙間に手紙を差し込んで。",
      ),
      sf("death", "すっごく簡単でしょ！", {
        bg: "./bg/cg/prologue/death_closeNeutral.webp",
        bgSpeed: 50,
      }),
      say("ren", "女子更衣室？　控えめに言っても危険だろ。"),
      say(
        "death",
        "そんなに心配しないで！　みんなプールにいるから、ロッカーを見つけて手紙を入れるまで二十秒もかからないよ！",
      ),
      say(
        "death",
        "中に監視カメラもない。誰にも見つからないようにすれば、絶対に大丈夫！",
      ),
      say("ren", "……それで、見返りは？"),

      say("death", "君だけに、特別なものを……"),
      nfx("死に娘が小窓から離れ、全身を見せた。", {
        bg: "./bg/cg/prologue/death_fullHeight.webp",
        bgSpeed: 50,
      }),
      n("自分の胸や股間を、手でゆっくり撫で始める。"),
      say("death", "見て、レン！　これが君のご褒美！"),

      nfx(
        "張りのあるDカップの胸。可愛い乳首はもう硬くなっている！",
        {
          bg: "./bg/cg/prologue/death_breast.webp",
          bgSpeed: 50,
        },
        m.sfx("fabric_rustle"),
      ),
      sf("death", "私の可愛いあんよ。", {
        bg: "./bg/cg/prologue/death_feet.webp",
        bgSpeed: 50,
      }),
      say("death", "フェチ持ちには天国でしょ！"),
      sf(
        "death",
        "それから、私のアソコ。",
        {
          bg: "./bg/cg/prologue/death_pussy.webp",
          bgSpeed: 50,
        },
        m.sfx("fabric_rustle"),
      ),

      n("突然ドレスをたくし上げ、割れ目を見せつけてきた。"),
      n("どうやら、パンツというものを知らないらしい。"),

      say(
        "death",
        "ほら、この甘そうで可愛いヒダ！　すっごくきついんだから。信じていいよ。",
      ),
      say("death", "指一本入れるのも大変なの。ちんこなんて、もっと無理！"),

      say("ren", "ああっ、くそ……"),
      nfx("疲れ切っていたはずのちんこが、一瞬で息を吹き返した！", m.sanity(-1)),

      say("ren", "いや、俺は……考え……"),

      say("death", "あっ、実演が必要なんだね！"),
      nfx(
        "死に娘が、割れ目へ指を押し込み始めた！",
        {
          bg: "./bg/cg/prologue/death_pussy_closeup.webp",
          bgSpeed: 50,
        },
        m.sfx("masturbation_slow", 1, true),
      ),
      n(
        "二本の指がクリトリスを滑り、濡れた音を立てながら、ゆっくり中へ沈んでいく。",
      ),
      say("death", "ああっ！！　ああっ……んんっ。"),
      say("death", "もう自分で触りたくなってきた……んんんん……"),

      n("アソコの中で指を回し、それから引き抜いた。"),
      n("穴から指先まで、細い糸が伸びている。"),
      nfx(
        "窓へ近づき、濡れた指を俺の前へ差し出した。",
        {
          bg: "./bg/common/deathFinger.webp",
          bgSpeed: 50,
        },
        m.stopSfx("masturbation_slow"),
      ),
      n("やばい。"),
      sf(
        "death",
        "ほら、どうして突っ立ってるの？　舐めてみて。味が気に入らなかったら、仕方ないから別の男の子を探すよ。",
        {
          choices: [
            { text: "舐める", next: "yuno_finger_taste" },
            { text: "舐める", next: "yuno_finger_taste" },
            { text: "舐める", next: "yuno_finger_taste" },
            { text: "舐める", next: "yuno_finger_taste" },
          ],
        },
      ),
    ],
  },

  yuno_finger_taste: {
    lines: [
      nfx(
        "彼女の指をゆっくり口に含んだ。",
        m.stats({ sanity: -3, rank_score: -2 }),
        {
          bg: "./bg/common/deathFinger_lick.webp",
          bgSpeed: 50,
        },
      ),
      n("舌で指の周りをなぞる……"),
      n("濃厚な甘さ……"),
      n("少し塩辛い……濡れたアソコの味が、舌の上に直接広がる。"),
      nfx(
        "粘ついて、汚らしく、あの淫乱女の味が口に残る！",
        m.fx({ noise: 0.25, vignette: 0.4, duration: 800 }),
      ),
      n(
        "ちんこは硬く、ズボンの中で脈打っている。口から垂れた唾液が、彼女の愛液と混ざり合った。",
      ),
      say(
        "death",
        "はい、そこまで。もう指を口から出して。全部綺麗に舐め取ったでしょ、欲張りさん。",
      ),

      n("彼女の言うとおりだ。もう全部舐め取って、飲み込んでしまった。"),
      n(
        "くそっ、俺は何をしてるんだ。頭のおかしい女の誘いにまんまと乗せられてる。",
      ),
      nfx(
        "我に返った瞬間、彼女から離れて口元を拭った。",
        {
          bg: "./bg/cg/prologue/death_wipe.webp",
          bgSpeed: 50,
        },
        m.fx({ noise: 0, vignette: 0, duration: 800 }),
      ),
      say("ren", "あっ、すまない。"),
      say("death", "ええ～、君って馬鹿なの？"),
      sf(
        "death",
        "欲しいのは『依頼を引き受けます！』であって、『ごめんなさい、女王様！』じゃないの！",
        {
          bg: "./bg/cg/prologue/death_speaking.webp",
          bgSpeed: 50,
        },
      ),
      say("death", "私の身体を好きにして、一回イっていいって言ってるんだよ！"),
      say("death", "それで、引き受けてくれる、天野レン？"),

      say("ren", "……ああ。"),

      nfx(
        "死に娘が小窓を閉めた。",
        {
          bg: "./bg/locations/death_enterance.webp",
          bgSpeed: 50,
        },
        m.sfx("window_open"),
      ),
      nfx("二十秒ほど経つと、小窓が再び開いた。", m.sfx("window_open"), {
        bg: "./bg/cg/prologue/death_letter.webp",
        bgSpeed: 50,
      }),
      n("折り畳んだ紙を差し出してくる。"),
      nfx(
        "受け取ろうと手を伸ばした瞬間、死に娘がもう片方の手で俺を捕まえ、引き寄せた。",
        {
          bg: "./bg/cg/prologue/death_closeCreepy.webp",
          bgSpeed: 50,
        },
        m.psychoShake("ren"),
      ),
      say(
        "death",
        "もしこの手紙を読んだことが私にバレたら、どうやって知ったかは関係なく、私がどれだけ危険になれるか思い知るよ、レン。",
      ),
      n("..."),
      sf(
        "death",
        "あはは、冗談！　どうせ読んでも意味が分からないんだから、読んだって同じだけどね！",
        {
          bg: "./bg/cg/prologue/death_letter.webp",
          bgSpeed: 50,
        },
      ),
      m.interact({
        id: "take_death_letter",
        type: "exit",
        label: "手紙を受け取る",
        pos: { x: 53, y: 70 },
      }),

      nfx(
        "彼女が腕を放し、俺は手紙を受け取った。",
        {
          bg: "./bg/cg/prologue/death_speaking.webp",
          bgSpeed: 50,
        },
        m.sfx("letter_take"),
      ),
      say("ren", "それでも、読まない方がよさそうだ。"),
      say("death", "それが正解！"),
      say("death", "一階へ行って。プールの場所は地図で確認してね。"),
      n("でも、今は地図がロックされている……"),
      say(
        "death",
        "それから、周りに誰もいないことを確認したら、これを使って女子更衣室に入って。",
      ),

      nfx("死に娘が、さらに何かを差し出してきた。", {
        bg: "./bg/cg/prologue/death_phone.webp",
        bgSpeed: 50,
      }),
      n("彼女のスマホだ。"),
      n("金色のケースに、小さなナイフ型のストラップがついている。"),
      m.interact({
        id: "take_death_phone",
        type: "exit",
        label: "スマホを受け取る",
        pos: { x: 70, y: 70 },
      }),
      nfx(
        "手に取った瞬間、あることに気づいた……俺のスマホとは違う。",
        {
          bg: "./bg/cg/prologue/death_speaking.webp",
          bgSpeed: 50,
        },
        m.sfx("clothes_grab"),
      ),
      n(
        "重さも大きさも違う。俺のスマホはカメラが一つなのに、これは三つもついている。",
      ),
      n("だが、詳しく調べている時間はない。"),

      say(
        "death",
        "女子更衣室に入るには女子生徒のIDが必要なの。私のスマホならぴったり！",
      ),

      say(
        "ren",
        "そうなのか。まだ知らなかった。お前のスマホでも使えるのか？　制限されてるんだろ？",
      ),
      say("death", "もちろん使えるよ！　私、女の子だもん～～"),
      say(
        "death",
        "使えないのは一部の機能だけ。それでも学生証としてはちゃんと使えるよ。",
      ),
      say("death", "だから、そのスマホで買い物だってできる。"),
      say("ren", "いや、使わない。"),

      say(
        "death",
        "次に、3-C組のロッカーへ行って、『東條キララ』と書かれたものを探して。",
      ),
      say("death", "手紙を中へ入れて、そのまま出る。それだけ！"),
      say("ren", "分かった。"),
      say("ren", "それじゃ……もう行くよ？"),
      say("death", "私のために頑張ってね！"),
      nfx(
        "振り返り、一階のプールへ真っすぐ向かった。",
        {
          bg: "./bg/locations/womens_locker_pool.webp",
        },
        m.audioMix(m.sfx("walking"), m.stopBgm()),
        { dialogStyle: "normal" },
      ),
      n("廊下の分かれ道。女子更衣室と男子更衣室……"),
      n("こんなことは一度もしたことがない。"),
      n("心臓が狂ったように打っている。"),
      n("だが、俺に力を与えてくれるものがある……"),
      n("裸の死に娘の姿と、彼女の指に残っていた味の記憶。"),
      n("セックスがしたいなら、ここは男を見せるしかない。"),
      n("やってやる！"),

      nfx(
        "周囲を見回す。誰もいない。ドア脇の端末に、死に娘のスマホをかざした。",
        m.sfx("locker_open"),
      ),
      n("ドアが開いた。"),
      nfx(
        "中には誰もいない。次は、3-C組と書かれたドアを探す……",
        {
          bg: "./bg/locations/womens_locker_poolInside.webp",
        },
        m.sfx("walking"),
      ),
      n("あった！"),
      nfx(
        "そっとドアを開ける……誰もいない……",
        {
          bg: "./bg/locations/womens_locker_pool_lockers.webp",
        },
        m.audioMix(m.sfx("walking"), m.sfx("door_close")),
      ),
      n("よし。次はキララのロッカーだ。"),
      n("..."),
      n("…"),
      nfx(
        "あった！",
        {
          bg: "./bg/locations/womens_locker_kirara.webp",
        },
        m.sfx("walking"),
      ),
      nfx(
        "手紙を取り出し、ロッカーの隙間から中へ差し込んだ。",
        m.sfx("letter_take"),
      ),
      n("これで終わりだ！　死に娘のところへ戻って、それから教室へ行こう。"),
      nfx(
        "出口のドアへ手を伸ばし、開けかけたところで、向こう側から女子の声が聞こえた！",
        {
          bg: "./bg/locations/womens_locker_door.webp",
        },
      ),
      n("何人かの女子が外を通っているらしい……こっちへ来ないといいが。"),
      n("しばらく待ちながら、周囲を見回すことにした。"),
      n("更衣室には塩素、シャンプー、そして汗の匂いが漂っている。"),
      n("入口の向こうの声はなかなか遠ざからない。まだ待つしかない……"),
      n("ここ、悪くないな……このクソ危険な状況さえなければ……"),
      n("さらに周囲を見回す。"),
      nfx("ん？　一つだけ、ロッカーが少し開いている……", {
        bg: "./bg/locations/womens_locker_ajar.webp",
      }),
      n("……気を取られている場合じゃない……"),
      nfx("でも、次にここへ入れる機会なんてあるのか？", {
        choices: [
          {
            text: "ロッカーを開ける",
            effects: { dominance: 2, sanity: -1 },
            next: "locker_open",
          },
          {
            text: "そのまま待つ",
            effects: { sanity: 1 },
            next: "locker_wait",
          },
        ],
      }),
    ],
  },

  locker_open: {
    lines: [
      n("ふん。こんなの、誰だって我慢できないだろ……"),

      nfx(
        "ロッカーへ歩み寄り、扉を開けた……",
        { action: () => setFlag("pantyStolen") },
        {
          bg: "./bg/locations/womens_locker_open.webp",
        },
      ),

      n("おお……これは……"),
      n("綺麗に畳まれた女子の服……"),
      n("白いパンツまである……"),
      n("持ち主に気づかれないといいが……"),
      nfx(
        "畳まれたパンツへゆっくり手を伸ばし、広げて中を覗き込んだ。",
        {
          bg: "./bg/common/womens_locker_pantie.webp",
        },
        m.sfx("fabric_rustle"),
      ),
      n(
        "少し湿っていて、穿き跡もはっきり残っている。きっと、すごい匂いがする……",
      ),
      n("あまりにも変態的だ……こんなことをするべきじゃない。"),
      nfx("それでも、パンツを鼻へ押し当てる……", {
        bg: "./bg/common/womens_locker_pantieSniff.webp",
      }),
      n("うわ、すげえ匂いだ……"),
      nfx(
        "!!!",
        m.audioMix(m.sfx("school_door"), m.bgm("Willbreaker", 0.7)),
        {
          bg: "./bg/common/womens_locker_girls.webp",
        },
        m.psychoShake("ren"),
      ),
      say("mystery", "くそっ、鍵がここにあるといいけど。"),
      say("mystery", "早く。"),
      n("最悪の事態になった……"),

      nfx(
        "漁っていたことを隠すため、すぐさまロッカーを閉める。",
        m.sfx("locker_close", 0.6),
      ),

      n("だが、パンツはまだ俺の手の中にある……"),
      n("ロッカーへ戻し忘れた！"),

      sf("mystery", "……どうやってここに入ったの、この変態？！", {
        bg: "./bg/common/womens_locker_discovered.webp",
      }),
      say("mystery", "誰かいるの？"),
      say("mystery", "きゃあああ！　女子更衣室に変態がいるよ、みんな！！！"),
      say("mystery", "誰かのパンツを取った！！"),
      n("アドレナリンが一気に噴き出し、身体が反射的に動いた。"),
      nfx(
        "パンツをズボンのポケットへ突っ込み、取り囲まれる前に更衣室から飛び出した。",
        m.audioMix(m.sfx("fabric_rustle"), m.sfx("run")),
        {
          bg: "./bg/common/womens_locker_chase.webp",
        },
        m.fx({ darkness: 1, duration: 300 }),
      ),
    ],
    next: "locker_chase",
  },
  locker_wait: {
    lines: [
      n("いや、さすがに最低すぎる……このまま待とう……"),

      n("..."),
      n("..."),
      n("声はまだ消えない……"),
      nfx(
        "!!!",
        m.audioMix(m.sfx("school_door"), m.bgm("Willbreaker", 0.7)),
        {
          bg: "./bg/common/womens_locker_girls.webp",
        },
        m.psychoShake("ren"),
      ),
      say("mystery", "くそっ、鍵がここにあるといいけど。"),
      say("mystery", "早く。"),
      n("最悪の事態になった……"),
      n("何千通りもの逃げ方が頭を駆け巡る。"),
      sf("mystery", "……どうやってここに入ったの、この変態？！", {
        bg: "./bg/common/womens_locker_discovered.webp",
      }),
      say("mystery", "誰かいるの？"),
      say("mystery", "きゃあああ！　女子更衣室に変態がいるよ、みんな！！！"),
      nfx(
        "アドレナリンが一気に噴き出し、身体が反射的に動いた。",
        m.fx({ darkness: 1, duration: 300 }),
      ),
      nfx("取り囲まれる前に、更衣室から飛び出した。", m.sfx("run"), {
        bg: "./bg/common/womens_locker_chase.webp",
      }),
    ],
    next: "locker_chase",
  },
  locker_chase: {
    lines: [
      n("更衣室を飛び出し、安全そうな場所まで逃げ込んだ……"),
      n("後ろを振り返る……"),
      nfx(
        "恐ろしい光景が目に飛び込んできた。",
        m.fx({ darkness: 0, duration: 300 }),
      ),
      n("廊下の向こうから、女子たちの声が届く。"),
      say("mystery", "あいつよ！　あのクソ変態！"),
      nfx(
        "全速力で駆け出した。行き先など考えず、足の向くまま走る。",
        {
          bg: "./bg/locations/chase_fromPool.webp",
        },
        m.sfx("run_multiply"),
        m.runningStart(),
      ),
      n("俺たちは揃って、校内を走ってはいけないという規則を破った。"),
      n("しかも授業中に！"),
      n("追ってくる連中が運動部だと分かる。少しずつ距離を詰められている！"),
      n("初日から退学になってたまるか――その鋼の意志だけが俺を走らせる！"),
      nfx(
        "外へ飛び出す。女子たちもすぐ後ろだ。",
        {
          bg: "./bg/locations/shinshu_sideView.webp",
        },
        m.audioMix(
          m.stopSfx("dorm_ambience"),
          m.sfx("street_ambient", 0.4, true),
        ),
      ),
      n(
        "屋外へ出ると、少しずつ引き離せるようになった。外は寒く、足元は荒いアスファルト。しかも向こうは水着しか着ていない。",
      ),
      say("mystery", "止まりなさい、このクソ野郎！！！"),
      say("ren", "お前が止まれ、クソ女！！！"),
      nfx(
        "振り返らず、さらに二分ほど走り続けた……",
        m.stopBgm(),
        m.runningStop(),
        m.fx({ darkness: 1, duration: 300 }),
      ),
      n("やがてゆっくり足を止め、二つのことに気づいた……"),
      n("一つ。追手はもういない……運動部の女子たちから逃げ切った。"),
      nfx(
        "二つ。ここがどこなのか分からない。",
        {
          bg: "./bg/locations/shinshu_eliteSide.webp",
        },
        m.fx({ darkness: 0, duration: 500 }),
      ),
      n("息を整えながら、辺りを見回し始めた。"),
      n("なんて……綺麗な場所だ……"),
      n(
        "ここだけまるで別世界だ。アスファルトの代わりに柔らかな芝生が広がり、整えられた庭、ベンチ型のブランコ、噴水まである。",
      ),
      n("目に映るものが多すぎて、一度では捉えきれない。"),
      n("次に視線が上へ向かう……"),

      say("ren", "あっ！"),
      n("校舎のこちら側は、どこか雰囲気が違う……"),
      nfx(
        "豪華なバルコニーが並び……その一つに女子生徒が立っていた……",
        {
          bg: "./bg/common/celesta_balcony.webp",
        },
        { dialogStyle: "transparent" },
        m.bgm("Celesta"),
      ),
      n("何もかもが……上品で、完璧に見える……"),
      n("姿勢は真っすぐで、遠くを見つめていた。"),
      n(
        "片手にはソーサー、その上には小さなカップ。飲み物を優雅に口へ運んでいる。",
      ),
      nfx(
        "だが、突然その視線が俺へ向いた。",
        {
          bg: "./bg/common/celesta_balconyLook.webp",
        },
        { bgSpeed: 50 },
      ),
      n("目の下に隈を浮かべた冷たい瞳が、真っすぐ俺を射抜く。"),
      n("何も言わない。ただ見つめている。"),
      n(
        "俺も同じように見返す。向こうが何も言わない以上、答える言葉もない。ただ互いに見つめ合った……",
      ),
      nfx(
        "突然、彼女が再び動いた。",
        {
          bg: "./bg/common/celesta_balconyGlove.webp",
        },
        { bgSpeed: 50 },
      ),
      n("カップとソーサーを窓辺へ置く。"),
      n("左手の手袋を外し……"),
      nfx(
        "俺の足元へ投げ落とした。",
        m.sfx("glove_drop"),
        {
          bg: "./bg/common/celesta_balconyDrop.webp",
        },
        { bgSpeed: 50 },
      ),
      say("celeste", "拾いなさい。"),
      n("拾え？　どうして俺が？"),
      nfx(
        "ああ、そうだった。よりによって今、この学校がどんな場所か忘れていた。",
        {
          bg: "./bg/common/celesta_balconyBW.webp",
        },
      ),
      nfx(
        "狂った学校。",
        m.audioMix(m.stopSfx("street_ambient"), m.stopBgm(1)),
      ),
      n("そして、神にも見放された学校。"),
      n("ここでは誰も俺を助けてくれない。そうだろ？"),
    ],

    // ここでクレジットを開始し、プロローグ第二部を終了する。
    next: () => {
      // 1. ゲーム画面を非表示にする。
      const dialogWrapper = document.getElementById("dialog-wrapper");
      if (dialogWrapper) dialogWrapper.style.display = "none";

      // 2. クレジットを開始する。
      window.startCredits([
        `プロローグ第二部・完。<br /><br />
          <span
            style="
        color: #ff4d4d;
        font-size: 1.2rem;
        text-shadow: 0 0 10px rgba(255, 0, 0, 0.5);
      "
          >
            プレイしてくれて、本当にありがとう！❤<br />
            これでプロローグの3分の2まで来ました。物語はまだ、その幕開けを描いている途中です。<br />
            そしてもちろん、第三部もあります。プロローグの完結編です。
          </span>`,
        `制作：V&Mai Studio
        協力：いろいろなAI`,
        `開発を支援すると、ティザーやアップデートの先行アクセスを受け取れます！<br />さらに、開発者と直接交流することもできます！<br />
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
        Patreonで支援する
      </a>
      <a href="https://boosty.to/vmaistudio" target="_blank" class="support-btn boosty">
        <img
          src="icons/boosty.svg"
          alt="Boosty"
          style="width: 24px; height: 24px; filter: brightness(0) invert(1)"
        />
        Boostyで支援する
      </a>
      <div class="credits-support-x-row">
        <a href="https://x.com/VMaiStudio" target="_blank" class="support-btn x-social">
          <img
            src="icons/x.svg"
            alt="X"
            style="width: 24px; height: 24px; filter: brightness(0) invert(1)"
          />
          Xをフォロー
        </a>
      </div>
    </div>
     `,
      ]);

      // 3. nullを返して物語を停止する。
      return null;
    },
  },
};

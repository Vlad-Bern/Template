import { m, audioMacros, n, say, nfx, sf } from "../macros.js";
import { state, setFlag, getFlag, removeFlag } from "../../core/state.js";

export const story = {
  prologue_interrogation: {
    id: "prologue_interrogation",
    bg: "./bg/common/dream_man.webp",
    lines: [
      sf(
        "mystery",
        "Ren.",
        {
          ...m.fx({ darkness: 1, noise: 1, duration: 0 }),
          ...m.bgm("Zero Rank", 0.5),
        },
      ),
      say("mystery", "Can you hear me?"),
      sf("ren", "Yeah...", m.fx({ darkness: 0.9, noise: 0.2, duration: 500 })),
      n(
        "A silhouette in a business suit sits across from me. I can smell tobacco.",
      ),
      nfx(
        "I tried to pull free, but it was useless. My hands are tied to the armrests.",
        m.sfx("rope_struggle_chair", 0.8),
        m.fx({ darkness: 1, noise: 0.2, duration: 500 }),
      ),
      n("I'm trapped."),
      sf(
        "mystery",
        "Do you understand why you're here?",
        m.fx({ darkness: 0.8, noise: 0.5, duration: 500 }),
      ),
    ],
    choices: [
      { text: "Vaguely.", next: "prologue_contract" },
      { text: "...", next: "prologue_contract" },
    ],
  },

  prologue_contract: {
    id: "prologue_contract",
    bg: "./bg/common/dream_man.webp",
    lines: [
      say(
        "mystery",
        "Article 134. Intentional infliction of grievous bodily harm. Plus resisting arrest.",
      ),
      sf(
        "mystery",
        "Ren, what you did leads straight to a maximum security prison.",
        m.fx({ darkness: 0.7, noise: 0.4, duration: 500 }),
      ),
      say("ren", "..."),
      say("mystery", "But I have an alternative."),
      say(
        "mystery",
        "Shinshu Private Academy. A closed institution for behavioral correction.",
      ),
      say("mystery", "Or prison. The choice is yours."),
      nfx(
        "The man placed a document and a thin needle on the table.",
        m.sfx("paper_slide", 0.8),
        { bg: "./bg/common/dream_table.webp" },
        {
          action: () => {
            window.sm.ui.showDocument(true);
            window.sm.ui.handleFx({ darkness: 0.3, noise: 0.5, duration: 500 });
          },
        },
      ),
      say("mystery", "A voluntary transfer application."),
      say("mystery", "Decide."),
    ],
    choices: [
      { text: "Fine...", next: "prologue_sign" },
      { text: "No.", req: { dominance: { min: 80 } } },
    ],
  },

  prologue_sign: {
    id: "prologue_sign",
    bg: "./bg/common/dream_table.webp",
    lines: [
      n(
        "He freed my right hand. I slowly reached for the pen on the table, but he caught my wrist.",
      ),
      say("mystery", "Not with a pen, Ren."),
      nfx(
        "A sharp prick to my fingertip. I didn't even have time to flinch.",
        m.sfx("needle_pierce_gasp", 0.8),
        m.fx({ darkness: 0.5, noise: 0.7, duration: 500 }),
      ),
      say("ren", "Ngh.."),
      sf(
        "mystery",
        "Your consent must be absolute. Biological.",
        m.fx({ darkness: 0.6, noise: 0.3, duration: 500 }),
      ),
      nfx(
        "A crimson drop fell onto the paper. My blood soaked in.",
        m.sanity(-30),
      ),
      say("mystery", "There. Everything will be different now."),
      sf(
        "mystery",
        "You'll like it there, Ren.",
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
        "Sooner or later, you'll like it.",
        m.sfx("noise", 0.2, true),
        m.fx({ darkness: 0.3, noise: 0.8, duration: 500 }),
      ),
      sf(
        "mystery",
        "Especially my d@u№ht%r. B:!#! №$r.",
        m.sanity(-80),
        { anim: "psychoShake" },
        m.fx({ darkness: 0.3, noise: 0.9, duration: 500 }),
      ),
      sf(
        "mystery",
        "F!№d ?%r, Ren.",
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
      nfx("Ugh...", m.fx({ darkness: 0.3, noise: 0, duration: 500 })),
      n("Am I here already?"),
      nfx(
        "The bus sat motionless. The hum of the engine blended with the monotonous drumming of rain against the window.",
        {
          audio: [
            { type: "sfx", id: "muffled_rain", volume: 0.8, loop: true },
            { type: "sfx", id: "bus_interior", volume: 0.3, loop: true },
            { type: "stop_sfx", id: "heartbeat", fade: 500 },
            { type: "stop_sfx", id: "tinnitus", fade: 500 },
          ],
        },
      ),
      say("driver", "End of the line."),
      nfx(
        "I looked out the window. Through the glass I could make out massive concrete walls.",
        { bg: "/bg/common/school_bus.webp" },
      ),
      say("ren", "This... is my new school?"),
      say("driver", "Zero Sector."),
      nfx(
        "The bus doors hissed open, letting in the smell of wet asphalt.",
        m.sfx("bus_door_open", 0.5),
      ),
      say("driver", "Hurry up."),
      n(
        "He glanced at me through the rearview mirror. His eyes were hidden in the shadow of his cap.",
      ),
      sf("ren", "Coming...", { bg: "/bg/common/school_bus_choice.webp" }),
    ],
    interactables: [
      {
        type: "exit",
        label: "Get off the bus",
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
        "The moment I stepped off the bus, she was there to greet me...",
        m.show("kagami", "neutral", "center", "fadeIn"),
      ),
      n(
        "A grown woman with a piercing, weary gaze and dark hair pulled back in a tight ponytail. A faint trace of dry wine clung to her.",
      ),
      say("ren", "Hello, I'm—"),
      say("kagami", "Amano Ren. I know."),
      nfx(
        "Rain was falling. She stepped toward me — close, but not intimately — and held out a separate umbrella.",
        m.sfx("umbrella_open"),
      ),
      sf(
        "kagami",
        "My name is Kagami Sae.",
        { action: () => setFlag("knowsKagami") },
        m.bgm("Rest till you there"),
      ),
      sf(
        "kagami",
        "Behind me stands Shinshu Academy. Welcome, Amano.",
        m.show("kagami", "neutral2", "center"),
      ),
      say("ren", "Thank you. Just call me Ren."),
      sf(
        "kagami",
        "On a first-name basis already?",
        m.show("kagami", "neutral", "center"),
      ),
      say("ren", "Yeah, I'm just used to it."),
      say(
        "kagami",
        "Very well. Next up is a short aptitude test. Please follow me.",
      ),
      nfx(
        "And so we moved.",
        m.sfx("step_puddle"),
        { bg: "/bg/cg/prologue/ren_kagami_walk.webp" },
        m.hide("kagami", "fadeOut"),
        m.sfx("walking", 1),
      ),
      n("I walked just behind her, and my gaze kept drifting to her hips."),
      n(
        "I desperately clung to those thoughts, trying to convince myself that everything was fine... that I was safe.",
      ),
      n("But I had to force myself to look up."),
      say(
        "ren",
        "Kagami-sensei, tell me about this school. I was transferred from a small town...",
      ),
      say(
        "ren",
        "I don't even know what I did to deserve an opportunity like this.",
      ),
      say("kagami", "Deserve? There are no past merits here."),
      say(
        "kagami",
        "There is only potential — which you either realize, or...",
      ),
      say("kagami", "Or you don't."),
      say(
        "kagami",
        "You're the first to arrive mid-semester. Students here usually start from the very beginning, so you've already stood out.",
      ),
      say("ren", "I see..."),
      nfx(
        "As we walked, I caught something in my peripheral vision... something wrong. A silhouette in the shadow of the concrete.",
        m.stopBgm(500),
      ),
      sf("ren", "What the...", m.sanity(-5)),
      n("I stopped. My gaze locked onto a single point."),
      nfx(
        "A student. Completely naked. Her skin was pale.",
        { bg: "/bg/cg/prologue/punished_girl_main.webp" },
        m.fx({ vignette: 1, duration: 1500 }),
      ),
      nfx(
        "A chain ran from a post — straight to a collar around her slender neck.",
      ),
      n(
        "She sat motionless, hugging her knees. Water ran down her tangled hair, dripping onto the dirty concrete.",
      ),
      nfx(
        "And this scene was barely a stone's throw from the main entrance.",
        m.sanity(-5),
      ),
      sf(
        "kagami",
        "Ren, why did you stop?",
        { bg: "/bg/cg/prologue/kagami_lookback.webp" },
        m.fx({ vignette: 0, duration: 3000 }),
      ),
      n("Kagami's voice was casual. Completely calm."),
      sf("ren", "I...", { bg: "/bg/cg/prologue/kagami_girl_choice.webp" }),
    ],
    interactables: [
      {
        type: "look",
        action: () => {
          setFlag("sawChainedGirl");
        },
        label: "Move closer to the student",
        pos: { x: 65, y: 80 },
        effects: { rank_score: -1, dominance: 1 },
        next: "approach_girl",
      },
      {
        type: "exit",
        label: "Keep walking",
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
      say("ren", "Umm, I just..."),
      nfx(
        "I stepped off the path. Mud squelched under my shoes. Kagami sighed heavily behind me, but didn't stop me.",
        { bg: "/bg/cg/prologue/punished_girl_main.webp" },
        {
          action: () => window.sm.ui.handleFx({ vignette: 1, duration: 1500 }),
        },
        m.sfx("walking", 1),
      ),
      n(
        "With every step the details grew sharper. A strange white fluid on her feet. Not a trace of clothing.",
      ),
      nfx(
        "She heard me. She slowly raised her head.",
        { bg: "/bg/cg/prologue/punished_girl_lookup.webp" },
        {
          action: () => window.sm.ui.handleFx({ vignette: 0, duration: 3000 }),
        },
        m.sfx("metal_chain", 1),
      ),
      n("She's looking at me. With such calm eyes..."),
      n("Or are they restless? I can't decide."),
      nfx("Now I'm standing almost right in front of her.", m.sanity(-5)),
      n("What do I do...?"),
    ],
    choices: [
      { text: "Talk to her", next: "talk_to_girl" },
      {
        text: "Try to help",
        effects: { rank_score: -2, dominance: 1 },
        next: "help_girl",
      },
      {
        text: "Laugh in her face",
        req: { dominance: { min: 15 } },
        next: "laugh_at_girl",
      },
      {
        text: "Sexual act",
        req: { dominance: { min: 30 } },
        next: "inspect_girl",
      },
    ],
  },

  ignore_girl: {
    id: "ignore_girl",
    bg: "/bg/cg/prologue/kagami_lookback.webp",
    lines: [
      n("I looked away."),
      say("ren", "Umm, nothing. Let's go."),
      nfx(
        "What was that? Part of the test? A psychological check? If I react — do I fail?",
        m.sanity(-5),
        { bg: "/bg/cg/prologue/ren_kagami_walk.webp" },
        m.sfx("walking", 1),
      ),
      n("We walked for another minute until we reached a small annex."),
    ],
    next: "quiz_intro",
  },

  talk_to_girl: {
    id: "talk_to_girl",
    lines: [
      say("ren", "Hey, what happened to you? Why are you naked?"),
      sf("mystery", "Why are you dressed?", {
        bg: "/bg/cg/prologue/punished_girl_lookup_talk.webp",
        bgSpeed: 50,
      }),
      say("ren", "?"),
      say("mystery", "I broke the rules."),
      sf("mystery", "I just wanted to hug someone...", {
        bg: "/bg/cg/prologue/punished_girl_blush.webp",
        bgSpeed: 50,
      }),
      say("mystery", "And they tied me up and chained me here."),
      sf("mystery", "Now I hug whoever they tell me to.", {
        bg: "/bg/cg/prologue/punished_girl_lookup_talk.webp",
        bgSpeed: 50,
      }),
      sf("mystery", "Hahaha!", {
        bg: "/bg/cg/prologue/punished_girl_laugh.webp",
        bgSpeed: 50,
      }),
      n("She laughed quietly..."),
      n("And immediately started reaching her hand toward me."),
      sf(
        "mystery",
        "And you? You came for me too, didn't you?!",
        {
          bg: "/bg/cg/prologue/punished_girl_stretches.webp",
          bgSpeed: 50,
        },
        m.sfx("metal_chain", 1),
      ),
      say("mystery", "You want to grab me too?!"),
      nfx(
        "I started backing away, but she had already grabbed onto my hoodie.",
        {
          bg: "/bg/cg/prologue/punished_girl_grab.webp",
          bgSpeed: 50,
        },
        m.sfx("clothes_grab", 1),
      ),
      say("ren", "What the fuck, let go!"),
      n(
        "But she wasn't listening and kept crawling closer, pulling the chain taut.",
      ),
      nfx(
        "Thwack. An umbrella struck the back of my head.",
        m.sfx("hit_umbrella", 1),
        { shake: "medium" },
        {
          anim: "psychoShake",
          bg: "/bg/cg/prologue/punished_girl_letgo.webp",
          bgSpeed: 50,
        },
      ),
      n("The girl let go of me and returned to her spot."),
      sf(
        "kagami",
        "Ren, step away from the trash.",
        m.show("kagami", "angry", "center"),
        { bg: "/bg/locations/synsu_entrance.webp" },
      ),
      say("ren", "Ow..."),
      n("This..."),
      say("ren", "This is fucked up..."),
      n("Kagami grabbed my hand and dragged me away."),
      sf(
        "kagami",
        "Who told you to go wandering around? We're going to the assessment.",
        m.show("kagami", "tired", "center"),
      ),
      n(
        "She expects me to just forget about it? As we walked, I tried to clear my head.",
      ),
    ],
    next: "quiz_intro",
  },

  help_girl: {
    id: "help_girl",
    lines: [
      nfx("This... is a nightmare. I examine the chain.", {
        bg: "/bg/cg/prologue/punished_girl_help.webp",
        bgSpeed: 50,
      }),
      say("ren", "Hey, who did this to you?"),
      n(
        "The chain is fastened tight to the post and runs straight to the collar around her neck.",
      ),
      say(
        "ren",
        "H-hey, don't stay quiet. Do you know where the key is? How do I free you?",
      ),
      sf(
        "mystery",
        "The key? Hmm... Nobody knows where the keys are. Otherwise my friends...",
        { bg: "/bg/cg/prologue/punished_girl_lookup_talk.webp", bgSpeed: 50 },
      ),
      sf("mystery", "Would have freed me! Ahahah!", {
        bg: "/bg/cg/prologue/punished_girl_laugh.webp",
        bgSpeed: 50,
      }),
      n("I was thrown off by her laughter."),
      say("ren", "How do I help you?"),
      sf("mystery", "You want to help me, boy?", {
        bg: "/bg/cg/prologue/punished_girl_lookup_talk.webp",
        bgSpeed: 50,
      }),
      n("She slowly spread her legs."),
      sf("mystery", "Lick.", m.sfx("metal_chain", 1), {
        bg: "/bg/cg/prologue/punished_girl_spred.webp",
        bgSpeed: 50,
        dialogStyle: "transparent",
      }),
      say("ren", "...What?"),
      say("mystery", "Clean me up real good."),
      say("mystery", "I really need that right now."),
    ],
    choices: [
      {
        text: "Lick her",
        effects: { dominance: 2, sanity: -3 },
        next: "lick_reaction",
      },
      { text: "Recoil", next: "recoil_reaction" },
    ],
  },

  lick_reaction: {
    id: "lick_reaction",
    lines: [
      n("I tried to look away, but couldn't. My gaze fell on her wet crotch."),
      n("She's aroused... And her pussy is clearly well-used."),
      n("The girl lies there with her tongue hanging out."),
      nfx("Oh... My dick... It's reacting.", m.sanity(-10)),
      sf(
        "kagami",
        "REN!",
        m.show("kagami", "angry", "center"),
        {
          bg: "/bg/locations/synsu_entrance.webp",
          dialogStyle: "normal",
        },
        { shake: "medium" },
      ),
      n("A sharp tug on my arm yanked me back to reality."),
    ],
    next: "dragged_away",
  },

  recoil_reaction: {
    id: "recoil_reaction",
    lines: [
      n("Jesus, what the hell is wrong with her?!"),
      say("ren", "No way in hell! What the fuck are you even..."),
      sf(
        "kagami",
        "REN!",
        m.show("kagami", "angry", "center"),
        {
          bg: "/bg/locations/synsu_entrance.webp",
          dialogStyle: "normal",
        },
        { shake: "medium" },
      ),
      n("A sharp tug on my arm cut me off."),
    ],
    next: "dragged_away",
  },

  dragged_away: {
    id: "dragged_away",
    lines: [
      sf(
        "kagami",
        "Who gave you permission to wander off? We're leaving.",
        m.show("kagami", "tired", "center"),
      ),
      n(
        "She dragged me away like a dog that had gotten into trouble.",
        m.sfx("walking", 1),
      ),
      n("She wants me to forget what I saw? That's insane..."),
      n("We walked for another minute before reaching a small annex."),
    ],
    next: "quiz_intro",
  },

  quiz_intro: {
    id: "quiz_intro",
    hideCharacter: "kagami",
    bg: "/bg/common/quiz_room.webp",
    lines: [
      nfx("We stepped inside... A sterile place. White walls.", {
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
      n("They mirror this room."),
      n("Two desks face each other and a single board."),
      say("kagami", "Take a seat."),
      n("A sheet of paper and a pen already wait on the desk."),
      say("kagami", "Don't flip the paper yet."),
      nfx(
        "I sat down.",
        { bg: "/bg/common/quiz_room_noKagami.webp" },
        m.sfx("chair_sitting", 1),
      ),
      nfx(
        "Kagami folded our umbrellas into the basket and sat across from me.",
        {
          bg: "/bg/common/quiz_room_kagamiSpeak.webp",
          bgSpeed: 50,
          ...m.sfx("highHeels_walking", 1),
        },
      ),
      say(
        "kagami",
        "The rules are simple. You have 20 minutes to answer 8 questions.",
      ),
      say("kagami", "To pass, at least 4 must be correct."),
      say(
        "kagami",
        "When you're done — put the pen on the desk and raise your hand.",
      ),
      say(
        "kagami",
        "There are no other students here, but the golden rule of every test or exam is silence.",
      ),
      say("kagami", "The moment you flip the paper — the timer starts."),
      say("kagami", "Questions?"),
      n("I think just one. The obvious one."),
      say("ren", "What if I don't answer?"),
      say("kagami", "You'll fail the test and go back where you came from."),
      n("No, that's not an option..."),
    ],
    interactables: [
      {
        type: "look",
        label: "Flip the paper",
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
        "Question 1: Which hormone is responsible for shaping submissive behavior under prolonged social pressure?",
        m.sfx("paper_turn", 1),
      ),
      n("A) Cortisol"),
      n("B) Oxytocin"),
      n("C) Testosterone"),
      n("D) Serotonin"),
      n("....."),
      n("The hell...?"),
    ],
    choices: [
      { text: "Write an answer", next: "quiz_q1_pick" },
      {
        text: "Ask Kagami",
        effects: { dominance: 1 },
        next: "quiz_q1_warn",
      },
    ],
  },

  quiz_q1_warn: {
    id: "quiz_q1_warn",
    bg: "/bg/common/quiz_room_kagamiSpeak.webp",
    lines: [
      say("ren", "Kagami-sen..."),
      nfx(
        "Kagami knocked on the desk. Not hard, not out of anger — just enough to shut me up.",
        { shake: "medium" },
        m.sfx("table_hit", 1),
      ),
      say("kagami", "Break the rule again and you fail."),
      n(
        "Have you even read these questions? Is this a setup? Did she mix up the papers?",
      ),
      n("… Fine, nothing I can do right now."),
    ],
    next: "quiz_q1_pick",
  },

  quiz_q1_pick: {
    id: "quiz_q1_pick",
    bg: "/bg/common/quiz_room_paper.webp",
    lines: [n("I'm guessing.")],
    choices: [
      { text: "A) Cortisol", next: "quiz_q2" },
      {
        text: "B) Oxytocin",
        action: () => {
          state.temp.quizScore++;
        },
        next: "quiz_q2",
      }, // ✅
      { text: "C) Testosterone", next: "quiz_q2" },
      { text: "D) Serotonin", next: "quiz_q2" },
    ],
  },

  quiz_q2: {
    id: "quiz_q2",
    lines: [
      n(
        "Question 2: Which indicator is the least reliable for assessing genuine consent?",
        m.sfx("writing", 1),
      ),
      n("A) Verbal 'yes'"),
      n("B) Body posture"),
      n("C) Pulse / breathing"),
      n("D) Sequence of actions after the event"),
      n(
        "… So that wasn't the only question like that? I could solve a quadratic equation, but what even is this?!",
      ),
      nfx(
        "I glanced up at Kagami. She's just staring at her phone. Does she even know these aren't academic questions?",
        { bg: "/bg/common/quiz_room_kagamiPhone.webp" },
      ),
      n("No reaction from her. She's just keeping order."),
    ],
    choices: [
      {
        text: "Keep staring",
        action: () => setFlag("kagamiStare"),
        effects: { dominance: 3 },
        next: "quiz_q2_stare",
      },
      { text: "Move on to the answer", next: "quiz_q2_pick" },
    ],
  },

  quiz_q2_stare: {
    id: "quiz_q2_stare",
    lines: [
      n(
        "Hmph. If you're just going to sit there and not even warn me about questions like these, I figure I'm entitled to a little payback.",
        { action: () => audioMacros.fadeToStem("muffled", 1000) },
      ),
      nfx("I let my gaze drift to her chest beneath the red blouse.", {
        bg: "/bg/cg/prologue/quiz_room_boobs.webp",
        dialogStyle: "transparent",
      }),
      n("She's so full... damn."),
      n("What size is she even? Not less than a D-cup."),
      n("What would it feel like to touch them?"),
      n("Somebody in her life has definitely gotten their hands on them."),
      n(
        "I can clearly make out a dark bra peeking out from under her blouse...",
      ),
      n("Kagami, are you trying to seduce me?"),
      n(
        "My cock is hardening against my pants, but under the desk nobody can tell.",
      ),
      nfx("I let a small smile cross my face and looked her in the eyes.", {
        bg: "/bg/common/quiz_room_kagamiPhone.webp",
        dialogStyle: "normal",
      }),
      n(
        "Zero expression. She seems completely unbothered. No arousal, no disgust.",
      ),
      n("Shit, the time — right!", {
        action: () => audioMacros.fadeToStem("base", 1000),
      }),
    ],
    next: "quiz_q2_pick",
  },

  quiz_q2_pick: {
    id: "quiz_q2_pick",
    bg: "/bg/common/quiz_room_paper.webp",
    lines: [n("Alright. The answer is...")],
    choices: [
      {
        text: "A) Verbal 'yes'",
        action: () => {
          state.temp.quizScore++;
        },
        next: "quiz_q3",
      }, // ✅
      { text: "B) Body posture", next: "quiz_q3" },
      { text: "C) Pulse", next: "quiz_q3" },
      { text: "D) Sequence of actions after the event", next: "quiz_q3" },
    ],
  },

  quiz_q3: {
    id: "quiz_q3",
    lines: [
      n(
        "Question 3: Given identical starting conditions, the proportion of subjects who change their behavior following the first punishment (within 72 hours) is:",
        m.sfx("writing", 1),
      ),
      n("A) 18%"),
      n("B) 37%"),
      n("C) 61%"),
      n("D) 84%"),
      n(
        "What are they even talking about? I don't even want to think about it.",
      ),
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
        "Question 4: Which action amplifies the effect of coercion most effectively, all else being equal?",
        m.sfx("writing", 1),
      ),
      n("A) Explaining the reasons"),
      n("B) Removing choice in small matters"),
      n("C) Raising your voice"),
      n("D) Presence of witnesses"),
      n(
        "Each new question surprises me less than the last. Is this what students here actually study?",
      ),
    ],
    choices: [
      { text: "A) Explaining the reasons", next: "quiz_q5" },
      {
        text: "B) Removing choice in small matters",
        action: () => {
          state.temp.quizScore++;
        },
        next: "quiz_q5",
      }, // ✅
      { text: "C) Raising your voice", next: "quiz_q5" },
      { text: "D) Presence of witnesses", next: "quiz_q5" },
    ],
  },

  quiz_q5: {
    id: "quiz_q5",
    lines: [
      n(
        "Question 5: Which substance is used as the baseline agent in voluntary behavioral correction?",
        m.sfx("writing", 1),
      ),
      n("A) Midazolam"),
      n("B) Naltrexone"),
      n("C) Fluoxetine"),
      n("D) Synthetic oxytocin"),
      n(
        "Well, it doesn't matter. I was guessing before and I'm guessing now. Nothing's changed.",
      ),
    ],
    choices: [
      { text: "A) Midazolam", next: "quiz_q6" },
      { text: "B) Naltrexone", next: "quiz_q6" },
      { text: "C) Fluoxetine", next: "quiz_q6" },
      {
        text: "D) Synthetic oxytocin",
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
      nfx(
        "Question 6: Which state is most productive for the learner?",
        m.sfx("writing", 1),
      ),
      n("A) Calm and confidence"),
      n("B) Mild anxiety"),
      n("C) Acute fear"),
      n("D) Complete indifference"),
      n("This one feels easy. Almost reasonable."),
    ],
    choices: [
      { text: "A) Calm and confidence", next: "quiz_q7" },
      { text: "B) Mild anxiety", next: "quiz_q7" },
      {
        text: "C) Acute fear",
        action: () => {
          state.temp.quizScore++;
        },
        next: "quiz_q7",
      }, // ✅
      { text: "D) Complete indifference", next: "quiz_q7" },
    ],
  },

  quiz_q7: {
    id: "quiz_q7",
    lines: [
      n(
        "Question 7: The minimum threshold of pain stimulus for correcting behavioral deviation is:",
        m.sfx("writing", 1),
      ),
      n("A) 2–4 N/cm²"),
      n("B) 8–12 N/cm²"),
      n("C) 15–20 N/cm²"),
      n("D) Individual — no universal standard applies"),
      n("It's not even funny anymore."),
    ],
    choices: [
      { text: "A) 2–4 N/cm²", next: "quiz_q8" },
      { text: "B) 8–12 N/cm²", next: "quiz_q8" },
      { text: "C) 15–20 N/cm²", next: "quiz_q8" },
      {
        text: "D) Individual — no universal standard applies",
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
      n(
        "Question 8: You failed the test. What do you do?",
        m.sfx("writing", 1),
      ),
      n("A) Demand a retake"),
      n("B) Accept the result and follow the curator's instructions"),
      n("C) Leave the institution"),
      n("D) Contest the validity of the test"),
    ],
    next: () =>
      state.hero.stats.dominance >= -3 ? "quiz_q8_auto" : "quiz_q8_manual",
  },

  quiz_q8_auto: {
    id: "quiz_q8_auto",
    bg: "./bg/quiz_room.png",
    lines: [n("Contest the goddamn validity."), n("I circled D.")],
    next: "quiz_end_check",
  },

  quiz_q8_manual: {
    id: "quiz_q8_manual",
    lines: [n("Finally. Last question.")],
    choices: [
      { text: "A) Demand a retake", next: "quiz_end_check" },
      {
        text: "B) Accept the result and follow the curator's instructions",
        action: () => {
          state.temp.quizScore++;
        },
        next: "quiz_end_check",
      }, // ✅
      { text: "C) Leave the institution", next: "quiz_end_check" },
      { text: "D) Contest the validity of the test", next: "quiz_end_check" },
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
      n("I put the pen on the desk and raised my hand.", m.sfx("writing", 1)),
      nfx(
        "Kagami rose from her seat, walked over, and took the paper from my desk.",
        {
          bg: "/bg/common/quiz_room_noKagami.webp",
          ...m.sfx("highHeels_walking", 1),
        },
      ),
      n("She checks my answers without moving away."),
      n("I just sat there, still, listening to her breathe."),
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
  // ENDING 1: PASSED CLEAN
  // ============================================
  quiz_pass_clean: {
    id: "quiz_pass_clean",
    lines: [
      sf(
        "kagami",
        "Congratulations, you passed..",
        m.show("kagami", "neutral2", "center"),
        m.stopBgm(),
      ),
      n("She said it with a trace of sadness in her voice."),
      n("Is she disappointed that he passed?"),
      nfx(
        "Kagami opened the door and switched off the light.",
        m.fx({ darkness: 0.8, duration: 1000 }),
        m.sfx("light_switch", 1),
      ),
      sf("kagami", "Let's go, Ren. We'll continue the tour.", m.hide("kagami")),
    ],
    next: "corridor_intro",
  },

  // ============================================
  // ENDING 2: PASSED, BUT STARED
  // ============================================
  quiz_pass_stared: {
    id: "quiz_pass_stared",
    lines: [
      sf(
        "kagami",
        "Congratulations, you passed..",
        m.show("kagami", "neutral2", "center"),
        m.stopBgm(),
        { action: () => removeFlag("kagamiStare") },
      ),
      n("Did she say that with a slight smirk?"),
      nfx(
        "Kagami walked to her desk and picked up a thick metal ruler — about fifty centimeters long.",
        m.hide("kagami"),
        {
          bg: "/bg/common/quiz_room_kagamiRuler1.webp",
          ...m.sfx("highHeels_walking", 1),
        },
      ),
      say(
        "kagami",
        "But you violated my personal boundaries when you had the nerve to openly stare at me.",
      ),
      nfx("She stood directly in front of me, ruler in hand."),
      say("kagami", "Any desire to get on your knees and apologize right now?"),
    ],
    choices: [
      {
        text: "Get on my knees",
        effects: { dominance: -2, rank_score: -2 },
        next: "quiz_punishment_kneel",
      },
      {
        text: "Refuse",
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
        "My body moved on its own, reluctantly. I slid off the chair and sank to my knees in front of her.",
      ),
      say("ren", "Umm... I'm sorry, Kagami."),
      n(
        "Cold metal suddenly touched my chin. Kagami slid the end of the ruler under my jaw and forced my head up.",
      ),
      say("kagami", "Look me in the eyes, Ren. Not at my chest."),
      n(
        "Her voice is completely detached. She isn't even touching me with her hands.",
      ),
      n(
        "The feeling that I'm so beneath her she'd rather use a tool than make contact.",
      ),
      say(
        "kagami",
        "You are rank D. Common trash. The fact that you drool over your curator only proves how primitive you are.",
      ),
      n("She pressed the ruler a little harder. The metal bit into my skin."),
      say("ren", "Agh..."),
      say(
        "kagami",
        "Remember this feeling of distance. It's a good lesson for you. Stand up.",
      ),
      nfx("She pulled the ruler away and set it back in its place.", {
        bg: "/bg/common/quiz_room.webp",
      }),
      n("Damn... My brain can't keep up with the situation..."),
      nfx("But for some reason my cock only got harder.", m.sanity(-5)),
      say("kagami", "Ren, whenever you're ready, let's move on."),
      n(
        "I got up off my knees and brushed myself off. My heart is still pounding.",
      ),
      n(
        "Kagami switched off the light.",
        m.fx({ darkness: 0.8, duration: 1000 }),
        m.sfx("light_switch", 1),
      ),
      n("Am I supposed to just act like none of that happened?"),
    ],
    next: "corridor_intro",
  },

  // ============================================
  // ENDING 3: FAILED
  // ============================================
  quiz_fail: {
    id: "quiz_fail",
    lines: [
      n(
        "I was quietly waiting for the results when I felt Kagami place her foot on my chair.",
        { ...m.stopBgm() },
      ),
      say("ren", "Kagami-sens.."),
      sf(
        "ren",
        "Agh!",
        { shake: "medium", ...m.sfx("falling_chair", 1) },
        { ...m.fx({ darkness: 1, noise: 0, duration: 500 }) },
      ),
      n("She shoved me, and I crashed to the floor along with the chair."),
      nfx(
        "Kagami stood over me, legs on either side.",
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
      say("ren", "What the f— What are you doing?!"),
      say("kagami", "Ren Amano, you failed the test."),
      say(
        "kagami",
        "You showed yourself to be weak within the first minutes of your arrival.",
      ),
      say(
        "kagami",
        "You'll be sent back to your school, where the police will be waiting for you.",
      ),
      sf("kagami", "Your life ends here.", { effects: { sanity: -5 } }),
      n("…Is it over already?", m.fx({ darkness: 1, duration: 500 })),
      n("Is it really ending just like that?"),
      nfx(
        "Without me...",
        { bg: "/bg/common/rin.webp" },
        { ...m.fx({ vignette: 1, duration: 1500 }) },
        { action: () => audioMacros.fadeToStem("muffled", 1000) },
      ),
      n("Rin.", m.fx({ darkness: 0, duration: 500 })),
      n("What will they do to her if I don't come back?"),
      n("None of this was supposed to go this far."),
      sf(
        "kagami",
        "Don't be upset, Ren Amano. I have an option for people like you.",
        { bg: "/bg/cg/prologue/quiz_room_kagami.webp" },
        { ...m.fx({ vignette: 0, duration: 3000 }) },
        { action: () => audioMacros.fadeToStem("base", 1000) },
      ),
      say("ren", "… I'm listening."),
      n(
        "Kagami took off her right heel and brought her foot right up to my face.",
      ),
      sf("kagami", "Lick.", {
        bg: "/bg/cg/prologue/quiz_room_footLicking1.webp",
        bgSpeed: 50,
        dialogStyle: "transparent",
      }),
      say("ren", "Lick?"),
      say(
        "kagami",
        "Stop wasting my time. Right now you're trash that needs to pay for its failure.",
      ),
      say("kagami", "Lick, or go straight into the arms of the police."),
    ],
    choices: [
      {
        text: "Run my tongue along her sole",
        effects: { dominance: -10 },
        next: "quiz_fail_lick",
      },
      {
        text: "Kagami, go to hell",
        req: { dominance: { min: 10 } },
        effects: { dominance: 5 },
        next: "quiz_fail_reject",
      },
    ],
  },

  quiz_fail_lick: {
    id: "quiz_fail_lick",
    lines: () => [
      n("…I can't believe I'm doing this.", {
        action: () => audioMacros.fadeToStem("muffled", 1000),
      }),
      nfx("I slowly bring my face toward her foot and stick out my tongue.", {
        bg: "/bg/cg/prologue/quiz_room_footLicking2.webp",
        bgSpeed: 50,
      }),
      n(
        "The taste hits immediately — warm skin, leather shoes, and the faint scent of her lotion.",
      ),
      nfx("I barely pressed my tongue to the nylon and gave a small stroke."),
      say("kagami", "Are you serious?"),
      say("kagami", "Is that how you beg for mercy?"),
      n("She pushed the tip of her foot a little harder against my tongue."),
      nfx("Her thumb ended up against my lips.", {
        bg: "/bg/cg/prologue/quiz_room_footLicking3.webp",
        bgSpeed: 50,
      }),
      say("kagami", "That's it. Work each little toe properly, one by one."),
      nfx("What the actual hell...", { ...m.sanity(-5) }),
      n("God forbid anyone walks in."),
      n("…"),
      n("…"),
      n("I've been licking for a minute already. When is she going to stop?"),
      say("kagami", "More, Ren. Harder!"),
      n("I actually started trying to satisfy what she wanted."),
      n("I began licking her toes even faster."),
      n("But as utterly insane as this is..."),
      n("My cock…"),
      nfx("It's straining against my pants.", { ...m.sanity(-1) }),

      ...(getFlag("kagamiStare")
        ? [
            sf(
              "kagami",
              "Come on, Ren, put in the effort. You enjoyed staring at me freely, didn't you? You like the taste, don't you?",
              { bg: "/bg/cg/prologue/quiz_room_kagamiSmirk.webp", bgSpeed: 50 },
            ),
            n("Well, I really was staring."),
            n("But is this a proportionate punishment?"),
            n("I didn't want it to go this far!"),
          ]
        : []),

      nfx(
        "Kagami pulled her foot away for a moment.",
        { bg: "/bg/cg/prologue/quiz_room_footLicking4.webp", bgSpeed: 50 },
        {
          action: () => {
            removeFlag("kagamiStare");
            audioMacros.fadeToStem("base", 1000);
          },
        },
      ),
      n("A thread of saliva stretched from her sole to my lips."),
      n("Disgusting..."),
      n(
        "Her black nylon sock... Soaked through... I can see the red nail polish on her toes through the fabric.",
      ),
      say("ren", "Why do you even allow yourself to do things like this?"),
      nfx(
        "Her foot is back at my mouth.",
        { bg: "/bg/cg/prologue/quiz_room_footLicking3.webp" },
        { action: () => audioMacros.fadeToStem("muffled", 1000) },
      ),
      n("I slowly trace circles around it with my tongue."),
      say("kagami", "I can tell you're enjoying this, aren't you, Ren?"),
      say("ren", "Mmph.."),
      n(
        "For another two minutes the room was filled with nothing but wet sounds and my muffled groans.",
      ),
      n("But it felt much longer than that."),
      n(
        "I honestly can't decide what scares me more — the situation, or my own hard-on.",
      ),
      nfx("Humiliation and lust are tearing me apart.", { ...m.sanity(-5) }),
      n("Kagami finally pulled her foot out. I started catching my breath.", {
        ...m.stopBgm(),
      }),
      sf(
        "kagami",
        "That's enough. Fine — the test will be counted as passed.",
        { bg: "/bg/cg/prologue/quiz_room_kagami.webp", dialogStyle: "normal" },
      ),
      say(
        "kagami",
        "Though I'm not sure how much that matters when you're already lying pathetically on the floor.",
      ),
      nfx(
        "Kagami removed both socks — even the one she hadn't used — and tossed them in the bin.",
        { bg: "/bg/common/quiz_room.webp" },
      ),
      nfx(
        "Then she turned off the light, opened the door, and walked out with her umbrella.",
        { ...m.fx({ darkness: 0.8, noise: 0, duration: 500 }) },
        { ...m.sfx("light_switch", 1) },
      ),
      say("kagami", "Let's keep moving."),
      n("I got up and dusted myself off."),
      n("She expects me to just forget this, same as the girl outside?"),
    ],
    next: "corridor_intro",
  },

  // ============================================
  // === EASTER EGG: TIMER EXPIRED ===
  // ============================================
  quiz_afk_fail: {
    id: "quiz_afk_fail",
    bg: "./bg/quiz_room.png",
    lines: [
      nfx(
        "A whole 20 minutes AFK?",
        nfx("A whole 20 minutes AFK?", {
          audio: [
            { type: "stop_sfx", id: "muffled_rain", fade: 50 },
            { type: "stop", fade: 1000 },
          ],
        }),
      ),
      n("Timer's up, you absolutely blew it!"),
      n("But honestly... you actually won, because you ascended to heaven,"),
      n(
        "And found a pack of extremely hot Kagami pics. Non-canon, by the way.",
      ),
      n(
        "But go ahead and give your little guy a proper workout to a mature lady.",
      ),
      n(
        "You were walking through heaven and suddenly stumbled upon a small photo album, which you immediately opened:",
      ),
      nfx(" ", {
        bg: "/bg/common/kagami_bonus_1.webp",
        dialogStyle: "transparent",
      }),
      nfx(" ", { bg: "/bg/common/kagami_bonus_2.webp", bgSpeed: 50 }),
      nfx(" ", { bg: "/bg/common/kagami_bonus_3.webp", bgSpeed: 50 }),
      nfx(" ", { bg: "/bg/common/kagami_bonus_4.webp", bgSpeed: 50 }),
      nfx(" ", { bg: "/bg/common/kagami_bonus_5.webp", bgSpeed: 50 }),
      n("And leave a comment telling us which one was your favorite!"),
      n("Alright, I'll give you one more proper chance to replay.", {
        dialogStyle: "normal",
      }),
    ],
    next: "quiz_intro",
  },

  corridor_intro: {
    id: "corridor_intro",
    bg: "/bg/common/road_dorm.webp",
    lines: () => [
      nfx("We're outside.", {
        ...m.fx({ darkness: 0, duration: 1000 }),
        audio: [
          { type: "stop_sfx", id: "muffled_rain", fade: 50 },
          { type: "sfx", id: "rain", volume: 0.8, loop: true },
        ],
      }),
      n("I followed Kagami obediently."),
      say(
        "kagami",
        "Ren, we're heading to the dormitory now. That's where you'll be living.",
      ),
      n("I looked ahead through the rain."),
      n("I could make out three pretty grim-looking buildings."),
      n("One of them is behind a fence?"),
      nfx(
        "We walked in silence... I feel like I have so many questions, but I don't dare ask any of them right now.",
        m.fx({ darkness: 1, noise: 0, duration: 500 }),
      ),
      nfx(
        "And then we finally entered one of the buildings and stepped silently into the elevator.",
        {
          bg: "/bg/common/elevator_kagami.webp",
        },
      ),
      nfx("We rode up to the fourth floor in the same complete silence.", {
        ...m.fx({ darkness: 0, noise: 0, duration: 0 }),
        audio: [
          { type: "stop_sfx", id: "rain", fade: 500 },
          { type: "sfx", id: "elevator", volume: 1, loop: true },
        ],
      }),
      n("Well, at least I can look around the elevator."),
      n(
        "The walls were covered in graffiti, the door was rusted, and the digital floor display wasn't working. This building feels... pretty neglected.",
      ),
      n("But one thing caught my eye — a small photo stuck to the wall."),
      nfx(
        "Some glasses-wearing girl with a nice figure had taken a photo of herself.",
        { bg: "/bg/common/elevator_photo.webp" },
      ),
      n("She was half-naked, but damn, no nipples visible."),
      say("ren", "Whoa…"),
      n("That sound just slipped out of me like an idiot."),
      n("But Kagami ignored it."),
      n(
        "I wanted to study the photo a little longer, but the elevator stopped and the doors opened.",
        {
          audio: [
            { type: "stop_sfx", id: "elevator", fade: 500 },
            { type: "sfx", id: "elevator_door", volume: 1 },
          ],
        },
      ),
      nfx(
        "We walked down the long dormitory hallway and stopped right in front of room 404.",
        {
          bg: "/bg/locations/dorm_hall.webp",
          ...m.sfxMix(["rain", 0.8, true], ["walking"]),
        },
      ),
      n("Kagami took out a key and unlocked the door."),
      nfx("Then the keys were handed over to me.", {
        ...m.show("kagami", "neutral", "center"),
        ...m.sfx("key_door"),
      }),
      say(
        "kagami",
        "Remember — you're in the second building, fourth floor, room 404.",
      ),
      n("I gave a small nod, and we went inside together."),
      nfx("So this is my room.", m.hide("kagami"), {
        bg: "/bg/locations/dorm_renRoom.webp",
        audio: [
          { type: "stop_sfx", id: "rain" },
          { type: "sfx", id: "muffled_rain", volume: 0.5, loop: true },
          { type: "bgm", id: "Im Home", volume: 1 },
        ],
      }),
      n("A little bed, a desk, a mini kitchen."),
      n(
        "Nothing unusual, except for the bars on the window... and that camera in the corner.",
      ),
      n("Are you serious? Is someone going to watch me jerk off?"),
      n("I'll just cover it with something."),
      n(
        "While I was thinking, Kagami had already moved further in, sat down on the nearest chair with a creak, and crossed her legs.",
        m.sfx("chair_sitting"),
      ),

      ...(!getFlag("quizPassed")
        ? [
            nfx(
              "I couldn't help but glance down. Her bare feet were slipped straight into her heels. She did throw away her socks, after all.",
              {
                bg: "/bg/cg/prologue/dorm_kagami_noSocks.webp",
                dialogStyle: "transparent",
              },
            ),
          ]
        : [
            nfx(
              "I couldn't help but glance down. Black nylon hugged her feet closely.",
              {
                bg: "/bg/cg/prologue/dorm_kagami_withSocks.webp",
                dialogStyle: "transparent",
              },
            ),
          ]),

      say("kagami", "Ren, this school has spoken rules and unspoken ones."),
      say(
        "kagami",
        "The spoken rules you can always read on the board on the first floor of the school building.",
      ),
      say("kagami", "The unspoken ones you'll have to learn on your own."),
      say("kagami", "Because the best way to learn how to fight is to fight."),
      n("Is that so?"),
      n("What kind of unspoken rules?"),
      n("This school is clearly full of oddities."),
      say("kagami", "Here.", {
        bg: "/bg/cg/prologue/dorm_kagami_phone.webp",
      }),
      nfx("Kagami handed me a phone."),
      n("Looks ordinary enough, but there's no brand anywhere on it."),
      say(
        "kagami",
        "This phone is the single most important item in a student's life.",
      ),
      say(
        "kagami",
        "It's your student ID, your bank card, and at the same time a perfectly ordinary phone.",
      ),
      say(
        "kagami",
        "It has all the information you need about your academic performance and the school.",
      ),
      say(
        "kagami",
        "Through it, you'll at least be able to keep track of events in the world outside the school.",
      ),
      say(
        "kagami",
        "I think you'll figure everything out on your own within the first week.",
      ),
      say("kagami", "But be careful. Breaking the phone will cost you dearly."),

      ...(!getFlag("quizPassed")
        ? [n("By licking feet again?"), n("I don't want that.")]
        : []),

      ...(!getFlag("quizPassed")
        ? [
            say(
              "kagami",
              "This school has a strict hierarchy. From F-rank trash at the bottom to absolute S-rank elite at the top.",
              { bg: "/bg/cg/prologue/dorm_kagami_noSocks.webp" },
            ),
          ]
        : [
            say(
              "kagami",
              "This school has a strict hierarchy. From F-rank trash at the bottom to absolute S-rank elite at the top.",
              { bg: "/bg/cg/prologue/dorm_kagami_withSocks.webp" },
            ),
          ]),
      say("kagami", "You, like all newcomers, start at D-rank."),
      say(
        "kagami",
        "To keep from sinking to the very bottom, the bare minimum is: don't skip class, don't be late, and don't break the basic rules.",
      ),
      say("ren", "And to move up?"),
      say("kagami", "You need to be convenient and useful."),
      n("Be convenient... What does she mean by that?"),
      say(
        "kagami",
        "Ranks give you respect, authority, and access to restricted parts of the school.",
      ),
      say(
        "kagami",
        "The elite have their own territories, their own private 'parties'. If you show up uninvited — punishment awaits.",
      ),
      say(
        "kagami",
        "Just like in any school — behave badly and you're punished, behave well and you're rewarded. Questions?",
      ),
      say("ren", "The test I took..."),
      say(
        "ren",
        "Why were the questions like that? They weren't academic at all.",
      ),
      say("kagami", "Weren't they?"),
      say(
        "kagami",
        "In my view, we fairly tested your foundational knowledge for surviving here.",
      ),
      say("kagami", "Would you like to file an official complaint?"),
    ],
    choices: [
      {
        text: "File a complaint",
        effects: { dominance: 1 },
        next: "kagami_leaves",
      },
      {
        text: "Drop it and say nothing",
        effects: { dominance: -1 },
        next: "kagami_leaves",
      },
    ],
  },

  kagami_leaves: {
    id: "kagami_leaves",
    lines: [
      say("kagami", "I couldn't care less about your complaints."),
      say(
        "kagami",
        "D-rank is not permitted to address the administration. But of course you still think you matter here.",
      ),
      say("kagami", "Tomorrow is your first day of school. Get some sleep."),
      say(
        "kagami",
        "Your schedule and classroom are in the phone. I'll introduce you to everyone during homeroom.",
      ),
      say("ren", "You'll be introducing me?"),
      say("kagami", "Oh, right. I forgot to mention."),
      say(
        "kagami",
        "You were assigned before you even arrived. Class 2-B. I'm your homeroom teacher.",
      ),
      nfx(
        "She stood up and headed for the door. A faint trail of wine and her perfume lingered in the air.",
        { bg: "/bg/locations/dorm_renRoom.webp" },
      ),
      n("...", m.sfx("door_close")),
      say("ren", "Good… bye."),
      n("I didn't make it in time."),
      n("The clock reads 21:43."),
      n("I was dozing on the bus on the way here, but I feel terrible."),
    ],
    next: "tbc",
  },

  tbc: {
    id: "tbc",
    lines: () => [
      n(
        "Sure, I could check out the phone or look around, but not right now. I just want to sleep.",
      ),
      nfx("I stretched out on the bed. It's not bad, actually.", {
        ...m.fx({ darkness: 1, noise: 0, duration: 500 }),
        ...m.sfx("bed_creak"),
      }),
      n("Quite a day, heh."),
      nfx(
        "A naked girl at the entrance...",
        m.fx({ darkness: 0, noise: 0, duration: 500 }),
        { bg: "/bg/cg/prologue/punished_girl_laugh.webp" },
      ),
      n("Still can't believe what I saw."),

      ...(getFlag("sawChainedGirl")
        ? [
            n("She acted a little strange."),
            n("But she didn't chain herself up."),
            n(
              "It's strange to admit, but... they're probably doing a lot of awful things to her. And the school doesn't care?",
            ),
          ]
        : []),

      n("And then that strange test..."),

      ...(!getFlag("quizPassed")
        ? [
            nfx(
              "I don't even care about the questions anymore... I licked a teacher's feet.",
              {
                bg: "/bg/cg/prologue/quiz_room_footLicking2.webp",
              },
            ),
            n(
              "Kagami is beautiful, well-endowed. But she put me on the floor and made me lick her feet...",
            ),
          ]
        : []),

      nfx(
        "This brief arrival wore me out more than the entire rest of the day.",
        m.fx({ darkness: 1, noise: 0, duration: 500 }),
      ),
      n("What's waiting for me next?"),
      n(
        "I'm starting to think... the students and teachers here have been a little unhinged for a long time...",
      ),
      n(
        "Yeah..... I'm already drifting toward sleep... So beautiful and quiet... Far away from all of this...",
      ),
      n("Deeper..."),
    ],

    next: () => {
      const dialogWrapper = document.getElementById("dialog-wrapper");
      if (dialogWrapper) dialogWrapper.style.display = "none";

      window.startCredits([
        `END OF PART ONE OF THE PROLOGUE.<br /><br />
  <span style="color: #ff4d4d; font-size: 1.2rem; text-shadow: 0 0 10px rgba(255, 0, 0, 0.5);">
    This is how the story began.<br />
    There's only more filth ahead.<br />
    Will you walk this path?
  </span>`,
        `Credits:<br /><br />Game Director / Writer: V&Mai Studio<br />Code / Assistant: Mai (Perplexity AI)<br />Art: WAI Illustrious SDXL / Nano Banana 2`,
        `Get early access to updates and art. Vote on development decisions.<br />Chat directly with the developer.<br />
  <div class="credits-support-buttons">
    <a href="https://www.patreon.com/c/VMaistudio" target="_blank" class="support-btn patreon">
      <img src="icons/patreon.svg" alt="Patreon" style="width: 24px; height: 24px; filter: brightness(0) invert(1)" />
      Support on Patreon
    </a>
    <a href="https://boosty.to/vmaistudio" target="_blank" class="support-btn boosty">
      <img src="icons/boosty.svg" alt="Boosty" style="width: 24px; height: 24px; filter: brightness(0) invert(1)" />
      Support on Boosty
    </a>
  </div>`,
      ]);

      return null;
    },
  },
};

import { m, n, say, nfx, sf } from "../../macros.js";
import { setFlag, getFlag } from "../../../core/state.js";

export const story = {
  // ============================================
  // === MONDAY MORNING: ELEVATOR ===
  // ============================================
  monday_morning: {
    id: "monday_morning",
    bg: "./bg/locations/dorm_renRoom_rainingMorning.webp",
    lines: () => [
      m.dayTransition("MONDAY"),
      nfx(
        "Good morning to me.",
        m.fx({ darkness: 0, duration: 2000 }),
        m.audioMix(m.stopBgm(500), m.sfx("dorm_ambience", 0.5, true)),
        { dialogStyle: "normal" },
      ),
      n("Hope it really is good."),
      n(
        "I can see through the window that it's still overcast today, but at least it isn't raining.",
      ),

      // Dynamic insertion: if Kagami humiliated him
      ...(!getFlag("quizPassed")
        ? [
            n("I still can't believe I licked my teacher's feet yesterday."),
            n("I expected my life to change, but this is too much."),
          ]
        : []),

      n("A perfect chance to look around the room."),
      m.interact(
        {
          type: "look",
          label: "Bed",
          pos: { x: 25, y: 70 },
          lines: [
            n("The bed turned out to be pretty hard and uncomfortable."),
            n(
              "Then again, after yesterday, I could've fallen asleep on any piece of shit.",
            ),
          ],
        },
        {
          type: "look",
          label: "Window",
          pos: { x: 50, y: 40 },
          lines: [
            n("I ran my hands over the bars on the window."),
            n("What are they for?"),
            n("They make the room feel oppressive. Like I'm a prisoner."),
          ],
        },
        {
          type: "look",
          label: "Table and kitchenette",
          pos: { x: 70, y: 60 },
          lines: [
            n("A small table for eating."),
            n("Or for staring at those fucking bars."),
          ],
        },
        {
          type: "look",
          label: "Door",
          pos: { x: 90, y: 50 },
          lines: [
            n("This door leads to the bathroom."),
            n("There's... a bathtub, a sink, a washing machine, and a toilet."),
            n("Nothing fancy."),
          ],
        },
        {
          type: "look",
          label: "Camera",
          pos: { x: 75, y: 10 },
          lines: [
            n("A camera..."),
            n("Who's watching me? And why?"),
            n("I waved at it."),
            say("ren", "Just look away during my private moments."),
          ],
        },
        {
          type: "look",
          label: "Sheet of paper",
          pos: { x: 98, y: 35 },
          lines: [
            n("It's a sheet with the residence rules."),
            m.choice(
              {
                text: "Read the pointless list.",
                lines: [
                  n(
                    "1. The student bears full responsibility for the condition of their assigned room.",
                  ),
                  n(
                    "2. If a malfunction is discovered, the student must report it through their phone.",
                  ),
                  n(
                    "3. The room's resident is responsible for the actions of any student they invite inside.",
                  ),
                  n(
                    "4. The cost of cleaning, repairs, and remedying violations is automatically deducted from the resident's account.",
                  ),
                  n(
                    "5. Failure to read the rules does not exempt a student from punishment.",
                  ),
                ],
              },
              {
                text: "Don't waste time.",
              },
            ),
          ],
        },
        { type: "exit", label: "Finish", pos: { x: 50, y: 95 } },
      ),
      n("That's enough."),
      nfx("Along with this room, I also got a phone.", {
        pdaUnlocked: true,
      }),
      n("I can take a look at that too."),
      n("The room has everything I need for the bare essentials."),
      nfx("I left my room and walked to the elevator."),
      nfx(
        "...",
        { bg: "./bg/common/elevator_students.webp" },
        m.sfxMix(["elevator_door", 0.5], ["elevator", 1, true]),
      ),

      n("Four students were already inside."),
      n("Hmm. So they really don't wear school uniforms here."),
      n("I stepped inside, and the elevator kept going."),

      sf(
        "student_angry",
        "Fucking Mai! She acted like a stupid bitch!",
        m.show({
          id: "student_angry",
          src: "/chars/minorCharacters/angryGirl_angry.webp",
          name: "Angry Student",
          position: "left",
          anim: "slideInLeft",
        }),
        m.psychoShake("student_angry"),
      ),
      n(
        "Whoa. One of the girls suddenly started yelling, not the least bit bothered by my presence.",
      ),
      sf(
        "student_dumb",
        "I doubt she jumped her without thinking. Someone must've put her up to it.",
        m.show({
          id: "student_dumb",
          src: "/chars/minorCharacters/dumbBoy_natural.webp",
          name: "Dim-Witted Student",
          position: "right",
          anim: "slideInRight",
        }),
      ),
      say(
        "student_angry",
        "Oh, shut up. You're the last person who should talk about not thinking.",
      ),
      n("Is this how students talk to each other here?"),

      sf(
        "student_shy",
        "She deserved it, though. She's been chained up for four days already. Maybe we should check on her?",
        m.show({
          id: "student_shy",
          src: "/chars/minorCharacters/shyGirl_natural.webp",
          name: "Shy Girl",
          position: "center",
          anim: "fadeInUp",
        }),
      ),
      sf(
        "student_angry",
        "No, Ayane. That's a fucking awful idea.",
        m.show({
          id: "student_angry",
          src: "/chars/minorCharacters/angryGirl_embrassed.webp",
          name: "Angry Student",
          position: "left",
        }),
      ),
      say("student_shy", "Why?"),
      sf(
        "student_angry",
        "If Celeste sees us...",
        m.show({
          id: "student_angry",
          src: "/chars/minorCharacters/angryGirl_blush.webp",
          name: "Angry Student",
          position: "left",
        }),
      ),

      n("For some reason, she said that name quietly."),

      sf(
        "student_crazy",
        "Then we're all royally fucked!! Ahaha!",
        m.show({
          id: "student_crazy",
          src: "/chars/minorCharacters/clownGirl_natural.webp",
          name: "Crazy Girl",
          position: "center",
          anim: "slideInLeft",
        }),
        m.psychoShake("student_crazy"),
      ),
      n(
        "This one, on the other hand, burst out laughing loud enough to fill the elevator.",
      ),

      n(
        "I searched for the nearest spot to stare at until the ride was over...",
      ),
      nfx(
        "And immediately found that interesting photo of the bespectacled girl I'd seen yesterday.",
        { bg: "./bg/common/elevator_photoCum.webp" },
        m.hideAll(),
      ),
      n("Except..."),
      n("The photo was now covered in a dried white substance."),
      nfx(
        "I don't know exactly what it is, but it looks an awful lot like semen. I really hope it's paint.",
        m.sanity(-2),
      ),

      sf(
        "student_dumb",
        "I wonder what she means by “fucked.” Like, are we gonna eat her out?",
        { bg: "./bg/common/elevator_students.webp" },
        m.show({
          id: "student_dumb",
          src: "/chars/minorCharacters/dumbBoy_tongue.webp",
          name: "Dim-Witted Student",
          position: "right",
          anim: "slideInLeft",
        }),
      ),
      sf(
        "student_angry",
        "God, Kento, not even a homeless woman in the Pit would let you eat her out!",
        m.show({
          id: "student_angry",
          src: "/chars/minorCharacters/angryGirl_exhale.webp",
          name: "Angry Student",
          position: "left",
          anim: "slideInLeft",
        }),
      ),
      sf(
        "student_crazy",
        "Why don't you go hire a hooker, loser?",
        m.show({
          id: "student_crazy",
          src: "/chars/minorCharacters/clownGirl_smirk.webp",
          name: "Crazy Girl",
          position: "center",
        }),
      ),
      say("student_angry", "Even Reiko won't let you!"),

      nfx(
        "The elevator arrived, and I stepped out.",
        m.audioMix(m.stopSfx("elevator", 500), m.sfx("elevator_door", 0.5)),
        m.hideAll(),
        m.fx({
          darkness: 1,
          duration: 100,
        }),
      ),

      n("What the hell did I just hear?!"),

      nfx(
        "Though I wouldn't have minded hearing more. They were talking about her, weren't they?",
        { bg: "/bg/cg/prologue/punished_girl_main.webp" },
        m.fx({
          vignette: 1,
          darkness: 0,
          duration: 300,
        }),
      ),
      n(
        "Yesterday, I saw a naked student chained up right by the school entrance.",
      ),
      n("I still can't make any sense of it."),
    ],
    next: "school_courtyard",
  },

  // ============================================
  // === PATH TO SCHOOL AND SHOE LOCKERS ===
  // ============================================
  school_courtyard: {
    id: "school_courtyard",
    bg: "./bg/locations/shinshu_wayTo.webp",
    lines: [
      nfx(
        "I'm outside...",
        m.fx({ vignette: 0, duration: 1000 }),
        m.bgm("A Morning Where Nothing Happens", 0.5),
      ),
      n("I took a deep breath. The air smelled of ozone after the rain."),
      n("I walked slowly along the path to school."),
      n(
        "I've never had a problem with being late. Even in this dump they forced me into, I still get up on time.",
      ),
      n(
        "Students were everywhere, walking toward the main building just like me...",
      ),
      n("Are they all walking in groups?"),
      n("Seriously, isn't there a single loner like me?"),
      n("Maybe people really do form friendships here after all?"),
      nfx(
        "I entered the school and was immediately greeted by rows of shoe lockers.",
        { bg: "./bg/locations/enterance_lockers.webp" },
        m.sfx("school_door", 1),
      ),
      n(
        "Right... Indoor shoes... They don't have school uniforms here, but they still won't let us walk around in dirty shoes, will they?",
      ),
      n("But which one is mine?!"),
      n("My eyes darted back and forth. I froze."),

      n(
        "Then a ray of hope walked right up to me... and flicked me on the forehead.",
      ),
      sf(
        "ren",
        "Ow! What was that for?!",
        m.psychoShake("ren"),
        m.audioMix(m.stopBgm(100), m.sfx("finger_flick")),
      ),
      sf(
        "shiroko",
        "Why are you standing around? You're in everyone else's way.",
        m.show("shiroko", "angry", "center"),
        m.bgm("Invite for a punishment", 0.8),
      ),
      n(
        "She was another teacher. She seemed about Kagami's age, but judging by her outfit...",
      ),
      n("Is she the PE teacher?"),

      say("ren", "Hello. I'm new, and I... don't know which locker is mine."),

      sf(
        "shiroko",
        "The new student? Ah... So you're the one. Barging in halfway through the term.",
        m.show("shiroko", "shocking", "center"),
      ),
      say(
        "shiroko",
        "Open your profile on your phone. Your locker number is listed next to your room number.",
      ),
      say(
        "shiroko",
        "Just walk up to it and hold your phone against the lock. The locker will open.",
      ),

      say("ren", "Why put that information in a student's profile?"),
      sf(
        "shiroko",
        "Because the phone and locker are tightly linked, so nobody but you can get inside. Students often leave important things in them.",
        m.show("shiroko", "neutral", "center"),
      ),
      n("I see... But blame Kagami for not telling me, not me!"),

      say("ren", "Thank you."),

      nfx("I walked over to the rows of lockers.", m.hide("shiroko")),

      m.interact(
        {
          id: "locker_12",
          type: "look",
          label: "12",
          pos: { x: 8, y: 62 },
          lines: [
            n("I held my phone to the lock. It didn't open."),
            n(
              "Maybe I should open my phone and check my locker number first, huh?!",
            ),
          ],
        },

        {
          id: "locker_21",
          type: "look",
          label: "21",
          pos: { x: 5, y: 50 },
          lines: [
            n("I held my phone to the lock. It didn't open."),
            n(
              "Maybe I should open my phone and check my locker number first, huh?!",
            ),
          ],
        },

        {
          id: "locker_29",
          type: "look",
          label: "29",
          pos: { x: 13, y: 65 },
          lines: [
            n("I held my phone to the lock. It didn't open."),
            n(
              "Maybe I should open my phone and check my locker number first, huh?!",
            ),
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
            n("I held my phone to the lock. It didn't open."),
            n(
              "Maybe I should open my phone and check my locker number first, huh?!",
            ),
          ],
        },

        {
          id: "locker_37",
          type: "look",
          label: "37",
          pos: { x: 17.5, y: 88 },
          lines: [
            n("I held my phone to the lock. It didn't open."),
            n(
              "Maybe I should open my phone and check my locker number first, huh?!",
            ),
          ],
        },
      ),
      n("I held my phone against the lock on locker No. 34."),
      nfx("The locker opened. Empty.", m.sfx("locker_open")),
      n("Fine, I'll just ask that teacher."),
      sf(
        "ren",
        "Excuse me, where can I get indoor shoes on my first day?",
        m.show("shiroko", "neutral", "center"),
      ),

      sf(
        "shiroko",
        "So you don't have indoor shoes, and you came here to dirty the halls?",
        m.show("shiroko", "angry", "center"),
      ),
      say(
        "shiroko",
        "You were supposed to go buy a pair from the store yourself.",
      ),
      say("ren", "Huh? Why didn't my homeroom teacher tell me?"),

      n("She started walking straight toward me."),

      sf(
        "shiroko",
        "Blaming your homeroom teacher?",
        m.show("shiroko", "mockery", "center"),
      ),
      nfx(
        "My back hit the wall as her hands shot past my head by mere millimeters.",
        { bg: "./bg/cg/prologue/shiroko_kabedo.webp" },
        m.audioMix(m.sfx("kadedo"), m.sfx("heartbeat_short")),
        m.psychoShake("ren"),
        m.hide("shiroko"),
      ),

      say(
        "shiroko",
        "Well, since you're new, I'll let it slide. But not for free.",
      ),
      say(
        "shiroko",
        "Come to the gym after school. I'll personally show you where and how to buy shoes.",
      ),
      say("shiroko", "We'll start with theory, then move on to practice."),
      n("What's with that smile... Another batshit-crazy teacher?"),
      n("Is there anyone sane in this school?!"),

      nfx("She stepped away from me.", m.show("shiroko", "neutral", "center"), {
        bg: "./bg/locations/enterance_lockers.webp",
      }),

      say(
        "shiroko",
        "Anyway, I'll be waiting. You can find the gym on your phone.",
      ),
      sf(
        "shiroko",
        "And don't even consider not showing up. A teacher's word is law, understood? You're far too inexperienced to deal with the consequences of disobedience.",
        m.show("shiroko", "angry", "center"),
      ),
      nfx("I silently closed the locker and moved on.", m.hide("shiroko")),
      nfx(
        "Goddammit, dick, stop getting hard over shit like this.",
        m.sanity(-1),
      ),
    ],
    next: "class_enter",
  },

  // ============================================
  // === ENTERING THE CLASSROOM ===
  // ============================================
  class_enter: {
    bg: "./bg/locations/2B_coridor.webp",
    lines: [
      sf(
        "ren",
        "My next stop is Classroom 2-B on the school's second floor.",
        m.audioMix(m.sfx("walking"), m.stopBgm()),
      ),
      n(
        "I can hear students talking behind the door. Is the classroom already almost full?",
      ),
      n("I walk in."),
      nfx(
        "I immediately see Kagami and my classmates.",
        {
          bg: "./bg/locations/2B_class.webp",
        },
        m.sfx("door_close"),
      ),
      nfx(
        "Kagami turns her head toward me. Her gaze is as emotionless as it was yesterday.",
        m.show("kagami", "neutral2", "center"),
      ),
      say(
        "kagami",
        "Quiet, everyone! We have a new addition. Please introduce yourself.",
      ),
      nfx(
        "The room falls silent at once. Everyone stares at me.",
        m.hide("kagami"),
      ),
      say(
        "ren",
        "Hello, everyone. My name is Ren Amano. I look forward to studying with you.",
      ),
      n("I hope that sounded okay."),
      sf(
        "kagami",
        "Yes, we're all going to be just “delighted” to spend time with you too.",
        m.show("kagami", "tired", "center"),
      ),
      n("She could've spared me the sarcasm."),

      sf(
        "kagami",
        "Remember this, Ren Amano: when introducing yourself to anyone in this school, state your rank first and your name second. Try again. This is your last chance.",
        m.show("kagami", "neutral", "center"),
      ),
      n("Is rank really that important?"),
      sf("ren", "D-rank, Ren Amano. Nice to meet you.", m.hide("kagami")),
      n("The class doesn't react at all."),
      n("They simply turn away and go back to whatever they were doing."),

      sf(
        "kagami",
        "Good. Now let's decide where you'll sit...",
        m.show("kagami", "neutral2", "center"),
      ),
      say("kagami", "There's an open seat over there, next to Kaira."),
      nfx("I scan the room for the empty seat.", m.hide("kagami")),
      nfx("There it is. By the window. I can see my seatmate.", {
        bg: "./bg/cg/prologue/2B_kairaMain.webp",
      }),
      say("kagami", "Sit next to her, Ren."),

      say("kaira", "Come on over, newbie."),
      n("Her voice is pretty rough for a girl."),
      say("kaira", "Come on~"),
      nfx("The dark-haired girl with the short haircut must be Kaira.", {
        action: () => setFlag("knowsKaira"),
      }),
      nfx("I head to my seat. Nobody is watching me.", m.sfx("walking")),
      n("I give Kaira a quick once-over."),
      n("Long earrings, a black T-shirt with red lettering."),
      nfx(
        "Under the desk, I can see her black-stockinged legs in sneakers...",
        {
          bg: "./bg/cg/prologue/2B_kairaSneakers.webp",
        },
      ),
      n("Or are those tights?"),
      nfx("I raise my eyes to Kaira's face. Oh, fuck...", {
        bg: "./bg/cg/prologue/2B_kairaCloseUp.webp",
      }),
      n("And what exactly is that look supposed to mean?"),

      sf(
        "kaira",
        "How long are you planning to stare at my legs?",
        m.psychoShake("ren"),
      ),
      say("ren", "Oh. Sorry."),
      nfx(
        "I sit down at my desk.",
        {
          bg: "./bg/locations/2B_classKagami.webp",
        },
        m.sfx("chair_sitting"),
      ),
      n(
        "Kaira isn't exactly giving off a friendly aura... Should I try talking to her?",
      ),

      nfx("The bell rings.", m.sfx("school_bell")),
      n("It doesn't sound anything like a normal school bell."),
      say("yukino", "Class is starting. Everyone, stand!"),
      nfx(
        "Everyone rises in unison. The command comes from a girl in the back row—probably the class president.",
        m.fx({ darkness: 1, duration: 500 }),
      ),
      say("yukino", "Bow."),
      say("yukino", "Sit."),
      sf(
        "kagami",
        "We'll continue our study of modern literature. Open your books to page 45...",
        m.fx({ darkness: 0, duration: 500 }),
      ),

      n(
        "This is my first lesson, so I'll try to focus on Kagami. Though my desire to learn anything is at rock bottom right now...",
      ),
      sf(
        "kaira",
        "Newbie... Newbie... Newbie...",
        {
          bg: "./bg/cg/prologue/2B_kairaSide.webp",
        },
        m.bgm("Bass solo", 0.6),
      ),
      n(
        "I glance sideways. Kaira, my first-ever seatmate, is sitting with her arms folded and whispering “newbie” over and over.",
      ),
      nfx(
        "Fine, I won't look at her. She can do whatever she wants over there as long as she leaves me alone.",
        {
          bg: "./bg/locations/2B_classKagami.webp",
        },
      ),
      nfx(
        "A noise to my right. Something is moving...",
        m.sfx("desk_scrape", 0.4),
      ),
      nfx("... What just happened?", {
        bg: "./bg/locations/2B_classKagami2Desks.webp",
      }),
      n(
        "Kaira has dragged her desk over to mine and rested one hand on the back of my chair.",
      ),
      n("I'm still not looking at her."),
      n(
        "She isn't saying anything to me either. The rest of the class barely reacts.",
      ),
      n(
        "She smells like cherries and tobacco. I keep my attention fixed on Kagami.",
      ),
      nfx(
        "The lesson goes peacefully for about fifteen minutes. Nothing bad happens. Yet I'm sitting here on edge...",
        {
          bg: "./bg/locations/2B_classKagami2Desks.webp",
        },
      ),
      n(
        "Something about this school weighs on me—the chained-up student, my teacher's behavior, the students, the atmosphere itself.",
      ),
      n(
        "I get it. This whole bizarre situation has thrown me off balance. But for now, I should try not to think about it.",
      ),
      nfx("!!!", m.psychoShake("ren"), m.sfx("fabric_rustle")),
      n("Something slides along my leg."),
      n("I look under the desk. Kaira!"),
      nfx(
        "She's taken off one sneaker and is running her foot along my leg!",
        m.sfx("fabric_rustle"),
        {
          bg: "./bg/cg/prologue/2B_kaira_underDesk.webp",
        },
      ),
      n("Just moving it up and down."),
      n(
        "Now that I'm getting a proper look at her... She really is wearing black nylon tights...",
      ),
      nfx(
        "Above the tights is a plaid skirt, with her black T-shirt tucked into it rather messily.",
        {
          bg: "./bg/common/2B_kairaObserve.webp",
        },
      ),
      nfx("Finally, I reach her face—and find her staring straight at me...", {
        bg: "./bg/cg/prologue/2B_kairaSmile.webp",
        bgSpeed: 50,
      }),
      n("Kaira whispers close to my ear."),

      say("kaira", "Do you like feet, newbie?"),
      say("ren", "What are you doing?"),
      say("kaira", "Testing your fetishes, dummy!"),
      n("Right in the middle of class? Am I supposed to be happy about this?"),
      n(
        "Kaira clearly has no intention of moving away. She's only going to draw everyone's attention like this!",
      ),
      nfx(
        "",
        "Her foot travels higher until she rests it on my thigh.",
        m.sfx("fabric_rustle"),
        { bg: "./bg/cg/prologue/2B_kairasFeet_tight.webp" },
      ),
      sf(
        "kaira",
        "Stop being so quie~e~e~e~et. Tell me what gets you going already. Come on, what is it?!",
        m.psychoShake("kaira"),
      ),
      n("Fuck, why can't I force my mouth to open?"),
      n("Kaira puts an arm behind her head, exposing her armpit to me."),
      sf("kaira", "You don't happen to have a fetish for these, do you?", {
        bg: "./bg/cg/prologue/2B_kairaArmpit.webp",
        bgSpeed: 50,
      }),
      say("kaira", "Would you like to rub yourself against my armpits, maybe?"),
      say(
        "kaira",
        "Why do I have to drag every little thing out of you? If you don't want to talk, there's something much more honest.",
      ),
      nfx(
        "Kaira turns fully toward me and lifts her foot even higher. Now she's literally touching my dick!",
        m.psychoShake("ren"),
      ),
      say("ren", "Kaira, stop it!"),
      say("kaira", "Oh! Oh! Oh! It's already getting hard!!!"),
      n(
        "Why the fuck did she have to say that so loudly?!?! I glance around the classroom—she's gotten everyone's attention!",
      ),
      say(
        "kaira",
        "Oh, don't worry, nobody's judging you! I was only checking, hahaha!",
      ),

      sf(
        "kagami",
        "Kaira!",
        m.show("kagami", "angry", "center"),
        {
          bg: "./bg/locations/2B_classKagami2Desks.webp",
        },
        m.stopBgm(),
      ),
      n(
        "Kaira sighs and reluctantly turns away a little, but leaves her foot on my crotch.",
      ),
      sf("kaira", "My bad.", m.hide("kagami")),
      sf("kaira", "But fate itself put him in the seat next to mine.", {
        choices: [
          { text: "Knock her foot away", next: "class_kaira_drop" },
          {
            text: "Grab her foot and press it even tighter",
            next: "class_kaira_grab",
          },
          { text: "Put up with her audacity", next: "class_kaira_submit" },
        ],
      }),
    ],
  },

  class_kaira_drop: {
    lines: [
      nfx("I grab her ankle and shove it away.", m.dominance(1)),
      say(
        "ren",
        "Stop it. I never gave you permission to put your feet on me.",
      ),
      nfx("Kaira looks at me with feigned guilt on her face.", {
        bg: "./bg/cg/prologue/2B_kairaGuilt.webp",
        bgSpeed: 50,
      }),
      say("kaira", "I... It's such a shame we're in class right now, huh?"),
      nfx("Kaira slowly rises from her seat.", {
        bg: "./bg/locations/2B_classKagami2Desks.webp",
      }),
      say("kaira", "Excuse me, I need to step out~~~"),
      nfx(
        "And she darts into the hallway.",
        {
          bg: "./bg/locations/2B_classKagami2Desks.webp",
        },
        m.sfx("light_walking"),
      ),
      say("kagami", "She didn't ask for permission again."),
      nfx(
        "Kaira doesn't return for another five minutes. Her chair sits empty beside her desk, her pencil case still open.",
        {
          bg: "./bg/common/2B_kairasDesk.webp",
        },
      ),
      n(
        "I don't dare rummage through it, but I can see a little blue packet. A condom?",
      ),
      n(
        "No surprise. A girl like her, a school like this... what else would she be doing?",
      ),
      n("Five more minutes pass before the door finally opens."),
      nfx(
        "Kaira walks in. Her hair is slightly damp, and she looks satisfied and exhausted.",
        {
          bg: "./bg/cg/prologue/2B_kairaWet.webp",
          bgSpeed: 50,
        },
        m.sfx("light_walking"),
      ),
      n(
        "After that, she sits quietly as if nothing happened and doesn't look at me.",
      ),
      n(
        "She smells of soap and something sweet. If only she'd move her desk back too.",
      ),
      n("The lesson soon comes to an end."),
    ],
    next: "class_lesson_1_end",
  },

  class_kaira_grab: {
    lines: [
      nfx(
        "If it's offered, take it. There's nothing wrong with that logic, right?",
        m.stats({ dominance: 1, sanity: -2 }),
      ),
      nfx(
        "I grab Kaira's foot and press it tighter against my hard dick.",
        {
          bg: "./bg/cg/prologue/2B_kairasFeet_grab.webp",
        },
        m.sfx("fabric_rustle"),
      ),
      n("I feel her teasing me with her toes."),
      n("Kaira is already breathing hard, her face flushed red."),
      say("kaira", "So you do have some balls after all, huh? Enjoy it."),
      n(
        "It dawns on me that I might spend the entire lesson sitting here with a hard-on. What the hell do I do now?",
      ),
      n(
        "My desire keeps growing. Fuck, of course I want to fuck that foot already.",
      ),
      n(
        "But I'm in a classroom. And I'm not enough of a degenerate to do that right here.",
      ),
      nfx("In the end, I let go of her foot, and she pulls it away.", {
        bg: "./bg/locations/2B_classKagami2Desks.webp",
      }),
      say("kaira", "All talk?"),
      n(
        "I don't answer. She spends the rest of the lesson squirming in her chair without moving her desk back.",
      ),
    ],
    next: "class_lesson_1_end",
  },

  class_kaira_submit: {
    lines: [
      nfx("Fine... I'll just watch.", m.stats({ dominance: -1, sanity: -2 })),
      n("I do nothing."),
      nfx(
        "Time passes. Her foot stays on me, her face stays calm, and my dick stays at full attention.",
        {
          bg: "./bg/cg/prologue/2B_kairasFeet_groin.webp",
        },
      ),
      n("And that's how my first lesson at this school passes."),
    ],
    next: "class_lesson_1_end",
  },

  class_lesson_1_end: {
    lines: () => [
      sf(
        "kagami",
        "Now, before we end the lesson... Don't lay a hand on Ren without good reason on his first day.",
        {
          bg: "./bg/locations/2B_classKagami2Desks.webp",
        },
        m.show("kagami", "neutral", "center"),
      ),
      say("kagami", "Give the newcomer at least a little time to adjust."),
      n("Complete silence."),
      sf(
        "kagami",
        "Do you all understand?",
        m.show("kagami", "neutral2", "center"),
      ),
      say("yukino", "Yes! Kagami-sensei!"),
      sf("kagami", "... Class dismissed.", m.hide("kagami")),

      nfx(
        "Apparently, those were the magic words that allowed the students to leave their seats.",
        m.fx({ darkness: 1, duration: 500 }),
        m.audioMix(
          m.bgm("Freaking out with my best Enimes", 0.6),
          m.sfx("crowd_walking"),
        ),
      ),
      nfx(
        "How did I figure that out? The sudden jolt gave it away.",
        m.psychoShake("ren"),
      ),
      n("Several people immediately surround me in a semicircle."),

      nfx(
        "One of them—the bespectacled girl—tries to grab me by the collar.",
        m.fx({ darkness: 0, duration: 500 }),
        {
          bg: "./bg/common/2B_pupilSurround.webp",
        },
      ),
      n("My body tenses, ready to fight her off..."),

      nfx(
        "But Kaira is faster. She catches the girl's wrist.",
        m.show("kaira", "intresting", "right", "slideInRight"),
        m.sfx("clothes_grab"),
      ),
      say(
        "kaira",
        "Oh, dear. Weren't you listening to Kagami? Hurting the newbie today is a big no-no.",
      ),
      n("Kaira keeps hold of the bespectacled girl's wrist."),
      sf(
        "akane",
        "Newbie, for as long as I can remember, they've never dumped a new student on us halfway through the term...",
        m.show("akane", "angry", "center", "slideInLeft"),
      ),
      say("akane", "So where the hell did you come from?!?!"),
      say("akane", "Who are you? WHO ARE YOU?!?"),
      n("Fuck, what is wrong with her?!"),

      sf(
        "yukino",
        "No, that's not the main question! What matters now is teaching the newcomer the rules of our school—of our class!",
        m.show("yukino", "objection", "left", "slideInLeft"),
      ),
      say("yukino", "And making him obey those rules!"),
      sf(
        "akane",
        "What if he was sent here, huh?! What if he... What if he came “from Outside”?",
        m.show("akane", "suspect", "center"),
      ),
      n("What? From where?"),

      say(
        "livia",
        "Stop making things up, Akane. They don't exist anymore—it's impossible.",
      ),
      sf("akane", "HE'S THE SURVIVOR!!", m.show("akane", "angry", "center")),
      sf(
        "aiden",
        "Shut up.",
        {
          bg: "./bg/common/2B_eyden.webp",
        },
        m.hideAll(),
        m.stopBgm(100),
      ),
      n("The words are loud, yet calm."),
      n("They came from a white-haired boy."),
      n("But damn, he's so... pretty."),
      n(
        "He doesn't silence them completely, but at least the bespectacled girl stops shouting.",
      ),
      n("Kaira finally releases her wrist."),
      say("yukino", "What? Why did you suddenly speak up?"),
      sf(
        "livia",
        "Ah, look!",
        m.show("livia", "palm", "center", "slideInRight"),
      ),
      nfx(
        "The girl points at one of the students.",
        {
          bg: "./bg/common/2B_mia.webp",
        },
        m.hide("livia"),
      ),
      n("It's a tiny pink-haired girl in a cute little dress."),
      n(
        "Her build makes it hard to believe she's our age. I can't see her face—she's hiding behind a thick book.",
      ),
      n("One thing is obvious: she's trembling."),
      sf(
        "yukino",
        "I see. We scared her...",
        m.show("yukino", "think", "left"),
        {
          bg: "./bg/common/2B_pupilSurround.webp",
        },
      ),
      n("The bespectacled girl speaks again, much more quietly."),
      sf(
        "akane",
        "And we're supposed to leave this stray alone because of her? That's it—“Stray” is your official name!",
        m.show("akane", "humble", "center"),
      ),
      sf(
        "livia",
        "I'm not calling him that!",
        m.show("livia", "angry", "right"),
      ),
      say("akane", "At least it's official as far as I'm concerned."),
      n("I don't... want to watch this shit anymore."),
      nfx(
        "While they're distracted, I turn to Kaira and speak quietly:",
        {
          bg: "./bg/cg/prologue/2B_kairaSerious.webp",
          bgSpeed: 50,
        },
        m.hideAll(),
      ),
      say("ren", "Can you let me out? I need some air..."),
      say("kaira", "You want to make ME stand up?"),
      say("kaira", "Do you want to see my butt?"),
      sf(
        "kaira",
        "You won't see much through my skirt, though. Want me to lift it?",
        {
          bg: "./bg/cg/prologue/2B_kairaEmbressed.webp",
          bgSpeed: 50,
        },
      ),
      say("ren", "Please, Kaira. Let me out before it's too late."),
      say("kaira", "Fine, I'll show you mercy."),
      nfx(
        "Kaira gets up, letting me slip past her and out from behind the desk.",
        m.fx({ darkness: 1, duration: 500 }),
        m.sfx("chair_sitting"),
      ),
      nfx(
        "The arguing girls don't notice me, and I slip out into the hallway.",
        m.fx({ darkness: 0, duration: 500 }),
        {
          bg: "./bg/locations/2floorDay.webp",
        },
        m.bgm("A Morning Where Nothing Happens", 0.5),
      ),
      n("All I want now is water."),
      n("I don't know where to go, but I spot signs on the wall."),
      nfx(
        "Following the arrows, I come across a vending machine.",
        {
          bg: "./bg/locations/vending_machine.webp",
        },
        m.sfx("vending_machine", 0.8, true),
      ),

      n("Water, one liter—10 points..."),
      n("My balance is displayed on the phone."),
      n("I have 100 SP right now. Is that the main currency in this school?"),
      nfx(
        "I select water from the machine and hold my phone against the payment terminal.",
        m.sp(-10),
        m.sfx("ven_battle"),
      ),
      n("Payment accepted—water dispensed."),
      n(
        "I haven't had anything to drink for about an hour, though it feels much longer.",
      ),
      nfx("I lean against the wall beside the machine...", {
        bg: "./bg/locations/closeTo_vending_machine.webp",
      }),
      n(
        "I need to think everything through. My head is drowning in an endless sea of thoughts right now.",
      ),
      n(
        "An entire ocean, even. I've spent the last few hours thinking nonstop... A real philosopher...",
      ),

      ...(!getFlag("quizPassed")
        ? [
            n("So licking feet really is normal here?"),
            n("Then what comes next?"),
            n("Am I going to lick whatever these girls tell me to?"),
            n("Well... Maybe that's a little exciting."),
          ]
        : []),
      n("Students pass by without paying much attention to me."),

      nfx("The bell rings for class.", m.sfx("school_bell")),
      say("ren", "Mngh..."),
      n("No. There simply isn't any time to think in this place."),
      nfx(
        "I slowly return to my classroom. Most of the students are already there.",
        {
          bg: "./bg/locations/2B_classRecess.webp",
        },
        m.audioMix(m.sfx("walking"), m.stopSfx("vending_machine"), m.stopBgm()),
      ),
      n(
        "The bespectacled girl, in particular, keeps shooting me suspicious looks.",
      ),
      nfx(
        "I sit down at my desk. Kaira isn't back yet.",
        {
          bg: "./bg/locations/2B_classRecess_noteHole.webp",
        },
        m.sfx("chair_sitting"),
      ),
      n(
        "But in my notebook, I find... a hole. Something has punched straight through every page.",
      ),
      n("Judging by the diameter, someone used a pen or pencil."),
      n("Kaira enters the classroom, giggling softly, and sits beside me."),
      sf("ren", "You didn't do this, did you?", {
        bg: "./bg/cg/prologue/2B_kairaEmbressed.webp",
        bgSpeed: 50,
      }),
      say(
        "kaira",
        "Me? You can't accuse me of anything, Ren! What are you talking about, anyway?",
      ),
      say(
        "ren",
        "The pages in my notebook. Someone punched a hole through them.",
      ),
      say("kaira", "Ah! Akane did that!"),
      say("kaira", "Don't worry, the class president already punished her!"),
      n("Punished her? How?"),

      sf(
        "mat_teacher",
        "Hello, kids.",
        {
          bg: "./bg/locations/2B_class2Desks.webp",
        },
        m.sfx("door_close"),
      ),
      n("A new teacher walks in. I think we have math now."),
      n(
        "I also replaced my notebook. I'm fully prepared for a peaceful lesson.",
      ),
    ],
    next: "class_lesson_2_start",
  },

  // ============================================
  // === SECOND LESSON: KAIRA AND STOCKINGS ===
  // ============================================
  class_lesson_2_start: {
    lines: [
      n("Kaira... Just try messing with me again."),
      n("Math class begins. I pray heaven is listening."),
      n("Five minutes."),
      n("Ten minutes."),
      n("Fifteen minutes."),
      n("Everything is peaceful. I even manage to focus on the teacher."),

      say("kaira", "Hm, hm, hm, hehehe."),
      n("She giggles softly."),
      n("Kaira, not again. Don't make me find a way to move away from you."),
      n("The problem is, I need to say that aloud instead of thinking it."),
      sf("kaira", "Hey, Ren, what color stockings do you like best?", {
        bg: "./bg/cg/prologue/2B_kairaSmile.webp",
        bgSpeed: 50,
      }),
      say("ren", "Why do you care?"),
      say(
        "kaira",
        "Ohh, you see, I'm putting together a new outfit and can't decide what color stockings to get...",
      ),
      say(
        "kaira",
        "So I started wondering which ones a cutie like you prefers.",
      ),

      n("Kaira's minty breath washes over me."),
      n("She's clearly chewing gum in class."),
      sf("ren", "I think...", {
        choices: [
          { text: "Black", next: "class_kaira_thighs_black" },
          { text: "Nude", next: "class_kaira_thighs_nude" },
          { text: "White", next: "class_kaira_thighs_white" },
          { text: "Red", next: "class_kaira_thighs_red" },
          { text: "No preference", next: "class_kaira_thighs_none" },
        ],
      }),
    ],
  },

  class_kaira_thighs_black: {
    lines: [
      sf(
        "kaira",
        "Well, well. You've got good taste, Ren. Basic taste, I mean.",
        {
          action: () => setFlag("favoriteThighsBlack"),
        },
      ),
      nfx("Kaira keeps smiling.", {
        bg: "./bg/cg/prologue/2B_kairaSmirk.webp",
        bgSpeed: 50,
      }),
      say(
        "kaira",
        "I bet you dream about putting them over your dick and jerking off with them, huh?",
      ),
      say("kaira", "Right after a girl's feet have been inside them, right?"),
      n("I'm not telling you about my fantasies, you pervert."),
    ],
    next: "class_kaira_phone",
  },

  class_kaira_thighs_nude: {
    lines: [
      sf("kaira", "You like stockings that blend in with a girl's skin?", {
        action: () => setFlag("favoriteThighsNude"),
      }),
      nfx("Kaira keeps smiling.", {
        bg: "./bg/cg/prologue/2B_kairaSmirk.webp",
        bgSpeed: 50,
      }),
      say(
        "kaira",
        "I bet you dream about putting them over your dick and jerking off with them, huh?",
      ),
      say("kaira", "Right after a girl's feet have been inside them, right?"),
      n("I'm not telling you about my fantasies, you pervert."),
    ],
    next: "class_kaira_phone",
  },

  class_kaira_thighs_white: {
    lines: [
      sf("kaira", "White ones?", {
        action: () => setFlag("favoriteThighsWhite"),
      }),
      sf("kaira", "Yeah, I like those too.", {
        bg: "./bg/cg/prologue/2B_kairaSmirk.webp",
        bgSpeed: 50,
      }),
      say("kaira", "Yes, yes. Interesting."),
      say(
        "kaira",
        "I bet you dream about putting them over your dick and jerking off with them, huh?",
      ),
      say("kaira", "Right after a girl's feet have been inside them, right?"),
      n("I'm not telling you about my fantasies, you pervert."),
    ],
    next: "class_kaira_phone",
  },

  class_kaira_thighs_red: {
    lines: [
      sf("kaira", "Not the most conventional choice.", {
        action: () => setFlag("favoriteThighsRed"),
      }),
      sf("kaira", "Looks like you've got some peculiar tastes, perv~~", {
        bg: "./bg/cg/prologue/2B_kairaSmirk.webp",
        bgSpeed: 50,
      }),
      say("kaira", "Yes, yes. Interesting."),
      say(
        "kaira",
        "I bet you dream about putting them over your dick and jerking off with them, huh?",
      ),
      say("kaira", "Right after a girl's feet have been inside them, right?"),
      n("I'm not telling you about my fantasies, you pervert."),
    ],
    next: "class_kaira_phone",
  },

  class_kaira_thighs_none: {
    lines: [
      sf(
        "kaira",
        "What a terriiible choice~~",
        { action: () => setFlag("favoriteThighsNone") },
        {
          bg: "./bg/cg/prologue/2B_kairaSmirk.webp",
          bgSpeed: 50,
        },
      ),
      say("kaira", "Boring."),
    ],
    next: "class_kaira_phone",
  },

  class_kaira_phone: {
    lines: [
      nfx(
        "Kaira shows me her phone under the desk.",
        {
          bg: "./bg/common/2B_kairaPhone.webp",
        },
        m.sfx("fabric_rustle"),
      ),
      n("It looks exactly like mine, except hers has a case."),
      n("The screen shows a set of lingerie..."),
      say("kaira", "1,100 points."),
      say(
        "kaira",
        "You don't happen to have that much to lend me, do you? I'd make sure to repay you very generously.",
      ),
      say("ren", "No, I don't. I'm new, remember?"),
      sf("kaira", "Oh, right...", {
        bg: "./bg/cg/prologue/2B_kairaSmirk.webp",
        bgSpeed: 50,
      }),
      say("kaira", "You're D-rank. Sorry for expecting so much from you~~"),
      n("Did she have to rub it in?"),
      nfx("We spend another few minutes in peace.", {
        bg: "./bg/locations/2B_class2Desks.webp",
      }),
      n(
        "But Kaira is apparently the kind of person who's physically incapable of sitting quietly.",
      ),
      nfx(
        "Her hand suddenly lands on my thigh.",
        m.psychoShake("ren"),
        m.audioMix(m.sfx("fabric_rustle"), m.bgm("Torn nylon", 0.6)),
      ),
      say(
        "kaira",
        "Ren, I can feel how tense you've been since the first lesson. Can't get my little prank out of your head?",
      ),
      say("kaira", "Want me to help?"),

      nfx(
        "She starts unzipping my fly, moving slowly so she won't make too much noise.",
        m.sfx("zip"),
      ),
      say(
        "kaira",
        "There we go. Maybe you'd like something interesting to look at while I do this?",
      ),
      nfx(
        "Kaira lifts her skirt and pulls down her tights, letting me see her black panties.",
        {
          bg: "./bg/cg/prologue/2B_kairaPanties.webp",
        },
        m.sfx("fabric_rustle"),
        { dialogStyle: "transparent" },
      ),
      n("Our shoulders press together."),
      n("I can hear her breathing grow heavier."),
      n("Her hand actually slips into my underwear and wraps around my dick!"),
      n("Her fingers curl around me. I'm already hard..."),
      nfx(
        "She circles the head with her thumb, smearing the moisture around, then grips me at the base and slowly slides upward, almost to the tip.",
        m.sfx("masturbation_slow", 1, true),
      ),
      say("ren", "Agh..."),
      sf("kaira", "Quiet, unless you want us to get caught.", {
        bg: "./bg/cg/prologue/2B_kairaMasturbate.webp",
        bgSpeed: 50,
      }),
      n("Anyone paying even the slightest attention would notice us!"),
      n(
        "We're rustling around in a silent classroom filled with nothing but the teacher's voice.",
      ),
      n("I should stop her, but this... This feels... so fucking good..."),
      n("Her hand is warm and soft, squeezing with just the right pressure."),
      n("How is she so good at this?"),
      n(
        "How is this possible? She's as good at this as I am with my own hand...",
      ),
      n(
        "The warmth of a girl's hand and the thrill of doing this here only make it feel better.",
      ),
      n(
        "Pleasure swallows my thoughts. I can't tear my eyes from her panties. I want to pull them aside with my teeth and bury my face between her legs.",
      ),
      sf("ren", "Kaira, fuck...", {
        choices: [
          {
            text: "Stop resisting",
            next: "class_kaira_handjob_climax",
          },
          {
            text: "Stop her",
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
        "But I can't let myself give in this easily in front of everyone!",
        m.dominance(1),
      ),
      n("I grab Kaira's arm and try to pull it away."),
      say("kaira", "Hmmmm?"),
      say("kaira", "Hahaha."),
      say("kaira", "Do you want me to stop?"),
      say("ren", "Yes, enough!"),
      n("I start using both hands to push her away."),
      n("How is this girl so strong?!"),
      say("kaira", "Reeen~~, does it feel bad when I jerk you off?"),
      n("She says it in a plaintive voice, but at the same time..."),
      n(
        "Kaira grabs my wrist with her free hand and presses down on the pressure points.",
      ),
      nfx(
        "With the other hand, she squeezes my dick harder, almost painfully.",
        {
          bg: "./bg/cg/prologue/2B_collage.webp",
        },
      ),
      nfx(
        "The pleasure in my dick and the pain in my wrist blend together, freezing me in place.",
        m.psychoShake("ren"),
      ),
      say("ren", "Meee!"),
      n("Fuck!"),
      nfx(
        "That came out much louder than it should have. Everyone in class must have heard it!",
        m.sanity(-3),
      ),
      sf("mat_teacher", "Hey! What's your name again?", {
        bg: "./bg/locations/2B_class2Desks.webp",
      }),
      say("mat_teacher", "Keep it down."),
      n("I nod slightly and look at Kaira."),
      sf("kaira", "Oh, is it too painful or too pleasurable?", {
        bg: "./bg/cg/prologue/2B_collage.webp",
      }),
      say("kaira", "Or both at once?!"),
      n("What a fucking bitch... But why can't I do anything to stop her?"),
    ],
    next: "class_kaira_handjob_climax",
  },

  class_kaira_handjob_climax: {
    lines: [
      sf("ren", "Ugh... Khh...", {
        bg: "./bg/cg/prologue/2B_collage.webp",
      }),
      say("kaira", "Mfff, hehehe."),
      nfx(
        "Shit, she's speeding up!",
        m.audioMix(
          m.stopSfx("masturbation_slow"),
          m.sfx("masturbation_fast", 1, true),
        ),
      ),
      n("My dick throbs in her hand."),
      n("I lean into Kaira's shoulder... and let her do whatever she wants."),
      n(
        "The smell of sex hangs between us—her arousal mingling with my sweat.",
      ),
      n("That's it, God, just a few more seconds and!!!!"),
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
        "By some miracle, I don't moan as I come all over Kaira's soft hand.",
        m.sanity(-2),
        m.fx({ darkness: 0.3, duration: 500 }),
      ),
      n(
        "She doesn't stop right away. She keeps milking me slowly, squeezing out every last drop.",
      ),
      nfx(
        "Kaira slowly withdraws her cum-covered hand.",
        {
          bg: "./bg/cg/prologue/2B_kairaCum.webp",
          bgSpeed: 50,
        },
        m.orgasmRelease(),
        m.stopSfx("masturbation_slow"),
      ),
      n("I thought she'd be disgusted, but she turns out to be anything but."),
      n("..."),
      n("She starts licking her fingers clean."),
      say("kaira", "Hm, hm, hm... Let me get a better taste."),
      n("..."),
      say("kaira", "Average flavor—a little saltier than usual."),
      say(
        "kaira",
        "I'd give it 67 out of 100. Not disgusting, but not heavenly either.",
      ),
      say(
        "kaira",
        "Good enough for an occasional snack, but not something I'd have all the time.",
      ),
      nfx(
        "It's only the second period of the day.",
        {
          bg: "./bg/locations/2B_class2Desks.webp",
        },
        m.stopBgm(),
        { dialogStyle: "normal" },
      ),
      n("And I've run out of words."),
      n("My arousal fades. Irritation takes its place."),

      say("kaira", "I'm done. Thanks for the treat!"),
      say("kaira", "And zip up your fly. I'm not going back in there."),
      say("kaira", "For now."),
      nfx("I do as she says.", m.sfx("zip")),
      nfx("My underwear is sticky all over.", m.sanity(-2)),
      n("I have a lot to say to her, but it'll have to wait until the break."),
      n(
        "All I can do is pray I don't end up with a stain on my pants or any noticeable smell.",
      ),
      nfx(
        "The rest of the lesson drags on without another disaster.",
        m.fx({ darkness: 1, duration: 500 }),
      ),
      nfx(
        "The moment the bell rings, I hurry out of the classroom and head for the bathroom.",
        m.sfx("school_bell"),
      ),
      nfx(
        "Phewww...",
        {
          bg: "./bg/common/batrhroom_ren.webp",
        },
        m.fx({ darkness: 0, duration: 500 }),
        m.sfx("water_splash"),
      ),
      n("I don't even know what to think."),
      n(
        "That's the first time I've done anything sexual with someone in public.",
      ),
      n("It's also the first time I've seen my cum on someone else's hand."),
      n("It's not normal, but... it felt so unusual."),
      nfx("I need to piss.", m.fx({ darkness: 1, duration: 500 })),
      n("..."),
      n("..."),
      nfx(
        "I leave the bathroom and find Kaira alone in the hallway, looking at her phone.",
        {
          bg: "./bg/locations/2floor_ver2.webp",
        },
        m.fx({ darkness: 0, duration: 500 }),
        m.sfx("walking"),
      ),
      n("I need to approach her while I have the chance."),
      sf(
        "ren",
        "Kaira...",
        m.show("kaira", "neutral", "center"),
        m.bgm("Bass solo", 0.6),
      ),
      say("ren", "W... What the fuck was that back in class?"),
      sf(
        "kaira",
        "Mmm?? I took a little sample and gave it a taste test.",
        m.show("kaira", "intresting", "center"),
      ),
      say("kaira", "So far, you're average."),
      say("kaira", "Well, we were quiet. Nobody noticed."),
      say("ren", "It felt like everyone noticed!"),
      say(
        "ren",
        "Why did it have to be in class? Couldn't you wait for another time?",
      ),
      sf("kaira", "No, I couldn't.", m.show("kaira", "neutral", "center")),
      say(
        "kaira",
        "It's like when you can't wait to unwrap something, so you tear it open right on the spot!",
      ),
      sf("kaira", "Ahahaha!", m.show("kaira", "laugh", "center")),
      say("kaira", "Oh, come on, Renny. Why are you so embarrassed?"),
      say("kaira", "Or are you... a virgin?"),
      say("ren", "So what?"),
      sf("kaira", "Oh, oh, oh.", m.show("kaira", "intresting", "center")),
      say("kaira", "You might want to admit that a little more quietly..."),
      say(
        "kaira",
        "Not that I'm trying to protect you, but here's a little advice from your big sis...",
      ),
      say("kaira", "Don't tell any of the high-ranking girls."),
      say("ren", "Why?"),
      sf(
        "kaira",
        "Ah, just listen to me. That's all that matters!",
        m.show("kaira", "neutral", "center"),
      ),
      say("kaira", "Have I ever given you bad advice?"),
      n("You haven't given me any advice at all."),
      n("Kaira is definitely strange. A wild animal."),
      n("But maybe someone like her is my best chance of getting laid?"),
      n("She's already jerked me off. Maybe it could go further?"),
      say("ren", "Umm, could you give me a tour?"),
      sf(
        "kaira",
        "Ren, I'm not a tour guide. But since you treated me...",
        m.show("kaira", "intresting", "center"),
      ),
      say("kaira", "How about I show you somewhere interesting?"),
      say("kaira", "A lot of people are scared to go there."),
      say("ren", "What kind of place is it? Is it dangerous?"),
      nfx("Kaira grabs my hand and pulls me along.", m.hideAll()),
      sf(
        "kaira",
        "This whole school is dangerous! But you're with me, so don't be scared.",
        {
          bg: "./bg/cg/prologue/kaira_ren.webp",
        },
        m.sfx("crowd_walking"),
      ),
      nfx("Her voice still sounds aroused to me.", m.stopBgm()),
      n("I obediently follow her. Let's see whether I regret it."),
      n(
        "Come to think of it, I'm holding the same hand she used on me. It's clean now.",
      ),
      n("We walk for about three minutes before finally arriving at..."),
      nfx("A metal door set into the wall.", {
        bg: "./bg/locations/death_enterance.webp",
      }),
    ],
    next: "yuno_room_enter",
  },

  // ============================================
  // === MEETING DOOMED GIRL ===
  // ============================================
  yuno_room_enter: {
    lines: [
      nfx("Kaira knocks cheerfully.", m.sfx("knock")),
      nfx(
        "Fifteen seconds later, a girl who looks about our age peers through the little window.",
        m.sfx("window_open"),
        {
          bg: "./bg/cg/prologue/death_open.webp",
        },
        { dialogStyle: "transparent" },
      ),
      n("Messy hair. A white dress with straps."),
      n("Her room is lined with large white cushions, like a padded cell."),
      n(
        "But the room has everything she'd need to sleep, wash, and entertain herself.",
      ),
      n(
        "I spot a huge flat-screen TV built into the wall, along with a sofa. It all looks expensive.",
      ),
      sf(
        "death",
        "Hello, K-A-I-R-A!!!",
        {
          bg: "./bg/cg/prologue/death_greeting.webp",
          bgSpeed: 50,
        },
        m.bgm("Ima Death li DEATH!!!!", 0.7),
      ),
      say("death", "How are you doing??"),
      sf(
        "kaira",
        "Long time no see. I decided to bring someone to meet you.",
        m.show("kaira", "neutral", "center", "slideInRight"),
      ),
      say("kaira", "A newbie. He just enrolled, and today's his first day."),
      say(
        "kaira",
        "Maybe an experienced girl like you could give him some advice or a fiery speech?",
      ),

      say("death", "Of course!!!"),
      say(
        "death",
        "Move your tits away from the window! Let me look at him!!!",
      ),
      nfx(
        "Kaira steps aside and leans against the wall, letting me stand in front of the door.",
        m.show("kaira", "intresting", "right"),
      ),
      say("kaira", "Go on. Introduce yourself the way Kagami taught you."),
      m.choice(
        {
          text: "D-rank, Ren Amano",
          next: "yuno_intro_correct",
        },
        {
          text: "Ren Amano, D-rank",
          effects: { rank_score: -2, sanity: -1 },
          next: "yuno_intro_wrong1",
        },
        {
          text: "Ren Amano",
          effects: { rank_score: -3, sanity: -2 },
          next: "yuno_intro_wrong2",
        },
      ),
    ],
  },
  yuno_intro_correct: {
    lines: [
      say("ren", "D-rank, Ren Amano. Nice to meet you."),

      sf("death", "Oh, oh, ohhh!!! Such a well-mannered boy!", {
        bg: "./bg/cg/prologue/death_like.webp",
        bgSpeed: 50,
      }),

      say(
        "kaira",
        "Just remember to state your class, 2-B, after your rank from now on.",
      ),
    ],
    next: "yuno_intro_continue",
  },

  yuno_intro_wrong1: {
    lines: [
      say("ren", "Ren Amano, D-rank"),

      sf("kaira", "Rank first, Ren.", m.show("kaira", "neutral", "right")),

      sf("death", "Ahhh, it's all right. He's new!", {
        bg: "./bg/cg/prologue/death_like.webp",
        bgSpeed: 50,
      }),

      say(
        "kaira",
        "And don't forget to give your class, 2-B, after your rank. That matters sometimes too.",
      ),
    ],
    next: "yuno_intro_continue",
  },

  yuno_intro_wrong2: {
    lines: [
      say("ren", "Ren Amano."),

      sf(
        "kaira",
        "...Do you have the memory of a goldfish?",
        m.show("kaira", "neutral", "right"),
      ),

      say(
        "kaira",
        "Look, this is how you do it: B-rank, Class 2-B, Kaira Welt!",
      ),
      say("kaira", "Try it!"),

      say("ren", "Tch, fine."),

      say("ren", "D-rank, Class 2-B, Ren Amano."),

      sf("death", "Yes, now that's good!", {
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
        "I am A-rank, Class 2-T, Doomed Girl or Death!",
        {
          bg: "./bg/cg/prologue/death_speaking.webp",
          bgSpeed: 50,
        },
        { action: () => setFlag("knowsDeath") },
      ),
      say("ren", "What?"),
      say("death", "Didn't you hear me?!"),
      say("death", "Doomed Girl or Death! Yes, that's really my name!"),
      n("Another completely deranged girl..."),
      sf(
        "kaira",
        "She gave herself that fucked-up name.",
        m.show("kaira", "neutral", "right"),
      ),
      say(
        "kaira",
        "She's one of the few students whose real name is known by only a handful of people.",
      ),
      say("death", "That is my real name!"),
      say("death", "I am the embodiment of death!"),
      say("death", "The embodiment of lust!"),
      say("death", "I am Doomed Girl or Death!!!"),
      n("This is bleak."),
      say(
        "ren",
        "And another thing: aren't there only four class letters? A, B, C, and D? Where did Class T come from?",
      ),
      say(
        "kaira",
        "That class is for special cases. It exists, but not as a separate classroom, so you won't simply stumble across it.",
      ),
      n("All right, let's say I believe you..."),
      say("ren", "Umm, why are you locked inside this room?"),
      say("death", "Locked in? No, no! Nobody locked me in here!"),

      say("death", "I live here!"),
      say(
        "kaira",
        "They only let her out after most of the students have left the school.",
      ),
      say("kaira", "She's not allowed to leave the school by herself."),
      say("ren", "Why?"),
      say(
        "kaira",
        "She was deemed too dangerous to attend regular lessons with everyone else.",
      ),
      say("death", "Yes, yes!! That's what happened!"),
      sf(
        "death",
        "Ohh, don't misunderstand. Dangerous doesn't mean I'll tear you to pieces the moment I get my hands on you. I'm not completely insane!",
        {
          bg: "./bg/cg/prologue/death_warning.webp",
          bgSpeed: 50,
        },
      ),
      say(
        "death",
        "Kairaaa already told you: they let me out once most of the fresh meat has left the school!",
      ),
      say(
        "death",
        "I interact with people every day, and I haven't killed or maimed anyone yet!",
      ),

      say(
        "kaira",
        "That's also true. She has issues, but she understands everything perfectly well and is fully aware of her actions.",
      ),
      say(
        "death",
        "And lately, some people aren't even afraid to be alone with me anymore!!!",
      ),
      say(
        "death",
        "What's there to be afraid of?! They never hurt me! I don't bite everyone I meet, and I'm not contagious!!",
      ),

      nfx(
        "The bell rings, breaking my concentration on their words.",
        m.sfx("school_bell"),
      ),

      n("Kaira pushes away from the wall and slowly starts walking off."),
      sf("kaira", "All right, time for class.", m.hideAll()),

      n("Just as I begin to turn away, Doomed Girl speaks again."),

      sf("death", "Not so fast!", {
        bg: "./bg/cg/prologue/death_think.webp",
        bgSpeed: 50,
      }),
      say("death", "Listen, boy. Why don't you skip class?"),
      say("death", "Let Kaira go sit and pine all by herself!"),
      say(
        "death",
        "She brought you here so we could talk, which means it's far too early for you to leave!",
      ),

      say("ren", "Skip class?"),
      sf(
        "kaira",
        "Don't worry, Ren. You'd better stay and talk to her some more.",
        m.show("kaira", "neutral", "right"),
      ),
      say("ren", "Wouldn't the next break be better?"),
      say(
        "kaira",
        "She might already be busy by then, so you'd better talk now.",
      ),
      say(
        "kaira",
        "You've got time. I'll just tell the teacher you're helping someone carry notebooks.",
      ),
      say("ren", "Will they believe you?"),
      sf(
        "kaira",
        "Doubting your big sis is the worst thing you could possibly do.",
        m.show("kaira", "intresting", "right"),
      ),
      say("kaira", "Ciao!"),

      nfx("Kaira races back to class, leaving me alone.", m.hideAll()),

      say("death", "Hey, hey, come closer. Let's talk."),
      n("I take one step closer."),
      say("death", "God, stand right up against the window already!"),
      say(
        "death",
        "Kaira and I already explained that I'm not dangerous to people like you!",
      ),

      nfx("I finally bring myself right up to the window. She does the same.", {
        bg: "./bg/cg/prologue/death_closeNeutral.webp",
        bgSpeed: 50,
      }),
      n("Our faces are only inches apart."),
      n("She smells surprisingly pleasant."),
      n("She lowers her voice."),

      say("death", "You're a quiet boy. Feeling shy?"),

      say("ren", "Umm... More like I'm fucking stunned."),
      say(
        "death",
        "“Fucking stunned”?... This is the first time I've ever heard of someone new arriving here, so I suppose I can understand you a little.",
      ),
      say(
        "death",
        "But what I meant was that you don't seem to like looking Kaira or me in the face.",
      ),
      sf("death", "You're shy around girls!", {
        bg: "./bg/cg/prologue/death_closeSmile.webp",
        bgSpeed: 50,
      }),

      n("I'm shy around fucking lunatics."),

      say(
        "death",
        "But that's fine! You can open your mouth and form coherent sentences, so your shyness is only a temporary problem!",
      ),

      say("ren", "Let's get to the point."),
      say("ren", "What did you want to talk about?"),
      say("death", "Right! Well, you're not in a hurry anymore, are you?"),
      say("death", "Listen carefully, Ren."),
      say("death", "Check behind you. Is anyone there?"),

      nfx(
        "I turn around. The hallway is empty.",
        m.fx({ darkness: 1, duration: 500 }),
      ),
      sf("ren", "Not even a fly.", m.fx({ darkness: 0, duration: 500 })),

      sf(
        "death",
        "Good. I want to give you a task and, naturally, a reward for completing it.",
        {
          bg: "./bg/cg/prologue/death_closeNeutral.webp",
          bgSpeed: 50,
        },
      ),
      say("death", "Do you know about the task system yet?"),
      say("ren", "Nope."),
      say(
        "death",
        "There's a little task button in the student section of your phone!",
      ),
      say("ren", "It's empty."),
      say(
        "death",
        "Well, I don't know. You're new—maybe things work differently for you.",
      ),
      say(
        "death",
        "The idea is simple: high-ranking students can post paid tasks for lower-ranking students.",
      ),
      say("death", "Except I'm forbidden from doing that~~~~"),
      say(
        "death",
        "My phone is heavily restricted. It's a special mode I can't disable...",
      ),
      say("death", "And the task is very simple."),
      say("death", "Could you deliver a note to a certain girl?"),
      say(
        "death",
        "She's my friend, and I don't have time to get the message to her. It's urgent.",
      ),
      sf("death", "But you absolutely must not meet her directly!", {
        bg: "./bg/cg/prologue/death_closeCreepy.webp",
        bgSpeed: 50,
      }),
      say("death", "Nobody can see you deliver the note."),
      say(
        "death",
        "They have swimming class right now, so go into their changing room and slip the note through the gap in her locker.",
      ),
      sf("death", "Couldn't be easier!", {
        bg: "./bg/cg/prologue/death_closeNeutral.webp",
        bgSpeed: 50,
      }),
      say(
        "ren",
        "The girls' changing room? That's dangerous, to put it mildly.",
      ),
      say(
        "death",
        "Don't worry so much! They'll all be in the pool. It'll take you twenty seconds to find the locker and slip the paper inside!",
      ),
      say(
        "death",
        "There aren't any cameras in there. Just make sure nobody sees you, and everything will be fine!",
      ),
      say("ren", "... And what do I get in return?"),

      say("death", "Something special, just for you..."),
      nfx(
        "Doomed Girl steps away from the window so I can see her entire body.",
        {
          bg: "./bg/cg/prologue/death_fullHeight.webp",
          bgSpeed: 50,
        },
      ),
      n("She begins running a hand over her intimate areas."),
      say("death", "Look, Ren! This is what you'll get!"),

      nfx(
        "Firm D-cup breasts, their nipples already hard!",
        {
          bg: "./bg/cg/prologue/death_breast.webp",
          bgSpeed: 50,
        },
        m.sfx("fabric_rustle"),
      ),
      sf("death", "My beautiful feet.", {
        bg: "./bg/cg/prologue/death_feet.webp",
        bgSpeed: 50,
      }),
      say("death", "Paradise for any fetishist!"),
      sf(
        "death",
        "And my pussy.",
        {
          bg: "./bg/cg/prologue/death_pussy.webp",
          bgSpeed: 50,
        },
        m.sfx("fabric_rustle"),
      ),

      n("She suddenly hikes up her dress to show me her slit."),
      n("Apparently, nobody ever told her about panties."),

      say(
        "death",
        "Look at those sweet little lips! It's very tight, trust me.",
      ),
      say("death", "Even a finger is hard to fit inside, never mind a dick!"),

      say("ren", "Ohhh, fuck..."),
      nfx(
        "My dick forgets all about its exhaustion and springs back to life!",
        m.sanity(-1),
      ),

      say("ren", "Well, I... think..."),

      say("death", "Oh, you need a demonstration!"),
      nfx(
        "Doomed Girl starts pushing her fingers straight into her slit!",
        {
          bg: "./bg/cg/prologue/death_pussy_closeup.webp",
          bgSpeed: 50,
        },
        m.sfx("masturbation_slow", 1, true),
      ),
      n(
        "Two fingers slide over her clit, then slowly sink inside with a wet squelch.",
      ),
      say("death", "Ahhh!! Ahhh... mmm."),
      say("death", "I already want to masturbate... Mmmmmm..."),

      n("She swirls one finger inside her pussy, then pulls it out."),
      n("A thin strand stretches from her hole to her fingertip."),
      nfx(
        "Then she approaches the window and holds out her wet finger.",
        {
          bg: "./bg/common/deathFinger.webp",
          bgSpeed: 50,
        },
        m.stopSfx("masturbation_slow"),
      ),
      n("Holy fuck."),
      sf(
        "death",
        "Well? Why are you standing there like a statue? Taste it. If you don't like the flavor, I'll just have to find another boy.",
        {
          choices: [
            { text: "Taste it", next: "yuno_finger_taste" },
            { text: "Taste it", next: "yuno_finger_taste" },
            { text: "Taste it", next: "yuno_finger_taste" },
            { text: "Taste it", next: "yuno_finger_taste" },
          ],
        },
      ),
    ],
  },

  yuno_finger_taste: {
    lines: [
      nfx(
        "I slowly take her finger into my mouth.",
        m.stats({ sanity: -3, rank_score: -2 }),
        {
          bg: "./bg/common/deathFinger_lick.webp",
          bgSpeed: 50,
        },
      ),
      n("I circle it with my tongue..."),
      n("A thick sweetness..."),
      n("A little salty... The taste of her dripping slit right on my tongue."),
      nfx(
        "All of it at once—sticky, filthy, her slutty aftertaste!",
        m.fx({ noise: 0.25, vignette: 0.4, duration: 800 }),
      ),
      n(
        "My dick is hard, throbbing inside my pants. Saliva runs from my mouth, mingling with her juices.",
      ),
      say(
        "death",
        "That's enough. Easy now, let go of my finger. You've already licked it clean, greedy boy.",
      ),

      n("She's right. I've already licked off and swallowed everything."),
      n("Fuck, what am I doing? Falling for a sick girl's tricks."),
      nfx(
        "The moment I come to my senses, I pull away from her and wipe my lips.",
        {
          bg: "./bg/cg/prologue/death_wipe.webp",
          bgSpeed: 50,
        },
        m.fx({ noise: 0, vignette: 0, duration: 800 }),
      ),
      say("ren", "Agh, sorry."),
      say("death", "Meeeh, are you stupid?"),
      sf("death", "I need “I'll do your task!”, not “Sorry, Mistress!”", {
        bg: "./bg/cg/prologue/death_speaking.webp",
        bgSpeed: 50,
      }),
      say("death", "I'm offering you my whole body—and you get to come once!"),
      say("death", "So, do you agree, Ren Amano?"),

      say("ren", "... Yes."),

      nfx(
        "Doomed Girl closes the little window.",
        {
          bg: "./bg/locations/death_enterance.webp",
          bgSpeed: 50,
        },
        m.sfx("window_open"),
      ),
      nfx(
        "About twenty seconds pass before the window opens again.",
        m.sfx("window_open"),
        {
          bg: "./bg/cg/prologue/death_letter.webp",
          bgSpeed: 50,
        },
      ),
      n("She holds out a folded piece of paper."),
      nfx(
        "I reach for it, but Doomed Girl catches me with her other hand and pulls me closer.",
        {
          bg: "./bg/cg/prologue/death_closeCreepy.webp",
          bgSpeed: 50,
        },
        m.psychoShake("ren"),
      ),
      say(
        "death",
        "If I find out you read this note, no matter how, you'll discover just how dangerous I can be, Ren.",
      ),
      n("..."),
      sf(
        "death",
        "Ahaha, just kidding! What difference does it make whether you read it if you won't understand any of it anyway?",
        {
          bg: "./bg/cg/prologue/death_letter.webp",
          bgSpeed: 50,
        },
      ),
      m.interact({
        id: "take_death_letter",
        type: "exit",
        label: "Take the note",
        pos: { x: 53, y: 70 },
      }),

      nfx(
        "She releases my arm, and I take the note.",
        {
          bg: "./bg/cg/prologue/death_speaking.webp",
          bgSpeed: 50,
        },
        m.sfx("letter_take"),
      ),
      say("ren", "Still, I'd better not read it."),
      say("death", "That's right!"),
      say("death", "Head to the first floor. Use the map to find the pool."),
      n("But my map is locked right now..."),
      say(
        "death",
        "Then, once you're sure nobody is nearby, use this to get into the girls' changing room.",
      ),

      nfx("Doomed Girl holds out something else.", {
        bg: "./bg/cg/prologue/death_phone.webp",
        bgSpeed: 50,
      }),
      n("Her phone."),
      n("It has a gold-colored case and a little knife-shaped charm."),
      m.interact({
        id: "take_death_phone",
        type: "exit",
        label: "Take the phone",
        pos: { x: 70, y: 70 },
      }),
      nfx(
        "When I take it, I realize something... It isn't the same as mine.",
        {
          bg: "./bg/cg/prologue/death_speaking.webp",
          bgSpeed: 50,
        },
        m.sfx("clothes_grab"),
      ),
      n(
        "It feels different in both weight and size, and it has three cameras instead of the single camera on mine.",
      ),
      n("But I don't have time to examine it."),

      say(
        "death",
        "You need a female student's ID to enter the girls' changing room. My phone is perfect!",
      ),

      say(
        "ren",
        "I see. I haven't learned about that yet. Will your phone work? I thought it was restricted.",
      ),
      say("death", "Of course it'll work! I'm a girl~~."),
      say(
        "death",
        "Only specific functions were blocked. It's still my student ID.",
      ),
      say("death", "That means you could even use it to pay for things."),
      say("ren", "No, I won't."),

      say(
        "death",
        "Next, find the Class 3-C lockers and look for the one labeled Kirara Tojo.",
      ),
      say("death", "Put the letter inside and leave. That's all!"),
      say("ren", "All right, I understand."),
      say("ren", "Then... I should go?"),
      say("death", "Do your best for me!"),
      nfx(
        "I turn around and head down to the first floor, straight toward the pool.",
        {
          bg: "./bg/locations/womens_locker_pool.webp",
        },
        m.audioMix(m.sfx("walking"), m.stopBgm()),
        { dialogStyle: "normal" },
      ),
      n(
        "A fork in the corridor: girls' changing room and boys' changing room...",
      ),
      n("I've never done anything like this."),
      n("My heart is already pounding like crazy."),
      n("But something is giving me strength..."),
      n("A naked Doomed Girl and the memory of the taste on her finger."),
      n("If I want sex, I obviously need to man up."),
      n("Let's do this!"),

      nfx(
        "I look around. Nobody is there. I hold Doomed Girl's phone against the terminal beside the door.",
        m.sfx("locker_open"),
      ),
      n("The door opens."),
      nfx(
        "I don't see anyone inside. Now to find the door marked Class 3-C...",
        {
          bg: "./bg/locations/womens_locker_poolInside.webp",
        },
        m.sfx("walking"),
      ),
      n("There it is!"),
      nfx(
        "I quietly crack the door open... Nobody's there...",
        {
          bg: "./bg/locations/womens_locker_pool_lockers.webp",
        },
        m.audioMix(m.sfx("walking"), m.sfx("door_close")),
      ),
      n("Good. Now to find Kirara's locker."),
      n("..."),
      n("…"),
      nfx(
        "There it is!",
        {
          bg: "./bg/locations/womens_locker_kirara.webp",
        },
        m.sfx("walking"),
      ),
      nfx(
        "I take out the note and slip it through the gap in the locker.",
        m.sfx("letter_take"),
      ),
      n(
        "That's it, job done! Now I'll go back to Doomed Girl, then return to class.",
      ),
      nfx(
        "I reach for the exit and start opening it when I hear girls' voices on the other side!",
        {
          bg: "./bg/locations/womens_locker_door.webp",
        },
      ),
      n(
        "Some girls must be passing by out there... I hope they aren't coming in.",
      ),
      n("I decide to wait... and look around."),
      n("The changing room smells of chlorine, shampoo, and sweat."),
      n("The voices beyond the entrance don't fade, so I keep waiting..."),
      n("It's kind of nice in here... aside from the fucking risk."),
      n("I keep looking around."),
      nfx("Hmm? One of the lockers is ajar...", {
        bg: "./bg/locations/womens_locker_ajar.webp",
      }),
      n("... I can't get distracted..."),
      nfx("Then again, when will I ever get another chance to come in here?", {
        choices: [
          {
            text: "Open the locker",
            effects: { dominance: 2, sanity: -1 },
            next: "locker_open",
          },
          {
            text: "Keep waiting",
            effects: { sanity: 1 },
            next: "locker_wait",
          },
        ],
      }),
    ],
  },

  locker_open: {
    lines: [
      n("Hmph. Who could resist this...?"),

      nfx(
        "I walk over to the locker and open it...",
        { action: () => setFlag("pantyStolen") },
        {
          bg: "./bg/locations/womens_locker_open.webp",
        },
      ),

      n("Ohhh, yes..."),
      n("A girl's neatly folded clothes..."),
      n("Including her white panties..."),
      n("I hope she won't notice..."),
      nfx(
        "I slowly reach for the folded panties, spread them open, and look inside.",
        {
          bg: "./bg/common/womens_locker_pantie.webp",
        },
        m.sfx("fabric_rustle"),
      ),
      n(
        "A little damp, with obvious signs they've been worn. They must smell incredible...",
      ),
      n("This is horribly perverted... I shouldn't be doing this."),
      nfx("And yet I press the panties to my nose...", {
        bg: "./bg/common/womens_locker_pantieSniff.webp",
      }),
      n("Holy fuck, that smell..."),
      nfx(
        "!!!",
        m.audioMix(m.sfx("school_door"), m.bgm("Willbreaker", 0.7)),
        {
          bg: "./bg/common/womens_locker_girls.webp",
        },
        m.psychoShake("ren"),
      ),
      say("mystery", "Fuck, I hope the key's in here."),
      say("mystery", "Hurry."),
      n("This is the worst thing that could've happened..."),

      nfx(
        "I immediately close the locker to hide the fact that I went through it.",
        m.sfx("locker_close", 0.6),
      ),

      n("But the panties are still in my hands..."),
      n("I forgot to put them back!"),

      sf("mystery", "...How did you get in here, you pervert?!?!", {
        bg: "./bg/common/womens_locker_discovered.webp",
      }),
      say("mystery", "Who's there?"),
      say(
        "mystery",
        "AAAAH, there's a pervert in our changing room, girls!!!!",
      ),
      say("mystery", "He stole someone's panties!!"),
      n("Adrenaline surges through me, and my body acts on instinct."),
      nfx(
        "I stuff the panties into my pocket and bolt from the changing room before they can surround me.",
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
      n("No, that's too low even for me... I'll just keep waiting..."),

      n("..."),
      n("..."),
      n("The voices still haven't faded..."),
      nfx(
        "!!!",
        m.audioMix(m.sfx("school_door"), m.bgm("Willbreaker", 0.7)),
        {
          bg: "./bg/common/womens_locker_girls.webp",
        },
        m.psychoShake("ren"),
      ),
      say("mystery", "Fuck, I hope the key's in here."),
      say("mystery", "Hurry."),
      n("This is the worst thing that could've happened..."),
      n("A thousand possible courses of action race through my head."),
      sf("mystery", "...How did you get in here, you pervert?!?!", {
        bg: "./bg/common/womens_locker_discovered.webp",
      }),
      say("mystery", "Who's there?"),
      say(
        "mystery",
        "AAAAH, there's a pervert in our changing room, girls!!!!",
      ),
      nfx(
        "Adrenaline surges through me, and my body acts on instinct.",
        m.fx({ darkness: 1, duration: 300 }),
      ),
      nfx(
        "I bolt from the changing room before they can surround me.",
        m.sfx("run"),
        {
          bg: "./bg/common/womens_locker_chase.webp",
        },
      ),
    ],
    next: "locker_chase",
  },
  locker_chase: {
    lines: [
      n("I burst out of the changing room into what seems like a safe area..."),
      n("I look back..."),
      nfx(
        "A terrifying sight greets me.",
        m.fx({ darkness: 0, duration: 300 }),
      ),
      n("The girls' voices reach me from down the hallway."),
      say("mystery", "That's him—the fucking pervert!"),
      nfx(
        "I take off at full speed, running wherever my feet carry me.",
        {
          bg: "./bg/locations/chase_fromPool.webp",
        },
        m.sfx("run_multiply"),
        m.runningStart(),
      ),
      n("Together, we all break the rule against running in school."),
      n("And during class, no less!"),
      n("I can tell they're athletes. They're steadily gaining on me!"),
      n(
        "The only thing keeping me going is my ironclad determination not to get expelled on my very first day!",
      ),
      nfx(
        "I race outside, the girls right behind me.",
        {
          bg: "./bg/locations/shinshu_sideView.webp",
        },
        m.audioMix(
          m.stopSfx("dorm_ambience"),
          m.sfx("street_ambient", 0.4, true),
        ),
      ),
      n(
        "Once we're outside, they start falling behind. It's cold, we're on rough asphalt, and they're only wearing swimsuits.",
      ),
      say("mystery", "Stop, asshole!!!"),
      say("ren", "You stop, asshole!!!"),
      nfx(
        "I keep running for another two minutes without looking back...",
        m.stopBgm(),
        m.runningStop(),
        m.fx({ darkness: 1, duration: 300 }),
      ),
      n("Eventually, I slow to a stop and realize two things..."),
      n("First, they've fallen behind... I managed to escape the athletes."),
      nfx(
        "Second, I have no idea where I am.",
        {
          bg: "./bg/locations/shinshu_eliteSide.webp",
        },
        m.fx({ darkness: 0, duration: 500 }),
      ),
      n("I start looking around while catching my breath."),
      n("It's so... pristine here..."),
      n(
        "This place is completely different: soft grass instead of asphalt, manicured lawns, bench swings, fountains.",
      ),
      n("My eyes can't take it all in."),
      n("Then my gaze darts upward..."),

      say("ren", "Ah!"),
      n("This side of the school looks different somehow..."),
      nfx(
        "There are luxurious balconies here... And a student is standing on one of them...",
        {
          bg: "./bg/common/celesta_balcony.webp",
        },
        { dialogStyle: "transparent" },
        m.bgm("Celesta"),
      ),
      n("Everything about her... So refined, so perfect..."),
      n("Her posture is immaculate, her gaze fixed somewhere in the distance."),
      n("She holds a small cup and saucer, taking delicate sips of her drink."),
      nfx(
        "Then her gaze suddenly shifts to me.",
        {
          bg: "./bg/common/celesta_balconyLook.webp",
        },
        { bgSpeed: 50 },
      ),
      n("Her cold, tired eyes stare straight at me."),
      n("She says nothing. She only watches."),
      n(
        "I do the same. She says nothing, so I have nothing to answer. I simply stare back...",
      ),
      nfx(
        "Suddenly, she moves again.",
        {
          bg: "./bg/common/celesta_balconyGlove.webp",
        },
        { bgSpeed: 50 },
      ),
      n("She sets the cup and saucer on the windowsill."),
      n("Removes her left glove and..."),
      nfx(
        "Throws it down at my feet.",
        m.sfx("glove_drop"),
        {
          bg: "./bg/common/celesta_balconyDrop.webp",
        },
        { bgSpeed: 50 },
      ),
      say("celeste", "Pick it up."),
      n("Pick it up? Why should I?"),
      nfx(
        "Ah, right. I picked a great time to forget what kind of school I'm in.",
        {
          bg: "./bg/common/celesta_balconyBW.webp",
        },
      ),
      nfx(
        "An insane one.",
        m.audioMix(m.stopSfx("street_ambient"), m.stopBgm(1)),
      ),
      n("And one forsaken by God."),
      n("Nobody here is going to save me, are they?"),
    ],

    // Credits are now triggered here, bringing this part of the prologue to a close.
    next: () => {
      // 1. Hide the game interface.
      const dialogWrapper = document.getElementById("dialog-wrapper");
      if (dialogWrapper) dialogWrapper.style.display = "none";

      // 2. Start the credits.
      window.startCredits([
        `END OF PROLOGUE — PART TWO.<br /><br />
          <span
            style="
        color: #ff4d4d;
        font-size: 1.2rem;
        text-shadow: 0 0 10px rgba(255, 0, 0, 0.5);
      "
          >
            Thank you so much for playing, D-rank!❤<br />
            And that was Part Two.<br />
            And yes, there will be a third—the final part of the prologue.
          </span>`,
        `Created by V&Mai Studio
        with assistance from various AIs`,
        `Feel free to share your thoughts in the comments.<br />I'd love to read them!<br />
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
        Visit Patreon
      </a>
      <a href="https://boosty.to/vmaistudio" target="_blank" class="support-btn boosty">
        <img
          src="icons/boosty.svg"
          alt="Boosty"
          style="width: 24px; height: 24px; filter: brightness(0) invert(1)"
        />
        Visit Boosty
      </a>
    </div>
    `,
      ]);

      // 3. Return null to stop the story.
      return null;
    },
  },
};

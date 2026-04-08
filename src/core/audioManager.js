// src/core/audioManager.js

export class AudioManager {
  constructor() {
    this.bgm = null;
    this.bgmId = null; // ID текущего трека
    this.activeLoops = {};
    this.basePaths = { bgm: "/music/", sfx: "/sfx/" };
  }

  playBGM(trackId, volume = 0.5) {
    // 1. Если этот же трек уже играет - выходим (не трогаем пул)
    if (this.bgmId === trackId && this.bgm && this.bgm.playing()) {
      return;
    }

    // 2. Если играет что-то другое - полная зачистка
    this.stopBGM();

    // 3. Загружаем новый (html5: false - используем Web Audio, нет лимита пула)
    const src = `${this.basePaths.bgm}${trackId}.ogg`;
    this.bgmId = trackId;

    this.bgm = new Howl({
      src: [src],
      html5: false,
      loop: true,
      volume: 0,
      onload: () => {
        this.bgm.play();
        this.bgm.fade(0, volume, 2000);
      },

      onloaderror: (id, err) => {
        // НЕ БЛОКИРУЕМ СЦЕНУ, ПРОСТО ЛОГИРУЕМ
        console.error(`[Audio] ❌ Failed to load: ${trackId} (Error: ${err})`);
        console.warn(
          `[Audio] Check if file exists: public/music/${trackId}.ogg`,
        );
        this.bgmId = null;
        this.bgm = null; // Обнуляем, чтобы не засорять память
      },

      onplayerror: (id, err) => {
        console.warn(
          `[Audio] ⚠️ Play blocked (autoplay policy). Waiting for user interaction...`,
        );
        this.bgm.once("unlock", () => {
          this.bgm.play();
          this.bgm.fade(0, volume, 2000);
        });
      },
    });
  }

  stopBGM(fadeDuration = 1000) {
    if (this.bgm) {
      // Если время нулевое или кривое — рубим сразу без затухания
      if (!fadeDuration || fadeDuration <= 0) {
        this.bgm.stop();
        this.bgm.unload();
        this.bgm = null;
        return;
      }

      // Защита: получаем громкость, только если это число, иначе берем 1.0
      const currentVol =
        typeof this.bgm.volume() === "number" ? this.bgm.volume() : 1.0;

      this.bgm.fade(currentVol, 0, fadeDuration);

      setTimeout(() => {
        if (this.bgm) {
          this.bgm.stop();
          this.bgm.unload();
          this.bgm = null;
        }
      }, fadeDuration + 50);
    }
  }

  playSFX(trackId, volume = 1.0, loop = false) {
    const srcPath = `${this.basePaths.sfx}${trackId}.ogg`;

    // 🔥 Если этот зацикленный звук уже играет - не запускаем его второй раз
    if (loop && this.activeLoops[trackId]) return;

    // Создаем ОДНУ константу sound
    const sound = new Howl({
      src: [srcPath],
      volume: volume,
      html5: false,
      loop: loop, // Передаем флаг зацикливания внутрь Howler
      onend: () => {
        // Выгружаем из памяти ТОЛЬКО если звук не зациклен
        if (!loop) {
          sound.unload();
        }
      },
    });

    sound.play();

    // 🔥 Если звук зациклен, сохраняем его, чтобы потом можно было остановить
    if (loop) {
      this.activeLoops[trackId] = sound;
    }
  }

  stopSFX(trackId, fade = 500) {
    if (this.activeLoops && this.activeLoops[trackId]) {
      const soundToStop = this.activeLoops[trackId];

      // Плавно убираем звук (если Howler это поддерживает для данного звука)
      soundToStop.fade(soundToStop.volume(), 0, fade);

      // Ждем завершения фейда, затем останавливаем и чистим память
      setTimeout(() => {
        soundToStop.stop();
        soundToStop.unload();
      }, fade + 100);

      // Удаляем из списка активных зацикленных звуков
      delete this.activeLoops[trackId];
    }
  }

  // Добавь это в конец класса AudioManager
  handleAudio(audio) {
    if (!audio) return;

    const play = (a) => {
      if (a.type === "bgm") this.playBGM(a.id, a.volume || 0.5);
      if (a.type === "sfx") this.playSFX(a.id, a.volume, a.loop);
      if (a.type === "stop") {
        this.stopBGM(a.fade !== undefined ? a.fade : 500);
      }
      if (a.type === "stop_sfx") {
        this.stopSFX(a.id, a.fade !== undefined ? a.fade : 500);
      }
    };

    Array.isArray(audio) ? audio.forEach(play) : play(audio);
  }
}

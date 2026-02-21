// src/core/audioManager.js

export class AudioManager {
  constructor() {
    this.bgm = null;
    this.bgmId = null; // ID текущего трека
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
    const src = `${this.basePaths.bgm}${trackId}.mp3`;
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
          `[Audio] Check if file exists: public/music/${trackId}.mp3`,
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

  stopBGM(fade = 500) {
    if (this.bgm) {
      const oldBgm = this.bgm;
      this.bgm = null;
      this.bgmId = null;

      oldBgm.fade(oldBgm.volume(), 0, fade);
      setTimeout(() => {
        oldBgm.stop();
        oldBgm.unload(); // Чистим память
      }, fade + 100);
    }
  }

  playSFX(sfxId, volume = 1.0) {
    const sound = new Howl({
      src: [`${this.basePaths.sfx}${sfxId}.mp3`],
      html5: false,
      volume: volume,
    });
    sound.play();
  }
}

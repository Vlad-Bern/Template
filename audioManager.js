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
      html5: false, // ФИКС: Web Audio вместо HTML5 Audio (нет лимита пула)
      loop: true,
      volume: 0,
      onload: () => {
        console.log(`[Audio] Loaded: ${trackId}`);
        this.bgm.play();
        this.bgm.fade(0, volume, 2000);
      },
      onplayerror: (id, err) => {
        // Просто ждем клика, не спамим ошибками
        this.bgm.once("unlock", () => {
          this.bgm.play();
          this.bgm.fade(0, volume, 2000);
        });
      },
      onloaderror: (id, err) => {
        console.error(`[Audio] Load Error: ${err}`);
        this.bgmId = null; // Сбрасываем ID при ошибке
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

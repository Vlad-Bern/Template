// src/core/audioManager.js
export class AudioManager {
  constructor() {
    this.bgm = null;
    this.bgmId = null;
    this.currentBgmBaseVolume = 0.5; // Память о громкости текущего трека по сценарию

    this.activeLoops = {};
    this.activeSfx = new Set(); // 🔥 Движок "держит в голове" ВСЕ звуки, которые сейчас играют

    this.basePaths = { bgm: "/music/", sfx: "/sfx/" };
  }

  // --- ДИНАМИЧЕСКИЕ МНОЖИТЕЛИ ИЗ НАСТРОЕК (0.0 - 1.0) ---
  get bgmMaster() {
    return (window.settingsManager?.settings?.bgmVolume ?? 100) / 100;
  }

  get sfxMaster() {
    return (window.settingsManager?.settings?.sfxVolume ?? 100) / 100;
  }

  // 🔥 МГНОВЕННОЕ ОБНОВЛЕНИЕ ПРИ ПРОКРУТКЕ ПОЛЗУНКА
  updateVolumes() {
    if (this.bgm && typeof this.currentBgmBaseVolume === "number") {
      this.bgm.volume(this.currentBgmBaseVolume * this.bgmMaster);
    }

    // Проходимся по всем звукам в памяти и меняем им громкость на лету
    this.activeSfx.forEach((sound) => {
      if (typeof sound._baseVolume === "number") {
        sound.volume(sound._baseVolume * this.sfxMaster);
      }
    });
  }

  playBGM(trackId, volume = 0.5) {
    if (this.bgmId === trackId && this.bgm && this.bgm.playing()) return;
    this.stopBGM();

    // Защита от дурака (или глупой горничной), если volume передали как объект
    let cleanVolume = typeof volume === "number" ? volume : 0.5;
    this.currentBgmBaseVolume = cleanVolume;

    // Защита: если bgmMaster почему-то не прогрузился, ставим 1
    let masterVol = typeof this.bgmMaster === "number" ? this.bgmMaster : 1;
    const targetVol = cleanVolume * masterVol;

    const src = `${this.basePaths.bgm}${trackId}.ogg`;
    this.bgmId = trackId;
    this.bgm = new Howl({
      src: [src],
      html5: false,
      loop: true,
      volume: 0,
      onload: () => {
        this.bgm.play();
        this.bgm.fade(0, targetVol, 2000);
      },
      onloaderror: (id, err) => {
        console.error(`[Audio] ❌ Failed to load: ${trackId}`);
        this.bgmId = null;
        this.bgm = null;
      },
      onplayerror: (id, err) => {
        this.bgm.once("unlock", () => {
          this.bgm.play();
          this.bgm.fade(0, targetVol, 2000);
        });
      },
    });
  }

  stopBGM(fadeDuration = 1000) {
    if (this.bgm) {
      if (!fadeDuration || fadeDuration <= 0) {
        this.bgm.stop();
        this.bgm.unload();
        this.bgm = null;
        return;
      }
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

  // Плавное затухание и остановка
  fadeOutBGM(durationInSeconds = 1.5) {
    if (this.bgm && this.bgm.playing()) {
      const currentVol = this.bgm.volume();
      this.bgm.fade(currentVol, 0, durationInSeconds * 1000);

      // Ждем окончания фейда и выключаем трек полностью
      setTimeout(() => {
        if (this.bgm) this.bgm.stop();
      }, durationInSeconds * 1000);
    }
  }

  playSFX(trackId, volume = 1.0, loop = false) {
    const srcPath = `${this.basePaths.sfx}${trackId}.ogg`;
    if (loop && this.activeLoops[trackId]) return;

    const targetVol = volume * this.sfxMaster;

    const sound = new Howl({
      src: [srcPath],
      volume: targetVol,
      html5: false,
      loop: loop,
      onend: () => {
        this.activeSfx.delete(sound); // Удаляем из памяти, когда доиграл (защита от утечек)
        if (!loop) sound.unload();
      },
    });

    sound._baseVolume = volume; // Приклеиваем базовую громкость прямо к объекту звука!
    this.activeSfx.add(sound); // Закидываем в массив активных звуков

    sound.play();
    if (loop) this.activeLoops[trackId] = sound;
  }

  stopSFX(trackId, fade = 500) {
    if (this.activeLoops && this.activeLoops[trackId]) {
      const soundToStop = this.activeLoops[trackId];
      soundToStop.fade(soundToStop.volume(), 0, fade);
      setTimeout(() => {
        this.activeSfx.delete(soundToStop); // Чистим из памяти
        soundToStop.stop();
        soundToStop.unload();
      }, fade + 100);
      delete this.activeLoops[trackId];
    }
  }

  handleAudio(audio) {
    if (!audio) return;
    const play = (a) => {
      if (a.type === "bgm") this.playBGM(a.id, a.volume || 0.5);
      if (a.type === "sfx") this.playSFX(a.id, a.volume, a.loop);
      if (a.type === "stop") this.stopBGM(a.fade !== undefined ? a.fade : 500);
      if (a.type === "stop_sfx")
        this.stopSFX(a.id, a.fade !== undefined ? a.fade : 500);
    };
    Array.isArray(audio) ? audio.forEach(play) : play(audio);
  }

  // Системные звуки UI (клики, наведение, открытие окон)
  playUISound(type) {
    let src = "";
    if (type === "open") src = "/sfx/click-open.ogg";
    if (type === "close") src = "/sfx/click-close.ogg";

    if (!src) return;

    // Системные звуки обычно не зацикливаются, просто проигрываем 1 раз
    const targetVol = 1.0 * this.sfxMaster; // Используем базовую громкость 1.0 * мастер ползунок

    const sound = new Howl({
      src: [src],
      volume: targetVol,
      html5: false,
      onend: () => {
        this.activeSfx.delete(sound);
        sound.unload();
      },
    });

    sound._baseVolume = 1.0;
    this.activeSfx.add(sound);
    sound.play();
  }
}

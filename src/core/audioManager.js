// src/core/audioManager.js
export class AudioManager {
  constructor() {
    this.bgm = null;
    this.bgmId = null;
    this.stems = {}; // МАЙ: Хранилище слоёв для адаптивной музыки
    this.activeStem = null; // Имя текущего играющего слоя (чтобы знать, куда возвращаться)
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
    // 1. Останавливаем обычную музыку (если она играла)
    if (this.bgm) {
      if (!fadeDuration || fadeDuration <= 0) {
        this.bgm.stop();
        this.bgm.unload();
        this.bgm = null;
      } else {
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

    // 2. === МАЙ: Останавливаем ВСЕ адаптивные слои (stems) ===
    if (this.stems) {
      Object.keys(this.stems).forEach((layerName) => {
        const howl = this.stems[layerName];
        if (!fadeDuration || fadeDuration <= 0) {
          howl.stop();
          howl.unload();
        } else {
          const currentVol =
            typeof howl.volume() === "number" ? howl.volume() : 1.0;
          howl.fade(currentVol, 0, fadeDuration);
          setTimeout(() => {
            howl.stop();
            howl.unload();
          }, fadeDuration + 50);
        }
      });

      // Очищаем хранилище слоёв
      if (!fadeDuration || fadeDuration <= 0) {
        this.stems = {};
        this.activeStem = null;
      } else {
        setTimeout(() => {
          this.stems = {};
          this.activeStem = null;
        }, fadeDuration + 50);
      }
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

  // =========================================
  // === МАЙ: АДАПТИВНАЯ МУЗЫКА (STEMS) ===
  // =========================================

  /**
   * Запускает сразу несколько треков синхронно.
   * @param {Object} stemTracks - Объект вида { base: "track1", tension: "track2" }
   * @param {string} initialLayer - Какой слой звучит со старта (например, "base")
   * @param {number} volume - Общая базовая громкость
   */
  playStemBGM(stemTracks, initialLayer = "base", volume = 0.5) {
    this.stopBGM(0);
    this.currentBgmBaseVolume = volume;
    this.stems = {};
    this.activeStem = initialLayer;

    const masterVol = typeof this.bgmMaster === "number" ? this.bgmMaster : 1;
    const targetVol = volume * masterVol;

    // МАЙ: Проверяем, скипает ли игрок текст прямо сейчас
    const isSkipping = window.sm && window.sm.isFastForwarding;

    console.log(`[Audio] 🎵 Запускаем стемы:`, stemTracks);

    Object.keys(stemTracks).forEach((layerName) => {
      const trackId = stemTracks[layerName];
      const src = `${this.basePaths.bgm}${trackId}.ogg`;

      this.stems[layerName] = new Howl({
        src: [src],
        html5: false,
        loop: true,
        volume: 0,
      });

      // МАЙ: Запоминаем конечную цель. Если игрок скипнет, цель изменится!
      this.stems[layerName]._maiTargetVol =
        layerName === initialLayer ? targetVol : 0;
      this.stems[layerName].play();

      // Если файл ещё скачивается
      if (this.stems[layerName].state() !== "loaded") {
        this.stems[layerName].once("load", () => {
          const neededVol = this.stems[layerName]._maiTargetVol;
          if (neededVol > 0) {
            // Если к моменту загрузки всё ещё идёт скип — рубим громкость мгновенно
            if (window.sm && window.sm.isFastForwarding) {
              this.stems[layerName].volume(neededVol);
            } else {
              this.stems[layerName].fade(0, neededVol, 2000);
            }
          }
        });
      } else {
        // Если файл загрузился мгновенно из кэша
        const neededVol = this.stems[layerName]._maiTargetVol;
        if (neededVol > 0) {
          if (isSkipping) this.stems[layerName].volume(neededVol);
          else this.stems[layerName].fade(0, neededVol, 2000);
        }
      }
    });
  }

  /**
   * Плавный переход (кроссфейд) между запущенными слоями
   * @param {string} targetLayer - В какой слой переходим (например, "tension")
   * @param {number} duration - Длительность перехода в мс
   */

  crossfadeStems(targetLayer, duration = 2000) {
    console.log(`[Audio] 🎚️ Кроссфейд в слой: ${targetLayer}`);

    if (!this.stems || Object.keys(this.stems).length === 0) return;
    if (!this.stems[targetLayer]) return;

    const masterVol = typeof this.bgmMaster === "number" ? this.bgmMaster : 1;
    const targetVol = this.currentBgmBaseVolume * masterVol;

    // МАЙ: Если скипаем — длительность фейда равна 0 (Мгновенно)
    const isSkipping = window.sm && window.sm.isFastForwarding;
    const actualDuration = isSkipping ? 0 : duration;

    Object.keys(this.stems).forEach((layerName) => {
      const howl = this.stems[layerName];
      const isTarget = layerName === targetLayer;
      const neededVol = isTarget ? targetVol : 0;

      // Обновляем цель (на случай, если файл ещё качается)
      howl._maiTargetVol = neededVol;

      if (howl.state() === "loaded") {
        // Если скипаем - ставим грубо и чётко. Если читаем - плавно.
        if (actualDuration === 0) {
          howl.volume(neededVol);
        } else {
          howl.fade(howl.volume(), neededVol, actualDuration);
        }
      }
    });

    this.activeStem = targetLayer;
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

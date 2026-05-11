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

    this.basePaths = { bgm: "./music/", sfx: "./sfx/" };
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
    // 1. Обновляем обычный BGM
    if (this.bgm && typeof this.currentBgmBaseVolume === "number") {
      this.bgm.volume(this.currentBgmBaseVolume * this.bgmMaster);
    }

    // 2. === МАЙ: Обновляем адаптивную музыку (Stems) ===
    if (this.stems && Object.keys(this.stems).length > 0) {
      Object.keys(this.stems).forEach((layerName) => {
        const howl = this.stems[layerName];
        const vol = howl._maiTargetVol ?? 0;
        howl.volume(vol);
      });
    }

    // 3. Обновляем SFX
    this.activeSfx.forEach((sound) => {
      if (typeof sound._baseVolume === "number") {
        sound.volume(sound._baseVolume * this.sfxMaster);
      }
    });
  }

  playBGM(trackId, volume = 0.5) {
    if (this.bgmId === trackId && this.bgm && this.bgm.playing()) return;
    this.stopBGM(0);

    let cleanVolume = typeof volume === "number" ? volume : 0.5;
    this.currentBgmBaseVolume = cleanVolume;
    let masterVol = typeof this.bgmMaster === "number" ? this.bgmMaster : 1;
    const targetVol = cleanVolume * masterVol;

    const src = `${this.basePaths.bgm}${trackId}.ogg`;
    this.bgmId = trackId;

    setTimeout(() => {
      if (this.bgmId !== trackId) return;

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
          console.error(`[Audio] ❌ Failed to load: ${trackId}`, err);
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
    }, 50);
  }

  stopBGM(fadeDuration = 1000) {
    this.bgmId = null;
    // 1. Останавливаем обычную музыку
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

    // 2. Останавливаем стемы
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

  fadeOutBGM(durationInSeconds = 1.5) {
    const fadeMs = durationInSeconds * 1000;
    this.bgmId = null;

    if (this.bgm && this.bgm.playing()) {
      const currentVol =
        typeof this.bgm.volume() === "number" ? this.bgm.volume() : 1.0;
      this.bgm.fade(currentVol, 0, fadeMs);
      setTimeout(() => {
        if (this.bgm) {
          this.bgm.stop();
          this.bgm.unload();
          this.bgm = null;
        }
      }, fadeMs + 50);
    }

    if (this.stems && Object.keys(this.stems).length > 0) {
      Object.keys(this.stems).forEach((layerName) => {
        const howl = this.stems[layerName];
        const currentVol =
          typeof howl.volume() === "number" ? howl.volume() : 1.0;
        howl.fade(currentVol, 0, fadeMs);
        setTimeout(() => {
          howl.stop();
          howl.unload();
        }, fadeMs + 50);
      });

      setTimeout(() => {
        this.stems = {};
        this.activeStem = null;
      }, fadeMs + 50);
    }
  }

  // =========================================
  // === МАЙ: АДАПТИВНАЯ МУЗЫКА (STEMS) ===
  // =========================================

  playStemBGM(stemTracks, initialLayer = "base", volume = 0.5) {
    // Проверка на бесшовность: если те же треки уже играют — не перезапускаем
    if (this.stems && Object.keys(this.stems).length > 0) {
      let isSame = true;
      const currentLayerNames = Object.keys(this.stems);
      const newLayerNames = Object.keys(stemTracks);

      if (currentLayerNames.length === newLayerNames.length) {
        for (let layerName of currentLayerNames) {
          const howlObj = this.stems[layerName];

          // Если стем мёртвый — считаем что не совпадает, нужен перезапуск
          if (!howlObj || howlObj.state() === "unloaded") {
            isSame = false;
            break;
          }

          const srcArray = howlObj._src;
          const srcPath = Array.isArray(srcArray)
            ? srcArray[0]
            : srcArray || "";
          const currentTrackName = decodeURIComponent(
            srcPath.split("/").pop().replace(".ogg", ""),
          );

          if (currentTrackName !== stemTracks[layerName]) {
            isSame = false;
            break;
          }
        }
      } else {
        isSame = false;
      }

      if (isSame) {
        if (this.activeStem !== initialLayer) {
          this.crossfadeStems(initialLayer, 2000);
        }
        return;
      }
    }

    // Новые стемы — убиваем старые и запускаем
    this.stopBGM(0);
    this.currentBgmBaseVolume = volume;
    this.stems = {};
    this.activeStem = initialLayer;

    const masterVol = typeof this.bgmMaster === "number" ? this.bgmMaster : 1;
    const targetVol = volume * masterVol;
    const isSkipping = window.sm && window.sm.isFastForwarding;

    Object.keys(stemTracks).forEach((layerName) => {
      const trackId = stemTracks[layerName];
      const src = `${this.basePaths.bgm}${trackId}.ogg`;

      this.stems[layerName] = new Howl({
        src: [src],
        html5: false,
        loop: true,
        volume: 0,
      });
      const howl = this.stems[layerName];

      howl._maiTargetVol = layerName === initialLayer ? targetVol : 0;
      howl.play();

      if (howl.state() !== "loaded") {
        howl.once("load", () => {
          const neededVol = howl._maiTargetVol ?? 0; // ← теперь держим свою ссылку
          if (neededVol > 0) {
            if (window.sm?.isFastForwarding) howl.volume(neededVol);
            else howl.fade(0, neededVol, 2000);
          }
        });
      } else {
        const neededVol = howl._maiTargetVol ?? 0;
        if (neededVol > 0) {
          if (isSkipping) howl.volume(neededVol);
          else howl.fade(0, neededVol, 2000);
        }
      }
    });
  }

  crossfadeStems(targetLayer, duration = 2000) {
    if (
      !this.stems ||
      Object.keys(this.stems).length === 0 ||
      !this.stems[targetLayer]
    ) {
      console.warn(
        `[Stems] ❌ crossfadeStems: слой "${targetLayer}" не найден. stems:`,
        Object.keys(this.stems || {}),
      );
      return;
    }

    const masterVol = typeof this.bgmMaster === "number" ? this.bgmMaster : 1;
    const targetVol = this.currentBgmBaseVolume * masterVol;
    const isSkipping = window.sm && window.sm.isFastForwarding;
    const actualDuration = isSkipping ? 0 : duration;

    Object.keys(this.stems).forEach((layerName) => {
      const howl = this.stems[layerName];
      const neededVol = layerName === targetLayer ? targetVol : 0;

      howl._maiTargetVol = neededVol;

      if (howl.state() === "loaded") {
        const vol = howl._maiTargetVol ?? 0;
        if (actualDuration === 0) howl.volume(neededVol);
        else howl.fade(howl.volume(), neededVol, actualDuration);
      } else {
        howl.once("load", () => {
          const vol = howl._maiTargetVol ?? 0;
          if (actualDuration === 0) howl.volume(vol);
          else howl.fade(0, vol, actualDuration);
        });
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
        this.activeSfx.delete(sound);
        if (!loop) sound.unload();
      },
    });

    sound._baseVolume = volume;
    this.activeSfx.add(sound);

    sound.play();
    if (loop) this.activeLoops[trackId] = sound;
  }

  stopSFX(trackId, fade = 500) {
    if (this.activeLoops && this.activeLoops[trackId]) {
      const soundToStop = this.activeLoops[trackId];
      soundToStop.fade(soundToStop.volume(), 0, fade);
      setTimeout(() => {
        this.activeSfx.delete(soundToStop);
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

  playUISound(type) {
    let src = "";
    if (type === "open") src = "./sfx/click-open.ogg";
    if (type === "close") src = "./sfx/click-close.ogg";

    if (!src) return;

    const targetVol = 1.0 * this.sfxMaster;

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

  getSaveState() {
    const stemTracks = {};

    if (this.stems && Object.keys(this.stems).length > 0) {
      Object.keys(this.stems).forEach((layerName) => {
        const howlObj = this.stems[layerName];
        const srcArray = howlObj?._src;
        const srcPath = Array.isArray(srcArray) ? srcArray[0] : srcArray || "";

        if (srcPath) {
          stemTracks[layerName] = decodeURIComponent(
            srcPath.split("/").pop().replace(".ogg", ""),
          );
        }
      });
    }

    return {
      bgmId: this.bgmId || null,
      stems: Object.keys(stemTracks).length > 0 ? stemTracks : null,
      activeStem: this.activeStem || null,
      volume:
        typeof this.currentBgmBaseVolume === "number"
          ? this.currentBgmBaseVolume
          : 0.5,
    };
  }

  restoreSaveState(audioState) {
    if (!audioState) return;

    if (audioState.stems && Object.keys(audioState.stems).length > 0) {
      const firstLayer = Object.keys(audioState.stems)[0];
      this.playStemBGM(
        audioState.stems,
        audioState.activeStem || firstLayer,
        audioState.volume ?? 0.5,
      );
      return;
    }

    if (audioState.bgmId) {
      this.playBGM(audioState.bgmId, audioState.volume ?? 0.5);
    }
  }
}

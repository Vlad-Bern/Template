import { characters } from "../data/characters.js";
import { state } from "./state.js";

export class UIManager {
  constructor() {
    this.app = document.getElementById("app");
    this.backgroundUpdateId = 0;
    this.runningCameraAnimation = null;
    this.runningCameraMotion = null;

    window.addEventListener("stressUpdated", (e) => {
      this.updateStressVisuals(e.detail.sanity);
    });
  }

  // Метод переезжает из state.js сюда без изменений:
  updateStressVisuals(sanityValue) {
    if (!this.app) return;
    this.app.classList.remove("stress-low", "stress-med", "stress-high");
    this.app.style.removeProperty("--stress-val");
    const stressFactor = (100 - sanityValue) / 100;
    this.app.style.setProperty("--stress-val", stressFactor);
    if (sanityValue <= 20) this.app.classList.add("stress-high");
    else if (sanityValue <= 50) this.app.classList.add("stress-med");
    else if (sanityValue <= 80) this.app.classList.add("stress-low");
  }

  updateNameTag(speakerKey) {
    const nt = document.getElementById("name-tag");
    const db = document.getElementById("dialog-box");
    const bg = document.getElementById("dialog-bg-color");

    if (!nt) return;

    const character = characters[speakerKey];
    let charColor = "#cccccc";
    let finalName = "";

    if (character) {
      charColor = character.color || "#b19cd9";
      // УНИВЕРСАЛЬНАЯ ПРОВЕРКА ДЛЯ ВСЕХ
      if (character.requiresFlag && !state.flags[character.requiresFlag]) {
        finalName = "???";
      } else {
        const lang = window.settingsManager?.settings?.language || "ru";
        finalName =
          typeof character.name === "object"
            ? (character.name[lang] ?? character.name["ru"])
            : character.name;
      }
      nt.textContent = finalName;
      nt.classList.add("active");
    } else if (!speakerKey) {
      charColor = "#555566";
      nt.classList.remove("active");
    } else {
      charColor = "#ffffff";
      nt.textContent = speakerKey;
      nt.classList.add("active");
    }

    nt.style.color = charColor;
    nt.style.borderColor = charColor;

    if (db) db.style.color = "#cccccc";
    if (bg) bg.style.backgroundColor = this.hexToRgba(charColor, 0.15);

    this.animateStrip(charColor);
  }

  hexToRgba(hex, alpha) {
    if (!hex.startsWith("#")) return `rgba(10, 10, 10, ${alpha})`;
    let r = parseInt(hex.slice(1, 3), 16);
    let g = parseInt(hex.slice(3, 5), 16);
    let b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  animateStrip(newColor) {
    const container = document.getElementById("dialog-box-container");
    const fill = document.getElementById("strip-fill");
    if (!container || !fill) return;

    container.style.setProperty("--strip-fill-color", newColor);
    fill.classList.remove("instant");
    fill.style.height = "100%";

    setTimeout(() => {
      container.style.setProperty("--strip-color", newColor);
      fill.classList.add("instant");
      fill.style.height = "0%";
      requestAnimationFrame(() =>
        requestAnimationFrame(() => fill.classList.remove("instant")),
      );
    }, 620);
  }

  handleFx({ darkness, vignette, noise, duration = 1000 }) {
    // МАЙ ФИКС: Убиваем старые анимации перед запуском новых
    if (window.anime) {
      anime.remove(["#darkness-layer", "#noise-layer", "#vignette-layer"]);
    }

    if (darkness !== undefined) {
      anime({
        targets: "#darkness-layer",
        opacity: darkness,
        duration: duration,
        easing: "linear",
      });
    }
    if (noise !== undefined) {
      anime({
        targets: "#noise-layer",
        opacity: noise,
        duration: duration,
        easing: "linear",
      });
    }
    if (vignette !== undefined) {
      anime({
        targets: "#vignette-layer",
        opacity: vignette,
        duration: duration,
        easing: "easeOutSine",
      });
    }
  }

  setOrgasmWhite(active, duration = active ? 100 : 1200) {
    const layer = document.getElementById("orgasm-white-layer");
    if (!layer) return;

    const targetOpacity = active ? 1 : 0;
    state.uiState.orgasmWhite = active === true;

    if (window.anime) {
      anime.remove(layer);
      anime({
        targets: layer,
        opacity: targetOpacity,
        duration: Math.max(0, duration),
        easing: active ? "easeOutExpo" : "easeInOutSine",
      });
    } else {
      layer.style.opacity = String(targetOpacity);
    }
  }

  ensureRunningSpeedLines() {
    const layer = document.getElementById("running-speed-layer");
    if (!layer || layer.childElementCount > 0) return layer;

    const fragment = document.createDocumentFragment();
    const lineCountPerSide = 24;

    ["left", "right"].forEach((side, sideIndex) => {
      for (let i = 0; i < lineCountPerSide; i += 1) {
        const line = document.createElement("span");
        const seed = i + sideIndex * lineCountPerSide;
        const lineY = 1 + ((seed * 37) % 98);
        const vanishingY = 42 + ((seed * 19) % 17);
        const perspectiveAngle =
          (Math.atan2(vanishingY - lineY, 54) * 180) / Math.PI;
        const angleJitter = -2.5 + ((seed * 7) % 6);
        line.className = `running-speed-line ${side}`;
        line.style.setProperty("--line-y", `${lineY}%`);
        line.style.setProperty("--line-width", `${12 + ((seed * 17) % 24)}%`);
        line.style.setProperty("--line-height", `${2 + ((seed * 5) % 8)}px`);
        line.style.setProperty(
          "--line-angle",
          `${side === "right" ? -perspectiveAngle - angleJitter : perspectiveAngle + angleJitter}deg`,
        );
        line.style.setProperty("--line-duration", `${250 + ((seed * 41) % 310)}ms`);
        line.style.setProperty("--line-delay", `${-((seed * 89) % 560)}ms`);
        line.style.setProperty(
          "--line-shift-start",
          side === "right" ? "10px" : "-10px",
        );
        line.style.setProperty(
          "--line-shift-end",
          side === "right" ? "-18px" : "18px",
        );
        line.style.setProperty(
          "--line-opacity",
          String(0.28 + ((seed * 13) % 52) / 100),
        );
        fragment.appendChild(line);
      }
    });

    layer.appendChild(fragment);
    return layer;
  }

  stopRunningCamera() {
    if (this.runningCameraAnimation) {
      this.runningCameraAnimation.pause();
      this.runningCameraAnimation = null;
    }

    const targets = [
      document.getElementById("sharp-background-layers"),
      document.getElementById("character-layer"),
      document.getElementById("interaction-layer"),
      document.getElementById("overlay-layer"),
    ].filter(Boolean);

    targets.forEach((target) => {
      target.style.translate = "";
    });
    this.runningCameraMotion = null;
  }

  startRunningCamera() {
    this.stopRunningCamera();

    const targets = [
      document.getElementById("sharp-background-layers"),
      document.getElementById("character-layer"),
      document.getElementById("interaction-layer"),
      document.getElementById("overlay-layer"),
    ].filter(Boolean);
    if (targets.length === 0 || typeof window.anime !== "function") return;

    const motion = { x: 0, y: 0 };
    this.runningCameraMotion = motion;
    this.runningCameraAnimation = window.anime({
      targets: motion,
      keyframes: [
        { x: -1.4, y: 0.7, duration: 70 },
        { x: 1.1, y: -0.8, duration: 75 },
        { x: -0.6, y: -0.2, duration: 65 },
        { x: 1.3, y: 0.9, duration: 80 },
        { x: 0, y: 0, duration: 70 },
      ],
      easing: "linear",
      loop: true,
      update: () => {
        const translate = `${motion.x.toFixed(2)}px ${motion.y.toFixed(2)}px`;
        targets.forEach((target) => {
          target.style.translate = translate;
        });
      },
    });
  }

  setRunningFx(active, duration = active ? 180 : 280) {
    const layer = this.ensureRunningSpeedLines();
    const viewport = document.getElementById("game-viewport");
    if (!layer || !viewport) return;

    const enabled = active === true;
    state.uiState.runningFx = enabled;
    viewport.classList.toggle("running-fx-active", enabled);

    if (window.anime) {
      anime.remove(layer);
      anime({
        targets: layer,
        opacity: enabled ? 1 : 0,
        duration: Math.max(0, duration),
        easing: enabled ? "easeOutQuad" : "easeInQuad",
      });
    } else {
      layer.style.opacity = enabled ? "1" : "0";
    }

    if (enabled) this.startRunningCamera();
    else this.stopRunningCamera();
  }

  restorePersistentFx() {
    const orgasmLayer = document.getElementById("orgasm-white-layer");

    if (orgasmLayer) {
      if (window.anime) anime.remove(orgasmLayer);
      orgasmLayer.style.opacity =
        state.uiState?.orgasmWhite === true ? "1" : "0";
    }

    this.setRunningFx(state.uiState?.runningFx === true, 0);
  }

  shakeScreen(intensity = "medium") {
    const dialog = document.getElementById("dialog-wrapper");
    if (!dialog) return;
    const force = { small: 2, medium: 5, heavy: 12 }[intensity] || 5;
    anime({
      targets: dialog,
      translateX: [force, -force, 0],
      duration: 300,
      easing: "easeInOutSine",
    });
  }

  async updateBackground(newImg, duration = 400) {
    const updateId = ++this.backgroundUpdateId;
    const sharpLayers = [
      document.getElementById("bg-1"),
      document.getElementById("bg-2"),
    ];
    const blurLayers = [
      document.getElementById("gbg-1"),
      document.getElementById("gbg-2"),
    ];

    const activeIdx = sharpLayers[0].classList.contains("active") ? 0 : 1;
    const inactiveIdx = activeIdx === 0 ? 1 : 0;

    const activeS = sharpLayers[activeIdx];
    const inactiveS = sharpLayers[inactiveIdx];
    const activeB = blurLayers[activeIdx];
    const inactiveB = blurLayers[inactiveIdx];

    // Расшифровываем картинку
    const { loadAsset } = await import("./assetLoader.js");
    const blobUrl = await loadAsset(newImg);
    if (updateId !== this.backgroundUpdateId) {
      return;
    }

    anime.remove([activeS, activeB, inactiveS, inactiveB]);

    activeS.style.opacity = 1;
    activeB.style.opacity = 1;

    inactiveS.style.backgroundImage = `url('${blobUrl}')`;
    inactiveB.style.backgroundImage = `url('${blobUrl}')`;
    inactiveS.style.opacity = 0;
    inactiveB.style.opacity = 0;

    if (duration <= 0) {
      inactiveS.style.opacity = 1;
      inactiveB.style.opacity = 1;
      activeS.style.opacity = 0;
      activeB.style.opacity = 0;
      inactiveS.classList.add("active");
      activeS.classList.remove("active");
      inactiveB.classList.add("active");
      activeB.classList.remove("active");
      return;
    }

    anime({
      targets: [activeS, activeB],
      opacity: 0,
      duration: duration,
      easing: "easeInOutQuad",
    });

    anime({
      targets: [inactiveS, inactiveB],
      opacity: 1,
      duration: duration,
      easing: "easeOutQuad",
      begin: () => {
        inactiveS.classList.add("active");
        activeS.classList.remove("active");
        inactiveB.classList.add("active");
        activeB.classList.remove("active");
      },
    });
  }

  // Метод 1
  showDocument(show = true, contentHtml = null) {
    let container = document.getElementById("overlay-layer");
    let doc = document.getElementById("document-overlay");

    if (show) {
      if (!doc) {
        doc = document.createElement("div");
        doc.id = "document-overlay";
        container.appendChild(doc);
      }
      if (contentHtml) {
        doc.innerHTML = contentHtml;
      } else {
        this.refreshDocument(); // ← просто вызываем второй метод
      }
      doc.style.opacity = 0;
      doc.style.display = "block";
      anime({ targets: doc, opacity: 1, duration: 500, easing: "linear" });
    } else {
      if (doc) {
        anime({
          targets: doc,
          opacity: 0,
          duration: 500,
          easing: "linear",
          complete: function () {
            doc.style.display = "none";
            doc.innerHTML = "";
          },
        });
      }
    }
  }

  // Метод 2 — отдельный, рядом
  refreshDocument() {
    const doc = document.getElementById("document-overlay");
    if (!doc || doc.style.display === "none" || !doc.offsetParent) return;

    const lang = window.settingsManager?.settings?.language || "ru";
    const docTranslations = {
      ru: `
      <h2>РЕГИСТРАЦИОННАЯ КАРТА №082-S</h2>
      <p><b>Студент:</b> Рен Амано</p>
      <p><b>Класс:</b> 2-B (Куратор: Кагами С.)</p>
      <p>Статус "D" подтвержден. Студент ознакомлен с Уставом Синсю и согласен на ограничение прав.</p>
      <h3 class="approved">ОДОБРЕНО</h3>
    `,
      en: `
      <h2>REGISTRATION CARD №082-S</h2>
      <p><b>Student:</b> Ren Amano</p>
      <p><b>Class:</b> 2-B (Supervisor: Kagami S.)</p>
      <p>Status "D" confirmed. Student has been informed of the Shinshu Charter and consents to restriction of rights.</p>
      <h3 class="approved">APPROVED</h3>
    `,
      ja: `
      <h2>登録カード №082-S</h2>
      <p><b>生徒：</b>天野レン</p>
      <p><b>クラス：</b>2-B（担任：鏡 S.）</p>
      <p>ステータス「D」確認済み。生徒は神州学園規則を説明され、権利制限に同意した。</p>
      <h3 class="approved">承認済み</h3>
    `,
    };
    doc.innerHTML = docTranslations[lang] ?? docTranslations["ru"];
  }
}

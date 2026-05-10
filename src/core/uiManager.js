import { characters } from "../data/characters.js";
import { state } from "./state.js";

export class UIManager {
  constructor() {
    this.app = document.getElementById("app");
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

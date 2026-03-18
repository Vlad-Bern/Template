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

    if (character) {
      charColor = character.color || "#b19cd9";
      // Логика флагов
      if (speakerKey === "kagami" && !state.flags["knowsKagami"]) {
        nt.textContent = "???";
      } else {
        nt.textContent = character.name;
      }
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

  handleFx({ darkness, noise, duration = 1000 }) {
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

  updateBackground(newImg) {
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

    [inactiveS, inactiveB].forEach((el) => {
      el.style.backgroundImage = `url('${newImg}')`;
      el.style.opacity = 0;
    });

    anime({
      targets: [activeS, activeB],
      opacity: 0,
      duration: 400,
      easing: "easeInOutQuad",
    });
    anime({
      targets: [inactiveS, inactiveB],
      opacity: 1,
      duration: 400,
      easing: "easeOutQuad",
      begin: () => {
        inactiveS.classList.add("active");
        activeS.classList.remove("active");
        inactiveB.classList.add("active");
        activeB.classList.remove("active");
      },
    });
  }

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
      } else if (!doc.innerHTML) {
        doc.innerHTML = `
        <h2>РЕГИСТРАЦИОННАЯ КАРТА №082-S</h2>
            <p><b>Студент:</b> Рен Амано</p>
            <p><b>Класс:</b> 2-B (Куратор: Кагами С.)</p>
            <p>Статус "D" подтвержден. Студент ознакомлен с Уставом Синсю и согласен на ограничение прав.</p>
            <h3 class="approved">ОДОБРЕНО</h3>
                `;
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
          },
        });
      }
    }
  }
}

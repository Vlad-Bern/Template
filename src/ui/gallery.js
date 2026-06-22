import { inputManager, INPUT_PRIORITY } from "../core/inputManager.js";
import { loadAsset } from "../core/assetLoader.js";

const btnGallery = document.getElementById("btn-gallery");
const closeGalleryBtn = document.getElementById("close-gallery-btn");
const galleryModal = document.getElementById("gallery-modal");

// 🔥 ХОЗЯИН: ПОЛНЫЙ И ТОЧНЫЙ РЕЕСТР ВСЕХ 24 СЮЖЕТНЫХ CG ИЗ ПЕРВОЙ ЧАСТИ ПРОЛОГА
const ALL_CG_LIST = [
  "/bg/cg/prologue/ren_kagami_walk.webp",
  "/bg/cg/prologue/punished_girl_main.webp",
  "/bg/cg/prologue/kagami_lookback.webp",
  "/bg/cg/prologue/kagami_girl_choice.webp",
  "/bg/cg/prologue/punished_girl_lookup.webp",
  "/bg/cg/prologue/punished_girl_lookup_talk.webp",
  "/bg/cg/prologue/punished_girl_blush.webp",
  "/bg/cg/prologue/punished_girl_laugh.webp",
  "/bg/cg/prologue/punished_girl_stretches.webp",
  "/bg/cg/prologue/punished_girl_grab.webp",
  "/bg/cg/prologue/punished_girl_letgo.webp",
  "/bg/cg/prologue/punished_girl_help.webp",
  "/bg/cg/prologue/punished_girl_spred.webp",
  "/bg/cg/prologue/quiz_room_boobs.webp",
  "/bg/cg/prologue/quiz_room_kagamiRuler2.webp",
  "/bg/cg/prologue/quiz_room_kagami.webp",
  "/bg/cg/prologue/quiz_room_footLicking1.webp",
  "/bg/cg/prologue/quiz_room_footLicking2.webp",
  "/bg/cg/prologue/quiz_room_footLicking3.webp",
  "/bg/cg/prologue/quiz_room_kagamiSmirk.webp",
  "/bg/cg/prologue/quiz_room_footLicking4.webp",
  "/bg/cg/prologue/dorm_kagami_noSocks.webp",
  "/bg/cg/prologue/dorm_kagami_withSocks.webp",
  "/bg/cg/prologue/dorm_kagami_phone.webp",
];

// --- ОБЩАЯ ФУНКЦИЯ ЗАКРЫТИЯ ---
const closeGallerySmart = () => {
  const lightboxOverlay = document.getElementById("cg-lightbox-overlay");
  const isLightboxOpen =
    lightboxOverlay && lightboxOverlay.style.display === "flex";

  if (
    !isLightboxOpen &&
    galleryModal &&
    galleryModal.style.display === "flex"
  ) {
    if (window.playUISound) window.playUISound("close");
    galleryModal.style.display = "none";
  }
};

// === ГЛОБАЛЬНАЯ ГАЛЕРЕЯ МАЙ ===
window.unlockCG = (bgPath) => {
  if (!bgPath || !bgPath.includes("/bg/cg/")) return;

  let gallery = [];
  try {
    gallery = JSON.parse(localStorage.getItem("sota_global_gallery")) || [];
  } catch (e) {}

  if (!gallery.includes(bgPath)) {
    gallery.push(bgPath);
    localStorage.setItem("sota_global_gallery", JSON.stringify(gallery));
  }
};

/* МЕТОД: Тотальная очистка всех открытых CG-артов в игре */
const wipeAllGallery = () => {
  localStorage.removeItem("sota_global_gallery");
  console.log(
    "%c[Gallery] Все открытые CG-арты успешно стёрты.",
    "color: #ff4d4f; font-weight: bold;",
  );

  const grid = document.getElementById("gallery-grid");
  if (grid) grid.innerHTML = "\n\n...\n\n";

  const title = galleryModal.querySelector(
    ".gallery-header h2, #gallery-title, h2",
  );
  if (title && title.dataset.baseText) {
    title.innerText = `${title.dataset.baseText} (0 / ${ALL_CG_LIST.length})`;
  }
};

/* Динамическая интеграция кнопки [ DEL ALL ] в шапку галереи */
const injectWipeButtonToGallery = (unlockedCount) => {
  if (!galleryModal) return;

  const title = galleryModal.querySelector(
    ".gallery-header h2, #gallery-title, h2",
  );
  const header = title ? title.parentElement : null;

  if (title) {
    if (header) {
      header.style.display = "flex";
      header.style.alignItems = "center";
    }

    if (!title.dataset.baseText) {
      title.dataset.baseText = title.innerText;
    }

    title.innerText = `${title.dataset.baseText} (${unlockedCount} / ${ALL_CG_LIST.length})`;
    title.style.margin = "0";
    title.style.display = "inline-block";

    if (!document.getElementById("gallery-wipe-all-btn")) {
      const wipeBtn = document.createElement("button");
      wipeBtn.id = "gallery-wipe-all-btn";
      wipeBtn.className = "delete-save-btn";
      wipeBtn.innerText = "[ DEL ALL ]";

      wipeBtn.style.cssText =
        "margin-left: 12px; display: inline-block; background: transparent; border: none; font-size: 11px; font-weight: 600; letter-spacing: 2px; color: rgba(255, 77, 79, 0.85); cursor: pointer; transition: all 0.2s ease;";

      wipeBtn.onmouseenter = () => {
        wipeBtn.style.color = "#ff4444";
        wipeBtn.style.textShadow = "0 0 10px rgba(255, 60, 60, 0.8)";
        wipeBtn.style.transform = "scale(1.05)";
      };
      wipeBtn.onmouseleave = () => {
        wipeBtn.style.color = "rgba(255, 77, 79, 0.85)";
        wipeBtn.style.textShadow = "none";
        wipeBtn.style.transform = "none";
      };

      wipeBtn.addEventListener("click", (e) => {
        e.stopPropagation();

        const lang =
          window.settingsManager && window.settingsManager.settings
            ? window.settingsManager.settings.language
            : "ru";
        const dict = window.settingsManager
          ? window.settingsManager.uiTranslations[lang]
          : null;

        const confirmText = dict
          ? dict.confirm_wipe_gallery ||
            "БЕЗВОЗВРАТНО ЗАБЛОКИРОВАТЬ И СТЕРЕТЬ ВСЕ НАЙДЕННЫЕ КАРТИНКИ ИЗ ГАЛЕРЕИ?"
          : "БЕЗВОЗВРАТНО ЗАБЛОКИРОВАТЬ И СТЕРЕТЬ ВСЕ НАЙДЕННЫЕ КАРТИНКИ ИЗ ГАЛЕРЕИ?";

        window.showConfirm(confirmText, () => {
          wipeAllGallery();
        });
      });

      title.after(wipeBtn);

      if (closeGalleryBtn) {
        closeGalleryBtn.style.marginLeft = "auto";
      }
    }
  }
};

// --- ОТКРЫТИЕ ГАЛЕРЕИ ---
if (btnGallery) {
  btnGallery.addEventListener("click", () => {
    btnGallery.blur();
    if (window.playUISound) window.playUISound("open");

    if (galleryModal) {
      galleryModal.style.display = "flex";

      let gallery = [];
      try {
        gallery = JSON.parse(localStorage.getItem("sota_global_gallery")) || [];
      } catch (e) {}

      injectWipeButtonToGallery(gallery.length);

      const grid = document.getElementById("gallery-grid");
      if (grid) {
        grid.innerHTML = "";

        if (gallery.length === 0) {
          grid.innerHTML = "\n\n...\n\n";
        } else {
          gallery.forEach((path, index) => {
            const img = document.createElement("img");

            // 🔥 ХОЗЯИН: ТОТАЛЬНЫЙ ФИКС ЛАГОВ. Для сетки превью ВСЕГДА принудительно берём
            // легкие пережатые картинки из папки bg_mobile, созданной скриптом compress.mjs!
            const previewPath = path
              .replace("/bg/", "/bg_mobile/")
              .replace("./bg/", "./bg_mobile/");

            loadAsset(previewPath).then((blobUrl) => {
              img.src = blobUrl;
            });

            img.className = "sota-gallery-item";

            // Оставляем как дополнительный микро-слой защиты для старых мобилок
            img.loading = "lazy";
            img.decoding = "async";

            img.onclick = () => {
              if (window.playUISound) window.playUISound("open");
              window.showLightbox(index);
            };
            grid.appendChild(img);
          });
        }
      }
    }
  });
}

// --- ЗАКРЫТИЕ ГАЛЕРЕИ ПО ПКМ НА УРОВНЕ ДОКУМЕНТА ---
document.addEventListener(
  "contextmenu",
  (e) => {
    const lightboxOverlay = document.getElementById("cg-lightbox-overlay");
    const isLightboxOpen =
      lightboxOverlay && lightboxOverlay.style.display === "flex";

    if (
      galleryModal &&
      galleryModal.style.display === "flex" &&
      !isLightboxOpen
    ) {
      e.preventDefault();
      e.stopPropagation();
      closeGallerySmart();
    }
  },
  { capture: true },
);

if (galleryModal) {
  galleryModal.addEventListener("click", (e) => {
    if (
      document.getElementById("confirm-backdrop")?.classList.contains("active")
    )
      return;

    if (e.target === galleryModal) {
      closeGallerySmart();
    }
  });
}

// --- ЗАКРЫТИЕ ПО ESC ---
document.addEventListener("keydown", (e) => {
  if (document.getElementById("confirm-backdrop")?.classList.contains("active"))
    return;
  if (e.key === "Escape") closeGallerySmart();
});

// --- ЗАКРЫТИЕ ПО КРЕСТИКУ ---
if (closeGalleryBtn) {
  closeGalleryBtn.addEventListener("click", closeGallerySmart);
}

// Обработчик кнопки выхода с анимацией
const btnExit = document.getElementById("btn-exit");
if (btnExit) {
  btnExit.addEventListener("click", () => {
    if (window.playUISound) window.playUISound("close");
    document.body.style.pointerEvents = "none";

    if (window.playUISound) window.playUISound("open");

    const exitOverlay = document.createElement("div");
    exitOverlay.style.position = "fixed";
    exitOverlay.style.top = "0";
    exitOverlay.style.left = "0";
    exitOverlay.style.right = "0";
    exitOverlay.style.bottom = "0";
    exitOverlay.style.width = "100%";
    exitOverlay.style.height = "100%";
    exitOverlay.style.backgroundColor = "#000000";
    exitOverlay.style.color = "#ff0000";
    exitOverlay.style.display = "flex";
    exitOverlay.style.justifyContent = "center";
    exitOverlay.style.alignItems = "center";
    exitOverlay.style.textAlign = "center";
    exitOverlay.style.boxSizing = "border-box";
    exitOverlay.style.padding = "20px";
    exitOverlay.style.fontSize = "clamp(1.5rem, 6vw, 3rem)";
    exitOverlay.style.fontFamily = "'Courier New', Courier, monospace";
    exitOverlay.style.textShadow = "0 0 10px rgba(255, 0, 0, 0.5)";
    exitOverlay.style.opacity = "0";
    exitOverlay.style.transition = "opacity 2s ease-in-out";
    exitOverlay.style.zIndex = "9999";

    const lang =
      window.settingsManager && window.settingsManager.settings
        ? window.settingsManager.settings.language
        : "ru";
    const dict = window.settingsManager
      ? window.settingsManager.uiTranslations[lang]
      : null;

    exitOverlay.innerText = dict
      ? dict.exit_wait
      : "Я БУДУ ЖДАТЬ ТВОЕГО ВОЗВРАЩЕНИЯ...";

    document.body.appendChild(exitOverlay);
    void exitOverlay.offsetWidth;
    exitOverlay.style.opacity = "1";

    setTimeout(() => {
      if (typeof nw !== "undefined") {
        nw.App.quit();
        return;
      }
      if (
        window.Capacitor &&
        window.Capacitor.Plugins &&
        window.Capacitor.Plugins.App
      ) {
        window.Capacitor.Plugins.App.exitApp();
        return;
      }
      window.close();
    }, 3000);
  });
}

// === ЛОГИКА LIGHTBOX СЛАЙДЕРА ===
const lightboxOverlay = document.createElement("div");
lightboxOverlay.id = "cg-lightbox-overlay";
lightboxOverlay.style.cssText =
  "display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.95); z-index: 999999; justify-content: center; align-items: center; user-select: none; flex-direction: column;";

const lightboxImg = document.createElement("img");
lightboxImg.style.cssText =
  "max-width: 90vw; max-height: 90vh; object-fit: contain; box-shadow: 0 0 30px rgba(0,0,0,1); border: 2px solid #333;";

const lightboxClose = document.createElement("div");
lightboxClose.innerHTML = "✖";
lightboxClose.style.cssText =
  "position: absolute; top: 20px; right: 30px; color: #fff; font-size: 35px; cursor: pointer; z-index: 1000000; opacity: 0.7; transition: opacity 0.2s;";
lightboxClose.onmouseenter = () => (lightboxClose.style.opacity = "1");
lightboxClose.onmouseleave = () => (lightboxClose.style.opacity = "0.7");

const prevBtn = document.createElement("div");
prevBtn.innerHTML = "&#10094;";
prevBtn.style.cssText =
  "position: absolute; left: 20px; top: 50%; transform: translateY(-50%); color: #fff; font-size: 50px; cursor: pointer; padding: 20px; z-index: 1000000; opacity: 0.5; transition: opacity 0.2s;";
prevBtn.onmouseenter = () => (prevBtn.style.opacity = "1");
prevBtn.onmouseleave = () => (prevBtn.style.opacity = "0.5");

const nextBtn = document.createElement("div");
nextBtn.innerHTML = "&#10095;";
nextBtn.style.cssText =
  "position: absolute; right: 20px; top: 50%; transform: translateY(-50%); color: #fff; font-size: 50px; cursor: pointer; padding: 20px; z-index: 1000000; opacity: 0.5; transition: opacity 0.2s;";
nextBtn.onmouseenter = () => (nextBtn.style.opacity = "1");
nextBtn.onmouseleave = () => (nextBtn.style.opacity = "0.5");

lightboxOverlay.appendChild(lightboxImg);
lightboxOverlay.appendChild(lightboxClose);
lightboxOverlay.appendChild(prevBtn);
lightboxOverlay.appendChild(nextBtn);
document.body.appendChild(lightboxOverlay);

let lightboxImages = [];
let currentLightboxIndex = 0;

function updateLightboxImage() {
  if (lightboxImages.length === 0) return;
  const rawPath = lightboxImages[currentLightboxIndex];

  // 🔥 А здесь при открытии на весь экран отдаем управление системе,
  // чтобы ПК-версия вывела честные 4К, а мобилки сохранили память!
  const resolvedPath = window.sm?._getOptimizedBgPath
    ? window.sm._getOptimizedBgPath(rawPath)
    : rawPath;
  loadAsset(resolvedPath).then((blobUrl) => {
    lightboxImg.src = blobUrl;
  });
}

window.showLightbox = function (index) {
  try {
    lightboxImages =
      JSON.parse(localStorage.getItem("sota_global_gallery")) || [];
  } catch (e) {
    lightboxImages = [];
  }

  if (lightboxImages.length === 0) return;

  currentLightboxIndex = index;
  updateLightboxImage();
  lightboxOverlay.style.display = "flex";
};

function closeLightbox() {
  if (window.playUISound) window.playUISound("open");
  lightboxOverlay.style.display = "none";
}

function nextLightboxImg() {
  if (lightboxImages.length === 0) return;
  currentLightboxIndex = (currentLightboxIndex + 1) % lightboxImages.length;
  updateLightboxImage();
}

function prevLightboxImg() {
  if (lightboxImages.length === 0) return;
  currentLightboxIndex =
    (currentLightboxIndex - 1 + lightboxImages.length) % lightboxImages.length;
  updateLightboxImage();
}

lightboxClose.addEventListener("click", closeLightbox);
prevBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  prevLightboxImg();
});
nextBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  nextLightboxImg();
});

lightboxOverlay.addEventListener("click", (e) => {
  if (e.target === lightboxOverlay) closeLightbox();
});

lightboxOverlay.addEventListener("contextmenu", (e) => {
  if (lightboxOverlay.style.display === "flex") {
    e.preventDefault();
    e.stopPropagation();
    closeLightbox();
  }
});

inputManager.on(
  "keydown",
  (e) => {
    if (lightboxOverlay.style.display === "flex") {
      if (e.key === "Escape") {
        closeLightbox();
        return true;
      }
      if (e.key === "ArrowRight" || e.code === "KeyD") {
        if (window.playUISound) window.playUISound("open");
        nextLightboxImg();
        return true;
      }
      if (e.key === "ArrowLeft" || e.code === "KeyA") {
        if (window.playUISound) window.playUISound("open");
        prevLightboxImg();
        return true;
      }
    }
    return false;
  },
  { priority: INPUT_PRIORITY.CONFIRM },
);

let touchstartX = 0;
let touchendX = 0;

lightboxOverlay.addEventListener(
  "touchstart",
  (e) => {
    touchstartX = e.changedTouches[0].screenX;
  },
  { passive: true },
);

lightboxOverlay.addEventListener(
  "touchend",
  (e) => {
    e.stopPropagation();
    touchendX = e.changedTouches[0].screenX;
    handleSwipeGesture();
  },
  { passive: true },
);

function handleSwipeGesture() {
  if (touchendX < touchstartX - 50) {
    if (window.playUISound) window.playUISound("open");
    nextLightboxImg();
  }
  if (touchendX > touchstartX + 50) {
    if (window.playUISound) window.playUISound("open");
    prevLightboxImg();
  }
}

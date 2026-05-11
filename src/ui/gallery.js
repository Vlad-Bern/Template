import { inputManager, INPUT_PRIORITY } from "../core/inputManager.js";
import { loadAsset } from "../core/assetLoader.js";

const btnGallery = document.getElementById("btn-gallery");
const closeGalleryBtn = document.getElementById("close-gallery-btn");
const galleryModal = document.getElementById("gallery-modal");

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
  // Проверяем, есть ли путь и относится ли он к CG
  if (!bgPath || !bgPath.includes("/bg/cg/")) return;

  let gallery = [];
  try {
    // Достаем наш тайник из памяти браузера/NW.js
    gallery = JSON.parse(localStorage.getItem("sota_global_gallery")) || [];
  } catch (e) {}

  // Если такой картинки еще нет, жадно забираем её себе!
  if (!gallery.includes(bgPath)) {
    gallery.push(bgPath);
    localStorage.setItem("sota_global_gallery", JSON.stringify(gallery));
  }
};

// --- ОТКРЫТИЕ ГАЛЕРЕИ ---
if (btnGallery) {
  btnGallery.addEventListener("click", () => {
    btnGallery.blur();
    if (window.playUISound) window.playUISound("open");

    if (galleryModal) {
      galleryModal.style.display = "flex";
      const grid = document.getElementById("gallery-grid");
      grid.innerHTML = "";

      let gallery = [];
      try {
        gallery = JSON.parse(localStorage.getItem("sota_global_gallery")) || [];
      } catch (e) {}

      if (gallery.length === 0) {
        grid.innerHTML = "\n\n...\n\n";
      } else {
        gallery.forEach((path, index) => {
          const img = document.createElement("img");
          const resolvedPath = window.sm?._getOptimizedBgPath
            ? window.sm._getOptimizedBgPath(path)
            : path;
          loadAsset(resolvedPath).then((blobUrl) => {
            img.src = blobUrl;
          });

          img.className = "sota-gallery-item";

          // === МАЙ: СУПЕР ОПТИМИЗАЦИЯ ДЛЯ 4K КАРТИНОК ===
          img.loading = "lazy"; // Не грузить, пока не доскроллим
          img.decoding = "async"; // Декодировать в фоновом потоке (убирает фризы при скролле)

          img.onclick = () => {
            if (window.playUISound) window.playUISound("open");
            window.showLightbox(index);
          };
          grid.appendChild(img);
        });
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

    // Если открыта галерея, но НЕ открыт полноэкранный просмотр
    if (
      galleryModal &&
      galleryModal.style.display === "flex" &&
      !isLightboxOpen
    ) {
      e.preventDefault(); // Блокируем системное меню браузера
      e.stopPropagation(); // Останавливаем всплытие, чтобы другие слои не реагировали
      closeGallerySmart();
    }
  },
  { capture: true },
); // capture: true гарантирует, что мы поймаем клик первыми

if (galleryModal) {
  galleryModal.addEventListener("click", (e) => {
    // Проверяем, что кликнули ИМЕННО по темному фону, а не по белому блоку внутри
    if (e.target === galleryModal) {
      closeGallerySmart();
    }
  });
}

// --- ЗАКРЫТИЕ ПО ESC ---
document.addEventListener("keydown", (e) => {
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
    // Блокируем интерфейс, чтобы игрок ничего не нажал во время анимации
    document.body.style.pointerEvents = "none";

    // Если у вас есть звук интерфейса, можно воспроизвести тихий щелчок
    if (window.playUISound) window.playUISound("open");

    // Создаем оверлей для затемнения
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

    // Flexbox для центрирования контейнера
    exitOverlay.style.display = "flex";
    exitOverlay.style.justifyContent = "center";
    exitOverlay.style.alignItems = "center";

    // Критически важно для мобилок:
    exitOverlay.style.textAlign = "center";
    exitOverlay.style.boxSizing = "border-box";
    exitOverlay.style.padding = "20px";

    // Размер шрифта будет меняться от 1.5rem на мобилках до 3rem на ПК
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

    // Принудительный перерасчет стилей, чтобы браузер понял, что нужно анимировать
    void exitOverlay.offsetWidth;

    // Запускаем анимацию затемнения
    exitOverlay.style.opacity = "1";

    // Ждем 3 секунды (2 сек анимации + 1 сек, чтобы игрок прочитал), затем закрываем
    setTimeout(() => {
      if (typeof nw !== "undefined") {
        nw.App.quit(); // Закрытие для сборки NW.js
      } else {
        window.close(); // Попытка закрытия вкладки (работает не во всех браузерах)\
      }
    }, 3000);
  });
}

// === МАЙ: ПРИВАТНЫЙ СЛАЙДЕР ДЛЯ CG (LIGHTBOX) ===

// 1. Создаем элементы интерфейса слайдера прямо из скрипта
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
prevBtn.innerHTML = "&#10094;"; // Стрелочка влево
prevBtn.style.cssText =
  "position: absolute; left: 20px; top: 50%; transform: translateY(-50%); color: #fff; font-size: 50px; cursor: pointer; padding: 20px; z-index: 1000000; opacity: 0.5; transition: opacity 0.2s;";
prevBtn.onmouseenter = () => (prevBtn.style.opacity = "1");
prevBtn.onmouseleave = () => (prevBtn.style.opacity = "0.5");

const nextBtn = document.createElement("div");
nextBtn.innerHTML = "&#10095;"; // Стрелочка вправо
nextBtn.style.cssText =
  "position: absolute; right: 20px; top: 50%; transform: translateY(-50%); color: #fff; font-size: 50px; cursor: pointer; padding: 20px; z-index: 1000000; opacity: 0.5; transition: opacity 0.2s;";
nextBtn.onmouseenter = () => (nextBtn.style.opacity = "1");
nextBtn.onmouseleave = () => (nextBtn.style.opacity = "0.5");

// Собираем всё вместе и прячем в тело документа
lightboxOverlay.appendChild(lightboxImg);
lightboxOverlay.appendChild(lightboxClose);
lightboxOverlay.appendChild(prevBtn);
lightboxOverlay.appendChild(nextBtn);
document.body.appendChild(lightboxOverlay);

// 2. Логика переключения
let lightboxImages = [];
let currentLightboxIndex = 0;

function updateLightboxImage() {
  if (lightboxImages.length === 0) return;
  const rawPath = lightboxImages[currentLightboxIndex];
  const resolvedPath = window.sm?._getOptimizedBgPath
    ? window.sm._getOptimizedBgPath(rawPath)
    : rawPath;
  loadAsset(resolvedPath).then((blobUrl) => {
    lightboxImg.src = blobUrl;
  });
}

window.showLightbox = function (index) {
  // Достаем свежий массив картинок
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

// 3. Обработчики кликов
lightboxClose.addEventListener("click", closeLightbox);
prevBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  prevLightboxImg();
});
nextBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  nextLightboxImg();
});

// Закрываем, если кликнули по черному фону вокруг картинки
lightboxOverlay.addEventListener("click", (e) => {
  if (e.target === lightboxOverlay) closeLightbox();
});

lightboxOverlay.addEventListener("contextmenu", (e) => {
  if (lightboxOverlay.style.display === "flex") {
    e.preventDefault(); // Не даем открыться меню браузера
    e.stopPropagation();
    closeLightbox();
  }
});

// 4. Подключаем клавиатуру (Escape и стрелочки) через глобальный inputManager
// Это гарантирует, что галерея перехватит клавиши первой!

inputManager.on(
  "keydown",
  (e) => {
    // Реагируем только если открыта картинка на весь экран
    if (lightboxOverlay.style.display === "flex") {
      if (e.key === "Escape") {
        closeLightbox();
        return true; // Съедаем событие
      }
      if (e.key === "ArrowRight" || e.code === "KeyD") {
        if (window.playUISound) window.playUISound("open");
        nextLightboxImg();
        return true; // Съедаем событие, чтобы игра не среагировала
      }
      if (e.key === "ArrowLeft" || e.code === "KeyA") {
        if (window.playUISound) window.playUISound("open");
        prevLightboxImg();
        return true;
      }
    }
    return false; // Если мы не в галерее, пропускаем клавишу дальше
  },
  { priority: INPUT_PRIORITY.CONFIRM }, // Ставим максимальный приоритет (как у confirm-окон)
);

// === МАЙ: АДАПТАЦИЯ ДЛЯ ПАЛЬЧИКОВ (СВАЙПЫ) ===
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
  // Если провели пальцем влево (следующая картинка)
  if (touchendX < touchstartX - 50) {
    if (window.playUISound) window.playUISound("open");
    nextLightboxImg();
  }
  // Если провели пальцем вправо (предыдущая картинка)
  if (touchendX > touchstartX + 50) {
    if (window.playUISound) window.playUISound("open");
    prevLightboxImg();
  }
}

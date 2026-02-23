export class BgManager {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.cache = new Set(); // Хранилище загруженных урлов
  }

  // 🔥 Вызывай это ДО того, как сцена реально начнется
  preload(urls) {
    // urls может быть строкой или массивом
    const urlArray = Array.isArray(urls) ? urls : [urls];

    urlArray.forEach((url) => {
      if (!this.cache.has(url)) {
        const img = new Image();
        img.src = url;
        this.cache.add(url);
        // Картинка тихонько качается в фоне
      }
    });
  }

  setBackground(url) {
    // Очищаем всё внутри на случай, если там застрял какой-то мусор (раньше тут было видео)
    this.container.innerHTML = "";

    this.container.style.backgroundImage = `url('${url}')`;
    this.container.style.backgroundSize = "cover";
    this.container.style.backgroundPosition = "center";
    const wideBlur = document.getElementById("ultra-wide-blur-layer");
    if (wideBlur) {
      wideBlur.style.backgroundImage = `url('${url}')`;
    }
  }
}

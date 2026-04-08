export class BgManager {
  constructor(containerId, blurLayerId = "ultra-wide-blur-layer") {
    this.container = document.getElementById(containerId);
    this.blurLayer = document.getElementById(blurLayerId);
    this.cache = new Set();
  }

  setBackground(url) {
    if (!this.container) return;
    this.container.style.backgroundImage = `url('${url}')`;
    this.container.style.backgroundSize = "cover";
    this.container.style.backgroundPosition = "center";
    if (this.blurLayer) {
      this.blurLayer.style.backgroundImage = `url('${url}')`;
      this.blurLayer.style.backgroundSize = "cover";
      this.blurLayer.style.backgroundPosition = "center";
    }
  }

  preload(urls) {
    const urlArray = Array.isArray(urls) ? urls : [urls];
    const promises = urlArray
      .filter((url) => !this.cache.has(url))
      .map(
        (url) =>
          new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
              this.cache.add(url);
              resolve();
            };
            img.onerror = () => {
              resolve();
            };
            img.src = url;
          }),
      );
    return Promise.all(promises);
  }
}

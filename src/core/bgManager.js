export class BgManager {
  constructor(containerId, blurLayerId = "ultra-wide-blur-layer") {
    this.container = document.getElementById(containerId);
    this.blurLayer = document.getElementById(blurLayerId);
    this.cache = new Map(); // ключ → timestamp последнего использования
    this.cacheLimit = 30;
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
      if (this.cache.has(url)) this.cache.set(url, Date.now());
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
              this._addToCache(url);
              resolve();
            };
            img.onerror = () => resolve();
            img.src = url;
          }),
      );
    return Promise.all(promises);
  }

  _addToCache(url) {
    this.cache.set(url, Date.now());
    if (this.cache.size > this.cacheLimit) {
      // Выкидываем самый старый по LRU
      const oldest = [...this.cache.entries()].sort((a, b) => a[1] - b[1])[0];
      if (oldest) this.cache.delete(oldest[0]);
    }
  }
}

import { loadAsset } from "./assetLoader.js";

export class BgManager {
  constructor(containerId, blurLayerId = "ultra-wide-blur-layer") {
    this.container = document.getElementById(containerId);
    this.blurLayer = document.getElementById(blurLayerId);
    this.cache = new Map(); // ключ → blob URL
    this.cacheLimit = 30;
  }

  async setBackground(url) {
    if (!this.container) return;
    const blobUrl = this.cache.has(url)
      ? this.cache.get(url)
      : await loadAsset(url);
    this.container.style.backgroundImage = `url('${blobUrl}')`;
    this.container.style.backgroundSize = "cover";
    this.container.style.backgroundPosition = "center";
    if (this.blurLayer) {
      this.blurLayer.style.backgroundImage = `url('${blobUrl}')`;
      this.blurLayer.style.backgroundSize = "cover";
      this.blurLayer.style.backgroundPosition = "center";
      if (!this.cache.has(url)) this._addToCache(url, blobUrl);
    }
  }

  preload(urls) {
    const urlArray = Array.isArray(urls) ? urls : [urls];
    const promises = urlArray
      .filter((url) => !this.cache.has(url))
      .map(
        (url) =>
          new Promise((resolve) => {
            loadAsset(url)
              .then((blobUrl) => {
                const img = new Image();
                img.onload = () => {
                  this._addToCache(url, blobUrl);
                  resolve();
                };
                img.onerror = () => resolve();
                img.src = blobUrl;
              })
              .catch(() => resolve());
          }),
      );
    return Promise.all(promises);
  }

  _addToCache(url, blobUrl) {
    this.cache.set(url, blobUrl); // храним blob URL, не timestamp
    if (this.cache.size > this.cacheLimit) {
      // Выкидываем самый старый по LRU
      const oldest = [...this.cache.entries()].sort((a, b) => a[1] - b[1])[0];
      if (oldest) this.cache.delete(oldest[0]);
    }
  }
}

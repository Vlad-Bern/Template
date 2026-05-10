// characterManager.js
import { characters } from "../data/characters.js";
import { loadAsset } from "./assetLoader.js";

export class CharacterManager {
  constructor() {
    this.container = document.getElementById("character-layer");
    this.characters = {};
    this.preloadedImages = new Map(); // Кэш: path → blob URL
  }

  async show(id, emotion = "neutral", position = "center", animFunc = null) {
    const char = characters[id];
    if (!char) {
      console.warn(`[CharManager] Character ${id} not found.`);
      return;
    }

    // Ищем ОБЕРТКУ персонажа, а не саму картинку
    let wrapper = this.container.querySelector(`[data-wrapper-id="${id}"]`);
    let img = null;
    let isNew = false;

    // Если персонажа (обертки) еще нет на экране — создаём
    if (!wrapper) {
      isNew = true;

      // 1. Создаем невидимую коробку-обертку
      wrapper = document.createElement("div");
      wrapper.className = `character-wrapper pos-${position}`;
      wrapper.dataset.wrapperId = id;

      // 2. Создаем саму картинку
      img = document.createElement("img");
      img.className = "character-sprite";
      img.dataset.charId = id;

      // Вкладываем картинку в коробку, а коробку в слой
      wrapper.appendChild(img);
      this.container.appendChild(wrapper);
    } else {
      // Если персонаж уже есть, просто находим его картинку внутри обертки
      img = wrapper.querySelector("img");
      // И обновляем позицию КОРОБКИ, если она изменилась
      wrapper.className = `character-wrapper pos-${position}`;
    }

    // Обновляем картинку (src) на нужную эмоцию
    let spritePath = null;
    if (char.sprites && char.sprites[emotion]) {
      spritePath = char.sprites[emotion];
    } else if (char.sprites && char.sprites.neutral) {
      spritePath = char.sprites.neutral;
    }

    if (spritePath) {
      // Берём из кэша или расшифровываем
      const blobUrl = this.preloadedImages.has(spritePath)
        ? this.preloadedImages.get(spritePath)
        : await loadAsset(spritePath);
      if (!this.preloadedImages.has(spritePath)) {
        this.preloadedImages.set(spritePath, blobUrl);
      }
      img.src = blobUrl;
    } else {
      img.src = "";
      wrapper.style.display = "none";
    }

    // Запускаем анимацию на КАРТИНКУ
    if (isNew && animFunc) {
      animFunc(img);
    } else if (!isNew) {
      img.style.opacity = 1;
      // Если передана анимация (например "bounce") - запускаем её!
      if (animFunc) animFunc(img);
    }
  }

  hide(id, animFunc) {
    // Ищем обертку
    const wrapper = this.container.querySelector(`[data-wrapper-id="${id}"]`);
    if (!wrapper) return;

    // Картинка, которую будем анимировать перед удалением
    const sprite = wrapper.querySelector("img");

    if (animFunc && sprite) {
      // Анимация исчезновения картинки, затем удаляем всю коробку
      animFunc(sprite).finished.then(() => wrapper.remove());
    } else {
      wrapper.remove();
    }
  }

  // Метод предзагрузки
  async preloadCharacter(charData) {
    const promises = Object.values(charData.sprites).map((path) => {
      if (this.preloadedImages.has(path)) return Promise.resolve();

      return new Promise((resolve) => {
        loadAsset(path)
          .then((blobUrl) => {
            const img = new Image();
            img.onload = () => {
              this.preloadedImages.set(path, blobUrl);
              resolve();
            };
            img.onerror = () => {
              console.error(`Failed to preload: ${path}`);
              resolve();
            };
            img.src = blobUrl;
          })
          .catch(() => resolve());
      });
    });

    await Promise.all(promises);
  }
}

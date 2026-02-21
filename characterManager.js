// characterManager.js
import { characters } from "../data/characters.js";

export class CharacterManager {
  constructor() {
    this.container = document.getElementById("character-layer");
    this.characters = {};
    this.preloadedImages = new Map(); // Кэш
  }

  show(id, emotion, position, animFunc) {
    const char = characters[id];
    if (!char) return console.warn(`[CM] Unknown character: ${id}`);

    console.log(`[CM] Showing: ${char.name} (${emotion})`);

    // Удаляем старый спрайт, если есть
    this.hide(id);

    // Создаём img
    const img = document.createElement("img");
    img.src = char.sprites[emotion] || char.sprites.neutral;
    img.className = `character-sprite pos-${position}`;
    img.dataset.charId = id;

    this.container.appendChild(img);

    // Применяем анимацию (если передана)
    if (animFunc) {
      animFunc(img);
    }
  }

  hide(id, animFunc) {
    const sprite = this.container.querySelector(`[data-char-id="${id}"]`);
    if (!sprite) return;

    if (animFunc) {
      // Анимация исчезновения, потом удаление
      animFunc(sprite).finished.then(() => sprite.remove());
    } else {
      sprite.remove();
    }
  }

  // Метод предзагрузки
  async preloadCharacter(charData) {
    const promises = Object.values(charData.sprites).map((path) => {
      if (this.preloadedImages.has(path)) return Promise.resolve();

      return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = path;
        img.onload = () => {
          this.preloadedImages.set(path, img);
          resolve();
        };
        img.onerror = () => {
          console.error(`Failed to preload: ${path}`);
          resolve(); // Не стопаем игру если картинка битая
        };
      });
    });

    await Promise.all(promises);
    console.log(`Preloaded sprites for ${charData.name}`);
  }
}

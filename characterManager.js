// characterManager.js
import { characters } from "../data/characters.js";

export class CharacterManager {
  constructor() {
    this.container = document.getElementById("character-layer");
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
}

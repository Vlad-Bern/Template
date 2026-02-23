// characterManager.js
import { characters } from "../data/characters.js";

export class CharacterManager {
  constructor() {
    this.container = document.getElementById("character-layer");
    this.characters = {};
    this.preloadedImages = new Map(); // Кэш
  }

  show(id, position = "center", emotion = "neutral", animFunc = null) {
    const char = characters[id];
    if (!char) {
      console.warn(`[CharManager] Character ${id} not found.`);
      return;
    }

    // 1. Ищем, есть ли уже этот персонаж на экране
    let img = this.container.querySelector(`[data-char-id="${id}"]`);
    let isNew = false; // Флаг, чтобы понять, нужно ли проигрывать анимацию выхода (animFunc)

    // 2. Если персонажа нет — создаём его
    if (!img) {
      img = document.createElement("img");
      img.className = "character-sprite";
      img.dataset.charId = id;
      this.container.appendChild(img);
      isNew = true; // Он только что появился!
    }

    // 3. Обновляем позицию (меняем класс, убирая старые pos-...)
    img.className = `character-sprite pos-${position}`;

    // 4. Меняем картинку (src) на нужную эмоцию
    // Если у перса нет спрайтов (например, второстепенный), ставим заглушку или прозрачную картинку
    if (char.sprites && char.sprites[emotion]) {
      img.src = char.sprites[emotion];
    } else if (char.sprites && char.sprites.neutral) {
      img.src = char.sprites.neutral; // Фолбэк на нейтральную
    } else {
      img.src = ""; // Для персонажей без графики (например, водитель)
      img.style.display = "none";
    }

    // 5. Запускаем анимацию только если персонаж появился ВПЕРВЫЕ
    // Если он просто поменял эмоцию (isNew === false), анимация выхода не нужна!
    if (isNew && animFunc) {
      animFunc(img);
    } else if (!isNew) {
      // Убеждаемся, что при простой смене эмоции он видимый (opacity: 1)
      img.style.opacity = 1;
      img.style.transform = "translateY(0)"; // Сброс любых старых сдвигов
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

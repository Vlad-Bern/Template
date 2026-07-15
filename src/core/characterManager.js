// characterManager.js
import { characters } from "../data/characters.js";
import { loadAsset } from "./assetLoader.js";

export class CharacterManager {
  constructor() {
    this.container = document.getElementById("character-layer");
    this.preloadedImages = new Map();
  }

  _getSprite(id, emotion = "neutral") {
    const char = characters[id];

    if (!char) {
      throw new Error(`[CharManager] Character "${id}" not found.`);
    }

    if (!char.sprites) {
      throw new Error(`[CharManager] Character "${id}" has no sprites.`);
    }

    const spritePath = char.sprites[emotion];

    if (!spritePath) {
      const available = Object.keys(char.sprites).join(", ") || "none";

      throw new Error(
        `[CharManager] Sprite "${emotion}" for "${id}" not found. Available: ${available}.`,
      );
    }

    return spritePath;
  }

  async _loadSprite(id, emotion, directSrc = null) {
    const spritePath = directSrc || this._getSprite(id, emotion);

    if (!this.preloadedImages.has(spritePath)) {
      const blobUrl = await loadAsset(spritePath);
      this.preloadedImages.set(spritePath, blobUrl);
    }

    return this.preloadedImages.get(spritePath);
  }

  _render({ id, position = "center", animFunc = null, blobUrl }) {
    let wrapper = this.container.querySelector(`[data-wrapper-id="${id}"]`);

    const isNew = !wrapper;

    if (!wrapper) {
      wrapper = document.createElement("div");
      wrapper.dataset.wrapperId = id;

      const img = document.createElement("img");
      img.className = "character-sprite";
      img.dataset.charId = id;

      wrapper.appendChild(img);
      this.container.appendChild(wrapper);
    }

    wrapper.className = `character-wrapper pos-${position}`;
    wrapper.style.display = "";

    const img = wrapper.querySelector("img");
    img.src = blobUrl;

    if (isNew && animFunc) {
      animFunc(img);
    } else {
      img.style.opacity = 1;

      if (animFunc) {
        animFunc(img);
      }
    }
  }

  async show(id, emotion = "neutral", position = "center", animFunc = null) {
    return this.showMany([
      {
        id,
        emotion,
        position,
        animFunc,
      },
    ]);
  }

  async showMany(entries = []) {
    if (!Array.isArray(entries) || entries.length === 0) {
      return;
    }

    // Не разрешаем дважды указывать одного персонажа
    // в пределах одного showMany.
    const ids = new Set();

    entries.forEach(({ id }) => {
      if (ids.has(id)) {
        throw new Error(
          `[CharManager] Character "${id}" appears twice in showMany.`,
        );
      }

      ids.add(id);
    });

    // Сначала загружаем абсолютно все изображения.
    const prepared = await Promise.all(
      entries.map(async (entry) => ({
        ...entry,

        emotion: entry.emotion ?? "neutral",
        position: entry.position ?? "center",

        blobUrl: await this._loadSprite(
          entry.id,
          entry.emotion ?? "neutral",
          entry.src ?? null,
        ),
      })),
    );

    // Только после загрузки всей группы показываем её.
    prepared.forEach((entry) => {
      this._render(entry);
    });
  }

  async hide(id, animFunc = null) {
    const wrapper = this.container.querySelector(`[data-wrapper-id="${id}"]`);

    if (!wrapper) {
      return;
    }

    const sprite = wrapper.querySelector("img");

    if (!animFunc || !sprite) {
      wrapper.remove();
      return;
    }

    const animation = animFunc(sprite);

    if (animation?.finished) {
      await animation.finished;
    }

    wrapper.remove();
  }

  async hideAll(animFunc = null) {
    const ids = [...this.container.querySelectorAll("[data-wrapper-id]")].map(
      (wrapper) => wrapper.dataset.wrapperId,
    );

    await Promise.all(ids.map((id) => this.hide(id, animFunc)));
  }

  async preloadCharacter(charData) {
    if (!charData?.sprites) {
      return;
    }

    await Promise.all(
      Object.values(charData.sprites).map(async (path) => {
        if (this.preloadedImages.has(path)) {
          return;
        }

        try {
          const blobUrl = await loadAsset(path);

          await new Promise((resolve) => {
            const img = new Image();

            img.onload = resolve;
            img.onerror = resolve;
            img.src = blobUrl;
          });

          this.preloadedImages.set(path, blobUrl);
        } catch (error) {
          console.error(`[CharManager] Failed to preload: ${path}`, error);
        }
      }),
    );
  }
}

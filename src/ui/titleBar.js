export function initTitleBar() {
  // Только в NW.js — в браузере не рисуем рамку
  if (typeof nw === "undefined") return;

  const win = nw.Window.get();

  const bar = document.createElement("div");
  bar.id = "title-bar";
  bar.innerHTML = `
    <div id="title-bar-left">
      <button id="tb-close" title="Закрыть">✕</button>
      <button id="tb-minimize" title="Свернуть">—</button>
    </div>
    <div id="title-bar-drag"></div>
    <div id="title-bar-right">
      <span id="tb-title">SOTA</span>
      <img id="tb-icon" src="/icons/icon.png" alt="SOTA" />
    </div>
  `;

  document.body.prepend(bar);

  document
    .getElementById("tb-close")
    .addEventListener("click", () => win.close());
  document
    .getElementById("tb-minimize")
    .addEventListener("click", () => win.minimize());
}

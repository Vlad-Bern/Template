export function initTitleBar() {
  if (typeof nw === "undefined") return;

  const win = nw.Window.get();

  const bar = document.createElement("div");
  bar.id = "title-bar";
  bar.innerHTML = `
<div id="title-bar-left">
  <button id="tb-close" title="Закрыть">✕</button>
  <button id="tb-fullscreen" title="Развернуть">□</button>
  <button id="tb-minimize" title="Свернуть">—</button>
</div>
  <div id="title-bar-drag"></div>
  <div id="title-bar-right">
    <span id="tb-title">SOTA</span>
    <img id="tb-icon" src="/icons/icon.png" alt="SOTA" />
  </div>
`;

  document.body.prepend(bar);

  // Кнопки — ПОСЛЕ prepend, иначе getElementById вернёт null
  document
    .getElementById("tb-close")
    .addEventListener("click", () => win.close());
  document
    .getElementById("tb-minimize")
    .addEventListener("click", () => win.minimize());
  document.getElementById("tb-fullscreen").addEventListener("click", () => {
    if (win.isMaximized) {
      win.restore();
    } else {
      win.maximize();
    }
    // Рамка всегда остаётся
    bar.style.display = "flex";
  });

  // Видимость рамки
  function checkFullscreen() {
    const isFullscreen =
      document.fullscreenElement || win.width >= screen.width;
    bar.style.display = isFullscreen ? "none" : "flex";
  }

  checkFullscreen();

  win.on("restore", () => (bar.style.display = "flex"));
  win.on("minimize", () => (bar.style.display = "none"));
  win.on("enter-fullscreen", () => (bar.style.display = "none"));
  win.on("leave-fullscreen", () => (bar.style.display = "flex"));
}

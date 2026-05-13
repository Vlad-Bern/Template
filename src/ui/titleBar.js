export function initTitleBar() {
  if (typeof nw === "undefined") return;

  const win = nw.Window.get();

  document.body.classList.add("nw-app");

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

  document
    .getElementById("tb-close")
    .addEventListener("click", () => win.close());
  document
    .getElementById("tb-minimize")
    .addEventListener("click", () => win.minimize());
  document.getElementById("tb-fullscreen").addEventListener("click", () => {
    win.isMaximized ? win.restore() : win.maximize();
    bar.style.display = "flex";
  });

  // Рамка видна сразу — CSS уже показывает её через display:flex
  // Прячем только при реальных событиях
  win.on("restore", () => {
    bar.style.display = "flex";
    win.setAlwaysOnTop(false);
  });
  win.on("maximize", () => {
    bar.style.display = "flex";
  });
  win.on("minimize", () => {
    bar.style.display = "none";
  });
  win.on("enter-fullscreen", () => {
    bar.style.display = "none";
  });
  win.on("leave-fullscreen", () => {
    bar.style.display = "flex";
  });

  try {
    win.setAlwaysOnTop(false);
  } catch (e) {}
}

const CURSOR_IDLE_DELAY = 3000;
const root = document.documentElement;
const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");

let idleTimer = null;

const clearIdleTimer = () => {
  if (idleTimer !== null) {
    window.clearTimeout(idleTimer);
    idleTimer = null;
  }
};

const showCursor = () => {
  root.classList.remove("sota-cursor-idle");
  clearIdleTimer();

  if (!finePointer.matches || document.hidden) return;

  idleTimer = window.setTimeout(() => {
    root.classList.add("sota-cursor-idle");
    idleTimer = null;
  }, CURSOR_IDLE_DELAY);
};

const disableIdleHiding = () => {
  clearIdleTimer();
  root.classList.remove("sota-cursor-idle");
};

window.addEventListener("pointermove", (event) => {
  if (event.pointerType === "touch") return;
  showCursor();
});
window.addEventListener("pointerdown", (event) => {
  if (event.pointerType === "touch") return;
  showCursor();
});
window.addEventListener("pointerenter", showCursor);
window.addEventListener("blur", disableIdleHiding);

document.addEventListener("visibilitychange", () => {
  if (document.hidden) disableIdleHiding();
  else showCursor();
});

finePointer.addEventListener?.("change", () => {
  if (finePointer.matches) showCursor();
  else disableIdleHiding();
});

showCursor();


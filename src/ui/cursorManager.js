const CURSOR_IDLE_DELAY = 3000;
const root = document.documentElement;
const finePointer = window.matchMedia(
  "(any-hover: hover) and (any-pointer: fine)",
);

let idleTimer = null;
let finePointerActive = finePointer.matches;

const setFinePointerActive = (active) => {
  finePointerActive = active;
  root.classList.toggle("sota-fine-pointer-active", active);
};

const clearIdleTimer = () => {
  if (idleTimer !== null) {
    window.clearTimeout(idleTimer);
    idleTimer = null;
  }
};

const showCursor = () => {
  root.classList.remove("sota-cursor-idle");
  clearIdleTimer();

  if (!finePointerActive || document.hidden) return;

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
  setFinePointerActive(true);
  showCursor();
});
window.addEventListener("pointerdown", (event) => {
  if (event.pointerType === "touch") {
    setFinePointerActive(false);
    disableIdleHiding();
    return;
  }
  setFinePointerActive(true);
  showCursor();
});
window.addEventListener("pointerenter", (event) => {
  if (event.pointerType === "touch") return;
  setFinePointerActive(true);
  showCursor();
});
window.addEventListener("blur", disableIdleHiding);

document.addEventListener("visibilitychange", () => {
  if (document.hidden) disableIdleHiding();
  else showCursor();
});

finePointer.addEventListener?.("change", () => {
  setFinePointerActive(finePointer.matches);
  if (finePointerActive) showCursor();
  else disableIdleHiding();
});

setFinePointerActive(finePointer.matches);
showCursor();

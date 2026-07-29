export function attachCustomScrollbar(scrollElement, modifier) {
  if (!scrollElement?.parentElement) return null;

  const existing = scrollElement._sotaCustomScrollbar;
  if (existing) return existing;

  const host = scrollElement.parentElement;
  const track = document.createElement("div");
  const thumb = document.createElement("div");

  track.className = `sota-custom-scrollbar sota-custom-scrollbar--${modifier}`;
  track.setAttribute("aria-hidden", "true");
  thumb.className = "sota-custom-scrollbar-thumb";
  track.appendChild(thumb);
  host.appendChild(track);
  scrollElement.classList.add("sota-custom-scroll-source");

  let thumbHeight = 0;
  let dragStartY = 0;
  let dragStartScrollTop = 0;

  const refresh = () => {
    const hostRect = host.getBoundingClientRect();
    const scrollRect = scrollElement.getBoundingClientRect();
    const scrollRange = scrollElement.scrollHeight - scrollElement.clientHeight;
    const hasOverflow = scrollRange > 1;

    track.hidden = !hasOverflow;
    if (!hasOverflow) return;

    track.style.top = `${scrollRect.top - hostRect.top}px`;
    track.style.left = `${scrollRect.right - hostRect.left - 9}px`;
    track.style.height = `${scrollRect.height}px`;

    thumbHeight = Math.max(
      30,
      (scrollElement.clientHeight / scrollElement.scrollHeight) *
        scrollRect.height,
    );
    const thumbTravel = Math.max(0, scrollRect.height - thumbHeight);
    const progress = scrollRange > 0 ? scrollElement.scrollTop / scrollRange : 0;

    thumb.style.height = `${thumbHeight}px`;
    thumb.style.transform = `translate3d(0, ${thumbTravel * progress}px, 0)`;
  };

  const stopClickPropagation = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  track.addEventListener("click", (event) => {
    event.stopPropagation();
  });

  track.addEventListener("pointerdown", (event) => {
    stopClickPropagation(event);

    if (event.target === thumb) {
      dragStartY = event.clientY;
      dragStartScrollTop = scrollElement.scrollTop;
      thumb.classList.add("dragging");
      thumb.setPointerCapture(event.pointerId);
      return;
    }

    const trackRect = track.getBoundingClientRect();
    const scrollRange = scrollElement.scrollHeight - scrollElement.clientHeight;
    const thumbTravel = Math.max(1, trackRect.height - thumbHeight);
    const targetThumbTop = Math.min(
      thumbTravel,
      Math.max(0, event.clientY - trackRect.top - thumbHeight / 2),
    );

    scrollElement.scrollTop = (targetThumbTop / thumbTravel) * scrollRange;
  });

  thumb.addEventListener("pointermove", (event) => {
    if (!thumb.hasPointerCapture(event.pointerId)) return;

    event.preventDefault();
    event.stopPropagation();

    const trackHeight = track.getBoundingClientRect().height;
    const thumbTravel = Math.max(1, trackHeight - thumbHeight);
    const scrollRange = scrollElement.scrollHeight - scrollElement.clientHeight;
    const deltaY = event.clientY - dragStartY;

    scrollElement.scrollTop =
      dragStartScrollTop + (deltaY / thumbTravel) * scrollRange;
  });

  const finishDragging = (event) => {
    if (thumb.hasPointerCapture(event.pointerId)) {
      thumb.releasePointerCapture(event.pointerId);
    }
    thumb.classList.remove("dragging");
  };

  thumb.addEventListener("pointerup", finishDragging);
  thumb.addEventListener("pointercancel", finishDragging);
  scrollElement.addEventListener("scroll", refresh, { passive: true });

  const resizeObserver = new ResizeObserver(refresh);
  resizeObserver.observe(host);
  resizeObserver.observe(scrollElement);

  const mutationObserver = new MutationObserver(refresh);
  mutationObserver.observe(scrollElement, {
    childList: true,
    subtree: true,
    characterData: true,
  });

  const controller = {
    refresh,
    destroy() {
      resizeObserver.disconnect();
      mutationObserver.disconnect();
      track.remove();
      scrollElement.classList.remove("sota-custom-scroll-source");
      delete scrollElement._sotaCustomScrollbar;
    },
  };

  scrollElement._sotaCustomScrollbar = controller;
  requestAnimationFrame(refresh);

  return controller;
}

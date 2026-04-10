export class Typewriter {
  constructor(elementId) {
    this.elementId = elementId;
    this.element = document.getElementById(elementId);
    this.isTyping = false;
    this.skipRequested = false;
    this.fullText = "";
    this.isPaused = false;
    this.currentRunId = Symbol();
    this.spans = [];
  }

  async type(text) {
    const runId = Symbol();
    this.currentRunId = runId;

    this.element = document.getElementById(this.elementId);
    if (!this.element) return;

    const sanity = state.hero?.stats?.sanity ?? 100;
    this.fullText = text || "";
    this.isTyping = true;
    this.skipRequested = false;

    this.element.classList.remove("waiting");
    this.element.textContent = "";

    const baseSpeed = Math.max(10, state.settings?.typewriterSpeed || 30);
    const chars = this.fullText.split("");

    const fragment = document.createDocumentFragment();
    this.spans = [];

    for (let i = 0; i < chars.length; i++) {
      if (this.currentRunId !== runId) return;

      const char = chars[i];
      const span = document.createElement("span");
      span.textContent = char;
      span.style.opacity = "0";
      span.style.transition = "opacity 0.2s ease";

      if (sanity < 40 && Math.random() < (40 - sanity) / 300) {
        this.applyMirageEffect(span, char);
      }

      fragment.appendChild(span);
      this.spans.push(span);
    }

    if (this.currentRunId !== runId || !this.element) return;
    this.element.appendChild(fragment);

    for (let i = 0; i < chars.length; i++) {
      if (this.currentRunId !== runId) return;

      if (this.skipRequested) {
        this.applyFinalText();
        return;
      }

      const char = chars[i];
      const span = this.spans?.[i];
      if (!span) return;

      span.style.opacity = "1";

      let delay = baseSpeed;
      if ([".", "!", "?"].includes(char)) delay = baseSpeed * 8;
      else if ([",", "-", ":"].includes(char)) delay = baseSpeed * 4;

      const steps = Math.ceil(delay / 10);
      for (let s = 0; s < steps; s++) {
        if (this.currentRunId !== runId) return;

        if (this.skipRequested) {
          this.applyFinalText();
          return;
        }

        await new Promise((r) => setTimeout(r, 10));

        while (this.isPaused) {
          if (this.currentRunId !== runId) return;
          await new Promise((r) => setTimeout(r, 100));
        }
      }
    }

    if (this.currentRunId !== runId || !this.element) return;

    this.isTyping = false;
    this.element.classList.add("waiting");
  }

  applyFinalText() {
    if (!this.element) return;
    this.element.textContent = this.fullText;
    this.isTyping = false;
    this.skipRequested = false;
    this.spans = [];
    this.element.classList.add("waiting");
  }

  skip() {
    if (this.isTyping) {
      this.skipRequested = true;
    }
  }
}

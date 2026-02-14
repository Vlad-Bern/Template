// bgManager.js
export class BGManager {
  constructor() {
    this.container = document.getElementById("bg-layer");
  }

  setBackground(imagePath) {
    this.container.style.backgroundImage = `url(${imagePath})`;
    this.container.style.backgroundSize = "cover";
    this.container.style.backgroundPosition = "center";
  }

  setVideo(videoPath) {
    this.container.innerHTML = "";
    const video = document.createElement("video");
    video.src = videoPath;
    video.loop = true;
    video.muted = true;
    video.autoplay = true;
    video.style.width = "100%";
    video.style.height = "100%";
    video.style.objectFit = "cover";
    this.container.appendChild(video);
  }
}

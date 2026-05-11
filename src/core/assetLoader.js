const KEY = [0x53, 0x4f, 0x54, 0x41, 0x2d, 0x4b, 0x45, 0x59];

// В dev-режиме шифрования нет — отдаём URL как есть
const IS_DEV = import.meta.env.DEV;
const IS_ENCRYPTED = import.meta.env.VITE_ENCRYPTED === "true";

function xorDecrypt(arrayBuffer) {
  const bytes = new Uint8Array(arrayBuffer);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] ^= KEY[i % KEY.length];
  }
  return bytes.buffer;
}

function getMime(url) {
  const ext = url.split("?")[0].split(".").pop().toLowerCase();
  const map = {
    png: "image/png",
    jpg: "image/jpeg",
    webp: "image/webp",
    webm: "video/webm",
    mp3: "audio/mpeg",
    ogg: "audio/ogg",
    wav: "audio/wav",
  };
  return map[ext] || "application/octet-stream";
}

export async function loadAsset(url) {
  if (IS_DEV || !IS_ENCRYPTED) return url;
  const response = await fetch(url);
  const encrypted = await response.arrayBuffer();
  const decrypted = xorDecrypt(encrypted);
  const blob = new Blob([decrypted], { type: getMime(url) });
  return URL.createObjectURL(blob);
}

export function loadImage(url) {
  return loadAsset(url).then((blobUrl) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = blobUrl;
    });
  });
}

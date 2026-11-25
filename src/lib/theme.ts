"use client";

export const PALETTE_EVENT = "open-command-palette";
export function openPalette() {
  window.dispatchEvent(new Event(PALETTE_EVENT));
}

export function scrollToId(id: string) {
  if (id === "top") {
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export type RepeatMode = "off" | "all" | "one";

export function formatPlaybackTime(seconds: number): string {
  const safeSeconds = Number.isFinite(seconds) ? Math.max(0, seconds) : 0;
  const minutes = Math.floor(safeSeconds / 60);
  const remainingSeconds = Math.floor(safeSeconds % 60);

  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}

export function getNextRepeatMode(repeat: RepeatMode): RepeatMode {
  if (repeat === "off") return "all";
  if (repeat === "all") return "one";
  return "off";
}

export function clampPlaybackRatio(value: number): number {
  return Math.max(0, Math.min(1, Number.isFinite(value) ? value : 0));
}

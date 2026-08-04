const COMMENT_KEY_DELAYS = [46, 58, 41, 53, 67, 44, 61, 49, 72, 43, 56, 48] as const;

export function commentKeyDelay(copy: string, index: number, accelerated = false) {
  if (accelerated) return 7;
  const character = copy[index] ?? "";
  const base = COMMENT_KEY_DELAYS[index % COMMENT_KEY_DELAYS.length];
  if (/[.!?]/.test(character)) return base + 150;
  if (/[,;:—]/.test(character)) return base + 82;
  if (character === " ") return Math.max(28, base - 15);
  return base;
}

export function commentTypingDuration(copy: string, accelerated = false) {
  return [...copy].reduce((duration, _character, index) => duration + commentKeyDelay(copy, index, accelerated), 0);
}

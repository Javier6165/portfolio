export const DIRECTOR_MEMORY_KEY = "javier-director-beats-v1";

export function readDirectorBeats(reset = false) {
  try {
    if (reset) window.sessionStorage.removeItem(DIRECTOR_MEMORY_KEY);
    const value = JSON.parse(window.sessionStorage.getItem(DIRECTOR_MEMORY_KEY) ?? "[]") as unknown;
    return new Set(Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : []);
  } catch {
    return new Set<string>();
  }
}

export function rememberDirectorBeats(seen: Set<string>, ids: readonly string[]) {
  ids.forEach((id) => seen.add(id));
  try {
    window.sessionStorage.setItem(DIRECTOR_MEMORY_KEY, JSON.stringify([...seen]));
  } catch {
    // Director memory is session-only and entirely optional.
  }
}

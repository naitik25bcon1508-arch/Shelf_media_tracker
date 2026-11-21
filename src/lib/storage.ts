import type { ShelfItem } from "@/lib/types";

function keyFor(username: string) {
  return `shelf:items:${username.trim().toLowerCase()}`;
}

export function getItems(username: string): ShelfItem[] {
  try {
    const raw = localStorage.getItem(keyFor(username));
    if (raw) return JSON.parse(raw) as ShelfItem[];
    const legacy = localStorage.getItem(`shelf:items:${username}`);
    return legacy ? (JSON.parse(legacy) as ShelfItem[]) : [];
  } catch {
    return [];
  }
}

export function saveItems(username: string, items: ShelfItem[]) {
  localStorage.setItem(keyFor(username), JSON.stringify(items));
}

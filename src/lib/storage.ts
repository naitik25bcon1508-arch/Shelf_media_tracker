import type { ShelfItem } from "@/lib/types";

function keyFor(username: string) {
  return `shelf:items:${username}`;
}

export function getItems(username: string): ShelfItem[] {
  try {
    const raw = localStorage.getItem(keyFor(username));
    return raw ? (JSON.parse(raw) as ShelfItem[]) : [];
  } catch {
    return [];
  }
}

export function saveItems(username: string, items: ShelfItem[]) {
  localStorage.setItem(keyFor(username), JSON.stringify(items));
}

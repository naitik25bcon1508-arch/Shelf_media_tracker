import type { ShelfItem } from "@/lib/types";

const DB_KEY = "shelf_db";

export interface StoredUser {
  username: string;
  hash: string;
}

export interface ShelfDB {
  users: Record<string, StoredUser>;
  items: Record<string, ShelfItem[]>;
}

export function normName(username: string) {
  return username.trim().toLowerCase();
}

export function loadDB(): ShelfDB {
  try {
    const raw = localStorage.getItem(DB_KEY);
    if (raw) {
      const db = JSON.parse(raw) as Partial<ShelfDB>;
      return { users: db.users ?? {}, items: db.items ?? {} };
    }
    const migrated = migrateLegacy();
    if (migrated) {
      saveDB(migrated);
      return migrated;
    }
  } catch {
    return { users: {}, items: {} };
  }
  return { users: {}, items: {} };
}

export function saveDB(db: ShelfDB) {
  localStorage.setItem(DB_KEY, JSON.stringify(db));
}

export function getItems(username: string): ShelfItem[] {
  return loadDB().items[normName(username)] ?? [];
}

function migrateLegacy(): ShelfDB | null {
  try {
    const raw = localStorage.getItem("shelf:users");
    if (!raw) return null;
    const legacy = JSON.parse(raw) as StoredUser[];
    const db: ShelfDB = { users: {}, items: {} };
    for (const u of legacy) {
      if (!u?.username) continue;
      const key = normName(u.username);
      db.users[key] = u;
      const itemsRaw =
        localStorage.getItem(`shelf:items:${key}`) ??
        localStorage.getItem(`shelf:items:${u.username}`);
      db.items[key] = itemsRaw ? (JSON.parse(itemsRaw) as ShelfItem[]) : [];
    }
    return Object.keys(db.users).length ? db : null;
  } catch {
    return null;
  }
}

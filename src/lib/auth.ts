import { loadDB, saveDB, normName, type StoredUser } from "@/lib/storage";

const SESSION_KEY = "shelf:session";

export async function hashPassword(password: string): Promise<string> {
  const data = new TextEncoder().encode(password);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function signUp(
  username: string,
  password: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  const name = username.trim();
  if (name.length < 3) return { ok: false, error: "Username must be at least 3 characters." };
  if (password.length < 6) return { ok: false, error: "Password must be at least 6 characters." };

  const key = normName(name);
  const hash = await hashPassword(password);
  const db = loadDB();
  if (db.users[key]) return { ok: false, error: "That username is already taken." };

  db.users[key] = { username: key, hash };
  db.items[key] = [];
  saveDB(db);
  signIn(key, hash);
  return { ok: true };
}

export async function login(
  username: string,
  password: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  const key = normName(username);
  const db = loadDB();
  const user = db.users[key];
  if (!user) return { ok: false, error: "Wrong username or password." };

  const hash = await hashPassword(password);
  if (user.hash !== hash) return { ok: false, error: "Wrong username or password." };

  signIn(key, hash);
  return { ok: true };
}

function signIn(username: string, hash: string) {
  localStorage.setItem(SESSION_KEY, JSON.stringify({ username, hash }));
}

export function getSession(): string | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw) as { username: string; hash: string };
    const user: StoredUser | undefined = loadDB().users[session.username];
    return user && user.hash === session.hash ? session.username : null;
  } catch {
    return null;
  }
}

export function logout() {
  localStorage.removeItem(SESSION_KEY);
}

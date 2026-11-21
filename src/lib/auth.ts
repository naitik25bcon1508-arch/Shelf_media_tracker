const USERS_KEY = "shelf:users";
const SESSION_KEY = "shelf:session";

export interface StoredUser {
  username: string;
  hash: string;
}

export async function hashPassword(password: string): Promise<string> {
  const data = new TextEncoder().encode(password);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function readUsers(): StoredUser[] {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? (JSON.parse(raw) as StoredUser[]) : [];
  } catch {
    return [];
  }
}

function writeUsers(users: StoredUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export async function signUp(
  username: string,
  password: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  const name = username.trim();
  if (name.length < 3) return { ok: false, error: "Username must be at least 3 characters." };
  if (password.length < 6) return { ok: false, error: "Password must be at least 6 characters." };

  const users = readUsers();
  if (users.some((u) => u.username.toLowerCase() === name.toLowerCase())) {
    return { ok: false, error: "That username is already taken." };
  }

  const hash = await hashPassword(password);
  users.push({ username: name, hash });
  writeUsers(users);
  signIn(name, hash);
  return { ok: true };
}

export async function login(
  username: string,
  password: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  const name = username.trim();
  const hash = await hashPassword(password);
  const user = readUsers().find(
    (u) => u.username.toLowerCase() === name.toLowerCase() && u.hash === hash
  );
  if (!user) return { ok: false, error: "Wrong username or password." };
  signIn(user.username, hash);
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
    const user = readUsers().find((u) => u.username === session.username);
    return user && user.hash === session.hash ? session.username : null;
  } catch {
    return null;
  }
}

export function logout() {
  localStorage.removeItem(SESSION_KEY);
}

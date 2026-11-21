import { useState } from "react";
import { BookOpen } from "lucide-react";
import { login, signUp } from "@/lib/auth";
import ThemeToggle from "@/components/ThemeToggle";

interface Props {
  onAuth: (username: string) => void;
}

export default function AuthScreen({ onAuth }: Props) {
  const [mode, setMode] = useState<"login" | "signup">("signup");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    const result = mode === "signup" ? await signUp(username, password) : await login(username, password);
    setBusy(false);
    if (result.ok) {
      onAuth(username.trim());
    } else {
      setError(result.error);
    }
  }

  return (
    <div className="min-h-screen bg-app flex flex-col items-center justify-center px-4">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-2.5 justify-center mb-8">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-primary">Shelf</h1>
        </div>

        <div className="bg-surface border border-theme rounded-2xl p-6 shadow-pop">
          <div className="grid grid-cols-2 gap-1 bg-surface-alt rounded-lg p-1 mb-6">
            {(["signup", "login"] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => {
                  setMode(m);
                  setError(null);
                }}
                className={`py-2 text-sm font-medium rounded-md transition-colors ${
                  mode === m
                    ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-300"
                    : "text-muted hover:text-primary"
                }`}
              >
                {m === "signup" ? "Sign up" : "Log in"}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm text-muted mb-1.5">
                Username
              </label>
              <input
                id="username"
                type="text"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-input border border-theme rounded-lg px-3 py-2.5 text-primary placeholder-neutral-400 dark:placeholder-neutral-600 focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/40 transition-colors"
                placeholder="yourname"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm text-muted mb-1.5">
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete={mode === "signup" ? "new-password" : "current-password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-input border border-theme rounded-lg px-3 py-2.5 text-primary placeholder-neutral-400 dark:placeholder-neutral-600 focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/40 transition-colors"
                placeholder="••••••••"
                required
              />
            </div>

            {error && (
              <p className="text-sm text-red-600 dark:text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={busy}
              className="w-full bg-emerald-600 hover:bg-emerald-500 dark:bg-emerald-500 dark:hover:bg-emerald-400 disabled:opacity-60 disabled:cursor-not-allowed text-white dark:text-neutral-950 font-semibold rounded-lg py-2.5 transition-colors"
            >
              {busy ? "Please wait…" : mode === "signup" ? "Create account" : "Log in"}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-faint mt-6">
          Your account is stored on this device only.
        </p>
      </div>
    </div>
  );
}

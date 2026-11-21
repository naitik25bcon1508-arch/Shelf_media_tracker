import { useEffect, useMemo, useRef, useState } from "react";
import { Search, Star } from "lucide-react";
import { fetchSuggestions } from "@/lib/search";
import { STATUS_OPTIONS, type ItemStatus, type ItemType, type ShelfItem, type Suggestion } from "@/lib/types";
import Poster from "@/components/Poster";

interface Props {
  username: string;
  item: ShelfItem | null;
  onClose: () => void;
  onSave: (item: ShelfItem) => void;
}

const emptyItem: Omit<ShelfItem, "id" | "createdAt"> = {
  title: "",
  type: "book",
  status: "want",
  rating: 0,
  notes: "",
  posterUrl: "",
  year: "",
  author: "",
};

export default function ItemForm({ item, onClose, onSave }: Props) {
  const [form, setForm] = useState(() =>
    item ? { ...item } : { ...emptyItem }
  );
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  const set = <K extends keyof typeof emptyItem>(key: K, value: (typeof emptyItem)[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) {
      setSuggestions([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const results = await fetchSuggestions(form.type, q, controller.signal);
        setSuggestions(results);
        setOpen(true);
      } catch {
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 400);
    return () => {
      clearTimeout(timer);
      controller.abort();
      setLoading(false);
    };
  }, [query, form.type]);

  function applySuggestion(s: Suggestion) {
    setForm((f) => ({ ...f, title: s.title, year: s.year, author: s.author, posterUrl: s.posterUrl }));
    setOpen(false);
    setSuggestions([]);
    setQuery("");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const title = form.title.trim();
    if (!title) return;
    onSave({
      ...(item ?? { id: crypto.randomUUID(), createdAt: Date.now() }),
      ...form,
      title,
      rating: form.rating,
    } as ShelfItem);
  }

  const stars = useMemo(() => [1, 2, 3, 4, 5], []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      style={{ backgroundColor: "var(--color-overlay)" }}
      onClick={onClose}
    >
      <div
        className="bg-surface border border-theme w-full sm:max-w-lg rounded-t-2xl sm:rounded-2xl max-h-[92vh] overflow-y-auto p-6 shadow-pop"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-semibold text-primary mb-5">
          {item ? "Edit item" : "Add item"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-muted mb-1.5">Type</label>
              <select
                value={form.type}
                onChange={(e) => {
                  set("type", e.target.value as ItemType);
                  setSuggestions([]);
                  setOpen(false);
                }}
                className="w-full bg-input border border-theme rounded-lg px-3 py-2.5 text-primary focus:outline-none focus:border-emerald-500/60"
              >
                <option value="book">Book</option>
                <option value="movie">Movie</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-muted mb-1.5">Status</label>
              <select
                value={form.status}
                onChange={(e) => set("status", e.target.value as ItemStatus)}
                className="w-full bg-input border border-theme rounded-lg px-3 py-2.5 text-primary focus:outline-none focus:border-emerald-500/60"
              >
                {STATUS_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div ref={boxRef} className="relative">
            <label htmlFor="title" className="block text-sm text-muted mb-1.5">
              Title
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-faint" />
              <input
                id="title"
                type="text"
                value={form.title}
                onChange={(e) => {
                  set("title", e.target.value);
                  setQuery(e.target.value);
                }}
                className="w-full bg-input border border-theme rounded-lg pl-9 pr-3 py-2.5 text-primary placeholder:text-faint focus:outline-none focus:border-emerald-500/60"
                placeholder={form.type === "book" ? "Search for a book…" : "Search for a movie…"}
                required
              />
              {loading && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-faint">
                  Searching…
                </span>
              )}
            </div>

            {open && suggestions.length > 0 && (
              <ul className="absolute z-10 mt-1.5 w-full bg-surface border border-theme rounded-lg overflow-hidden shadow-pop">
                {suggestions.map((s, i) => (
                  <li key={`${s.title}-${i}`}>
                    <button
                      type="button"
                      onClick={() => applySuggestion(s)}
                      className="w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-hover transition-colors"
                    >
                      <Poster src={s.posterUrl} title={s.title} type={form.type} className="w-9 rounded shrink-0" />
                      <span className="min-w-0">
                        <span className="block text-sm text-primary truncate">{s.title}</span>
                        <span className="block text-xs text-faint truncate">
                          {form.type === "book" && s.author ? `${s.author} · ` : ""}
                          {s.year}
                        </span>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="year" className="block text-sm text-muted mb-1.5">
                Year
              </label>
              <input
                id="year"
                type="text"
                value={form.year}
                onChange={(e) => set("year", e.target.value)}
                className="w-full bg-input border border-theme rounded-lg px-3 py-2.5 text-primary focus:outline-none focus:border-emerald-500/60"
              />
            </div>
            <div>
              <label htmlFor="author" className="block text-sm text-muted mb-1.5">
                {form.type === "book" ? "Author" : "Director"}
              </label>
              <input
                id="author"
                type="text"
                value={form.author}
                onChange={(e) => set("author", e.target.value)}
                className="w-full bg-input border border-theme rounded-lg px-3 py-2.5 text-primary focus:outline-none focus:border-emerald-500/60"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-muted mb-1.5">Rating</label>
            <div className="flex gap-1">
              {stars.map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => set("rating", n === form.rating ? 0 : n)}
                  className="p-0.5"
                  aria-label={`Rate ${n} star${n > 1 ? "s" : ""}`}
                >
                  <Star
                    className={`w-6 h-6 transition-colors ${
                      n <= form.rating ? "text-amber-400 fill-amber-400" : "text-neutral-300 dark:text-neutral-700"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="posterUrl" className="block text-sm text-muted mb-1.5">
              Poster URL
            </label>
            <input
              id="posterUrl"
              type="text"
              value={form.posterUrl}
              onChange={(e) => set("posterUrl", e.target.value)}
              className="w-full bg-input border border-theme rounded-lg px-3 py-2.5 text-primary text-sm focus:outline-none focus:border-emerald-500/60"
              placeholder="Optional — filled automatically when you pick a suggestion"
            />
          </div>

          <div>
            <label htmlFor="notes" className="block text-sm text-muted mb-1.5">
              Notes
            </label>
            <textarea
              id="notes"
              value={form.notes}
              onChange={(e) => set("notes", e.target.value)}
              rows={3}
              className="w-full bg-input border border-theme rounded-lg px-3 py-2.5 text-primary resize-none focus:outline-none focus:border-emerald-500/60"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-hover hover:opacity-80 text-primary font-medium rounded-lg py-2.5 transition-opacity"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-emerald-600 hover:bg-emerald-500 dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white dark:text-neutral-950 font-semibold rounded-lg py-2.5 transition-colors"
            >
              {item ? "Save changes" : "Add to shelf"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

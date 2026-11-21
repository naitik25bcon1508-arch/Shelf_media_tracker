import { useRef, useState } from "react";
import { BookOpen, Clapperboard, Dices, LogOut, Plus, Search, SearchX } from "lucide-react";
import ItemCard from "@/components/ItemCard";
import ItemForm from "@/components/ItemForm";
import PickModal from "@/components/PickModal";
import Stats from "@/components/Stats";
import ThemeToggle from "@/components/ThemeToggle";
import type { ItemStatus, ShelfItem } from "@/lib/types";
import { STATUS_OPTIONS } from "@/lib/types";
import { getItems, saveItems } from "@/lib/storage";

interface Props {
  username: string;
  onLogout: () => void;
}

type Filter = "all" | "book" | "movie";

const filters: { value: Filter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "book", label: "Books" },
  { value: "movie", label: "Movies" },
];

const statusFilters: { value: ItemStatus | "all"; label: string }[] = [
  { value: "all", label: "Any status" },
  ...STATUS_OPTIONS,
];

export default function Dashboard({ username, onLogout }: Props) {
  const [items, setItems] = useState<ShelfItem[]>(() => getItems(username));
  const [filter, setFilter] = useState<Filter>("all");
  const [statusFilter, setStatusFilter] = useState<ItemStatus | "all">("all");
  const [search, setSearch] = useState("");
  const [picked, setPicked] = useState<ShelfItem | null>(null);
  const [editing, setEditing] = useState<ShelfItem | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const deleteTarget = useRef<string | null>(null);

  function persist(next: ShelfItem[]) {
    setItems(next);
    saveItems(username, next);
  }

  function handleSave(item: ShelfItem) {
    const exists = items.some((i) => i.id === item.id);
    persist(exists ? items.map((i) => (i.id === item.id ? item : i)) : [item, ...items]);
    setFormOpen(false);
    setEditing(null);
  }

  function requestDelete(id: string) {
    deleteTarget.current = id;
    const item = items.find((i) => i.id === id);
    if (item && window.confirm(`Delete "${item.title}" from your shelf?`)) {
      persist(items.filter((i) => i.id !== id));
    }
    deleteTarget.current = null;
  }

  const query = search.trim().toLowerCase();
  const visible = items
    .filter((i) => (filter === "all" ? true : i.type === filter))
    .filter((i) => (statusFilter === "all" ? true : i.status === statusFilter))
    .filter((i) => (query ? i.title.toLowerCase().includes(query) : true));

  function pickForMe(): ShelfItem | null {
    const wantTo = items.filter((i) => i.status === "want");
    if (wantTo.length === 0) return null;
    return wantTo[Math.floor(Math.random() * wantTo.length)];
  }

  const hasAnyItems = items.length > 0;
  const isFiltered = filter !== "all" || statusFilter !== "all" || query.length > 0;

  return (
    <div className="min-h-screen bg-app flex flex-col">
      <header className="border-b border-theme sticky top-0 bg-app/90 backdrop-blur z-40">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center">
              <BookOpen className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
            </div>
            <span className="font-semibold text-primary">Shelf</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                const next = pickForMe();
                if (next) setPicked(next);
              }}
              disabled={!items.some((i) => i.status === "want")}
              className="hidden sm:flex items-center gap-1.5 bg-hover hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed text-primary text-sm font-medium rounded-lg px-3 py-1.5 transition-opacity"
            >
              <Dices className="w-4 h-4" />
              Pick something for me
            </button>
            <button
              onClick={() => {
                setEditing(null);
                setFormOpen(true);
              }}
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white dark:text-neutral-950 text-sm font-semibold rounded-lg px-3 py-1.5 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add
            </button>
            <ThemeToggle />
            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 text-sm text-muted hover:text-primary transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Log out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 flex-1 w-full">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <h1 className="text-2xl font-semibold text-primary">Welcome, {username}</h1>
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-faint" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search titles…"
                className="w-44 bg-input border border-theme rounded-lg pl-9 pr-3 py-2 text-sm text-primary placeholder:text-faint focus:outline-none focus:border-emerald-500/60"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as ItemStatus | "all")}
              className="bg-input border border-theme rounded-lg px-3 py-2 text-sm text-primary focus:outline-none focus:border-emerald-500/60"
            >
              {statusFilters.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
            <div className="flex gap-1 bg-surface border border-theme rounded-lg p-1">
              {filters.map((f) => (
                <button
                  key={f.value}
                  onClick={() => setFilter(f.value)}
                  className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                    filter === f.value
                      ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-300"
                      : "text-muted hover:text-primary"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            const next = pickForMe();
            if (next) setPicked(next);
          }}
          disabled={!items.some((i) => i.status === "want")}
          className="sm:hidden w-full flex items-center justify-center gap-1.5 bg-hover disabled:opacity-50 text-primary text-sm font-medium rounded-lg px-3 py-2.5 mb-4 transition-opacity"
        >
          <Dices className="w-4 h-4" />
          Pick something for me
        </button>

        {visible.length === 0 ? (
          <div className="border border-dashed border-theme rounded-2xl py-16 flex flex-col items-center gap-4 text-center px-4">
            {hasAnyItems && isFiltered ? (
              <>
                <SearchX className="w-8 h-8 text-faint" />
                <div>
                  <p className="text-primary font-medium">Nothing matches those filters</p>
                  <p className="text-sm text-muted mt-1">
                    Try a different search, status, or type — or add something new.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setFilter("all");
                    setStatusFilter("all");
                    setSearch("");
                  }}
                  className="text-sm text-emerald-600 dark:text-emerald-400 hover:opacity-80 transition-opacity"
                >
                  Clear filters
                </button>
              </>
            ) : (
              <>
                <div className="flex gap-3 text-faint">
                  <BookOpen className="w-8 h-8" />
                  <Clapperboard className="w-8 h-8" />
                </div>
                <div>
                  <p className="text-primary font-medium">Your shelf is empty</p>
                  <p className="text-sm text-muted mt-1">
                    Every great shelf starts somewhere. Add the first book you're reading or
                    movie you've been meaning to watch.
                  </p>
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-3">
            {visible.map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                onEdit={(i) => {
                  setEditing(i);
                  setFormOpen(true);
                }}
                onDelete={requestDelete}
              />
            ))}
          </div>
        )}

        {items.length > 0 && <Stats items={items} />}
      </main>

      <footer className="border-t border-theme mt-12">
        <p className="max-w-5xl mx-auto px-4 py-4 text-xs text-faint">
          This product uses the TMDB API but is not endorsed or certified by TMDB.
        </p>
      </footer>

      {formOpen && (
        <ItemForm
          key={editing?.id ?? "new"}
          item={editing}
          onClose={() => {
            setFormOpen(false);
            setEditing(null);
          }}
          onSave={handleSave}
        />
      )}

      {picked && (
        <PickModal
          item={picked}
          onClose={() => setPicked(null)}
          onPickAgain={() => {
            const next = pickForMe();
            if (next) setPicked(next);
          }}
        />
      )}
    </div>
  );
}

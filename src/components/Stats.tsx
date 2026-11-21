import { useMemo } from "react";
import { BookOpen, Clapperboard, Star } from "lucide-react";
import type { ShelfItem } from "@/lib/types";

interface Props {
  items: ShelfItem[];
}

const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default function Stats({ items }: Props) {
  const stats = useMemo(() => {
    const done = items.filter((i) => i.status === "done");
    const movies = done.filter((i) => i.type === "movie").length;
    const books = done.filter((i) => i.type === "book").length;
    const rated = items.filter((i) => i.rating > 0);
    const avg = rated.length
      ? rated.reduce((sum, i) => sum + i.rating, 0) / rated.length
      : 0;

    const now = new Date();
    const months: { label: string; count: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({ label: MONTH_LABELS[d.getMonth()], count: 0 });
    }
    for (const item of done) {
      if (!item.createdAt) continue;
      const d = new Date(item.createdAt);
      const idx = months.findIndex(
        (m, i) =>
          i >= 0 &&
          d.getFullYear() === new Date(now.getFullYear(), now.getMonth() - (5 - i), 1).getFullYear() &&
          d.getMonth() === new Date(now.getFullYear(), now.getMonth() - (5 - i), 1).getMonth()
      );
      if (idx >= 0) months[idx].count++;
    }

    return { movies, books, avg, months };
  }, [items]);

  const max = Math.max(1, ...stats.months.map((m) => m.count));

  const cards = [
    { icon: Clapperboard, label: "Movies watched", value: stats.movies },
    { icon: BookOpen, label: "Books read", value: stats.books },
    {
      icon: Star,
      label: "Average rating",
      value: stats.avg ? stats.avg.toFixed(1) : "–",
    },
  ];

  return (
    <section className="mt-10">
      <h2 className="text-lg font-semibold text-primary mb-4">Stats</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {cards.map((c) => (
          <div key={c.label} className="bg-surface border border-theme rounded-xl p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/15 flex items-center justify-center shrink-0">
              <c.icon className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-primary leading-none">{c.value}</p>
              <p className="text-sm text-muted mt-1">{c.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-surface border border-theme rounded-xl p-5 mt-3">
        <p className="text-sm text-muted mb-4">Completed in the last 6 months</p>
        <div className="flex items-end gap-3 h-36">
          {stats.months.map((m) => (
            <div key={m.label} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
              <span className="text-xs text-faint">{m.count > 0 ? m.count : ""}</span>
              <div
                className="w-full max-w-12 rounded-t-md bg-emerald-500/70 transition-all"
                style={{ height: `${(m.count / max) * 100}%`, minHeight: m.count > 0 ? "4px" : "2px", opacity: m.count > 0 ? 1 : 0.25 }}
              />
              <span className="text-xs text-faint">{m.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

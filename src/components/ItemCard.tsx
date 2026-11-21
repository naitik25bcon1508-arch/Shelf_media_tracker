import { Pencil, Star, Trash2 } from "lucide-react";
import type { ShelfItem } from "@/lib/types";
import { STATUS_OPTIONS } from "@/lib/types";
import Poster from "@/components/Poster";

interface Props {
  item: ShelfItem;
  onEdit: (item: ShelfItem) => void;
  onDelete: (id: string) => void;
}

const statusStyles: Record<string, string> = {
  want: "bg-sky-500/15 text-sky-600 dark:text-sky-300 border-sky-500/30",
  "in-progress": "bg-amber-500/15 text-amber-600 dark:text-amber-300 border-amber-500/30",
  done: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 border-emerald-500/30",
};

export default function ItemCard({ item, onEdit, onDelete }: Props) {
  const status = STATUS_OPTIONS.find((o) => o.value === item.status);

  return (
    <div className="bg-surface border border-theme rounded-xl overflow-hidden flex flex-col group">
      <Poster src={item.posterUrl} title={item.title} type={item.type} className="w-full" />

      <div className="p-4 flex flex-col gap-2 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="text-primary font-medium truncate">{item.title}</h3>
            <p className="text-sm text-muted truncate">
              {item.type === "book" ? "Book" : "Movie"}
              {item.author ? ` · ${item.author}` : ""}
              {item.year ? ` · ${item.year}` : ""}
            </p>
          </div>
          <div className="flex gap-1 shrink-0 opacity-60 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onEdit(item)}
              className="p-1.5 rounded-md text-muted hover:text-primary hover:bg-hover transition-colors"
              aria-label={`Edit ${item.title}`}
            >
              <Pencil className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(item.id)}
              className="p-1.5 rounded-md text-muted hover:text-red-500 dark:hover:text-red-400 hover:bg-hover transition-colors"
              aria-label={`Delete ${item.title}`}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {item.rating > 0 && (
          <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((n) => (
              <Star
                key={n}
                className={`w-3.5 h-3.5 ${
                  n <= item.rating ? "text-amber-400 fill-amber-400" : "text-neutral-300 dark:text-neutral-700"
                }`}
              />
            ))}
          </div>
        )}

        {item.notes && <p className="text-sm text-muted leading-relaxed">{item.notes}</p>}

        {status && (
          <span
            className={`self-start text-xs px-2 py-0.5 rounded-full border ${statusStyles[item.status]}`}
          >
            {status.label}
          </span>
        )}
      </div>
    </div>
  );
}

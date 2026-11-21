import { X } from "lucide-react";
import type { ShelfItem } from "@/lib/types";
import Poster from "@/components/Poster";
import { STATUS_OPTIONS } from "@/lib/types";

interface Props {
  item: ShelfItem;
  onClose: () => void;
}

export default function PickModal({ item, onClose }: Props) {
  const status = STATUS_OPTIONS.find((o) => o.value === item.status);

  return (
    <div
      style={{ backgroundColor: "var(--color-overlay)" }}
      onClick={onClose}
    >
      <div
        className="bg-surface border border-theme rounded-2xl w-full max-w-sm p-6 shadow-pop"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-primary">How about this?</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md text-muted hover:text-primary hover:bg-hover transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex gap-4">
          <Poster
            src={item.posterUrl}
            title={item.title}
            type={item.type}
            className="w-28 rounded-lg shrink-0 border border-theme"
          />
          <div className="min-w-0">
            <h3 className="text-primary font-medium leading-snug">{item.title}</h3>
            <p className="text-sm text-muted mt-0.5">
              {item.type === "book" ? "Book" : "Movie"}
              {item.author ? ` · ${item.author}` : ""}
              {item.year ? ` · ${item.year}` : ""}
            </p>
            {status && (
              <span className="inline-block text-xs px-2 py-0.5 rounded-full border bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 border-emerald-500/30 mt-2">
                {status.label}
              </span>
            )}
            {item.notes && (
              <p className="text-sm text-muted leading-relaxed mt-2 line-clamp-4">{item.notes}</p>
            )}
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-5 bg-hover hover:opacity-80 text-primary font-medium rounded-lg py-2.5 transition-opacity"
        >
          Close
        </button>
      </div>
    </div>
  );
}

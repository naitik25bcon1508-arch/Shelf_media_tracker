import { createPortal } from "react-dom";
import { Dices, X } from "lucide-react";
import type { ShelfItem } from "@/lib/types";
import Poster from "@/components/Poster";
import { STATUS_OPTIONS } from "@/lib/types";

interface Props {
  item: ShelfItem;
  onClose: () => void;
  onPickAgain: () => void;
}

export default function PickModal({ item, onClose, onPickAgain }: Props) {
  const status = STATUS_OPTIONS.find((o) => o.value === item.status);

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
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

        <div className="flex gap-3 mt-5">
          <button
            onClick={onPickAgain}
            className="flex-1 flex items-center justify-center gap-1.5 bg-hover hover:opacity-80 text-primary font-medium rounded-lg py-2.5 transition-opacity"
          >
            <Dices className="w-4 h-4" />
            Pick again
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-emerald-600 hover:bg-emerald-500 dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white dark:text-neutral-950 font-semibold rounded-lg py-2.5 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

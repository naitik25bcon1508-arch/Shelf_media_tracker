import { useEffect, useState } from "react";
import { BookOpen, Clapperboard, Film, ImageOff } from "lucide-react";
import type { ItemType } from "@/lib/types";

interface Props {
  src: string;
  title: string;
  type: ItemType;
  className?: string;
}

export default function Poster({ src, title, type, className = "" }: Props) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [src]);

  const showImage = src && !failed;
  return (
    <div
      className={`relative overflow-hidden bg-neutral-900 ${className}`}
      style={{ aspectRatio: "2 / 3" }}
    >
      {showImage ? (
        <img
          src={src}
          alt={`Poster for ${title}`}
          className="w-full h-full object-cover"
          loading="lazy"
          onError={() => setFailed(true)}
        />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-faint bg-surface-alt">
          {type === "book" ? (
            <BookOpen className="w-8 h-8" />
          ) : (
            <Film className="w-8 h-8" />
          )}
          <ImageOff className="w-4 h-4 opacity-50" />
        </div>
      )}
    </div>
  );
}

export type ItemType = "movie" | "book";
export type ItemStatus = "want" | "in-progress" | "done";

export const STATUS_OPTIONS: { value: ItemStatus; label: string }[] = [
  { value: "want", label: "Want to" },
  { value: "in-progress", label: "In progress" },
  { value: "done", label: "Done" },
];

export interface ShelfItem {
  id: string;
  title: string;
  type: ItemType;
  status: ItemStatus;
  rating: number;
  notes: string;
  posterUrl: string;
  year: string;
  author: string;
  createdAt: number;
}

export interface Suggestion {
  title: string;
  year: string;
  author: string;
  posterUrl: string;
}

import { TMDB_API_KEY } from "@/config";
import type { ItemType, Suggestion } from "@/lib/types";

export function buildBookCover(coverId: number) {
  return `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`;
}

export function buildMoviePoster(posterPath: string) {
  return `https://image.tmdb.org/t/p/w342${posterPath}`;
}

export async function fetchSuggestions(
  type: ItemType,
  query: string,
  signal: AbortSignal
): Promise<Suggestion[]> {
  if (type === "book") {
    const res = await fetch(
      `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=5`,
      { signal }
    );
    if (!res.ok) throw new Error("OpenLibrary request failed");
    const data = await res.json();
    return (data.docs ?? []).map((doc: any): Suggestion => ({
      title: doc.title ?? "",
      year: doc.first_publish_year ? String(doc.first_publish_year) : "",
      author: doc.author_name?.[0] ?? "",
      posterUrl: doc.cover_i ? buildBookCover(doc.cover_i) : "",
    }));
  }

  const res = await fetch(
    `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(query)}&api_key=${TMDB_API_KEY}`,
    { signal }
  );
  if (!res.ok) throw new Error("TMDB request failed");
  const data = await res.json();
  return (data.results ?? []).slice(0, 5).map((movie: any): Suggestion => ({
    title: movie.title ?? "",
    year: movie.release_date ? String(movie.release_date).slice(0, 4) : "",
    author: "",
    posterUrl: movie.poster_path ? buildMoviePoster(movie.poster_path) : "",
  }));
}

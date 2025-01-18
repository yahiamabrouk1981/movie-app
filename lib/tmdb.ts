const TMDB_API_KEY = process.env.TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p";

export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  genre_ids: number[];
  popularity: number;
}

export interface MovieDetails extends Movie {
  runtime: number;
  genres: { id: number; name: string }[];
  credits: {
    cast: {
      id: number;
      name: string;
      character: string;
      profile_path: string | null;
    }[];
    crew: {
      id: number;
      name: string;
      job: string;
      profile_path: string | null;
    }[];
  };
}

export const getImageUrl = (path: string | null, size: string = "original") => {
  if (!path) return null;
  return `${IMAGE_BASE_URL}/${size}${path}`;
};

export async function searchMovies(
  query: string,
  options?: {
    year?: string;
    genreId?: string;
    sortBy?: string;
  }
) {
  const { year, genreId, sortBy } = options || {};

  const params = new URLSearchParams({
    api_key: TMDB_API_KEY!,
    language: "en-US",
    page: "1",
    include_adult: "false",
  });

  // If there's a search query, use search endpoint
  if (query) {
    params.append("query", query);
    if (year) params.append("year", year);
    const res = await fetch(`${BASE_URL}/search/movie?${params}`);
    const data = await res.json();
    return data.results as Movie[];
  }
  // Otherwise, use discover endpoint for filtering
  else {
    if (year) params.append("primary_release_year", year);
    if (genreId) params.append("with_genres", genreId);
    if (sortBy) params.append("sort_by", sortBy);

    const res = await fetch(`${BASE_URL}/discover/movie?${params}`);
    const data = await res.json();
    return data.results as Movie[];
  }
}

export async function getMovieDetails(id: string): Promise<MovieDetails> {
  const params = new URLSearchParams({
    api_key: TMDB_API_KEY!,
    append_to_response: "credits",
  });

  const res = await fetch(`${BASE_URL}/movie/${id}?${params}`);
  const data = await res.json();
  return data as MovieDetails;
}

export async function getGenres() {
  const params = new URLSearchParams({
    api_key: TMDB_API_KEY!,
    language: "en-US",
  });

  const res = await fetch(`${BASE_URL}/genre/movie/list?${params}`);
  const data = await res.json();
  return data.genres as { id: number; name: string }[];
}

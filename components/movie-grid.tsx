import { searchMovies } from '@/lib/tmdb';
import { MovieCard } from './movie-card';

interface MovieGridProps {
  searchParams?: {
    q?: string;
    year?: string;
    genre?: string;
    sort?: string;
  };
}

export async function MovieGrid({ searchParams }: MovieGridProps) {
  const { q: query, year, genre: genreId, sort: sortBy } = searchParams || {};
  
  // If no search parameters are provided, show initial state message
  if (!query && !genreId && !year) {
    return (
      <div className="text-center text-muted-foreground">
        Enter a search term or select filters to find movies
      </div>
    );
  }

  try {
    const movies = await searchMovies(query || '', { year, genreId, sortBy });

    if (!movies || movies.length === 0) {
      return (
        <div className="text-center text-muted-foreground">
          No movies found. Try adjusting your search criteria.
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    );
  } catch (error) {
    console.error('Error fetching movies:', error);
    return (
      <div className="text-center text-destructive">
        An error occurred while fetching movies. Please try again later.
      </div>
    );
  }
}
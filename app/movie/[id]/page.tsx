import { getMovieDetails, getImageUrl } from '@/lib/tmdb';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Calendar, Clock, Star } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default async function MoviePage({
  params: { id },
}: {
  params: { id: string };
}) {
  const movie = await getMovieDetails(id);
  const backdropUrl = getImageUrl(movie.backdrop_path, 'original');
  const posterUrl = getImageUrl(movie.poster_path, 'w500') ||
    'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=500&q=80';

  const director = movie.credits.crew.find((person) => person.job === 'Director');
  const cast = movie.credits.cast.slice(0, 6);

  return (
    <main className="min-h-screen bg-background">
      {backdropUrl && (
        <div className="relative h-[40vh] md:h-[60vh]">
          <div className="absolute inset-0">
            <img
              src={backdropUrl}
              alt=""
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8 -mt-32 relative">
        <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-8">
          <div className="w-full max-w-[300px] mx-auto md:mx-0">
            <AspectRatio ratio={2/3} className="rounded-lg overflow-hidden">
              <img
                src={posterUrl}
                alt={movie.title}
                className="object-cover w-full h-full"
              />
            </AspectRatio>
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold">{movie.title}</h1>
              <div className="flex flex-wrap gap-4 mt-4 text-muted-foreground">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  {new Date(movie.release_date).getFullYear()}
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {movie.runtime} min
                </div>
                <div className="flex items-center">
                  <Star className="h-4 w-4 mr-1 fill-yellow-400 stroke-yellow-400" />
                  {movie.vote_average.toFixed(1)}
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2">Overview</h2>
              <p className="text-muted-foreground">{movie.overview}</p>
            </div>

            {director && (
              <div>
                <h2 className="text-xl font-semibold mb-2">Director</h2>
                <p className="text-muted-foreground">{director.name}</p>
              </div>
            )}

            <div>
              <h2 className="text-xl font-semibold mb-4">Cast</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {cast.map((person) => (
                  <div key={person.id} className="flex items-center space-x-2">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-muted">
                      {person.profile_path && (
                        <img
                          src={getImageUrl(person.profile_path, 'w185')}
                          alt={person.name}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{person.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {person.character}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2">Genres</h2>
              <div className="flex flex-wrap gap-2">
                {movie.genres.map((genre) => (
                  <div
                    key={genre.id}
                    className="px-3 py-1 bg-primary/10 rounded-full text-sm"
                  >
                    {genre.name}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <Link href="/">
            <Button variant="outline">Back to Search</Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
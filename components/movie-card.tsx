import Link from 'next/link';
import { Movie, getImageUrl } from '@/lib/tmdb';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Calendar, Star } from 'lucide-react';

interface MovieCardProps {
  movie: Movie;
}

export function MovieCard({ movie }: MovieCardProps) {
  const posterUrl = getImageUrl(movie.poster_path, 'w500') || 
    'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=500&q=80';

  return (
    <Link href={`/movie/${movie.id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
        <AspectRatio ratio={2/3}>
          <img
            src={posterUrl}
            alt={movie.title}
            className="object-cover w-full h-full"
          />
        </AspectRatio>
        <CardContent className="p-4">
          <h2 className="font-semibold text-lg line-clamp-1">{movie.title}</h2>
          <p className="text-sm text-muted-foreground line-clamp-2 mt-2">
            {movie.overview}
          </p>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex justify-between text-sm text-muted-foreground">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            {new Date(movie.release_date).getFullYear()}
          </div>
          <div className="flex items-center">
            <Star className="h-4 w-4 mr-1 fill-yellow-400 stroke-yellow-400" />
            {movie.vote_average.toFixed(1)}
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
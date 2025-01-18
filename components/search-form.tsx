'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Genre {
  id: number;
  name: string;
}

export function SearchForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [year, setYear] = useState(searchParams.get('year') || '');
  const [genreId, setGenreId] = useState(searchParams.get('genre') || 'all');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'popularity.desc');
  const [genres, setGenres] = useState<Genre[]>([]);
  const [isLoadingGenres, setIsLoadingGenres] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function fetchGenres() {
      try {
        setIsLoadingGenres(true);
        const response = await fetch('/api/genres');
        const data = await response.json();
        if (mounted && Array.isArray(data)) {
          setGenres(data);
        }
      } catch (error) {
        console.error('Failed to fetch genres:', error);
      } finally {
        if (mounted) {
          setIsLoadingGenres(false);
        }
      }
    }

    fetchGenres();

    return () => {
      mounted = false;
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query) params.append('q', query);
    if (year) params.append('year', year);
    if (genreId && genreId !== 'all') params.append('genre', genreId);
    if (sortBy) params.append('sort', sortBy);
    router.push(`/?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mb-8">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <Input
            type="text"
            placeholder="Search movies..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="w-full md:w-32">
          <Input
            type="number"
            placeholder="Year"
            min="1900"
            max={new Date().getFullYear()}
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="w-full md:w-48">
          <Select value={genreId} onValueChange={setGenreId}>
            <SelectTrigger>
              <SelectValue placeholder="Genre" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Genres</SelectItem>
              {!isLoadingGenres && genres.map((genre) => (
                <SelectItem key={genre.id} value={genre.id.toString()}>
                  {genre.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="w-full md:w-48">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger>
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="popularity.desc">Most Popular</SelectItem>
              <SelectItem value="vote_average.desc">Highest Rated</SelectItem>
              <SelectItem value="release_date.desc">Newest</SelectItem>
              <SelectItem value="release_date.asc">Oldest</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button type="submit" className="w-full md:w-auto">
          <Search className="mr-2 h-4 w-4" />
          Search
        </Button>
      </div>
    </form>
  );
}
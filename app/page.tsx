import { SearchForm } from '@/components/search-form';
import { MovieGrid } from '@/components/movie-grid';

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">Movie Search</h1>
        <SearchForm />
        <MovieGrid />
      </div>
    </main>
  );
}
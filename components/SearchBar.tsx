'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';

interface SearchBarProps {
  initialQuery?: string;
}

export function SearchBar({ initialQuery = '' }: SearchBarProps) {
  const [query, setQuery] = useState(initialQuery);
  const router = useRouter();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex max-w-2xl gap-0 mx-auto mb-6">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search products, categories, or exporters..."
        className="flex-1 h-12 px-5 rounded-l-md text-foreground bg-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary border-0"
      />
      <button
        type="submit"
        className="h-12 px-8 bg-secondary hover:bg-secondary/90 text-white font-semibold rounded-r-md transition-colors flex items-center gap-2"
      >
        <Search className="w-4 h-4" />
        Search
      </button>
    </form>
  );
}

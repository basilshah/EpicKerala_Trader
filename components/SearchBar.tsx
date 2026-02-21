'use client';

import { useState, FormEvent, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, Loader2 } from 'lucide-react';

interface SearchBarProps {
  initialQuery?: string;
}

interface SearchSuggestion {
  id: string;
  name: string;
  type: 'product' | 'category' | 'seller';
}

export function SearchBar({ initialQuery = '' }: SearchBarProps) {
  const [query, setQuery] = useState(initialQuery);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close suggestions when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch suggestions when query changes
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.trim().length < 2) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(`/api/search-suggestions?q=${encodeURIComponent(query)}`);
        if (response.ok) {
          const data = await response.json();
          setSuggestions(data);
          // Only show suggestions if input is focused
          if (isFocused) {
            setShowSuggestions(data.length > 0);
          }
        }
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounceTimer);
  }, [query, isFocused]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setShowSuggestions(false);
    setSuggestions([]);
    setIsFocused(false);
    inputRef.current?.blur(); // Remove focus from input
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    setQuery(suggestion.name);
    setShowSuggestions(false);
    setIsFocused(false);
    inputRef.current?.blur();
    router.push(`/search?q=${encodeURIComponent(suggestion.name)}`);
  };

  const clearSearch = () => {
    setQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'product':
        return 'Product';
      case 'category':
        return 'Category';
      case 'seller':
        return 'Exporter';
      default:
        return type;
    }
  };

  return (
    <div ref={wrapperRef} className="relative max-w-2xl mx-auto mb-6">
      <form onSubmit={handleSubmit} className="flex gap-0">
        <div className="relative flex-1">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => {
              setIsFocused(true);
              if (query.trim().length >= 2 && suggestions.length > 0) {
                setShowSuggestions(true);
              }
            }}
            onBlur={() => {
              // Delay to allow click on suggestions
              setTimeout(() => setIsFocused(false), 200);
            }}
            placeholder="Search products, categories, or exporters..."
            className="w-full h-12 px-5 pr-10 rounded-l-md text-foreground bg-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-secondary border-0"
          />
          {isLoading ? (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
            >
              <Loader2 className="w-4 h-4 animate-spin" />
            </button>
          ) : query ? (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </button>
          ) : null}
        </div>
        <button
          type="submit"
          className="h-12 px-8 bg-secondary hover:bg-secondary/90 text-white font-semibold rounded-r-md transition-colors flex items-center gap-2"
        >
          <Search className="w-4 h-4" />
          Search
        </button>
      </form>

      {/* Suggestions Dropdown */}
      {isFocused && showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-slate-200 max-h-96 overflow-y-auto z-50">
          <ul className="py-2">
            {suggestions.map((suggestion) => (
              <li key={`${suggestion.type}-${suggestion.id}`}>
                <button
                  type="button"
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full px-4 py-3 text-left hover:bg-slate-50 transition-colors flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <Search className="w-4 h-4 text-slate-500" />
                    <span className="text-foreground group-hover:text-primary font-medium">
                      {suggestion.name}
                    </span>
                  </div>
                  <span className="text-xs text-slate-600 bg-slate-100 px-2 py-1 rounded-full">
                    {getTypeLabel(suggestion.type)}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import SearchBar from '../components/SearchBar';
import FilterBar from '../components/FilterBar';
import MovieGrid from '../components/MovieGrid';
import MovieCarousel from '../components/MovieCarousel';
import LoadMoreButton from '../components/LoadMoreButton';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';
import useDebounce from '../hooks/useDebounce';
import useMovieSearch from '../hooks/useMovieSearch';
import useTrending from '../hooks/useTrending';
import { storage } from '../utils/storage';

const LAST_SEARCH_KEY = 'movieExplorer.lastSearch';
const EMPTY_FILTERS = { genreId: '', year: '', minRating: '' };

export default function Home() {
  // Restore whatever the user searched for last time.
  const [query, setQuery] = useState(() => storage.get(LAST_SEARCH_KEY, ''));
  const [filters, setFilters] = useState(EMPTY_FILTERS);

  const debouncedQuery = useDebounce(query, 500);
  const { movies, loading, loadingMore, error, hasMore, loadMore, isActive } = useMovieSearch({
    query: debouncedQuery,
    filters,
  });
  const { movies: trending, loading: trendingLoading, error: trendingError } = useTrending();

  useEffect(() => {
    storage.set(LAST_SEARCH_KEY, query);
  }, [query]);

  const searching = debouncedQuery.trim().length > 0;
  const heading = searching
    ? `Results for "${debouncedQuery.trim()}"`
    : 'Movies matching your filters';

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Discover movies
      </Typography>

      <SearchBar value={query} onChange={setQuery} />

      <FilterBar
        filters={filters}
        onChange={setFilters}
        onClear={() => setFilters(EMPTY_FILTERS)}
        disabled={searching}
      />

      {searching && (
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
          Clear the search box to use the genre, year and rating filters.
        </Typography>
      )}

      {isActive ? (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            {heading}
          </Typography>

          <MovieGrid
            movies={movies}
            loading={loading}
            error={error}
            emptyMessage="No movies matched. Try a different title or filter."
          />

          {hasMore && !loading && (
            <LoadMoreButton onClick={loadMore} loading={loadingMore} />
          )}
        </Box>
      ) : (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            Trending this week
          </Typography>

          {trendingLoading && <Loader message="Fetching trending movies..." />}
          {!trendingLoading && trendingError && <ErrorMessage message={trendingError} />}
          {!trendingLoading && !trendingError && <MovieCarousel movies={trending} />}
        </Box>
      )}
    </Box>
  );
}

import { useEffect, useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import SearchBar from '../components/SearchBar';
import FilterBar from '../components/FilterBar';
import MovieGrid from '../components/MovieGrid';
import MovieCarousel from '../components/MovieCarousel';
import RowSkeleton from '../components/RowSkeleton';
import LoadMoreButton from '../components/LoadMoreButton';
import ErrorMessage from '../components/ErrorMessage';
import SetupCard from '../components/SetupCard';
import useDebounce from '../hooks/useDebounce';
import useGenres from '../hooks/useGenres';
import useMovieSearch from '../hooks/useMovieSearch';
import useTrending from '../hooks/useTrending';
import { hasApiKey } from '../api/tmdb';
import { storage } from '../utils/storage';
import { radius } from '../theme';

const LAST_SEARCH_KEY = 'movieExplorer.lastSearch';
const EMPTY_FILTERS = { genreId: '', year: '', minRating: '' };

export default function Home() {
  // Restore whatever the user searched for last time.
  const [query, setQuery] = useState(() => storage.get(LAST_SEARCH_KEY, ''));
  const [filters, setFilters] = useState(EMPTY_FILTERS);

  const debouncedQuery = useDebounce(query, 500);
  const { genres } = useGenres();
  const {
    movies,
    totalResults,
    loading,
    loadingMore,
    error,
    hasMore,
    loadMore,
    retry,
    isActive,
  } = useMovieSearch({ query: debouncedQuery, filters });
  const { movies: trending, loading: trendingLoading, error: trendingError, retry: retryTrending } =
    useTrending();

  useEffect(() => {
    storage.set(LAST_SEARCH_KEY, query);
  }, [query]);

  const searching = debouncedQuery.trim().length > 0;
  const heading = searching
    ? `Results for "${debouncedQuery.trim()}"`
    : 'Movies matching your filters';

  // One chip per active filter, so the visitor can drop them one at a time
  // without having to work out which select to reset.
  const activeChips = useMemo(() => {
    const chips = [];
    if (filters.genreId) {
      const genre = genres.find((item) => item.id === Number(filters.genreId));
      chips.push({
        key: 'genreId',
        label: `Genre: ${genre ? genre.name : 'Any'}`,
        onDelete: () => setFilters((current) => ({ ...current, genreId: '' })),
      });
    }
    if (filters.year) {
      chips.push({
        key: 'year',
        label: `Year: ${filters.year}`,
        onDelete: () => setFilters((current) => ({ ...current, year: '' })),
      });
    }
    if (filters.minRating) {
      chips.push({
        key: 'minRating',
        label: `Rating: ${filters.minRating}+`,
        onDelete: () => setFilters((current) => ({ ...current, minRating: '' })),
      });
    }
    return chips;
  }, [filters, genres]);

  const clearFilters = () => setFilters(EMPTY_FILTERS);

  const noApiKey = !hasApiKey();

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Discover movies
      </Typography>

      {noApiKey && <SetupCard />}

      {/* Search and filters grouped on one surface so the toolbar reads as a
          single control rather than three loose inputs. */}
      <Paper sx={{ p: { xs: 2, sm: 2.5 }, borderRadius: radius.surface, mb: 4 }}>
        <SearchBar value={query} onChange={setQuery} />

        <FilterBar
          genres={genres}
          filters={filters}
          onChange={setFilters}
          onClear={clearFilters}
          disabled={searching}
        />

        {searching && (
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1.5 }}>
            Clear the search box to use the genre, year and rating filters.
          </Typography>
        )}
      </Paper>

      {isActive ? (
        <Box sx={{ mb: 4 }}>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={1}
            alignItems={{ xs: 'flex-start', sm: 'baseline' }}
            sx={{ mb: 2 }}
          >
            <Typography variant="h5">{heading}</Typography>
            {!loading && !error && (
              <Typography variant="body2" color="text.secondary">
                {totalResults.toLocaleString()} {totalResults === 1 ? 'movie' : 'movies'} found
              </Typography>
            )}
          </Stack>

          {activeChips.length > 0 && (
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 2 }}>
              {activeChips.map((chip) => (
                <Chip
                  key={chip.key}
                  label={chip.label}
                  onDelete={chip.onDelete}
                  variant="outlined"
                  color="primary"
                />
              ))}
              {activeChips.length > 1 && (
                <Chip label="Clear all" onClick={clearFilters} variant="filled" />
              )}
            </Stack>
          )}

          <MovieGrid
            movies={movies}
            loading={loading}
            error={error}
            onRetry={retry}
            emptyTitle="No movies matched"
            emptyMessage="Try a different title, or drop a filter or two."
            emptyAction={
              activeChips.length > 0 ? (
                <Button variant="outlined" onClick={clearFilters}>
                  Clear filters
                </Button>
              ) : null
            }
          />

          {hasMore && !loading && <LoadMoreButton onClick={loadMore} loading={loadingMore} />}
        </Box>
      ) : (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            Trending this week
          </Typography>

          {trendingLoading && <RowSkeleton />}
          {!trendingLoading && trendingError && (
            <ErrorMessage message={trendingError} onRetry={retryTrending} />
          )}
          {!trendingLoading && !trendingError && <MovieCarousel movies={trending} />}
        </Box>
      )}
    </Box>
  );
}

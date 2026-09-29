import { useCallback, useEffect, useState } from 'react';
import { discoverMovies, getErrorMessage, searchMovies } from '../api/tmdb';

// A text search can't be combined with genre/year/rating filters on TMDb, so:
//   - if there is a search term we use /search/movie
//   - otherwise we use /discover/movie with whatever filters are set
async function fetchPage(page, { query, genreId, year, minRating }) {
  if (query) {
    return searchMovies(query, page);
  }

  const params = {
    page,
    sort_by: 'popularity.desc',
  };
  if (genreId) params.with_genres = genreId;
  if (year) params.primary_release_year = year;
  if (minRating) params['vote_average.gte'] = minRating;

  return discoverMovies(params);
}

// Handles the first page, the "Load more" button and resetting when the search
// term or the filters change.
export default function useMovieSearch({ query, filters }) {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState('');
  // Bumped by the Retry button to re-run the first page request.
  const [reloadKey, setReloadKey] = useState(0);

  const term = query.trim();
  const { genreId, year, minRating } = filters;
  const isActive = Boolean(term || genreId || year || minRating);

  useEffect(() => {
    if (!isActive) {
      setMovies([]);
      setPage(0);
      setTotalPages(1);
      setTotalResults(0);
      setError('');
      return undefined;
    }

    let isActiveRequest = true;
    setLoading(true);
    setError('');

    async function loadFirstPage() {
      try {
        const response = await fetchPage(1, { query: term, genreId, year, minRating });
        if (!isActiveRequest) return;
        setMovies(response.data.results || []);
        setTotalPages(response.data.total_pages || 1);
        setTotalResults(response.data.total_results || 0);
        setPage(1);
      } catch (err) {
        if (isActiveRequest) {
          setError(getErrorMessage(err));
          setMovies([]);
        }
      } finally {
        if (isActiveRequest) {
          setLoading(false);
        }
      }
    }

    loadFirstPage();
    return () => {
      isActiveRequest = false;
    };
  }, [term, genreId, year, minRating, isActive, reloadKey]);

  const loadMore = useCallback(async () => {
    if (loading || loadingMore || page === 0 || page >= totalPages) return;

    setLoadingMore(true);
    try {
      const response = await fetchPage(page + 1, { query: term, genreId, year, minRating });
      setMovies((previous) => [...previous, ...(response.data.results || [])]);
      setPage((previous) => previous + 1);
      setTotalPages(response.data.total_pages || 1);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoadingMore(false);
    }
  }, [loading, loadingMore, page, totalPages, term, genreId, year, minRating]);

  const hasMore = page > 0 && page < totalPages;

  const retry = () => setReloadKey((key) => key + 1);

  return {
    movies,
    totalResults,
    loading,
    loadingMore,
    error,
    hasMore,
    loadMore,
    retry,
    isActive,
  };
}

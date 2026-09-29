import { useCallback, useEffect, useState } from 'react';
import { getErrorMessage, getTrending } from '../api/tmdb';

// Loads the weekly trending list once when the home page mounts.
export default function useTrending() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  // Bumped by the Retry button to re-run the effect below.
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let isActive = true;

    async function loadTrending() {
      setLoading(true);
      setError('');
      try {
        const response = await getTrending();
        if (isActive) {
          setMovies(response.data.results || []);
        }
      } catch (err) {
        if (isActive) {
          setError(getErrorMessage(err));
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    }

    loadTrending();
    return () => {
      isActive = false;
    };
  }, [reloadKey]);

  const retry = useCallback(() => setReloadKey((key) => key + 1), []);

  return { movies, loading, error, retry };
}

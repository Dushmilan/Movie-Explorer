import { useEffect, useState } from 'react';
import { getErrorMessage, getTrending } from '../api/tmdb';

// Loads the weekly trending list once when the home page mounts.
export default function useTrending() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
  }, []);

  return { movies, loading, error };
}

import { useEffect, useState } from 'react';
import { getGenres } from '../api/tmdb';

// The genre list only ever comes from /genre/movie/list, and we need it in two
// places (the filter selects and the removable chips), so it lives in one hook.
export default function useGenres() {
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isActive = true;

    getGenres()
      .then((response) => {
        if (isActive) setGenres(response.data.genres || []);
      })
      .catch(() => {
        // Without the list the filters still work, they just have no names.
        if (isActive) setGenres([]);
      })
      .finally(() => {
        if (isActive) setLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, []);

  return { genres, loading };
}

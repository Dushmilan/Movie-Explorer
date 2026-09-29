import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { storage } from '../utils/storage';

const FAVORITES_KEY = 'movieExplorer.favorites';

const FavoritesContext = createContext(null);

// We only keep the fields the card and the favourites page actually need.
// Storing the whole API response would bloat localStorage for no reason.
function toCardMovie(movie) {
  return {
    id: movie.id,
    title: movie.title,
    poster_path: movie.poster_path,
    release_date: movie.release_date,
    vote_average: movie.vote_average,
  };
}

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState(() => storage.get(FAVORITES_KEY, []));

  useEffect(() => {
    storage.set(FAVORITES_KEY, favorites);
  }, [favorites]);

  const isFavorite = useCallback(
    (movieId) => favorites.some((movie) => movie.id === movieId),
    [favorites]
  );

  const toggleFavorite = useCallback((movie) => {
    setFavorites((previous) => {
      const exists = previous.some((item) => item.id === movie.id);
      if (exists) {
        return previous.filter((item) => item.id !== movie.id);
      }
      return [...previous, toCardMovie(movie)];
    });
  }, []);

  const removeFavorite = useCallback((movieId) => {
    setFavorites((previous) => previous.filter((movie) => movie.id !== movieId));
  }, []);

  const value = useMemo(
    () => ({ favorites, isFavorite, toggleFavorite, removeFavorite }),
    [favorites, isFavorite, toggleFavorite, removeFavorite]
  );

  return (
    <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used inside a FavoritesProvider');
  }
  return context;
}

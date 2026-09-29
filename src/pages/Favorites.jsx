import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import MovieGrid from '../components/MovieGrid';
import EmptyState from '../components/EmptyState';
import { useFavorites } from '../context/FavoritesContext';

export default function Favorites() {
  const navigate = useNavigate();
  const { favorites } = useFavorites();

  const count = favorites.length;
  const summary =
    count === 0
      ? 'Your saved movies will appear here.'
      : `${count} saved ${count === 1 ? 'movie' : 'movies'}.`;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        My favourites
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {summary}
      </Typography>

      {count === 0 ? (
        <EmptyState
          icon={<FavoriteBorderIcon sx={{ fontSize: 56 }} />}
          title="No favourites yet"
          message="Tap the heart on any movie to save it here."
          action={
            <Button variant="contained" onClick={() => navigate('/')}>
              Browse trending
            </Button>
          }
        />
      ) : (
        <MovieGrid movies={favorites} />
      )}
    </Box>
  );
}

import Box from '@mui/material/Box';
import MovieCard from './MovieCard';

// Horizontal, swipeable row used for the trending section.
export default function MovieCarousel({ movies }) {
  return (
    <Box
      className="hide-scrollbar"
      sx={{ display: 'flex', gap: 2, overflowX: 'auto', pb: 1 }}
    >
      {movies.map((movie) => (
        <Box
          key={movie.id}
          sx={{ minWidth: { xs: 150, sm: 180 }, maxWidth: { xs: 150, sm: 180 } }}
        >
          <MovieCard movie={movie} />
        </Box>
      ))}
    </Box>
  );
}

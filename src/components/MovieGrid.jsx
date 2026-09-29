import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Skeleton from '@mui/material/Skeleton';
import Box from '@mui/material/Box';
import MovieCard from './MovieCard';
import ErrorMessage from './ErrorMessage';
import EmptyState from './EmptyState';

// Responsive poster grid. Also owns the loading skeletons and the error /
// empty states so the pages stay short.
export default function MovieGrid({
  movies,
  loading = false,
  error = '',
  onRetry,
  emptyMessage = 'No movies found.',
  skeletonCount = 12,
}) {
  if (error) {
    return <ErrorMessage message={error} onRetry={onRetry} />;
  }

  if (loading) {
    return (
      <Grid container spacing={2}>
        {Array.from({ length: skeletonCount }).map((_, index) => (
          <Grid item xs={6} sm={4} md={3} lg={2} key={`skeleton-${index}`}>
            <Card>
              <Skeleton variant="rectangular" sx={{ pt: '150%', height: 0 }} />
              <Box sx={{ p: 2 }}>
                <Skeleton width="85%" />
                <Skeleton width="45%" />
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  }

  if (!movies.length) {
    return <EmptyState title="Nothing here yet" message={emptyMessage} />;
  }

  return (
    <Grid container spacing={2}>
      {movies.map((movie) => (
        <Grid item xs={6} sm={4} md={3} lg={2} key={movie.id}>
          <MovieCard movie={movie} />
        </Grid>
      ))}
    </Grid>
  );
}

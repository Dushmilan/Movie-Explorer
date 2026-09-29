import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Skeleton from '@mui/material/Skeleton';
import Box from '@mui/material/Box';
import MovieCard from './MovieCard';
import ErrorMessage from './ErrorMessage';
import EmptyState from './EmptyState';
import { radius } from '../theme';

// Responsive poster grid. Also owns the loading skeletons and the error /
// empty states so the pages stay short. The skeletons copy the card's real
// shape: poster first, then the title and the year under it.
export default function MovieGrid({
  movies,
  loading = false,
  error = '',
  onRetry,
  emptyTitle = 'Nothing here yet',
  emptyMessage = 'No movies found.',
  emptyAction,
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
              <Box sx={{ position: 'relative', pt: '150%', height: 0, backgroundColor: 'action.hover' }}>
                <Skeleton
                  variant="rounded"
                  sx={{
                    position: 'absolute',
                    left: 8,
                    bottom: 8,
                    width: 46,
                    height: 22,
                    borderRadius: radius.pill,
                  }}
                />
              </Box>
              <Box sx={{ p: 1.5 }}>
                <Skeleton width="85%" />
                <Skeleton width="85%" />
                <Skeleton width="40%" />
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  }

  if (!movies.length) {
    return (
      <EmptyState title={emptyTitle} message={emptyMessage} action={emptyAction} />
    );
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

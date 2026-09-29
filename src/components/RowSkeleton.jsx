import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import Card from '@mui/material/Card';
import { radius } from '../theme';

// Placeholder for the horizontal trending row. Same shape and the same widths
// as the real cards, so nothing shifts when the data arrives.
export default function RowSkeleton({ count = 6 }) {
  return (
    <Box className="hide-scrollbar" sx={{ display: 'flex', gap: 2, overflowX: 'auto', pb: 1 }}>
      {Array.from({ length: count }).map((_, index) => (
        <Box
          key={`row-skeleton-${index}`}
          sx={{ minWidth: { xs: 150, sm: 180 }, maxWidth: { xs: 150, sm: 180 } }}
        >
          <Card sx={{ borderRadius: radius.surface }}>
            <Skeleton variant="rectangular" sx={{ pt: '150%', height: 0 }} />
            <Box sx={{ p: 1.5 }}>
              <Skeleton width="85%" />
              <Skeleton width="40%" />
            </Box>
          </Card>
        </Box>
      ))}
    </Box>
  );
}

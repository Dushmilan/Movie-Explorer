import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import MovieFilterIcon from '@mui/icons-material/MovieFilter';

// Shown when a list is empty. `action` is what makes a useful empty state -
// it tells the visitor what to do next instead of just stating there is nothing.
export default function EmptyState({ icon, title, message, action }) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        gap: 1.5,
        py: 8,
        px: 2,
        color: 'text.secondary',
      }}
    >
      {icon || <MovieFilterIcon sx={{ fontSize: 56 }} />}
      <Typography variant="h6" color="text.primary">
        {title}
      </Typography>
      {message && <Typography variant="body2">{message}</Typography>}
      {action && <Box sx={{ mt: 1 }}>{action}</Box>}
    </Box>
  );
}

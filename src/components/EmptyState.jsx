import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import MovieFilterIcon from '@mui/icons-material/MovieFilter';

export default function EmptyState({ icon, title, message }) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        gap: 1,
        py: 8,
        color: 'text.secondary',
      }}
    >
      {icon || <MovieFilterIcon sx={{ fontSize: 56 }} />}
      <Typography variant="h6" color="text.primary">
        {title}
      </Typography>
      {message && <Typography variant="body2">{message}</Typography>}
    </Box>
  );
}

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

// Pagination control for the search results.
export default function LoadMoreButton({ onClick, loading = false }) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
      <Button
        variant="contained"
        onClick={onClick}
        disabled={loading}
        startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <ExpandMoreIcon />}
      >
        {loading ? 'Loading...' : 'Load more'}
      </Button>
    </Box>
  );
}

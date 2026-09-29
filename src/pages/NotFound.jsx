import { Link as RouterLink } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

export default function NotFound() {
  return (
    <Box sx={{ textAlign: 'center', py: 10 }}>
      <Typography variant="h2" fontWeight={700}>
        404
      </Typography>
      <Typography variant="h6" color="text.secondary" gutterBottom>
        This page does not exist.
      </Typography>
      <Button component={RouterLink} to="/" variant="contained" sx={{ mt: 3 }}>
        Back to home
      </Button>
    </Box>
  );
}

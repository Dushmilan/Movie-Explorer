import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import KeyIcon from '@mui/icons-material/Key';

// Shown instead of movie data when REACT_APP_TMDB_API_KEY is missing, so the
// app explains how to fix itself rather than showing a confusing network error.
export default function SetupCard() {
  return (
    <Alert severity="info" icon={<KeyIcon />} sx={{ mb: 3 }}>
      <AlertTitle>Connect your TMDb API key</AlertTitle>
      <Typography variant="body2">
        This app needs a free API key from The Movie Database to load any movies.
      </Typography>

      <Box
        component="ol"
        sx={{ mt: 1.5, mb: 0, pl: 2.5, '& li': { mb: 0.75, fontSize: 14, lineHeight: 1.5 } }}
      >
        <li>Create a free account at themoviedb.org</li>
        <li>Open Settings, then API, and request a v3 API key</li>
        <li>
          Paste it into <Box component="code">.env</Box> as{' '}
          <Box component="code">REACT_APP_TMDB_API_KEY=...</Box>
        </li>
        <li>Restart the dev server</li>
      </Box>
    </Alert>
  );
}

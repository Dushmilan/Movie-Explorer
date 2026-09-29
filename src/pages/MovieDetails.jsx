import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import StarIcon from '@mui/icons-material/Star';
import {
  getErrorMessage,
  getImageUrl,
  getMovieCredits,
  getMovieDetails,
  getMovieVideos,
} from '../api/tmdb';
import { formatRating, formatRuntime, getReleaseYear } from '../utils/format';
import { useFavorites } from '../context/FavoritesContext';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';

// White outlined chips are used over the dark backdrop so they stay readable
// in both the light and dark themes.
const heroChipSx = { color: '#fff', borderColor: 'rgba(255, 255, 255, 0.5)' };

export default function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useFavorites();

  const [movie, setMovie] = useState(null);
  const [cast, setCast] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isActive = true;
    setLoading(true);
    setError('');
    setMovie(null);

    // Details, cast and videos are independent so we can fetch them together.
    async function loadMovie() {
      try {
        const [details, credits, movieVideos] = await Promise.all([
          getMovieDetails(id),
          getMovieCredits(id),
          getMovieVideos(id),
        ]);
        if (!isActive) return;
        setMovie(details.data);
        setCast(credits.data.cast || []);
        setVideos(movieVideos.data.results || []);
      } catch (err) {
        if (isActive) setError(getErrorMessage(err));
      } finally {
        if (isActive) setLoading(false);
      }
    }

    loadMovie();
    return () => {
      isActive = false;
    };
  }, [id]);

  if (loading) return <Loader message="Loading movie details..." />;
  if (error) return <ErrorMessage message={error} />;
  if (!movie) return null;

  const backdrop = getImageUrl(movie.backdrop_path, 'w780');
  const poster = getImageUrl(movie.poster_path, 'w500');
  const trailer =
    videos.find((video) => video.site === 'YouTube' && video.type === 'Trailer') ||
    videos.find((video) => video.site === 'YouTube');
  const favorite = isFavorite(movie.id);

  return (
    <Box>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{ mb: 2 }}>
        Back
      </Button>

      <Box
        sx={{
          position: 'relative',
          borderRadius: 3,
          overflow: 'hidden',
          mb: 4,
          backgroundColor: 'background.paper',
          backgroundImage: backdrop ? `url(${backdrop})` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <Box sx={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0, 0, 0, 0.65)' }} />

        <Grid container spacing={3} sx={{ position: 'relative', p: { xs: 2, sm: 3 } }}>
          <Grid item xs={12} sm={4} md={3}>
            {poster && (
              <Box
                component="img"
                src={poster}
                alt={movie.title}
                sx={{
                  width: '100%',
                  maxWidth: 260,
                  borderRadius: 2,
                  display: 'block',
                  mx: { xs: 'auto', sm: 0 },
                }}
              />
            )}
          </Grid>

          <Grid item xs={12} sm={8} md={9} sx={{ color: '#fff' }}>
            <Typography variant="h4" gutterBottom>
              {movie.title}
            </Typography>

            {movie.tagline && (
              <Typography variant="subtitle1" sx={{ opacity: 0.8, mb: 1 }}>
                {movie.tagline}
              </Typography>
            )}

            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 2 }}>
              <Chip size="small" variant="outlined" label={getReleaseYear(movie.release_date)} sx={heroChipSx} />
              <Chip size="small" variant="outlined" label={formatRuntime(movie.runtime)} sx={heroChipSx} />
              <Chip
                size="small"
                variant="outlined"
                icon={<StarIcon sx={{ color: '#f5c518 !important' }} />}
                label={`${formatRating(movie.vote_average)} / 10`}
                sx={heroChipSx}
              />
            </Stack>

            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 2 }}>
              {(movie.genres || []).map((genre) => (
                <Chip key={genre.id} size="small" color="primary" label={genre.name} />
              ))}
            </Stack>

            <Typography variant="body1" sx={{ maxWidth: 800, opacity: 0.9 }}>
              {movie.overview || 'No overview available for this movie.'}
            </Typography>

            <Button
              variant={favorite ? 'outlined' : 'contained'}
              color="primary"
              onClick={() => toggleFavorite(movie)}
              startIcon={favorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
              sx={{ mt: 3 }}
            >
              {favorite ? 'Remove from favourites' : 'Add to favourites'}
            </Button>
          </Grid>
        </Grid>
      </Box>

      {trailer && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            Trailer
          </Typography>
          <Box
            sx={{
              position: 'relative',
              pt: '56.25%',
              borderRadius: 2,
              overflow: 'hidden',
              backgroundColor: '#000',
            }}
          >
            <Box
              component="iframe"
              title={`${movie.title} trailer`}
              src={`https://www.youtube.com/embed/${trailer.key}`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0 }}
            />
          </Box>
        </Box>
      )}

      {cast.length > 0 && (
        <Box>
          <Typography variant="h5" gutterBottom>
            Top billed cast
          </Typography>
          <Divider sx={{ mb: 2 }} />

          <Stack
            direction="row"
            spacing={2}
            className="hide-scrollbar"
            sx={{ overflowX: 'auto', pb: 1 }}
          >
            {cast.slice(0, 12).map((person) => (
              <Box key={person.credit_id} sx={{ minWidth: 100, textAlign: 'center' }}>
                <Avatar
                  src={getImageUrl(person.profile_path, 'w185')}
                  alt={person.name}
                  sx={{ width: 72, height: 72, mx: 'auto', mb: 1 }}
                >
                  {person.name ? person.name.charAt(0) : '?'}
                </Avatar>
                <Typography variant="body2" fontWeight={600} noWrap title={person.name}>
                  {person.name}
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  noWrap
                  display="block"
                  title={person.character}
                >
                  {person.character}
                </Typography>
              </Box>
            ))}
          </Stack>
        </Box>
      )}
    </Box>
  );
}

import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Skeleton from '@mui/material/Skeleton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import {
  getErrorMessage,
  getImageUrl,
  getMovieCredits,
  getMovieDetails,
  getMovieVideos,
} from '../api/tmdb';
import { formatRuntime, getReleaseYear } from '../utils/format';
import { radius } from '../theme';
import { useFavorites } from '../context/FavoritesContext';
import ErrorMessage from '../components/ErrorMessage';
import Rating from '../components/Rating';
// White on a dark gradient. This block sits on top of a photograph, so it
// keeps a fixed contrast regardless of whether the app is in light or dark
// mode.
const heroChipSx = { color: '#fff', borderColor: 'rgba(255, 255, 255, 0.5)' };

// Skeleton mirrors the real layout (poster, title, chips, overview) so the
// page does not jump when the data lands.
function DetailsSkeleton() {
  return (
    <Box>
      <Skeleton sx={{ mb: 2, width: 90, borderRadius: radius.surface }} />
      <Box sx={{ borderRadius: radius.media, overflow: 'hidden', mb: 4 }}>
        <Grid container spacing={3} sx={{ p: { xs: 2, sm: 3 }, bgcolor: 'background.paper' }}>
          <Grid item xs={12} sm={4} md={3}>
            <Skeleton variant="rectangular" sx={{ pt: '150%', height: 0, borderRadius: radius.surface }} />
          </Grid>
          <Grid item xs={12} sm={8} md={9}>
            <Skeleton width="70%" height={44} />
            <Skeleton width="40%" height={24} sx={{ mt: 1 }} />
            <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
              <Skeleton width={70} height={26} variant="rounded" />
              <Skeleton width={70} height={26} variant="rounded" />
              <Skeleton width={90} height={26} variant="rounded" />
            </Stack>
            <Skeleton sx={{ mt: 3 }} />
            <Skeleton />
            <Skeleton width="85%" />
            <Skeleton width="60%" sx={{ mt: 3 }} />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

export default function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useFavorites();

  const [movie, setMovie] = useState(null);
  const [cast, setCast] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  // Bumped by the Retry button to re-run the effect below.
  const [reloadKey, setReloadKey] = useState(0);

  const trailerRef = useRef(null);
  const [trailerMounted, setTrailerMounted] = useState(false);

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
  }, [id, reloadKey]);

  // Prefer a proper trailer, fall back to any YouTube clip the movie has.
  const trailer = useMemo(
    () =>
      videos.find((video) => video.site === 'YouTube' && video.type === 'Trailer') ||
      videos.find((video) => video.site === 'YouTube') ||
      null,
    [videos]
  );

  // The embed pulls in YouTube's player, so only mount it once the section is
  // actually close to the viewport. Keeps the initial load cheap.
  useEffect(() => {
    if (!trailer || trailerMounted) return undefined;

    const node = trailerRef.current;
    if (!node || typeof IntersectionObserver === 'undefined') {
      setTrailerMounted(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setTrailerMounted(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' }
    );
    observer.observe(node);

    return () => observer.disconnect();
  }, [trailer, trailerMounted]);

  const handleRetry = () => setReloadKey((key) => key + 1);
  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  if (loading) return <DetailsSkeleton />;

  if (error) {
    return (
      <Box sx={{ maxWidth: 720, mx: 'auto', py: 4 }}>
        <ErrorMessage message={error} onRetry={handleRetry} />
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Button startIcon={<ArrowBackIcon />} onClick={handleBack}>
            Back
          </Button>
        </Box>
      </Box>
    );
  }

  if (!movie) return null;

  const backdrop = getImageUrl(movie.backdrop_path, 'w780');
  const poster = getImageUrl(movie.poster_path, 'w500');
  const favorite = isFavorite(movie.id);

  return (
    <Box>
      <Button startIcon={<ArrowBackIcon />} onClick={handleBack} sx={{ mb: 2 }}>
        Back
      </Button>

      <Box
        sx={{
          position: 'relative',
          borderRadius: radius.media,
          overflow: 'hidden',
          mb: 4,
          backgroundColor: 'background.paper',
          backgroundImage: backdrop ? `url(${backdrop})` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Gradient rather than a flat tint, so the artwork still reads through
            at the top while the copy at the bottom keeps its contrast. */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.72) 55%, rgba(0,0,0,0.85) 100%)',
          }}
        />

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
                  borderRadius: radius.media,
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
              <Typography variant="subtitle1" sx={{ opacity: 0.85, mb: 1 }}>
                {movie.tagline}
              </Typography>
            )}

            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 2 }}>
              <Chip
                size="small"
                variant="outlined"
                label={getReleaseYear(movie.release_date)}
                sx={heroChipSx}
              />
              <Chip
                size="small"
                variant="outlined"
                label={formatRuntime(movie.runtime)}
                sx={heroChipSx}
              />
              <Rating value={movie.vote_average} light suffix=" / 10" />
            </Stack>

            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 2 }}>
              {(movie.genres || []).map((genre) => (
                <Chip key={genre.id} size="small" color="primary" label={genre.name} />
              ))}
            </Stack>

            <Typography variant="body1" sx={{ maxWidth: 800, opacity: 0.92 }}>
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
        <Box sx={{ mb: 4 }} ref={trailerRef}>
          <Typography variant="h5" gutterBottom>
            Trailer
          </Typography>
          <Box
            sx={{
              position: 'relative',
              pt: '56.25%',
              borderRadius: radius.media,
              overflow: 'hidden',
              backgroundColor: '#000',
            }}
          >
            {trailerMounted && (
              <Box
                component="iframe"
                title={`${movie.title} trailer`}
                src={`https://www.youtube.com/embed/${trailer.key}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                loading="lazy"
                sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0 }}
              />
            )}
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

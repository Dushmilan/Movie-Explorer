import { useNavigate } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import StarIcon from '@mui/icons-material/Star';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { getImageUrl } from '../api/tmdb';
import { formatRating, getReleaseYear } from '../utils/format';
import { useFavorites } from '../context/FavoritesContext';
import { radius } from '../theme';

export default function MovieCard({ movie }) {
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useFavorites();

  const poster = getImageUrl(movie.poster_path, 'w500');
  const favorite = isFavorite(movie.id);

  return (
    <Card
      sx={{
        position: 'relative',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: radius.surface,
        transition: 'transform 150ms ease, box-shadow 150ms ease',
        '&:hover': { transform: 'translateY(-4px)', boxShadow: 8 },
      }}
    >
      {/* Sits outside the CardActionArea so tapping it does not open the movie. */}
      <Tooltip title={favorite ? 'Remove from favourites' : 'Add to favourites'}>
        <IconButton
          size="small"
          onClick={() => toggleFavorite(movie)}
          aria-label={favorite ? 'Remove from favourites' : 'Add to favourites'}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            zIndex: 2,
            backgroundColor: 'rgba(0, 0, 0, 0.55)',
            '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.75)' },
          }}
        >
          {favorite ? (
            <FavoriteIcon fontSize="small" sx={{ color: '#e50914' }} />
          ) : (
            <FavoriteBorderIcon fontSize="small" sx={{ color: '#fff' }} />
          )}
        </IconButton>
      </Tooltip>

      <CardActionArea onClick={() => navigate(`/movie/${movie.id}`)} sx={{ height: '100%' }}>
        <Box
          sx={{
            position: 'relative',
            pt: '150%',
            backgroundColor: 'action.hover',
            borderRadius: radius.media,
            overflow: 'hidden',
          }}
        >
          {poster ? (
            <Box
              component="img"
              src={poster}
              alt={movie.title}
              loading="lazy"
              sx={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transition: 'transform 250ms ease',
                '.MuiCard-root:hover &': { transform: 'scale(1.04)' },
              }}
            />
          ) : (
            <Box
              sx={{
                position: 'absolute',
                inset: 0,
                display: 'grid',
                placeItems: 'center',
                p: 1,
                textAlign: 'center',
                color: 'text.secondary',
              }}
            >
              <Typography variant="body2">{movie.title}</Typography>
            </Box>
          )}

          {/* Rating sits on the poster so the info line under the title stays
              roomy. The gradient keeps it readable over any artwork. */}
          <Stack
            direction="row"
            alignItems="center"
            spacing={0.4}
            sx={{
              position: 'absolute',
              left: 8,
              bottom: 8,
              px: 0.75,
              py: 0.25,
              borderRadius: radius.pill,
              backgroundColor: 'rgba(0, 0, 0, 0.72)',
              color: '#fff',
            }}
          >
            <StarIcon sx={{ fontSize: 14, color: '#f5c518' }} />
            <Typography variant="caption" fontWeight={700} sx={{ lineHeight: 1.4 }}>
              {formatRating(movie.vote_average)}
            </Typography>
          </Stack>
        </Box>

        <CardContent sx={{ flexGrow: 1, px: 1.5, py: 1.5, '&:last-child': { pb: 1.5 } }}>
          <Typography
            variant="subtitle2"
            fontWeight={600}
            className="clamp-two-lines"
            sx={{ minHeight: 44 }}
          >
            {movie.title}
          </Typography>

          <Typography variant="body2" color="text.secondary">
            {getReleaseYear(movie.release_date)}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

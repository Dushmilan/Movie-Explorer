import Chip from '@mui/material/Chip';
import StarIcon from '@mui/icons-material/Star';
import { formatRating } from '../utils/format';

// Small star chip reused on the cards and the details page.
export default function Rating({ value, size = 'small' }) {
  return (
    <Chip
      size={size}
      variant="outlined"
      icon={<StarIcon sx={{ color: '#f5c518 !important' }} />}
      label={formatRating(value)}
      sx={{ fontWeight: 600 }}
    />
  );
}

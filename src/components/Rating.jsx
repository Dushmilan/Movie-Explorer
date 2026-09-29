import Chip from '@mui/material/Chip';
import StarIcon from '@mui/icons-material/Star';
import { formatRating } from '../utils/format';

// Small star chip used inside text blocks.
//   - `light` switches the label and border to white so it stays readable on a
//     dark image (the details hero)
//   - `suffix` appends something to the number, e.g. " / 10"
export default function Rating({ value, size = 'small', light = false, suffix = '' }) {
  return (
    <Chip
      size={size}
      variant="outlined"
      icon={<StarIcon sx={{ color: '#f5c518 !important' }} />}
      label={`${formatRating(value)}${suffix}`}
      sx={{
        fontWeight: 600,
        ...(light
          ? { color: '#fff', borderColor: 'rgba(255, 255, 255, 0.5)', backgroundColor: 'rgba(0, 0, 0, 0.35)' }
          : {}),
      }}
    />
  );
}

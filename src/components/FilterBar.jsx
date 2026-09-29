import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import ClearIcon from '@mui/icons-material/Clear';

const RATING_OPTIONS = [9, 8, 7, 6];
const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: CURRENT_YEAR - 1949 }, (_, index) => CURRENT_YEAR - index);

// Bonus feature: browse by genre, year or minimum rating using /discover/movie.
// Filters only apply when the search box is empty, so the parent disables this
// bar while a text search is running. The genre list is fetched once by the
// page and passed in, so the chips next to the results can resolve the same
// names.
export default function FilterBar({ genres, filters, onChange, onClear, disabled = false }) {
  const handleChange = (field) => (event) => {
    onChange({ ...filters, [field]: event.target.value });
  };

  const hasFilters = Boolean(filters.genreId || filters.year || filters.minRating);

  return (
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      spacing={2}
      sx={{ mt: 2 }}
      alignItems={{ xs: 'stretch', sm: 'center' }}
    >
      <TextField
        select
        size="small"
        label="Genre"
        value={filters.genreId}
        onChange={handleChange('genreId')}
        disabled={disabled}
        sx={{ minWidth: 160 }}
      >
        <MenuItem value="">Any genre</MenuItem>
        {genres.map((genre) => (
          <MenuItem key={genre.id} value={genre.id}>
            {genre.name}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        select
        size="small"
        label="Year"
        value={filters.year}
        onChange={handleChange('year')}
        disabled={disabled}
        sx={{ minWidth: 130 }}
      >
        <MenuItem value="">Any year</MenuItem>
        {YEARS.map((year) => (
          <MenuItem key={year} value={year}>
            {year}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        select
        size="small"
        label="Rating"
        value={filters.minRating}
        onChange={handleChange('minRating')}
        disabled={disabled}
        sx={{ minWidth: 130 }}
      >
        <MenuItem value="">Any rating</MenuItem>
        {RATING_OPTIONS.map((rating) => (
          <MenuItem key={rating} value={rating}>
            {rating}+
          </MenuItem>
        ))}
      </TextField>

      {hasFilters && (
        <Button onClick={onClear} startIcon={<ClearIcon />} disabled={disabled}>
          Clear
        </Button>
      )}
    </Stack>
  );
}

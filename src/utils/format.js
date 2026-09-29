// Small helpers for displaying the raw values the API gives us.

export function getReleaseYear(dateString) {
  if (!dateString) return 'N/A';
  return dateString.slice(0, 4);
}

export function formatRuntime(minutes) {
  if (!minutes) return 'N/A';
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
}

export function formatRating(rating) {
  if (!rating) return 'N/A';
  return rating.toFixed(1);
}

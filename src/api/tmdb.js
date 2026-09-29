import axios from 'axios';

// Every TMDb request goes through this one axios instance so the base URL and
// the API key only live in a single place.
const API_KEY = process.env.REACT_APP_TMDB_API_KEY;

export const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

const tmdb = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  params: {
    api_key: API_KEY,
    language: 'en-US',
  },
});

// The API only returns the path to an image, so we build the full URL here.
// Sizes: w200 (list), w500 (poster), w780 (backdrop), original (full size).
export function getImageUrl(path, size = 'w500') {
  if (!path) return null;
  return `${IMAGE_BASE_URL}/${size}${path}`;
}

export function hasApiKey() {
  return Boolean(API_KEY);
}

// Axios errors are not friendly to show on screen, so translate the common
// cases into something a normal user can read.
export function getErrorMessage(error) {
  if (!hasApiKey()) {
    return 'No TMDb API key found. Add REACT_APP_TMDB_API_KEY to your .env file and restart the app.';
  }

  if (error && error.response) {
    const status = error.response.status;
    if (status === 401) return 'Your TMDb API key was rejected. Please double-check it and try again.';
    if (status === 404) return 'We could not find that movie.';
    if (status === 429) return 'Too many requests right now. Please wait a moment and try again.';
    return 'Something went wrong while talking to TMDb. Please try again.';
  }

  return 'Could not reach TMDb. Check your internet connection and try again.';
}

export const getTrending = (page = 1) =>
  tmdb.get('/trending/movie/week', { params: { page } });

export const searchMovies = (query, page = 1) =>
  tmdb.get('/search/movie', { params: { query, page, include_adult: false } });

export const discoverMovies = (params = {}) =>
  tmdb.get('/discover/movie', { params: { include_adult: false, ...params } });

export const getMovieDetails = (movieId) => tmdb.get(`/movie/${movieId}`);

export const getMovieCredits = (movieId) => tmdb.get(`/movie/${movieId}/credits`);

export const getMovieVideos = (movieId) => tmdb.get(`/movie/${movieId}/videos`);

export const getGenres = () => tmdb.get('/genre/movie/list');

export default tmdb;

# Movie Explorer

A small React app for browsing movies. You can sign in, search for a title,
browse what's trending, filter by genre / year / rating, open a movie for its
details and trailer, and save favourites.

All movie data comes from [The Movie Database (TMDb)](https://www.themoviedb.org/)
API.

## Built with

- React (Create React App)
- Material UI (MUI)
- React Router
- Axios
- React Context API for state
- localStorage for persistence
- Outfit for headings and Roboto for body text (Google Fonts)

## Features

- **Login** - simple sign up / sign in screen. Accounts and the session are kept
  in the browser, so there is no backend to run. Refreshing the page keeps you
  signed in.
- **Search** - debounced search against `/search/movie`, with a **Load more**
  button for the next page of results.
- **Filters** (bonus) - browse by genre, release year and minimum rating using
  `/discover/movie`. Active filters show as removable chips next to the result
  count, and they apply while the search box is empty.
- **Trending** - a swipeable row of this week's trending movies from
  `/trending/movie/week`.
- **Movie details** - overview, genres, runtime, rating, backdrop, top billed
  cast and the YouTube trailer if one exists. The trailer embed only mounts
  once you scroll near it.
- **Favourites** - tap the heart on any card to save it. The list survives a
  refresh and has its own page.
- **Last search** - whatever you searched for last is restored next time.
- **Light / dark mode** - toggle in the navbar, remembered across sessions.
  Every screen follows the theme, including the login page.
- **Responsive** - mobile-first layout that scales up to a full desktop grid.
- **Loading and empty states** - skeletons shaped like the real cards and
  detail page, plus empty states with a clear next step.
- **Error handling** - friendly messages for a missing key, network problems,
  a bad request or rate limiting. A missing API key shows setup instructions
  instead of an error. Errors have a retry button.
- **Accessibility** - labelled icon buttons, and `prefers-reduced-motion` turns
  off the hover transitions for anyone who has asked for that.

## Getting started

### 1. Get a TMDb API key

Create a free account at <https://www.themoviedb.org/settings/api> and copy the
**API Key (v3 auth)**.

### 2. Configure the environment

Copy `.env.example` to `.env` and paste your key in:

```
REACT_APP_TMDB_API_KEY=your_key_here
```

`.env` is git ignored, so the key never gets committed.

### 3. Install and run

```bash
npm install
npm start
```

The app runs on <http://localhost:3000>. You need to restart the dev server
after changing `.env`, because CRA reads environment variables at build time.

## Available scripts

```bash
npm start      # development server
npm run build  # production build into /build
npm test       # test runner
```

## Project structure

```
src/
├── api/tmdb.js              
├── components/              
│   ├── Layout.jsx           
│   ├── Navbar.jsx
│   ├── SearchBar.jsx
│   ├── FilterBar.jsx
│   ├── MovieCard.jsx
│   ├── MovieGrid.jsx        
│   ├── MovieCarousel.jsx
│   ├── RowSkeleton.jsx      
│   ├── LoadMoreButton.jsx
│   ├── Rating.jsx
│   ├── ErrorMessage.jsx
│   ├── EmptyState.jsx
│   ├── SetupCard.jsx        
│   └── ProtectedRoute.jsx
├── context/                 
│   ├── AuthContext.jsx
│   ├── FavoritesContext.jsx
│   └── ThemeModeContext.jsx
├── hooks/
│   ├── useDebounce.js
│   ├── useGenres.js
│   ├── useMovieSearch.js
│   └── useTrending.js
├── pages/
│   ├── Login.jsx
│   ├── Home.jsx
│   ├── MovieDetails.jsx
│   ├── Favorites.jsx
│   └── NotFound.jsx
├── utils/
│   ├── storage.js
│   └── format.js
├── App.js
├── theme.js
└── index.js
```

## TMDb endpoints used

| Endpoint | Used for |
| --- | --- |
| `/trending/movie/week` | Trending row on the home page |
| `/search/movie` | Text search results |
| `/discover/movie` | Genre / year / rating filters |
| `/genre/movie/list` | Options in the genre filter |
| `/movie/{id}` | Movie details page |
| `/movie/{id}/credits` | Cast list |
| `/movie/{id}/videos` | YouTube trailer |

Poster and backdrop images are built with the `https://image.tmdb.org/t/p`
base URL and a size (for example `w500`).

## Deploying

The build folder is static, so it can go on Vercel or Netlify. Both need the
environment variable set: `REACT_APP_TMDB_API_KEY`.

**Vercel**

- Import the repository, framework preset **Create React App**.
- Add `REACT_APP_TMDB_API_KEY` under Project Settings → Environment Variables.
- Deploy. `vercel.json` handles the SPA rewrite.

**Netlify**

- Connect the GitHub repository, **not** a manual deploy. `netlify.toml` is
  committed, so the build command (`npm run build`), the publish directory
  (`build`) and the Node version are picked up automatically.
- Add `REACT_APP_TMDB_API_KEY` under Site settings → Environment variables,
  then trigger a redeploy. CRA reads the key at build time, so a site built
  without it will show the setup card instead of any movies.
- Deep links like `/movie/27205` are covered by the redirect in `netlify.toml`
  and `public/_redirects`, so they don't 404 on refresh.

## Notes

- Passwords are stored in plain text in localStorage. This is a demo login, so
  a real app would authenticate against a server instead.
- TMDb returns 20 results per page and the search endpoint stops after a few
  hundred pages, which is why the Load more button disappears when there are no
  further pages.
- This product uses the TMDb API but is not endorsed or certified by TMDb.

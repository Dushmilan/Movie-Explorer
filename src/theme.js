import { createTheme } from '@mui/material/styles';

// One theme factory so the light and dark palettes stay in sync. The mode is
// passed in from ThemeModeContext.
export function getTheme(mode) {
  const isDark = mode === 'dark';

  return createTheme({
    palette: {
      mode,
      primary: { main: '#e50914' },
      secondary: { main: isDark ? '#f5c518' : '#b58900' },
      background: {
        default: isDark ? '#0f1115' : '#f4f6f8',
        paper: isDark ? '#1a1d24' : '#ffffff',
      },
    },
    typography: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      h4: { fontWeight: 700 },
      h5: { fontWeight: 700 },
      h6: { fontWeight: 600 },
    },
    shape: {
      borderRadius: 10,
    },
    components: {
      MuiCard: {
        styleOverrides: {
          root: { backgroundImage: 'none' },
        },
      },
    },
  });
}

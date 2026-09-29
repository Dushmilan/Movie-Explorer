import { createTheme } from '@mui/material/styles';

// The display font used for headings and buttons. Loaded from index.html.
// Body copy stays on MUI's default Roboto, so we only have one extra webfont.
const DISPLAY_FONT = '"Outfit", "Roboto", "Helvetica", "Arial", sans-serif';
const BODY_FONT = '"Roboto", "Helvetica", "Arial", sans-serif';

// Corner radius rule for the whole app. theme.shape.borderRadius is 10, and MUI
// multiplies numeric borderRadius values by it, so:
//   - chips, tags and small pills  -> 999 (fully round)
//   - cards, inputs and buttons    -> 1 (10px)
//   - media (poster, hero, iframe) -> 2 (20px)
export const radius = {
  pill: 999,
  surface: 1,
  media: 2,
};

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
      text: {
        primary: isDark ? '#f1f3f5' : '#16181d',
        // Slightly darker than MUI's default grey so captions pass AA on
        // both the light and the dark background.
        secondary: isDark ? '#adb5bd' : '#495057',
      },
    },
    typography: {
      fontFamily: BODY_FONT,
      h4: { fontFamily: DISPLAY_FONT, fontWeight: 700, letterSpacing: '-0.01em' },
      h5: { fontFamily: DISPLAY_FONT, fontWeight: 700, letterSpacing: '-0.01em' },
      h6: { fontFamily: DISPLAY_FONT, fontWeight: 600 },
      button: { fontFamily: DISPLAY_FONT, fontWeight: 600, textTransform: 'none' },
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
      MuiButton: {
        styleOverrides: {
          root: { borderRadius: radius.surface },
        },
      },
      MuiTextField: {
        defaultProps: {
          variant: 'outlined',
        },
      },
    },
  });
}

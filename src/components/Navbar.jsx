import { Link as RouterLink, useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import Tooltip from '@mui/material/Tooltip';
import Chip from '@mui/material/Chip';
import MovieFilterIcon from '@mui/icons-material/MovieFilter';
import HomeIcon from '@mui/icons-material/Home';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuth } from '../context/AuthContext';
import { useFavorites } from '../context/FavoritesContext';
import { useThemeMode } from '../context/ThemeModeContext';

export default function Navbar() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { favorites } = useFavorites();
  const { mode, toggleMode } = useThemeMode();

  const handleLogout = () => {
    signOut();
    navigate('/login');
  };

  return (
    <AppBar position="sticky" color="default" elevation={1}>
      <Toolbar sx={{ gap: 1 }}>
        <Stack
          direction="row"
          alignItems="center"
          spacing={1}
          component={RouterLink}
          to="/"
          sx={{ textDecoration: 'none', color: 'inherit' }}
        >
          <MovieFilterIcon color="primary" />
          <Typography variant="h6" noWrap>
            Movie Explorer
          </Typography>
        </Stack>

        <Box sx={{ flexGrow: 1 }} />

        {user && (
          <Chip
            label={user.username}
            size="small"
            sx={{ display: { xs: 'none', sm: 'inline-flex' } }}
          />
        )}

        <Button
          color="inherit"
          component={RouterLink}
          to="/"
          startIcon={<HomeIcon />}
          sx={{ display: { xs: 'none', sm: 'inline-flex' } }}
        >
          Home
        </Button>

        <Tooltip title="Favourites">
          <IconButton component={RouterLink} to="/favorites" color="inherit" aria-label="Favourites">
            <Badge badgeContent={favorites.length} color="primary">
              <FavoriteIcon />
            </Badge>
          </IconButton>
        </Tooltip>

        <Tooltip title={mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}>
          <IconButton onClick={toggleMode} color="inherit" aria-label="Toggle theme">
            {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>
        </Tooltip>

        <Tooltip title="Log out">
          <IconButton onClick={handleLogout} color="inherit" aria-label="Log out">
            <LogoutIcon />
          </IconButton>
        </Tooltip>
      </Toolbar>
    </AppBar>
  );
}

import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import MovieFilterIcon from '@mui/icons-material/MovieFilter';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import { useAuth } from '../context/AuthContext';
import { useThemeMode } from '../context/ThemeModeContext';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, signUp } = useAuth();
  const { mode, toggleMode } = useThemeMode();

  const [tab, setTab] = useState(0); // 0 = sign in, 1 = sign up
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  // If ProtectedRoute bounced us here, go back to wherever we wanted to be.
  const redirectTo = location.state?.from?.pathname || '/';

  const handleChange = (field) => (event) => {
    setForm((previous) => ({ ...previous, [field]: event.target.value }));
  };

  const handleTabChange = (event, value) => {
    setTab(value);
    setError('');
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError('');
    try {
      if (tab === 0) {
        signIn(form);
      } else {
        signUp(form);
      }
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Box
      sx={{
        position: 'relative',
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        p: 2,
        background: 'linear-gradient(135deg, #1a1d24 0%, #0f1115 60%)',
      }}
    >
      <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
        <Tooltip title={mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}>
          <IconButton onClick={toggleMode} sx={{ color: '#fff' }} aria-label="Toggle theme">
            {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>
        </Tooltip>
      </Box>

      <Card sx={{ width: '100%', maxWidth: 420 }}>
        <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
          <Stack alignItems="center" spacing={1} sx={{ mb: 3 }}>
            <MovieFilterIcon color="primary" sx={{ fontSize: 44 }} />
            <Typography variant="h5">Movie Explorer</Typography>
            <Typography variant="body2" color="text.secondary" textAlign="center">
              Sign in to search, save and discover movies.
            </Typography>
          </Stack>

          <Tabs value={tab} onChange={handleTabChange} variant="fullWidth" sx={{ mb: 3 }}>
            <Tab label="Sign in" />
            <Tab label="Sign up" />
          </Tabs>

          <form onSubmit={handleSubmit}>
            <Stack spacing={2}>
              {error && <Alert severity="error">{error}</Alert>}
              <TextField
                label="Username"
                value={form.username}
                onChange={handleChange('username')}
                fullWidth
                autoFocus
              />
              <TextField
                label="Password"
                type="password"
                value={form.password}
                onChange={handleChange('password')}
                fullWidth
              />
              <Button type="submit" variant="contained" size="large">
                {tab === 0 ? 'Sign in' : 'Create account'}
              </Button>
            </Stack>
          </form>

          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: 'block', mt: 2, textAlign: 'center' }}
          >
            Demo login - accounts are stored in your browser only.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}

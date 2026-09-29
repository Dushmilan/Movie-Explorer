import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { FavoritesProvider } from './context/FavoritesContext';
import { ThemeModeProvider } from './context/ThemeModeContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import Home from './pages/Home';
import MovieDetails from './pages/MovieDetails';
import Favorites from './pages/Favorites';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <ThemeModeProvider>
      <AuthProvider>
        <FavoritesProvider>
          <Routes>
            {/* Public */}
            <Route path="/login" element={<Login />} />

            {/* Private pages share the navbar from Layout */}
            <Route element={<ProtectedRoute />}>
              <Route element={<Layout />}>
                <Route path="/" element={<Home />} />
                <Route path="/movie/:id" element={<MovieDetails />} />
                <Route path="/favorites" element={<Favorites />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Route>
          </Routes>
        </FavoritesProvider>
      </AuthProvider>
    </ThemeModeProvider>
  );
}

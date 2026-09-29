import { Outlet } from 'react-router-dom';
import Container from '@mui/material/Container';
import Navbar from './Navbar';

// Shared shell for the logged in pages: a sticky navbar plus a centred
// container so every page lines up the same way.
export default function Layout() {
  return (
    <>
      <Navbar />
      <Container maxWidth="lg" sx={{ py: 3, pb: 6 }}>
        <Outlet />
      </Container>
    </>
  );
}

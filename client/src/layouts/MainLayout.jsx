
import { Outlet } from 'react-router-dom';
import { Header } from '../components/PublicLayout/Header';
import { Footer } from '../components/PublicLayout/Footer';
export const MainLayout = () => {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  )
}

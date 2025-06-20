
import { Outlet } from 'react-router-dom';
import { Header } from '../components/PublicLayout/Header';
import { Footer } from '../components/PublicLayout/Footer';
import '../pages/LandingPage/landingpage.css';
import '../pages/LandingPage/animations.css';
export const MainLayout = () => {
  return (
    <>
     <div className="bg-blur-1"></div>
      <div className="bg-blur-2"></div>
      <Header />
      <div style={{ paddingTop: '120px' }}>
      <Outlet />
    </div>
      <Footer />
    </>
  )
}

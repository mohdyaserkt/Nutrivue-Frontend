import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaBars } from 'react-icons/fa';
import '../../pages/LandingPage/landingpage.css';
import '../../pages/LandingPage/animations.css';

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const isLoginPage = location.pathname === "/login";
  const buttonLabel = isLoginPage ? "Sign Up" : "Get Started";
  const buttonRoute = isLoginPage ? "/register" : "/login";

  return (
    <header className="glass-nav">
      <div className="container">
        <nav>
          {/* Logo */}
          <div className="logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
            <img
              src="https://res.cloudinary.com/daz1e04fq/image/upload/v1749749899/Nutrivue/kzrizpn0q65was9yxz4o.svg"
              alt="NutriVue AI Logo"
            />
          </div>

          {/* Nav Links */}
          <ul className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
            <li><a href="#features" className="nav-link">Features</a></li>
            <li><a href="#how-it-works" className="nav-link">How It Works</a></li>
            <li><a href="#testimonials" className="nav-link">Testimonials</a></li>
            <li>
              <button
                className="cta-button pulse"
                onClick={() => navigate(buttonRoute)}
              >
                {buttonLabel}
              </button>
            </li>
          </ul>

          {/* Hamburger */}
          <div className="mobile-menu" onClick={toggleMenu}>
            <FaBars />
          </div>
        </nav>
      </div>
    </header>
  );
};


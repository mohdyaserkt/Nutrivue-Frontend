import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaBars } from "react-icons/fa";
import "../../pages/LandingPage/landingpage.css";
import "../../pages/LandingPage/animations.css";

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(() => !isMenuOpen);
  };

  const isLoginPage = location.pathname === "/login";
  const buttonLabel = isLoginPage ? "Sign Up" : "Get Started";
  const buttonRoute = isLoginPage ? "/register" : "/login";

  return (
    <header className="glass-nav">
      <div className="container">
        <nav>
          {/* Logo */}
          <div
            className="logo"
            onClick={() => navigate("/")}
            style={{ cursor: "pointer" }}
          >
            <img
              src="https://res.cloudinary.com/daz1e04fq/image/upload/v1749749899/Nutrivue/kzrizpn0q65was9yxz4o.svg"
              alt="NutriVue AI Logo"
            />
          </div>

          {/* Nav Links */}
          <ul className={`nav-links ${isMenuOpen ? "active" : ""}`}>
            {[
              { label: "Features", id: "features" },
              { label: "How It Works", id: "how-it-works" },
              { label: "Testimonials", id: "testimonials" },
            ].map(({ label, id }) => (
              <li key={id}>
                <a
                  href={location.pathname === "/" ? `#${id}` : undefined}
                  className="nav-link"
                  onClick={(e) => {
                    e.preventDefault(); // Prevent default anchor behavior
                    toggleMenu();

                    if (location.pathname === "/") {
                      // Scroll to section if on the landing page
                      const element = document.getElementById(id);
                      if (element) {
                        element.scrollIntoView({ behavior: "smooth" });
                      }
                    } else {
                      // Navigate to landing page and scroll to section
                      navigate(`/#${id}`);
                    }
                  }}
                >
                  {label}
                </a>
              </li>
            ))}

            <li>
              <button
                className="cta-button pulse"
                onClick={() => {
                  navigate(buttonRoute);
                  toggleMenu();
                }}
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


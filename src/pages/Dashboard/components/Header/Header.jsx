// src/components/Header.jsx
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useLogout } from "../../../../hooks/useLogout";
import "./Header.css";
export const HeaderPrivate = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { handleLogout } = useLogout();
  const menuRef = useRef(null);

  const toggleMenu = () => setMenuOpen((open) => !open);
  const closeMenu = () => setMenuOpen(false);

  const onLogoutClick = async () => {
    try {
      await handleLogout();
      closeMenu();
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const handleProfileClick = () => {
    closeMenu();
    navigate("/profile");
  };

  // Close dropdown on outside click
  useEffect(() => {
    const onClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        closeMenu();
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  return (
    <header className="glass-nav">
      <div className="container">
        <nav>
          {/* Logo */}
          <div
            className="logo"
            onClick={() => navigate("/dashboard")}
            style={{ cursor: "pointer" }}
          >
            <img
              src="https://res.cloudinary.com/daz1e04fq/image/upload/v1749749899/Nutrivue/kzrizpn0q65was9yxz4o.svg"
              alt="NutriVue AI Logo"
            />
          </div>

          {/* User avatar + pure-CSS dropdown */}
          <div className="user-menu" ref={menuRef}>
            <div
              className="user-avatar"
              onClick={toggleMenu}
              aria-expanded={menuOpen}
              style={{ cursor: "pointer" }}
            >
              <img
                src="https://randomuser.me/api/portraits/men/32.jpg"
                alt="User"
              />
            </div>

            <div className={`dropdown-menu${menuOpen ? " show" : ""}`}>
              <button className="dropdown-item" onClick={handleProfileClick}>
                Profile
              </button>
              <button className="dropdown-item" onClick={onLogoutClick}>
                Logout
              </button>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
};

// src/components/Footer/Footer.jsx
import { footerData } from '../../data/footer';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';
import '../../pages/LandingPage/landingpage.css';
import '../../pages/LandingPage/animations.css';
export const Footer = () => {
  return (
    <footer>
      <div className="container">
        <div className="footer-content">
          <div className="footer-column">
            <h3>NutriVue AI</h3>
            <p>The smartest way to track your nutrition and achieve your health goals.</p>
            <div className="social-links">
              <a href="#"><FaFacebookF /></a>
              <a href="#"><FaTwitter /></a>
              <a href="#"><FaInstagram /></a>
              <a href="#"><FaLinkedinIn /></a>
            </div>
          </div>
          
          <FooterColumn title="Product" items={footerData.product} />
          <FooterColumn title="Company" items={footerData.company} />
          <FooterColumn title="Contact" items={footerData.contact} />
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} NutriVue AI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};



const FooterColumn = ({ title, items }) => {
  return (
    <div className="footer-column">
      <h3>{title}</h3>
      <ul className="footer-links">
        {items.map((item, index) => (
          <li key={index}><a href="#">{item}</a></li>
        ))}
      </ul>
    </div>
  );
};


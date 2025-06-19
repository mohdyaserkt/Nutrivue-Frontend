// src/components/Hero/Hero.jsx
import { FaArrowRight } from 'react-icons/fa';
import '../../landingpage.css';
import '../../animations.css';

const Hero = () => {
  return (
    <section className="hero">
      <div className="container">
        <div className="hero-content">
          <div className="hero-text slide-left">
            <h1>Nutrition Tracking <span className="highlight">Reimagined</span></h1>
            <p>NutriVue AI combines advanced computer vision with nutritional science to give you effortless food tracking.</p>
            <div className="hero-buttons">
              <a href="#" className="cta-button pulse">Start Free Trial</a>
              <a href="#" className="secondary-button hover-effect">
                <span>See Demo</span>
                <FaArrowRight />
              </a>
            </div>
          </div>
          <div className="hero-image float-animation">
            <div className="glass-card app-preview">
              <img src="https://res.cloudinary.com/daz1e04fq/image/upload/v1749736090/Nutrivue/ycjz6v2ieqjr8f1pzn8i.png" alt="NutriVue App" />
              <div className="shine"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
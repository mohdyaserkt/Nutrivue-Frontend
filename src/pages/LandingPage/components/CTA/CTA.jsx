// src/components/CTA/CTA.jsx
import '../../landingpage.css';
import '../../animations.css';

const CTA = () => {
  return (
    <section className="cta">
      <div className="container">
        <div className="cta-card glass-card scale-animation">
          <h2>Ready to Transform Your Health?</h2>
          <p>Join NutriVue today and take control of your nutrition</p>
          <a href="#" className="cta-button pulse">Get Started Now</a>
        </div>
      </div>
    </section>
  );
};

export default CTA;
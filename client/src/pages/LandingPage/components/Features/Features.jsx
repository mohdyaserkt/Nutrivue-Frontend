// src/components/Features/Features.jsx
import { featuresData } from '../../../../data/features';
import FeatureCard from './FeatureCard.jsx';
import '../../landingpage.css';
import '../../animations.css';

const Features = () => {
  return (
    <section className="features" id="features">
      <div className="container">
        <div className="section-title">
          <h2 className="slide-up">Powerful Features</h2>
          <p className="slide-up">Designed to make nutrition tracking effortless and accurate</p>
        </div>
        <div className="features-grid">
          {featuresData.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
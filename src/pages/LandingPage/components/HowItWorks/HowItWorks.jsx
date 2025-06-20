// src/components/HowItWorks/HowItWorks.jsx
import { stepsData } from '../../../../data/steps';
import Step from './Step.jsx';
import '../../landingpage.css';
import '../../animations.css';

const HowItWorks = () => {
  return (
    <section className="how-it-works" id="how-it-works">
      <div className="container">
        <div className="section-title">
          <h2 className="slide-up">How It Works</h2>
          <p className="slide-up">Three simple steps to better nutrition</p>
        </div>
        <div className="steps">
          {stepsData.map((step, index) => (
            <Step key={index} {...step} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
// src/components/HowItWorks/Step.jsx
import '../../landingpage.css';
import '../../animations.css';

const Step = ({ number, title, description }) => {
  return (
    <div className="step">
      <div className="step-number">{number}</div>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
};

export default Step;
// src/components/Features/FeatureCard.jsx
import { FaCamera, FaChartPie, FaBarcode, FaCalendarAlt, FaWeight, FaUtensils } from 'react-icons/fa';
import '../../landingpage.css';
import '../../animations.css';

const iconComponents = {
  FaCamera,
  FaChartPie,
  FaBarcode,
  FaCalendarAlt,
  FaWeight,
  FaUtensils
};

const FeatureCard = ({ icon, title, description }) => {
  const IconComponent = iconComponents[icon];
  
  return (
    <div className="feature-card">
      <div className="feature-icon">
        {IconComponent && <IconComponent />}
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
};

export default FeatureCard;
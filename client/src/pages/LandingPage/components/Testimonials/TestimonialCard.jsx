// src/components/Testimonials/TestimonialCard.jsx
import '../../landingpage.css';
import '../../animations.css';

const TestimonialCard = ({ content, avatar, name, role }) => {
  return (
    <div className="testimonial-card">
      <div className="testimonial-content">{content}</div>
      <div className="testimonial-author">
        <div className="author-avatar">
          <img src={avatar} alt={name} />
        </div>
        <div className="author-info">
          <h4>{name}</h4>
          <p>{role}</p>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;
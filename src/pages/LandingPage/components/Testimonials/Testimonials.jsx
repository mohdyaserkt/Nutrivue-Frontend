// src/components/Testimonials/Testimonials.jsx
import { testimonialsData } from '../../../../data/testimonials';
import TestimonialCard from './TestimonialCard.jsx';
import '../../landingpage.css';
import '../../animations.css';

const Testimonials = () => {
  return (
    <section className="testimonials" id="testimonials">
      <div className="container">
        <div className="section-title">
          <h2 className="slide-up">Trusted by Thousands</h2>
          <p className="slide-up">Join our community of health-conscious users</p>
        </div>
        <div className="testimonial-slider">
          {testimonialsData.map((testimonial, index) => (
            <TestimonialCard key={index} {...testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
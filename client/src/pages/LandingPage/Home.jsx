// src/App.jsx
import { useEffect } from 'react';
import Hero from './components/Hero/Hero.jsx';
import Features from './components/Features/Features.jsx';
import HowItWorks from './components/HowItWorks/HowItWorks.jsx';
import Testimonials from './components/Testimonials/Testimonials.jsx';
import CTA from './components/CTA/CTA.jsx';
import '../../pages/LandingPage/landingpage.css';
import '../../pages/LandingPage/animations.css';

export function Home() {
  useEffect(() => {
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
          behavior: 'smooth'
        });
      });
    });

    // Intersection Observer for animations
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('appear');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.slide-up, .slide-left, .slide-right, .scale-animation').forEach(el => {
      observer.observe(el);
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <Testimonials />
        <CTA />
      </main>
     
    </>
  );
}


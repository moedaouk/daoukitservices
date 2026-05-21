import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Quote } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const testimonials = [
  {
    quote: "Fast, professional, and actually explained what went wrong.",
    author: "Operations Lead",
    company: "Retail Company",
  },
  {
    quote: "Our network has been stable for months. Best decision we made.",
    author: "Office Manager",
    company: "Law Firm",
  },
  {
    quote: "CCTV setup was same-day and spotless. Highly recommended.",
    author: "Facility Manager",
    company: "Warehouse",
  },
  {
    quote: "They answer in minutes, not days. That's rare these days.",
    author: "Founder",
    company: "Tech Startup",
  },
  {
    quote: "Best remote support we've used in Beirut. Period.",
    author: "IT Coordinator",
    company: "NGO",
  },
  {
    quote: "Clear pricing, no surprises. Exactly what we needed.",
    author: "Finance Director",
    company: "Services Firm",
  },
];

export default function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const headline = headlineRef.current;
    const cards = cardsRef.current;

    if (!section || !headline || !cards) return;

    const cardElements = cards.querySelectorAll('.testimonial-card');

    const ctx = gsap.context(() => {
      // Headline animation
      gsap.fromTo(headline,
        { y: 24, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: headline,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Cards animation
      cardElements.forEach((card, index) => {
        gsap.fromTo(card,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            delay: index * 0.1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });

    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="testimonials"
      className="relative w-full bg-dark py-20 lg:py-28 z-[70]"
    >
      {/* Background Rings */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-64 h-64 rounded-full border border-cyan/10" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 rounded-full border border-cyan/5" />
      </div>

      <div className="relative z-10 px-4 sm:px-6 lg:px-8 xl:px-16">
        {/* Headline */}
        <div ref={headlineRef} className="text-center mb-16">
          <h2 className="font-heading font-bold text-light text-3xl sm:text-4xl md:text-5xl mb-4">
            What clients <span className="text-cyan">say.</span>
          </h2>
          <p className="text-light-muted text-base sm:text-lg max-w-md mx-auto">
            We measure success by how quiet your IT becomes.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div
          ref={cardsRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto"
        >
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="testimonial-card bg-dark-light border border-light/10 rounded-2xl p-6 hover:-translate-y-1.5 hover:border-cyan/30 transition-all duration-300"
            >
              {/* Quote Icon */}
              <div className="w-10 h-10 bg-cyan/10 rounded-lg flex items-center justify-center mb-4">
                <Quote className="w-5 h-5 text-cyan" />
              </div>

              {/* Quote */}
              <p className="text-light text-base leading-relaxed mb-6">
                "{testimonial.quote}"
              </p>

              {/* Author */}
              <div className="border-t border-light/10 pt-4">
                <p className="text-light font-medium text-sm">
                  {testimonial.author}
                </p>
                <p className="text-light-muted text-xs">
                  {testimonial.company}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

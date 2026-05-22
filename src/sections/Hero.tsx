import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Button } from '@/components/ui/button';
import { ArrowRight, ChevronDown } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const subheadRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const microRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const grid = gridRef.current;
    const image = imageRef.current;
    const headline = headlineRef.current;
    const subhead = subheadRef.current;
    const cta = ctaRef.current;
    const micro = microRef.current;

    if (!section || !grid || !image || !headline || !subhead || !cta || !micro) return;

    const ctx = gsap.context(() => {
      // Initial states
      gsap.set([grid, image, headline, subhead, cta, micro], { opacity: 0 });
      gsap.set(grid, { scale: 1.08 });
      gsap.set(image, { y: '10vh' });
      gsap.set(headline, { y: 24 });
      gsap.set(subhead, { y: 20 });
      gsap.set(cta, { y: 16 });
      gsap.set(micro, { y: 12 });

      // Auto-play entrance animation
      const entranceTl = gsap.timeline({ delay: 0.2 });
      
      entranceTl
        .to(grid, { opacity: 1, scale: 1, duration: 0.8, ease: 'power2.out' })
        .to(image, { opacity: 1, y: 0, duration: 0.9, ease: 'power2.out' }, '-=0.5')
        .to(headline, { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' }, '-=0.6')
        .to(subhead, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, '-=0.4')
        .to(cta, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, '-=0.3')
        .to(micro, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '-=0.2');

      // Scroll-driven exit animation
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=130%',
          pin: true,
          scrub: 0.6,
          onLeaveBack: () => {
            // Reset to visible when scrolling back to top
            gsap.to([grid, image, headline, subhead, cta, micro], {
              opacity: 1,
              y: 0,
              duration: 0.3,
            });
          },
        },
      });

      // EXIT phase (70% - 100%)
      scrollTl
        .fromTo(headline, 
          { y: 0, opacity: 1 }, 
          { y: '-18vh', opacity: 0, ease: 'power2.in' }, 
          0.7
        )
        .fromTo(subhead, 
          { y: 0, opacity: 1 }, 
          { y: '-14vh', opacity: 0, ease: 'power2.in' }, 
          0.72
        )
        .fromTo(image, 
          { y: 0, opacity: 1 }, 
          { y: '-10vh', opacity: 0.3, ease: 'power2.in' }, 
          0.7
        )
        .fromTo(cta, 
          { y: 0, opacity: 1 }, 
          { y: '-12vh', opacity: 0, ease: 'power2.in' }, 
          0.75
        )
        .fromTo(micro, 
          { y: 0, opacity: 1 }, 
          { y: '-8vh', opacity: 0, ease: 'power2.in' }, 
          0.78
        )
        .fromTo(grid, 
          { opacity: 1 }, 
          { opacity: 0.5, ease: 'power2.in' }, 
          0.7
        );

    }, section);

    return () => ctx.revert();
  }, []);

  const scrollToServices = () => {
    const servicesSection = document.getElementById('services');
    if (servicesSection) {
      servicesSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative w-full h-screen bg-dark overflow-hidden z-10"
    >
      {/* Perspective Grid Background */}
      <div
        ref={gridRef}
        className="absolute inset-0 overflow-hidden"
        style={{ perspective: '500px' }}
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(29, 211, 248, 0.06) 1px, transparent 1px),
              linear-gradient(90deg, rgba(29, 211, 248, 0.06) 1px, transparent 1px)
            `,
            backgroundSize: '80px 80px',
            transform: 'rotateX(60deg)',
            transformOrigin: 'center top',
            height: '200%',
            top: '-20%',
          }}
        />
      </div>

      {/* Vignette Overlay */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, transparent 40%, rgba(0,0,0,0.5) 100%)',
        }}
      />

      {/* Content Container */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 sm:px-6 lg:px-8">
        {/* Headline */}
        <div ref={headlineRef} className="text-center mb-6">
          <h1 className="font-heading font-bold text-light text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tight">
            IT Support,
            <br />
            <span className="text-cyan">Simplified.</span>
          </h1>
        </div>

        {/* Hero Image */}
        <div
          ref={imageRef}
          className="relative w-full max-w-4xl mx-auto mb-8"
        >
          <img
            src="/images/hero_laptop.jpg"
            alt="IT Support"
            className="w-full h-auto rounded-2xl shadow-card"
            style={{ 
              maxHeight: '45vh',
              objectFit: 'cover',
              objectPosition: 'center',
            }}
          />
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-dark/60 via-transparent to-transparent" />
        </div>

        {/* Subheadline */}
        <p
          ref={subheadRef}
          className="text-light-muted text-center text-base sm:text-lg md:text-xl max-w-2xl mb-8 px-4"
        >
          Fast remote support, network setup, CCTV, and IP telephony for teams across Lebanon.
        </p>

        {/* CTA Buttons */}
        <div ref={ctaRef} className="flex flex-col sm:flex-row gap-4 mb-8">
          <Button
            asChild
            size="lg"
            className="bg-cyan text-dark font-semibold px-8 py-6 text-base rounded-xl hover:bg-cyan-light transition-all duration-300 hover:-translate-y-0.5 glow-cyan"
          >
            <a href="https://wa.me/96181706156?text=Hello%20Daouk%20IT%20Services%2C%20I%20want%20to%20book%20a%20free%20consultation" target="_blank" rel="noopener noreferrer">
              Book a free consultation
              <ArrowRight className="ml-2 w-5 h-5" />
            </a>
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={scrollToServices}
            className="border-light/20 text-light font-medium px-8 py-6 text-base rounded-xl hover:bg-light/10 transition-all duration-300 hover:-translate-y-0.5"
          >
            View services
            <ChevronDown className="ml-2 w-5 h-5" />
          </Button>
        </div>

        {/* Micro Label */}
        <p
          ref={microRef}
          className="font-mono text-xs text-light-muted uppercase tracking-widest"
        >
          Remote • Beirut • Worldwide
        </p>
      </div>
    </section>
  );
}

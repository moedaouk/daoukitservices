import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function ServiceNetwork() {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const image = imageRef.current;
    const headline = headlineRef.current;
    const line = lineRef.current;
    const cta = ctaRef.current;

    if (!section || !image || !headline || !line || !cta) return;

    const ctx = gsap.context(() => {
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=130%',
          pin: true,
          scrub: 0.6,
        },
      });

      // ENTRANCE (0% - 30%)
      scrollTl
        // Image rises from bottom
        .fromTo(image,
          { y: '80vh', scale: 0.92, opacity: 0 },
          { y: 0, scale: 1, opacity: 1, ease: 'power2.out' },
          0
        )
        // Headline drops from top
        .fromTo(headline,
          { y: '-30vh', opacity: 0 },
          { y: 0, opacity: 1, ease: 'power2.out' },
          0.05
        )
        // Accent line draws in
        .fromTo(line,
          { scaleX: 0 },
          { scaleX: 1, ease: 'power2.out' },
          0.1
        )
        // CTA pops in
        .fromTo(cta,
          { scale: 0.9, opacity: 0 },
          { scale: 1, opacity: 1, ease: 'power2.out' },
          0.15
        );

      // SETTLE (30% - 70%) - hold

      // EXIT (70% - 100%)
      scrollTl
        .fromTo(image,
          { y: 0, scale: 1, opacity: 1 },
          { y: '-40vh', scale: 0.96, opacity: 0.25, ease: 'power2.in' },
          0.7
        )
        .fromTo(headline,
          { y: 0, opacity: 1 },
          { y: '-20vh', opacity: 0.2, ease: 'power2.in' },
          0.7
        )
        .fromTo(line,
          { opacity: 1 },
          { opacity: 0, ease: 'power2.in' },
          0.7
        )
        .fromTo(cta,
          { opacity: 1 },
          { opacity: 0.2, ease: 'power2.in' },
          0.7
        );

    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-screen bg-dark overflow-hidden z-40"
    >
      {/* Content Container */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 sm:px-6 lg:px-8">
        {/* Headline */}
        <div ref={headlineRef} className="text-center mb-6">
          <h2 className="font-heading font-bold text-light text-3xl sm:text-4xl md:text-5xl lg:text-6xl">
            Networks & CCTV
            <br />
            <span className="text-cyan">that stay online.</span>
          </h2>
          {/* Accent Line */}
          <div
            ref={lineRef}
            className="w-24 h-0.5 bg-cyan mx-auto mt-6 origin-center"
          />
          <p className="text-light-muted text-base sm:text-lg md:text-xl mt-6 max-w-xl mx-auto">
            Setup, monitoring, and maintenance—built for reliability.
          </p>
        </div>

        {/* Service Image */}
        <div
          ref={imageRef}
          className="relative w-full max-w-5xl mx-auto my-8"
        >
          <img
            src="/images/service_network.jpg"
            alt="Network and CCTV Services"
            className="w-full h-auto rounded-2xl shadow-card"
            style={{ 
              maxHeight: '50vh',
              objectFit: 'cover',
              objectPosition: 'center',
            }}
          />
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-dark/70 via-transparent to-dark/30" />
        </div>

        {/* CTA */}
        <div ref={ctaRef}>
          <Button
            size="lg"
            className="bg-cyan text-dark font-semibold px-8 py-6 text-base rounded-xl hover:bg-cyan-light transition-all duration-300 hover:-translate-y-0.5 glow-cyan"
          >
            Get a network quote
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </div>
    </section>
  );
}

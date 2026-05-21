import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Button } from '@/components/ui/button';
import { ArrowRight, MessageSquare, Clock, Shield } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function Feature() {
  const sectionRef = useRef<HTMLElement>(null);
  const laptopRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const laptop = laptopRef.current;
    const headline = headlineRef.current;
    const chat = chatRef.current;
    const ring = ringRef.current;

    if (!section || !laptop || !headline || !chat || !ring) return;

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
        // Laptop enters from left
        .fromTo(laptop, 
          { x: '-60vw', rotateZ: -6, opacity: 0 },
          { x: 0, rotateZ: 0, opacity: 1, ease: 'power2.out' },
          0
        )
        // Headline enters from left
        .fromTo(headline,
          { x: '-40vw', opacity: 0 },
          { x: 0, opacity: 1, ease: 'power2.out' },
          0.05
        )
        // Chat card enters from right
        .fromTo(chat,
          { x: '60vw', opacity: 0 },
          { x: 0, opacity: 1, ease: 'power2.out' },
          0.1
        )
        // Background ring
        .fromTo(ring,
          { scale: 0.85, opacity: 0 },
          { scale: 1, opacity: 0.35, ease: 'power2.out' },
          0
        );

      // SETTLE (30% - 70%) - elements hold position

      // EXIT (70% - 100%)
      scrollTl
        .fromTo(laptop,
          { x: 0, rotateZ: 0, opacity: 1 },
          { x: '40vw', rotateZ: 6, opacity: 0.25, ease: 'power2.in' },
          0.7
        )
        .fromTo(headline,
          { x: 0, opacity: 1 },
          { x: '-30vw', opacity: 0.2, ease: 'power2.in' },
          0.7
        )
        .fromTo(chat,
          { x: 0, opacity: 1 },
          { x: '30vw', opacity: 0.2, ease: 'power2.in' },
          0.7
        )
        .fromTo(ring,
          { opacity: 0.35 },
          { opacity: 0, ease: 'power2.in' },
          0.7
        );

    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="feature"
      className="relative w-full h-screen bg-dark overflow-hidden z-20"
    >
      {/* Background Ring */}
      <div
        ref={ringRef}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
      >
        <div
          className="rounded-full border border-cyan/30"
          style={{
            width: '70vw',
            height: '70vw',
            maxWidth: '900px',
            maxHeight: '900px',
          }}
        />
      </div>

      {/* Content Grid */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 h-full items-center px-6 sm:px-10 lg:px-16 xl:px-24">
        {/* Left Column - Text */}
        <div ref={headlineRef} className="order-2 lg:order-1">
          <h2 className="font-heading font-bold text-light text-3xl sm:text-4xl md:text-5xl mb-6">
            Support that
            <br />
            <span className="text-cyan">shows up.</span>
          </h2>
          <p className="text-light-muted text-base sm:text-lg mb-8 max-w-md">
            We handle the heavy lifting—remote troubleshooting, secure access, and real-time updates—so your team stays productive.
          </p>
          <Button
            variant="outline"
            className="border-cyan/50 text-cyan font-medium px-6 py-5 rounded-xl hover:bg-cyan/10 transition-all duration-300 hover:-translate-y-0.5"
          >
            See how it works
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>

        {/* Right Column - Laptop Image */}
        <div ref={laptopRef} className="order-1 lg:order-2 relative">
          <div className="relative">
            <img
              src="/images/feature_laptop.jpg"
              alt="IT Support Chat"
              className="w-full h-auto rounded-2xl shadow-card"
            />
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan/10 via-transparent to-transparent" />
          </div>
        </div>
      </div>

      {/* Chat Card - Floating */}
      <div
        ref={chatRef}
        className="absolute bottom-8 right-6 sm:right-10 lg:right-16 xl:right-24 z-20"
      >
        <div className="bg-dark-light/90 backdrop-blur-sm border border-light/10 rounded-2xl p-5 shadow-card max-w-xs">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-cyan/20 flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-cyan" />
            </div>
            <div>
              <p className="text-light font-medium text-sm">Live Support</p>
              <p className="text-light-muted text-xs">Online now</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-light-muted text-sm">
              <Clock className="w-4 h-4 text-cyan" />
              <span>Typical response: under 10 minutes</span>
            </div>
            <div className="flex items-center gap-2 text-light-muted text-sm">
              <Shield className="w-4 h-4 text-cyan" />
              <span>Secure remote access</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

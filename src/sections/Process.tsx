import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Calendar, ClipboardCheck, Wrench } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    number: '01',
    title: 'Book a call',
    description: 'Tell us what\'s broken (or what you\'re building).',
    icon: Calendar,
  },
  {
    number: '02',
    title: 'We diagnose & plan',
    description: 'Clear scope, timeline, and pricing—fast.',
    icon: ClipboardCheck,
  },
  {
    number: '03',
    title: 'We fix & maintain',
    description: 'Ongoing support that actually answers.',
    icon: Wrench,
  },
];

export default function Process() {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const headline = headlineRef.current;
    const cards = cardsRef.current;
    const line = lineRef.current;

    if (!section || !headline || !cards || !line) return;

    const cardElements = cards.querySelectorAll('.process-card');

    const ctx = gsap.context(() => {
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=140%',
          pin: true,
          scrub: 0.6,
        },
      });

      // ENTRANCE (0% - 30%)
      scrollTl
        // Headline enters
        .fromTo(headline,
          { y: '-20vh', opacity: 0 },
          { y: 0, opacity: 1, ease: 'power2.out' },
          0
        )
        // Card 1 from left
        .fromTo(cardElements[0],
          { x: '-60vw', opacity: 0 },
          { x: 0, opacity: 1, ease: 'power2.out' },
          0.1
        )
        // Card 2 from bottom
        .fromTo(cardElements[1],
          { y: '80vh', opacity: 0 },
          { y: 0, opacity: 1, ease: 'power2.out' },
          0.12
        )
        // Card 3 from right
        .fromTo(cardElements[2],
          { x: '60vw', opacity: 0 },
          { x: 0, opacity: 1, ease: 'power2.out' },
          0.14
        )
        // Connecting line
        .fromTo(line,
          { scaleX: 0 },
          { scaleX: 1, ease: 'power2.out' },
          0.15
        );

      // SETTLE (30% - 70%) - hold

      // EXIT (70% - 100%)
      scrollTl
        .fromTo(headline,
          { y: 0, opacity: 1 },
          { y: '-10vh', opacity: 0.2, ease: 'power2.in' },
          0.7
        )
        .fromTo(cardElements[0],
          { x: 0, opacity: 1 },
          { x: '-40vw', opacity: 0.25, ease: 'power2.in' },
          0.7
        )
        .fromTo(cardElements[1],
          { y: 0, opacity: 1 },
          { y: '40vh', opacity: 0.25, ease: 'power2.in' },
          0.7
        )
        .fromTo(cardElements[2],
          { x: 0, opacity: 1 },
          { x: '40vw', opacity: 0.25, ease: 'power2.in' },
          0.7
        )
        .fromTo(line,
          { opacity: 1 },
          { opacity: 0, ease: 'power2.in' },
          0.7
        );

    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="process"
      className="relative w-full h-screen bg-dark-light overflow-hidden z-[60]"
    >
      {/* Content Container */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 sm:px-6 lg:px-8">
        {/* Headline */}
        <div ref={headlineRef} className="text-center mb-12">
          <h2 className="font-heading font-bold text-light text-3xl sm:text-4xl md:text-5xl mb-4">
            Three steps to <span className="text-cyan">calm IT.</span>
          </h2>
          <p className="text-light-muted text-base sm:text-lg max-w-md mx-auto">
            No jargon. No runaround. Just results.
          </p>
        </div>

        {/* Cards Container */}
        <div ref={cardsRef} className="relative w-full max-w-6xl">
          {/* Connecting Line (desktop only) */}
          <div
            ref={lineRef}
            className="hidden lg:block absolute top-1/2 left-[15%] right-[15%] h-px bg-cyan/30 origin-left -translate-y-1/2"
          />

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {steps.map((step) => (
              <div
                key={step.number}
                className="process-card relative bg-dark border border-light/10 rounded-2xl p-6 lg:p-8 shadow-card hover:-translate-y-1.5 transition-transform duration-300"
              >
                {/* Number Badge */}
                <div className="absolute -top-3 -left-3 w-10 h-10 bg-cyan text-dark font-mono font-bold text-sm rounded-lg flex items-center justify-center">
                  {step.number}
                </div>

                {/* Icon */}
                <div className="w-12 h-12 bg-cyan/10 rounded-xl flex items-center justify-center mb-5">
                  <step.icon className="w-6 h-6 text-cyan" />
                </div>

                {/* Content */}
                <h3 className="font-heading font-semibold text-light text-xl mb-3">
                  {step.title}
                </h3>
                <p className="text-light-muted text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

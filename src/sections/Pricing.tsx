import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Button } from '@/components/ui/button';
import { Check, ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const plans = [
  {
    name: 'Starter',
    description: 'Per-session support',
    price: 'Pay as you go',
    features: [
      'Remote troubleshooting',
      'Email support',
      'Standard response time',
      'Pay per incident',
    ],
    featured: false,
    cta: 'Get started',
  },
  {
    name: 'Business',
    description: 'Monthly IT coverage',
    price: 'Custom',
    features: [
      'Priority response',
      'Proactive monitoring',
      'Regular maintenance',
      'Dedicated support line',
      'Monthly reporting',
    ],
    featured: true,
    cta: 'Get a quote',
  },
  {
    name: 'Enterprise',
    description: 'Full IT partnership',
    price: 'Custom',
    features: [
      'Everything in Business',
      'SLA guarantee',
      '24/7 monitoring',
      'Dedicated IT lead',
      'On-site visits',
      'Strategic planning',
    ],
    featured: false,
    cta: 'Contact sales',
  },
];

export default function Pricing() {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const headline = headlineRef.current;
    const cards = cardsRef.current;

    if (!section || !headline || !cards) return;

    const cardElements = cards.querySelectorAll('.pricing-card');

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
        const isFeatured = card.classList.contains('featured');
        gsap.fromTo(card,
          { y: 50, opacity: 0, scale: isFeatured ? 0.98 : 1 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.7,
            delay: index * 0.15,
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
      id="pricing"
      className="relative w-full bg-dark py-20 lg:py-28 z-[80]"
    >
      <div className="relative z-10 px-4 sm:px-6 lg:px-8 xl:px-16">
        {/* Headline */}
        <div ref={headlineRef} className="text-center mb-16">
          <h2 className="font-heading font-bold text-light text-3xl sm:text-4xl md:text-5xl mb-4">
            Simple <span className="text-cyan">plans.</span>
          </h2>
          <p className="text-light-muted text-base sm:text-lg max-w-md mx-auto">
            Scale up or down anytime.
          </p>
        </div>

        {/* Pricing Cards */}
        <div
          ref={cardsRef}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto items-stretch"
        >
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`pricing-card ${plan.featured ? 'featured' : ''} relative bg-dark-light border rounded-2xl p-6 lg:p-8 flex flex-col hover:-translate-y-1.5 transition-all duration-300 ${
                plan.featured
                  ? 'border-cyan/50 shadow-glow lg:scale-105'
                  : 'border-light/10 hover:border-cyan/30'
              }`}
            >
              {/* Featured Badge */}
              {plan.featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-cyan text-dark font-mono text-xs font-bold uppercase tracking-wider px-4 py-1 rounded-full">
                  Most Popular
                </div>
              )}

              {/* Plan Header */}
              <div className="mb-6">
                <h3 className="font-heading font-semibold text-light text-xl mb-1">
                  {plan.name}
                </h3>
                <p className="text-light-muted text-sm">{plan.description}</p>
              </div>

              {/* Price */}
              <div className="mb-6">
                <span className="font-heading font-bold text-light text-2xl">
                  {plan.price}
                </span>
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-8 flex-grow">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-cyan/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-cyan" />
                    </div>
                    <span className="text-light-muted text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Button
                asChild
                variant={plan.featured ? 'default' : 'outline'}
                className={`w-full py-5 rounded-xl font-medium transition-all duration-300 hover:-translate-y-0.5 ${
                  plan.featured
                    ? 'bg-cyan text-dark hover:bg-cyan-light'
                    : 'border-light/20 text-light hover:bg-light/10'
                }`}
              >
                <a href={`https://wa.me/96181706156?text=Hello%20Daouk%20IT%20Services%2C%20I%20want%20to%20ask%20about%20pricing%20-%20${encodeURIComponent(plan.name)}%20plan`} target="_blank" rel="noopener noreferrer">
                  {plan.cta}
                  <ArrowRight className="ml-2 w-4 h-4" />
                </a>
              </Button>
            </div>
          ))}
        </div>

        {/* Custom Quote CTA */}
        <div className="text-center mt-12">
          <p className="text-light-muted text-sm mb-4">
            Need something custom?
          </p>
          <Button
            asChild
            variant="outline"
            className="border-cyan/50 text-cyan hover:bg-cyan/10 rounded-xl"
          >
            <a href="https://wa.me/96181706156?text=Hello%20Daouk%20IT%20Services%2C%20I%20want%20to%20ask%20about%20pricing" target="_blank" rel="noopener noreferrer">
              Let's talk
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}

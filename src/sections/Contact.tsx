import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Button } from '@/components/ui/button';
import { Phone, Mail, MapPin, ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const contactInfo = [
  {
    icon: Phone,
    label: 'Call or WhatsApp',
    value: '+961 81 706 156',
    href: 'https://wa.me/+96181706156',
  },
  {
    icon: Mail,
    label: 'Email us',
    value: 'support@daoukitservices.com',
    href: 'mailto:support@daoukitservices.com',
  },
  {
    icon: MapPin,
    label: 'Location',
    value: 'Beirut, Lebanon • Remote worldwide',
    href: '#',
  },
];

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const headline = headlineRef.current;
    const cta = ctaRef.current;
    const contact = contactRef.current;

    if (!section || !headline || !cta || !contact) return;

    const contactItems = contact.querySelectorAll('.contact-item');

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

      // CTA animation
      gsap.fromTo(cta,
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          delay: 0.2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: cta,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Contact items stagger
      contactItems.forEach((item, index) => {
        gsap.fromTo(item,
          { y: 20, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.5,
            delay: 0.3 + index * 0.1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: contact,
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
      id="contact"
      className="relative w-full bg-dark py-20 lg:py-28 z-[100]"
    >
      {/* Background Gradient */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-cyan/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 px-4 sm:px-6 lg:px-8 xl:px-16">
        {/* Headline */}
        <div ref={headlineRef} className="text-center mb-10">
          <h2 className="font-heading font-bold text-light text-4xl sm:text-5xl md:text-6xl mb-4">
            Let's <span className="text-cyan">talk.</span>
          </h2>
          <p className="text-light-muted text-base sm:text-lg max-w-md mx-auto">
            Tell us what you need. We'll reply within one business day.
          </p>
        </div>

        {/* CTA Button */}
        <div ref={ctaRef} className="flex justify-center mb-16">
          <Button
            size="lg"
            className="bg-cyan text-dark font-semibold px-10 py-7 text-lg rounded-xl hover:bg-cyan-light transition-all duration-300 hover:-translate-y-0.5 glow-cyan-strong"
          >
            Book a free call
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>

        {/* Contact Info */}
        <div
          ref={contactRef}
          className="flex flex-col sm:flex-row justify-center items-center gap-8 sm:gap-12"
        >
          {contactInfo.map((item, index) => (
            <a
              key={index}
              href={item.href}
              className="contact-item flex items-center gap-4 group"
            >
              <div className="w-12 h-12 bg-cyan/10 rounded-xl flex items-center justify-center group-hover:bg-cyan/20 transition-colors duration-300">
                <item.icon className="w-5 h-5 text-cyan" />
              </div>
              <div>
                <p className="text-light-muted text-xs uppercase tracking-wider mb-0.5">
                  {item.label}
                </p>
                <p className="text-light font-medium text-sm group-hover:text-cyan transition-colors duration-300">
                  {item.value}
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

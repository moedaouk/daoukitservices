import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const navLinks = [
  { label: 'Services', href: '#services' },
  { label: 'Process', href: '#process' },
  { label: 'Testimonials', href: '#testimonials' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Contact', href: '#contact' },
];

const socialLinks = [
  { label: 'LinkedIn', href: '#' },
  { label: 'Twitter', href: '#' },
  { label: 'Facebook', href: '#' },
];

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const footer = footerRef.current;
    if (!footer) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(footer,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.6,
          scrollTrigger: {
            trigger: footer,
            start: 'top 95%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, footer);

    return () => ctx.revert();
  }, []);

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer
      ref={footerRef}
      className="relative w-full bg-dark border-t border-light/10 z-[110]"
    >
      <div className="px-4 sm:px-6 lg:px-8 xl:px-16 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Top Row */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-10">
            {/* Logo */}
            <div>
              <a href="#hero" className="font-heading font-bold text-2xl text-light">
                Daouk<span className="text-cyan">.</span>
              </a>
              <p className="text-light-muted text-sm mt-2">
                IT Services for modern teams.
              </p>
            </div>

            {/* Navigation */}
            <nav className="flex flex-wrap gap-6">
              {navLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={() => scrollToSection(link.href)}
                  className="text-light-muted text-sm hover:text-cyan transition-colors duration-300"
                >
                  {link.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Divider */}
          <div className="h-px bg-light/10 mb-8" />

          {/* Bottom Row */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            {/* Copyright */}
            <p className="text-light-muted text-xs">
              © {new Date().getFullYear()} Daouk IT Services. All rights reserved.
            </p>

            {/* Social Links */}
            <div className="flex gap-6">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-light-muted text-xs hover:text-cyan transition-colors duration-300"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

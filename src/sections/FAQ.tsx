import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronDown } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const faqs = [
  {
    question: 'Do you offer on-site visits in Beirut?',
    answer: 'Yes, we provide on-site support throughout Beirut and surrounding areas. For urgent issues, we can typically arrive within 2-4 hours. Remote support is also available for faster resolution of software-related issues.',
  },
  {
    question: 'How fast is remote support?',
    answer: 'Our average response time for remote support is under 10 minutes during business hours. Once connected, most issues are resolved within 30-60 minutes depending on complexity.',
  },
  {
    question: 'Can you support multiple offices?',
    answer: 'Absolutely. We regularly support businesses with multiple locations across Lebanon. Our remote support capabilities mean we can assist any location instantly, and we can coordinate on-site visits as needed.',
  },
  {
    question: 'What\'s included in CCTV maintenance?',
    answer: 'Our CCTV maintenance includes monthly system health checks, camera cleaning and alignment, storage optimization, firmware updates, and 24/7 monitoring options. We also provide same-day replacement for faulty equipment under our Business and Enterprise plans.',
  },
  {
    question: 'Is there a long-term contract?',
    answer: 'No long-term contracts required for Starter plans. Business and Enterprise plans have flexible terms with 30-day cancellation notice. We believe in earning your business every month through excellent service.',
  },
];

export default function FAQ() {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const accordionRef = useRef<HTMLDivElement>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const headline = headlineRef.current;
    const accordion = accordionRef.current;

    if (!section || !headline || !accordion) return;

    const items = accordion.querySelectorAll('.faq-item');

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

      // FAQ items animation
      items.forEach((item, index) => {
        gsap.fromTo(item,
          { y: 24, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.5,
            delay: index * 0.1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: item,
              start: 'top 90%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });

    }, section);

    return () => ctx.revert();
  }, []);

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section
      ref={sectionRef}
      id="faq"
      className="relative w-full bg-dark-light py-20 lg:py-28 z-[90]"
    >
      <div className="relative z-10 px-4 sm:px-6 lg:px-8 xl:px-16">
        {/* Headline */}
        <div ref={headlineRef} className="text-center mb-16">
          <h2 className="font-heading font-bold text-light text-3xl sm:text-4xl md:text-5xl mb-4">
            Questions <span className="text-cyan">& answers.</span>
          </h2>
        </div>

        {/* Accordion */}
        <div
          ref={accordionRef}
          className="max-w-3xl mx-auto space-y-4"
        >
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="faq-item bg-dark border border-light/10 rounded-xl overflow-hidden hover:border-cyan/20 transition-colors duration-300"
            >
              <button
                onClick={() => toggleItem(index)}
                className="w-full flex items-center justify-between p-5 text-left"
              >
                <span className="text-light font-medium pr-4">
                  {faq.question}
                </span>
                <div
                  className={`w-8 h-8 bg-cyan/10 rounded-lg flex items-center justify-center flex-shrink-0 transition-transform duration-300 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                >
                  <ChevronDown className="w-4 h-4 text-cyan" />
                </div>
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? 'max-h-96' : 'max-h-0'
                }`}
              >
                <div className="px-5 pb-5">
                  <p className="text-light-muted text-sm leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

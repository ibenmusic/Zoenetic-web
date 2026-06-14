import { useEffect, useRef } from 'react';
import { MapPin, Home, Sword, BookOpen } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    icon: MapPin,
    iconColor: '#00D4FF',
    bgColor: 'rgba(0, 212, 255, 0.1)',
    title: 'GPS y Paseos Reales',
    body: 'Explora tu vecindario mientras tu companero virtual te acompana. Cada paso cuenta para desbloquear recompensas.',
    image: '/paw-kingdom-gps.jpg',
  },
  {
    icon: Home,
    iconColor: '#10C971',
    bgColor: 'rgba(16, 201, 113, 0.1)',
    title: 'Housing y Decoracion',
    body: 'Personaliza el hogar de tu mascota virtual con muebles, adornos y temas exclusivos desbloqueados con tu actividad.',
    image: '/paw-kingdom-housing.jpg',
  },
  {
    icon: Sword,
    iconColor: '#00D4FF',
    bgColor: 'rgba(0, 212, 255, 0.1)',
    title: 'Combates Estrategicos',
    body: 'Entrena a tu companero y enfrentate a otros jugadores en combates por turnos llenos de estrategia y diversion.',
    image: '/paw-kingdom-combat.jpg',
  },
  {
    icon: BookOpen,
    iconColor: '#10C971',
    bgColor: 'rgba(16, 201, 113, 0.1)',
    title: 'Modo Historia',
    body: 'Sumérgete en una narrativa envolvente donde cada decision afecta el mundo de Paw Kingdom y sus habitantes.',
    image: '/paw-kingdom-story.jpg',
  },
];

export default function PawKingdom() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const phoneRef = useRef<HTMLDivElement>(null);
  const screenImagesRef = useRef<HTMLDivElement>(null);
  const mobileScrollRef = useRef<HTMLDivElement>(null);

  const handleInfiniteScroll = () => {
    const el = mobileScrollRef.current;
    if (!el) return;

    const scrollLeft = el.scrollLeft;
    const scrollWidth = el.scrollWidth;
    const clientWidth = el.clientWidth;

    // Detect if we reached the end of the first half
    if (scrollLeft + clientWidth >= scrollWidth - 10) {
      el.scrollLeft = 1; // Jump back to start
    } else if (scrollLeft <= 0) {
      el.scrollLeft = scrollWidth / 2 - clientWidth; // Jump to end of first half if scrolling back
    }
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header reveal
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: headerRef.current,
            start: 'top 85%',
          },
        }
      );

      // Feature cards staggered reveal
      const cardEls = cardsRef.current?.querySelectorAll('.feature-card');
      if (cardEls) {
        gsap.fromTo(
          cardEls,
          { opacity: 0, x: -30 },
          {
            opacity: 1,
            x: 0,
            stagger: 0.1,
            duration: 0.6,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: cardsRef.current,
              start: 'top 80%',
              once: true,
            },
          }
        );

        // Hover listeners for immediate screen switching
        cardEls.forEach((card, i) => {
          card.addEventListener('mouseenter', () => switchScreen(i));
        });
      }

      // Phone screen crossfade on scroll
      const images = screenImagesRef.current?.querySelectorAll('.phone-screen');
      if (images && images.length > 0) {
        const cardElements = cardsRef.current?.querySelectorAll('.feature-card');
        if (cardElements) {
          cardElements.forEach((card, index) => {
            ScrollTrigger.create({
              trigger: card,
              start: 'top center',
              end: 'bottom center',
              onEnter: () => switchScreen(index),
              onEnterBack: () => switchScreen(index),
            });
          });
        }
      }

      function switchScreen(index: number) {
        const images = screenImagesRef.current?.querySelectorAll('.phone-screen');
        if (!images) return;
        images.forEach((img, i) => {
          gsap.to(img, {
            opacity: i === index ? 1 : 0,
            duration: 0.3,
            overwrite: 'auto',
          });
        });
      }

      // Ensure ST is refreshed
      ScrollTrigger.refresh();
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="paw-kingdom"
      ref={sectionRef}
      className="relative bg-charcoal overflow-hidden"
      style={{ padding: 'clamp(5rem, 10vh, 8rem) 0' }}
    >
      <div className="max-w-[1200px] mx-auto px-6 lg:px-12">
        {/* Header */}
        <div ref={headerRef} className="text-center mb-16">
          <span
            className="inline-block font-body font-medium text-xs tracking-[0.15em] mb-4"
            style={{ color: '#10C971' }}
          >
            PROYECTO DESTACADO
          </span>
          <h2
            className="font-display font-bold mb-4"
            style={{
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              lineHeight: 1.1,
              letterSpacing: '-0.01em',
              color: '#F8F9FA',
            }}
          >
            Paw Kingdom
          </h2>
          <p
            className="mx-auto max-w-[600px] font-body"
            style={{
              fontSize: '1.125rem',
              lineHeight: 1.6,
              color: '#A0AEC0',
            }}
          >
            El juego que promueve la tenencia responsable, transformando el paseo con tu mascota en una aventura Gamificada
          </p>
        </div>

        {/* Two-column layout */}
        <div className="flex flex-col lg:flex-row gap-12 items-start">
          {/* Left: Feature Cards */}
          <div ref={cardsRef} className="flex-1 space-y-6">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div
                  key={i}
                  className="feature-card group flex items-start gap-5 p-6 rounded-xl border transition-all duration-300 hover:border-cyan-neon hover:shadow-[0_0_20px_rgba(0,212,255,0.15)] hover:translate-x-2"
                  style={{
                    backgroundColor: '#232730',
                    borderColor: 'rgba(74, 85, 104, 0.3)',
                  }}
                >
                  <div
                    className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                    style={{ backgroundColor: feature.bgColor }}
                  >
                    <Icon size={24} color={feature.iconColor} />
                  </div>
                  <div>
                    <h3
                      className="font-display font-semibold mb-2 transition-colors group-hover:text-cyan-neon"
                      style={{
                        fontSize: 'clamp(1.1rem, 1.8vw, 1.35rem)',
                        lineHeight: 1.2,
                        color: '#F8F9FA',
                      }}
                    >
                      {feature.title}
                    </h3>
                    <p
                      className="font-body"
                      style={{
                        fontSize: '1rem',
                        lineHeight: 1.6,
                        color: '#A0AEC0',
                      }}
                    >
                      {feature.body}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right: Phone Mockup */}
          <div
            ref={phoneRef}
            className="hidden lg:flex flex-shrink-0 justify-center sticky top-[120px]"
          >
            <div
              className="relative animate-float"
              style={{
                width: 280,
                height: 560,
                backgroundColor: '#0A0C10',
                border: '2px solid rgba(74, 85, 104, 0.5)',
                borderRadius: 40,
                boxShadow: '0 30px 60px rgba(0, 0, 0, 0.6), 0 0 40px rgba(0, 212, 255, 0.1)',
                padding: 12,
              }}
            >
              {/* Phone notch */}
              <div
                className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 rounded-b-2xl z-10"
                style={{ backgroundColor: '#0A0C10' }}
              />

              {/* Screen */}
              <div
                className="w-full h-full rounded-[32px] overflow-hidden relative"
                ref={screenImagesRef}
              >
                {features.map((feature, i) => (
                  <img
                    key={i}
                    src={feature.image}
                    alt={feature.title}
                    className="phone-screen absolute inset-0 w-full h-full object-cover"
                    style={{ opacity: i === 0 ? 1 : 0 }}
                  />
                ))}
              </div>

              {/* Phone buttons (decorative) */}
              <div
                className="absolute right-[-3px] top-24 w-[3px] h-12 rounded-r-sm"
                style={{ backgroundColor: 'rgba(74, 85, 104, 0.5)' }}
              />
              <div
                className="absolute right-[-3px] top-40 w-[3px] h-8 rounded-r-sm"
                style={{ backgroundColor: 'rgba(74, 85, 104, 0.5)' }}
              />
              <div
                className="absolute left-[-3px] top-32 w-[3px] h-16 rounded-l-sm"
                style={{ backgroundColor: 'rgba(74, 85, 104, 0.5)' }}
              />
            </div>
          </div>

          {/* Mobile: horizontal scroll of screenshots */}
          <div className="w-full lg:hidden">
            <p className="text-center font-body text-[10px] tracking-widest mb-4 text-cyan-neon animate-pulse uppercase">
              Desliza para explorar →
            </p>
            <div 
               ref={mobileScrollRef}
               onScroll={handleInfiniteScroll}
               className="flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory px-6 hide-scrollbar relative z-20"
            >
              {[...features, ...features].map((feature, i) => (
                <div
                  key={i}
                  className="flex-shrink-0 snap-center"
                  style={{
                    width: 280,
                    height: 520,
                    backgroundColor: '#0A0C10',
                    border: '2px solid rgba(74, 85, 104, 0.4)',
                    borderRadius: 36,
                    padding: 12,
                    boxShadow: '0 20px 40px rgba(0,0,0,0.5), 0 0 20px rgba(0,212,255,0.05)'
                  }}
                >
                  <div className="w-full h-full rounded-[26px] overflow-hidden">
                    <img
                      src={feature.image}
                      alt={feature.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

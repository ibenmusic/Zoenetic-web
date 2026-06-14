import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const milestones = [
  {
    quarter: 'Q4 2025',
    title: 'Concepto y Prototipo',
    description:
      'Nacimiento de la idea de Paw Kingdom. Primer prototipo jugable con mecanicas de paseo con recompenzas por GPS y combates en tiempo real.',
    completed: true,
  },
  {
    quarter: 'Q1 2026',
    title: 'Core Systems',
    description:
      'Sistema de housing basico, sistema de reconocimiento y generación de mascotas como personajes basado en IA.',
    completed: true,
  },
  {
    quarter: 'Q2 2026',
    title: 'Servers Configuration & Data Sync',
    description:
      'Combates en tiempo real, sistema de misiones diarias y Base de datos de mascotas.',
    completed: true,
  },
  {
    quarter: 'Q3 2026',
    title: 'Pre-Alpha',
    description:
      'Primeros niveles del Modo historia, customización personaje humano, tienda virtual y primera ronda de selección de socios comerciales.',
    completed: true,
  },
  {
    quarter: 'Q4 2026',
    title: 'Lanzamiento Alfa Testers',
    description:
      'Paw Kingdom disponible en iOS y Android con misiones coordinadas con Socios Comerciales, validación de Dashboards y feedback de usuarios.',
    completed: false,
  },
  {
    quarter: '2027',
    title: 'Lanzamiento Nacional',
    description:
      'Modo Battle Royale, Dungeons Mensuales, sistema de caniles y pre-lanzamiento Global.',
    completed: false,
  },
];

export default function Roadmap() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

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

      // Timeline line draw
      if (lineRef.current) {
        gsap.fromTo(
          lineRef.current,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: timelineRef.current,
              start: 'top 80%',
              end: 'bottom 20%',
              scrub: 1, // Added slight smoothing
            },
          }
        );
      }

      // Milestone cards reveal
      const cardEls = timelineRef.current?.querySelectorAll('.milestone-card');
      if (cardEls) {
        cardEls.forEach((card) => {
          gsap.fromTo(
            card,
            { opacity: 0, y: 30 },
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: card,
                start: 'top 90%',
                once: true,
              },
            }
          );
        });
      }

      // Refresh to ensure all trigger positions are correct
      ScrollTrigger.refresh();
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="roadmap"
      ref={sectionRef}
      className="relative bg-deep-navy"
      style={{ padding: 'clamp(5rem, 10vh, 8rem) 0' }}
    >
      <div className="max-w-[800px] mx-auto px-6 lg:px-12">
        {/* Header */}
        <div ref={headerRef} className="text-center mb-16">
          <span
            className="inline-block font-body font-medium text-xs tracking-[0.15em] mb-4"
            style={{ color: '#00D4FF' }}
          >
            DEVLOG
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
            Roadmap
          </h2>
          <p
            className="font-body"
            style={{
              fontSize: '1rem',
              lineHeight: 1.6,
              color: '#A0AEC0',
            }}
          >
            Nuestro camino hacia el lanzamiento de Paw Kingdom
          </p>
        </div>

        {/* Timeline */}
        <div ref={timelineRef} className="relative">
          {/* Vertical Line */}
          <div
            className="absolute left-6 md:left-1/2 md:-translate-x-[1px] top-0 bottom-0 w-[2px] origin-top"
            style={{
              background:
                'linear-gradient(180deg, #10C971 0%, #10C971 65%, #4A5568 65%, #4A5568 100%)',
            }}
          />
          {/* Animated overlay line (draws on scroll) */}
          <div
            ref={lineRef}
            className="absolute left-6 md:left-1/2 md:-translate-x-[1px] top-0 bottom-0 w-[2px] origin-top"
            style={{
              background:
                'linear-gradient(180deg, #10C971 0%, #00D4FF 100%)',
              transform: 'scaleY(0)',
            }}
          />

          {/* Milestones */}
          <div className="space-y-10">
            {milestones.map((milestone, i) => {
              const isLeft = i % 2 === 0;
              return (
                <div
                  key={i}
                  className={`relative flex items-start gap-8 ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'
                    }`}
                >
                  {/* Dot on timeline */}
                  <div className="absolute left-6 md:left-1/2 -translate-x-1/2 z-10">
                    <div
                      className={`w-4 h-4 rounded-full ${milestone.completed
                        ? 'animate-glow-pulse'
                        : ''
                        }`}
                      style={{
                        backgroundColor: milestone.completed
                          ? '#10C971'
                          : '#4A5568',
                        border: milestone.completed
                          ? 'none'
                          : '2px solid rgba(74, 85, 104, 0.5)',
                        boxShadow: milestone.completed
                          ? '0 0 15px rgba(16, 201, 113, 0.5)'
                          : 'none',
                      }}
                    />
                  </div>

                  {/* Card */}
                  <div
                    className={`milestone-card ml-14 md:ml-0 md:w-[calc(50%-2rem)] p-6 rounded-xl ${isLeft ? 'md:mr-auto' : 'md:ml-auto'
                      }`}
                    style={{
                      backgroundColor: '#1A1D24',
                      border: '1px solid rgba(74, 85, 104, 0.3)',
                      borderLeft: `3px solid ${milestone.completed ? '#10C971' : '#4A5568'
                        }`,
                    }}
                  >
                    <span
                      className="inline-block font-body font-semibold text-xs tracking-[0.08em] mb-2"
                      style={{
                        color: milestone.completed
                          ? '#10C971'
                          : '#6B7A8D',
                      }}
                    >
                      {milestone.quarter}
                    </span>
                    <h3
                      className="font-display font-semibold mb-2"
                      style={{
                        fontSize: '1.25rem',
                        lineHeight: 1.2,
                        color: '#F8F9FA',
                      }}
                    >
                      {milestone.title}
                    </h3>
                    <p
                      className="font-body"
                      style={{
                        fontSize: '0.95rem',
                        lineHeight: 1.6,
                        color: '#A0AEC0',
                      }}
                    >
                      {milestone.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

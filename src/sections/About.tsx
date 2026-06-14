import { useEffect, useRef } from 'react';
import { Target, Eye, Heart } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const cards = [
  {
    icon: Target,
    iconColor: '#10C971',
    title: 'Mision',
    body: 'Crear productos digitales que inspiren una mejor calidad de vida, a través de la Gamificación.',
  },
  {
    icon: Eye,
    iconColor: '#00D4FF',
    title: 'Vision',
    body: 'Ser el estudio lider en diseno de experiencias digitales que conectan tecnologia con el bienestar del mundo.',
  },
  {
    icon: Heart,
    iconColor: '#10C971',
    title: 'Valores',
    body: 'Innovacion con proposito. Diseño centrado en el bienestar. Sostenibilidad digital. Entretenimiento impulsado por el propósito.',
  },
];

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

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
            toggleActions: 'play none none none',
          },
        }
      );

      // Cards staggered reveal
      const cardEls = cardsRef.current?.querySelectorAll('.about-card');
      if (cardEls) {
        gsap.fromTo(
          cardEls,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.15,
            duration: 0.6,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: cardsRef.current,
              start: 'top 80%',
              once: true,
            },
          }
        );
      }

      // Refresh to ensure positions are correct
      ScrollTrigger.refresh();
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="sobre-nosotros"
      ref={sectionRef}
      className="relative bg-deep-navy overflow-hidden"
      style={{ padding: 'clamp(5rem, 10vh, 8rem) 0' }}
    >
      {/* Circuit Node Network Background - subtle */}
      <CircuitBackground />

      <div className="relative z-10 max-w-[1200px] mx-auto px-6 lg:px-12">
        {/* Header */}
        <div ref={headerRef} className="text-center mb-12">
          <span
            className="inline-block font-body font-medium text-xs tracking-[0.15em] mb-4"
            style={{ color: '#00D4FF' }}
          >
            SOBRE NOSOTROS
          </span>
          <h2
            className="font-display font-bold"
            style={{
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              lineHeight: 1.1,
              letterSpacing: '-0.01em',
              color: '#F8F9FA',
            }}
          >
            Sembramos tecnología, cosechamos bienestar
          </h2>
        </div>

        {/* Cards Grid */}
        <div
          ref={cardsRef}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {cards.map((card, i) => {
            const Icon = card.icon;
            return (
              <div
                key={i}
                className="about-card group p-8 rounded-xl border transition-all duration-300 hover:-translate-y-2 hover:border-cyan-neon/30 hover:shadow-[0_8px_40px_rgba(0,212,255,0.15),0_4px_24px_rgba(0,0,0,0.4)]"
                style={{
                  backgroundColor: '#1A1D24',
                  borderColor: 'rgba(74, 85, 104, 0.3)',
                }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110"
                  style={{
                    backgroundColor:
                      card.iconColor === '#10C971'
                        ? 'rgba(16, 201, 113, 0.1)'
                        : 'rgba(0, 212, 255, 0.1)',
                  }}
                >
                  <Icon size={32} color={card.iconColor} />
                </div>
                <h3
                  className="font-display font-semibold mb-3 group-hover:text-cyan-neon transition-colors"
                  style={{
                    fontSize: 'clamp(1.25rem, 2vw, 1.5rem)',
                    lineHeight: 1.2,
                    color: '#F8F9FA',
                  }}
                >
                  {card.title}
                </h3>
                <p
                  className="font-body"
                  style={{
                    fontSize: '1rem',
                    lineHeight: 1.6,
                    color: '#A0AEC0',
                  }}
                >
                  {card.body}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* Circuit Node Network Background */
function CircuitBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cvs = canvasRef.current;
    if (!cvs) return;
    const ctx = cvs.getContext('2d')!;
    const dpr = window.devicePixelRatio || 1;

    let w = 0;
    let h = 0;
    let nodes: { x: number; y: number; vx: number; vy: number; size: number }[] = [];
    let animId: number;
    let isVisible = true;

    function resize() {
      const rect = cvs!.parentElement?.getBoundingClientRect();
      if (!rect) return;
      w = rect.width;
      h = rect.height;
      cvs!.width = w * dpr;
      cvs!.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      initNodes();
    }

    function initNodes() {
      const count = 40;
      nodes = [];
      for (let i = 0; i < count; i++) {
        nodes.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          size: 2 + Math.random() * 2,
        });
      }
    }

    function draw() {
      if (!isVisible) {
        animId = requestAnimationFrame(draw);
        return;
      }
      ctx.clearRect(0, 0, w, h);

      // Update and draw nodes
      for (const node of nodes) {
        node.x += node.vx;
        node.y += node.vy;
        if (node.x < 0 || node.x > w) node.vx *= -1;
        if (node.y < 0 || node.y > h) node.vy *= -1;
      }

      // Draw connections
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            const opacity = (1 - dist / 150) * 0.1;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(0, 212, 255, ${opacity})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      // Draw nodes
      for (const node of nodes) {
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.size, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 212, 255, 0.4)';
        ctx.fill();
      }

      animId = requestAnimationFrame(draw);
    }

    resize();
    draw();

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { threshold: 0.1 }
    );
    observer.observe(cvs!);

    window.addEventListener('resize', resize);

    return () => {
      cancelAnimationFrame(animId);
      observer.disconnect();
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none opacity-30"
    />
  );
}

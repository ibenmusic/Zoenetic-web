import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { label: 'Inicio', href: '#inicio' },
  { label: 'Sobre Nosotros', href: '#sobre-nosotros' },
  { label: 'Paw Kingdom', href: '#paw-kingdom' },
  { label: 'Roadmap', href: '#roadmap' },
  { label: 'Contacto', href: '#contacto' },
];

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('inicio');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-30% 0px -70% 0px' }
    );

    navLinks.forEach((link) => {
      const el = document.querySelector(link.href);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <nav
        className={`fixed top-1 left-0 w-full z-[1000] transition-all duration-300 ${
          scrolled
            ? 'bg-deep-navy/85 backdrop-blur-xl border-b border-border-custom/30'
            : 'bg-transparent'
        }`}
        style={{ height: 80 }}
      >
        <div className="max-w-[1200px] mx-auto px-6 lg:px-12 h-full flex items-center justify-between">
          {/* Logo */}
          <a
            href="#inicio"
            onClick={(e) => handleClick(e, '#inicio')}
            className="flex items-center"
          >
            <img
              src="/zoenetic-logo.png"
              alt="Zoenetic"
              className="h-14 w-auto"
            />
          </a>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleClick(e, link.href)}
                className={`font-body font-semibold text-sm tracking-[0.08em] transition-colors duration-300 ${
                  activeSection === link.href.slice(1)
                    ? 'text-cyan-neon'
                    : 'text-text-secondary hover:text-cyan-neon'
                }`}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden text-text-secondary hover:text-cyan-neon transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[999] bg-deep-navy/95 backdrop-blur-xl flex flex-col items-center justify-center gap-8 md:hidden">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleClick(e, link.href)}
              className={`font-display font-semibold text-2xl tracking-[0.05em] transition-colors duration-300 ${
                activeSection === link.href.slice(1)
                  ? 'text-cyan-neon'
                  : 'text-text-primary hover:text-cyan-neon'
              }`}
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </>
  );
}

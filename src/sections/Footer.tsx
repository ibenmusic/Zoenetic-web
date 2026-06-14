import { useState } from 'react';
import { Heart } from 'lucide-react';

// Inline social icons as SVG components
function TwitterIcon({ size = 24, color = '#A0AEC0' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
    </svg>
  );
}

function InstagramIcon({ size = 24, color = '#A0AEC0' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function DiscordIcon({ size = 24, color = '#A0AEC0' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 9a5 5 0 0 0-5-5h-2a5 5 0 0 0-5 5v6a5 5 0 0 0 5 5h2a5 5 0 0 0 5-5V9z" />
      <path d="M9 9h6" />
      <path d="M9 13h6" />
      <path d="M9 17h3" />
    </svg>
  );
}

function LinkedInIcon({ size = 24, color = '#A0AEC0' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

const socialLinks = [
  { icon: TwitterIcon, label: 'Twitter', href: '#' },
  { icon: InstagramIcon, label: 'Instagram', href: '#' },
  { icon: DiscordIcon, label: 'Discord', href: '#' },
  { icon: LinkedInIcon, label: 'LinkedIn', href: '#' },
];

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer
      id="contacto"
      className="bg-charcoal border-t border-border-custom/30"
    >
      <div className="max-w-[1200px] mx-auto px-6 lg:px-12 pt-16 pb-8">
        {/* Top area - Two columns */}
        <div className="flex flex-col md:flex-row gap-12 mb-12">
          {/* Left: Newsletter */}
          <div className="flex-1">
            <h3
              className="font-display font-semibold mb-3"
              style={{
                fontSize: 'clamp(1.25rem, 2vw, 1.5rem)',
                lineHeight: 1.2,
                color: '#F8F9FA',
              }}
            >
              Únete a la Beta
            </h3>
            <p
              className="font-body mb-6 max-w-md"
              style={{
                fontSize: '1rem',
                lineHeight: 1.6,
                color: '#A0AEC0',
              }}
            >
              Suscríbite a nuestro newsletter para ser de los primeros en probar
              Paw Kingdom y recibir actualizaciones exclusivas.
            </p>

            {subscribed ? (
              <div
                className="p-4 rounded-lg font-body font-medium"
                style={{
                  backgroundColor: 'rgba(16, 201, 113, 0.1)',
                  color: '#10C971',
                  border: '1px solid rgba(16, 201, 113, 0.3)',
                }}
              >
                ¡Gracias por suscribirte! Pronto recibiras novedades.
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="flex flex-col sm:flex-row gap-3"
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  required
                  className="px-4 py-3 rounded-lg font-body text-sm transition-all duration-300 outline-none"
                  style={{
                    backgroundColor: '#232730',
                    border: '1px solid #4A5568',
                    color: '#F8F9FA',
                    width: 280,
                    maxWidth: '100%',
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#00D4FF';
                    e.currentTarget.style.boxShadow =
                      '0 0 0 3px rgba(0, 212, 255, 0.2)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = '#4A5568';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                />
                <button
                  type="submit"
                  className="px-6 py-3 rounded-lg font-display font-semibold text-sm tracking-[0.05em] transition-all duration-300 hover:-translate-y-0.5"
                  style={{
                    backgroundColor: '#10C971',
                    color: '#12161A',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#14E07D';
                    e.currentTarget.style.boxShadow =
                      '0 0 20px rgba(16, 201, 113, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#10C971';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  Suscribirme
                </button>
              </form>
            )}
          </div>

          {/* Right: Contact */}
          <div className="flex-shrink-0">
            <h3
              className="font-display font-semibold mb-4"
              style={{
                fontSize: 'clamp(1.25rem, 2vw, 1.5rem)',
                lineHeight: 1.2,
                color: '#F8F9FA',
              }}
            >
              Contacto
            </h3>
            <div className="space-y-2 mb-6">
              <a
                href="mailto:hola@zoenetic.com"
                className="block font-body transition-colors duration-300 hover:text-cyan-neon"
                style={{ fontSize: '1rem', color: '#A0AEC0' }}
              >
                contacto@zoenetic.com
              </a>
              <span
                className="block font-body"
                style={{ fontSize: '1rem', color: '#A0AEC0' }}
              >
                Santiago de Chile
              </span>
            </div>

            {/* Social Icons */}
            <div className="flex gap-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    className="transition-all duration-300 hover:-translate-y-0.5"
                    style={{ color: '#A0AEC0' }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = '#00D4FF';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = '#A0AEC0';
                    }}
                  >
                    <Icon size={24} />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t"
          style={{ borderColor: 'rgba(74, 85, 104, 0.3)' }}
        >
          <span
            className="font-body font-medium text-xs"
            style={{ color: '#6B7A8D', letterSpacing: '0.05em' }}
          >
            2026 Zoenetic. Todos los derechos reservados.
          </span>
          <span
            className="font-body font-medium text-xs flex items-center gap-1"
            style={{ color: '#6B7A8D', letterSpacing: '0.05em' }}
          >
            Disenado con <Heart size={12} color="#10C971" fill="#10C971" /> en
            Chile
          </span>
        </div>
      </div>
    </footer>
  );
}

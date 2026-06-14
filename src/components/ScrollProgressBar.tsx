import { useEffect, useRef } from 'react';

export default function ScrollProgressBar() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!barRef.current) return;
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? scrollTop / docHeight : 0;
      barRef.current.style.transform = `scaleX(${Math.min(progress, 1)})`;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      className="fixed top-0 left-0 w-full h-1 z-[9999] origin-left"
      style={{
        background: 'linear-gradient(90deg, #10C971, #00D4FF)',
      }}
      ref={barRef}
    />
  );
}

import { useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/* ============================================================
   GENERATIVE LEAF GROWTH CANVAS ANIMATION
   ============================================================ */

interface TreeNode {
  parent: TreeNode | null;
  children: TreeNode[];
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  angle: number;
  depth: number;
  length: number;
  currentLength: number;
  width: number;
  type: 'plant' | 'circuit';
  cpX?: number; // Curve control point offset
  cpY?: number;
  leafSettings?: { size: number; angle: number; delay: number; side: 'left' | 'right' }[];
  delayFactor: number;
  speedFactor: number;
}

const STEM_COLOR = '#10C971';
const CIRCUIT_COLOR = '#00D4FF';
const CIRCUIT_GLOW = 'rgba(0, 212, 255, 0.6)';

function createLeafCanvas(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext('2d')!;
  const dpr = window.devicePixelRatio || 1;

  let w = 0;
  let h = 0;

  function resize() {
    w = canvas.offsetWidth;
    h = canvas.offsetHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resize();

  let plantNodes: TreeNode[] = [];
  let circuitNodes: TreeNode[] = [];
  let growthProgress = 0;

  function randomRange(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }

  function easeOutCubic(t: number) {
    return 1 - Math.pow(1 - t, 3);
  }

  function createNode(
    type: 'plant' | 'circuit',
    parent: TreeNode | null,
    x: number,
    y: number,
    angle: number,
    depth: number
  ): TreeNode {
    let length = 0;
    let width = 1;
    let cpX = 0;
    let cpY = 0;
    let leafSettings = [];

    if (type === 'plant') {
      length = depth === 0 ? 80 : 120; // Larger overall
      width = depth === 0 ? 8 : 4;
      // Organic curve control point
      cpX = randomRange(-30, 30);
      cpY = randomRange(-length * 0.4, -length * 0.6);

      // Asymmetrical leaf configuration
      const numLeaves = depth === 0 ? 1 : 2;
      for (let i = 0; i < numLeaves; i++) {
        leafSettings.push({
          size: randomRange(40, 70),
          angle: randomRange(30, 60),
          delay: randomRange(0.2, 0.6),
          side: Math.random() > 0.5 ? ('left' as const) : ('right' as const),
        });
      }
    } else {
      length = depth === 0 ? randomRange(25, 45) : randomRange(15, 30); // Compact segments
      width = Math.max(0.8, 1.8 - depth * 0.4);
    }

    return {
      type,
      parent,
      children: [],
      x,
      y,
      baseX: x,
      baseY: y,
      angle,
      depth,
      length,
      currentLength: 0,
      width,
      cpX,
      cpY,
      leafSettings,
      delayFactor: randomRange(0, 0.12),
      speedFactor: randomRange(0.7, 1.3),
    };
  }

  function generateStructures() {
    const rootX = w / 2;
    const rootY = h / 2 + 250;

    plantNodes = [];
    const mainStem = createNode('plant', null, rootX, rootY, -90, 0);
    plantNodes.push(mainStem);

    // Asymmetrical branching
    const angleRad = (mainStem.angle * Math.PI) / 180;
    const endX = mainStem.x + Math.cos(angleRad) * mainStem.length;
    const endY = mainStem.y + Math.sin(angleRad) * mainStem.length;

    mainStem.children.push(createNode('plant', mainStem, endX, endY, -135 + randomRange(-15, 15), 1));
    mainStem.children.push(createNode('plant', mainStem, endX, endY, -45 + randomRange(-15, 15), 1));

    circuitNodes = [];
    const numTrunks = 10;
    for (let i = 0; i < numTrunks; i++) {
      const side = i < numTrunks / 2 ? 0 : 180;
      const trunk = createNode('circuit', null, rootX, rootY, side, 0);
      trunk.length = randomRange(10, 40);
      circuitNodes.push(trunk);
      growCircuitProcedural(trunk, 0);
    }
  }

  function growCircuitProcedural(node: TreeNode, depth: number) {
    if (depth >= 4) return;

    const angleRad = (node.angle * Math.PI) / 180;
    const endX = node.x + Math.cos(angleRad) * node.length;
    const endY = node.y + Math.sin(angleRad) * node.length;

    // To prevent intersection, we alternate H and V but with random lengths and branching
    const isHorizontal = node.angle === 0 || node.angle === 180;
    
    if (isHorizontal) {
      // Just go down
      const down = createNode('circuit', node, endX, endY, 90, depth + 1);
      down.length = randomRange(15, 50); // Varied heights
      node.children.push(down);
      growCircuitProcedural(down, depth + 1);
    } else {
      // From vertical, branch out horizontal
      // Ensure we don't branch back towards the center too aggressively
      const directions = Math.random() > 0.4 ? [0, 180] : (node.x > w / 2 ? [0] : [180]);
      directions.forEach(ang => {
         const horiz = createNode('circuit', node, endX, endY, ang, depth + 1);
         horiz.length = randomRange(10, 30);
         node.children.push(horiz);
         growCircuitProcedural(horiz, depth + 1);
      });
    }
  }

  function drawNode(node: TreeNode, time: number) {
    if (node.currentLength <= 0) return;

    const angleRad = (node.angle * Math.PI) / 180;
    const t = node.currentLength / node.length;

    if (node.type === 'plant' && node.cpX !== undefined && node.cpY !== undefined) {
      ctx.save();
      ctx.translate(node.x, node.y);
      ctx.rotate(angleRad + Math.PI / 2);

      const targetX = 0;
      const targetY = -node.currentLength;
      const cpX = node.cpX * t;
      const cpY = node.cpY * t;

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(cpX, cpY, targetX, targetY);
      ctx.strokeStyle = STEM_COLOR;
      ctx.lineWidth = node.width * (1 - (node.depth * 0.2));
      ctx.lineCap = 'round';
      ctx.stroke();

      // Draw asymmetrical leaves
      node.leafSettings?.forEach((leaf) => {
        const leafP = Math.max(0, Math.min(1, (t - leaf.delay) / 0.4));
        if (leafP > 0) {
          const leafTime = leaf.delay;
          const lx = (1 - leafTime) * (1 - leafTime) * 0 + 2 * (1 - leafTime) * leafTime * cpX + leafTime * leafTime * targetX;
          const ly = (1 - leafTime) * (1 - leafTime) * 0 + 2 * (1 - leafTime) * leafTime * cpX + leafTime * leafTime * targetY; // Fixed coordinate
          const leafAngle = leaf.side === 'left' ? -leaf.angle : leaf.angle;
          drawOrganicLeaf(lx, ly, leafAngle - 90, leaf.size * leafP);
        }
      });
      ctx.restore();
    } else {
      // Circuit drawing (Strict HV)
      const endX = node.x + Math.cos(angleRad) * node.currentLength;
      const endY = node.y + Math.sin(angleRad) * node.currentLength;

      ctx.beginPath();
      ctx.moveTo(node.x, node.y);
      ctx.lineTo(endX, endY);
      ctx.strokeStyle = CIRCUIT_COLOR;
      ctx.lineWidth = node.width;
      ctx.shadowColor = CIRCUIT_GLOW;
      ctx.shadowBlur = 4;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // GLOWING TIP (while extending)
      if (node.currentLength < node.length && node.currentLength > 0) {
        ctx.beginPath();
        ctx.arc(endX, endY, 3, 0, Math.PI * 2);
        ctx.fillStyle = CIRCUIT_COLOR;
        ctx.shadowColor = CIRCUIT_COLOR;
        ctx.shadowBlur = 15;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // Final Terminal Circle
      if (node.children.length === 0 && node.currentLength >= node.length) {
        ctx.beginPath();
        ctx.arc(endX, endY, 4, 0, Math.PI * 2);
        ctx.fillStyle = CIRCUIT_COLOR;
        ctx.shadowColor = CIRCUIT_COLOR;
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    node.children.forEach((c) => drawNode(c, time));
  }

  function drawOrganicLeaf(x: number, y: number, angle: number, size: number) {
    const angleRad = (angle * Math.PI) / 180;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angleRad);

    ctx.beginPath();
    ctx.moveTo(0, 0);
    // Asymmetrical teardrop
    ctx.bezierCurveTo(size * 1.4, -size * 0.9, size * 0.8, size * 1.1, 0, 0);

    const grad = ctx.createLinearGradient(0, 0, size, 0);
    grad.addColorStop(0, '#10C971');
    grad.addColorStop(1, '#00D4FF');
    ctx.fillStyle = grad;
    ctx.fill();

    // Bionic vein
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(size * 0.7, 0);
    ctx.strokeStyle = 'rgba(0, 212, 255, 0.4)';
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.restore();
  }

  function updateGrowth(nodes: TreeNode[], progress: number) {
    nodes.forEach((node) => {
      const baseDelay = node.depth * 0.12;
      const actualProgress = progress - baseDelay - node.delayFactor;
      const p = Math.max(0, Math.min(1, actualProgress * node.speedFactor / 0.2));
      node.currentLength = node.length * easeOutCubic(p);

      const angleRad = (node.angle * Math.PI) / 180;
      const endX = node.x + Math.cos(angleRad) * node.length;
      const endY = node.y + Math.sin(angleRad) * node.length;

      node.children.forEach((child) => {
        child.x = endX;
        child.y = endY;
        updateGrowth([child], progress);
      });
    });
  }

  function applyWind(nodes: TreeNode[], time: number, amp: number) {
    nodes.forEach((node) => {
      if (node.parent && node.type === 'plant') {
        const sway = Math.sin(time * 0.001 + node.y * 0.01) * amp;
        node.x = node.baseX + sway;
      }
      node.children.forEach((child) => applyWind([child], time, amp));
    });
  }

  generateStructures();

  let rafId: number;
  function animate(time: number) {
    ctx.clearRect(0, 0, w, h);
    const rootX = w / 2;
    const rootY = h / 2 + 250;

    [...plantNodes, ...circuitNodes].forEach((n) => {
      if (!n.parent) { n.x = rootX; n.y = rootY; n.baseX = rootX; }
    });

    updateGrowth(plantNodes, growthProgress);
    updateGrowth(circuitNodes, growthProgress);
    applyWind(plantNodes, time, growthProgress * 2);

    plantNodes.forEach((n) => drawNode(n, time));
    circuitNodes.forEach((n) => drawNode(n, time));

    // Core
    ctx.beginPath();
    ctx.arc(rootX, rootY, 10, 0, Math.PI * 2);
    ctx.fillStyle = '#FFFFFF';
    ctx.shadowBlur = 20;
    ctx.shadowColor = CIRCUIT_COLOR;
    ctx.fill();

    rafId = requestAnimationFrame(animate);
  }
  rafId = requestAnimationFrame(animate);

  const st = ScrollTrigger.create({
    trigger: 'body',
    start: 'top top',
    end: '25% top',
    scrub: 1,
    onUpdate: (self) => {
      growthProgress = self.progress;
    },
  });

  function onResize() {
    resize();
    generateStructures();
  }
  window.addEventListener('resize', onResize);

  return () => {
    cancelAnimationFrame(rafId);
    st.kill();
    window.removeEventListener('resize', onResize);
  };
}


/* ============================================================
   HERO COMPONENT
   ============================================================ */

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const titleLine1Ref = useRef<HTMLHeadingElement>(null);
  const titleLine2Ref = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);
  const chevronRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const cleanup = createLeafCanvas(canvasRef.current);
    return cleanup;
  }, []);

  useEffect(() => {
    const tl = gsap.timeline();

    tl.to(titleLine1Ref.current, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power3.out',
      delay: 0.5,
    })
      .to(
        titleLine2Ref.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
        },
        '-=0.6'
      )
      .to(
        subtitleRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power3.out',
        },
        '-=0.4'
      )
      .to(
        ctaRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power3.out',
        },
        '-=0.3'
      )
      .to(
        chevronRef.current,
        {
          opacity: 1,
          duration: 0.6,
        },
        '-=0.2'
      );
  }, []);

  const handleCtaClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const target = document.querySelector('#paw-kingdom');
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="inicio"
      className="relative w-full min-h-[100dvh] overflow-hidden bg-deep-navy"
    >
      {/* Canvas Background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />

      {/* Content Overlay */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6">
        <h1 className="text-center pointer-events-none">
          <span
            ref={titleLine1Ref}
            className="block font-display font-black uppercase opacity-0 translate-y-8"
            style={{
              fontSize: 'clamp(3rem, 8vw, 6rem)',
              lineHeight: 1.0,
              letterSpacing: '-0.02em',
              color: '#F8F9FA',
            }}
          >
            TECNOLOGIA QUE
          </span>
          <span
            ref={titleLine2Ref}
            className="block font-display font-black uppercase opacity-0 translate-y-8"
            style={{
              fontSize: 'clamp(3rem, 8vw, 6rem)',
              lineHeight: 1.0,
              letterSpacing: '-0.02em',
              color: '#00D4FF',
            }}
          >
            CULTIVA VIDA
          </span>
        </h1>

        <p
          ref={subtitleRef}
          className="mt-6 text-center max-w-[560px] opacity-0 translate-y-5"
          style={{
            fontSize: '1.125rem',
            lineHeight: 1.6,
            color: '#A0AEC0',
          }}
        >
          Zoenetic diseña productos digitales que fusionan tecnologia y
          bienestar para crear experiencias que mejoran tu dia a dia.
        </p>

        <a
          ref={ctaRef}
          href="#paw-kingdom"
          onClick={handleCtaClick}
          className="mt-8 inline-block opacity-0 translate-y-5 font-display font-semibold text-sm tracking-[0.05em] px-8 py-4 rounded-lg transition-all duration-300 hover:-translate-y-0.5"
          style={{
            backgroundColor: '#00D4FF',
            color: '#12161A',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#33DDFF';
            e.currentTarget.style.boxShadow =
              '0 0 20px rgba(0, 212, 255, 0.4), 0 0 60px rgba(0, 212, 255, 0.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#00D4FF';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          Descubre Paw Kingdom
        </a>

        {/* Scroll Indicator */}
        <div
          ref={chevronRef}
          className="absolute bottom-8 opacity-0 animate-bounce-subtle"
        >
          <ChevronDown size={24} color="#6B7A8D" />
        </div>
      </div>
    </section>
  );
}

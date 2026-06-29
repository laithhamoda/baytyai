'use client';

import { useEffect, useRef } from 'react';

import { usePrefersReducedMotion } from './use-reduced-motion';

/**
 * GPU-light, dependency-free animated background on a 2D canvas.
 * A field of slowly drifting nodes connected by faint lines; the whole field
 * eases toward the cursor for a subtle parallax. Pauses when offscreen or when
 * the tab is hidden, and renders a static gradient under prefers-reduced-motion.
 */
export default function CursorField({ className = '' }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || reduced) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf = 0;
    let running = true;
    let width = 0;
    let height = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const target = { x: 0.5, y: 0.5 };
    const eased = { x: 0.5, y: 0.5 };

    type Node = { x: number; y: number; vx: number; vy: number };
    let nodes: Node[] = [];

    function seed() {
      // density scales with area but is capped for perf
      const count = Math.min(70, Math.floor((width * height) / 26000));
      nodes = Array.from({ length: count }, (_, i) => ({
        x: ((i * 97) % 100) / 100,
        y: ((i * 53) % 100) / 100,
        vx: (((i * 31) % 7) - 3) * 0.00012,
        vy: (((i * 17) % 7) - 3) * 0.00012,
      }));
    }

    function resize() {
      const rect = canvas!.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas!.width = Math.floor(width * dpr);
      canvas!.height = Math.floor(height * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    }

    function frame() {
      if (!running) return;
      eased.x += (target.x - eased.x) * 0.04;
      eased.y += (target.y - eased.y) * 0.04;
      const shiftX = (eased.x - 0.5) * 40;
      const shiftY = (eased.y - 0.5) * 40;

      ctx!.clearRect(0, 0, width, height);

      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > 1) n.vx *= -1;
        if (n.y < 0 || n.y > 1) n.vy *= -1;
      }

      // connections
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        const ax = a.x * width + shiftX;
        const ay = a.y * height + shiftY;
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const bx = b.x * width + shiftX;
          const by = b.y * height + shiftY;
          const dx = ax - bx;
          const dy = ay - by;
          const dist = Math.hypot(dx, dy);
          if (dist < 130) {
            const o = (1 - dist / 130) * 0.18;
            ctx!.strokeStyle = `rgba(197,165,114,${o})`; // signal-500
            ctx!.lineWidth = 1;
            ctx!.beginPath();
            ctx!.moveTo(ax, ay);
            ctx!.lineTo(bx, by);
            ctx!.stroke();
          }
        }
      }

      // nodes
      for (const n of nodes) {
        const x = n.x * width + shiftX;
        const y = n.y * height + shiftY;
        ctx!.fillStyle = 'rgba(230,233,238,0.45)'; // ink-100
        ctx!.beginPath();
        ctx!.arc(x, y, 1.4, 0, Math.PI * 2);
        ctx!.fill();
      }

      raf = requestAnimationFrame(frame);
    }

    function onPointer(e: PointerEvent) {
      const rect = canvas!.getBoundingClientRect();
      target.x = (e.clientX - rect.left) / rect.width;
      target.y = (e.clientY - rect.top) / rect.height;
    }

    function onVisibility() {
      running = !document.hidden;
      if (running) {
        raf = requestAnimationFrame(frame);
      } else {
        cancelAnimationFrame(raf);
      }
    }

    resize();
    raf = requestAnimationFrame(frame);
    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', onPointer, { passive: true });
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onPointer);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [reduced]);

  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      aria-hidden="true"
    >
      {/* static gradient base — also the reduced-motion fallback */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(60% 50% at 50% 0%, rgba(197,165,114,0.10), transparent 70%), radial-gradient(40% 40% at 80% 20%, rgba(197,165,114,0.06), transparent 70%)',
        }}
      />
      {!reduced && <canvas ref={canvasRef} className="absolute inset-0 size-full" />}
    </div>
  );
}

"use client";

import { useState, useEffect, useRef, ReactNode } from "react";

// ─── SCROLL REVEAL HOOK ───
export function useReveal(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) { setVisible(true); obs.disconnect(); }
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

// ─── GLOW BUTTON ───
export function GlowBtn({
  children, onClick, ghost = false, disabled = false, className = "",
}: {
  children: ReactNode; onClick?: () => void; ghost?: boolean; disabled?: boolean; className?: string;
}) {
  const [h, setH] = useState(false);
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      className={`relative font-display text-xs font-bold uppercase tracking-[0.18em] transition-all duration-400 overflow-hidden ${className}`}
      style={{
        padding: ghost ? "13px 28px" : "14px 32px",
        background: ghost ? "transparent" : h ? "#D4A87A" : "#C49767",
        color: ghost ? (h ? "#C49767" : "#90714F") : "#050810",
        border: ghost ? `1px solid ${h ? "#C4976780" : "#90714F50"}` : "none",
        borderRadius: 1,
        cursor: disabled ? "not-allowed" : "pointer",
        boxShadow: h && !ghost ? "0 0 40px rgba(196,151,103,0.2), 0 4px 20px rgba(196,151,103,0.1)" : "none",
        opacity: disabled ? 0.4 : 1,
      }}
    >
      {h && !ghost && (
        <div className="absolute top-0 -left-full w-[200%] h-full animate-marquee pointer-events-none"
          style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)" }} />
      )}
      <span className="relative z-10">{children}</span>
    </button>
  );
}

// ─── REVEAL WRAPPER ───
export function RevealDiv({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  const { ref, visible } = useReveal(0.1);
  return (
    <div ref={ref} className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(28px)",
        transition: `all 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
      }}>
      {children}
    </div>
  );
}

// ─── SECTION HEADER ───
export function SectionHead({ title, sub, align = "center" }: { title: string; sub?: string; align?: "center" | "left" }) {
  const { ref, visible } = useReveal();
  return (
    <div ref={ref} className="mb-14" style={{ textAlign: align, opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(20px)", transition: "all 0.8s ease" }}>
      <div className="font-mono text-[11px] text-cs-gold-dim uppercase tracking-[0.25em] mb-3">
        {"// "}{sub || title}
      </div>
      <h2 className="font-display text-cs-white uppercase tracking-wide leading-tight" style={{ fontSize: "clamp(30px, 5vw, 48px)", fontWeight: 700 }}>
        {title}
      </h2>
      <div className="h-px w-10 bg-cs-gold opacity-60" style={{ margin: align === "center" ? "20px auto 0" : "20px 0 0" }} />
    </div>
  );
}

// ─── SECTION WRAPPER ───
export function Sect({ children, id, className = "" }: { children: ReactNode; id?: string; className?: string }) {
  return (
    <section id={id} className={`py-24 px-6 max-w-[1200px] mx-auto relative ${className}`}>
      {children}
    </section>
  );
}

// ─── GLITCH TEXT ───
export function GlitchText({ children }: { children: ReactNode }) {
  const [glitch, setGlitch] = useState(false);
  useEffect(() => {
    const iv = setInterval(() => { setGlitch(true); setTimeout(() => setGlitch(false), 200); }, 4000 + Math.random() * 3000);
    return () => clearInterval(iv);
  }, []);
  return (
    <span className="relative inline-block">
      {children}
      {glitch && (
        <>
          <span className="absolute top-0 left-[2px] text-cs-gold opacity-70" style={{ animation: "glitchClip 0.2s steps(1) infinite" }} aria-hidden="true">{children}</span>
          <span className="absolute top-0 -left-[2px] text-cs-gold-dim opacity-50" style={{ animation: "glitchClip 0.2s steps(1) infinite reverse" }} aria-hidden="true">{children}</span>
        </>
      )}
    </span>
  );
}

// ─── SCRAMBLE TEXT ───
export function ScrambleText({ text }: { text: string }) {
  const [display, setDisplay] = useState(text);
  const chars = "!<>-_\\/[]{}—=+*^?#アイウエオカキ";
  const scramble = () => {
    let iter = 0;
    const iv = setInterval(() => {
      setDisplay(text.split("").map((c, i) => (i < iter ? text[i] : chars[Math.floor(Math.random() * chars.length)])).join(""));
      if (++iter > text.length) { clearInterval(iv); setDisplay(text); }
    }, 30);
  };
  return <span onMouseEnter={scramble} className="cursor-default">{display}</span>;
}

// ─── WAVE VISUALIZER ───
export function WaveVisualizer({ bars = 40, height = 60, className = "" }: { bars?: number; height?: number; className?: string }) {
  return (
    <div className={`flex items-end gap-[2px] opacity-25 ${className}`} style={{ height }}>
      {Array.from({ length: bars }, (_, i) => (
        <div key={i} className="rounded-sm bg-cs-gold" style={{
          width: 2,
          height: `${20 + Math.random() * 80}%`,
          animation: `waveBar ${0.8 + Math.random() * 0.8}s ease-in-out ${i * 0.03}s infinite alternate`,
        }} />
      ))}
    </div>
  );
}

// ─── MARQUEE ───
export function MarqueeBand({ items, speed = 30 }: { items: string[]; speed?: number }) {
  return (
    <div className="overflow-hidden whitespace-nowrap border-y border-cs-line py-[18px]">
      <div className="inline-block" style={{ animation: `marquee ${speed}s linear infinite` }}>
        {[...items, ...items].map((t, i) => (
          <span key={i} className="font-display text-sm text-cs-dim uppercase tracking-[0.2em] mr-[60px]">
            {t} <span className="text-cs-gold-dim mx-5">◆</span>
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── PARTICLES CANVAS ───
export function Particles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let animId: number;
    interface P { x: number; y: number; vx: number; vy: number; size: number; alpha: number; }
    const particles: P[] = [];
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);
    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.width, y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.2, vy: (Math.random() - 0.5) * 0.2,
        size: Math.random() * 1.2 + 0.3, alpha: Math.random() * 0.25 + 0.03,
      });
    }
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = canvas.width; if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height; if (p.y > canvas.height) p.y = 0;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(196,151,103,${p.alpha})`; ctx.fill();
      });
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            ctx.beginPath(); ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(196,151,103,${0.03 * (1 - dist / 100)})`;
            ctx.lineWidth = 0.5; ctx.stroke();
          }
        }
      }
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none" />;
}

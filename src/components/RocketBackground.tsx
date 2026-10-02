"use client";

import { useEffect, useRef } from "react";
import { LOGO_TARGET_ID, ROCKET_IMPACT } from "@/lib/rocketEvents";

const BASE_SPEED = 120; // px per second while wandering
const TURN_RATE = 1.3; // radians per second while wandering, so turns stay wide and smooth
const ATTACK_TURN_RATE = 5;
const WANDER_MS = 4500;
const ATTACK_TIMEOUT_MS = 6000;
const HIT_RADIUS = 34;
const TRAIL_MS = 1400;

type Phase = "wander" | "attack" | "boom" | "done";
type Point = { x: number; y: number; t: number };
type Particle = {
  kind: "spark" | "debris" | "smoke";
  x: number;
  y: number;
  vx: number;
  vy: number;
  age: number;
  life: number; // ms
  size: number;
  color: string;
  rot: number;
  vr: number;
};

const SPARK_COLORS = ["#ff9433", "#ffd166", "#6dffd2", "#ffffff", "#ff9433"];
const DEBRIS_COLORS = ["#faf7f2", "#ff9433", "#0f172a"];
const rand = (min: number, max: number) => min + Math.random() * (max - min);
const pick = <T,>(items: T[]) => items[Math.floor(Math.random() * items.length)];

/**
 * A rocket that wanders behind the landing page, then homes in on the logo's spot, explodes,
 * and hands over to <LogoReveal /> (via window events) so the logo can pop in.
 * Decorative only.
 */
export function RocketBackground() {
  const overlayRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rocketRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const overlay = overlayRef.current;
    const canvas = canvasRef.current;
    const rocket = rocketRef.current;
    const ctx = canvas?.getContext("2d");
    if (!overlay || !canvas || !rocket || !ctx) return;

    // No flying or explosions: the logo simply shows (handled in LogoReveal).
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      rocket.style.display = "none";
      return;
    }

    let w = 0;
    let h = 0;
    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    // On wide screens the logo owns the right side, so free flight keeps to the left half.
    const flightWidth = () => (w >= 1024 ? w * 0.5 : w);
    const pickTarget = () => ({
      x: -60 + Math.random() * (flightWidth() + 60),
      y: -60 + Math.random() * (h + 120),
    });
    const logoCenter = () => {
      const el = document.getElementById(LOGO_TARGET_ID);
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    };

    let phase: Phase = "wander";
    let phaseStart = performance.now();
    const wanderMs = WANDER_MS;
    let x = flightWidth() * 0.15;
    let y = h * 0.7;
    let heading = -Math.PI / 4; // 0 = right, negative = up
    let speed = BASE_SPEED;
    let target = pickTarget();
    const trail: Point[] = [];
    let particles: Particle[] = [];
    let blast: { x: number; y: number; t: number } | null = null;
    let impactTimer: ReturnType<typeof setTimeout> | undefined;
    let last = phaseStart;
    let raf = 0;

    const placeRocket = () => {
      // The rocket art points up, so add 90 degrees to face the direction of travel.
      rocket.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%) rotate(${heading + Math.PI / 2}rad)`;
    };

    const explode = (cx: number, cy: number, now: number) => {
      phase = "boom";
      phaseStart = now;
      blast = { x: cx, y: cy, t: now };
      rocket.style.opacity = "0";

      const make = (kind: Particle["kind"], speedMin: number, speedMax: number, lifeMin: number, lifeMax: number, sizeMin: number, sizeMax: number, colors: string[]) => {
        const angle = rand(0, Math.PI * 2);
        const v = rand(speedMin, speedMax);
        particles.push({
          kind,
          x: cx,
          y: cy,
          vx: Math.cos(angle) * v,
          vy: Math.sin(angle) * v,
          age: 0,
          life: rand(lifeMin, lifeMax),
          size: rand(sizeMin, sizeMax),
          color: pick(colors),
          rot: rand(0, Math.PI * 2),
          vr: rand(-9, 9),
        });
      };
      for (let i = 0; i < 9; i++) make("smoke", 20, 90, 900, 1500, 14, 26, ["#64748b"]);
      for (let i = 0; i < 46; i++) make("spark", 140, 460, 500, 1100, 2, 6, SPARK_COLORS);
      for (let i = 0; i < 10; i++) make("debris", 80, 280, 900, 1400, 6, 11, DEBRIS_COLORS);

      // Let the flash peak a moment before the logo pops out of it.
      impactTimer = setTimeout(() => window.dispatchEvent(new Event(ROCKET_IMPACT)), 140);
    };

    const drawTrail = (now: number) => {
      ctx.lineCap = "round";
      for (let i = 1; i < trail.length; i++) {
        const age = (now - trail[i].t) / TRAIL_MS;
        ctx.strokeStyle = `rgba(255, 148, 51, ${0.55 * (1 - age)})`;
        ctx.lineWidth = 7 * (1 - age) + 1;
        ctx.beginPath();
        ctx.moveTo(trail[i - 1].x, trail[i - 1].y);
        ctx.lineTo(trail[i].x, trail[i].y);
        ctx.stroke();
      }
    };

    const drawExplosion = (now: number, dt: number) => {
      if (blast) {
        const flashT = (now - blast.t) / 380;
        if (flashT < 1) {
          const a = 1 - flashT;
          const radius = 30 + 130 * flashT;
          const g = ctx.createRadialGradient(blast.x, blast.y, 0, blast.x, blast.y, radius);
          g.addColorStop(0, `rgba(255, 255, 255, ${a})`);
          g.addColorStop(0.4, `rgba(255, 209, 102, ${a * 0.8})`);
          g.addColorStop(1, "rgba(255, 148, 51, 0)");
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(blast.x, blast.y, radius, 0, Math.PI * 2);
          ctx.fill();
        }
        // Two shockwave rings, the second (mint) a beat behind
        for (const ring of [
          { delay: 0, max: 180, color: "255, 148, 51" },
          { delay: 130, max: 130, color: "109, 255, 210" },
        ]) {
          const t = (now - blast.t - ring.delay) / 650;
          if (t <= 0 || t >= 1) continue;
          const eased = 1 - Math.pow(1 - t, 3);
          ctx.strokeStyle = `rgba(${ring.color}, ${0.85 * (1 - t)})`;
          ctx.lineWidth = 8 * (1 - t) + 1;
          ctx.beginPath();
          ctx.arc(blast.x, blast.y, 12 + ring.max * eased, 0, Math.PI * 2);
          ctx.stroke();
        }
      }

      const drag = Math.exp(-2.2 * dt);
      particles = particles.filter((p) => (p.age += dt * 1000) < p.life);
      for (const p of particles) {
        p.vx *= drag;
        p.vy = p.vy * drag + (p.kind === "smoke" ? -20 : 180) * dt;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.rot += p.vr * dt;
        const k = p.age / p.life;
        ctx.globalAlpha = 1 - k;
        if (p.kind === "smoke") {
          ctx.fillStyle = `rgba(100, 116, 139, ${0.35 * (1 - k)})`;
          ctx.globalAlpha = 1;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * (1 + k * 1.6), 0, Math.PI * 2);
          ctx.fill();
        } else if (p.kind === "spark") {
          ctx.strokeStyle = p.color;
          ctx.lineWidth = p.size * (1 - k * 0.5);
          ctx.lineCap = "round";
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x - p.vx * 0.035, p.y - p.vy * 0.035);
          ctx.stroke();
        } else {
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rot);
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.moveTo(0, -p.size);
          ctx.lineTo(p.size * 0.8, p.size * 0.7);
          ctx.lineTo(-p.size * 0.8, p.size * 0.7);
          ctx.closePath();
          ctx.fill();
          ctx.restore();
        }
      }
      ctx.globalAlpha = 1;
    };

    const frame = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      if (phase === "wander" || phase === "attack") {
        const logo = logoCenter();
        if (phase === "wander" && logo && now - phaseStart > wanderMs) {
          phase = "attack";
          phaseStart = now;
          overlay.style.zIndex = "20"; // fly in front of the page for the finale
        }

        let turnRate = TURN_RATE;
        let desiredSpeed = BASE_SPEED;
        let goal = target;
        if (phase === "attack" && logo) {
          goal = logo;
          turnRate = ATTACK_TURN_RATE;
          // Slow down as it closes in so it can always make the final turn
          desiredSpeed = Math.max(140, Math.min(340, Math.hypot(logo.x - x, logo.y - y) * 1.6));
        } else if (Math.hypot(goal.x - x, goal.y - y) < 140) {
          target = pickTarget();
        }
        speed += (desiredSpeed - speed) * Math.min(1, dt * 3);

        let diff = Math.atan2(goal.y - y, goal.x - x) - heading;
        diff = Math.atan2(Math.sin(diff), Math.cos(diff));
        heading += Math.max(-turnRate * dt, Math.min(turnRate * dt, diff));
        x += Math.cos(heading) * speed * dt;
        y += Math.sin(heading) * speed * dt;
        placeRocket();

        trail.push({ x: x - Math.cos(heading) * 22, y: y - Math.sin(heading) * 22, t: now });

        if (phase === "attack" && logo) {
          if (Math.hypot(logo.x - x, logo.y - y) < HIT_RADIUS || now - phaseStart > ATTACK_TIMEOUT_MS) {
            explode(logo.x, logo.y, now);
          }
        }
      }
      while (trail.length && now - trail[0].t > TRAIL_MS) trail.shift();

      ctx.clearRect(0, 0, w, h);
      drawTrail(now);
      drawExplosion(now, dt);

      if (phase === "boom" && particles.length === 0 && now - phaseStart > 800) {
        phase = "done";
        ctx.clearRect(0, 0, w, h);
        return; // nothing left to animate: stop the loop until a replay
      }
      raf = requestAnimationFrame(frame);
    };

    placeRocket();
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(impactTimer);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div ref={overlayRef} aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      <div ref={rocketRef} className="absolute left-0 top-0 w-12 h-12 will-change-transform">
        <svg viewBox="0 0 64 64" className="w-full h-full" fill="none">
          <g className="rocket-flame">
            <path d="M27 46 C24 54 30 60 32 62 C34 60 40 54 37 46 Z" fill="#ff9433" />
            <path d="M29.5 46 C28 51 31 55 32 57 C33 55 36 51 34.5 46 Z" fill="#fde68a" />
          </g>
          <path d="M22 36 L12 48 L24 44 Z" fill="#ff9433" stroke="#0f172a" strokeWidth="2" strokeLinejoin="round" />
          <path d="M42 36 L52 48 L40 44 Z" fill="#ff9433" stroke="#0f172a" strokeWidth="2" strokeLinejoin="round" />
          <path d="M32 4 C40 12 43 24 41 44 L23 44 C21 24 24 12 32 4 Z" fill="#faf7f2" stroke="#0f172a" strokeWidth="2" strokeLinejoin="round" />
          <path d="M32 4 C36 8 38.5 13 39.6 18 L24.4 18 C25.5 13 28 8 32 4 Z" fill="#ff9433" stroke="#0f172a" strokeWidth="2" strokeLinejoin="round" />
          <circle cx="32" cy="28" r="5" fill="#6dffd2" stroke="#0f172a" strokeWidth="2" />
        </svg>
      </div>
    </div>
  );
}

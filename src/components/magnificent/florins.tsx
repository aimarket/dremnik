"use client";

import { useEffect, useRef } from "react";

// ------------------------------------------------
// projects/dremnik/src/components/magnificent/florins.tsx
//
// Gold florins (the coin that made the Medici) raining down a full-screen
// canvas. Anything can start a shower with rainFlorins(); the canvas listens.
// The loop only runs while coins are on screen.
// ------------------------------------------------

const EVENT = "magnificent:florins";

export function rainFlorins(count = 120) {
  window.dispatchEvent(new CustomEvent(EVENT, { detail: count }));
}

type Coin = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  spin: number;
  phase: number;
};

function drawCoin(c: CanvasRenderingContext2D, k: Coin) {
  // A spinning coin is a circle squashed horizontally by |cos(angle)|.
  const face = Math.max(Math.abs(Math.cos(k.phase)), 0.08);
  c.save();
  c.translate(k.x, k.y);
  c.scale(face, 1);

  const g = c.createRadialGradient(-k.r * 0.3, -k.r * 0.3, k.r * 0.1, 0, 0, k.r);
  g.addColorStop(0, "#fff4c2");
  g.addColorStop(0.45, "#f2c94c");
  g.addColorStop(1, "#9a6b12");
  c.fillStyle = g;
  c.beginPath();
  c.arc(0, 0, k.r, 0, Math.PI * 2);
  c.fill();
  c.lineWidth = 1.5;
  c.strokeStyle = "#7a5410";
  c.stroke();

  // The Florentine lily, struck on the face.
  c.fillStyle = "#8a5d0e";
  c.font = `${k.r * 1.1}px serif`;
  c.textAlign = "center";
  c.textBaseline = "middle";
  c.fillText("⚜", 0, 1);
  c.restore();
}

export function FlorinRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const c = canvas?.getContext("2d");
    if (!canvas || !c) return;

    let coins: Coin[] = [];
    let raf = 0;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = innerWidth * dpr;
      canvas.height = innerHeight * dpr;
      c.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const frame = () => {
      c.clearRect(0, 0, innerWidth, innerHeight);
      for (const k of coins) {
        k.vy += 0.22;
        k.x += k.vx;
        k.y += k.vy;
        k.phase += k.spin;
        drawCoin(c, k);
      }
      coins = coins.filter((k) => k.y < innerHeight + 40);
      raf = coins.length ? requestAnimationFrame(frame) : 0;
    };

    const onRain = (e: Event) => {
      const count = (e as CustomEvent<number>).detail ?? 120;
      for (let i = 0; i < count; i++) {
        coins.push({
          x: Math.random() * innerWidth,
          y: -20 - Math.random() * innerHeight * 0.8,
          vx: (Math.random() - 0.5) * 1.5,
          vy: Math.random() * 2,
          r: 9 + Math.random() * 9,
          spin: 0.05 + Math.random() * 0.15,
          phase: Math.random() * Math.PI,
        });
      }
      if (!raf) raf = requestAnimationFrame(frame);
    };

    resize();
    addEventListener("resize", resize);
    addEventListener(EVENT, onRain);
    return () => {
      cancelAnimationFrame(raf);
      removeEventListener("resize", resize);
      removeEventListener(EVENT, onRain);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[90] size-full"
    />
  );
}

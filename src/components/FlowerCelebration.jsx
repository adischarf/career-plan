// FlowerCelebration.jsx
// Milestone animations: lilac (month), peony (track), bougainvillea (phase).
// Each flower type has a distinct look with proper petal shapes.
// Confetti petals rain down in the background.

import React, { useEffect, useState, useRef } from 'react';

// ── Flower definitions ────────────────────────────────────────────────────────
const FLOWERS = {
  lilac: {
    petals:      6,
    petalColor:  '#A895CC',
    petalColor2: '#C8B8E8',
    centerColor: '#F8EFD8',
    centerDot:   '#7A64B0',
    stemColor:   '#5A9E6A',
    leafColor:   '#5A9E6A',
    confettiColors: ['#A895CC','#C8B8E8','#EAE4F7','#7A64B0'],
    count: 1,
    label: 'Month Complete',
  },
  peony: {
    petals:      10,
    petalColor:  '#E0889E',
    petalColor2: '#F4B8C8',
    centerColor: '#FFF0F4',
    centerDot:   '#C04870',
    stemColor:   '#5A9E6A',
    leafColor:   '#5A9E6A',
    confettiColors: ['#E0889E','#F4B8C8','#FDEDF1','#C04870'],
    count: 2,
    label: 'Track Complete',
  },
  bougainvillea: {
    petals:      5,
    petalColor:  '#D04878',
    petalColor2: '#F07098',
    centerColor: '#FFF0F4',
    centerDot:   '#A02858',
    stemColor:   '#3A8E9E',
    leafColor:   '#3A8E9E',
    confettiColors: ['#D04878','#F07098','#FDDDE8','#A02858','#F5A0B8'],
    count: 3,
    label: 'Phase Complete',
  },
};

// ── SVG flower: proper petal shapes using cubic bezier paths ─────────────────
function Flower({ type, x, y, size = 1, delay = 0, visible }) {
  const f = FLOWERS[type];
  const r = 38 * size;        // petal orbit radius
  const pw = 20 * size;       // petal width
  const ph = 32 * size;       // petal height
  const cr = 12 * size;       // center radius
  const stemLen = 60 * size;

  const petalAngles = Array.from({ length: f.petals }, (_, i) =>
    (i * 360) / f.petals - 90
  );

  return (
    <g
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'scale(1)' : 'scale(0)',
        transformOrigin: `${x}px ${y}px`,
        transition: `opacity 0.5s ease ${delay}ms, transform 0.6s cubic-bezier(0.34,1.56,0.64,1) ${delay}ms`,
      }}
    >
      {/* Stem */}
      <path
        d={`M ${x} ${y + cr} C ${x} ${y + cr + 20 * size}, ${x - 5 * size} ${y + cr + 40 * size}, ${x - 3 * size} ${y + stemLen + cr}`}
        fill="none" stroke={f.stemColor} strokeWidth={3 * size} strokeLinecap="round"
        style={{ opacity: visible ? 0.8 : 0, transition: `opacity 0.4s ease ${delay + 200}ms` }}
      />
      {/* Leaves */}
      {[1, -1].map((side, li) => {
        const lx = x + side * 14 * size;
        const ly = y + cr + 35 * size;
        return (
          <ellipse key={li} cx={lx} cy={ly} rx={10 * size} ry={16 * size}
            fill={f.leafColor} opacity={0.75}
            transform={`rotate(${side * 35}, ${lx}, ${ly})`}
            style={{ opacity: visible ? 0.75 : 0, transition: `opacity 0.4s ease ${delay + 250 + li * 50}ms` }}
          />
        );
      })}
      {/* Petals — using path for organic teardrop shape */}
      {petalAngles.map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const px = x + r * Math.cos(rad);
        const py = y + r * Math.sin(rad);
        const isOuter = type === 'peony' && i < 5;
        const pScale = isOuter ? 1 : 0.78;
        const pDelay = delay + 100 + i * 55;
        return (
          <g key={i} transform={`translate(${px},${py}) rotate(${angle + 90})`}
            style={{
              opacity: visible ? 1 : 0,
              transform: visible
                ? `translate(${px}px,${py}px) rotate(${angle + 90}deg) scale(1)`
                : `translate(${px}px,${py}px) rotate(${angle + 90}deg) scale(0.1)`,
              transformOrigin: `${px}px ${py}px`,
              transition: `opacity 0.4s ease ${pDelay}ms, transform 0.55s cubic-bezier(0.34,1.56,0.64,1) ${pDelay}ms`,
            }}
          >
            {/* Main petal — teardrop bezier */}
            <path
              d={`M 0 0
                  C ${-pw * 0.5 * pScale} ${-ph * 0.2 * pScale},
                    ${-pw * 0.55 * pScale} ${-ph * 0.75 * pScale},
                    0 ${-ph * pScale}
                  C ${pw * 0.55 * pScale} ${-ph * 0.75 * pScale},
                    ${pw * 0.5 * pScale} ${-ph * 0.2 * pScale},
                    0 0 Z`}
              fill={i % 2 === 0 ? f.petalColor : f.petalColor2}
              opacity={0.92}
            />
            {/* Inner highlight streak */}
            <path
              d={`M 0 ${-ph * 0.05 * pScale} C 0 ${-ph * 0.3 * pScale}, 0 ${-ph * 0.5 * pScale}, 0 ${-ph * 0.75 * pScale}`}
              fill="none" stroke="white" strokeWidth={1.5 * size * pScale} opacity={0.35} strokeLinecap="round"
            />
          </g>
        );
      })}
      {/* Center circle */}
      <circle cx={x} cy={y} r={cr}
        fill={f.centerColor} stroke={f.centerDot} strokeWidth={1.5 * size}
        style={{ opacity: visible ? 1 : 0, transition: `opacity 0.3s ease ${delay + 300}ms` }}
      />
      {/* Center stamens */}
      {Array.from({ length: 7 }, (_, i) => {
        const a = (i * 360 / 7) * Math.PI / 180;
        const sr = cr * 0.55;
        return (
          <circle key={i} cx={x + sr * Math.cos(a)} cy={y + sr * Math.sin(a)}
            r={2.2 * size} fill={f.centerDot} opacity={0.7}
            style={{ opacity: visible ? 0.7 : 0, transition: `opacity 0.3s ease ${delay + 350 + i * 25}ms` }}
          />
        );
      })}
      <circle cx={x} cy={y} r={4 * size} fill={f.centerDot}
        style={{ opacity: visible ? 1 : 0, transition: `opacity 0.3s ease ${delay + 380}ms` }}
      />
    </g>
  );
}

// ── Canvas confetti — petals fall from top ────────────────────────────────────
function ConfettiCanvas({ colors, active }) {
  const canvasRef = useRef(null);
  const animRef   = useRef(null);
  const petalsRef = useRef([]);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;

    // Spawn petals
    petalsRef.current = Array.from({ length: 38 }, (_, i) => ({
      x:       Math.random() * canvas.width,
      y:       -20 - Math.random() * 200,
      vx:      (Math.random() - 0.5) * 1.8,
      vy:      1.4 + Math.random() * 2.2,
      rot:     Math.random() * 360,
      vrot:    (Math.random() - 0.5) * 4,
      w:       8 + Math.random() * 10,
      h:       12 + Math.random() * 14,
      color:   colors[Math.floor(Math.random() * colors.length)],
      opacity: 0.7 + Math.random() * 0.3,
      delay:   i * 80,
      born:    false,
    }));

    let start = null;
    function draw(ts) {
      if (!start) start = ts;
      const elapsed = ts - start;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      petalsRef.current.forEach(p => {
        if (elapsed < p.delay) return;
        if (!p.born) p.born = true;

        p.x   += p.vx;
        p.y   += p.vy;
        p.rot += p.vrot;
        // gentle sway
        p.vx += Math.sin(elapsed * 0.001 + p.y * 0.01) * 0.04;

        ctx.save();
        ctx.globalAlpha = p.opacity * Math.max(0, 1 - (p.y - canvas.height * 0.7) / (canvas.height * 0.3));
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rot * Math.PI) / 180);
        ctx.fillStyle = p.color;
        // Draw teardrop petal
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(-p.w * 0.5, -p.h * 0.2, -p.w * 0.55, -p.h * 0.75, 0, -p.h);
        ctx.bezierCurveTo(p.w * 0.55, -p.h * 0.75, p.w * 0.5, -p.h * 0.2, 0, 0);
        ctx.fill();
        ctx.restore();
      });

      // Remove petals that fell off screen
      petalsRef.current = petalsRef.current.filter(p => p.y < canvas.height + 40);

      if (petalsRef.current.length > 0) {
        animRef.current = requestAnimationFrame(draw);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }

    animRef.current = requestAnimationFrame(draw);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [active, colors]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute', inset: 0,
        pointerEvents: 'none', zIndex: 1,
      }}
    />
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function FlowerCelebration({ type, text, message, migraineMode, onClose }) {
  const [visible, setVisible] = useState(false);
  const f = FLOWERS[type] || FLOWERS.lilac;

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 60);
    return () => clearTimeout(t);
  }, []);

  // ── Migraine mode: iPhone-tinted text card, no animation ──────────────────
  if (migraineMode) {
    return (
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0,
          background: 'rgba(80,30,10,0.55)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000, padding: '24px', cursor: 'pointer',
        }}
      >
        <div onClick={e => e.stopPropagation()} style={{
          background: 'var(--cream)', borderRadius: '28px',
          padding: '48px 40px', maxWidth: '360px', width: '100%',
          textAlign: 'center', boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
        }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>🌸</div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', color: 'var(--ink)', marginBottom: '12px' }}>
            {text}
          </h2>
          {message && (
            <p style={{ color: 'var(--ink-light)', lineHeight: 1.7, marginBottom: '12px', fontSize: '0.9375rem' }}>
              {message}
            </p>
          )}
          <p style={{ fontSize: '0.72rem', color: 'var(--bark)', marginBottom: '24px', fontStyle: 'italic' }}>
            (Animation off in migraine mode)
          </p>
          <button className="btn-primary" onClick={onClose}>Keep going →</button>
        </div>
      </div>
    );
  }

  // ── Normal mode ────────────────────────────────────────────────────────────
  const count   = f.count;
  // Lay out flowers in a row — compute positions inside a fixed viewBox
  const vbW     = count === 1 ? 280 : count === 2 ? 420 : 560;
  const vbH     = 220;
  const spacing = vbW / count;
  const flowerPositions = Array.from({ length: count }, (_, i) => ({
    x: spacing * 0.5 + i * spacing,
    y: 95,
    size: count === 1 ? 1.1 : count === 2 ? 0.92 : 0.8,
    delay: i * 120,
  }));

  return (
    <>
      <style>{`
        @keyframes bgFadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes cardPop {
          from { opacity: 0; transform: translateY(32px) scale(0.94); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes gentlePulse {
          0%, 100% { transform: scale(1); }
          50%       { transform: scale(1.015); }
        }
      `}</style>

      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0,
          background: 'rgba(44,40,37,0.55)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000, padding: '20px', cursor: 'pointer',
          animation: 'bgFadeIn 0.35s ease forwards',
          overflow: 'hidden',
        }}
      >
        {/* Canvas confetti */}
        <ConfettiCanvas colors={f.confettiColors} active={visible} />

        {/* Card */}
        <div
          onClick={e => e.stopPropagation()}
          style={{
            position: 'relative', zIndex: 2,
            background: 'var(--white)',
            borderRadius: '28px',
            padding: '32px 40px 40px',
            maxWidth: count >= 3 ? '520px' : '400px',
            width: '100%',
            textAlign: 'center',
            boxShadow: '0 16px 64px rgba(44,40,37,0.22), 0 4px 16px rgba(44,40,37,0.1)',
            animation: 'cardPop 0.45s cubic-bezier(0.34,1.56,0.64,1) forwards',
            cursor: 'default',
          }}
        >
          {/* Type label */}
          <p style={{
            fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.12em',
            textTransform: 'uppercase', color: f.petalColor,
            marginBottom: '12px',
          }}>
            {f.label}
          </p>

          {/* SVG flowers */}
          <div style={{ animation: 'gentlePulse 3s ease 1s infinite' }}>
            <svg
              viewBox={`0 0 ${vbW} ${vbH}`}
              width="100%" height="auto"
              style={{ overflow: 'visible', display: 'block', marginBottom: '8px' }}
            >
              {flowerPositions.map((pos, i) => (
                <Flower
                  key={i}
                  type={type}
                  x={pos.x} y={pos.y}
                  size={pos.size}
                  delay={pos.delay}
                  visible={visible}
                />
              ))}
            </svg>
          </div>

          {/* Text */}
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: count >= 3 ? '1.85rem' : '1.65rem',
            color: 'var(--ink)',
            marginBottom: '10px',
            letterSpacing: '-0.01em',
            lineHeight: 1.2,
          }}>
            {text}
          </h2>
          {message && (
            <p style={{
              color: 'var(--ink-light)', lineHeight: 1.7,
              fontSize: '0.9rem',
              maxWidth: '320px', margin: '0 auto 24px',
            }}>
              {message}
            </p>
          )}

          <button
            className="btn-primary"
            onClick={onClose}
            style={{ marginBottom: '12px' }}
          >
            Keep going →
          </button>
          <p style={{ fontSize: '0.72rem', color: 'var(--bark-light)', marginTop: '4px' }}>
            tap anywhere to close
          </p>
        </div>
      </div>
    </>
  );
}

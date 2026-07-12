// FlowerCelebration.jsx
// Plays when completing a month (lilac), track (peony), or phase (bougainvillea).
// Stays on screen until tapped. Replayable.
// In migraine mode: shows a text banner instead of animation.

import React, { useEffect, useState } from 'react';

const FLOWERS = {
  lilac: {
    petalColor: '#B8A9D4',
    petalDark:  '#8B77BB',
    centerColor:'#F5F0FF',
    centerDot:  '#8B77BB',
    leafColor:  '#7FA882',
    size: 1,
  },
  peony: {
    petalColor: '#E8A0B0',
    petalDark:  '#C4607A',
    centerColor:'#FFF0F3',
    centerDot:  '#C4607A',
    leafColor:  '#7FA882',
    size: 1,
  },
  bougainvillea: {
    petalColor: '#D4607A',
    petalDark:  '#A83D56',
    centerColor:'#FFE8ED',
    centerDot:  '#A83D56',
    leafColor:  '#5A9EA8',
    size: 1.25,
  },
};

// ── Individual petal (stylized, illustrated) ──────────────────────────────────
function Petal({ cx, cy, angle, color, darkColor, scale = 1, delay = 0, animating }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    if (!animating) { setShow(false); return; }
    const t = setTimeout(() => setShow(true), delay);
    return () => clearTimeout(t);
  }, [animating, delay]);

  const rad = (angle * Math.PI) / 180;
  const dist = 38 * scale;
  const px = cx + dist * Math.cos(rad);
  const py = cy + dist * Math.sin(rad);
  const pw = 22 * scale;
  const ph = 32 * scale;

  return (
    <g
      transform={`translate(${px}, ${py}) rotate(${angle + 90})`}
      style={{
        opacity: show ? 1 : 0,
        transform: show
          ? `translate(${px}px, ${py}px) rotate(${angle + 90}deg) scale(1)`
          : `translate(${px}px, ${py}px) rotate(${angle + 90}deg) scale(0)`,
        transformOrigin: `${px}px ${py}px`,
        transition: `opacity 0.4s ease ${delay}ms, transform 0.5s cubic-bezier(0.34,1.56,0.64,1) ${delay}ms`,
      }}
    >
      {/* Main petal shape */}
      <ellipse cx={0} cy={-ph * 0.3} rx={pw / 2} ry={ph / 2} fill={color} opacity={0.9} />
      {/* Petal highlight */}
      <ellipse cx={-pw * 0.12} cy={-ph * 0.45} rx={pw * 0.18} ry={ph * 0.28} fill={darkColor} opacity={0.25} />
      {/* Petal vein */}
      <line x1={0} y1={0} x2={0} y2={-ph * 0.65} stroke={darkColor} strokeWidth={0.8 * scale} opacity={0.3} strokeLinecap="round" />
    </g>
  );
}

// ── Leaf ─────────────────────────────────────────────────────────────────────
function Leaf({ cx, cy, angle, color, scale = 1, delay = 0, animating }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    if (!animating) { setShow(false); return; }
    const t = setTimeout(() => setShow(true), delay);
    return () => clearTimeout(t);
  }, [animating, delay]);

  const rad = (angle * Math.PI) / 180;
  const dist = 58 * scale;
  const lx = cx + dist * Math.cos(rad);
  const ly = cy + dist * Math.sin(rad);

  return (
    <ellipse
      cx={lx} cy={ly}
      rx={10 * scale} ry={18 * scale}
      fill={color}
      opacity={0.7}
      transform={`rotate(${angle + 90}, ${lx}, ${ly})`}
      style={{
        opacity: show ? 0.7 : 0,
        transition: `opacity 0.5s ease ${delay}ms`,
      }}
    />
  );
}

// ── Single illustrated flower ─────────────────────────────────────────────────
function IllustratedFlower({ type = 'lilac', cx = 160, cy = 200, animating = false }) {
  const f = FLOWERS[type];
  const s = f.size;
  const numPetals = type === 'bougainvillea' ? 6 : type === 'peony' ? 10 : 8;
  const angleStep = 360 / numPetals;

  // Peony has two rings of petals
  const petalRings = type === 'peony'
    ? [
        { count: 6, distMult: 1,    sizeScale: 1,    delayBase: 0 },
        { count: 6, distMult: 0.65, sizeScale: 0.75, delayBase: 100 },
      ]
    : [{ count: numPetals, distMult: 1, sizeScale: 1, delayBase: 0 }];

  return (
    <g>
      {/* Stem */}
      <line
        x1={cx} y1={cy + 28 * s} x2={cx} y2={cy + 70 * s}
        stroke={f.leafColor} strokeWidth={3 * s} strokeLinecap="round"
        style={{ opacity: animating ? 0.7 : 0, transition: 'opacity 0.5s ease 600ms' }}
      />
      {/* Leaves */}
      <Leaf cx={cx} cy={cy + 50 * s} angle={-30} color={f.leafColor} scale={s} delay={650} animating={animating} />
      <Leaf cx={cx} cy={cy + 55 * s} angle={210} color={f.leafColor} scale={s * 0.85} delay={700} animating={animating} />

      {/* Petals — all rings */}
      {petalRings.map((ring, ri) =>
        Array.from({ length: ring.count }, (_, i) => (
          <Petal
            key={`r${ri}p${i}`}
            cx={cx} cy={cy}
            angle={i * (360 / ring.count) + (ri * (180 / ring.count))}
            color={f.petalColor}
            darkColor={f.petalDark}
            scale={s * ring.sizeScale * ring.distMult}
            delay={ring.delayBase + i * 60}
            animating={animating}
          />
        ))
      )}

      {/* Center */}
      <circle
        cx={cx} cy={cy} r={14 * s}
        fill={f.centerColor}
        stroke={f.petalDark} strokeWidth={1.5}
        style={{ opacity: animating ? 1 : 0, transition: 'opacity 0.3s ease 400ms' }}
      />
      <circle
        cx={cx} cy={cy} r={6 * s}
        fill={f.centerDot}
        style={{ opacity: animating ? 1 : 0, transition: 'opacity 0.3s ease 500ms' }}
      />
      {/* Center dots */}
      {[0, 60, 120, 180, 240, 300].map((a, i) => {
        const ar = (a * Math.PI) / 180;
        return (
          <circle
            key={i}
            cx={cx + 9 * s * Math.cos(ar)} cy={cy + 9 * s * Math.sin(ar)}
            r={2 * s}
            fill={f.centerDot} opacity={0.5}
            style={{ opacity: animating ? 0.5 : 0, transition: `opacity 0.3s ease ${520 + i * 30}ms` }}
          />
        );
      })}
    </g>
  );
}

// ── Floating petals (background) ─────────────────────────────────────────────
function FloatingPetal({ color, startX, delay, animating }) {
  return (
    <div style={{
      position: 'absolute',
      left: `${startX}%`,
      top: '-20px',
      width: '12px', height: '16px',
      background: color,
      borderRadius: '50% 50% 50% 0',
      opacity: animating ? 0.6 : 0,
      transform: 'rotate(-45deg)',
      animation: animating ? `floatDown 3s ease-in ${delay}ms forwards` : 'none',
    }} />
  );
}

// ── Main CelebrationModal ────────────────────────────────────────────────────
export default function FlowerCelebration({ type, text, message, migraineMode, onClose }) {
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    // Small delay before starting animation so React renders first
    const t = setTimeout(() => setAnimating(true), 80);
    return () => clearTimeout(t);
  }, []);

  const f = FLOWERS[type] || FLOWERS.lilac;
  const floatingColors = [f.petalColor, f.petalDark, f.centerColor];

  // ── Migraine mode: text banner only ─────────────────────────────────────
  if (migraineMode) {
    return (
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0,
          background: 'rgba(61,46,30,0.7)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000, padding: 'var(--space-6)',
          cursor: 'pointer',
        }}
      >
        <div
          onClick={e => e.stopPropagation()}
          style={{
            background: 'var(--cream)', borderRadius: 'var(--radius-xl)',
            padding: 'var(--space-10)', maxWidth: '380px', width: '100%',
            textAlign: 'center', boxShadow: 'var(--shadow-lg)',
          }}
        >
          <h2 style={{
            fontFamily: 'var(--font-display)', fontSize: '1.75rem',
            color: 'var(--ink)', marginBottom: 'var(--space-4)',
          }}>
            🎉 {text}
          </h2>
          {message && (
            <p style={{ color: 'var(--ink-light)', lineHeight: 1.7, marginBottom: 'var(--space-4)' }}>
              {message}
            </p>
          )}
          <p style={{
            fontSize: '0.75rem', color: 'var(--bark)',
            marginBottom: 'var(--space-6)', fontStyle: 'italic',
          }}>
            (Flower animation disabled in migraine mode)
          </p>
          <button className="btn-primary" onClick={onClose}>Continue</button>
        </div>
      </div>
    );
  }

  // ── Normal mode: illustrated flower animation ────────────────────────────
  const isLarge = type === 'bougainvillea';
  const numFlowers = isLarge ? 3 : type === 'peony' ? 2 : 1;

  return (
    <>
      <style>{`
        @keyframes floatDown {
          0%   { transform: rotate(-45deg) translateY(0);   opacity: 0.6; }
          100% { transform: rotate(-45deg) translateY(110vh); opacity: 0; }
        }
        @keyframes bgFadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes cardSlideUp {
          from { opacity: 0; transform: translateY(40px) scale(0.95); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes shimmer {
          0%, 100% { opacity: 0.4; }
          50%       { opacity: 1; }
        }
      `}</style>
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0,
          background: 'rgba(44,40,37,0.6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000, padding: 'var(--space-6)',
          cursor: 'pointer',
          animation: 'bgFadeIn 0.3s ease forwards',
          overflow: 'hidden',
        }}
      >
        {/* Floating petals background */}
        {Array.from({ length: 14 }, (_, i) => (
          <FloatingPetal
            key={i}
            color={floatingColors[i % floatingColors.length]}
            startX={Math.random() * 100}
            delay={i * 180}
            animating={animating}
          />
        ))}

        <div
          onClick={e => e.stopPropagation()}
          style={{
            background: 'var(--white)', borderRadius: 'var(--radius-xl)',
            padding: `var(--space-8) var(--space-8) var(--space-10)`,
            maxWidth: isLarge ? '480px' : '380px', width: '100%',
            textAlign: 'center', boxShadow: 'var(--shadow-lg)',
            animation: 'cardSlideUp 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards',
            position: 'relative', cursor: 'default',
          }}
        >
          {/* SVG flower(s) */}
          <svg
            width="100%" viewBox={isLarge ? "0 0 400 240" : numFlowers === 2 ? "0 0 340 220" : "0 0 320 210"}
            style={{ overflow: 'visible', marginBottom: 'var(--space-2)' }}
          >
            {numFlowers === 1 && <IllustratedFlower type={type} cx={160} cy={120} animating={animating} />}
            {numFlowers === 2 && (
              <>
                <IllustratedFlower type={type} cx={110} cy={115} animating={animating} />
                <IllustratedFlower type={type} cx={230} cy={110} animating={animating} />
              </>
            )}
            {numFlowers === 3 && (
              <>
                <IllustratedFlower type={type} cx={80}  cy={130} animating={animating} />
                <IllustratedFlower type={type} cx={200} cy={110} animating={animating} />
                <IllustratedFlower type={type} cx={320} cy={130} animating={animating} />
              </>
            )}
          </svg>

          {/* Text */}
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: isLarge ? '2rem' : '1.75rem',
            color: 'var(--ink)', marginBottom: 'var(--space-3)',
            letterSpacing: '-0.02em',
          }}>
            {text}
          </h2>
          {message && (
            <p style={{
              color: 'var(--ink-light)', lineHeight: 1.7,
              fontSize: '0.9375rem', marginBottom: 'var(--space-6)',
              maxWidth: '300px', margin: '0 auto var(--space-6)',
            }}>
              {message}
            </p>
          )}

          <button className="btn-primary" onClick={onClose} style={{ marginTop: 'var(--space-4)' }}>
            Keep going →
          </button>

          <p style={{
            fontSize: '0.75rem', color: 'var(--bark-light)',
            marginTop: 'var(--space-4)',
            animation: 'shimmer 2s ease 1.5s infinite',
          }}>
            Tap anywhere to close
          </p>
        </div>
      </div>
    </>
  );
}

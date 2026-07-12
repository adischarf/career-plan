// FlowerCelebration.jsx
// Flowers grow from the bottom of the modal card upward:
// stem → leaves → petals → stamens/center
// Each flower type has a distinct illustrated look.

import React, { useEffect, useState } from 'react';

// ── Shared animation helper ───────────────────────────────────────────────────
function useTiming(steps, active) {
  // steps: array of { key, delay } — returns Set of revealed keys
  const [revealed, setRevealed] = useState(new Set());
  useEffect(() => {
    if (!active) { setRevealed(new Set()); return; }
    const timers = steps.map(({ key, delay }) =>
      setTimeout(() => setRevealed(prev => new Set([...prev, key])), delay)
    );
    return () => timers.forEach(clearTimeout);
  }, [active]); // eslint-disable-line
  return revealed;
}

// ── CSS transition helpers ────────────────────────────────────────────────────
const grow = (show, delay, origin = 'bottom') => ({
  transformOrigin: origin,
  transform: show ? 'scaleY(1)' : 'scaleY(0)',
  opacity: show ? 1 : 0,
  transition: `transform 0.55s cubic-bezier(0.34,1.56,0.64,1) ${delay}ms, opacity 0.3s ease ${delay}ms`,
});

const bloom = (show, delay, cx, cy) => ({
  transformOrigin: `${cx}px ${cy}px`,
  transform: show ? 'scale(1)' : 'scale(0)',
  opacity: show ? 1 : 0,
  transition: `transform 0.6s cubic-bezier(0.34,1.56,0.64,1) ${delay}ms, opacity 0.3s ease ${delay}ms`,
});

const fadeIn = (show, delay) => ({
  opacity: show ? 1 : 0,
  transition: `opacity 0.5s ease ${delay}ms`,
});

// ═══════════════════════════════════════════════════════════════════════════════
// LILAC FLOWER — single purple flower, 6 rounded petals, yellow center
// ═══════════════════════════════════════════════════════════════════════════════
function LilacFlower({ r }) {
  const steps = [
    { key: 'stem',   delay: 100 },
    { key: 'leaf1',  delay: 450 },
    { key: 'leaf2',  delay: 580 },
    { key: 'bud',    delay: 750 },
    { key: 'p1',     delay: 900 },
    { key: 'p2',     delay: 980 },
    { key: 'p3',     delay: 1060 },
    { key: 'p4',     delay: 1140 },
    { key: 'p5',     delay: 1220 },
    { key: 'p6',     delay: 1300 },
    { key: 'center', delay: 1450 },
  ];
  const rev = useTiming(steps, r);

  // Lilac: single flower centred at (140, 85) in a 280×230 viewBox
  const cx = 140, cy = 82;
  const stemX = 140;

  return (
    <svg viewBox="0 0 280 230" width="100%" style={{ overflow: 'visible', display: 'block' }}>
      {/* Stem */}
      <path d={`M ${stemX} 225 C ${stemX} 200, ${stemX-8} 170, ${stemX} ${cy+42}`}
        fill="none" stroke="#5A9040" strokeWidth="5" strokeLinecap="round"
        style={grow(rev.has('stem'), 100, '280px 225px')}
      />
      {/* Leaf 1 — left */}
      <g style={bloom(rev.has('leaf1'), 0, stemX-18, 165)}>
        <path d={`M ${stemX} 162 C ${stemX-10} 155, ${stemX-38} 158, ${stemX-32} 175 C ${stemX-26} 190, ${stemX-5} 178, ${stemX} 162 Z`}
          fill="#4A9850" />
        <path d={`M ${stemX} 162 C ${stemX-14} 163, ${stemX-28} 170, ${stemX-32} 175`}
          fill="none" stroke="#3A7840" strokeWidth="1.2" opacity="0.6" strokeLinecap="round"/>
      </g>
      {/* Leaf 2 — right */}
      <g style={bloom(rev.has('leaf2'), 0, stemX+18, 148)}>
        <path d={`M ${stemX} 145 C ${stemX+10} 138, ${stemX+36} 140, ${stemX+30} 158 C ${stemX+24} 174, ${stemX+5} 162, ${stemX} 145 Z`}
          fill="#56A85C" />
        <path d={`M ${stemX} 145 C ${stemX+12} 146, ${stemX+25} 152, ${stemX+30} 158`}
          fill="none" stroke="#3A7840" strokeWidth="1.2" opacity="0.6" strokeLinecap="round"/>
      </g>
      {/* Petals — 6 around center */}
      {[
        { key:'p1', angle:-90,  color:'#B090D8', shade:'#9070C0' },
        { key:'p2', angle:-30,  color:'#C0A0E0', shade:'#9070C0' },
        { key:'p3', angle:30,   color:'#B090D8', shade:'#8060B8' },
        { key:'p4', angle:90,   color:'#C0A0E0', shade:'#9070C0' },
        { key:'p5', angle:150,  color:'#B090D8', shade:'#8060B8' },
        { key:'p6', angle:210,  color:'#C0A0E0', shade:'#9070C0' },
      ].map(({ key, angle, color, shade }) => {
        const rad = (angle * Math.PI) / 180;
        const px = cx + 30 * Math.cos(rad);
        const py = cy + 30 * Math.sin(rad);
        return (
          <g key={key} style={bloom(rev.has(key), 0, px, py)}>
            <ellipse cx={px} cy={py} rx={18} ry={26}
              fill={color} transform={`rotate(${angle+90}, ${px}, ${py})`} opacity={0.93}/>
            <ellipse cx={px + 2*Math.cos(rad)} cy={py + 2*Math.sin(rad)} rx={6} ry={14}
              fill={shade} transform={`rotate(${angle+90}, ${px}, ${py})`} opacity={0.3}/>
          </g>
        );
      })}
      {/* Center */}
      <g style={bloom(rev.has('center'), 0, cx, cy)}>
        <circle cx={cx} cy={cy} r={14} fill="#FFF5C0" stroke="#D4A820" strokeWidth="1.5"/>
        <circle cx={cx} cy={cy} r={6} fill="#E8C030"/>
        {[0,60,120,180,240,300].map((a,i) => {
          const ar = a * Math.PI/180;
          return <circle key={i} cx={cx+9*Math.cos(ar)} cy={cy+9*Math.sin(ar)} r={2.5} fill="#C89020" opacity={0.8}/>;
        })}
      </g>
    </svg>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PEONY — full rounded bloom, many layered petals, rich pink
// ═══════════════════════════════════════════════════════════════════════════════
function PeonyFlower({ r }) {
  const steps = [
    { key: 'stem',   delay: 100 },
    { key: 'leaf1',  delay: 420 },
    { key: 'leaf2',  delay: 560 },
    { key: 'leaf3',  delay: 640 },
    ...Array.from({length:8},(_,i) => ({ key:`op${i}`, delay: 780 + i*70 })),
    ...Array.from({length:6},(_,i) => ({ key:`ip${i}`, delay: 1160 + i*60 })),
    { key: 'center', delay: 1500 },
  ];
  const rev = useTiming(steps, r);

  const cx = 150, cy = 78;

  // Outer petals — large, rounded
  const outerPetals = Array.from({length:8}, (_,i) => {
    const angle = (i * 45) - 90;
    const rad = angle * Math.PI/180;
    const dist = 36;
    return { angle, px: cx + dist*Math.cos(rad), py: cy + dist*Math.sin(rad),
      color: i%2===0 ? '#E870A0' : '#F098B8', key:`op${i}` };
  });

  // Inner petals — smaller, more upright
  const innerPetals = Array.from({length:6}, (_,i) => {
    const angle = (i * 60) - 60;
    const rad = angle * Math.PI/180;
    const dist = 20;
    return { angle, px: cx + dist*Math.cos(rad), py: cy + dist*Math.sin(rad),
      color: i%2===0 ? '#F0A0C0' : '#F8C0D4', key:`ip${i}` };
  });

  return (
    <svg viewBox="0 0 300 230" width="100%" style={{ overflow:'visible', display:'block' }}>
      {/* Stem with slight curve */}
      <path d={`M 150 225 C 150 200, 142 175, 148 ${cy+46}`}
        fill="none" stroke="#4A8C3A" strokeWidth="6" strokeLinecap="round"
        style={grow(rev.has('stem'), 100, '150px 225px')}
      />
      {/* Leaves */}
      <g style={bloom(rev.has('leaf1'), 0, 125, 170)}>
        <path d={`M 148 168 C 138 158, 106 162, 112 180 C 118 196, 142 184, 148 168 Z`} fill="#4A9040"/>
        <path d={`M 148 168 C 136 170, 120 176, 112 180`} fill="none" stroke="#357030" strokeWidth="1.3" opacity="0.6"/>
      </g>
      <g style={bloom(rev.has('leaf2'), 0, 175, 155)}>
        <path d={`M 152 152 C 162 142, 194 145, 188 163 C 182 180, 158 168, 152 152 Z`} fill="#56A84A"/>
        <path d={`M 152 152 C 164 154, 180 160, 188 163`} fill="none" stroke="#357030" strokeWidth="1.3" opacity="0.6"/>
      </g>
      <g style={bloom(rev.has('leaf3'), 0, 132, 138)}>
        <path d={`M 148 135 C 138 126, 118 130, 124 144 C 130 158, 146 148, 148 135 Z`} fill="#5AAA4C"/>
        <path d={`M 148 135 C 138 138, 128 143, 124 144`} fill="none" stroke="#357030" strokeWidth="1.1" opacity="0.55"/>
      </g>
      {/* Outer petals */}
      {outerPetals.map(({ key, angle, px, py, color }) => (
        <g key={key} style={bloom(rev.has(key), 0, px, py)}>
          <ellipse cx={px} cy={py} rx={22} ry={30}
            fill={color} transform={`rotate(${angle+90}, ${px}, ${py})`} opacity={0.9}/>
          <ellipse cx={px} cy={py} rx={7} ry={18}
            fill="white" transform={`rotate(${angle+90}, ${px}, ${py})`} opacity={0.18}/>
        </g>
      ))}
      {/* Inner petals */}
      {innerPetals.map(({ key, angle, px, py, color }) => (
        <g key={key} style={bloom(rev.has(key), 0, px, py)}>
          <ellipse cx={px} cy={py} rx={15} ry={22}
            fill={color} transform={`rotate(${angle+90}, ${px}, ${py})`} opacity={0.92}/>
        </g>
      ))}
      {/* Center — golden stamens */}
      <g style={bloom(rev.has('center'), 0, cx, cy)}>
        <circle cx={cx} cy={cy} r={16} fill="#FFF0C8" stroke="#D4A030" strokeWidth="1.5"/>
        {Array.from({length:12},(_,i) => {
          const a = i * 30 * Math.PI/180;
          const r1=6, r2=12;
          return (
            <g key={i}>
              <line x1={cx+r1*Math.cos(a)} y1={cy+r1*Math.sin(a)}
                    x2={cx+r2*Math.cos(a)} y2={cy+r2*Math.sin(a)}
                stroke="#C89028" strokeWidth="1.5" strokeLinecap="round"/>
              <circle cx={cx+r2*Math.cos(a)} cy={cy+r2*Math.sin(a)} r={2.2} fill="#D4A030"/>
            </g>
          );
        })}
        <circle cx={cx} cy={cy} r={5} fill="#E8B840"/>
      </g>
    </svg>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// BOUGAINVILLEA — two flowers, bracts fan upward from the stem tip
// Branch ends at the BOTTOM of the flower (lb/rb = "left base" / "right base")
// Bracts grow upward from there; center sits at the top of the bract cluster
// ═══════════════════════════════════════════════════════════════════════════════
function BougainvilleaFlower({ r }) {
  const steps = [
    { key: 'stem',    delay: 80  },
    { key: 'branch1', delay: 350 },
    { key: 'branch2', delay: 430 },
    { key: 'leaf1',   delay: 500 },
    { key: 'leaf2',   delay: 600 },
    { key: 'leaf3',   delay: 670 },
    { key: 'l0', delay: 780  },
    { key: 'l1', delay: 860  },
    { key: 'l2', delay: 940  },
    { key: 'l3', delay: 1020 },
    { key: 'l4', delay: 1100 },
    { key: 'r0', delay: 860  },
    { key: 'r1', delay: 940  },
    { key: 'r2', delay: 1020 },
    { key: 'r3', delay: 1100 },
    { key: 'r4', delay: 1180 },
    { key: 'tc1', delay: 1280 },
    { key: 'tc2', delay: 1340 },
  ];
  const rev = useTiming(steps, r);

  const fork = { x: 158, y: 150 };

  // lb/rb = base of flower = where branch tip meets the flower bottom
  // The bracts fan upward from here; center is ~bractLength above the base
  const bractLen = 50;
  const lb = { x: 100, y: 108 };   // left flower base
  const rb = { x: 218, y:  96 };   // right flower base
  // Center of each flower = base + upward offset (roughly bractLen * 0.72)
  const lc = { x: lb.x, y: lb.y - Math.round(bractLen * 0.72) };
  const rc = { x: rb.x, y: rb.y - Math.round(bractLen * 0.72) };

  // Wide rounded bract growing from (bx,by) in direction angleDeg
  function bracPath(bx, by, angleDeg, w, h) {
    const a  = angleDeg * Math.PI / 180;
    const tx = bx + h * Math.cos(a);
    const ty = by + h * Math.sin(a);
    const perp = (angleDeg + 90) * Math.PI / 180;
    const c1x = bx + h*0.3*Math.cos(a) + w*0.55*Math.cos(perp);
    const c1y = by + h*0.3*Math.sin(a) + w*0.55*Math.sin(perp);
    const c2x = bx + h*0.7*Math.cos(a) + w*0.5*Math.cos(perp);
    const c2y = by + h*0.7*Math.sin(a) + w*0.5*Math.sin(perp);
    const c3x = bx + h*0.3*Math.cos(a) - w*0.55*Math.cos(perp);
    const c3y = by + h*0.3*Math.sin(a) - w*0.55*Math.sin(perp);
    const c4x = bx + h*0.7*Math.cos(a) - w*0.5*Math.cos(perp);
    const c4y = by + h*0.7*Math.sin(a) - w*0.5*Math.sin(perp);
    return `M ${bx} ${by} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${tx} ${ty} C ${c4x} ${c4y}, ${c3x} ${c3y}, ${bx} ${by} Z`;
  }
  function veinPath(bx, by, angleDeg, h) {
    const a = angleDeg * Math.PI / 180;
    return `M ${bx} ${by} Q ${bx+h*0.45*Math.cos(a)} ${by+h*0.45*Math.sin(a)}, ${bx+h*0.82*Math.cos(a)} ${by+h*0.82*Math.sin(a)}`;
  }

  // 5 bracts: spread from -155° to -25° (all pointing upward/outward)
  // -90° = straight up. Spread evenly across a 130° fan.
  const angles = [-155, -122, -90, -58, -25];
  const lColors = ['#D84E90','#E868A4','#F090BC','#E060A0','#F8A8CC'];
  const rColors = ['#DC5898','#EE78AC','#F898C4','#E470A8','#FAACCE'];

  return (
    <svg viewBox="20 0 300 235" width="100%" style={{ overflow:'visible', display:'block' }}>
      {/* Main stem */}
      <path d={`M 160 228 C 160 210, 158 188, ${fork.x} ${fork.y}`}
        fill="none" stroke="#3A7830" strokeWidth="6" strokeLinecap="round"
        style={grow(rev.has('stem'), 80, '160px 228px')}
      />
      {/* Left branch — ends at lb (bottom of left flower) */}
      <path d={`M ${fork.x} ${fork.y} C ${fork.x-16} ${fork.y-22}, ${lb.x+20} ${lb.y+28}, ${lb.x} ${lb.y}`}
        fill="none" stroke="#4A8C3A" strokeWidth="4.5" strokeLinecap="round"
        style={fadeIn(rev.has('branch1'), 350)}
      />
      {/* Right branch — ends at rb */}
      <path d={`M ${fork.x} ${fork.y} C ${fork.x+22} ${fork.y-18}, ${rb.x-26} ${rb.y+24}, ${rb.x} ${rb.y}`}
        fill="none" stroke="#4A8C3A" strokeWidth="4" strokeLinecap="round"
        style={fadeIn(rev.has('branch2'), 430)}
      />

      {/* Leaves */}
      <g style={bloom(rev.has('leaf1'), 0, 128, 192)}>
        <path d="M 157 187 C 144 172, 108 176, 115 198 C 122 216, 150 204, 157 187 Z" fill="#3A8C38"/>
        <path d="M 157 187 C 142 190, 122 197, 115 198" fill="none" stroke="#2A6828" strokeWidth="1.4" opacity="0.6"/>
        <path d="M 136 182 C 130 189, 124 196, 122 202" fill="none" stroke="#2A6828" strokeWidth="0.9" opacity="0.4"/>
      </g>
      <g style={bloom(rev.has('leaf2'), 0, 180, 172)}>
        <path d="M 160 170 C 170 156, 202 159, 195 178 C 188 195, 163 183, 160 170 Z" fill="#46A040"/>
        <path d="M 160 170 C 172 172, 187 177, 195 178" fill="none" stroke="#2A6828" strokeWidth="1.3" opacity="0.55"/>
      </g>
      <g style={bloom(rev.has('leaf3'), 0, fork.x-16, fork.y+14)}>
        <path d={`M ${fork.x} ${fork.y+4} C ${fork.x-8} ${fork.y-8}, ${fork.x-36} ${fork.y-4}, ${fork.x-30} ${fork.y+18} C ${fork.x-24} ${fork.y+34}, ${fork.x-4} ${fork.y+24}, ${fork.x} ${fork.y+4} Z`} fill="#4AAA42"/>
        <path d={`M ${fork.x} ${fork.y+4} C ${fork.x-14} ${fork.y+8}, ${fork.x-25} ${fork.y+16}, ${fork.x-30} ${fork.y+18}`} fill="none" stroke="#2A6828" strokeWidth="1.1" opacity="0.5"/>
      </g>

      {/* ── LEFT FLOWER — bracts fan upward from lb ── */}
      {angles.map((angle, i) => (
        <g key={`l${i}`} style={bloom(rev.has(`l${i}`), 0, lb.x, lb.y)}>
          <path d={bracPath(lb.x, lb.y, angle, 23, bractLen)} fill={lColors[i]} opacity={0.92}/>
          <path d={veinPath(lb.x, lb.y, angle, bractLen)}
            fill="none" stroke="#A83068" strokeWidth="1.3" opacity="0.3" strokeLinecap="round"/>
        </g>
      ))}

      {/* ── RIGHT FLOWER — bracts fan upward from rb ── */}
      {angles.map((angle, i) => (
        <g key={`r${i}`} style={bloom(rev.has(`r${i}`), 0, rb.x, rb.y)}>
          <path d={bracPath(rb.x, rb.y, angle, 21, bractLen - 4)} fill={rColors[i]} opacity={0.92}/>
          <path d={veinPath(rb.x, rb.y, angle, bractLen - 4)}
            fill="none" stroke="#A83068" strokeWidth="1.2" opacity="0.3" strokeLinecap="round"/>
        </g>
      ))}

      {/* ── TRUE FLOWER CENTERS — sit at the top of the bract cluster ── */}
      <g style={bloom(rev.has('tc1'), 0, lc.x, lc.y)}>
        <circle cx={lc.x} cy={lc.y} r={12} fill="#FFF6E8" stroke="#D4A030" strokeWidth="1"/>
        {[0,72,144,216,288].map((a,i) => {
          const ar = a*Math.PI/180;
          return <ellipse key={i} cx={lc.x+7.5*Math.cos(ar)} cy={lc.y+7.5*Math.sin(ar)}
            rx={3.5} ry={5} fill="white"
            transform={`rotate(${a+90},${lc.x+7.5*Math.cos(ar)},${lc.y+7.5*Math.sin(ar)})`}/>;
        })}
        {[0,45,90,135,180,225,270,315].map((a,i) => {
          const ar=a*Math.PI/180, r1=3, r2=8.5;
          return <g key={i}>
            <line x1={lc.x+r1*Math.cos(ar)} y1={lc.y+r1*Math.sin(ar)}
                  x2={lc.x+r2*Math.cos(ar)} y2={lc.y+r2*Math.sin(ar)}
              stroke="#A06818" strokeWidth="1.1" strokeLinecap="round" opacity={0.8}/>
            <circle cx={lc.x+r2*Math.cos(ar)} cy={lc.y+r2*Math.sin(ar)} r={1.8} fill="#C88C20"/>
          </g>;
        })}
        <circle cx={lc.x} cy={lc.y} r={3.5} fill="#E0A030"/>
      </g>

      <g style={bloom(rev.has('tc2'), 0, rc.x, rc.y)}>
        <circle cx={rc.x} cy={rc.y} r={11} fill="#FFF6E8" stroke="#D4A030" strokeWidth="1"/>
        {[0,72,144,216,288].map((a,i) => {
          const ar = a*Math.PI/180;
          return <ellipse key={i} cx={rc.x+7*Math.cos(ar)} cy={rc.y+7*Math.sin(ar)}
            rx={3} ry={4.5} fill="white"
            transform={`rotate(${a+90},${rc.x+7*Math.cos(ar)},${rc.y+7*Math.sin(ar)})`}/>;
        })}
        {[0,60,120,180,240,300].map((a,i) => {
          const ar=a*Math.PI/180, r1=2.5, r2=7.5;
          return <g key={i}>
            <line x1={rc.x+r1*Math.cos(ar)} y1={rc.y+r1*Math.sin(ar)}
                  x2={rc.x+r2*Math.cos(ar)} y2={rc.y+r2*Math.sin(ar)}
              stroke="#A06818" strokeWidth="1" strokeLinecap="round" opacity={0.8}/>
            <circle cx={rc.x+r2*Math.cos(ar)} cy={rc.y+r2*Math.sin(ar)} r={1.6} fill="#C88C20"/>
          </g>;
        })}
        <circle cx={rc.x} cy={rc.y} r={3} fill="#E0A030"/>
      </g>
    </svg>
  );
}

// ── Falling petal confetti ────────────────────────────────────────────────────
function FallingPetals({ colors, active }) {
  const [petals] = useState(() =>
    Array.from({ length: 22 }, (_, i) => ({
      id: i,
      left:  4 + Math.random() * 92,
      delay: 200 + i * 140,
      dur:   2200 + Math.random() * 1800,
      size:  8 + Math.random() * 9,
      color: colors[i % colors.length],
      swing: (Math.random() - 0.5) * 80,
    }))
  );
  return (
    <>
      <style>{`
        @keyframes petalFall {
          0%   { transform: translateY(-30px) rotate(0deg);   opacity: 0; }
          10%  { opacity: 0.85; }
          85%  { opacity: 0.6; }
          100% { transform: translateY(105vh) rotate(540deg); opacity: 0; }
        }
      `}</style>
      {active && petals.map(p => (
        <div key={p.id} style={{
          position: 'absolute',
          left: `${p.left}%`,
          top: 0,
          width:  `${p.size}px`,
          height: `${p.size * 1.4}px`,
          background: p.color,
          borderRadius: '50% 50% 50% 0',
          opacity: 0,
          animation: `petalFall ${p.dur}ms ease-in ${p.delay}ms forwards`,
          pointerEvents: 'none',
        }}/>
      ))}
    </>
  );
}

// ── Flower wrapper by type ────────────────────────────────────────────────────
const FLOWER_META = {
  lilac:         { label: 'Month Complete',  confetti: ['#B090D8','#C8B8E8','#EAE4F7','#9070C0'], Component: LilacFlower },
  peony:         { label: 'Track Complete',  confetti: ['#E870A0','#F098B8','#FDEDF1','#C04870'], Component: PeonyFlower },
  bougainvillea: { label: 'Phase Complete',  confetti: ['#E868A0','#F090B8','#FDDDE8','#C04878','#F8C0D4'], Component: BougainvilleaFlower },
};

// ── Main component ────────────────────────────────────────────────────────────
export default function FlowerCelebration({ type, text, message, migraineMode, onClose }) {
  const [ready, setReady] = useState(false);
  const meta = FLOWER_META[type] || FLOWER_META.lilac;
  const { Component } = meta;

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 80);
    return () => clearTimeout(t);
  }, []);

  // ── Migraine mode ─────────────────────────────────────────────────────────
  if (migraineMode) {
    return (
      <div onClick={onClose} style={{
        position:'fixed', inset:0, background:'rgba(80,30,10,0.5)',
        display:'flex', alignItems:'center', justifyContent:'center',
        zIndex:1000, padding:'24px', cursor:'pointer',
      }}>
        <div onClick={e=>e.stopPropagation()} style={{
          background:'var(--cream)', borderRadius:'28px',
          padding:'44px 36px', maxWidth:'340px', width:'100%',
          textAlign:'center', boxShadow:'0 8px 32px rgba(0,0,0,0.18)',
        }}>
          <div style={{ fontSize:'2.2rem', marginBottom:'14px' }}>🌸</div>
          <h2 style={{ fontFamily:'var(--font-display)', fontSize:'1.55rem', color:'var(--ink)', marginBottom:'10px' }}>
            {text}
          </h2>
          {message && <p style={{ color:'var(--ink-light)', lineHeight:1.7, marginBottom:'10px', fontSize:'0.9rem' }}>{message}</p>}
          <p style={{ fontSize:'0.7rem', color:'var(--bark)', marginBottom:'22px', fontStyle:'italic' }}>
            (Animation off in migraine mode)
          </p>
          <button className="btn-primary" onClick={onClose}>Keep going →</button>
        </div>
      </div>
    );
  }

  // ── Normal mode ───────────────────────────────────────────────────────────
  return (
    <>
      <style>{`
        @keyframes bgFade  { from{opacity:0} to{opacity:1} }
        @keyframes cardPop {
          from { opacity:0; transform:translateY(28px) scale(0.96); }
          to   { opacity:1; transform:translateY(0)    scale(1); }
        }
      `}</style>

      <div
        onClick={onClose}
        style={{
          position:'fixed', inset:0,
          background:'rgba(44,40,37,0.52)',
          display:'flex', alignItems:'center', justifyContent:'center',
          zIndex:1000, padding:'16px', cursor:'pointer',
          animation:'bgFade 0.3s ease forwards',
          overflow:'hidden',
        }}
      >
        {/* Falling petals */}
        <FallingPetals colors={meta.confetti} active={ready} />

        {/* Card */}
        <div
          onClick={e=>e.stopPropagation()}
          style={{
            position:'relative', zIndex:2,
            background:'var(--white)',
            borderRadius:'24px',
            padding:'28px 32px 36px',
            maxWidth: type==='bougainvillea' ? '480px' : '380px',
            width:'100%',
            textAlign:'center',
            boxShadow:'0 20px 60px rgba(44,40,37,0.22), 0 4px 16px rgba(44,40,37,0.1)',
            animation:'cardPop 0.4s cubic-bezier(0.34,1.56,0.64,1) 0.1s both',
            cursor:'default',
          }}
        >
          {/* Label */}
          <p style={{
            fontSize:'0.68rem', fontWeight:700, letterSpacing:'0.12em',
            textTransform:'uppercase', color: meta.confetti[0],
            marginBottom:'8px',
          }}>
            {meta.label}
          </p>

          {/* Flower SVG */}
          <Component r={ready} />

          {/* Text */}
          <h2 style={{
            fontFamily:'var(--font-display)',
            fontSize:'1.6rem',
            color:'var(--ink)',
            marginBottom:'8px',
            letterSpacing:'-0.01em',
            lineHeight:1.2,
            marginTop:'4px',
          }}>
            {text}
          </h2>
          {message && (
            <p style={{
              color:'var(--ink-light)', lineHeight:1.7,
              fontSize:'0.9rem', marginBottom:'22px',
              maxWidth:'300px', margin:'0 auto 22px',
            }}>
              {message}
            </p>
          )}

          <button className="btn-primary" onClick={onClose} style={{marginBottom:'10px'}}>
            Keep going →
          </button>
          <p style={{ fontSize:'0.7rem', color:'var(--bark-light)', marginTop:'4px' }}>
            tap anywhere to close
          </p>
        </div>
      </div>
    </>
  );
}

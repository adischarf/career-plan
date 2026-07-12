import React, { useState } from 'react';
import {
  MONTHS, PHASES, TRACKS,
} from '../data/planData';
import {
  overallProgress, monthProgress, trackProgress, phaseProgress,
  isMonthComplete, isTrackComplete, isPhaseComplete,
  TRACK_COLORS, TRACK_COLORS_LIGHT,
} from '../utils/progress';

// ── Progress ring ─────────────────────────────────────────────────────────────
function Ring({ pct, size = 80, stroke = 7, color = 'var(--bougainvillea)' }) {
  const r = (size - stroke * 2) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)', flexShrink: 0 }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--cream-dark)" strokeWidth={stroke} />
      <circle
        cx={size/2} cy={size/2} r={r} fill="none"
        stroke={color} strokeWidth={stroke} strokeLinecap="round"
        strokeDasharray={circ} strokeDashoffset={offset}
        style={{ transition: 'stroke-dashoffset 0.9s cubic-bezier(0.34,1.56,0.64,1)' }}
      />
    </svg>
  );
}

// ── Bar ───────────────────────────────────────────────────────────────────────
function Bar({ pct, color, height = 8, label, sublabel }) {
  return (
    <div style={{ marginBottom: 'var(--space-3)' }}>
      {(label || sublabel) && (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
          {label && <span style={{ fontSize: '0.8125rem', color: 'var(--ink)', fontWeight: 500 }}>{label}</span>}
          {sublabel && <span style={{ fontSize: '0.8125rem', color: 'var(--bark)', fontWeight: 500 }}>{pct}%</span>}
        </div>
      )}
      <div style={{ width: '100%', height, background: 'var(--cream-dark)', borderRadius: '99px', overflow: 'hidden' }}>
        <div style={{
          height: '100%', borderRadius: '99px',
          background: color || 'var(--bougainvillea)',
          width: `${pct}%`,
          transition: 'width 0.9s cubic-bezier(0.34,1.56,0.64,1)',
        }} />
      </div>
    </div>
  );
}

// ── Tab button ────────────────────────────────────────────────────────────────
function TabBtn({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '6px 14px', borderRadius: '99px', border: 'none',
        fontSize: '0.8rem', fontFamily: 'var(--font-body)', cursor: 'pointer',
        fontWeight: active ? 600 : 400,
        background: active ? 'var(--ink)' : 'var(--cream-dark)',
        color: active ? 'var(--white)' : 'var(--bark)',
        transition: 'all 0.15s ease', whiteSpace: 'nowrap',
      }}
    >
      {children}
    </button>
  );
}

// ── Overall view ──────────────────────────────────────────────────────────────
function OverallView({ data }) {
  const op = overallProgress(data);
  const completedMonths = MONTHS.filter(m => isMonthComplete(m.id, data)).length;
  const completedTracks = Object.keys(TRACKS).filter(tid => isTrackComplete(tid, data)).length;

  return (
    <div>
      {/* Big ring + number */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 'var(--space-6) 0 var(--space-5)' }}>
        <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
          <Ring pct={op.pct} size={120} stroke={10} color="var(--bougainvillea)" />
          <div style={{ position: 'absolute', textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 700, color: 'var(--ink)', lineHeight: 1 }}>
              {op.pct}%
            </div>
            <div style={{ fontSize: '0.65rem', color: 'var(--bark)', marginTop: 2 }}>complete</div>
          </div>
        </div>
        <p style={{ color: 'var(--bark)', fontSize: '0.8375rem', marginTop: 'var(--space-3)' }}>
          {op.done} of {op.total} subtasks done
        </p>
      </div>

      {/* Quick stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--space-3)', marginBottom: 'var(--space-6)' }}>
        {[
          { label: 'Months done', value: completedMonths, total: MONTHS.length, color: 'var(--lilac-dark)' },
          { label: 'Tracks done', value: completedTracks, total: 6, color: 'var(--peony-dark)' },
          { label: 'Phases done', value: PHASES.filter(p => isPhaseComplete(p.id, data)).length, total: PHASES.length, color: 'var(--bougainvillea)' },
        ].map(({ label, value, total, color }) => (
          <div key={label} style={{
            background: 'var(--cream-dark)', borderRadius: 'var(--radius-md)',
            padding: 'var(--space-3)', textAlign: 'center',
          }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 700, color, lineHeight: 1 }}>
              {value}<span style={{ fontSize: '0.9rem', color: 'var(--bark-light)', fontWeight: 400 }}>/{total}</span>
            </div>
            <div style={{ fontSize: '0.68rem', color: 'var(--bark)', marginTop: 3 }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Phase bars */}
      <div>
        <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--bark)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 'var(--space-3)' }}>
          By Phase
        </p>
        {PHASES.map(phase => {
          const pp = phaseProgress(phase.id, data);
          const done = isPhaseComplete(phase.id, data);
          return (
            <Bar
              key={phase.id}
              pct={pp.pct}
              color={done ? 'var(--sage)' : 'var(--bougainvillea)'}
              label={`${phase.label} — ${phase.name}`}
              sublabel={true}
            />
          );
        })}
      </div>
    </div>
  );
}

// ── Months view ───────────────────────────────────────────────────────────────
function MonthsView({ data }) {
  return (
    <div style={{ paddingTop: 'var(--space-2)' }}>
      {PHASES.map(phase => (
        <div key={phase.id} style={{ marginBottom: 'var(--space-6)' }}>
          <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--bark)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 'var(--space-3)' }}>
            {phase.label} · {phase.name}
          </p>
          {MONTHS.filter(m => phase.months.includes(m.id)).map(month => {
            const mp = monthProgress(month.id, data);
            const done = isMonthComplete(month.id, data);
            return (
              <div
                key={month.id}
                style={{
                  background: done ? 'var(--sage-light)' : 'var(--white)',
                  border: `1px solid ${done ? 'var(--sage)' : 'var(--border)'}`,
                  borderRadius: 'var(--radius-md)',
                  padding: 'var(--space-4)',
                  marginBottom: 'var(--space-3)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
                  <div>
                    <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--ink)' }}>{month.label}</span>
                    {done && <span style={{ marginLeft: 8, fontSize: '0.75rem', color: 'var(--sage)', fontWeight: 600 }}>✓ Complete</span>}
                  </div>
                  <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem', color: done ? 'var(--sage)' : 'var(--bougainvillea)' }}>
                    {mp.pct}%
                  </span>
                </div>
                <Bar pct={mp.pct} color={done ? 'var(--sage)' : 'var(--bougainvillea)'} height={6} />
                <p style={{ fontSize: '0.72rem', color: 'var(--bark)', marginTop: 6 }}>
                  {mp.done} of {mp.total} subtasks
                </p>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

// ── Tracks view ───────────────────────────────────────────────────────────────
function TracksView({ data }) {
  return (
    <div style={{ paddingTop: 'var(--space-2)' }}>
      {Object.values(TRACKS).map(track => {
        const tp = trackProgress(track.id, data);
        const done = isTrackComplete(track.id, data);
        const color = TRACK_COLORS[track.id];
        return (
          <div
            key={track.id}
            style={{
              background: 'var(--white)',
              border: `1px solid ${done ? color : 'var(--border)'}`,
              borderRadius: 'var(--radius-md)',
              padding: 'var(--space-4)',
              marginBottom: 'var(--space-3)',
              borderLeft: `4px solid ${color}`,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 'var(--space-2)', gap: 'var(--space-3)' }}>
              <div>
                <span style={{ fontWeight: 700, fontSize: '0.8rem', color, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  {track.label}
                </span>
                <p style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--ink)', marginTop: 2 }}>
                  {track.name}
                  {done && <span style={{ marginLeft: 8, fontSize: '0.75rem', color: 'var(--sage)', fontWeight: 600 }}>✓ Complete</span>}
                </p>
                <p style={{ fontSize: '0.75rem', color: 'var(--bark)', marginTop: 2 }}>{track.description}</p>
              </div>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.1rem', color: done ? 'var(--sage)' : color, flexShrink: 0 }}>
                {tp.pct}%
              </span>
            </div>
            <Bar pct={tp.pct} color={done ? 'var(--sage)' : color} height={6} />
            <p style={{ fontSize: '0.72rem', color: 'var(--bark)', marginTop: 6 }}>
              {tp.done} of {tp.total} subtasks
            </p>
          </div>
        );
      })}
    </div>
  );
}

// ── Main ProgressScreen ───────────────────────────────────────────────────────
export default function ProgressScreen({ storage, onClose }) {
  const { data } = storage;
  const [tab, setTab] = useState('overall');

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(44,40,37,0.5)',
        zIndex: 999,
        display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
        padding: '0',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        className="animate-slideUp"
        style={{
          background: 'var(--cream)',
          borderRadius: 'var(--radius-xl) var(--radius-xl) 0 0',
          width: '100%', maxWidth: '600px',
          maxHeight: '88vh',
          display: 'flex', flexDirection: 'column',
          boxShadow: 'var(--shadow-lg)',
        }}
      >
        {/* Handle */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: 'var(--space-3) 0 0' }}>
          <div style={{ width: 36, height: 4, background: 'var(--border-strong)', borderRadius: '99px' }} />
        </div>

        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: 'var(--space-4) var(--space-6) var(--space-3)',
          borderBottom: '1px solid var(--border)',
        }}>
          <h2 style={{ fontFamily: 'var(--font-display)', color: 'var(--ink)', fontSize: '1.1rem' }}>
            Your Progress
          </h2>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--bark)', fontSize: '1.1rem', padding: 'var(--space-1)' }}
            aria-label="Close"
          >✕</button>
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex', gap: 'var(--space-2)', overflowX: 'auto',
          padding: 'var(--space-3) var(--space-6)',
          borderBottom: '1px solid var(--border)',
          scrollbarWidth: 'none',
        }}>
          <TabBtn active={tab === 'overall'} onClick={() => setTab('overall')}>Overall</TabBtn>
          <TabBtn active={tab === 'months'}  onClick={() => setTab('months')}>Months</TabBtn>
          <TabBtn active={tab === 'tracks'}  onClick={() => setTab('tracks')}>Tracks</TabBtn>
        </div>

        {/* Content */}
        <div style={{ overflowY: 'auto', padding: 'var(--space-2) var(--space-6) var(--space-8)', flex: 1 }}>
          {tab === 'overall' && <OverallView data={data} />}
          {tab === 'months'  && <MonthsView  data={data} />}
          {tab === 'tracks'  && <TracksView  data={data} />}
        </div>
      </div>
    </div>
  );
}

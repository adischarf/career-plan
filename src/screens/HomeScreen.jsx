import React, { useState, useMemo } from 'react';
import {
  MONTHS, PHASES, TRACKS,
  getTasksForMonth,
} from '../data/planData';
import {
  monthProgress, overallProgress, nextTask,
  allWinsSorted, formatDate, TRACK_COLORS, TRACK_COLORS_LIGHT,
  getUnlockedMonths,
} from '../utils/progress';

// ── Mini progress ring ────────────────────────────────────────────────────────
function ProgressRing({ pct, size = 56, stroke = 5, color = 'var(--bougainvillea)', trackColor = 'var(--cream-dark)' }) {
  const r = (size - stroke * 2) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)', flexShrink: 0 }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={trackColor} strokeWidth={stroke} />
      <circle
        cx={size/2} cy={size/2} r={r} fill="none"
        stroke={color} strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        style={{ transition: 'stroke-dashoffset 0.8s cubic-bezier(0.34,1.56,0.64,1)' }}
      />
    </svg>
  );
}

// ── Greeting based on time of day ────────────────────────────────────────────
function getGreeting(name) {
  const h = new Date().getHours();
  if (h < 12) return `Good morning, ${name}.`;
  if (h < 17) return `Good afternoon, ${name}.`;
  return `Good evening, ${name}.`;
}

// ── Track pill ────────────────────────────────────────────────────────────────
function TrackPill({ trackId }) {
  const t = TRACKS[trackId];
  if (!t) return null;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      padding: '2px 10px', borderRadius: '99px',
      fontSize: '0.7rem', fontWeight: 600,
      fontFamily: 'var(--font-body)',
      background: TRACK_COLORS_LIGHT[trackId],
      color: TRACK_COLORS[trackId],
      letterSpacing: '0.04em',
    }}>
      {t.label} — {t.name}
    </span>
  );
}

// ── Phase badge ───────────────────────────────────────────────────────────────
function PhaseBadge({ phaseId }) {
  const phase = PHASES.find(p => p.id === phaseId);
  if (!phase) return null;
  const isPhase2 = phaseId === 'phase2';
  return (
    <span style={{
      display: 'inline-block',
      padding: '3px 12px', borderRadius: '99px',
      fontSize: '0.7rem', fontWeight: 600,
      background: isPhase2 ? 'var(--peony-light)' : 'var(--lilac-light)',
      color: isPhase2 ? 'var(--peony-dark)' : 'var(--lilac-dark)',
      letterSpacing: '0.04em',
    }}>
      {phase.label}
    </span>
  );
}

// ── Inline progress bar ───────────────────────────────────────────────────────
function ProgressBar({ pct, color = 'linear-gradient(90deg, var(--bougainvillea), var(--peony))', height = 6 }) {
  return (
    <div style={{
      width: '100%', height, background: 'var(--cream-dark)',
      borderRadius: '99px', overflow: 'hidden',
    }}>
      <div style={{
        height: '100%', borderRadius: '99px',
        background: color,
        width: `${pct}%`,
        transition: 'width 0.8s cubic-bezier(0.34,1.56,0.64,1)',
      }} />
    </div>
  );
}

// ── Main HomeScreen ───────────────────────────────────────────────────────────
export default function HomeScreen({ storage, onOpenProgress }) {
  const { data } = storage;
  const [expandFocus, setExpandFocus] = useState(false);
  const currentMonth = MONTHS.find(m => m.id === data.currentMonthId) || MONTHS[0];
  const currentPhase = PHASES.find(p => p.months.includes(currentMonth.id));
  const monthTasks   = getTasksForMonth(currentMonth.id);
  const mProgress    = monthProgress(currentMonth.id, data);
  const oProgress    = overallProgress(data);
  const next         = nextTask(currentMonth.id, data);
  const wins         = allWinsSorted(data);
  const recentWin    = wins[0] || null;
  const unlocked     = getUnlockedMonths(data);

  // Compute tasks done/remaining for the month
  const tasksCompleted = monthTasks.filter(t => data.completedTasks[t.id]).length;
  const tasksTotal     = monthTasks.length;

  // Days in plan
  const daysIn = data.startDate
    ? Math.floor((Date.now() - new Date(data.startDate).getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  return (
    <div style={{ padding: 'var(--space-6)', maxWidth: '560px', margin: '0 auto' }}>

      {/* ── Greeting ── */}
      <div className="animate-fadeIn" style={{ marginBottom: 'var(--space-6)', paddingTop: 'var(--space-2)' }}>
        <h1 style={{
          fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem,5vw,2rem)',
          fontWeight: 600, color: 'var(--ink)', lineHeight: 1.2,
          marginBottom: 'var(--space-1)',
        }}>
          {getGreeting(data.userName)}
        </h1>
        {daysIn > 0 && (
          <p style={{ color: 'var(--bark)', fontSize: '0.875rem' }}>
            Day {daysIn} of your plan.
          </p>
        )}
      </div>

      {/* ── Overall progress strip ── */}
      <div
        className="card animate-fadeIn"
        style={{
          marginBottom: 'var(--space-5)', padding: 'var(--space-4) var(--space-5)',
          cursor: 'pointer', animationDelay: '0.05s',
        }}
        onClick={onOpenProgress}
        role="button"
        tabIndex={0}
        onKeyDown={e => e.key === 'Enter' && onOpenProgress()}
        aria-label="View overall progress"
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--bark)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            Overall progress
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <span style={{
              fontFamily: 'var(--font-display)', fontSize: '1.1rem',
              fontWeight: 600, color: 'var(--bougainvillea)',
            }}>
              {oProgress.pct}%
            </span>
            <span style={{ color: 'var(--bark-light)', fontSize: '0.8rem' }}>→</span>
          </div>
        </div>
        <ProgressBar pct={oProgress.pct} />
        <p style={{ fontSize: '0.75rem', color: 'var(--bark)', marginTop: 'var(--space-2)' }}>
          {oProgress.done} of {oProgress.total} subtasks complete · Tap for full breakdown
        </p>
      </div>

      {/* ── Current focus card ── */}
      <div
        className="card animate-fadeIn"
        style={{
          marginBottom: 'var(--space-5)',
          border: '1px solid var(--border)',
          animationDelay: '0.1s',
          overflow: 'hidden',
        }}
      >
        {/* Card header */}
        <div style={{
          background: 'var(--cream-dark)', margin: 'calc(-1 * var(--space-6)) calc(-1 * var(--space-6)) var(--space-5)',
          padding: 'var(--space-4) var(--space-6)',
          borderBottom: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <PhaseBadge phaseId={currentPhase?.id} />
            <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--ink)' }}>
              {currentMonth.label}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <ProgressRing pct={mProgress.pct} size={44} stroke={4} />
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--bougainvillea)', lineHeight: 1 }}>
                {mProgress.pct}%
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--bark)' }}>
                {tasksCompleted}/{tasksTotal} tasks
              </div>
            </div>
          </div>
        </div>

        {/* Month title */}
        <div style={{ marginBottom: 'var(--space-4)' }}>
          <h2 style={{
            fontFamily: 'var(--font-display)', fontSize: '1.15rem',
            color: 'var(--ink)', marginBottom: '2px',
          }}>
            {currentMonth.title}
          </h2>
          <p style={{ fontSize: '0.8375rem', color: 'var(--bark)', fontStyle: 'italic' }}>
            {currentMonth.subtitle}
          </p>
        </div>

        {/* Next task */}
        {next ? (
          <div style={{
            background: 'var(--cream)', borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border)',
            padding: 'var(--space-4)',
          }}>
            <div style={{
              display: 'flex', alignItems: 'flex-start', gap: 'var(--space-3)',
            }}>
              <div style={{
                width: 8, height: 8, borderRadius: '50%',
                background: TRACK_COLORS[next.trackId],
                marginTop: 6, flexShrink: 0,
              }} />
              <div style={{ flex: 1 }}>
                <div style={{ marginBottom: 'var(--space-1)' }}>
                  <TrackPill trackId={next.trackId} />
                </div>
                <p style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--ink)', marginBottom: '2px' }}>
                  {next.label}: {next.title}
                </p>
                {next.timeBox && (
                  <p style={{ fontSize: '0.75rem', color: 'var(--bark)' }}>⏱ {next.timeBox}</p>
                )}
                {expandFocus && (
                  <p style={{ fontSize: '0.8375rem', color: 'var(--ink-light)', marginTop: 'var(--space-2)', lineHeight: 1.6 }}>
                    {next.body.slice(0, 180)}{next.body.length > 180 ? '…' : ''}
                  </p>
                )}
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'var(--space-3)' }}>
              <button
                className="btn-ghost"
                onClick={() => setExpandFocus(v => !v)}
                style={{ fontSize: '0.8125rem' }}
              >
                {expandFocus ? 'Less ↑' : 'Preview ↓'}
              </button>
            </div>
          </div>
        ) : (
          <div style={{
            background: 'var(--sage-light)', borderRadius: 'var(--radius-md)',
            padding: 'var(--space-4)', textAlign: 'center',
          }}>
            <p style={{ fontSize: '1.25rem', marginBottom: 'var(--space-1)' }}>🎉</p>
            <p style={{ fontWeight: 600, color: 'var(--sage)', fontSize: '0.9375rem' }}>
              All tasks in this month are complete!
            </p>
            {unlocked.size < MONTHS.length && (
              <p style={{ fontSize: '0.8125rem', color: 'var(--bark)', marginTop: 'var(--space-1)' }}>
                Head to the Plan tab to move forward.
              </p>
            )}
          </div>
        )}
      </div>

      {/* ── Recent win teaser ── */}
      {recentWin && (
        <div
          className="card card-hover animate-fadeIn"
          style={{ marginBottom: 'var(--space-5)', animationDelay: '0.15s', cursor: 'pointer' }}
          onClick={() => {/* navigate to wins — handled by parent */ }}
          role="button"
          tabIndex={0}
          aria-label="View wins log"
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-3)' }}>
            <div style={{ fontSize: '1.5rem', lineHeight: 1 }}>⭐</div>
            <div style={{ flex: 1 }}>
              <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
                marginBottom: '4px',
              }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--bark)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Most recent win
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--bark-light)' }}>
                  {formatDate(recentWin.date)}
                </span>
              </div>
              <p style={{ fontSize: '0.9rem', color: 'var(--ink)', lineHeight: 1.5 }}>
                {recentWin.text}
              </p>
              {wins.length > 1 && (
                <p style={{ fontSize: '0.75rem', color: 'var(--bougainvillea)', marginTop: 'var(--space-2)' }}>
                  + {wins.length - 1} more win{wins.length > 2 ? 's' : ''} →
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Empty state (no wins yet) ── */}
      {!recentWin && (
        <div
          className="animate-fadeIn"
          style={{
            marginBottom: 'var(--space-5)',
            background: 'var(--cream-dark)', borderRadius: 'var(--radius-lg)',
            padding: 'var(--space-5)', textAlign: 'center',
            border: '1px dashed var(--border-strong)',
            animationDelay: '0.15s',
          }}
        >
          <p style={{ fontSize: '1.25rem', marginBottom: 'var(--space-2)' }}>🌱</p>
          <p style={{ fontSize: '0.875rem', color: 'var(--bark)', lineHeight: 1.6 }}>
            Your wins will appear here as you check off tasks.
            Complete your first task to get started.
          </p>
        </div>
      )}

      {/* ── Quick actions ── */}
      <div className="animate-fadeIn" style={{ animationDelay: '0.2s' }}>
        <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--bark)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 'var(--space-3)' }}>
          Quick access
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
          {[
            { emoji: '📊', label: 'Full progress', sub: `${oProgress.pct}% complete`, action: onOpenProgress, color: 'var(--bougainvillea-light)' },
            { emoji: '📋', label: 'View plan', sub: `${currentMonth.label} active`, action: null, color: 'var(--lilac-light)' },
            { emoji: '📓', label: 'Write in journal', sub: 'Capture a thought', action: null, color: 'var(--gold-light)' },
            { emoji: '💡', label: 'Reference', sub: 'Your north star', action: null, color: 'var(--sage-light)' },
          ].map(({ emoji, label, sub, action, color }) => (
            <button
              key={label}
              onClick={action || undefined}
              style={{
                background: color, border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)', padding: 'var(--space-4)',
                textAlign: 'left', cursor: action ? 'pointer' : 'default',
                transition: 'all 0.18s ease',
                opacity: action ? 1 : 0.7,
              }}
              onMouseEnter={e => { if (action) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; } }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              <div style={{ fontSize: '1.25rem', marginBottom: 'var(--space-1)' }}>{emoji}</div>
              <div style={{ fontWeight: 600, fontSize: '0.8375rem', color: 'var(--ink)', marginBottom: '2px' }}>{label}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--bark)' }}>{sub}</div>
            </button>
          ))}
        </div>
      </div>

      <div style={{ height: 'var(--space-8)' }} />

      <div style={{ height: 'var(--space-8)' }} />

    </div>
  );
}

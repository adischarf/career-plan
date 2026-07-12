import React, { useState, useCallback } from 'react';
import {
  MONTHS, PHASES, TRACKS, TASKS,
  getTasksForMonth, getTaskById,
} from '../data/planData';
import {
  monthProgress, taskProgress, isMonthComplete,
  isTrackComplete, isPhaseComplete,
  getUnlockedMonths, TRACK_COLORS, TRACK_COLORS_LIGHT,
} from '../utils/progress';
import { getWeekKey } from '../hooks/useStorage';
import FlowerCelebration from '../components/FlowerCelebration';

// ── Small helpers ─────────────────────────────────────────────────────────────
function ProgressBar({ pct, color, height = 5 }) {
  return (
    <div style={{ width: '100%', height, background: 'var(--cream-dark)', borderRadius: '99px', overflow: 'hidden' }}>
      <div style={{
        height: '100%', borderRadius: '99px',
        background: color || 'linear-gradient(90deg, var(--bougainvillea), var(--peony))',
        width: `${pct}%`,
        transition: 'width 0.7s cubic-bezier(0.34,1.56,0.64,1)',
      }} />
    </div>
  );
}

function TrackPill({ trackId, small }) {
  const t = TRACKS[trackId];
  if (!t) return null;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      padding: small ? '2px 8px' : '3px 10px',
      borderRadius: '99px',
      fontSize: small ? '0.68rem' : '0.72rem',
      fontWeight: 600,
      fontFamily: 'var(--font-body)',
      background: TRACK_COLORS_LIGHT[trackId],
      color: TRACK_COLORS[trackId],
      letterSpacing: '0.03em',
      whiteSpace: 'nowrap',
    }}>
      {t.label}
    </span>
  );
}

// ── Checkbox ──────────────────────────────────────────────────────────────────
function Checkbox({ checked, onChange, color = 'var(--bougainvillea)', size = 22 }) {
  return (
    <button
      onClick={onChange}
      aria-label={checked ? 'Mark incomplete' : 'Mark complete'}
      style={{
        width: size, height: size, borderRadius: 6,
        border: `2px solid ${checked ? color : 'var(--border-strong)'}`,
        background: checked ? color : 'var(--white)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', flexShrink: 0, transition: 'all 0.15s ease',
      }}
    >
      {checked && (
        <svg width="11" height="8" viewBox="0 0 11 8" fill="none">
          <path d="M1 4L4 7L10 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </button>
  );
}

// ── Habit petal row ───────────────────────────────────────────────────────────
function HabitPetalRow({ taskId, habitLogs, onLogHabit, color }) {
  const thisWeek = getWeekKey();
  // Show last 8 weeks
  const weeks = [];
  const now = new Date();
  for (let i = 7; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i * 7);
    weeks.push(getWeekKey(d));
  }

  return (
    <div style={{ marginTop: 'var(--space-3)' }}>
      <p style={{ fontSize: '0.72rem', color: 'var(--bark)', marginBottom: 'var(--space-2)', fontWeight: 500 }}>
        Weekly habit tracker
      </p>
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
        {weeks.map(wk => {
          const done = !!(habitLogs[taskId] || {})[wk];
          const isCurrent = wk === thisWeek;
          return (
            <button
              key={wk}
              onClick={() => onLogHabit(taskId, wk)}
              title={wk + (isCurrent ? ' (this week)' : '')}
              aria-label={`Week ${wk}: ${done ? 'done' : 'not done'}`}
              style={{
                width: 28, height: 28,
                borderRadius: '50%',
                border: isCurrent ? `2px solid ${color}` : '2px solid var(--border)',
                background: done ? color : 'var(--white)',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                position: 'relative',
              }}
            >
              {done ? (
                // Petal shape inside
                <svg width="14" height="14" viewBox="0 0 14 14">
                  <ellipse cx="7" cy="7" rx="4" ry="5.5" fill="white" opacity="0.8" transform="rotate(-30 7 7)" />
                  <circle cx="7" cy="7" r="2" fill="white" opacity="0.6" />
                </svg>
              ) : isCurrent ? (
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: color }} />
              ) : null}
            </button>
          );
        })}
        <span style={{ fontSize: '0.7rem', color: 'var(--bark)', alignSelf: 'center', marginLeft: 4 }}>
          {Object.values(habitLogs[taskId] || {}).filter(Boolean).length}×
        </span>
      </div>
    </div>
  );
}

// ── Output link section ───────────────────────────────────────────────────────
function OutputLinkSection({ taskId, outputLinks, onSave }) {
  const existing = outputLinks[taskId];
  const [editing, setEditing] = useState(!existing);
  const [label, setLabel] = useState(existing?.label || '');
  const [url, setUrl]     = useState(existing?.url || '');

  const handleSave = () => {
    if (url.trim()) { onSave(taskId, label.trim() || 'Output', url.trim()); setEditing(false); }
  };

  if (!editing && existing) {
    return (
      <div style={{ marginTop: 'var(--space-3)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '0.75rem', color: 'var(--bark)' }}>📎 Output:</span>
        <a
          href={existing.url} target="_blank" rel="noopener noreferrer"
          style={{ fontSize: '0.8125rem', color: 'var(--bougainvillea)', fontWeight: 500 }}
        >
          {existing.label}
        </a>
        <button
          className="btn-ghost"
          onClick={() => { setLabel(existing.label); setUrl(existing.url); setEditing(true); }}
          style={{ fontSize: '0.72rem' }}
        >
          Edit
        </button>
      </div>
    );
  }

  return (
    <div style={{ marginTop: 'var(--space-3)', background: 'var(--cream)', borderRadius: 'var(--radius-sm)', padding: 'var(--space-3)', border: '1px solid var(--border)' }}>
      <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--bark)', marginBottom: 'var(--space-2)' }}>📎 Link your output</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
        <input
          value={label}
          onChange={e => setLabel(e.target.value)}
          placeholder="Label (e.g. First one-pager draft)"
          style={{
            border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)',
            padding: '6px 10px', fontSize: '0.8125rem', fontFamily: 'var(--font-body)',
            background: 'var(--white)', color: 'var(--ink)', outline: 'none',
          }}
        />
        <input
          value={url}
          onChange={e => setUrl(e.target.value)}
          placeholder="Google Drive link (or any URL)"
          style={{
            border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)',
            padding: '6px 10px', fontSize: '0.8125rem', fontFamily: 'var(--font-body)',
            background: 'var(--white)', color: 'var(--ink)', outline: 'none',
          }}
        />
        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
          <button className="btn-primary" onClick={handleSave} style={{ fontSize: '0.8125rem', padding: '6px 16px' }}>Save link</button>
          {existing && <button className="btn-ghost" onClick={() => setEditing(false)} style={{ fontSize: '0.8125rem' }}>Cancel</button>}
        </div>
      </div>
    </div>
  );
}

// ── Task card ─────────────────────────────────────────────────────────────────
function TaskCard({ task, data, storage, onCrossRefClick, onCelebrate }) {
  const [expanded, setExpanded]       = useState(false);
  const [showHelp, setShowHelp]       = useState(false);
  const [showJournal, setShowJournal] = useState(false);
  const [journalText, setJournalText] = useState('');

  const { toggleSubtask, markTaskComplete, unmarkTaskComplete,
          logHabit, saveOutputLink, addJournalEntry } = storage;

  const tp    = taskProgress(task, data);
  const color = TRACK_COLORS[task.trackId];
  const isComplete = data.completedTasks[task.id];

  // Check if all subtasks are done → auto-suggest marking complete
  const allSubsDone = task.subtasks?.length > 0 &&
    task.subtasks.every(s => (data.completedSubtasks[task.id] || {})[s.id]);

  const handleToggleSub = (subtaskId) => {
    toggleSubtask(task.id, subtaskId);
  };

  const handleMarkComplete = () => {
    markTaskComplete(task.id, task.winText);
    onCelebrate && onCelebrate(task);
  };

  const handleUnmark = () => unmarkTaskComplete(task.id);

  const handleJournalSubmit = () => {
    if (journalText.trim()) {
      addJournalEntry(journalText.trim(), task.id);
      setJournalText('');
      setShowJournal(false);
    }
  };

  return (
    <div style={{
      background: isComplete ? 'var(--sage-light)' : 'var(--white)',
      border: `1px solid ${isComplete ? 'var(--sage)' : 'var(--border)'}`,
      borderRadius: 'var(--radius-md)',
      borderLeft: `4px solid ${color}`,
      marginBottom: 'var(--space-3)',
      overflow: 'hidden',
      transition: 'all 0.2s ease',
      opacity: isComplete ? 0.85 : 1,
    }}>
      {/* ── Task header ── */}
      <button
        onClick={() => setExpanded(v => !v)}
        style={{
          width: '100%', background: 'none', border: 'none',
          padding: 'var(--space-4) var(--space-5)',
          display: 'flex', alignItems: 'flex-start', gap: 'var(--space-3)',
          cursor: 'pointer', textAlign: 'left',
        }}
      >
        {/* Progress mini-ring or check */}
        <div style={{ marginTop: 2, flexShrink: 0 }}>
          {isComplete ? (
            <div style={{
              width: 22, height: 22, borderRadius: '50%',
              background: 'var(--sage)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="11" height="8" viewBox="0 0 11 8" fill="none">
                <path d="M1 4L4 7L10 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          ) : (
            <div style={{
              width: 22, height: 22, borderRadius: '50%',
              border: `2px solid ${tp.pct > 0 ? color : 'var(--border-strong)'}`,
              background: 'var(--white)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              position: 'relative',
            }}>
              {tp.pct > 0 && tp.pct < 100 && (
                <div style={{
                  width: 10, height: 10, borderRadius: '50%',
                  background: color, opacity: 0.5,
                }} />
              )}
            </div>
          )}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', flexWrap: 'wrap', marginBottom: 4 }}>
            <TrackPill trackId={task.trackId} small />
            {task.isRecurring && (
              <span style={{ fontSize: '0.68rem', color: 'var(--bark)', background: 'var(--cream-dark)', padding: '2px 7px', borderRadius: '99px' }}>
                🔄 Recurring
              </span>
            )}
            {task.timeBox && (
              <span style={{ fontSize: '0.68rem', color: 'var(--bark)' }}>⏱ {task.timeBox}</span>
            )}
          </div>
          <p style={{
            fontWeight: 600, fontSize: '0.9rem', color: 'var(--ink)',
            lineHeight: 1.4,
            textDecoration: isComplete ? 'line-through' : 'none',
          }}>
            <span style={{ color: 'var(--bark)', fontWeight: 700 }}>{task.label}</span>
            {' '}{task.title}
          </p>

          {/* Progress bar (if subtasks) */}
          {task.subtasks?.length > 0 && !isComplete && (
            <div style={{ marginTop: 'var(--space-2)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--bark)' }}>{tp.done}/{tp.total} subtasks</span>
                <span style={{ fontSize: '0.7rem', color: tp.pct > 0 ? color : 'var(--bark-light)', fontWeight: 600 }}>{tp.pct}%</span>
              </div>
              <ProgressBar pct={tp.pct} color={color} height={4} />
            </div>
          )}
        </div>

        {/* Expand chevron */}
        <span style={{ color: 'var(--bark-light)', fontSize: '0.75rem', marginTop: 4, flexShrink: 0, transition: 'transform 0.2s ease', transform: expanded ? 'rotate(180deg)' : 'none' }}>
          ▼
        </span>
      </button>

      {/* ── Expanded body ── */}
      {expanded && (
        <div style={{ padding: '0 var(--space-5) var(--space-5)', borderTop: '1px solid var(--border)' }}>
          {/* Task body prose */}
          <p style={{ fontSize: '0.875rem', color: 'var(--ink-light)', lineHeight: 1.7, marginTop: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
            {task.body}
          </p>

          {/* Contextual help */}
          {task.contextualHelp && (
            <div style={{ marginBottom: 'var(--space-4)' }}>
              {showHelp ? (
                <div style={{
                  background: 'var(--lilac-light)', borderRadius: 'var(--radius-sm)',
                  padding: 'var(--space-4)', border: '1px solid var(--lilac)',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-2)' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--lilac-dark)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      More context
                    </span>
                    <button className="btn-ghost" onClick={() => setShowHelp(false)} style={{ fontSize: '0.75rem', color: 'var(--lilac-dark)' }}>
                      Close ✕
                    </button>
                  </div>
                  <p style={{ fontSize: '0.8375rem', color: 'var(--ink-light)', lineHeight: 1.7, whiteSpace: 'pre-line' }}>
                    {task.contextualHelp}
                  </p>
                </div>
              ) : (
                <button
                  className="btn-ghost"
                  onClick={() => setShowHelp(true)}
                  style={{ fontSize: '0.8125rem', color: 'var(--lilac-dark)', padding: '4px 10px', background: 'var(--lilac-light)', borderRadius: 'var(--radius-sm)' }}
                >
                  📖 Read more
                </button>
              )}
            </div>
          )}

          {/* Cross-references */}
          {task.crossRefs?.length > 0 && (
            <div style={{ marginBottom: 'var(--space-4)', display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap', alignItems: 'center' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--bark)' }}>See also:</span>
              {task.crossRefs.map(refId => {
                const refTask = getTaskById(refId);
                return refTask ? (
                  <button
                    key={refId}
                    onClick={() => onCrossRefClick(refTask)}
                    style={{
                      fontSize: '0.75rem', fontWeight: 600,
                      color: TRACK_COLORS[refTask.trackId],
                      background: TRACK_COLORS_LIGHT[refTask.trackId],
                      border: 'none', borderRadius: '99px',
                      padding: '3px 10px', cursor: 'pointer',
                    }}
                  >
                    ↗ {refId}: {refTask.title}
                  </button>
                ) : null;
              })}
            </div>
          )}

          {/* Subtasks */}
          {task.subtasks?.length > 0 && !task.isRecurring && (
            <div style={{ marginBottom: 'var(--space-4)' }}>
              <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--bark)', marginBottom: 'var(--space-2)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Subtasks
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                {task.subtasks.map(sub => {
                  const checked = !!(data.completedSubtasks[task.id] || {})[sub.id];
                  return (
                    <label
                      key={sub.id}
                      style={{
                        display: 'flex', alignItems: 'flex-start', gap: 'var(--space-3)',
                        cursor: 'pointer', padding: '6px 0',
                      }}
                    >
                      <Checkbox
                        checked={checked}
                        onChange={() => handleToggleSub(sub.id)}
                        color={color}
                        size={20}
                      />
                      <span style={{
                        fontSize: '0.875rem', color: checked ? 'var(--bark)' : 'var(--ink-light)',
                        textDecoration: checked ? 'line-through' : 'none',
                        lineHeight: 1.5,
                      }}>
                        {sub.text}
                      </span>
                    </label>
                  );
                })}
              </div>

              {/* Auto-suggest mark complete when all subs done */}
              {allSubsDone && !isComplete && (
                <div style={{
                  marginTop: 'var(--space-4)', background: 'var(--sage-light)',
                  borderRadius: 'var(--radius-sm)', padding: 'var(--space-3)',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  gap: 'var(--space-3)',
                }}>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--sage)', fontWeight: 500 }}>
                    ✨ All subtasks done! Mark this task complete?
                  </p>
                  <button
                    className="btn-primary"
                    onClick={handleMarkComplete}
                    style={{ background: 'var(--sage)', fontSize: '0.8125rem', padding: '6px 14px', whiteSpace: 'nowrap' }}
                  >
                    Mark complete
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Habit tracker (for recurring tasks) */}
          {task.isRecurring && (
            <div style={{ marginBottom: 'var(--space-4)' }}>
              {task.recurringDescription && (
                <p style={{ fontSize: '0.8125rem', color: 'var(--bark)', fontStyle: 'italic', marginBottom: 'var(--space-2)' }}>
                  {task.recurringDescription}
                </p>
              )}
              <HabitPetalRow
                taskId={task.id}
                habitLogs={data.habitLogs}
                onLogHabit={logHabit}
                color={color}
              />
            </div>
          )}

          {/* Output link */}
          {task.hasOutput && (
            <OutputLinkSection
              taskId={task.id}
              outputLinks={data.outputLinks}
              onSave={saveOutputLink}
            />
          )}

          {/* Journal note */}
          <div style={{ marginTop: 'var(--space-4)', borderTop: '1px solid var(--border)', paddingTop: 'var(--space-3)' }}>
            {/* Existing task-linked journal entries */}
            {data.journalEntries.filter(e => e.taskId === task.id).slice(-2).map(e => (
              <div key={e.id} style={{
                background: 'var(--gold-light)', borderRadius: 'var(--radius-sm)',
                padding: 'var(--space-3)', marginBottom: 'var(--space-2)',
                border: '1px solid var(--gold)',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--gold)' }}>📓 Your note</span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--bark)' }}>
                    {new Date(e.date).toLocaleDateString('en-US', { month:'short', day:'numeric' })}
                  </span>
                </div>
                <p style={{ fontSize: '0.8125rem', color: 'var(--ink-light)', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                  {e.text}
                </p>
              </div>
            ))}

            {showJournal ? (
              <div style={{ marginTop: 'var(--space-2)' }}>
                <textarea
                  value={journalText}
                  onChange={e => setJournalText(e.target.value)}
                  placeholder="Write a note about this task…"
                  rows={3}
                  style={{
                    width: '100%', border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '8px 12px', fontSize: '0.875rem',
                    fontFamily: 'var(--font-body)', color: 'var(--ink)',
                    background: 'var(--white)', resize: 'vertical',
                    outline: 'none', lineHeight: 1.6,
                  }}
                  autoFocus
                />
                <div style={{ display: 'flex', gap: 'var(--space-2)', marginTop: 'var(--space-2)' }}>
                  <button
                    className="btn-primary"
                    onClick={handleJournalSubmit}
                    style={{ fontSize: '0.8125rem', padding: '6px 14px' }}
                  >
                    Save note
                  </button>
                  <button
                    className="btn-ghost"
                    onClick={() => { setShowJournal(false); setJournalText(''); }}
                    style={{ fontSize: '0.8125rem' }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                className="btn-ghost"
                onClick={() => setShowJournal(true)}
                style={{ fontSize: '0.8125rem', color: 'var(--bark)' }}
              >
                📓 Add journal note
              </button>
            )}
          </div>

          {/* Mark complete / unmark — for tasks without subtasks, or override */}
          <div style={{ marginTop: 'var(--space-4)', display: 'flex', justifyContent: 'flex-end' }}>
            {isComplete ? (
              <button
                className="btn-ghost"
                onClick={handleUnmark}
                style={{ fontSize: '0.8125rem', color: 'var(--bark)' }}
              >
                Unmark complete
              </button>
            ) : !task.subtasks?.length ? (
              <button
                className="btn-primary"
                onClick={handleMarkComplete}
                style={{ fontSize: '0.8125rem', padding: '6px 16px' }}
              >
                Mark complete ✓
              </button>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Cross-reference modal (overlay) ──────────────────────────────────────────
function CrossRefModal({ task, data, storage, onClose }) {
  if (!task) return null;
  const tp = taskProgress(task, data);
  const color = TRACK_COLORS[task.trackId];

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(44,40,37,0.5)',
        zIndex: 500, display: 'flex', alignItems: 'flex-end',
        padding: 'var(--space-4)',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        className="card animate-slideUp"
        style={{
          width: '100%', maxWidth: '560px', margin: '0 auto',
          maxHeight: '70vh', overflowY: 'auto',
          borderLeft: `4px solid ${color}`,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-4)' }}>
          <div>
            <TrackPill trackId={task.trackId} />
            <h3 style={{ fontFamily: 'var(--font-display)', marginTop: 'var(--space-2)', color: 'var(--ink)' }}>
              {task.label}: {task.title}
            </h3>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--bark)', fontSize: '1.1rem', padding: 'var(--space-1)' }}>✕</button>
        </div>

        <p style={{ fontSize: '0.875rem', color: 'var(--ink-light)', lineHeight: 1.7, marginBottom: 'var(--space-4)' }}>
          {task.body}
        </p>

        {task.subtasks?.length > 0 && (
          <div>
            <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--bark)', marginBottom: 'var(--space-2)' }}>
              Progress: {tp.done}/{tp.total} subtasks · {tp.pct}%
            </p>
            <ProgressBar pct={tp.pct} color={color} />
          </div>
        )}

        <button className="btn-secondary" onClick={onClose} style={{ marginTop: 'var(--space-5)', width: '100%' }}>
          Back
        </button>
      </div>
    </div>
  );
}

// ── Month section ─────────────────────────────────────────────────────────────
function MonthSection({ month, data, storage, isUnlocked, isCurrent, onSetCurrent, onCelebrate }) {
  const [collapsed, setCollapsed] = useState(!isCurrent);
  const tasks   = getTasksForMonth(month.id);
  const mProg   = monthProgress(month.id, data);
  const complete = isMonthComplete(month.id, data);

  // Group tasks by track for display
  const trackIds = [...new Set(tasks.map(t => t.trackId))];

  if (!isUnlocked) {
    return (
      <div style={{
        marginBottom: 'var(--space-4)',
        background: 'var(--cream-dark)', borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border)',
        padding: 'var(--space-5)', opacity: 0.6,
        display: 'flex', alignItems: 'center', gap: 'var(--space-4)',
      }}>
        <div style={{ fontSize: '1.5rem' }}>🔒</div>
        <div>
          <p style={{ fontWeight: 600, color: 'var(--ink)', fontSize: '0.9rem' }}>{month.label}</p>
          <p style={{ fontSize: '0.8rem', color: 'var(--bark)' }}>
            Complete 70% of {MONTHS[MONTHS.findIndex(m => m.id === month.id) - 1]?.label || 'the previous month'} to unlock
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ marginBottom: 'var(--space-5)' }}>
      {/* Month header */}
      <button
        onClick={() => { setCollapsed(v => !v); if (collapsed) onSetCurrent(month.id); }}
        style={{
          width: '100%', background: 'none', border: 'none',
          cursor: 'pointer', textAlign: 'left', marginBottom: 'var(--space-3)',
        }}
      >
        <div style={{
          background: complete ? 'var(--sage)' : isCurrent ? 'var(--bougainvillea)' : 'var(--ink)',
          borderRadius: 'var(--radius-md)',
          padding: 'var(--space-4) var(--space-5)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          transition: 'all 0.2s ease',
        }}>
          <div>
            <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.7)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 2 }}>
              {PHASES.find(p => p.months.includes(month.id))?.label}
              {complete && ' · Complete ✓'}
              {isCurrent && !complete && ' · Current'}
            </p>
            <h3 style={{ fontFamily: 'var(--font-display)', color: 'white', fontSize: '1.05rem', lineHeight: 1.2 }}>
              {month.label}: {month.title}
            </h3>
            <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.75)', marginTop: 2, fontStyle: 'italic' }}>
              {month.subtitle}
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', flexShrink: 0 }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'white', lineHeight: 1 }}>
                {mProg.pct}%
              </div>
              <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.7)' }}>
                {tasks.filter(t => data.completedTasks[t.id]).length}/{tasks.length} tasks
              </div>
            </div>
            <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem', transition: 'transform 0.2s ease', transform: collapsed ? 'none' : 'rotate(180deg)' }}>
              ▼
            </span>
          </div>
        </div>
        {/* Month progress bar */}
        <div style={{ marginTop: 4 }}>
          <ProgressBar pct={mProg.pct} color={complete ? 'var(--sage)' : 'var(--bougainvillea)'} height={4} />
        </div>
      </button>

      {/* Tasks (collapsed/expanded) */}
      {!collapsed && (
        <div className="animate-fadeIn">
          {trackIds.map(trackId => {
            const trackTasks = tasks.filter(t => t.trackId === trackId);
            const track = TRACKS[trackId];
            const [crossRef, setCrossRef] = React.useState(null);
            return (
              <div key={trackId} style={{ marginBottom: 'var(--space-4)' }}>
                {/* Track sub-header */}
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 'var(--space-2)',
                  marginBottom: 'var(--space-2)',
                  padding: '0 var(--space-1)',
                }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: TRACK_COLORS[trackId], flexShrink: 0 }} />
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: TRACK_COLORS[trackId], textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                    {track.label} — {track.name}
                  </span>
                </div>

                {trackTasks.map(task => (
                  <React.Fragment key={task.id}>
                    <TaskCard
                      task={task}
                      data={data}
                      storage={storage}
                      onCrossRefClick={setCrossRef}
                      onCelebrate={onCelebrate}
                    />
                    {crossRef && (
                      <CrossRefModal
                        task={crossRef}
                        data={data}
                        storage={storage}
                        onClose={() => setCrossRef(null)}
                      />
                    )}
                  </React.Fragment>
                ))}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Main PlanScreen ───────────────────────────────────────────────────────────
export default function PlanScreen({ storage }) {
  const { data, setCurrentMonth } = storage;
  const [celebration, setCelebration] = useState(null); // { type, text, message }

  const unlocked = getUnlockedMonths(data);

  const handleCelebrate = useCallback((completedTask) => {
    // Check if this completion triggers a month/track/phase celebration
    const monthId = completedTask.monthId;
    const month   = MONTHS.find(m => m.id === monthId);
    const phase   = PHASES.find(p => p.months.includes(monthId));

    // Small delay so the task completion animation settles first
    setTimeout(() => {
      if (isMonthComplete(monthId, data)) {
        setCelebration({
          type: month.celebrationFlower,
          text: month.celebrationText,
          message: month.celebrationMessage,
        });
        return;
      }
      if (isTrackComplete(completedTask.trackId, data)) {
        const track = TRACKS[completedTask.trackId];
        setCelebration({
          type: 'peony',
          text: `${track.label} Complete!`,
          message: `Every task in ${track.name} is done. That's a track.`,
        });
        return;
      }
      if (phase && isPhaseComplete(phase.id, data)) {
        setCelebration({
          type: phase.celebrationFlower,
          text: phase.celebrationText,
          message: phase.celebrationMessage,
        });
      }
    }, 400);
  }, [data]);

  return (
    <div style={{ padding: 'var(--space-6)', maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ paddingTop: 'var(--space-2)', marginBottom: 'var(--space-6)' }}>
        <h1 style={{
          fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem,5vw,1.9rem)',
          color: 'var(--ink)', marginBottom: 'var(--space-1)',
        }}>
          Your Plan
        </h1>
        <p style={{ color: 'var(--bark)', fontSize: '0.875rem' }}>
          Work through tasks at your own pace. New months unlock as you progress.
        </p>
      </div>

      {/* Phase banners + months */}
      {PHASES.map(phase => (
        <div key={phase.id} style={{ marginBottom: 'var(--space-6)' }}>
          {/* Phase label */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 'var(--space-3)',
            marginBottom: 'var(--space-4)',
          }}>
            <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
            <span style={{
              fontSize: '0.75rem', fontWeight: 700, color: 'var(--bark)',
              textTransform: 'uppercase', letterSpacing: '0.1em',
              whiteSpace: 'nowrap',
            }}>
              {phase.label} · {phase.name}
            </span>
            <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
          </div>

          {/* Months in this phase */}
          {MONTHS.filter(m => phase.months.includes(m.id)).map(month => (
            <MonthSection
              key={month.id}
              month={month}
              data={data}
              storage={storage}
              isUnlocked={unlocked.has(month.id)}
              isCurrent={data.currentMonthId === month.id}
              onSetCurrent={setCurrentMonth}
              onCelebrate={handleCelebrate}
            />
          ))}
        </div>
      ))}

      <div style={{ height: 'var(--space-8)' }} />

      {/* ── Celebration modal ── */}
      {celebration && (
        <FlowerCelebration
          type={celebration.type}
          text={celebration.text}
          message={celebration.message}
          migraineMode={data.migraineMode}
          onClose={() => setCelebration(null)}
        />
      )}
    </div>
  );
}

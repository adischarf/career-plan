import React, { useState } from 'react';
import { getTaskById } from '../data/planData';
import { formatDate, TRACK_COLORS, TRACK_COLORS_LIGHT } from '../utils/progress';

// ── Win card ──────────────────────────────────────────────────────────────────
function WinCard({ win, onEdit, onDelete, index }) {
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(win.text);
  const [showDelete, setShowDelete] = useState(false);

  const linkedTask = win.taskId ? getTaskById(win.taskId) : null;

  const handleSave = () => {
    if (editText.trim()) { onEdit(win.id, editText.trim()); setEditing(false); }
  };

  return (
    <div
      className="animate-fadeIn"
      style={{
        background: 'var(--white)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-md)',
        padding: 'var(--space-4) var(--space-5)',
        marginBottom: 'var(--space-3)',
        animationDelay: `${index * 0.04}s`,
        position: 'relative',
      }}
    >
      {/* Top row: date + type badge */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: 'var(--space-2)', gap: 'var(--space-2)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '1rem' }}>{win.auto ? '⭐' : '✨'}</span>
          {win.auto ? (
            <span style={{
              fontSize: '0.7rem', fontWeight: 600,
              background: 'var(--sage-light)', color: 'var(--sage)',
              padding: '2px 8px', borderRadius: '99px',
            }}>
              Task complete
            </span>
          ) : (
            <span style={{
              fontSize: '0.7rem', fontWeight: 600,
              background: 'var(--gold-light)', color: 'var(--gold)',
              padding: '2px 8px', borderRadius: '99px',
            }}>
              Your win
            </span>
          )}
          {linkedTask && (
            <span style={{
              fontSize: '0.7rem',
              background: TRACK_COLORS_LIGHT[linkedTask.trackId],
              color: TRACK_COLORS[linkedTask.trackId],
              padding: '2px 8px', borderRadius: '99px', fontWeight: 500,
            }}>
              {linkedTask.label}
            </span>
          )}
        </div>
        <span style={{ fontSize: '0.75rem', color: 'var(--bark-light)', flexShrink: 0 }}>
          {formatDate(win.date)}
        </span>
      </div>

      {/* Win text */}
      {editing ? (
        <div>
          <textarea
            value={editText}
            onChange={e => setEditText(e.target.value)}
            rows={2}
            style={{
              width: '100%', border: '1px solid var(--border)',
              borderRadius: 'var(--radius-sm)',
              padding: '8px 10px', fontSize: '0.875rem',
              fontFamily: 'var(--font-body)', color: 'var(--ink)',
              background: 'var(--white)', resize: 'none', outline: 'none',
              lineHeight: 1.5,
            }}
            autoFocus
          />
          <div style={{ display: 'flex', gap: 'var(--space-2)', marginTop: 'var(--space-2)' }}>
            <button
              onClick={handleSave}
              style={{
                background: 'var(--bougainvillea)', color: 'white',
                border: 'none', borderRadius: 'var(--radius-xl)',
                padding: '5px 14px', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 500,
              }}
            >Save</button>
            <button
              onClick={() => { setEditing(false); setEditText(win.text); }}
              className="btn-ghost"
              style={{ fontSize: '0.8rem' }}
            >Cancel</button>
          </div>
        </div>
      ) : (
        <p style={{ fontSize: '0.9rem', color: 'var(--ink)', lineHeight: 1.6 }}>
          {win.text}
        </p>
      )}

      {/* Actions (manual wins only) */}
      {!win.auto && !editing && (
        <div style={{ marginTop: 'var(--space-2)', display: 'flex', gap: 'var(--space-1)', justifyContent: 'flex-end' }}>
          {showDelete ? (
            <>
              <span style={{ fontSize: '0.75rem', color: 'var(--bark)', alignSelf: 'center' }}>Remove this win?</span>
              <button
                onClick={() => onDelete(win.id)}
                style={{ background: 'var(--bougainvillea-dark)', color: 'white', border: 'none', borderRadius: 'var(--radius-xl)', padding: '4px 12px', fontSize: '0.75rem', cursor: 'pointer' }}
              >Yes, remove</button>
              <button
                onClick={() => setShowDelete(false)}
                className="btn-ghost"
                style={{ fontSize: '0.75rem' }}
              >Cancel</button>
            </>
          ) : (
            <>
              <button onClick={() => setEditing(true)} className="btn-ghost" style={{ fontSize: '0.75rem' }}>Edit</button>
              <button onClick={() => setShowDelete(true)} className="btn-ghost" style={{ fontSize: '0.75rem', color: 'var(--bark-light)' }}>Remove</button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

// ── Add manual win ────────────────────────────────────────────────────────────
function AddWinForm({ onAdd }) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState('');

  const handleSubmit = () => {
    if (text.trim()) {
      onAdd(text.trim());
      setText('');
      setOpen(false);
    }
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        style={{
          width: '100%',
          border: '2px dashed var(--border-strong)',
          borderRadius: 'var(--radius-md)',
          padding: 'var(--space-4)',
          background: 'none', cursor: 'pointer',
          color: 'var(--bark)', fontSize: '0.875rem',
          fontFamily: 'var(--font-body)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: 'var(--space-2)',
          transition: 'all 0.15s ease',
          marginBottom: 'var(--space-4)',
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--bougainvillea)'; e.currentTarget.style.color = 'var(--bougainvillea)'; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-strong)'; e.currentTarget.style.color = 'var(--bark)'; }}
      >
        <span style={{ fontSize: '1.1rem' }}>✨</span>
        Add a win that's not a task
      </button>
    );
  }

  return (
    <div
      className="card animate-scaleIn"
      style={{ marginBottom: 'var(--space-4)', padding: 'var(--space-4)' }}
    >
      <p style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--bark)', marginBottom: 'var(--space-2)' }}>
        ✨ What's the win?
      </p>
      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="e.g. Had a great conversation with a colleague about the field…"
        rows={3}
        style={{
          width: '100%', border: '1px solid var(--border)',
          borderRadius: 'var(--radius-sm)',
          padding: '8px 12px', fontSize: '0.875rem',
          fontFamily: 'var(--font-body)', color: 'var(--ink)',
          background: 'var(--white)', resize: 'none', outline: 'none',
          lineHeight: 1.6,
        }}
        autoFocus
        onKeyDown={e => { if (e.key === 'Enter' && e.metaKey) handleSubmit(); }}
      />
      <div style={{ display: 'flex', gap: 'var(--space-2)', marginTop: 'var(--space-3)' }}>
        <button
          onClick={handleSubmit}
          className="btn-primary"
          style={{ fontSize: '0.875rem', padding: '7px 18px' }}
        >
          Save win ⭐
        </button>
        <button
          onClick={() => { setOpen(false); setText(''); }}
          className="btn-ghost"
          style={{ fontSize: '0.875rem' }}
        >
          Cancel
        </button>
      </div>
      <p style={{ fontSize: '0.7rem', color: 'var(--bark-light)', marginTop: 'var(--space-2)' }}>
        Tip: ⌘ + Enter to save
      </p>
    </div>
  );
}

// ── Main WinsScreen ───────────────────────────────────────────────────────────
export default function WinsScreen({ storage }) {
  const { data, addManualWin, editManualWin, deleteManualWin } = storage;
  const [filter, setFilter] = useState('all'); // 'all' | 'auto' | 'manual'

  // Merge all wins (auto from manualWins where auto=true, manual where auto=false)
  // Sorted newest first
  const allWins = [...(data.manualWins || [])]
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const filtered = allWins.filter(w => {
    if (filter === 'auto')   return w.auto;
    if (filter === 'manual') return !w.auto;
    return true;
  });

  const autoCount   = allWins.filter(w => w.auto).length;
  const manualCount = allWins.filter(w => !w.auto).length;

  return (
    <div style={{ padding: 'var(--space-6)', maxWidth: '560px', margin: '0 auto' }}>

      {/* Header */}
      <div style={{ paddingTop: 'var(--space-2)', marginBottom: 'var(--space-6)' }}>
        <h1 style={{
          fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem,5vw,1.9rem)',
          color: 'var(--ink)', marginBottom: 'var(--space-1)',
        }}>
          Your Wins
        </h1>
        <p style={{ color: 'var(--bark)', fontSize: '0.875rem' }}>
          {allWins.length === 0
            ? 'Your wins will appear here as you complete tasks.'
            : `${allWins.length} win${allWins.length !== 1 ? 's' : ''} so far — every one of them counts.`}
        </p>
      </div>

      {/* Stats strip */}
      {allWins.length > 0 && (
        <div
          className="animate-fadeIn"
          style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
            gap: 'var(--space-3)', marginBottom: 'var(--space-5)',
          }}
        >
          {[
            { label: 'Total wins', value: allWins.length, color: 'var(--bougainvillea)' },
            { label: 'Tasks complete', value: autoCount, color: 'var(--sage)' },
            { label: 'Your additions', value: manualCount, color: 'var(--gold)' },
          ].map(({ label, value, color }) => (
            <div key={label} style={{
              background: 'var(--white)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)', padding: 'var(--space-4)',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '1.6rem', fontWeight: 700, color, fontFamily: 'var(--font-display)', lineHeight: 1 }}>
                {value}
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--bark)', marginTop: 4 }}>{label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Add manual win */}
      <AddWinForm onAdd={addManualWin} />

      {/* Filter pills */}
      {allWins.length > 0 && (
        <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-4)', flexWrap: 'wrap' }}>
          {[
            { id: 'all',    label: `All (${allWins.length})` },
            { id: 'auto',   label: `Tasks (${autoCount})` },
            { id: 'manual', label: `Your additions (${manualCount})` },
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              style={{
                padding: '5px 14px', borderRadius: '99px', border: 'none',
                fontSize: '0.8rem', fontFamily: 'var(--font-body)', cursor: 'pointer',
                fontWeight: filter === f.id ? 600 : 400,
                background: filter === f.id ? 'var(--ink)' : 'var(--cream-dark)',
                color: filter === f.id ? 'var(--white)' : 'var(--bark)',
                transition: 'all 0.15s ease',
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
      )}

      {/* Wins list */}
      {filtered.length === 0 && allWins.length === 0 && (
        <div style={{
          textAlign: 'center', padding: 'var(--space-12) var(--space-6)',
          color: 'var(--bark)',
        }}>
          <div style={{ fontSize: '3rem', marginBottom: 'var(--space-4)' }}>🌱</div>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', color: 'var(--ink)', marginBottom: 'var(--space-3)' }}>
            Your wins log is waiting
          </p>
          <p style={{ fontSize: '0.875rem', lineHeight: 1.7 }}>
            Every task you complete will automatically appear here.
            You can also add wins that aren't tasks — a good conversation,
            a moment of clarity, anything worth remembering.
          </p>
        </div>
      )}

      {filtered.length === 0 && allWins.length > 0 && (
        <p style={{ textAlign: 'center', color: 'var(--bark)', padding: 'var(--space-8)' }}>
          No wins in this category yet.
        </p>
      )}

      {filtered.map((win, i) => (
        <WinCard
          key={win.id}
          win={win}
          index={i}
          onEdit={editManualWin}
          onDelete={deleteManualWin}
        />
      ))}

      <div style={{ height: 'var(--space-8)' }} />
    </div>
  );
}

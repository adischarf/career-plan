import React, { useState, useRef, useEffect } from 'react';
import { getTaskById } from '../data/planData';
import { formatDate, TRACK_COLORS, TRACK_COLORS_LIGHT } from '../utils/progress';

// ── Journal entry card ────────────────────────────────────────────────────────
function JournalEntryCard({ entry, onEdit, onDelete, index }) {
  const [editing, setEditing]   = useState(false);
  const [editText, setEditText] = useState(entry.text);
  const [showDelete, setShowDelete] = useState(false);
  const textareaRef = useRef(null);

  const linkedTask = entry.taskId ? getTaskById(entry.taskId) : null;

  useEffect(() => {
    if (editing && textareaRef.current) {
      textareaRef.current.focus();
      // Auto-resize
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [editing]);

  const handleSave = () => {
    if (editText.trim()) {
      onEdit(entry.id, editText.trim());
      setEditing(false);
    }
  };

  const formattedDate = new Date(entry.date).toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
  });
  const formattedTime = new Date(entry.date).toLocaleTimeString('en-US', {
    hour: 'numeric', minute: '2-digit',
  });

  return (
    <div
      className="animate-fadeIn"
      style={{
        background: 'var(--white)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-md)',
        padding: 'var(--space-5)',
        marginBottom: 'var(--space-4)',
        animationDelay: `${index * 0.04}s`,
      }}
    >
      {/* Date + task tag */}
      <div style={{ marginBottom: 'var(--space-3)' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
          <div>
            <p style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--ink)', marginBottom: '2px' }}>
              {formattedDate}
            </p>
            <p style={{ fontSize: '0.7rem', color: 'var(--bark-light)' }}>{formattedTime}</p>
          </div>
          {entry.edited && (
            <span style={{ fontSize: '0.68rem', color: 'var(--bark-light)', fontStyle: 'italic' }}>edited</span>
          )}
        </div>

        {/* Task link */}
        {linkedTask && (
          <div style={{ marginTop: 'var(--space-2)' }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 4,
              fontSize: '0.72rem', fontWeight: 600,
              background: TRACK_COLORS_LIGHT[linkedTask.trackId],
              color: TRACK_COLORS[linkedTask.trackId],
              padding: '3px 10px', borderRadius: '99px',
            }}>
              📎 {linkedTask.label}: {linkedTask.title}
            </span>
          </div>
        )}
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: 'var(--border)', marginBottom: 'var(--space-3)' }} />

      {/* Entry text */}
      {editing ? (
        <div>
          <textarea
            ref={textareaRef}
            value={editText}
            onChange={e => {
              setEditText(e.target.value);
              e.target.style.height = 'auto';
              e.target.style.height = e.target.scrollHeight + 'px';
            }}
            style={{
              width: '100%', border: '1px solid var(--border)',
              borderRadius: 'var(--radius-sm)',
              padding: '10px 12px', fontSize: '0.9375rem',
              fontFamily: 'var(--font-display)', color: 'var(--ink)',
              background: 'var(--white)', resize: 'none', outline: 'none',
              lineHeight: 1.7, minHeight: '80px',
            }}
          />
          <div style={{ display: 'flex', gap: 'var(--space-2)', marginTop: 'var(--space-3)' }}>
            <button onClick={handleSave} className="btn-primary" style={{ fontSize: '0.875rem', padding: '7px 16px' }}>Save</button>
            <button onClick={() => { setEditing(false); setEditText(entry.text); }} className="btn-ghost" style={{ fontSize: '0.875rem' }}>Cancel</button>
          </div>
        </div>
      ) : (
        <p style={{
          fontSize: '0.9375rem', color: 'var(--ink)', lineHeight: 1.75,
          fontFamily: 'var(--font-display)',
          whiteSpace: 'pre-wrap',
        }}>
          {entry.text}
        </p>
      )}

      {/* Actions */}
      {!editing && (
        <div style={{ marginTop: 'var(--space-3)', display: 'flex', gap: 'var(--space-1)', justifyContent: 'flex-end' }}>
          {showDelete ? (
            <>
              <span style={{ fontSize: '0.75rem', color: 'var(--bark)', alignSelf: 'center' }}>Delete this entry?</span>
              <button
                onClick={() => onDelete(entry.id)}
                style={{
                  background: 'var(--bougainvillea-dark)', color: 'white',
                  border: 'none', borderRadius: 'var(--radius-xl)',
                  padding: '4px 12px', fontSize: '0.75rem', cursor: 'pointer',
                }}
              >Delete</button>
              <button onClick={() => setShowDelete(false)} className="btn-ghost" style={{ fontSize: '0.75rem' }}>Cancel</button>
            </>
          ) : (
            <>
              <button onClick={() => setEditing(true)} className="btn-ghost" style={{ fontSize: '0.75rem' }}>Edit</button>
              <button onClick={() => setShowDelete(true)} className="btn-ghost" style={{ fontSize: '0.75rem', color: 'var(--bark-light)' }}>Delete</button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

// ── Date separator ────────────────────────────────────────────────────────────
function DateSeparator({ label }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 'var(--space-3)',
      margin: 'var(--space-5) 0 var(--space-3)',
    }}>
      <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
      <span style={{
        fontSize: '0.72rem', fontWeight: 700, color: 'var(--bark)',
        textTransform: 'uppercase', letterSpacing: '0.08em', whiteSpace: 'nowrap',
      }}>
        {label}
      </span>
      <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
    </div>
  );
}

// ── New entry form ────────────────────────────────────────────────────────────
function NewEntryForm({ onAdd }) {
  const [text, setText]     = useState('');
  const [focused, setFocused] = useState(false);
  const textareaRef = useRef(null);

  const handleSubmit = () => {
    if (text.trim()) {
      onAdd(text.trim());
      setText('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  return (
    <div
      className="card"
      style={{
        marginBottom: 'var(--space-6)',
        border: focused ? '1px solid var(--bougainvillea)' : '1px solid var(--border)',
        transition: 'border-color 0.15s ease',
      }}
    >
      <textarea
        ref={textareaRef}
        value={text}
        onChange={e => {
          setText(e.target.value);
          e.target.style.height = 'auto';
          e.target.style.height = Math.min(e.target.scrollHeight, 280) + 'px';
        }}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder="What's on your mind? Write freely — this is just for you."
        rows={3}
        style={{
          width: '100%', border: 'none', outline: 'none',
          resize: 'none', padding: 0, margin: 0,
          fontSize: '0.9375rem', fontFamily: 'var(--font-display)',
          color: 'var(--ink)', background: 'transparent',
          lineHeight: 1.75, minHeight: '72px',
        }}
        onKeyDown={e => { if (e.key === 'Enter' && e.metaKey) handleSubmit(); }}
      />
      {(text.trim() || focused) && (
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          marginTop: 'var(--space-3)', paddingTop: 'var(--space-3)',
          borderTop: '1px solid var(--border)',
        }}>
          <span style={{ fontSize: '0.7rem', color: 'var(--bark-light)' }}>⌘ + Enter to save</span>
          <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
            {text.trim() && (
              <button
                onClick={() => { setText(''); if (textareaRef.current) textareaRef.current.style.height = 'auto'; }}
                className="btn-ghost"
                style={{ fontSize: '0.8rem' }}
              >
                Clear
              </button>
            )}
            <button
              onClick={handleSubmit}
              disabled={!text.trim()}
              className="btn-primary"
              style={{
                fontSize: '0.875rem', padding: '7px 18px',
                opacity: text.trim() ? 1 : 0.4,
                cursor: text.trim() ? 'pointer' : 'default',
              }}
            >
              Save entry
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Group entries by month ────────────────────────────────────────────────────
function groupByMonth(entries) {
  const groups = {};
  entries.forEach(e => {
    const d = new Date(e.date);
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    const label = d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    if (!groups[key]) groups[key] = { label, entries: [] };
    groups[key].entries.push(e);
  });
  return Object.values(groups);
}

// ── Main JournalScreen ────────────────────────────────────────────────────────
export default function JournalScreen({ storage }) {
  const { data, addJournalEntry, editJournalEntry, deleteJournalEntry } = storage;
  const [filter, setFilter] = useState('all'); // 'all' | 'free' | 'task'

  // Sort newest first
  const allEntries = [...(data.journalEntries || [])]
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const filtered = allEntries.filter(e => {
    if (filter === 'free') return !e.taskId;
    if (filter === 'task') return !!e.taskId;
    return true;
  });

  const taskLinkedCount = allEntries.filter(e => !!e.taskId).length;
  const freeCount       = allEntries.filter(e => !e.taskId).length;

  const groups = groupByMonth(filtered);

  return (
    <div style={{ padding: 'var(--space-6)', maxWidth: '560px', margin: '0 auto' }}>

      {/* Header */}
      <div style={{ paddingTop: 'var(--space-2)', marginBottom: 'var(--space-5)' }}>
        <h1 style={{
          fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem,5vw,1.9rem)',
          color: 'var(--ink)', marginBottom: 'var(--space-1)',
        }}>
          Journal
        </h1>
        <p style={{ color: 'var(--bark)', fontSize: '0.875rem' }}>
          {allEntries.length === 0
            ? 'Write freely. This is just for you.'
            : `${allEntries.length} entr${allEntries.length !== 1 ? 'ies' : 'y'} — a record of where you've been.`}
        </p>
      </div>

      {/* New entry */}
      <NewEntryForm onAdd={addJournalEntry} />

      {/* Filter */}
      {allEntries.length > 0 && (
        <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-4)', flexWrap: 'wrap' }}>
          {[
            { id: 'all',  label: `All (${allEntries.length})` },
            { id: 'free', label: `Free writing (${freeCount})` },
            { id: 'task', label: `Task notes (${taskLinkedCount})` },
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

      {/* Empty state */}
      {allEntries.length === 0 && (
        <div style={{
          textAlign: 'center', padding: 'var(--space-10) var(--space-6)',
          color: 'var(--bark)',
        }}>
          <div style={{ fontSize: '3rem', marginBottom: 'var(--space-4)' }}>📓</div>
          <p style={{
            fontFamily: 'var(--font-display)', fontSize: '1.1rem',
            color: 'var(--ink)', marginBottom: 'var(--space-3)',
          }}>
            Your journal is waiting
          </p>
          <p style={{ fontSize: '0.875rem', lineHeight: 1.7 }}>
            Write anything — a reflection, a frustration, a moment of clarity.
            You can also add notes directly on tasks in the Plan tab,
            and they'll show up here too.
          </p>
        </div>
      )}

      {/* Entries grouped by month */}
      {groups.map((group, gi) => (
        <div key={gi}>
          <DateSeparator label={group.label} />
          {group.entries.map((entry, i) => (
            <JournalEntryCard
              key={entry.id}
              entry={entry}
              index={i}
              onEdit={editJournalEntry}
              onDelete={deleteJournalEntry}
            />
          ))}
        </div>
      ))}

      <div style={{ height: 'var(--space-8)' }} />
    </div>
  );
}

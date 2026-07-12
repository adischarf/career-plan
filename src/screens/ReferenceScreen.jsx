import React, { useState } from 'react';
import { REFERENCE_SECTIONS } from '../data/planData';

// ── Content block renderers ───────────────────────────────────────────────────
function renderBlock(block, i) {
  switch (block.type) {
    case 'heading':
      return (
        <h2
          key={i}
          style={{
            fontFamily: 'var(--font-display)', fontSize: '1.15rem',
            color: 'var(--ink)', marginTop: 'var(--space-8)',
            marginBottom: 'var(--space-3)', fontWeight: 600,
            paddingBottom: 'var(--space-2)',
            borderBottom: '1px solid var(--border)',
          }}
        >
          {block.text}
        </h2>
      );

    case 'subheading':
      return (
        <h3
          key={i}
          style={{
            fontFamily: 'var(--font-display)', fontSize: '1rem',
            color: 'var(--ink)', marginTop: 'var(--space-6)',
            marginBottom: 'var(--space-2)', fontWeight: 600,
          }}
        >
          {block.text}
        </h3>
      );

    case 'paragraph':
      return (
        <p
          key={i}
          style={{
            fontSize: '0.9375rem', color: 'var(--ink-light)',
            lineHeight: 1.75, marginBottom: 'var(--space-4)',
            fontFamily: 'var(--font-body)',
          }}
        >
          {block.text}
        </p>
      );

    case 'bullets':
      return (
        <div key={i} style={{ marginBottom: 'var(--space-5)' }}>
          {block.items.map((item, j) => (
            <div
              key={j}
              style={{
                display: 'flex', gap: 'var(--space-4)',
                marginBottom: 'var(--space-4)',
                paddingLeft: 'var(--space-2)',
              }}
            >
              <div style={{
                width: 4, borderRadius: '99px',
                background: 'var(--bougainvillea)',
                flexShrink: 0, minHeight: '100%',
                alignSelf: 'stretch',
              }} />
              <div>
                <span style={{
                  fontWeight: 700, color: 'var(--ink)',
                  fontSize: '0.9rem', fontFamily: 'var(--font-body)',
                }}>
                  {item.label}
                </span>
                <span style={{ color: 'var(--ink-light)', fontSize: '0.9rem', fontFamily: 'var(--font-body)' }}>
                  {' — '}{item.text}
                </span>
              </div>
            </div>
          ))}
        </div>
      );

    case 'quote':
      return (
        <div
          key={i}
          style={{
            background: block.accent ? 'var(--sage-light)' : 'var(--cream-dark)',
            borderRadius: 'var(--radius-md)',
            padding: 'var(--space-5)',
            marginBottom: 'var(--space-5)',
            border: `1px solid ${block.accent ? 'var(--sage)' : 'var(--border)'}`,
          }}
        >
          {block.label && (
            <p style={{
              fontSize: '0.75rem', fontWeight: 700,
              color: block.accent ? 'var(--sage)' : 'var(--bark)',
              textTransform: 'uppercase', letterSpacing: '0.08em',
              marginBottom: 'var(--space-3)',
            }}>
              {block.label}
            </p>
          )}
          <p style={{
            fontSize: '0.9375rem',
            color: block.accent ? 'var(--ink)' : 'var(--ink-light)',
            lineHeight: 1.75,
            fontFamily: 'var(--font-display)',
            fontStyle: block.accent ? 'normal' : 'italic',
          }}>
            {block.text}
          </p>
        </div>
      );

    case 'table':
      return (
        <div key={i} style={{ marginBottom: 'var(--space-5)', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              {block.rows.map((row, j) => (
                <tr key={j} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{
                    padding: 'var(--space-3) var(--space-4)',
                    fontWeight: 600, fontSize: '0.875rem',
                    color: 'var(--ink)', width: '35%',
                    verticalAlign: 'top',
                    background: j % 2 === 0 ? 'var(--cream-dark)' : 'var(--white)',
                  }}>
                    {row.label}
                  </td>
                  <td style={{
                    padding: 'var(--space-3) var(--space-4)',
                    fontSize: '0.875rem', color: 'var(--ink-light)',
                    lineHeight: 1.6, verticalAlign: 'top',
                    background: j % 2 === 0 ? 'var(--cream-dark)' : 'var(--white)',
                  }}>
                    {row.text}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );

    default:
      return null;
  }
}

// ── Section card ──────────────────────────────────────────────────────────────
const SECTION_META = {
  who_you_are:  { emoji: '🪞', color: 'var(--bougainvillea)', hint: 'Read this on the hard days' },
  core_reframe: { emoji: '💭', color: 'var(--sage)',           hint: 'What is actually true' },
  north_star:   { emoji: '⭐', color: 'var(--gold)',           hint: 'Where you are going' },
  hold_lightly: { emoji: '🌿', color: 'var(--teal)',           hint: 'No resolution required yet' },
};

function SectionCard({ section }) {
  const [open, setOpen] = useState(false);
  const meta = SECTION_META[section.id] || { emoji: '📄', color: 'var(--bark)', hint: '' };

  return (
    <div
      style={{
        background: 'var(--white)',
        border: `1px solid ${open ? meta.color : 'var(--border)'}`,
        borderRadius: 'var(--radius-lg)',
        marginBottom: 'var(--space-4)',
        overflow: 'hidden',
        transition: 'border-color 0.2s ease',
      }}
    >
      {/* Section header — always visible */}
      <button
        onClick={() => setOpen(v => !v)}
        style={{
          width: '100%', background: 'none', border: 'none',
          padding: 'var(--space-5) var(--space-6)',
          display: 'flex', alignItems: 'center', gap: 'var(--space-4)',
          cursor: 'pointer', textAlign: 'left',
        }}
      >
        <div style={{
          width: 44, height: 44, borderRadius: 'var(--radius-md)',
          background: `color-mix(in srgb, ${meta.color} 12%, transparent)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1.4rem', flexShrink: 0,
        }}>
          {meta.emoji}
        </div>
        <div style={{ flex: 1 }}>
          <h2 style={{
            fontFamily: 'var(--font-display)', fontSize: '1rem',
            color: 'var(--ink)', fontWeight: 600, marginBottom: 2,
          }}>
            {section.title}
          </h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--bark)' }}>{meta.hint}</p>
        </div>
        <span style={{
          color: 'var(--bark-light)', fontSize: '0.8rem',
          transition: 'transform 0.2s ease',
          transform: open ? 'rotate(180deg)' : 'none',
          flexShrink: 0,
        }}>
          ▼
        </span>
      </button>

      {/* Content */}
      {open && (
        <div
          className="animate-fadeIn"
          style={{
            padding: '0 var(--space-6) var(--space-6)',
            borderTop: `1px solid ${meta.color}22`,
          }}
        >
          <div style={{ paddingTop: 'var(--space-4)' }}>
            {section.content.map((block, i) => renderBlock(block, i))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main ReferenceScreen ──────────────────────────────────────────────────────
export default function ReferenceScreen() {
  return (
    <div style={{ padding: 'var(--space-6)', maxWidth: '600px', margin: '0 auto' }}>

      {/* Header */}
      <div style={{ paddingTop: 'var(--space-2)', marginBottom: 'var(--space-6)' }}>
        <h1 style={{
          fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem,5vw,1.9rem)',
          color: 'var(--ink)', marginBottom: 'var(--space-1)',
        }}>
          Reference
        </h1>
        <p style={{ color: 'var(--bark)', fontSize: '0.875rem' }}>
          The foundation underneath the plan. Return to these whenever you need to.
        </p>
      </div>

      {/* Sections */}
      {REFERENCE_SECTIONS.map(section => (
        <SectionCard key={section.id} section={section} />
      ))}

      <div style={{ height: 'var(--space-8)' }} />
    </div>
  );
}

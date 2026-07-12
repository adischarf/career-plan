import React, { useState } from 'react';

const SECTIONS = [
  {
    id: 'getting_started',
    emoji: '🌱',
    title: 'Getting started',
    content: [
      {
        heading: 'This tool is built for you',
        body: 'Every task, every piece of context, every note in this tool was written specifically for your situation, your goals, and how your brain works. You don\'t need to read everything at once — just open it when you\'re ready.',
      },
      {
        heading: 'The home screen',
        body: 'The first thing you see is your home screen. It shows you where you are in the plan, what your next task is, and your most recent win. You don\'t have to think about what to do next — it\'s right there.',
      },
      {
        heading: 'The plan tab',
        body: 'The Plan tab is where the work happens. It shows your current month with all its tasks. Tap any task to expand it and see the subtasks, context, and details.',
      },
    ],
  },
  {
    id: 'tasks',
    emoji: '✅',
    title: 'Working through tasks',
    content: [
      {
        heading: 'Subtasks',
        body: 'Every task is broken into small, completable subtasks. Check them off one at a time as you go. Each check adds to your progress — you don\'t have to finish the whole task at once.',
      },
      {
        heading: 'Marking a task complete',
        body: 'When all the subtasks for a task are done, you\'ll see a prompt to mark the task complete. Doing this adds it to your wins log automatically. If you want to mark a task complete without finishing every subtask, you can do that too using the button at the bottom of the expanded task.',
      },
      {
        heading: 'Read more',
        body: 'Some tasks have extra context hidden behind a "Read more" button. These are the callout boxes from the plan — explanations, reframes, specific language to use, or answers to questions you might have. Tap it when you want more depth. You don\'t have to read it every time.',
      },
      {
        heading: 'Recurring tasks',
        body: 'Some tasks are habits — things you do every week, like the Sunday reset or weekly LinkedIn engagement. These have a habit tracker instead of subtasks. Each circle represents a week. Tap a circle to mark that week done. Gaps are visible but don\'t reset your streak — missing a week is just a gap, not a failure.',
      },
      {
        heading: 'Linking your outputs',
        body: 'Some tasks produce something — a writing draft, a data analysis, a list. These tasks have an "Link your output" section where you can paste a Google Drive link (or any URL) and give it a label. The link is saved with the task so you can find it again.',
      },
      {
        heading: 'Cross-references',
        body: 'Some tasks reference other tasks. Tapping a cross-reference opens an overlay showing that task\'s content and progress without losing your place. Tap "Back" to return.',
      },
    ],
  },
  {
    id: 'months',
    emoji: '📅',
    title: 'Monthly progress',
    content: [
      {
        heading: 'Progressive reveal',
        body: 'The plan reveals one month at a time. New months unlock when you\'ve completed at least 70% of the current one. You don\'t have to finish a month completely before the next one opens — just get most of it done.',
      },
      {
        heading: 'Your current month',
        body: 'The Plan tab highlights your current month in pink. You can always go back to a previous month to finish tasks, check something off, or replay a celebration.',
      },
      {
        heading: 'Changing your pace',
        body: 'The plan works on your timeline, not a fixed calendar. If you take longer on a month, that\'s fine. The tool doesn\'t show you a "you\'re behind" message based on calendar dates — it just reflects where you actually are.',
      },
    ],
  },
  {
    id: 'journal',
    emoji: '📓',
    title: 'Journal',
    content: [
      {
        heading: 'Free writing',
        body: 'The Journal tab has a text area at the top for free writing. Write anything — a reflection, a frustration, a moment of clarity. There\'s no format required. Entries are timestamped and saved automatically.',
      },
      {
        heading: 'Task notes',
        body: 'You can also add a journal note directly on a task in the Plan tab. These notes appear both on the task and in your main journal feed, tagged with the task they came from. This lets you look back and remember what you were thinking when you did a specific piece of work.',
      },
      {
        heading: 'Looking back',
        body: 'Journal entries are grouped by month in the Journal tab. You can filter between free writing and task notes. Editing is allowed — your own words, you can change them. The date it was originally written is always preserved.',
      },
    ],
  },
  {
    id: 'wins',
    emoji: '⭐',
    title: 'Wins log',
    content: [
      {
        heading: 'Automatic wins',
        body: 'Every time you mark a task complete, a win is automatically added to your wins log with a plain-language description of what you did. You don\'t have to do anything — it just happens.',
      },
      {
        heading: 'Adding your own wins',
        body: 'You can also add wins that aren\'t tasks — a good conversation, a moment you felt like yourself again, anything worth capturing. Tap "Add a win that\'s not a task" in the Wins tab. Your own wins can be edited or deleted. Automatic task wins can\'t be edited, but they\'re removed if you unmark a task.',
      },
    ],
  },
  {
    id: 'reference',
    emoji: '💡',
    title: 'Reference',
    content: [
      {
        heading: 'What\'s in there',
        body: 'The Reference tab contains four sections from the plan: Who You Are (your strengths and what you\'re working with — read this on hard days), The Core Reframe (what is actually true about your situation), Your North Star (the long-term vision and what the right job looks like), and Things to Hold Lightly (open questions that don\'t need resolution yet).',
      },
      {
        heading: 'How to use it',
        body: 'These aren\'t tasks. They\'re the foundation underneath the plan. Open them when you need a reminder of why you\'re doing this, when you\'re evaluating a job opportunity and want to check it against your criteria, or when imposter syndrome is loud and you need a reality check.',
      },
    ],
  },
  {
    id: 'migraine',
    emoji: '☀️',
    title: 'Migraine mode',
    content: [
      {
        heading: 'How to turn it on',
        body: 'Tap the sun icon in the top right corner of any screen. The sun has open eyes in normal mode and sunglasses in migraine mode. Tap it again to switch back.',
      },
      {
        heading: 'What it does',
        body: 'Migraine mode switches to a warm amber background, reduces blue light and contrast, softens all colors, and disables animations. It affects every screen immediately and stays on until you turn it off.',
      },
      {
        heading: 'Celebrations in migraine mode',
        body: 'When you complete a milestone (a month, a track, or a phase) while migraine mode is on, you\'ll see a text congratulations instead of the flower animation, with a note explaining why. You can replay the flower animation later by completing the milestone again with migraine mode off.',
      },
    ],
  },
  {
    id: 'sync',
    emoji: '☁️',
    title: 'Saving & sync',
    content: [
      {
        heading: 'Where your data lives',
        body: 'Your progress is saved in a file called career_plan_progress.json in your Google Drive. You\'ll never need to touch it directly — the app reads and writes it automatically.',
      },
      {
        heading: 'Auto-save',
        body: 'The app saves automatically 3 seconds after any change. You\'ll see "Saving…" and then "✓ Saved" in the top right corner. If you see "Save failed," check your internet connection — your progress is still in the app and will save when connection returns.',
      },
      {
        heading: 'Across devices',
        body: 'Because everything syncs to your Google Drive, you can open this tool on your phone and your laptop and they\'ll always be in sync. Just sign in with the same Google account on each device.',
      },
    ],
  },
];

// ── Help section card ─────────────────────────────────────────────────────────
function HelpSection({ section, defaultOpen }) {
  const [open, setOpen] = useState(defaultOpen || false);

  return (
    <div style={{
      border: '1px solid var(--border)', borderRadius: 'var(--radius-md)',
      marginBottom: 'var(--space-3)', overflow: 'hidden',
      background: 'var(--white)',
    }}>
      <button
        onClick={() => setOpen(v => !v)}
        style={{
          width: '100%', background: 'none', border: 'none',
          padding: 'var(--space-4) var(--space-5)',
          display: 'flex', alignItems: 'center', gap: 'var(--space-3)',
          cursor: 'pointer', textAlign: 'left',
        }}
      >
        <span style={{ fontSize: '1.2rem', flexShrink: 0 }}>{section.emoji}</span>
        <span style={{ fontWeight: 600, fontSize: '0.9375rem', color: 'var(--ink)', flex: 1 }}>
          {section.title}
        </span>
        <span style={{
          color: 'var(--bark-light)', fontSize: '0.75rem',
          transition: 'transform 0.2s ease',
          transform: open ? 'rotate(180deg)' : 'none',
        }}>▼</span>
      </button>

      {open && (
        <div
          className="animate-fadeIn"
          style={{ padding: '0 var(--space-5) var(--space-5)', borderTop: '1px solid var(--border)' }}
        >
          {section.content.map((item, i) => (
            <div key={i} style={{ paddingTop: 'var(--space-4)' }}>
              <p style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--ink)', marginBottom: 'var(--space-2)' }}>
                {item.heading}
              </p>
              <p style={{ fontSize: '0.875rem', color: 'var(--ink-light)', lineHeight: 1.7 }}>
                {item.body}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Main HelpScreen ───────────────────────────────────────────────────────────
export default function HelpScreen({ onClose }) {
  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'var(--cream)',
      overflowY: 'auto', zIndex: 999,
    }}>
      <div style={{ maxWidth: '600px', margin: '0 auto', padding: 'var(--space-6)' }}>

        {/* Header */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          marginBottom: 'var(--space-6)', paddingTop: 'var(--space-2)',
          position: 'sticky', top: 0,
          background: 'var(--cream)',
          paddingBottom: 'var(--space-4)',
          borderBottom: '1px solid var(--border)',
          zIndex: 10,
        }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-display)', color: 'var(--ink)', fontSize: '1.5rem', marginBottom: 2 }}>
              How to use this tool
            </h1>
            <p style={{ color: 'var(--bark)', fontSize: '0.8rem' }}>
              Tap any section to expand it.
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'var(--cream-dark)', border: '1px solid var(--border)',
              borderRadius: '50%', width: 36, height: 36,
              cursor: 'pointer', fontSize: '1rem', color: 'var(--bark)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}
            aria-label="Close help"
          >✕</button>
        </div>

        {/* Intro */}
        <div style={{
          background: 'var(--bougainvillea-light)',
          border: '1px solid var(--peony)',
          borderRadius: 'var(--radius-md)',
          padding: 'var(--space-4)',
          marginBottom: 'var(--space-5)',
        }}>
          <p style={{ fontSize: '0.875rem', color: 'var(--ink)', lineHeight: 1.7 }}>
            <strong>The short version:</strong> Open the app. Go to the Plan tab. Find your current month.
            Tap a task. Check off subtasks as you do them. That's it.
            Everything else in this guide is just more detail about the same thing.
          </p>
        </div>

        {/* Sections */}
        {SECTIONS.map((section, i) => (
          <HelpSection key={section.id} section={section} defaultOpen={i === 0} />
        ))}

        {/* Footer */}
        <div style={{ textAlign: 'center', padding: 'var(--space-8) 0 var(--space-4)' }}>
          <p style={{ fontSize: '0.8rem', color: 'var(--bark-light)', lineHeight: 1.6 }}>
            This tool was built specifically for you.<br />
            If something doesn't make sense, that's a bug worth fixing.
          </p>
        </div>

        <div style={{ height: 'var(--space-8)' }} />
      </div>
    </div>
  );
}

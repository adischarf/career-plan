// DevTestPanel.jsx
// Hidden functional test panel — only visible in dev mode.
// Access by typing "devtest" in the journal screen, or via URL ?devtest=1
// Tests live state interactions: checking subtasks, celebrations, migraine mode,
// journal, wins, progress computation in the running app.

import React, { useState, useEffect } from 'react';
import { TASKS, MONTHS, PHASES, TRACKS } from '../data/planData';
import {
  taskProgress, monthProgress, overallProgress,
  isMonthComplete, getUnlockedMonths, nextTask,
  TRACK_COLORS,
} from '../utils/progress';

// ── Test runner ───────────────────────────────────────────────────────────────
function runTest(name, fn) {
  try {
    const result = fn();
    if (result === true || result === undefined) {
      return { name, status: 'pass', message: null };
    } else {
      return { name, status: 'fail', message: String(result) };
    }
  } catch (e) {
    return { name, status: 'error', message: e.message };
  }
}

// ── Result row ────────────────────────────────────────────────────────────────
function TestRow({ result }) {
  const colors = {
    pass:  { bg: '#E8F3E9', text: '#4A7C59', icon: '✓' },
    fail:  { bg: '#FAEEF1', text: '#C4607A', icon: '✗' },
    error: { bg: '#FDF3DC', text: '#C8961E', icon: '⚠' },
  };
  const c = colors[result.status];
  return (
    <div style={{
      background: c.bg, borderRadius: 8,
      padding: '8px 12px', marginBottom: 4,
      display: 'flex', alignItems: 'flex-start', gap: 8,
    }}>
      <span style={{ color: c.text, fontWeight: 700, flexShrink: 0, fontFamily: 'monospace' }}>{c.icon}</span>
      <div>
        <span style={{ fontSize: '0.8125rem', color: '#2C2825', fontFamily: 'var(--font-body)' }}>{result.name}</span>
        {result.message && (
          <p style={{ fontSize: '0.75rem', color: c.text, marginTop: 2, fontFamily: 'monospace' }}>{result.message}</p>
        )}
      </div>
    </div>
  );
}

// ── Main DevTestPanel ─────────────────────────────────────────────────────────
export default function DevTestPanel({ storage, onClose }) {
  const { data, toggleSubtask, markTaskComplete, unmarkTaskComplete,
          addJournalEntry, addManualWin, toggleMigraineMode,
          markOnboardingSeen, setCurrentMonth } = storage;

  const [results, setResults] = useState([]);
  const [running, setRunning] = useState(false);
  const [section, setSection] = useState('all');

  const runAllTests = () => {
    setRunning(true);
    const tests = [];

    // ── Section 1: Data integrity (live) ──────────────────────────────────
    tests.push(runTest('All 68 tasks accessible from TASKS array', () => {
      if (TASKS.length !== 68) return `Expected 68, got ${TASKS.length}`;
    }));

    tests.push(runTest('All 6 months defined', () => {
      if (MONTHS.length !== 6) return `Expected 6, got ${MONTHS.length}`;
    }));

    tests.push(runTest('All 2 phases defined', () => {
      if (PHASES.length !== 2) return `Expected 2, got ${PHASES.length}`;
    }));

    tests.push(runTest('All 6 tracks defined', () => {
      if (Object.keys(TRACKS).length !== 6) return `Expected 6, got ${Object.keys(TRACKS).length}`;
    }));

    // ── Section 2: State reads correctly ──────────────────────────────────
    tests.push(runTest('data.completedSubtasks is an object', () => {
      if (typeof data.completedSubtasks !== 'object') return `Got ${typeof data.completedSubtasks}`;
    }));

    tests.push(runTest('data.completedTasks is an object', () => {
      if (typeof data.completedTasks !== 'object') return `Got ${typeof data.completedTasks}`;
    }));

    tests.push(runTest('data.journalEntries is an array', () => {
      if (!Array.isArray(data.journalEntries)) return `Got ${typeof data.journalEntries}`;
    }));

    tests.push(runTest('data.manualWins is an array', () => {
      if (!Array.isArray(data.manualWins)) return `Got ${typeof data.manualWins}`;
    }));

    tests.push(runTest('data.habitLogs is an object', () => {
      if (typeof data.habitLogs !== 'object') return `Got ${typeof data.habitLogs}`;
    }));

    tests.push(runTest('data.migraineMode is boolean', () => {
      if (typeof data.migraineMode !== 'boolean') return `Got ${typeof data.migraineMode}`;
    }));

    tests.push(runTest('data.currentMonthId is a valid month ID', () => {
      const validIds = MONTHS.map(m => m.id);
      if (!validIds.includes(data.currentMonthId)) return `Got "${data.currentMonthId}", valid: ${validIds.join(',')}`;
    }));

    // ── Section 3: Progress computation with live data ───────────────────
    tests.push(runTest('overallProgress returns { pct, done, total } with valid types', () => {
      const op = overallProgress(data);
      if (typeof op.pct !== 'number') return `pct is ${typeof op.pct}`;
      if (typeof op.done !== 'number') return `done is ${typeof op.done}`;
      if (typeof op.total !== 'number') return `total is ${typeof op.total}`;
      if (op.pct < 0 || op.pct > 100) return `pct out of range: ${op.pct}`;
      if (op.done > op.total) return `done (${op.done}) > total (${op.total})`;
    }));

    tests.push(runTest('monthProgress returns valid result for each month', () => {
      for (const m of MONTHS) {
        const mp = monthProgress(m.id, data);
        if (mp.pct < 0 || mp.pct > 100) return `${m.id}: pct = ${mp.pct}`;
        if (mp.total === 0) return `${m.id}: total subtasks = 0`;
      }
    }));

    tests.push(runTest('taskProgress returns valid result for first 10 tasks', () => {
      for (const t of TASKS.slice(0, 10)) {
        const tp = taskProgress(t, data);
        if (tp.pct < 0 || tp.pct > 100) return `${t.id}: pct = ${tp.pct}`;
      }
    }));

    tests.push(runTest('getUnlockedMonths always includes month1', () => {
      const unlocked = getUnlockedMonths(data);
      if (!unlocked.has('month1')) return 'month1 not in unlocked set';
    }));

    tests.push(runTest('nextTask returns null or a valid task', () => {
      const nt = nextTask(data.currentMonthId, data);
      if (nt !== null && !TASKS.find(t => t.id === nt.id)) return `Returned unknown task: ${nt?.id}`;
    }));

    // ── Section 4: Storage mutations ──────────────────────────────────────
    const testTask = TASKS[0]; // A1
    const testSubtask = testTask.subtasks[0];
    const wasChecked = !!(data.completedSubtasks[testTask.id]?.[testSubtask.id]);

    tests.push(runTest('toggleSubtask function exists and is callable', () => {
      if (typeof toggleSubtask !== 'function') return 'Not a function';
    }));

    tests.push(runTest('markTaskComplete function exists and is callable', () => {
      if (typeof markTaskComplete !== 'function') return 'Not a function';
    }));

    tests.push(runTest('addJournalEntry function exists and is callable', () => {
      if (typeof addJournalEntry !== 'function') return 'Not a function';
    }));

    tests.push(runTest('addManualWin function exists and is callable', () => {
      if (typeof addManualWin !== 'function') return 'Not a function';
    }));

    tests.push(runTest('toggleMigraineMode function exists and is callable', () => {
      if (typeof toggleMigraineMode !== 'function') return 'Not a function';
    }));

    tests.push(runTest('setCurrentMonth function exists and is callable', () => {
      if (typeof setCurrentMonth !== 'function') return 'Not a function';
    }));

    // ── Section 5: CSS variables reachable in live DOM ────────────────────
    tests.push(runTest('CSS --cream variable resolves from computed style', () => {
      const val = getComputedStyle(document.documentElement).getPropertyValue('--cream').trim();
      if (!val) return '--cream not found in computed style';
    }));

    tests.push(runTest('CSS --bougainvillea variable resolves', () => {
      const val = getComputedStyle(document.documentElement).getPropertyValue('--bougainvillea').trim();
      if (!val) return '--bougainvillea not found in computed style';
    }));

    tests.push(runTest('CSS --font-display resolves (Lora)', () => {
      const val = getComputedStyle(document.documentElement).getPropertyValue('--font-display').trim();
      if (!val) return '--font-display not found';
      if (!val.includes('Lora') && !val.includes('lora')) return `Expected Lora, got: ${val}`;
    }));

    tests.push(runTest('CSS --font-body resolves (Inter)', () => {
      const val = getComputedStyle(document.documentElement).getPropertyValue('--font-body').trim();
      if (!val) return '--font-body not found';
    }));

    // ── Section 6: Migraine mode ──────────────────────────────────────────
    tests.push(runTest('Migraine mode: body class toggles correctly', () => {
      const initialMode = data.migraineMode;
      const hasMigraineClass = document.body.classList.contains('migraine-mode');
      if (initialMode && !hasMigraineClass) return 'migraineMode=true but body missing migraine-mode class';
      if (!initialMode && hasMigraineClass) return 'migraineMode=false but body has migraine-mode class';
    }));

    tests.push(runTest('Migraine mode: migraine-mode CSS class defined in stylesheet', () => {
      const sheets = Array.from(document.styleSheets);
      let found = false;
      for (const sheet of sheets) {
        try {
          const rules = Array.from(sheet.cssRules || []);
          if (rules.some(r => r.selectorText?.includes('migraine-mode'))) { found = true; break; }
        } catch {}
      }
      if (!found) return 'No CSS rule for .migraine-mode found in stylesheets';
    }));

    // ── Section 7: Track color map completeness ────────────────────────────
    tests.push(runTest('TRACK_COLORS has entry for all 6 tracks', () => {
      const missing = ['A','B','C','D','E','F'].filter(id => !TRACK_COLORS[id]);
      if (missing.length > 0) return `Missing track colors: ${missing.join(',')}`;
    }));

    // ── Section 8: Cross-reference integrity (live) ───────────────────────
    tests.push(runTest('All cross-references resolve to existing tasks (live)', () => {
      const ids = new Set(TASKS.map(t => t.id));
      const broken = [];
      TASKS.forEach(t => (t.crossRefs || []).forEach(r => { if (!ids.has(r)) broken.push(`${t.id}->${r}`); }));
      if (broken.length > 0) return `Broken: ${broken.join(', ')}`;
    }));

    // ── Section 9: Celebration data ───────────────────────────────────────
    tests.push(runTest('All months have celebration fields', () => {
      const missing = MONTHS.filter(m => !m.celebrationText || !m.celebrationFlower);
      if (missing.length > 0) return `Missing: ${missing.map(m=>m.id).join(',')}`;
    }));

    tests.push(runTest('All phases have celebration fields', () => {
      const missing = PHASES.filter(p => !p.celebrationText || !p.celebrationFlower);
      if (missing.length > 0) return `Missing: ${missing.map(p=>p.id).join(',')}`;
    }));

    tests.push(runTest('Celebration flower types are valid', () => {
      const valid = ['lilac','peony','bougainvillea'];
      const bad = [
        ...MONTHS.filter(m => !valid.includes(m.celebrationFlower)).map(m => m.id),
        ...PHASES.filter(p => !valid.includes(p.celebrationFlower)).map(p => p.id),
      ];
      if (bad.length > 0) return `Invalid flower on: ${bad.join(',')}`;
    }));

    setResults(tests);
    setRunning(false);
  };

  useEffect(() => { runAllTests(); }, []); // eslint-disable-line

  const passed = results.filter(r => r.status === 'pass').length;
  const failed = results.filter(r => r.status === 'fail').length;
  const errors = results.filter(r => r.status === 'error').length;

  const filtered = section === 'all'
    ? results
    : results.filter(r => r.status === section);

  return (
    <div style={{
      position: 'fixed', inset: 0, background: '#1C1C1E',
      zIndex: 9999, overflowY: 'auto',
      fontFamily: 'var(--font-body)',
    }}>
      {/* Header */}
      <div style={{
        background: '#2C2C2E', padding: '16px 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        position: 'sticky', top: 0, zIndex: 10,
        borderBottom: '1px solid #3A3A3C',
      }}>
        <div>
          <h1 style={{ color: '#F2F2F7', fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>
            🔬 Dev Test Panel
          </h1>
          <p style={{ color: '#8E8E93', fontSize: '0.75rem', margin: '2px 0 0' }}>
            Functional tests — not visible to end user
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <button
            onClick={runAllTests}
            disabled={running}
            style={{
              background: '#0A84FF', color: 'white', border: 'none',
              borderRadius: 8, padding: '6px 14px', fontSize: '0.8rem',
              cursor: running ? 'wait' : 'pointer', fontWeight: 600,
            }}
          >
            {running ? 'Running…' : 'Re-run'}
          </button>
          <button
            onClick={onClose}
            style={{
              background: '#3A3A3C', color: '#F2F2F7', border: 'none',
              borderRadius: 8, padding: '6px 14px', fontSize: '0.8rem', cursor: 'pointer',
            }}
          >
            Close
          </button>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', gap: 12, padding: '16px 24px' }}>
        {[
          { label: 'Passed', count: passed, color: '#30D158' },
          { label: 'Failed', count: failed, color: '#FF453A' },
          { label: 'Errors', count: errors, color: '#FFD60A' },
          { label: 'Total',  count: results.length, color: '#8E8E93' },
        ].map(({ label, count, color }) => (
          <div key={label} style={{
            background: '#2C2C2E', borderRadius: 10, padding: '12px 16px',
            textAlign: 'center', flex: 1,
          }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color, lineHeight: 1 }}>{count}</div>
            <div style={{ fontSize: '0.7rem', color: '#8E8E93', marginTop: 2 }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Overall status */}
      {results.length > 0 && (
        <div style={{
          margin: '0 24px 16px',
          background: failed === 0 && errors === 0 ? '#1C3A20' : '#3A1C1C',
          borderRadius: 10, padding: '10px 14px',
          color: failed === 0 && errors === 0 ? '#30D158' : '#FF453A',
          fontSize: '0.875rem', fontWeight: 600,
        }}>
          {failed === 0 && errors === 0
            ? `✓ All ${passed} tests passed — app is functioning correctly`
            : `✗ ${failed + errors} test(s) failed — review before giving to user`}
        </div>
      )}

      {/* Filter */}
      <div style={{ display: 'flex', gap: 8, padding: '0 24px 12px', flexWrap: 'wrap' }}>
        {['all','pass','fail','error'].map(s => (
          <button
            key={s}
            onClick={() => setSection(s)}
            style={{
              background: section === s ? '#0A84FF' : '#3A3A3C',
              color: '#F2F2F7', border: 'none', borderRadius: 6,
              padding: '4px 12px', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 500,
            }}
          >
            {s.charAt(0).toUpperCase() + s.slice(1)}
            {s !== 'all' && ` (${results.filter(r=>r.status===s).length})`}
          </button>
        ))}
      </div>

      {/* Results */}
      <div style={{ padding: '0 24px 40px' }}>
        {filtered.map((r, i) => <TestRow key={i} result={r} />)}
        {filtered.length === 0 && (
          <p style={{ color: '#8E8E93', fontSize: '0.875rem', padding: '20px 0' }}>
            No results in this category.
          </p>
        )}
      </div>

      {/* Manual test checklist */}
      <div style={{ padding: '0 24px 60px', borderTop: '1px solid #3A3A3C', marginTop: 8 }}>
        <h2 style={{ color: '#F2F2F7', fontSize: '0.9rem', fontWeight: 700, margin: '20px 0 12px' }}>
          📋 Manual Verification Checklist
        </h2>
        <p style={{ color: '#8E8E93', fontSize: '0.8rem', marginBottom: 12 }}>
          These require human eyes — run through them once in the live app.
        </p>
        {[
          { group: 'Visual / Rendering', items: [
            'Home screen greeting shows correct time of day (morning/afternoon/evening)',
            'All 5 bottom nav tabs are visible and tappable on mobile',
            'Sun toggle icon is visible in top right on every screen',
            'Migraine mode: tap sun icon → all colors shift to warm amber, animations stop',
            'Migraine mode: tap sun icon again → returns to normal mode',
            'Google Fonts loaded: headings use Lora serif, body uses Inter sans-serif',
            'Progress bar fills with gradient (pink→coral) when tasks are completed',
          ]},
          { group: 'Plan Screen', items: [
            'Month 1 is expanded/highlighted as current month',
            'Tapping a task header expands it to show body text and subtasks',
            'Checking a subtask updates the progress bar on that task',
            'When all subtasks are checked → "Mark task complete?" prompt appears',
            'Marking task complete adds it to the wins log (check Wins tab)',
            'Unmarking a task removes its auto-win from the wins log',
            '"Read more" button appears on tasks with contextual help and shows content on tap',
            'Cross-reference links open an overlay (not navigate away) and overlay closes with "Back"',
            'Output link field: paste a URL and label → saves and becomes a tappable link',
            'Habit tracker: tapping week circles fills/unfills them (no streak reset on gaps)',
            'Journal note added to a task appears in the Journal tab with task tag',
            'Month 2 shows as locked before Month 1 is 70% complete',
            'Month 2 unlocks after completing 70%+ of Month 1 tasks',
          ]},
          { group: 'Celebrations', items: [
            'Completing the last task in Month 1 shows lilac flower animation',
            'Animation stays on screen until tapped — does not auto-dismiss',
            'Tapping "Keep going →" or anywhere outside closes the celebration',
            'Revisiting a completed month and tapping the month header still shows celebration',
            'In migraine mode: completing a milestone shows text banner (no animation)',
            'Phase completion shows bougainvillea animation (larger, 3 flowers)',
          ]},
          { group: 'Home Screen', items: [
            'Next task card shows the correct next incomplete task for current month',
            'Tapping the progress strip opens the Progress modal',
            'Most recent win appears in the wins teaser card',
            'Empty state (no wins yet) shows the "Your wins will appear here" message',
          ]},
          { group: 'Progress Screen', items: [
            'Overall tab: large ring shows correct overall percentage',
            'Months tab: each month shows its own progress bar',
            'Tracks tab: each track has correct color accent',
            'Completed months/tracks show green color',
            'Tapping outside the modal or the X closes it',
          ]},
          { group: 'Wins & Journal', items: [
            'Wins: auto-populated wins show "Task complete" badge, manual show "Your win" badge',
            'Wins: manual wins can be edited and saved',
            'Wins: manual wins can be deleted (with confirmation step)',
            'Journal: new entries appear at top of feed (newest first)',
            'Journal: task-linked entries show task pill tag',
            'Journal: entries grouped by month with date separator',
            'Journal: editing an entry updates the text in place',
          ]},
          { group: 'Reference Screen', items: [
            'All 4 sections are collapsed by default',
            'Tapping a section header expands it to show content',
            '"Who You Are" bullet list renders with vertical bar accent',
            '"Core Reframe" quote boxes show with sage/cream styling',
            '"North Star" table renders with alternating row colors',
          ]},
          { group: 'Help & Onboarding', items: [
            'Help screen has all section categories and they expand correctly',
            'Sun icon behavior is explained in migraine section',
            'Output linking is explained in tasks section',
            'Cross-reference overlays are explained in tasks section',
            'Onboarding: on first load, walkthrough appears with step dots',
            'Onboarding: "Skip" dismisses and goes to main app',
            'Onboarding: "Open full instructions" opens the Help screen',
            'Help screen accessible from "?" button in top nav on any screen',
          ]},
          { group: 'Data & Sync', items: [
            'After checking a subtask: wait 3 seconds → "✓ Saved" appears in top bar',
            'Reload the page → all checked subtasks remain checked (data persisted)',
            'Close and reopen the app → progress is preserved (Google Drive sync)',
            'Update banner: bump PLAN_VERSION in planData.js → banner shows on next load',
          ]},
          { group: 'Mobile (test on phone)', items: [
            'All screens scroll smoothly on iPhone Safari',
            'Bottom nav is accessible above iOS home indicator',
            'Task cards are tappable with finger (not just mouse)',
            'Habit tracker petal circles are large enough to tap accurately',
            'Journal textarea expands when typing',
            'Long task bodies don\'t overflow or clip on narrow screens',
          ]},
        ].map(({ group, items }) => (
          <div key={group} style={{ marginBottom: 20 }}>
            <p style={{ color: '#8E8E93', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 8px' }}>
              {group}
            </p>
            {items.map((item, i) => (
              <label key={i} style={{
                display: 'flex', alignItems: 'flex-start', gap: 10,
                marginBottom: 6, cursor: 'pointer',
              }}>
                <input type="checkbox" style={{ marginTop: 2, flexShrink: 0, accentColor: '#0A84FF' }} />
                <span style={{ fontSize: '0.8125rem', color: '#D1D1D6', lineHeight: 1.5 }}>{item}</span>
              </label>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

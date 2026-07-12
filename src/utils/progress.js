// utils/progress.js
// Centralized progress computations used by HomeScreen, PlanScreen, ProgressScreen

import { TASKS, MONTHS, PHASES, TRACKS, getTasksForMonth, getTasksForTrack, getTasksForPhase } from '../data/planData';

// ── Subtask-level progress for a single task ─────────────────────────────────
export function taskProgress(task, data) {
  if (!task.subtasks || task.subtasks.length === 0) {
    return { done: data.completedTasks[task.id] ? 1 : 0, total: 1, pct: data.completedTasks[task.id] ? 100 : 0 };
  }
  const subs = data.completedSubtasks[task.id] || {};
  const done = task.subtasks.filter(s => subs[s.id]).length;
  const total = task.subtasks.length;
  return { done, total, pct: Math.round((done / total) * 100) };
}

// ── Progress for a list of tasks ─────────────────────────────────────────────
export function tasksProgress(tasks, data) {
  let done = 0, total = 0;
  for (const t of tasks) {
    const p = taskProgress(t, data);
    done  += p.done;
    total += p.total;
  }
  return { done, total, pct: total > 0 ? Math.round((done / total) * 100) : 0 };
}

// ── Month progress ────────────────────────────────────────────────────────────
export function monthProgress(monthId, data) {
  return tasksProgress(getTasksForMonth(monthId), data);
}

// ── Track progress ────────────────────────────────────────────────────────────
export function trackProgress(trackId, data) {
  return tasksProgress(getTasksForTrack(trackId), data);
}

// ── Phase progress ────────────────────────────────────────────────────────────
export function phaseProgress(phaseId, data) {
  return tasksProgress(getTasksForPhase(phaseId), data);
}

// ── Overall progress ─────────────────────────────────────────────────────────
export function overallProgress(data) {
  return tasksProgress(TASKS, data);
}

// ── Is a month fully complete? ───────────────────────────────────────────────
export function isMonthComplete(monthId, data) {
  const p = monthProgress(monthId, data);
  return p.total > 0 && p.done === p.total;
}

// ── Is a track fully complete? ───────────────────────────────────────────────
export function isTrackComplete(trackId, data) {
  const p = trackProgress(trackId, data);
  return p.total > 0 && p.done === p.total;
}

// ── Is a phase fully complete? ───────────────────────────────────────────────
export function isPhaseComplete(phaseId, data) {
  const p = phaseProgress(phaseId, data);
  return p.total > 0 && p.done === p.total;
}

// ── Which months are unlocked (progressive reveal) ───────────────────────────
// Month 1 is always unlocked.
// Subsequent months unlock when the previous month hits 70%+ progress.
export function getUnlockedMonths(data) {
  const unlocked = new Set();
  const monthOrder = MONTHS.map(m => m.id);

  for (let i = 0; i < monthOrder.length; i++) {
    const mid = monthOrder[i];
    if (i === 0) { unlocked.add(mid); continue; }
    const prevId = monthOrder[i - 1];
    const prev = monthProgress(prevId, data);
    if (prev.pct >= 70) unlocked.add(mid);
  }
  return unlocked;
}

// ── Next incomplete task in current month ────────────────────────────────────
export function nextTask(monthId, data) {
  const tasks = getTasksForMonth(monthId);
  return tasks.find(t => {
    if (data.completedTasks[t.id]) return false;
    if (!t.subtasks || t.subtasks.length === 0) return true;
    const subs = data.completedSubtasks[t.id] || {};
    return !t.subtasks.every(s => subs[s.id]);
  }) || null;
}

// ── Wins: merge auto + manual, sorted newest first ──────────────────────────
export function allWinsSorted(data) {
  return [...(data.manualWins || [])]
    .sort((a, b) => new Date(b.date) - new Date(a.date));
}

// ── Format a date nicely ────────────────────────────────────────────────────
export function formatDate(isoString) {
  if (!isoString) return '';
  const d = new Date(isoString);
  const now = new Date();
  const diffDays = Math.floor((now - d) / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7)  return `${diffDays} days ago`;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// ── Track color CSS var ──────────────────────────────────────────────────────
export const TRACK_COLORS = {
  A: 'var(--sage)',
  B: 'var(--lilac-dark)',
  C: 'var(--gold)',
  D: 'var(--teal)',
  E: 'var(--purple)',
  F: 'var(--bougainvillea)',
};

export const TRACK_COLORS_LIGHT = {
  A: 'var(--sage-light)',
  B: 'var(--lilac-light)',
  C: 'var(--gold-light)',
  D: 'var(--teal-light)',
  E: 'var(--purple-light)',
  F: 'var(--bougainvillea-light)',
};

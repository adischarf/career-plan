#!/usr/bin/env node
// ─────────────────────────────────────────────────────────────────────────────
// career-plan-tests.js
// Static test suite — run with: node career-plan-tests.js
// from the career-tool/ directory.
// Tests data integrity, structural correctness, content quality,
// progress logic, CSS variables, and screen-render prerequisites.
// No browser required.
// ─────────────────────────────────────────────────────────────────────────────

const fs = require('fs');
const path = require('path');

// ── Colors for terminal output ───────────────────────────────────────────────
const GREEN  = '\x1b[32m';
const RED    = '\x1b[31m';
const YELLOW = '\x1b[33m';
const BLUE   = '\x1b[34m';
const BOLD   = '\x1b[1m';
const RESET  = '\x1b[0m';

let passed = 0, failed = 0, warned = 0;
const failures = [];
const warnings = [];

function pass(msg) { passed++; process.stdout.write(GREEN + '  ✓ ' + RESET + msg + '\n'); }
function fail(msg) { failed++; failures.push(msg); process.stdout.write(RED + '  ✗ ' + RESET + msg + '\n'); }
function warn(msg) { warned++; warnings.push(msg); process.stdout.write(YELLOW + '  ⚠ ' + RESET + msg + '\n'); }
function section(title) { console.log('\n' + BOLD + BLUE + '▶ ' + title + RESET); }

// ── Load modules ─────────────────────────────────────────────────────────────
function loadModule(filePath) {
  const src = fs.readFileSync(filePath, 'utf8')
    .replace(/^export const /gm, 'const ')
    .replace(/^export function /gm, 'function ')
    .replace(/^export default /gm, 'const __default = ')
    .replace(/import \{[^}]+\} from '[^']+';?\n?/g, '')
    .replace(/import [^{][^\n]+ from '[^']+';?\n?/g, '');
  return src;
}

const dataSrc = loadModule(path.join(__dirname, 'src/data/planData.js'));
const progressSrc = loadModule(path.join(__dirname, 'src/utils/progress.js'));

const combined = dataSrc + '\n\n' + progressSrc + `
module.exports = {
  TASKS, MONTHS, PHASES, TRACKS, REFERENCE_SECTIONS,
  PLAN_VERSION, PLAN_VERSION_NOTES,
  getTasksForMonth, getTasksForTrack, getTasksForPhase, getTaskById,
  taskProgress, tasksProgress, monthProgress, trackProgress,
  phaseProgress, overallProgress,
  isMonthComplete, isTrackComplete, isPhaseComplete,
  getUnlockedMonths, nextTask, allWinsSorted, formatDate,
  TRACK_COLORS, TRACK_COLORS_LIGHT,
};`;

fs.writeFileSync('/tmp/_plan_test_combined.cjs', combined);
const M = require('/tmp/_plan_test_combined.cjs');
const {
  TASKS, MONTHS, PHASES, TRACKS, REFERENCE_SECTIONS,
  PLAN_VERSION,
  taskProgress, monthProgress, trackProgress, phaseProgress, overallProgress,
  isMonthComplete, isTrackComplete, isPhaseComplete,
  getUnlockedMonths, nextTask,
  TRACK_COLORS, TRACK_COLORS_LIGHT,
} = M;

// ─────────────────────────────────────────────────────────────────────────────
// SUITE 1 — Data completeness
// ─────────────────────────────────────────────────────────────────────────────
section('SUITE 1 — Data Completeness');

// 1.1 Task count
const EXPECTED_TASK_IDS = [
  'A1','A2','A3','A4',
  'B1','B2',
  'C1','C2','C3',
  'D1','D2',
  'E1','E2','E3',
  'A5','A6',
  'B3','B4','B5','B6_pending',
  'C4','C5',
  'D3','D4',
  'E4','E5',
  'A7',
  'B7','B8','B9',
  'C6','C7','C8',
  'D5','D6',
  'E6',
  'A8',
  'B10','B11','B12','B13',
  'C9','C10','C11',
  'D7','D8','D9','D10',
  'E7','E8',
  'F1','F2',
  'B14','B15',
  'C12','C13',
  'D11','D12',
  'F3','F4',
  'B16','B17',
  'D13','D14',
  'F5','F6','F7','F8',
];

const appTaskIds = new Set(TASKS.map(t => t.id));
const missingFromApp = EXPECTED_TASK_IDS.filter(id => !appTaskIds.has(id));
const extraInApp = TASKS.map(t => t.id).filter(id => !EXPECTED_TASK_IDS.includes(id));

if (missingFromApp.length === 0) pass('All 68 expected tasks present in app');
else fail('Missing tasks: ' + missingFromApp.join(', '));

if (extraInApp.length === 0) pass('No extra/unexpected tasks in app');
else warn('Extra tasks not in expected list: ' + extraInApp.join(', '));

// 1.2 Every month has tasks
MONTHS.forEach(m => {
  const t = TASKS.filter(t => t.monthId === m.id);
  if (t.length > 0) pass(m.id + ' has ' + t.length + ' tasks');
  else fail(m.id + ' has NO tasks — PlanScreen would render empty');
});

// 1.3 Every phase references valid months
PHASES.forEach(p => {
  const validMonths = new Set(MONTHS.map(m => m.id));
  const bad = p.months.filter(mid => !validMonths.has(mid));
  if (bad.length === 0) pass('Phase ' + p.id + ' month references all valid');
  else fail('Phase ' + p.id + ' references invalid months: ' + bad.join(', '));
});

// 1.4 All 6 tracks present
const expectedTracks = ['A','B','C','D','E','F'];
const missingTracks = expectedTracks.filter(t => !TRACKS[t]);
if (missingTracks.length === 0) pass('All 6 tracks defined (A–F)');
else fail('Missing tracks: ' + missingTracks.join(', '));

// 1.5 Reference sections
const expectedRefIds = ['who_you_are','core_reframe','north_star','hold_lightly'];
const refIds = REFERENCE_SECTIONS.map(r => r.id);
const missingRefs = expectedRefIds.filter(id => !refIds.includes(id));
if (missingRefs.length === 0) pass('All 4 reference sections present');
else fail('Missing reference sections: ' + missingRefs.join(', '));

// ─────────────────────────────────────────────────────────────────────────────
// SUITE 2 — Structural integrity
// ─────────────────────────────────────────────────────────────────────────────
section('SUITE 2 — Structural Integrity');

// 2.1 Required task fields
const requiredFields = ['id','monthId','trackId','label','title','body','winText'];
let fieldIssues = 0;
TASKS.forEach(t => {
  requiredFields.forEach(f => {
    if (!t[f] || (typeof t[f] === 'string' && t[f].trim() === '')) {
      fail(t.id + ': missing required field "' + f + '"');
      fieldIssues++;
    }
  });
});
if (fieldIssues === 0) pass('All tasks have required fields (id, monthId, trackId, label, title, body, winText)');

// 2.2 Duplicate task IDs
const idCounts = {};
TASKS.forEach(t => { idCounts[t.id] = (idCounts[t.id] || 0) + 1; });
const dupes = Object.entries(idCounts).filter(([,c]) => c > 1);
if (dupes.length === 0) pass('No duplicate task IDs');
else dupes.forEach(([id]) => fail('Duplicate task ID: ' + id));

// 2.3 Duplicate subtask IDs within tasks
let subDupes = 0;
TASKS.forEach(t => {
  if (!t.subtasks) return;
  const seen = {};
  t.subtasks.forEach(s => {
    if (seen[s.id]) { fail(t.id + ': duplicate subtask ID: ' + s.id); subDupes++; }
    seen[s.id] = true;
  });
});
if (subDupes === 0) pass('No duplicate subtask IDs within any task');

// 2.4 Cross-reference integrity
let crossRefIssues = 0;
TASKS.forEach(t => {
  (t.crossRefs || []).forEach(ref => {
    if (!appTaskIds.has(ref)) {
      fail(t.id + ': crossRef "' + ref + '" points to non-existent task');
      crossRefIssues++;
    }
  });
});
if (crossRefIssues === 0) pass('All ' + TASKS.filter(t=>t.crossRefs?.length).reduce((s,t)=>s+t.crossRefs.length,0) + ' cross-references point to existing tasks');

// 2.5 monthId and trackId integrity
let refIssues = 0;
const validMonthIds = new Set(MONTHS.map(m => m.id));
const validTrackIds = new Set(Object.keys(TRACKS));
TASKS.forEach(t => {
  if (!validMonthIds.has(t.monthId)) { fail(t.id + ': invalid monthId "' + t.monthId + '"'); refIssues++; }
  if (!validTrackIds.has(t.trackId)) { fail(t.id + ': invalid trackId "' + t.trackId + '"'); refIssues++; }
});
if (refIssues === 0) pass('All task monthId and trackId references are valid');

// 2.6 Subtask IDs follow pattern (taskId + letter)
let subIdIssues = 0;
TASKS.forEach(t => {
  (t.subtasks || []).forEach(s => {
    const baseId = t.id.replace('_pending','');
    if (!s.id.startsWith(baseId)) {
      warn(t.id + ': subtask ID "' + s.id + '" does not start with parent ID "' + baseId + '"');
      subIdIssues++;
    }
  });
});
if (subIdIssues === 0) pass('All subtask IDs follow naming convention (parentId + letter)');

// 2.7 Recurring tasks have recurringLabel
const recurringIssues = TASKS.filter(t => t.isRecurring && !t.recurringLabel);
if (recurringIssues.length === 0) pass('All recurring tasks have recurringLabel');
else recurringIssues.forEach(t => fail(t.id + ': isRecurring=true but missing recurringLabel'));

// 2.8 Celebration fields on months
let celebIssues = 0;
MONTHS.forEach(m => {
  ['celebrationText','celebrationMessage','celebrationFlower'].forEach(f => {
    if (!m[f]) { fail('Month ' + m.id + ': missing ' + f); celebIssues++; }
  });
  const validFlowers = ['lilac','peony','bougainvillea'];
  if (m.celebrationFlower && !validFlowers.includes(m.celebrationFlower)) {
    fail('Month ' + m.id + ': invalid celebrationFlower "' + m.celebrationFlower + '"'); celebIssues++;
  }
});
PHASES.forEach(p => {
  ['celebrationText','celebrationMessage','celebrationFlower'].forEach(f => {
    if (!p[f]) { fail('Phase ' + p.id + ': missing ' + f); celebIssues++; }
  });
});
if (celebIssues === 0) pass('All months and phases have valid celebration fields');

// 2.9 Reference section content blocks
const validBlockTypes = ['heading','subheading','paragraph','bullets','quote','table'];
let refBlockIssues = 0;
REFERENCE_SECTIONS.forEach(rs => {
  if (!rs.content || rs.content.length === 0) {
    fail('Reference section "' + rs.id + '" has empty content'); refBlockIssues++; return;
  }
  rs.content.forEach((block, i) => {
    if (!validBlockTypes.includes(block.type)) {
      fail('Ref "' + rs.id + '" block[' + i + ']: unknown type "' + block.type + '"'); refBlockIssues++;
    }
    if (block.type === 'bullets' && (!block.items || block.items.length === 0)) {
      fail('Ref "' + rs.id + '" has bullets block with no items'); refBlockIssues++;
    }
    if (block.type === 'table' && (!block.rows || block.rows.length === 0)) {
      fail('Ref "' + rs.id + '" has table block with no rows'); refBlockIssues++;
    }
  });
});
if (refBlockIssues === 0) pass('All reference section content blocks are valid');

// ─────────────────────────────────────────────────────────────────────────────
// SUITE 3 — Content quality
// ─────────────────────────────────────────────────────────────────────────────
section('SUITE 3 — Content Quality');

// 3.1 Body length (too short = likely placeholder)
let shortBodies = 0;
TASKS.forEach(t => {
  if (t.body.length < 60) { warn(t.id + ': body very short (' + t.body.length + ' chars)'); shortBodies++; }
});
if (shortBodies === 0) pass('All task bodies are substantive (>60 chars)');

// 3.2 Win text quality
let genericWins = 0;
TASKS.forEach(t => {
  if (t.winText === t.title) { warn(t.id + ': winText is identical to title — should be more descriptive'); genericWins++; }
  if (t.winText.length < 20) { warn(t.id + ': winText very short: "' + t.winText + '"'); genericWins++; }
});
if (genericWins === 0) pass('All win texts are substantive and distinct from title');

// 3.3 No interpolation artifacts or JSX in data strings
let contentArtifacts = 0;
TASKS.forEach(t => {
  const fieldsToCheck = [t.body, t.winText, t.contextualHelp || '', ...(t.subtasks || []).map(s => s.text)];
  fieldsToCheck.forEach(text => {
    if (text.includes('${') || text.includes('</') || text.includes('/>') || text.includes('[object')) {
      fail(t.id + ': possible JSX/template artifact in content: ' + text.slice(0,80));
      contentArtifacts++;
    }
    if (text.includes('undefined') && !text.toLowerCase().includes('undefined') ) {
      warn(t.id + ': content contains "undefined" — possible interpolation error');
    }
  });
});
if (contentArtifacts === 0) pass('No JSX/template artifacts found in task content');

// 3.4 Cross-reference labels match actual task titles
let crossRefLabelIssues = 0;
TASKS.forEach(t => {
  (t.crossRefs || []).forEach(ref => {
    const refTask = TASKS.find(x => x.id === ref);
    if (refTask) {
      // The ref exists — good. The label in UI is generated dynamically so no mismatch possible.
      // But check the referenced task has a label
      if (!refTask.label || !refTask.title) {
        fail(t.id + ': crossRef target ' + ref + ' missing label/title'); crossRefLabelIssues++;
      }
    }
  });
});
if (crossRefLabelIssues === 0) pass('All cross-reference targets have valid labels and titles');

// 3.5 Subtask texts are not empty and have reasonable length
let emptySubtasks = 0;
TASKS.forEach(t => {
  (t.subtasks || []).forEach(s => {
    if (!s.text || s.text.trim().length < 5) {
      fail(t.id + '/' + s.id + ': subtask text too short or empty: "' + s.text + '"');
      emptySubtasks++;
    }
  });
});
if (emptySubtasks === 0) pass('All subtask texts are non-empty and have reasonable length');

// 3.6 Label format check (should be "Task XN" or "Task XN_suffix")
let labelFormatIssues = 0;
TASKS.forEach(t => {
  if (!t.label.startsWith('Task ')) {
    warn(t.id + ': label does not start with "Task ": "' + t.label + '"');
    labelFormatIssues++;
  }
});
if (labelFormatIssues === 0) pass('All task labels follow "Task XN" format');

// ─────────────────────────────────────────────────────────────────────────────
// SUITE 4 — Progress logic
// ─────────────────────────────────────────────────────────────────────────────
section('SUITE 4 — Progress Logic');

const emptyData = {
  completedSubtasks:{}, completedTasks:{}, habitLogs:{},
  outputLinks:{}, journalEntries:[], manualWins:[],
  currentMonthId:'month1', migraineMode:false,
  dismissedBanners:{}, snoozedBanners:{},
};

// 4.1 Empty state = 0%
const op = overallProgress(emptyData);
if (op.pct === 0 && op.done === 0) pass('Overall progress = 0% on fresh data');
else fail('Overall progress on empty data should be 0%, got ' + op.pct + '%');

// 4.2 Each month starts at 0%
MONTHS.forEach(m => {
  const mp = monthProgress(m.id, emptyData);
  if (mp.pct === 0) pass(m.id + ' progress = 0% on fresh data');
  else fail(m.id + ' should start at 0%, got ' + mp.pct + '%');
});

// 4.3 Completing all subtasks of a task → task progress = 100%
const testTask = TASKS.find(t => t.id === 'A1' && t.subtasks?.length > 0);
if (testTask) {
  const allSubsDone = {};
  testTask.subtasks.forEach(s => { allSubsDone[s.id] = true; });
  const dataWithA1 = { ...emptyData, completedSubtasks: { A1: allSubsDone } };
  const tp = taskProgress(testTask, dataWithA1);
  if (tp.pct === 100) pass('A1 all subtasks complete → task progress = 100%');
  else fail('A1 all subtasks complete → expected 100%, got ' + tp.pct + '%');
}

// 4.4 Partial subtasks → partial percentage
const partialTask = TASKS.find(t => t.id === 'A1');
if (partialTask && partialTask.subtasks.length >= 2) {
  const halfDone = {};
  halfDone[partialTask.subtasks[0].id] = true;
  const dataPartial = { ...emptyData, completedSubtasks: { A1: halfDone } };
  const tp = taskProgress(partialTask, dataPartial);
  const expectedPct = Math.round((1 / partialTask.subtasks.length) * 100);
  if (tp.pct === expectedPct) pass('A1 partial subtasks → correct percentage (' + expectedPct + '%)');
  else fail('A1 partial: expected ' + expectedPct + '%, got ' + tp.pct + '%');
}

// 4.5 Month 1 always unlocked
const unlocked = getUnlockedMonths(emptyData);
if (unlocked.has('month1')) pass('month1 always unlocked on fresh data');
else fail('month1 should always be unlocked');

// 4.6 Month 2 locked when month1 < 70%
if (!unlocked.has('month2')) pass('month2 locked when month1 = 0%');
else fail('month2 should be locked when month1 = 0%');

// 4.7 Month 2 unlocks at 70% of month1
const month1Tasks = TASKS.filter(t => t.monthId === 'month1');
const totalSubs = month1Tasks.reduce((sum, t) => sum + (t.subtasks?.length || 1), 0);
const needed = Math.ceil(totalSubs * 0.7);
let done70 = 0;
const subs70 = {};
for (const t of month1Tasks) {
  if (t.subtasks) {
    subs70[t.id] = {};
    for (const s of t.subtasks) {
      if (done70 < needed) { subs70[t.id][s.id] = true; done70++; }
    }
  }
}
const data70 = { ...emptyData, completedSubtasks: subs70 };
const unlocked70 = getUnlockedMonths(data70);
if (unlocked70.has('month2')) pass('month2 unlocks when month1 reaches 70%');
else fail('month2 should unlock at 70% of month1, but did not');

// 4.8 nextTask returns first incomplete task
const firstTask = nextTask('month1', emptyData);
if (firstTask?.id === 'A1') pass('nextTask returns A1 as first task in month1 (empty state)');
else fail('nextTask expected A1, got ' + firstTask?.id);

// 4.9 nextTask skips completed tasks
const dataA1done = { ...emptyData, completedTasks: { A1: true } };
const afterA1 = nextTask('month1', dataA1done);
if (afterA1?.id === 'A2') pass('nextTask skips A1 (complete) and returns A2');
else fail('nextTask after A1 done: expected A2, got ' + afterA1?.id);

// 4.10 nextTask returns null when all tasks complete
const allDone = {};
TASKS.filter(t => t.monthId === 'month1').forEach(t => { allDone[t.id] = true; });
const dataDone = { ...emptyData, completedTasks: allDone };
const noNext = nextTask('month1', dataDone);
if (noNext === null) pass('nextTask returns null when all month1 tasks complete');
else fail('nextTask should return null when all done, got ' + noNext?.id);

// 4.11 isMonthComplete false when tasks incomplete
if (!isMonthComplete('month1', emptyData)) pass('isMonthComplete returns false on empty data');
else fail('isMonthComplete should be false on empty data');

// 4.12 isMonthComplete true when all subtasks done
// Build data with all subtasks actually completed (not just completedTasks flags)
const allSubsData = { ...emptyData, completedSubtasks: {}, completedTasks: {} };
TASKS.filter(t => t.monthId === 'month1').forEach(t => {
  if (t.subtasks && t.subtasks.length > 0) {
    allSubsData.completedSubtasks[t.id] = {};
    t.subtasks.forEach(s => { allSubsData.completedSubtasks[t.id][s.id] = true; });
  } else {
    allSubsData.completedTasks[t.id] = true;
  }
});
if (isMonthComplete('month1', allSubsData)) pass('isMonthComplete returns true when all subtasks and tasks done');
else fail('isMonthComplete should return true when all subtasks done');

// 4.13 Track progress sums correctly
const trackATasks = TASKS.filter(t => t.trackId === 'A');
const totalTrackASubs = trackATasks.reduce((sum, t) => sum + (t.subtasks?.length || 1), 0);
const tpA = trackProgress('A', emptyData);
if (tpA.total === totalTrackASubs && tpA.done === 0) pass('Track A total subtask count correct (' + totalTrackASubs + ')');
else fail('Track A total: expected ' + totalTrackASubs + ', got ' + tpA.total);

// 4.14 Phase progress aggregates across all months
const phase1 = PHASES.find(p => p.id === 'phase1');
const phase1Tasks = TASKS.filter(t => phase1.months.includes(t.monthId));
const totalPhase1Subs = phase1Tasks.reduce((sum, t) => sum + (t.subtasks?.length || 1), 0);
const pp1 = phaseProgress('phase1', emptyData);
if (pp1.total === totalPhase1Subs) pass('Phase 1 total subtask count correct (' + totalPhase1Subs + ')');
else fail('Phase 1 total: expected ' + totalPhase1Subs + ', got ' + pp1.total);

// ─────────────────────────────────────────────────────────────────────────────
// SUITE 5 — CSS and graphics
// ─────────────────────────────────────────────────────────────────────────────
section('SUITE 5 — CSS Variables and Graphics');

const cssSrc = fs.readFileSync(path.join(__dirname, 'src/index.css'), 'utf8');
const definedVars = new Set((cssSrc.match(/--[\w-]+(?=\s*:)/g) || []));

const jsxFiles = [
  'src/screens/HomeScreen.jsx',
  'src/screens/PlanScreen.jsx',
  'src/screens/WinsScreen.jsx',
  'src/screens/JournalScreen.jsx',
  'src/screens/ReferenceScreen.jsx',
  'src/screens/ProgressScreen.jsx',
  'src/screens/HelpScreen.jsx',
  'src/components/FlowerCelebration.jsx',
  'src/components/index.js',
  'src/App.js',
];

const usedVars = new Set();
jsxFiles.forEach(f => {
  const content = fs.readFileSync(path.join(__dirname, f), 'utf8');
  (content.match(/var\(--[\w-]+\)/g) || []).forEach(v => usedVars.add(v.slice(4,-1)));
});

const undefinedVars = [...usedVars].filter(v => !definedVars.has(v));
if (undefinedVars.length === 0) pass('All ' + usedVars.size + ' CSS variables used in JSX are defined in index.css');
else undefinedVars.forEach(v => fail('CSS variable --' + v + ' used in JSX but not defined in index.css'));

// 5.2 Migraine mode overrides core color vars
const migraineBlock = cssSrc.match(/body\.migraine-mode \{([^}]+)\}/s)?.[1] || '';
const migraineOverrides = new Set((migraineBlock.match(/--[\w-]+(?=\s*:)/g) || []));
const mustOverride = ['--cream','--cream-dark','--ink','--ink-light','--bark','--white','--border'];
const missingOverrides = mustOverride.filter(v => !migraineOverrides.has(v));
if (missingOverrides.length === 0) pass('Migraine mode overrides all core color variables');
else missingOverrides.forEach(v => fail('Migraine mode missing override for ' + v));

// 5.3 Migraine mode has sepia/saturation filter
if (migraineBlock.includes('filter:') && migraineBlock.includes('sepia')) {
  pass('Migraine mode has sepia filter for warm toning');
} else {
  fail('Migraine mode missing sepia/saturation filter');
}

// 5.4 FlowerCelebration handles migraine mode
const flowerSrc = fs.readFileSync(path.join(__dirname, 'src/components/FlowerCelebration.jsx'), 'utf8');
if (flowerSrc.includes('migraineMode')) pass('FlowerCelebration handles migraineMode prop');
else fail('FlowerCelebration does not check migraineMode — animations will play during migraines');

// 5.5 FlowerCelebration has all three flower types
['lilac','peony','bougainvillea'].forEach(flower => {
  if (flowerSrc.includes(flower)) pass('FlowerCelebration defines "' + flower + '" flower type');
  else fail('FlowerCelebration missing "' + flower + '" flower type');
});

// 5.6 No external image URLs in any JSX file
let externalImgIssues = 0;
jsxFiles.forEach(f => {
  const content = fs.readFileSync(path.join(__dirname, f), 'utf8');
  const extImgs = content.match(/src=["'][^"']*https?:\/\/[^"']+\.(jpg|jpeg|png|gif|webp|svg)[^"']*["']/gi) || [];
  extImgs.forEach(img => {
    fail(f + ': external image URL (will fail offline): ' + img.slice(0,80));
    externalImgIssues++;
  });
});
if (externalImgIssues === 0) pass('No external image URLs found in JSX files');

// 5.7 All SVGs in JSX have viewBox or width
let svgIssues = 0;
jsxFiles.forEach(f => {
  const content = fs.readFileSync(path.join(__dirname, f), 'utf8');
  const svgs = content.match(/<svg[^>]*>/g) || [];
  svgs.forEach(svg => {
    if (!svg.includes('viewBox') && !svg.includes('width')) {
      warn(f + ': SVG without viewBox or width: ' + svg.slice(0,60));
      svgIssues++;
    }
  });
});
if (svgIssues === 0) pass('All SVG elements have viewBox or width');

// ─────────────────────────────────────────────────────────────────────────────
// SUITE 6 — Storage and data shape
// ─────────────────────────────────────────────────────────────────────────────
section('SUITE 6 — Storage API and Data Shape');

const storageSrc = fs.readFileSync(path.join(__dirname, 'src/hooks/useStorage.js'), 'utf8');

// 6.1 All expected exports present
const expectedExports = [
  'authState','data','saveStatus','signIn','signOut',
  'toggleSubtask','markTaskComplete','unmarkTaskComplete',
  'logHabit','saveOutputLink',
  'addJournalEntry','editJournalEntry','deleteJournalEntry',
  'addManualWin','editManualWin','deleteManualWin',
  'dismissBanner','toggleMigraineMode',
  'markOnboardingSeen','markVersionSeen',
  'setCurrentMonth','setPlanPace','updateData',
];
const returnBlock = storageSrc.split('\n').slice(361, 392).join('\n');
const missingExports = expectedExports.filter(k => !returnBlock.includes(k));
if (missingExports.length === 0) pass('All 23 storage methods/properties exported from useStorage');
else missingExports.forEach(k => fail('useStorage missing export: ' + k));

// 6.2 DEFAULT_STATE has all required fields
// Use line-by-line search to avoid regex confusion with inline comment braces
const storageLines = storageSrc.split('\n');
const stateStart = storageLines.findIndex(l => l.includes('const DEFAULT_STATE = {'));
const stateEnd   = storageLines.findIndex((l, i) => i > stateStart && l.trim() === '};');
const stateBlock = stateStart >= 0 ? storageLines.slice(stateStart, stateEnd + 1).join('\n') : '';
if (stateBlock) {
  const requiredStateFields = [
    'version','userName','startDate',
    'completedSubtasks','completedTasks','habitLogs','outputLinks',
    'journalEntries','manualWins',
    'dismissedBanners','snoozedBanners',
    'lastActivity','currentMonthId','migraineMode',
    'seenOnboarding','seenVersion','planPace',
  ];
  const missingState = requiredStateFields.filter(f => !stateBlock.includes(f + ':'));
  if (missingState.length === 0) pass('DEFAULT_STATE has all ' + requiredStateFields.length + ' required fields');
  else missingState.forEach(f => fail('DEFAULT_STATE missing field: ' + f));
} else {
  fail('Could not locate DEFAULT_STATE block in useStorage');
}

// 6.3 Dev mode fallback exists (localStorage)
if (storageSrc.includes('dev_mode') && storageSrc.includes('localStorage')) {
  pass('Dev mode fallback (localStorage) exists for testing without Google OAuth');
} else {
  fail('Missing dev mode fallback — cannot test without Google OAuth');
}

// 6.4 Auto-save debounce exists
if (storageSrc.includes('setTimeout') && storageSrc.includes('3000')) {
  pass('Auto-save has 3-second debounce');
} else {
  warn('Could not confirm 3-second auto-save debounce — verify manually');
}

// 6.5 Screens use storage correctly (no direct state mutation)
const screenFiles = [
  'src/screens/HomeScreen.jsx',
  'src/screens/PlanScreen.jsx',
  'src/screens/WinsScreen.jsx',
  'src/screens/JournalScreen.jsx',
];
let directMutations = 0;
screenFiles.forEach(f => {
  const content = fs.readFileSync(path.join(__dirname, f), 'utf8');
  // Check for direct data.X = ... mutations (would break React state)
  const mutations = content.match(/data\.[a-z]\w+ = /g) || [];
  if (mutations.length > 0) {
    fail(f + ': possible direct state mutation: ' + mutations[0]);
    directMutations++;
  }
});
if (directMutations === 0) pass('No direct state mutations found in screen files');

// ─────────────────────────────────────────────────────────────────────────────
// SUITE 7 — Screen render prerequisites
// ─────────────────────────────────────────────────────────────────────────────
section('SUITE 7 — Screen Render Prerequisites');

// 7.1 HomeScreen dependencies
const homeScreenSrc = fs.readFileSync(path.join(__dirname, 'src/screens/HomeScreen.jsx'), 'utf8');
const homeImports = ['MONTHS','PHASES','TRACKS','getTasksForMonth','monthProgress','overallProgress','nextTask','allWinsSorted','formatDate'];
const missingHomeImports = homeImports.filter(i => !homeScreenSrc.includes(i));
if (missingHomeImports.length === 0) pass('HomeScreen imports all required data/utilities');
else fail('HomeScreen missing imports: ' + missingHomeImports.join(', '));

// 7.2 PlanScreen dependencies
const planScreenSrc = fs.readFileSync(path.join(__dirname, 'src/screens/PlanScreen.jsx'), 'utf8');
if (planScreenSrc.includes('FlowerCelebration')) pass('PlanScreen imports FlowerCelebration');
else fail('PlanScreen does not import FlowerCelebration — celebrations will not work');
if (planScreenSrc.includes('isMonthComplete') && planScreenSrc.includes('isTrackComplete')) {
  pass('PlanScreen checks both month and track completion for celebrations');
} else {
  fail('PlanScreen missing isMonthComplete or isTrackComplete — some celebrations will not fire');
}

// 7.3 WinsScreen handles empty state
const winsScreenSrc = fs.readFileSync(path.join(__dirname, 'src/screens/WinsScreen.jsx'), 'utf8');
if (winsScreenSrc.includes('allWins.length === 0')) pass('WinsScreen handles empty wins state');
else warn('WinsScreen may not handle empty wins state — could look broken on first use');

// 7.4 JournalScreen handles empty state
const journalScreenSrc = fs.readFileSync(path.join(__dirname, 'src/screens/JournalScreen.jsx'), 'utf8');
if (journalScreenSrc.includes('allEntries.length === 0')) pass('JournalScreen handles empty journal state');
else warn('JournalScreen may not handle empty journal state');

// 7.5 ProgressScreen has three tabs
const progressScreenSrc = fs.readFileSync(path.join(__dirname, 'src/screens/ProgressScreen.jsx'), 'utf8');
['overall','months','tracks'].forEach(tab => {
  if (progressScreenSrc.includes(tab)) pass('ProgressScreen has "' + tab + '" tab');
  else fail('ProgressScreen missing "' + tab + '" tab');
});

// 7.6 HelpScreen has all expected sections
const helpScreenSrc = fs.readFileSync(path.join(__dirname, 'src/screens/HelpScreen.jsx'), 'utf8');
const expectedHelpTopics = ['Getting started','tasks','Journal','Wins','migraine','Saving'];
expectedHelpTopics.forEach(topic => {
  if (helpScreenSrc.toLowerCase().includes(topic.toLowerCase())) {
    pass('HelpScreen covers "' + topic + '"');
  } else {
    warn('HelpScreen may be missing section on "' + topic + '"');
  }
});

// 7.7 OnboardingModal has migraine toggle mention
const componentsSrc = fs.readFileSync(path.join(__dirname, 'src/components/index.js'), 'utf8');
if (componentsSrc.includes('migraine') || componentsSrc.includes('sun icon')) {
  pass('Onboarding mentions migraine mode / sun icon');
} else {
  warn('Onboarding may not mention migraine mode — new users might not know it exists');
}

// ─────────────────────────────────────────────────────────────────────────────
// SUITE 8 — Plan version and update system
// ─────────────────────────────────────────────────────────────────────────────
section('SUITE 8 — Version and Update System');

// 8.1 PLAN_VERSION defined
if (PLAN_VERSION) pass('PLAN_VERSION defined: ' + PLAN_VERSION);
else fail('PLAN_VERSION not defined in planData.js');

// 8.2 PLAN_VERSION_NOTES defined
const dataSrcRaw = fs.readFileSync(path.join(__dirname, 'src/data/planData.js'), 'utf8');
if (dataSrcRaw.includes('PLAN_VERSION_NOTES')) pass('PLAN_VERSION_NOTES defined for update banners');
else fail('PLAN_VERSION_NOTES missing — update banners will have no description');

// 8.3 App.js checks version against seenVersion
const appSrc = fs.readFileSync(path.join(__dirname, 'src/App.js'), 'utf8');
if (appSrc.includes('seenVersion') && appSrc.includes('PLAN_VERSION')) {
  pass('App.js compares seenVersion to PLAN_VERSION for update banner');
} else {
  fail('App.js missing version comparison — update banner will never show');
}

// 8.4 UpdateBanner is rendered
if (appSrc.includes('UpdateBanner')) pass('App.js renders UpdateBanner');
else fail('App.js does not render UpdateBanner');

// ─────────────────────────────────────────────────────────────────────────────
// RESULTS
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n' + '═'.repeat(60));
console.log(BOLD + 'TEST RESULTS' + RESET);
console.log('═'.repeat(60));
console.log(GREEN + BOLD + '  Passed:  ' + passed + RESET);
if (warned > 0)  console.log(YELLOW + BOLD + '  Warned:  ' + warned + RESET);
if (failed > 0)  console.log(RED + BOLD + '  Failed:  ' + failed + RESET);
console.log('  Total:   ' + (passed + warned + failed));
console.log('═'.repeat(60));

if (failures.length > 0) {
  console.log('\n' + RED + BOLD + 'FAILURES:' + RESET);
  failures.forEach((f, i) => console.log(RED + '  ' + (i+1) + '. ' + f + RESET));
}
if (warnings.length > 0) {
  console.log('\n' + YELLOW + BOLD + 'WARNINGS (review before launch):' + RESET);
  warnings.forEach((w, i) => console.log(YELLOW + '  ' + (i+1) + '. ' + w + RESET));
}

if (failed === 0 && warned === 0) {
  console.log('\n' + GREEN + BOLD + '✓ All tests passed — safe to deploy.' + RESET);
} else if (failed === 0) {
  console.log('\n' + YELLOW + BOLD + '⚠ Tests passed with warnings — review warnings before deploying.' + RESET);
} else {
  console.log('\n' + RED + BOLD + '✗ Tests failed — fix failures before deploying.' + RESET);
  process.exit(1);
}

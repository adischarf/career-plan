// ─── PLAN DATA SCHEMA ────────────────────────────────────────────────────────
// This file is the single source of truth for all plan content.
// Progress is stored separately in Google Drive (see useStorage hook).
// To update the plan: edit this file and bump PLAN_VERSION.

export const PLAN_VERSION = "1.0.0";
export const PLAN_VERSION_NOTES = "Initial release.";

// ─── TRACK DEFINITIONS ───────────────────────────────────────────────────────
export const TRACKS = {
  A: { id: "A", label: "Track A", name: "Psychological & Momentum", color: "sage",    pill: "pill-a", description: "The foundation everything else rests on." },
  B: { id: "B", label: "Track B", name: "Network Reactivation",     color: "lilac",   pill: "pill-b", description: "Gradual, shame-informed re-engagement." },
  C: { id: "C", label: "Track C", name: "Field Knowledge",          color: "gold",    pill: "pill-c", description: "Getting back on the pulse of child welfare policy." },
  D: { id: "D", label: "Track D", name: "Skill Building",           color: "teal",    pill: "pill-d", description: "Writing, data literacy, stats, policy craft." },
  E: { id: "E", label: "Track E", name: "Current Role",             color: "purple",  pill: "pill-e", description: "Maximizing what you have while you have it." },
  F: { id: "F", label: "Track F", name: "Job Search Prep",          color: "bougainvillea", pill: "pill-f", description: "Begins Month 5, executes Month 7+." },
};

// ─── PHASE DEFINITIONS ───────────────────────────────────────────────────────
export const PHASES = [
  {
    id: "phase1",
    label: "Phase 1",
    name: "Foundation & Reactivation",
    subtitle: "Months 1–6 · Stay in current role · Build the conditions for everything else",
    months: ["month1","month2","month3","month4_5","month6"],
    celebrationFlower: "bougainvillea",
    celebrationText: "Phase 1 Complete!",
    celebrationMessage: "Six months of showing up for yourself. The foundation is built.",
  },
  {
    id: "phase2",
    label: "Phase 2",
    name: "Positioning & Active Search",
    subtitle: "Months 7–12+ · Execute on what Phase 1 built · Find the right role",
    months: ["month7_9"],
    celebrationFlower: "bougainvillea",
    celebrationText: "Phase 2 Complete!",
    celebrationMessage: "You did it. From where you were to where you wanted to be.",
  },
];

// ─── MONTH DEFINITIONS ───────────────────────────────────────────────────────
export const MONTHS = [
  {
    id: "month1",
    label: "Month 1",
    phase: "phase1",
    title: "Lay the groundwork",
    subtitle: "Infrastructure, first reaches, lowest-stakes starts",
    celebrationText: "Month 1 Complete!",
    celebrationMessage: "You started. That is the hardest part, and you did it.",
    celebrationFlower: "lilac",
  },
  {
    id: "month2",
    label: "Month 2",
    phase: "phase1",
    title: "Weekly rhythm",
    subtitle: "LinkedIn on your terms — first writing draft",
    celebrationText: "Month 2 Complete!",
    celebrationMessage: "A rhythm is forming. You're doing this.",
    celebrationFlower: "lilac",
  },
  {
    id: "month3",
    label: "Month 3",
    phase: "phase1",
    title: "Coffee with your mentor",
    subtitle: "Expand network — first data steps",
    celebrationText: "Month 3 Complete!",
    celebrationMessage: "Halfway through Phase 1. The network is waking up.",
    celebrationFlower: "lilac",
  },
  {
    id: "month4_5",
    label: "Months 4–5",
    phase: "phase1",
    title: "Deepen everything",
    subtitle: "External feedback — job search prep begins",
    celebrationText: "Months 4–5 Complete!",
    celebrationMessage: "You're building something real. Writing samples. Data skills. Connections.",
    celebrationFlower: "lilac",
  },
  {
    id: "month6",
    label: "Month 6",
    phase: "phase1",
    title: "Consolidate and get ready",
    subtitle: "Phase 1 closes — Phase 2 begins",
    celebrationText: "Month 6 Complete!",
    celebrationMessage: "Phase 1 is done. You are not the same person who opened this plan six months ago.",
    celebrationFlower: "lilac",
  },
  {
    id: "month7_9",
    label: "Months 7–9",
    phase: "phase2",
    title: "Active search",
    subtitle: "Warm applications — sustain the habits",
    celebrationText: "Months 7–9 Complete!",
    celebrationMessage: "The search is underway. Trust the work you did in Phase 1.",
    celebrationFlower: "lilac",
  },
];

// ─── TASK DEFINITIONS ────────────────────────────────────────────────────────
// Each task has:
//   id, monthId, trackId, label, title (short), body (full prose),
//   subtasks (array), isRecurring, recurringLabel,
//   contextualHelp (optional prose shown behind Read More),
//   crossRefs (array of task IDs this task references),
//   hasOutput (bool), winText (plain language for wins log)

export const TASKS = [

  // ══════════════════════════════════════════════
  // MONTH 1
  // ══════════════════════════════════════════════

  {
    id: "A1", monthId: "month1", trackId: "A",
    label: "Task A1", title: "Share this plan with your ADHD coach",
    body: "In your next session with your ADHD coach, share this plan and ask them to help you build the scaffolding for it. Specifically: how to break down abstract tasks, what a realistic weekly rhythm looks like, and how to set up accountability check-ins.",
    subtasks: [
      { id: "A1a", text: "Bring this plan to your next ADHD coach session" },
      { id: "A1b", text: "Ask them how to break down abstract tasks" },
      { id: "A1c", text: "Agree on a realistic weekly rhythm together" },
      { id: "A1d", text: "Set up an accountability check-in structure" },
    ],
    isRecurring: false,
    hasOutput: false,
    winText: "Shared your plan with your ADHD coach and built scaffolding for it",
    timeBox: "One session, 1 hour",
  },
  {
    id: "A2", monthId: "month1", trackId: "A",
    label: "Task A2", title: "Write your 'at my best' reference document",
    body: "Write a private document — just for you — answering: What did it feel like when I was at my best in grad school? What were the conditions? What was I doing? One page only. This is a reference document, not a performance. You'll return to it in Month 3 as a compass check.",
    subtasks: [
      { id: "A2a", text: "Find a quiet moment and open a new document" },
      { id: "A2b", text: "Write: what did it feel like when I was at my best in grad school?" },
      { id: "A2c", text: "Write: what were the conditions? What was I doing?" },
      { id: "A2d", text: "Save it somewhere private you can find again" },
    ],
    isRecurring: false,
    hasOutput: true,
    winText: "Wrote your 'at my best' reference document — a compass for hard days",
    timeBox: "30 minutes",
  },
  {
    id: "A3", monthId: "month1", trackId: "A",
    label: "Task A3", title: "Find a workspace outside your home",
    body: "Identify one physical workspace outside your home that is free or very low cost — a library, a coffee shop with a monthly pass, a co-working day at a friend's office. Commit to going at least once a week. This is a structural intervention for your ADHD and your daily quality of life. It is not optional.",
    subtasks: [
      { id: "A3a", text: "Brainstorm free or low-cost options near you" },
      { id: "A3b", text: "Visit at least one option to try it out" },
      { id: "A3c", text: "Commit to going at least once a week" },
    ],
    isRecurring: false,
    hasOutput: false,
    winText: "Found a workspace outside home — a structural win for your ADHD brain",
    timeBox: null,
  },
  {
    id: "A4", monthId: "month1", trackId: "A",
    label: "Task A4", title: "Create your wins log",
    body: "Set up a simple wins log — a note on your phone, a sticky note on your desk, or a document. Any time you complete a task in this plan, write it down with the date. This gives your brain the external evidence of progress it needs and is not currently getting from work.",
    subtasks: [
      { id: "A4a", text: "Choose your format (phone note, sticky note, or document)" },
      { id: "A4b", text: "Write today's date and your first entry: 'Started the plan'" },
    ],
    isRecurring: false,
    hasOutput: false,
    winText: "Created your wins log — external evidence of progress starts now",
    timeBox: "5 minutes",
  },

  {
    id: "B1", monthId: "month1", trackId: "B",
    label: "Task B1", title: "Build your network tier list",
    body: "Don't open LinkedIn yet. Instead, make a private list of every person in your network, organized into three tiers: (1) warm/close, (2) meaningful but less frequent, (3) one-off contacts. To jog your memory: search your email inbox for names, scroll your LinkedIn connections list without reading the feed, look back at conference programs or internship org directories, and think through each role or experience chronologically.",
    subtasks: [
      { id: "B1a", text: "Search your email inbox for names from grad school and internships" },
      { id: "B1b", text: "Browse LinkedIn connections list (without reading the feed)" },
      { id: "B1c", text: "Think through each role/experience chronologically" },
      { id: "B1d", text: "Build your three-tier list (warm / meaningful / one-off)" },
    ],
    isRecurring: false,
    hasOutput: true,
    winText: "Built your network tier list — the map of who's in your corner",
    timeBox: "45 minutes",
    contextualHelp: "A note on shame before this task: the fear is that people will notice you were gone and think less of you. In reality, almost no one is tracking your absence as carefully as you are. People are busy. Reaching out after a gap is normal and human. The response will almost always be warmth, not judgment. The shame is internal, not external. The only way to know that experientially is to reach out and see what happens.\n\nThis task is just an inventory — no outreach required yet. Start here.",
  },
  {
    id: "B2", monthId: "month1", trackId: "B",
    label: "Task B2", title: "Reach out to your mentor",
    body: "Your mentor from your favorite internship leads the policy team at the org, lives in DC, and you used to get coffee every six months. She is Tier 1. Send her a text or email this month. Keep it simple: \"Hey [name], I've been meaning to reach out — would love to catch up over coffee when you have a window. Hope you're well.\" Do not over-explain or apologize for the gap. She will say yes.",
    subtasks: [
      { id: "B2a", text: "Draft a short message (use the example language if it helps)" },
      { id: "B2b", text: "Send it — text or email, whichever feels more natural" },
    ],
    isRecurring: false,
    hasOutput: false,
    winText: "Reached out to your mentor for the first time in a year — the hardest message sent",
    timeBox: "10 minutes",
    contextualHelp: "The message doesn't have to be perfect — it has to be sent. Something like: \"Hey [name], I've been meaning to reach out — would love to catch up over coffee when you have a window. Hope you're well.\" That's it. No explanation of where you've been. No apology. Just a door opened.",
  },

  {
    id: "C1", monthId: "month1", trackId: "C",
    label: "Task C1", title: "Subscribe to two field newsletters",
    body: "Set up your reading infrastructure. Subscribe to two or three newsletters or policy digests. Recommended starting points: the Child Welfare Information Gateway updates, the Annie E. Casey Foundation newsletter, First Focus on Children's policy updates, and the Chronicle of Social Change. Choose two that feel most relevant to you.",
    subtasks: [
      { id: "C1a", text: "Browse: Child Welfare Information Gateway (childwelfare.gov)" },
      { id: "C1b", text: "Browse: Annie E. Casey Foundation newsletter (aecf.org)" },
      { id: "C1c", text: "Browse: First Focus on Children (firstfocus.org)" },
      { id: "C1d", text: "Browse: Chronicle of Social Change (chronicleofsocialchange.org)" },
      { id: "C1e", text: "Subscribe to your two favorites" },
    ],
    isRecurring: false,
    hasOutput: false,
    winText: "Subscribed to two child welfare policy newsletters — field knowledge starts flowing",
    timeBox: "20 minutes",
  },
  {
    id: "C2", monthId: "month1", trackId: "C",
    label: "Task C2", title: "Create your field journal",
    body: "Create a field journal — a simple folder in your email, a notes app, or a document. When you read something interesting, drop a one-sentence note about why it matters. No length requirement — one sentence is enough. This becomes material for future conversations, writing, and job interviews.",
    subtasks: [
      { id: "C2a", text: "Choose your format (email folder, notes app, or document)" },
      { id: "C2b", text: "Write your first entry: one sentence about something you already know about the field" },
    ],
    isRecurring: false,
    hasOutput: true,
    winText: "Created your field journal — a running record of your thinking",
    timeBox: "10 minutes",
  },
  {
    id: "C3", monthId: "month1", trackId: "C",
    label: "Task C3", title: "Read one piece from your org's body of work",
    body: "Your organization has done decades of foundational child welfare work. Getting familiar with it serves two purposes: it rebuilds your field knowledge and helps you contribute more meaningfully at work. Spend one session browsing your org's publications page — reports, briefs, toolkits. Pick one piece to read this month.",
    subtasks: [
      { id: "C3a", text: "Browse your org's publications or reports page" },
      { id: "C3b", text: "Choose one piece that looks interesting or relevant" },
      { id: "C3c", text: "Read it (executive summary + recommendations at minimum)" },
      { id: "C3d", text: "Add one sentence to your field journal about what you read" },
    ],
    isRecurring: false,
    hasOutput: false,
    winText: "Read a piece from your org's body of work — your own organization's field knowledge",
    timeBox: "15 min browsing + 20 min reading",
  },

  {
    id: "D1", monthId: "month1", trackId: "D",
    label: "Task D1", title: "Excel gap-close: pivot tables and VLOOKUP",
    body: "Complete two 30-minute sessions on Excel fundamentals this month. Focus on pivot tables, basic charts, and VLOOKUP/INDEX-MATCH. ExcelJet.net has free, concise reference guides. This is immediately useful in your current role and requires no new software.",
    subtasks: [
      { id: "D1a", text: "Session 1: pivot tables (ExcelJet.net → Pivot Tables)" },
      { id: "D1b", text: "Session 2: VLOOKUP/INDEX-MATCH (ExcelJet.net → Formulas)" },
    ],
    isRecurring: false,
    hasOutput: false,
    winText: "Completed two Excel skill sessions — pivot tables and VLOOKUP",
    timeBox: "Two 30-minute sessions",
  },
  {
    id: "D2", monthId: "month1", trackId: "D",
    label: "Task D2", title: "Collect policy writing examples to study",
    body: "Collect three to five examples of the policy writing you want to produce: a coalition one-pager, a legislative fact sheet, a policy brief, a comment letter. Save them. Read them for structure, not just content — how do they open? How do they use data? What is the paragraph length? What is the tone?",
    subtasks: [
      { id: "D2a", text: "Find a coalition one-pager from an org you admire" },
      { id: "D2b", text: "Find a legislative fact sheet" },
      { id: "D2c", text: "Find a policy brief or comment letter" },
      { id: "D2d", text: "Read them for structure: opening, data use, length, tone" },
      { id: "D2e", text: "Save them somewhere you can reference later" },
    ],
    isRecurring: false,
    hasOutput: true,
    winText: "Collected policy writing examples — you now have models to learn from",
    timeBox: "One 45-minute session",
  },

  {
    id: "E1", monthId: "month1", trackId: "E",
    label: "Task E1", title: "Map the legal framework of your current role",
    body: "Map the legal framework of your current job in plain language. What statute or regulation does your team operate under? What does it require and prohibit? Write it down — one page max. Understanding the constraints is different from accepting them, and doing this will reduce the daily mental friction you feel.",
    subtasks: [
      { id: "E1a", text: "Identify the statute or regulation your team operates under" },
      { id: "E1b", text: "Write out what it requires and what it prohibits — plain language" },
      { id: "E1c", text: "Keep it to one page and save it" },
    ],
    isRecurring: false,
    hasOutput: true,
    winText: "Mapped the legal framework of your current role — reduced daily friction",
    timeBox: "30 minutes",
  },
  {
    id: "E2", monthId: "month1", trackId: "E",
    label: "Task E2", title: "Bring daily structure to your ADHD coach",
    body: "Bring the specific question of daily remote work structure to your ADHD coach this month. Not in general terms — specifically: what time of day is your focus sharpest, and can you block that window for your hardest tasks? Experiment with the Pomodoro technique (25 minutes on, 5 off) for tasks you tend to avoid.",
    subtasks: [
      { id: "E2a", text: "Bring remote work structure to your ADHD coach session" },
      { id: "E2b", text: "Identify your sharpest focus window (morning? mid-morning?)" },
      { id: "E2c", text: "Try one Pomodoro session (25 min on, 5 off) for an avoided task" },
    ],
    isRecurring: false,
    hasOutput: false,
    winText: "Brought remote work structure to your ADHD coach — designed around how your brain works",
  },
  {
    id: "E3", monthId: "month1", trackId: "E",
    label: "Task E3", title: "Fix the org newsletter and send one internal message",
    body: "Find out how to get on your organization's internal newsletter if you are not already receiving it. Being siloed is partly structural — the newsletter is one easy fix. Also identify one colleague on a different team whose work interests you and send a brief internal message introducing yourself or referencing something from their work.",
    subtasks: [
      { id: "E3a", text: "Find out who manages the org newsletter and ask to be added" },
      { id: "E3b", text: "Identify one colleague on a different team whose work interests you" },
      { id: "E3c", text: "Send them a brief message — intro or a reference to their work" },
    ],
    isRecurring: false,
    hasOutput: false,
    winText: "Got on the org newsletter and reached out to a colleague — less siloed already",
  },

  // ══════════════════════════════════════════════
  // MONTH 2
  // ══════════════════════════════════════════════

  {
    id: "A5", monthId: "month2", trackId: "A",
    label: "Task A5", title: "Establish your Sunday reset rhythm",
    body: "Rather than a fixed recurring block (which breaks when life is unpredictable), try a Sunday reset: each Sunday, spend 10 minutes looking at the week ahead and deciding when your career development hour will happen that specific week. Block it on your calendar for that week only. This adapts to your actual schedule rather than requiring you to stick to a slot that may not always exist. If Sunday itself is variable, pick whatever day works as your planning day.",
    subtasks: [
      { id: "A5a", text: "Choose your weekly planning day (Sunday or another consistent day)" },
      { id: "A5b", text: "Do your first Sunday reset: look at next week and block your career development hour" },
      { id: "A5c", text: "Tell your boyfriend or ADHD coach your planning day — soft accountability" },
    ],
    isRecurring: true,
    recurringLabel: "Weekly Sunday reset",
    recurringDescription: "Each week: 10 minutes to look at the week ahead and schedule your career development hour.",
    hasOutput: false,
    winText: "Established your Sunday reset rhythm — flexible structure that bends without breaking",
    timeBox: "10 minutes each week",
  },
  {
    id: "A6", monthId: "month2", trackId: "A",
    label: "Task A6", title: "Explore LinkedIn avoidance with your coach",
    body: "Address the LinkedIn avoidance with your therapist or ADHD coach — not to solve it, but to understand it. There is a practical workaround in Track B this month that reduces comparison exposure. But the avoidance pattern itself is worth examining alongside someone who knows you.",
    subtasks: [
      { id: "A6a", text: "Bring LinkedIn avoidance to your therapist or ADHD coach" },
      { id: "A6b", text: "Note one thing you learned about the pattern" },
    ],
    isRecurring: false,
    hasOutput: false,
    winText: "Explored LinkedIn avoidance with your coach — named the pattern",
  },

  {
    id: "B3", monthId: "month2", trackId: "B",
    label: "Task B3", title: "Do a LinkedIn protective audit",
    body: "Before opening LinkedIn, make one protective change: go to Settings and mute or unfollow people whose updates trigger comparison pain. You are not unfriending anyone — you are editing your feed to be a learning resource, not a comparison engine. You can do this without scrolling: go directly to a person's profile by name and mute from there.",
    subtasks: [
      { id: "B3a", text: "Go to LinkedIn Settings → Muting and blocking" },
      { id: "B3b", text: "Mute or unfollow 2–3 people whose updates trigger comparison" },
      { id: "B3c", text: "Do this by searching names directly — do not open the home feed" },
    ],
    isRecurring: false,
    hasOutput: false,
    winText: "Did a LinkedIn protective audit — your feed is now a tool, not a trap",
    contextualHelp: "You don't have to mute everyone. Just the 2–3 people whose updates most reliably send you into a spiral. You know who they are. This is an act of self-protection, not negativity. You can always un-mute later.",
  },
  {
    id: "B4", monthId: "month2", trackId: "B",
    label: "Task B4", title: "20-minute LinkedIn engagement (no feed)",
    body: "How to engage on LinkedIn without scrolling: instead of opening your home feed, go directly to the search bar and search for a specific organization or topic you care about. Navigate to that org's page and engage with one of their recent posts from there. Or go directly to the profile of a thought leader you already follow and engage with one of their posts. Set a timer for 20 minutes. Search → engage → close. Never open the home feed.",
    subtasks: [
      { id: "B4a", text: "Set a 20-minute timer" },
      { id: "B4b", text: "Go to LinkedIn search — search for a child welfare org you follow" },
      { id: "B4c", text: "Follow 3–5 new orgs or thought leaders from their pages directly" },
      { id: "B4d", text: "Like or comment on one post — then close the app" },
    ],
    isRecurring: true,
    recurringLabel: "Weekly LinkedIn engagement (no feed)",
    recurringDescription: "One action per week: search → org page or thought leader → engage → close. Never open the home feed. 20 minutes max.",
    hasOutput: false,
    winText: "Did a focused LinkedIn session — on your terms, without the comparison spiral",
    timeBox: "20 minutes max",
  },
  {
    id: "B5", monthId: "month2", trackId: "B",
    label: "Task B5", title: "Email the professor you played phone tag with",
    body: "The professor you played phone tag with after graduation: this one deserves a gentler approach. You do not owe this person an apology for being a busy person who struggled to schedule. What is true is that you respected them, got something real from your time with them, and would like to reconnect. That is enough. A short email: \"I've been thinking about our conversations from grad school and wanted to reach out. I'd love to catch up if you ever have a few minutes — no pressure at all.\" No explanation of where you have been. No apology tour. Just a door opened.",
    subtasks: [
      { id: "B5a", text: "Draft a short email using the example language if it helps" },
      { id: "B5b", text: "Remove anything that sounds like an apology or explanation" },
      { id: "B5c", text: "Send it" },
    ],
    isRecurring: false,
    hasOutput: false,
    winText: "Emailed the professor you'd been avoiding — opened a door you thought was closed",
    timeBox: "20 minutes",
    contextualHelp: "You've been telling yourself you owe this person an apology for the scheduling struggles. You don't. You were a grad student navigating a busy transition. They know this. A short, warm message asking if they'd like to catch up is all this is. You're not asking for anything. You're just re-opening a connection.",
  },
  {
    id: "B6_pending", monthId: "month2", trackId: "B",
    label: "Task B6", title: "Respond to pending LinkedIn connection messages",
    body: "You went back on LinkedIn and found 3–5 messages from people wanting to connect. You don't need to be fully \"back in the game\" to respond to these. A simple reply: \"Thanks so much for reaching out — happy to connect\" or, if they asked for something specific: \"Thanks for this — I'd be happy to connect, though my bandwidth is limited right now.\" Leaving them unanswered longer doesn't serve you. Respond briefly, connect, and move on. You are not committing to a conversation. You are keeping a door open.",
    subtasks: [
      { id: "B6a", text: "Open your LinkedIn message requests" },
      { id: "B6b", text: "Reply to each one briefly (use the example language)" },
      { id: "B6c", text: "Accept the connection requests" },
    ],
    isRecurring: false,
    hasOutput: false,
    winText: "Responded to pending LinkedIn messages — kept doors open with minimal energy",
    timeBox: "15 minutes",
  },

  {
    id: "C4", monthId: "month2", trackId: "C",
    label: "Task C4", title: "Read one longer-form field piece",
    body: "Read one longer-form piece this month — a policy brief, a report, or a Congressional Research Service summary on child welfare. Read the executive summary and the recommendations. Fifteen minutes. Write one sentence in your field journal.",
    subtasks: [
      { id: "C4a", text: "Choose a longer piece from your newsletters or a source you trust" },
      { id: "C4b", text: "Read the executive summary and recommendations" },
      { id: "C4c", text: "Add one sentence to your field journal" },
    ],
    isRecurring: false,
    hasOutput: false,
    winText: "Read a longer-form field piece and captured a thought in your field journal",
    timeBox: "15 minutes",
  },
  {
    id: "C5", monthId: "month2", trackId: "C",
    label: "Task C5", title: "Read another piece from your org's body of work",
    body: "Continue your org's body of work: read one more publication from your organization this month. The goal by Month 4 is being able to speak with genuine fluency about what your organization stands for, what problems it has identified, and how its approach fits into the broader field landscape. This is also excellent interview preparation.",
    subtasks: [
      { id: "C5a", text: "Browse your org's publications again and choose a second piece" },
      { id: "C5b", text: "Read it (executive summary + key findings at minimum)" },
      { id: "C5c", text: "Add a note to your field journal" },
    ],
    isRecurring: false,
    hasOutput: false,
    winText: "Read a second piece from your org's body of work — building fluency in your own organization",
    crossRefs: ["C3"],
  },

  {
    id: "D3", monthId: "month2", trackId: "D",
    label: "Task D3", title: "Write your first practice one-pager",
    body: "Write your first practice one-pager. 400 words, any child welfare topic you care about. Use the structural patterns you identified in Task D2. The first draft will be rough — that is correct and expected.",
    subtasks: [
      { id: "D3a", text: "Choose a topic you've been reading about (e.g., FFPSA implementation)" },
      { id: "D3b", text: "Open the writing models you collected in Task D2 for reference" },
      { id: "D3c", text: "Write a draft: problem statement, evidence paragraph, recommendation" },
      { id: "D3d", text: "Stop at 400 words — done is better than perfect" },
    ],
    isRecurring: false,
    hasOutput: true,
    winText: "Wrote your first practice one-pager — the hardest draft is always the first",
    timeBox: "45–60 minutes",
    crossRefs: ["D2"],
    contextualHelp: "A practice one-pager is not an op-ed. It does not need to be original. What it is: a structured exercise in translating something you already know or have just read into the format that policy audiences use. The goal is to practice the form — the executive summary, the problem statement, the evidence paragraph, the recommendation line — not to stake out a new intellectual position.\n\nA specific low-stakes prompt: choose one active child welfare debate you've been reading about (e.g., FFPSA implementation challenges) and write a 400-word summary of the issue, what research says, and one policy recommendation that already exists in the field. You are not inventing the recommendation — you are learning to write in the genre.",
  },
  {
    id: "D4", monthId: "month2", trackId: "D",
    label: "Task D4", title: "Begin R for Data Science — Chapters 1–2",
    body: "Begin R for Data Science (free at r4ds.hadley.nz). Complete Chapters 1–2 this month. R with the tidyverse is widely used in policy research environments, has a large free learning ecosystem, and produces the kind of clean data visualizations that are genuinely useful in policy advocacy work.",
    subtasks: [
      { id: "D4a", text: "Go to r4ds.hadley.nz and bookmark it" },
      { id: "D4b", text: "Install R and RStudio if not already installed (free at posit.co)" },
      { id: "D4c", text: "Complete Chapter 1 (Introduction)" },
      { id: "D4d", text: "Complete Chapter 2 (Workflow basics)" },
    ],
    isRecurring: false,
    hasOutput: false,
    winText: "Started R for Data Science — first two chapters done",
    timeBox: "Two 30-minute sessions",
  },

  {
    id: "E4", monthId: "month2", trackId: "E",
    label: "Task E4", title: "Treat coalition project hours as your most important work",
    body: "The 6 hours per month on the policy/coalition project: treat these as the most important 6 hours of your work month. Come prepared. Do more than asked where possible. Ask questions that demonstrate policy depth. This is your internal audition for more.",
    subtasks: [
      { id: "E4a", text: "Before each coalition session: review relevant background materials" },
      { id: "E4b", text: "During sessions: ask at least one substantive policy question" },
      { id: "E4c", text: "After sessions: note one thing you contributed or learned" },
    ],
    isRecurring: true,
    recurringLabel: "Monthly coalition project (6 hrs)",
    recurringDescription: "Come prepared. Do more than asked. Ask questions that show policy depth. This is your internal audition.",
    hasOutput: false,
    winText: "Showed up fully for your coalition project hours — your internal audition",
  },
  {
    id: "E5", monthId: "month2", trackId: "E",
    label: "Task E5", title: "Follow up on internal networking from Month 1",
    body: "Follow up on any response to your Month 1 internal outreach. Identify one internal meeting, working group, or all-hands event where you could be more visible. Being siloed is partly about proximity — showing up in shared spaces matters even if you are not yet on shared projects.",
    subtasks: [
      { id: "E5a", text: "Reply to any responses from your Month 1 internal message" },
      { id: "E5b", text: "Find one internal meeting or all-hands you can attend" },
      { id: "E5c", text: "Show up and introduce yourself to at least one new colleague" },
    ],
    isRecurring: false,
    hasOutput: false,
    winText: "Followed up on internal networking — one step less siloed",
    crossRefs: ["E3"],
  },

  // ══════════════════════════════════════════════
  // MONTH 3
  // ══════════════════════════════════════════════

  {
    id: "A7", monthId: "month3", trackId: "A",
    label: "Task A7", title: "Month 3 compass check",
    body: "Pull out the reference document you wrote in Task A2 — what it felt like when you were at your best. Does any of it feel more accessible now than it did in Month 1? Write one sentence update. This is a compass check, not a performance review.",
    subtasks: [
      { id: "A7a", text: "Find the document you wrote in Task A2" },
      { id: "A7b", text: "Read it with fresh eyes" },
      { id: "A7c", text: "Write one sentence: what feels more accessible now than in Month 1?" },
    ],
    isRecurring: false,
    hasOutput: false,
    winText: "Did your Month 3 compass check — measured how far you've come",
    crossRefs: ["A2"],
  },

  {
    id: "B7", monthId: "month3", trackId: "B",
    label: "Task B7", title: "Have coffee with your mentor",
    body: "Have coffee with your mentor (following up on Task B2). Come with one specific question: \"Who in DC child welfare policy should I be talking to right now?\" Write down her answer. This is how you warm-start the rest of your network — through a trusted person, not cold outreach.",
    subtasks: [
      { id: "B7a", text: "Confirm the coffee meeting from Task B2" },
      { id: "B7b", text: "Prepare your one question: \"Who should I be talking to right now?\"" },
      { id: "B7c", text: "Go to the meeting" },
      { id: "B7d", text: "Write down her answer and any names she gives you" },
    ],
    isRecurring: false,
    hasOutput: true,
    winText: "Had coffee with your mentor and got her referrals — your network is warming up",
    crossRefs: ["B2"],
  },
  {
    id: "B8", monthId: "month3", trackId: "B",
    label: "Task B8", title: "Re-engage a former internship colleague",
    body: "Identify two or three former internship colleagues you still follow on social media. Send one of them a direct message — reference something about their work, a piece they shared, a project you noticed. Not a networking ask. Just a re-engagement.",
    subtasks: [
      { id: "B8a", text: "Identify 2–3 former internship colleagues you follow" },
      { id: "B8b", text: "Choose one whose recent work is interesting to you" },
      { id: "B8c", text: "Send a short direct message referencing their work (not a networking ask)" },
    ],
    isRecurring: false,
    hasOutput: false,
    winText: "Re-engaged a former internship colleague — a dormant connection reactivated",
    timeBox: "15 minutes",
  },
  {
    id: "B9", monthId: "month3", trackId: "B",
    label: "Task B9", title: "Map your ANC network for child welfare connections",
    body: "Your ANC work gives you contacts in DC city council and the mayor's office, and connections with community groups. Make a list of anyone in that network who touches child welfare, family services, or youth services in DC. You may be closer to the local field than you realize — and local DC government connections are a real asset in federal policy circles.",
    subtasks: [
      { id: "B9a", text: "Go through your ANC contacts list" },
      { id: "B9b", text: "Note anyone connected to child welfare, family services, or youth services" },
      { id: "B9c", text: "Add them to your network tier list from Task B1" },
    ],
    isRecurring: false,
    hasOutput: true,
    winText: "Mapped your ANC network for child welfare connections — local assets identified",
    crossRefs: ["B1"],
  },

  {
    id: "C6", monthId: "month3", trackId: "C",
    label: "Task C6", title: "Attend your first virtual field event",
    body: "Attend one virtual event this month — a webinar, a Hill briefing, or a coalition call. You do not have to speak or network at it. Just be in the room. Add one sentence to your field journal afterward.",
    subtasks: [
      { id: "C6a", text: "Find a virtual event in child welfare policy (check org newsletters)" },
      { id: "C6b", text: "Register and add it to your calendar" },
      { id: "C6c", text: "Attend" },
      { id: "C6d", text: "Add one sentence to your field journal about what you heard" },
    ],
    isRecurring: false,
    hasOutput: false,
    winText: "Attended your first virtual field event — you're back in the room",
  },
  {
    id: "C7", monthId: "month3", trackId: "C",
    label: "Task C7", title: "Write summaries of 2–3 active CW debates",
    body: "Identify the two or three biggest active debates or legislative priorities in child welfare right now — for example: FFPSA implementation, Title IV-E expansion, family preservation vs. congregate care debates. Write a one-paragraph summary of each for your own reference only. This is how you rebuild your finger on the pulse.",
    subtasks: [
      { id: "C7a", text: "Identify 2–3 active CW debates from your reading" },
      { id: "C7b", text: "Write a one-paragraph summary of each" },
      { id: "C7c", text: "Save them in your field journal" },
    ],
    isRecurring: false,
    hasOutput: true,
    winText: "Wrote summaries of active child welfare debates — your finger is on the pulse again",
    timeBox: "45 minutes",
  },
  {
    id: "C8", monthId: "month3", trackId: "C",
    label: "Task C8", title: "Third piece from org body of work",
    body: "Continue your org's body of work reading. After three pieces, you should be developing a clear sense of your org's intellectual framework and contributions to the field.",
    subtasks: [
      { id: "C8a", text: "Choose a third piece from your org's publications" },
      { id: "C8b", text: "Read it and add a note to your field journal" },
    ],
    isRecurring: false,
    hasOutput: false,
    winText: "Read a third piece from your org — developing real fluency in its work",
    crossRefs: ["C3","C5"],
  },

  {
    id: "D5", monthId: "month3", trackId: "D",
    label: "Task D5", title: "Write your second practice one-pager",
    body: "Write your second practice one-pager. Try a different format from Month 2 — if you summarized an issue last month, try drafting a legislative fact sheet this month. Completed draft is the goal, not polish.",
    subtasks: [
      { id: "D5a", text: "Choose a different format from last month (try a legislative fact sheet)" },
      { id: "D5b", text: "Draft it — use your Month 1 writing models for structure" },
      { id: "D5c", text: "Save it as Draft 2 in your writing portfolio" },
    ],
    isRecurring: false,
    hasOutput: true,
    winText: "Wrote your second practice one-pager — two drafts in your portfolio",
    crossRefs: ["D3"],
  },
  {
    id: "D6", monthId: "month3", trackId: "D",
    label: "Task D6", title: "R for Data Science — Chapters 3–5",
    body: "Continue R for Data Science: complete Chapters 3–5 (data visualization with ggplot2). This is where R starts to feel rewarding — you will be producing actual charts.",
    subtasks: [
      { id: "D6a", text: "Complete Chapter 3 (Data visualization)" },
      { id: "D6b", text: "Complete Chapter 4 (Workflow: basics)" },
      { id: "D6c", text: "Complete Chapter 5 (Data transformation)" },
    ],
    isRecurring: false,
    hasOutput: false,
    winText: "Completed R Chapters 3–5 — you're making actual charts now",
    timeBox: "Two 30-minute sessions",
    crossRefs: ["D4"],
  },

  {
    id: "E6", monthId: "month3", trackId: "E",
    label: "Task E6", title: "Have the trajectory conversation with your supervisor",
    body: "Have a specific conversation with your supervisor about your trajectory. Not \"I want to do more\" — instead: \"I'm really energized by the coalition project. I'd like to understand what it would take to expand that kind of work in my role over the next six months. Can we talk about that?\" Your supervisor is already advocating for you — give them something concrete to advocate for.",
    subtasks: [
      { id: "E6a", text: "Prepare your specific ask (use the language above as a starting point)" },
      { id: "E6b", text: "Request a 15-minute conversation with your supervisor" },
      { id: "E6c", text: "Have the conversation" },
      { id: "E6d", text: "Note what they said and any next steps" },
    ],
    isRecurring: false,
    hasOutput: false,
    winText: "Had the trajectory conversation with your supervisor — a specific ask, on record",
  },

  // ══════════════════════════════════════════════
  // MONTHS 4–5
  // ══════════════════════════════════════════════

  {
    id: "A8", monthId: "month4_5", trackId: "A",
    label: "Task A8", title: "LinkedIn comparison pain check-in",
    body: "By Month 5: check in with yourself on the LinkedIn comparison pain. Is it less acute than in Month 1? What changed? Bring this observation to your therapist or coach — not as a problem to solve, but as data about what is working.",
    subtasks: [
      { id: "A8a", text: "Reflect: is the comparison pain less acute than in Month 1?" },
      { id: "A8b", text: "Note what changed — what made it easier?" },
      { id: "A8c", text: "Bring this observation to your therapist or coach" },
    ],
    isRecurring: false,
    hasOutput: false,
    winText: "Checked in on LinkedIn comparison pain — noticed what's shifted",
  },

  {
    id: "B10", monthId: "month4_5", trackId: "B",
    label: "Task B10", title: "First informational interview",
    body: "One informational interview in Month 4, sourced from your mentor's referrals or from people whose LinkedIn content you have been following. These are 20–30 minute conversations. You do not need to have all the answers — you need to be curious and listen.",
    subtasks: [
      { id: "B10a", text: "Choose a name from your mentor's referrals or your LinkedIn follows" },
      { id: "B10b", text: "Send a brief request for a 20-minute call" },
      { id: "B10c", text: "Prepare 3 questions beforehand" },
      { id: "B10d", text: "Have the conversation" },
      { id: "B10e", text: "Send a thank-you note within 24 hours" },
    ],
    isRecurring: false,
    hasOutput: false,
    winText: "Had your first informational interview — a new warm contact in the field",
    timeBox: "20–30 minute conversation",
    crossRefs: ["B7"],
  },
  {
    id: "B11", monthId: "month4_5", trackId: "B",
    label: "Task B11", title: "Second informational interview",
    body: "One informational interview in Month 5, continuing to build from your mentor's referrals or LinkedIn follows. By the end of Month 5, you should have had two informational conversations.",
    subtasks: [
      { id: "B11a", text: "Choose a second contact for an informational conversation" },
      { id: "B11b", text: "Send a brief request for a 20-minute call" },
      { id: "B11c", text: "Prepare 3 questions" },
      { id: "B11d", text: "Have the conversation" },
      { id: "B11e", text: "Send a thank-you note within 24 hours" },
    ],
    isRecurring: false,
    hasOutput: false,
    winText: "Had your second informational interview — two new warm contacts",
    crossRefs: ["B10"],
  },
  {
    id: "B12", monthId: "month4_5", trackId: "B",
    label: "Task B12", title: "Reach out to the capstone professor",
    body: "The professor you worked closely with on the capstone project (this is a different person from the phone-tag professor in Task B5): reach out in Month 4 or 5. This person watched you do serious, sustained work together. Reference the capstone specifically, share briefly what you have been working on, and ask if they would be open to catching up.",
    subtasks: [
      { id: "B12a", text: "Draft a short email referencing the capstone project specifically" },
      { id: "B12b", text: "Share one sentence about what you've been working on since" },
      { id: "B12c", text: "Ask if they'd be open to catching up" },
      { id: "B12d", text: "Send it" },
    ],
    isRecurring: false,
    hasOutput: false,
    winText: "Reached out to your capstone professor — reconnected with someone who saw your best work",
    timeBox: "30 minutes to draft and send",
    crossRefs: ["B5"],
  },
  {
    id: "B13", monthId: "month4_5", trackId: "B",
    label: "Task B13", title: "Consider your first original LinkedIn post",
    body: "Continue one LinkedIn engagement per week. By Month 5, consider posting one piece of original content — a brief observation about something you read in the field, a question you have been thinking about, a reflection on an event you attended. It does not have to be polished. It signals that you are engaged and thinking.",
    subtasks: [
      { id: "B13a", text: "Think of one observation or question from your field reading" },
      { id: "B13b", text: "Draft a short post (2–4 sentences)" },
      { id: "B13c", text: "Post it (or save as draft if not ready — that's okay too)" },
    ],
    isRecurring: false,
    hasOutput: false,
    winText: "Posted original content on LinkedIn for the first time — you're visible in the field again",
  },

  {
    id: "C9", monthId: "month4_5", trackId: "C",
    label: "Task C9", title: "Attend a second virtual event and participate",
    body: "Attend one more virtual event in Month 4 or 5. This time, try to ask one question or make one comment in the chat. One. That is the whole goal.",
    subtasks: [
      { id: "C9a", text: "Find and register for a virtual event" },
      { id: "C9b", text: "Attend" },
      { id: "C9c", text: "Ask one question or write one comment in the chat" },
      { id: "C9d", text: "Add a sentence to your field journal" },
    ],
    isRecurring: false,
    hasOutput: false,
    winText: "Attended a second virtual event and participated — your voice is in the room",
  },
  {
    id: "C10", monthId: "month4_5", trackId: "C",
    label: "Task C10", title: "Map ANC network to child welfare contacts",
    body: "DC's child welfare system (CFSA) is a real, active system with community-level implications. Is there a CFSA liaison, community partner, or city council staffer in your ANC network who touches child welfare or family services? Map this connection — it could surface a warm local contact that reinforces both your local and policy work.",
    subtasks: [
      { id: "C10a", text: "Review your ANC contact list for anyone touching CFSA or family services" },
      { id: "C10b", text: "Identify one potential warm local connection" },
      { id: "C10c", text: "Add them to your network tier list" },
    ],
    isRecurring: false,
    hasOutput: false,
    winText: "Mapped ANC contacts to child welfare field — local and policy work are connecting",
    crossRefs: ["B9"],
  },
  {
    id: "C11", monthId: "month4_5", trackId: "C",
    label: "Task C11", title: "Set up a Congressional tracker for child welfare",
    body: "Subscribe to one Congressional tracker for child welfare: Congress.gov alerts for relevant bills, or the First Focus on Children legislative tracker. Spend five minutes per week scanning it. You do not need to read every bill. You need to know what is moving.",
    subtasks: [
      { id: "C11a", text: "Go to Congress.gov and set up a bill alert for child welfare topics" },
      { id: "C11b", text: "Or subscribe to First Focus on Children's legislative tracker (firstfocus.org)" },
      { id: "C11c", text: "Scan it for 5 minutes — note one bill that's moving" },
    ],
    isRecurring: true,
    recurringLabel: "Weekly legislative scan (5 min)",
    recurringDescription: "5 minutes per week: scan your Congressional tracker and note what's moving.",
    hasOutput: false,
    winText: "Set up your Congressional tracker — you now know what's moving on the Hill",
    timeBox: "5 minutes per week ongoing",
  },

  {
    id: "D7", monthId: "month4_5", trackId: "D",
    label: "Task D7", title: "Share a draft for external feedback",
    body: "Share one of your writing drafts with your mentor or a trusted colleague for feedback — by the end of Month 4. It does not need to be your best draft. You need external input, and feedback is one of the things that motivates you most. Use that.",
    subtasks: [
      { id: "D7a", text: "Choose one of your two drafts to share" },
      { id: "D7b", text: "Send it to your mentor or a trusted colleague with a brief note" },
      { id: "D7c", text: "Ask for one or two specific things they noticed (not a full edit)" },
    ],
    isRecurring: false,
    hasOutput: false,
    winText: "Shared a writing draft for feedback — external input is the fuel you run on",
    crossRefs: ["D3","D5"],
  },
  {
    id: "D8", monthId: "month4_5", trackId: "D",
    label: "Task D8", title: "First data analysis with AFCARS",
    body: "Download a public child welfare dataset and do something with it. The AFCARS (Adoption and Foster Care Analysis and Reporting System) dataset is publicly available at acf.hhs.gov. Run basic descriptive statistics. Make one visualization. The act of completing it matters more than the output.",
    subtasks: [
      { id: "D8a", text: "Go to acf.hhs.gov and find the AFCARS public dataset" },
      { id: "D8b", text: "Download one year of data" },
      { id: "D8c", text: "Load it in R and run basic descriptive statistics (mean, median, counts)" },
      { id: "D8d", text: "Make one simple chart (a bar chart or histogram)" },
      { id: "D8e", text: "Save your R script and the chart" },
    ],
    isRecurring: false,
    hasOutput: true,
    winText: "Completed your first real data analysis with child welfare data — this is the power you were after",
    crossRefs: ["D6"],
  },
  {
    id: "D9", monthId: "month4_5", trackId: "D",
    label: "Task D9", title: "Khan Academy Stats — first two units",
    body: "Begin the Khan Academy Statistics and Probability course (free at khanacademy.org). Complete the first two units: Basic Statistics and Displaying and Comparing Quantitative Data. R is the tool — stats literacy is the goal. These two tracks reinforce each other: when you run a regression in R, you'll understand what you're looking at.",
    subtasks: [
      { id: "D9a", text: "Go to khanacademy.org → Statistics and Probability" },
      { id: "D9b", text: "Complete Unit 1: Basic Statistics (mean, median, mode, spread)" },
      { id: "D9c", text: "Complete Unit 2: Displaying and Comparing Quantitative Data" },
    ],
    isRecurring: false,
    hasOutput: false,
    winText: "Completed two Khan Academy stats units — the foundation of data literacy",
    timeBox: "Two 30-minute sessions",
    contextualHelp: "R is the software. But what you actually need — and what will be most useful in policy research — is the underlying statistical literacy: interpreting data, understanding what a regression is telling you, identifying patterns and trends, knowing when a finding is meaningful versus when sample size or methodology undermines it.\n\nThe goal by Month 6 is not mastery. It is being able to: (a) read a regression table in a policy report and explain what it says, (b) describe the difference between correlation and causation in plain language, (c) identify when a dataset is being used misleadingly. That level of literacy is what opens doors in policy research roles.",
  },
  {
    id: "D10", monthId: "month4_5", trackId: "D",
    label: "Task D10", title: "Write drafts 3 and 4, revise draft 1",
    body: "Continue writing: one draft per month. By the end of Month 5 you will have four drafts. Begin revising one earlier draft based on the feedback you received in Task D7.",
    subtasks: [
      { id: "D10a", text: "Write Draft 3 (try a policy memo format)" },
      { id: "D10b", text: "Write Draft 4 (try a comment letter format)" },
      { id: "D10c", text: "Revise Draft 1 or 2 using the feedback from Task D7" },
    ],
    isRecurring: false,
    hasOutput: true,
    winText: "Four drafts written and one revised — a real policy writing portfolio is forming",
    crossRefs: ["D3","D5","D7"],
  },

  {
    id: "E7", monthId: "month4_5", trackId: "E",
    label: "Task E7", title: "Use your org's stature in networking conversations",
    body: "Your organization's stature is a credential. In your informational interviews and networking conversations, you are speaking from a named, respected organization in the field — even if your role isn't what you want. Use that affiliation actively when introducing yourself.",
    subtasks: [
      { id: "E7a", text: "Practice introducing yourself with your org's name and brief mission" },
      { id: "E7b", text: "Use this intro in your next informational interview" },
    ],
    isRecurring: false,
    hasOutput: false,
    winText: "Used your org's stature in a networking conversation — every credential counts",
    crossRefs: ["B10"],
  },
  {
    id: "E8", monthId: "month4_5", trackId: "E",
    label: "Task E8", title: "Build two internal relationships",
    body: "By Month 5, connect with at least two colleagues on different teams within your organization. These relationships matter both for your current role and for your job search — internal references and introductions from respected colleagues carry real weight.",
    subtasks: [
      { id: "E8a", text: "Identify two colleagues on different teams whose work interests you" },
      { id: "E8b", text: "Reach out to each with a brief message or meeting request" },
      { id: "E8c", text: "Have one conversation with each (virtual coffee, walk, or chat)" },
    ],
    isRecurring: false,
    hasOutput: false,
    winText: "Built two internal relationships — less siloed, more connected",
    crossRefs: ["E3","E5"],
  },

  {
    id: "F1", monthId: "month4_5", trackId: "F",
    label: "Task F1", title: "Rebuild your elevator pitch",
    body: "Rebuild your elevator pitch. You had a strong one in grad school — update it for who you are now: what you have done, what you are looking for, and what you bring. Write it out. Practice saying it out loud (record yourself on your phone). It should be 60–90 seconds.",
    subtasks: [
      { id: "F1a", text: "Write out your updated elevator pitch (who you are, what you've done, what you're looking for)" },
      { id: "F1b", text: "Record yourself saying it on your phone" },
      { id: "F1c", text: "Listen back and adjust — does it sound like you?" },
      { id: "F1d", text: "Practice until it feels natural at 60–90 seconds" },
    ],
    isRecurring: false,
    hasOutput: true,
    winText: "Rebuilt your elevator pitch — you can say who you are and where you're going",
    timeBox: "Two 30-minute sessions",
  },
  {
    id: "F2", monthId: "month4_5", trackId: "F",
    label: "Task F2", title: "Start your target organization list",
    body: "Start a running list of 15–20 organizations in DC (and potentially nationally) that match what you are looking for. Categories: coalition advocacy orgs, child welfare think tanks, federal agencies (HHS/ACF), advocacy shops, Congressional staff offices. This is a live list you add to from your field reading and networking conversations.",
    subtasks: [
      { id: "F2a", text: "Create a document or spreadsheet for your target org list" },
      { id: "F2b", text: "Add 5+ organizations you already know and admire" },
      { id: "F2c", text: "Add orgs mentioned in your informational interviews" },
      { id: "F2d", text: "Add orgs from your field reading and newsletters" },
      { id: "F2e", text: "Note for each: do you have any contact there?" },
    ],
    isRecurring: false,
    hasOutput: true,
    winText: "Started your target organization list — the map of where you want to go",
  },

  // ══════════════════════════════════════════════
  // MONTH 6
  // ══════════════════════════════════════════════

  {
    id: "B14", monthId: "month6", trackId: "B",
    label: "Task B14", title: "Complete third informational interview",
    body: "By end of Month 6: three informational interviews complete, at least one new warm contact, your mentor relationship re-established, and at least one professor reconnection attempted. These are your Phase 1 network targets.",
    subtasks: [
      { id: "B14a", text: "Have your third informational interview" },
      { id: "B14b", text: "Send a thank-you note within 24 hours" },
    ],
    isRecurring: false,
    hasOutput: false,
    winText: "Completed your third informational interview — Phase 1 network target reached",
    crossRefs: ["B10","B11"],
  },
  {
    id: "B15", monthId: "month6", trackId: "B",
    label: "Task B15", title: "Update your network tier list",
    body: "Review your network tier list from Task B1. Update it — who has moved from cold to warm? Who has emerged as a potential reference? Who would you want to talk to before applying anywhere?",
    subtasks: [
      { id: "B15a", text: "Open your network tier list from Task B1" },
      { id: "B15b", text: "Move people who are now warm to Tier 1" },
      { id: "B15c", text: "Note potential references" },
      { id: "B15d", text: "Note who you want to talk to before applying to specific orgs" },
    ],
    isRecurring: false,
    hasOutput: true,
    winText: "Updated your network tier list — a warm network where a cold one used to be",
    crossRefs: ["B1"],
  },

  {
    id: "C12", monthId: "month6", trackId: "C",
    label: "Task C12", title: "Field knowledge self-test",
    body: "Can you hold a substantive 10-minute conversation about what is happening in child welfare policy right now? Can you explain the current state of FFPSA implementation, one active federal legislative priority, and one DC-specific development? If yes — you are ready for professional-level networking conversations. If not, spend one focused session this month closing that gap.",
    subtasks: [
      { id: "C12a", text: "Test yourself: explain FFPSA implementation status out loud" },
      { id: "C12b", text: "Test yourself: name one active federal legislative priority" },
      { id: "C12c", text: "Test yourself: name one DC-specific development" },
      { id: "C12d", text: "If any gap: spend 30 minutes closing it with a targeted read" },
    ],
    isRecurring: false,
    hasOutput: false,
    winText: "Passed your field knowledge self-test — ready for professional-level conversations",
  },
  {
    id: "C13", monthId: "month6", trackId: "C",
    label: "Task C13", title: "Write your org's contribution summary",
    body: "By Month 6 you should have read four to five pieces from your organization's publication history. Write a one-paragraph summary of what your org stands for and what it has contributed to the field. This is both field knowledge and interview preparation.",
    subtasks: [
      { id: "C13a", text: "Review your field journal notes on your org's publications" },
      { id: "C13b", text: "Write a one-paragraph summary: what does your org stand for?" },
      { id: "C13c", text: "Write one sentence on how its approach fits the broader field" },
      { id: "C13d", text: "Save it somewhere you can reference before interviews" },
    ],
    isRecurring: false,
    hasOutput: true,
    winText: "Wrote your org's contribution summary — you can speak fluently about where you work",
    crossRefs: ["C3","C5","C8"],
  },

  {
    id: "D11", monthId: "month6", trackId: "D",
    label: "Task D11", title: "Complete your 5-piece writing portfolio",
    body: "By end of Month 6: five solo-authored policy writing samples in different formats (one-pager, fact sheet, brief, memo, or comment letter). These are your portfolio. They exist. That matters.",
    subtasks: [
      { id: "D11a", text: "Write Draft 5 (choose a format you haven't tried yet)" },
      { id: "D11b", text: "Do a final light edit on your best 2–3 pieces" },
      { id: "D11c", text: "Create a folder called 'Writing Portfolio' with your 5 best drafts" },
    ],
    isRecurring: false,
    hasOutput: true,
    winText: "Completed your 5-piece writing portfolio — a real credential in your hands",
    contextualHelp: "Employers will not ask where your writing samples were published — they will ask to see your writing. In policy, analytical, and advocacy roles, writing samples are almost always standalone documents: memos, one-pagers, briefs, comment letters. Very few entry-to-mid-level candidates have published work.\n\nWhat matters is whether the writing is clear, structured, well-argued, and demonstrates policy thinking. A clean, solo-authored one-pager you wrote as practice is a legitimate and appropriate writing sample. If it feels more credible to frame it, you can note \"prepared independently\" or \"prepared for professional development\" — but in most cases, you simply send it. Nobody will ask whether it appeared in a journal.",
    crossRefs: ["D3","D5","D10"],
  },
  {
    id: "D12", monthId: "month6", trackId: "D",
    label: "Task D12", title: "R and stats readiness check",
    body: "By Month 6 you should be able to load a dataset, run basic descriptive statistics, produce a clean visualization, and explain what a regression output is showing at a high level. If you are behind on writing, deprioritize this — writing samples are higher leverage for the job search. Data skills continue building on their own timeline.",
    subtasks: [
      { id: "D12a", text: "Test: load a dataset in R and run summary statistics" },
      { id: "D12b", text: "Test: produce one clean chart" },
      { id: "D12c", text: "Test: explain a regression output in plain language" },
      { id: "D12d", text: "Note any gaps to continue working on in Phase 2" },
    ],
    isRecurring: false,
    hasOutput: false,
    winText: "Completed R and stats readiness check — data literacy baseline established",
    crossRefs: ["D8","D9"],
  },

  {
    id: "F3", monthId: "month6", trackId: "F",
    label: "Task F3", title: "Update resume and LinkedIn",
    body: "Update your resume and LinkedIn profile. LinkedIn: add or update your summary section to tell your story, not just list your jobs. Revisit whether LinkedIn Premium makes sense now — if you are actively researching target organizations and want to see who is viewing your profile as you begin networking more aggressively, it may be worth it at this stage.",
    subtasks: [
      { id: "F3a", text: "Update your resume with your current role and any new accomplishments" },
      { id: "F3b", text: "Update your LinkedIn summary section to tell your story" },
      { id: "F3c", text: "Review your LinkedIn profile for completeness" },
      { id: "F3d", text: "Decide: is LinkedIn Premium worth it now? (It may be)" },
    ],
    isRecurring: false,
    hasOutput: true,
    winText: "Updated resume and LinkedIn — your professional story is current and clear",
  },
  {
    id: "F4", monthId: "month6", trackId: "F",
    label: "Task F4", title: "Finalize your target org list",
    body: "Target org list at 15+ organizations. For each one, note: do you have any contact there, even a thin one? This list becomes your Phase 2 search roadmap.",
    subtasks: [
      { id: "F4a", text: "Bring your target org list to 15+ organizations" },
      { id: "F4b", text: "For each org: note any contact you have there (even a thin one)" },
      { id: "F4c", text: "Mark the 3–5 orgs where you have the warmest connections" },
    ],
    isRecurring: false,
    hasOutput: true,
    winText: "Finalized your target org list at 15+ organizations — your search roadmap is ready",
    crossRefs: ["F2"],
  },

  // ══════════════════════════════════════════════
  // MONTHS 7–9 (Phase 2)
  // ══════════════════════════════════════════════

  {
    id: "B16", monthId: "month7_9", trackId: "B",
    label: "Task B16", title: "Continue informational interviews — signal you're in the market",
    body: "Continue one informational interview per month. Shift the focus: in Phase 1 these were about reconnecting and learning. In Phase 2, they are also about signaling that you are in the market. Have a clear, comfortable answer ready for when people ask what you are looking for and why.",
    subtasks: [
      { id: "B16a", text: "Have one informational interview in Month 7" },
      { id: "B16b", text: "Have one informational interview in Month 8" },
      { id: "B16c", text: "Have one informational interview in Month 9" },
    ],
    isRecurring: true,
    recurringLabel: "Monthly informational interview",
    recurringDescription: "One per month: signal that you're in the market. Have your 'what I'm looking for' answer ready.",
    hasOutput: false,
    winText: "Continued informational interviews in Phase 2 — your network knows you're looking",
  },
  {
    id: "B17", monthId: "month7_9", trackId: "B",
    label: "Task B17", title: "Reach out to contacts before applying",
    body: "When a role opens at an organization where you have a contact — even a thin one — reach out to that contact before submitting your application. Ask for 15 minutes to learn about the organization before you apply. This is not asking for a favor. This is how most policy jobs are filled.",
    subtasks: [
      { id: "B17a", text: "For each application: check your target org list for any contact" },
      { id: "B17b", text: "If a contact exists: send a brief message before applying" },
      { id: "B17c", text: "Ask for 15 minutes — frame it as learning about the org, not asking for help" },
    ],
    isRecurring: false,
    hasOutput: false,
    winText: "Reached out to a contact before applying — warm applications get results",
    crossRefs: ["F4"],
  },

  {
    id: "D13", monthId: "month7_9", trackId: "D",
    label: "Task D13", title: "Revise writing for your interview portfolio",
    body: "Continue monthly writing — pivot from original drafts to revisions and refinements. By Month 9 you should have two or three pieces you would be comfortable sharing with a hiring manager as writing samples.",
    subtasks: [
      { id: "D13a", text: "Choose your 2–3 strongest drafts from Phase 1" },
      { id: "D13b", text: "Do a thorough revision of each — clarity, structure, argument" },
      { id: "D13c", text: "Ask someone for feedback on at least one piece" },
      { id: "D13d", text: "Create a final 'Interview Portfolio' folder with your best pieces" },
    ],
    isRecurring: false,
    hasOutput: true,
    winText: "Refined your interview writing portfolio — polished work ready to share",
    crossRefs: ["D11"],
  },
  {
    id: "D14", monthId: "month7_9", trackId: "D",
    label: "Task D14", title: "Continue R and stats — interview readiness",
    body: "Continue R and the Khan Academy stats course at your own pace. The goal by Month 9 is being able to speak confidently in an interview about your data literacy — what tools you have used, what you have done with data, what you want to learn, and how you have seen data used to drive policy arguments. Competence and self-awareness matter more than mastery.",
    subtasks: [
      { id: "D14a", text: "Continue R for Data Science — complete at least 2 more chapters" },
      { id: "D14b", text: "Continue Khan Academy stats — complete 2 more units" },
      { id: "D14c", text: "Practice: explain your data work in an interview context (out loud)" },
    ],
    isRecurring: false,
    hasOutput: false,
    winText: "Continued R and stats work — can speak confidently about data in interviews",
    crossRefs: ["D12"],
  },

  {
    id: "F5", monthId: "month7_9", trackId: "F",
    label: "Task F5", title: "Prioritize warm applications",
    body: "Prioritize warm applications. A warm application — where you have spoken to someone at the organization before applying — is significantly more likely to advance than a cold one. Use your network list from Task F4 to identify which applications you can make warm.",
    subtasks: [
      { id: "F5a", text: "For each open role you're interested in: check Task F4 list for contacts" },
      { id: "F5b", text: "Warm up at least one contact before submitting each application" },
      { id: "F5c", text: "Track which applications are warm vs cold" },
    ],
    isRecurring: false,
    hasOutput: false,
    winText: "Prioritized warm applications — applying smart, not just applying",
    crossRefs: ["F4","B17"],
  },
  {
    id: "F6", monthId: "month7_9", trackId: "F",
    label: "Task F6", title: "Salary floor: know your number",
    body: "Your salary floor is $80k. Do not negotiate yourself below it. Your current total compensation is approximately $77,700 ($70k salary + $7,700 in employer 401k contributions). Any role at $80k base with a standard employer match represents a meaningful improvement. Policy analyst and associate roles at DC coalition orgs and think tanks typically range $75k–$110k at your experience level — you are in the market.",
    subtasks: [
      { id: "F6a", text: "Write your salary floor ($80k) somewhere you'll see it during negotiations" },
      { id: "F6b", text: "Research salary ranges at your target orgs (look at job postings, Glassdoor, Levels.fyi for nonprofits)" },
      { id: "F6c", text: "Practice saying your number out loud: \"I'm looking for $X and above\"" },
    ],
    isRecurring: false,
    hasOutput: false,
    winText: "Established and practiced your salary floor — you know your worth",
    contextualHelp: "Your current total compensation is not just $70k — it's approximately $77,700 when you include your employer's 11% 401k contribution. Any new role needs to be evaluated against that full number, not just the salary line. An $80k role with a 3% employer match gives you $82,400 in total comp — a real improvement. A $75k role with no match is actually a step backward.",
  },
  {
    id: "F7", monthId: "month7_9", trackId: "F",
    label: "Task F7", title: "Use writing samples actively in applications",
    body: "Use your writing samples actively in applications. When applying, reference specific pieces and offer to share them. You do not need to explain that they are unpublished — policy writing samples rarely are. Simply send the document.",
    subtasks: [
      { id: "F7a", text: "For each application: identify which writing sample is most relevant" },
      { id: "F7b", text: "Reference it in your cover letter or application" },
      { id: "F7c", text: "Have it ready to email promptly if requested" },
    ],
    isRecurring: false,
    hasOutput: false,
    winText: "Used your writing samples actively in an application — your portfolio is working for you",
    crossRefs: ["D11","D13"],
    contextualHelp: "Employers will not ask where your writing samples were published — they will ask to see your writing. In policy, analytical, and advocacy roles, writing samples are almost always standalone documents. Very few entry-to-mid-level candidates have published work.\n\nWhat matters is whether the writing is clear, structured, well-argued, and demonstrates policy thinking. A clean, solo-authored one-pager is a legitimate and appropriate writing sample. If asked about it, you can simply say \"this is an independent policy analysis I prepared\" and leave it at that.",
  },
  {
    id: "F8", monthId: "month7_9", trackId: "F",
    label: "Task F8", title: "Prepare a plan for comparison pain during the search",
    body: "Have a plan for the comparison pain before it hits during the search. Job searching on LinkedIn, seeing peers' titles, getting rejected — these will trigger the same patterns you've been working on. Identify in advance: a specific person to text, a time limit on LinkedIn during the search, a grounding ritual. Discuss this with your therapist or coach before it becomes acute.",
    subtasks: [
      { id: "F8a", text: "Identify one person you'll text when comparison pain hits" },
      { id: "F8b", text: "Set a LinkedIn time limit during job search (e.g., 20 min max per session)" },
      { id: "F8c", text: "Identify one grounding ritual for after a rejection" },
      { id: "F8d", text: "Bring this plan to your therapist or coach before you start applying" },
    ],
    isRecurring: false,
    hasOutput: false,
    winText: "Built your comparison pain plan — you'll be ready when it hits, and it won't knock you down",
  },
];

// ─── REFERENCE SECTIONS ──────────────────────────────────────────────────────
export const REFERENCE_SECTIONS = [
  {
    id: "who_you_are",
    title: "Who You Are",
    subtitle: "Read this on the hard days",
    content: [
      {
        type: "heading",
        text: "Your Strengths — Evidenced, Not Assumed",
      },
      {
        type: "paragraph",
        text: "These are not aspirational. They are demonstrated facts.",
      },
      {
        type: "bullets",
        items: [
          { label: "Mission clarity", text: "You have known what you care about — systemic reform in child welfare, informed by the people the system serves — since before grad school. That kind of clarity is rare and genuinely valuable." },
          { label: "Relational intelligence", text: "You built a network from scratch in grad school through sheer initiative: conferences, informational interviews, cold asks. You overcame years of imposter syndrome to do it. That capacity is not gone." },
          { label: "Natural writer", text: "Strong, free-form writing ability is a foundation, not a ceiling. The professional shaping of that instinct is learnable. The instinct itself cannot be taught." },
          { label: "Intellectual curiosity", text: "You were drawn to quant skills not because you had to be, but because you recognized their power. You reached outside your comfort zone. That posture — seeking what you don't yet know — is one of the most important traits in policy work." },
          { label: "Values compass", text: "You have consistently chosen organizations and roles based on alignment with your values. You noticed what was wrong with the top-down education policy org. You can tell the difference. That discernment matters." },
          { label: "DC asset", text: "You live in the city where child welfare policy is made at the federal level. You are an Advisory Neighborhood Commissioner with real contacts in DC government. You have more proximity to this work than you are currently giving yourself credit for." },
        ],
      },
      {
        type: "heading",
        text: "What You Are Working With — Honestly",
      },
      {
        type: "paragraph",
        text: "These are not character flaws. They are patterns to design around — and many of them are direct symptoms of environments that were wrong for you, not evidence of who you are.",
      },
      {
        type: "bullets",
        items: [
          { label: "Inattentive ADHD", text: "Habit formation is hard. Executive function is taxed by remote work and under-stimulation. Abstract, open-ended tasks are particularly draining. This plan is built around these realities — not despite them." },
          { label: "Shame and avoidance", text: "Around the network, around LinkedIn, around re-engaging people you feel you have let down. This is addressed gradually and explicitly — not by powering through it." },
          { label: "Eroded momentum", text: "Two consecutive under-stimulating, mismatched jobs have quietly depleted something. The drive is not gone — it is suppressed. Rebuilding it requires the right conditions, not more willpower." },
          { label: "All-or-nothing thinking", text: "Difficulty breaking down large tasks and getting stuck in details. The plan addresses this by pre-sequencing subtasks wherever possible — removing the activation cost of figuring out where to start." },
        ],
      },
    ],
  },
  {
    id: "core_reframe",
    title: "The Core Reframe",
    subtitle: "What is actually true",
    content: [
      {
        type: "quote",
        label: "What you are telling yourself:",
        text: "\"I went to grad school, built something, and then let it all fall apart. I didn't maintain my contacts, I lost my skills, I fell behind, and now I'm watching my peers pass me. I should have been doing this all along. It has been too long to start now.\"",
      },
      {
        type: "quote",
        label: "What is actually true:",
        accent: true,
        text: "You graduated into a field in crisis, took the only job offered, discovered it was misrepresented, survived it, landed a better-aligned role, and have been keeping yourself going in an environment that is structurally wrong for how your brain works — all while being a neighborhood commissioner, maintaining a social life, working with an ADHD coach, and still caring deeply about the work. That is not falling apart. That is resilience under genuinely hard conditions.",
      },
      {
        type: "paragraph",
        text: "The people on LinkedIn who look like they are ahead of you are not your competition. They are your future colleagues. The network is not lost — it is dormant. And you are not starting from scratch. You are starting from a master's degree, a decade of child welfare exposure, lived policy experience, and an address in Washington DC.",
      },
    ],
  },
  {
    id: "north_star",
    title: "Your North Star",
    subtitle: "Long-term vision and what the right job looks like",
    content: [
      {
        type: "paragraph",
        text: "Your long-term goal is to write and forward legislation and regulation that reforms the child welfare system — policy shaped by the people it serves, not handed down from above. The specific mechanism (coalition advocacy organization, think tank, legislative staff) is intentionally held open because you are still learning what the most powerful levers are. That openness is a strength, not a weakness.",
      },
      {
        type: "paragraph",
        text: "The model that has resonated most with you is the intermediary advocacy organization: sitting between direct service practitioners and Congress, translating lived experience into legislative action. That is a concrete target type to orient toward.",
      },
      {
        type: "heading",
        text: "What the Right Job Looks Like",
      },
      {
        type: "table",
        rows: [
          { label: "Structure", text: "Defined role with clear expectations and room for ownership — structured enough to orient, flexible enough to run with" },
          { label: "Stimulation", text: "Multiple concurrent workstreams; no two days identical; intellectually challenging material" },
          { label: "Collaboration", text: "Working across teams, organizations, and levels — not siloed" },
          { label: "Feedback", text: "A supervisor who challenges, holds accountable, and recognizes success explicitly" },
          { label: "Environment", text: "In-person or hybrid; you need external structure to thrive" },
          { label: "Mission", text: "Child welfare policy; bottom-up, responsive to affected communities" },
          { label: "Salary", text: "At or above $80k, accounting for loss of employer 401k contribution" },
          { label: "Output", text: "Work you can own and be reflected in — not ghost-writing for others or pure administration" },
        ],
      },
    ],
  },
  {
    id: "hold_lightly",
    title: "Things to Hold Lightly",
    subtitle: "Open questions — no resolution required yet",
    content: [
      {
        type: "subheading",
        text: "Direct Service Experience",
      },
      {
        type: "paragraph",
        text: "You feel it is a deficit. It is worth naming clearly: you do not need direct service experience to do excellent child welfare policy work. What you need is authentic, sustained engagement with affected communities — which can come through coalition work, research, advocacy, and your ANC work. If direct service ever feels like the right move, it will present itself. Do not force it from a place of shame.",
      },
      {
        type: "subheading",
        text: "Policy vs. Politics — and Learning to Navigate Both",
      },
      {
        type: "paragraph",
        text: "You feel more connected to policy than politics, and you recognize they are deeply intertwined. This is actually a sophisticated starting position. In the near term: as you rebuild your field knowledge, pay deliberate attention not just to what the policy debates are, but to who the players are, what interests they represent, what coalitions are forming, and what is actually moveable given the current political environment.",
      },
      {
        type: "paragraph",
        text: "In your informational interviews: ask people you respect how they think about the relationship between policy and politics in their work. Longer term: once you are in a role that fits better, consider one deliberate learning investment in political strategy. Understanding how power works is not the same as playing the performative game you find distasteful. It is what allows you to protect the integrity of the policy work.",
      },
      {
        type: "subheading",
        text: "Relocation",
      },
      {
        type: "paragraph",
        text: "You are in DC, which is an enormous asset. Stay unless a genuinely transformative opportunity elsewhere presents itself. Your ANC work, your local contacts, your proximity to federal policy — these are real and compounding advantages.",
      },
      {
        type: "subheading",
        text: "Grad School Grief",
      },
      {
        type: "paragraph",
        text: "The feeling that you went to grad school for nothing is worth sitting with — not dismissing, but examining carefully. You got a master's degree in public policy, built relationships with people who matter in this field, developed a narrative, and gained real skills. The fact that the two years following have been hard does not erase what you built. The grief is about the gap between what you imagined this point would look like and what it does look like. That gap is real and worth acknowledging. It is also closeable.",
      },
    ],
  },
];

// ─── HELPER: compute task counts per month / track / phase ──────────────────
export function getTasksForMonth(monthId) {
  return TASKS.filter(t => t.monthId === monthId);
}
export function getTasksForTrack(trackId) {
  return TASKS.filter(t => t.trackId === trackId);
}
export function getTasksForPhase(phaseId) {
  const phase = PHASES.find(p => p.id === phaseId);
  if (!phase) return [];
  return TASKS.filter(t => phase.months.includes(t.monthId));
}
export function getTaskById(taskId) {
  return TASKS.find(t => t.id === taskId);
}

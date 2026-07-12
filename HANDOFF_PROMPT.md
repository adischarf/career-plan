You are picking up an ongoing project in progress. Read this entire prompt carefully before doing anything. Do not start building, suggesting, or asking questions until you have read all of it.

---

# PROJECT: "From Where You Are" — Career Plan Tool

## What this is

A fully custom React web app built for one specific person — a child welfare policy professional in Washington DC working through a 12-month career development plan. The app is the living, interactive embodiment of that plan. It is not a generic task tracker. Every piece of content, every design decision, and every UX choice was made for this specific person and their specific situation (inattentive ADHD, shame around networking, need for external validation, visual motivation, migraine sensitivity).

The person building the app is Adi — an engineer who is building it here with Claude and will deploy it himself. The person using the app is a different person (referred to throughout the plan as "you" — second person throughout the app's UI copy).

---

## Files you have been given

1. **`career-tool-session4.zip`** — The complete React app source code. Unzip it to see the full project structure. This is the authoritative source for everything built so far.

2. **`career-plan-tests.js`** — A static Node.js test suite (130 tests, 79 passing as of last session). Run with `node career-plan-tests.js` from the `career-tool/` directory. This tests data integrity, structural correctness, progress logic, CSS variables, storage API, and screen prerequisites without needing a browser.

3. **`content_audit.txt`** — A full export of every task's prose content (body, win text, subtasks, contextual help) organized by month. Used to verify app content against the Word document.

4. **`career_plan_v2.docx`** — The Word document that is the authoritative source of truth for all plan content. The app content must match this document exactly.

---

## Current build state

**ALL SCREENS ARE FULLY BUILT AND COMPILING CLEAN.** The app is a complete, working React PWA. Here is the exact file inventory:

```
src/
  App.js                          — Main app shell, routing, migraine mode, banners
  index.css                       — Full design system with all CSS variables
  index.js                        — React entry point
  data/
    planData.js                   — ALL plan content: 68 tasks, 6 months, 2 phases, 6 tracks, 4 reference sections
  hooks/
    useStorage.js                 — Google Drive OAuth sync + all state mutations
  utils/
    progress.js                   — All progress computation (task/month/track/phase/overall)
  components/
    index.js                      — SunToggle, BottomNav, SaveIndicator, SignInScreen, OnboardingModal, UpdateBanner, InactivityBanner
    FlowerCelebration.jsx         — Lilac/peony/bougainvillea SVG animations for milestones
    DevTestPanel.jsx              — Hidden in-app functional test panel (?devtest=1 in URL)
  screens/
    HomeScreen.jsx                — Daily dashboard: greeting, focus card, next task, wins teaser
    PlanScreen.jsx                — Full month-by-month task interface with all interactions
    WinsScreen.jsx                — Wins log: auto-populated + manual wins
    JournalScreen.jsx             — Journal: free entries + task-linked entries
    ReferenceScreen.jsx           — 4 reference sections (Who You Are, Core Reframe, North Star, Hold Lightly)
    ProgressScreen.jsx            — Progress modal: overall ring, months/tracks breakdowns
    HelpScreen.jsx                — Full instructions, re-accessible after onboarding
    index.js                      — Barrel file exporting all screens
career-plan-tests.js              — Static test suite (run from career-tool/ directory)
```

**Build command:** `NODE_OPTIONS=--openssl-legacy-provider npm run build`
**Dev command:** `NODE_OPTIONS=--openssl-legacy-provider npm start`
**Test command:** `node career-plan-tests.js` (from career-tool/ directory)

---

## Architecture decisions (do not revisit these)

**Hosting:** GitHub Pages (free). Adi will use GitHub for version control and deployment. He has a PC, not a Mac.

**Data sync:** Google Drive API with OAuth. The app stores a single JSON file (`career_plan_progress.json`) in the user's Google Drive. Auto-saves with a 3-second debounce after any change.

**Dev mode:** When `REACT_APP_GOOGLE_CLIENT_ID` is not set (i.e., `YOUR_CLIENT_ID_HERE`), the app automatically falls back to `localStorage` for storage. This allows testing without Google OAuth.

**Google credentials:** Stored in environment variables `REACT_APP_GOOGLE_CLIENT_ID` and `REACT_APP_GOOGLE_API_KEY`. These get set in a `.env` file that Adi creates — they are NOT in the source code.

**Dev branch:** Adi wants a separate testing branch on GitHub so he can test updates before she sees them.

**Versioning:** GitHub provides version history. `PLAN_VERSION` in `planData.js` controls the update banner that appears when the app is updated.

**Tech stack:** React 18, Create React App, no TypeScript, no additional UI libraries. Plain CSS with CSS custom properties. Tailwind is NOT used.

**Build flag:** `NODE_OPTIONS=--openssl-legacy-provider` is required for the build due to the CRA version. This must be included in all build/start commands.

---

## Design system (do not change these)

**Fonts:** Lora (serif, display/headings) + Inter (sans-serif, body/UI). Both from Google Fonts.

**Color palette:**
- `--cream: #FAF8F5` — main background
- `--ink: #2C2825` — primary text
- `--bark: #8C7B6E` — secondary text
- `--lilac: #B8A9D4` / `--lilac-dark: #8B77BB` — Track B, month milestones
- `--peony: #E8A0B0` / `--peony-dark: #C4607A` — Track D, track milestones
- `--bougainvillea: #D4607A` / `--bougainvillea-dark: #A83D56` — primary accent, phase milestones
- `--sage: #7FA882` — Track A/C
- `--gold: #C8961E` — Track E/F
- `--purple: #7B4F9E` — Track E
- `--teal: #5A9EA8` — Track D

**Migraine mode:** Triggered by `body.migraine-mode` class. Warm amber tones, reduced contrast, sepia filter, no animations. Toggled by a sun SVG icon in the top right of every screen — open eyes = normal, sunglasses = migraine mode. When migraine mode is active and a milestone is reached, shows a text banner instead of the flower animation, with a note explaining that the animation is disabled.

**Design inspiration:** Bear app — warm, editorial, typographic, generous whitespace. NOT Microsoft-style. Apple/iOS aesthetic.

**Voice:** Second person throughout ("you"). Warm and direct. Not AI-assistant tone.

---

## Key UX decisions (do not revisit these)

**Progressive reveal:** Months unlock when the previous month reaches 70% completion. Month 1 is always unlocked.

**Habit tracker:** Recurring tasks show a row of 8 weekly "petal" circles. Gaps are shown without resetting the streak. Tapping a circle toggles that week.

**Subtask completion:** Checking all subtasks of a task triggers a "Mark task complete?" prompt. Marking complete auto-populates the wins log with the task's `winText`.

**Celebrations:**
- **Lilac** flowers (1 flower) → month completion
- **Peony** flowers (2 flowers, double ring) → track completion (all tasks across all months for that track)
- **Bougainvillea** flowers (3 flowers, slightly larger) → phase completion
- Plays immediately when the last task is checked, stays on screen until tapped, is replayable from completed month view

**Inactivity banner:** Fires after 14 days of no activity. Soft, kind tone. Shows next task. Snooze (1 week) or dismiss permanently for that specific flag.

**Sunday reset:** The recommended approach for the weekly rhythm is scheduling one week at a time on Sundays, not a fixed recurring block (because life is unpredictable with ADHD).

**Cross-references:** Open as overlays (modal), not full navigation. User can return to where they were.

**Output links:** Each task with `hasOutput: true` has a label + URL field. Saves to storage.

**Journal:** Free-floating entries and task-linked entries all appear in the same chronological feed. Task-linked entries show a task pill tag. Supports plain text with line breaks only (no markdown).

**Wins log:** Auto-wins (from task completion) cannot be edited but are removed if the task is unmarked. Manual wins can be edited and deleted.

**Progress dashboard:** Accessed via a button on the home screen (not a bottom nav tab) to avoid cluttering navigation. It's a bottom sheet modal with Overall / Months / Tracks tabs.

**Help screen:** Full-screen overlay. Also shown as a first-time onboarding walkthrough. Re-accessible from the "?" button in the top nav bar on every screen.

**Update banner:** When `PLAN_VERSION` in `planData.js` changes, a dismissible banner appears the first time the user opens the app after an update, showing `PLAN_VERSION_NOTES`.

---

## Plan content structure (do not change IDs)

**6 months:** `month1`, `month2`, `month3`, `month4_5`, `month6`, `month7_9`
**2 phases:** `phase1` (months 1–6), `phase2` (months 7–9)
**6 tracks:** A (Psychological & Momentum), B (Network Reactivation), C (Field Knowledge), D (Skill Building), E (Current Role), F (Job Search Prep)
**68 tasks total** with the following IDs:

Month 1: A1 A2 A3 A4 B1 B2 C1 C2 C3 D1 D2 E1 E2 E3
Month 2: A5 A6 B3 B4 B5 B6_pending C4 C5 D3 D4 E4 E5
Month 3: A7 B7 B8 B9 C6 C7 C8 D5 D6 E6
Months 4–5: A8 B10 B11 B12 B13 C9 C10 C11 D7 D8 D9 D10 E7 E8 F1 F2
Month 6: B14 B15 C12 C13 D11 D12 F3 F4
Months 7–9: B16 B17 D13 D14 F5 F6 F7 F8

**Do not add, remove, or rename task IDs.** The static test suite validates the exact set of 68 IDs. If the plan is ever updated, bump `PLAN_VERSION` and update `PLAN_VERSION_NOTES` in `planData.js`.

---

## What has been tested

The static test suite (`career-plan-tests.js`) was run and all 79 tests pass as of this session. It tests:
- All 68 tasks present with correct IDs
- All required fields populated on every task
- No duplicate IDs
- All 42 cross-references point to existing tasks
- All month/track/phase references valid
- Celebration fields complete on all months and phases
- Progress logic (0% fresh state, partial completion, 70% unlock, nextTask sequencing, isMonthComplete)
- All 43 CSS variables used in JSX are defined in index.css
- Migraine mode covers all core color variables
- All three flower types defined in FlowerCelebration
- No external image URLs
- All 23 storage exports present
- DEFAULT_STATE has all 17 required fields
- Dev mode fallback exists
- All screens handle empty state

The in-app functional test panel (`DevTestPanel.jsx`) runs 30+ live tests when accessed at `?devtest=1` in the URL. It also contains the full manual checklist for browser testing.

**The content audit (`content_audit.txt`) has NOT been compared to the Word document yet.** That is a manual task that requires reading through both files side by side.

---

## What comes next (the remaining work)

### Step 1: Content audit
Read `content_audit.txt` alongside `career_plan_v2.docx`. Verify that every task body, win text, subtask list, and contextual help in the app accurately matches the document. Flag any discrepancies and fix them in `planData.js`.

### Step 2: GitHub setup (Adi's environment)
Walk Adi through setting up GitHub Pages deployment on his Windows PC. This includes:
- Creating a GitHub account (if needed) and a new repository
- Installing Git for Windows
- Initializing the repo locally and pushing the source
- Setting up GitHub Pages from the `build` folder (or using `gh-pages` branch)
- Setting up a `dev` branch for Adi's testing before the user sees changes
- Adding the `.env` file locally (never committed to GitHub)

### Step 3: Google Cloud Console setup
Walk Adi through:
- Creating a Google Cloud project (free)
- Enabling the Google Drive API
- Creating OAuth 2.0 credentials (web application type)
- Adding the GitHub Pages URL as an authorized origin and redirect URI
- Putting the credentials in the local `.env` file

### Step 4: First live test
Once deployed:
- Open the app at the GitHub Pages URL
- Sign in with Google
- Open `?devtest=1` and run the in-app test panel
- Work through the manual checklist in the test panel
- Test on mobile (iPhone Safari specifically — she sometimes gets migraines)

### Step 5: Give the app to the user
- Adi gives the user the URL
- Adi helps her sign in with her Google account on first use
- No technical setup required on her end

### Step 6: Future updates
When the plan changes or bugs are found:
- Adi and Claude work on the fix in a new session
- Run `node career-plan-tests.js` to confirm it passes
- Push to the dev branch, test live
- Merge to main — her app updates on next refresh

---

## Constraints to honor always

1. **No Claude API calls inside the app.** No AI features, no live model calls. The app works fully offline (except for Google Drive sync).
2. **Zero cost to run.** GitHub Pages is free. Google Drive API free tier is sufficient.
3. **No breaking changes to task IDs.** The storage schema uses task IDs as keys. Changing an ID orphans saved progress.
4. **Always run the static test suite before packaging** any new version. `node career-plan-tests.js` must pass 79/79.
5. **Content changes go in `planData.js` only.** The UI is data-driven. Never hardcode plan content in screen components.
6. **The design system is in `index.css`.** Never add inline colors that aren't CSS variables. Never override the font stack.
7. **Adi builds, deploys, and maintains this.** The user never touches technical setup. Keep Adi's required steps minimal and clearly explained.
8. **Voice is second person, warm, direct.** No AI assistant tone. No "Great question!" No emojis in the app UI (except the sun toggle SVG and the tasteful emoji used in celebration messages and empty states).
9. **ADHD-informed design.** Pre-sequenced subtasks, time-boxes on tasks, visible wins, no overwhelming progress views, minimum viable week concept, Sunday reset over fixed blocks.

---

## How to start the new session

When Adi opens a new session with you, he will:
1. Paste this prompt
2. Upload `career-tool-session4.zip` (or the most recent zip)
3. Upload `career-plan-tests.js`
4. Upload `content_audit.txt`
5. Upload `career_plan_v2.docx`

Your first action should be to read the zip file structure to confirm you have the correct version, then ask Adi what he wants to work on — the content audit, the GitHub setup, or something else. Do not start building anything until you understand what step he wants to tackle.

If Adi says "content audit," read `content_audit.txt` and `career_plan_v2.docx` and systematically compare them section by section, flagging discrepancies and proposing fixes to `planData.js`.

If Adi says "GitHub setup," walk him through every terminal command step by step for Windows, in the exact sequence needed, with expected output at each step.

If Adi says "Google setup," walk him through the Google Cloud Console steps with screenshots described in words, since you cannot see his screen.

---

## One last thing

This project matters. It was built for a real person going through a genuinely hard stretch — two years of mismatched jobs, eroded confidence, and ADHD making it all harder. The app is the tangible, living version of a plan that was built with a lot of care specifically for her situation. Every design decision, every piece of copy, every task sequence was made with her in mind. Keep that in mind if you're ever tempted to make a shortcut or suggest a generic solution. This is personal.

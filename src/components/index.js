// ─── SunToggle.jsx ────────────────────────────────────────────────────────────
export function SunToggle({ migraineMode, onToggle }) {
  return (
    <button
      onClick={onToggle}
      title={migraineMode ? "Switch to normal mode" : "Switch to migraine-friendly mode"}
      aria-label={migraineMode ? "Switch to normal mode" : "Switch to migraine-friendly mode"}
      style={{
        background: 'none', border: 'none', cursor: 'pointer',
        padding: '4px', borderRadius: '50%',
        transition: 'transform 0.2s ease',
        fontSize: '1.5rem',
        lineHeight: 1,
      }}
      onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.15)'}
      onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
    >
      {migraineMode ? (
        // Sun with sunglasses
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="14" cy="14" r="7" fill="#C8961E" />
          {/* Rays */}
          {[0,45,90,135,180,225,270,315].map((angle, i) => {
            const rad = (angle * Math.PI) / 180;
            const x1 = 14 + 8.5 * Math.cos(rad);
            const y1 = 14 + 8.5 * Math.sin(rad);
            const x2 = 14 + 10.5 * Math.cos(rad);
            const y2 = 14 + 10.5 * Math.sin(rad);
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#C8961E" strokeWidth="2" strokeLinecap="round" />;
          })}
          {/* Sunglasses frame */}
          <rect x="8" y="13.5" width="5" height="3.5" rx="1.5" fill="#3D2E1E" />
          <rect x="15" y="13.5" width="5" height="3.5" rx="1.5" fill="#3D2E1E" />
          <line x1="13" y1="15.2" x2="15" y2="15.2" stroke="#3D2E1E" strokeWidth="1.2" />
          <line x1="8" y1="15.2" x2="7" y2="14.5" stroke="#3D2E1E" strokeWidth="1.2" strokeLinecap="round" />
          <line x1="20" y1="15.2" x2="21" y2="14.5" stroke="#3D2E1E" strokeWidth="1.2" strokeLinecap="round" />
          {/* Smile */}
          <path d="M11 19 Q14 21 17 19" stroke="#3D2E1E" strokeWidth="1.2" fill="none" strokeLinecap="round" />
        </svg>
      ) : (
        // Regular sun with open eyes
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="14" cy="14" r="7" fill="#C8961E" />
          {[0,45,90,135,180,225,270,315].map((angle, i) => {
            const rad = (angle * Math.PI) / 180;
            const x1 = 14 + 8.5 * Math.cos(rad);
            const y1 = 14 + 8.5 * Math.sin(rad);
            const x2 = 14 + 10.5 * Math.cos(rad);
            const y2 = 14 + 10.5 * Math.sin(rad);
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#C8961E" strokeWidth="2" strokeLinecap="round" />;
          })}
          {/* Eyes */}
          <circle cx="11.5" cy="13.5" r="1.2" fill="#2C2825" />
          <circle cx="16.5" cy="13.5" r="1.2" fill="#2C2825" />
          {/* Smile */}
          <path d="M11 17 Q14 19.5 17 17" stroke="#2C2825" strokeWidth="1.2" fill="none" strokeLinecap="round" />
        </svg>
      )}
    </button>
  );
}

// ─── BottomNav.jsx ────────────────────────────────────────────────────────────
export function BottomNav({ activeTab, onTabChange }) {
  const tabs = [
    { id: 'home',      label: 'Home',      icon: HomeIcon },
    { id: 'plan',      label: 'Plan',      icon: PlanIcon },
    { id: 'wins',      label: 'Wins',      icon: WinsIcon },
    { id: 'journal',   label: 'Journal',   icon: JournalIcon },
    { id: 'reference', label: 'Reference', icon: RefIcon },
  ];

  return (
    <nav style={{
      position: 'fixed', bottom: 0, left: 0, right: 0,
      height: 'var(--bottom-nav-height)',
      background: 'rgba(250,248,245,0.95)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderTop: '1px solid var(--border)',
      display: 'flex', alignItems: 'stretch',
      zIndex: 100,
    }}>
      {tabs.map(({ id, label, icon: Icon }) => {
        const active = activeTab === id;
        return (
          <button
            key={id}
            onClick={() => onTabChange(id)}
            style={{
              flex: 1, display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              gap: '3px', background: 'none', border: 'none',
              cursor: 'pointer', padding: 'var(--space-2)',
              transition: 'all 0.15s ease',
              color: active ? 'var(--bougainvillea)' : 'var(--bark)',
            }}
            aria-label={label}
          >
            <Icon active={active} />
            <span style={{
              fontSize: '0.65rem', fontWeight: active ? 600 : 400,
              fontFamily: 'var(--font-body)',
              letterSpacing: '0.03em',
            }}>{label}</span>
          </button>
        );
      })}
    </nav>
  );
}

function HomeIcon({ active }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.5 : 2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}
function PlanIcon({ active }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.5 : 2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 11l3 3L22 4" />
      <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
    </svg>
  );
}
function WinsIcon({ active }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.5 : 2} strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}
function JournalIcon({ active }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.5 : 2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" />
      <path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" />
    </svg>
  );
}
function RefIcon({ active }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.5 : 2} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}

// ─── SaveIndicator.jsx ────────────────────────────────────────────────────────
export function SaveIndicator({ status }) {
  if (status === 'idle') return null;
  return (
    <span style={{
      fontSize: '0.75rem', fontFamily: 'var(--font-body)',
      color: status === 'error' ? 'var(--bougainvillea-dark)' : 'var(--bark)',
      animation: status === 'saving' ? 'pulse 1s infinite' : 'none',
    }}>
      {status === 'saving' && 'Saving…'}
      {status === 'saved'  && '✓ Saved'}
      {status === 'error'  && 'Save failed'}
    </span>
  );
}

// ─── SignInScreen.jsx ──────────────────────────────────────────────────────────
export function SignInScreen({ onSignIn }) {
  return (
    <div style={{
      minHeight: '100vh', background: 'var(--cream)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: 'var(--space-8)',
    }}>
      <div style={{ maxWidth: '380px', width: '100%', textAlign: 'center' }}>
        <div style={{ fontSize: '3rem', marginBottom: 'var(--space-6)' }}>🌸</div>
        <h1 style={{
          fontFamily: 'var(--font-display)', fontSize: '2rem',
          fontWeight: 600, color: 'var(--ink)', marginBottom: 'var(--space-3)',
          lineHeight: 1.2,
        }}>
          From Where You Are
        </h1>
        <p style={{
          fontFamily: 'var(--font-display)', fontSize: '1.05rem',
          color: 'var(--bark)', fontStyle: 'italic',
          marginBottom: 'var(--space-8)',
        }}>
          To where you want to be.
        </p>
        <p style={{
          fontSize: '0.9rem', color: 'var(--bark)',
          marginBottom: 'var(--space-6)', lineHeight: 1.6,
        }}>
          Sign in with Google to sync your progress across all your devices.
          Your data is stored privately in your own Google Drive.
        </p>
        <button
          onClick={onSignIn}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: 'var(--space-3)',
            background: 'var(--white)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius-xl)', padding: 'var(--space-4) var(--space-8)',
            fontSize: '0.9375rem', fontWeight: 500,
            color: 'var(--ink)', cursor: 'pointer', width: '100%',
            boxShadow: 'var(--shadow-sm)',
            transition: 'all 0.18s ease',
          }}
          onMouseEnter={e => { e.currentTarget.style.boxShadow = 'var(--shadow-md)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
          onMouseLeave={e => { e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; e.currentTarget.style.transform = 'none'; }}
        >
          <GoogleIcon />
          Continue with Google
        </button>
        <p style={{ fontSize: '0.75rem', color: 'var(--bark-light)', marginTop: 'var(--space-6)', lineHeight: 1.5 }}>
          Your progress is saved only in your Google Drive.<br />
          Nothing is shared with anyone else.
        </p>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

// ─── UpdateBanner.jsx ─────────────────────────────────────────────────────────
export function UpdateBanner({ version, notes, onDismiss }) {
  return (
    <div style={{
      background: 'var(--lilac-light)', borderBottom: '1px solid var(--lilac)',
      padding: 'var(--space-3) var(--space-6)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      gap: 'var(--space-4)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
        <span style={{ fontSize: '1rem' }}>✨</span>
        <div>
          <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--lilac-dark)' }}>
            Plan updated (v{version})
          </span>
          <span style={{ fontSize: '0.8125rem', color: 'var(--ink-light)', marginLeft: 'var(--space-2)' }}>
            {notes}
          </span>
        </div>
      </div>
      <button
        onClick={onDismiss}
        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--bark)', fontSize: '1rem', padding: 'var(--space-1)' }}
        aria-label="Dismiss"
      >✕</button>
    </div>
  );
}

// ─── InactivityBanner.jsx ────────────────────────────────────────────────────
export function InactivityBanner({ daysSince, storage, bannerId, onDismiss }) {
  const { data } = storage;

  // Find next incomplete task
  const { TASKS, MONTHS } = require('../data/planData');
  const currentMonth = MONTHS.find(m => m.id === data.currentMonthId);
  const monthTasks = TASKS.filter(t => t.monthId === data.currentMonthId);
  const nextTask = monthTasks.find(t => !data.completedTasks[t.id]);

  return (
    <div style={{
      background: 'var(--gold-light)', borderBottom: '1px solid var(--gold)',
      padding: 'var(--space-4) var(--space-6)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 'var(--space-4)' }}>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: '0.875rem', color: 'var(--ink)', fontWeight: 500, marginBottom: 'var(--space-1)' }}>
            It's been a little while — no pressure, just checking in. 🌱
          </p>
          {nextTask && (
            <p style={{ fontSize: '0.8125rem', color: 'var(--ink-light)' }}>
              Whenever you're ready, here's your next task:{' '}
              <strong style={{ color: 'var(--ink)' }}>{nextTask.label}: {nextTask.title}</strong>
            </p>
          )}
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-2)', flexShrink: 0 }}>
          <button
            onClick={() => onDismiss(false)}
            className="btn-ghost"
            style={{ fontSize: '0.75rem' }}
          >
            Snooze 1 week
          </button>
          <button
            onClick={() => onDismiss(true)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--bark)', fontSize: '1rem', padding: 'var(--space-1)' }}
            aria-label="Dismiss"
          >✕</button>
        </div>
      </div>
    </div>
  );
}

// ─── OnboardingModal.jsx ──────────────────────────────────────────────────────
export function OnboardingModal({ onComplete, onOpenHelp }) {
  const [step, setStep] = useState(0);
  const steps = [
    {
      emoji: '🌸',
      title: 'Welcome to your plan',
      body: "This is your personal career development tool. Everything in here was built for you — your goals, your pace, your specific situation. Take a breath. You're in the right place.",
    },
    {
      emoji: '📋',
      title: 'How the plan works',
      body: "The plan is organized into months, each with tasks across six tracks. You move through it at your own pace — there's no timer, and being 'behind' just means you haven't started yet. You can always adjust.",
    },
    {
      emoji: '✅',
      title: 'Checking things off',
      body: "Each task has subtasks — check them off one by one as you go. Every check adds to your progress. The wins log automatically captures what you've done. You'll also see your progress visually as you move forward.",
    },
    {
      emoji: '📓',
      title: 'Journal & wins',
      body: "Use the journal to write whenever you want — free-form, or linked to a specific task. Your wins log captures every completed task automatically, and you can add your own wins too.",
    },
    {
      emoji: '☀️',
      title: 'Migraine mode',
      body: "See the sun icon in the top right corner? Tap it anytime to switch to a warmer, easier-on-the-eyes display. Tap it again to switch back. It works on every screen.",
    },
    {
      emoji: '🌱',
      title: "One last thing",
      body: "You don't have to do everything at once. The only task for today is: open this app and read this. You've already done it. That's a win.",
    },
  ];

  const current = steps[step];
  const isLast = step === steps.length - 1;

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(44,40,37,0.5)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 999, padding: 'var(--space-6)',
    }}>
      <div className="card animate-scaleIn" style={{
        maxWidth: '420px', width: '100%', textAlign: 'center',
        padding: 'var(--space-10)',
      }}>
        <div style={{ fontSize: '3rem', marginBottom: 'var(--space-5)' }}>{current.emoji}</div>
        <h2 style={{ fontFamily: 'var(--font-display)', marginBottom: 'var(--space-4)', color: 'var(--ink)' }}>
          {current.title}
        </h2>
        <p style={{ color: 'var(--ink-light)', lineHeight: 1.7, marginBottom: 'var(--space-8)' }}>
          {current.body}
        </p>

        {/* Step dots */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-6)' }}>
          {steps.map((_, i) => (
            <div key={i} style={{
              width: i === step ? '20px' : '6px', height: '6px',
              borderRadius: '99px', transition: 'all 0.3s ease',
              background: i === step ? 'var(--bougainvillea)' : 'var(--bark-light)',
            }} />
          ))}
        </div>

        <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'center' }}>
          {step > 0 && (
            <button className="btn-secondary" onClick={() => setStep(s => s - 1)}>
              Back
            </button>
          )}
          {!isLast ? (
            <button className="btn-primary" onClick={() => setStep(s => s + 1)}>
              Next
            </button>
          ) : (
            <button className="btn-primary" onClick={onComplete}>
              Get started
            </button>
          )}
        </div>

        <button
          onClick={() => { onComplete(); onOpenHelp(); }}
          style={{ marginTop: 'var(--space-5)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--bark)', fontSize: '0.8125rem', textDecoration: 'underline' }}
        >
          Open full instructions instead
        </button>

        {step === 0 && (
          <button
            onClick={onComplete}
            style={{ marginTop: 'var(--space-3)', display: 'block', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--bark-light)', fontSize: '0.75rem' }}
          >
            Skip
          </button>
        )}
      </div>
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import './index.css';
import { useStorage } from './hooks/useStorage';
import { PLAN_VERSION, PLAN_VERSION_NOTES } from './data/planData';

import DevTestPanel from './components/DevTestPanel';

// Screens
import {
  HomeScreen, PlanScreen, WinsScreen, JournalScreen,
  ReferenceScreen, ProgressScreen, HelpScreen
} from './screens/index';

// Components
import {
  SignInScreen, OnboardingModal, UpdateBanner,
  InactivityBanner, BottomNav, SunToggle, SaveIndicator
} from './components/index';

export default function App() {
  const storage = useStorage();
  const { authState, data, saveStatus, signIn, toggleMigraineMode,
          markOnboardingSeen, markVersionSeen, dismissBanner } = storage;

  const [activeTab, setActiveTab] = useState('home');
  const [showProgress, setShowProgress] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showDevTest, setShowDevTest] = useState(false);

  // Dev test panel: open via URL param ?devtest=1
  useEffect(() => {
    if (window.location.search.includes('devtest=1')) setShowDevTest(true);
  }, []);

  // Apply migraine mode to body
  useEffect(() => {
    if (data.migraineMode) {
      document.body.classList.add('migraine-mode');
    } else {
      document.body.classList.remove('migraine-mode');
    }
  }, [data.migraineMode]);

  // Show version update banner
  const showVersionBanner = data.seenVersion !== PLAN_VERSION && data.seenOnboarding;

  // Show inactivity banner
  const lastActivity = data.lastActivity;
  const daysSince = lastActivity
    ? Math.floor((Date.now() - new Date(lastActivity).getTime()) / (1000 * 60 * 60 * 24))
    : null;
  const inactivityBannerId = `inactivity_${Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000))}`;
  const isBannerDismissed  = data.dismissedBanners[inactivityBannerId];
  const isBannerSnoozed    = data.snoozedBanners[inactivityBannerId]
    ? new Date(data.snoozedBanners[inactivityBannerId]) > new Date()
    : false;
  const showInactivityBanner = daysSince !== null && daysSince >= 14
    && !isBannerDismissed && !isBannerSnoozed;

  const hasBanner = showVersionBanner || showInactivityBanner;

  // Loading state
  if (authState === 'loading') {
    return (
      <div style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'100vh', background:'var(--cream)' }}>
        <div style={{ textAlign:'center' }}>
          <div style={{ fontSize:'2rem', marginBottom:'var(--space-4)' }}>🌸</div>
          <p style={{ fontFamily:'var(--font-display)', color:'var(--bark)', fontSize:'1.1rem' }}>Loading your plan…</p>
        </div>
      </div>
    );
  }

  // Sign-in gate
  if (authState === 'signed_out') {
    return <SignInScreen onSignIn={signIn} />;
  }

  // Onboarding
  if (!data.seenOnboarding) {
    return (
      <OnboardingModal
        onComplete={() => markOnboardingSeen()}
        onOpenHelp={() => { markOnboardingSeen(); setShowHelp(true); }}
      />
    );
  }

  const renderScreen = () => {
    switch (activeTab) {
      case 'home':      return <HomeScreen    storage={storage} onOpenProgress={() => setShowProgress(true)} />;
      case 'plan':      return <PlanScreen    storage={storage} />;
      case 'wins':      return <WinsScreen    storage={storage} />;
      case 'journal':   return <JournalScreen storage={storage} />;
      case 'reference': return <ReferenceScreen />;
      default:          return <HomeScreen    storage={storage} onOpenProgress={() => setShowProgress(true)} />;
    }
  };

  return (
    <div style={{ display:'flex', flexDirection:'column', minHeight:'100vh', background:'var(--cream)' }}>

      {/* ── Top bar ── */}
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0,
        height: 'var(--nav-height)',
        background: 'rgba(250,248,245,0.92)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 var(--space-6)',
        zIndex: 100,
      }}>
        <span style={{ fontFamily:'var(--font-display)', fontWeight:600, fontSize:'1.05rem', color:'var(--ink)' }}>
          From Where You Are
        </span>
        <div style={{ display:'flex', alignItems:'center', gap:'var(--space-3)' }}>
          <SaveIndicator status={saveStatus} />
          <button
            className="btn-ghost"
            onClick={() => setShowHelp(true)}
            style={{ fontSize:'1rem', padding:'var(--space-2)', fontWeight:600, color:'var(--bark)' }}
            title="Help & instructions"
            aria-label="Help"
          >
            ?
          </button>
          <SunToggle migraineMode={data.migraineMode} onToggle={toggleMigraineMode} />
        </div>
      </header>

      {/* ── Banners (sticky below top bar) ── */}
      {hasBanner && (
        <div style={{ position:'sticky', top:'var(--nav-height)', zIndex:90, marginTop:'var(--nav-height)' }}>
          {showVersionBanner && (
            <UpdateBanner version={PLAN_VERSION} notes={PLAN_VERSION_NOTES} onDismiss={markVersionSeen} />
          )}
          {showInactivityBanner && (
            <InactivityBanner
              daysSince={daysSince}
              storage={storage}
              bannerId={inactivityBannerId}
              onDismiss={(permanent) => dismissBanner(inactivityBannerId, permanent)}
            />
          )}
        </div>
      )}

      {/* ── Main content ── */}
      <main style={{
        flex: 1,
        marginTop: hasBanner ? 0 : 'var(--nav-height)',
        paddingBottom: 'calc(var(--bottom-nav-height) + var(--space-6))',
      }}>
        {renderScreen()}
      </main>

      {/* ── Bottom nav ── */}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />

      {/* ── Modals ── */}
      {showProgress && (
        <ProgressScreen storage={storage} onClose={() => setShowProgress(false)} />
      )}
      {showHelp && (
        <HelpScreen onClose={() => setShowHelp(false)} />
      )}
      {showDevTest && (
        <DevTestPanel storage={storage} onClose={() => setShowDevTest(false)} />
      )}
    </div>
  );
}

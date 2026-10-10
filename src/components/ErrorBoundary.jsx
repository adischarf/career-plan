// ErrorBoundary.jsx
// Safety net: if anything on a screen throws while rendering, show a calm card
// instead of a blank white page.
//
// Two modes:
//   - "screen" (default): wraps the main content area only. The save system,
//     top bar and bottom nav stay alive, so nothing in progress is lost and
//     "Try again" simply re-renders the screen.
//   - "app": last-resort wrapper around the whole app. Offers a page reload.

import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // Visible in the browser console for debugging
    console.error('[ErrorBoundary]', error, info?.componentStack);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    const isApp = this.props.mode === 'app';

    return (
      <div style={{
        minHeight: isApp ? '100vh' : 'auto',
        background: 'var(--cream)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 'var(--space-8) var(--space-6)',
      }}>
        <div style={{
          maxWidth: '380px', width: '100%', textAlign: 'center',
          background: 'var(--white)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius-md)', padding: 'var(--space-6)',
        }}>
          <div style={{ fontSize: '2rem', marginBottom: 'var(--space-3)' }}>🌿</div>
          <h2 style={{
            fontFamily: 'var(--font-display)', fontSize: '1.2rem',
            color: 'var(--ink)', marginBottom: 'var(--space-2)',
          }}>
            This page hit a snag
          </h2>
          <p style={{
            fontSize: '0.875rem', color: 'var(--bark)', lineHeight: 1.6,
            marginBottom: 'var(--space-5)',
          }}>
            {isApp
              ? 'Your saved progress is safe. Reloading will pick up right where you left off.'
              : 'Your progress is safe. Tap below to bring the page back, or use the tabs at the bottom.'}
          </p>
          <button
            className="btn-primary"
            onClick={() => {
              if (isApp) window.location.reload();
              else this.setState({ hasError: false });
            }}
          >
            {isApp ? 'Reload' : 'Try again'}
          </button>
        </div>
      </div>
    );
  }
}

// useStorage.js
// Handles Google Drive OAuth and all data persistence.
// The app stores a single JSON file in the user's Google Drive:
//   "career_plan_progress.json"

import { useState, useEffect, useCallback, useRef } from 'react';
import { PLAN_VERSION } from '../data/planData';

// ── Replace these with your actual values after Google Cloud Console setup ───
const CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID || 'YOUR_CLIENT_ID_HERE';
const API_KEY   = process.env.REACT_APP_GOOGLE_API_KEY   || 'YOUR_API_KEY_HERE';
const SCOPES    = 'https://www.googleapis.com/auth/drive.file';
const FILE_NAME = 'career_plan_progress.json';
// ─────────────────────────────────────────────────────────────────────────────

const DEFAULT_STATE = {
  version: PLAN_VERSION,
  lastSeen: null,
  userName: 'Shira',
  startDate: null,                // ISO string, set on first use
  completedSubtasks: {},          // { taskId: { subtaskId: bool } }
  completedTasks: {},             // { taskId: bool }
  habitLogs: {},                  // { taskId: { 'YYYY-WW': bool } }
  outputLinks: {},                // { taskId: { label: string, url: string } }
  journalEntries: [],             // [{ id, date, text, taskId? }]
  manualWins: [],                 // [{ id, date, text }]
  dismissedBanners: {},           // { bannerId: bool }
  snoozedBanners: {},             // { bannerId: ISO string (snooze until) }
  lastActivity: null,             // ISO string
  currentMonthId: 'month1',
  migraineMode: false,
  seenOnboarding: false,
  seenVersion: null,
  planPace: 'normal',             // 'normal' | 'slower' | 'paused'
};

let gapiLoaded = false;
let gisLoaded  = false;
let tokenClient = null;
let fileId = null;
let saveTimer = null;

export function useStorage() {
  const [authState, setAuthState]       = useState('loading'); // 'loading'|'signed_out'|'signed_in'
  const [data, setDataRaw]              = useState(DEFAULT_STATE);
  const [saveStatus, setSaveStatus]     = useState('idle');    // 'idle'|'saving'|'saved'|'error'
  const dataRef = useRef(data);

  // Keep ref in sync
  useEffect(() => { dataRef.current = data; }, [data]);

  // ── Load Google scripts ──────────────────────────────────────────────────
  useEffect(() => {
    if (CLIENT_ID === 'YOUR_CLIENT_ID_HERE') {
      // Dev mode: use localStorage
      setAuthState('dev_mode');
      const saved = localStorage.getItem('career_plan_dev');
      if (saved) {
        try { setDataRaw(JSON.parse(saved)); } catch {}
      }
      return;
    }

    const gapiScript = document.createElement('script');
    gapiScript.src = 'https://apis.google.com/js/api.js';
    gapiScript.onload = () => {
      window.gapi.load('client', async () => {
        await window.gapi.client.init({ apiKey: API_KEY, discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'] });
        gapiLoaded = true;
        maybeReady();
      });
    };
    document.body.appendChild(gapiScript);

    const gisScript = document.createElement('script');
    gisScript.src = 'https://accounts.google.com/gsi/client';
    gisScript.onload = () => {
      tokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPES,
        callback: handleTokenResponse,
      });
      gisLoaded = true;
      maybeReady();
    };
    document.body.appendChild(gisScript);

    return () => {
      document.body.removeChild(gapiScript);
      document.body.removeChild(gisScript);
    };
  }, []); // eslint-disable-line

  function maybeReady() {
    if (!gapiLoaded || !gisLoaded) return;
    const token = sessionStorage.getItem('gapi_token');
    if (token) {
      window.gapi.client.setToken(JSON.parse(token));
      loadOrCreateFile();
    } else {
      setAuthState('signed_out');
    }
  }

  async function handleTokenResponse(resp) {
    if (resp.error) { setAuthState('signed_out'); return; }
    sessionStorage.setItem('gapi_token', JSON.stringify(window.gapi.client.getToken()));
    await loadOrCreateFile();
  }

  // ── Find or create the progress file in Drive ───────────────────────────
  async function loadOrCreateFile() {
    try {
      const res = await window.gapi.client.drive.files.list({
        q: `name='${FILE_NAME}' and trashed=false`,
        fields: 'files(id,name)',
        spaces: 'drive',
      });
      const files = res.result.files;
      if (files.length > 0) {
        fileId = files[0].id;
        await loadFileContent();
      } else {
        await createFile();
      }
      setAuthState('signed_in');
    } catch (e) {
      console.error('Drive error:', e);
      setAuthState('signed_out');
    }
  }

  async function loadFileContent() {
    const res = await window.gapi.client.drive.files.get({ fileId, alt: 'media' });
    try {
      const parsed = JSON.parse(res.body);
      setDataRaw({ ...DEFAULT_STATE, ...parsed });
    } catch { setDataRaw(DEFAULT_STATE); }
  }

  async function createFile() {
    const content = JSON.stringify({ ...DEFAULT_STATE, startDate: new Date().toISOString() });
    const res = await window.gapi.client.request({
      path: '/upload/drive/v3/files',
      method: 'POST',
      params: { uploadType: 'multipart', fields: 'id' },
      headers: { 'Content-Type': 'multipart/related; boundary=foo_bar_baz' },
      body: [
        '--foo_bar_baz\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n',
        JSON.stringify({ name: FILE_NAME, mimeType: 'application/json' }),
        '\r\n--foo_bar_baz\r\nContent-Type: application/json\r\n\r\n',
        content,
        '\r\n--foo_bar_baz--',
      ].join(''),
    });
    fileId = res.result.id;
  }

  // ── Save (debounced) ─────────────────────────────────────────────────────
  const scheduleSave = useCallback((newData) => {
    if (saveTimer) clearTimeout(saveTimer);
    setSaveStatus('saving');
    saveTimer = setTimeout(async () => {
      if (authState === 'dev_mode') {
        localStorage.setItem('career_plan_dev', JSON.stringify(newData));
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus('idle'), 2000);
        return;
      }
      if (!fileId) return;
      try {
        await window.gapi.client.request({
          path: `/upload/drive/v3/files/${fileId}`,
          method: 'PATCH',
          params: { uploadType: 'media' },
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newData),
        });
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus('idle'), 2000);
      } catch (e) {
        console.error('Save error:', e);
        setSaveStatus('error');
      }
    }, 3000); // 3-second debounce
  }, [authState]);

  // ── Data mutation helper ─────────────────────────────────────────────────
  const updateData = useCallback((updater) => {
    setDataRaw(prev => {
      const next = typeof updater === 'function' ? updater(prev) : { ...prev, ...updater };
      const withActivity = { ...next, lastActivity: new Date().toISOString() };
      scheduleSave(withActivity);
      return withActivity;
    });
  }, [scheduleSave]);

  // ── Auth actions ─────────────────────────────────────────────────────────
  const signIn = useCallback(() => {
    if (authState === 'dev_mode') return;
    if (tokenClient) tokenClient.requestAccessToken({ prompt: 'consent' });
  }, [authState]);

  const signOut = useCallback(() => {
    if (authState === 'dev_mode') return;
    const token = window.gapi.client.getToken();
    if (token) {
      window.google.accounts.oauth2.revoke(token.access_token);
      window.gapi.client.setToken('');
      sessionStorage.removeItem('gapi_token');
    }
    fileId = null;
    setAuthState('signed_out');
    setDataRaw(DEFAULT_STATE);
  }, [authState]);

  // ── Progress helpers ─────────────────────────────────────────────────────
  const toggleSubtask = useCallback((taskId, subtaskId) => {
    updateData(prev => {
      const taskSubs = prev.completedSubtasks[taskId] || {};
      const wasComplete = !!taskSubs[subtaskId];
      return {
        ...prev,
        completedSubtasks: {
          ...prev.completedSubtasks,
          [taskId]: { ...taskSubs, [subtaskId]: !wasComplete },
        },
      };
    });
  }, [updateData]);

  const markTaskComplete = useCallback((taskId, winText) => {
    updateData(prev => {
      const newWin = winText ? {
        id: `win_${Date.now()}`,
        date: new Date().toISOString(),
        text: winText,
        taskId,
        auto: true,
      } : null;
      return {
        ...prev,
        completedTasks: { ...prev.completedTasks, [taskId]: true },
        manualWins: newWin ? [...prev.manualWins, newWin] : prev.manualWins,
      };
    });
  }, [updateData]);

  const unmarkTaskComplete = useCallback((taskId) => {
    updateData(prev => ({
      ...prev,
      completedTasks: { ...prev.completedTasks, [taskId]: false },
      manualWins: prev.manualWins.filter(w => !(w.taskId === taskId && w.auto)),
    }));
  }, [updateData]);

  const logHabit = useCallback((taskId, weekKey) => {
    updateData(prev => {
      const taskLog = prev.habitLogs[taskId] || {};
      const wasDone = !!taskLog[weekKey];
      return {
        ...prev,
        habitLogs: {
          ...prev.habitLogs,
          [taskId]: { ...taskLog, [weekKey]: !wasDone },
        },
      };
    });
  }, [updateData]);

  const saveOutputLink = useCallback((taskId, label, url) => {
    updateData(prev => ({
      ...prev,
      outputLinks: { ...prev.outputLinks, [taskId]: { label, url } },
    }));
  }, [updateData]);

  const addJournalEntry = useCallback((text, taskId = null) => {
    updateData(prev => ({
      ...prev,
      journalEntries: [
        ...prev.journalEntries,
        { id: `j_${Date.now()}`, date: new Date().toISOString(), text, taskId },
      ],
    }));
  }, [updateData]);

  const editJournalEntry = useCallback((entryId, newText) => {
    updateData(prev => ({
      ...prev,
      journalEntries: prev.journalEntries.map(e =>
        e.id === entryId ? { ...e, text: newText, edited: true } : e
      ),
    }));
  }, [updateData]);

  const deleteJournalEntry = useCallback((entryId) => {
    updateData(prev => ({
      ...prev,
      journalEntries: prev.journalEntries.filter(e => e.id !== entryId),
    }));
  }, [updateData]);

  const addManualWin = useCallback((text) => {
    updateData(prev => ({
      ...prev,
      manualWins: [
        ...prev.manualWins,
        { id: `mw_${Date.now()}`, date: new Date().toISOString(), text, auto: false },
      ],
    }));
  }, [updateData]);

  const editManualWin = useCallback((winId, newText) => {
    updateData(prev => ({
      ...prev,
      manualWins: prev.manualWins.map(w =>
        (w.id === winId && !w.auto) ? { ...w, text: newText } : w
      ),
    }));
  }, [updateData]);

  const deleteManualWin = useCallback((winId) => {
    updateData(prev => ({
      ...prev,
      manualWins: prev.manualWins.filter(w => !(w.id === winId && !w.auto)),
    }));
  }, [updateData]);

  const dismissBanner = useCallback((bannerId, permanent = false) => {
    updateData(prev => ({
      ...prev,
      dismissedBanners: permanent
        ? { ...prev.dismissedBanners, [bannerId]: true }
        : prev.dismissedBanners,
      snoozedBanners: !permanent
        ? { ...prev.snoozedBanners, [bannerId]: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() }
        : prev.snoozedBanners,
    }));
  }, [updateData]);

  const toggleMigraineMode = useCallback(() => {
    updateData(prev => ({ ...prev, migraineMode: !prev.migraineMode }));
  }, [updateData]);

  const markOnboardingSeen = useCallback(() => {
    updateData(prev => ({ ...prev, seenOnboarding: true }));
  }, [updateData]);

  const markVersionSeen = useCallback(() => {
    updateData(prev => ({ ...prev, seenVersion: PLAN_VERSION }));
  }, [updateData]);

  const setCurrentMonth = useCallback((monthId) => {
    updateData(prev => ({ ...prev, currentMonthId: monthId }));
  }, [updateData]);

  const setPlanPace = useCallback((pace) => {
    updateData(prev => ({ ...prev, planPace: pace }));
  }, [updateData]);

  return {
    authState,
    data,
    saveStatus,
    signIn,
    signOut,
    // Progress actions
    toggleSubtask,
    markTaskComplete,
    unmarkTaskComplete,
    logHabit,
    saveOutputLink,
    // Journal
    addJournalEntry,
    editJournalEntry,
    deleteJournalEntry,
    // Wins
    addManualWin,
    editManualWin,
    deleteManualWin,
    // UI state
    dismissBanner,
    toggleMigraineMode,
    markOnboardingSeen,
    markVersionSeen,
    setCurrentMonth,
    setPlanPace,
    // Direct update for edge cases
    updateData,
  };
}

// ── Week key helper (YYYY-WW) ────────────────────────────────────────────────
export function getWeekKey(date = new Date()) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 3 - ((d.getDay() + 6) % 7));
  const week1 = new Date(d.getFullYear(), 0, 4);
  const weekNum = 1 + Math.round(((d - week1) / 86400000 - 3 + ((week1.getDay() + 6) % 7)) / 7);
  return `${d.getFullYear()}-W${String(weekNum).padStart(2, '0')}`;
}

// ── Progress computation ─────────────────────────────────────────────────────
export function computeProgress(data, tasks) {
  const total = tasks.reduce((sum, t) => sum + (t.subtasks?.length || 1), 0);
  const done  = tasks.reduce((sum, t) => {
    if (!t.subtasks?.length) return sum + (data.completedTasks[t.id] ? 1 : 0);
    const subs = data.completedSubtasks[t.id] || {};
    return sum + t.subtasks.filter(s => subs[s.id]).length;
  }, 0);
  return total > 0 ? Math.round((done / total) * 100) : 0;
}

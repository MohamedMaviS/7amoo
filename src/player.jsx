/* 7amoo — Music player (fixed bottom-left, VOLT aesthetic) */
function Player() {
  const audioRef = React.useRef(null);
  const [playing, setPlaying] = React.useState(false);
  const [locked, setLocked] = React.useState(false);   // autoplay blocked by browser
  const [vol, setVol] = React.useState(() => {
    const v = parseFloat(localStorage.getItem('7m_vol'));
    return Number.isFinite(v) ? Math.max(0, Math.min(1, v)) : 0.55;
  });
  const [muted, setMuted] = React.useState(() => localStorage.getItem('7m_mut') === '1');
  const [open, setOpen] = React.useState(false);

  // mount: try autoplay; if blocked, unlock on the first user interaction
  React.useEffect(() => {
    const a = audioRef.current; if (!a) return;
    a.volume = vol; a.muted = muted; a.loop = true;
    let cancelled = false;
    a.play()
      .then(() => { if (!cancelled) { setPlaying(true); setLocked(false); } })
      .catch(() => {
        if (cancelled) return;
        setLocked(true);
        const unlock = () => {
          a.play().then(() => { setPlaying(true); setLocked(false); }).catch(() => {});
          window.removeEventListener('pointerdown', unlock, true);
          window.removeEventListener('keydown', unlock, true);
          window.removeEventListener('touchstart', unlock, true);
        };
        window.addEventListener('pointerdown', unlock, true);
        window.addEventListener('keydown', unlock, true);
        window.addEventListener('touchstart', unlock, true);
      });
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    a.addEventListener('play', onPlay);
    a.addEventListener('pause', onPause);
    return () => {
      cancelled = true;
      a.removeEventListener('play', onPlay);
      a.removeEventListener('pause', onPause);
    };
  }, []);

  React.useEffect(() => {
    if (audioRef.current) audioRef.current.volume = vol;
    localStorage.setItem('7m_vol', String(vol));
  }, [vol]);
  React.useEffect(() => {
    if (audioRef.current) audioRef.current.muted = muted;
    localStorage.setItem('7m_mut', muted ? '1' : '0');
  }, [muted]);

  // close panel on outside click / Escape
  React.useEffect(() => {
    if (!open) return;
    const onDown = (e) => { if (!e.target.closest('.player')) setOpen(false); };
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('pointerdown', onDown);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const toggle = (e) => {
    e?.stopPropagation();
    const a = audioRef.current; if (!a) return;
    if (playing) a.pause();
    else a.play().then(() => setPlaying(true)).catch(() => {});
    window.__click?.();
  };
  const toggleMute = (e) => { e?.stopPropagation(); setMuted(m => !m); window.__click?.(); };
  const onVol = (e) => {
    const v = parseFloat(e.target.value);
    setVol(v);
    if (v === 0) setMuted(true);
    else if (muted) setMuted(false);
  };

  const PlayI = () => (<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>);
  const PauseI = () => (<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>);
  const VolHiI = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" stroke="none"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>);
  const VolMuteI = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" stroke="none"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>);

  return (
    <div className={`player ${open ? 'is-open' : ''} ${playing ? 'is-playing' : ''} ${locked ? 'is-locked' : ''}`}>
      <audio ref={audioRef} src="assets/track.mp3" preload="auto" loop />
      {locked && !open && <span className="player__hint">♪ TAP TO PLAY</span>}
      <button
        type="button"
        className="player__fab"
        onClick={(e) => { e.stopPropagation(); setOpen(o => !o); window.__click?.(); }}
        onMouseEnter={() => window.__hover?.()}
        aria-label={open ? 'Close music player' : 'Open music player'}
        aria-expanded={open}
        title={playing ? 'الولا حمو جه — حمو المرشدى' : 'Play music'}
      >
        <span className="player__fab-ring" aria-hidden="true"></span>
        <span className="player__fab-core">
          {playing ? (
            <span className="player__eq" aria-hidden="true"><span></span><span></span><span></span><span></span></span>
          ) : <PlayI/>}
        </span>
      </button>

      <div className="player__panel" aria-hidden={!open} role="dialog" aria-label="Music player">
        <div className="player__head">
          <span className="player__kicker">NOW PLAYING</span>
          <button type="button" className="player__x" onClick={(e) => { e.stopPropagation(); setOpen(false); window.__click?.(); }} aria-label="Close">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>
          </button>
        </div>
        <div className="player__now">
          <b dir="rtl">الولا حمو جه</b>
          <small dir="rtl">حمو المرشدى · 2026</small>
        </div>
        <div className="player__ctrls">
          <button type="button" className="player__play" onClick={toggle} onMouseEnter={() => window.__hover?.()} aria-label={playing ? 'Pause' : 'Play'}>
            {playing ? <PauseI/> : <PlayI/>}
          </button>
          <button type="button" className="player__mute" onClick={toggleMute} onMouseEnter={() => window.__hover?.()} aria-label={muted ? 'Unmute' : 'Mute'}>
            {muted ? <VolMuteI/> : <VolHiI/>}
          </button>
          <input
            className="player__vol"
            type="range" min="0" max="1" step="0.05"
            value={muted ? 0 : vol}
            onChange={onVol}
            onClick={(e) => e.stopPropagation()}
            aria-label="Volume"
          />
        </div>
      </div>
    </div>
  );
}
window.Player = Player;

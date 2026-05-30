/* 7amoo — Music player (fixed bottom-left, VOLT) with autoplay + playlist */
const TRACKS = [
  { src: 'assets/track.mp3',  title: 'الولا حمو جه',   artist: 'حمو المرشدى · 2026' },
  { src: 'assets/track2.mp3', title: 'هاى معاكو حمو',  artist: 'حمو المرشدى · 2026' },
];

function Player() {
  const audioRef = React.useRef(null);
  const initRef  = React.useRef(false);
  const [idx, setIdx] = React.useState(() => {
    const n = parseInt(localStorage.getItem('7m_idx') || '0', 10);
    return Number.isFinite(n) && n >= 0 && n < TRACKS.length ? n : 0;
  });
  const [playing, setPlaying] = React.useState(false);
  const [locked, setLocked]   = React.useState(false);     // hard-blocked (not even muted autoplay)
  const [muted, setMuted]     = React.useState(true);      // start muted so autoplay is allowed
  const [needsSound, setNeedsSound] = React.useState(true);// true until first user interaction unmutes
  const [vol, setVol] = React.useState(() => {
    const v = parseFloat(localStorage.getItem('7m_vol'));
    return Number.isFinite(v) ? Math.max(0, Math.min(1, v)) : 0.55;
  });
  const [open, setOpen] = React.useState(false);

  // ---- mount: try muted autoplay, then unmute on first user interaction ----
  React.useEffect(() => {
    const a = audioRef.current; if (!a) return;
    a.volume = vol; a.muted = true; a.loop = false;
    let cancelled = false;

    const unmute = () => {
      if (cancelled || !needsSoundRef.current) return;
      needsSoundRef.current = false;
      a.muted = false; setMuted(false); setNeedsSound(false);
    };
    // ref mirror so listeners see latest value
    const needsSoundRef = { current: true };

    const unlockOrUnmute = () => {
      // also try play() — covers the "hard-blocked" path
      a.play().then(() => { if (!cancelled) { setPlaying(true); setLocked(false); } }).catch(()=>{});
      unmute();
      window.removeEventListener('pointerdown', unlockOrUnmute, true);
      window.removeEventListener('keydown',     unlockOrUnmute, true);
      window.removeEventListener('touchstart',  unlockOrUnmute, true);
      window.removeEventListener('wheel',       unlockOrUnmute, true);
      window.removeEventListener('scroll',      unlockOrUnmute, true);
    };

    const onEnded = () => setIdx(i => (i + 1) % TRACKS.length);
    const onPlay  = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    a.addEventListener('ended', onEnded);
    a.addEventListener('play',  onPlay);
    a.addEventListener('pause', onPause);

    // muted autoplay — browsers allow this
    a.play()
      .then(() => {
        if (cancelled) return;
        setPlaying(true); setLocked(false);
        // Now wait for any user interaction → unmute
        window.addEventListener('pointerdown', unlockOrUnmute, true);
        window.addEventListener('keydown',     unlockOrUnmute, true);
        window.addEventListener('touchstart',  unlockOrUnmute, true);
        window.addEventListener('wheel',       unlockOrUnmute, true);
        window.addEventListener('scroll',      unlockOrUnmute, true);
      })
      .catch(() => {
        if (cancelled) return;
        // Even muted autoplay blocked — show "tap to play" fallback
        setLocked(true);
        window.addEventListener('pointerdown', unlockOrUnmute, true);
        window.addEventListener('keydown',     unlockOrUnmute, true);
        window.addEventListener('touchstart',  unlockOrUnmute, true);
      });

    return () => {
      cancelled = true;
      a.removeEventListener('ended', onEnded);
      a.removeEventListener('play',  onPlay);
      a.removeEventListener('pause', onPause);
    };
  }, []);

  // ---- swap track on idx change (skip the initial mount) ----
  React.useEffect(() => {
    if (!initRef.current) { initRef.current = true; return; }
    const a = audioRef.current; if (!a) return;
    a.src = TRACKS[idx].src;
    a.load();
    a.play().then(() => setPlaying(true)).catch(() => {});
    localStorage.setItem('7m_idx', String(idx));
  }, [idx]);

  // ---- persist volume + apply ----
  React.useEffect(() => {
    if (audioRef.current) audioRef.current.volume = vol;
    localStorage.setItem('7m_vol', String(vol));
  }, [vol]);
  React.useEffect(() => { if (audioRef.current) audioRef.current.muted = muted; }, [muted]);

  // ---- close panel on outside click / Escape ----
  React.useEffect(() => {
    if (!open) return;
    const onDown = (e) => { if (!e.target.closest('.player')) setOpen(false); };
    const onKey  = (e) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('pointerdown', onDown);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  // ---- controls ----
  const toggle = (e) => {
    e?.stopPropagation();
    const a = audioRef.current; if (!a) return;
    if (playing) a.pause();
    else a.play().then(() => setPlaying(true)).catch(() => {});
    window.__click?.();
  };
  const toggleMute = (e) => { e?.stopPropagation(); setMuted(m => !m); setNeedsSound(false); window.__click?.(); };
  const onVol = (e) => { const v = parseFloat(e.target.value); setVol(v); if (v === 0) setMuted(true); else if (muted) { setMuted(false); setNeedsSound(false); } };
  const next = (e) => { e?.stopPropagation(); setIdx(i => (i + 1) % TRACKS.length); window.__click?.(); };
  const prev = (e) => { e?.stopPropagation(); setIdx(i => (i - 1 + TRACKS.length) % TRACKS.length); window.__click?.(); };

  const PlayI  = () => (<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>);
  const PauseI = () => (<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>);
  const PrevI  = () => (<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6 5h2v14H6zM20 5v14l-11-7z"/></svg>);
  const NextI  = () => (<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M16 5h2v14h-2zM4 5v14l11-7z"/></svg>);
  const VolHiI = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" stroke="none"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>);
  const VolMuteI = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" stroke="none"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>);

  const t = TRACKS[idx];
  const hint = locked ? '♪ TAP TO PLAY' : (needsSound ? '♪ TAP FOR SOUND' : '');

  return (
    <div className={`player ${open ? 'is-open' : ''} ${playing ? 'is-playing' : ''} ${locked ? 'is-locked' : ''} ${needsSound && !locked ? 'is-silent' : ''}`}>
      <audio ref={audioRef} src={t.src} preload="auto" />
      {hint && !open && <span className="player__hint">{hint}</span>}

      <button
        type="button"
        className="player__fab"
        onClick={(e) => { e.stopPropagation(); setOpen(o => !o); window.__click?.(); }}
        onMouseEnter={() => window.__hover?.()}
        aria-label={open ? 'Close music player' : 'Open music player'}
        aria-expanded={open}
        title={`${t.title} — ${t.artist}`}
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
          <span className="player__kicker">NOW PLAYING · {idx + 1}/{TRACKS.length}</span>
          <button type="button" className="player__x" onClick={(e) => { e.stopPropagation(); setOpen(false); window.__click?.(); }} aria-label="Close">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>
          </button>
        </div>
        <div className="player__now">
          <b dir="rtl">{t.title}</b>
          <small dir="rtl">{t.artist}</small>
        </div>
        <div className="player__ctrls">
          <button type="button" className="player__nav" onClick={prev} onMouseEnter={() => window.__hover?.()} aria-label="Previous track" title="Previous"><PrevI/></button>
          <button type="button" className="player__play" onClick={toggle} onMouseEnter={() => window.__hover?.()} aria-label={playing ? 'Pause' : 'Play'}>
            {playing ? <PauseI/> : <PlayI/>}
          </button>
          <button type="button" className="player__nav" onClick={next} onMouseEnter={() => window.__hover?.()} aria-label="Next track" title="Next"><NextI/></button>
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
        <ul className="player__list">
          {TRACKS.map((tr, i) => (
            <li key={tr.src}>
              <button
                type="button"
                className={`player__item ${i === idx ? 'on' : ''}`}
                onClick={(e) => { e.stopPropagation(); setIdx(i); window.__click?.(); }}
                onMouseEnter={() => window.__hover?.()}
                aria-current={i === idx ? 'true' : 'false'}
              >
                <span className="player__item-n">{String(i + 1).padStart(2, '0')}</span>
                <span className="player__item-t" dir="rtl">{tr.title}</span>
                <span className="player__item-s" aria-hidden="true">
                  {i === idx && playing ? (
                    <span className="player__eq player__eq--sm"><span></span><span></span><span></span></span>
                  ) : i === idx ? <PlayI/> : null}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
window.Player = Player;

const { useState: useSt, useEffect: useEf } = React;

const KICK_USER = '7amoo_69';

function App() {
  const [tweaks, setTweaks] = useSt(window.TWEAK_DEFAULTS);
  const [editMode, setEditMode] = useSt(false);
  const [panelOpen, setPanelOpen] = useSt(false);
  const [isLive, setIsLive] = useSt(false);

  const setTweak = (k, v) => setTweaks(prev => {
    const next = { ...prev, [k]: v };
    window.parent?.postMessage({ type: '__edit_mode_set_keys', edits: { [k]: v } }, '*');
    return next;
  });

  useEf(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', tweaks.theme);
    root.setAttribute('data-density', tweaks.density);
    root.setAttribute('lang', tweaks.lang);
    root.setAttribute('dir', tweaks.lang === 'ar' ? 'rtl' : 'ltr');
    const accent = tweaks.accent;
    root.style.setProperty('--red-0', accent);
    root.style.setProperty('--red-1', shade(accent, 22));
    root.style.setProperty('--red-2', shade(accent, -34));
    root.style.setProperty('--red-dim', hexToRgba(accent, 0.15));
    root.style.setProperty('--glow', `0 0 24px ${hexToRgba(accent,0.5)}, 0 0 48px ${hexToRgba(accent,0.25)}`);
    window.__soundEnabled?.(tweaks.soundOnHover);
  }, [tweaks]);

  useEf(() => {
    let cancelled = false;
    const check = async () => {
      try {
        const r = await fetch('/api/live', { cache: 'no-store' });
        if (!r.ok) return;
        const d = await r.json();
        if (cancelled) return;
        if (d.isLive === true) setIsLive(true);
        else if (d.isLive === false) setIsLive(false);
      } catch (_) {}
    };
    check();
    const t = setInterval(check, 60000);
    return () => { cancelled = true; clearInterval(t); };
  }, []);

  useEf(() => {
    const onMsg = (e) => {
      if (e.data?.type === '__activate_edit_mode') setEditMode(true);
      if (e.data?.type === '__deactivate_edit_mode') setEditMode(false);
    };
    window.addEventListener('message', onMsg);
    window.parent?.postMessage({ type: '__edit_mode_available' }, '*');
    return () => window.removeEventListener('message', onMsg);
  }, []);

  useEf(() => { setTimeout(() => window.__observeReveals?.(), 100); }, [tweaks.lang]);

  const t = I18N[tweaks.lang] || I18N.en;
  const ctx = { lang: tweaks.lang, t };

  return (
    <LangContext.Provider value={ctx}>
      <Nav isLive={isLive} lang={tweaks.lang} setLang={v=>setTweak('lang',v)} onOpenTweaks={() => setPanelOpen(o=>!o)}/>
      <Hero isLive={isLive}/>
      <Bio/>
      <Channels isLive={isLive}/>
      <ChannelsMarquee/>
      <Contact/>
      <Footer/>
      <TweaksPanel tweaks={tweaks} setTweak={setTweak} visible={editMode || panelOpen} onClose={()=>setPanelOpen(false)}/>
      <KickPreview/>
    </LangContext.Provider>
  );
}

function KickPreview() {
  const [visible, setVisible] = useSt(false);
  const [mounted, setMounted] = useSt(false);
  const [pos, setPos] = useSt({ top: 0, left: 0 });
  const [muted, setMuted] = useSt(true);
  const [volume, setVolume] = useSt(0.7);
  const hideTimer = React.useRef(null);

  useEf(() => {
    if (window.innerWidth < 900) return;

    const WIDTH = 460;
    const HEIGHT = 260;
    const GAP = 12;

    const show = (target) => {
      clearTimeout(hideTimer.current);
      const r = target.getBoundingClientRect();
      let top = r.bottom + GAP;
      if (top + HEIGHT > window.innerHeight - 20) top = Math.max(20, r.top - HEIGHT - GAP);
      let left = r.left + r.width / 2 - WIDTH / 2;
      left = Math.max(16, Math.min(left, window.innerWidth - WIDTH - 16));
      setPos({ top, left });
      setMounted(true);
      setVisible(true);
    };

    const scheduleHide = () => {
      clearTimeout(hideTimer.current);
      hideTimer.current = setTimeout(() => setVisible(false), 200);
    };

    const onOver = (e) => {
      const trigger = e.target.closest('[data-kick-preview]');
      if (trigger) { show(trigger); return; }
      if (e.target.closest('.kick-preview')) clearTimeout(hideTimer.current);
    };
    const onOut = (e) => {
      const trigger = e.target.closest('[data-kick-preview]');
      if (!trigger) return;
      const goingTo = e.relatedTarget;
      if (goingTo && (goingTo.closest?.('[data-kick-preview]') || goingTo.closest?.('.kick-preview'))) return;
      scheduleHide();
    };
    const onPreviewOut = (e) => {
      if (!e.target.closest('.kick-preview')) return;
      const goingTo = e.relatedTarget;
      if (goingTo && (goingTo.closest?.('[data-kick-preview]') || goingTo.closest?.('.kick-preview'))) return;
      scheduleHide();
    };

    document.addEventListener('mouseover', onOver);
    document.addEventListener('mouseout', onOut);
    document.addEventListener('mouseout', onPreviewOut);
    return () => {
      document.removeEventListener('mouseover', onOver);
      document.removeEventListener('mouseout', onOut);
      document.removeEventListener('mouseout', onPreviewOut);
      clearTimeout(hideTimer.current);
    };
  }, []);

  return (
    <div
      className={`kick-preview ${visible ? 'is-visible' : ''}`}
      style={{ top: pos.top, left: pos.left }}
      aria-hidden={!visible}
    >
      <div className="kick-preview__frame">
        {mounted && (
          <iframe
            key={`kick-${muted ? 'm' : 'u'}-${Math.round(volume * 10)}`}
            src={`https://player.kick.com/${KICK_USER}?autoplay=true&muted=${muted}&volume=${volume}`}
            title="7amoo Live on Kick"
            allow="autoplay; fullscreen; picture-in-picture"
            loading="lazy"
          />
        )}
      </div>
      <div className="kick-preview__footer mono">
        <span className="kick-preview__dot"></span>
        <span className="kick-preview__label">KICK.COM/{KICK_USER.toUpperCase()} · LIVE</span>
        <div className="kick-preview__audio">
          <button
            type="button"
            className="kick-preview__mute"
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setMuted(m => !m); }}
            aria-label={muted ? 'Unmute preview' : 'Mute preview'}
            title={muted ? 'Unmute' : 'Mute'}
          >
            {muted ? (
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" stroke="none"/>
                <line x1="23" y1="9" x2="17" y2="15"/>
                <line x1="17" y1="9" x2="23" y2="15"/>
              </svg>
            ) : volume < 0.4 ? (
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" stroke="none"/>
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" stroke="none"/>
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
              </svg>
            )}
          </button>
          <input
            type="range"
            className="kick-preview__volume"
            min="0" max="1" step="0.05"
            value={muted ? 0 : volume}
            onChange={(e) => {
              const v = parseFloat(e.target.value);
              setVolume(v);
              setMuted(v === 0);
            }}
            onClick={(e) => e.stopPropagation()}
            aria-label="Preview volume"
          />
        </div>
      </div>
    </div>
  );
}

function Nav({ isLive, lang, setLang, onOpenTweaks }) {
  const { t } = React.useContext(LangContext);
  const [scrolled, setScrolled] = useSt(false);

  useEf(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className={`nav ${scrolled?'nav--scrolled':''}`}>
      <div className="nav__inner">
        <a className="nav__logo" href="#top" data-hover onMouseEnter={() => window.__playHover?.()} aria-label="7amoo — home">
          <Brandmark className="nav__logo-mark" />
          <span className="mono">7amoo</span>
          <span className="nav__logo-pulse" aria-hidden="true"></span>
        </a>
        <div className="nav__links mono">
          <a href="#bio" data-hover>{t.about}</a>
          <a href="#channels" data-hover>{t.channels}</a>
          <a href="#contact" data-hover>{t.contact}</a>
        </div>
        <div className="nav__right">
          <a href={`https://kick.com/${KICK_USER}`} target="_blank" rel="noopener noreferrer" className="live-pill nav__live" data-live={isLive} data-hover data-kick-preview onMouseEnter={()=>window.__playHover?.()}>
            <span className="live-dot"></span>
            <span className="mono small">{isLive ? t.live : t.off}</span>
          </a>
          <div className="lang-toggle" data-lang={lang}>
            <button className={`lang-btn ${lang==='en'?'is-active':''}`} onClick={()=>setLang('en')} data-hover>EN</button>
            <button className={`lang-btn ${lang==='ar'?'is-active':''}`} onClick={()=>setLang('ar')} data-hover>AR</button>
          </div>
          <button className="tweaks-toggle" onClick={() => { onOpenTweaks(); window.__playClick?.(); }} data-hover aria-label="Customize">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3"/>
              <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 0 1-4 0v-.1a1.7 1.7 0 0 0-1.2-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 0 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.2 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 0 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 0 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
}

function hexToRgba(hex, a) {
  const h = hex.replace('#','');
  const b = parseInt(h.length === 3 ? h.split('').map(c=>c+c).join('') : h, 16);
  return `rgba(${(b>>16)&255},${(b>>8)&255},${b&255},${a})`;
}
function shade(hex, percent) {
  const h = hex.replace('#','');
  const bi = parseInt(h.length === 3 ? h.split('').map(c=>c+c).join('') : h, 16);
  let r = (bi>>16)&255, g = (bi>>8)&255, b = bi&255;
  const amt = Math.round(2.55 * percent);
  r = Math.max(0, Math.min(255, r + amt));
  g = Math.max(0, Math.min(255, g + amt));
  b = Math.max(0, Math.min(255, b + amt));
  return '#' + ((1<<24) + (r<<16) + (g<<8) + b).toString(16).slice(1);
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);

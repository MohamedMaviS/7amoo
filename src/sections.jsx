const { useContext } = React;

// ── 7amoo channels — ONLY the official links ───────────────────
const LINKS = {
  kick:      'https://kick.com/7amoo_69',
  tiktok:    'https://www.tiktok.com/@hamo_eldiesel',
  instagram: 'https://www.instagram.com/7amo0_69',
  discord:   'https://discord.gg/fgas9B2wv2',
  whatsapp:  'https://whatsapp.com/channel/0029VbCG8yeGU3BLMmKebm0T',
};

const HANDLES = {
  kick:      '/7amoo_69',
  tiktok:    '@hamo_eldiesel',
  instagram: '@7amo0_69',
  discord:   'discord.gg',
  whatsapp:  'Channel',
};

// Brand-ish accent per platform (used for the per-card glow)
const PLAT_COLORS = {
  kick:      '#53fc18',
  tiktok:    '#ff3e6a',
  instagram: '#e1306c',
  discord:   '#5865f2',
  whatsapp:  '#25d366',
};

// ── Reusable section header ────────────────────────────────────
function SectionHeader({ icon, label, number, kicker }) {
  return (
    <div className="sec-head">
      <div className="sec-head__inner">
        <div className="sec-head__badge reveal reveal--zoom">
          <span className="sec-head__ic">{icon}</span>
        </div>
        <div className="sec-head__text">
          <div className="sec-head__num mono reveal reveal--fade" style={{ transitionDelay: '.12s' }}>— {number} —</div>
          <div className="sec-head__label reveal" style={{ transitionDelay: '.22s' }}>{label}</div>
          {kicker && <div className="sec-head__kicker mono small muted reveal reveal--fade" style={{ transitionDelay: '.34s' }}>{kicker}</div>}
        </div>
      </div>
      <div className="sec-head__line reveal reveal--right" style={{ transitionDelay: '.4s' }}></div>
    </div>
  );
}

// ── 7amoo logo / monogram (CSS placeholder until real logo dropped at assets/logo.png) ──
function Brandmark({ className = '' }) {
  const [broken, setBroken] = React.useState(false);
  return (
    <span className={`brandmark ${className} ${broken ? 'brandmark--mono' : ''}`} aria-hidden="true">
      {!broken ? (
        <img src="assets/logo.jpg" alt="" className="brandmark__img" onError={() => setBroken(true)} />
      ) : (
        <span className="brandmark__mono">
          <span className="brandmark__mono-num">7</span>
          <span className="brandmark__mono-ring"></span>
        </span>
      )}
    </span>
  );
}

// ── Quick-facts auto-rotating reel ─────────────────────────────
function FactReel() {
  const { t } = useContext(LangContext);
  const facts = t.facts || [];
  const [idx, setIdx] = React.useState(0);
  const [paused, setPaused] = React.useState(false);

  React.useEffect(() => {
    if (paused || facts.length < 2) return;
    const id = setInterval(() => setIdx(i => (i + 1) % facts.length), 2800);
    return () => clearInterval(id);
  }, [paused, facts.length]);

  if (!facts.length) return null;
  const current = facts[idx];
  const IconC = Icon[current.ic] || Icon.Bolt;

  return (
    <div
      className="fact-reel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        e.currentTarget.style.setProperty('--mx', ((e.clientX - r.left) / r.width) * 100 + '%');
        e.currentTarget.style.setProperty('--my', ((e.clientY - r.top) / r.height) * 100 + '%');
      }}
    >
      <span className="fact-reel__bg-grid" aria-hidden="true"></span>
      <span className="fact-reel__bg-glow" aria-hidden="true"></span>
      <span className="fact-reel__bg-scan" aria-hidden="true"></span>

      <div className="fact-reel__head">
        <span className="fact-reel__ping"></span>
        <span className="fact-reel__headlabel mono small">{t.factsLabel}</span>
        <div className="fact-reel__dots">
          {facts.map((_, i) => (
            <button
              key={i}
              className={`fact-reel__dot ${i===idx?'is-active':''}`}
              onClick={() => setIdx(i)}
              data-hover
              aria-label={`Fact ${i+1}`}
            />
          ))}
        </div>
      </div>
      <div className="fact-reel__stage">
        <div key={idx} className="fact-reel__item">
          <div className="fact-reel__ic"><IconC/></div>
          <div className="fact-reel__body">
            <div className="fact-reel__label mono small">{current.label}</div>
            <div className="fact-reel__value">{current.value}</div>
          </div>
        </div>
      </div>

      <span className="fact-reel__corner tl" aria-hidden="true"></span>
      <span className="fact-reel__corner tr" aria-hidden="true"></span>
      <span className="fact-reel__corner bl" aria-hidden="true"></span>
      <span className="fact-reel__corner br" aria-hidden="true"></span>
    </div>
  );
}

// ── HERO ───────────────────────────────────────────────────────
function Hero({ isLive }) {
  const { t } = useContext(LangContext);
  const heroLiveLabel = isLive ? t.liveOn : t.offline;
  return (
    <section className="hero">
      <div className="hero__grid"></div>
      <div className="hero__glow"></div>
      <div className="hero__glow hero__glow--2"></div>

      <div className="hero__inner">
        <div className="hero__titleblock reveal">
          <div className="mono tag red hero__tag">{t.roleTag}</div>
          <h1 className="hero__title">
            <span className="hero__title-text glitch" data-text="7amoo">7amoo</span>
            <span className="hero__subtitle">{t.roleSub}</span>
          </h1>
        </div>

        <div className="hero__content">
          <div className="hero__left reveal reveal--3d">
            <p className="hero__desc">{t.heroDesc}</p>
            <div className="hero__cta">
              <a href="#channels" className="btn btn--primary" data-hover onMouseEnter={() => window.__playHover?.()} onClick={() => window.__playClick?.()}>
                <Icon.Bolt/><span>{t.followAll}</span>
              </a>
              <a href={LINKS.kick} target="_blank" rel="noopener noreferrer" className="btn btn--ghost" data-hover data-kick-preview onMouseEnter={() => window.__playHover?.()}>
                <Icon.Kick/><span>{t.watchLiveBtn}</span>
              </a>
            </div>
            <FactReel/>
          </div>
          <div className="hero__right reveal reveal--3d">
            <div className="hero-photo">
              <div className="hero-photo__glow"></div>
              <div className="hero-photo__frame">
                <Brandmark className="hero-photo__brand" />
                <div className="hero-photo__scan"></div>
                <div className="hero-photo__corner tl"></div>
                <div className="hero-photo__corner tr"></div>
                <div className="hero-photo__corner bl"></div>
                <div className="hero-photo__corner br"></div>
              </div>
              <a href={LINKS.kick} target="_blank" rel="noopener noreferrer" className={`hero-live-badge ${isLive?'is-live':'is-off'}`} data-hover data-kick-preview onMouseEnter={()=>window.__playHover?.()}>
                <span className="live-dot"></span>
                <span className="mono">{heroLiveLabel}</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="hero__ticker">
        <div className="ticker-track">
          {Array.from({length: 4}).map((_, g) => (
            <div key={g} className="ticker-group">
              {t.ticker.map((w, i) => (
                <React.Fragment key={i}>
                  <span>{w}</span><span className="ticker-sep">◆</span>
                </React.Fragment>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── char / word reveal helpers ─────────────────────────────────
function CharReveal({ text, baseDelay = 0, className = '', dir }) {
  const isArabic = /[؀-ۿݐ-ݿﭐ-﷿ﹰ-﻿]/.test(text);
  if (isArabic) {
    const parts = text.split(/(\s+)/);
    return (
      <span className={`h2--chars reveal ${className}`} dir={dir}>
        {parts.map((p, i) => (
          /^\s+$/.test(p)
            ? <span key={i} className="h2-char h2-char--space"> </span>
            : <span key={i} className="h2-char" style={{ transitionDelay: `${baseDelay + i * 0.08}s` }}>{p}</span>
        ))}
      </span>
    );
  }
  const chars = Array.from(text);
  return (
    <span className={`h2--chars reveal ${className}`} dir={dir}>
      {chars.map((c, i) => (
        c === ' '
          ? <span key={i} className="h2-char h2-char--space"> </span>
          : <span key={i} className="h2-char" style={{ transitionDelay: `${baseDelay + i * 0.04}s` }}>{c}</span>
      ))}
    </span>
  );
}
function WordReveal({ text, className = '' }) {
  const parts = text.split(/(\s+)/);
  return (
    <span className={`word-reveal reveal ${className}`}>
      {parts.map((p, i) => (
        /^\s+$/.test(p)
          ? <span key={i} className="wr wr--space"> </span>
          : <span key={i} className="wr" style={{ transitionDelay: `${i * 0.04}s` }}>{p}</span>
      ))}
    </span>
  );
}

// ── ABOUT / BIO ────────────────────────────────────────────────
function Bio() {
  const { t } = useContext(LangContext);
  const idRows = [
    { label: t.name,      value: '7AMOO',        ic: 'Sparkles' },
    { label: t.location,  value: t.locVal,       ic: 'Pin' },
    { label: t.role,      value: t.roleVal,      ic: 'Kick' },
    { label: t.idGames,   value: t.idGamesVal,   ic: 'Gamepad' },
    { label: t.idContent, value: t.idContentVal, ic: 'Sparkles' },
    { label: t.status,    value: t.statusVal,    ic: 'Calendar' },
    { label: t.idLang,    value: t.idLangVal,    ic: 'Globe' },
  ];
  return (
    <section className="bio" id="bio">
      <SectionHeader icon={<Icon.Sparkles/>} label={t.aboutTag} number="01"/>
      <div className="bio__inner">
        <div className="bio__left reveal reveal--left">
          <h2 className="h2">
            <CharReveal text={t.whoIs + ' '} />
            <span className="red"><CharReveal text="7amoo" dir="ltr" baseDelay={(t.whoIs.length + 1) * 0.04} /></span>
            <CharReveal text={t.q} baseDelay={(t.whoIs.length + 6) * 0.04} />
          </h2>
          <p className="bio__lead"><WordReveal text={t.bioLead}/></p>
          <div className="bio__chips">
            {t.chips.map((c, i) => (
              <span key={c} className="chip mono reveal reveal--zoom" style={{ transitionDelay: `${0.2 + i * 0.06}s` }}>{c}</span>
            ))}
          </div>

          <blockquote className="bio__quote reveal reveal--fade" data-hover data-tilt>
            <span className="bio__quote-mark" aria-hidden="true">&ldquo;</span>
            <p className="bio__quote-text">
              {t.quoteText} <span className="red">{t.quoteAccent}</span>
            </p>
            <footer className="bio__quote-by mono">{t.quoteBy}</footer>
            <span className="bio__quote-corner tl"></span>
            <span className="bio__quote-corner br"></span>
          </blockquote>

          <div className="bio__specs reveal reveal--fade">
            <div className="bio__specs-head">
              <span className="bio__specs-bar"></span>
              <span className="bio__specs-title tag">{t.specialtiesTag}</span>
            </div>
            <div className="bio__specs-grid">
              {t.specialties.map((s, i) => {
                const IC = Icon[s.ic] || Icon.Sparkles;
                return (
                  <div className="bio__spec reveal reveal--zoom" key={i} style={{ transitionDelay: `${i * 0.08}s` }} data-hover data-tilt>
                    <span className="bio__spec-ic"><IC/></span>
                    <span className="bio__spec-lbl">{s.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className="bio__right reveal reveal--right">
          <div className="bio__card">
            <div className="bio__card-img">
              <Brandmark className="bio__card-brand" />
              <div className="bio__card-overlay">
                <span className="bio__card-badge">
                  <span className="live-dot"></span>
                  <span className="mono">{t.roleVal}</span>
                </span>
              </div>
            </div>
            <div className="bio__card-meta">
              <div className="bio__card-head">
                <span className="mono small muted">{t.idCard}</span>
              </div>
              <div className="bio__id">
                {idRows.map((r, i) => {
                  const IC = Icon[r.ic] || Icon.Sparkles;
                  return (
                    <div className="bio__id-row" key={i}>
                      <span className="bio__id-ic"><IC/></span>
                      <span className="bio__id-text">
                        <span className="bio__id-label mono small">{r.label}</span>
                        <b className="bio__id-val">{r.value}</b>
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── CHANNELS ───────────────────────────────────────────────────
const PLATFORMS = [
  { key: 'kick',      name: 'KICK',      icon: 'Kick',      labelKey: 'watchLive'  },
  { key: 'tiktok',    name: 'TIKTOK',    icon: 'TikTok',    labelKey: 'follow'     },
  { key: 'instagram', name: 'INSTAGRAM', icon: 'Instagram', labelKey: 'follow'     },
  { key: 'discord',   name: 'DISCORD',   icon: 'Discord',   labelKey: 'joinServer' },
  { key: 'whatsapp',  name: 'WHATSAPP',  icon: 'WhatsApp',  labelKey: 'joinChannel'},
];

const PLAT_LABELS = {
  en: { watchLive: 'WATCH LIVE', follow: 'FOLLOW', joinServer: 'JOIN SERVER', joinChannel: 'JOIN CHANNEL' },
  ar: { watchLive: 'شاهد البث',  follow: 'تابع',   joinServer: 'ادخل السيرفر', joinChannel: 'انضم للقناة' },
};

function Channels({ isLive }) {
  const { t, lang } = useContext(LangContext);
  const labels = PLAT_LABELS[lang] || PLAT_LABELS.en;
  return (
    <section className="platforms" id="channels">
      <SectionHeader icon={<Icon.Play/>} label={t.connectTag} number="02"/>
      <div className="plat-title-wrap">
        <h2 className="h2 plat-title reveal">{t.followEverywhere1} <span className="red">{t.followEverywhere2}</span></h2>
        <p className="plat-sub mono small muted reveal reveal--fade">{t.allChannels}</p>
      </div>
      <div className="plat-grid">
        {PLATFORMS.map((p, i) => {
          const IconComp = Icon[p.icon];
          const isKick = p.key === 'kick';
          const showLive = isKick && isLive;
          return (
            <a
              key={p.key}
              href={LINKS[p.key]}
              target="_blank"
              rel="noopener noreferrer"
              className={`plat-card reveal ${i % 3 === 0 ? 'reveal--left' : i % 3 === 1 ? 'reveal--zoom' : 'reveal--right'} ${showLive?'plat-card--live':''}`}
              data-hover
              {...(isKick ? { 'data-kick-preview': '' } : {})}
              style={{'--platcol': PLAT_COLORS[p.key], transitionDelay: `${i*0.08}s`}}
              onMouseEnter={() => window.__playHover?.()}
              onClick={() => window.__playClick?.()}
            >
              {showLive && (
                <div className="plat-card__live">
                  <span className="live-dot"></span>
                  <span className="mono">{t.live}</span>
                </div>
              )}
              <div className="plat-card__bg"></div>
              <div className="plat-card__inner">
                <div className="plat-card__icon"><IconComp/></div>
                <div className="plat-card__meta">
                  <div className="mono small muted">{labels[p.labelKey]}</div>
                  <div className="plat-card__name">{p.name}</div>
                  <div className="mono small plat-card__handle">{HANDLES[p.key]}</div>
                </div>
                <div className="plat-card__arrow"><Icon.Arrow/></div>
              </div>
              <div className="plat-card__corner tl"></div>
              <div className="plat-card__corner br"></div>
            </a>
          );
        })}
      </div>
    </section>
  );
}

// ── CHANNELS MARQUEE ───────────────────────────────────────────
function ChannelsMarquee() {
  const { t } = useContext(LangContext);
  const group = (keyPrefix) => PLATFORMS.map((it, i) => {
    const IC = Icon[it.icon];
    return (
      <a key={`${keyPrefix}-${i}`} href={LINKS[it.key]} target="_blank" rel="noopener noreferrer" className="marq-item" data-hover onMouseEnter={()=>window.__playHover?.()}>
        <span className="marq-item__ic"><IC/></span>
        <span className="marq-item__name">{it.name}</span>
        <span className="marq-sep">◆</span>
      </a>
    );
  });
  return (
    <section className="plat-marquee-wrap reveal">
      <div className="plat-marquee-label mono">
        <span className="plat-marquee-label__line"></span>
        <span>{t.mySocials}</span>
        <span className="plat-marquee-label__line"></span>
      </div>
      <div className="plat-marquee">
        <div className="plat-marquee__track">
          {group('a')}{group('b')}{group('c')}
        </div>
      </div>
    </section>
  );
}

// ── COMMUNITY / CONTACT ────────────────────────────────────────
function Contact() {
  const { t } = useContext(LangContext);
  return (
    <section className="contact" id="contact">
      <SectionHeader icon={<Icon.Discord/>} label={t.businessTag} number="03"/>
      <div className="contact__inner reveal reveal--zoom"
           onMouseMove={(e) => {
             const el = e.currentTarget;
             const r = el.getBoundingClientRect();
             el.style.setProperty('--mx', ((e.clientX - r.left) / r.width) * 100 + '%');
             el.style.setProperty('--my', ((e.clientY - r.top) / r.height) * 100 + '%');
           }}>
        <div className="contact__left">
          <div className="contact__photo">
            <Brandmark className="contact__brand" />
            <div className="contact__photo-corner tl"></div>
            <div className="contact__photo-corner tr"></div>
            <div className="contact__photo-corner bl"></div>
            <div className="contact__photo-corner br"></div>
          </div>
        </div>
        <div className="contact__right">
          <h2 className="h2 reveal" style={{ transitionDelay: '.1s' }}>{t.wantTo} <span className="red">{t.collab}</span>?</h2>
          <p className="bio__lead reveal reveal--fade" style={{ transitionDelay: '.22s' }}>{t.collabDesc}</p>
          <div className="contact__cta reveal reveal--zoom" style={{ transitionDelay: '.34s' }}>
            <a href={LINKS.discord} target="_blank" rel="noopener noreferrer" className="btn btn--primary" data-hover onMouseEnter={()=>window.__playHover?.()} onClick={()=>window.__playClick?.()}>
              <Icon.Discord/><span>{t.joinDiscord}</span>
            </a>
            <a href={LINKS.whatsapp} target="_blank" rel="noopener noreferrer" className="btn btn--ghost" data-hover onMouseEnter={()=>window.__playHover?.()} onClick={()=>window.__playClick?.()}>
              <Icon.WhatsApp/><span>{t.joinWhatsapp}</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── FOOTER ─────────────────────────────────────────────────────
function Footer() {
  const { t } = useContext(LangContext);
  const scrollTop = (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  return (
    <footer className="footer">
      <span className="footer__top-accent" aria-hidden="true"></span>
      <div className="footer__bar">
        <div className="footer__left">
          <div className="footer__copy mono reveal reveal--fade">{t.copyright}</div>
          <span className="footer__sep" aria-hidden="true"></span>
          <a
            href="https://mohamedmavis.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="dev-credit reveal reveal--fade"
            style={{ transitionDelay: '.15s' }}
            data-hover
            onMouseEnter={() => window.__playHover?.()}
          >
            <span className="dev-credit__label mono">{t.devBy}</span>
            <span className="dev-credit__name">MaviS</span>
            <span className="dev-credit__arrow"><Icon.Arrow/></span>
          </a>
        </div>
        <a
          href="#top"
          className="footer__back reveal reveal--fade"
          style={{ transitionDelay: '.3s' }}
          data-hover
          onClick={scrollTop}
          onMouseEnter={() => window.__playHover?.()}
        >
          <span>{t.backTop}</span>
          <span className="footer__back-ic"><Icon.Arrow/></span>
        </a>
      </div>
    </footer>
  );
}

Object.assign(window, { Brandmark, Hero, Bio, Channels, ChannelsMarquee, Contact, Footer });

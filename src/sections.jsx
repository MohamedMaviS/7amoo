const { useContext } = React;

const KICK_USER = '7amoo_69';
const CHANNELS = [
  { key:'kick',      name:'KICK',      handle:'kick.com/7amoo_69',        url:'https://kick.com/7amoo_69',                                  color:'#53fc18', icon:'Kick' },
  { key:'tiktok',    name:'TIKTOK',    handle:'@hamo_eldiesel',           url:'https://www.tiktok.com/@hamo_eldiesel',                      color:'#ff3e6a', icon:'TikTok' },
  { key:'instagram', name:'INSTAGRAM', handle:'@7amo0_69',                url:'https://www.instagram.com/7amo0_69',                         color:'#e1306c', icon:'Instagram' },
  { key:'discord',   name:'DISCORD',   handle:'discord.gg/fgas9B2wv2',    url:'https://discord.gg/fgas9B2wv2',                              color:'#5865f2', icon:'Discord' },
  { key:'whatsapp',  name:'WHATSAPP',  handle:'Official channel',         url:'https://whatsapp.com/channel/0029VbCG8yeGU3BLMmKebm0T',      color:'#25d366', icon:'WhatsApp' },
];

const LOGO_FALLBACK = "data:image/svg+xml;utf8," + encodeURIComponent(
  "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 600'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='#eafff0'/><stop offset='.55' stop-color='#2bff88'/><stop offset='1' stop-color='#00b25a'/></linearGradient><radialGradient id='b' cx='.5' cy='.45' r='.6'><stop offset='0' stop-color='#0c2417'/><stop offset='1' stop-color='#070b08'/></radialGradient></defs><rect width='600' height='600' fill='url(#b)'/><circle cx='300' cy='300' r='210' fill='none' stroke='#2bff88' stroke-opacity='.3' stroke-width='3'/><text x='50%' y='56%' font-family='Arial Black,Impact,sans-serif' font-size='340' font-weight='900' fill='url(#g)' text-anchor='middle' dominant-baseline='middle'>7</text></svg>"
);
function Logo({ className, v, lazy }) {
  const base = v===3 ? 'assets/squad' : v===2 ? 'assets/logo2' : 'assets/logo';
  return <img src={base+'.webp'} alt="7amoo" className={className}
    decoding="async" loading={lazy ? 'lazy' : 'eager'}
    onError={(e)=>{ const s=e.currentTarget;
      if(/\.webp$/.test(s.src)) s.src=base+'.jpg';
      else if(s.src.indexOf('data:')!==0) s.src=LOGO_FALLBACK; }} />;
}

function SecHead({ tag, children }) {
  return (
    <div className="sec__head">
      <div className="tag rv">{tag}</div>
      <h2 className="h-sec rv" style={{transitionDelay:'.08s'}}>{children}</h2>
    </div>
  );
}

/* ---------------- HERO ---------------- */
function Hero({ isLive }) {
  const { t } = useContext(LangContext);
  return (
    <header className="hero">
      <div className="app-pad hero__grid">
        <div className="hero__copy">
          <div className="tag hero__kick rv">{t.heroKicker}</div>
          <h1 className="hero__name rv" style={{transitionDelay:'.05s'}}>7amoo</h1>
          <div className="hero__sub rv" style={{transitionDelay:'.12s'}}>{t.navAbout==='About'?'GAMER · STREAMER':'جيمر · ستريمر'}</div>
          <p className="lead rv" style={{transitionDelay:'.18s'}}>{t.heroTagline}</p>
          <div className="hero__cta rv" style={{transitionDelay:'.24s'}}>
            <a className="btn btn-primary" href={`https://kick.com/${KICK_USER}`} target="_blank" rel="noopener noreferrer"
               data-kpv onMouseEnter={()=>window.__hover?.()} onClick={()=>window.__click?.()}>
              <Icon.Kick/><span>{t.heroWatch}</span>
            </a>
            <a className="btn btn-ghost" href="#channels" onMouseEnter={()=>window.__hover?.()} onClick={()=>window.__click?.()}>
              <Icon.Bolt/><span>{t.heroChannels}</span>
            </a>
          </div>
        </div>

        <div className="hero__art rv rv-s" style={{transitionDelay:'.15s'}} data-tilt="9">
          <span className="hero__ring" aria-hidden="true"></span>
          <span className="hero__art-glow" aria-hidden="true"></span>
          <div className="hero__frame"><Logo v={3}/></div>
          <a className="hero__badge" data-live={isLive} href={`https://kick.com/${KICK_USER}`} target="_blank" rel="noopener noreferrer" data-kpv onMouseEnter={()=>window.__hover?.()}>
            <span className="dot"></span><span>{isLive ? t.live : t.offline}</span>
          </a>
        </div>
      </div>
      <a className="scrollcue" href="#channels" aria-label={t.scroll}
         onMouseEnter={()=>window.__hover?.()} onClick={()=>window.__click?.()}>
        <span className="scrollcue__lab">{t.scroll}</span>
        <span className="scrollcue__mouse"><i></i></span>
        <span className="scrollcue__chev"></span>
      </a>
    </header>
  );
}

/* ---------------- CHANNEL HUB ---------------- */
function Channels({ isLive }) {
  const { t } = useContext(LangContext);
  return (
    <section className="sec" id="channels">
      <div className="app-pad">
        <SecHead tag={t.navChannels}>
          <span className="rv">{t.chTitleA}</span><br/>
          <span style={{color:'var(--ac)'}} className="rv">{t.chTitleB}</span>
        </SecHead>
        <p className="lead rv" style={{marginBottom:'40px'}}>{t.chSub}</p>
        <div className="hub">
          {CHANNELS.map((c,i)=>{
            const IC = Icon[c.icon];
            const kick = c.key==='kick';
            const showLive = kick && isLive;
            return (
              <a key={c.key} className="row rv" href={c.url} target="_blank" rel="noopener noreferrer"
                 data-tilt="5" style={{'--pc':c.color, transitionDelay:`${i*0.07}s`}}
                 {...(kick?{'data-kpv':''}:{})}
                 onMouseEnter={()=>window.__hover?.()} onClick={()=>window.__click?.()}>
                {showLive && <span className="row__live"><span className="dot"></span>{t.live}</span>}
                <span className="row__tok"><IC/></span>
                <span className="row__mid">
                  <div className="row__name">{c.name}</div>
                  <div className="row__handle">{c.handle}</div>
                </span>
                <span className="row__act">
                  <span className="row__act-txt">{t.act[c.key]}</span>
                  <span className="row__arrow"><Icon.Arrow/></span>
                </span>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ---------------- ABOUT ---------------- */
function About() {
  const { t } = useContext(LangContext);
  const mq = [...t.marquee, ...t.marquee];
  return (
    <section className="sec" id="about">
      <div className="app-pad about__grid">
        <div className="about__art rv rv-s" data-tilt="7">
          <span className="about__art-glow" aria-hidden="true"></span>
          <Logo v={2} lazy/>
        </div>
        <div className="about__copy">
          <div className="tag rv">{t.aboutTag}</div>
          <div className="about__title rv" style={{transitionDelay:'.06s'}}>{t.aboutTitle}</div>
          <p className="lead rv" style={{transitionDelay:'.12s'}}>{t.aboutBody}</p>
          <div className="tags rv" style={{transitionDelay:'.18s'}}>
            {t.tags.map(x=> <span key={x}>{x}</span>)}
          </div>
        </div>
      </div>
      <div className="app-pad">
        <div className="mq">
          <div className="mq__track">
            <i>{mq.map((w,i)=><React.Fragment key={i}>{w}<b>◆</b></React.Fragment>)}</i>
            <i aria-hidden="true">{mq.map((w,i)=><React.Fragment key={'b'+i}>{w}<b>◆</b></React.Fragment>)}</i>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- COMMUNITY ---------------- */
function Community() {
  const { t } = useContext(LangContext);
  const D = CHANNELS.find(c=>c.key==='discord');
  const W = CHANNELS.find(c=>c.key==='whatsapp');
  return (
    <section className="sec" id="community">
      <div className="app-pad">
        <SecHead tag={t.commTag}>{t.commTitle}</SecHead>
        <p className="lead rv" style={{marginBottom:'40px'}}>{t.commBody}</p>
        <div className="comm__grid">
          <div className="panel rv rv-l" data-tilt="6" style={{'--pc':D.color}}>
            <span className="panel__ic"><Icon.Discord/></span>
            <h3>Discord</h3>
            <p>{t.navAbout==='About'?'Real-time chat, stream pings, clips and giveaways with the squad.':'شات لايف، تنبيهات أول ما البث يبدأ، كليبات وجوايز مع العيلة.'}</p>
            <a className="btn btn-primary" href={D.url} target="_blank" rel="noopener noreferrer"
               style={{background:D.color,borderColor:D.color}}
               onMouseEnter={()=>window.__hover?.()} onClick={()=>window.__click?.()}>
              <Icon.Discord/><span>{t.discordCta}</span>
            </a>
          </div>
          <div className="panel rv rv-r" data-tilt="6" style={{'--pc':W.color}}>
            <span className="panel__ic"><Icon.WhatsApp/></span>
            <h3>WhatsApp</h3>
            <p>{t.navAbout==='About'?'Follow the official channel so you never miss a go-live.':'تابِع القناة الرسمية علشان عمرك ما تفوّت لايف.'}</p>
            <a className="btn btn-primary" href={W.url} target="_blank" rel="noopener noreferrer"
               style={{background:W.color,borderColor:W.color}}
               onMouseEnter={()=>window.__hover?.()} onClick={()=>window.__click?.()}>
              <Icon.WhatsApp/><span>{t.whatsappCta}</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- FOOTER ---------------- */
function Footer() {
  const { t } = useContext(LangContext);
  const top = (e)=>{ e.preventDefault(); window.scrollTo({top:0,behavior:'smooth'}); };
  return (
    <footer className="footer">
      <div className="footer__ghost" aria-hidden="true">7amoo</div>
      <div className="app-pad footer__in">
        <div className="footer__tag rv">{t.footTagline}</div>
        <div className="footer__soc rv" style={{transitionDelay:'.08s'}}>
          {CHANNELS.map(c=>{ const IC=Icon[c.icon]; return (
            <a key={c.key} href={c.url} target="_blank" rel="noopener noreferrer" aria-label={c.name}
               onMouseEnter={()=>window.__hover?.()}><IC/></a>
          );})}
        </div>
        <a className="credit rv" href="https://mohamedmavis.com/" target="_blank" rel="noopener noreferrer"
           style={{transitionDelay:'.14s'}} onMouseEnter={()=>window.__hover?.()} aria-label="MaviS, mohamedmavis.com">
          <span className="credit__ring" aria-hidden="true"></span>
          <span className="credit__mk"><Icon.Bolt/></span>
          <span className="credit__txt">
            <b>MaviS</b>
            <small>mohamedmavis.com</small>
          </span>
          <span className="credit__go"><Icon.Arrow/></span>
        </a>
        <div className="footer__bottom">
          <span>{t.rights}</span>
          <a href="#top" onClick={top} onMouseEnter={()=>window.__hover?.()}>{t.backTop} ↑</a>
        </div>
      </div>
    </footer>
  );
}

Object.assign(window, { Logo, Hero, Channels, About, Community, Footer });

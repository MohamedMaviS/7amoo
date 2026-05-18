function TweaksPanel({ tw, set, open, onClose }) {
  if (!open) return null;
  const { t } = React.useContext(LangContext);
  const themes = [
    { k:'volt',  c:'#2bff88', bg:'linear-gradient(135deg,#070b08,#0e1810)' },
    { k:'abyss', c:'#1ee0c4', bg:'linear-gradient(135deg,#04080a,#082018)' },
    { k:'acid',  c:'#b6ff2e', bg:'linear-gradient(135deg,#080a05,#1a2206)' },
    { k:'light', c:'#00b25a', bg:'linear-gradient(135deg,#eef3ec,#d6e2d6)' },
  ];
  const accents = ['#2bff88','#39ff6a','#53fc18','#b6ff2e','#1ee0c4','#00e0ff','#ffd400','#ff7a00','#ff3e6a','#a855f7'];
  return (
    <div className="tw">
      <div className="tw__hd"><span>{t.twTitle}</span><button className="tw__x" onClick={onClose} aria-label="Close">✕</button></div>
      <div className="tw__bd">
        <div className="tw__row">
          <span className="tw__lab">{t.twLang}</span>
          <div className="seg">
            <button className={tw.lang==='en'?'on':''} onClick={()=>set('lang','en')}>English</button>
            <button className={tw.lang==='ar'?'on':''} onClick={()=>set('lang','ar')}>عربي</button>
          </div>
        </div>
        <div className="tw__row">
          <span className="tw__lab">{t.twTheme}</span>
          <div className="themes">
            {themes.map(th=>(
              <button key={th.k} className={tw.theme===th.k?'on':''}
                onClick={()=>{ set('theme',th.k); set('accent',th.c); }}>
                <i style={{background:th.bg,boxShadow:`inset 0 0 0 1px ${th.c}66`}}></i>{th.k.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
        <div className="tw__row">
          <span className="tw__lab">{t.twAccent}</span>
          <div className="sw">
            {accents.map(a=>(
              <button key={a} className={tw.accent===a?'on':''} style={{background:a}}
                onClick={()=>set('accent',a)} aria-label={a}/>
            ))}
          </div>
        </div>
        <div className="tw__row">
          <span className="tw__lab">{t.twFx}</span>
          <div className="seg">
            {['low','normal','high'].map(f=>(
              <button key={f} className={tw.fx===f?'on':''} onClick={()=>set('fx',f)}>
                {f==='low'?'Low':f==='normal'?'Mid':'High'}
              </button>
            ))}
          </div>
        </div>
        <div className="tw__row">
          <span className="tw__lab">{t.twSound}</span>
          <div className="seg">
            <button className={tw.sound?'on':''} onClick={()=>set('sound',true)}>On</button>
            <button className={!tw.sound?'on':''} onClick={()=>set('sound',false)}>Off</button>
          </div>
        </div>
      </div>
    </div>
  );
}
window.TweaksPanel = TweaksPanel;

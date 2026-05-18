function TweaksPanel({ tweaks, setTweak, visible, onClose }) {
  if (!visible) return null;
  const { t } = React.useContext(LangContext);

  // Accent color-changer — greens first, then the full spectrum.
  const swatches = [
    '#00e676', '#00ff88', '#53fc18', '#aaff00',
    '#00e0ff', '#ffd400', '#ff6b00', '#ff1f3d',
    '#ff3ea5', '#b300ff',
  ];

  // Theme presets — green-led, plus a clean light mode.
  const themes = [
    { key: 'neon',   label: 'NEON',   accent: '#00e676', bg: 'linear-gradient(135deg,#04100a,#0a2417)' },
    { key: 'matrix', label: 'MATRIX', accent: '#00ff88', bg: 'linear-gradient(135deg,#020a06,#061f12)' },
    { key: 'toxic',  label: 'TOXIC',  accent: '#aaff00', bg: 'linear-gradient(135deg,#0a0f02,#1a2400)' },
    { key: 'light',  label: 'LIGHT',  accent: '#00b25a', bg: 'linear-gradient(135deg,#f1f6f1,#dde9df)' },
  ];
  const pickTheme = (th) => {
    setTweak('theme', th.key);
    setTweak('accent', th.accent);
  };

  return (
    <div className="tweaks">
      <div className="tweaks__header">
        <div className="mono">{t?.tweaksTitle || 'CUSTOMIZE'}</div>
        {onClose && <button className="tweaks__close" onClick={onClose} data-hover>✕</button>}
      </div>
      <div className="tweaks__body">
        <Row label="LANGUAGE / اللغة">
          <Seg opts={[['en','English'],['ar','عربي']]} val={tweaks.lang} onChange={v=>setTweak('lang',v)}/>
        </Row>
        <Row label="THEME">
          <div className="tw-themes">
            {themes.map(th => (
              <button
                key={th.key}
                className={`tw-theme ${tweaks.theme===th.key?'is-active':''}`}
                onClick={()=>pickTheme(th)}
                data-hover
              >
                <span className="tw-theme__swatch" style={{background: th.bg, boxShadow: `inset 0 0 0 1px ${th.accent}66`}}></span>
                {th.label}
              </button>
            ))}
          </div>
        </Row>
        <Row label="ACCENT COLOR">
          <div className="tweak-swatches">
            {swatches.map(c => (
              <button key={c} className={`tw-swatch ${tweaks.accent===c?'is-active':''}`} style={{background:c}} onClick={()=>setTweak('accent',c)} data-hover aria-label={`Accent ${c}`}/>
            ))}
          </div>
        </Row>
        <Row label="FX DENSITY"><Seg opts={[['low','Low'],['normal','Normal'],['high','High']]} val={tweaks.density} onChange={v=>setTweak('density',v)}/></Row>
        <Row label="HOVER SFX"><Seg opts={[[true,'On'],[false,'Off']]} val={tweaks.soundOnHover} onChange={v=>setTweak('soundOnHover',v)}/></Row>
      </div>
    </div>
  );
}
function Row({ label, children }) {
  return <div className="tweak-row"><div className="mono small muted tweak-row__label">{label}</div><div className="tweak-row__ctl">{children}</div></div>;
}
function Seg({ opts, val, onChange }) {
  return (
    <div className="seg">
      {opts.map(([k,label]) => (
        <button key={String(k)} className={`seg__btn ${val===k?'is-active':''}`} onClick={()=>onChange(k)} data-hover>{label}</button>
      ))}
    </div>
  );
}
window.TweaksPanel = TweaksPanel;

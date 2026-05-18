// compiled from tweaks.jsx — edit the .jsx, run tools/build.js
function TweaksPanel({
  tw,
  set,
  open,
  onClose
}) {
  if (!open) return null;
  const {
    t
  } = React.useContext(LangContext);
  const themes = [{
    k: 'volt',
    c: '#2bff88',
    bg: 'linear-gradient(135deg,#070b08,#0e1810)'
  }, {
    k: 'abyss',
    c: '#1ee0c4',
    bg: 'linear-gradient(135deg,#04080a,#082018)'
  }, {
    k: 'acid',
    c: '#b6ff2e',
    bg: 'linear-gradient(135deg,#080a05,#1a2206)'
  }, {
    k: 'light',
    c: '#00b25a',
    bg: 'linear-gradient(135deg,#eef3ec,#d6e2d6)'
  }];
  const accents = ['#2bff88', '#39ff6a', '#53fc18', '#b6ff2e', '#1ee0c4', '#00e0ff', '#ffd400', '#ff7a00', '#ff3e6a', '#a855f7'];
  return React.createElement("div", {
    className: "tw"
  }, React.createElement("div", {
    className: "tw__hd"
  }, React.createElement("span", null, t.twTitle), React.createElement("button", {
    className: "tw__x",
    onClick: onClose,
    "aria-label": "Close"
  }, "\u2715")), React.createElement("div", {
    className: "tw__bd"
  }, React.createElement("div", {
    className: "tw__row"
  }, React.createElement("span", {
    className: "tw__lab"
  }, t.twLang), React.createElement("div", {
    className: "seg"
  }, React.createElement("button", {
    className: tw.lang === 'en' ? 'on' : '',
    onClick: () => set('lang', 'en')
  }, "English"), React.createElement("button", {
    className: tw.lang === 'ar' ? 'on' : '',
    onClick: () => set('lang', 'ar')
  }, "\u0639\u0631\u0628\u064A"))), React.createElement("div", {
    className: "tw__row"
  }, React.createElement("span", {
    className: "tw__lab"
  }, t.twTheme), React.createElement("div", {
    className: "themes"
  }, themes.map(th => React.createElement("button", {
    key: th.k,
    className: tw.theme === th.k ? 'on' : '',
    onClick: () => {
      set('theme', th.k);
      set('accent', th.c);
    }
  }, React.createElement("i", {
    style: {
      background: th.bg,
      boxShadow: `inset 0 0 0 1px ${th.c}66`
    }
  }), th.k.toUpperCase())))), React.createElement("div", {
    className: "tw__row"
  }, React.createElement("span", {
    className: "tw__lab"
  }, t.twAccent), React.createElement("div", {
    className: "sw"
  }, accents.map(a => React.createElement("button", {
    key: a,
    className: tw.accent === a ? 'on' : '',
    style: {
      background: a
    },
    onClick: () => set('accent', a),
    "aria-label": a
  })))), React.createElement("div", {
    className: "tw__row"
  }, React.createElement("span", {
    className: "tw__lab"
  }, t.twFx), React.createElement("div", {
    className: "seg"
  }, ['low', 'normal', 'high'].map(f => React.createElement("button", {
    key: f,
    className: tw.fx === f ? 'on' : '',
    onClick: () => set('fx', f)
  }, f === 'low' ? 'Low' : f === 'normal' ? 'Mid' : 'High')))), React.createElement("div", {
    className: "tw__row"
  }, React.createElement("span", {
    className: "tw__lab"
  }, t.twSound), React.createElement("div", {
    className: "seg"
  }, React.createElement("button", {
    className: tw.sound ? 'on' : '',
    onClick: () => set('sound', true)
  }, "On"), React.createElement("button", {
    className: !tw.sound ? 'on' : '',
    onClick: () => set('sound', false)
  }, "Off")))));
}
window.TweaksPanel = TweaksPanel;

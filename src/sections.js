// compiled from sections.jsx — edit the .jsx, run tools/build.js
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const {
  useContext
} = React;
const KICK_USER = '7amoo_69';
const CHANNELS = [{
  key: 'kick',
  name: 'KICK',
  handle: 'kick.com/7amoo_69',
  url: 'https://kick.com/7amoo_69',
  color: '#53fc18',
  icon: 'Kick'
}, {
  key: 'tiktok',
  name: 'TIKTOK',
  handle: '@hamo_eldiesel',
  url: 'https://www.tiktok.com/@hamo_eldiesel',
  color: '#ff3e6a',
  icon: 'TikTok'
}, {
  key: 'instagram',
  name: 'INSTAGRAM',
  handle: '@7amo0_69',
  url: 'https://www.instagram.com/7amo0_69',
  color: '#e1306c',
  icon: 'Instagram'
}, {
  key: 'discord',
  name: 'DISCORD',
  handle: 'discord.gg/fgas9B2wv2',
  url: 'https://discord.gg/fgas9B2wv2',
  color: '#5865f2',
  icon: 'Discord'
}, {
  key: 'whatsapp',
  name: 'WHATSAPP',
  handle: 'Official channel',
  url: 'https://whatsapp.com/channel/0029VbCG8yeGU3BLMmKebm0T',
  color: '#25d366',
  icon: 'WhatsApp'
}];
const LOGO_FALLBACK = "data:image/svg+xml;utf8," + encodeURIComponent("<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 600'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='#eafff0'/><stop offset='.55' stop-color='#2bff88'/><stop offset='1' stop-color='#00b25a'/></linearGradient><radialGradient id='b' cx='.5' cy='.45' r='.6'><stop offset='0' stop-color='#0c2417'/><stop offset='1' stop-color='#070b08'/></radialGradient></defs><rect width='600' height='600' fill='url(#b)'/><circle cx='300' cy='300' r='210' fill='none' stroke='#2bff88' stroke-opacity='.3' stroke-width='3'/><text x='50%' y='56%' font-family='Arial Black,Impact,sans-serif' font-size='340' font-weight='900' fill='url(#g)' text-anchor='middle' dominant-baseline='middle'>7</text></svg>");
function Logo({
  className,
  v
}) {
  return React.createElement("img", {
    src: v === 2 ? 'assets/logo2.jpg' : 'assets/logo.jpg',
    alt: "7amoo",
    className: className,
    loading: "eager",
    onError: e => {
      if (e.currentTarget.src.indexOf(LOGO_FALLBACK) !== 0) e.currentTarget.src = LOGO_FALLBACK;
    }
  });
}
function SecHead({
  tag,
  children
}) {
  return React.createElement("div", {
    className: "sec__head"
  }, React.createElement("div", {
    className: "tag rv"
  }, tag), React.createElement("h2", {
    className: "h-sec rv",
    style: {
      transitionDelay: '.08s'
    }
  }, children));
}
function Hero({
  isLive
}) {
  const {
    t
  } = useContext(LangContext);
  return React.createElement("header", {
    className: "hero"
  }, React.createElement("div", {
    className: "app-pad hero__grid"
  }, React.createElement("div", {
    className: "hero__copy"
  }, React.createElement("div", {
    className: "tag hero__kick rv"
  }, t.heroKicker), React.createElement("h1", {
    className: "hero__name rv",
    style: {
      transitionDelay: '.05s'
    }
  }, "7amoo"), React.createElement("div", {
    className: "hero__sub rv",
    style: {
      transitionDelay: '.12s'
    }
  }, t.navAbout === 'About' ? 'GAMER · STREAMER' : 'جيمر · ستريمر'), React.createElement("p", {
    className: "lead rv",
    style: {
      transitionDelay: '.18s'
    }
  }, t.heroTagline), React.createElement("div", {
    className: "hero__cta rv",
    style: {
      transitionDelay: '.24s'
    }
  }, React.createElement("a", {
    className: "btn btn-primary",
    href: `https://kick.com/${KICK_USER}`,
    target: "_blank",
    rel: "noopener noreferrer",
    "data-kpv": true,
    onMouseEnter: () => window.__hover?.(),
    onClick: () => window.__click?.()
  }, React.createElement(Icon.Kick, null), React.createElement("span", null, t.heroWatch)), React.createElement("a", {
    className: "btn btn-ghost",
    href: "#channels",
    onMouseEnter: () => window.__hover?.(),
    onClick: () => window.__click?.()
  }, React.createElement(Icon.Bolt, null), React.createElement("span", null, t.heroChannels)))), React.createElement("div", {
    className: "hero__art rv rv-s",
    style: {
      transitionDelay: '.15s'
    },
    "data-tilt": "9"
  }, React.createElement("span", {
    className: "hero__ring",
    "aria-hidden": "true"
  }), React.createElement("span", {
    className: "hero__art-glow",
    "aria-hidden": "true"
  }), React.createElement("div", {
    className: "hero__frame"
  }, React.createElement(Logo, null)), React.createElement("a", {
    className: "hero__badge",
    "data-live": isLive,
    href: `https://kick.com/${KICK_USER}`,
    target: "_blank",
    rel: "noopener noreferrer",
    "data-kpv": true,
    onMouseEnter: () => window.__hover?.()
  }, React.createElement("span", {
    className: "dot"
  }), React.createElement("span", null, isLive ? t.live : t.offline)))), React.createElement("div", {
    className: "scrollcue"
  }, React.createElement("span", null, t.scroll), React.createElement("i", null)));
}
function Channels({
  isLive
}) {
  const {
    t
  } = useContext(LangContext);
  return React.createElement("section", {
    className: "sec",
    id: "channels"
  }, React.createElement("div", {
    className: "app-pad"
  }, React.createElement(SecHead, {
    tag: t.navChannels
  }, React.createElement("span", {
    className: "rv"
  }, t.chTitleA), React.createElement("br", null), React.createElement("span", {
    style: {
      color: 'var(--ac)'
    },
    className: "rv"
  }, t.chTitleB)), React.createElement("p", {
    className: "lead rv",
    style: {
      marginBottom: '40px'
    }
  }, t.chSub), React.createElement("div", {
    className: "hub"
  }, CHANNELS.map((c, i) => {
    const IC = Icon[c.icon];
    const kick = c.key === 'kick';
    const showLive = kick && isLive;
    return React.createElement("a", _extends({
      key: c.key,
      className: "row rv",
      href: c.url,
      target: "_blank",
      rel: "noopener noreferrer",
      "data-tilt": "5",
      style: {
        '--pc': c.color,
        transitionDelay: `${i * 0.07}s`
      }
    }, kick ? {
      'data-kpv': ''
    } : {}, {
      onMouseEnter: () => window.__hover?.(),
      onClick: () => window.__click?.()
    }), showLive && React.createElement("span", {
      className: "row__live"
    }, React.createElement("span", {
      className: "dot"
    }), t.live), React.createElement("span", {
      className: "row__tok"
    }, React.createElement(IC, null)), React.createElement("span", {
      className: "row__mid"
    }, React.createElement("div", {
      className: "row__name"
    }, c.name), React.createElement("div", {
      className: "row__handle"
    }, c.handle)), React.createElement("span", {
      className: "row__act"
    }, React.createElement("span", {
      className: "row__act-txt"
    }, t.act[c.key]), React.createElement("span", {
      className: "row__arrow"
    }, React.createElement(Icon.Arrow, null))));
  }))));
}
function About() {
  const {
    t
  } = useContext(LangContext);
  const mq = [...t.marquee, ...t.marquee];
  return React.createElement("section", {
    className: "sec",
    id: "about"
  }, React.createElement("div", {
    className: "app-pad about__grid"
  }, React.createElement("div", {
    className: "about__art rv rv-s",
    "data-tilt": "7"
  }, React.createElement("span", {
    className: "about__art-glow",
    "aria-hidden": "true"
  }), React.createElement(Logo, {
    v: 2
  })), React.createElement("div", {
    className: "about__copy"
  }, React.createElement("div", {
    className: "tag rv"
  }, t.aboutTag), React.createElement("div", {
    className: "about__title rv",
    style: {
      transitionDelay: '.06s'
    }
  }, t.aboutTitle), React.createElement("p", {
    className: "lead rv",
    style: {
      transitionDelay: '.12s'
    }
  }, t.aboutBody), React.createElement("div", {
    className: "tags rv",
    style: {
      transitionDelay: '.18s'
    }
  }, t.tags.map(x => React.createElement("span", {
    key: x
  }, x))))), React.createElement("div", {
    className: "app-pad"
  }, React.createElement("div", {
    className: "mq"
  }, React.createElement("div", {
    className: "mq__track"
  }, React.createElement("i", null, mq.map((w, i) => React.createElement(React.Fragment, {
    key: i
  }, w, React.createElement("b", null, "\u25C6")))), React.createElement("i", {
    "aria-hidden": "true"
  }, mq.map((w, i) => React.createElement(React.Fragment, {
    key: 'b' + i
  }, w, React.createElement("b", null, "\u25C6"))))))));
}
function Community() {
  const {
    t
  } = useContext(LangContext);
  const D = CHANNELS.find(c => c.key === 'discord');
  const W = CHANNELS.find(c => c.key === 'whatsapp');
  return React.createElement("section", {
    className: "sec",
    id: "community"
  }, React.createElement("div", {
    className: "app-pad"
  }, React.createElement(SecHead, {
    tag: t.commTag
  }, t.commTitle), React.createElement("p", {
    className: "lead rv",
    style: {
      marginBottom: '40px'
    }
  }, t.commBody), React.createElement("div", {
    className: "comm__grid"
  }, React.createElement("div", {
    className: "panel rv rv-l",
    "data-tilt": "6",
    style: {
      '--pc': D.color
    }
  }, React.createElement("span", {
    className: "panel__ic"
  }, React.createElement(Icon.Discord, null)), React.createElement("h3", null, "Discord"), React.createElement("p", null, t.navAbout === 'About' ? 'Real-time chat, stream pings, clips and giveaways with the squad.' : 'شات مباشر، تنبيهات اللايف، كليبات وجوايز مع الفريق.'), React.createElement("a", {
    className: "btn btn-primary",
    href: D.url,
    target: "_blank",
    rel: "noopener noreferrer",
    style: {
      background: D.color,
      borderColor: D.color
    },
    onMouseEnter: () => window.__hover?.(),
    onClick: () => window.__click?.()
  }, React.createElement(Icon.Discord, null), React.createElement("span", null, t.discordCta))), React.createElement("div", {
    className: "panel rv rv-r",
    "data-tilt": "6",
    style: {
      '--pc': W.color
    }
  }, React.createElement("span", {
    className: "panel__ic"
  }, React.createElement(Icon.WhatsApp, null)), React.createElement("h3", null, "WhatsApp"), React.createElement("p", null, t.navAbout === 'About' ? 'Follow the official channel so you never miss a go-live.' : 'تابع القناة الرسمية علشان متفوتش أي لايف.'), React.createElement("a", {
    className: "btn btn-primary",
    href: W.url,
    target: "_blank",
    rel: "noopener noreferrer",
    style: {
      background: W.color,
      borderColor: W.color
    },
    onMouseEnter: () => window.__hover?.(),
    onClick: () => window.__click?.()
  }, React.createElement(Icon.WhatsApp, null), React.createElement("span", null, t.whatsappCta))))));
}
function Footer() {
  const {
    t
  } = useContext(LangContext);
  const top = e => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  return React.createElement("footer", {
    className: "footer"
  }, React.createElement("div", {
    className: "footer__ghost",
    "aria-hidden": "true"
  }, "7amoo"), React.createElement("div", {
    className: "app-pad footer__in"
  }, React.createElement("div", {
    className: "footer__tag rv"
  }, t.footTagline), React.createElement("div", {
    className: "footer__soc rv",
    style: {
      transitionDelay: '.08s'
    }
  }, CHANNELS.map(c => {
    const IC = Icon[c.icon];
    return React.createElement("a", {
      key: c.key,
      href: c.url,
      target: "_blank",
      rel: "noopener noreferrer",
      "aria-label": c.name,
      onMouseEnter: () => window.__hover?.()
    }, React.createElement(IC, null));
  })), React.createElement("a", {
    className: "credit rv",
    href: "https://mohamedmavis.com/",
    target: "_blank",
    rel: "noopener noreferrer",
    style: {
      transitionDelay: '.14s'
    },
    onMouseEnter: () => window.__hover?.(),
    "aria-label": "MaviS, mohamedmavis.com"
  }, React.createElement("span", {
    className: "credit__mk"
  }, React.createElement(Icon.Bolt, null)), React.createElement("b", null, "MaviS"), React.createElement("i", {
    className: "credit__dot"
  }), React.createElement("small", null, "mohamedmavis.com"), React.createElement(Icon.Arrow, null)), React.createElement("div", {
    className: "footer__bottom"
  }, React.createElement("span", null, t.rights), React.createElement("a", {
    href: "#top",
    onClick: top,
    onMouseEnter: () => window.__hover?.()
  }, t.backTop, " \u2191"))));
}
Object.assign(window, {
  Logo,
  Hero,
  Channels,
  About,
  Community,
  Footer
});

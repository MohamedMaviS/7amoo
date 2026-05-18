// i18n — 7amoo (EN default, AR toggle)
const I18N = {
  en: {
    dir:'ltr',
    navAbout:'About', navChannels:'Channels', navCommunity:'Community',
    watchLive:'Watch Live', live:'LIVE NOW', offline:'OFFLINE',

    heroKicker:'GAMER · STREAMER · CONTENT CREATOR',
    heroTagline:'High-energy streams, non-stop gaming, and a community that never logs off.',
    heroWatch:'Watch on Kick',
    heroChannels:'All Channels',
    scroll:'SCROLL',

    chTitleA:'EVERY CHANNEL.',
    chTitleB:'ONE PLACE.',
    chSub:'Pick your platform. The stream never sleeps.',
    act:{ kick:'Watch live', tiktok:'Follow', instagram:'Follow', discord:'Join server', whatsapp:'Join channel' },

    aboutTag:'WHO IS',
    aboutTitle:'7amoo',
    aboutBody:'A rising Egyptian streamer and a lifelong gamer. Fighting games are his home turf, with a deep love for GTA and role-play. High energy, long live sessions, and a community that grows every single day.',
    tags:['FIGHTING GAMES','GTA','ROLE-PLAY','OPEN WORLD','RISING','NO SLEEP'],
    marquee:['RISING STREAMER','FIGHTING GAMES','GTA · RP','GAMER','EGYPT','NO SLEEP'],

    commTag:'THE SQUAD',
    commTitle:'JOIN THE COMMUNITY',
    commBody:'Hop in the Discord and follow the WhatsApp channel for live alerts, clips, and everything 7amoo.',
    discordCta:'Join Discord',
    whatsappCta:'WhatsApp Channel',

    footTagline:'See you in the next stream.',
    rights:'© 2026 7amoo · All rights reserved',
    backTop:'Back to top',

    twTitle:'CUSTOMIZE', twLang:'LANGUAGE', twTheme:'THEME', twAccent:'ACCENT', twFx:'FX LEVEL', twSound:'HOVER SFX',
  },
  ar: {
    dir:'rtl',
    navAbout:'عني', navChannels:'القنوات', navCommunity:'المجتمع',
    watchLive:'شاهد البث', live:'لايف دلوقتي', offline:'أوفلاين',

    heroKicker:'جيمر · ستريمر · صانع محتوى',
    heroTagline:'لايفات بطاقة عالية، جيمنج بلا توقف، ومجتمع مبيهدأش.',
    heroWatch:'تابعني على Kick',
    heroChannels:'كل القنوات',
    scroll:'انزل',

    chTitleA:'كل القنوات.',
    chTitleB:'في مكان واحد.',
    chSub:'اختار منصتك. الستريم مبينامش.',
    act:{ kick:'شاهد البث', tiktok:'تابع', instagram:'تابع', discord:'ادخل السيرفر', whatsapp:'انضم للقناة' },

    aboutTag:'مين هو',
    aboutTitle:'7amoo',
    aboutBody:'ستريمر مصري صاعد وجيمر من زمان. أكتر حاجة بيحبها ألعاب الفايت، وعاشق GTA والرول بلاي. طاقة عالية، لايفات طويلة، ومجتمع بيكبر كل يوم.',
    tags:['ألعاب فايت','GTA','رول بلاي','عالم مفتوح','صاعد','بدون نوم'],
    marquee:['ستريمر صاعد','ألعاب فايت','GTA · رول بلاي','جيمر','مصر','بدون نوم'],

    commTag:'الفريق',
    commTitle:'انضم للمجتمع',
    commBody:'ادخل سيرفر الديسكورد وتابع قناة الواتساب علشان توصلك تنبيهات اللايف والكليبات وكل حاجة عن 7amoo.',
    discordCta:'ادخل الديسكورد',
    whatsappCta:'قناة الواتساب',

    footTagline:'نشوفكم في الستريم الجاي.',
    rights:'© 2026 7amoo · جميع الحقوق محفوظة',
    backTop:'للأعلى',

    twTitle:'تخصيص', twLang:'اللغة', twTheme:'الثيم', twAccent:'اللون', twFx:'المؤثرات', twSound:'صوت',
  }
};
window.I18N = I18N;
const LangContext = React.createContext({ lang:'en', t:I18N.en });
window.LangContext = LangContext;

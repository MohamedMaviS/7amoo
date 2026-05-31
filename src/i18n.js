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

    liveNow:'LIVE NOW', offlineNow:'OFFLINE',
    viewersLbl:'viewers',
    watchKick:'Watch on Kick', watchTiktok:'Watch on TikTok',
    followKick:'Follow on Kick',
    offlineMsg:'Not streaming right now. Follow on Kick to get notified the moment 7amoo goes live.',
    autoRefresh:'Auto-refresh every 55s', refreshNow:'Refresh now',
    titleFallback:'Live on Kick', titleFallbackTk:'Live on TikTok', categoryFallback:'Streaming',
  },
  ar: {
    dir:'rtl',
    navAbout:'عني', navChannels:'القنوات', navCommunity:'العيلة',
    watchLive:'شوف اللايف', live:'لايف دلوقتي', offline:'مش لايف',

    heroKicker:'جيمر · ستريمر · صانع محتوى',
    heroTagline:'لايفات على الآخر، جيمنج مبيوقفش، ومجتمع مبيهدأش.',
    heroWatch:'شوفني على Kick',
    heroChannels:'كل القنوات',
    scroll:'انزل تحت',

    chTitleA:'كل القنوات،',
    chTitleB:'في مكان واحد.',
    chSub:'اختار منصتك، والستريم مبينامش.',
    act:{ kick:'شوف اللايف', tiktok:'تابِع', instagram:'تابِع', discord:'ادخل السيرفر', whatsapp:'ادخل القناة' },

    aboutTag:'مين هو',
    aboutTitle:'7amoo',
    aboutBody:'ستريمر مصري صاعد وجيمر من زمان طويل. عشقه الأول ألعاب الفايت، وبيموت في GTA والرول بلاي. لايفات طويلة، طاقة عالية، ومجتمع بيكبر كل يوم.',
    tags:['ألعاب فايت','GTA','رول بلاي','عالم مفتوح','نجم صاعد','بدون نوم'],
    marquee:['ستريمر صاعد','ألعاب فايت','GTA · رول بلاي','جيمر','مصر','بدون نوم'],

    commTag:'العيلة',
    commTitle:'انضم لعيلة 7amoo',
    commBody:'خُش سيرفر الديسكورد وتابِع قناة الواتساب علشان يوصلك كل لايف وكليب وأخبار 7amoo أول بأول.',
    discordCta:'ادخل الديسكورد',
    whatsappCta:'تابِع على واتساب',

    footTagline:'نشوفكوا في الستريم الجاي.',
    rights:'© 2026 7amoo · كل الحقوق محفوظة',
    backTop:'ارجع فوق',

    twTitle:'تخصيص', twLang:'اللغة', twTheme:'الثيم', twAccent:'اللون', twFx:'المؤثرات', twSound:'الصوت',

    liveNow:'لايف دلوقتي', offlineNow:'مش لايف',
    viewersLbl:'مشاهد',
    watchKick:'شوف اللايف على Kick', watchTiktok:'شوف اللايف على TikTok',
    followKick:'تابعه على Kick',
    offlineMsg:'مش بيبث دلوقتي. تابعه على Kick علشان يجيلك إشعار أول ما يفتح لايف.',
    autoRefresh:'بيتحدث كل ٥٥ ثانية', refreshNow:'حدّث دلوقتي',
    titleFallback:'لايف على Kick', titleFallbackTk:'لايف على TikTok', categoryFallback:'بيبث',
  }
};
window.I18N = I18N;
const LangContext = React.createContext({ lang:'en', t:I18N.en });
window.LangContext = LangContext;
const LiveContext = React.createContext({ isLive:false, title:null, viewers:null, game:null, refresh:()=>{} });
window.LiveContext = LiveContext;

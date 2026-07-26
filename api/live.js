// ============================================================
// /api/live — live-status + stream details (Vercel edge fn)
// ------------------------------------------------------------
// Server-side proxy to Kick/TikTok (CORS-blocked from the browser).
// Returns the live state plus, when on Kick, the title, viewer
// count, and game/category so the front-end can render a rich card.
//
// Shape:
//   {
//     isLive: boolean,
//     platform: 'kick' | 'tiktok',
//     title:   string | null,      // current stream title
//     viewers: number | null,      // current viewer count
//     game:    string | null,      // category / game name
//     started: string | null,      // ISO time the stream went live
//     debug:   { kick: bool|null, tiktok: bool|null }
//   }
// ============================================================

export const config = { runtime: 'edge' };

const KICK_USER = '7amoo';
const TIKTOK_USER = 'hamo_eldiesel';
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36';

async function checkKick() {
  try {
    const r = await fetch(`https://kick.com/api/v2/channels/${KICK_USER}`, {
      headers: {
        'User-Agent': UA,
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'en-US,en;q=0.9',
        'Referer': `https://kick.com/${KICK_USER}`,
      },
      cache: 'no-store',
    });
    if (!r.ok) return null;
    const d = await r.json();
    if (!d || !d.livestream) return { live: false };
    const ls = d.livestream;
    const isLive = (typeof ls.is_live === 'boolean') ? ls.is_live : true;
    if (!isLive) return { live: false };
    return {
      live: true,
      title: typeof ls.session_title === 'string' ? ls.session_title.trim() : null,
      viewers: typeof ls.viewer_count === 'number' ? ls.viewer_count : null,
      game: (ls.categories && ls.categories[0] && typeof ls.categories[0].name === 'string') ? ls.categories[0].name : null,
      started: ls.created_at || ls.start_time || null,
    };
  } catch {
    return null;
  }
}

async function checkTikTok() {
  try {
    const r = await fetch(`https://www.tiktok.com/@${TIKTOK_USER}/live`, {
      headers: {
        'User-Agent': UA,
        'Accept': 'text/html,application/xhtml+xml',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      cache: 'no-store',
    });
    if (!r.ok) return null;
    const html = await r.text();
    if (/liveRoom[\s\S]{0,1200}?"status"\s*:\s*2/i.test(html)) return true;
    if (/"@type"\s*:\s*"BroadcastEvent"/i.test(html)) return true;
    if (/"isLive"\s*:\s*true/i.test(html)) return true;
    return false;
  } catch {
    return null;
  }
}

export default async function handler() {
  const [kick, tiktok] = await Promise.all([checkKick(), checkTikTok()]);

  let isLive = false;
  let platform = 'kick';
  let title = null, viewers = null, game = null, started = null;

  if (kick && kick.live === true) {
    isLive = true; platform = 'kick';
    title = kick.title; viewers = kick.viewers; game = kick.game; started = kick.started;
  } else if (tiktok === true) {
    isLive = true; platform = 'tiktok';
  }

  return new Response(JSON.stringify({
    isLive, platform, title, viewers, game, started,
    debug: { kick: kick ? (kick.live === true) : null, tiktok }
  }), {
    status: 200,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'public, s-maxage=20, stale-while-revalidate=40',
      'access-control-allow-origin': '*',
    },
  });
}

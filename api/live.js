// ============================================================
// /api/live — live-status endpoint (Vercel Edge Function)
// ------------------------------------------------------------
// Browser CORS rules block the site from hitting kick.com /
// tiktok.com directly, so we check here server-side from
// Vercel's IP — no CORS, no quota, no middleman.
//
// Response shape:
//   { isLive: boolean, platform: 'kick' | 'tiktok',
//     debug:  { kick: true|false|null, tiktok: true|false|null } }
//
// null means "could not determine" — the client keeps its
// previous state so a transient upstream blip doesn't flip OFF.
// ============================================================

export const config = { runtime: 'edge' };

const KICK_USER = '7amoo_69';
const TIKTOK_USER = 'hamo_eldiesel';

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36';

// --- Kick: clean JSON API. `livestream` is an object while live, null while offline.
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
    if (d && d.livestream) {
      if (typeof d.livestream.is_live === 'boolean') return d.livestream.is_live;
      return true;
    }
    return false;
  } catch {
    return null;
  }
}

// --- TikTok: no public API. Scrape the /live page for live-only markers.
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
  if (kick === true)        { isLive = true; platform = 'kick';   }
  else if (tiktok === true) { isLive = true; platform = 'tiktok'; }

  return new Response(JSON.stringify({ isLive, platform, debug: { kick, tiktok } }), {
    status: 200,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'public, s-maxage=20, stale-while-revalidate=40',
      'access-control-allow-origin': '*',
    },
  });
}

const JSON_HEADERS = {
  'Content-Type': 'application/json; charset=utf-8',
  'Cache-Control': 'no-store',
};

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (url.pathname === '/api/lead') {
      if (request.method === 'OPTIONS') return new Response(null, { status: 204 });
      if (request.method !== 'POST') return json({ error: 'Method not allowed.' }, 405);
      return captureLead(request, env, ctx);
    }

    const response = await env.ASSETS.fetch(request);
    return addSecurityHeaders(response);
  },
};

async function captureLead(request, env, ctx) {
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Invalid request.' }, 400);
  }

  // Honeypot: bots tend to fill this hidden field.
  if (typeof body.company === 'string' && body.company.trim()) {
    return json({ ok: true, id: crypto.randomUUID() }, 200);
  }

  const firstName = cleanText(body.firstName, 60);
  const email = cleanEmail(body.email);
  const weakestCategory = cleanText(body.weakestCategory, 80);
  const source = cleanText(body.source, 500) || 'direct';
  const medium = cleanText(body.medium, 120);
  const campaign = cleanText(body.campaign, 200);
  const content = cleanText(body.content, 200);
  const term = cleanText(body.term, 200);
  const landingPage = cleanText(body.landingPage, 1000);
  const quickScore = normalizeScore(body.quickScore);

  if (!firstName) return json({ error: 'Please enter your first name.' }, 400);
  if (!email) return json({ error: 'Please enter a valid email address.' }, 400);
  if (body.consent !== true) return json({ error: 'Consent is required.' }, 400);

  const id = crypto.randomUUID();
  const now = new Date().toISOString();
  const ip = request.headers.get('CF-Connecting-IP') || '';
  const userAgent = cleanText(request.headers.get('User-Agent'), 500);
  const country = cleanText(request.headers.get('CF-IPCountry'), 2);

  try {
    await env.DB.prepare(`
      INSERT INTO leads (
        id, email, first_name, quick_score, weakest_category,
        source, medium, campaign, content, term, landing_page,
        country, user_agent, consent_at, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(email) DO UPDATE SET
        first_name = excluded.first_name,
        quick_score = excluded.quick_score,
        weakest_category = excluded.weakest_category,
        source = excluded.source,
        medium = excluded.medium,
        campaign = excluded.campaign,
        content = excluded.content,
        term = excluded.term,
        landing_page = excluded.landing_page,
        country = excluded.country,
        user_agent = excluded.user_agent,
        consent_at = excluded.consent_at,
        updated_at = excluded.updated_at
    `).bind(
      id, email, firstName, quickScore, weakestCategory,
      source, medium, campaign, content, term, landingPage,
      country, userAgent, now, now, now
    ).run();

    await env.DB.prepare(`
      INSERT INTO events (id, email, event_name, event_data, created_at)
      VALUES (?, ?, 'lead_captured', ?, ?)
    `).bind(
      crypto.randomUUID(),
      email,
      JSON.stringify({ quickScore, weakestCategory, source, medium, campaign }),
      now
    ).run();
  } catch (error) {
    console.error('D1 lead capture failed', error);
    return json({ error: 'We could not save your score. Please try again.' }, 500);
  }

  // D1 is the source of truth. Brevo runs in the background and never blocks capture.
  if (env.BREVO_API_KEY) {
    ctx.waitUntil(syncToBrevo(env, { email, firstName, quickScore, weakestCategory, source, campaign }));
  }

  return json({ ok: true, id }, 201);
}

async function syncToBrevo(env, lead) {
  try {
    const listIds = String(env.BREVO_LIST_ID || '')
      .split(',')
      .map((value) => Number.parseInt(value.trim(), 10))
      .filter(Number.isInteger);

    const contactPayload = {
      email: lead.email,
      attributes: { FIRSTNAME: lead.firstName },
      updateEnabled: true,
    };
    if (listIds.length) contactPayload.listIds = listIds;

    const contactResponse = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'api-key': env.BREVO_API_KEY,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(contactPayload),
    });

    if (!contactResponse.ok) {
      console.error('Brevo contact sync failed', contactResponse.status, await contactResponse.text());
      return;
    }

    // Optional confirmation email. Configure either a Brevo template ID or sender details.
    if (env.BREVO_TEMPLATE_ID) {
      const templateId = Number.parseInt(env.BREVO_TEMPLATE_ID, 10);
      if (Number.isInteger(templateId)) {
        await sendBrevoEmail(env, {
          to: [{ email: lead.email, name: lead.firstName }],
          templateId,
          params: {
            FIRSTNAME: lead.firstName,
            READYSCORE: lead.quickScore,
            WEAKESTCATEGORY: lead.weakestCategory,
          },
        });
      }
    } else if (env.BREVO_SENDER_EMAIL) {
      await sendBrevoEmail(env, {
        sender: {
          email: env.BREVO_SENDER_EMAIL,
          name: env.BREVO_SENDER_NAME || 'My Ready Score',
        },
        to: [{ email: lead.email, name: lead.firstName }],
        subject: 'Your My Ready Score has been saved',
        htmlContent: welcomeEmailHtml(lead),
      });
    }
  } catch (error) {
    console.error('Brevo background task failed', error);
  }
}

async function sendBrevoEmail(env, payload) {
  const response = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'api-key': env.BREVO_API_KEY,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(payload),
  });
  if (!response.ok) console.error('Brevo email failed', response.status, await response.text());
}

function welcomeEmailHtml(lead) {
  const name = escapeHtml(lead.firstName);
  const score = Number.isInteger(lead.quickScore) ? `${lead.quickScore}/100` : 'saved';
  return `<!doctype html><html><body style="font-family:Arial,sans-serif;color:#173f38;line-height:1.6"><div style="max-width:600px;margin:auto;padding:28px"><h1 style="font-size:28px">Your Ready Score is saved</h1><p>Hi ${name},</p><p>Thanks for completing the My Ready Score Quick Assessment. Your current score is <strong>${score}</strong>.</p><p>You are now on the early-access list for our comprehensive family preparedness assessment. We will email you when it is ready.</p><p>Prepared, not panicked.</p><p>— The My Ready Score Team</p></div></body></html>`;
}

function addSecurityHeaders(response) {
  const headers = new Headers(response.headers);
  headers.set('X-Content-Type-Options', 'nosniff');
  headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  headers.set('X-Frame-Options', 'SAMEORIGIN');
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
}

function json(value, status = 200) {
  return new Response(JSON.stringify(value), { status, headers: JSON_HEADERS });
}

function cleanText(value, maxLength) {
  if (typeof value !== 'string') return '';
  return value.trim().replace(/[\u0000-\u001F\u007F]/g, '').slice(0, maxLength);
}

function cleanEmail(value) {
  const email = cleanText(value, 254).toLowerCase();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : '';
}

function normalizeScore(value) {
  const score = Number(value);
  return Number.isFinite(score) ? Math.max(0, Math.min(100, Math.round(score))) : null;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]));
}

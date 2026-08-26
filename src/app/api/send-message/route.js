import { NextResponse } from 'next/server';

// Sends the public contact form server-side via Resend, so the message
// reaches the inbox even with browser extensions/ad-blockers that strip
// third-party (EmailJS) client-side requests.

// Resend's free plan caps at 100 emails/day. A simple in-memory per-IP
// window keeps a bot from burning through that on its own - it resets on
// deploy/restart, which is fine for a low-traffic contact form.
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;
const RATE_LIMIT_MAX = 5;
const requestLog = new Map();

function isRateLimited(ip) {
  const now = Date.now();
  const timestamps = (requestLog.get(ip) || []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  timestamps.push(now);
  requestLog.set(ip, timestamps);
  return timestamps.length > RATE_LIMIT_MAX;
}

export async function POST(request) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    if (isRateLimited(ip)) {
      return NextResponse.json({ error: 'Too many messages sent. Please try again later.' }, { status: 429 });
    }

    const { name, email, message, company } = await request.json();

    // Honeypot: a real visitor never fills this hidden field in.
    if (company) {
      return NextResponse.json({ success: true });
    }

    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json({ error: 'Name, email and message are required' }, { status: 400 });
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return NextResponse.json({ error: 'Please provide a valid email address' }, { status: 400 });
    }
    if (message.length > 5000) {
      return NextResponse.json({ error: 'Message is too long' }, { status: 400 });
    }

    const apiKey = process.env.RESEND_API_KEY;
    const to = process.env.ADMIN_EMAIL;
    if (!apiKey || !to) {
      console.error('Resend not configured: missing RESEND_API_KEY or ADMIN_EMAIL');
      return NextResponse.json({ error: 'Email sending is not configured' }, { status: 500 });
    }

    const escapeHtml = (str) =>
      str.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: process.env.RESEND_FROM_EMAIL || 'Portfolio Contact <onboarding@resend.dev>',
        to: [to],
        reply_to: email,
        subject: `New Portfolio Contact: ${name}`,
        html: `
          <p><strong>From:</strong> ${escapeHtml(name)} (${escapeHtml(email)})</p>
          <p><strong>Message:</strong></p>
          <p>${escapeHtml(message).replace(/\n/g, '<br />')}</p>
        `,
      }),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      console.error('Resend send failed:', res.status, body);

      // Surface Resend's free-plan caps distinctly so it's obvious in logs
      // what happened (429 = Resend's own rate limit; 422 with a quota
      // message = the 100/day or 3,000/month cap reached).
      if (res.status === 429) {
        return NextResponse.json({ error: 'Too many requests right now. Please try again in a moment.' }, { status: 429 });
      }
      if (res.status === 422 && /quota|limit/i.test(body?.message || '')) {
        console.error('Resend free-tier quota reached (100/day or 3,000/month).');
        return NextResponse.json({ error: 'Message limit reached for today. Please email me directly instead.' }, { status: 429 });
      }

      return NextResponse.json({ error: 'Failed to send message' }, { status: 502 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending contact message:', error);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}

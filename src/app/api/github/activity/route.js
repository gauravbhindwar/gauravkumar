import { NextResponse } from 'next/server';

// Public GitHub activity for the banner + "Recent Activity" section.
// Cached via Next's fetch cache (revalidate below) so this stays well under
// GitHub's unauthenticated 60 req/hour limit no matter how much site
// traffic there is - every visitor within the window hits the cache, not
// the GitHub API.
const REVALIDATE_SECONDS = 1800; // 30 min
const USERNAME = process.env.GITHUB_USERNAME || 'gauravbhindwar';

function githubHeaders() {
  const headers = { Accept: 'application/vnd.github+json' };
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }
  return headers;
}

export async function GET() {
  try {
    const [eventsRes, reposRes] = await Promise.all([
      fetch(`https://api.github.com/users/${USERNAME}/events/public?per_page=30`, {
        headers: githubHeaders(),
        next: { revalidate: REVALIDATE_SECONDS },
      }),
      fetch(`https://api.github.com/users/${USERNAME}/repos?sort=pushed&direction=desc&per_page=10`, {
        headers: githubHeaders(),
        next: { revalidate: REVALIDATE_SECONDS },
      }),
    ]);

    if (!eventsRes.ok || !reposRes.ok) {
      const status = !eventsRes.ok ? eventsRes.status : reposRes.status;
      console.error('GitHub API error:', status);
      return NextResponse.json({ commits: [], repos: [], error: true }, {
        headers: { 'Cache-Control': 's-maxage=300, stale-while-revalidate=600' },
      });
    }

    const events = await eventsRes.json();
    const repos = await reposRes.json();

    // GitHub's public events feed doesn't embed `payload.commits` for every
    // account (varies by push size/settings) - it reliably gives `head`
    // (the resulting SHA) though, so fetch each of those commits directly.
    const pushEvents = (Array.isArray(events) ? events : [])
      .filter((e) => e.type === 'PushEvent' && e.payload?.head)
      .slice(0, 8);

    const commitDetails = await Promise.all(
      pushEvents.map((event) =>
        fetch(`https://api.github.com/repos/${event.repo.name}/commits/${event.payload.head}`, {
          headers: githubHeaders(),
          next: { revalidate: REVALIDATE_SECONDS },
        })
          .then((r) => (r.ok ? r.json() : null))
          .catch(() => null)
      )
    );

    const commits = pushEvents
      .map((event, i) => {
        const detail = commitDetails[i];
        const embedded = event.payload?.commits?.[event.payload.commits.length - 1];
        const message = detail?.commit?.message || embedded?.message;
        if (!message) return null;
        const repoName = event.repo?.name?.split('/')?.[1] || event.repo?.name;
        return {
          repo: repoName,
          repoFull: event.repo?.name,
          sha: event.payload.head.slice(0, 7),
          message: message.split('\n')[0].slice(0, 120),
          url: `https://github.com/${event.repo.name}/commit/${event.payload.head}`,
          date: event.created_at,
        };
      })
      .filter(Boolean);

    const workingOn = (Array.isArray(repos) ? repos : [])
      .filter((r) => !r.fork && !r.archived)
      .slice(0, 6)
      .map((r) => ({
        name: r.name,
        description: r.description || '',
        url: r.html_url,
        language: r.language,
        stars: r.stargazers_count,
        pushedAt: r.pushed_at,
        isPrivate: r.private,
      }));

    return NextResponse.json(
      { commits, repos: workingOn, username: USERNAME, updatedAt: new Date().toISOString() },
      { headers: { 'Cache-Control': 's-maxage=1800, stale-while-revalidate=3600' } }
    );
  } catch (error) {
    console.error('Error fetching GitHub activity:', error);
    return NextResponse.json({ commits: [], repos: [], error: true }, { status: 200 });
  }
}

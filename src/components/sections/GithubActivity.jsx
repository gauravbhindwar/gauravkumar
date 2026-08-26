'use client'

import { FaGithub, FaCodeBranch, FaStar, FaExternalLinkAlt, FaHistory } from 'react-icons/fa'
import useFetch from '@/hooks/useFetch'
import SectionHeading from '@/components/ui/SectionHeading'

function timeAgo(dateString) {
  const seconds = Math.floor((Date.now() - new Date(dateString).getTime()) / 1000)
  const units = [
    ['year', 31536000],
    ['month', 2592000],
    ['day', 86400],
    ['hour', 3600],
    ['minute', 60],
  ]
  for (const [label, secs] of units) {
    const value = Math.floor(seconds / secs)
    if (value >= 1) return `${value} ${label}${value > 1 ? 's' : ''} ago`
  }
  return 'just now'
}

export default function GithubActivity() {
  const { data, loading } = useFetch('/api/github/activity', { revalidate: 1800000 })

  const commits = data?.commits || []
  const repos = data?.repos || []

  if (!loading && commits.length === 0 && repos.length === 0) {
    return null
  }

  return (
    <section id="github-activity" className="py-24 relative">
      <div className="absolute inset-0 bg-base-200/50"></div>

      <div className="container mx-auto px-4 relative">
        <SectionHeading
          icon={FaGithub}
          eyebrow="Live From GitHub"
          title="Recent Activity"
          description={data?.username ? `Straight from github.com/${data.username} — updated every 30 minutes.` : undefined}
        />

        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="animate-pulse bg-base-100 border-4 border-base-content h-80" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Currently Working On */}
            {repos.length > 0 && (
              <div className="bg-base-100 border-4 border-base-content shadow-[8px_8px_0_0_currentColor] p-6 md:p-8">
                <h3 className="text-lg font-display font-bold uppercase tracking-widest text-base-content mb-6 flex items-center gap-3">
                  <FaCodeBranch className="text-primary w-5 h-5" /> Currently Working On
                </h3>
                <div className="space-y-4">
                  {repos.map((repo) => (
                    <a
                      key={repo.name}
                      href={repo.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group block p-4 bg-base-200/40 border-2 border-base-content/10 hover:border-primary transition-all duration-200"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="font-mono font-bold text-base-content group-hover:text-primary transition-colors truncate">
                          {repo.name}
                        </span>
                        <FaExternalLinkAlt className="w-3 h-3 text-base-content/30 shrink-0 group-hover:text-primary transition-colors" />
                      </div>
                      {repo.description && (
                        <p className="text-xs text-base-content/60 mt-1 line-clamp-1">{repo.description}</p>
                      )}
                      <div className="flex items-center gap-4 mt-2 text-[10px] font-mono uppercase tracking-widest text-base-content/40">
                        {repo.language && <span>{repo.language}</span>}
                        {repo.stars > 0 && (
                          <span className="flex items-center gap-1"><FaStar className="w-3 h-3" /> {repo.stars}</span>
                        )}
                        <span>pushed {timeAgo(repo.pushedAt)}</span>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Commits */}
            {commits.length > 0 && (
              <div className="bg-base-100 border-4 border-base-content shadow-[8px_8px_0_0_currentColor] p-6 md:p-8">
                <h3 className="text-lg font-display font-bold uppercase tracking-widest text-base-content mb-6 flex items-center gap-3">
                  <FaHistory className="text-secondary w-5 h-5" /> Recent Commits
                </h3>
                <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                  {commits.map((commit) => (
                    <a
                      key={commit.url}
                      href={commit.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-start gap-3 p-3 border-l-2 border-base-content/10 hover:border-secondary transition-all duration-200"
                    >
                      <span className="font-mono text-[10px] text-base-content/40 shrink-0 mt-0.5">{commit.sha}</span>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm text-base-content group-hover:text-secondary transition-colors truncate">
                          {commit.message}
                        </p>
                        <p className="text-[10px] font-mono uppercase tracking-widest text-base-content/40 mt-1">
                          {commit.repo} · {timeAgo(commit.date)}
                        </p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}

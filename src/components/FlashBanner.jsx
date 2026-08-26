'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { FaGithub, FaTimes } from 'react-icons/fa'
import useFetch from '@/hooks/useFetch'

const DISMISS_KEY = 'flash-last-dismissed-id'

// One hook per source. Each returns either null (nothing to show) or a
// normalized item: { id, date, icon, eyebrow, message, href }.
//
// To add a new source later (a blog, a changelog, whatever) - write a
// matching hook here that fetches its own "latest" endpoint and returns
// the same shape, then add its result to `candidates` in FlashBanner below.
// Everything else (picking the newest one, dismiss-by-id, the banner UI)
// already handles any number of sources.
function useGithubFlash() {
  const { data } = useFetch('/api/github/activity', { revalidate: 1800000 })
  const commit = data?.commits?.[0]
  if (!commit) return null
  return {
    id: `github:${commit.sha}`,
    date: commit.date,
    icon: FaGithub,
    eyebrow: `Just pushed to ${commit.repo}`,
    message: commit.message,
    href: '/#github-activity',
  }
}

// function useBlogFlash() {
//   const { data } = useFetch('/api/blog/latest', { revalidate: 1800000 })
//   const post = data?.posts?.[0]
//   if (!post) return null
//   return {
//     id: `blog:${post.slug}`,
//     date: post.publishedAt,
//     icon: FaNewspaper,
//     eyebrow: 'New blog post',
//     message: post.title,
//     href: `/blog/${post.slug}`,
//   }
// }

export default function FlashBanner() {
  const pathname = usePathname()
  const isAdminRoute = pathname?.startsWith('/admin')

  const github = useGithubFlash()
  const candidates = [github].filter(Boolean)
  const latest = candidates.sort((a, b) => new Date(b.date) - new Date(a.date))[0]

  const [dismissedId, setDismissedId] = useState(undefined) // undefined = haven't read localStorage yet

  useEffect(() => {
    try {
      setDismissedId(localStorage.getItem(DISMISS_KEY))
    } catch {
      setDismissedId(null)
    }
  }, [])

  const handleDismiss = () => {
    setDismissedId(latest?.id ?? null)
    try {
      if (latest) localStorage.setItem(DISMISS_KEY, latest.id)
    } catch {
      // ignore - non-critical
    }
  }

  const shown = !isAdminRoute && !!latest && dismissedId !== undefined && dismissedId !== latest.id

  useEffect(() => {
    if (!shown) return
    const timer = setTimeout(handleDismiss, 10000)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shown, latest?.id])

  if (!shown) {
    return null
  }

  const Icon = latest.icon

  return (
    <a
      href={latest.href}
      className="fixed bottom-6 left-6 z-50 flex items-start gap-3 max-w-xs bg-base-100 border-2 border-base-content shadow-[6px_6px_0_0_currentColor] p-4 hover:-translate-y-1 transition-transform duration-200"
    >
      <Icon className="w-5 h-5 text-primary shrink-0 mt-0.5" />
      <div className="min-w-0">
        <p className="text-[10px] font-mono uppercase tracking-widest text-base-content/50 mb-1">
          {latest.eyebrow}
        </p>
        <p className="text-sm text-base-content font-medium line-clamp-2">{latest.message}</p>
      </div>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          handleDismiss()
        }}
        aria-label="Dismiss"
        className="shrink-0 text-base-content/40 hover:text-error transition-colors"
      >
        <FaTimes className="w-4 h-4" />
      </button>
    </a>
  )
}

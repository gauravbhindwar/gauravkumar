'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { Settings, Lock, User } from 'lucide-react'

export default function AdminAccess() {
  const { data: session } = useSession()
  const [isVisible, setIsVisible] = useState(false)

  // Only show for authenticated admin users or when explicitly requested
  if (!isVisible && !session?.user) {
    return (
      <div className="fixed bottom-24 right-6 z-50">
        <button
          onClick={() => setIsVisible(true)}
          className="p-2.5 bg-base-300/60 text-base-content/60 rounded-full shadow-sm hover:bg-base-300 hover:text-base-content transition-all opacity-30 hover:opacity-100"
          title="Admin Access"
        >
          <Settings className="h-4 w-4" />
        </button>
      </div>
    )
  }

  if (session?.user) {
    return (
      <div className="fixed bottom-24 right-6 z-50">
        <Link
          href="/admin/dashboard"
          className="flex items-center gap-2 px-4 py-2 border border-primary bg-primary/10 text-primary hover:bg-primary/30 font-mono text-xs uppercase tracking-widest shadow-[0_0_15px_rgba(255,175,211,0.1)] transition-all"
        >
          <User className="h-4 w-4" />
          <span>[ ADMIN ]</span>
        </Link>
      </div>
    )
  }

  return (
    <div className="fixed bottom-24 right-6 z-50">
      <div className="bg-base-100 rounded-lg shadow-lg border border-base-300 p-4 min-w-[200px]">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-base-content">Admin Access</h3>
          <button
            onClick={() => setIsVisible(false)}
            className="text-base-content/40 hover:text-base-content/70"
          >
            ×
          </button>
        </div>

        <div className="space-y-2">
          <Link
            href="/admin/login"
            className="flex items-center gap-2 w-full p-2 text-sm text-base-content/80 rounded-md hover:bg-base-200 transition-colors"
          >
            <Lock className="h-4 w-4" />
            <span>Admin Login</span>
          </Link>
        </div>
      </div>
    </div>
  )
}

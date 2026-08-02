'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * Lazy-mounts a canvas only once its wrapper scrolls near the viewport, so
 * Skills/Contact don't construct a WebGL context until needed — keeps at most
 * 1-2 live contexts alive at once as the user scrolls the page.
 */
export default function useInViewCanvas({ rootMargin = '200px', once = true } = {}) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node || typeof IntersectionObserver === 'undefined') {
      setInView(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          if (once) observer.disconnect()
        } else if (!once) {
          setInView(false)
        }
      },
      { rootMargin }
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [rootMargin, once])

  return [ref, inView]
}

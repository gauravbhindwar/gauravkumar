'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { FaExpand, FaExternalLinkAlt, FaTimes } from 'react-icons/fa'

// Direct file URLs (Supabase Storage, now that resumes are uploaded via
// Admin > Media instead of linked from Google Drive) embed at full quality
// as-is. Legacy Google Drive "view" links still get rewritten to Drive's
// own preview embed for backward compatibility.
function toEmbedUrl(url) {
  if (!url) return null
  if (url.includes('drive.google.com/file/d/')) {
    return url.replace(/\/view.*$/, '/preview')
  }
  return url
}

/**
 * Custom wrapper around a resume/file trigger button that adds:
 * - a small hover preview card (desktop) that stays open while the pointer
 *   is anywhere inside this wrapper - trigger, card, or the gap between
 *   them - fixing the old CSS group-hover approach which lived inside a
 *   pointer-events-none node and lost hover the instant the mouse left the
 *   button itself.
 * - clicking the preview card (or tapping the trigger on a touch device,
 *   where hover doesn't exist) opens a large, full-quality modal preview.
 */
export default function ResumePreview({ resumeUrl, onTriggerClick, triggerClassName, wrapperClassName, disabled, children }) {
  const [previewVisible, setPreviewVisible] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const closeTimer = useRef(null)
  const isTouch = useRef(false)

  useEffect(() => {
    isTouch.current = typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches
  }, [])

  const cancelClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
  }
  const scheduleClose = () => {
    cancelClose()
    closeTimer.current = setTimeout(() => setPreviewVisible(false), 250)
  }

  useEffect(() => () => cancelClose(), [])

  // Lock background scroll while the modal is open - also keeps it
  // visually centered instead of drifting with whatever the page had
  // scrolled to when it opened.
  useEffect(() => {
    if (!modalOpen) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [modalOpen])

  const embedUrl = toEmbedUrl(resumeUrl)

  const handleTriggerClick = (e) => {
    if (isTouch.current && embedUrl) {
      e.preventDefault()
      setModalOpen(true)
      return
    }
    onTriggerClick?.(e)
  }

  return (
    <>
      <div
        className={`relative ${wrapperClassName || ''}`}
        onMouseEnter={() => embedUrl && (cancelClose(), setPreviewVisible(true))}
        onMouseLeave={scheduleClose}
      >
        <button type="button" onClick={handleTriggerClick} disabled={disabled} className={triggerClassName}>
          {children}
        </button>

        {previewVisible && embedUrl && (
          <div className="absolute top-full right-0 mt-4 z-50 origin-top-right animate-fade-in">
            <button
              type="button"
              onClick={() => {
                setModalOpen(true)
                setPreviewVisible(false)
              }}
              className="relative w-64 aspect-[1/1.4] block group/preview cursor-zoom-in"
            >
              <div className="absolute inset-0 bg-base-300 border-2 border-base-content translate-x-3 translate-y-3" />
              <div className="absolute inset-0 bg-base-200 border-2 border-base-content translate-x-1.5 translate-y-1.5" />
              <div className="absolute inset-0 bg-base-100 border-2 border-base-content overflow-hidden flex flex-col">
                <div className="bg-primary px-2 py-1 flex items-center justify-between border-b-2 border-base-content shrink-0">
                  <span className="text-[10px] font-mono font-bold text-primary-content uppercase tracking-widest">Resume_Preview</span>
                  <FaExpand className="w-2.5 h-2.5 text-primary-content" />
                </div>
                <div className="flex-1 relative bg-base-200">
                  <div className="absolute inset-0 flex items-center justify-center z-0">
                    <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                  </div>
                  <iframe
                    src={embedUrl}
                    className="absolute inset-0 w-full h-full z-10 bg-transparent border-0 pointer-events-none"
                    title="Resume Preview"
                    loading="lazy"
                  />
                </div>
                <div className="opacity-0 group-hover/preview:opacity-100 transition-opacity absolute inset-0 z-20 bg-base-100/80 flex items-center justify-center">
                  <span className="text-xs font-mono font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                    <FaExpand className="w-3 h-3" /> View Full Quality
                  </span>
                </div>
              </div>
            </button>
          </div>
        )}
      </div>

      {modalOpen && embedUrl && createPortal(
        <div
          className="fixed inset-0 z-[100] bg-base-content/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-8"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="relative bg-base-100 border-4 border-base-content shadow-[12px_12px_0_0_currentColor] w-full max-w-3xl h-[85vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b-4 border-base-content bg-primary shrink-0">
              <span className="font-mono font-bold text-sm uppercase tracking-widest text-primary-content">Resume Preview</span>
              <div className="flex items-center gap-2">
                <a
                  href={resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-base-100 border-2 border-base-content text-base-content hover:bg-base-200 transition-colors"
                  title="Open in new tab"
                >
                  <FaExternalLinkAlt className="w-3.5 h-3.5" />
                </a>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="p-2 bg-base-100 border-2 border-base-content text-base-content hover:bg-error hover:text-error-content transition-colors"
                >
                  <FaTimes className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            <iframe src={embedUrl} className="flex-1 w-full bg-base-200 border-0" title="Resume Full Preview" />
          </div>
        </div>,
        document.body
      )}
    </>
  )
}

'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { FiX, FiBookOpen } from 'react-icons/fi';
import MermaidDiagram from '@/components/ui/MermaidDiagram';

// GitHub renders relative image paths against the repo's default branch;
// raw.githubusercontent.com/<owner>/<repo>/HEAD/ mirrors that without needing
// to know which branch (main/master/etc) is actually default.
function getRawBase(githubUrl) {
  if (!githubUrl) return null;
  try {
    const url = new URL(githubUrl);
    if (!url.hostname.endsWith('github.com')) return null;
    const [owner, repo] = url.pathname.split('/').filter(Boolean);
    if (!owner || !repo) return null;
    return `https://raw.githubusercontent.com/${owner}/${repo.replace(/\.git$/, '')}/HEAD/`;
  } catch {
    return null;
  }
}

function resolveRelativeUrl(src, rawBase) {
  if (!src || !rawBase) return src;
  if (/^(https?:)?\/\//.test(src) || src.startsWith('data:')) return src;
  return rawBase + src.replace(/^\.\//, '');
}

export default function ReadmeModal({ isOpen, onClose, title, readme, githubUrl }) {
  const [mounted, setMounted] = useState(false);
  const rawBase = getRawBase(githubUrl);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKey);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 pointer-events-none"
          >
            <div
              className="relative bg-base-100 border-4 border-base-content shadow-[12px_12px_0_0_currentColor] max-w-3xl w-full max-h-[85vh] flex flex-col pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between gap-4 p-4 md:p-6 border-b-4 border-base-content bg-base-200 shrink-0">
                <h2 className="text-lg md:text-xl font-display font-black uppercase text-base-content flex items-center gap-2">
                  <FiBookOpen className="text-primary" /> {title || 'README'}
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 border-2 border-base-content hover:bg-base-300 transition-colors shrink-0"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 md:p-8">
                <div className="max-w-none text-base-content text-sm md:text-base [&_a]:text-primary [&_a]:underline [&_h1]:text-2xl [&_h1]:font-black [&_h2]:text-xl [&_h2]:font-bold [&_h1]:mb-4 [&_h2]:mt-6 [&_h2]:mb-3 [&_h3]:mt-4 [&_h3]:mb-2 [&_h3]:font-bold [&_p]:leading-relaxed [&_p]:mb-3 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-3 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-3 [&_li]:mb-1 [&_blockquote]:border-l-4 [&_blockquote]:border-primary [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:my-3 [&_table]:w-full [&_table]:my-3 [&_th]:border [&_th]:border-base-content/30 [&_th]:p-2 [&_th]:bg-base-200 [&_td]:border [&_td]:border-base-content/20 [&_td]:p-2 [&_img]:max-w-full [&_hr]:border-base-content/20 [&_hr]:my-4">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      pre: ({ children }) => <>{children}</>,
                      code({ className, children }) {
                        const match = /language-(\w+)/.exec(className || '');
                        const lang = match?.[1];
                        const codeString = Array.isArray(children) ? children.join('') : String(children ?? '');
                        const trimmed = codeString.replace(/\n$/, '');

                        if (lang === 'mermaid') {
                          return <MermaidDiagram code={trimmed} />;
                        }

                        if (!match) {
                          return (
                            <code className="px-1.5 py-0.5 bg-base-200 border border-base-content/20 text-primary text-sm font-mono">
                              {children}
                            </code>
                          );
                        }

                        return (
                          <pre className="bg-base-200 border-2 border-base-content p-4 overflow-x-auto text-sm font-mono my-3">
                            <code className={className}>{children}</code>
                          </pre>
                        );
                      },
                      img: ({ src, alt }) => (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={resolveRelativeUrl(src, rawBase)} alt={alt || ''} loading="lazy" className="max-w-full" />
                      ),
                      a: ({ href, children }) => (
                        <a href={href} target="_blank" rel="noopener noreferrer">
                          {children}
                        </a>
                      ),
                    }}
                  >
                    {readme || ''}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}

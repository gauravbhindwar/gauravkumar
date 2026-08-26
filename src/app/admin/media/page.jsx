'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { FileText, Image as ImageIcon, Upload, Trash2, CheckCircle, Star, AlertCircle } from 'lucide-react'

export default function MediaLibrary() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const [resumeFiles, setResumeFiles] = useState([])
  const [profilePictures, setProfilePictures] = useState([])
  const [loading, setLoading] = useState(true)
  const [uploadingResume, setUploadingResume] = useState(false)
  const [uploadingPicture, setUploadingPicture] = useState(false)
  const [resumeLabel, setResumeLabel] = useState('')
  const [error, setError] = useState('')
  const [busyId, setBusyId] = useState(null)

  useEffect(() => {
    if (status === 'loading') return
    if (!session) {
      router.push('/admin/login')
      return
    }
    fetchAll()
  }, [session, status, router])

  const fetchAll = async () => {
    try {
      const [resumeRes, pictureRes] = await Promise.all([
        fetch('/api/resume-files'),
        fetch('/api/profile-pictures'),
      ])
      const resumeData = await resumeRes.json()
      const pictureData = await pictureRes.json()
      setResumeFiles(resumeData.resumeFiles || [])
      setProfilePictures(pictureData.profilePictures || [])
    } catch (err) {
      console.error('Error fetching media:', err)
      setError('Failed to load media library')
    } finally {
      setLoading(false)
    }
  }

  const uploadFile = async (file) => {
    const formData = new FormData()
    formData.append('file', file)
    const response = await fetch('/api/upload', { method: 'POST', body: formData })
    if (!response.ok) throw new Error('Upload failed')
    const data = await response.json()
    return data.url
  }

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (!resumeLabel.trim()) {
      setError('Give the resume a label first (e.g. "Full Stack Resume")')
      e.target.value = ''
      return
    }

    setUploadingResume(true)
    setError('')
    try {
      const url = await uploadFile(file)
      const response = await fetch('/api/resume-files', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ label: resumeLabel.trim(), url }),
      })
      if (!response.ok) {
        const body = await response.json().catch(() => ({}))
        throw new Error(body.error || 'Failed to save resume')
      }
      setResumeLabel('')
      await fetchAll()
    } catch (err) {
      setError(err.message || 'Error uploading resume')
    } finally {
      setUploadingResume(false)
      e.target.value = ''
    }
  }

  const handlePictureUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setUploadingPicture(true)
    setError('')
    try {
      const url = await uploadFile(file)
      const response = await fetch('/api/profile-pictures', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      })
      if (!response.ok) {
        const body = await response.json().catch(() => ({}))
        throw new Error(body.error || 'Failed to save picture')
      }
      await fetchAll()
    } catch (err) {
      setError(err.message || 'Error uploading picture')
    } finally {
      setUploadingPicture(false)
      e.target.value = ''
    }
  }

  const activate = async (kind, id) => {
    setBusyId(id)
    setError('')
    try {
      const endpoint = kind === 'resume' ? `/api/resume-files/${id}` : `/api/profile-pictures/${id}`
      const response = await fetch(endpoint, { method: 'PUT' })
      if (!response.ok) {
        const body = await response.json().catch(() => ({}))
        throw new Error(body.error || 'Failed to activate')
      }
      await fetchAll()
    } catch (err) {
      setError(err.message || 'Error activating item')
    } finally {
      setBusyId(null)
    }
  }

  const remove = async (kind, id) => {
    if (!confirm('Delete this file? This cannot be undone.')) return
    setBusyId(id)
    setError('')
    try {
      const endpoint = kind === 'resume' ? `/api/resume-files/${id}` : `/api/profile-pictures/${id}`
      const response = await fetch(endpoint, { method: 'DELETE' })
      if (!response.ok) {
        const body = await response.json().catch(() => ({}))
        throw new Error(body.error || 'Failed to delete')
      }
      await fetchAll()
    } catch (err) {
      setError(err.message || 'Error deleting item')
    } finally {
      setBusyId(null)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-base-200">
        <div className="w-8 h-8 border-2 border-t-transparent rounded-none animate-spin border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-base-200 p-6 md:p-8 font-sans text-base-content">
      <div className="max-w-5xl mx-auto space-y-8">
        <header>
          <h1 className="text-3xl font-bold tracking-tight text-base-content">Media Library</h1>
          <p className="text-base-content/60 mt-1">Manage resume files and profile pictures shown on your portfolio.</p>
        </header>

        {error && (
          <div className="p-4 bg-error/10 border-2 border-error text-error flex items-center gap-3 text-sm">
            <AlertCircle className="w-4 h-4 shrink-0" /> {error}
          </div>
        )}

        {/* Resume Files */}
        <section className="bg-base-100 border-4 border-base-content shadow-[8px_8px_0_0_currentColor] p-6 md:p-8 space-y-6">
          <h2 className="text-lg font-display font-bold uppercase tracking-widest flex items-center gap-3">
            <FileText className="w-5 h-5 text-primary" /> Resume Files
          </h2>

          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={resumeLabel}
              onChange={(e) => setResumeLabel(e.target.value)}
              placeholder="Label, e.g. Full Stack Resume"
              className="flex-1 px-4 py-3 bg-base-200 border-2 border-base-content rounded-none focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
            />
            <label className="cursor-pointer px-6 py-3 bg-primary text-base-100 border-2 border-base-content font-mono font-bold uppercase tracking-widest flex items-center gap-2 shadow-[4px_4px_0_0_currentColor] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all shrink-0">
              <Upload className="w-4 h-4" />
              {uploadingResume ? 'Uploading...' : 'Upload PDF'}
              <input type="file" accept=".pdf,application/pdf" className="hidden" disabled={uploadingResume} onChange={handleResumeUpload} />
            </label>
          </div>

          <div className="space-y-3">
            {resumeFiles.length === 0 && (
              <p className="text-sm text-base-content/50">No resumes uploaded yet.</p>
            )}
            {resumeFiles.map((file) => (
              <div
                key={file._id}
                className={`flex items-center justify-between gap-4 p-4 border-2 ${file.isActive ? 'border-primary bg-primary/5' : 'border-base-content/20'}`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <FileText className="w-5 h-5 text-base-content/40 shrink-0" />
                  <div className="min-w-0">
                    <a href={file.url} target="_blank" rel="noopener noreferrer" className="font-medium truncate hover:text-primary transition-colors block">
                      {file.label}
                    </a>
                    {file.isActive && (
                      <span className="text-[10px] font-mono uppercase tracking-widest text-primary flex items-center gap-1 mt-0.5">
                        <CheckCircle className="w-3 h-3" /> Active on site
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {!file.isActive && (
                    <button
                      onClick={() => activate('resume', file._id)}
                      disabled={busyId === file._id}
                      className="px-3 py-2 border-2 border-base-content text-xs font-mono font-bold uppercase tracking-widest hover:bg-primary hover:text-base-100 transition-colors disabled:opacity-50"
                    >
                      <Star className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <button
                    onClick={() => remove('resume', file._id)}
                    disabled={file.isActive || busyId === file._id}
                    title={file.isActive ? "Can't delete the active resume" : 'Delete'}
                    className="p-2 border-2 border-base-content text-base-content/60 hover:text-error hover:border-error transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Profile Pictures */}
        <section className="bg-base-100 border-4 border-base-content shadow-[8px_8px_0_0_currentColor] p-6 md:p-8 space-y-6">
          <h2 className="text-lg font-display font-bold uppercase tracking-widest flex items-center gap-3">
            <ImageIcon className="w-5 h-5 text-secondary" /> Profile Pictures
          </h2>

          <label className="cursor-pointer inline-flex px-6 py-3 bg-secondary text-secondary-content border-2 border-base-content font-mono font-bold uppercase tracking-widest items-center gap-2 shadow-[4px_4px_0_0_currentColor] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
            <Upload className="w-4 h-4" />
            {uploadingPicture ? 'Uploading...' : 'Upload Picture'}
            <input type="file" accept="image/*" className="hidden" disabled={uploadingPicture} onChange={handlePictureUpload} />
          </label>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {profilePictures.length === 0 && (
              <p className="text-sm text-base-content/50 col-span-full">No pictures uploaded yet.</p>
            )}
            {profilePictures.map((pic) => (
              <div
                key={pic._id}
                className={`relative border-2 overflow-hidden group ${pic.isActive ? 'border-secondary' : 'border-base-content/20'}`}
              >
                <img src={pic.url} alt="Profile" className="w-full aspect-square object-cover" />
                {pic.isActive && (
                  <span className="absolute top-1 left-1 bg-secondary text-secondary-content text-[9px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" /> Active
                  </span>
                )}
                <div className="absolute inset-0 bg-base-100/0 group-hover:bg-base-100/70 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                  {!pic.isActive && (
                    <button
                      onClick={() => activate('picture', pic._id)}
                      disabled={busyId === pic._id}
                      className="p-2 bg-base-100 border-2 border-base-content hover:bg-secondary hover:text-secondary-content transition-colors disabled:opacity-50"
                      title="Set as active"
                    >
                      <Star className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => remove('picture', pic._id)}
                    disabled={pic.isActive || busyId === pic._id}
                    title={pic.isActive ? "Can't delete the active picture" : 'Delete'}
                    className="p-2 bg-base-100 border-2 border-base-content text-base-content/70 hover:text-error hover:border-error transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

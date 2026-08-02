'use client'

import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import AdminProtection from '@/components/AdminProtection'
import { 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  Shield, 
  Crown,
  Eye,
  EyeOff,
  AlertCircle,
  Timer,
  LogOut,
  AlertTriangle
} from 'lucide-react'

export default function AdminsPage() {
  return (
    <AdminProtection>
      <AdminManagement />
    </AdminProtection>
  )
}

function AdminManagement() {
  const { data: session } = useSession()
  const router = useRouter()
  const [admins, setAdmins] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingAdmin, setEditingAdmin] = useState(null)
  const [showPassword, setShowPassword] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const [logoutTimer, setLogoutTimer] = useState(5)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [adminToDelete, setAdminToDelete] = useState(null)
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'admin',
    isActive: true
  })
  const [errors, setErrors] = useState({})
  const [message, setMessage] = useState('')

  // Filter admins based on search
  const filteredAdmins = admins.filter(admin => 
    admin.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    admin.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  useEffect(() => {
    fetchAdmins()
  }, [])

  // ESC key handler for closing modals
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape') {
        if (showForm) {
          resetForm()
        }
        if (showDeleteModal) {
          setShowDeleteModal(false)
          setAdminToDelete(null)
        }
        if (showLogoutModal) {
          // Don't allow ESC to close logout modal for security
          // User must either wait or click logout now
        }
      }
    }

    document.addEventListener('keydown', handleEscKey)
    return () => document.removeEventListener('keydown', handleEscKey)
  }, [showForm, showLogoutModal, showDeleteModal])

  // Logout timer effect
  useEffect(() => {
    let timer
    if (showLogoutModal && logoutTimer > 0) {
      timer = setTimeout(() => {
        setLogoutTimer(prev => prev - 1)
      }, 1000)
    } else if (showLogoutModal && logoutTimer === 0) {
      handleForceLogout()
    }
    return () => clearTimeout(timer)
  }, [showLogoutModal, logoutTimer])

  const fetchAdmins = async () => {
    try {
      const response = await fetch('/api/admin/admins')
      if (response.ok) {
        const data = await response.json()
        setAdmins(data.admins || [])
      } else {
        setMessage('Failed to fetch admins')
      }
    } catch (error) {
      setMessage('Error fetching admins')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    // Clear specific error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required'
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email'
    }

    if (!editingAdmin && !formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password && formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    // Confirm password validation (only if password is being set)
    if (formData.password || formData.confirmPassword) {
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const checkExistingUserData = async (username, email) => {
    try {
      const response = await fetch('/api/admin/admins')
      if (response.ok) {
        const data = await response.json()
        const existingAdmins = data.admins || []
        
        // Filter out current admin if editing
        const otherAdmins = editingAdmin 
          ? existingAdmins.filter(admin => admin._id !== editingAdmin._id)
          : existingAdmins

        const usernameExists = otherAdmins.some(admin => admin.username.toLowerCase() === username.toLowerCase())
        const emailExists = otherAdmins.some(admin => admin.email.toLowerCase() === email.toLowerCase())
        
        const errors = {}
        if (usernameExists) {
          errors.username = 'Username already exists'
        }
        if (emailExists) {
          errors.email = 'Email already exists'
        }
        
        return errors
      }
    } catch (error) {
      console.error('Error checking existing data:', error)
    }
    return {}
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return

    // Check for existing username/email
    const existingErrors = await checkExistingUserData(formData.username, formData.email)
    if (Object.keys(existingErrors).length > 0) {
      setErrors(prev => ({ ...prev, ...existingErrors }))
      return
    }

    try {
      const url = editingAdmin 
        ? `/api/admin/admins/${editingAdmin._id}`
        : '/api/admin/admins'
      
      const method = editingAdmin ? 'PUT' : 'POST'
      
      // Don't send password or confirmPassword if it's empty during edit
      const submitData = { ...formData }
      delete submitData.confirmPassword // Don't send confirmPassword to backend
      if (editingAdmin && !submitData.password) {
        delete submitData.password
      }

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      })

      const result = await response.json()

      if (response.ok) {
        setMessage(editingAdmin ? 'Admin updated successfully' : 'Admin created successfully')
        
        // Check if current user updated their own details
        if (editingAdmin && editingAdmin._id === session?.user?.id) {
          setShowLogoutModal(true)
          setLogoutTimer(5)
        }
        
        resetForm()
        fetchAdmins()
      } else {
        setMessage(result.error || 'Operation failed')
      }
    } catch (error) {
      setMessage('Error saving admin')
    }
  }

  const handleEdit = (admin) => {
    setEditingAdmin(admin)
    setFormData({
      username: admin.username,
      email: admin.email,
      password: '',
      confirmPassword: '',
      role: admin.role,
      isActive: admin.isActive
    })
    setShowForm(true)
    setErrors({})
    setMessage('')
  }

  const handleDelete = async (admin) => {
    if (admin._id === session?.user?.id) {
      setMessage('You cannot delete your own account')
      return
    }

    setAdminToDelete(admin)
    setShowDeleteModal(true)
  }

  const confirmDelete = async () => {
    if (!adminToDelete) return

    try {
      const response = await fetch(`/api/admin/admins/${adminToDelete._id}`, {
        method: 'DELETE',
      })

      const result = await response.json()

      if (response.ok) {
        setMessage('Admin deleted successfully')
        fetchAdmins()
      } else {
        setMessage(result.error || 'Failed to delete admin')
      }
    } catch (error) {
      setMessage('Error deleting admin')
    } finally {
      setShowDeleteModal(false)
      setAdminToDelete(null)
    }
  }

  const resetForm = () => {
    setFormData({
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'admin',
      isActive: true
    })
    setEditingAdmin(null)
    setShowForm(false)
    setErrors({})
    setShowPassword(false)
  }

  const handleForceLogout = async () => {
    await signOut({ redirect: false })
    router.push('/admin/login')
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-base-content flex items-center">
            <Users className="mr-3 h-8 w-8" />
            Admin Management
          </h1>
          <p className="text-base-content/60 mt-1">Manage admin accounts and permissions</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-primary text-primary-content px-4 py-2  hover:bg-primary/90 transition-colors flex items-center"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Admin
        </button>
      </div>

      {/* Messages */}
      {message && (
        <div className={`mb-4 p-4  ${
          message.includes('Error') || message.includes('Failed') || message.includes('cannot')
            ? 'bg-error/10 border border-error/20 text-error'
            : 'bg-success/10 border border-success/20 text-success'
        }`}>
          <div className="flex">
            <AlertCircle className="h-5 w-5 mr-2" />
            {message}
          </div>
        </div>
      )}

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search admins by username or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-md px-4 py-2 border border-base-300  focus:ring-2 focus:ring-primary focus:border-transparent text-base-content bg-base-100"
        />
      </div>

      {/* Admins List */}
      <div className="bg-base-100  shadow border border-base-300/60 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-base-300">
            <thead className="bg-base-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-base-content/50 uppercase tracking-wider">
                  Admin
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-base-content/50 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-base-content/50 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-base-content/50 uppercase tracking-wider">
                  Last Login
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-base-content/50 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-base-content/50 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-base-100 divide-y divide-base-300">
              {filteredAdmins.map((admin) => (
                <tr key={admin._id} className="hover:bg-base-200">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-base-content flex items-center">
                        {admin.username}
                        {admin._id === session?.user?.id && (
                          <span className="ml-2 px-2 py-1 text-xs bg-primary/15 text-primary rounded-full">
                            You
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-base-content/60">{admin.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {admin.role === 'super_admin' ? (
                        <Crown className="h-4 w-4 text-warning mr-2" />
                      ) : (
                        <Shield className="h-4 w-4 text-primary mr-2" />
                      )}
                      <span className={`text-sm ${
                        admin.role === 'super_admin' ? 'text-warning font-medium' : 'text-primary'
                      }`}>
                        {admin.role === 'super_admin' ? 'Super Admin' : 'Admin'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      admin.isActive 
                        ? 'bg-success/15 text-success' 
                        : 'bg-error/15 text-error'
                    }`}>
                      {admin.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-base-content/60">
                    {admin.lastLogin ? formatDate(admin.lastLogin) : 'Never'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-base-content/60">
                    {formatDate(admin.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleEdit(admin)}
                      className="text-primary hover:text-primary/80 mr-3"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    {admin._id !== session?.user?.id && (
                      <button
                        onClick={() => handleDelete(admin)}
                        className="text-error hover:text-error/80"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-base-100  p-6 w-full max-w-md max-h-screen overflow-y-auto shadow-xl border border-base-300">
            <h2 className="text-xl font-bold mb-4 text-base-content">
              {editingAdmin ? 'Edit Admin' : 'Create New Admin'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-base-content/80 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border  focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white ${
                    errors.username ? 'border-error' : 'border-base-300'
                  }`}
                  placeholder="Enter username"
                />
                {errors.username && (
                  <p className="text-error text-sm mt-1">{errors.username}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-base-content/80 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border  focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white ${
                    errors.email ? 'border-error' : 'border-base-300'
                  }`}
                  placeholder="Enter email"
                />
                {errors.email && (
                  <p className="text-error text-sm mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-base-content/80 mb-1">
                  Password {editingAdmin && '(leave empty to keep current)'}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border  focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10 text-gray-900 bg-white ${
                      errors.password ? 'border-error' : 'border-base-300'
                    }`}
                    placeholder={editingAdmin ? 'Leave empty to keep current' : 'Enter password'}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-base-content/40" />
                    ) : (
                      <Eye className="h-4 w-4 text-base-content/40" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-error text-sm mt-1">{errors.password}</p>
                )}
              </div>

              {/* Show confirm password field when password is being entered */}
              {(formData.password || formData.confirmPassword) && (
                <div>
                  <label className="block text-sm font-medium text-base-content/80 mb-1">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border  focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white ${
                        errors.confirmPassword ? 'border-error' : 'border-base-300'
                      }`}
                      placeholder="Confirm your password"
                    />
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-error text-sm mt-1">{errors.confirmPassword}</p>
                  )}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-base-content/80 mb-1">
                  Role
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-base-300  focus:ring-2 focus:ring-primary focus:border-transparent text-base-content bg-base-100"
                >
                  <option value="admin">Admin</option>
                  <option value="super_admin">Super Admin</option>
                </select>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isActive"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-primary focus:ring-primary border-base-300 rounded bg-base-100"
                />
                <label htmlFor="isActive" className="ml-2 block text-sm text-base-content">
                  Active
                </label>
              </div>

              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="flex-1 bg-primary text-primary-content py-2 px-4  hover:bg-primary/90 transition-colors"
                >
                  {editingAdmin ? 'Update Admin' : 'Create Admin'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 bg-base-300 text-base-content py-2 px-4  hover:bg-base-300/70 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-base-100  p-6 w-full max-w-md shadow-xl border border-base-300">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-warning/15 mb-4">
                <Timer className="h-6 w-6 text-warning" />
              </div>
              <h3 className="text-lg font-medium text-base-content mb-2">
                Account Updated
              </h3>
              <p className="text-sm text-base-content/60 mb-4">
                You have updated your own admin details. For security reasons, you will be logged out automatically.
              </p>
              <div className="text-2xl font-bold text-error mb-4">
                {logoutTimer}
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={handleForceLogout}
                  className="flex-1 bg-error text-error-content py-2 px-4  hover:bg-error/90 transition-colors flex items-center justify-center"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && adminToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-base-100  p-6 w-full max-w-md shadow-xl border border-base-300">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-error/15 mb-4">
                <AlertTriangle className="h-6 w-6 text-error" />
              </div>
              <h3 className="text-lg font-medium text-base-content mb-2">
                Delete Admin
              </h3>
              <p className="text-sm text-base-content/60 mb-6">
                Are you sure you want to delete admin <span className="font-semibold">"{adminToDelete.username}"</span>? This action cannot be undone.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false)
                    setAdminToDelete(null)
                  }}
                  className="flex-1 bg-base-300 text-base-content py-2 px-4  hover:bg-base-300/70 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 bg-error text-error-content py-2 px-4  hover:bg-error/90 transition-colors flex items-center justify-center"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Clock,
  Monitor,
  User,
  MapPin,
  Calendar
} from 'lucide-react'

export default function SecurityDashboard() {
  const [securityData, setSecurityData] = useState({
    loginAttempts: [],
    blockedIPs: [],
    activeSessions: [],
    securityAlerts: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSecurityData()
  }, [])

  const fetchSecurityData = async () => {
    try {
      // This would fetch from your security API
      // For now, using mock data
      const mockData = {
        loginAttempts: [
          {
            id: 1,
            email: 'admin@example.com',
            timestamp: new Date().toISOString(),
            success: true,
            ip: '192.168.1.1',
            userAgent: 'Mozilla/5.0...',
            location: 'New York, US'
          },
          {
            id: 2,
            email: 'hacker@evil.com',
            timestamp: new Date(Date.now() - 300000).toISOString(),
            success: false,
            ip: '45.33.32.156',
            userAgent: 'curl/7.68.0',
            location: 'Unknown'
          }
        ],
        blockedIPs: [
          {
            ip: '45.33.32.156',
            reason: 'Multiple failed login attempts',
            blockedAt: new Date(Date.now() - 600000).toISOString(),
            attempts: 10
          }
        ],
        activeSessions: [
          {
            id: 'sess_123',
            email: 'admin@example.com',
            startTime: new Date(Date.now() - 3600000).toISOString(),
            lastActivity: new Date().toISOString(),
            ip: '192.168.1.1',
            userAgent: 'Mozilla/5.0...'
          }
        ],
        securityAlerts: [
          {
            id: 1,
            type: 'suspicious_login',
            message: 'Login from new location detected',
            timestamp: new Date().toISOString(),
            severity: 'medium'
          }
        ]
      }
      
      setSecurityData(mockData)
      setLoading(false)
    } catch (error) {
      console.error('Failed to fetch security data:', error)
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-base-content border-t-primary rounded-none"
        />
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-base-content flex items-center">
            <Shield className="mr-3 h-8 w-8 text-primary" />
            Security Dashboard
          </h1>
          <p className="text-base-content/60 mt-1">Monitor and manage admin panel security</p>
        </div>
      </div>

      {/* Security Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-base-100 rounded-none p-6 shadow-[4px_4px_0_0_currentColor] border border-base-content"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-base-content/60">Successful Logins</p>
              <p className="text-2xl font-bold text-green-600">24</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
          <p className="text-xs text-base-content/50 mt-2">↑ 12% from last week</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-base-100 rounded-none p-6 shadow-[4px_4px_0_0_currentColor] border border-base-content"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-base-content/60">Failed Attempts</p>
              <p className="text-2xl font-bold text-red-600">8</p>
            </div>
            <XCircle className="h-8 w-8 text-red-500" />
          </div>
          <p className="text-xs text-base-content/50 mt-2">↓ 5% from last week</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-base-100 rounded-none p-6 shadow-[4px_4px_0_0_currentColor] border border-base-content"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-base-content/60">Blocked IPs</p>
              <p className="text-2xl font-bold text-yellow-600">{securityData.blockedIPs.length}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-yellow-500" />
          </div>
          <p className="text-xs text-base-content/50 mt-2">Active blocks</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-base-100 rounded-none p-6 shadow-[4px_4px_0_0_currentColor] border border-base-content"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-base-content/60">Active Sessions</p>
              <p className="text-2xl font-bold text-blue-600">{securityData.activeSessions.length}</p>
            </div>
            <Monitor className="h-8 w-8 text-blue-500" />
          </div>
          <p className="text-xs text-base-content/50 mt-2">Currently online</p>
        </motion.div>
      </div>

      {/* Recent Login Attempts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-base-100 border-4 border-base-content shadow-[8px_8px_0_0_currentColor]"
      >
        <div className="p-6 border-b border-base-300">
          <h2 className="text-lg font-semibold text-base-content">Recent Login Attempts</h2>
        </div>
        <div className="divide-y divide-base-300">
          {securityData.loginAttempts.map((attempt, index) => (
            <motion.div
              key={attempt.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className="p-6 hover:bg-base-200 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`w-3 h-3 rounded-none ${
                    attempt.success ? 'bg-green-500' : 'bg-red-500'
                  }`} />
                  <div>
                    <p className="font-medium text-base-content">{attempt.email}</p>
                    <div className="flex items-center space-x-4 text-sm text-base-content/60">
                      <span className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {attempt.ip}
                      </span>
                      <span className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(attempt.timestamp).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-none text-xs font-medium ${
                    attempt.success 
                      ? 'bg-base-100 text-success' 
                      : 'bg-base-100 text-error'
                  }`}>
                    {attempt.success ? 'Success' : 'Failed'}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Blocked IPs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-base-100 border-4 border-base-content shadow-[8px_8px_0_0_currentColor]"
      >
        <div className="p-6 border-b border-base-300">
          <h2 className="text-lg font-semibold text-base-content">Blocked IP Addresses</h2>
        </div>
        <div className="divide-y divide-base-300">
          {securityData.blockedIPs.length > 0 ? (
            securityData.blockedIPs.map((block, index) => (
              <motion.div
                key={block.ip}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                className="p-6 hover:bg-base-200 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-base-content">{block.ip}</p>
                    <p className="text-sm text-base-content/60">{block.reason}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-error">{block.attempts} attempts</p>
                    <p className="text-xs text-base-content/50">
                      Blocked {new Date(block.blockedAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="p-6 text-center text-base-content/50">
              <Shield className="mx-auto h-8 w-8 text-base-content/30" />
              <p className="mt-2">No blocked IPs</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}
import { NextResponse } from 'next/server'
import getSupabase from '@/lib/supabase'

// In-memory store for login attempts (in production, use Redis)
const loginAttempts = new Map()
const MAX_ATTEMPTS = 5
const LOCKOUT_DURATION = 300000 // 5 minutes in milliseconds
const ATTEMPT_WINDOW = 900000 // 15 minutes in milliseconds

export async function POST(request) {
  try {
    const { email, type, userAgent, ip } = await request.json()
    
    if (!email || !type) {
      return NextResponse.json(
        { error: 'Email and type are required' },
        { status: 400 }
      )
    }

    const now = Date.now()
    const key = `${email}-${ip}`
    
    switch (type) {
      case 'check':
        return checkLoginAttempts(key, now)
      
      case 'failed':
        return recordFailedAttempt(key, now, email, userAgent, ip)
      
      case 'success':
        return recordSuccessfulLogin(key, email, userAgent, ip)
      
      case 'reset':
        return resetAttempts(key)
      
      default:
        return NextResponse.json(
          { error: 'Invalid type' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('Security API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

function checkLoginAttempts(key, now) {
  const attempts = loginAttempts.get(key)
  
  if (!attempts) {
    return NextResponse.json({
      isLocked: false,
      remainingAttempts: MAX_ATTEMPTS,
      lockoutTime: 0
    })
  }

  // Clean old attempts
  const recentAttempts = attempts.attempts.filter(
    attempt => now - attempt.timestamp < ATTEMPT_WINDOW
  )

  if (recentAttempts.length === 0) {
    loginAttempts.delete(key)
    return NextResponse.json({
      isLocked: false,
      remainingAttempts: MAX_ATTEMPTS,
      lockoutTime: 0
    })
  }

  const isLocked = attempts.lockedUntil > now
  const remainingAttempts = Math.max(0, MAX_ATTEMPTS - recentAttempts.length)
  const lockoutTime = isLocked ? Math.ceil((attempts.lockedUntil - now) / 1000) : 0

  return NextResponse.json({
    isLocked,
    remainingAttempts,
    lockoutTime
  })
}

function recordFailedAttempt(key, now, email, userAgent, ip) {
  let attempts = loginAttempts.get(key) || {
    attempts: [],
    lockedUntil: 0
  }

  // Clean old attempts
  attempts.attempts = attempts.attempts.filter(
    attempt => now - attempt.timestamp < ATTEMPT_WINDOW
  )

  // Add new attempt
  attempts.attempts.push({
    timestamp: now,
    email,
    userAgent,
    ip,
    type: 'failed'
  })

  // Check if should lock
  if (attempts.attempts.length >= MAX_ATTEMPTS) {
    attempts.lockedUntil = now + LOCKOUT_DURATION
  }

  loginAttempts.set(key, attempts)

  const isLocked = attempts.lockedUntil > now
  const remainingAttempts = Math.max(0, MAX_ATTEMPTS - attempts.attempts.length)
  const lockoutTime = isLocked ? Math.ceil((attempts.lockedUntil - now) / 1000) : 0

  return NextResponse.json({
    isLocked,
    remainingAttempts,
    lockoutTime,
    message: isLocked 
      ? 'Account temporarily locked due to too many failed attempts'
      : `${remainingAttempts} attempts remaining`
  })
}

async function recordSuccessfulLogin(key, email, userAgent, ip) {
  // Clear attempts on successful login
  loginAttempts.delete(key)

  try {
    const supabase = getSupabase()

    const { data: admin } = await supabase
      .from('admins')
      .select('id')
      .eq('email', email.toLowerCase())
      .maybeSingle()

    if (admin) {
      await supabase
        .from('admins')
        .update({
          last_login: new Date().toISOString(),
          last_login_ip: ip,
          last_login_user_agent: userAgent
        })
        .eq('id', admin.id)

      await supabase.from('admin_login_history').insert({
        admin_id: admin.id,
        ip,
        user_agent: userAgent,
        success: true
      })
    }
  } catch (error) {
    console.error('Error updating login history:', error)
  }

  return NextResponse.json({
    success: true,
    message: 'Login recorded successfully'
  })
}

function resetAttempts(key) {
  loginAttempts.delete(key)
  
  return NextResponse.json({
    success: true,
    message: 'Attempts reset successfully'
  })
}

// Cleanup function (should be called periodically)
export function cleanupOldAttempts() {
  const now = Date.now()
  
  for (const [key, attempts] of loginAttempts.entries()) {
    const recentAttempts = attempts.attempts.filter(
      attempt => now - attempt.timestamp < ATTEMPT_WINDOW
    )
    
    if (recentAttempts.length === 0 && attempts.lockedUntil < now) {
      loginAttempts.delete(key)
    } else {
      attempts.attempts = recentAttempts
      loginAttempts.set(key, attempts)
    }
  }
}

// Auto cleanup every 10 minutes
setInterval(cleanupOldAttempts, 600000)
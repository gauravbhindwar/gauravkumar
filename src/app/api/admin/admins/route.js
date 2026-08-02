import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import getSupabase from '@/lib/supabase'
import { checkAdminAuth } from '@/lib/auth'
import { rowToClient, rowsToClient } from '@/lib/dbMapper'

function toClientAdmin(admin) {
  const { password, ...rest } = admin
  return rowToClient(rest)
}

// GET - Fetch all admins
export async function GET() {
  try {
    const isAuthorized = await checkAdminAuth()
    if (!isAuthorized) {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 401 }
      )
    }

    const supabase = getSupabase()
    const { data: admins, error } = await supabase
      .from('admins')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json({
      success: true,
      admins: rowsToClient(admins.map(({ password, ...rest }) => rest))
    })
  } catch (error) {
    console.error('Fetch admins error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST - Create new admin
export async function POST(request) {
  try {
    const isAuthorized = await checkAdminAuth()
    if (!isAuthorized) {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { username, email, password, role = 'admin', isActive = true } = body

    // Validation
    if (!username || !email || !password) {
      return NextResponse.json(
        { error: 'Username, email, and password are required' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      )
    }

    if (!['admin', 'super_admin'].includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role specified' },
        { status: 400 }
      )
    }

    const supabase = getSupabase()

    // Check if admin already exists
    const { data: existingAdmin } = await supabase
      .from('admins')
      .select('id')
      .or(`email.eq.${email.toLowerCase()},username.eq.${username}`)
      .maybeSingle()

    if (existingAdmin) {
      return NextResponse.json(
        { error: 'Admin with this email or username already exists' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create new admin
    const { data: newAdmin, error } = await supabase
      .from('admins')
      .insert({
        username: username.trim(),
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        role,
        is_active: isActive
      })
      .select('*')
      .single()

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json(
          { error: 'Admin with this email or username already exists' },
          { status: 400 }
        )
      }
      throw error
    }

    return NextResponse.json({
      success: true,
      message: 'Admin created successfully',
      admin: toClientAdmin(newAdmin)
    }, { status: 201 })
  } catch (error) {
    console.error('Create admin error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import getSupabase from '@/lib/supabase'
import { checkAdminAuth, getAdminSession } from '@/lib/auth'
import { rowToClient } from '@/lib/dbMapper'

function toClientAdmin(admin) {
  const { password, ...rest } = admin
  return rowToClient(rest)
}

// GET - Fetch specific admin
export async function GET(request, { params }) {
  try {
    const isAuthorized = await checkAdminAuth()
    if (!isAuthorized) {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 401 }
      )
    }

    const { id } = await params
    const supabase = getSupabase()

    const { data: admin } = await supabase
      .from('admins')
      .select('*')
      .eq('id', id)
      .maybeSingle()

    if (!admin) {
      return NextResponse.json(
        { error: 'Admin not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      admin: toClientAdmin(admin)
    })
  } catch (error) {
    console.error('Fetch admin error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT - Update admin
export async function PUT(request, { params }) {
  try {
    const isAuthorized = await checkAdminAuth()
    if (!isAuthorized) {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 401 }
      )
    }

    const { id } = await params
    const body = await request.json()
    const { username, email, password, role, isActive } = body

    // Get current session to check if user is updating themselves
    const session = await getAdminSession()
    const isUpdatingSelf = session?.user?.id === id

    // Validation
    if (!username || !email) {
      return NextResponse.json(
        { error: 'Username and email are required' },
        { status: 400 }
      )
    }

    if (password && password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      )
    }

    if (role && !['admin', 'super_admin'].includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role specified' },
        { status: 400 }
      )
    }

    const supabase = getSupabase()

    // Check if admin exists
    const { data: existingAdmin } = await supabase
      .from('admins')
      .select('*')
      .eq('id', id)
      .maybeSingle()

    if (!existingAdmin) {
      return NextResponse.json(
        { error: 'Admin not found' },
        { status: 404 }
      )
    }

    // Check for duplicate username/email (excluding current admin)
    const { data: duplicateCheck } = await supabase
      .from('admins')
      .select('id')
      .neq('id', id)
      .or(`email.eq.${email.toLowerCase()},username.eq.${username}`)
      .maybeSingle()

    if (duplicateCheck) {
      return NextResponse.json(
        { error: 'Admin with this email or username already exists' },
        { status: 400 }
      )
    }

    // Prepare update data
    const updateData = {
      username: username.trim(),
      email: email.toLowerCase().trim(),
      role: role || existingAdmin.role,
      is_active: isActive !== undefined ? isActive : existingAdmin.is_active
    }

    // Hash new password if provided
    if (password) {
      updateData.password = await bcrypt.hash(password, 12)
    }

    // Update admin
    const { data: updatedAdmin, error } = await supabase
      .from('admins')
      .update(updateData)
      .eq('id', id)
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
      message: 'Admin updated successfully',
      admin: toClientAdmin(updatedAdmin),
      isUpdatingSelf
    })
  } catch (error) {
    console.error('Update admin error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE - Delete admin
export async function DELETE(request, { params }) {
  try {
    const isAuthorized = await checkAdminAuth()
    if (!isAuthorized) {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 401 }
      )
    }

    const { id } = await params

    // Get current session to prevent self-deletion
    const session = await getAdminSession()
    if (session?.user?.id === id) {
      return NextResponse.json(
        { error: 'You cannot delete your own account' },
        { status: 400 }
      )
    }

    const supabase = getSupabase()

    // Check if admin exists
    const { data: admin } = await supabase
      .from('admins')
      .select('id')
      .eq('id', id)
      .maybeSingle()

    if (!admin) {
      return NextResponse.json(
        { error: 'Admin not found' },
        { status: 404 }
      )
    }

    // Check if this is the last admin
    const { count: adminCount } = await supabase
      .from('admins')
      .select('id', { count: 'exact', head: true })
      .eq('is_active', true)

    if (adminCount <= 1) {
      return NextResponse.json(
        { error: 'Cannot delete the last active admin account' },
        { status: 400 }
      )
    }

    // Delete admin
    await supabase.from('admins').delete().eq('id', id)

    return NextResponse.json({
      success: true,
      message: 'Admin deleted successfully'
    })
  } catch (error) {
    console.error('Delete admin error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

import { NextResponse } from 'next/server'
import getSupabase from '@/lib/supabase'
import { rowToClient, clientToRow } from '@/lib/dbMapper'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

// GET /api/achievements/[id] - Get single achievement
export async function GET(request, { params }) {
  try {
    const { id } = await params
    const supabase = getSupabase()
    const { data: achievement } = await supabase
      .from('achievements')
      .select('*')
      .eq('id', id)
      .maybeSingle()

    if (!achievement) {
      return NextResponse.json({ error: 'Achievement not found' }, { status: 404 })
    }

    return NextResponse.json(rowToClient(achievement))
  } catch (error) {
    console.error('Error fetching achievement:', error)
    return NextResponse.json(
      { error: 'Failed to fetch achievement' },
      { status: 500 }
    )
  }
}

// PUT /api/achievements/[id] - Update achievement (Admin only)
export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || (session.user.role !== 'admin' && session.user.role !== 'super_admin')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const data = await request.json()

    const supabase = getSupabase()
    const { data: achievement, error } = await supabase
      .from('achievements')
      .update(clientToRow(data))
      .eq('id', id)
      .select('*')
      .maybeSingle()

    if (error) throw error
    if (!achievement) {
      return NextResponse.json({ error: 'Achievement not found' }, { status: 404 })
    }

    return NextResponse.json(rowToClient(achievement), {
      headers: {
        'Cache-Control': 'no-cache'
      }
    })
  } catch (error) {
    console.error('Error updating achievement:', error)
    return NextResponse.json(
      { error: 'Failed to update achievement' },
      { status: 500 }
    )
  }
}

// DELETE /api/achievements/[id] - Delete achievement (Admin only)
export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || (session.user.role !== 'admin' && session.user.role !== 'super_admin')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const supabase = getSupabase()
    const { data: achievement } = await supabase
      .from('achievements')
      .delete()
      .eq('id', id)
      .select('id')
      .maybeSingle()

    if (!achievement) {
      return NextResponse.json({ error: 'Achievement not found' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Achievement deleted successfully' }, {
      headers: {
        'Cache-Control': 'no-cache'
      }
    })
  } catch (error) {
    console.error('Error deleting achievement:', error)
    return NextResponse.json(
      { error: 'Failed to delete achievement' },
      { status: 500 }
    )
  }
}

import { NextResponse } from 'next/server'
import getSupabase from '@/lib/supabase'
import { rowToClient, clientToRow } from '@/lib/dbMapper'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

// GET /api/experiences/[id] - Get single experience
export async function GET(request, { params }) {
  try {
    const { id } = await params
    const supabase = getSupabase()
    const { data: experience } = await supabase
      .from('experiences')
      .select('*')
      .eq('id', id)
      .maybeSingle()

    if (!experience) {
      return NextResponse.json({ error: 'Experience not found' }, { status: 404 })
    }

    return NextResponse.json(rowToClient(experience))
  } catch (error) {
    console.error('Error fetching experience:', error)
    return NextResponse.json(
      { error: 'Failed to fetch experience' },
      { status: 500 }
    )
  }
}

// PUT /api/experiences/[id] - Update experience (Admin only)
export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || (session.user.role !== 'admin' && session.user.role !== 'super_admin')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const data = await request.json()

    const supabase = getSupabase()
    const { data: experience, error } = await supabase
      .from('experiences')
      .update(clientToRow(data))
      .eq('id', id)
      .select('*')
      .maybeSingle()

    if (error) throw error
    if (!experience) {
      return NextResponse.json({ error: 'Experience not found' }, { status: 404 })
    }

    return NextResponse.json(rowToClient(experience), {
      headers: {
        'Cache-Control': 'no-cache'
      }
    })
  } catch (error) {
    console.error('Error updating experience:', error)
    return NextResponse.json(
      { error: 'Failed to update experience' },
      { status: 500 }
    )
  }
}

// DELETE /api/experiences/[id] - Delete experience (Admin only)
export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || (session.user.role !== 'admin' && session.user.role !== 'super_admin')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const supabase = getSupabase()
    const { data: experience } = await supabase
      .from('experiences')
      .delete()
      .eq('id', id)
      .select('id')
      .maybeSingle()

    if (!experience) {
      return NextResponse.json({ error: 'Experience not found' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Experience deleted successfully' }, {
      headers: {
        'Cache-Control': 'no-cache'
      }
    })
  } catch (error) {
    console.error('Error deleting experience:', error)
    return NextResponse.json(
      { error: 'Failed to delete experience' },
      { status: 500 }
    )
  }
}

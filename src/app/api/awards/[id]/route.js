import { NextResponse } from 'next/server'
import getSupabase from '@/lib/supabase'
import { rowToClient, clientToRow } from '@/lib/dbMapper'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

// GET /api/awards/[id] - Get single award
export async function GET(request, { params }) {
  try {
    const { id } = await params
    const supabase = getSupabase()
    const { data: award } = await supabase
      .from('awards')
      .select('*')
      .eq('id', id)
      .maybeSingle()

    if (!award) {
      return NextResponse.json({ error: 'Award not found' }, { status: 404 })
    }

    return NextResponse.json(rowToClient(award))
  } catch (error) {
    console.error('Error fetching award:', error)
    return NextResponse.json(
      { error: 'Failed to fetch award' },
      { status: 500 }
    )
  }
}

// PUT /api/awards/[id] - Update award (Admin only)
export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || (session.user.role !== 'admin' && session.user.role !== 'super_admin')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const data = await request.json()

    const supabase = getSupabase()
    const { data: award, error } = await supabase
      .from('awards')
      .update(clientToRow(data))
      .eq('id', id)
      .select('*')
      .maybeSingle()

    if (error) throw error
    if (!award) {
      return NextResponse.json({ error: 'Award not found' }, { status: 404 })
    }

    return NextResponse.json(rowToClient(award), {
      headers: {
        'Cache-Control': 'no-cache'
      }
    })
  } catch (error) {
    console.error('Error updating award:', error)
    return NextResponse.json(
      { error: 'Failed to update award' },
      { status: 500 }
    )
  }
}

// DELETE /api/awards/[id] - Delete award (Admin only)
export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || (session.user.role !== 'admin' && session.user.role !== 'super_admin')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const supabase = getSupabase()
    const { data: award } = await supabase
      .from('awards')
      .delete()
      .eq('id', id)
      .select('id')
      .maybeSingle()

    if (!award) {
      return NextResponse.json({ error: 'Award not found' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Award deleted successfully' }, {
      headers: {
        'Cache-Control': 'no-cache'
      }
    })
  } catch (error) {
    console.error('Error deleting award:', error)
    return NextResponse.json(
      { error: 'Failed to delete award' },
      { status: 500 }
    )
  }
}

import { NextResponse } from 'next/server'
import getSupabase from '@/lib/supabase'
import { rowToClient, rowsToClient, clientToRow } from '@/lib/dbMapper'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

// GET /api/experiences - Get all experiences
export async function GET() {
  try {
    const supabase = getSupabase()
    const { data: experiences, error } = await supabase
      .from('experiences')
      .select('*')
      .eq('is_active', true)
      .order('order', { ascending: true })
      .order('start_date', { ascending: false })

    if (error) throw error

    return NextResponse.json(rowsToClient(experiences), {
      headers: {
        'Cache-Control': 's-maxage=60, stale-while-revalidate=300'
      }
    })
  } catch (error) {
    console.error('Error fetching experiences:', error)
    return NextResponse.json(
      { error: 'Failed to fetch experiences', details: error.message },
      { status: 500 }
    )
  }
}

// POST /api/experiences - Create new experience (Admin only)
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || (session.user.role !== 'admin' && session.user.role !== 'super_admin')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json()

    // Validate required fields
    if (!data.company || !data.position || !data.location || !data.startDate || !data.description) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const supabase = getSupabase()
    const { data: experience, error } = await supabase
      .from('experiences')
      .insert(clientToRow(data))
      .select('*')
      .single()

    if (error) throw error

    return NextResponse.json(rowToClient(experience), {
      status: 201,
      headers: {
        'Cache-Control': 'no-cache'
      }
    })
  } catch (error) {
    console.error('Error creating experience:', error)
    return NextResponse.json(
      { error: 'Failed to create experience' },
      { status: 500 }
    )
  }
}

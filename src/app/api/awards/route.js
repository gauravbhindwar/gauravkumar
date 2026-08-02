import { NextResponse } from 'next/server'
import getSupabase from '@/lib/supabase'
import { rowToClient, rowsToClient, clientToRow } from '@/lib/dbMapper'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

// GET /api/awards - Get all awards
export async function GET() {
  try {
    const supabase = getSupabase()
    const { data: awards, error } = await supabase
      .from('awards')
      .select('*')
      .eq('is_active', true)
      .order('order', { ascending: true })
      .order('date', { ascending: false })

    if (error) throw error

    return NextResponse.json(rowsToClient(awards), {
      headers: {
        'Cache-Control': 's-maxage=60, stale-while-revalidate=300'
      }
    })
  } catch (error) {
    console.error('Error fetching awards:', error)
    return NextResponse.json(
      { error: 'Failed to fetch awards' },
      { status: 500 }
    )
  }
}

// POST /api/awards - Create new award (Admin only)
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || (session.user.role !== 'admin' && session.user.role !== 'super_admin')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json()

    // Validate required fields
    if (!data.title || !data.description || !data.awardedBy || !data.date || !data.category) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const supabase = getSupabase()
    const { data: award, error } = await supabase
      .from('awards')
      .insert(clientToRow(data))
      .select('*')
      .single()

    if (error) throw error

    return NextResponse.json(rowToClient(award), {
      status: 201,
      headers: {
        'Cache-Control': 'no-cache'
      }
    })
  } catch (error) {
    console.error('Error creating award:', error)
    return NextResponse.json(
      { error: 'Failed to create award' },
      { status: 500 }
    )
  }
}

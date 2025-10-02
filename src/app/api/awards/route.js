import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Award from '@/models/Award'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

// GET /api/awards - Get all awards
export async function GET() {
  try {
    await connectDB()
    
    const awards = await Award.find({ isActive: true })
      .sort({ order: 1, date: -1 })
      .lean()
      .maxTimeMS(5000)

    return NextResponse.json(awards, {
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

    await connectDB()
    
    const data = await request.json()
    
    // Validate required fields
    if (!data.title || !data.description || !data.awardedBy || !data.date || !data.category) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Convert date string to Date object
    if (data.date) {
      data.date = new Date(data.date)
    }

    const award = new Award(data)
    await award.save()

    return NextResponse.json(award, { 
      status: 201,
      headers: {
        'Cache-Control': 'no-cache'
      }
    })
  } catch (error) {
    console.error('Error creating award:', error)
    
    if (error.name === 'ValidationError') {
      return NextResponse.json(
        { error: 'Validation error', details: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create award' },
      { status: 500 }
    )
  }
}
import { NextResponse } from 'next/server'
import connectToDatabase from '@/lib/mongodb'
import Experience from '@/models/Experience'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

// GET /api/experiences - Get all experiences
export async function GET() {
  try {
    // console.log('🔌 API: Connecting to database...')
    await connectToDatabase()
    // console.log('✅ API: Database connected')
    
    // console.log('🔍 API: Fetching experiences...')
    const experiences = await Experience.find({ isActive: true })
      .sort({ order: 1, startDate: -1 })
      .lean()
      .maxTimeMS(5000)

    // console.log(`📦 API: Found ${experiences.length} experiences`)
    // console.log('📄 API: Experiences data:', JSON.stringify(experiences, null, 2))

    return NextResponse.json(experiences, {
      headers: {
        'Cache-Control': 's-maxage=60, stale-while-revalidate=300'
      }
    })
  } catch (error) {
    console.error('❌ API: Error fetching experiences:', error)
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

    await connectToDatabase()
    
    const data = await request.json()
    
    // Validate required fields
    if (!data.company || !data.position || !data.location || !data.startDate || !data.description) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Convert date strings to Date objects
    if (data.startDate) {
      data.startDate = new Date(data.startDate)
    }
    if (data.endDate) {
      data.endDate = new Date(data.endDate)
    }

    const experience = new Experience(data)
    await experience.save()

    return NextResponse.json(experience, { 
      status: 201,
      headers: {
        'Cache-Control': 'no-cache'
      }
    })
  } catch (error) {
    console.error('Error creating experience:', error)
    
    if (error.name === 'ValidationError') {
      return NextResponse.json(
        { error: 'Validation error', details: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create experience' },
      { status: 500 }
    )
  }
}
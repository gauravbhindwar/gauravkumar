import { NextResponse } from 'next/server'
import connectToDatabase from '@/lib/mongodb'
import Experience from '@/models/Experience'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

// GET /api/experiences/[id] - Get single experience
export async function GET(request, { params }) {
  try {
    await connectToDatabase()
    
    const { id } = await params
    const experience = await Experience.findById(id).lean()
    
    if (!experience) {
      return NextResponse.json({ error: 'Experience not found' }, { status: 404 })
    }

    return NextResponse.json(experience)
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

    await connectToDatabase()
    
    const { id } = await params
    const data = await request.json()
    
    // Convert date strings to Date objects
    if (data.startDate) {
      data.startDate = new Date(data.startDate)
    }
    if (data.endDate) {
      data.endDate = new Date(data.endDate)
    }

    const experience = await Experience.findByIdAndUpdate(
      id,
      data,
      { new: true, runValidators: true }
    )

    if (!experience) {
      return NextResponse.json({ error: 'Experience not found' }, { status: 404 })
    }

    return NextResponse.json(experience, {
      headers: {
        'Cache-Control': 'no-cache'
      }
    })
  } catch (error) {
    console.error('Error updating experience:', error)
    
    if (error.name === 'ValidationError') {
      return NextResponse.json(
        { error: 'Validation error', details: error.message },
        { status: 400 }
      )
    }

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

    await connectToDatabase()
    
    const { id } = await params
    const experience = await Experience.findByIdAndDelete(id)

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
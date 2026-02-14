import { NextResponse } from 'next/server'
import connectToDatabase from '@/lib/mongodb'
import Achievement from '@/models/Achievement'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

// GET /api/achievements/[id] - Get single achievement
export async function GET(request, { params }) {
  try {
    await connectToDatabase()
    
    const { id } = await params
    const achievement = await Achievement.findById(id).lean()
    
    if (!achievement) {
      return NextResponse.json({ error: 'Achievement not found' }, { status: 404 })
    }

    return NextResponse.json(achievement)
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

    await connectToDatabase()
    
    const { id } = await params
    const data = await request.json()
    
    // Convert date string to Date object
    if (data.date) {
      data.date = new Date(data.date)
    }

    const achievement = await Achievement.findByIdAndUpdate(
      id,
      data,
      { new: true, runValidators: true }
    )

    if (!achievement) {
      return NextResponse.json({ error: 'Achievement not found' }, { status: 404 })
    }

    return NextResponse.json(achievement, {
      headers: {
        'Cache-Control': 'no-cache'
      }
    })
  } catch (error) {
    console.error('Error updating achievement:', error)
    
    if (error.name === 'ValidationError') {
      return NextResponse.json(
        { error: 'Validation error', details: error.message },
        { status: 400 }
      )
    }

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

    await connectToDatabase()
    
    const { id } = await params
    const achievement = await Achievement.findByIdAndDelete(id)

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
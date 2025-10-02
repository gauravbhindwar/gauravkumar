import { NextResponse } from 'next/server'
import connectToDatabase from '@/lib/mongodb'
import Award from '@/models/Award'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

// GET /api/awards/[id] - Get single award
export async function GET(request, { params }) {
  try {
    await connectToDatabase()
    
    const award = await Award.findById(params.id).lean()
    
    if (!award) {
      return NextResponse.json({ error: 'Award not found' }, { status: 404 })
    }

    return NextResponse.json(award)
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

    await connectToDatabase()
    
    const data = await request.json()
    
    // Convert date string to Date object
    if (data.date) {
      data.date = new Date(data.date)
    }

    const award = await Award.findByIdAndUpdate(
      params.id,
      data,
      { new: true, runValidators: true }
    )

    if (!award) {
      return NextResponse.json({ error: 'Award not found' }, { status: 404 })
    }

    return NextResponse.json(award, {
      headers: {
        'Cache-Control': 'no-cache'
      }
    })
  } catch (error) {
    console.error('Error updating award:', error)
    
    if (error.name === 'ValidationError') {
      return NextResponse.json(
        { error: 'Validation error', details: error.message },
        { status: 400 }
      )
    }

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

    await connectToDatabase()
    
    const award = await Award.findByIdAndDelete(params.id)

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
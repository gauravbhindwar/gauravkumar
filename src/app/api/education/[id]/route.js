import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Education from '@/models/Education';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(request, { params }) {
  try {
    await connectToDatabase();
    
    const education = await Education.findById(params.id).lean();
    
    if (!education) {
      return NextResponse.json(
        { success: false, error: 'Education entry not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, data: education });
  } catch (error) {
    console.error('Education API GET Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch education entry' },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectToDatabase();
    
    const data = await request.json();
    const education = await Education.findByIdAndUpdate(
      params.id,
      data,
      { new: true, runValidators: true }
    );
    
    if (!education) {
      return NextResponse.json(
        { success: false, error: 'Education entry not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, data: education });
  } catch (error) {
    console.error('Education API PUT Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update education entry' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectToDatabase();
    
    const education = await Education.findByIdAndDelete(params.id);
    
    if (!education) {
      return NextResponse.json(
        { success: false, error: 'Education entry not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, message: 'Education entry deleted successfully' });
  } catch (error) {
    console.error('Education API DELETE Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete education entry' },
      { status: 500 }
    );
  }
}
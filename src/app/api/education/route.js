import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Education from '@/models/Education';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET() {
  try {
    await connectDB();
    
    const education = await Education.find({ isActive: true })
      .sort({ order: 1, endDate: -1 })
      .lean();
    
    return NextResponse.json({ success: true, data: education });
  } catch (error) {
    console.error('Education API GET Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch education data' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();
    
    const data = await request.json();
    const education = await Education.create(data);
    
    return NextResponse.json({ success: true, data: education }, { status: 201 });
  } catch (error) {
    console.error('Education API POST Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create education entry' },
      { status: 500 }
    );
  }
}
import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Profile from '@/models/Profile';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET() {
  try {
    await connectToDatabase();
    
    const profile = await Profile.findOne({ isActive: true }).lean();
    
    return NextResponse.json({ success: true, data: profile });
  } catch (error) {
    console.error('Profile API GET Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch profile data' },
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

    await connectToDatabase();
    
    const data = await request.json();
    
    // Check if profile already exists
    const existingProfile = await Profile.findOne({ isActive: true });
    
    if (existingProfile) {
      // Update existing profile
      const profile = await Profile.findByIdAndUpdate(
        existingProfile._id,
        data,
        { new: true, runValidators: true }
      );
      return NextResponse.json({ success: true, data: profile });
    } else {
      // Create new profile
      const profile = await Profile.create(data);
      return NextResponse.json({ success: true, data: profile }, { status: 201 });
    }
  } catch (error) {
    console.error('Profile API POST Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save profile data' },
      { status: 500 }
    );
  }
}
import { NextResponse } from 'next/server';
import getSupabase from '@/lib/supabase';
import { rowToClient, clientToRow } from '@/lib/dbMapper';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET() {
  try {
    const supabase = getSupabase();

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('is_active', true)
      .maybeSingle();

    return NextResponse.json({ success: true, data: rowToClient(profile) });
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

    const data = await request.json();
    const supabase = getSupabase();

    // Check if profile already exists
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('id')
      .eq('is_active', true)
      .maybeSingle();

    if (existingProfile) {
      // Update existing profile
      const { data: profile, error } = await supabase
        .from('profiles')
        .update(clientToRow(data))
        .eq('id', existingProfile.id)
        .select('*')
        .single();
      if (error) throw error;
      return NextResponse.json({ success: true, data: rowToClient(profile) });
    }

    // Create new profile
    const { data: profile, error } = await supabase
      .from('profiles')
      .insert(clientToRow(data))
      .select('*')
      .single();
    if (error) throw error;
    return NextResponse.json({ success: true, data: rowToClient(profile) }, { status: 201 });
  } catch (error) {
    console.error('Profile API POST Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save profile data' },
      { status: 500 }
    );
  }
}

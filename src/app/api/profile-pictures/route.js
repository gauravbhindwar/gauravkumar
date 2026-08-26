import getSupabase from '@/lib/supabase';
import { rowsToClient } from '@/lib/dbMapper';
import { syncContactField } from '@/lib/contactSync';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

async function checkAdminAuth() {
  const session = await getServerSession(authOptions);
  return !!session?.user && (session.user.role === 'admin' || session.user.role === 'super_admin');
}

export async function GET() {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('profile_pictures')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return NextResponse.json({ profilePictures: rowsToClient(data) });
  } catch (error) {
    console.error('Error fetching profile pictures:', error);
    return NextResponse.json({ error: 'Failed to fetch profile pictures' }, { status: 500 });
  }
}

// Register a picture after it's already been uploaded via /api/upload
export async function POST(request) {
  try {
    if (!(await checkAdminAuth())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { url } = await request.json();
    if (!url) {
      return NextResponse.json({ error: 'url is required' }, { status: 400 });
    }

    const supabase = getSupabase();

    // First picture ever uploaded becomes active automatically.
    const { count } = await supabase.from('profile_pictures').select('id', { count: 'exact', head: true });
    const isFirst = !count;

    const { data: picture, error } = await supabase
      .from('profile_pictures')
      .insert({ url, is_active: isFirst })
      .select('*')
      .single();
    if (error) throw error;

    if (isFirst) {
      await syncContactField('home_image', picture.url);
    }

    return NextResponse.json({ profilePicture: rowsToClient([picture])[0] }, { status: 201 });
  } catch (error) {
    console.error('Error creating profile picture:', error);
    return NextResponse.json({ error: 'Failed to create profile picture' }, { status: 500 });
  }
}

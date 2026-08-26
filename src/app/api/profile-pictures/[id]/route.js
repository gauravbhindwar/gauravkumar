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

// Make this picture the one shown on the public site
export async function PUT(request, { params }) {
  try {
    if (!(await checkAdminAuth())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const supabase = getSupabase();

    await supabase.from('profile_pictures').update({ is_active: false }).eq('is_active', true);
    const { data: picture, error } = await supabase
      .from('profile_pictures')
      .update({ is_active: true })
      .eq('id', id)
      .select('*')
      .maybeSingle();

    if (error) throw error;
    if (!picture) {
      return NextResponse.json({ error: 'Profile picture not found' }, { status: 404 });
    }

    await syncContactField('home_image', picture.url);

    return NextResponse.json({ profilePicture: rowsToClient([picture])[0] });
  } catch (error) {
    console.error('Error activating profile picture:', error);
    return NextResponse.json({ error: 'Failed to activate profile picture' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    if (!(await checkAdminAuth())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const supabase = getSupabase();

    const { data: picture } = await supabase.from('profile_pictures').select('is_active').eq('id', id).maybeSingle();
    if (!picture) {
      return NextResponse.json({ error: 'Profile picture not found' }, { status: 404 });
    }
    if (picture.is_active) {
      return NextResponse.json(
        { error: 'This is the active picture - make another one active before deleting it' },
        { status: 400 }
      );
    }

    await supabase.from('profile_pictures').delete().eq('id', id);
    return NextResponse.json({ message: 'Profile picture deleted' });
  } catch (error) {
    console.error('Error deleting profile picture:', error);
    return NextResponse.json({ error: 'Failed to delete profile picture' }, { status: 500 });
  }
}

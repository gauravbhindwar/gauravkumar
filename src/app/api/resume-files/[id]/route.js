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

// Make this file the one shown on the public site
export async function PUT(request, { params }) {
  try {
    if (!(await checkAdminAuth())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const supabase = getSupabase();

    await supabase.from('resume_files').update({ is_active: false }).eq('is_active', true);
    const { data: file, error } = await supabase
      .from('resume_files')
      .update({ is_active: true })
      .eq('id', id)
      .select('*')
      .maybeSingle();

    if (error) throw error;
    if (!file) {
      return NextResponse.json({ error: 'Resume file not found' }, { status: 404 });
    }

    await syncContactField('resume_link', file.url);

    return NextResponse.json({ resumeFile: rowsToClient([file])[0] });
  } catch (error) {
    console.error('Error activating resume file:', error);
    return NextResponse.json({ error: 'Failed to activate resume file' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    if (!(await checkAdminAuth())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const supabase = getSupabase();

    const { data: file } = await supabase.from('resume_files').select('is_active').eq('id', id).maybeSingle();
    if (!file) {
      return NextResponse.json({ error: 'Resume file not found' }, { status: 404 });
    }
    if (file.is_active) {
      return NextResponse.json(
        { error: 'This is the active resume - make another one active before deleting it' },
        { status: 400 }
      );
    }

    await supabase.from('resume_files').delete().eq('id', id);
    return NextResponse.json({ message: 'Resume file deleted' });
  } catch (error) {
    console.error('Error deleting resume file:', error);
    return NextResponse.json({ error: 'Failed to delete resume file' }, { status: 500 });
  }
}

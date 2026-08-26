import getSupabase from '@/lib/supabase';
import { rowsToClient, clientToRow } from '@/lib/dbMapper';
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
      .from('resume_files')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return NextResponse.json({ resumeFiles: rowsToClient(data) });
  } catch (error) {
    console.error('Error fetching resume files:', error);
    return NextResponse.json({ error: 'Failed to fetch resume files' }, { status: 500 });
  }
}

// Register a resume file after it's already been uploaded via /api/upload
export async function POST(request) {
  try {
    if (!(await checkAdminAuth())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    if (!data.label || !data.url) {
      return NextResponse.json({ error: 'Label and url are required' }, { status: 400 });
    }

    const supabase = getSupabase();

    // First file ever uploaded becomes active automatically - otherwise
    // there'd be nothing for the public site to show.
    const { count } = await supabase.from('resume_files').select('id', { count: 'exact', head: true });
    const isFirst = !count;

    const { data: file, error } = await supabase
      .from('resume_files')
      .insert({ ...clientToRow(data), is_active: isFirst })
      .select('*')
      .single();
    if (error) throw error;

    if (isFirst) {
      await syncContactField('resume_link', file.url);
    }

    return NextResponse.json({ resumeFile: rowsToClient([file])[0] }, { status: 201 });
  } catch (error) {
    console.error('Error creating resume file:', error);
    return NextResponse.json({ error: 'Failed to create resume file' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import getSupabase from '@/lib/supabase';
import { rowsToClient, rowToClient, clientToRow } from '@/lib/dbMapper';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET() {
  try {
    const supabase = getSupabase();

    const { data: education, error } = await supabase
      .from('education')
      .select('*')
      .eq('is_active', true)
      .order('order', { ascending: true })
      .order('end_date', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ success: true, data: rowsToClient(education) });
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
    if (!session || (session.user.role !== 'admin' && session.user.role !== 'super_admin')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const data = await request.json();
    const supabase = getSupabase();
    const { data: education, error } = await supabase
      .from('education')
      .insert(clientToRow(data))
      .select('*')
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data: rowToClient(education) }, { status: 201 });
  } catch (error) {
    console.error('Education API POST Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create education entry' },
      { status: 500 }
    );
  }
}

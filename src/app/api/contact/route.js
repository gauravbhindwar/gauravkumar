import getSupabase from '@/lib/supabase';
import { rowToClient, clientToRow } from '@/lib/dbMapper';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';

export async function GET() {
  try {
    const supabase = getSupabase();
    const { data: contact } = await supabase
      .from('contact')
      .select('*')
      .limit(1)
      .maybeSingle();

    if (!contact) {
      // Fallback to static data if no Supabase data exists
      const staticData = await import('@/data/contact.json');
      return NextResponse.json(staticData.default);
    }

    return NextResponse.json(rowToClient(contact));
  } catch (error) {
    console.error('Error fetching contact information:', error);

    // Fallback to static data on error
    try {
      const staticData = await import('@/data/contact.json');
      return NextResponse.json(staticData.default);
    } catch (fallbackError) {
      return NextResponse.json({ error: 'Failed to fetch contact information' }, { status: 500 });
    }
  }
}

async function upsertContact(data) {
  const supabase = getSupabase();
  const { data: existing } = await supabase.from('contact').select('id').limit(1).maybeSingle();

  if (existing) {
    const { data: contact, error } = await supabase
      .from('contact')
      .update(clientToRow(data))
      .eq('id', existing.id)
      .select('*')
      .single();
    if (error) throw error;
    return contact;
  }

  const { data: contact, error } = await supabase
    .from('contact')
    .insert(clientToRow(data))
    .select('*')
    .single();
  if (error) throw error;
  return contact;
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();

    // Create or update contact information (there should only be one)
    const contact = await upsertContact(data);

    return NextResponse.json(rowToClient(contact));
  } catch (error) {
    console.error('Error saving contact:', error);
    return NextResponse.json({ error: 'Failed to save contact' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();

    const contact = await upsertContact(data);

    return NextResponse.json(rowToClient(contact));
  } catch (error) {
    console.error('Error updating contact:', error);
    return NextResponse.json({ error: 'Failed to update contact' }, { status: 500 });
  }
}

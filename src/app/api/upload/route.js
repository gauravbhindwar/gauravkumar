import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import getSupabase, { STORAGE_BUCKET } from '@/lib/supabase';

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);

    // Check for admin role
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.formData();
    const file = data.get('file');

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const extension = file.name.includes('.') ? file.name.split('.').pop() : 'bin';
    const path = `portfolio/${crypto.randomUUID()}.${extension}`;

    const supabase = getSupabase();
    const { error: uploadError } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(path, buffer, {
        contentType: file.type || 'application/octet-stream',
        upsert: false,
        // Paths are UUID-named and never reused, so the object is immutable -
        // safe to cache at the CDN/browser for a year.
        cacheControl: '31536000',
      });

    if (uploadError) throw uploadError;

    const { data: publicUrlData } = supabase.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(path);

    return NextResponse.json({
      success: true,
      url: publicUrlData.publicUrl
    });

  } catch (error) {
    console.error('Error uploading to Supabase Storage:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}

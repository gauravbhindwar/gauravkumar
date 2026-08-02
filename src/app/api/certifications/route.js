import getSupabase from '@/lib/supabase';
import { rowToClient, rowsToClient, clientToRow } from '@/lib/dbMapper';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET() {
  try {
    const supabase = getSupabase();

    const { data: certifications, error } = await supabase
      .from('certifications')
      .select('*')
      .order('order', { ascending: true })
      .order('title', { ascending: true });

    if (error) throw error;

    if (!certifications || certifications.length === 0) {
      // Fallback to static data if no Supabase data exists
      const staticData = await import('@/data/certifications.json');

      const sortedCertifications = [...staticData.default.certifications].sort((a, b) => {
        const orderA = a.order !== undefined && a.order !== null ? a.order : 999;
        const orderB = b.order !== undefined && b.order !== null ? b.order : 999;

        if (orderA !== orderB) {
          return orderA - orderB;
        }

        return a.title.localeCompare(b.title);
      });

      const response = NextResponse.json({ certifications: sortedCertifications });
      response.headers.set('Cache-Control', 'public, max-age=300, s-maxage=600');
      return response;
    }

    const response = NextResponse.json({ certifications: rowsToClient(certifications) });
    response.headers.set('Cache-Control', 'public, max-age=300, s-maxage=600');
    return response;
  } catch (error) {
    console.error('Error fetching certifications:', error);

    // Fallback to static data on error
    try {
      const staticData = await import('@/data/certifications.json');
      const sortedCertifications = [...staticData.default.certifications].sort((a, b) => {
        const orderA = a.order !== undefined && a.order !== null ? a.order : 999;
        const orderB = b.order !== undefined && b.order !== null ? b.order : 999;

        if (orderA !== orderB) {
          return orderA - orderB;
        }

        return a.title.localeCompare(b.title);
      });
      return NextResponse.json({ certifications: sortedCertifications });
    } catch (fallbackError) {
      return NextResponse.json({ error: 'Failed to fetch certifications' }, { status: 500 });
    }
  }
}

// Helper function to check admin authentication
async function checkAdminAuth() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || session.user.role !== 'admin') {
    return false;
  }
  return true;
}

// Create new certification (Admin only)
export async function POST(request) {
  try {
    const isAdmin = await checkAdminAuth();
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const certificationData = await request.json();

    // Validate required fields
    if (!certificationData.title || !certificationData.issuer) {
      return NextResponse.json(
        { error: 'Title and issuer are required' },
        { status: 400 }
      );
    }

    const supabase = getSupabase();
    const { data: certification, error } = await supabase
      .from('certifications')
      .insert(clientToRow(certificationData))
      .select('*')
      .single();

    if (error) throw error;

    return NextResponse.json({
      message: 'Certification created successfully',
      certification: rowToClient(certification)
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating certification:', error);
    return NextResponse.json(
      { error: 'Failed to create certification' },
      { status: 500 }
    );
  }
}

// Update certification (Admin only)
export async function PUT(request) {
  try {
    const isAdmin = await checkAdminAuth();
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id, ...updateData } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: 'Certification ID is required' },
        { status: 400 }
      );
    }

    const supabase = getSupabase();
    const { data: certification, error } = await supabase
      .from('certifications')
      .update(clientToRow(updateData))
      .eq('id', id)
      .select('*')
      .maybeSingle();

    if (error) throw error;
    if (!certification) {
      return NextResponse.json(
        { error: 'Certification not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Certification updated successfully',
      certification: rowToClient(certification)
    });

  } catch (error) {
    console.error('Error updating certification:', error);
    return NextResponse.json(
      { error: 'Failed to update certification' },
      { status: 500 }
    );
  }
}

// Delete certification (Admin only)
export async function DELETE(request) {
  try {
    const isAdmin = await checkAdminAuth();
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Certification ID is required' },
        { status: 400 }
      );
    }

    const supabase = getSupabase();
    const { data: certification } = await supabase
      .from('certifications')
      .delete()
      .eq('id', id)
      .select('id')
      .maybeSingle();

    if (!certification) {
      return NextResponse.json(
        { error: 'Certification not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Certification deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting certification:', error);
    return NextResponse.json(
      { error: 'Failed to delete certification' },
      { status: 500 }
    );
  }
}

import getSupabase from '@/lib/supabase';
import { rowToClient, clientToRow } from '@/lib/dbMapper';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// Projects keep their old Mongoose-era `id` field as the app-facing slug
// (now the `slug` column); the Postgres uuid primary key is exposed as `_id`.
function projectToClient(row) {
  if (!row) return row;
  const { slug, github, live, ...rest } = rowToClient(row);
  return { ...rest, id: slug, github, live, githubUrl: github, liveUrl: live };
}

function projectFromClient(data) {
  const { id, _id, githubUrl, liveUrl, ...rest } = data;
  const row = clientToRow(rest);
  if (id !== undefined) row.slug = id;
  // Frontend forms use githubUrl/liveUrl; the column names are github/live.
  if (githubUrl !== undefined) row.github = githubUrl;
  if (liveUrl !== undefined) row.live = liveUrl;
  return row;
}

export async function GET() {
  try {
    const supabase = getSupabase();

    const { data: projects, error } = await supabase
      .from('projects')
      .select('*')
      .order('order', { ascending: true })
      .order('slug', { ascending: true })
      .order('created_at', { ascending: false });

    if (error) throw error;

    if (!projects || projects.length === 0) {
      // Fallback to static data if no Supabase data exists
      const staticData = await import('@/data/projects.json');

      // Sort the static data by order field with proper secondary sorts
      const sortedProjects = [...staticData.default.projects].sort((a, b) => {
        const orderA = a.order !== undefined && a.order !== null ? a.order : 999;
        const orderB = b.order !== undefined && b.order !== null ? b.order : 999;

        if (orderA !== orderB) {
          return orderA - orderB;
        }

        return a.id.localeCompare(b.id);
      });

      const response = NextResponse.json({ projects: sortedProjects });
      response.headers.set('Cache-Control', 'public, max-age=600, s-maxage=1200');
      return response;
    }

    const response = NextResponse.json({ projects: projects.map(projectToClient) });
    response.headers.set('Cache-Control', 'public, max-age=60, s-maxage=300, stale-while-revalidate=60');
    response.headers.set('ETag', `"${Date.now()}"`);
    return response;
  } catch (error) {
    console.error('Error fetching projects:', error);

    // Fallback to static data on error
    try {
      const staticData = await import('@/data/projects.json');
      const sortedProjects = [...staticData.default.projects].sort((a, b) => {
        const orderA = a.order !== undefined && a.order !== null ? a.order : 999;
        const orderB = b.order !== undefined && b.order !== null ? b.order : 999;

        if (orderA !== orderB) {
          return orderA - orderB;
        }

        return a.id.localeCompare(b.id);
      });

      const response = NextResponse.json({ projects: sortedProjects });
      response.headers.set('Cache-Control', 'public, max-age=300, s-maxage=600');
      return response;
    } catch (fallbackError) {
      return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
    }
  }
}

// Helper function to check admin authentication
async function checkAdminAuth() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return false;
    }

    if (session.user.role !== 'admin' && session.user.role !== 'super_admin') {
      return false;
    }

    return true;
  } catch (error) {
    console.error('Auth check error:', error);
    return false;
  }
}

// Create new project (Admin only)
export async function POST(request) {
  try {
    const isAdmin = await checkAdminAuth();
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const projectData = await request.json();

    // Validate required fields
    if (!projectData.id || !projectData.title || !projectData.description) {
      return NextResponse.json(
        { error: 'Missing required fields: id, title, description' },
        { status: 400 }
      );
    }

    const supabase = getSupabase();

    // Check if project with this slug already exists
    const { data: existingProject } = await supabase
      .from('projects')
      .select('id')
      .eq('slug', projectData.id)
      .maybeSingle();

    if (existingProject) {
      return NextResponse.json(
        { error: 'Project with this ID already exists' },
        { status: 409 }
      );
    }

    const { data: project, error } = await supabase
      .from('projects')
      .insert(projectFromClient(projectData))
      .select('*')
      .single();

    if (error) throw error;

    return NextResponse.json({
      message: 'Project created successfully',
      project: projectToClient(project)
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    );
  }
}

// Update project (Admin only)
export async function PUT(request) {
  try {
    const isAdmin = await checkAdminAuth();
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id, ...updateData } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: 'Project ID is required' },
        { status: 400 }
      );
    }

    const supabase = getSupabase();

    const { data: project, error } = await supabase
      .from('projects')
      .update(projectFromClient(updateData))
      .eq('slug', id)
      .select('*')
      .maybeSingle();

    if (error) {
      return NextResponse.json(
        { error: 'Invalid project data: ' + error.message },
        { status: 400 }
      );
    }

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    // Return success response with cache invalidation headers
    const response = NextResponse.json({
      message: 'Project updated successfully',
      project: projectToClient(project)
    });

    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    response.headers.set('ETag', `"${Date.now()}"`);

    return response;

  } catch (error) {
    console.error('Error updating project:', error);
    return NextResponse.json(
      { error: 'Failed to update project' },
      { status: 500 }
    );
  }
}

// Delete project (Admin only)
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
        { error: 'Project ID is required' },
        { status: 400 }
      );
    }

    const supabase = getSupabase();

    const { data: project } = await supabase
      .from('projects')
      .delete()
      .eq('slug', id)
      .select('id')
      .maybeSingle();

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Project deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json(
      { error: 'Failed to delete project' },
      { status: 500 }
    );
  }
}

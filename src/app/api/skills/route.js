import getSupabase from '@/lib/supabase';
import { rowToClient, rowsToClient, clientToRow } from '@/lib/dbMapper';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET() {
  try {
    const supabase = getSupabase();

    const [{ data: skills, error: skillsError }, { data: courses, error: coursesError }] = await Promise.all([
      supabase.from('skills').select('*'),
      supabase.from('courses').select('*')
    ]);

    if (skillsError) throw skillsError;
    if (coursesError) throw coursesError;

    if (!skills || skills.length === 0) {
      // Fallback to static data if no Supabase data exists
      const staticData = await import('@/data/skills.json');
      return NextResponse.json(staticData.default);
    }

    // Define the category order we want
    const categoryOrder = [
      "Languages",
      "Web Development",
      "Data Science & ML",
      "Tools & Platforms"
    ];

    const clientSkills = rowsToClient(skills);
    const clientCourses = rowsToClient(courses);

    // Group skills by category
    const skillsByCategory = {};
    for (const skill of clientSkills) {
      if (!skillsByCategory[skill.category]) {
        skillsByCategory[skill.category] = [];
      }
      skillsByCategory[skill.category].push(skill);
    }

    // Build categories array in the specified order
    const categories = [];
    for (const category of categoryOrder) {
      if (skillsByCategory[category]) {
        categories.push({
          name: category,
          skills: skillsByCategory[category]
        });
      }
    }

    // Restructure courses by type
    const coursesByType = {
      current: clientCourses.filter(course => course.type === 'current'),
      completed: clientCourses.filter(course => course.type === 'completed'),
      paused: clientCourses.filter(course => course.type === 'paused'),
      planned: clientCourses.filter(course => course.type === 'planned')
    };

    // Set cache headers
    const response = NextResponse.json({
      categories,
      courses: coursesByType
    });
    response.headers.set('Cache-Control', 'public, max-age=600, s-maxage=1200');
    return response;
  } catch (error) {
    console.error('Error fetching skills:', error);

    // Fallback to static data on error
    try {
      const staticData = await import('@/data/skills.json');
      return NextResponse.json(staticData.default);
    } catch (fallbackError) {
      return NextResponse.json({ error: 'Failed to fetch skills' }, { status: 500 });
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

// Create new skill (Admin only)
export async function POST(request) {
  try {
    const isAdmin = await checkAdminAuth();
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { type, ...skillData } = await request.json();

    if (!type || (type !== 'skill' && type !== 'course')) {
      return NextResponse.json(
        { error: 'Type must be either "skill" or "course"' },
        { status: 400 }
      );
    }

    const supabase = getSupabase();
    let newItem;

    if (type === 'skill') {
      if (!skillData.name || !skillData.category) {
        return NextResponse.json(
          { error: 'Name and category are required for skills' },
          { status: 400 }
        );
      }
      const { data, error } = await supabase
        .from('skills')
        .insert(clientToRow(skillData))
        .select('*')
        .single();
      if (error) throw error;
      newItem = data;
    } else {
      if (!skillData.name || !skillData.courseType) {
        return NextResponse.json(
          { error: 'Name and course type are required for courses' },
          { status: 400 }
        );
      }
      // Map courseType to type for the Course table
      skillData.type = skillData.courseType;
      delete skillData.courseType;
      const { data, error } = await supabase
        .from('courses')
        .insert(clientToRow(skillData))
        .select('*')
        .single();
      if (error) throw error;
      newItem = data;
    }

    return NextResponse.json({
      message: `${type} created successfully`,
      [type]: rowToClient(newItem)
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating skill/course:', error);
    return NextResponse.json(
      { error: 'Failed to create item' },
      { status: 500 }
    );
  }
}

// Update skill or course (Admin only)
export async function PUT(request) {
  try {
    const isAdmin = await checkAdminAuth();
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { type, id, ...updateData } = await request.json();

    if (!type || !id) {
      return NextResponse.json(
        { error: 'Type and ID are required' },
        { status: 400 }
      );
    }

    if (type !== 'skill' && type !== 'course') {
      return NextResponse.json(
        { error: 'Invalid type' },
        { status: 400 }
      );
    }

    // Map courseType to type for the Course table if present
    if (updateData.courseType) {
      updateData.type = updateData.courseType;
      delete updateData.courseType;
    }

    const supabase = getSupabase();
    const table = type === 'skill' ? 'skills' : 'courses';
    const { data: updatedItem, error } = await supabase
      .from(table)
      .update(clientToRow(updateData))
      .eq('id', id)
      .select('*')
      .maybeSingle();

    if (error) throw error;
    if (!updatedItem) {
      return NextResponse.json(
        { error: 'Item not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: `${type} updated successfully`,
      [type]: rowToClient(updatedItem)
    });

  } catch (error) {
    console.error('Error updating skill/course:', error);
    return NextResponse.json(
      { error: 'Failed to update item' },
      { status: 500 }
    );
  }
}

// Delete skill or course (Admin only)
export async function DELETE(request) {
  try {
    const isAdmin = await checkAdminAuth();
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const id = searchParams.get('id');

    if (!type || !id) {
      return NextResponse.json(
        { error: 'Type and ID are required' },
        { status: 400 }
      );
    }

    if (type !== 'skill' && type !== 'course') {
      return NextResponse.json(
        { error: 'Invalid type' },
        { status: 400 }
      );
    }

    const supabase = getSupabase();
    const table = type === 'skill' ? 'skills' : 'courses';
    const { data: deletedItem } = await supabase
      .from(table)
      .delete()
      .eq('id', id)
      .select('id')
      .maybeSingle();

    if (!deletedItem) {
      return NextResponse.json(
        { error: 'Item not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: `${type} deleted successfully`
    });

  } catch (error) {
    console.error('Error deleting skill/course:', error);
    return NextResponse.json(
      { error: 'Failed to delete item' },
      { status: 500 }
    );
  }
}

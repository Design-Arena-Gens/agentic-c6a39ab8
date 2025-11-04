import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getUserFromRequest } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams
    const category = searchParams.get('category')
    const level = searchParams.get('level')
    const instructorId = searchParams.get('instructorId')

    const where: any = { published: true }
    if (category) where.category = category
    if (level) where.level = level
    if (instructorId) where.instructorId = instructorId

    const courses = await prisma.course.findMany({
      where,
      include: {
        instructor: {
          select: { id: true, name: true, avatar: true },
        },
        _count: {
          select: { enrollments: true, reviews: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(courses)
  } catch (error) {
    console.error('Fetch courses error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = getUserFromRequest(req)
    if (!user || (user.role !== 'TUTOR' && user.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await req.json()
    const { title, description, category, level, price } = data

    if (!title || !description || !category) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const course = await prisma.course.create({
      data: {
        title,
        description,
        category,
        level: level || 'BEGINNER',
        price: price || 0,
        instructorId: user.userId,
      },
      include: {
        instructor: {
          select: { id: true, name: true, avatar: true },
        },
      },
    })

    return NextResponse.json(course)
  } catch (error) {
    console.error('Create course error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

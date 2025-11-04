import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getUserFromRequest } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    const user = getUserFromRequest(req)
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const [
      totalUsers,
      totalCourses,
      totalEnrollments,
      totalRevenue,
      activeTickets,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.course.count(),
      prisma.enrollment.count(),
      prisma.course.aggregate({ _sum: { price: true } }),
      prisma.supportTicket.count({ where: { status: { in: ['OPEN', 'IN_PROGRESS'] } } }),
    ])

    const stats = {
      totalUsers,
      totalCourses,
      totalEnrollments,
      totalRevenue: totalRevenue._sum.price || 0,
      activeTickets,
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Fetch stats error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

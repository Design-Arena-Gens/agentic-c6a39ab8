import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getUserFromRequest } from '@/lib/auth'

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = getUserFromRequest(req)
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await req.json()

    // If setting as active, deactivate all others
    if (data.active) {
      await prisma.aIConfig.updateMany({
        where: { active: true, id: { not: params.id } },
        data: { active: false },
      })
    }

    const config = await prisma.aIConfig.update({
      where: { id: params.id },
      data,
    })

    return NextResponse.json(config)
  } catch (error) {
    console.error('Update AI config error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = getUserFromRequest(req)
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await prisma.aIConfig.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: 'Config deleted' })
  } catch (error) {
    console.error('Delete AI config error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

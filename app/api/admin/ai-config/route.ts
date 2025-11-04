import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getUserFromRequest } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    const user = getUserFromRequest(req)
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const configs = await prisma.aIConfig.findMany({
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(configs)
  } catch (error) {
    console.error('Fetch AI configs error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = getUserFromRequest(req)
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { provider, model, apiKey, temperature, maxTokens, active } = await req.json()

    if (!provider || !model || !apiKey) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // If setting as active, deactivate all others
    if (active) {
      await prisma.aIConfig.updateMany({
        where: { active: true },
        data: { active: false },
      })
    }

    const config = await prisma.aIConfig.create({
      data: {
        provider,
        model,
        apiKey,
        temperature: temperature || 0.7,
        maxTokens: maxTokens || 1000,
        active: active || false,
      },
    })

    return NextResponse.json(config)
  } catch (error) {
    console.error('Create AI config error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

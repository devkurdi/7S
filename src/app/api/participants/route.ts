import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, avatar } = body

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 })
    }

    const participant = await db.participant.create({
      data: { name, avatar: avatar || null },
    })

    return NextResponse.json(participant, { status: 201 })
  } catch (error) {
    console.error('Create participant error:', error)
    return NextResponse.json({ error: 'Failed to create participant' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (id) {
      const participant = await db.participant.findUnique({
        where: { id },
        include: {
          answers: {
            include: { question: { include: { category: true } } },
          },
        },
      })
      if (!participant) {
        return NextResponse.json({ error: 'Participant not found' }, { status: 404 })
      }
      return NextResponse.json(participant)
    }

    const participants = await db.participant.findMany({
      include: { _count: { select: { answers: true } } },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(participants)
  } catch (error) {
    console.error('Get participants error:', error)
    return NextResponse.json({ error: 'Failed to fetch participants' }, { status: 500 })
  }
}

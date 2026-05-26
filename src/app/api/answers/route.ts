import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { participantId, questionId, selectedAnswer, correctAnswer } = body

    if (!participantId || !questionId) {
      return NextResponse.json({ error: 'participantId and questionId are required' }, { status: 400 })
    }

    // Check if already answered
    const existing = await db.answer.findUnique({
      where: {
        participantId_questionId: { participantId, questionId },
      },
    })

    if (existing) {
      return NextResponse.json({ error: 'Question already answered' }, { status: 400 })
    }

    const isCorrect = selectedAnswer === correctAnswer

    const answer = await db.answer.create({
      data: {
        participantId,
        questionId,
        selectedAnswer: selectedAnswer ?? null,
        isCorrect,
      },
    })

    return NextResponse.json(answer, { status: 201 })
  } catch (error) {
    console.error('Create answer error:', error)
    return NextResponse.json({ error: 'Failed to submit answer' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const participantId = searchParams.get('participantId')

    if (!participantId) {
      return NextResponse.json({ error: 'participantId is required' }, { status: 400 })
    }

    const answers = await db.answer.findMany({
      where: { participantId },
      include: { question: true },
    })

    return NextResponse.json(answers)
  } catch (error) {
    console.error('Get answers error:', error)
    return NextResponse.json({ error: 'Failed to fetch answers' }, { status: 500 })
  }
}

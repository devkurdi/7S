import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Use a simpler query approach
    const participants = await db.participant.findMany({
      select: {
        id: true,
        name: true,
        avatar: true,
        answers: {
          select: {
            isCorrect: true,
          },
        },
      },
    })

    const leaderboard = participants
      .map((p) => {
        const correctCount = p.answers.filter((a) => a.isCorrect).length
        const totalAnswered = p.answers.length
        const score = correctCount * 10
        return {
          id: p.id,
          name: p.name,
          avatar: p.avatar,
          correctCount,
          totalAnswered,
          score,
        }
      })
      .sort((a, b) => b.score - a.score || b.correctCount - a.correctCount)

    return NextResponse.json(leaderboard)
  } catch (error) {
    console.error('Leaderboard error:', error)
    return NextResponse.json([])
  }
}

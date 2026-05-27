import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function DELETE() {
  try {
    // Delete in correct order (respecting foreign keys)
    await db.answer.deleteMany()
    await db.score.deleteMany()
    await db.participant.deleteMany()
    await db.question.deleteMany()
    await db.category.deleteMany()

    return NextResponse.json({ message: 'All data purged successfully' }, { status: 200 })
  } catch (error) {
    console.error('Purge error:', error)
    return NextResponse.json({ error: 'Failed to purge data' }, { status: 500 })
  }
}

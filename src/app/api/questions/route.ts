import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const categoryId = searchParams.get('categoryId')

    const questions = await db.question.findMany({
      where: categoryId ? { categoryId } : undefined,
      include: { category: true },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(questions)
  } catch (error) {
    console.error('Get questions error:', error)
    return NextResponse.json({ error: 'Failed to fetch questions' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      textBadini, textSorani,
      option1Badini, option1Sorani,
      option2Badini, option2Sorani,
      option3Badini, option3Sorani,
      option4Badini, option4Sorani,
      correctAnswer, categoryId,
    } = body

    if (!textBadini || !textSorani || !categoryId || !correctAnswer) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const question = await db.question.create({
      data: {
        textBadini, textSorani,
        option1Badini, option1Sorani,
        option2Badini, option2Sorani,
        option3Badini, option3Sorani,
        option4Badini, option4Sorani,
        correctAnswer: Number(correctAnswer),
        categoryId,
      },
      include: { category: true },
    })

    return NextResponse.json(question, { status: 201 })
  } catch (error) {
    console.error('Create question error:', error)
    return NextResponse.json({ error: 'Failed to create question' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Question id is required' }, { status: 400 })
    }

    await db.question.delete({ where: { id } })
    return NextResponse.json({ message: 'Question deleted successfully' })
  } catch (error) {
    console.error('Delete question error:', error)
    return NextResponse.json({ error: 'Failed to delete question' }, { status: 500 })
  }
}

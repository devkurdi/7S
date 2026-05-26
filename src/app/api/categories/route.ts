import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try {
    const categories = await db.category.findMany({
      include: { _count: { select: { questions: true } } },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(categories)
  } catch (error) {
    console.error('Get categories error:', error)
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { nameBadini, nameSorani } = body

    if (!nameBadini || !nameSorani) {
      return NextResponse.json({ error: 'nameBadini and nameSorani are required' }, { status: 400 })
    }

    const category = await db.category.create({
      data: { nameBadini, nameSorani },
    })

    return NextResponse.json(category, { status: 201 })
  } catch (error) {
    console.error('Create category error:', error)
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Category id is required' }, { status: 400 })
    }

    await db.category.delete({ where: { id } })
    return NextResponse.json({ message: 'Category deleted successfully' })
  } catch (error) {
    console.error('Delete category error:', error)
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 })
  }
}

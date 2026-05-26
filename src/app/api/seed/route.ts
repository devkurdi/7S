import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function POST() {
  try {
    // Check if categories already exist
    const existingCategories = await db.category.count()
    if (existingCategories > 0) {
      return NextResponse.json({ message: 'Seed data already exists' }, { status: 200 })
    }

    // Create categories
    const religious = await db.category.create({
      data: {
        nameBadini: 'ئایینی',
        nameSorani: 'ئایینی',
      },
    })

    const science = await db.category.create({
      data: {
        nameBadini: 'زانستی',
        nameSorani: 'زانستی',
      },
    })

    // Religious questions
    await db.question.createMany({
      data: [
        {
          textBadini: 'چەند ڕوکوعەکان ل نێژا ئێوارێدا هەن؟',
          textSorani: 'چەند ڕکوعەت ل نوێژى ئێوارادا هەیە؟',
          option1Badini: '٣', option1Sorani: '٣',
          option2Badini: '٤', option2Sorani: '٤',
          option3Badini: '٢', option3Sorani: '٢',
          option4Badini: '٥', option4Sorani: '٥',
          correctAnswer: 2,
          categoryId: religious.id,
        },
        {
          textBadini: 'کەسایەتیێ ئیسلام کێیە کو پێغەمبەرێ مە؟',
          textSorani: 'کەسایەتى ئیسلام کێیە کە پێغەمبەرى مە؟',
          option1Badini: 'حەزرەتی عیسا', option1Sorani: 'حەزرەتى عیسا',
          option2Badini: 'حەزرەتی مووسا', option2Sorani: 'حەزرەتى مووسا',
          option3Badini: 'حەزرەتی محەمەد (ص)', option3Sorani: 'حەزرەتى محەمەد (ص)',
          option4Badini: 'حەزرەتی ئیبراھیم', option4Sorani: 'حەزرەتى ئیبراھیم',
          correctAnswer: 3,
          categoryId: religious.id,
        },
        {
          textBadini: 'کام سورەتا قورئانێ سەرەکییە و د هەر نێژایەکدا دخوێنیت؟',
          textSorani: 'کام سورەتى قورئان سەرەکییە و ل هەر نوێژێکدا دەخوێنیت؟',
          option1Badini: 'سورەتی بەقەرە', option1Sorani: 'سورەتى بەقەرە',
          option2Badini: 'سورەتی فاتیحە', option2Sorani: 'سورەتى فاتیحە',
          option3Badini: 'سورەتی ئیخلاس', option3Sorani: 'سورەتى ئیخلاس',
          option4Badini: 'سورەتی ناس', option4Sorani: 'سورەتى ناس',
          correctAnswer: 2,
          categoryId: religious.id,
        },
        {
          textBadini: 'ژ چەند ئایەتان قورئان پێکدێت؟',
          textSorani: 'ل چەند ئایەتان قورئان پێکدێت؟',
          option1Badini: '٦٢٣٦', option1Sorani: '٦٢٣٦',
          option2Badini: '٦٦٦٦', option2Sorani: '٦٦٦٦',
          option3Badini: '٦٠٠٠', option3Sorani: '٦٠٠٠',
          option4Badini: '٧٠٠٠', option4Sorani: '٧٠٠٠',
          correctAnswer: 1,
          categoryId: religious.id,
        },
        {
          textBadini: 'حەج ل کام مانگێدا ئەنجام ددرێت؟',
          textSorani: 'حەج ل کام مانگێدا ئەنجام دەدرێت؟',
          option1Badini: 'ڕەمەزان', option1Sorani: 'ڕەمەزان',
          option2Badini: 'زولحەججە', option2Sorani: 'زولحەججە',
          option3Badini: 'شەووال', option3Sorani: 'شەووال',
          option4Badini: 'موعەڕەم', option4Sorani: 'موعەڕەم',
          correctAnswer: 2,
          categoryId: religious.id,
        },
      ],
    })

    // Science questions
    await db.question.createMany({
      data: [
        {
          textBadini: 'گەڕێ خۆرێ چەند گەڕان ل ساڵەکێدا دکەت ل دوری خۆرێ؟',
          textSorani: 'گەڕى خۆر چەند گەڕان ل ساڵێکدا دەکات لە دەورى خۆر؟',
          option1Badini: '١', option1Sorani: '١',
          option2Badini: '٢', option2Sorani: '٢',
          option3Badini: '٣', option3Sorani: '٣',
          option4Badini: '٤', option4Sorani: '٤',
          correctAnswer: 1,
          categoryId: science.id,
        },
        {
          textBadini: 'ئاویان H2O پێکدێت ژ چەند ئەتۆمان؟',
          textSorani: 'ئاوى H2O پێکدێت ل چەند ئەتۆم؟',
          option1Badini: '٢ هیدروجین و ١ ئۆکسجین', option1Sorani: '٢ هیدروجین و ١ ئۆکسجین',
          option2Badini: '١ هیدروجین و ٢ ئۆکسجین', option2Sorani: '١ هیدروجین و ٢ ئۆکسجین',
          option3Badini: '٣ هیدروجین و ١ ئۆکسجین', option3Sorani: '٣ هیدروجین و ١ ئۆکسجین',
          option4Badini: '٢ هیدروجین و ٢ ئۆکسجین', option4Sorani: '٢ هیدروجین و ٢ ئۆکسجین',
          correctAnswer: 1,
          categoryId: science.id,
        },
        {
          textBadini: 'کام گەڕەکا زەوییە گەورەترینە؟',
          textSorani: 'کام گەڕەکى زەوى گەورەترینە؟',
          option1Badini: 'ئاسیا', option1Sorani: 'ئاسیا',
          option2Badini: 'ئەفریقا', option2Sorani: 'ئەفریقا',
          option3Badini: 'ئەمریکا', option3Sorani: 'ئەمریکا',
          option4Badini: 'ئەورووپا', option4Sorani: 'ئەورووپا',
          correctAnswer: 1,
          categoryId: science.id,
        },
        {
          textBadini: 'خێراترین شت ل جیهانێدا چییە؟',
          textSorani: 'خێراترین شت ل جیهاندا چییە؟',
          option1Badini: 'دەنگ', option1Sorani: 'دەنگ',
          option2Badini: 'ڕووناکی', option2Sorani: 'ڕووناکی',
          option3Badini: 'ئاو', option3Sorani: 'ئاو',
          option4Badini: 'با', option4Sorani: 'با',
          correctAnswer: 2,
          categoryId: science.id,
        },
        {
          textBadini: 'زەوی چەند ساڵانە خۆی دگەڕێنێتەڤە ل دوری خۆرێ؟',
          textSorani: 'زەوى چەند ساڵانە خۆى دەگەڕێنێتەوە لە دەورى خۆر؟',
          option1Badini: '٣٦٥ ڕۆژ', option1Sorani: '٣٦٥ ڕۆژ',
          option2Badini: '٣٠٠ ڕۆژ', option2Sorani: '٣٠٠ ڕۆژ',
          option3Badini: '٤٠٠ ڕۆژ', option3Sorani: '٤٠٠ ڕۆژ',
          option4Badini: '٢٥٠ ڕۆژ', option4Sorani: '٢٥٠ ڕۆژ',
          correctAnswer: 1,
          categoryId: science.id,
        },
      ],
    })

    return NextResponse.json({ message: 'Seed data created successfully' }, { status: 201 })
  } catch (error) {
    console.error('Seed error:', error)
    return NextResponse.json({ error: 'Failed to seed data' }, { status: 500 })
  }
}

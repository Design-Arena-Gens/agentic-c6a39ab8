import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getUserFromRequest } from '@/lib/auth'
import { generateQuizQuestions } from '@/lib/ai'

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = getUserFromRequest(req)
    if (!user || (user.role !== 'TUTOR' && user.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const lesson = await prisma.lesson.findUnique({
      where: { id: params.id },
      include: {
        section: {
          include: {
            course: true,
          },
        },
      },
    })

    if (!lesson) {
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 })
    }

    // Generate quiz questions using AI
    const questions = await generateQuizQuestions(lesson.content, 5)

    // Create quiz
    const quiz = await prisma.quiz.create({
      data: {
        title: `${lesson.title} Quiz`,
        description: 'Test your knowledge of this lesson',
        lessonId: lesson.id,
        passingScore: 70,
      },
    })

    // Create questions
    const createdQuestions = await Promise.all(
      questions.map((q: any, index: number) =>
        prisma.question.create({
          data: {
            quizId: quiz.id,
            question: q.question,
            options: JSON.stringify(q.options),
            correctAnswer: q.correctAnswer,
            explanation: q.explanation,
            order: index,
          },
        })
      )
    )

    return NextResponse.json({
      quiz,
      questions: createdQuestions,
    })
  } catch (error) {
    console.error('Generate quiz error:', error)
    return NextResponse.json({ error: 'Failed to generate quiz' }, { status: 500 })
  }
}

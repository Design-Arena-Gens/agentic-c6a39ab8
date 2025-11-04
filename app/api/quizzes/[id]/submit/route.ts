import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getUserFromRequest } from '@/lib/auth'

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = getUserFromRequest(req)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { answers } = await req.json()

    const quiz = await prisma.quiz.findUnique({
      where: { id: params.id },
      include: {
        questions: true,
      },
    })

    if (!quiz) {
      return NextResponse.json({ error: 'Quiz not found' }, { status: 404 })
    }

    // Calculate score
    let correctCount = 0
    quiz.questions.forEach((question) => {
      if (answers[question.id] === question.correctAnswer) {
        correctCount++
      }
    })

    const score = (correctCount / quiz.questions.length) * 100
    const passed = score >= quiz.passingScore

    // Save attempt
    const attempt = await prisma.quizAttempt.create({
      data: {
        quizId: quiz.id,
        userId: user.userId,
        score,
        answers: JSON.stringify(answers),
        passed,
      },
    })

    return NextResponse.json({
      attempt,
      score,
      passed,
      correctCount,
      totalQuestions: quiz.questions.length,
    })
  } catch (error) {
    console.error('Submit quiz error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

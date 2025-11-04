import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Create users
  const adminPassword = await bcrypt.hash('admin123', 10)
  const studentPassword = await bcrypt.hash('student123', 10)
  const tutorPassword = await bcrypt.hash('tutor123', 10)

  const admin = await prisma.user.upsert({
    where: { email: 'admin@demo.com' },
    update: {},
    create: {
      email: 'admin@demo.com',
      password: adminPassword,
      name: 'Admin User',
      role: 'ADMIN',
    },
  })

  const student = await prisma.user.upsert({
    where: { email: 'student@demo.com' },
    update: {},
    create: {
      email: 'student@demo.com',
      password: studentPassword,
      name: 'John Student',
      role: 'STUDENT',
    },
  })

  const tutor = await prisma.user.upsert({
    where: { email: 'tutor@demo.com' },
    update: {},
    create: {
      email: 'tutor@demo.com',
      password: tutorPassword,
      name: 'Sarah Tutor',
      role: 'TUTOR',
      bio: 'Experienced educator with 10+ years in web development',
    },
  })

  const support = await prisma.user.upsert({
    where: { email: 'support@demo.com' },
    update: {},
    create: {
      email: 'support@demo.com',
      password: await bcrypt.hash('support123', 10),
      name: 'Support Agent',
      role: 'SUPPORT',
    },
  })

  console.log('✓ Users created')

  // Create courses
  const course1 = await prisma.course.create({
    data: {
      title: 'Complete Web Development Bootcamp',
      description: 'Learn HTML, CSS, JavaScript, React, Node.js and more. Build real-world projects and become a full-stack developer.',
      category: 'Programming',
      level: 'BEGINNER',
      price: 99.99,
      published: true,
      instructorId: tutor.id,
    },
  })

  const course2 = await prisma.course.create({
    data: {
      title: 'Advanced React Patterns',
      description: 'Master advanced React concepts including hooks, context, performance optimization, and design patterns.',
      category: 'Programming',
      level: 'ADVANCED',
      price: 149.99,
      published: true,
      instructorId: tutor.id,
    },
  })

  const course3 = await prisma.course.create({
    data: {
      title: 'UI/UX Design Masterclass',
      description: 'Learn the principles of user interface and user experience design. Create beautiful and functional designs.',
      category: 'Design',
      level: 'INTERMEDIATE',
      price: 79.99,
      published: true,
      instructorId: tutor.id,
    },
  })

  const course4 = await prisma.course.create({
    data: {
      title: 'Python for Data Science',
      description: 'Learn Python programming for data analysis, visualization, and machine learning.',
      category: 'Data Science',
      level: 'BEGINNER',
      price: 0,
      published: true,
      instructorId: tutor.id,
    },
  })

  console.log('✓ Courses created')

  // Create sections and lessons
  const section1 = await prisma.section.create({
    data: {
      title: 'Getting Started with Web Development',
      description: 'Introduction to web development fundamentals',
      order: 0,
      courseId: course1.id,
    },
  })

  const lesson1 = await prisma.lesson.create({
    data: {
      title: 'Introduction to HTML',
      content: 'HTML (HyperText Markup Language) is the standard markup language for creating web pages. It describes the structure of web pages using markup. HTML elements are the building blocks of HTML pages. HTML elements are represented by tags.',
      videoUrl: 'https://example.com/video1.mp4',
      duration: 30,
      order: 0,
      sectionId: section1.id,
    },
  })

  const lesson2 = await prisma.lesson.create({
    data: {
      title: 'CSS Basics',
      content: 'CSS (Cascading Style Sheets) is used to style and layout web pages. It can be used to define text styles, table sizes, and other aspects of web pages. CSS allows you to separate the presentation from the content.',
      videoUrl: 'https://example.com/video2.mp4',
      duration: 45,
      order: 1,
      sectionId: section1.id,
    },
  })

  const lesson3 = await prisma.lesson.create({
    data: {
      title: 'JavaScript Fundamentals',
      content: 'JavaScript is a programming language that allows you to implement complex features on web pages. It enables dynamic content, multimedia, animated images, and more. JavaScript is one of the core technologies of the web.',
      videoUrl: 'https://example.com/video3.mp4',
      duration: 60,
      order: 2,
      sectionId: section1.id,
    },
  })

  console.log('✓ Sections and lessons created')

  // Create a quiz
  const quiz1 = await prisma.quiz.create({
    data: {
      title: 'HTML Basics Quiz',
      description: 'Test your knowledge of HTML fundamentals',
      lessonId: lesson1.id,
      passingScore: 70,
    },
  })

  await prisma.question.createMany({
    data: [
      {
        quizId: quiz1.id,
        question: 'What does HTML stand for?',
        options: JSON.stringify([
          'Hyper Text Markup Language',
          'High Tech Modern Language',
          'Home Tool Markup Language',
          'Hyperlinks and Text Markup Language',
        ]),
        correctAnswer: 'Hyper Text Markup Language',
        explanation: 'HTML stands for Hyper Text Markup Language, which is the standard markup language for creating web pages.',
        order: 0,
      },
      {
        quizId: quiz1.id,
        question: 'Which HTML tag is used for creating a hyperlink?',
        options: JSON.stringify(['<a>', '<link>', '<href>', '<url>']),
        correctAnswer: '<a>',
        explanation: 'The <a> tag defines a hyperlink, which is used to link from one page to another.',
        order: 1,
      },
      {
        quizId: quiz1.id,
        question: 'What is the correct HTML element for the largest heading?',
        options: JSON.stringify(['<h1>', '<h6>', '<heading>', '<head>']),
        correctAnswer: '<h1>',
        explanation: '<h1> is used for the largest heading, while <h6> is the smallest.',
        order: 2,
      },
    ],
  })

  console.log('✓ Quiz created')

  // Create enrollment
  const enrollment = await prisma.enrollment.create({
    data: {
      userId: student.id,
      courseId: course1.id,
      progress: 30,
    },
  })

  // Create progress
  await prisma.progress.create({
    data: {
      userId: student.id,
      lessonId: lesson1.id,
      completed: true,
      completedAt: new Date(),
    },
  })

  console.log('✓ Enrollment and progress created')

  // Create review
  await prisma.review.create({
    data: {
      courseId: course1.id,
      userId: student.id,
      rating: 5,
      comment: 'Excellent course! Very well structured and easy to follow.',
    },
  })

  console.log('✓ Review created')

  // Create support ticket
  const ticket = await prisma.supportTicket.create({
    data: {
      userId: student.id,
      subject: 'Cannot access video content',
      description: 'I am having trouble playing the video lessons in Course 1. The videos buffer constantly.',
      status: 'OPEN',
      priority: 'MEDIUM',
    },
  })

  await prisma.message.create({
    data: {
      ticketId: ticket.id,
      userId: student.id,
      content: 'I have tried refreshing the page and clearing my cache but the issue persists.',
    },
  })

  console.log('✓ Support ticket created')

  // Create AI config
  await prisma.aIConfig.create({
    data: {
      provider: 'openai',
      model: 'gpt-4',
      apiKey: 'your-openai-api-key-here',
      temperature: 0.7,
      maxTokens: 1000,
      active: false,
    },
  })

  console.log('✓ AI configuration created')

  console.log('✅ Database seeded successfully!')
  console.log('\nDemo Credentials:')
  console.log('Admin: admin@demo.com / admin123')
  console.log('Student: student@demo.com / student123')
  console.log('Tutor: tutor@demo.com / tutor123')
  console.log('Support: support@demo.com / support123')
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

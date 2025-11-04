'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { BookOpen, Users, Award, Sparkles } from 'lucide-react'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    const user = localStorage.getItem('user')

    if (token && user) {
      const userData = JSON.parse(user)
      switch (userData.role) {
        case 'STUDENT':
          router.push('/student')
          break
        case 'TUTOR':
          router.push('/tutor')
          break
        case 'ADMIN':
          router.push('/admin')
          break
        case 'SUPPORT':
          router.push('/support')
          break
      }
    }
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <BookOpen className="h-8 w-8 text-primary-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">EduPortal</span>
            </div>
            <div className="flex gap-4">
              <Link
                href="/login"
                className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Learn Anything, Anytime, Anywhere
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of students learning with AI-powered education platform
          </p>
          <Link
            href="/register"
            className="inline-block px-8 py-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-semibold text-lg"
          >
            Get Started Free
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-8 rounded-xl shadow-md">
            <div className="bg-primary-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <BookOpen className="h-6 w-6 text-primary-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Extensive Course Library</h3>
            <p className="text-gray-600">
              Access thousands of courses across various categories taught by expert instructors
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-md">
            <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Sparkles className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">AI-Powered Quizzes</h3>
            <p className="text-gray-600">
              Test your knowledge with automatically generated quizzes after each lesson
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-md">
            <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Award className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Track Your Progress</h3>
            <p className="text-gray-600">
              Monitor your learning journey with detailed analytics and certificates
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-primary-600 to-purple-600 rounded-2xl p-12 text-white text-center">
          <Users className="h-16 w-16 mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-4">Join Our Community</h2>
          <p className="text-xl mb-6 opacity-90">
            Over 100,000 students and instructors worldwide
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/register?role=STUDENT"
              className="px-6 py-3 bg-white text-primary-600 rounded-lg hover:bg-gray-100 font-semibold"
            >
              I'm a Student
            </Link>
            <Link
              href="/register?role=TUTOR"
              className="px-6 py-3 bg-primary-700 text-white rounded-lg hover:bg-primary-800 font-semibold border-2 border-white"
            >
              I'm a Tutor
            </Link>
          </div>
        </div>
      </main>

      <footer className="bg-gray-900 text-white mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <BookOpen className="h-6 w-6" />
                <span className="ml-2 text-lg font-bold">EduPortal</span>
              </div>
              <p className="text-gray-400">
                The future of online education with AI-powered learning
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Students</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Browse Courses</li>
                <li>My Learning</li>
                <li>Certificates</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Tutors</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Create Course</li>
                <li>Teaching Center</li>
                <li>Resources</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Help Center</li>
                <li>Contact Us</li>
                <li>FAQ</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 EduPortal. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

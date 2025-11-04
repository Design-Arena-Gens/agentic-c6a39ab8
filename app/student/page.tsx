'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import Navbar from '@/components/Navbar'
import { BookOpen, Clock, Award, TrendingUp } from 'lucide-react'
import toast from 'react-hot-toast'

export default function StudentDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [enrollments, setEnrollments] = useState<any[]>([])
  const [courses, setCourses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')

    if (!token || !userData) {
      router.push('/login')
      return
    }

    const parsedUser = JSON.parse(userData)
    setUser(parsedUser)

    if (parsedUser.role !== 'STUDENT') {
      router.push('/')
      return
    }

    fetchData(token)
  }, [router])

  const fetchData = async (token: string) => {
    try {
      const [enrollmentsRes, coursesRes] = await Promise.all([
        axios.get('/api/enrollments', {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get('/api/courses'),
      ])

      setEnrollments(enrollmentsRes.data)
      setCourses(coursesRes.data)
    } catch (error) {
      toast.error('Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  const handleEnroll = async (courseId: string) => {
    const token = localStorage.getItem('token')
    try {
      await axios.post(
        `/api/courses/${courseId}/enroll`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      toast.success('Enrolled successfully!')
      fetchData(token!)
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Enrollment failed')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar
          title="Student Portal"
          links={[
            { href: '/student', label: 'Dashboard' },
            { href: '/student/courses', label: 'Browse Courses' },
            { href: '/student/my-learning', label: 'My Learning' },
          ]}
        />
        <div className="flex items-center justify-center h-96">
          <div className="text-gray-500">Loading...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar
        title="Student Portal"
        links={[
          { href: '/student', label: 'Dashboard' },
          { href: '/student/courses', label: 'Browse Courses' },
          { href: '/student/my-learning', label: 'My Learning' },
        ]}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.name}!</h1>
          <p className="text-gray-600 mt-2">Continue your learning journey</p>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Enrolled Courses</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{enrollments.length}</p>
              </div>
              <BookOpen className="h-8 w-8 text-primary-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Hours Learned</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {enrollments.reduce((acc, e) => acc + (e.course.sections?.length || 0), 0) * 2}
                </p>
              </div>
              <Clock className="h-8 w-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Completed</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {enrollments.filter((e) => e.completedAt).length}
                </p>
              </div>
              <Award className="h-8 w-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Avg Progress</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {enrollments.length > 0
                    ? Math.round(
                        enrollments.reduce((acc, e) => acc + e.progress, 0) / enrollments.length
                      )
                    : 0}
                  %
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Continue Learning</h2>
          {enrollments.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrollments.slice(0, 3).map((enrollment) => (
                <div key={enrollment.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="h-48 bg-gradient-to-r from-primary-400 to-purple-400"></div>
                  <div className="p-6">
                    <h3 className="font-semibold text-lg mb-2">{enrollment.course.title}</h3>
                    <p className="text-gray-600 text-sm mb-4">
                      by {enrollment.course.instructor?.name}
                    </p>
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Progress</span>
                        <span className="font-semibold">{Math.round(enrollment.progress)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-primary-600 h-2 rounded-full"
                          style={{ width: `${enrollment.progress}%` }}
                        ></div>
                      </div>
                    </div>
                    <button
                      onClick={() => router.push(`/student/courses/${enrollment.course.id}`)}
                      className="w-full py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                    >
                      Continue Learning
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No courses enrolled yet
              </h3>
              <p className="text-gray-600 mb-6">Start learning by enrolling in a course below</p>
            </div>
          )}
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Explore Courses</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses
              .filter(
                (course) => !enrollments.some((e) => e.courseId === course.id) && course.published
              )
              .slice(0, 6)
              .map((course) => (
                <div key={course.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="h-48 bg-gradient-to-r from-blue-400 to-cyan-400"></div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs bg-primary-100 text-primary-600 px-2 py-1 rounded">
                        {course.level}
                      </span>
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                        {course.category}
                      </span>
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{course.title}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {course.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 text-sm">
                        by {course.instructor?.name}
                      </span>
                      <span className="font-bold text-primary-600">
                        {course.price === 0 ? 'Free' : `$${course.price}`}
                      </span>
                    </div>
                    <button
                      onClick={() => handleEnroll(course.id)}
                      className="w-full mt-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                    >
                      Enroll Now
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </main>
    </div>
  )
}

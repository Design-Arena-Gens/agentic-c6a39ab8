'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import Navbar from '@/components/Navbar'
import { MessageSquare, Clock, CheckCircle, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { formatDistance } from 'date-fns'

export default function SupportDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [tickets, setTickets] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTicket, setSelectedTicket] = useState<any>(null)
  const [message, setMessage] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')

    if (!token || !userData) {
      router.push('/login')
      return
    }

    const parsedUser = JSON.parse(userData)
    setUser(parsedUser)

    if (parsedUser.role !== 'SUPPORT' && parsedUser.role !== 'ADMIN') {
      router.push('/')
      return
    }

    fetchTickets(token)
  }, [router])

  const fetchTickets = async (token: string) => {
    try {
      const response = await axios.get('/api/support/tickets', {
        headers: { Authorization: `Bearer ${token}` },
      })
      setTickets(response.data)
    } catch (error) {
      toast.error('Failed to load tickets')
    } finally {
      setLoading(false)
    }
  }

  const handleSendMessage = async () => {
    if (!message.trim() || !selectedTicket) return

    const token = localStorage.getItem('token')
    try {
      await axios.post(
        `/api/support/tickets/${selectedTicket.id}/messages`,
        { content: message },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setMessage('')
      toast.success('Message sent!')
      fetchTickets(token!)
      // Refresh selected ticket
      const response = await axios.get(`/api/support/tickets/${selectedTicket.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setSelectedTicket(response.data)
    } catch (error) {
      toast.error('Failed to send message')
    }
  }

  const handleUpdateStatus = async (ticketId: string, status: string) => {
    const token = localStorage.getItem('token')
    try {
      await axios.put(
        `/api/support/tickets/${ticketId}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      toast.success('Status updated!')
      fetchTickets(token!)
      if (selectedTicket?.id === ticketId) {
        setSelectedTicket({ ...selectedTicket, status })
      }
    } catch (error) {
      toast.error('Failed to update status')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPEN':
        return 'bg-blue-100 text-blue-700'
      case 'IN_PROGRESS':
        return 'bg-yellow-100 text-yellow-700'
      case 'RESOLVED':
        return 'bg-green-100 text-green-700'
      case 'CLOSED':
        return 'bg-gray-100 text-gray-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'LOW':
        return 'text-gray-600'
      case 'MEDIUM':
        return 'text-blue-600'
      case 'HIGH':
        return 'text-orange-600'
      case 'URGENT':
        return 'text-red-600'
      default:
        return 'text-gray-600'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar
          title="Support Portal"
          links={[{ href: '/support', label: 'Tickets' }]}
        />
        <div className="flex items-center justify-center h-96">
          <div className="text-gray-500">Loading...</div>
        </div>
      </div>
    )
  }

  const openTickets = tickets.filter((t) => t.status === 'OPEN' || t.status === 'IN_PROGRESS')

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar
        title="Support Portal"
        links={[{ href: '/support', label: 'Tickets' }]}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Support Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage and respond to user tickets</p>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Open Tickets</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {tickets.filter((t) => t.status === 'OPEN').length}
                </p>
              </div>
              <MessageSquare className="h-8 w-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">In Progress</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {tickets.filter((t) => t.status === 'IN_PROGRESS').length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Resolved</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {tickets.filter((t) => t.status === 'RESOLVED').length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Urgent</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {tickets.filter((t) => t.priority === 'URGENT').length}
                </p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Tickets</h2>
            <div className="space-y-4">
              {tickets.length > 0 ? (
                tickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    onClick={() => setSelectedTicket(ticket)}
                    className={`bg-white p-4 rounded-lg shadow-sm cursor-pointer hover:shadow-md transition ${
                      selectedTicket?.id === ticket.id ? 'ring-2 ring-primary-500' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">{ticket.subject}</h3>
                      <span className={`text-xs px-2 py-1 rounded ${getStatusColor(ticket.status)}`}>
                        {ticket.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">{ticket.description}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>by {ticket.user.name}</span>
                      <span className={getPriorityColor(ticket.priority)}>{ticket.priority}</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      {formatDistance(new Date(ticket.createdAt), new Date(), { addSuffix: true })}
                    </p>
                  </div>
                ))
              ) : (
                <div className="bg-white p-8 rounded-lg shadow-sm text-center">
                  <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">No tickets yet</p>
                </div>
              )}
            </div>
          </div>

          <div className="md:col-span-2">
            {selectedTicket ? (
              <div className="bg-white rounded-lg shadow-sm">
                <div className="p-6 border-b">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">{selectedTicket.subject}</h2>
                      <p className="text-gray-600 mt-1">From: {selectedTicket.user.name} ({selectedTicket.user.email})</p>
                    </div>
                    <span className={`px-3 py-1 rounded ${getStatusColor(selectedTicket.status)}`}>
                      {selectedTicket.status}
                    </span>
                  </div>
                  <p className="text-gray-700 mb-4">{selectedTicket.description}</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleUpdateStatus(selectedTicket.id, 'IN_PROGRESS')}
                      className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 text-sm"
                    >
                      In Progress
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(selectedTicket.id, 'RESOLVED')}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                    >
                      Resolve
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(selectedTicket.id, 'CLOSED')}
                      className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-sm"
                    >
                      Close
                    </button>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Messages</h3>
                  <div className="space-y-4 mb-4 max-h-96 overflow-y-auto">
                    {selectedTicket.messages.map((msg: any) => (
                      <div
                        key={msg.id}
                        className={`p-4 rounded-lg ${
                          msg.user.role === 'SUPPORT' || msg.user.role === 'ADMIN'
                            ? 'bg-primary-50 ml-8'
                            : 'bg-gray-100 mr-8'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold text-sm">{msg.user.name}</span>
                          <span className="text-xs text-gray-500">
                            {formatDistance(new Date(msg.createdAt), new Date(), { addSuffix: true })}
                          </span>
                        </div>
                        <p className="text-gray-700">{msg.content}</p>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Type your message..."
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                    />
                    <button
                      onClick={handleSendMessage}
                      className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                    >
                      Send
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <MessageSquare className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No ticket selected</h3>
                <p className="text-gray-600">Select a ticket from the list to view details</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

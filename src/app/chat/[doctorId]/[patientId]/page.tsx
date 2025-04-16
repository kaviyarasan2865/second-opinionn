"use client"

import { useEffect, useState, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Send, ArrowLeft, Loader2 } from 'lucide-react'
import { use } from 'react'

interface Message {
  sender: 'doctor' | 'patient'
  text: string
  timestamp: Date
}

interface ChatProps {
  params: Promise<{
    doctorId: string
    patientId: string
  }>
}

export default function ChatPage({ params }: ChatProps) {
  const { data: session, status: sessionStatus } = useSession()
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [sendingMessage, setSendingMessage] = useState(false)
  const [otherUser, setOtherUser] = useState<{
    name: string
    image: string
    role: string
  } | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const resolvedParams = use(params)
  const { doctorId, patientId } = resolvedParams
  const currentUserRole = session?.user?.role || ''

  // Fetch chat messages and user details
  useEffect(() => {
    const fetchChatData = async () => {
      if (sessionStatus !== 'authenticated') return

      try {
        setIsLoading(true)
        // Fetch chat messages
        const chatResponse = await fetch(`/api/chat?doctorId=${doctorId}&patientId=${patientId}`)
        
        if (!chatResponse.ok) {
          throw new Error('Failed to fetch chat data')
        }
        
        const chatData = await chatResponse.json()
        
        if (chatData.data) {
          setMessages(chatData.data.messages || [])
        }

        // Fetch other user's details
        const otherUserId = currentUserRole === 'doctor' ? patientId : doctorId
        try {
          const userResponse = await fetch(`/api/user/${otherUserId}`)
          
          if (!userResponse.ok) {
            throw new Error('Failed to fetch user data')
          }
          
          const userData = await userResponse.json()
          
          if (userData.data) {
            setOtherUser({
              name: userData.data.name || 'User',
              image: userData.data.image || '',
              role: userData.data.role || (currentUserRole === 'doctor' ? 'patient' : 'doctor')
            })
          }
        } catch (error) {
          console.error('Error fetching user details:', error)
          // Set default values if user details can't be fetched
          setOtherUser({
            name: currentUserRole === 'doctor' ? 'Patient' : 'Doctor',
            image: '',
            role: currentUserRole === 'doctor' ? 'patient' : 'doctor'
          })
        }
      } catch (error) {
        console.error('Error fetching chat data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchChatData()
  }, [sessionStatus, doctorId, patientId, currentUserRole])

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Focus input when component mounts
  useEffect(() => {
    if (!isLoading && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isLoading])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || sendingMessage) return

    try {
      setSendingMessage(true)
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          doctorId,
          patientId,
          message: newMessage.trim(),
          sender: currentUserRole
        }),
      })

      if (response.ok) {
        const data = await response.json()
        // Add the new message to the list
        setMessages(prev => [...prev, data.data])
        setNewMessage('')
        // Focus back on input field after sending
        setTimeout(() => {
          inputRef.current?.focus()
        }, 0)
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to send message')
      }
    } catch (error) {
      console.error('Error sending message:', error)
      alert('Failed to send message. Please try again.')
    } finally {
      setSendingMessage(false)
    }
  }

  // Handle session not authenticated
  if (sessionStatus === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Loader2 className="h-12 w-12 animate-spin text-teal-600" />
      </div>
    )
  }

  if (sessionStatus === 'unauthenticated') {
    router.push('/auth/signin')
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-gray-600">Please sign in to access chat</p>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Loader2 className="h-12 w-12 animate-spin text-teal-600" />
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Chat Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Go back"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
            <div className="flex items-center gap-3">
              <div className="relative h-12 w-12 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                {otherUser?.image ? (
                  <Image
                    width={48}
                    height={48}
                    src={otherUser.image}
                    alt={otherUser.name}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                ) : (
                  <span className="text-gray-500 font-medium text-lg">
                    {otherUser?.name?.charAt(0).toUpperCase() || '?'}
                  </span>
                )}
              </div>
              <div>
                <h2 className="font-semibold text-gray-900">{otherUser?.name || 'User'}</h2>
                <p className="text-sm text-gray-500 capitalize">{otherUser?.role || 'User'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 mb-2">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500 text-center">
              No messages yet. Start the conversation!
            </p>
          </div>
        ) : (
          messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.sender === currentUserRole ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs sm:max-w-md md:max-w-lg rounded-lg p-3 ${
                  message.sender === currentUserRole
                    ? 'bg-teal-600 text-white rounded-br-none'
                    : 'bg-white text-gray-900 border border-gray-200 rounded-bl-none'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap break-words">{message.text}</p>
                <p className={`text-xs mt-1 ${message.sender === currentUserRole ? 'text-teal-100' : 'text-gray-500'}`}>
                  {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="bg-white border-t border-gray-200 p-4 sticky bottom-0">
        <form onSubmit={handleSendMessage} className="flex gap-2 max-w-4xl mx-auto">
          <input
            ref={inputRef}
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 rounded-full border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            disabled={sendingMessage}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSendMessage(e)
              }
            }}
          />
          <button
            type="submit"
            disabled={sendingMessage || !newMessage.trim()}
            className={`p-3 rounded-full flex items-center justify-center transition-colors ${
              sendingMessage || !newMessage.trim() 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                : 'bg-teal-600 text-white hover:bg-teal-700'
            }`}
            aria-label="Send message"
          >
            {sendingMessage ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </button>
        </form>
      </div>
    </div>
  )
}       
"use client"

import { useState, useEffect, useRef } from "react"
import { useSession, signOut } from "next-auth/react"
import {
  Calendar,
  Clock,
  FileText,
  MessageCircle,
  User,
  Bell,
  Activity,
  Pill,
  CalendarIcon,
  FileTextIcon,
  LogOut,
  Send,
  Settings,
  ChevronDown
} from "lucide-react"
import Image from 'next/image'

interface Message {
  id: string
  content: string
  sender: "doctor" | "patient"
  timestamp: Date
}

export default function PatientDashboard() {
  const { data: session } = useSession()
  const [messages, setMessages] = useState<Message[]>([
    { id: "1", content: "Hello! How can I help you today?", sender: "doctor", timestamp: new Date() }
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const profileMenuRef = useRef<HTMLDivElement>(null)

  // Close profile menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [profileMenuRef])

  // Scroll to bottom of chat when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Add background animations
  useEffect(() => {
    const style = document.createElement("style")
    style.innerHTML = `
      @keyframes float {
        0% {
          transform: translateY(0px) rotate(0deg);
        }
        50% {
          transform: translateY(-20px) rotate(5deg);
        }
        100% {
          transform: translateY(0px) rotate(0deg);
        }
      }
      
      @keyframes pulse {
        0% {
          transform: scale(0.95);
          box-shadow: 0 0 0 0 rgba(0, 201, 182, 0.7);
        }
        
        70% {
          transform: scale(1);
          box-shadow: 0 0 0 15px rgba(0, 201, 182, 0);
        }
        
        100% {
          transform: scale(0.95);
          box-shadow: 0 0 0 0 rgba(0, 201, 182, 0);
        }
      }
      
      @keyframes gradient {
        0% {
          background-position: 0% 50%;
        }
        50% {
          background-position: 100% 50%;
        }
        100% {
          background-position: 0% 50%;
        }
      }
    `
    document.head.appendChild(style)
    return () => {
      document.head.removeChild(style)
    }
  }, [])

  // Mock function to handle chat submission
  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    // Add user message
    const newUserMessage: Message = {
      id: Date.now().toString(),
      content: input.trim(),
      sender: "patient",
      timestamp: new Date(),
    }
    setMessages(prevMessages => [...prevMessages, newUserMessage])
    setInput("")
    setIsLoading(true)

    // Simulate API call to agentForce
    setTimeout(() => {
      const newAssistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "Thank you for your message. A healthcare professional will review your inquiry and respond shortly.",
        sender: "doctor",
        timestamp: new Date(),
      }
      setMessages(prevMessages => [...prevMessages, newAssistantMessage])
      setIsLoading(false)
    }, 1000)

    // In a real implementation, you would call the agentForce API here
    // const response = await fetch('/api/chat', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ message: input }),
    // });
    // const data = await response.json();
    // setMessages(prev => [...prev, { id: Date.now() + 1, role: 'assistant', content: data.message }]);
    // setIsLoading(false);
  }

  // Toggle profile menu
  const toggleProfileMenu = () => {
    setShowProfileMenu(!showProfileMenu)
  }

  // Mock data for dashboard
  const upcomingAppointments = [
    { id: 1, doctor: "Dr. Sarah Johnson", specialty: "Cardiology", date: "May 15, 2024", time: "10:30 AM" },
    { id: 2, doctor: "Dr. Michael Chen", specialty: "Neurology", date: "May 22, 2024", time: "2:15 PM" },
  ]

  const recentReports = [
    { id: 1, title: "Blood Test Results", date: "April 28, 2024", status: "Reviewed" },
    { id: 2, title: "MRI Scan Report", date: "April 15, 2024", status: "Pending Review" },
  ]

  const medications = [
    { id: 1, name: "Lisinopril", dosage: "10mg", frequency: "Once daily", refillDate: "May 30, 2024", progress: 70 },
    { id: 2, name: "Metformin", dosage: "500mg", frequency: "Twice daily", refillDate: "June 15, 2024", progress: 85 },
    { id: 3, name: "Atorvastatin", dosage: "20mg", frequency: "Once daily", refillDate: "June 5, 2024", progress: 60 },
  ]

  return (
    <div className="relative min-h-screen bg-gray-50">
      {/* Background gradient */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background: "linear-gradient(120deg, #0d9488, #0891b2, #0c4a6e)",
          backgroundSize: "400% 400%",
          animation: "gradient 15s ease infinite",
          opacity: 0.05,
        }}
      />

      {/* Floating shapes */}
      <div className="absolute top-0 left-0 w-full h-full -z-5 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full opacity-10"
            style={{
              width: `${30 + Math.random() * 100}px`,
              height: `${30 + Math.random() * 100}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: "rgba(13, 148, 136, 0.8)",
              animation: `float ${5 + Math.random() * 10}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 flex items-center justify-center">
              <span className="text-white font-bold">M</span>
            </div>
            <h1 className="text-xl font-bold text-gray-800">MedSecond</h1>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 relative">
              <Bell className="h-5 w-5 text-gray-600" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
            </button>

            {/* Profile Dropdown */}
            <div className="relative" ref={profileMenuRef}>
              <button 
                className="flex items-center gap-2 py-1 px-2 rounded-full hover:bg-gray-100 transition-colors"
                onClick={toggleProfileMenu}
              >
                {/* Custom Avatar */}
                <div className="h-8 w-8 rounded-full bg-teal-100 flex items-center justify-center overflow-hidden">
                  {session?.user?.image ? (
                    <Image
                      height={32}
                      width={32}
                      src={session.user.image || "/placeholder.svg"}
                      alt={session?.user?.name || "User"}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-teal-800 font-medium">{session?.user?.name?.charAt(0) || "U"}</span>
                  )}
                </div>
                <span className="text-sm font-medium text-gray-700 hidden md:inline-block">
                  {session?.user?.name || session?.user?.email || "Patient"}
                </span>
                <ChevronDown className="h-4 w-4 text-gray-500" />
              </button>

              {/* Dropdown Menu */}
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-20 border border-gray-200">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">{session?.user?.name || "User"}</p>
                    <p className="text-xs text-gray-500 truncate">{session?.user?.email || "user@example.com"}</p>
                  </div>
                  <a href="#" className=" px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>My Profile</span>
                  </a>
                  <a href="#" className=" px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </a>
                  <button 
                    onClick={() => signOut()} 
                    className=" w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Sidebar - Quick Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Welcome Card */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-800 mb-2">Welcome back, {session?.user?.name?.split(" ")[0] || "Patient"}</h2>
              <p className="text-gray-600">How can we help you today?</p>
              
              {/* Health summary preview */}
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Health Score</span>
                  <span className="text-teal-600 font-semibold">92/100</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-gradient-to-r from-teal-500 to-cyan-500 h-2 rounded-full" style={{ width: "92%" }}></div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-teal-100 rounded-full p-2">
                      <Calendar className="h-5 w-5 text-teal-600" />
                    </div>
                    <span className="text-gray-600">Next Appointment</span>
                  </div>
                  <span className="font-medium">{upcomingAppointments[0]?.date || "No upcoming"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 rounded-full p-2">
                      <FileText className="h-5 w-5 text-blue-600" />
                    </div>
                    <span className="text-gray-600">Recent Reports</span>
                  </div>
                  <span className="font-medium">{recentReports.length} new</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-purple-100 rounded-full p-2">
                      <Pill className="h-5 w-5 text-purple-600" />
                    </div>
                    <span className="text-gray-600">Medications</span>
                  </div>
                  <span className="font-medium">{medications.length} active</span>
                </div>
              </div>
              
              {/* View All Button */}
              <button className="mt-4 w-full py-2 bg-gray-50 text-teal-600 text-sm font-medium rounded-lg hover:bg-gray-100 transition-colors">
                View All Stats
              </button>
            </div>
          </div>

          {/* Main Chat Interface */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden h-[calc(100vh-12rem)] flex flex-col border border-gray-100">
              {/* Chat Header */}
              <div className="bg-gradient-to-r from-teal-600 to-cyan-600 p-4 text-white flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="bg-white/20 rounded-full p-2">
                    <MessageCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-medium">Medical Assistant</h3>
                    <p className="text-xs opacity-80">Powered by AgentForce</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center text-xs bg-white/20 px-2 py-1 rounded-full">
                    <span className="h-2 w-2 bg-green-300 rounded-full mr-1 animate-pulse"></span>
                    Online
                  </span>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div key={message.id} className={`flex ${message.sender === "patient" ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          message.sender === "patient"
                            ? "bg-gradient-to-r from-teal-600 to-teal-500 text-white shadow-sm"
                            : "bg-white border border-gray-200 text-gray-800 shadow-sm"
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          {message.sender === "patient" ? (
                            <div className="h-5 w-5 bg-teal-100 rounded-full flex items-center justify-center">
                              <span className="text-xs text-teal-800">{session?.user?.name?.charAt(0) || "Y"}</span>
                            </div>
                          ) : (
                            <div className="h-5 w-5 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-xs text-blue-800">D</span>
                            </div>
                          )}
                          <span className="font-medium text-sm">
                            {message.sender === "patient" ? "You" : "Doctor"}
                          </span>
                          <span className="text-xs opacity-80 ml-auto flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p>{message.content}</p>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="max-w-[80%] rounded-lg p-3 bg-white border border-gray-200 shadow-sm">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="h-5 w-5 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-xs text-blue-800">D</span>
                          </div>
                          <span className="font-medium text-sm">Doctor</span>
                        </div>
                        <div className="flex space-x-2">
                          <div className="h-2 w-2 rounded-full bg-gray-300 animate-bounce"></div>
                          <div
                            className="h-2 w-2 rounded-full bg-gray-300 animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                          <div
                            className="h-2 w-2 rounded-full bg-gray-300 animate-bounce"
                            style={{ animationDelay: "0.4s" }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </div>

              {/* Chat Input */}
              <form onSubmit={handleChatSubmit} className="p-4 border-t border-gray-200 bg-white">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    disabled={isLoading}
                  />
                  <button
                    type="submit"
                    className="rounded-full bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white p-3 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                    disabled={isLoading || !input.trim()}
                  >
                    <Send className="h-5 w-5" />
                    <span className="sr-only">Send</span>
                  </button>
                </div>
                <div className="text-xs text-gray-500 mt-2 text-center">
                  Your messages are secure and encrypted
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-teal-600 to-cyan-600 border-t rounded-full border-gray-200 shadow-lg mx-auto max-w-4xl m-3">
        <div className="container mx-auto">
          <div className="flex justify-around items-center py-2">
            <button className="flex flex-col items-center gap-1 px-4 py-2 rounded-full text-teal-700 bg-teal-50">
              <Activity className="h-5 w-5" />
              <span className="text-xs font-medium">Dashboard</span>
            </button>
            <button className="flex flex-col items-center gap-1 px-4 py-2 rounded-full text-gray-200 hover:bg-gray-50 hover:text-teal-700 transition-colors">
              <CalendarIcon className="h-5 w-5" />
              <span className="text-xs">Appointments</span>
            </button>
            <button className="flex flex-col items-center gap-1 px-4 py-2 rounded-full text-gray-200 hover:bg-gray-50 hover:text-teal-700 transition-colors">
              <FileTextIcon className="h-5 w-5" />
              <span className="text-xs">Records</span>
            </button>
            <button className="flex flex-col items-center gap-1 px-4 py-2 rounded-full text-gray-200 hover:bg-gray-50 hover:text-teal-700 transition-colors">
              <Pill className="h-5 w-5" />
              <span className="text-xs">Medications</span>
            </button>
            <button className="flex flex-col items-center gap-1 px-4 py-2 rounded-full text-gray-200 hover:bg-gray-50 hover:text-teal-700 transition-colors">
              <User className="h-5 w-5" />
              <span className="text-xs">Profile</span>
            </button>
          </div>
        </div>
      </nav>
    </div>
  )
}
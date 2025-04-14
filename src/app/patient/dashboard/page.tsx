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
  X,
  ChevronRight,
  Activity,
  Pill,
  CalendarIcon,
  FileTextIcon,
  MessageSquare,
  LogOut,
  Send,
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
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { id: "1", content: "Hello! How can I help you today?", sender: "doctor", timestamp: new Date() }
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

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
      <header className="bg-white shadow-sm border-b border-gray-200">
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

            <div className="flex items-center gap-2">
              {/* Custom Avatar */}
              <div className="h-8 w-8 rounded-full bg-teal-100 flex items-center justify-center overflow-hidden">
                {session?.user?.image ? (
                  <Image
                  height={20}
                  width={20}
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
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar and Main Content */}
      <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <aside className="w-full md:w-64 bg-white rounded-xl shadow-sm p-4">
          <nav className="space-y-1">
            {/* Custom Buttons */}
            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-teal-700 bg-teal-50 font-medium text-sm hover:bg-teal-100 transition-colors">
              <Activity className="h-5 w-5" />
              <span>Dashboard</span>
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-gray-700 font-medium text-sm hover:bg-teal-50 hover:text-teal-700 transition-colors">
              <CalendarIcon className="h-5 w-5" />
              <span>Appointments</span>
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-gray-700 font-medium text-sm hover:bg-teal-50 hover:text-teal-700 transition-colors">
              <FileTextIcon className="h-5 w-5" />
              <span>Medical Records</span>
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-gray-700 font-medium text-sm hover:bg-teal-50 hover:text-teal-700 transition-colors">
              <Pill className="h-5 w-5" />
              <span>Medications</span>
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-gray-700 font-medium text-sm hover:bg-teal-50 hover:text-teal-700 transition-colors">
              <MessageSquare className="h-5 w-5" />
              <span>Messages</span>
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-gray-700 font-medium text-sm hover:bg-teal-50 hover:text-teal-700 transition-colors">
              <User className="h-5 w-5" />
              <span>Profile</span>
            </button>
            <hr className="my-4" />
            <button
              className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-red-600 font-medium text-sm hover:bg-red-50 hover:text-red-700 transition-colors"
              onClick={() => signOut()}
            >
              <LogOut className="h-5 w-5" />
              <span>Sign Out</span>
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 space-y-6">
          {/* Welcome Section */}
          <section className="bg-gradient-to-r from-teal-500 to-cyan-600 rounded-xl p-6 text-white shadow-md">
            <h2 className="text-2xl font-bold mb-2">Welcome back, {session?.user?.name?.split(" ")[0] || "Patient"}</h2>
            <p className="opacity-90 mb-4">Here&apos;s a summary of your health information and upcoming appointments.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 flex items-center gap-4">
                <div className="bg-white/30 rounded-full p-3">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium opacity-90">Next Appointment</p>
                  <p className="font-bold">{upcomingAppointments[0]?.date || "No upcoming"}</p>
                </div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 flex items-center gap-4">
                <div className="bg-white/30 rounded-full p-3">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium opacity-90">Recent Reports</p>
                  <p className="font-bold">{recentReports.length} new</p>
                </div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 flex items-center gap-4">
                <div className="bg-white/30 rounded-full p-3">
                  <Pill className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium opacity-90">Medications</p>
                  <p className="font-bold">{medications.length} active</p>
                </div>
              </div>
            </div>
          </section>

          {/* Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Upcoming Appointments - Custom Card */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="px-6 py-4 flex items-center justify-between border-b border-gray-100">
                <h3 className="text-lg font-bold text-gray-800">Upcoming Appointments</h3>
                <button className="text-teal-600 hover:text-teal-700 text-sm font-medium flex items-center">
                  View All <ChevronRight className="h-4 w-4 ml-1" />
                </button>
              </div>
              <div className="p-6">
                {upcomingAppointments.length > 0 ? (
                  <div className="space-y-4">
                    {upcomingAppointments.map((appointment) => (
                      <div
                        key={appointment.id}
                        className="flex items-start p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors"
                      >
                        <div className="bg-teal-100 rounded-full p-3 mr-4">
                          <Calendar className="h-5 w-5 text-teal-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{appointment.doctor}</h4>
                          <p className="text-sm text-gray-500">{appointment.specialty}</p>
                          <div className="flex items-center mt-2 text-sm text-gray-600">
                            <Calendar className="h-4 w-4 mr-1" />
                            <span className="mr-3">{appointment.date}</span>
                            <Clock className="h-4 w-4 mr-1" />
                            <span>{appointment.time}</span>
                          </div>
                        </div>
                        <button className="px-3 py-1 text-sm border border-teal-200 text-teal-600 rounded-md hover:bg-teal-50">
                          Details
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-6">No upcoming appointments</p>
                )}
              </div>
            </div>

            {/* Recent Medical Reports - Custom Card */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="px-6 py-4 flex items-center justify-between border-b border-gray-100">
                <h3 className="text-lg font-bold text-gray-800">Recent Medical Reports</h3>
                <button className="text-teal-600 hover:text-teal-700 text-sm font-medium flex items-center">
                  View All <ChevronRight className="h-4 w-4 ml-1" />
                </button>
              </div>
              <div className="p-6">
                {recentReports.length > 0 ? (
                  <div className="space-y-4">
                    {recentReports.map((report) => (
                      <div
                        key={report.id}
                        className="flex items-start p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors"
                      >
                        <div className="bg-blue-100 rounded-full p-3 mr-4">
                          <FileText className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{report.title}</h4>
                          <p className="text-sm text-gray-500">{report.date}</p>
                          <div className="flex items-center mt-2">
                            <span
                              className={`text-xs px-2 py-1 rounded-full ${
                                report.status === "Reviewed"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-yellow-100 text-yellow-700"
                              }`}
                            >
                              {report.status}
                            </span>
                          </div>
                        </div>
                        <button className="px-3 py-1 text-sm border border-blue-200 text-blue-600 rounded-md hover:bg-blue-50">
                          View
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-6">No recent reports</p>
                )}
              </div>
            </div>

            {/* Medications - Custom Card */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden lg:col-span-2">
              <div className="px-6 py-4 flex items-center justify-between border-b border-gray-100">
                <h3 className="text-lg font-bold text-gray-800">Current Medications</h3>
                <button className="text-teal-600 hover:text-teal-700 text-sm font-medium flex items-center">
                  Manage Medications <ChevronRight className="h-4 w-4 ml-1" />
                </button>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {medications.map((medication) => (
                    <div
                      key={medication.id}
                      className="p-4 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center mb-3">
                        <div className="bg-purple-100 rounded-full p-2 mr-3">
                          <Pill className="h-4 w-4 text-purple-600" />
                        </div>
                        <h4 className="font-medium text-gray-900">{medication.name}</h4>
                      </div>
                      <div className="space-y-2 text-sm text-gray-600">
                        <p>
                          <span className="font-medium">Dosage:</span> {medication.dosage}
                        </p>
                        <p>
                          <span className="font-medium">Frequency:</span> {medication.frequency}
                        </p>
                        <p>
                          <span className="font-medium">Refill Date:</span> {medication.refillDate}
                        </p>
                      </div>
                      <div className="mt-3">
                        <p className="text-xs text-gray-500 mb-1">Refill Status</p>
                        {/* Custom Progress Bar */}
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-teal-500 rounded-full"
                              style={{ width: `${medication.progress}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-gray-600">{medication.progress}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Floating Chat Icon */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsChatOpen(true)}
          className={`bg-teal-600 hover:bg-teal-700 text-white rounded-full p-4 shadow-lg transition-all ${
            isChatOpen ? "scale-0 opacity-0" : "scale-100 opacity-100"
          }`}
          style={{ animation: isChatOpen ? "" : "pulse 2s infinite" }}
        >
          <MessageCircle className="h-6 w-6" />
        </button>
      </div>

      {/* Chat Interface */}
      {isChatOpen && (
        <div className="fixed bottom-6 right-6 w-80 md:w-96 bg-white rounded-xl shadow-2xl z-50 flex flex-col overflow-hidden border border-gray-200">
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-teal-600 to-cyan-600 p-4 text-white flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="bg-white/20 rounded-full p-2">
                <MessageCircle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-medium">Medical Assistant</h3>
                <p className="text-xs opacity-80">Online</p>
              </div>
            </div>
            <button onClick={() => setIsChatOpen(false)} className="text-white/80 hover:text-white">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 p-4 overflow-y-auto max-h-96 bg-gray-50">
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.sender === "patient" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.sender === "patient"
                        ? "bg-teal-600 text-white"
                        : "bg-white border border-gray-200 text-gray-800"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <User className="w-4 h-4" />
                      <span className="font-medium">
                        {message.sender === "patient" ? "You" : "Doctor"}
                      </span>
                      <Clock className="w-4 h-4 ml-auto" />
                      <span className="text-sm opacity-80">
                        {message.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                    <p>{message.content}</p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="max-w-[80%] rounded-lg p-3 bg-white border border-gray-200">
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
          <form onSubmit={handleChatSubmit} className="p-3 border-t border-gray-200 bg-white">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                disabled={isLoading}
              />
              <button
                type="submit"
                className="rounded-full bg-teal-600 hover:bg-teal-700 text-white p-2 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading || !input.trim()}
              >
                <Send className="h-5 w-5" />
                <span className="sr-only">Send</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}

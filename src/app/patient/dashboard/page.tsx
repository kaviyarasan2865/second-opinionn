"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useSession, signOut } from "next-auth/react"
import {
  Calendar,
  Clock,
  FileText,
  MessageCircle,
  User,
  Activity,
  Pill,
  CalendarIcon,
  FileTextIcon,
  LogOut,
  Send,
  Settings,
  Info,
  X,
  Paperclip,
  Mic,
  Camera,
  ThumbsUp,
  Check,
} from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"

interface Message {
  id: string
  content: string
  sender: "doctor" | "patient"
  timestamp: Date
  status?: "sent" | "delivered" | "read"
  isTyping?: boolean
}

interface Appointment {
  _id: string
  doctorId: string
  date: string
  time: string
  status: "pending" | "accepted" | "rejected"
  doctorName?: string
}

interface Report {
  id: number
  title: string
  date: string
  status: string
  icon?: string
}

interface Medication {
  id: number
  name: string
  dosage: string
  frequency: string
  refillDate: string
  progress: number
  color?: string
}

// Add AgentForce session interface
interface AgentForceSession {
  sessionId: string;
  externalSessionKey: string;
  accessToken: string;
}

export default function PatientDashboard() {
  const { data: session } = useSession()
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>([
    { id: "1", content: "Hello! How can I help you today?", sender: "doctor", timestamp: new Date(), status: "read" },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [activePanel, setActivePanel] = useState<string | null>(null)
  const [showAttachmentOptions, setShowAttachmentOptions] = useState(false)
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null)
  const [agentForceSession, setAgentForceSession] = useState<AgentForceSession | null>(null)
  const [quickResponses] = useState([
    "How do I take my medication?",
    "I need to reschedule my appointment",
    "What are my test results?",
    "I'm experiencing side effects",
  ])

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const profileMenuRef = useRef<HTMLDivElement>(null)
  const chatInputRef = useRef<HTMLInputElement>(null)
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)

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

  // Add animations and styling
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
    
    @keyframes slideUp {
      from {
        transform: translateY(100%);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }
    
    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }
    
    @keyframes bounce {
      0%, 100% {
        transform: translateY(0);
      }
      50% {
        transform: translateY(-5px);
      }
    }
    
    .message-bubble-in {
      animation: fadeIn 0.3s ease-out forwards;
    }
    
    .panel-slide-up {
      animation: slideUp 0.4s ease-out forwards;
    }
    
    .pulse-effect {
      animation: pulse 2s infinite;
    }
    
    .bounce-effect {
      animation: bounce 1s infinite;
    }
  `
    document.head.appendChild(style)
    return () => {
      document.head.removeChild(style)
    }
  }, [])

  // Handle typing indicator
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)

    // Clear previous timeout
    if (typingTimeout) {
      clearTimeout(typingTimeout)
    }

    // If we have a non-empty input, show typing indicator
    if (e.target.value.trim()) {
      const timeout = setTimeout(() => {
        // Hide typing indicator after 2 seconds
      }, 2000)
      setTypingTimeout(timeout)
    }
  }

  // Initialize AgentForce session
  useEffect(() => {
    const initializeAgentForceSession = async () => {
      try {
        const response = await fetch('/api/agentforce/session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to initialize AgentForce session');
        }

        const data = await response.json();
        setAgentForceSession(data);
      } catch (error) {
        console.error('Error initializing AgentForce session:', error);
      }
    };

    initializeAgentForceSession();
  }, []);

  // Handle chat submission with AgentForce
  const handleChatSubmit = async (e: React.FormEvent | null, quickResponse?: string) => {
    if (e) e.preventDefault();

    const messageText = quickResponse || input.trim();
    if (!messageText || !agentForceSession) return;

    // Add user message
    const newUserMessage: Message = {
      id: Date.now().toString(),
      content: messageText,
      sender: "patient",
      timestamp: new Date(),
      status: "sent",
    };
    setMessages((prevMessages) => [...prevMessages, newUserMessage]);
    setInput("");
    setIsLoading(true);

    // Update message status after a short delay
    setTimeout(() => {
      setMessages((prevMessages) =>
        prevMessages.map((msg) => (msg.id === newUserMessage.id ? { ...msg, status: "delivered" } : msg)),
      );
    }, 500);

    // Show typing indicator
    const typingMessage: Message = {
      id: (Date.now() + 1).toString(),
      content: "",
      sender: "doctor",
      timestamp: new Date(),
      isTyping: true,
    };
    setMessages((prevMessages) => [...prevMessages, typingMessage]);

    try {
      // Send message to AgentForce through our API
      const response = await fetch('/api/agentforce/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId: agentForceSession.sessionId,
          message: messageText,
          accessToken: agentForceSession.accessToken,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message to AgentForce');
      }

      const data = await response.json();
      console.log('Backend API Response:', JSON.stringify(data, null, 2));
      
      // Remove typing indicator
      setMessages((prevMessages) => prevMessages.filter((msg) => !msg.isTyping));

      // Add AgentForce response
      const responseText = data?.messages?.[0]?.message || 
                          "I'm sorry, I couldn't process your request. Please try again.";
      
      const newAssistantMessage: Message = {
        id: (Date.now() + 2).toString(),
        content: responseText,
        sender: "doctor",
        timestamp: new Date(),
        status: "read",
      };
      setMessages((prevMessages) => [...prevMessages, newAssistantMessage]);
    } catch (error) {
      console.error('Error sending message to AgentForce:', error);
      // Remove typing indicator and show error message
      setMessages((prevMessages) => prevMessages.filter((msg) => !msg.isTyping));
      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        content: "Sorry, I'm having trouble connecting to the medical assistant. Please try again later.",
        sender: "doctor",
        timestamp: new Date(),
        status: "read",
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
      chatInputRef.current?.focus();
    }
  };

  // Toggle profile menu
  const toggleProfileMenu = () => {
    setShowProfileMenu(!showProfileMenu)
  }

  // Handle panel toggle
  const togglePanel = (panelName: string) => {
    if (activePanel === panelName) {
      setActivePanel(null)
    } else {
      setActivePanel(panelName)
    }
  }

  // Toggle attachment options
  const toggleAttachmentOptions = () => {
    setShowAttachmentOptions(!showAttachmentOptions)
  }


  const recentReports: Report[] = [
    {
      id: 1,
      title: "Blood Test Results",
      date: "April 28, 2024",
      status: "Reviewed",
      icon: "activity",
    },
    {
      id: 2,
      title: "MRI Scan Report",
      date: "April 15, 2024",
      status: "Pending Review",
      icon: "fileText",
    },
  ]

  const medications: Medication[] = [
    {
      id: 1,
      name: "Lisinopril",
      dosage: "10mg",
      frequency: "Once daily",
      refillDate: "May 30, 2024",
      progress: 70,
      color: "#0d9488",
    },
    {
      id: 2,
      name: "Metformin",
      dosage: "500mg",
      frequency: "Twice daily",
      refillDate: "June 15, 2024",
      progress: 85,
      color: "#0891b2",
    },
    {
      id: 3,
      name: "Atorvastatin",
      dosage: "20mg",
      frequency: "Once daily",
      refillDate: "June 5, 2024",
      progress: 60,
      color: "#0c4a6e",
    },
  ]

  // Get message status icon
  const getMessageStatusIcon = (status: string | undefined) => {
    switch (status) {
      case "sent":
        return <Clock className="h-3 w-3 text-gray-400" />
      case "delivered":
        return <Check className="h-3 w-3 text-gray-400" />
      case "read":
        return <Check className="h-3 w-3 text-blue-500" />
      default:
        return null
    }
  }

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await fetch(`/api/patient/appointments/${session?.user?.id}`)
        if (!response.ok) throw new Error("Failed to fetch appointments")
        const data = await response.json()
        setAppointments(data)
      } catch (error) {
        console.error("Error fetching appointments:", error)
      } finally {
        setLoading(false)
      }
    }

    if (session?.user?.id) {
      fetchAppointments()
    }
  }, [session?.user?.id])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "accepted":
        return "text-green-600 bg-green-50"
      case "rejected":
        return "text-red-600 bg-red-50"
      default:
        return "text-yellow-600 bg-yellow-50"
    }
  }

  const handleMessageClick = (doctorId: string) => {
    if (session?.user?.id) {
      router.push(`/chat/${doctorId}/${session.user.id}`)
    }
  }

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
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full opacity-5"
            style={{
              width: `${30 + Math.random() * 100}px`,
              height: `${30 + Math.random() * 100}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background:
                i % 3 === 0
                  ? "rgba(13, 148, 136, 0.8)"
                  : i % 3 === 1
                    ? "rgba(8, 145, 178, 0.8)"
                    : "rgba(12, 74, 110, 0.8)",
              animation: `float ${5 + Math.random() * 10}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
          {/* Dashboard Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden h-[calc(100vh-12rem)] flex flex-col border border-gray-100">
              {/* Chat Header */}
              <div className="bg-gradient-to-r from-teal-600 to-cyan-600 p-4 text-white flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="h-10 w-10 bg-white/20 rounded-full p-2 flex items-center justify-center">
                      <MessageCircle className="h-5 w-5" />
                    </div>
                    <span className="absolute bottom-0 right-0 h-3 w-3 bg-green-400 rounded-full border-2 border-teal-600"></span>
                  </div>
                  <div>
                    <h3 className="font-medium text-lg">Medical Assistant</h3>
                    <div className="flex items-center text-xs opacity-90">
                      <span className="h-2 w-2 bg-green-300 rounded-full mr-1 animate-pulse"></span>
                      Online • Powered by AgentForce
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                    <Info className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 p-4 overflow-y-auto bg-gray-50 bg-opacity-50">
                <div className="space-y-4">
                  {/* Date Divider */}
                  <div className="flex items-center justify-center my-4">
                    <div className="bg-gray-200 h-px flex-grow"></div>
                    <span className="px-3 text-xs text-gray-500 font-medium">Today</span>
                    <div className="bg-gray-200 h-px flex-grow"></div>
                  </div>

                  {messages.map((message) =>
                    message.isTyping ? (
                      <div key={message.id} className="flex justify-start message-bubble-in">
                        <div className="max-w-[80%] rounded-2xl p-4 bg-white border border-gray-200 shadow-sm">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-teal-500 flex items-center justify-center text-white">
                              <span className="text-xs font-bold">Dr</span>
                            </div>
                            <span className="font-medium text-sm">Doctor</span>
                          </div>
                          <div className="flex space-x-2">
                            <div className="h-2 w-2 rounded-full bg-teal-500 animate-bounce"></div>
                            <div
                              className="h-2 w-2 rounded-full bg-teal-500 animate-bounce"
                              style={{ animationDelay: "0.2s" }}
                            ></div>
                            <div
                              className="h-2 w-2 rounded-full bg-teal-500 animate-bounce"
                              style={{ animationDelay: "0.4s" }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div
                        key={message.id}
                        className={`flex ${message.sender === "patient" ? "justify-end" : "justify-start"} message-bubble-in`}
                      >
                        <div
                          className={`max-w-[80%] rounded-2xl p-4 ${
                            message.sender === "patient"
                              ? "bg-gradient-to-r from-teal-600 to-teal-500 text-white shadow-md"
                              : "bg-white border border-gray-200 text-gray-800 shadow-sm"
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            {message.sender === "patient" ? (
                              <div className="h-8 w-8 rounded-full bg-teal-100 flex items-center justify-center overflow-hidden">
                                <span className="text-xs font-bold text-teal-800">
                                  {session?.user?.name?.charAt(0) || "Y"}
                                </span>
                              </div>
                            ) : (
                              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-teal-500 flex items-center justify-center text-white">
                                <span className="text-xs font-bold">Dr</span>
                              </div>
                            )}
                            <span className="font-medium text-sm">
                              {message.sender === "patient" ? "You" : "Doctor"}
                            </span>
                            <span
                              className={`text-xs ml-auto flex items-center gap-1 ${message.sender === "patient" ? "text-teal-100" : "text-gray-500"}`}
                            >
                              <Clock className="w-3 h-3" />
                              {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            </span>
                          </div>
                          <p className="mb-1">{message.content}</p>
                          {message.sender === "patient" && (
                            <div className="flex justify-end mt-1">{getMessageStatusIcon(message.status)}</div>
                          )}
                          {message.sender === "doctor" && (
                            <div className="flex justify-end mt-2 space-x-2">
                              <button className="text-xs text-teal-600 bg-teal-50 px-2 py-1 rounded-full flex items-center hover:bg-teal-100 transition-colors">
                                <ThumbsUp className="w-3 h-3 mr-1" />
                                Helpful
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ),
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </div>

              {/* Quick Responses */}
              <div className="bg-gray-50 px-4 py-2 flex gap-2 overflow-x-auto">
                {quickResponses.map((response, index) => (
                  <button
                    key={index}
                    onClick={() => handleChatSubmit(null, response)}
                    className="whitespace-nowrap bg-white text-sm text-gray-700 px-3 py-1.5 rounded-full border border-gray-200 hover:bg-gray-100 transition-colors"
                  >
                    {response}
                  </button>
                ))}
              </div>

              {/* Chat Input */}
              <form onSubmit={handleChatSubmit} className="p-4 border-t border-gray-200 bg-white relative">
                <div className="flex gap-2 items-center">
                  <button
                    type="button"
                    onClick={toggleAttachmentOptions}
                    className="p-2 text-gray-500 hover:text-teal-600 hover:bg-gray-100 rounded-full"
                  >
                    <Paperclip className="h-5 w-5" />
                  </button>

                  <input
                    ref={chatInputRef}
                    type="text"
                    value={input}
                    onChange={handleInputChange}
                    placeholder="Type your message..."
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-gray-50"
                    disabled={isLoading}
                  />

                  <button
                    type="button"
                    className="p-2 text-gray-500 hover:text-teal-600 hover:bg-gray-100 rounded-full"
                  >
                    <Mic className="h-5 w-5" />
                  </button>

                  <button
                    type="submit"
                    className="rounded-full bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white p-3 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md"
                    disabled={isLoading || !input.trim()}
                  >
                    <Send className="h-5 w-5" />
                  </button>
                </div>

                {/* Attachment Options */}
                {showAttachmentOptions && (
                  <div className="absolute bottom-full left-4 mb-2 bg-white rounded-lg shadow-lg p-2 border border-gray-200 z-10 panel-slide-up">
                    <div className="flex gap-2">
                      <button className="p-3 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors flex flex-col items-center">
                        <FileText className="h-5 w-5" />
                        <span className="text-xs mt-1">Document</span>
                      </button>
                      <button className="p-3 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition-colors flex flex-col items-center">
                        <Camera className="h-5 w-5" />
                        <span className="text-xs mt-1">Photo</span>
                      </button>
                      <button className="p-3 rounded-lg bg-purple-50 text-purple-600 hover:bg-purple-100 transition-colors flex flex-col items-center">
                        <Activity className="h-5 w-5" />
                        <span className="text-xs mt-1">Vitals</span>
                      </button>
                    </div>
                  </div>
                )}

                <div className="text-xs text-gray-500 mt-2 text-center">
                  <span className="flex items-center justify-center">
                    <span className="inline-block w-1 h-1 rounded-full bg-green-500 mr-1 pulse-effect"></span>
                    Your messages are secure and encrypted
                  </span>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-teal-600 to-cyan-600 border-t rounded-full border-gray-200 shadow-lg mx-auto max-w-4xl m-3 z-30">
        <div className="container mx-auto">
          <div className="flex justify-around items-center py-2">
            <button
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-full ${
                activePanel === "dashboard"
                  ? "text-teal-700 bg-teal-50"
                  : "text-gray-200 hover:bg-gray-50 hover:text-teal-700"
              } transition-colors`}
              onClick={() => togglePanel("dashboard")}
            >
              <Activity className="h-5 w-5" />
              <span className="text-xs font-medium">Dashboard</span>
            </button>
            <button
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-full ${
                activePanel === "appointments"
                  ? "text-teal-700 bg-teal-50"
                  : "text-gray-200 hover:bg-gray-50 hover:text-teal-700"
              } transition-colors`}
              onClick={() => togglePanel("appointments")}
            >
              <CalendarIcon className="h-5 w-5" />
              <span className="text-xs">Appointments</span>
            </button>
            <button
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-full ${
                activePanel === "records"
                  ? "text-teal-700 bg-teal-50"
                  : "text-gray-200 hover:bg-gray-50 hover:text-teal-700"
              } transition-colors`}
              onClick={() => togglePanel("records")}
            >
              <FileTextIcon className="h-5 w-5" />
              <span className="text-xs">Records</span>
            </button>
            <button
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-full ${
                activePanel === "medications"
                  ? "text-teal-700 bg-teal-50"
                  : "text-gray-200 hover:bg-gray-50 hover:text-teal-700"
              } transition-colors`}
              onClick={() => togglePanel("medications")}
            >
              <Pill className="h-5 w-5" />
              <span className="text-xs">Medications</span>
            </button>
            <div className="relative" ref={profileMenuRef}>
              <button
                className={`flex flex-col items-center gap-1 px-4 py-2 rounded-full ${
                  showProfileMenu ? "text-teal-700 bg-teal-50" : "text-gray-200 hover:bg-gray-50 hover:text-teal-700"
                } transition-colors`}
                onClick={toggleProfileMenu}
              >
                <div className="h-5 w-5 rounded-full bg-teal-100 flex items-center justify-center overflow-hidden">
                  {session?.user?.image ? (
                    <Image
                      height={20}
                      width={20}
                      src={session.user.image || "/placeholder.svg"}
                      alt={session?.user?.name || "User"}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-teal-800 text-xs font-medium">{session?.user?.name?.charAt(0) || "U"}</span>
                  )}
                </div>
                <span className="text-xs">Profile</span>
              </button>

              {/* Dropdown Menu */}
              {showProfileMenu && (
                <div className="absolute bottom-full right-0 mb-2 w-56 bg-white rounded-xl shadow-xl py-1 z-20 border border-gray-200 panel-slide-up overflow-hidden">
                  <div className="px-4 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 text-white">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center text-teal-600">
                        <span className="text-md font-bold">{session?.user?.name?.charAt(0) || "U"}</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium">{session?.user?.name || "User"}</p>
                        <p className="text-xs opacity-80 truncate">{session?.user?.email || "user@example.com"}</p>
                      </div>
                    </div>
                  </div>
                  <a
                    href="#"
                    className="px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-3 border-b border-gray-100"
                  >
                    <User className="h-5 w-5 text-teal-600" />
                    <span>My Profile</span>
                  </a>
                  <a href="#" className="px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-3">
                    <Settings className="h-5 w-5 text-teal-600" />
                    <span>Settings & Privacy</span>
                  </a>
                  <button
                    onClick={() => signOut()}
                    className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 border-t border-gray-100"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Sliding Panels */}
      {activePanel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setActivePanel(null)}>
          <div
            className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl p-4 shadow-xl panel-slide-up max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">
                {activePanel === "dashboard" && "Health Dashboard"}
                {activePanel === "appointments" && "Your Appointments"}
                {activePanel === "records" && "Medical Records"}
                {activePanel === "medications" && "Medications"}
              </h2>
              <button className="p-2 hover:bg-gray-100 rounded-full" onClick={() => setActivePanel(null)}>
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            {/* Panel Content */}
            <div className="space-y-4">
              {activePanel === "dashboard" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                    <h3 className="font-medium text-gray-800 mb-2">Recent Activity</h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Activity className="h-4 w-4 text-teal-600" />
                        <span>Last checkup: 2 weeks ago</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Pill className="h-4 w-4 text-teal-600" />
                        <span>Medication adherence: 95%</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                    <h3 className="font-medium text-gray-800 mb-2">Health Metrics</h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Activity className="h-4 w-4 text-teal-600" />
                        <span>Blood Pressure: 120/80</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Activity className="h-4 w-4 text-teal-600" />
                        <span>Heart Rate: 72 bpm</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {activePanel === "appointments" && (
                <div className="space-y-4">
                  {loading ? (
                    <div className="animate-pulse space-y-3">
                      <div className="h-20 bg-gray-200 rounded w-full"></div>
                      <div className="h-20 bg-gray-200 rounded w-full"></div>
                    </div>
                  ) : appointments.length === 0 ? (
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 text-center">
                      <p className="text-gray-500">No appointments scheduled</p>
                      <button className="mt-2 px-4 py-2 bg-teal-600 text-white rounded-lg text-sm">
                        Schedule an Appointment
                      </button>
                    </div>
                  ) : (
                    appointments.map((appointment) => (
                      <div key={appointment._id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-teal-100 flex items-center justify-center">
                            <Calendar className="h-5 w-5 text-teal-600" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-800">{appointment.doctorName || "Doctor"}</h3>
                            <p
                              className={`text-sm px-2 py-0.5 rounded-full inline-block ${getStatusColor(appointment.status)}`}
                            >
                              {appointment.status}
                            </p>
                          </div>
                          {appointment.status === "accepted" && (
                            <button
                              onClick={() => handleMessageClick(appointment.doctorId)}
                              className="p-2 text-teal-600 hover:bg-teal-50 rounded-full transition-colors"
                            >
                              <MessageCircle className="h-5 w-5" />
                            </button>
                          )}
                        </div>
                        <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="h-4 w-4 text-teal-600" />
                          <span>
                            {new Date(appointment.date).toLocaleDateString()} at {appointment.time}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
              {activePanel === "records" && (
                <div className="space-y-4">
                  {recentReports.map((report) => (
                    <div key={report.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-teal-100 flex items-center justify-center">
                          <FileText className="h-5 w-5 text-teal-600" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-800">{report.title}</h3>
                          <p className="text-sm text-gray-600">{report.date}</p>
                        </div>
                        <span
                          className={`ml-auto px-2 py-1 rounded-full text-xs font-medium ${
                            report.status === "Reviewed"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {report.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {activePanel === "medications" && (
                <div className="space-y-4">
                  {medications.map((medication) => (
                    <div key={medication.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full" style={{ backgroundColor: medication.color + "20" }}>
                          <Pill className="h-5 w-5 m-2.5" style={{ color: medication.color }} />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-800">{medication.name}</h3>
                          <p className="text-sm text-gray-600">
                            {medication.dosage} - {medication.frequency}
                          </p>
                        </div>
                      </div>
                      <div className="mt-2">
                        <div className="flex justify-between text-sm text-gray-600 mb-1">
                          <span>Progress</span>
                          <span>{medication.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="h-2 rounded-full"
                            style={{
                              width: `${medication.progress}%`,
                              backgroundColor: medication.color,
                            }}
                          ></div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Next refill: {medication.refillDate}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

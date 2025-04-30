"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import { Clock, MessageCircle, Send, Paperclip, Mic, Check, Info, FileText, Camera, X } from "lucide-react"
import Image from "next/image"
import agentLogo from "../../public/agent-force-logo.png"

interface Message {
  id: string
  content: string
  sender: "agentforce" | "patient"
  timestamp: Date
  status?: "sent" | "delivered" | "read"
  isTyping?: boolean
}

interface AgentForceSession {
  sessionId: string
  externalSessionKey: string
  accessToken: string
}

// Define Speech Recognition types
interface SpeechRecognitionEvent {
  results: {
    [index: number]: {
      [index: number]: {
        transcript: string
        confidence: number
      }
    }
  }
}

interface SpeechRecognitionErrorEvent {
  error: string
  message?: string
}

// Slack Modal Component
const SlackModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [notificationSent, setNotificationSent] = useState(false)
  const [notificationError, setNotificationError] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen && !notificationSent) {
      sendSlackNotification()
    }
  }, [isOpen, notificationSent])

  const sendSlackNotification = async () => {
    try {
      const response = await fetch("/api/slack/notify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          patientName: "Ilan",
          doctorName: "Dr. Sarah Johnson (gastroenterologist)",
          appointmentTime: new Date().toLocaleString(),
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to send notification")
      }

      setNotificationSent(true)
      setNotificationError(null)
    } catch (error) {
      console.error("Error sending notification:", error)
      setNotificationError("Failed to send notification to the medical team")
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden panel-slide-up">
        <div className="bg-[#4A154B] p-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <svg viewBox="0 0 54 54" className="h-8 w-8">
              <path
                fill="#fff"
                d="M19.712.133a5.381 5.381 0 0 0-5.376 5.387 5.381 5.381 0 0 0 5.376 5.386h5.376V5.52A5.381 5.381 0 0 0 19.712.133m0 14.365H5.376A5.381 5.381 0 0 0 0 19.884a5.381 5.381 0 0 0 5.376 5.387h14.336a5.381 5.381 0 0 0 5.376-5.387 5.381 5.381 0 0 0-5.376-5.386"
              />
              <path
                fill="#fff"
                d="M53.76 19.884a5.381 5.381 0 0 0-5.376-5.386 5.381 5.381 0 0 0-5.376 5.386v5.387h5.376a5.381 5.381 0 0 0 5.376-5.387m-14.336 0V5.52A5.381 5.381 0 0 0 34.048.133a5.381 5.381 0 0 0-5.376 5.387v14.364a5.381 5.381 0 0 0 5.376 5.387 5.381 5.381 0 0 0 5.376-5.387"
              />
              <path
                fill="#fff"
                d="M34.048 54a5.381 5.381 0 0 0 5.376-5.387 5.381 5.381 0 0 0-5.376-5.386h-5.376v5.386A5.381 5.381 0 0 0 34.048 54m0-14.365h14.336a5.381 5.381 0 0 0 5.376-5.386 5.381 5.381 0 0 0-5.376-5.387H34.048a5.381 5.381 0 0 0-5.376 5.387 5.381 5.381 0 0 0 5.376 5.386"
              />
              <path
                fill="#fff"
                d="M0 34.249a5.381 5.381 0 0 0 5.376 5.386 5.381 5.381 0 0 0 5.376-5.386v-5.387H5.376A5.381 5.381 0 0 0 0 34.25m14.336-.001v14.364A5.381 5.381 0 0 0 19.712 54a5.381 5.381 0 0 0 5.376-5.387V34.25a5.381 5.381 0 0 0-5.376-5.387 5.381 5.381 0 0 0-5.376 5.387"
              />
            </svg>
            <h3 className="text-white font-bold text-lg">Appointment Confirmation</h3>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/10 rounded-full p-1">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex items-center justify-center">
            <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
              <Check className="h-6 w-6 text-green-600" />
            </div>
          </div>

          <div className="text-center space-y-2">
            <h4 className="text-xl font-semibold text-gray-900">Appointment Successfully Booked!</h4>
            <p className="text-gray-600">
              Your appointment has been scheduled with Dr. Sarah Johnson.
              {notificationSent && " The medical team has been notified."}
              {notificationError && <span className="text-red-500 block mt-2 text-sm">{notificationError}</span>}
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-sm text-gray-600">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4" />
                <span>You&apos;ll receive confirmation details shortly</span>
              </div>
              <div className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                <span>The doctor will review your case before the appointment</span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full bg-[#4A154B] text-white py-2 rounded-md hover:bg-[#3e1040] transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hello! How can I help you with your medical questions today?",
      sender: "agentforce",
      timestamp: new Date(),
      status: "read",
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showAttachmentOptions, setShowAttachmentOptions] = useState(false)
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null)
  const [agentForceSession, setAgentForceSession] = useState<AgentForceSession | null>(null)
  const [quickResponses] = useState([
    "How do I get a second opinion?",
    "What conditions do you specialize in?",
    "How much does a consultation cost?",
    "How long does the process take?",
  ])
  const [showSlackModal, setShowSlackModal] = useState(false)
  const [isListening, setIsListening] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatInputRef = useRef<HTMLInputElement>(null)

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

  // Handle voice input
  const toggleVoiceInput = () => {
    if (typeof window === "undefined") return

    // Browser compatibility check - using type assertion to avoid TypeScript errors
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition

    if (!SpeechRecognition) {
      console.warn("Speech recognition not supported in this browser")
      return
    }

    if (isListening) {
      // Stop listening
      setIsListening(false)
      return
    }

    try {
      const recognition = new SpeechRecognition()
      recognition.continuous = false
      recognition.interimResults = false
      recognition.lang = "en-US"

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = event.results[0][0].transcript
        setInput(transcript)
        setIsListening(false)
      }

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error("Speech recognition error", event.error)
        setIsListening(false)
      }

      recognition.onend = () => {
        setIsListening(false)
      }

      recognition.start()
      setIsListening(true)
    } catch (error) {
      console.error("Error initializing speech recognition:", error)
      setIsListening(false)
    }
  }

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

  // Toggle attachment options
  const toggleAttachmentOptions = () => {
    setShowAttachmentOptions(!showAttachmentOptions)
  }

  // Initialize AgentForce session
  useEffect(() => {
    const initializeAgentForceSession = async () => {
      try {
        const response = await fetch("/api/agentforce/session", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        })

        if (!response.ok) {
          throw new Error("Failed to initialize AgentForce session")
        }

        const data = await response.json()
        setAgentForceSession(data)
      } catch (error) {
        console.error("Error initializing AgentForce session:", error)
      }
    }

    initializeAgentForceSession()
  }, [])

  // Handle chat submission with AgentForce
  const handleChatSubmit = async (e: React.FormEvent | null, quickResponse?: string) => {
    if (e) e.preventDefault()

    const messageText = quickResponse || input.trim()
    if (!messageText || !agentForceSession) return

    // Add user message
    const newUserMessage: Message = {
      id: Date.now().toString(),
      content: messageText,
      sender: "patient",
      timestamp: new Date(),
      status: "sent",
    }
    setMessages((prevMessages) => [...prevMessages, newUserMessage])
    setInput("")
    setIsLoading(true)

    // Update message status after a short delay
    setTimeout(() => {
      setMessages((prevMessages) =>
        prevMessages.map((msg) => (msg.id === newUserMessage.id ? { ...msg, status: "delivered" } : msg)),
      )
    }, 500)

    // Show typing indicator
    const typingMessage: Message = {
      id: (Date.now() + 1).toString(),
      content: "",
      sender: "agentforce",
      timestamp: new Date(),
      isTyping: true,
    }
    setMessages((prevMessages) => [...prevMessages, typingMessage])

    try {
      // Send message to AgentForce through our API
      const response = await fetch("/api/agentforce/message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionId: agentForceSession.sessionId,
          message: messageText,
          accessToken: agentForceSession.accessToken,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to send message to AgentForce")
      }

      const data = await response.json()
      console.log("Backend API Response:", JSON.stringify(data, null, 2))

      // Remove typing indicator
      setMessages((prevMessages) => prevMessages.filter((msg) => !msg.isTyping))

      // Add AgentForce response
      const responseText =
        data?.messages?.[0]?.message || "I'm sorry, I couldn't process your request. Please try again."

      const newAssistantMessage: Message = {
        id: (Date.now() + 2).toString(),
        content: responseText,
        sender: "agentforce",
        timestamp: new Date(),
        status: "read",
      }
      setMessages((prevMessages) => [...prevMessages, newAssistantMessage])

      // Check if response contains "successfully scheduled" and show Slack modal
      if (responseText.toLowerCase().includes("successfully scheduled")) {
        setShowSlackModal(true)
      }
    } catch (error) {
      console.error("Error sending message to AgentForce:", error)
      // Remove typing indicator and show error message
      setMessages((prevMessages) => prevMessages.filter((msg) => !msg.isTyping))
      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        content: "Sorry, I'm having trouble connecting to the medical assistant. Please try again later.",
        sender: "agentforce",
        timestamp: new Date(),
        status: "read",
      }
      setMessages((prevMessages) => [...prevMessages, errorMessage])
    } finally {
      setIsLoading(false)
      chatInputRef.current?.focus()
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background gradient */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background: "linear-gradient(120deg, #0d9488, #0891b2, #0c4a6e)",
          backgroundSize: "400% 400%",
          animation: "gradient 15s ease infinite",
        }}
      />

      {/* Floating shapes */}
      <div className="absolute top-0 left-0 w-full h-full -z-5 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full opacity-20"
            style={{
              width: `${30 + Math.random() * 100}px`,
              height: `${30 + Math.random() * 100}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: "rgba(255, 255, 255, 0.8)",
              animation: `float ${5 + Math.random() * 10}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      {/* Content container */}
      <div className="container mx-auto px-4 py-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-start gap-6">
          {/* Left column - Second Opinion branding */}
          <div className="w-full lg:w-1/2 space-y-6 flex flex-col">
            <div className="flex-1">
              <div className="inline-block px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs font-medium mb-2 animate-fade-in">
                Trusted by 10,000+ patients worldwide
              </div>

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight animate-fade-in delay-100">
                Get Expert{" "}
                <span className="relative">
                  <span className="relative z-10">Medical</span>
                  <span className="absolute bottom-2 left-0 w-full h-2 bg-cyan-300/30 -z-0 rounded-lg"></span>
                </span>{" "}
                Second Opinions
              </h1>

              <p className="text-lg text-cyan-50 max-w-xl animate-fade-in delay-200 mb-4">
                Connect with world-class specialists and get trusted second opinions on your diagnosis within 48 hours.
              </p>
            </div>

            {/* GIF below branding */}
            <div className="relative mt-6 animate-fade-in delay-300 max-w-md mx-auto lg:mx-0">
              {/* Decorative elements */}
              <div className="absolute -top-4 -left-4 w-16 h-16 bg-cyan-300/30 rounded-full blur-xl"></div>
              <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-teal-500/30 rounded-full blur-xl"></div>

              {/* Video/GIF container */}
              <div className="relative z-10 rounded-xl overflow-hidden border-2 border-white/20 shadow-2xl">
                <video
                  className="w-full h-auto max-h-[300px] object-cover"
                  src="/video/landing.mp4"
                  autoPlay
                  muted
                  loop
                  playsInline
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-teal-900/20 to-transparent pointer-events-none"></div>
              </div>
            </div>
          </div>

          {/* Right column - Chatbot interface */}
          <div className="w-full lg:w-1/2 animate-fade-in delay-300">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden h-[calc(100vh-12rem)] max-h-[600px] flex flex-col border border-gray-100">
              {/* Chat Header */}
              <div className="bg-gradient-to-r from-teal-600 to-cyan-600 p-3 text-white flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <div className="h-8 w-8 bg-white/20 rounded-full p-2 flex items-center justify-center">
                      <MessageCircle className="h-4 w-4" />
                    </div>
                    <span className="absolute bottom-0 right-0 h-2 w-2 bg-green-400 rounded-full border-2 border-teal-600"></span>
                  </div>
                  <div>
                    <h3 className="font-medium text-base">Medical Assistant</h3>
                    <div className="flex items-center text-xs opacity-90">
                      <span className="h-1.5 w-1.5 bg-green-300 rounded-full mr-1 animate-pulse"></span>
                      Online • Second Opinion Specialist
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
                          className={`max-w-[80%] rounded-2xl p-4 ${message.sender === "patient" ? "bg-teal-100 text-right" : "bg-white border border-gray-200"} shadow-sm`}
                        >
                          {message.sender === "agentforce" && (
                            <div className="flex items-center gap-2 mb-2">
                              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-teal-500 flex items-center justify-center text-white">
                                <span className="text-xs font-bold">AF</span>
                              </div>
                              <span className="font-medium text-sm">AgentForce</span>
                            </div>
                          )}
                          <div>{message.content}</div>
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
              <form onSubmit={handleChatSubmit} className="p-3 border-t border-gray-200 bg-white relative">
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
                    className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-gray-50"
                    disabled={isLoading}
                  />

                  <button
                    type="button"
                    onClick={toggleVoiceInput}
                    className={`p-2 rounded-full transition-colors ${
                      isListening
                        ? "bg-red-100 text-red-600 animate-pulse"
                        : "text-gray-500 hover:text-teal-600 hover:bg-gray-100"
                    }`}
                  >
                    <Mic className="h-5 w-5" />
                    {isListening && <span className="sr-only">Listening...</span>}
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

            {/* Centered AgentForce branding */}
            <div className="mt-8 flex justify-center items-center">
              <div className="flex items-center gap-2">
                <p className="text-white/70 text-sm">Powered by</p>
                <Image
                  src={agentLogo || "/placeholder.svg"}
                  alt="agentforce"
                  width={60}
                  height={40}
                  className="h-8 w-32 object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fade-in animation styles */}
      <style jsx>{`
        .animate-fade-in {
          opacity: 0;
          transform: translateY(20px);
          animation: fadeIn 0.8s forwards;
        }

        .delay-100 {
          animation-delay: 0.1s;
        }
        .delay-200 {
          animation-delay: 0.2s;
        }
        .delay-300 {
          animation-delay: 0.3s;
        }
        .delay-400 {
          animation-delay: 0.4s;
        }

        @keyframes fadeIn {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
      {/* Slack Modal */}
      <SlackModal isOpen={showSlackModal} onClose={() => setShowSlackModal(false)} />
    </div>
  )
}

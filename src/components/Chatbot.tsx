"use client"

import { useState, useEffect, useRef } from "react"
import {
  MessageCircle,
  Clock,
  FileText,
  Activity,
  Info,
  X,
  Paperclip,
  Mic,
  Camera,
  ThumbsUp,
  Check,
  Send,
} from "lucide-react"

interface Message {
  id: string
  content: string
  sender: "doctor" | "patient"
  timestamp: Date
  status?: "sent" | "delivered" | "read"
  isTyping?: boolean
}

// Add AgentForce session interface
interface AgentForceSession {
  sessionId: string;
  externalSessionKey: string;
  accessToken: string;
}

interface MedicalAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  userInitial?: string;
}

export default function MedicalAssistantModal({ 
  isOpen, 
  onClose, 
  userInitial = "U" 
}: MedicalAssistantModalProps) {
  const [messages, setMessages] = useState<Message[]>([
    { id: "1", content: "Hello! How can I help you today?", sender: "doctor", timestamp: new Date(), status: "read" },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
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
  const chatInputRef = useRef<HTMLInputElement>(null)
  const modalRef = useRef<HTMLDivElement>(null)

  // Initialize styles when the component mounts
  useEffect(() => {
    const style = document.createElement("style")
    style.innerHTML = `
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

    .modal-fade-in {
      animation: fadeIn 0.3s ease-out forwards;
    }
    
    .modal-slide-up {
      animation: slideUp 0.4s ease-out forwards;
    }
  `
    document.head.appendChild(style)
    return () => {
      document.head.removeChild(style)
    }
  }, [])

  // Close modal when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose()
      }
    }
    
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen, onClose])

  // Scroll to bottom of chat when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

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

    if (isOpen) {
      initializeAgentForceSession();
    }
  }, [isOpen]);

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

  // Toggle attachment options
  const toggleAttachmentOptions = () => {
    setShowAttachmentOptions(!showAttachmentOptions)
  }

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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 modal-fade-in">
      <div 
        ref={modalRef}
        className="bg-white rounded-xl shadow-xl w-full max-w-lg h-[80vh] flex flex-col modal-slide-up"
      >
        {/* Chat Header */}
        <div className="bg-gradient-to-r from-teal-600 to-cyan-600 p-4 text-white flex justify-between items-center rounded-t-xl">
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
            <button 
              onClick={onClose}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <X className="h-5 w-5" />
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
                            {userInitial}
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
        <form onSubmit={handleChatSubmit} className="p-4 border-t border-gray-200 bg-white relative rounded-b-xl">
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
  )
}